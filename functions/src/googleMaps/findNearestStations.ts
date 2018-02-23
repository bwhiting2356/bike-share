import * as functions from 'firebase-functions';
import * as GeoFire from 'geofire';
const admin = require('firebase-admin');
// import { googleMapsClient } from './googleMapsClient';
import { serverMapGeoPointToLatLng } from './serverMapGeoPointToLatLng';
import { memoize } from '../memoize';
import { LatLng } from '../shared/LatLng';
import { distanceCrowFlies } from '../distanceCrowFlies';
import { DistanceMatixQuery } from "../shared/DistanceMatrixQuery";
import { googleMapsClient } from "./googleMapsClient";
// import { DistanceMatixQuery } from '../shared/DistanceMatrixQuery';

const mergeDataWithIds = (response, stationsData) => {
  console.log("line 10 inside merge data");
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

export const funcFindNearestStations = async (loc: LatLng) => {

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
      const stationsCoords = closest10Stations.map(station => station.coords);

      const req: DistanceMatixQuery = {
        origins: [loc],
        destinations: stationsCoords,
        mode: 'walking'
      };

      return new Promise(resolve => {
        googleMapsClient.distanceMatrix(req, (err, res) => {
          if (err) {
            throw new Error('distance matrix error');
          }
          const mergedData = mergeDataWithIds(res.json.rows[0].elements, stationsData);
          const sortedData = mergedData.sort(compareStationData);
          resolve(sortedData)
        });
      });
    });
};


export const findNearestStations = memoize(funcFindNearestStations);



