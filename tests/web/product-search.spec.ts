import { Helper } from "../../utils/helper";
import { expect, test } from "../../fixtures/pageFixtures";

test("Search for a known product @master @sanity @regression @web", async ({
  homePage,
}) => {
  const { productName } = Helper.getProductDetails();

  await test.step("1) Search for the known product", async () => {
    await homePage.searchProduct(productName);
  });

  await test.step("2) Verify the search page and matching product", async () => {
    expect(await homePage.isSearchResultsPageDisplayed()).toBeTruthy();
    expect(await homePage.isProductVisible(productName)).toBeTruthy();
  });

  console.log("✅ Product search completed successfully.");
});
