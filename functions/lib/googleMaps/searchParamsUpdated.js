"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var admin = require('firebase-admin');
var serverMapGeoPointToLatLng_1 = require("./serverMapGeoPointToLatLng");
var axios_1 = require("axios");
var findNearestStations = 'http://localhost:5000/bike-share-1517478720061/us-central1/findNearestStations';
exports.searchParamsUpdated = functions.firestore
    .document('/users/{userId}')
    .onUpdate(function (event) {
    var userData = event.data.data();
    var previousUserData = event.data.previous.data();
    var location;
    // have the origin coords changed since the previous value?
    if (JSON.stringify(userData.searchOrigin) !== JSON.stringify(previousUserData.searchOrigin)) {
        location = serverMapGeoPointToLatLng_1.serverMapGeoPointToLatLng(userData.searchOrigin);
        var nearestStations = axios_1.default.post(findNearestStations, {});
    }
    // have the destination coords changed since the previous value?
    if (JSON.stringify(userData.searchDestination) !== JSON.stringify(previousUserData.searchDestination)) {
        location = serverMapGeoPointToLatLng_1.serverMapGeoPointToLatLng(userData.searchDestination);
    }
    // if neither was changed, exit this function
    if (!location)
        return Promise.resolve();
    return Promise.resolve();
});
//# sourceMappingURL=searchParamsUpdated.js.map