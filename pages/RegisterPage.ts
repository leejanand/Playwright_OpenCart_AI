import type { Locator, Page } from "@playwright/test";
import { AccountPage } from "./AccountPage";

export interface RegistrationDetails {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class RegisterPage {
  private readonly page: Page;

  // Locators
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly emailField: Locator;
  private readonly passwordField: Locator;
  private readonly privacyPolicyCheckbox: Locator;
  private readonly continueButton: Locator;
  private readonly accountCreatedHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.firstNameField = page.getByPlaceholder("First Name");
    this.lastNameField = page.getByPlaceholder("Last Name");
    this.emailField = page.getByPlaceholder("E-Mail");
    this.passwordField = page.getByPlaceholder("Password");
    this.privacyPolicyCheckbox = page.getByRole("checkbox").last();
    this.continueButton = page.getByRole("button", { name: "Continue", exact: true });
    this.accountCreatedHeading = page.getByRole("heading", {
      name: "Your Account Has Been Created!",
      exact: true,
    });
  }

  /**
   * Checks whether the registration form is displayed.
   * @returns Promise<boolean> - true when the registration heading is visible
   */
  async isRegisterPageDisplayed(): Promise<boolean> {
    return this.page.getByRole("heading", { name: "Register Account" }).isVisible();
  }

  /**
   * Completes and submits the fields available on the registration form.
   * @param details - Customer registration details
   */
  async registerCustomer(details: RegistrationDetails): Promise<void> {
    try {
      await this.firstNameField.fill(details.firstName);
      await this.lastNameField.fill(details.lastName);
      await this.emailField.fill(details.email);
      await this.passwordField.fill(details.password);
      await this.privacyPolicyCheckbox.check();
      await this.continueButton.click();
    } catch (error) {
      console.error("Failed to submit the registration form:", error);
      throw error;
    }
  }

  /**
   * Checks whether OpenCart confirms successful account creation.
   * @returns Promise<boolean> - true when the confirmation heading is visible
   */
  async isAccountCreatedDisplayed(): Promise<boolean> {
    await this.accountCreatedHeading.waitFor({ state: "visible" });
    return true;
  }

  /**
   * Continues from the registration confirmation to the account dashboard.
   * @returns Promise<AccountPage> - Account dashboard page object
   */
  async continueToAccount(): Promise<AccountPage> {
    await this.page.getByRole("link", { name: "Continue", exact: true }).click();
    await this.page.waitForURL(/route=account\/account/);
    return new AccountPage(this.page);
  }
}
