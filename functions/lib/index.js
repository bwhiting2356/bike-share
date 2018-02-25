"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var admin = require("firebase-admin");
var userDataUpdated_1 = require("./userDataUpdated");
admin.initializeApp(functions.config().firebase);
exports.userDataUpdated = userDataUpdated_1.userDataUpdated;
exports.helloWorld = functions.https.onRequest(function (req, res) {
    console.log("hello from console");
    res.send("Hello World");
    // ...
});
//# sourceMappingURL=index.js.map