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
var serverMapGeoPointToLatLng_1 = require("./serverMapGeoPointToLatLng");
var findNearestStations_1 = require("./findNearestStations");
var getDirections_1 = require("./getDirections");
exports.searchParamsUpdated = functions.firestore
    .document('/users/{userId}')
    .onUpdate(function (event) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    var userData, previousUserData, origin_1, destination, nearestOriginStations, nearestDestinationStations, walking1Points_1, bicyclingPoints_1, walking2Points_1;
    return __generator(this, function (_a) {
        try {
            userData = event.data.data();
            previousUserData = event.data.previous.data();
            origin_1 = userData.searchOrigin ? serverMapGeoPointToLatLng_1.serverMapGeoPointToLatLng(userData.searchOrigin) : null;
            destination = userData.searchDestination ? serverMapGeoPointToLatLng_1.serverMapGeoPointToLatLng(userData.searchDestination) : null;
            nearestOriginStations = void 0, nearestDestinationStations = void 0;
            if (JSON.stringify(userData.searchOrigin) !== JSON.stringify(previousUserData.searchOrigin)) {
                nearestOriginStations = findNearestStations_1.findNearestStations(origin_1);
                nearestOriginStations
                    .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                    var stationStart, walking1Query;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log("line 32 response: ", response);
                                stationStart = response.data[0].coords;
                                walking1Query = {
                                    origin: origin_1,
                                    destination: stationStart,
                                    mode: 'walking'
                                };
                                return [4 /*yield*/, getDirections_1.getDirections(walking1Query)];
                            case 1:
                                walking1Points_1 = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            // have the destination coords changed since the previous value?
            if (JSON.stringify(userData.searchDestination) !== JSON.stringify(previousUserData.searchDestination)) {
                nearestDestinationStations = findNearestStations_1.findNearestStations(destination);
                console.log("line 50");
                nearestDestinationStations
                    .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                    var stationEnd, walking2Query;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log("line 52 response: ", response);
                                stationEnd = response.data[0].coords;
                                walking2Query = {
                                    origin: origin_1,
                                    destination: stationEnd,
                                    mode: 'walking'
                                };
                                return [4 /*yield*/, getDirections_1.getDirections(walking2Query)];
                            case 1:
                                walking2Points_1 = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                //
                // stationEnd = nearestDestinationStations.data[0].coords;
                // console.log("station end: ", stationEnd);
                // let walking2Query = {
                //   origin: destination,
                //   destination: stationEnd,
                //   mode: 'walking'
                // };
                // walking2Points = await getDirections(walking2Query);
            }
            // if neither was changed, exit this function
            console.log('origin: ', origin_1);
            console.log('destination: ', destination);
            if (origin_1 && destination) {
                return [2 /*return*/, Promise.all([nearestOriginStations, nearestDestinationStations])
                        .then(function (results) { return __awaiter(_this, void 0, void 0, function () {
                        var bicyclingQuery;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("line 84 results: ", results);
                                    bicyclingQuery = {
                                        origin: results[0].data[0].coords,
                                        destination: results[1].data[0].coords,
                                        mode: 'bicycling'
                                    };
                                    console.log('bicycling query: ', bicyclingQuery);
                                    return [4 /*yield*/, getDirections_1.getDirections(bicyclingQuery)];
                                case 1:
                                    bicyclingPoints_1 = _a.sent();
                                    console.log("bicycling poitns: ", bicyclingPoints_1);
                                    return [2 /*return*/, Promise.resolve()];
                            }
                        });
                    }); })];
            }
        }
        catch (error) {
            console.log("line 87 error: ", error);
            return [2 /*return*/, Promise.resolve(error)];
        }
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=searchParamsUpdated.js.map