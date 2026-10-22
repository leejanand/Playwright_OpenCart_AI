import { expect, test } from "@playwright/test";
import dotenv from "dotenv";
import { Routes } from "../../api/endpoints/routes";
import { RandomDataUtil } from "../../utils/dataGenerator";

dotenv.config({override: true});

test.describe("FakeStore Users API Tests", () => {
  // ---------------------------------------------------------
  // Configuration
  // ---------------------------------------------------------

  const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
  const USER_ID = Number(process.env.USER_ID);
  const LIMIT = Number(process.env.LIMIT);

  // ---------------------------------------------------------
  // GET - Users
  // ---------------------------------------------------------

  test("GET - All users @master @sanity @api", async ({ request }) => {
    const response = await request.get(`${BASE_URL}${Routes.GET_ALL_USERS}`);
    expect(response.status(), "GET all users should return HTTP 200").toBe(200);

    const users = await response.json();
    expect(Array.isArray(users), "The users response should be an array").toBeTruthy();
    expect(users.length, "The API should return at least one user").toBeGreaterThan(0);
  });

  test("GET - User by ID @master @sanity @api", async ({ request }) => {
    const route = Routes.GET_USER_BY_ID.replace("{id}", String(USER_ID));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), "GET user by ID should return HTTP 200").toBe(200);

    const user = await response.json();
    expect(user.id, "The returned user ID should match the request").toBe(USER_ID);
  });

  test("GET - Users with limit @master @sanity @api", async ({ request }) => {
    const route = Routes.GET_USERS_WITH_LIMIT.replace("{limit}", String(LIMIT));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), "GET users with limit should return HTTP 200").toBe(200);

    const users = await response.json();
    expect(Array.isArray(users), "The limited users response should be an array").toBeTruthy();
    expect(users.length, "The number of users should match the requested limit").toBe(LIMIT);
  });

  test("GET - Users sorted ascending @master @regression @api", async ({ request }) => {
    const route = Routes.GET_USERS_SORTED.replace("{order}", "asc");
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), "Ascending user sort should return HTTP 200").toBe(200);

    const users = await response.json();
    const userIds = users.map((user: { id: number }) => user.id);
    expect(userIds, "User IDs should be in ascending order").toEqual(
      [...userIds].sort((left: number, right: number) => left - right),
    );
  });

  test("GET - Users sorted descending @master @regression @api", async ({ request }) => {
    const route = Routes.GET_USERS_SORTED.replace("{order}", "desc");
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), "Descending user sort should return HTTP 200").toBe(200);

    const users = await response.json();
    const userIds = users.map((user: { id: number }) => user.id);
    expect(userIds, "User IDs should be in descending order").toEqual(
      [...userIds].sort((left: number, right: number) => right - left),
    );
  });

  // ---------------------------------------------------------
  // POST - Create User
  // ---------------------------------------------------------

  test("POST - Create user @master @regression @api", async ({ request }) => {
    const payload = RandomDataUtil.generateUserPayload();
    const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });
    expect(response.status(), "Creating a user should return HTTP 201").toBe(201);

    const created = await response.json();
    expect(created.id, "The created user should include an ID").toEqual(expect.any(Number));
  });

  // ---------------------------------------------------------
  // PUT - Update User
  // ---------------------------------------------------------

  test("PUT - Update user @master @regression @api", async ({ request }) => {
    const payload = RandomDataUtil.generateUserUpdatePayload();
    const route = Routes.UPDATE_USER.replace("{id}", String(USER_ID));
    const response = await request.put(`${BASE_URL}${route}`, { data: payload });
    expect(response.status(), "Updating a user should return HTTP 200").toBe(200);

    const updated = await response.json();
    expect(updated.email).toBe(payload.email);
    expect(updated.username).toBe(payload.username);
    expect(updated.name).toEqual(payload.name);
    expect(updated.address).toEqual(payload.address);
    expect(updated.phone).toBe(payload.phone);
  });

  // ---------------------------------------------------------
  // DELETE - User
  // ---------------------------------------------------------

  test("DELETE - User @master @regression @api", async ({ request }) => {
    const route = Routes.DELETE_USER.replace("{id}", String(USER_ID));
    const response = await request.delete(`${BASE_URL}${route}`);
    expect(response.status(), "Deleting a user should return HTTP 200").toBe(200);

    const deleted = await response.json();
    expect(deleted.id, "The deleted user response should identify the requested user").toBe(
      USER_ID,
    );
  });
});
