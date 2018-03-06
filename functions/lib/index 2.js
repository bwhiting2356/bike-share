"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var admin = require("firebase-admin");
var userDataUpdated_1 = require("./userDataUpdated");
admin.initializeApp(functions.config().firebase);
exports.userDataUpdated = userDataUpdated_1.userDataUpdated;
//# sourceMappingURL=index 2.js.map