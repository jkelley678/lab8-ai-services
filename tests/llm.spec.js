import { test, expect } from '@playwright/test';

test('LLM mode correctly displays a mocked API response', async ({ page }) => {
  const MOCK_RESPONSE_TEXT = 'This is the mocked LLM response for testing.';
  const MOCK_API_KEY = 'TEST_API_KEY_12345';
  
  // 1. Mock the LLM API call (e.g., OpenAI's endpoint)
  await page.route('https://generativelanguage.googleapis.com/**', async (route) => {
    const url = new URL(route.request().url());
    expect(url.searchParams.get('key')).toBe(MOCK_API_KEY);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        candidates: [{
          content: {
            parts: [{ text: MOCK_RESPONSE_TEXT }],
          },
        }],
      }),
    });
  });

  // 2. Navigate to your app and set up the LLM mode
  await page.goto('http://localhost:8080/index.html'); 

  // 3. Select the LLM provider and enter the mock key
  await page.locator('#model-select').selectOption('openai');
  await page.locator('#model-input').fill(MOCK_API_KEY);
  page.locator('#API-save').click(); 

  // 4. Type a message
  await page.locator('#message-input').fill('What is the best way to learn to code?');
  await page.keyboard.press('Enter');

  // 5. Verify the user message is present
  await expect(page.locator('.message.user')).toHaveText('What is the best way to learn to code?');

  // 6. Verify the bot response matches the mocked text
  await expect(page.locator('.message.bot').last()).toHaveText(MOCK_RESPONSE_TEXT);
});