import { StationWithRawDistance } from '../../shared/StationWithRawDistance';
import { distanceCrowFlies } from './distanceCrowFlies';
import { serverMapGeoPointToLatLng } from './serverMapGeoPointToLatLng';
import { LatLng } from '../../shared/LatLng';
import DocumentSnapshot = FirebaseFirestore.DocumentSnapshot;



export const buildStationWithRawDistance = (doc: DocumentSnapshot, loc: LatLng): StationWithRawDistance => {
  const r = {
    id: doc.id,
    coords: serverMapGeoPointToLatLng(doc.data().coords),
    distanceFromLoc: distanceCrowFlies(loc, serverMapGeoPointToLatLng(doc.data().coords)),
    address: doc.data().address
  };
  console.log("r", r);
  return r;
};

const marcy576: LatLng = { lat: 40.695203, lng: -73.949358 };
const stationDoc: DocumentSnapshot = {
  exists: true,
  ref: null,
  id: null,
  readTime: null,
  get: null,
  data: () => {
    return {
      address: null,
      coords: { lat: 40.691351, lng: -73.951792}
    }
  },
};


const result = buildStationWithRawDistance(stationDoc, marcy576);
console.log("result: ", result);
