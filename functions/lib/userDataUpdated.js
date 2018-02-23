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
var admin = require("firebase-admin");
var findNearestStations_1 = require("./googleMaps/findNearestStations");
var serverMapGeoPointToLatLng_1 = require("./googleMaps/serverMapGeoPointToLatLng");
var getDirections_1 = require("./googleMaps/getDirections");
var Trip_1 = require("./shared/Trip");
var TravelMode = {
    WALKING: 'walking',
    BICYCLING: 'bicycling'
};
exports.userDataUpdated = functions.firestore
    .document('/users/{userId}')
    .onWrite(function (event) { return __awaiter(_this, void 0, void 0, function () {
    var userData, previousUserData, originCoords, originAddress, stationStartCoords, stationStartAddress, stationEndCoords, stationEndAddress, destinationCoords, destinationAddress, nearestStartStationPromise, walking1DirectionsPromise, nearestEndStationPromise, walking2DirectionsPromise, bicyclingDirectionsPromise, deleteOperationPromise;
    return __generator(this, function (_a) {
        userData = event.data.data();
        previousUserData = event.data.previous.data();
        if (userData.searchParams) {
            if (userData.searchParams.origin) {
                originCoords = serverMapGeoPointToLatLng_1.serverMapGeoPointToLatLng(userData.searchParams.origin.coords);
                originAddress = userData.searchParams.origin.address;
                nearestStartStationPromise = findNearestStations_1.findNearestStations(originCoords)
                    .then(function (response) {
                    stationStartCoords = response.data[0].coords;
                    stationStartAddress = response.data[0].address;
                    return stationStartCoords;
                });
                walking1DirectionsPromise = nearestStartStationPromise.then(function (startCoords) {
                    var walking1Query = {
                        origin: originCoords,
                        destination: startCoords,
                        mode: TravelMode.WALKING
                    };
                    return getDirections_1.getDirections(walking1Query);
                });
            }
            if (userData.searchParams.destination) {
                destinationCoords = serverMapGeoPointToLatLng_1.serverMapGeoPointToLatLng(userData.searchParams.destination.coords);
                destinationAddress = userData.searchParams.destination.coords;
                nearestEndStationPromise = findNearestStations_1.findNearestStations(destinationCoords)
                    .then(function (response) {
                    stationEndCoords = response.data[0].coords;
                    stationEndAddress = response.data[0].address;
                    return stationEndCoords;
                });
                walking2DirectionsPromise = nearestEndStationPromise.then(function (endCoords) {
                    var walking1Query = {
                        origin: destinationCoords,
                        destination: endCoords,
                        mode: TravelMode.WALKING
                    };
                    return getDirections_1.getDirections(walking1Query);
                });
            }
            if (userData.searchParams.origin && userData.searchParams.destination && // both fields exist
                (JSON.stringify(userData.searchParams) !== JSON.stringify(previousUserData.searchParams))) {
                deleteOperationPromise = admin.firestore()
                    .doc('/users/' + event.params.userId).set({ searchResult: null }, { merge: true });
                bicyclingDirectionsPromise = Promise.all([nearestStartStationPromise, nearestEndStationPromise])
                    .then(function (stationsCoords) {
                    var startCoords = stationsCoords[0];
                    var endCoords = stationsCoords[1];
                    var bicyclingQuery = {
                        origin: startCoords,
                        destination: endCoords,
                        mode: TravelMode.BICYCLING
                    };
                    return getDirections_1.getDirections(bicyclingQuery);
                });
                return [2 /*return*/, Promise.all([
                        walking1DirectionsPromise,
                        walking2DirectionsPromise,
                        bicyclingDirectionsPromise,
                        deleteOperationPromise
                    ]).then(function (allDirections) {
                        var walking1Travel = allDirections[0].data;
                        var walking2Travel = allDirections[1].data;
                        var bicyclingTravel = allDirections[2].data;
                        var tripData = {
                            origin: {
                                coords: originCoords,
                                address: originAddress
                            },
                            departureTime: userData.searchParams.datetime,
                            walking1Travel: {
                                feet: walking1Travel.feet,
                                seconds: walking1Travel.seconds,
                                points: walking1Travel.points
                            },
                            stationStart: {
                                coords: stationStartCoords,
                                address: stationStartAddress,
                                time: new Date(),
                                price: 0.50 // fix!
                            },
                            bicyclingTravel: {
                                feet: bicyclingTravel.feet,
                                seconds: bicyclingTravel.seconds,
                                points: bicyclingTravel.points,
                                price: 0.75
                            },
                            walking2Travel: {
                                feet: walking2Travel.feet,
                                seconds: walking2Travel.seconds,
                                points: walking2Travel.points
                            },
                            stationEnd: {
                                coords: stationEndCoords,
                                address: stationEndAddress,
                                time: new Date(),
                                price: -0.50 // fix!
                            },
                            destination: {
                                coords: destinationCoords,
                                address: destinationAddress
                            },
                            arrivalTime: new Date(),
                            status: Trip_1.TripStatus.PROPOSED
                        };
                        return tripData;
                    })
                        .then(function (tripData) {
                        return admin.firestore()
                            .doc('/users/' + event.params.userId).set({ searchResult: tripData }, { merge: true });
                    })];
            }
        }
        return [2 /*return*/, Promise.resolve()];
    });
}); });
//# sourceMappingURL=userDataUpdated.js.map