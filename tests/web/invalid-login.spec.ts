import { RandomDataUtil } from "../../utils/dataGenerator";
import { expect, test } from "../../fixtures/pageFixtures";

test("Invalid customer login @master @regression @web", async ({
  homePage,
  loginPage,
  accountPage,
}) => {
  await test.step("1) Open My Account and select Login", async () => {
    await homePage.clickMyAccount();
    await homePage.clickLogin();
    expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
  });

  await test.step("2) Submit invalid customer credentials", async () => {
    const email = `invalid-${Date.now()}-${RandomDataUtil.getNumber()}@example.invalid`;
    await loginPage.login(email, RandomDataUtil.getPassword());
    expect(await loginPage.isLoginWarningDisplayed()).toBeTruthy();
    expect(await accountPage.isMyAccountPageDisplayed()).toBeFalsy();
  });

  console.log("✅ Invalid customer login was rejected.");
});
