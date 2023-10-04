import {createStackNavigator} from '@react-navigation/stack';
import {FC} from 'react';
import {BottomTab} from './BottomTab';
import {ProfileScreen} from '../screens/ProfileScreen';

export type RootStackParamList = {
  BottomTab: undefined;
  Search: undefined;
};

const Stack = createStackNavigator();

export const RootStack: FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="BottomTab"
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
        animationEnabled: true,
      }}>
      <Stack.Screen name="BottomTab" component={BottomTab} options={{}} />
      <Stack.Screen name="SearchAddress" component={ProfileScreen} />
    </Stack.Navigator>
  );
};
