import * as chai from 'chai';
import * as mocha from 'mocha';

const should = chai.should();


import { distanceCrowFlies } from '../../src/googleMaps/distanceCrowFlies';
import { LatLng } from '../../shared/LatLng';

describe("Distance Crow Flies", function() {
  it("should return correct distance", function() {
    const marcy576: LatLng = { lat: 40.695186, lng: -73.949433 };
    const macDonough782: LatLng = { lat: 40.684534, lng: -73.915162 };
    distanceCrowFlies(marcy576, macDonough782)
      .should.equal(1.1844483586178762);
  })

  // TODO: test that it throws errors properly

  // it("should throw error if point 1 is missing", function() {
  //   const marcy576: LatLng = { lat: 40.695186, lng: -73.949433 };
  //   const macDonough782: LatLng = { lat: 40.684534, lng: -73.915162 };
  //
  //
  //   chai.expect(distanceCrowFlies(null, macDonough782)).to.throw(new Error("point 1 missing"))
  // })
})



