import * as chai from 'chai';
var should = chai.should();
import { compareStationsWithRawDistance } from '../../../src/googleMaps/compareStationsWithRawDistance';
describe("Compare Raw Stations", function () {
    it("should return the difference of distances", function () {
        var a = {
            id: null,
            coords: null,
            address: null,
            distanceFromLoc: 2,
        };
        var b = {
            id: null,
            coords: null,
            address: null,
            distanceFromLoc: 3,
        };
        compareStationsWithRawDistance(a, b)
            .should.equal(-1);
    });
});
//# sourceMappingURL=compareRawStations.test.js.map