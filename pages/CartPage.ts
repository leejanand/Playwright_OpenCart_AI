import type { Locator, Page } from "@playwright/test";

export class CartPage {
  private readonly page: Page;

  // Locators
  private readonly cartHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.cartHeading = page.getByRole("heading", { name: /Shopping Cart/ });
  }

  /**
   * Checks whether the shopping cart page is displayed.
   * @returns Promise<boolean> - true when the cart heading is visible
   */
  async isCartPageDisplayed(): Promise<boolean> {
    return this.cartHeading.isVisible();
  }

  /**
   * Checks whether the requested product appears in the cart.
   * @param productName - Expected product name
   * @returns Promise<boolean> - true when the product row is visible
   */
  async isProductInCart(productName: string): Promise<boolean> {
    return this.productRow(productName).isVisible();
  }

  /**
   * Reads the quantity for a cart product.
   * @param productName - Product name in the cart
   * @returns Promise<string> - Displayed product quantity
   */
  async getProductQuantity(productName: string): Promise<string> {
    return this.productRow(productName).getByRole("textbox").inputValue();
  }

  /**
   * Reads a product's unit price from the cart.
   * @param productName - Product name in the cart
   * @returns Promise<string> - Displayed unit price
   */
  async getProductUnitPrice(productName: string): Promise<string> {
    return this.productRow(productName).getByRole("cell").nth(3).innerText();
  }

  /**
   * Reads a product's line total from the cart.
   * @param productName - Product name in the cart
   * @returns Promise<string> - Displayed line total
   */
  async getProductLineTotal(productName: string): Promise<string> {
    return this.productRow(productName).getByRole("cell").nth(4).innerText();
  }

  /**
   * Reads the complete cart total.
   * @returns Promise<string> - Displayed cart total
   */
  async getCartTotal(): Promise<string> {
    return this.page
      .getByRole("row", { name: /^Total/ })
      .getByRole("cell")
      .last()
      .innerText();
  }

  private productRow(productName: string): Locator {
    return this.page.getByRole("row", { name: new RegExp(productName) });
  }
}
