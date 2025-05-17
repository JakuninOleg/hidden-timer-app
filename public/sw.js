self.addEventListener('push', function (event) {
   const data = event.data ? event.data.json() : {};
   const title = data.title || 'Таймер сработал!';
   const options = {
     body: data.body || 'Прошло от 10 до 15 минут!',
     icon: '/icon-192.png',
     badge: '/icon-192.png',
   };
 
   event.waitUntil(self.registration.showNotification(title, options));
 });
 
 self.addEventListener('notificationclick', function (event) {
   event.notification.close();
   event.waitUntil(clients.openWindow('/'));
 });