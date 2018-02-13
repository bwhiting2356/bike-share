const functions = require('firebase-functions');
const admin = require('firebase-admin');
const googleMapsClient = require('./googleMapsClient').googleMapsClient;

function serverMapGeoPointToLatLng(geopoint) {
  return { lat: geopoint._latitude, lng: geopoint._longitude };
}


exports.findNearestStations = functions.firestore
  .document('/users/{userId}')
  .onUpdate(function(event) {

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

    // if neither was changed, exit this function

    if (!location) {
      return Promise.resolve()
    }

    // check to see if this location query was cached

    return admin.firestore()
      .collection('/stationWalkingDistanceQueries')
      .doc(JSON.stringify(location)).get()
      .then(function(docSnapshot) {
        if (docSnapshot.exists) {
          return Promise.resolve();
        }

        // if not query the database for the station list

        return admin.firestore().collection('/stations').get()
          .then(function(querySnapshot) {

            var stationsPlusId = [];

            // get all the stations from the database (maybe just keep this in a constant if it never changes?)

            querySnapshot.docs.forEach(function(queryDocumentSnapshot) {
              stationsPlusId.push({
                id: queryDocumentSnapshot.id,
                data: serverMapGeoPointToLatLng(queryDocumentSnapshot.data().coords)
              })
            });

            // make a version with only the data, to send to the google maps api

            var stations = stationsPlusId.map(function(station) {
              return station.data
            });

            // make request to google

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
      })

    // TODO: clean this up with better control flow
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
