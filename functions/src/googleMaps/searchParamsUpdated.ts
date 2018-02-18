import * as functions from 'firebase-functions';
// const admin = require('firebase-admin');
import { googleMapsClient } from './googleMapsClient';
import { serverMapGeoPointToLatLng } from './serverMapGeoPointToLatLng';
import { findNearestStations } from './findNearestStations';
import { getDirections } from "./getDirections";


export const searchParamsUpdated = functions.firestore
  .document('/users/{userId}')
  .onUpdate(async event => {

    try {
      const userData = event.data.data();
      const previousUserData = event.data.previous.data();

      // have the origin coords changed since the previous value?
      const origin = userData.searchOrigin ? serverMapGeoPointToLatLng(userData.searchOrigin) : null;
      const destination = userData.searchDestination ? serverMapGeoPointToLatLng(userData.searchDestination) : null;
      let nearestOriginStations,
        nearestDestinationStations,
        walking1Points,
        bicyclingPoints,
        walking2Points;

      if (JSON.stringify(userData.searchOrigin) !== JSON.stringify(previousUserData.searchOrigin)) {
        nearestOriginStations = findNearestStations(origin);

        nearestOriginStations
          .then(async response => {
            console.log("line 32 response: ", response);
            let stationStart = response.data[0].coords;
            let walking1Query = {
              origin: origin,
              destination: stationStart,
              mode: 'walking'
            };

            walking1Points = await getDirections(walking1Query);

          })

      }

      // have the destination coords changed since the previous value?

      if (JSON.stringify(userData.searchDestination) !== JSON.stringify(previousUserData.searchDestination)) {
        nearestDestinationStations = findNearestStations(destination);

        console.log("line 50");

        nearestDestinationStations
          .then(async response => {
            console.log("line 52 response: ", response);
            let stationEnd = response.data[0].coords;
            let walking2Query = {
              origin: origin,
              destination: stationEnd,
              mode: 'walking'
            };

            walking2Points = await getDirections(walking2Query);

          })



        //
        // stationEnd = nearestDestinationStations.data[0].coords;
        // console.log("station end: ", stationEnd);
        // let walking2Query = {
        //   origin: destination,
        //   destination: stationEnd,
        //   mode: 'walking'
        // };
        // walking2Points = await getDirections(walking2Query);
      }

      // if neither was changed, exit this function
      console.log('origin: ', origin);
      console.log('destination: ', destination);

      if (origin && destination) {
        return Promise.all([nearestOriginStations, nearestDestinationStations])
          .then(async results => {

            console.log("line 84 results: ", results);

            let bicyclingQuery = {
              origin: results[0].data[0].coords,
              destination: results[1].data[0].coords,
              mode: 'bicycling'
            };

            console.log('bicycling query: ', bicyclingQuery);

            bicyclingPoints = await getDirections(bicyclingQuery);
            console.log("bicycling poitns: ", bicyclingPoints);
            return Promise.resolve();
          })
      }

    } catch (error) {
      console.log("line 87 error: ", error);
      return Promise.resolve(error);
    }


  })

