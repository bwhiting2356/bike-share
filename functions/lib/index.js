"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var admin = require("firebase-admin");
var searchParamsUpdated_1 = require("./searchParamsUpdated");
var searchBikeTrips_1 = require("./searchBikeTrips");
admin.initializeApp(functions.config().firebase);
exports.searchParamsUpdated = searchParamsUpdated_1.searchParamsUpdated;
exports.searchBikeTrips = searchBikeTrips_1.searchBikeTrips;
//# sourceMappingURL=index.js.map