"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin = require('firebase-admin');
var googleMapsClient_1 = require("./googleMapsClient");
var serverMapGeoPointToLatLng_1 = require("./serverMapGeoPointToLatLng");
var memoize_1 = require("../memoize");
var mergeDataWithIds = function (response, stationsData) {
    var newData = [];
    for (var i = 0; i < response.length; i++) {
        newData.push({
            id: stationsData[i].id,
            coords: stationsData[i].coords,
            address: stationsData[i].address,
            data: response[i]
        });
    }
    return newData;
};
var compareStationData = function (a, b) {
    return a.data.distance.value - b.data.distance.value;
};
var funcFindNearestStations = function (loc) {
    return admin.firestore().collection('/stations')
        .get()
        .then(function (querySnapshot) {
        var stationsData = [];
        // get all the stations from the database (maybe just keep this in a constant if it never changes?)
        querySnapshot.docs.forEach(function (queryDocumentSnapshot) {
            stationsData.push({
                id: queryDocumentSnapshot.id,
                coords: serverMapGeoPointToLatLng_1.serverMapGeoPointToLatLng(queryDocumentSnapshot.data().coords),
                address: queryDocumentSnapshot.data().address
            });
        });
        // make a version with only the data, to send to the google maps api
        var stationsCoords = stationsData.map(function (station) { return station.coords; });
        // make request to google
        var req = {
            origins: [loc],
            destinations: stationsCoords,
            mode: 'walking'
        };
        return new Promise(function (resolve) {
            googleMapsClient_1.googleMapsClient.distanceMatrix(req, function (err, res) {
                var mergedData = mergeDataWithIds(res.json.rows[0].elements, stationsData);
                var sortedData = mergedData.sort(compareStationData);
                resolve(sortedData);
            });
        });
    });
};
exports.findNearestStations = memoize_1.memoize(funcFindNearestStations);
//# sourceMappingURL=findNearestStations.js.map