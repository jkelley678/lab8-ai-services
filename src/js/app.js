import { getBotResponse } from './eliza.js';
import { ChatModel } from './model.js';
import { ChatView } from './view.js';
import { ChatController } from './controller.js';

document.addEventListener('DOMContentLoaded', () => {
  const chatElement = document.querySelector('simple-chat');
  
  if (chatElement) {
    const model = new ChatModel();
    const view = new ChatView(chatElement);
    const controller = new ChatController(model, view, getBotResponse);
    
    console.log('Chat application initialized');
  }
});