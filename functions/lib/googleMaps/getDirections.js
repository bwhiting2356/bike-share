var functions = require('firebase-functions');
var googleMapsClient = require('./googleMapsClient').googleMapsClient;
var memoize = require('../memoize').memoize;
exports.getDirections = functions.https.onRequest(function (request, response) {
    var origin = request.body.origin;
    var destination = request.body.destination;
    var mode = request.body.mode;
    var query = {
        origin: origin,
        destination: destination,
        mode: mode
    };
    function getDirections(query) {
        return new Promise(function (resolve) {
            googleMapsClient.directions(query, function (err, res) {
                var result = res.json.routes[0].legs[0].steps.map(function (step) {
                    return step.start_location;
                });
                result.push(query.destination);
                resolve(result);
            });
        });
    }
    return memoize(getDirections)(query)
        .then(function (result) {
        return response.send(result);
    });
});
//# sourceMappingURL=getDirections.js.map