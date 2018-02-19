import { googleMapsClient } from './googleMapsClient';
import { memoize } from '../memoize';
import { DirectionsQuery } from '../shared/DirectionsQuery';
import { DirectionsResponse } from '../shared/DirectionsResponse';

const funcGetDirections = (query: DirectionsQuery): Promise<DirectionsResponse> => {
  return new Promise(resolve => {
    googleMapsClient.directions(query, (err, res) => {
      const leg = res.json.routes[0].legs[0];
      const points = leg.steps
        .map(step => step.start_location);
      points.push(leg.end_location);
      resolve(points)
    });
  });
}

export const getDirections = memoize(funcGetDirections);
