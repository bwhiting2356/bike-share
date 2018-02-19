import { LatLng } from './LatLng';

export interface DirectionsResponse {
  points: LatLng[];
  feet: number;
  seconds: number;
}
