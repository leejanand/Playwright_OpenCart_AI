import { test as base } from "@playwright/test";
import dotenv from "dotenv";
import process from "node:process";
import { AccountPage } from "../pages/AccountPage";
import { AdminCustomerPage } from "../pages/AdminCustomerPage";
import { CartPage } from "../pages/CartPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { LogoutPage } from "../pages/LogoutPage";
import { ProductPage } from "../pages/ProductPage";
import { RegisterPage } from "../pages/RegisterPage";

dotenv.config();

const appUrl = process.env.WEB_APP_URL || "http://localhost/opencart/upload/";

type PageFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  accountPage: AccountPage;
  logoutPage: LogoutPage;
  productPage: ProductPage;
  cartPage: CartPage;
  adminCustomerPage: AdminCustomerPage;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await page.goto(appUrl);
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
  logoutPage: async ({ page }, use) => {
    await use(new LogoutPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  adminCustomerPage: async ({ page }, use) => {
    await use(new AdminCustomerPage(page));
  },
});

test.afterEach(async ({ page, context }) => {
  if (!page.isClosed()) {
    await page.close();
  }
  await context.close();
});

export { expect } from "@playwright/test";
