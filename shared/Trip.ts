import { LatLng } from './LatLng';

export interface TripData {
  origin: {
    coords: LatLng;
    address: string;
  },
  departureTime: Date;
  walking1Travel: {
    feet: number;
    seconds: number;
    points: LatLng[];
  },
  stationStart: {
    id: string;
    coords: LatLng;
    address: string;
    price: number;
    time: Date;
  },
  bicyclingTravel: {
    feet: number;
    seconds: number;
    points: LatLng[];
    price: number;
  },
  stationEnd: {
    id: string;
    coords: LatLng;
    address: string;
    price: number;
    time: Date;
  },
  walking2Travel: {
    feet: number;
    seconds: number;
    points: LatLng[];
  },
  destination: {
    coords: LatLng;
    address: string;
  },
  arrivalTime: Date;
  status: string;
}

export const TripStatus = {
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  PROPOSED: 'Proposed',
  SCHEDULED: 'Scheduled'
};

export class Trip {
  origin: {
    coords: LatLng;
    address: string;
  };
  departureTime: Date;
  walking1Travel: {
    feet: number;
    seconds: number;
    points: LatLng[];
  };
  stationStart: {
    id: string;
    coords: LatLng;
    address: string;
    price: number;
    time: Date;
  };
  bicyclingTravel: {
    feet: number;
    seconds: number;
    points: LatLng[];
    price: number;
  };
  stationEnd: {
    id: string;
    coords: LatLng;
    address: string;
    price: number;
    time: Date;
  };
  walking2Travel: {
    feet: number;
    seconds: number;
    points: LatLng[];
  };
  arrivalTime: Date;
  destination: {
    coords: LatLng;
    address: string;
  };
  status: string; // TODO: this can be a union type as well probably

  constructor(data: TripData) {  // parse date strings into date objects?
    this.origin = data.origin;
    this.departureTime = new Date(data.departureTime);
    this.walking1Travel = data.walking1Travel;
    this.stationStart = { ...data.stationStart, time: new Date(data.stationStart.time) };
    this.bicyclingTravel = data.bicyclingTravel;
    this.stationEnd = { ...data.stationEnd, time: new Date(data.stationEnd.time) };
    this.walking2Travel = data.walking2Travel;
    this.arrivalTime = new Date(data.arrivalTime);
    this.destination = data.destination;
    this.status = data.status;
  }

  get totalSeconds(): number {
    return this.walking1Travel.seconds + this.walking2Travel.seconds + this.bicyclingTravel.seconds;
  }

  get totalFeet(): number {
    return this.walking1Travel.feet + this.bicyclingTravel.feet + this.walking2Travel.feet;
  }

  get totalPrice(): number {
    return this.stationStart.price + this.bicyclingTravel.price + this.stationEnd.price;
  }

  get priceMessage(): string {
    return this.totalPrice > 0 ? 'Total earnings' : 'Total cost';
  }
}

const data: TripData = {
  origin: {
    coords: {lat: 37.425919, lng:  -122.072343},
    address: '321 Magnolia Ave'
  },
  departureTime: new Date(),
  walking1Travel: {
    feet: 3650,
    seconds: 58,
    points: [
      { lat: 37.426015, lng: -122.0723955 },
      { lat: 37.4261534, lng: -122.0719905 },
      { lat: 37.4261044, lng: -122.071927 },
      { lat: 37.4255383, lng: -122.0719294 },
      { lat: 37.4246507, lng: -122.0726761 },
      { lat: 37.4246531, lng: -122.0739977 },
      { lat: 37.4235884, lng: -122.0740402 },
      { lat: 37.423583, lng: -122.0755722 },
      { lat: 37.4234156, lng: -122.0755782 },
      { lat: 37.423416, lng: -122.0780365 },
      { lat: 37.4231805, lng: -122.0811638 },
      { lat: 37.4230083, lng: -122.0813127 },
      { lat: 37.4229558, lng: -122.0813309 },
      { lat: 37.4229551, lng: -122.0813755 },
      { lat: 37.422827, lng: -122.081668 }
    ],
  },
  stationStart: {
    id: "123",
    coords: {lat: 37.422827, lng:  -122.081668 },
    address: '432 Millbrae Location',
    time: new Date(),
    price: 0.50,
  },
  bicyclingTravel: {
    feet: 4,
    seconds: 15,
    points: [
      { lat: 37.4227605, lng: -122.0815514 },
      { lat: 37.4224445, lng: -122.082257 },
      { lat: 37.4232839, lng: -122.0863038 },
      { lat: 37.4229501, lng: -122.0864589 },
      { lat: 37.4284293, lng: -122.0862908 },
      { lat: 37.4332784, lng: -122.0960993 },
      { lat: 37.4348621, lng: -122.0953943 },
      { lat: 37.4361874, lng: -122.0994048 },
      { lat: 37.4357122, lng: -122.0995983 },
      { lat: 37.4324929, lng: -122.1047688 },
      { lat: 37.4322323, lng: -122.1049615 },
      { lat: 37.4404262, lng: -122.1135362 },
      { lat: 37.4453533, lng: -122.1178343 },
      { lat: 37.4453328, lng: -122.1179664 },
      { lat: 37.4476507, lng: -122.1188773 },
      { lat: 37.4457436, lng: -122.1233657 },
      { lat: 37.4483872, lng: -122.1266485 },
      { lat: 37.4488344, lng: -122.1254075 },
      { lat: 37.4518688, lng: -122.1296444 }
    ],
    price: 1.50,
  },
  stationEnd: {
    id: "123",
    coords: { lat: 37.451868, lng: -122.129644 },
    address: '432 Millbrae Location',
    time: new Date(),
    price: -0.50,
  },
  walking2Travel: {
    feet: 134,
    seconds: 5,
    points: [ { lat: 37.4519147, lng: -122.1295495 },
      { lat: 37.4526442, lng: -122.1303591 },
      { lat: 37.4487815, lng: -122.1324926 },
      { lat: 37.4487939, lng: -122.1372211 },
      { lat: 37.4480329, lng: -122.1371333 },
      { lat: 37.448327, lng: -122.135429 } ]

  },
  destination: {
    coords: {lat: 37.448327, lng: -122.135429},
    address: '432 Millbrae Location'
  },
  arrivalTime: new Date(),
  status: TripStatus.COMPLETED
};

export const tripA = new Trip(data);
const tripB = new Trip(data);
const tripC = new Trip(data);

export const fakeTrips: Trip[] = [tripA, tripB, tripC];

