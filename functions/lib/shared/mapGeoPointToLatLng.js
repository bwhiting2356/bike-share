"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as firebase from 'firebase/app';
// interface GeoPoint {
//   coords: {
//     _lat: number;
//     _long: number;
//   }
// }
exports.mapGeoPointToLatLng = (geopoint) => {
    return { lat: geopoint.coords._latitude, lng: geopoint.coords._longitude };
};
//# sourceMappingURL=mapGeoPointToLatLng.js.map