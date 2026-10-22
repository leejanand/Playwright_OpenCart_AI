import { LogoutPage } from "../../pages/LogoutPage";
import { Helper } from "../../utils/helper";
import { expect, test } from "../../fixtures/pageFixtures";

test("Customer logout @master @sanity @regression @web", async ({
  homePage,
  loginPage,
  accountPage,
}) => {
  const { email, password } = Helper.getLoginDetails();

  await test.step("1) Log in with configured customer credentials", async () => {
    await homePage.clickMyAccount();
    await homePage.clickLogin();
    await loginPage.login(email, password);
    expect(await accountPage.isMyAccountPageDisplayed()).toBeTruthy();
  });

  let logoutPage: LogoutPage | undefined;

  await test.step("2) Log out and verify the confirmation", async () => {
    logoutPage = await accountPage.logout();
    expect(await logoutPage.isLogoutConfirmationDisplayed()).toBeTruthy();
  });

  await test.step("3) Continue to the home page as a guest", async () => {
    if (!logoutPage) {
      throw new Error("Logout confirmation page was not opened.");
    }

    const loggedOutHomePage = await logoutPage.continueToHome();
    expect(await loggedOutHomePage.isHomePageDisplayed()).toBeTruthy();
    expect(await loggedOutHomePage.isGuestNavigationDisplayed()).toBeTruthy();
  });

  console.log("✅ Customer logout completed successfully.");
});
