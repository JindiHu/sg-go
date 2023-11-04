import axios, {AxiosInstance} from 'axios';
import {urlConfig} from '../config/url';
import {ONEMAP_PASSWORD, ONEMAP_USERNAME} from '@env';
import moment from 'moment';

export type Address = {
  SEARCHVAL: string;
  BLK_NO: string;
  ROAD_NAME: string;
  BUILDING: string;
  ADDRESS: string;
  POSTAL: string;
  X: number;
  Y: number;
  LATITUDE: number;
  LONGITUDE: number;
};

export type SearchResult = {
  found: number;
  totalNumPages: number;
  pageNum: number;
  results: Address[];
};

type OnemapToken = {
  access_token: string;
  expiry_timestamp: number;
};

type AuthHeaders = {
  'Content-Type': string;
  Authorization: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type RoutePlanParams = {
  start: Coordinates;
  end: Coordinates;
};

export type RoutePlanLocaltion = {
  name: string;
  lat: number;
  lon: number;
  orig?: string;
  departure?: number;
  arrival?: number;
  vertexType?: string;
  stopId?: string;
  stopCode?: string;
  stopIndex?: number;
  stopSequence?: number;
};

export type Leg = {
  duration: number;
  startTime: number;
  endTime: number;
  departureDelay: number;
  arrivalDelay: number;
  realTime: boolean;
  distance: number;
  pathway: boolean;
  mode: 'WALK' | 'SUBWAY' | 'TRAM' | 'BUS';
  routeId: string;
  route: string;
  routeShortName: string;
  routeLongName: string;
  agencyName?: string;
  numIntermediateStops: number;
  intermediateStops: RoutePlanLocaltion[];
  from: RoutePlanLocaltion;
  to: RoutePlanLocaltion;
};

export type Itinerary = {
  duration: number;
  startTime: number;
  endTime: number;
  walkTime: number;
  transitTime: number;
  waitingTime: number;
  walkDistance: number;
  walkLimitExceeded: boolean;
  elevationLost: number;
  elevationGained: number;
  transfers: number;
  legs: Leg[];
};

export type RoutePlan = {
  plan: {
    date: number;
    from: RoutePlanLocaltion;
    to: RoutePlanLocaltion;
    itineraries: Itinerary[];
  };
};

class OnemapService {
  public instance: AxiosInstance;
  constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public search = async (query: string): Promise<SearchResult> => {
    const res = await this.instance.get<SearchResult>(
      '/common/elastic/search',
      {
        params: {
          searchVal: query,
          returnGeom: 'Y',
          getAddrDetails: 'Y',
          pageNum: 1,
        },
      },
    );
    return res.data;
  };

  private getAuthHeaders = async (): Promise<AuthHeaders> => {
    const res = await this.instance.post<OnemapToken>('/auth/post/getToken', {
      email: ONEMAP_USERNAME,
      password: ONEMAP_PASSWORD,
    });
    const token = res.data.access_token;
    return {
      'Content-Type': 'application/json',
      Authorization: token,
    };
  };

  public getRoutePlan = async (params: RoutePlanParams): Promise<RoutePlan> => {
    const authHeaders = await this.getAuthHeaders();
    const now = new Date();
    const res = await this.instance.get<RoutePlan>('/public/routingsvc/route', {
      params: {
        start: `${params.start.latitude},${params.start.longitude}`,
        end: `${params.end.latitude},${params.end.longitude}`,
        routeType: 'pt',
        date: moment(now).format('MM-DD-YYYY'),
        time: moment(now).format('HH:mm:ss'),
        mode: 'TRANSIT',
        maxWalkDistance: 1000,
        numItineraries: 3,
      },
      headers: authHeaders,
    });

    const routes = res.data;
    routes.plan.itineraries.forEach(itinerary => {
      if (itinerary.legs.length > 0) {
        let prevLeg: Leg;
        const legs: Leg[] = [];
        itinerary.legs.forEach((leg, index) => {
          if (index > 0) {
            if (leg.mode === 'WALK' && prevLeg.mode === 'WALK') {
              legs[legs.length - 1].to = leg.to;
              legs[legs.length - 1].duration =
                legs[legs.length - 1].duration + leg.duration;
              legs[legs.length - 1].endTime = leg.endTime;
            } else {
              legs.push(leg);
            }
          } else {
            legs.push(leg);
          }
          prevLeg = leg;
        });

        itinerary.legs = legs;
      }
    });

    return res.data;
  };
}

export const onemapService = new OnemapService(urlConfig.onemap);
