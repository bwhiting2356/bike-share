import * as functions from 'firebase-functions';
import { findNearestStations } from './googleMaps/findNearestStations';
import { getDirections } from "./googleMaps/getDirections";
import { TripData } from './shared/Trip';
import { serverMapGeoPointToLatLng } from "./googleMaps/serverMapGeoPointToLatLng";


export const searchParamsUpdated = functions.firestore
  .document('/users/{userId}')
  .onUpdate(async event => {

    let
      originCoords,
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
          let walking1Query = {
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
          let walking2Query = {
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

    // if neither was changed, exit this function

    if (userData.searchOrigin && userData.searchDestination) {
      return Promise.all([nearestOriginStationsPromise, nearestDestinationStationsPromise])
        .then(async results => {

          let bicyclingQuery = {
            origin: results[0].data[0].coords,
            destination: results[1].data[0].coords,
            mode: 'bicycling'
          };

          return await getDirections(bicyclingQuery);
        }).then(bicyclingResults => {

          return Promise.all([walking1PointsPromise, walking2PointsPromise])
            .then(walkingResults => {

              console.log('all items: ');
              console.log('origin coords: ', originCoords);
              console.log('origin address: ', originAddress)
              console.log('walking1Points: ', walkingResults[0].data);
              console.log('stationStart coords: ', stationStartCoords);
              console.log('stationStart address: ', stationStartAddress);
              console.log('bicyclingPoints: ', bicyclingResults.data)
              console.log('stationEnd coords: ', stationEndCoords);
              console.log('stationEnd address: ', stationEndAddress);
              console.log('walking2Points: ', walkingResults[1].data);
              console.log('destination coords: ', destinationCoords);
              console.log('destination address: ', destinationAddress);
            })
        })
    } else {
      return Promise.resolve();
    }
  });

