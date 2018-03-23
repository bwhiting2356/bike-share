import { LatLng } from './LatLng';

export interface DirectionsQuery {
  origin: LatLng;
  destination: LatLng;
  mode: string;
}
