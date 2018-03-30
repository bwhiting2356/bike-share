import * as firebase from 'firebase/app';
import { LatLng } from './LatLng';

export const mapLatLngToGeoPoint = (latlng: LatLng) => {
  return new firebase.firestore.GeoPoint(latlng.lat, latlng.lng);
}
