import * as functions from 'firebase-functions';
const cors = require('cors')({
  origin: true,
});
import { findNearestStations } from './googleMaps/findNearestStations';
import { getDirections } from "./googleMaps/getDirections";
import { TripData, TripStatus } from './shared/Trip';
import { serverMapGeoPointToLatLng } from "./googleMaps/serverMapGeoPointToLatLng";

const TravelMode = {
  WALKING: 'walking',
  BICYCLING: 'bicycling'
}


import { LatLng } from './shared/LatLng';

export const funcSearchBikeTrips = async (
  origin: {
    coords: LatLng;
    address: string;
  },
  destination: {
    coords: LatLng;
    address: string;
  },
  datetime: Date,
  timeTarget: string) => {

  const nearestOriginStationsPromise = findNearestStations(origin.coords);
  const walking1Promise = nearestOriginStationsPromise
    .then(async response => {

      const walking1Query = {
        origin: origin.coords,
        destination: response.data[0].coords,
        mode: TravelMode.WALKING
      };

      console.log('search bike trips line 40');

      return getDirections(walking1Query);
    });


  const nearestDestinationStationsPromise = findNearestStations(destination.coords);
  const walking2Promise = nearestDestinationStationsPromise
    .then(response => {

      const walking2Query = {
        origin: destination.coords,
        destination: response.data[0].coords,
        mode: TravelMode.WALKING
      };

      return getDirections(walking2Query);
    });

  const bicyclingPromise = Promise.all([nearestOriginStationsPromise, nearestDestinationStationsPromise])
    .then(results => {

      const bicyclingQuery = {
        origin: results[0].data[0].coords,
        destination: results[1].data[0].coords,
        mode: TravelMode.BICYCLING
      };

      return getDirections(bicyclingQuery);
    });

  console.log("search bike trips line 64");

  return walking1Promise.then(() => {
    console.log("walking 1 finished")
  });
  // nearestOriginStationsPromise.then(() => console.log("nearest origin station finished"));
  // bicyclingPromise.then(() => console.log("bicycling finished"));
  // nearestDestinationStationsPromise..then(() => console.log("nearest destination station finished"));
  // walking2Promise.then(() => console.log("walking 2 finished"));

  // return await Promise.all([
  //   walking1Promise,
  //   nearestOriginStationsPromise,
  //   bicyclingPromise,
  //   nearestDestinationStationsPromise,
  //   walking2Promise
  // ]).then(allResults => {
  //
  //   console.log("search bike trips line 75 all results: ", JSON.stringify(allResults));
  //
  //   const walking1Result = allResults[0];
  //   const stationStartResult = allResults[1];
  //   const bicyclingResult = allResults[2];
  //   const stationEndResult = allResults[3];
  //   const walking2Result = allResults[4];
  //
  //   // compute times...
  //
  //   const stationStartTime: Date = new Date();
  //   stationStartTime.setSeconds(datetime.getSeconds() + walking1Result.data.seconds);
  //
  //   const stationEndTime: Date = new Date();
  //   stationEndTime.setSeconds(stationStartTime.getSeconds() + bicyclingResult.data.seconds);
  //
  //   const arrivalTime: Date = new Date();
  //   arrivalTime.setSeconds(stationEndTime.getSeconds() + walking2Result.data.seconds);
  //
  //   const tripData: TripData = {
  //     origin: {
  //       coords: origin.coords,
  //       address: origin.address
  //     },
  //     departureTime: datetime,
  //     walking1Travel: {
  //       feet: walking1Result.data.feet,
  //       seconds: walking1Result.data.seconds,
  //       points: walking1Result.data.points,
  //     },
  //     stationStart: {
  //       time: stationStartTime,
  //       coords: stationStartResult.data[0].coords,
  //       address: stationStartResult.data[0].address,
  //       price: 0.50 // TODO: fix!
  //     },
  //     bicyclingTravel: {
  //       feet: bicyclingResult.data.feet,
  //       seconds: bicyclingResult.data.seconds,
  //       points: bicyclingResult.data.points,
  //       price: 0.75 // TODO: fix
  //     },
  //     stationEnd: {
  //       time: stationEndTime, // TODO: fix!,
  //       coords: stationEndResult.data[0].coords,
  //       address: stationEndResult.data[0].address,
  //       price: 0.50, // TODO: fix!
  //     },
  //     walking2Travel: {
  //       feet: walking2Result.data.feet,
  //       seconds: walking2Result.data.seconds,
  //       points: walking2Result.data.points,
  //     },
  //     destination: {
  //       coords: destination.coords,
  //       address: destination.address
  //     },
  //     arrivalTime: arrivalTime,
  //     status: TripStatus.PROPOSED
  //   };
  //   return tripData;
  // });
};

// export const searchBikeTrips = functions.https.onRequest(async (request, response) => {
//
//   cors(request, response, async () => {
//     const origin = request.body.origin;
//     const destination = request.body.destination;
//     const datetime = new Date(request.body.datetime);
//     const timeTarget = request.body.timeTarget;
//     const trip = await funcSearchBikeTrips(origin, destination, datetime, timeTarget);
//     console.log('trip: ', JSON.stringify(trip));
//     response.send(trip);
//   })
//
// });


