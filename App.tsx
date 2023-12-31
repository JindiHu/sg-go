import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import type {FC} from 'react';
import React from 'react';
import {LogBox, StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootStack} from './src/components/navigations/RootStack';
import {colors} from './src/constants';
import {Provider} from './src/context/AppContext';
import {initialAppState} from './src/context/reducers/rootReducer';

LogBox.ignoreLogs(['Could not find image']);

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
    card: colors.white,
  },
};

const App: FC = () => {
  const backgroundStyle = {
    backgroundColor: '#FFF',
  };

  return (
    <Provider
      appState={{
        ...initialAppState,
      }}>
      <SafeAreaProvider style={backgroundStyle}>
        <StatusBar />
        <NavigationContainer theme={AppTheme}>
          <RootStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
