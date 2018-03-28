"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
describe("Build Station With Raw Distance", function () {
    it('should build an object with the distance computed from the location', function () {
        var marcy576 = { lat: 40.695203, lng: -73.949358 };
        var stationDoc = {
            exists: true,
            ref: null,
            id: null,
            readTime: null,
            get: null,
            data: function () {
                return {
                    address: null,
                    coords: { lat: 40.691351, lng: -73.951792 }
                };
            },
        };
        var t = true;
        t.should.equal(false);
        // assert(true, false);
        // buildStationWithRawDistance(stationDoc, marcy576).should.equal(null);
    });
});
//# sourceMappingURL=buildStationWithRawDistance.test.js.map