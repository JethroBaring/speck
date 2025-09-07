const { chromium } = require('playwright');
const apiService = require('./api.service');

class SetupService {
  constructor() {
    // Setup-specific configuration can be added here
  }

  async runSetup(jobData) {
    const { testSuiteRunId, cacheKey, setupSteps } = jobData;
    const startTime = Date.now();
    let browser;

    try {
      browser = await this.launchBrowser();
      const page = await browser.newPage();

      // Perform setup steps
      await this.performSetupSteps(page, setupSteps);

      // Capture setup state
      const setupState = await this.captureSetupState(page);

      // Cache setup data
      await this.cacheSetupData(cacheKey, setupState);

      // Notify completion
      await apiService.notifySetupCompleted(testSuiteRunId, cacheKey, setupState);

      const duration = Date.now() - startTime;
      console.log("✅ Setup completed successfully");
      return {
        success: true,
        setupState,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error("❌ Setup failed:", error.message);

      // Notify failure
      await apiService.notifySetupFailed(testSuiteRunId, cacheKey, error.message);

      return {
        success: false,
        error: error.message,
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

  async performSetupSteps(page, setupSteps) {
    if (!setupSteps || setupSteps.length === 0) {
      console.log("ℹ️ No setup steps to perform");
      return;
    }

    console.log(`📝 Performing ${setupSteps.length} setup steps`);

    for (let i = 0; i < setupSteps.length; i++) {
      const step = setupSteps[i];
      console.log(`⚡ Setup step ${i + 1}: ${step.type}`);

      await this.executeSetupStep(page, step);
    }
  }

  async executeSetupStep(page, step) {
    switch (step.type) {
      case "navigate":
        await page.goto(step.url);
        break;
      case "login":
        await this.performLoginSteps(page, step.loginData);
        break;
      case "wait":
        await page.waitForTimeout(step.duration || 1000);
        break;
      case "click":
        await page.click(step.selector);
        break;
      case "type":
        await page.fill(step.selector, step.value);
        break;
      default:
        throw new Error(`Unknown setup step type: ${step.type}`);
    }
  }

  async performLoginSteps(page, loginData) {
    // Navigate to login page
    if (loginData.loginUrl) {
      await page.goto(loginData.loginUrl);
    }

    // Fill credentials
    if (loginData.usernameSelector && loginData.username) {
      await page.fill(loginData.usernameSelector, loginData.username);
    }

    if (loginData.passwordSelector && loginData.password) {
      await page.fill(loginData.passwordSelector, loginData.password);
    }

    // Submit form
    if (loginData.submitSelector) {
      await page.click(loginData.submitSelector);
    }

    // Wait for success (you might want to wait for a specific element or URL)
    if (loginData.successIndicator) {
      await page.waitForSelector(loginData.successIndicator, { timeout: 10000 });
    }
  }

  async captureSetupState(page) {
    const [cookies, localStorage, sessionStorage, url] = await Promise.all([
      page.context().cookies(),
      page.evaluate(() => {
        const storage = {};
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          storage[key] = window.localStorage.getItem(key);
        }
        return storage;
      }),
      page.evaluate(() => {
        const storage = {};
        for (let i = 0; i < window.sessionStorage.length; i++) {
          const key = window.sessionStorage.key(i);
          storage[key] = window.sessionStorage.getItem(key);
        }
        return storage;
      }),
      page.url(),
    ]);

    return {
      cookies,
      localStorage,
      sessionStorage,
      url,
      timestamp: new Date().toISOString(),
    };
  }

  async cacheSetupData(cacheKey, setupData) {
    // This would typically store the setup data in Redis or another cache
    // For now, we'll just log it
    console.log(`💾 Caching setup data for key: ${cacheKey}`);
    // TODO: Implement actual caching mechanism
  }
}

module.exports = new SetupService();
