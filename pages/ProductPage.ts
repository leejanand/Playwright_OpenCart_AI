import type { Locator, Page } from "@playwright/test";

export class ProductPage {
  private readonly page: Page;

  // Locators
  private readonly quantityField: Locator;
  private readonly addToCartButton: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.quantityField = page.locator('input[name="quantity"]');
    this.addToCartButton = page.getByRole("button", { name: "Add to Cart", exact: true });
    this.successMessage = page.getByText("Success: You have added", { exact: false });
  }

  /**
   * Checks whether the requested product details are displayed.
   * @param productName - Expected product name
   * @returns Promise<boolean> - true when the product heading is visible
   */
  async isProductDetailsDisplayed(productName: string): Promise<boolean> {
    return this.page
      .getByRole("heading", { name: productName, exact: true })
      .isVisible();
  }

  /**
   * Sets the product quantity.
   * @param quantity - Quantity to add
   */
  async setQuantity(quantity: string): Promise<void> {
    await this.quantityField.fill(quantity);
  }

  /**
   * Adds the product to the shopping cart.
   */
  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  /**
   * Checks whether OpenCart confirms the product was added.
   * @returns Promise<boolean> - true when the success message is visible
   */
  async isProductAddedDisplayed(): Promise<boolean> {
    await this.successMessage.waitFor({ state: "visible" });
    return true;
  }

  /**
   * Opens the shopping cart from the add-to-cart confirmation.
   */
  async openShoppingCart(): Promise<void> {
    await this.page.getByRole("link", { name: "shopping cart", exact: true }).click();
    await this.page.waitForURL(/route=checkout\/cart/);
  }
}
