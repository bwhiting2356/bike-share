const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serverMapGeoPointToLatLng = require('./serverMapGeoPointToLatLng').serverMapGeoPointToLatLng;
exports.findTripDirections = functions.firestore
    .document('/users/{userId}')
    .onUpdate(function (event) {
    var userData = event.data.data();
    if (userData.searchOrigin && userData.searchDestination) {
        // I won't worry about the inventory at the stations, time, etc. for now
        // TODO: actually compute the inventory over time
        var searchOrigin = serverMapGeoPointToLatLng(userData.searchOrigin);
        return admin.firestore()
            .collection('/stationWalkingDistanceQueries')
            .doc(JSON.stringify(searchOrigin)).get()
            .then(function (doc) {
            console.log(JSON.stringify(searchOrigin));
            console.log(doc.exists);
            console.log(doc.data());
            var topStation = doc.data().response[0];
            console.log(topStation);
        });
    }
});
//# sourceMappingURL=findTripDirections.js.map