import { LatLng } from './LatLng';
// import * as firebase from 'firebase/app';

// interface GeoPoint {
//   coords: {
//     _lat: number;
//     _long: number;
//   }
// }

export const mapGeoPointToLatLng = (geopoint): LatLng => {
  return { lat: geopoint.coords._latitude, lng: geopoint.coords._longitude };
}
