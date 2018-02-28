import * as admin from 'firebase-admin';
import { DocumentSnapshot } from "@google-cloud/firestore";

export const memoize = (func: (params) => Promise<any>): (params) => Promise<any> => {
  return params => {
    const stringParams: string = JSON.stringify(params);
    return admin.firestore()
      .collection(func.name)
      .doc(stringParams)
      .get()
      .then((docSnapshot: DocumentSnapshot) => {
        if (docSnapshot.exists) {
          return Promise.resolve(docSnapshot.data());
        }
        return func(params)
          .then(response => {
            console.log("does this happen?")
            return admin.firestore()
              .collection(func.name)
              .doc(stringParams)
              .set({data: response })
              .then(() => ({ data: response }));
          });
      })
  }
};
