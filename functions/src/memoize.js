import * as admin from 'firebase-admin';
export var memoize = function (func) {
    return function (params) {
        var stringParams = JSON.stringify(params);
        return admin.firestore()
            .collection(func.name)
            .doc(stringParams)
            .get()
            .then(function (docSnapshot) {
            if (docSnapshot.exists) {
                return Promise.resolve(docSnapshot.data());
            }
            return func(params)
                .then(function (response) {
                return admin.firestore()
                    .collection(func.name)
                    .doc(stringParams)
                    .set({ data: response })
                    .then(function () { return ({ data: response }); });
            });
        });
    };
};
//# sourceMappingURL=memoize.js.map