const { test, expect } = require('@playwright/test');

import { goToHome, setLang } from './utils/app.utils';

test.describe('Zonemaster test FR05 - [Supports internationalization]', () => {
  test.beforeEach(async ({ page }) => {
    await goToHome(page);
  });

  const testSuite = [
      { language: 'Danish', code: 'da', expected: 'Domænenavn' },
      { language: 'English', code: 'en', expected: 'Domain name' },
      { language: 'Spanish', code: 'es', expected: 'Nombre de dominio' },
      { language: 'Finnish', code: 'fi', expected: 'Verkkotunnus' },
      { language: 'French', code: 'fr', expected: 'Nom de domaine' },
      { language: 'Norwegian', code: 'nb', expected: 'Domenenavn' },
      { language: 'Swedish', code: 'sv', expected: 'Domännamn' },
  ];

  for (const { language, code, expected } of testSuite) {
    test(`should have ${language} language button`, async ({ page }) => {
      const langNavLink = page.locator(`.lang > div > a[lang="${code}"]`);
      await expect(langNavLink).toHaveCount(1);
    })

    test(`should switch switch to ${language}`, async ({ page }) => {
      await setLang(page, code);
      await expect(page.locator('h1')).toHaveText(expected);

      const langNavLink = page.locator(`.lang > div > a[lang="${code}"]`);
      await expect(langNavLink).toHaveCount(1);
      await expect(langNavLink).toHaveAttribute('lang', code);
    })
  }
});
