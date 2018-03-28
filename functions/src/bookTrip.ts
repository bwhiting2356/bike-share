import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { bookReservation } from './bookReservation';
import { ReservationType } from '../shared/ReservationType';

const cors = require('cors')({
  origin: true,
});


export const bookTrip = functions.https.onRequest((req, res) => {
  cors(req, res, () => {

    const { userId, tripData } = req.body;
    const stationStartId = tripData.stationStart.id;
    const stationStartTime = tripData.stationStart.time;
    const stationEndId = tripData.stationEnd.id;
    const stationEndTime = tripData.stationStart.time;

    const reservationStartPromise = bookReservation(stationStartId, stationStartTime, ReservationType.PICKUP);
    const reservationEndPromise = bookReservation(stationEndId, stationEndTime, ReservationType.DROPOFF);

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
  })




});
