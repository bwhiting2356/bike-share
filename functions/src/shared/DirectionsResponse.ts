import { LatLng } from './LatLng';

export interface DirectionsResponse {
  points: LatLng[];
  startAddress: string;
  endAddress: string;
}
