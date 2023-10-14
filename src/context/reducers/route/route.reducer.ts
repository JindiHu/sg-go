import {Address} from '../../../services/onemap';
import {SET_DESTINATION, SET_ORIGIN} from './route.constants';

export type RouteState = {
  origin?: Address;
  destination?: Address;
};

export type RouteAction = {
  type: string;
  payload: RouteState['origin'] | RouteState['destination'];
};

export const initialRouteState = {
  origin: undefined,
  destination: undefined,
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
    default:
      return state;
  }
};
