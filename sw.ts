self.addEventListener('push', (event) => {
   const data = event.data?.json();
   const title = data?.title || 'Уведомление';
   const options = {
     body: data?.body || 'У вас новое уведомление.',
     icon: '/icon-192.png',
   };
   event.waitUntil(self.registration.showNotification(title, options));
 });
 