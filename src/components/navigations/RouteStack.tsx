import {StackHeaderProps, createStackNavigator} from '@react-navigation/stack';
import {FC} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {ProfileScreen} from '../screens/ProfileScreen';
import {RouteScreen} from '../screens/RouteScreen';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, sizes} from '../../constants';
import LinearGradient from 'react-native-linear-gradient';

const homeStackRoutes = {};

export type RouteStackParamList = {
  Route: undefined;
  Profile: undefined;
};
const Stack = createStackNavigator<RouteStackParamList>();

export const RouteStack: FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Route"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Route" component={RouteScreen} options={{}} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};
