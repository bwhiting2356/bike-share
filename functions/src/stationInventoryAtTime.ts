import * as admin from 'firebase-admin';
import { ReservationType } from './shared/ReservationType';



export const stationInventoryAtTime = (stationId: string, time: Date, type: string) => {
  admin.firestore().doc('/stations/' + stationId)
    .collection("/upcomingReservations")
    .get()

  // const reservations = [{}, {}, {}];
  //
  // // can I allow this pickup or dropoff?
  // // what price?
  //
  // for (let i = 0; i < reservations.length; i++) {
  //   if (reservations[i].type === ReservationType.PICKUP) {
  //
  //
  //   }
  // }
  //
  // if (type === ReservationType.PICKUP) {
  //
  //
  // } else if (type === ReservationType.DROPOFF) {
  //
  // }

}
