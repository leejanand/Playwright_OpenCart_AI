import { expect, test } from "@playwright/test";
import dotenv from "dotenv";
import { Routes } from "../../api/endpoints/routes";
import { RandomDataUtil } from "../../utils/dataGenerator";

dotenv.config({override: true});

test.describe("FakeStore Carts API Tests", () => {
  // ---------------------------------------------------------
  // Configuration
  // ---------------------------------------------------------

  const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
  const CART_ID = Number(process.env.CART_ID);
  const USER_ID = Number(process.env.USER_ID);
  const LIMIT = Number(process.env.LIMIT);
  const START_DATE = process.env.START_DATE || "";
  const END_DATE = process.env.END_DATE || "";

  // ---------------------------------------------------------
  // GET - Carts
  // ---------------------------------------------------------

  test("GET - All carts @master @sanity @api", async ({ request }) => {
    const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);
    expect(response.status(), "GET all carts should return HTTP 200").toBe(200);

    const carts = await response.json();
    expect(Array.isArray(carts), "The carts response should be an array").toBeTruthy();
    expect(carts.length, "The API should return at least one cart").toBeGreaterThan(0);
  });

  test("GET - Cart by ID @master @sanity @api", async ({ request }) => {
    const route = Routes.GET_CART_BY_ID.replace("{id}", String(CART_ID));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), "GET cart by ID should return HTTP 200").toBe(200);

    const cart = await response.json();
    expect(cart.id, "The returned cart ID should match the request").toBe(CART_ID);
  });

  test("GET - Carts by date range @master @regression @api", async ({ request }) => {
    expect(START_DATE, "START_DATE must be configured in .env").not.toBe("");
    expect(END_DATE, "END_DATE must be configured in .env").not.toBe("");

    const route = Routes.GET_CARTS_BY_DATE_RANGE
      .replace("{startdate}", encodeURIComponent(START_DATE))
      .replace("{enddate}", encodeURIComponent(END_DATE));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), "GET carts by date range should return HTTP 200").toBe(200);

    const carts = await response.json();
    expect(Array.isArray(carts), "The date-filtered carts response should be an array").toBeTruthy();

    const startTime = Date.parse(`${START_DATE}T00:00:00.000Z`);
    const endTime = Date.parse(`${END_DATE}T23:59:59.999Z`);
    for (const cart of carts) {
      const cartTime = Date.parse(cart.date);
      expect(
        cartTime >= startTime && cartTime <= endTime,
        `Cart ${cart.id} should fall within the requested date range`,
      ).toBeTruthy();
    }
  });

  test("GET - Carts by user @master @sanity @api", async ({ request }) => {
    const route = Routes.GET_USER_CART.replace("{userId}", String(USER_ID));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), "GET user carts should return HTTP 200").toBe(200);

    const carts = await response.json();
    expect(Array.isArray(carts), "The user carts response should be an array").toBeTruthy();
    for (const cart of carts) {
      expect(cart.userId, "Each cart should belong to the requested user").toBe(USER_ID);
    }
  });

  test("GET - Carts with limit @master @sanity @api", async ({ request }) => {
    const route = Routes.GET_CARTS_WITH_LIMIT.replace("{limit}", String(LIMIT));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), "GET carts with limit should return HTTP 200").toBe(200);

    const carts = await response.json();
    expect(Array.isArray(carts), "The limited carts response should be an array").toBeTruthy();
    expect(carts.length, "The number of carts should match the requested limit").toBe(LIMIT);
  });

  test("GET - Carts sorted ascending @master @regression @api", async ({ request }) => {
    const route = Routes.GET_CARTS_SORTED.replace("{order}", "asc");
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), "Ascending cart sort should return HTTP 200").toBe(200);

    const carts = await response.json();
    const cartIds = carts.map((cart: { id: number }) => cart.id);
    expect(cartIds, "Cart IDs should be in ascending order").toEqual(
      [...cartIds].sort((left: number, right: number) => left - right),
    );
  });

  test("GET - Carts sorted descending @master @regression @api", async ({ request }) => {
    const route = Routes.GET_CARTS_SORTED.replace("{order}", "desc");
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), "Descending cart sort should return HTTP 200").toBe(200);

    const carts = await response.json();
    const cartIds = carts.map((cart: { id: number }) => cart.id);
    expect(cartIds, "Cart IDs should be in descending order").toEqual(
      [...cartIds].sort((left: number, right: number) => right - left),
    );
  });

  // ---------------------------------------------------------
  // POST - Create Cart
  // ---------------------------------------------------------

  test("POST - Create cart @master @regression @api", async ({ request }) => {
    const payload = RandomDataUtil.generateCartPayload(USER_ID);
    const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });
    expect(response.status(), "Creating a cart should return HTTP 201").toBe(201);

    const created = await response.json();
    expect(created.id, "The created cart should include an ID").toEqual(expect.any(Number));
    expect(created.userId).toBe(payload.userId);
    expect(created.products).toEqual(payload.products);
  });

  // ---------------------------------------------------------
  // PUT - Update Cart
  // ---------------------------------------------------------

  test("PUT - Update cart @master @regression @api", async ({ request }) => {
    const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
    const route = Routes.UPDATE_CART.replace("{id}", String(CART_ID));
    const response = await request.put(`${BASE_URL}${route}`, { data: payload });
    expect(response.status(), "Updating a cart should return HTTP 200").toBe(200);

    const updated = await response.json();
    expect(updated.id, "The updated cart ID should match the request").toBe(CART_ID);
    expect(updated.userId).toBe(payload.userId);
    expect(updated.products).toEqual(payload.products);
  });

  // ---------------------------------------------------------
  // DELETE - Cart
  // ---------------------------------------------------------

  test("DELETE - Cart @master @regression @api", async ({ request }) => {
    const route = Routes.DELETE_CART.replace("{id}", String(CART_ID));
    const response = await request.delete(`${BASE_URL}${route}`);
    expect(response.status(), "Deleting a cart should return HTTP 200").toBe(200);

    const deleted = await response.json();
    expect(deleted.id, "The deleted cart response should identify the requested cart").toBe(CART_ID);
  });
});
