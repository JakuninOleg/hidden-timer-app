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
   console.log('Starting timer...');
   isRunning.value = true;
 
   // Для теста: const delay = 10 * 1000; // 10 секунд
   // const delay = (Math.floor(Math.random() * 6) + 10) * 60 * 1000; // 10-15 минут
   const delay = 10 * 1000;
   console.log(`Timer set for ${delay / 1000 / 60} minutes`);
 
   try {
     worker = new Worker('/timeWorker.js');
     worker.postMessage({ command: 'start', delay });
 
     worker.onmessage = async (e) => {
       console.log('Worker message:', e.data);
       if (e.data === 'timeout') {
         console.log('Timer triggered, sending notification');
         await notify();
         isRunning.value = false;
         worker.terminate();
         worker = null;
         // Удален вызов startTimer(), чтобы таймер завершался
       } else if (e.data === 'stopped') {
         console.log('Timer stopped by worker');
         isRunning.value = false;
         worker.terminate();
         worker = null;
       }
     };
 
     worker.onerror = (error) => {
       console.error('Worker error:', error);
       isRunning.value = false;
       if (worker) {
         worker.terminate();
         worker = null;
       }
     };
   } catch (error) {
     console.error('Failed to create worker:', error);
     isRunning.value = false;
   }
 };
 
 const stopTimer = async () => {
   if (worker) {
     console.log('Stopping timer...');
     worker.postMessage({ command: 'stop' });
     await new Promise((resolve) => setTimeout(resolve, 100)); // Ждем обработки
     worker.terminate();
     worker = null;
     console.log('Timer stopped');
   }
   isRunning.value = false;
 };
 
 const notify = async () => {
   console.log('Attempting to send notification...');
   console.log('Notification permission:', Notification.permission);
   if ('Notification' in window && Notification.permission === 'granted') {
     try {
       const registration = await navigator.serviceWorker.ready;
       console.log('Service worker ready:', registration);
       await registration.showNotification('Таймер сработал!', {
         body: 'Прошло от 10 до 15 минут!',
         icon: '/icon-192.png',
         badge: '/icon-192.png',
       });
       console.log('Notification sent successfully');
     } catch (error) {
       console.error('Error showing notification:', error);
     }
   } else if ('Notification' in window && Notification.permission !== 'denied') {
     console.log('Requesting notification permission...');
     const permission = await Notification.requestPermission();
     console.log('Permission result:', permission);
     if (permission === 'granted') {
       await notify();
     } else {
       console.log('Notification permission denied');
     }
   } else {
     console.log('Notifications not supported or permission denied');
   }
 };
 
 onMounted(async () => {
   console.log('Component mounted, checking notification permission...');
   if ('Notification' in window && Notification.permission !== 'granted') {
     await Notification.requestPermission();
   }
   // Удален вызов startTimer(), чтобы таймер не запускался автоматически
 });
 
 onBeforeUnmount(() => {
   console.log('Component unmounting, cleaning up...');
   if (worker) {
     worker.postMessage({ command: 'stop' });
     worker.terminate();
     worker = null;
   }
 });
 </script>