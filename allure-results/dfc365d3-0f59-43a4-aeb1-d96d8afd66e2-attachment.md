# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\opencart-web.spec.ts >> Invalid login (row 3) @master @regression @datadriven @web
- Location: tests\web\opencart-web.spec.ts:235:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
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
  170 |     expect(await cartPage.getProductQuantity(productName)).toBe(productQuantity);
  171 |   });
  172 | 
  173 |   console.log("✅ Product was added to the shopping cart.");
  174 | });
  175 | 
  176 | test("End-to-end customer shopping journey @master @regression @end-to-end @web", async ({
  177 |   homePage,
  178 |   registerPage,
  179 |   accountPage,
  180 |   loginPage,
  181 |   productPage,
  182 |   cartPage,
  183 | }) => {
  184 |   const customer = RandomDataUtil.generateCustomerRegistrationPayload();
  185 |   const email = customer.email.replace("@", `+${Date.now()}@`);
  186 |   const { productName, productQuantity, totalPrice } = Helper.getProductDetails();
  187 | 
  188 |   await test.step("1) Register a new customer", async () => {
  189 |     await homePage.clickMyAccount();
  190 |     await homePage.clickRegister();
  191 |     await registerPage.registerCustomer({
  192 |       firstName: customer.firstName,
  193 |       lastName: customer.lastName,
  194 |       email,
  195 |       password: customer.password,
  196 |     });
  197 |     expect(await registerPage.isAccountCreatedDisplayed()).toBeTruthy();
  198 |     expect(await (await registerPage.continueToAccount()).isMyAccountPageDisplayed()).toBeTruthy();
  199 |   });
  200 | 
  201 |   await test.step("2) Log out and log in with the new customer", async () => {
  202 |     const logoutPage = await accountPage.logout();
  203 |     expect(await logoutPage.isLogoutConfirmationDisplayed()).toBeTruthy();
  204 |     await logoutPage.continueToHome();
  205 |     await homePage.clickMyAccount();
  206 |     await homePage.clickLogin();
  207 |     await loginPage.login(email, customer.password);
  208 |     expect(await accountPage.isMyAccountPageDisplayed()).toBeTruthy();
  209 |   });
  210 | 
  211 |   await test.step("3) Search for the product and add it to the cart", async () => {
  212 |     await homePage.searchProduct(productName);
  213 |     await homePage.openProduct(productName);
  214 |     expect(await productPage.isProductDetailsDisplayed(productName)).toBeTruthy();
  215 |     await productPage.setQuantity(productQuantity);
  216 |     await productPage.addToCart();
  217 |     expect(await productPage.isProductAddedDisplayed()).toBeTruthy();
  218 |   });
  219 | 
  220 |   await test.step("4) Verify product, quantity, price, and cart total", async () => {
  221 |     await productPage.openShoppingCart();
  222 |     expect(await cartPage.isProductInCart(productName)).toBeTruthy();
  223 |     expect(await cartPage.getProductQuantity(productName)).toBe(productQuantity);
  224 |     expect(await cartPage.getProductUnitPrice(productName)).toBe(totalPrice);
  225 |     expect(await cartPage.getProductLineTotal(productName)).toBe(totalPrice);
  226 |     expect(await cartPage.getCartTotal()).toBe(totalPrice);
  227 |   });
  228 | 
  229 |   console.log("✅ End-to-end shopping journey completed successfully.");
  230 | });
  231 | 
  232 | loginData.forEach((row, index) => {
  233 |   const testName = row.testName || `Login data row ${index + 1}`;
  234 | 
  235 |   test(`${testName} (row ${index + 1}) @master @regression @datadriven @web`, async ({
  236 |     homePage,
  237 |     loginPage,
  238 |     accountPage,
  239 |   }) => {
  240 |     await test.step("1) Open the login page", async () => {
  241 |       await homePage.clickMyAccount();
  242 |       await homePage.clickLogin();
  243 |       expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
  244 |     });
  245 | 
  246 |     await test.step("2) Submit this row's credentials", async () => {
  247 |       await loginPage.login(row.email, row.password);
  248 |     });
  249 | 
  250 |     await test.step("3) Verify the result matches the test data", async () => {
  251 |       if (row.expected === "success") {
  252 |         expect(await accountPage.isMyAccountPageDisplayed()).toBeTruthy();
  253 |       } else {
> 254 |         expect(await loginPage.isLoginWarningDisplayed()).toBeTruthy();
      |                                                           ^ Error: expect(received).toBeTruthy()
  255 |         expect(await accountPage.isMyAccountPageDisplayed()).toBeFalsy();
  256 |       }
  257 |     });
  258 | 
  259 |     console.log(`✅ Data-driven login case completed: ${testName}.`);
  260 |   });
  261 | });
  262 | 
```