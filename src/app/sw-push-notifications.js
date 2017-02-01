self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data && event.data.text()}"`);

  var data = event.data ? JSON.parse(event.data.text()) : {};

  if (data && data.title) {
    var options = {
      body: data.title,
      icon: 'app/images/icon-128x128.png',
      badge: 'app/images/icon-128x128.png'
    };

    event.waitUntil(self.registration.showNotification('تذكير', options));
  } else {
    console.log('Push data malformed: ', event.data);
  }
});

self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();
  event.waitUntil(clients.openWindow('https://ahimta.github.io/bagi/'));
});
