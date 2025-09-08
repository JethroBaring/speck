const MAIN_API_URL = process.env.MAIN_API_URL || "http://localhost:3000";

class ApiClient {
  constructor() {
    this.baseUrl = MAIN_API_URL;
  }

  async _request(path, { method = 'GET', body } = {}) {
    const url = `${this.baseUrl}/test-runner${path}`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      const message = data?.message || `Request failed: ${res.status} ${res.statusText}`;
      const err = new Error(message);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  }

  async notifyTestCaseStarted(testCaseRunId) {
    return this._request('/worker/test-case-started', {
      method: 'POST',
      body: { testCaseRunId },
    });
  }

  async updateTestCaseResult(testCaseRunId, result) {
    // result can include: status, duration, errorMessage, stackTrace, logs
    return this._request('/worker/test-case-completed', {
      method: 'PUT',
      body: {
        testCaseRunId,
        ...result,
      },
    });
  }

  async notifySetupCompleted(testSuiteRunId, cacheKey, setupData) {
    return this._request('/worker/setup-completed', {
      method: 'POST',
      body: { testSuiteRunId, cacheKey, setupData },
    });
  }

  async notifySetupFailed(testSuiteRunId, cacheKey, error) {
    return this._request('/worker/setup-failed', {
      method: 'POST',
      body: { testSuiteRunId, cacheKey, error },
    });
  }
}

module.exports = new ApiClient();
