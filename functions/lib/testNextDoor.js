var functions = require('firebase-functions');
var admin = require('firebase-admin');
exports.testNextDoor = functions.https.onRequest(function (request, response) {
    console.log("test next door triggered");
    response.send("Hello from Text Next Door!");
});
//# sourceMappingURL=testNextDoor.js.map