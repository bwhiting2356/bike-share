import { googleMapsClient } from './googleMapsClient';
import { memoize } from '../memoize';
import { DirectionsQuery } from '../shared/DirectionsQuery';

const funcGetDirections = (query: DirectionsQuery): Promise<any> => {
  console.log("google maps query: ", query);
  return new Promise(resolve => {
    googleMapsClient.directions(query, (err, res) => {
      const result = res.json.routes[0].legs[0].steps
        .map(step => step.start_location);
      result.push(query.destination);
      resolve(result);
    });
  });
}

export const getDirections = memoize(funcGetDirections);
