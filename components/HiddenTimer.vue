<template>
   <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md text-stopwatchBlue">
     <h1 class="text-2xl font-bold mb-4">⏱ Скрытый Таймер</h1>
     <p class="mb-4 text-lg">
       Статус:
       <span :class="isRunning ? 'text-green-600' : 'text-red-600'">
         {{ isRunning ? 'Запущен' : 'Остановлен' }}
       </span>
     </p>
     <div class="flex gap-4">
       <button
         @click="startTimer"
         :disabled="isRunning"
         class="bg-stopwatchYellow text-stopwatchBlue px-4 py-2 rounded-xl font-semibold shadow hover:bg-yellow-300 transition"
       >
         ▶ Запустить
       </button>
       <button
         @click="stopTimer"
         :disabled="!isRunning"
         class="bg-stopwatchBlue text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-blue-800 transition"
       >
         ⏹ Остановить
       </button>
     </div>
   </div>
 </template>
 
 <script setup>
 import { ref, onMounted, onBeforeUnmount } from 'vue';
 
 const isRunning = ref(false);
 let worker = null;
 
 const startTimer = () => {
   if (isRunning.value) return;
   isRunning.value = true;
 
   const delay = (Math.floor(Math.random() * 6) + 10) * 60 * 1000; // 10-15 минут
 
   worker = new Worker('/timerWorker.js');
   worker.postMessage({ command: 'start', delay });
 
   worker.onmessage = async (e) => {
     if (e.data === 'timeout') {
       await notify();
       isRunning.value = false;
       worker.terminate();
       worker = null;
     }
   };
 };
 
 const stopTimer = () => {
   if (worker) {
     worker.postMessage({ command: 'stop' });
     worker.terminate();
     worker = null;
   }
   isRunning.value = false;
 };
 
 const notify = async () => {
   if ('Notification' in window && Notification.permission === 'granted') {
     try {
       const registration = await navigator.serviceWorker.ready;
       registration.showNotification('Таймер сработал!', {
         body: 'Прошло от 10 до 15 минут!',
         icon: '/icon-192.png',
         badge: '/icon-192.png',
       });
     } catch (error) {
       console.error('Error showing notification:', error);
     }
   } else if ('Notification' in window && Notification.permission !== 'denied') {
     const permission = await Notification.requestPermission();
     if (permission === 'granted') {
       await notify();
     }
   }
 };
 
 onMounted(async () => {
   if ('Notification' in window && Notification.permission !== 'granted') {
     await Notification.requestPermission();
   }
 });
 
 onBeforeUnmount(() => {
   if (worker) {
     worker.terminate();
     worker = null;
   }
 });
 </script>