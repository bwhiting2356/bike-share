import * as functions from 'firebase-functions';
import { findNearestStations } from './googleMaps/findNearestStations';

export const userDataUpdated = functions.firestore
  .document('/users/{userId}')
  .onWrite(async event => {
    const userData = event.data.data();

    if (userData.searchParams) {
      if (userData.searchParams.origin) {
        const originCoords = userData.searchParams.origin.coords;
        const nearestStartStation = await findNearestStations(originCoords).then(response => {
          const coords = response.data[0].coords;
          const address = response.data[0].address;
          return { coords, address }
        });
        console.log("nearestStartStation: ", nearestStartStation);
      }
    }

    return Promise.resolve();

  });
