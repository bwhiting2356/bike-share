"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var cors = require('cors')({
    origin: true,
});
var findNearestStations_1 = require("./googleMaps/findNearestStations");
var getDirections_1 = require("./googleMaps/getDirections");
var Trip_1 = require("./shared/Trip");
var funcSearchBikeTrips = function (origin, destination, datetime, timeTarget) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    var nearestOriginStationsPromise, walking1Promise, nearestDestinationStationsPromise, walking2Promise, bicyclingPromise;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                nearestOriginStationsPromise = findNearestStations_1.findNearestStations(origin.coords);
                walking1Promise = nearestOriginStationsPromise
                    .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                    var walking1Query;
                    return __generator(this, function (_a) {
                        walking1Query = {
                            origin: origin.coords,
                            destination: response.data[0].coords,
                            mode: 'walking'
                        };
                        return [2 /*return*/, getDirections_1.getDirections(walking1Query)];
                    });
                }); });
                nearestDestinationStationsPromise = findNearestStations_1.findNearestStations(destination.coords);
                walking2Promise = nearestDestinationStationsPromise
                    .then(function (response) {
                    var walking2Query = {
                        origin: destination.coords,
                        destination: response.data[0].coords,
                        mode: 'walking'
                    };
                    return getDirections_1.getDirections(walking2Query);
                });
                bicyclingPromise = Promise.all([nearestOriginStationsPromise, nearestDestinationStationsPromise])
                    .then(function (results) {
                    var bicyclingQuery = {
                        origin: results[0].data[0].coords,
                        destination: results[1].data[0].coords,
                        mode: 'bicycling'
                    };
                    return getDirections_1.getDirections(bicyclingQuery);
                });
                return [4 /*yield*/, Promise.all([
                        walking1Promise,
                        nearestOriginStationsPromise,
                        bicyclingPromise,
                        nearestDestinationStationsPromise,
                        walking2Promise
                    ]).then(function (allResults) {
                        var walking1Result = allResults[0];
                        var stationStartResult = allResults[1];
                        var bicyclingResult = allResults[2];
                        var stationEndResult = allResults[3];
                        var walking2Result = allResults[4];
                        // compute times...
                        var stationStartTime = new Date();
                        stationStartTime.setSeconds(datetime.getSeconds() + walking1Result.data.seconds);
                        var stationEndTime = new Date();
                        stationEndTime.setSeconds(stationStartTime.getSeconds() + bicyclingResult.data.seconds);
                        var arrivalTime = new Date();
                        arrivalTime.setSeconds(stationEndTime.getSeconds() + walking2Result.data.seconds);
                        var tripData = {
                            origin: {
                                coords: origin.coords,
                                address: origin.address
                            },
                            departureTime: datetime,
                            walking1Travel: {
                                feet: walking1Result.data.feet,
                                seconds: walking1Result.data.seconds,
                                points: walking1Result.data.points,
                            },
                            stationStart: {
                                time: stationStartTime,
                                coords: stationStartResult.data[0].coords,
                                address: stationStartResult.data[0].address,
                                price: 0.50 // TODO: fix!
                            },
                            bicyclingTravel: {
                                feet: bicyclingResult.data.feet,
                                seconds: bicyclingResult.data.seconds,
                                points: bicyclingResult.data.points,
                                price: 0.75 // TODO: fix
                            },
                            stationEnd: {
                                time: stationEndTime,
                                coords: stationEndResult.data[0].coords,
                                address: stationEndResult.data[0].address,
                                price: 0.50,
                            },
                            walking2Travel: {
                                feet: walking2Result.data.feet,
                                seconds: walking2Result.data.seconds,
                                points: walking2Result.data.points,
                            },
                            destination: {
                                coords: destination.coords,
                                address: destination.address
                            },
                            arrivalTime: arrivalTime,
                            status: Trip_1.TripStatus.PROPOSED
                        };
                        return tripData;
                    })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.searchBikeTrips = functions.https.onRequest(function (request, response) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        cors(request, response, function () { return __awaiter(_this, void 0, void 0, function () {
            var origin, destination, datetime, timeTarget, trip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        origin = request.body.origin;
                        destination = request.body.destination;
                        datetime = new Date(request.body.datetime);
                        timeTarget = request.body.timeTarget;
                        return [4 /*yield*/, funcSearchBikeTrips(origin, destination, datetime, timeTarget)];
                    case 1:
                        trip = _a.sent();
                        console.log('trip: ', JSON.stringify(trip));
                        response.send(trip);
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=searchBikeTrips.js.map