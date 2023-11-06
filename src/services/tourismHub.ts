import axios, {AxiosInstance} from 'axios';
import {TIH_API_KEY} from '../config/envs';
import {urlConfig} from '../config/url';
import {Coordinates, RoutePlanParams} from './onemap';
import Base64 from 'base64-js';

type Image = {
  uuid: string;
  url: string;
};

type Review = {
  authorName: string;
  authorURL: string;
  language: string;
  profilePhoto: string;
  rating: 5;
  text: string;
  time: string;
};

export type Place = {
  uuid: string;
  name: string;
  rating: number;
  description: string;
  body: string;
  location: Coordinates;
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
  thumbnails: Image[];
  images: Image[];
  reviews: Review[];
};

type TihStep = {
  distance: number;
  duration: number;
  startLocation: Coordinates;
  endLocation: Coordinates;
  htmlInstructions: string;
  maneuver: string;
} & (
  | {travelMode: 'WALKING'}
  | {
      travelMode: 'TRANSIT';
      transitDetail: {
        arrivalStop: {
          location: Coordinates;
          name: string;
        };
        arrivalTime: number;
        departureStop: {
          location: Coordinates;
          name: string;
        };
        departureTime: number;
        line: {
          name: string;
          vehicle: {
            name: string;
            type: 'BUS' | 'SUBWAY';
          };
        };
        numOfStops: number;
      };
      steps?: TihStep[];
    }
);

type TihLeg = {
  distance: number;
  duration: number;
  startAddress: string;
  startLocation: Coordinates;
  endAddress: string;
  endLocation: Coordinates;
  steps: TihStep[];
};

type TihRoute = {
  distance: number;
  duration: number;
  legs: TihLeg[];
};

export type TihRoutesData = {
  routes: TihRoute[];
  distance: number;
  duration: number;
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

  public getRoutes = async (
    params: RoutePlanParams,
  ): Promise<TihRoutesData> => {
    const res = await this.instance.get<{data: TihRoutesData}>(
      '/services/navigation/v2/experiential-route/transit',
      {
        params: {
          origin: `${params.start.latitude},${params.start.longitude}`,
          destination: `${params.end.latitude},${params.end.longitude}`,
          maxpoi: 8,
        },
      },
    );

    return res.data.data;
  };

  public getMedia = async (uuid: string): Promise<string> => {
    const res = await this.instance.get<Blob>(`/media/download/v2/${uuid}`, {
      responseType: 'blob',
    });
    const blob: Blob = res.data;
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const base64String: string | ArrayBuffer | null = reader.result;
          if (base64String !== null && typeof base64String === 'string') {
            if (
              base64String.startsWith('data:application/octet-stream;base64,')
            ) {
              const base64img = base64String.replace(
                /^data:application\/octet-stream;base64,/,
                '',
              );
              const imageUri = `data:image/png;base64,${base64img}`;
              resolve(imageUri);
            } else {
              resolve(base64String);
            }
          } else {
            reject('Conversion to base64 failed');
          }
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

    const shops = res.data.data ? res.data.data : [];
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

    const attractions = res.data.data ? res.data.data : [];
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

    const res = await this.instance.get<{data?: Place[]}>(
      '/content/accommodation/v2/search',
      {
        params: {
          searchType: 'keyword',
          searchValues: randomSearchValue,
        },
      },
    );

    const accommodation = res.data.data ? res.data.data : [];
    return accommodation;
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

    const barsClubs = res.data.data ? res.data.data : [];
    return barsClubs;
  };
}

export const tourismHubService = new TourismHubService(urlConfig.tourismHub);
