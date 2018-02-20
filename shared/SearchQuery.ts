import { LatLng } from './LatLng';

export interface SearchQuery {
  origin: {
    coords: LatLng;
    address: string;
  },
  destination: {
    coords: LatLng;
    address: string;
  },
  timeTarget: string;
  datetime: Date;
}
