import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
import { googleMapsClient } from './googleMapsClient';
import { serverMapGeoPointToLatLng } from './serverMapGeoPointToLatLng';
import { memoize } from '../memoize';
import axios from 'axios';

const findNearestStations = 'http://localhost:5000/bike-share-1517478720061/us-central1/findNearestStations';


export const searchParamsUpdated = functions.firestore
  .document('/users/{userId}')
  .onUpdate(event => {

    const userData = event.data.data();
    const previousUserData = event.data.previous.data();
    let location;

    // have the origin coords changed since the previous value?

    if (JSON.stringify(userData.searchOrigin) !== JSON.stringify(previousUserData.searchOrigin)) {
      location = serverMapGeoPointToLatLng(userData.searchOrigin);
      const nearestStations = axios.post(findNearestStations, {})
    }

    // have the destination coords changed since the previous value?

    if (JSON.stringify(userData.searchDestination) !== JSON.stringify(previousUserData.searchDestination)) {
      location = serverMapGeoPointToLatLng(userData.searchDestination);
    }

    // if neither was changed, exit this function

    if (!location) return Promise.resolve();


    return Promise.resolve();
  });
