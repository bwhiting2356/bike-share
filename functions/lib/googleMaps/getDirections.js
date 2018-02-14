var googleMapsClient = require('./googleMapsClient');
exports.getDirections = function (origin, destination, mode) {
    var req = {
        origin: origin,
        destination: destination,
        mode: mode
    };
    return new Promise(function (resolve) {
        googleMapsClient.directions(req, function (err, response) {
            var result = response.json.routes[0].legs[0].steps.map(function (step) {
                return step.start_location;
            });
            result.push(req.destination);
            resolve(result);
        });
    });
};
//# sourceMappingURL=getDirections.js.map