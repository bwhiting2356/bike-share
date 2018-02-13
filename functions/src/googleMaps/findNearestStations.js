const functions = require('firebase-functions');
const admin = require('firebase-admin');
const googleMapsClient = require('./googleMapsClient').googleMapsClient;

function serverMapGeoPointToLatLng(geopoint) {
  return { lat: geopoint._latitude, lng: geopoint._longitude };
}


exports.findNearestStations = functions.firestore
  .document('/users/{userId}')
  .onUpdate(function(event) {

  return admin.firestore().collection('/stations').get()
    .then(function(querySnapshot) {

      var stationsPlusId = []

      querySnapshot.docs.forEach(function(queryDocumentSnapshot) {
        stationsPlusId.push({
          id: queryDocumentSnapshot.id,
          data: serverMapGeoPointToLatLng(queryDocumentSnapshot.data().coords)
        })
      });

      var stations = stationsPlusId.map(function(station) {
        return station.data
      });

      var userData = event.data.data();
      var previousUserData = event.data.previous.data();
      var location;

      // have the origin coords changed since the previous value?

      if (JSON.stringify(userData.searchOrigin) !== JSON.stringify(previousUserData.searchOrigin)) {
        location = serverMapGeoPointToLatLng(userData.searchOrigin);
      }

      // have the destination coords changed since the previous value?

      if (JSON.stringify(userData.searchDestination) !== JSON.stringify(previousUserData.searchDestination)) {
        location = serverMapGeoPointToLatLng(userData.searchDestination);
      }

      const req = {
        origins: [location],
        destinations: stations,
        mode: 'walking'
      };

      return new Promise(function(resolve) {
        googleMapsClient.distanceMatrix(req, function(err, response) {
          var mergedData = mergeDataWithIds(response.json.rows[0].elements, stationsPlusId);
          var sortedData = mergedData.sort(compareStationData);
          resolve({query: location, result: sortedData })
        });
      });
    })
    .then(function(data) {
      var query = JSON.stringify(data.query);
      var result = JSON.stringify(data.result);
      return admin.firestore()
        .collection('/stationWalkingDistanceQueries')
        .doc(query).set({response: result});
    })
});

function mergeDataWithIds(response, stationsPlusIds) {
  var newData = [];
  for (var i = 0; i < response.length; i++) {
    newData.push({
      id: stationsPlusIds[i].id,
      data: response[i]
    })
  }
  return newData;
}

function compareStationData(a, b) {
  return a.data.distance.value - b.data.distance.value;
}
