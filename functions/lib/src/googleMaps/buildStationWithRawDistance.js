"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var distanceCrowFlies_1 = require("./distanceCrowFlies");
var serverMapGeoPointToLatLng_1 = require("./serverMapGeoPointToLatLng");
exports.buildStationWithRawDistance = function (doc, loc) {
    var r = {
        id: doc.id,
        coords: serverMapGeoPointToLatLng_1.serverMapGeoPointToLatLng(doc.data().coords),
        distanceFromLoc: distanceCrowFlies_1.distanceCrowFlies(loc, serverMapGeoPointToLatLng_1.serverMapGeoPointToLatLng(doc.data().coords)),
        address: doc.data().address
    };
    console.log("r", r);
    return r;
};
var marcy576 = { lat: 40.695203, lng: -73.949358 };
var stationDoc = {
    exists: true,
    ref: null,
    id: null,
    readTime: null,
    get: null,
    data: function () {
        return {
            address: null,
            coords: { lat: 40.691351, lng: -73.951792 }
        };
    },
};
var result = exports.buildStationWithRawDistance(stationDoc, marcy576);
console.log("result: ", result);
//# sourceMappingURL=buildStationWithRawDistance.js.map