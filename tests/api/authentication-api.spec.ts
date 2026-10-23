import { expect, test } from "@playwright/test";
import dotenv from "dotenv";
import process from "process";
import { Routes } from "../../api/endpoints/routes";
import { RandomDataUtil } from "../../utils/dataGenerator";

dotenv.config();

test.describe("FakeStore Authentication API Tests", () => {
  // ---------------------------------------------------------
  // Configuration
  // ---------------------------------------------------------

  const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
  const V_USERNAME = process.env.USERNAME || 'mor_2314';
  const V_PASSWORD = process.env.PASSWORD || '83r5^_';

  // ---------------------------------------------------------
  // POST - Authentication
  // ---------------------------------------------------------

  test("POST - Successful login @master @sanity @api", async ({ request }) => {
    
    const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
      data: { 
        username: V_USERNAME, 
        password: V_PASSWORD 
      },
    });

    expect(response.status(), "Valid credentials should return HTTP 201").toBe(201);
    console.log("API URL:", response.url());

    const body = await response.json();
    expect(body).toHaveProperty("token");
    expect(typeof body.token, "The authentication token should be a string").toBe("string");
    expect(body.token.length, "The authentication token should not be empty").toBeGreaterThan(0);
  });

  test("POST - Invalid login @master @regression @api", async ({ request }) => {
    const credentials = RandomDataUtil.generateInvalidLoginPayload();
    const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
      data: credentials,
    });

    expect(response.status(), "Invalid credentials should return HTTP 401").toBe(401);

    const message = await response.text();
    expect(message, "The API should describe the authentication failure").toBe(
      "username or password is incorrect",
    );
  });
});
