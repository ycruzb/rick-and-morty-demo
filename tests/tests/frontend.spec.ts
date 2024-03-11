import { test, expect } from '@playwright/test';

const FRONTEND_URL = 'http://localhost:5173';

const appTest = test.extend({
  frontendLogin: async ({ page }, use) => {
    await page.goto(`${FRONTEND_URL}/login`);
    await expect(page).toHaveTitle(/Rick & Morty app/);
    await expect(page).toHaveURL(/login/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByText('Enter your credentials and start having fun!')).toBeVisible();
    await use(page);
  },
  frontendLoggedIn: async ({ frontendLogin }, use) => {
    // TODO: use an already registered email and the valid password here
    await frontendLogin.getByRole('textbox', { name: 'email' }).fill('ycruzb@gmail.com');
    await frontendLogin.getByRole('textbox', { name: 'password' }).fill('123456');
    await frontendLogin.getByRole('button', { name: 'Login' }).click();
    await use(frontendLogin);
  },
  frontendHomePage: async ({ frontendLoggedIn }, use) => {
    await expect(frontendLoggedIn).toHaveURL(`${FRONTEND_URL}`);
    await expect(frontendLoggedIn.getByRole('heading', { name: 'Meet the crew' })).toBeVisible();
    await expect(frontendLoggedIn.getByRole('link', { name: 'Logout' })).toBeVisible();
    await expect(frontendLoggedIn.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(frontendLoggedIn.getByRole('link', { name: 'Favorites' })).toBeVisible();
    await expect(frontendLoggedIn.getByText(/Status/)).toBeVisible();
    await expect(frontendLoggedIn.getByText(/Gender/)).toBeVisible();
    await use(frontendLoggedIn);
  },
});

test('WHEN user visits frontend THEN is redirected to login page because it is not logged in', async ({ page }) => {
  await page.goto(`${FRONTEND_URL}`);
  await expect(page).toHaveTitle(/Rick & Morty app/);
  await expect(page).toHaveURL(/login/);
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  await expect(page.getByText('Enter your credentials and start having fun!')).toBeVisible();
});

appTest('WHEN user tries to log in with an incorrect email or password THEN the user is not logged in', async ({ frontendLogin }) => {
  await frontendLogin.getByRole('textbox', { name: 'email' }).fill('doesnt_exist@gmail.com');
  await frontendLogin.getByRole('textbox', { name: 'password' }).fill('wrong_password');
  await frontendLogin.getByRole('button', { name: 'Login' }).click();

  await expect(frontendLogin).toHaveURL(`${FRONTEND_URL}/login`);
  await expect(frontendLogin.getByText('Wrong credentials.')).toBeVisible();
});

appTest('WHEN user tries to log in with a correct email and password THEN the user is logged in', async ({ frontendLoggedIn }) => {
  await expect(frontendLoggedIn).toHaveURL(`${FRONTEND_URL}`);
  await expect(frontendLoggedIn.getByRole('heading', { name: 'Meet the crew' })).toBeVisible();
  await expect(frontendLoggedIn.getByRole('link', { name: 'Logout' })).toBeVisible();
  await expect(frontendLoggedIn.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(frontendLoggedIn.getByRole('link', { name: 'Favorites' })).toBeVisible();
  await expect(frontendLoggedIn.getByText(/Status/)).toBeVisible();
  await expect(frontendLoggedIn.getByText(/Gender/)).toBeVisible();
});

appTest('WHEN user is in home page AND there is a second page of results AND make click in the next page icon THEN the user is redirected to the second page AND if make click in prev THEN is back to the first page', async ({ frontendHomePage }) => {
  const nextPageLink = await frontendHomePage.getByTestId('paginationGoToNext');
  if (nextPageLink) {
    await nextPageLink.click();
    await expect(frontendHomePage).toHaveURL(/page=2/);
    await frontendHomePage.getByTestId('paginationGoToPrev').click();
    await expect(frontendHomePage).toHaveURL(/page=1/);
  }
});

appTest('WHEN user is in home page AND change the status to alive THEN no dead or unknown characters are shown', async ({ frontendHomePage }) => {
  await frontendHomePage.getByLabel('Status').selectOption('alive');
  await expect(frontendHomePage.getByRole('link', { name: 'Clear' })).toBeVisible();
  await expect(frontendHomePage.locator('.badge.Dead')).toHaveCount(0)
  await expect(frontendHomePage.locator('.badge.unknown')).toHaveCount(0)
});

appTest('WHEN user is in home page AND make click in the Favorites link THEN is redirected to Favorites page and there isnt a character with a heart icon outlined', async ({ frontendHomePage }) => {
  await frontendHomePage.getByRole('link', { name: 'Favorites' }).click();
  expect(frontendHomePage).toHaveURL(/favorites/);
  await expect(frontendHomePage.getByRole('heading', { name: 'Favorites' })).toBeVisible();
  await expect(frontendHomePage.locator('.isNotFavoriteIcon')).toHaveCount(0)
});

appTest('WHEN user is in home page AND make click in the Logout link THEN it is logged out and redirected to login page', async ({ frontendHomePage }) => {
  await frontendHomePage.getByRole('link', { name: 'Logout' }).click();
  expect(frontendHomePage).toHaveURL(/login/);
  await expect(frontendHomePage.getByRole('heading', { name: 'Login' })).toBeVisible();
  await expect(frontendHomePage.getByText('Enter your credentials and start having fun!')).toBeVisible();
});

