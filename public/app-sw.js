importScripts('indexed-db-sw.js');
var SYM_CACHE_NAME = 'SYMPER-CACHE';
var SYM_IDB_NAME = 'SYMPER-IDB-STORE';
const STORE_REQUEST_NAME = 'requestes';
var symRequestStore = new IndexedDB(SYM_IDB_NAME);
self.addEventListener('install', function(evt) {
    evt.waitUntil(precache().then(function() {
        return self.skipWaiting();
    }));
});

self.addEventListener('activate', function(evt) {
    evt.waitUntil(self.clients.claim());
    symRequestStore.open(STORE_REQUEST_NAME);
});


self.addEventListener('fetch', function(event) {
    let cacheStrategy = event.request.headers.get('Symper-Cache-Strategy');
    if (event.request.method == 'GET') {
        if (cacheStrategy == 'cache-first') {
            handleCacheFirstStrategy(event);
        } else if (!event.request.url.includes('http://')) {
            handleNetworkFirstStrategy(event);
        }
    } else {
        handleChangeDataRequest(event);
    }
});



function handleChangeDataRequest(event) {
    event.respondWith(
        fetch(event.request.clone())
        .then((response) => {
            return response;
        }).catch(function(e) {
            event.request.clone().text().then(function(body) {
                let now = Date.now();
                symRequestStore.add({
                    create_time: now,
                    due_time: now + EXPIRE_TIME,
                    payload: body,
                    url: event.request.url,
                    name: event.request.headers.get('Symper-Request-Name'),
                    method: event.request.method
                });
                return new Response('{"status":0,"message":"Không thể cập nhật dữ liệu do kết nối mạng bị mất!"}', {
                    headers: { 'Content-Type': 'application/json' }
                });
            });
        })
    );
}

function handleCacheFirstStrategy(event) {
    console.log('cần lấy data từ cache');
    event.respondWith(
        caches.match(event.request).then((resp) => {
            if (!resp) {
                console.log('trong cache không có dữ liệu, cần lấy từ server');
            }
            return resp || fetch(event.request).then((response) => {
                let responseClone = response.clone();
                console.log('đã lấy được data từ server, cần đẩy data vào cache');
                caches.open(SYM_CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            });
        }).catch(() => {
            return new Response('{"status":0,"message":"Không thể lấy dữ liệu do kết nối mạng bị mất!"}', {
                headers: { 'Content-Type': 'application/json' }
            });
        })
    );
}

function handleNetworkFirstStrategy(event) {
    console.log('cần lấy data từ server');
    event.respondWith(
        fetch(event.request)
        .then((response) => {
            let responseClone = response.clone();
            caches.open(SYM_CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
            });
            console.log('đã lấy được data từ server');
            return response;
        }).catch(function(e) {
            console.warn('Không có kết nối mạng, cần lấy từ cache', e);
            return caches.open(SYM_CACHE_NAME).then(function(cache) {
                return cache.match(event.request).then((resp) => {
                    return resp || new Response('{"status":0,"message":"Không thể lấy dữ liệu do kết nối mạng bị mất!"}', {
                        headers: { 'Content-Type': 'application/json' }
                    });
                });
            });
        })
    );
}


async function fetchFromCache(request) {
    return await caches.open(SYM_CACHE_NAME).then(async function(cache) {
        return await cache.match(request).then(function(matching) {
            return matching;
        }).catch((err) => {
            console.warn('Cannot query cache!', err);
            return false;
        });
    }).catch((err) => {
        console.warn('Cannot open cache storage!', err);
        return false;
    });
}

function precache() {
    return caches.open(SYM_CACHE_NAME).then(function(cache) {
        // return cache.addAll([
        //     './controlled.html'
        // ]);
    });
}


async function getRequestPayload(request) {
    let serialized = {};
    // Only if method is not `GET` or `HEAD` is the request allowed to have body.
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        return await request.clone().json().then(function(body) {
            serialized.body = body;
            return Promise.resolve(serialized);
        });
    }
    return {};
}