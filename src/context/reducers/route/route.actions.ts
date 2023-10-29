import {Dispatch} from 'react';
import {RouteAction, RouteState} from './route.reducer';
import {SET_DESTINATION, SET_ORIGIN} from './route.constants';

export const setOrigin = (
  dispatch: Dispatch<RouteAction>,
  payload: RouteState['origin'],
) => {
  dispatch({type: SET_ORIGIN, payload});
};

export const unsetOrigin = (dispatch: Dispatch<RouteAction>) => {
  dispatch({type: SET_ORIGIN, payload: undefined});
};

export const setDestination = (
  dispatch: Dispatch<RouteAction>,
  payload: RouteState['destination'],
) => {
  dispatch({type: SET_DESTINATION, payload});
};

export const unsetDestination = (dispatch: Dispatch<RouteAction>) => {
  dispatch({type: SET_DESTINATION, payload: undefined});
};

export const pushRecentSearch = () => {};
