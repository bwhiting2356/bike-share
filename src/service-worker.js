/**
 * Check out https://googlechromelabs.github.io/sw-toolbox/ for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */

// self.addEventListener('fetch', function(event) {
//   if (event.request.url.includes("https://maps.googleapis.com/")) {
//     console.log('request to google');
//     console.log(event.request);
//     event.respondWith(
//       // Handle Maps API requests in a generic fashion,
//       // by returning a Promise that resolves to a Response.
//       fetch(event.request)
//     );
//   } else {
//     event.respondWith(
//       // Some default handling.
//       fetch(event.request)
//     );
//   }
// });



'use strict';
importScripts('./build/sw-toolbox.js');

self.toolbox.options.cache = {
  name: 'ionic-cache'
};

// pre-cache our key assets
self.toolbox.precache(
  [
    './build/main.js',
    './build/vendor.js',
    './build/main.css',
    './build/polyfills.js',
    'index.html',
    'manifest.json'
  ]
);


self.toolbox.router.any('https://maps.gstatic.com/mapfiles/*', self.toolbox.fastest);
self.toolbox.router.any('https://maps.googleapis.com/*', self.toolbox.fastest);

// dynamically cache any other local assets
self.toolbox.router.any('/*', self.toolbox.fastest);

// for any other requests go to the network, cache,
// and then only use that cached resource if your user goes offline
self.toolbox.router.default = self.toolbox.networkFirst;
//
// // TODO: cache google maps assets? or handle errors properly
