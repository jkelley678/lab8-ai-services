class ChatView {
  constructor(component) {
    this.messagesContainer = component.querySelector('.messages');
    this.form = component.querySelector('form.input-area');
    this.input = component.querySelector('input');
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
    let controls = null;
    if (sender === 'user') {
      controls = document.createElement('div');
      controls.className = 'controls';

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'delete-button';
      deleteBtn.addEventListener('click', () => onDelete(messageEl));
      controls.appendChild(deleteBtn);

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.className = 'edit-button';
      editBtn.addEventListener('click', () => onEdit(textEl, id));
      controls.appendChild(editBtn);

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
    this.messageCountEl.textContent = Math.max(0, current + Number(deltaOrReset));
  }

  getInputValue() {
    return this.input.value.trim();
  }

  clearInput() {
    this.input.value = '';
  }
}

export { ChatView };