const { test, expect } = require('@playwright/test');

// Public demo credentials supplied for SauceDemo's test environment.
const username = process.env.SAUCEDEMO_USERNAME || 'standard_user';
const password = process.env.SAUCEDEMO_PASSWORD || 'secret_sauce';

test('standard user can purchase a backpack end to end', async ({ page }) => {
  // 1. Login
  await page.goto('/');
  await expect(page).toHaveURL(/saucedemo\.com\/?$/);
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  // 2. Confirm inventory page and add one known product.
  await expect(page).toHaveURL(/inventory\.html$/);
  await expect(page.getByText('Products', { exact: true })).toBeVisible();

  const backpack = page.locator('[data-test="inventory-item"]')
    .filter({ hasText: 'Sauce Labs Backpack' });
  await expect(backpack).toHaveCount(1);
  await backpack.getByRole('button', { name: 'Add to cart' }).click();
  await expect(backpack.getByRole('button', { name: 'Remove' })).toBeVisible();
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

  // 3. Verify the cart contains the selected item.
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL(/cart\.html$/);
  await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
  await expect(page.locator('[data-test="cart-item"]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Checkout' }).click();

  // 4. Complete checkout information.
  await expect(page).toHaveURL(/checkout-step-one\.html$/);
  await page.getByPlaceholder('First Name').fill('Test');
  await page.getByPlaceholder('Last Name').fill('User');
  await page.getByPlaceholder('Zip/Postal Code').fill('12345');
  await page.getByRole('button', { name: 'Continue' }).click();

  // 5. Verify order summary before placing the order.
  await expect(page).toHaveURL(/checkout-step-two\.html$/);
  await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
  await expect(page.locator('[data-test="cart-item"]')).toHaveCount(1);
  await expect(page.locator('[data-test="subtotal-label"]')).toContainText('Item total: $29.99');
  await expect(page.locator('[data-test="total-label"]')).toContainText('Total: $');

  // 6. Place order and assert the final success state.
  await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page).toHaveURL(/checkout-complete\.html$/);
  await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
  await expect(page.getByText('Your order has been dispatched, and will arrive just as fast as the pony can get there!')).toBeVisible();
});
