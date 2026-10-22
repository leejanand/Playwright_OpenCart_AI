import { Helper } from "../../utils/helper";
import { expect, test } from "../../fixtures/pageFixtures";

test("Valid customer login @master @sanity @regression @web", async ({
  homePage,
  loginPage,
  accountPage,
}) => {
  const { email, password } = Helper.getLoginDetails();

  await test.step("1) Open My Account and select Login", async () => {
    await homePage.clickMyAccount();
    await homePage.clickLogin();
    expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
  });

  await test.step("2) Log in with configured customer credentials", async () => {
    await loginPage.login(email, password);
    expect(await accountPage.isMyAccountPageDisplayed()).toBeTruthy();
  });

  console.log("✅ Customer login completed successfully.");
});
