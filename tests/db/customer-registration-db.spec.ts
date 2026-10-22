import dotenv from "dotenv";
import { expect, test } from "../../fixtures/pageFixtures";
import { RandomDataUtil } from "../../utils/dataGenerator";
import { executeQuery } from "../../utils/dbClient";

dotenv.config({override: true});

type CustomerRecord = {
  firstname: string;
  lastname: string;
  email: string;
  status: number;
  date_added: Date | string;
};

test("Register and verify customer in Admin and MySQL @master @regression @e2e @db", async ({
  homePage,
  registerPage,
  adminCustomerPage,
}) => {
  const generatedCustomer = RandomDataUtil.generateCustomerRegistrationPayload();
  const customer = {
    ...generatedCustomer,
    email: generatedCustomer.email.replace("@", `+${Date.now()}@`).toLowerCase(),
  };
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminUrl = new URL(
    "admin/index.php",
    process.env.WEB_APP_URL || "http://localhost/opencart/upload/",
  ).toString();
  let customerRegistered = false;

  if (!adminUsername || !adminPassword) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be configured in .env.");
  }

  try {
    await test.step("Register a unique customer through the storefront", async () => {
      await homePage.clickMyAccount();
      await homePage.clickRegister();
      expect(await registerPage.isRegisterPageDisplayed()).toBeTruthy();

      await registerPage.registerCustomer({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        telephone: customer.telephone,
        password: customer.password,
      });
      expect(await registerPage.isAccountCreatedDisplayed()).toBeTruthy();
      customerRegistered = true;
    });

    await test.step("Find and verify the customer in OpenCart Admin", async () => {
      await adminCustomerPage.login(adminUrl, adminUsername, adminPassword);
      await adminCustomerPage.openCustomers();

      const customerRow = await adminCustomerPage.searchCustomer(customer.email);
      await expect(customerRow).toContainText(customer.firstName);
      await expect(customerRow).toContainText(customer.lastName);
      await expect(customerRow).toContainText(customer.email);
      expect(await adminCustomerPage.getCustomerStatus(customerRow)).toBe("Enabled");
    });

    await test.step("Verify the customer record in MySQL", async () => {
      const result = await executeQuery(
        "SELECT firstname, lastname, email, status, date_added FROM oc_customer WHERE email = ?",
        [customer.email],
      );
      expect(Array.isArray(result)).toBeTruthy();
      const rows = result as CustomerRecord[];

      expect(rows).toHaveLength(1);
      expect(rows[0].firstname).toBe(customer.firstName);
      expect(rows[0].lastname).toBe(customer.lastName);
      expect(rows[0].email).toBe(customer.email);
      expect(rows[0].status).toBe(1);
      expect(rows[0].date_added).toBeTruthy();
    });
  } finally {
    if (customerRegistered) {
      await executeQuery("DELETE FROM oc_customer WHERE email = ?", [customer.email]);
    }
  }
});
