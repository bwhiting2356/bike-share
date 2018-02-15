const functions = require('firebase-functions');
const admin = require('firebase-admin');
const googleMapsClient = require('./googleMapsClient').googleMapsClient;
exports.getDirections = functions.https.onRequest(function (request, response) {
    const origin = request.body.origin;
    const destination = request.body.destination;
    const mode = request.body.mode;
    var query = {
        origin: origin,
        destination: destination,
        mode: mode
    };
    var stringQuery = JSON.stringify(query);
    return admin.firestore()
        .collection('/getDirections')
        .doc(stringQuery)
        .get()
        .then(function (docSnapshot) {
        if (docSnapshot.exists) {
            return Promise.resolve(response.send(docSnapshot.data()));
        }
        else {
            return new Promise(function (resolve) {
                return googleMapsClient.directions(query, function (err, res) {
                    var result = res.json.routes[0].legs[0].steps.map(function (step) {
                        return step.start_location;
                    });
                    result.push(query.destination);
                    resolve(result);
                });
            })
                .then(function (result) {
                return admin.firestore()
                    .collection('/getDirections')
                    .doc(stringQuery).set({ response: result })
                    .then(function () {
                    return result;
                });
            })
                .then(function (result) {
                response.send({ response: result });
            });
        }
    });
});
//# sourceMappingURL=getDirections.js.map