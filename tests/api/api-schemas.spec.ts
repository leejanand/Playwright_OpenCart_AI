import Ajv from "ajv";
import { expect, test } from "@playwright/test";
import dotenv from "dotenv";
import path from "node:path";
import { Routes } from "../../api/endpoints/routes";
import { DataProvider } from "../../utils/DataReader";

dotenv.config({override: true});

test.describe("FakeStore API Schema Tests", () => {
  // ---------------------------------------------------------
  // Configuration
  // ---------------------------------------------------------

  const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
  const PRODUCT_ID = Number(process.env.PRODUCT_ID);
  const USER_ID = Number(process.env.USER_ID);
  const CART_ID = Number(process.env.CART_ID);
  const ajv = new Ajv();

  // ---------------------------------------------------------
  // GET - Schema Validation
  // ---------------------------------------------------------

  test("GET - Validate product response schema @master @regression @api", async ({ request }) => {
    const route = Routes.GET_PRODUCT_BY_ID.replace("{id}", String(PRODUCT_ID));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), "GET product for schema validation should return HTTP 200").toBe(200);

    const product = await response.json();
    const schema = DataProvider.readJson(
      path.join(process.cwd(), "api", "schemas", "product_api_schema.json"),
    );
    const validate = ajv.compile(schema);
    const isValid = validate(product);
    expect(
      isValid,
      `Product response schema validation failed: ${ajv.errorsText(validate.errors)}`,
    ).toBeTruthy();
  });

  test("GET - Validate user response schema @master @regression @api", async ({ request }) => {
    const route = Routes.GET_USER_BY_ID.replace("{id}", String(USER_ID));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), "GET user for schema validation should return HTTP 200").toBe(200);

    const user = await response.json();
    const schema = DataProvider.readJson(
      path.join(process.cwd(), "api", "schemas", "user_api_schema.json"),
    );
    const validate = ajv.compile(schema);
    const isValid = validate(user);
    expect(
      isValid,
      `User response schema validation failed: ${ajv.errorsText(validate.errors)}`,
    ).toBeTruthy();
  });

  test("GET - Validate cart response schema @master @regression @api", async ({ request }) => {
    const route = Routes.GET_CART_BY_ID.replace("{id}", String(CART_ID));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), "GET cart for schema validation should return HTTP 200").toBe(200);

    const cart = await response.json();
    const schema = DataProvider.readJson(
      path.join(process.cwd(), "api", "schemas", "cart_api_schema.json"),
    );
    const validate = ajv.compile(schema);
    const isValid = validate(cart);
    expect(
      isValid,
      `Cart response schema validation failed: ${ajv.errorsText(validate.errors)}`,
    ).toBeTruthy();
  });
});
