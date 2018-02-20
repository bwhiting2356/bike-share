import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { searchParamsUpdated } from "./searchParamsUpdated";
import { searchBikeTrips } from "./searchBikeTrips";

admin.initializeApp(functions.config().firebase);

// exports.searchParamsUpdated = searchParamsUpdated;
exports.searchBikeTrips = searchBikeTrips;



