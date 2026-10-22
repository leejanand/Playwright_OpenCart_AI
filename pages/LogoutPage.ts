import type { Locator, Page } from "@playwright/test";
import { HomePage } from "./HomePage";

export class LogoutPage {
  private readonly page: Page;

  // Locators
  private readonly logoutHeading: Locator;
  private readonly continueLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.logoutHeading = page.getByRole("heading", { name: /Account Logout/ });
    this.continueLink = page.getByRole("link", { name: "Continue", exact: true });
  }

  /**
   * Checks whether OpenCart displays the logout confirmation.
   * @returns Promise<boolean> - true when the logout heading is visible
   */
  async isLogoutConfirmationDisplayed(): Promise<boolean> {
    return this.logoutHeading.isVisible();
  }

  /**
   * Continues from the logout confirmation to the home page.
   * @returns Promise<HomePage> - Home page object
   */
  async continueToHome(): Promise<HomePage> {
    await this.continueLink.click();
    await this.page.waitForURL(/route=common\/home/);
    return new HomePage(this.page);
  }
}
