"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var admin = require('firebase-admin');
var googleMapsClient_1 = require("./googleMapsClient");
var serverMapGeoPointToLatLng_1 = require("./serverMapGeoPointToLatLng");
var memoize_1 = require("../memoize");
var mergeDataWithIds = function (response, stationsPlusIds) {
    var newData = [];
    for (var i = 0; i < response.length; i++) {
        newData.push({
            id: stationsPlusIds[i].id,
            data: response[i]
        });
    }
    return newData;
};
var compareStationData = function (a, b) {
    return a.data.distance.value - b.data.distance.value;
};
exports.findNearestStations = functions.firestore
    .document('/users/{userId}')
    .onUpdate(function (event) {
    var userData = event.data.data();
    var previousUserData = event.data.previous.data();
    var location;
    // have the origin coords changed since the previous value?
    if (JSON.stringify(userData.searchOrigin) !== JSON.stringify(previousUserData.searchOrigin)) {
        location = serverMapGeoPointToLatLng_1.serverMapGeoPointToLatLng(userData.searchOrigin);
    }
    // have the destination coords changed since the previous value?
    if (JSON.stringify(userData.searchDestination) !== JSON.stringify(previousUserData.searchDestination)) {
        location = serverMapGeoPointToLatLng_1.serverMapGeoPointToLatLng(userData.searchDestination);
    }
    // if neither was changed, exit this function
    if (!location)
        return Promise.resolve();
    // check to see if this location query was cached
    var funcFindNearestStations = function (loc) {
        return admin.firestore().collection('/stations')
            .get()
            .then(function (querySnapshot) {
            var stationsPlusId = [];
            // get all the stations from the database (maybe just keep this in a constant if it never changes?)
            querySnapshot.docs.forEach(function (queryDocumentSnapshot) {
                stationsPlusId.push({
                    id: queryDocumentSnapshot.id,
                    data: serverMapGeoPointToLatLng_1.serverMapGeoPointToLatLng(queryDocumentSnapshot.data().coords)
                });
            });
            // make a version with only the data, to send to the google maps api
            var stations = stationsPlusId.map(function (station) {
                return station.data;
            });
            // make request to google
            var req = {
                origins: [loc],
                destinations: stations,
                mode: 'walking'
            };
            return new Promise(function (resolve) {
                googleMapsClient_1.googleMapsClient.distanceMatrix(req, function (err, response) {
                    var mergedData = mergeDataWithIds(response.json.rows[0].elements, stationsPlusId);
                    var sortedData = mergedData.sort(compareStationData);
                    resolve({ response: sortedData });
                });
            });
        });
    };
    return memoize_1.memoize(funcFindNearestStations)(location);
});
//# sourceMappingURL=findNearestStations.js.map