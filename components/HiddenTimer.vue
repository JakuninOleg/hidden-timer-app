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
 import { ref } from 'vue'
 
 const isRunning = ref(false)
 let timeoutId = null
 
 const requestNotificationPermission = async () => {
   if ('Notification' in window) {
     const permission = await Notification.requestPermission()
     return permission === 'granted'
   }
   return false
 }
 
 const notify = () => {
   if (Notification.permission === 'granted') {
     new Notification('Таймер сработал!', {
       body: 'Прошло от 10 до 15 минут!',
       icon: '/icon-192.png',
     })
   }
 }
 
 const startTimer = async () => {
   const granted = await requestNotificationPermission()
   if (!granted) {
     alert('Разрешите уведомления для корректной работы.')
     return
   }
 
   isRunning.value = true
   const randomMinutes = Math.floor(Math.random() * 6) + 10
   const timeoutMs = randomMinutes * 60 * 1000
 
   timeoutId = setTimeout(() => {
     notify()
     isRunning.value = false
   }, timeoutMs)
 }
 
 const stopTimer = () => {
   clearTimeout(timeoutId)
   isRunning.value = false
 }
 </script>
 