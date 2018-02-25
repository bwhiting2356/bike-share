"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripStatus = {
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    PROPOSED: 'Proposed',
    SCHEDULED: 'Scheduled'
};
var Trip = (function () {
    function Trip(data) {
        this.data = data;
    }
    Object.defineProperty(Trip.prototype, "totalFeet", {
        // get totalSeconds(): number {
        //   return Math.abs(this.data.arrivalTime.getSeconds() - this.data.departureTime.getSeconds());
        // }
        get: function () {
            return this.data.walking1Travel.feet + this.data.bicyclingTravel.feet + this.data.walking2Travel.feet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Trip.prototype, "totalPrice", {
        get: function () {
            return this.data.stationStart.price + this.data.bicyclingTravel.price + this.data.stationEnd.price;
        },
        enumerable: true,
        configurable: true
    });
    return Trip;
}());
exports.Trip = Trip;
//# sourceMappingURL=Trip.js.map