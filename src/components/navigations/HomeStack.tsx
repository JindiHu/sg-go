import {
  StackHeaderInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';
import {FC} from 'react';
import {Animated} from 'react-native';
import {colors} from '../../constants';
import {HomeScreen} from '../screens/HomeScreen';
import {ProfileScreen} from '../screens/ProfileScreen';

const homeStackRoutes = {};

// const opacity = Animated.add(progress.current, progress.next || 0).interpolate({
//   inputRange: [0, 1, 2],
//   outputRange: [0, 1, 0],
// });
const forFade = ({current, next}: StackHeaderInterpolationProps) => {
  const opacity = Animated.add(
    current.progress,
    next ? next.progress : 0,
  ).interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  });

  return {
    leftButtonStyle: {opacity},
    rightButtonStyle: {opacity},
    titleStyle: {opacity},
    backgroundStyle: {opacity},
  };
};

export type HomeStackParamList = {
  Search: undefined;
  Profile: undefined;
};
const Stack = createStackNavigator<HomeStackParamList>();

export const HomeStack: FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Search"
      screenOptions={{
        headerMode: 'float',
        headerShown: false,
        headerTintColor: colors.blue,
        headerStyle: {backgroundColor: colors.white},
        animationEnabled: true,
        headerStyleInterpolator: forFade,
      }}>
      <Stack.Screen
        name="Search"
        component={ProfileScreen}
        options={{
          title: 'Awesome app',
        }}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};
