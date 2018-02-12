"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapGeoPointToLatLng = function (geopoint) {
    return { lat: geopoint.coords._lat, lng: geopoint.coords._long };
};
