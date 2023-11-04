import moment from 'moment';
import {Address} from '../../../services/onemap';
import {
  PUSH_RECENT_SEARCHES,
  SET_DESTINATION,
  SET_ORIGIN,
} from './route.constants';

export type RouteState = {
  origin?: Address;
  destination?: Address;
  recentSearches: Record<string, Address & {timestamp: number}>;
};

export type RouteAction = {
  type: string;
  payload?: Address;
};

export const initialRouteState = {
  origin: undefined,
  destination: undefined,
  recentSearches: {},
};

export const routeReducer = (
  state: RouteState = initialRouteState,
  action: RouteAction,
): RouteState => {
  switch (action.type) {
    case SET_ORIGIN:
      return {...state, origin: action.payload};
    case SET_DESTINATION:
      return {...state, destination: action.payload};
    case PUSH_RECENT_SEARCHES:
      if (action.payload) {
        const recentSearches = {...state.recentSearches};
        const now = parseInt(moment().format('X'));
        if (Object.keys(state.recentSearches).length > 10) {
          let keyToRemove = '';
          let currentTimestamp = parseInt(moment().format('X'));
          Object.keys(recentSearches).forEach(postalCode => {
            if (state.recentSearches[postalCode].timestamp < currentTimestamp) {
              keyToRemove = postalCode;
              currentTimestamp = state.recentSearches[postalCode].timestamp;
            }
          });
          delete recentSearches[keyToRemove];
        }

        return {
          ...state,
          recentSearches: {
            ...recentSearches,
            [action.payload.POSTAL]: {...action.payload, timestamp: now},
          },
        };
      }
    default:
      return state;
  }
};
