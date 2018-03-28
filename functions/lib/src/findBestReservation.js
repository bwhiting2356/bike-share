"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin = require("firebase-admin");
exports.findBestReservation = function (stationDataList, time, type) {
    var counter = 0;
    var reservationFound = false;
    while (!reservationFound && counter < stationDataList.length - 1) {
        var currentStationId = stationDataList[counter].id;
        admin.firestore().doc('/stations/' + currentStationId).get();
    }
};
//# sourceMappingURL=findBestReservation.js.map