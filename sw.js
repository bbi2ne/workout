// 운동로그 푸쉬 알림 받기 (앱을 닫아도 알림이 오게 해줘요)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || '운동로그', {
    body: d.body || '운동할 시간이에요!',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: d.tag || 'pk',
    renotify: true,
    vibrate: [90, 60, 90, 60, 160],
    data: { url: './' },
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow((e.notification.data && e.notification.data.url) || './');
  }));
});
