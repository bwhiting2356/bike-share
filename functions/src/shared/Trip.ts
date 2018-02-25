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
  constructor(public data: TripData) {  // parse date strings into date objects?
  }

  // get totalSeconds(): number {
  //   return Math.abs(this.data.arrivalTime.getSeconds() - this.data.departureTime.getSeconds());
  // }

  get totalFeet(): number {
    return this.data.walking1Travel.feet + this.data.bicyclingTravel.feet + this.data.walking2Travel.feet;
  }

  get totalPrice(): number {
    return this.data.stationStart.price + this.data.bicyclingTravel.price + this.data.stationEnd.price;
  }
}

