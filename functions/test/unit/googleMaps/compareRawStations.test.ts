import * as chai from 'chai';
import * as mocha from 'mocha';

const should = chai.should();


import { compareStationsWithRawDistance } from '../../../src/googleMaps/compareStationsWithRawDistance';
import { LatLng } from '../../../shared/LatLng';
import { distanceCrowFlies } from '../../../src/googleMaps/distanceCrowFlies';
import { StationWithRawDistance } from '../../../shared/StationWithRawDistance';

describe("Compare Raw Stations", function() {
  it("should return the difference of distances", function() {
    const a: StationWithRawDistance = {
      id: null,
      coords: null,
      address: null,
      distanceFromLoc: 2,
    };

    const b: StationWithRawDistance = {
      id: null,
      coords: null,
      address: null,
      distanceFromLoc: 3,
    };

    compareStationsWithRawDistance(a, b)
      .should.equal(-1);
  })
}
