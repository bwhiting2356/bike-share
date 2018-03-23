import { googleMapsClient } from './googleMapsClient';
import { memoize } from '../memoize';
var funcGetDirections = function (query) {
    return new Promise(function (resolve, reject) {
        googleMapsClient.directions(query, function (err, res) {
            if (err)
                reject(err);
            var leg = res.json.routes[0].legs[0];
            var feet = leg.distance.value;
            var seconds = leg.duration.value;
            var points = leg.steps
                .map(function (step) { return step.start_location; });
            points.push(leg.end_location);
            resolve({ points: points, feet: feet, seconds: seconds });
        });
    });
};
export var getDirections = memoize(funcGetDirections);
//# sourceMappingURL=getDirections.js.map