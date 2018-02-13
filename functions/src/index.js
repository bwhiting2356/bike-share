const functions = require('firebase-functions');
const admin = require('firebase-admin');
const findNearestStation = require('./googleMaps/findNearestStations').findNearestStations;

admin.initializeApp(functions.config().firebase);

exports.findNearestStation = findNearestStation;






