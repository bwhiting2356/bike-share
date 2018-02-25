import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { findNearestStations } from './googleMaps/findNearestStations';
import { serverMapGeoPointToLatLng } from "./googleMaps/serverMapGeoPointToLatLng";
import { getDirections } from './googleMaps/getDirections';
import { DistanceMatixQuery } from './shared/DistanceMatrixQuery';
import { DirectionsQuery } from './shared/DirectionsQuery';
import { TripData, TripStatus } from './shared/Trip';

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
      stationStartCoords,
      stationStartAddress,
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

    try {
      if (userData.searchParams) {
        if (userData.searchParams.origin) {
          originCoords = serverMapGeoPointToLatLng(userData.searchParams.origin.coords);
          originAddress = userData.searchParams.origin.address;

          nearestStartStationPromise = findNearestStations(originCoords)
            .then(response => {
              stationStartCoords = response.data[0].coords;
              stationStartAddress = response.data[0].address;
              return stationStartCoords
            })
            .catch(error => {
              return Promise.reject(error.message);
            });

          walking1DirectionsPromise = nearestStartStationPromise
            .then(startCoords => {
              const walking1Query: DirectionsQuery = {
                origin: originCoords,
                destination: startCoords,
                mode: TravelMode.WALKING
              };

              return getDirections(walking1Query);
            })
            .catch(error => {
              return Promise.reject(error.message);
            })
        }

        if (userData.searchParams.destination) {
          destinationCoords = serverMapGeoPointToLatLng(userData.searchParams.destination.coords);
          destinationAddress = userData.searchParams.destination.address;
          nearestEndStationPromise = findNearestStations(destinationCoords)
            .then(response => {
              stationEndCoords = response.data[0].coords;
              stationEndAddress = response.data[0].address;
              return stationEndCoords;
            })
            .catch(error => {
              return Promise.reject(error.message);
            });

          walking2DirectionsPromise = nearestEndStationPromise
            .then(endCoords => {
              const walking1Query: DirectionsQuery = {
                origin: destinationCoords,
                destination: endCoords,
                mode: TravelMode.WALKING
              };

              return getDirections(walking1Query);
            })
            .catch(error => {
              return Promise.reject(error.message);
            })

        }

        if (userData.searchParams.origin && userData.searchParams.destination && // both fields exist
          (JSON.stringify(userData.searchParams) !== JSON.stringify(previousUserData.searchParams))) { // the params have changed

          deleteOperationPromise = admin.firestore()
            .doc('/users/' + event.params.userId).set({searchResult: null}, {merge: true});

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
            })
            .catch(error => {
              return Promise.reject(error.message);
            })

          return Promise.all([
            walking1DirectionsPromise,
            walking2DirectionsPromise,
            bicyclingDirectionsPromise,
            deleteOperationPromise,
            nearestStartStationPromise,
            nearestEndStationPromise,
          ]).then(allDirections => {
            console.log("promise.all resolved")
            const walking1Travel = allDirections[0].data;
            const walking2Travel = allDirections[1].data;
            const bicyclingTravel = allDirections[2].data;

            const tripData: TripData = {
              origin: {
                coords: originCoords,
                address: originAddress
              },
              departureTime: userData.searchParams.datetime,
              walking1Travel: {
                feet: walking1Travel.feet,
                seconds: walking1Travel.seconds,
                points: walking1Travel.points
              },
              stationStart: {
                coords: stationStartCoords,
                address: stationStartAddress,
                time: new Date(), // fix!
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
                coords: stationEndCoords,
                address: stationEndAddress,
                time: new Date(), // fix!
                price: -0.50 // fix!
              },
              destination: {
                coords: destinationCoords,
                address: destinationAddress
              },
              arrivalTime: new Date(),
              status: TripStatus.PROPOSED
            };

            return tripData;
          })
          .then(tripData => {
            return admin.firestore()
              .doc('/users/' + event.params.userId).set({searchResult: tripData}, { merge: true })
          })
          .catch(error => {
            return Promise.reject(error);
          })
          .catch(error => {
            console.log("error from promise all is: ", error);
            return admin.firestore()
              .doc('/users/' + event.params.userId).set({ searchResult: { error: error.message }}, { merge: true })
          });
        }
      }
    } catch(error) {
      console.log("error from try/catch is: ", error);
        return admin.firestore()
          .doc('/users/' + event.params.userId).set({ searchResult: { error: error.message }}, { merge: true })
    }

    return Promise.resolve();

  });
