import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
import { googleMapsClient } from './googleMapsClient';
import { serverMapGeoPointToLatLng } from './serverMapGeoPointToLatLng';
import { memoize } from '../memoize';

const mergeDataWithIds = (response, stationsPlusIds) => {
  const newData = [];
  for (let i = 0; i < response.length; i++) {
    newData.push({
      id: stationsPlusIds[i].id,
      data: response[i]
    })
  }
  return newData;
};

const compareStationData = (a, b) => {
  return a.data.distance.value - b.data.distance.value;
};

export const findNearestStations = functions.https
  .onRequest((request, response) => {

    const { location } = request.body;

    const funcFindNearestStations = loc => {

      return admin.firestore().collection('/stations')
        .get()
        .then(querySnapshot => {

          const stationsPlusId = [];

          // get all the stations from the database (maybe just keep this in a constant if it never changes?)

          querySnapshot.docs.forEach(function (queryDocumentSnapshot) {
            stationsPlusId.push({
              id: queryDocumentSnapshot.id,
              data: serverMapGeoPointToLatLng(queryDocumentSnapshot.data().coords)
            })
          });

          // make a version with only the data, to send to the google maps api

          const stations = stationsPlusId.map(function (station) {
            return station.data
          });

          // make request to google

          const req = {
            origins: [loc],
            destinations: stations,
            mode: 'walking'
          };

          return new Promise(function (resolve) {
            googleMapsClient.distanceMatrix(req, function (err, res) {
              const mergedData = mergeDataWithIds(res.json.rows[0].elements, stationsPlusId);
              const sortedData = mergedData.sort(compareStationData);
              resolve({response: sortedData})
            });
          });
        });
    };

    return memoize(funcFindNearestStations)(location)
      .then(result => response.send(result));

  });
