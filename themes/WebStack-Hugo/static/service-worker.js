var cacheName = 'Noise导航-v1.0';
var assetsToCache = [
  'static/assets/bgx/bg1.webp',
  'static/assets/bgx/bg2.webp',
  'static/assets/bgx/bg3.webp',
  'static/assets/bgx/bg4.webp',
  'static/assets/bgx/bg5.webp',
  'static/assets/bgx/bg6.webp',
  'static/assets/bgx/bg7.webp',
  'static/assets/bgx/bg8.webp',
 
  // 添加您需要缓存的其他静态资源
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(assetsToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== cacheName;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  var request = event.request;

  if (request.method !== 'GET') {
    event.respondWith(fetch(request));
    return;
  }

  if (isCriticalRequest(request)) {
    event.respondWith(
      caches.match(request).then(function(response) {
        return response || fetchAndCache(request);
      })
    );
  } else {
    event.respondWith(lazyLoad(request));
  }
});

function fetchAndCache(request) {
  return fetch(request).then(function(networkResponse) {
    return caches.open(cacheName).then(function(cache) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    });
  }).catch(function() {
    return caches.match('/index.html');
  });
}

function isCriticalRequest(request) {
  return request.url.includes('/home/');
}

function lazyLoad(request) {
  return fetch(request).catch(function() {
    return caches.match(request);
  });
}

function cleanUpCache() {
  caches.keys().then(function(cacheNames) {
    cacheNames.forEach(function(cacheName) {
      caches.open(cacheName).then(function(cache) {
        cache.keys().then(function(keys) {
          keys.forEach(function(key) {
            // 根据需求实现清理逻辑，例如基于最后修改时间或大小
          });
        });
      });
    });
  });
}

function monitorPerformance() {
  self.performance = self.performance || {};
  self.performance.timing = performance.timing;
  self.performance.navigation = performance.navigation;

  // 记录缓存命中情况
  self.addEventListener('fetch', function(event) {
    if (event.request.method === 'GET') {
      event.respondWith(
        caches.match(event.request).then(function(response) {
          if (response) {
            self.performance.cacheHits = self.performance.cacheHits || 0;
            self.performance.cacheHits++;
          } else {
            self.performance.cacheMisses = self.performance.cacheMisses || 0;
            self.performance.cacheMisses++;
          }
          return response || fetch(event.request);
        })
      );
    }
  });
}
// 定时刷新缓存
//setInterval(function() {
//  updateCache();
// }, 24 * 60 * 60 * 1000);

//function updateCache() {
//  assetsToCache.forEach(function(asset) {
//    fetchAndCache(new Request(asset));
//  });
// }

// 初始化性能监控和缓存清理
monitorPerformance();
cleanUpCache();
