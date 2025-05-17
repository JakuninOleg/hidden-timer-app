<template>
   <div class="p-4 max-w-md mx-auto">
     <h1 class="text-xl font-bold mb-4">Скрытый Таймер</h1>
 
     <p class="mb-2">
       Статус таймера: 
       <span :class="isRunning ? 'text-green-500' : 'text-red-500'">
         {{ isRunning ? 'Запущен' : 'Остановлен' }}
       </span>
     </p>
 
     <div class="space-x-4">
       <button @click="startTimer" :disabled="isRunning" class="bg-blue-500 text-white px-4 py-2 rounded">
         Запустить
       </button>
       <button @click="stopTimer" :disabled="!isRunning" class="bg-red-500 text-white px-4 py-2 rounded">
         Остановить
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
   const randomMinutes = Math.floor(Math.random() * 6) + 10 // от 10 до 15 минут
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
 