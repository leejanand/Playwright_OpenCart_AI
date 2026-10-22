# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\opencart-web.spec.ts >> Valid customer login @master @sanity @regression @web
- Location: tests\web\opencart-web.spec.ts:54:5

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1   | import path from "node:path";
  2   | import process from "node:process";
  3   | import { DataProvider } from "../../utils/DataReader";
  4   | import { RandomDataUtil } from "../../utils/dataGenerator";
  5   | import { Helper } from "../../utils/helper";
  6   | import { expect, test } from "../../fixtures/pageFixtures";
  7   | import { LogoutPage } from "../../pages/LogoutPage";
  8   | 
  9   | type LoginData = {
  10  |   testName?: string;
  11  |   email: string;
  12  |   password: string;
  13  |   expected: "success" | "failure";
  14  | };
  15  | 
  16  | const loginData = DataProvider.readJson(
  17  |   path.join(process.cwd(), "testdata", "opencart_logindata.json"),
  18  | ) as LoginData[];
  19  | 
  20  | test("Customer registration @master @sanity @regression @web", async ({
  21  |   homePage,
  22  |   registerPage,
  23  |   accountPage,
  24  | }) => {
  25  |   const customer = RandomDataUtil.generateCustomerRegistrationPayload();
  26  |   const email = customer.email.replace("@", `+${Date.now()}@`);
  27  |   const registrationDetails = {
  28  |     firstName: customer.firstName,
  29  |     lastName: customer.lastName,
  30  |     email,
  31  |     password: customer.password,
  32  |   };
  33  | 
  34  |   await test.step("1) Open My Account and select Register", async () => {
  35  |     await homePage.clickMyAccount();
  36  |     await homePage.clickRegister();
  37  |     expect(await registerPage.isRegisterPageDisplayed()).toBeTruthy();
  38  |   });
  39  | 
  40  |   await test.step("2) Submit unique customer details and accept the Privacy Policy", async () => {
  41  |     await registerPage.registerCustomer(registrationDetails);
  42  |     expect(await registerPage.isAccountCreatedDisplayed()).toBeTruthy();
  43  |   });
  44  | 
  45  |   await test.step("3) Continue to the newly created account", async () => {
  46  |     const createdAccount = await registerPage.continueToAccount();
  47  |     expect(await createdAccount.isMyAccountPageDisplayed()).toBeTruthy();
  48  |     expect(await accountPage.isMyAccountPageDisplayed()).toBeTruthy();
  49  |   });
  50  | 
  51  |   console.log("✅ Customer registration completed successfully.");
  52  | });
  53  | 
  54  | test("Valid customer login @master @sanity @regression @web", async ({
  55  |   homePage,
  56  |   loginPage,
  57  |   accountPage,
  58  | }) => {
  59  |   const { email, password } = Helper.getLoginDetails();
  60  | 
  61  |   await test.step("1) Open My Account and select Login", async () => {
  62  |     await homePage.clickMyAccount();
  63  |     await homePage.clickLogin();
  64  |     expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
  65  |   });
  66  | 
  67  |   await test.step("2) Log in with configured customer credentials", async () => {
  68  |     await loginPage.login(email, password);
> 69  |     expect(await accountPage.isMyAccountPageDisplayed()).toBeTruthy();
      |                                                          ^ Error: expect(received).toBeTruthy()
  70  |   });
  71  | 
  72  |   console.log("✅ Customer login completed successfully.");
  73  | });
  74  | 
  75  | test("Invalid customer login @master @regression @web", async ({
  76  |   homePage,
  77  |   loginPage,
  78  |   accountPage,
  79  | }) => {
  80  |   await test.step("1) Open My Account and select Login", async () => {
  81  |     await homePage.clickMyAccount();
  82  |     await homePage.clickLogin();
  83  |     expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
  84  |   });
  85  | 
  86  |   await test.step("2) Submit invalid customer credentials", async () => {
  87  |     const email = `invalid-${Date.now()}-${RandomDataUtil.getNumber()}@example.invalid`;
  88  |     await loginPage.login(email, RandomDataUtil.getPassword());
  89  |     expect(await loginPage.isLoginWarningDisplayed()).toBeTruthy();
  90  |     expect(await accountPage.isMyAccountPageDisplayed()).toBeFalsy();
  91  |   });
  92  | 
  93  |   console.log("✅ Invalid customer login was rejected.");
  94  | });
  95  | 
  96  | test("Customer logout @master @sanity @regression @web", async ({
  97  |   homePage,
  98  |   loginPage,
  99  |   accountPage,
  100 | }) => {
  101 |   const { email, password } = Helper.getLoginDetails();
  102 | 
  103 |   await test.step("1) Log in with configured customer credentials", async () => {
  104 |     await homePage.clickMyAccount();
  105 |     await homePage.clickLogin();
  106 |     await loginPage.login(email, password);
  107 |     expect(await accountPage.isMyAccountPageDisplayed()).toBeTruthy();
  108 |   });
  109 | 
  110 |   let logoutPage: LogoutPage | undefined;
  111 | 
  112 |   await test.step("2) Log out and verify the confirmation", async () => {
  113 |     logoutPage = await accountPage.logout();
  114 |     expect(await logoutPage.isLogoutConfirmationDisplayed()).toBeTruthy();
  115 |   });
  116 | 
  117 |   await test.step("3) Continue to the home page as a guest", async () => {
  118 |     if (!logoutPage) {
  119 |       throw new Error("Logout confirmation page was not opened.");
  120 |     }
  121 | 
  122 |     const loggedOutHomePage = await logoutPage.continueToHome();
  123 |     expect(await loggedOutHomePage.isHomePageDisplayed()).toBeTruthy();
  124 |     expect(await loggedOutHomePage.isGuestNavigationDisplayed()).toBeTruthy();
  125 |   });
  126 | 
  127 |   console.log("✅ Customer logout completed successfully.");
  128 | });
  129 | 
  130 | test("Search for a known product @master @sanity @regression @web", async ({
  131 |   homePage,
  132 | }) => {
  133 |   const { productName } = Helper.getProductDetails();
  134 | 
  135 |   await test.step("1) Search for the known product", async () => {
  136 |     await homePage.searchProduct(productName);
  137 |   });
  138 | 
  139 |   await test.step("2) Verify the search page and matching product", async () => {
  140 |     expect(await homePage.isSearchResultsPageDisplayed()).toBeTruthy();
  141 |     expect(await homePage.isProductVisible(productName)).toBeTruthy();
  142 |   });
  143 | 
  144 |   console.log("✅ Product search completed successfully.");
  145 | });
  146 | 
  147 | test("Add a product to the shopping cart @master @sanity @regression @web", async ({
  148 |   homePage,
  149 |   productPage,
  150 |   cartPage,
  151 | }) => {
  152 |   const { productName, productQuantity } = Helper.getProductDetails();
  153 | 
  154 |   await test.step("1) Search for the product and open its details", async () => {
  155 |     await homePage.searchProduct(productName);
  156 |     await homePage.openProduct(productName);
  157 |     expect(await productPage.isProductDetailsDisplayed(productName)).toBeTruthy();
  158 |   });
  159 | 
  160 |   await test.step("2) Set quantity and add the product to the cart", async () => {
  161 |     await productPage.setQuantity(productQuantity);
  162 |     await productPage.addToCart();
  163 |     expect(await productPage.isProductAddedDisplayed()).toBeTruthy();
  164 |   });
  165 | 
  166 |   await test.step("3) Verify the product and quantity in the cart", async () => {
  167 |     await productPage.openShoppingCart();
  168 |     expect(await cartPage.isCartPageDisplayed()).toBeTruthy();
  169 |     expect(await cartPage.isProductInCart(productName)).toBeTruthy();
```