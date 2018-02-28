const admin = require('firebase-admin');
import { serverMapGeoPointToLatLng } from './serverMapGeoPointToLatLng';
import { memoize } from '../memoize';
import { LatLng } from '../shared/LatLng';
import { distanceCrowFlies } from '../distanceCrowFlies';
import { DistanceMatixQuery } from "../shared/DistanceMatrixQuery";
import { googleMapsClient } from "./googleMapsClient";

const mergeDataWithIds = (response, stationsData) => {
  const newData = [];
  for (let i = 0; i < response.length; i++) {
    newData.push({
      id: stationsData[i].id,
      coords: stationsData[i].coords,
      address: stationsData[i].address,
      data: response[i]
    })
  }
  return newData;
};

const compareStationData = (a, b) => {
  return a.data.distance.value - b.data.distance.value;
};

const funcFindNearestStations = (loc: LatLng) => {

    return admin.firestore().collection('/stations')
    .get()
    .then((snapshot) => {

      const stationsData = [];

      snapshot.docs.forEach(doc => {
        stationsData.push({
          id: doc.id,
          coords: serverMapGeoPointToLatLng(doc.data().coords),
          distanceFromLoc: distanceCrowFlies(loc, serverMapGeoPointToLatLng(doc.data().coords)),
          address: doc.data().address
        })
      });
      const sortedStations = stationsData.sort((a, b) => a.distanceFromLoc - b.distanceFromLoc);
      const closest10Stations = sortedStations.slice(0, 9);

      if (closest10Stations[0].distanceFromLoc > 5) {
        // throw new Error("No nearby stations.")
        return Promise.reject('No nearby stations');
      }

      console.log(JSON.stringify(closest10Stations));


      const stationsCoords = closest10Stations.map(station => station.coords);

      const req: DistanceMatixQuery = {
        origins: [loc],
        destinations: stationsCoords,
        mode: 'walking'
      };

      return new Promise((resolve, reject) => {
        googleMapsClient.distanceMatrix(req, (err, res) => {
          if (err) reject(err);
          const mergedData = mergeDataWithIds(res.json.rows[0].elements, stationsData);
          const sortedData = mergedData.sort(compareStationData);
          resolve(sortedData)
        });
      });
    });
};

export const findNearestStations = memoize(funcFindNearestStations);



