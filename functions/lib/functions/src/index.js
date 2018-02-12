"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
exports.helloWorldUpdate = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase updated!");
    console.log("hello world triggered");
});
//
// export const itemNameUppercase = functions.firestore.document('items/{itemId}').onCreate((event) => {
//   const data = event.data.data();
//   console.log("data: ", data);
//   return event.data.ref.set({test: 'testy test'}, {merge: true});
// });
const mapGeoPointToLatLng = (geopoint) => {
    return { lat: geopoint.coords._latitude, lng: geopoint.coords._longitude };
};
exports.findNearest = functions.firestore.document('users/{userId}').onUpdate(event => {
    console.log('hello line 34');
    // admin.firestore().collection('stations')
    //   .get()
    //   .then(querySnapShot => {
    //     let stations = [];
    //     querySnapShot.forEach(doc => {
    //       let station: LatLng = mapGeoPointToLatLng(doc.data());
    //       stations.push(station);
    //     });
    //
    //
    //     console.log(stations);
    //   })
    // const searchDestination = event.data.data().searchDestination;
    // const searchOrigin = event.data.data().searchOrigin;
    // console.log('search origin ', searchOrigin);
    // console.log('search destination ', searchDestination);
    return Promise.resolve();
});
//# sourceMappingURL=index.js.map