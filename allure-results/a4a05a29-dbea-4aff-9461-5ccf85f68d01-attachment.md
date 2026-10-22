# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\opencart-web.spec.ts >> Invalid customer login @master @regression @web
- Location: tests\web\opencart-web.spec.ts:80:5

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
  20  | const configuredEmail = process.env.APP_EMAIL;
  21  | const configuredPassword = process.env.APP_PASSWORD;
  22  | 
  23  | test("Customer registration @master @sanity @regression @web", async ({
  24  |   homePage,
  25  |   registerPage,
  26  |   accountPage,
  27  | }) => {
  28  |   const customer = RandomDataUtil.generateCustomerRegistrationPayload();
  29  |   const email = customer.email.replace("@", `+${Date.now()}@`);
  30  |   const registrationDetails = {
  31  |     firstName: customer.firstName,
  32  |     lastName: customer.lastName,
  33  |     email,
  34  |     password: customer.password,
  35  |   };
  36  | 
  37  |   await test.step("1) Open My Account and select Register", async () => {
  38  |     await homePage.clickMyAccount();
  39  |     await homePage.clickRegister();
  40  |     expect(await registerPage.isRegisterPageDisplayed()).toBeTruthy();
  41  |   });
  42  | 
  43  |   await test.step("2) Submit unique customer details and accept the Privacy Policy", async () => {
  44  |     await registerPage.registerCustomer(registrationDetails);
  45  |     expect(await registerPage.isAccountCreatedDisplayed()).toBeTruthy();
  46  |   });
  47  | 
  48  |   await test.step("3) Continue to the newly created account", async () => {
  49  |     const createdAccount = await registerPage.continueToAccount();
  50  |     expect(await createdAccount.isMyAccountPageDisplayed()).toBeTruthy();
  51  |     expect(await accountPage.isMyAccountPageDisplayed()).toBeTruthy();
  52  |   });
  53  | 
  54  |   console.log("✅ Customer registration completed successfully.");
  55  | });
  56  | 
  57  | test("Valid customer login @master @sanity @regression @web", async ({
  58  |   homePage,
  59  |   loginPage,
  60  |   accountPage,
  61  | }) => {
  62  |   if (!configuredEmail || !configuredPassword) {
  63  |     throw new Error("APP_EMAIL and APP_PASSWORD must be configured in .env.");
  64  |   }
  65  | 
  66  |   await test.step("1) Open My Account and select Login", async () => {
  67  |     await homePage.clickMyAccount();
  68  |     await homePage.clickLogin();
  69  |     expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
  70  |   });
  71  | 
  72  |   await test.step("2) Log in with configured customer credentials", async () => {
  73  |     await loginPage.login(configuredEmail, configuredPassword);
  74  |     expect(await accountPage.isMyAccountPageDisplayed()).toBeTruthy();
  75  |   });
  76  | 
  77  |   console.log("✅ Customer login completed successfully.");
  78  | });
  79  | 
  80  | test("Invalid customer login @master @regression @web", async ({
  81  |   homePage,
  82  |   loginPage,
  83  |   accountPage,
  84  | }) => {
  85  |   await test.step("1) Open My Account and select Login", async () => {
  86  |     await homePage.clickMyAccount();
  87  |     await homePage.clickLogin();
  88  |     expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
  89  |   });
  90  | 
  91  |   await test.step("2) Submit invalid customer credentials", async () => {
  92  |     const email = `invalid-${Date.now()}-${RandomDataUtil.getNumber()}@example.invalid`;
  93  |     await loginPage.login(email, RandomDataUtil.getPassword());
> 94  |     expect(await loginPage.isLoginWarningDisplayed()).toBeTruthy();
      |                                                       ^ Error: expect(received).toBeTruthy()
  95  |     expect(await accountPage.isMyAccountPageDisplayed()).toBeFalsy();
  96  |   });
  97  | 
  98  |   console.log("✅ Invalid customer login was rejected.");
  99  | });
  100 | 
  101 | test("Customer logout @master @sanity @regression @web", async ({
  102 |   homePage,
  103 |   loginPage,
  104 |   accountPage,
  105 | }) => {
  106 |   if (!configuredEmail || !configuredPassword) {
  107 |     throw new Error("APP_EMAIL and APP_PASSWORD must be configured in .env.");
  108 |   }
  109 | 
  110 |   await test.step("1) Log in with configured customer credentials", async () => {
  111 |     await homePage.clickMyAccount();
  112 |     await homePage.clickLogin();
  113 |     await loginPage.login(configuredEmail, configuredPassword);
  114 |     expect(await accountPage.isMyAccountPageDisplayed()).toBeTruthy();
  115 |   });
  116 | 
  117 |   let logoutPage: LogoutPage | undefined;
  118 | 
  119 |   await test.step("2) Log out and verify the confirmation", async () => {
  120 |     logoutPage = await accountPage.logout();
  121 |     expect(await logoutPage.isLogoutConfirmationDisplayed()).toBeTruthy();
  122 |   });
  123 | 
  124 |   await test.step("3) Continue to the home page as a guest", async () => {
  125 |     if (!logoutPage) {
  126 |       throw new Error("Logout confirmation page was not opened.");
  127 |     }
  128 | 
  129 |     const loggedOutHomePage = await logoutPage.continueToHome();
  130 |     expect(await loggedOutHomePage.isHomePageDisplayed()).toBeTruthy();
  131 |     expect(await loggedOutHomePage.isGuestNavigationDisplayed()).toBeTruthy();
  132 |   });
  133 | 
  134 |   console.log("✅ Customer logout completed successfully.");
  135 | });
  136 | 
  137 | test("Search for a known product @master @sanity @regression @web", async ({
  138 |   homePage,
  139 | }) => {
  140 |   const { productName } = Helper.getProductDetails();
  141 | 
  142 |   await test.step("1) Search for the known product", async () => {
  143 |     await homePage.searchProduct(productName);
  144 |   });
  145 | 
  146 |   await test.step("2) Verify the search page and matching product", async () => {
  147 |     expect(await homePage.isSearchResultsPageDisplayed()).toBeTruthy();
  148 |     expect(await homePage.isProductVisible(productName)).toBeTruthy();
  149 |   });
  150 | 
  151 |   console.log("✅ Product search completed successfully.");
  152 | });
  153 | 
  154 | test("Add a product to the shopping cart @master @sanity @regression @web", async ({
  155 |   homePage,
  156 |   productPage,
  157 |   cartPage,
  158 | }) => {
  159 |   const { productName, productQuantity } = Helper.getProductDetails();
  160 | 
  161 |   await test.step("1) Search for the product and open its details", async () => {
  162 |     await homePage.searchProduct(productName);
  163 |     await homePage.openProduct(productName);
  164 |     expect(await productPage.isProductDetailsDisplayed(productName)).toBeTruthy();
  165 |   });
  166 | 
  167 |   await test.step("2) Set quantity and add the product to the cart", async () => {
  168 |     await productPage.setQuantity(productQuantity);
  169 |     await productPage.addToCart();
  170 |     expect(await productPage.isProductAddedDisplayed()).toBeTruthy();
  171 |   });
  172 | 
  173 |   await test.step("3) Verify the product and quantity in the cart", async () => {
  174 |     await productPage.openShoppingCart();
  175 |     expect(await cartPage.isCartPageDisplayed()).toBeTruthy();
  176 |     expect(await cartPage.isProductInCart(productName)).toBeTruthy();
  177 |     expect(await cartPage.getProductQuantity(productName)).toBe(productQuantity);
  178 |   });
  179 | 
  180 |   console.log("✅ Product was added to the shopping cart.");
  181 | });
  182 | 
  183 | test("End-to-end customer shopping journey @master @regression @end-to-end @web", async ({
  184 |   homePage,
  185 |   registerPage,
  186 |   accountPage,
  187 |   loginPage,
  188 |   productPage,
  189 |   cartPage,
  190 | }) => {
  191 |   const customer = RandomDataUtil.generateCustomerRegistrationPayload();
  192 |   const email = customer.email.replace("@", `+${Date.now()}@`);
  193 |   const { productName, productQuantity, totalPrice } = Helper.getProductDetails();
  194 | 
```