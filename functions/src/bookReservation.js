import * as admin from 'firebase-admin';
export var bookReservation = function (id, time, type) {
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