import type { Locator, Page } from "@playwright/test";

export class LoginPage {
  private readonly page: Page;

  // Locators
  private readonly emailField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;
  private readonly warningMessage: Locator;
  private readonly loginError: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.emailField = page.getByRole("textbox", { name: "E-Mail Address" });
    this.passwordField = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: "Login", exact: true });
    this.warningMessage = page.getByText(
      "Warning: No match for E-Mail Address and/or Password.",
      { exact: true },
    );
    this.loginError = page.locator(".alert");
  }

  /**
   * Submits customer credentials. Blank values remain untouched.
   * @param email - Customer email address
   * @param password - Customer password
   */
  async login(email: string, password: string): Promise<void> {
    try {
      if (email.trim()) {
        await this.emailField.fill(email);
      }
      if (password.trim()) {
        await this.passwordField.fill(password);
      }
      await this.loginButton.click();
    } catch (error) {
      console.error("Failed to submit the login form:", error);
      throw error;
    }
  }

  /**
   * Checks whether the login form is displayed.
   * @returns Promise<boolean> - true when the returning-customer form is visible
   */
  async isLoginPageDisplayed(): Promise<boolean> {
    return this.page.getByRole("heading", { name: "Returning Customer" }).isVisible();
  }

  /**
   * Checks whether the invalid-login warning is displayed.
   * @returns Promise<boolean> - true when OpenCart displays its login warning
   */
  async isLoginWarningDisplayed(): Promise<boolean> {
    try {
      await this.warningMessage.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch (error) {
      if (error instanceof Error && error.name === "TimeoutError") {
        return false;
      }
      throw error;
    }
  }

  /**
   * Checks whether OpenCart displays a login error, including a temporary lockout warning.
   * @returns Promise<boolean> - true when a login alert is visible
   */
  async isLoginErrorDisplayed(): Promise<boolean> {
    try {
      await this.loginError.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch (error) {
      if (error instanceof Error && error.name === "TimeoutError") {
        return false;
      }
      throw error;
    }
  }
}
