import { LatLng } from './LatLng';

export interface TripData {
  origin: {
    coords: LatLng;
    address: string;
  },
  departureTime: Date;
  walking1Travel: {
    distance: number;
    minutes: number;
    points: LatLng[];
  },
  stationStart: {
    coords: LatLng;
    address: string;
    price: number;
    time: Date;
  },
  bicyclingTravel: {
    distance: number;
    minutes: number;
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
    distance: number;
    minutes: number;
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

  get totalTime(): number {
    return Math.abs(this.data.arrivalTime.getTime() - this.data.departureTime.getTime());
  }

  get totalDistance(): number {
    return this.data.walking1Travel.distance + this.data.bicyclingTravel.distance + this.data.walking2Travel.distance;
  }

  get totalPrice(): number {
    return this.data.stationStart.price + this.data.bicyclingTravel.price + this.data.stationEnd.price;
  }
}

