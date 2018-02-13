const functions = require('firebase-functions');
const admin = require('firebase-admin');
const googleMapsClient = require('./googleMapsClient').googleMapsClient;

function serverMapGeoPointToLatLng(geopoint) {
  return { lat: geopoint._latitude, lng: geopoint._longitude };
}


exports.findNearestStations = functions.firestore.document('/users/{userId}').onUpdate(function(event) {

  //
  return admin.firestore().collection('stations').get()
    .then(function(querySnapshot) {

      var stations = [];

      querySnapshot.docs.forEach(function(queryDocumentSnapshot) {
        //           id: queryDocumentSnapshot.id,
        stations.push(serverMapGeoPointToLatLng(queryDocumentSnapshot.data().coords))
      });

      var userData = event.data.data();
      if (userData.searchOrigin) {
        // console.log(userData.searchOrigin);
        var searchOrigin = serverMapGeoPointToLatLng(userData.searchOrigin);
      }
      // if (userData.searchDestination) {
      //   var searchDestination = serverMapGeoPointToLatLng(userData.searchDestination);
      // }

      const req = {
        origins: [searchOrigin],
        destinations: stations,
        mode: 'walking'
      };

      console.log(stations);
      return new Promise(function(resolve) {
        googleMapsClient.distanceMatrix(req, function(err, response) {
          // console.log(stations);
          console.log(response.json.rows[0].elements);
          resolve(response.json.rows[0].elements);
        });
      });
    });
});
