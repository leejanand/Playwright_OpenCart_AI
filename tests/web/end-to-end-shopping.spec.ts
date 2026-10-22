import { RandomDataUtil } from "../../utils/dataGenerator";
import { Helper } from "../../utils/helper";
import { expect, test } from "../../fixtures/pageFixtures";

test("End-to-end customer shopping journey @master @regression @end-to-end @web", async ({
  homePage,
  registerPage,
  accountPage,
  loginPage,
  productPage,
  cartPage,
}) => {
  const customer = RandomDataUtil.generateCustomerRegistrationPayload();
  const email = customer.email.replace("@", `+${Date.now()}@`);
  const { productName, productQuantity, totalPrice } = Helper.getProductDetails();

  await test.step("1) Register a new customer", async () => {
    await homePage.clickMyAccount();
    await homePage.clickRegister();
    await registerPage.registerCustomer({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email,
      password: customer.password,
    });
    expect(await registerPage.isAccountCreatedDisplayed()).toBeTruthy();
    expect(await (await registerPage.continueToAccount()).isMyAccountPageDisplayed()).toBeTruthy();
  });

  await test.step("2) Log out and log in with the new customer", async () => {
    const logoutPage = await accountPage.logout();
    expect(await logoutPage.isLogoutConfirmationDisplayed()).toBeTruthy();
    await logoutPage.continueToHome();
    await homePage.clickMyAccount();
    await homePage.clickLogin();
    await loginPage.login(email, customer.password);
    expect(await accountPage.isMyAccountPageDisplayed()).toBeTruthy();
  });

  await test.step("3) Search for the product and add it to the cart", async () => {
    await homePage.searchProduct(productName);
    await homePage.openProduct(productName);
    expect(await productPage.isProductDetailsDisplayed(productName)).toBeTruthy();
    await productPage.setQuantity(productQuantity);
    await productPage.addToCart();
    expect(await productPage.isProductAddedDisplayed()).toBeTruthy();
  });

  await test.step("4) Verify product, quantity, price, and cart total", async () => {
    await productPage.openShoppingCart();
    expect(await cartPage.isProductInCart(productName)).toBeTruthy();
    expect(await cartPage.getProductQuantity(productName)).toBe(productQuantity);
    expect(await cartPage.getProductUnitPrice(productName)).toBe(totalPrice);
    expect(await cartPage.getProductLineTotal(productName)).toBe(totalPrice);
    expect(await cartPage.getCartTotal()).toBe(totalPrice);
  });

  console.log("✅ End-to-end shopping journey completed successfully.");
});
