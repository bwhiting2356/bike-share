import * as admin from 'firebase-admin';

interface Reservation {
  type: string;
  time: Date;
}

export const bookReservation = (id: string, time: Date, type: string) => {
  const reservation: Reservation = {
    type,
    time
  };

  return admin.firestore()
    .doc('/stations/' + id)
    .collection('/upcomingReservations')
    .add(reservation)
}
