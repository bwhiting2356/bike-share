"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin = require("firebase-admin");
exports.bookReservation = function (id, time, type) {
    var reservation = {
        type: type,
        time: time
    };
    return admin.firestore()
        .doc('/stations/' + id)
        .collection('/upcomingReservations')
        .add(reservation);
};
//# sourceMappingURL=bookReservation.js.map