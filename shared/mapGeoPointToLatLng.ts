import { LatLng } from './LatLng';
import * as firebase from 'firebase/app';

interface GeoPoint {
  coords: {
    _lat: number;
    _long: number;
  }
}

export const mapGeoPointToLatLng = (geopoint: GeoPoint): LatLng => {
  return { lat: geopoint.coords._lat, lng: geopoint.coords._long };
}
