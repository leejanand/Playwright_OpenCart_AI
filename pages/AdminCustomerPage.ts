import type { Locator, Page } from "@playwright/test";

export class AdminCustomerPage {
  private readonly page: Page;
  private readonly navigation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigation = page.getByRole("navigation");
  }

  async login(adminUrl: string, username: string, password: string): Promise<void> {
    await this.page.goto(adminUrl);
    await this.page.getByRole("textbox", { name: "Username" }).fill(username);
    await this.page.getByRole("textbox", { name: "Password" }).fill(password);
    await this.page.getByRole("button", { name: "Login", exact: true }).click();
    await this.page.waitForURL(/route=common\/dashboard/);

    const securityDialog = this.page.getByRole("dialog");
    if (await securityDialog.isVisible()) {
      await securityDialog.getByRole("button").first().click();
    }
  }

  async openCustomers(): Promise<void> {
    await this.navigation.getByRole("link", { name: /Customers/ }).first().click();
    await this.navigation.getByRole("link", { name: /Customers/ }).nth(1).click();
    await this.page.waitForURL(/route=customer\/customer(?:&|$)/);
  }

  async searchCustomer(email: string): Promise<Locator> {
    await this.page.getByRole("textbox", { name: "E-Mail" }).fill(email);
    await this.page.getByRole("button", { name: "Filter", exact: true }).click();

    const customerRow = this.page.getByRole("row").filter({ hasText: email });
    await customerRow.waitFor({ state: "visible" });
    return customerRow;
  }

  async getCustomerStatus(customerRow: Locator): Promise<string> {
    await customerRow.getByRole("link", { name: "Edit" }).click();
    await this.page.waitForURL(/route=customer\/customer\.form/);

    const statusCheckbox = this.page
      .getByRole("group", { name: "Other" })
      .getByRole("checkbox")
      .nth(1);
    return (await statusCheckbox.isChecked()) ? "Enabled" : "Disabled";
  }
}
