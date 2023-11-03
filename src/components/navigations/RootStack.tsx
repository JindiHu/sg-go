import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {FC} from 'react';
import {SearchScreen} from '../screens/SearchScreen';
import {BottomTab} from './BottomTab';
import {Place} from '../../services/tourismHub';

export type ParamList = {
  BottomTab: undefined;
  SearchAddress: {type: 'origin' | 'destination'};
  Route: undefined;
  Home: undefined;
  Place: Place;
};

const Stack = createStackNavigator<ParamList>();

export const RootStack: FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="BottomTab"
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        ...TransitionPresets.ModalSlideFromBottomIOS,
      }}>
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="SearchAddress" component={SearchScreen} />
    </Stack.Navigator>
  );
};
