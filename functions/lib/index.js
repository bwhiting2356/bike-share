"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var admin = require("firebase-admin");
var searchParamsUpdated_1 = require("./searchParamsUpdated");
admin.initializeApp(functions.config().firebase);
exports.searchParamsUpdated = searchParamsUpdated_1.searchParamsUpdated;
//# sourceMappingURL=index.js.map