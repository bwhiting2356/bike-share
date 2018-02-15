"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var googleMapsClient_1 = require("./googleMapsClient");
var memoize_1 = require("../memoize");
exports.getDirections = functions.https.onRequest(function (request, response) {
    var _a = request.body, origin = _a.origin, destination = _a.destination, mode = _a.mode;
    var mapQuery = {
        origin: origin,
        destination: destination,
        mode: mode
    };
    // TODO: query is exactly the same as the request body, should I clean this up?
    var funcGetDirections = function (query) {
        return new Promise(function (resolve) {
            googleMapsClient_1.googleMapsClient.directions(query, function (err, res) {
                var result = res.json.routes[0].legs[0].steps
                    .map(function (step) { return step.start_location; });
                result.push(query.destination);
                resolve(result);
            });
        });
    };
    return memoize_1.memoize(funcGetDirections)(mapQuery)
        .then(function (result) { return response.send(result); });
});
//# sourceMappingURL=getDirections.js.map