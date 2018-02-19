"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var googleMapsClient_1 = require("./googleMapsClient");
var memoize_1 = require("../memoize");
var funcGetDirections = function (query) {
    return new Promise(function (resolve) {
        googleMapsClient_1.googleMapsClient.directions(query, function (err, res) {
            var leg = res.json.routes[0].legs[0];
            var points = leg.steps
                .map(function (step) { return step.start_location; });
            points.push(leg.end_location);
            resolve(points);
        });
    });
};
exports.getDirections = memoize_1.memoize(funcGetDirections);
//# sourceMappingURL=getDirections.js.map