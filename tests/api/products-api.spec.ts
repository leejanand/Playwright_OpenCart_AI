import { expect, test } from "@playwright/test";
import dotenv from "dotenv";
import { Routes } from "../../api/endpoints/routes";
import { RandomDataUtil } from "../../utils/dataGenerator";

dotenv.config({override: true});

test.describe("FakeStore Products API Tests", () => {
  // ---------------------------------------------------------
  // Configuration
  // ---------------------------------------------------------

  const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
  const PRODUCT_ID = Number(process.env.PRODUCT_ID);
  const LIMIT = Number(process.env.LIMIT);

  // ---------------------------------------------------------
  // GET - Products
  // ---------------------------------------------------------

  test("GET - All products @master @sanity @api", async ({ request }) => {
    const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);
    expect(response.status(), "GET all products should return HTTP 200").toBe(200);

    const products = await response.json();
    expect(Array.isArray(products), "The products response should be an array").toBeTruthy();
    expect(products.length, "The API should return at least one product").toBeGreaterThan(0);

    for (const product of products) {
      expect(product.id, "Each product should have a numeric ID").toEqual(expect.any(Number));
      expect(product.title, "Each product should have a title").toEqual(expect.any(String));
      expect(product.price, "Each product should have a numeric price").toEqual(expect.any(Number));
      expect(product.category, "Each product should have a category").toEqual(expect.any(String));
      expect(product.image, "Each product should have an image URL").toEqual(expect.any(String));
    }
  });

  test("GET - Product by ID @master @sanity @api", async ({ request }) => {
    const route = Routes.GET_PRODUCT_BY_ID.replace("{id}", String(PRODUCT_ID));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), "GET product by ID should return HTTP 200").toBe(200);

    const product = await response.json();
    expect(product.id, "The returned product ID should match the request").toBe(PRODUCT_ID);
    expect(product.title).toEqual(expect.any(String));
    expect(product.price).toEqual(expect.any(Number));
    expect(product.category).toEqual(expect.any(String));
    expect(product.image).toEqual(expect.any(String));
  });

  test("GET - Products with limit @master @sanity @api", async ({ request }) => {
    const route = Routes.GET_PRODUCTS_WITH_LIMIT.replace("{limit}", String(LIMIT));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), "GET products with limit should return HTTP 200").toBe(200);

    const products = await response.json();
    expect(Array.isArray(products), "The limited products response should be an array").toBeTruthy();
    expect(products.length, "The number of products should match the requested limit").toBe(LIMIT);
  });

  test("GET - Products sorted ascending @master @regression @api", async ({ request }) => {
    const route = Routes.GET_PRODUCTS_SORTED.replace("{order}", "asc");
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), "Ascending product sort should return HTTP 200").toBe(200);

    const products = await response.json();
    const productIds = products.map((product: { id: number }) => product.id);
    expect(productIds, "Product IDs should be in ascending order").toEqual(
      [...productIds].sort((left: number, right: number) => left - right),
    );
  });

  test("GET - Products sorted descending @master @regression @api", async ({ request }) => {
    const route = Routes.GET_PRODUCTS_SORTED.replace("{order}", "desc");
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), "Descending product sort should return HTTP 200").toBe(200);

    const products = await response.json();
    const productIds = products.map((product: { id: number }) => product.id);
    expect(productIds, "Product IDs should be in descending order").toEqual(
      [...productIds].sort((left: number, right: number) => right - left),
    );
  });

  test("GET - All product categories @master @sanity @api", async ({ request }) => {
    const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);
    expect(response.status(), "GET product categories should return HTTP 200").toBe(200);

    const categories = await response.json();
    expect(Array.isArray(categories), "The categories response should be an array").toBeTruthy();
    expect(categories.length, "The API should return at least one category").toBeGreaterThan(0);
  });

  test("GET - Products by category @master @sanity @api", async ({ request }) => {
    const category = "electronics";
    const route = Routes.GET_PRODUCTS_BY_CATEGORY.replace(
      "{category}",
      encodeURIComponent(category),
    );
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), "GET products by category should return HTTP 200").toBe(200);

    const products = await response.json();
    expect(Array.isArray(products), "The category products response should be an array").toBeTruthy();
    for (const product of products) {
      expect(product.category, "Every returned product should match the requested category").toBe(
        category,
      );
    }
  });

  // ---------------------------------------------------------
  // POST - Create Product
  // ---------------------------------------------------------

  test("POST - Create product @master @regression @api", async ({ request }) => {
    const payload = RandomDataUtil.generateProductPayload();
    const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });
    expect(response.status(), "Creating a product should return HTTP 201").toBe(201);

    const created = await response.json();
    expect(created.id, "The created product should include an ID").toEqual(expect.any(Number));
    expect(created.title).toBe(payload.title);
    expect(created.price).toBe(payload.price);
    expect(created.description).toBe(payload.description);
    expect(created.category).toBe(payload.category);
    expect(created.image).toBe(payload.image);
  });

  // ---------------------------------------------------------
  // PUT - Update Product
  // ---------------------------------------------------------

  test("PUT - Update product @master @regression @api", async ({ request }) => {
    const payload = RandomDataUtil.generateUpdatedProductPayload();
    const route = Routes.UPDATE_PRODUCT.replace("{id}", String(PRODUCT_ID));
    const response = await request.put(`${BASE_URL}${route}`, { data: payload });
    expect(response.status(), "Updating a product should return HTTP 200").toBe(200);

    const updated = await response.json();
    expect(updated.id, "The updated product ID should match the request").toBe(PRODUCT_ID);
    expect(updated.title).toBe(payload.title);
    expect(updated.price).toBe(payload.price);
    expect(updated.description).toBe(payload.description);
    expect(updated.category).toBe(payload.category);
    expect(updated.image).toBe(payload.image);
  });

  // ---------------------------------------------------------
  // DELETE - Product
  // ---------------------------------------------------------

  test("DELETE - Product @master @regression @api", async ({ request }) => {
    const route = Routes.DELETE_PRODUCT.replace("{id}", String(PRODUCT_ID));
    const response = await request.delete(`${BASE_URL}${route}`);
    expect(response.status(), "Deleting a product should return HTTP 200").toBe(200);

    const deleted = await response.json();
    expect(deleted.id, "The deleted product response should identify the requested product").toBe(
      PRODUCT_ID,
    );
  });
});
