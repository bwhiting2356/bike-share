import * as chai from 'chai';
import * as mocha from 'mocha';

const should = chai.should();


import { compareStationsWithRawDistance } from '../../../src/googleMaps/compareStationsWithRawDistance';
import { LatLng } from '../../../shared/LatLng';
import { distanceCrowFlies } from '../../../src/googleMaps/distanceCrowFlies';
import { StationWithRawDistance } from '../../../shared/StationWithRawDistance';
import DocumentSnapshot = FirebaseFirestore.DocumentSnapshot;
import { buildStationWithRawDistance } from '../../../src/googleMaps/buildStationWithRawDistance';


describe("Build Station With Raw Distance", function() {

  it('should build an object with the distance computed from the location', function() {
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
    const t = true;
    t.should.equal(false);
    // assert(true, false);

    // buildStationWithRawDistance(stationDoc, marcy576).should.equal(null);


  })
})
