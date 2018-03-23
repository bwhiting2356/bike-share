import { LatLng } from './LatLng';

export interface StationWithRawDistance {
  id: string;
  coords: LatLng;
  address: string;
  distanceFromLoc: number;
}
