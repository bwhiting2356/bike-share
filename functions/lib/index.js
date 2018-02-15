"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var admin = require("firebase-admin");
var findNearestStations_1 = require("./googleMaps/findNearestStations");
var findTripDirections_1 = require("./googleMaps/findTripDirections");
var testAsyncHttp_1 = require("./testAsyncHttp");
var getDirections_1 = require("./googleMaps/getDirections");
admin.initializeApp(functions.config().firebase);
exports.findNearestStations = findNearestStations_1.findNearestStations;
exports.findTripDirections = findTripDirections_1.findTripDirections;
exports.testAsyncHttp = testAsyncHttp_1.testAsyncHttp;
exports.getDirections = getDirections_1.getDirections;
//# sourceMappingURL=index.js.map