<template>
  <div id="app">
    <div class="chat">
      <select v-model="currentRoom" @change="changeRoom">
        <option v-for="room in rooms" :key="room" :value="room">{{ room }}</option>
      </select>
      <div class="messages">
        <div v-for="message in messages" :key="message.id">{{ message.text }}</div>
      </div>
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message" />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      newMessage: '',
      messages: [],
      socket: null,
      currentRoom: 'General',
      rooms: ['General', 'Sports', 'Technology'],
    };
  },
  created() {
    this.socket = io('http://localhost:3000');
    this.socket.on('message', this.receiveMessage);
    this.socket.on('update messages', this.updateMessages);  // новый обработчик событий
    this.joinRoom(this.currentRoom);
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() !== '') {
        this.socket.emit('message', this.currentRoom, this.newMessage);
        this.newMessage = '';
      }
    },
    receiveMessage(message) {
      this.messages.push({ text: message, id: this.messages.length });
    },
    joinRoom(room) {
      this.socket.emit('join room', room);
    },
    changeRoom() {
      this.socket.emit('leave room', this.currentRoom);
      this.messages = [];
      this.joinRoom(this.currentRoom);
    },
    updateMessages(messages) {
      this.messages = messages.map((message, index) => ({ text: message, id: index }));
    },
  },
};
</script>

<style>
#app {
  text-align: center;
  margin-top: 60px;
}
.chat {
  width: 300px;
  margin: auto;
}
.messages {
  border: 1px solid #ccc;
  padding: 10px;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 10px;
}
</style>
