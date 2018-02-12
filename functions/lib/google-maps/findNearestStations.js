"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleMapsClient_1 = require("./googleMapsClient");
const functions = require("firebase-functions");
exports.testFromTypescript = functions.https.onRequest(function (request, response) {
    console.log("test from typescript in the console");
    response.send("test from typescript in the response");
});
// interface LatLng {
//   lat: number;
//   lng: number;
// }
//
// interface DistanceMatrixRequest {
//   origins: string[];
//   destinations: LatLng[];
//   mode: string
// }
//
exports.findNearestStation = () => {
    const request = {
        origins: ['321 Magnolia, Millbrae CA'],
        destinations: [{
                lat: 37.596557,
                lng: -122.395373
            }, {
                lat: 37.608525,
                lng: -122.409767
            }],
        mode: 'walking'
    };
    googleMapsClient_1.googleMapsClient.distanceMatrix(request, (err, response) => console.log(response.json.rows[0].elements));
};
//
// findNearestStation();
//
// const mapGeoPointToLatLng = (geopoint): LatLng => {
//   return { lat: geopoint.coords._latitude, lng: geopoint.coords._longitude };
// }
//
// export const findNearest = functions.firestore.document('users/{userId}').onUpdate(event => {
//   console.log('hello line 34');
//   admin.firestore().collection('stations')
//     .get()
//     .then(querySnapShot => {
//       let stations = [];
//       querySnapShot.forEach(doc => {
//         let station: LatLng = mapGeoPointToLatLng(doc.data());
//         stations.push(station);
//       });
//
//
//       console.log(stations);
//     })
//   const searchDestination = event.data.data().searchDestination;
//   const searchOrigin = event.data.data().searchOrigin;
//   console.log('search origin ', searchOrigin);
//   console.log('search destination ', searchDestination);
//   return Promise.resolve();
//
// });
//# sourceMappingURL=findNearestStations.js.map