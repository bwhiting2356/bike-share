import * as functions from 'firebase-functions';
import { findNearestStations } from './googleMaps/findNearestStations';
import { getDirections } from "./googleMaps/getDirections";
import { TripData, TripStatus } from './shared/Trip';
import { serverMapGeoPointToLatLng } from "./googleMaps/serverMapGeoPointToLatLng";
import * as admin from 'firebase-admin';


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

    const previousResultDeletePromise = admin.firestore()
      .doc('/users/' + event.params.userId).update({searchResult: null});

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

              const stationStartTime: Date = new Date();
              stationStartTime.setSeconds(departureTime.getSeconds() + walkingResults[0].data.seconds);

              const stationEndTime: Date = new Date();
              stationEndTime.setSeconds(stationStartTime.getSeconds() + bicyclingResults.data.seconds);

              const arrivalTime: Date = new Date();
              arrivalTime.setSeconds(stationEndTime.getSeconds() + walkingResults[1].data.seconds);

              const tripData: TripData = {
                origin: {
                  coords: originCoords,
                  address: originAddress
                },
                departureTime: departureTime,
                walking1Travel: {
                  seconds: walkingResults[0].data.seconds,
                  feet: walkingResults[0].data.feet,
                  points: walkingResults[0].data.points
                },
                stationStart: {
                  coords: stationStartCoords,
                  address: stationStartAddress,
                  price: -0.50, // TODO: actually compute price,
                  time: stationStartTime
                },
                bicyclingTravel: {
                  seconds: bicyclingResults.data.seconds,
                  feet: bicyclingResults.data.feet,
                  points: bicyclingResults.data.points,
                  price: -0.80 // TODO: actually compute price
                },
                stationEnd: {
                  coords: stationEndCoords,
                  address: stationEndAddress,
                  price: 0.75, // TODO: actually compute price
                  time: stationEndTime
                },
                walking2Travel: {
                  seconds: walkingResults[1].data.seconds,
                  feet: walkingResults[1].data.feet,
                  points: walkingResults[1].data.points
                },
                destination: {
                  coords: destinationCoords,
                  address: destinationAddress,
                },
                arrivalTime: arrivalTime,
                status: TripStatus.PROPOSED
              };


              return previousResultDeletePromise.then(() => {
                admin.firestore().doc('/users/' + event.params.userId).update({searchResult: tripData})
              });


              // TODO: get departure time
              // TODO: Get travel times from each directinos leg
              // TODO: Compute arrival time
            })
        })
    } else {
      return Promise.resolve();
    }
  });

