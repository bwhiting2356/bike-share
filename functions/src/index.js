const functions = require('firebase-functions');
const admin = require('firebase-admin');
const findNearestStation = require('./googleMaps/findNearestStations').findNearestStations;
const findTripDirections = require('./googleMaps/findTripDirections').findTripDirections;
const testAsyncHttp = require('./testAsyncHttp').testAsyncHttp;
const getDirections = require('./googleMaps/getDirections').getDirections;

admin.initializeApp(functions.config().firebase);

exports.findNearestStation = findNearestStation;
exports.findTripDirections = findTripDirections;
exports.testAsyncHttp = testAsyncHttp;
exports.getDirections = getDirections;







