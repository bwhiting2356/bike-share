import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { findNearestStations } from './googleMaps/findNearestStations';
import { serverMapGeoPointToLatLng } from "./googleMaps/serverMapGeoPointToLatLng";
import { getDirections } from './googleMaps/getDirections';
import { DistanceMatixQuery } from './shared/DistanceMatrixQuery';
import { DirectionsQuery } from './shared/DirectionsQuery';
import { TripData, TripStatus } from './shared/Trip';

import { addSeconds } from './shared/addSeconds';
import { subtractSeconds } from './shared/subtractSeconds';
import { TimeTarget } from './shared/timeTarget';

const TravelMode = {
  WALKING: 'walking',
  BICYCLING: 'bicycling'
};

export const userDataUpdated = functions.firestore
  .document('/users/{userId}')
  .onWrite(async event => {
    const userData = event.data.data();
    const previousUserData = event.data.previous.data();

    // values
    let originCoords,
      originAddress,
      stationStartId,
      stationStartCoords,
      stationStartAddress,
      stationEndId,
      stationEndCoords,
      stationEndAddress,
      destinationCoords,
      destinationAddress;


    // promises
    let nearestStartStationPromise,
      walking1DirectionsPromise,
      nearestEndStationPromise,
      walking2DirectionsPromise,
      bicyclingDirectionsPromise,
      deleteOperationPromise;

    if (userData.searchParams) {
      if (userData.searchParams.origin) {
        originCoords = serverMapGeoPointToLatLng(userData.searchParams.origin.coords);
        originAddress = userData.searchParams.origin.address;

        nearestStartStationPromise = findNearestStations(originCoords)
          .then(response => {
            stationStartId = response.data[0].id;
            stationStartCoords = response.data[0].coords;
            stationStartAddress = response.data[0].address;
            return stationStartCoords
          })

        walking1DirectionsPromise = nearestStartStationPromise
          .then(startCoords => {
            const walking1Query: DirectionsQuery = {
              origin: originCoords,
              destination: startCoords,
              mode: TravelMode.WALKING
            };

            return getDirections(walking1Query);
          })
      }

      if (userData.searchParams.destination) {
        destinationCoords = serverMapGeoPointToLatLng(userData.searchParams.destination.coords);
        destinationAddress = userData.searchParams.destination.address;
        nearestEndStationPromise = findNearestStations(destinationCoords)
          .then(response => {
            stationEndId = response.data[0].id;
            stationEndCoords = response.data[0].coords;
            stationEndAddress = response.data[0].address;
            return stationEndCoords;
          })

        walking2DirectionsPromise = nearestEndStationPromise
          .then(endCoords => {
            const walking1Query: DirectionsQuery = {
              origin: destinationCoords,
              destination: endCoords,
              mode: TravelMode.WALKING
            };

            return getDirections(walking1Query);
          })

      }

      if (userData.searchParams.origin && userData.searchParams.destination && // both fields exist
        (JSON.stringify(userData.searchParams) !== JSON.stringify(previousUserData.searchParams))) { // the params have changed

        // deleteOperationPromise = admin.firestore()
        //   .doc('/users/' + event.params.userId).set({searchResult: null}, {merge: true});

        bicyclingDirectionsPromise = Promise.all([nearestStartStationPromise, nearestEndStationPromise])
          .then(stationsCoords => {
            const startCoords = stationsCoords[0];
            const endCoords = stationsCoords[1];
            const bicyclingQuery: DirectionsQuery = {
              origin: startCoords,
              destination: endCoords,
              mode: TravelMode.BICYCLING
            };

            return getDirections(bicyclingQuery);
          });

        return Promise.all([
          walking1DirectionsPromise,
          walking2DirectionsPromise,
          bicyclingDirectionsPromise,
          // deleteOperationPromise,
          nearestStartStationPromise,
          nearestEndStationPromise,
        ]).then(allDirections => {
          const walking1Travel = allDirections[0].data;
          const walking2Travel = allDirections[1].data;
          const bicyclingTravel = allDirections[2].data;

          let departureTime,
            stationStartTime,
            stationEndTime,
            arrivalTime

          if (userData.searchParams.timeTarget === TimeTarget.DEPART_AT) {

            departureTime = userData.searchParams.datetime
            stationStartTime = addSeconds(departureTime, walking1Travel.seconds);
            stationEndTime = addSeconds(stationStartTime, bicyclingTravel.seconds);
            arrivalTime = addSeconds(stationEndTime, walking2Travel.seconds);

          } else if (userData.searchParams.timeTarget === TimeTarget.ARRIVE_BY) {

            arrivalTime = userData.searchParams.datetime
            stationEndTime = subtractSeconds(arrivalTime, walking2Travel.seconds);
            stationStartTime = subtractSeconds(stationEndTime, bicyclingTravel.seconds);
            departureTime = subtractSeconds(stationStartTime, walking1Travel.seconds);
          }

          const tripData: TripData = {
            origin: {
              coords: originCoords,
              address: originAddress
            },
            departureTime: departureTime,
            walking1Travel: {
              feet: walking1Travel.feet,
              seconds: walking1Travel.seconds,
              points: walking1Travel.points
            },
            stationStart: {
              id: stationStartId,
              coords: stationStartCoords,
              address: stationStartAddress,
              time: stationStartTime,
              price: 0.50 // fix!
            },
            bicyclingTravel: {
              feet: bicyclingTravel.feet,
              seconds: bicyclingTravel.seconds,
              points: bicyclingTravel.points,
              price: 0.75
            },
            walking2Travel: {
              feet: walking2Travel.feet,
              seconds: walking2Travel.seconds,
              points: walking2Travel.points
            },
            stationEnd: {
              id: stationEndId,
              coords: stationEndCoords,
              address: stationEndAddress,
              time: stationEndTime,
              price: -0.50 // fix!
            },
            destination: {
              coords: destinationCoords,
              address: destinationAddress
            },
            arrivalTime: arrivalTime,
            status: TripStatus.PROPOSED
          };

          return tripData;
        })
        .then(tripData => {
          return admin.firestore()
            .doc('/users/' + event.params.userId).set(
              {
                searchResult: {
                  tripData: tripData,
                  error: null
                }
              }, { merge: true })
        })
        .catch(error => {
          return admin.firestore()
            .doc('/users/' + event.params.userId).set(
              {
                searchResult: {
                  tripData: null,
                  error: error
                }
              }, { merge: true })
        });
      }
    }

    return Promise.resolve();

  });
