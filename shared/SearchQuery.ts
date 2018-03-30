import { LatLng } from './LatLng';
import { TimeTarget } from './TimeTarget';

export interface SearchQuery {
  origin: {
    coords: LatLng;
    address: string;
  },
  destination: {
    coords: LatLng;
    address: string;
  },
  timeTarget: TimeTarget;
  datetime: Date;
}
