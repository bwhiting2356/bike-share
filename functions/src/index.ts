import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { userDataUpdated } from "./userDataUpdated";
import { bookTrip } from "./bookTrip";

admin.initializeApp(functions.config().firebase);

exports.userDataUpdated = userDataUpdated;
exports.bookTrip = bookTrip;





