"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var bookReservation_1 = require("./bookReservation");
var ReservationType_1 = require("../shared/ReservationType");
var cors = require('cors')({
    origin: true,
});
exports.bookTrip = functions.https.onRequest(function (req, res) {
    cors(req, res, function () {
        var _a = req.body, userId = _a.userId, tripData = _a.tripData;
        var stationStartId = tripData.stationStart.id;
        var stationStartTime = tripData.stationStart.time;
        var stationEndId = tripData.stationEnd.id;
        var stationEndTime = tripData.stationStart.time;
        var reservationStartPromise = bookReservation_1.bookReservation(stationStartId, stationStartTime, ReservationType_1.ReservationType.PICKUP);
        var reservationEndPromise = bookReservation_1.bookReservation(stationEndId, stationEndTime, ReservationType_1.ReservationType.DROPOFF);
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