import { googleMapsClient } from './googleMapsClient';
import { memoize } from '../memoize';
import { DirectionsQuery } from '../shared/DirectionsQuery';
import { DirectionsResponse } from '../shared/DirectionsResponse';

const funcGetDirections = (query: DirectionsQuery): Promise<DirectionsResponse> => {
  console.log("get directions line 7");
  return new Promise(resolve => {
    googleMapsClient.directions(query, (err, res) => {
      const leg = res.json.routes[0].legs[0];
      const feet = leg.distance.value;
      const seconds = leg.distance.value;
      const points = leg.steps
        .map(step => step.start_location);
      points.push(leg.end_location);
      console.log("get directions line 15");
      resolve({points, feet, seconds})
    });
  });
}

export const getDirections = memoize(funcGetDirections);
