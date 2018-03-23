import { StationWithRawDistance } from '../../shared/StationWithRawDistance';

export const compareStationsWithRawDistance = (a: StationWithRawDistance, b: StationWithRawDistance): number => {
  return a.distanceFromLoc - b.distanceFromLoc
};
