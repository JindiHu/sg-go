import {Dispatch} from 'react';
import {Address} from '../../../services/onemap';
import {
  PUSH_RECENT_SEARCHES,
  SET_DESTINATION,
  SET_ORIGIN,
} from './route.constants';
import {RouteAction} from './route.reducer';

export const setOrigin = (
  dispatch: Dispatch<RouteAction>,
  payload: Address,
) => {
  dispatch({type: SET_ORIGIN, payload});
};

export const unsetOrigin = (dispatch: Dispatch<RouteAction>) => {
  dispatch({type: SET_ORIGIN});
};

export const setDestination = (
  dispatch: Dispatch<RouteAction>,
  payload: Address,
) => {
  dispatch({type: SET_DESTINATION, payload});
};

export const unsetDestination = (dispatch: Dispatch<RouteAction>) => {
  dispatch({type: SET_DESTINATION});
};

export const pushRecentSearch = (
  dispatch: Dispatch<RouteAction>,
  payload: Address,
) => {
  dispatch({type: PUSH_RECENT_SEARCHES, payload});
};
