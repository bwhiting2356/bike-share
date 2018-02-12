import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
import { LatLng } from '../../shared/LatLng';

admin.initializeApp(functions.config().firebase);


export const helloWorldUpdate = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase updated!");
 console.log("hello world triggered");
});
//
// export const itemNameUppercase = functions.firestore.document('items/{itemId}').onCreate((event) => {
//   const data = event.data.data();
//   console.log("data: ", data);
//   return event.data.ref.set({test: 'testy test'}, {merge: true});
// });

const mapGeoPointToLatLng = (geopoint): LatLng => {
  return { lat: geopoint.coords._latitude, lng: geopoint.coords._longitude };
}

export const findNearest = functions.firestore.document('users/{userId}').onUpdate(event => {
  console.log('hello line 34');
  // admin.firestore().collection('stations')
  //   .get()
  //   .then(querySnapShot => {
  //     let stations = [];
  //     querySnapShot.forEach(doc => {
  //       let station: LatLng = mapGeoPointToLatLng(doc.data());
  //       stations.push(station);
  //     });
  //
  //
  //     console.log(stations);
  //   })
  // const searchDestination = event.data.data().searchDestination;
  // const searchOrigin = event.data.data().searchOrigin;
  // console.log('search origin ', searchOrigin);
  // console.log('search destination ', searchDestination);
  return Promise.resolve();

});
