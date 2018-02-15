// import * as functions from 'firebase-functions';
// const admin = require('firebase-admin');
// import { googleMapsClient } from './googleMapsClient';
// import { serverMapGeoPointToLatLng } from './serverMapGeoPointToLatLng';
// import { memoize } from '../memoize';
// import axios from 'axios';
// import * as https from 'https';
//
// const getDirectionsUrl = 'http://localhost:5000/bike-share-1517478720061/us-central1/getDirections';
//
// export const findTripDirections = functions.firestore
//   .document('/users/{userId}')
//   .onUpdate(async event => {
//     const userData = event.data.data();
//     if (!(userData.searchOrigin && userData.searchDestination)) {
//       return Promise.resolve();
//     }
//
//     const funcFindTripDirections = () => {
//       const origin = serverMapGeoPointToLatLng(userData.searchOrigin);
//       const originNearestStations = axios.post(getDirectionsUrl, {
//         origin
//       })
//       const destination = serverMapGeoPointToLatLng(userData.searchDestination);
//
//     }
//     return Promise.resolve();
//
//
//
//       // I won't worry about the inventory at the stations, time, etc. for now
//       // TODO: actually compute the inventory over time
//
//
//
//
//     }
//
//   });
