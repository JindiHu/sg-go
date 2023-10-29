import {
  faHouse,
  faLocationPin,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FC, PropsWithChildren} from 'react';
import {Animated, Easing} from 'react-native';
import {colors} from '../../constants';
import {ProfileScreen} from '../screens/ProfileScreen';
import {HomeStack} from './HomeStack';
import {RouteStack} from './RouteStack';

type IconProps = {
  focused: boolean;
  color: string;
  size: number;
};

const IconContainer: FC<
  PropsWithChildren<{
    focused: boolean;
  }>
> = ({focused, children}) => {
  let scaleValue = new Animated.Value(1);
  if (focused) {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 200,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start();
  } else {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 200,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start();
  }

  return (
    <Animated.View style={{transform: [{scale: scaleValue}]}}>
      {children}
    </Animated.View>
  );
};

const tabRoutes = [
  {
    name: 'HomeStack',
    component: HomeStack,
    tabBarIcon: ({focused, color, size}: IconProps) => (
      <IconContainer focused={focused}>
        <FontAwesomeIcon icon={faHouse} color={color} size={size} />
      </IconContainer>
    ),
  },
  {
    name: 'RouteStack',
    component: RouteStack,
    tabBarIcon: ({focused, color, size}: IconProps) => (
      <IconContainer focused={focused}>
        <FontAwesomeIcon icon={faLocationPin} color={color} size={size} />
      </IconContainer>
    ),
  },
  {
    name: 'Favourite',
    component: ProfileScreen,
    tabBarIcon: ({focused, color, size}: IconProps) => (
      <IconContainer focused={focused}>
        <FontAwesomeIcon icon={faStar} color={color} size={size} />
      </IconContainer>
    ),
  },
];

export const BottomTab: FC = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.blue,
      }}>
      {tabRoutes.map(route => (
        <Tab.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={{
            tabBarIcon: route.tabBarIcon,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};
