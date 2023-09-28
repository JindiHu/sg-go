import {faBookmark} from '@fortawesome/free-regular-svg-icons/faBookmark';
import {faCompass} from '@fortawesome/free-regular-svg-icons/faCompass';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
  useBottomTabBarHeight,
} from '@react-navigation/bottom-tabs';
import type {FC} from 'react';
import React from 'react';
import {HomeScreen} from '../HomeScreen';
import {ProfileScreen} from '../ProfileScreen';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const tabRoutes = [
  {
    name: 'Home',
    component: HomeScreen,
    icon: <FontAwesomeIcon icon={faCompass} color={'red'} size={20} />,
  },
  {
    name: 'Favourite',
    component: ProfileScreen,
    icon: <FontAwesomeIcon icon={faBookmark} color={'red'} size={20} />,
  },
];

const TabBar: FC<BottomTabBarProps> = ({state, descriptors, navigation}) => {
  const insets = useSafeAreaInsets();
  return (
    <>
      <View style={{flexDirection: 'row', height: 50}}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabBarIconContainer}>
              {/* <Text style={{color: isFocused ? '#673ab7' : '#222'}}>
              {'test'}
            </Text> */}
              {tabRoutes[index].icon}
            </TouchableOpacity>
          );
        })}
      </View>
      {/* TODO: to remove the background color */}
      <View style={{height: insets.bottom, backgroundColor: 'yellow'}} />
    </>
  );
};

export const TabNavigator: FC = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}>
      {tabRoutes.map(route => (
        <Tab.Screen
          key={route.name}
          name={route.name}
          component={route.component}
        />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarIconContainer: {
    // padding: 20,
    // width: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
