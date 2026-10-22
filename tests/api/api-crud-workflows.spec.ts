import { expect, test } from "@playwright/test";
import dotenv from "dotenv";
import { Routes } from "../../api/endpoints/routes";
import { RandomDataUtil } from "../../utils/dataGenerator";

dotenv.config({override: true});

test.describe("FakeStore API CRUD Workflows", () => {
  // ---------------------------------------------------------
  // Configuration
  // ---------------------------------------------------------

  const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
  const USER_ID = Number(process.env.USER_ID);

  // ---------------------------------------------------------
  // Product - Create, Update, Delete
  // ---------------------------------------------------------

  test("Product create-update-delete workflow @master @regression @end-to-end @api", async ({
    request,
  }) => {
    const payload = RandomDataUtil.generateProductPayload();
    const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, {
      data: payload,
    });
    expect(createResponse.status(), "Product creation should return HTTP 201").toBe(201);

    const created = await createResponse.json();
    expect(created.id, "The created product should include an ID").toEqual(expect.any(Number));
    expect(created.title).toBe(payload.title);
    const productId: number = created.id;

    const updatePayload = RandomDataUtil.generateUpdatedProductPayload();
    const updateRoute = Routes.UPDATE_PRODUCT.replace("{id}", String(productId));
    const updateResponse = await request.put(`${BASE_URL}${updateRoute}`, {
      data: updatePayload,
    });
    expect(updateResponse.status(), "Product update should return HTTP 200").toBe(200);

    const updated = await updateResponse.json();
    expect(updated.id, "The updated product should keep its created ID").toBe(productId);
    expect(updated.title).toBe(updatePayload.title);
    expect(updated.price).toBe(updatePayload.price);

    const deleteRoute = Routes.DELETE_PRODUCT.replace("{id}", String(productId));
    const deleteResponse = await request.delete(`${BASE_URL}${deleteRoute}`);
    expect(deleteResponse.status(), "Product deletion should return HTTP 200").toBe(200);
  });

  // ---------------------------------------------------------
  // User - Create, Update, Delete
  // ---------------------------------------------------------

  test("User create-update-delete workflow @master @regression @end-to-end @api", async ({
    request,
  }) => {
    const payload = RandomDataUtil.generateUserPayload();
    const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, {
      data: payload,
    });
    expect(createResponse.status(), "User creation should return HTTP 201").toBe(201);

    const created = await createResponse.json();
    expect(created.id, "The created user should include an ID").toEqual(expect.any(Number));
    const userId: number = created.id;

    const updatePayload = RandomDataUtil.generateUserUpdatePayload();
    const updateRoute = Routes.UPDATE_USER.replace("{id}", String(userId));
    const updateResponse = await request.put(`${BASE_URL}${updateRoute}`, {
      data: updatePayload,
    });
    expect(updateResponse.status(), "User update should return HTTP 200").toBe(200);

    const updated = await updateResponse.json();
    expect(updated.email).toBe(updatePayload.email);
    expect(updated.username).toBe(updatePayload.username);

    const deleteRoute = Routes.DELETE_USER.replace("{id}", String(userId));
    const deleteResponse = await request.delete(`${BASE_URL}${deleteRoute}`);
    expect(deleteResponse.status(), "User deletion should return HTTP 200").toBe(200);
  });

  // ---------------------------------------------------------
  // Cart - Create, Update, Delete
  // ---------------------------------------------------------

  test("Cart create-update-delete workflow @master @regression @end-to-end @api", async ({
    request,
  }) => {
    const payload = RandomDataUtil.generateCartPayload(USER_ID);
    const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, {
      data: payload,
    });
    expect(createResponse.status(), "Cart creation should return HTTP 201").toBe(201);

    const created = await createResponse.json();
    expect(created.id, "The created cart should include an ID").toEqual(expect.any(Number));
    expect(created.userId).toBe(payload.userId);
    expect(created.products).toEqual(payload.products);
    const cartId: number = created.id;

    const updatePayload = RandomDataUtil.generateUpdatedCartPayload(created.userId);
    updatePayload.products[0].quantity = created.products[0].quantity + 1;
    const updateRoute = Routes.UPDATE_CART.replace("{id}", String(cartId));
    const updateResponse = await request.put(`${BASE_URL}${updateRoute}`, {
      data: updatePayload,
    });
    expect(updateResponse.status(), "Cart update should return HTTP 200").toBe(200);

    const updated = await updateResponse.json();
    expect(updated.id, "The updated cart should keep its created ID").toBe(cartId);
    expect(updated.products[0].quantity).toBe(updatePayload.products[0].quantity);

    const deleteRoute = Routes.DELETE_CART.replace("{id}", String(cartId));
    const deleteResponse = await request.delete(`${BASE_URL}${deleteRoute}`);
    expect(deleteResponse.status(), "Cart deletion should return HTTP 200").toBe(200);
  });
});
