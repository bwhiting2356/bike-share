import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { userDataUpdated } from "./userDataUpdated";

admin.initializeApp(functions.config().firebase);

exports.userDataUpdated = userDataUpdated;



