const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Запускаємо браузер...');
  const browser = await chromium.launch({ headless: false, slowMo: 1000 }); 
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  try {
    console.log('Переходимо на сайт ПНУ...');
    await page.goto('https://cnu.edu.ua/', { waitUntil: 'domcontentloaded' });

    const title = await page.title();
    if (title.toLowerCase().includes('університет')) {
      console.log('✅ Перевірка 1 пройдена: Заголовок сторінки правильний.');
    } else {
      throw new Error('Неправильний заголовок');
    }

    console.log('Шукаємо посилання "Новини"...');
    const newsLink = page.locator('a', { hasText: /Новини/i }).first();
    await newsLink.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✅ Перевірка 2 пройдена: Посилання "Новини" успішно знайдено.');

    console.log('Натискаємо на "Новини"...');
    await newsLink.click();
    await page.waitForLoadState('domcontentloaded');

    if (page.url() !== 'https://cnu.edu.ua/') {
      console.log('✅ Перевірка 3 пройдена: Успішний перехід на нову сторінку -> ' + page.url());
    } else {
      throw new Error('Перехід не відбувся, URL залишився старим.');
    }

  } catch (error) {
    console.error('❌ Виникла помилка під час тестування:', error.message);
  } finally {
    console.log('Тест завершено, закриваємо браузер через 3 секунди...');
    await page.waitForTimeout(3000); 
    await browser.close();
  }
})();