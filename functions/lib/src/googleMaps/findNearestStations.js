"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin = require('firebase-admin');
var serverMapGeoPointToLatLng_1 = require("./serverMapGeoPointToLatLng");
var memoize_1 = require("../memoize");
var distanceCrowFlies_1 = require("./distanceCrowFlies");
var googleMapsClient_1 = require("./googleMapsClient");
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
        .then(function (snapshot) {
        var stationsData = [];
        snapshot.docs.forEach(function (doc) {
            stationsData.push({
                id: doc.id,
                coords: serverMapGeoPointToLatLng_1.serverMapGeoPointToLatLng(doc.data().coords),
                distanceFromLoc: distanceCrowFlies_1.distanceCrowFlies(loc, serverMapGeoPointToLatLng_1.serverMapGeoPointToLatLng(doc.data().coords)),
                address: doc.data().address
            });
        });
        var sortedStations = stationsData.sort(function (a, b) { return a.distanceFromLoc - b.distanceFromLoc; });
        var closest10Stations = sortedStations.slice(0, 9);
        if (closest10Stations[0].distanceFromLoc > 5) {
            // throw new Error("No nearby stations.")
            return Promise.reject('No nearby stations');
        }
        console.log(JSON.stringify(closest10Stations));
        var stationsCoords = closest10Stations.map(function (station) { return station.coords; });
        var req = {
            origins: [loc],
            destinations: stationsCoords,
            mode: 'walking'
        };
        return new Promise(function (resolve, reject) {
            googleMapsClient_1.googleMapsClient.distanceMatrix(req, function (err, res) {
                if (err)
                    reject(err);
                var mergedData = mergeDataWithIds(res.json.rows[0].elements, stationsData);
                var sortedData = mergedData.sort(compareStationData);
                resolve(sortedData);
            });
        });
    });
};
exports.findNearestStations = memoize_1.memoize(funcFindNearestStations);
//# sourceMappingURL=findNearestStations.js.map