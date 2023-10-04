import axios, {AxiosInstance} from 'axios';
import {urlConfig} from '../config/url';

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
}

export const onemapService = new OnemapService(urlConfig.onemap);
