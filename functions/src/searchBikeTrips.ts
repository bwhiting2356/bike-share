import * as functions from 'firebase-functions';
import { findNearestStations } from './googleMaps/findNearestStations';
import { getDirections } from "./googleMaps/getDirections";
import { TripData, TripStatus } from './shared/Trip';
import { serverMapGeoPointToLatLng } from "./googleMaps/serverMapGeoPointToLatLng";
import * as admin from 'firebase-admin';
import { memoize } from './memoize';
import { LatLng } from './shared/LatLng';

const funcSearchBikeTrips = async (
  origin: {
    coords: LatLng;
    address: string;
  },
  destination: {
    coords: LatLng;
    address: string;
  },
  datetime: Date,
  timeTarget: string): Promise<TripData> => {

  const nearestOriginStationsPromise = findNearestStations(origin.coords);
  const walking1Promise = nearestOriginStationsPromise
    .then(async response => {

      let walking1Query = {
        origin: origin.coords,
        destination: response.data[0].coords,
        mode: 'walking'
      };

      return getDirections(walking1Query);
    });


  const nearestDestinationStationsPromise = findNearestStations(destination.coords);
  const walking2Promise = nearestDestinationStationsPromise
    .then(response => {

      let walking2Query = {
        origin: destination.coords,
        destination: response.data[0].coords,
        mode: 'walking'
      };

      return getDirections(walking2Query);
    });

  const bicyclingPromise = Promise.all([nearestOriginStationsPromise, nearestDestinationStationsPromise])
    .then(results => {

      let bicyclingQuery = {
        origin: results[0].data[0].coords,
        destination: results[1].data[0].coords,
        mode: 'bicycling'
      };

      return getDirections(bicyclingQuery);
    });

  return await Promise.all([
    walking1Promise,
    nearestOriginStationsPromise,
    bicyclingPromise,
    nearestDestinationStationsPromise,
    walking2Promise
  ]).then(allResults => {

    const walking1Result = allResults[0];
    const stationStartResult = allResults[1];
    const bicyclingResult = allResults[2];
    const stationEndResult = allResults[3];
    const walking2Result = allResults[4];

    // compute times...

    const stationStartTime: Date = new Date();
    stationStartTime.setSeconds(datetime.getSeconds() + walking1Result.data.seconds);

    const stationEndTime: Date = new Date();
    stationEndTime.setSeconds(stationStartTime.getSeconds() + bicyclingResult.data.seconds);

    const arrivalTime: Date = new Date();
    arrivalTime.setSeconds(stationEndTime.getSeconds() + walking2Result.data.seconds);

    let tripData: TripData = {
      origin: {
        coords: origin.coords,
        address: origin.address
      },
      departureTime: datetime,
      walking1Travel: {
        feet: walking1Result.data.feet,
        seconds: walking1Result.data.seconds,
        points: walking1Result.data.points,
      },
      stationStart: {
        time: stationStartTime,
        coords: stationStartResult.data[0].coords,
        address: stationStartResult.data[0].address,
        price: 0.50 // TODO: fix!
      },
      bicyclingTravel: {
        feet: bicyclingResult.data.feet,
        seconds: bicyclingResult.data.seconds,
        points: bicyclingResult.data.points,
        price: 0.75 // TODO: fix
      },
      stationEnd: {
        time: stationEndTime, // TODO: fix!,
        coords: stationEndResult.data[0].coords,
        address: stationEndResult.data[0].address,
        price: 0.50, // TODO: fix!
      },
      walking2Travel: {
        feet: walking2Result.data.feet,
        seconds: walking2Result.data.seconds,
        points: walking2Result.data.points,
      },
      destination: {
        coords: destination.coords,
        address: destination.address
      },
      arrivalTime: arrivalTime,
      status: TripStatus.PROPOSED
    };
    return tripData;
  });
};


export const searchBikeTrips = functions.https.onRequest(async (request, response) => {
  const origin = request.body.origin;
  const destination = request.body.destination;
  const datetime = new Date(request.body.datetime);
  const timeTarget = request.body.timeTarget;
  const trip = await funcSearchBikeTrips(origin, destination, datetime, timeTarget);
  response.send(trip);
});


