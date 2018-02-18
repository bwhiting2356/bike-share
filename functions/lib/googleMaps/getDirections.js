"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var googleMapsClient_1 = require("./googleMapsClient");
var memoize_1 = require("../memoize");
var funcGetDirections = function (query) {
    console.log("google maps query: ", query);
    return new Promise(function (resolve) {
        googleMapsClient_1.googleMapsClient.directions(query, function (err, res) {
            var result = res.json.routes[0].legs[0].steps
                .map(function (step) { return step.start_location; });
            result.push(query.destination);
            resolve(result);
        });
    });
};
exports.getDirections = memoize_1.memoize(funcGetDirections);
//# sourceMappingURL=getDirections.js.map