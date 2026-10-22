import path from "node:path";
import process from "node:process";
import { expect, test } from "../../fixtures/pageFixtures";
import { DataProvider } from "../../utils/DataReader";

type LoginData = {
  testName?: string;
  email: string;
  password: string;
  expected: "success" | "failure";
};

const loginData = DataProvider.readJson(
  path.join(process.cwd(), "testdata", "opencart_logindata.json"),
) as LoginData[];

loginData.forEach((row, index) => {
  const testName = row.testName || `Login data row ${index + 1}`;

  test(`${testName} (row ${index + 1}) @master @regression @datadriven @web`, async ({
    homePage,
    loginPage,
    accountPage,
  }) => {
    await test.step("1) Open the login page", async () => {
      await homePage.clickMyAccount();
      await homePage.clickLogin();
      expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
    });

    await test.step("2) Submit this row's credentials", async () => {
      await loginPage.login(row.email, row.password);
    });

    await test.step("3) Verify the result matches the test data", async () => {
      if (row.expected === "success") {
        expect(await accountPage.isMyAccountPageDisplayed()).toBeTruthy();
      } else if (!row.email.trim() || !row.password.trim()) {
        expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
      } else {
        expect(await loginPage.isLoginErrorDisplayed()).toBeTruthy();
        expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
      }
    });

    console.log(`✅ Data-driven login case completed: ${testName}.`);
  });
});
