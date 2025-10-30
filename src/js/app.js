import { getBotResponse as elizaGetBotResponse } from './eliza.js';
import { callLLM } from './llm.js';
import { ChatModel } from './model.js';
import { ChatView } from './view.js';
import { ChatController } from './controller.js';

document.addEventListener('DOMContentLoaded', () => {
  const chatElement = document.querySelector('simple-chat');
  
  if (chatElement) {
    const model = new ChatModel();
    const view = new ChatView(chatElement);

    const getBotResponse = async (message) => { 
      const providerEl = document.getElementById('model-select');
      const provider = providerEl?.value || 'eliza';
      
      if (provider === 'eliza') {
        return elizaGetBotResponse(message); 
      }

      const savedKey = localStorage.getItem(`apiKey_${provider}`) || '';

      const inputKey = document.getElementById('model-input')?.value || '';
      const apiKey = savedKey || inputKey;

      return await callLLM(provider, message, apiKey);
    };


    document.getElementById('API-save')?.addEventListener('click', () => {
      const provider = document.getElementById('model-select')?.value || 'eliza';
      const key = document.getElementById('model-input')?.value || '';
      if (!key) return alert('Please enter an API key to save for ' + provider);
      localStorage.setItem(`apiKey_${provider}`, key);
      alert('API key saved to localStorage for ' + provider + '. (Do not commit keys to Git!)');
    });

    const controller = new ChatController(model, view, getBotResponse);
    
    console.log('Chat application initialized');
  }
});