import type { Locator, Page } from "@playwright/test";
import { ProductPage } from "./ProductPage";

export class HomePage {
  private readonly page: Page;

  // Locators
  private readonly accountMenu: Locator;
  private readonly searchField: Locator;
  private readonly featuredHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    const accountDropdown = page
      .locator('[role="button"][data-bs-toggle="dropdown"]')
      .filter({ hasText: "My Account" });
    this.accountMenu = accountDropdown
      .or(page.getByRole("link", { name: /My Account/ }).first())
      .first();
    this.searchField = page.getByRole("textbox", { name: "Search" });
    this.featuredHeading = page.getByRole("heading", { name: "Featured" });
  }

  /**
   * Opens the My Account navigation menu.
   */
  async clickMyAccount(): Promise<void> {
    await this.accountMenu.click();
  }

  /**
   * Opens the customer login page from My Account.
   */
  async clickLogin(): Promise<void> {
    await this.page.getByRole("link", { name: "Login", exact: true }).first().click();
    await this.page.waitForURL(/route=account\/login/);
  }

  /**
   * Opens the customer registration page from My Account.
   */
  async clickRegister(): Promise<void> {
    await this.page.getByRole("link", { name: "Register", exact: true }).first().click();
    await this.page.waitForURL(/route=account\/register/);
  }

  /**
   * Searches the product catalog.
   * @param productName - Product name or search phrase
   */
  async searchProduct(productName: string): Promise<void> {
    await this.searchField.fill(productName);
    await this.searchField.press("Enter");
    await this.page.waitForURL(/route=product\/search/);
  }

  /**
   * Opens a product from the current search results.
   * @param productName - Exact product name
   * @returns Promise<ProductPage> - Product details page object
   */
  async openProduct(productName: string): Promise<ProductPage> {
    await this.page.getByRole("link", { name: productName, exact: true }).first().click();
    await this.page.waitForURL(/route=product\/product/);
    return new ProductPage(this.page);
  }

  /**
   * Checks that product search results are displayed.
   * @returns Promise<boolean> - true when the search results route is open
   */
  async isSearchResultsPageDisplayed(): Promise<boolean> {
    return this.page.url().includes("route=product/search");
  }

  /**
   * Checks whether an exact product result is visible.
   * @param productName - Expected product name
   * @returns Promise<boolean> - true when the product result is visible
   */
  async isProductVisible(productName: string): Promise<boolean> {
    return this.page.getByRole("link", { name: productName, exact: true }).first().isVisible();
  }

  /**
   * Checks whether the home page is displayed.
   * @returns Promise<boolean> - true when the featured products section is visible
   */
  async isHomePageDisplayed(): Promise<boolean> {
    return this.featuredHeading.isVisible();
  }

  /**
   * Checks whether the guest account menu is available.
   * @returns Promise<boolean> - true when login and registration links are visible
   */
  async isGuestNavigationDisplayed(): Promise<boolean> {
    await this.accountMenu.click();
    const loginVisible = await this.page
      .getByRole("link", { name: "Login", exact: true })
      .first()
      .isVisible();
    const registerVisible = await this.page
      .getByRole("link", { name: "Register", exact: true })
      .first()
      .isVisible();
    const logoutVisible = await this.page
      .getByRole("link", { name: "Logout", exact: true })
      .isVisible();

    return loginVisible && registerVisible && !logoutVisible;
  }
}
