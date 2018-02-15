import * as admin from 'firebase-admin';

export const memoize = func => {

  return params => {
    const stringParams = JSON.stringify(params);
    return admin.firestore()
      .collection(func.name)
      .doc(stringParams)
      .get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          return Promise.resolve(docSnapshot.data());
        }
        return func(params)
          .then(response => {
            return admin.firestore()
              .collection(func.name)
              .doc(stringParams)
              .set({response: response})
              .then(() => response)
          })
      });
  }
};
