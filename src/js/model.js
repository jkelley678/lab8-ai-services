class ChatModel {
  constructor() {
    this.messages = [];
  }
  /**
   * Add a message to the model.
   *
   * @param {string} sender - Who sent the message (e.g. 'user'|'bot').
   * @param {string} text - Message text.
   * @returns {{id: number, sender: string, text: string, timestamp: Date}} The created message object.
   */
  addMessage(sender, text) {
    const message = {
      id: Date.now(),
      sender,
      text,
      timestamp: new Date()
    };
    this.messages.push(message);
    return message;
  }
  /**
   * Delete a message by id.
   * If the id is not found no action is taken.
   * @param {number} id - The id of the message to remove.
   * @returns {void}
   */
  deleteMessage(id) {
    const index = this.messages.findIndex(msg => msg.id === id);
    if (index !== -1) { 
        this.messages.splice(index, 1);
    }
  }
  /**
   * Edit the text of an existing message.
   * If the id is not found no action is taken.
   * @param {number} id - The id of the message to edit.
   * @param {string} newText - The new text for the message.
   * @returns {void}
   */
  editMessage(id, newText) { // <--- NEW METHOD
    const message = this.messages.find(msg => msg.id == id);
    if (message) {
      message.text = newText;
    }
  }
}

export { ChatModel };