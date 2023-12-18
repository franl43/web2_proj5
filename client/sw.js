const filesToCache = [
    "/",
    "manifest.json",
    "index.html",
    "offline.html",
    "404.html",
    "/public/images/logo.png",
    "https://fonts.googleapis.com/css?family=Ubuntu",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
    "./public/css/style.css",
    "./public/js/index.js",
];

const staticCache = "static-cache-rodeo-fans";
const dynamicCache = "dynamic-cache-rodeo-fans";

self.addEventListener("install", (e) => {
    console.log("Attempting to install service worker and cache static assets");
    e.waitUntil(
        caches.open(staticCache).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener("activate", (e) => {
    const cacheWhitelist = [staticCache];
    // delete every other cahe except static
    e.waitUntil(
        caches.keys().then((cNames) => {
            return Promise.all(
                cNames.map((cn) => {
                    if (cacheWhitelist.indexOf(cn) === -1) {
                        return caches.delete(cn);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request)
            .then((res) => {
                // if cached return from cache
                if (res) {
                    return res;
                }
                // else go to network
                return fetch(e.request)
                    .then((res) => {
                        if (res.status === 404) {
                            return caches.match("404.html");
                        }
                        return caches.open(dynamicCache)
                            .then((c) => {
                                // put images in dynamic cache
                                if(e.request.destination === 'image') {
                                    c.put(e.request.url, res.clone());
                                }
                                return res;
                            });
                    });
            })
            .catch((err) => {
                return caches.match("offline.html");
            })
    );
});
