/**
 * Asynchronously calls the OpenAI LLM to get a response.
 *
 * This function is now focused exclusively on the OpenAI API endpoint.
 *
 * @param {string} provider - Should always be 'openai' for this function.
 * @param {string} message - The user's message.
 * @param {string} apiKey - The API key for the provider.
 * @returns {Promise<string>} - A promise that resolves to the bot's response text.
 */
export async function callLLM(provider, message, apiKey) {
  // 1. Basic Validation
  if (provider !== 'openai') {
    return `Error: Invalid LLM provider '${provider}'. Only 'openai' is supported here.`;
  }
  
  if (!apiKey) {
    return `Error: Please save your OPENAI API Key before using this model.`;
  }

  // 2. OpenAI Configuration
  const modelName = 'gpt-4o-mini';
  const API_URL = 'https://api.openai.com/v1/chat/completions';
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };
  
  const body = {
    model: modelName,
    messages: [{ role: 'user', content: message }],
    temperature: 0.7,
    max_tokens: 2048,
  };

  // 3. API Call and Error Handling
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || `Unknown API Error (${response.status})`;

      // Specific OpenAI error handling
      if (response.status === 401) {
        return `Error 401: Invalid OpenAI API Key. Please ensure your key is correct.`;
      }
      if (response.status === 429) {
        return `Error 429: OpenAI Rate Limit Exceeded or Quota Exceeded. Check your billing plan.`;
      } 
      
      return `Error ${response.status} (OpenAI): LLM call failed. Details: ${errorMessage.substring(0, 100)}...`;
    }

    // 4. Extract Response
    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content;

    return responseText?.trim() || 'The LLM returned an empty response.';

  } catch (e) {
    console.error(`LLM Fetch Error for OpenAI:`, e);
    return `An unexpected network error occurred while contacting the OPENAI service.`;
  }
}