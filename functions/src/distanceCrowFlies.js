"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deg2rad = function (deg) { return deg * (Math.PI / 180); };
exports.distanceCrowFlies = function (point1, point2) {
    if (!point1.hasOwnProperty('lat')
        || !point1.hasOwnProperty('lng')
        || !point2.hasOwnProperty('lat')
        || !point2.hasOwnProperty('lng')) {
        throw new Error('point must be LatLng object  ');
    }
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(point2.lat - point1.lat); // deg2rad below
    var dLon = deg2rad(point2.lng - point2.lng);
    var a = (Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2));
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
};
