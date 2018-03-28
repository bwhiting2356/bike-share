import * as functions from 'firebase-functions';
import { findNearestStations } from './googleMaps/findNearestStations';
import { getDirections } from "./googleMaps/getDirections";
import { serverMapGeoPointToLatLng } from "./googleMaps/serverMapGeoPointToLatLng";
import * as admin from 'firebase-admin';
import { funcSearchBikeTrips } from './searchBikeTrips';


export const searchParamsUpdated = functions.firestore
  .document('/users/{userId}')
  .onUpdate(async event => {

    let originCoords,
      originAddress,
      destinationCoords,
      destinationAddress,
      nearestOriginStationsPromise,
      nearestDestinationStationsPromise,
      walking1PointsPromise,
      walking2PointsPromise,
      stationStartCoords,
      stationStartAddress,
      stationEndCoords,
      stationEndAddress;

    const userData = event.data.data();
    const departureTime = new Date(userData.searchDatetime); // TODO: make this work for other time target

    if (userData.searchOrigin) {
      originCoords = serverMapGeoPointToLatLng(userData.searchOrigin.coords);
      originAddress = userData.searchOrigin.address;
      console.log('origin coords: ', originCoords);
      console.log('origin address: ', originAddress);

      nearestOriginStationsPromise = findNearestStations(originCoords);

      nearestOriginStationsPromise
        .then(async response => {
          stationStartCoords = response.data[0].coords;
          stationStartAddress = response.data[0].address;

          const walking1Query = {
            origin: originCoords,
            destination: stationStartCoords,
            mode: 'walking'
          };

          walking1PointsPromise = getDirections(walking1Query);

        })
        .catch(err => {
          console.log('line 43: ', err)
        })
    }

    if (userData.searchDestination) {
      destinationCoords = serverMapGeoPointToLatLng(userData.searchDestination.coords);
      destinationAddress = userData.searchDestination.address;
      console.log('destination coords: ', destinationCoords);
      console.log('destination address: ', destinationAddress);

      nearestDestinationStationsPromise = findNearestStations(destinationCoords);


      nearestDestinationStationsPromise
        .then(async response => {
          stationEndCoords = response.data[0].coords;
          stationEndAddress = response.data[0].address;

          const walking2Query = {
            origin: destinationCoords,
            destination: stationEndCoords,
            mode: 'walking'
          };

          walking2PointsPromise = getDirections(walking2Query);

        })
        .catch(err => {
          console.log('line 69: ', err)
        })
    }

    if (userData.searchOrigin && userData.searchDestination) {
      return admin.firestore()
        .doc('/users/' + event.params.userId).update({searchResult: null})
        .then(() => {
          console.log("did I get here line 90?")
          return funcSearchBikeTrips(
            userData.searchOrigin,
            userData.searchDestination,
            userData.datetime,
            userData.timeTarget
          ).then(result => {
            console.log("did I get here line 96?")
            return admin.firestore()
              .doc('/users/' + event.params.userId).update({searchResult: result})
              .then(() => console.log("did I get here?"))
          })
        })
    } else {
      return Promise.resolve();
    }
  });

