# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\authentication-api.spec.ts >> FakeStore Authentication API Tests >> POST - Successful login @master @sanity @api
- Location: tests\api\authentication-api.spec.ts:22:7

# Error details

```
Error: Valid credentials should return HTTP 201

expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 401
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | import dotenv from "dotenv";
  3  | import process from "node:process";
  4  | import { Routes } from "../../api/endpoints/routes";
  5  | import { RandomDataUtil } from "../../utils/dataGenerator";
  6  | 
  7  | dotenv.config();
  8  | 
  9  | test.describe("FakeStore Authentication API Tests", () => {
  10 |   // ---------------------------------------------------------
  11 |   // Configuration
  12 |   // ---------------------------------------------------------
  13 | 
  14 |   const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
  15 |   const V_USERNAME = process.env.USERNAME || 'mor_2314';
  16 |   const V_PASSWORD = process.env.PASSWORD || '83r5^_';
  17 | 
  18 |   // ---------------------------------------------------------
  19 |   // POST - Authentication
  20 |   // ---------------------------------------------------------
  21 | 
  22 |   test("POST - Successful login @master @sanity @api", async ({ request }) => {
  23 |     
  24 |     const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
  25 |       data: { 
  26 |         username: V_USERNAME, 
  27 |         password: V_PASSWORD 
  28 |       },
  29 |     });
  30 | 
> 31 |     expect(response.status(), "Valid credentials should return HTTP 201").toBe(201);
     |                                                                           ^ Error: Valid credentials should return HTTP 201
  32 | 
  33 |     const body = await response.json();
  34 |     expect(body).toHaveProperty("token");
  35 |     expect(typeof body.token, "The authentication token should be a string").toBe("string");
  36 |     expect(body.token.length, "The authentication token should not be empty").toBeGreaterThan(0);
  37 |   });
  38 | 
  39 |   test("POST - Invalid login @master @regression @api", async ({ request }) => {
  40 |     const credentials = RandomDataUtil.generateInvalidLoginPayload();
  41 |     const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
  42 |       data: credentials,
  43 |     });
  44 | 
  45 |     expect(response.status(), "Invalid credentials should return HTTP 401").toBe(401);
  46 | 
  47 |     const message = await response.text();
  48 |     expect(message, "The API should describe the authentication failure").toBe(
  49 |       "username or password is incorrect",
  50 |     );
  51 |   });
  52 | });
  53 | 
```