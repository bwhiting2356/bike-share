"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var admin = require("firebase-admin");
// import { findNearestStations } from  './googleMaps/findNearestStations';
// import { findTripDirections } from './googleMaps/findTripDirections';
// import { testAsyncHttp } from './testAsyncHttp';
var getDirections_1 = require("./googleMaps/getDirections");
var searchParamsUpdated_1 = require("./googleMaps/searchParamsUpdated");
admin.initializeApp(functions.config().firebase);
// exports.findNearestStations = findNearestStations;
// exports.findTripDirections = findTripDirections;
// exports.testAsyncHttp = testAsyncHttp;
exports.getDirections = getDirections_1.getDirections;
exports.searchParamsUpdated = searchParamsUpdated_1.searchParamsUpdated;
//# sourceMappingURL=index.js.map