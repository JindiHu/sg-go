import axios, {AxiosInstance} from 'axios';
import {urlConfig} from '../config/url';
import {TIH_API_KEY} from '@env';

type Thumbnail = {
  uuid: string;
  url: string;
};

export type Shop = {
  uuid: string;
  name: string;
  rating: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: {
    block: string;
    streetName: string;
    floorNumber: string;
    unitNumber: string;
    buildingName: string;
    postalCode: string;
  };
  nearestMrtStation: string;
  officialWebsite: string;
  thumbnails: Thumbnail[];
};

class TourismHubService {
  public instance: AxiosInstance;
  constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': TIH_API_KEY,
      },
    });
  }

  public getShops = async (): Promise<Shop[]> => {
    const possibleSearchValues = [
      'shopping',
      'central',
      'famous',
      'luxury',
      'sports',
      'relaxation',
      'family',
      'fun',
      'lifestyle',
      'kid-friendly',
      'historical',
      'art',
      'chinese',
      'Brand shop',
      'Category shop',
      'Boutique',
      'Local Product',
      'Antique shop',
      'Thrift store',
      'City/Neighborhood shopping',
      'Shopping Center/Mall directory',
      'Seasonal sale',
      'Online shop',
      'Art gallery',
      'Craft store',
      'Bookstore',
      'Vintage clothing store',
      'Home goods store',
      'Pet store',
      'Beauty supply store',
      'Computer store',
      'Sports store',
    ];
    const randomIndex = Math.floor(Math.random() * possibleSearchValues.length);
    const randomSearchValue = possibleSearchValues[randomIndex];

    const res = await this.instance.get<{data: Shop[]}>(
      '/content/shops/v2/search',
      {
        params: {
          searchType: 'keyword',
          searchValues: randomSearchValue,
        },
      },
    );

    const shops = res.data.data;
    return shops;
  };

  public getMedia = async (uuid: string): Promise<string> => {
    const res = await this.instance.get<Blob>(`/media/download/v2/${uuid}`, {
      responseType: 'blob',
    });
    const blob: Blob = res.data;
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String: string | ArrayBuffer | null = reader.result;
        if (typeof base64String === 'string') {
          resolve(base64String);
        } else {
          reject('Conversion to base64 failed');
        }
      };
      reader.onerror = () => {
        reject('FileReader error');
      };
      reader.readAsDataURL(blob);
    });
  };
}

export const tourismHubService = new TourismHubService(urlConfig.tourismHub);
