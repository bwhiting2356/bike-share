import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// import { findNearestStations } from  './googleMaps/findNearestStations';
// import { findTripDirections } from './googleMaps/findTripDirections';
// import { testAsyncHttp } from './testAsyncHttp';
import { getDirections } from './googleMaps/getDirections';
import { searchParamsUpdated } from "./googleMaps/searchParamsUpdated";

admin.initializeApp(functions.config().firebase);

// exports.findNearestStations = findNearestStations;
// exports.findTripDirections = findTripDirections;
// exports.testAsyncHttp = testAsyncHttp;
exports.getDirections = getDirections;
exports.searchParamsUpdated = searchParamsUpdated;



