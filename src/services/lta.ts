import axios, {AxiosInstance} from 'axios';
import {LTA_ACCOUNT_KEY} from '../config/envs';
import {urlConfig} from '../config/url';

export type NextBus = {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string;
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: string;
  Feature: string;
  Type: string;
};

type Service = {
  ServiceNo: string;
  Operator: string;
  NextBus: NextBus;
  NextBus2: NextBus;
  NextBus3: NextBus;
};

type BusArrivalServices = {
  BusStopCode: string;
  Services: Service[];
};

class LtaService {
  public instance: AxiosInstance;
  constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      headers: {
        'Content-Type': 'application/json',
        AccountKey: LTA_ACCOUNT_KEY,
      },
    });
  }
  public getBusArrival = async (busStopCode: string, serviceNo: string) => {
    const res = await this.instance.get<BusArrivalServices>('/BusArrivalv2', {
      params: {
        BusStopCode: busStopCode,
        ServiceNo: serviceNo,
      },
    });

    const busArriavel = res.data;
    return busArriavel;
  };
}

export const ltaService = new LtaService(urlConfig.lta);
