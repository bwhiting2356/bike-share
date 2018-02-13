const functions = require('firebase-functions');
const admin = require('firebase-admin');
const testNextDoor = require('./testNextDoor').testNextDoor;
const findNearestStation = require('./googleMaps/findNearestStations').findNearestStations;
const testAsyncHttp = require('./testAsyncHttp').testAsyncHttp;
admin.initializeApp(functions.config().firebase);
exports.helloWorldUpdate = functions.https.onRequest(function (request, response) {
    console.log("hello world triggered");
    response.send("Hello from Firebase updated!");
});
exports.testNextDoor = testNextDoor;
exports.findNearestStation = findNearestStation;
exports.testAsyncHttp = testAsyncHttp;
//# sourceMappingURL=index.js.map