import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);


export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
 console.log("hello world triggered");
});

export const itemNameUppercase = functions.firestore.document('items/{itemId}').onCreate((event) => {
  const data = event.data.data();
  console.log("data: ", data);
  return event.data.ref.set({test: 'testy test'}, {merge: true});
});

export const findNearbyStations = functions.firestore.document('users/{userId}').onUpdate(event => {

  const searchDestination = event.data.data().searchDestination;
  const searchOrigin = event.data.data().searchOrigin;
  console.log('search origin ', searchOrigin);
  console.log('search destination ', searchDestination);
  return Promise.resolve();

});
