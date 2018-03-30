import { LatLng } from './LatLng';

export const mapGeoPointToLatLng = (geopoint: any): LatLng => { // TODO: find the real GeoPoint type
  return { lat: geopoint.coords._latitude, lng: geopoint.coords._longitude };
}
