import axios, {AxiosInstance} from 'axios';
import {urlConfig} from '../config/url';
import {TIH_API_KEY} from '@env';

type Thumbnail = {
  uuid: string;
  url: string;
};

export type Place = {
  uuid: string;
  name: string;
  rating: number;
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

  public getShops = async (): Promise<Place[]> => {
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

    const res = await this.instance.get<{data: Place[]}>(
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

  public getAttractions = async (): Promise<Place[]> => {
    const possibleSearchValues = [
      'Full-Day',
      'Adventure',
      'Action',
      'Theme Parks',
      'Sentosa',
      'Action Seekers',
      'Families',
      'Attractions',
      'Explorers',
      'Leisure',
      'Experiences',
      'Outdoor Recreation',
      'Group of People',
      'Sports',
      'Sightseeing',
    ];
    const randomIndex = Math.floor(Math.random() * possibleSearchValues.length);
    const randomSearchValue = possibleSearchValues[randomIndex];

    const res = await this.instance.get<{data: Place[]}>(
      '/content/attractions/v2/search',
      {
        params: {
          searchType: 'keyword',
          searchValues: randomSearchValue,
        },
      },
    );

    const attractions = res.data.data;
    return attractions;
  };

  public getAccommodation = async (): Promise<Place[]> => {
    const possibleSearchValues = [
      'Hotels',
      'Leisure',
      'Serviced Apartments',
      'Civic District',
      'Family-friendly',
      'Short Stay',
      'Sentosa',
      'Couples',
      'Local Foods',
      'Activities',
      'Parties',
      'Lifestyles',
      'Heartlands',
      'Socialisers',
      'East Coast',
    ];
    const randomIndex = Math.floor(Math.random() * possibleSearchValues.length);
    const randomSearchValue = possibleSearchValues[randomIndex];

    const res = await this.instance.get<{data: Place[]}>(
      '/content/accommodation/v2/search',
      {
        params: {
          searchType: 'keyword',
          searchValues: randomSearchValue,
        },
      },
    );

    const attractions = res.data.data;
    return attractions;
  };

  public getBarsClubs = async (): Promise<Place[]> => {
    const possibleSearchValues = [
      'Clarke Quay',
      'Nightlife',
      'Parties',
      'Corporate Events',
      'Food & Beverages',
      'Central',
      'MICE',
      'Socialisers',
      'Families',
      'Casual Dining',
      'Social Events',
      'Unique Dining',
      'Unique Venues',
      'Alcohol',
      'Weddings',
      'Bars',
      'Private Functions',
      'Group of People',
      'Lifestyles',
    ];
    const randomIndex = Math.floor(Math.random() * possibleSearchValues.length);
    const randomSearchValue = possibleSearchValues[randomIndex];

    const res = await this.instance.get<{data: Place[]}>(
      '/content/bars-clubs/v2/search',
      {
        params: {
          searchType: 'keyword',
          searchValues: randomSearchValue,
        },
      },
    );

    const attractions = res.data.data;
    return attractions;
  };
}

export const tourismHubService = new TourismHubService(urlConfig.tourismHub);
