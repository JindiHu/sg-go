import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {FC} from 'react';
import {SearchScreen} from '../screens/SearchScreen';
import {BottomTab} from './BottomTab';
import {Place} from '../../services/tourismHub';

export type ParamList = {
  SearchAddress: {type: 'origin' | 'destination'};
  Root: {screen: 'RouteStack'};
  Route: undefined;
  RouteStack: undefined;
  Home: undefined;
  Place: Place;
};

const Stack = createStackNavigator<ParamList>();

export const RootStack: FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Root"
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        ...TransitionPresets.ModalSlideFromBottomIOS,
      }}>
      <Stack.Screen name="Root" component={BottomTab} />
      <Stack.Screen name="SearchAddress" component={SearchScreen} />
    </Stack.Navigator>
  );
};
