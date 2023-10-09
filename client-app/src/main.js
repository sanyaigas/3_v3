// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');
console.log('Connected to server');

socket.on('message', message => {
  console.log('Received message:', message);
});

createApp(App).mount('#app');