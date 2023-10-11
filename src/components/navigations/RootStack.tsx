import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {FC} from 'react';
import {SearchScreen} from '../screens/SearchScreen';
import {BottomTab} from './BottomTab';

export type ParamList = {
  BottomTab: undefined;
  SearchAddress: {type: 'origin' | 'destination'};
  Route: undefined;
  Profile: undefined;
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
      <Stack.Screen name="BottomTab" component={BottomTab} options={{}} />
      <Stack.Screen name="SearchAddress" component={SearchScreen} />
    </Stack.Navigator>
  );
};
