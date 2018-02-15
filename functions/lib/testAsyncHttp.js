const functions = require('firebase-functions');
const admin = require('firebase-admin');
exports.testAsyncHttp = functions.https.onRequest(function (request, response) {
    console.log("async http logging");
    const a = new Promise(function (resolve) {
        setTimeout(function () {
            resolve(response.send("async http response"));
        }, 1000);
    });
});
//# sourceMappingURL=testAsyncHttp.js.map