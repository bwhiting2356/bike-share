"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin = require("firebase-admin");
exports.memoize = function (func) {
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
                    .set({ response: response })
                    .then(function () { return response; });
            });
        });
    };
};
//# sourceMappingURL=memoize.js.map