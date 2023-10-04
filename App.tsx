import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import type {FC} from 'react';
import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootStack} from './src/components/navigations/RootStack';
import {colors} from './src/constants';

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
    card: colors.white,
  },
};

const App: FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: '#FFF',
  };

  return (
    <SafeAreaProvider style={backgroundStyle}>
      <StatusBar />
      <NavigationContainer theme={AppTheme}>
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
