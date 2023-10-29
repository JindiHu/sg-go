import {Address} from '../../../services/onemap';
import {
  PUSH_RECENT_SEARCHES,
  SET_DESTINATION,
  SET_ORIGIN,
} from './route.constants';

export type RouteState = {
  origin?: Address;
  destination?: Address;
  recentSearches: Address[];
};

export type RouteAction = {
  type: string;
  payload: RouteState['origin'] | RouteState['destination'];
};

export const initialRouteState = {
  origin: undefined,
  destination: undefined,
  recentSearches: [],
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
      return {...state};
    default:
      return state;
  }
};
