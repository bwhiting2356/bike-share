const functions = require('firebase-functions');
const googleMapsClient = require('./googleMapsClient').googleMapsClient;
exports.getWalkingDirections = functions.https.onRequest(function (request, res) {
    const origin = request.body.origin;
    const destination = request.body.destination;
    const mode = request.body.mode;
    var req = {
        origin: origin,
        destination: destination,
        mode: mode
    };
    return new Promise(function (resolve) {
        return googleMapsClient.directions(req, function (err, response) {
            var result = response.json.routes[0].legs[0].steps.map(function (step) {
                return step.start_location;
            });
            result.push(req.destination);
            resolve(res.send(result));
        });
    });
});
//# sourceMappingURL=getWalkingDirections.js.map