#!/usr/bin/env node

/**
 * SFP Portal API - Simple Test Runner
 * This script can be used to test API endpoints programmatically
 *
 * Usage: node tests/test-runner.js
 *
 * Requirements:
 * - API running on http://localhost:5000
 * - Node.js installed
 * - fetch API available (Node 18+) or install node-fetch
 */

const API_URL = process.env.API_URL || "http://localhost:5000";

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

class APITester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: [],
    };
    this.token = null;
  }

  log(message, color = "reset") {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async makeRequest(method, endpoint, body = null, useToken = false) {
    const url = `${API_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
    };

    if (useToken && this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json().catch(() => ({}));
      return {
        status: response.status,
        data,
        ok: response.ok,
      };
    } catch (error) {
      return {
        status: 0,
        data: { error: error.message },
        ok: false,
      };
    }
  }

  async test(name, fn) {
    try {
      await fn();
      this.results.passed++;
      this.results.tests.push({ name, status: "PASS" });
      this.log(`✓ ${name}`, "green");
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name, status: "FAIL", error: error.message });
      this.log(`✗ ${name}: ${error.message}`, "red");
    }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  section(title) {
    this.log(`\n${"=".repeat(50)}`, "blue");
    this.log(title, "blue");
    this.log("=".repeat(50), "blue");
  }

  async run() {
    this.section("SFP Portal API Test Suite");

    await this.testHealth();
    await this.testAuthentication();
    await this.testAnimals();
    await this.testApplications();
    await this.testErrors();

    this.printSummary();
  }

  async testHealth() {
    this.section("System Tests");

    await this.test("Health Check", async () => {
      const response = await this.makeRequest("GET", "/api/health");
      this.assert(response.ok, "Health check failed");
      this.assert(response.status === 200, "Expected status 200");
      this.assert(response.data.status === "ok", "Expected status ok");
    });

    await this.test("Metrics Endpoint", async () => {
      const response = await this.makeRequest("GET", "/metrics");
      this.assert(response.ok, "Metrics endpoint failed");
      this.assert(response.status === 200, "Expected status 200");
    });
  }

  async testAuthentication() {
    this.section("Authentication Tests");

    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = "TestPassword123";

    await this.test("Register User", async () => {
      const response = await this.makeRequest("POST", "/api/auth/register", {
        email: testEmail,
        password: testPassword,
        first_name: "Test",
        last_name: "User",
        role: "VOLUNTEER",
      });
      this.assert(
        response.ok,
        `Registration failed: ${JSON.stringify(response.data)}`
      );
      this.assert(response.status === 201, "Expected status 201");
    });

    await this.test("Login User", async () => {
      const response = await this.makeRequest("POST", "/api/auth/login", {
        email: testEmail,
        password: testPassword,
      });
      this.assert(
        response.ok,
        `Login failed: ${JSON.stringify(response.data)}`
      );
      this.assert(response.data.token, "Expected token in response");
      this.token = response.data.token;
    });

    await this.test("Verify Token", async () => {
      const response = await this.makeRequest(
        "GET",
        "/api/auth/verify",
        null,
        true
      );
      this.assert(response.ok, "Token verification failed");
      this.assert(response.status === 200, "Expected status 200");
    });

    await this.test("Login with Invalid Password", async () => {
      const response = await this.makeRequest("POST", "/api/auth/login", {
        email: testEmail,
        password: "WrongPassword",
      });
      this.assert(response.status === 401, "Expected unauthorized status");
    });
  }

  async testAnimals() {
    this.section("Animals Endpoint Tests");

    await this.test("Get Available Animals (public)", async () => {
      const response = await this.makeRequest("GET", "/api/animals/available");
      this.assert(
        response.ok || response.status === 200,
        "Failed to get available animals"
      );
    });

    await this.test("Get All Animals (requires auth)", async () => {
      const response = await this.makeRequest(
        "GET",
        "/api/animals",
        null,
        true
      );
      this.assert(
        response.ok || response.status === 200,
        "Failed to get all animals"
      );
    });

    await this.test("Unauthorized Access (no token)", async () => {
      // Remove token temporarily
      const savedToken = this.token;
      this.token = null;
      const response = await this.makeRequest(
        "GET",
        "/api/animals",
        null,
        true
      );
      this.assert(
        response.status === 401,
        "Should reject request without token"
      );
      this.token = savedToken;
    });
  }

  async testApplications() {
    this.section("Applications Endpoint Tests");

    await this.test("Get Applications (requires auth)", async () => {
      const response = await this.makeRequest(
        "GET",
        "/api/applications",
        null,
        true
      );
      this.assert(
        response.status === 200 || response.status === 400,
        "Expected 200 or 400 status"
      );
    });
  }

  async testErrors() {
    this.section("Error Handling Tests");

    await this.test("Invalid Email Format", async () => {
      const response = await this.makeRequest("POST", "/api/auth/register", {
        email: "invalid-email",
        password: "Password123",
        first_name: "Test",
        last_name: "User",
        role: "VOLUNTEER",
      });
      this.assert(response.status === 400, "Should reject invalid email");
    });

    await this.test("Password Too Short", async () => {
      const response = await this.makeRequest("POST", "/api/auth/register", {
        email: `test-${Date.now()}@example.com`,
        password: "123",
        first_name: "Test",
        last_name: "User",
        role: "VOLUNTEER",
      });
      this.assert(response.status === 400, "Should reject short password");
    });

    await this.test("Missing Required Fields", async () => {
      const response = await this.makeRequest("POST", "/api/auth/register", {
        email: "test@example.com",
      });
      this.assert(response.status === 400, "Should reject missing fields");
    });
  }

  printSummary() {
    this.section("Test Summary");

    const total = this.results.passed + this.results.failed;
    const percentage =
      total > 0 ? ((this.results.passed / total) * 100).toFixed(2) : 0;

    this.log(`Total: ${total} tests`, "cyan");
    this.log(`Passed: ${this.results.passed}`, "green");
    this.log(
      `Failed: ${this.results.failed}`,
      this.results.failed > 0 ? "red" : "green"
    );
    this.log(
      `Success Rate: ${percentage}%`,
      percentage === 100 ? "green" : "yellow"
    );

    if (this.results.failed > 0) {
      this.log("\nFailed Tests:", "red");
      this.results.tests
        .filter((t) => t.status === "FAIL")
        .forEach((t) => {
          this.log(`  - ${t.name}: ${t.error}`, "red");
        });
    }

    process.exit(this.results.failed > 0 ? 1 : 0);
  }
}

// Check if API is running
async function checkAPI() {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}

// Main execution
(async () => {
  const isAPIRunning = await checkAPI();

  if (!isAPIRunning) {
    console.log(
      `${colors.red}Error: API is not running at ${API_URL}${colors.reset}`
    );
    console.log(
      `${colors.yellow}Start the API with: cd api && pnpm start${colors.reset}`
    );
    process.exit(1);
  }

  const tester = new APITester();
  await tester.run();
})();
