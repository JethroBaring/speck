const MAIN_API_URL = process.env.MAIN_API_URL || "http://localhost:3000";

class ApiClient {
  constructor() {
    this.baseUrl = MAIN_API_URL;
  }

  async notifyTestCaseStarted(testCaseRunId) {
    // TODO: Implement
  }

  async updateTestCaseResult(testCaseRunId, result) {
    // TODO: Implement
  }

  async notifySetupCompleted(testSuiteRunId, cacheKey, setupData) {
    // TODO: Implement
  }

  async notifySetupFailed(testSuiteRunId, cacheKey, error) {
    // TODO: Implement
  }
}

module.exports = new ApiClient();
