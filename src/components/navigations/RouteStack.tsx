import {createStackNavigator} from '@react-navigation/stack';
import {FC} from 'react';
import {RouteScreen} from '../screens/RouteScreen';

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
      <Stack.Screen name="Route" component={RouteScreen} />
    </Stack.Navigator>
  );
};
