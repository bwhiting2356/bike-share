import { LatLng } from '../../shared/LatLng';

const deg2rad = deg => deg * (Math.PI/180);

export const distanceCrowFlies = (point1: LatLng, point2: LatLng): number => {
  // throw errors if there are missing values
  if (!point1) {
    throw new Error("point1 missing");
  }



  if (!point1.hasOwnProperty('lat')
    || !point1.hasOwnProperty('lng')
    || !point2.hasOwnProperty('lat')
    || !point2.hasOwnProperty('lng')) {
    throw new Error('point must be LatLng object  ');
  }
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(point2.lat - point1.lat);  // deg2rad below
  const dLon = deg2rad(point2.lng - point2.lng);
  const a = (
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  );
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d;
};


