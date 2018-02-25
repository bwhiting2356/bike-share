import { googleMapsClient } from './googleMapsClient';
import { memoize } from '../memoize';
import { DirectionsQuery } from '../shared/DirectionsQuery';
import { DirectionsResponse } from '../shared/DirectionsResponse';

const funcGetDirections = (query: DirectionsQuery): Promise<DirectionsResponse> => {
  return new Promise((resolve, reject) => {
    googleMapsClient.directions(query, (err, res) => {
      if (err) reject(err);
      const leg = res.json.routes[0].legs[0];
      const feet = leg.distance.value;
      const seconds = leg.duration.value;
      const points = leg.steps
        .map(step => step.start_location);
      points.push(leg.end_location);
      resolve({points, feet, seconds})
    });
  });
}

export const getDirections = memoize(funcGetDirections);
