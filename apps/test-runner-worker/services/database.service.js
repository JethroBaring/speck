class DatabaseService {
  constructor() {
    this.baseUrl = process.env.MAIN_API_URL || "http://localhost:3000";
  }

  async _request(path, { method = "GET", body } = {}) {
    const url = `${this.baseUrl}/test-runner${path}`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      const message =
        data?.message || `Request failed: ${res.status} ${res.statusText}`;
      const err = new Error(message);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  }

  async updateTestCaseStarted(testCaseRunId) {
    return this._request("/worker/test-case-started", {
      method: "POST",
      body: { testCaseRunId },
    });
  }

  async updateTestCaseCompleted(testCaseRunId, result) {
    return this._request("/worker/test-case-completed", {
      method: "PUT",
      body: {
        testCaseRunId,
        ...result,
      },
    });
  }
}

module.exports = new DatabaseService();
