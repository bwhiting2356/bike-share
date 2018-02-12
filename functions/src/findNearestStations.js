const functions = require('firebase-functions');
const admin = require('firebase-admin');
const googleMapsClient = require('./googleMapsClient').googleMapsClient;

exports.findNearestStations = functions.https.onRequest(function(request, response) {
  const req = {
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
  googleMapsClient.distanceMatrix(req, function(err, response) {
    console.log(response.json.rows[0].elements);
    response.send("Hello from Google Maps Client!", response.json.rows[0].elements);
  });

});
