"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var admin = require("firebase-admin");
var userDataUpdated_1 = require("./userDataUpdated");
// import { searchBikeTrips } from "./searchBikeTrips";
admin.initializeApp(functions.config().firebase);
exports.userDataUpdated = userDataUpdated_1.userDataUpdated;
// exports.searchBikeTrips = searchBikeTrips;
//# sourceMappingURL=index.js.map