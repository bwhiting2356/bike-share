const functions = require('firebase-functions');
const admin = require('firebase-admin');
const testNextDoor = require('./testNextDoor').testNextDoor;
const findNearestStation = require('./findNearestStations').findNearestStations;

admin.initializeApp(functions.config().firebase);



exports.helloWorldUpdate = functions.https.onRequest(function(request, response) {
  console.log("hello world triggered");
  response.send("Hello from Firebase updated!");

});

exports.testNextDoor = testNextDoor;
exports.findNearestStation = findNearestStation;






