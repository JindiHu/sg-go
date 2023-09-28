import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {FC} from 'react';
import React from 'react';
import {SafeAreaView, StatusBar, View, useColorScheme} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {TabNavigator} from './src/components/navigations/TabNavigator';

const App: FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: '#FFF',
  };

  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaProvider style={backgroundStyle}>
      <StatusBar />
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
