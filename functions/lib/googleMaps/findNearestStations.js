"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin = require('firebase-admin');
var googleMapsClient_1 = require("./googleMapsClient");
var serverMapGeoPointToLatLng_1 = require("./serverMapGeoPointToLatLng");
var memoize_1 = require("../memoize");
var mergeDataWithIds = function (response, stationsPlusIds) {
    var newData = [];
    for (var i = 0; i < response.length; i++) {
        newData.push({
            id: stationsPlusIds[i].id,
            coords: stationsPlusIds[i].coords,
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
        var stationsPlusId = [];
        // get all the stations from the database (maybe just keep this in a constant if it never changes?)
        querySnapshot.docs.forEach(function (queryDocumentSnapshot) {
            stationsPlusId.push({
                id: queryDocumentSnapshot.id,
                coords: serverMapGeoPointToLatLng_1.serverMapGeoPointToLatLng(queryDocumentSnapshot.data().coords)
            });
        });
        // make a version with only the data, to send to the google maps api
        var stations = stationsPlusId.map(function (station) {
            return station.coords;
        });
        // make request to google
        var req = {
            origins: [loc],
            destinations: stations,
            mode: 'walking'
        };
        return new Promise(function (resolve) {
            googleMapsClient_1.googleMapsClient.distanceMatrix(req, function (err, res) {
                var mergedData = mergeDataWithIds(res.json.rows[0].elements, stationsPlusId);
                var sortedData = mergedData.sort(compareStationData);
                resolve(sortedData);
            });
        });
    });
};
exports.findNearestStations = memoize_1.memoize(funcFindNearestStations);
//# sourceMappingURL=findNearestStations.js.map