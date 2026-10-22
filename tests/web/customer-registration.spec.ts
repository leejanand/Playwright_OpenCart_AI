import { RandomDataUtil } from "../../utils/dataGenerator";
import { expect, test } from "../../fixtures/pageFixtures";

test("Customer registration @master @sanity @regression @web", async ({
  homePage,
  registerPage,
  accountPage,
}) => {
  const customer = RandomDataUtil.generateCustomerRegistrationPayload();
  const email = customer.email.replace("@", `+${Date.now()}@`);

  await test.step("1) Open My Account and select Register", async () => {
    await homePage.clickMyAccount();
    await homePage.clickRegister();
    expect(await registerPage.isRegisterPageDisplayed()).toBeTruthy();
  });

  await test.step("2) Submit unique customer details and accept the Privacy Policy", async () => {
    await registerPage.registerCustomer({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email,
      password: customer.password,
    });
    expect(await registerPage.isAccountCreatedDisplayed()).toBeTruthy();
  });

  await test.step("3) Continue to the newly created account", async () => {
    const createdAccount = await registerPage.continueToAccount();
    expect(await createdAccount.isMyAccountPageDisplayed()).toBeTruthy();
    expect(await accountPage.isMyAccountPageDisplayed()).toBeTruthy();
  });

  console.log("✅ Customer registration completed successfully.");
});
