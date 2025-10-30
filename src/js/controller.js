class ChatController {
  constructor(model, view, getBotResponse) {
    this.model = model;
    this.view = view;
    this.getBotResponse = getBotResponse;
    
    this.loadMessages();
    this.addBotMessage('Hello! How can I help you today?');
    this.initEventListeners();
  }
  
  /**
   * Wire DOM event listeners for form submit, clear, export and import controls.
   * @returns {void}
   */
  initEventListeners() {
    this.view.form?.addEventListener('submit', (e) => this.handleSubmit(e));
    this.view.clearButton?.addEventListener('click', () => this.clearChat());
    document.getElementById('export-button')?.addEventListener('click', () => this.exportLocalStorage());
    document.getElementById('import-button')?.addEventListener('click', () => this.importLocalStorage());
  }

  /**
   * Handle form submission from the view.
   * NOTE: This function is synchronous to ensure the user message is sent instantly.
   *
   * @param {Event} event - The submit event from the form.
   * @returns {void}
   */
  handleSubmit(event) {
    event.preventDefault();
    const message = this.view.getInputValue();
    if (!message) return;

    this.addUserMessage(message); 
    this.view.setInputValue(''); 

    this.getBotResponse(message)
        .then(response => {
            this.addBotMessage(response);
        })
        .catch(error => {
            console.error('LLM/Eliza call failed:', error);
            this.addBotMessage(`[Error] Failed to get response: ${error.message || error}`);
        });
  }

  /**
   * Add a user message to the model and view.
   * @param {string} text - Message text.
   * @returns {void}
   */
  addUserMessage(text) {
    const message = this.model.addMessage('user', text);
    this.view.addMessage(
      message.sender, 
      message.text, 
      message.id, 
      () => this.deleteMessage(message.id), 
      this.editUserMessage.bind(this)
    );
    this.saveMessages();
  }

  /**
   * Add a bot message to the model and view.
   * @param {string} text - Message text.
   * @returns {void}
   */
  addBotMessage(text) {
    const message = this.model.addMessage('bot', text);
    this.view.addMessage(message.sender, message.text, message.id);
    this.saveMessages();
  }

  /**
   * Delete a message from the model and view.
   * @param {number} id - The id of the message to delete.
   * @returns {void}
   */
  deleteMessage(id) {
    this.model.deleteMessage(id);
    this.view.deleteMessage(id);
    this.saveMessages();
  }
  
  /**
   * Handles the message editing process.
   * It takes the message text element, shows a prompt, and if successful,
   * updates the model and view.
   * * @param {HTMLElement} textEl - The element containing the text to edit.
   * @param {number} id - The id of the message being edited.
   * @returns {void}
   */
  editUserMessage(textEl, id) {
    const oldText = textEl.textContent;
    const newText = prompt('Edit your message:', oldText);

    if (newText && newText.trim() !== oldText.trim()) {
      this.model.editMessage(id, newText.trim());

      this.view.editMessage(id, newText.trim());
      
      this.saveMessages();
    }
  }

  /**
   * Load messages from localStorage and render them.
   * @returns {void}
   */
  loadMessages() {
    try {
      const messagesJSON = localStorage.getItem('chatMessages');
      if (messagesJSON) {
        this.model.messages = JSON.parse(messagesJSON);
        this.model.messages.forEach(message => {

          let onDeleteCallback = undefined;
          let onEditCallback = undefined;

          if (message.sender === 'user') {
            onDeleteCallback = () => this.deleteMessage(message.id);
            onEditCallback = this.editUserMessage.bind(this);
          }


          this.view.addMessage(
            message.sender, 
            message.text, 
            message.id, 
            onDeleteCallback, 
            onEditCallback    
          );
        });
      }
    } catch (e) {
      console.error('Error loading messages from localStorage', e);
    }
  }

  /**
   * Saves the current messages array to localStorage.
   * @returns {void}
   */
  saveMessages() {
    try {
      localStorage.setItem('chatMessages', JSON.stringify(this.model.messages));
    } catch (e) {
      console.error('Error saving messages to localStorage', e);
    }
  }

  /**
   * Clear all messages from the model, view, and localStorage.
   * @returns {void}
   */
  clearChat() {
    if (!confirm('Are you sure you want to clear the entire chat history? This cannot be undone.')) return;
    this.model.messages = [];
    this.view.clearChat();
    this.saveMessages();
    this.addBotMessage('Hello! How can I help you today?');
  }

  /**
   * Export all localStorage data (including chat messages and API keys) to a JSON file.
   * @returns {void}
   */
  exportLocalStorage() {
    try {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key === 'chatMessages') {
          data[key] = JSON.parse(localStorage.getItem(key));
        } else {
          data[key] = localStorage.getItem(key);
        }
      }

      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement('a'), {
        href: url,
        download: `chat-export-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
      });
      document.body.append(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
      alert('Failed to export localStorage. See console for details.');
    }
  }

  async importLocalStorage() {
    try {
      const input = Object.assign(document.createElement('input'), { type: 'file', accept: '.json' });
      input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const data = JSON.parse(await file.text());
        if (!data.chatMessages) return alert('Invalid file format. No chatMessages found.');

        localStorage.clear();

        Object.entries(data).forEach(([k, v]) => {
          const valueToStore = (k === 'chatMessages') ? JSON.stringify(v) : v;
          localStorage.setItem(k, valueToStore);
        });

        this.model.messages = data.chatMessages;
        this.view.clearChat();
        this.loadMessages();
        this.saveMessages();

        alert('Chat history successfully imported! Reloading chat...');
      });
      input.click(); 
    } catch (e) {
      console.error('Import failed', e);
      alert('Failed to import data. See console for details.');
    }
  }
}

export { ChatController };