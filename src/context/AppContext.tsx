import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from 'react';
import {
  AppAction,
  AppState,
  initialAppState,
  rootReducer,
} from './reducers/rootReducer';

type AppContext = {state: AppState; dispatch: Dispatch<AppAction>};
export const AppContext = createContext<AppContext | undefined>(undefined);

export const Provider = ({
  appState = initialAppState,
  children,
}: {
  appState?: AppState;
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(rootReducer, appState);
  return (
    <AppContext.Provider value={{state, dispatch}}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContext => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error(`useAppContext must be used within a <Provider/>`);
  }
  return appContext;
};
