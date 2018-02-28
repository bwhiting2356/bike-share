import * as admin from 'firebase-admin';

export const findBestReservation = (stationDataList, time: Date, type: string) => {

  let counter = 0;
  let reservationFound = false;

  while (!reservationFound && counter < stationDataList.length - 1) {
    const currentStationId = stationDataList[counter].id;
    admin.firestore().doc('/stations/' + currentStationId).get()



  }

}
