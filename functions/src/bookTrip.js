import * as functions from 'firebase-functions';
import { bookReservation } from './bookReservation';
import { ReservationType } from './shared/ReservationType';
var cors = require('cors')({
    origin: true,
});
export var bookTrip = functions.https.onRequest(function (req, res) {
    cors(req, res, function () {
        var _a = req.body, userId = _a.userId, tripData = _a.tripData;
        var stationStartId = tripData.stationStart.id;
        var stationStartTime = tripData.stationStart.time;
        var stationEndId = tripData.stationEnd.id;
        var stationEndTime = tripData.stationStart.time;
        var reservationStartPromise = bookReservation(stationStartId, stationStartTime, ReservationType.PICKUP);
        var reservationEndPromise = bookReservation(stationEndId, stationEndTime, ReservationType.DROPOFF);
        // Promise.all([reservationStartPromise, reservationEndPromise])
        //   .then(success => {
        //
        //
        //
        //     return admin.firestore().doc('/users/' + userId).collection('/trips').add()
        //     console.log(success);
        //     res.json({success: success})
        //   })
        //   .catch(err => {
        //     console.log(err)
        //     res.json({error: err});
        //   });
    });
});
//# sourceMappingURL=bookTrip.js.map