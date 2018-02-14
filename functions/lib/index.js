const functions = require('firebase-functions');
const admin = require('firebase-admin');
const findNearestStation = require('./googleMaps/findNearestStations').findNearestStations;
const findTripDirections = require('./googleMaps/findTripDirections').findTripDirections;
admin.initializeApp(functions.config().firebase);
exports.findNearestStation = findNearestStation;
exports.findTripDirections = findTripDirections;
//# sourceMappingURL=index.js.map