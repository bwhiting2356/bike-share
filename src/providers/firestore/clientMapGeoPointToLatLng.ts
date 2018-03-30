import { LatLng } from '../../../shared/LatLng';

export const clientMapGeoPointToLatLng = (geopoint: any): LatLng => { // TODO: save for when geoqueries come to firestore
  return { lat: geopoint.latitude, lng: geopoint.longitude };
};
