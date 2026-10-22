import { Helper } from "../../utils/helper";
import { expect, test } from "../../fixtures/pageFixtures";

test("Add a product to the shopping cart @master @sanity @regression @web", async ({
  homePage,
  productPage,
  cartPage,
}) => {
  const { productName, productQuantity } = Helper.getProductDetails();

  await test.step("1) Search for the product and open its details", async () => {
    await homePage.searchProduct(productName);
    await homePage.openProduct(productName);
    expect(await productPage.isProductDetailsDisplayed(productName)).toBeTruthy();
  });

  await test.step("2) Set quantity and add the product to the cart", async () => {
    await productPage.setQuantity(productQuantity);
    await productPage.addToCart();
    expect(await productPage.isProductAddedDisplayed()).toBeTruthy();
  });

  await test.step("3) Verify the product and quantity in the cart", async () => {
    await productPage.openShoppingCart();
    expect(await cartPage.isCartPageDisplayed()).toBeTruthy();
    expect(await cartPage.isProductInCart(productName)).toBeTruthy();
    expect(await cartPage.getProductQuantity(productName)).toBe(productQuantity);
  });

  console.log("✅ Product was added to the shopping cart.");
});
