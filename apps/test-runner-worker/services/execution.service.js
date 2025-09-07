const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const apiService = require("./api.service");
const minioService = require("./minio.service");

class ExecutionService {
  constructor() {
    this.screenshotsDir = path.join(__dirname, "../screenshots");
  }

  async executeTestCase(jobData) {
    const { code, setupState, testCaseRunId } = jobData;
    const startTime = Date.now();
    let browser;

    try {
      browser = await this.launchBrowser();
      const page = await browser.newPage();

      // Apply setup state if provided
      if (setupState) {
        await this.applySetupState(page, setupState);
      }

      const results = await this.executeTestCommands(page, code, testCaseRunId);
      const duration = Date.now() - startTime;

      console.log("✅ Test completed successfully");
      return {
        success: true,
        results,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error("❌ Test failed:", error.message);

      const screenshotUrl = await this.captureErrorScreenshot(browser, testCaseRunId);
      return {
        success: false,
        error: error.message,
        screenshotUrl,
        duration,
      };
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  async launchBrowser() {
    return await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    });
  }

  async executeTestCommands(page, code, testCaseRunId) {
    const results = [];
    const lines = code.split("\n").filter((line) => line.trim());
    console.log(`📝 Processing ${lines.length} commands`);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const [command, ...args] = line.split(" ");

      console.log(`⚡ Step ${i + 1}: ${command}`);

      try {
        await this.executeCommand(page, command, args);
        const screenshotUrl = await this.captureScreenshot(page, i + 1, testCaseRunId);
        
        results.push({
          step: i + 1,
          command: line,
          screenshotUrl,
          status: "success",
        });
      } catch (error) {
        console.error(`❌ Step ${i + 1} failed:`, error.message);
        results.push({
          step: i + 1,
          command: line,
          status: "failed",
          error: error.message,
        });
        throw error;
      }
    }

    return results;
  }

  async executeCommand(page, command, args) {
    console.log(`Executing command: ${command} with args: ${args}`);
    switch (command) {
      case "goto":
        await page.goto(args.join(" ").replace(/"/g, ""));
        break;
      case "click":
        await page.click(args.join(" ").replace(/"/g, ""));
        break;
      case "type":
        await page.fill(
          args[0].replace(/"/g, ""),
          args.slice(1).join(" ").replace(/"/g, "")
        );
        break;
      case "wait":
        await page.waitForTimeout(parseInt(args[0]) || 1000);
        break;
      default:
        throw new Error(`Unknown command: ${command}`);
    }
  }

  async applySetupState(page, setupState) {
    if (setupState.cookies) {
      await page.context().addCookies(setupState.cookies);
    }

    if (setupState.localStorage) {
      await page.evaluate((localStorage) => {
        for (const [key, value] of Object.entries(localStorage)) {
          window.localStorage.setItem(key, value);
        }
      }, setupState.localStorage);
    }

    if (setupState.sessionStorage) {
      await page.evaluate((sessionStorage) => {
        for (const [key, value] of Object.entries(sessionStorage)) {
          window.sessionStorage.setItem(key, value);
        }
      }, setupState.sessionStorage);
    }

    if (setupState.url) {
      await page.goto(setupState.url);
    }
  }

  async captureScreenshot(page, stepNumber, testCaseRunId) {
    const screenshot = await page.screenshot({ type: "png" });
    const timestamp = Date.now();
    const filename = `test-case-${testCaseRunId}-step-${stepNumber}-${timestamp}.png`;
    
    // Upload directly to MinIO
    const uploadResult = await minioService.uploadScreenshot(screenshot, filename);
    
    // Also save locally for debugging (optional)
    const filepath = path.join(this.screenshotsDir, filename);
    fs.writeFileSync(filepath, screenshot);
    
    return uploadResult.url;
  }

  async captureErrorScreenshot(browser, testCaseRunId) {
    try {
      if (browser) {
        const pages = await browser.pages();
        if (pages.length > 0) {
          const screenshot = await pages[0].screenshot({ type: "png" });
          const timestamp = Date.now();
          const filename = `test-case-${testCaseRunId}-error-${timestamp}.png`;
          
          // Upload directly to MinIO
          const uploadResult = await minioService.uploadScreenshot(screenshot, filename);
          return uploadResult.url;
        }
      }
    } catch (error) {
      console.error("Failed to capture error screenshot:", error.message);
    }
    return null;
  }
}

module.exports = new ExecutionService();
