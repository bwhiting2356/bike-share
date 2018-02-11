import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from "rxjs/Observable";


interface Station {
  coords: any;
}

@Injectable()
export class FirestoreService {
  stations: Observable<any[]>;
  constructor(private db: AngularFirestore) {
    this.stations = db.collection('stations').valueChanges();

  }
}
