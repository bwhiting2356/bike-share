import { googleMapsClient } from './googleMapsClient';

interface LatLng {
  lat: number;
  lng: number;
}

interface DistanceMatrixRequest {
  origins: string[];
  destinations: LatLng[];
  mode: string
}

export const findNearestStation = () => {
  const request: DistanceMatrixRequest = {
    origins: ['321 Magnolia, Millbrae CA'],
    destinations: [{
      lat: 37.596557,
      lng: -122.395373
    }, {
      lat: 37.608525,
      lng: -122.409767
    }],
    mode: 'walking'
  };
  googleMapsClient.distanceMatrix(request, (err, response) => console.log(response.json.rows[0].elements));
}

findNearestStation();
