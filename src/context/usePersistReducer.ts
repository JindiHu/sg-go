import {Dispatch, useEffect, useReducer} from 'react';
import {AppAction, AppState, rootReducer} from './reducers/rootReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PersistConfig = {
  key: string;
  whitelist?: string[];
};

/* eslint-disable */
const getValue = (state: any, keys: string[]): unknown => {
  const key = keys.shift();
  if (key === undefined) {
    return undefined;
  }
  if (state.hasOwnProperty(key) && keys.length === 0) return state[key];
  else if (!state.hasOwnProperty(key)) return undefined;
  else return getValue(state[key], keys);
};

const setValue = (state: any, keys: string[], value: any) => {
  const key = keys.shift();
  if (key === undefined) {
    return;
  }
  if (keys.length === 0) {
    state[key] = value;
    return;
  } else if (!state.hasOwnProperty(key)) {
    state[key] = {};
  }

  setValue(state[key], keys, value);
};
/* eslint-enable */

export const usePersistReducer = (
  config: PersistConfig,
  reducer: typeof rootReducer,
  appState: AppState,
): [AppState, Dispatch<AppAction>] => {
  let persistState = appState;

  useEffect(() => {
    const rehydrate = async () => {
      try {
        const stateFromAsyncStorage = JSON.parse(
          (await AsyncStorage.getItem(config.key)) || '',
        ) as AppState;

        const clonedState = JSON.parse(JSON.stringify(appState)) as AppState;
        if (config.whitelist && config.whitelist.length > 0) {
          config.whitelist.forEach(keysStr => {
            try {
              // eslint-disable-next-line
              const valueFromAsyncStorage = getValue(
                stateFromAsyncStorage,
                keysStr.split('.'),
              );
              if (valueFromAsyncStorage) {
                setValue(
                  clonedState,
                  keysStr.split('.'),
                  valueFromAsyncStorage,
                );
              }
            } catch (e) {}
          });
        }

        persistState = clonedState;
      } catch (e) {
        persistState = appState;
      }
    };

    rehydrate();
  }, []);

  const [state, dispatch] = useReducer(reducer, persistState);

  useEffect(() => {
    if (config.whitelist && config.whitelist.length > 0) {
      const whitelistState = {};
      config.whitelist.forEach(keysStr => {
        try {
          // eslint-disable-next-line
          const valueFromState = getValue(state, keysStr.split('.'));
          if (valueFromState) {
            setValue(whitelistState, keysStr.split('.'), valueFromState);
          }
        } catch (e) {}
      });
      AsyncStorage.setItem(config.key, JSON.stringify(whitelistState));
    }
  }, [state]);

  return [state, dispatch];
};