import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
import { googleMapsClient } from './googleMapsClient';
import { serverMapGeoPointToLatLng } from './serverMapGeoPointToLatLng';
import { memoize } from '../memoize';
import { LatLng } from '../shared/LatLng';
import { DistanceMatixQuery } from '../shared/DistanceMatrixQuery';

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

const funcFindNearestStations = (loc: LatLng) => {
  console.log("find nearest stations line 27");
  return admin.firestore().collection('/stations')
    .get()
    .then(querySnapshot => {

      const stationsData = [];

      // get all the stations from the database (maybe just keep this in a constant if it never changes?)

      querySnapshot.docs.forEach(function (queryDocumentSnapshot) {
        stationsData.push({
          id: queryDocumentSnapshot.id,
          coords: serverMapGeoPointToLatLng(queryDocumentSnapshot.data().coords),
          address: queryDocumentSnapshot.data().address
        })
      });

      // make a version with only the data, to send to the google maps api

      const stationsCoords = stationsData.map(station => station.coords);
      console.log("stations coords: ", stationsCoords);

      // make request to google

      const req: DistanceMatixQuery = {
        origins: [loc],
        destinations: stationsCoords,
        mode: 'walking'
      };

      return new Promise(resolve => {
        googleMapsClient.distanceMatrix(req, (err, res) => {

          console.log("find nearest stations line 59");
          console.log('err: ', JSON.stringify(err));
          console.log("res: ", JSON.stringify(res));
          const mergedData = mergeDataWithIds(res.json.rows[0].elements, stationsData);
          console.log("merged data:", mergedData);
          const sortedData = mergedData.sort(compareStationData);
          console.log("sorted data:", sortedData);
          resolve(sortedData)
        });
      });
    });
};


export const findNearestStations = memoize(funcFindNearestStations);
