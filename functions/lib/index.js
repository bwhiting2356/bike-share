"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
    console.log("hello world triggered");
});
exports.itemNameUppercase = functions.firestore.document('items/{itemId}').onCreate((event) => {
    const data = event.data.data();
    console.log("data: ", data);
    return event.data.ref.set({ test: 'testy test' }, { merge: true });
});
exports.findNearbyStations = functions.firestore.document('users/{userId}').onUpdate(event => {
    const searchDestination = event.data.data().searchDestination;
    const searchOrigin = event.data.data().searchOrigin;
    console.log('search origin ', searchOrigin);
    console.log('search destination ', searchDestination);
    return Promise.resolve();
});
//# sourceMappingURL=index.js.map