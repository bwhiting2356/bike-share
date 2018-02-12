"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase = require("firebase/app");
exports.mapLatLngToGeoPoint = function (latlng) {
    return new firebase.firestore.GeoPoint(latlng.lat, latlng.lng);
};
