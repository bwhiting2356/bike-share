"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var admin = require("firebase-admin");
var userDataUpdated_1 = require("./userDataUpdated");
var bookTrip_1 = require("./bookTrip");
admin.initializeApp(functions.config().firebase);
exports.userDataUpdated = userDataUpdated_1.userDataUpdated;
exports.bookTrip = bookTrip_1.bookTrip;
//# sourceMappingURL=index.js.map