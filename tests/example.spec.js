import { test, expect } from '@playwright/test';

test('Eliza mode responds to a known pattern', async ({ page }) => {
  // 1. Navigate to your app
  await page.goto('http://localhost:8080/index.html'); 

  // 2. Ensure Eliza mode is selected (it is the default)
  await expect(page.locator('#model-select')).toHaveValue('eliza');

  // 3. Type a message that should trigger a known pattern (e.g., 'hello')
  await page.locator('#message-input').fill('Hello there!');
  await page.keyboard.press('Enter');

  // 4. Check for the user's message
  await expect(page.locator('.message.user')).toHaveText('Hello there!');

  // 5. Check for the bot's response.

  const botResponse = await page.locator('.message.bot').last().textContent();

  const isCorrectElizaResponse = botResponse.startsWith('Hello! How are you doing today?') || 
                                 botResponse.startsWith("Hi there! What's on your mind?") ||
                                 botResponse.startsWith("Hey! How can I help you?") ||
                                 botResponse.startsWith("Howdy! What would you like to talk about?");

  expect(isCorrectElizaResponse).toBe(true);
});