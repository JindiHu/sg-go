import {
  RouteAction,
  RouteState,
  initialRouteState,
  routeReducer,
} from './route/route.reducer';

export type AppState = {
  route: RouteState;
};

export type AppAction = RouteAction;

export const initialAppState: AppState = {
  route: initialRouteState,
};

export const rootReducer = (appState: AppState, action: AppAction) => {
  return {
    route: routeReducer(appState.route, action),
  };
};
