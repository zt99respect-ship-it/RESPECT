/* ============================================================
   Firebase Messaging Service Worker
   ساحة ريسبكت
============================================================ */

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCxX6kwjy2U4uyTZbBnZuhfjLNqSkCXrk4",
  authDomain: "saha-respect-149d4.firebaseapp.com",
  projectId: "saha-respect-149d4",
  storageBucket: "saha-respect-149d4.firebasestorage.app",
  messagingSenderId: "236494459097",
  appId: "1:236494459097:web:92184d85361c606e27aec8"
});

const messaging = firebase.messaging();

/* استقبال الإشعارات في الخلفية */
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message:', payload);

  const title = payload.notification?.title || payload.data?.title || 'ساحة ريسبكت';
  const body = payload.notification?.body || payload.data?.body || '';
  const image = payload.notification?.image || payload.data?.image || '';
  const url = payload.data?.url || '/';

  const options = {
    body: body,
    icon: '/RESPECT/icon-192.png',
    badge: '/RESPECT/icon-192.png',
    image: image || undefined,
    dir: 'rtl',
    lang: 'ar',
    vibrate: [200, 100, 200],
    tag: 'saha-respect-notif',
    renotify: true,
    data: { url: url }
  };

  self.registration.showNotification(title, options);
});

/* عند الضغط على الإشعار */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
