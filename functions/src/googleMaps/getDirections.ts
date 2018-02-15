import * as functions from 'firebase-functions';
import { googleMapsClient } from './googleMapsClient';
import { memoize } from '../memoize';

export const getDirections = functions.https
  .onRequest((request, response) => {
  const { origin, destination, mode } = request.body;

  const mapQuery = {
    origin: origin,
    destination: destination,
    mode: mode
  };

  // TODO: query is exactly the same as the request body, should I clean this up?

  const funcGetDirections = query => {
    return new Promise(resolve => {
      googleMapsClient.directions(query, (err, res) => {
        const result = res.json.routes[0].legs[0].steps
          .map(step => step.start_location);
        result.push(query.destination);
        resolve(result);
      });
    });
  }

  return memoize(funcGetDirections)(mapQuery)
    .then(result => response.send(result));
});
