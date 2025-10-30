class ChatView {
  constructor(component) {
    this.messagesContainer = component.querySelector('.messages');
    this.form = component.querySelector('form.input-area');
    this.input = component.querySelector('input#message-input');
    this.clearButton = document.getElementById('clear-button');
    this.messageCountEl = document.getElementById('message-count');
  }
  /**
   * Render a message in the messages container.
   *
   * If sender is 'user' action controls (Delete/Edit) are added and their
   * callbacks wired. A timestamp is appended to every message.
   *
   * @param {string} sender - Message sender identifier (e.g. 'user'|'bot').
   * @param {string} text - Message text to render.
   * @param {number|string} id - Unique id associated with the message (used for edits/deletes).
   * @param {(messageEl: HTMLElement) => void} onDelete - Callback invoked when delete button clicked.
   * @param {(textEl: HTMLElement, id: number|string) => void} onEdit - Callback invoked when edit button clicked.
   * @returns {void}
   */
  addMessage(sender, text, id, onDelete, onEdit) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${sender}`;
    messageEl.dataset.id = id;

    const textEl = document.createElement('div');
    textEl.textContent = text;
    messageEl.appendChild(textEl);

    let controls;

    if (sender === 'user') {
      controls = document.createElement('div');
      controls.className = 'controls';
      
      const editButton = document.createElement('button');
      editButton.className = 'edit-button';
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => onEdit(textEl.textContent, id));

      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => onDelete(messageEl));

      controls.appendChild(editButton);
      controls.appendChild(deleteButton);
      messageEl.appendChild(controls);
    }
    
    const timestampEl = document.createElement('span');
    const now = new Date();
    timestampEl.textContent = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
    timestampEl.className = 'timestamp';
    if (controls) {
      controls.appendChild(timestampEl);
    } else {
      messageEl.appendChild(timestampEl);
    }

    this.messagesContainer.appendChild(messageEl);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    this.updateMessageCount(1);
  }
  /**
   * Update the text of an existing message element.
   * Used to change a temporary placeholder to the final response.
   * @param {number} id - The id of the message to edit.
   * @param {string} newText - The new text for the message.
   * @returns {void}
   */
  editMessage(id, newText) { // <--- NEW METHOD
    // Find the message element by its data-id attribute
    const messageEl = this.messagesContainer.querySelector(`[data-id="${id}"]`);
    if (messageEl) {
        // The actual message text is held in the first child <div>
        messageEl.querySelector('div:first-child').textContent = newText;
    }
  }
  /**
   * Delete a message element from the view and update the count.
   *
   * @param {number} id - The id of the message to remove.
   * @returns {void}
   */
  deleteMessage(id) {
    const messageEl = this.messagesContainer.querySelector(`[data-id="${id}"]`);
    if (messageEl) {
        this.messagesContainer.removeChild(messageEl);
        this.updateMessageCount(-1);
    }
  }
  /**
   * Get the current value from the message input field.
   * @returns {string} - The current input value.
   */
  getInputValue() {
    return this.input.value.trim();
  }
  /**
   * Set the current value of the message input field.
   * @param {string} value - The new value to set.
   * @returns {void}
   */
  setInputValue(value) {
    this.input.value = value;
  }
  /**
   * Clear all rendered messages from the view and update the count.
   *
   * @returns {void}
   */
  clearChat() {
    this.messagesContainer.innerHTML = '';
    this.updateMessageCount(true);
  }
  /**
   * Update the displayed message count.
   * @param {number|boolean} deltaOrReset - Numeric delta to apply or true to recalculate.
   * @returns {void}
   */
  updateMessageCount(deltaOrReset) {
    if (!this.messageCountEl) return;
    if (deltaOrReset === true) {

      const count = this.messagesContainer.querySelectorAll('.message').length;
      this.messageCountEl.textContent = count;
      return;
    }
    const current = parseInt(this.messageCountEl.textContent || '0', 10);
    this.messageCountEl.textContent = current + deltaOrReset;
  }
}

export { ChatView };