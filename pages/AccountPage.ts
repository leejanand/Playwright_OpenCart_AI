import type { Locator, Page } from "@playwright/test";
import { LogoutPage } from "./LogoutPage";

export class AccountPage {
  private readonly page: Page;

  // Locators
  private readonly accountHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountHeading = page
      .locator("#content")
      .getByRole("heading", { name: "My Account", exact: true });
  }

  /**
   * Checks whether the customer account dashboard is displayed.
   * @returns Promise<boolean> - true when the My Account heading is visible
   */
  async isMyAccountPageDisplayed(): Promise<boolean> {
    try {
      await this.accountHeading.waitFor({ state: "visible", timeout: 10000 });
      return true;
    } catch (error) {
      if (error instanceof Error && error.name === "TimeoutError") {
        return false;
      }
      throw error;
    }
  }

  /**
   * Logs out and opens the logout confirmation page.
   * @returns Promise<LogoutPage> - Logout confirmation page object
   */
  async logout(): Promise<LogoutPage> {
    await this.page.getByRole("link", { name: "Logout", exact: true }).first().click();
    await this.page.waitForURL(/route=account\/logout/);
    return new LogoutPage(this.page);
  }
}
