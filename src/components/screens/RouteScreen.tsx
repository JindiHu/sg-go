import {
  faCircleDot,
  faEllipsisVertical,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {StackScreenProps} from '@react-navigation/stack';
import Geolocation from '@react-native-community/geolocation';
import {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {colors, sizes} from '../../constants';
import {useAppContext} from '../../context/AppContext';
import {getRecentSearches} from '../../context/reducers/route/route.selectors';
import {AddressPanel} from '../AddressPanel';
import {Card} from '../Card/Card';
import {Header} from '../Header/Header';
import {RoutePlanList} from '../RoutePlainList.tsx/RoutePlanList';
import {ParamList} from '../navigations/RootStack';
import {Address} from '../../services/onemap';
import {
  setDestination,
  setOrigin,
} from '../../context/reducers/route/route.actions';

export const RouteScreen: FC<StackScreenProps<ParamList, 'Route'>> = ({
  route,
  navigation,
}) => {
  const {state, dispatch} = useAppContext();

  const headerHeight = sizes.xxxlg + sizes.md * 2 + sizes.md / 2;

  const handleOnPressOrigin = () => {
    navigation.navigate('SearchAddress', {type: 'origin'});
  };

  const handleOnPressDestination = () => {
    navigation.navigate('SearchAddress', {type: 'destination'});
  };

  const handleOnPressHistory = (address: Address) => {
    Geolocation.getCurrentPosition(info => {
      if (info && info.coords) {
        setOrigin(dispatch, {
          LATITUDE: info.coords.latitude,
          LONGITUDE: info.coords.longitude,
          SEARCHVAL: 'Current location',
          BLK_NO: '',
          ROAD_NAME: '',
          BUILDING: '',
          ADDRESS: '',
          POSTAL: '',
          X: info.coords.latitude,
          Y: info.coords.longitude,
        });
        setDestination(dispatch, address);
      }
    });
  };
  const recentSearches = getRecentSearches(state);
  return (
    <View style={styles.container}>
      <Header route={route} navigation={navigation} height={headerHeight} />
      <Card style={styles.searchBarCard}>
        <View style={styles.searchBarIconContainer}>
          <FontAwesomeIcon
            icon={faCircleDot}
            size={sizes.sm}
            color={colors.green}
          />
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            size={sizes.md}
            color={colors.lightGray}
          />
          <FontAwesomeIcon
            icon={faLocationDot}
            size={sizes.sm}
            color={colors.red}
          />
        </View>
        <View style={styles.searchBarContainer}>
          <TouchableWithoutFeedback
            onPress={handleOnPressOrigin}
            style={[styles.searchBar, {marginBottom: sizes.md}]}>
            {state.route.origin ? (
              <Text
                style={[
                  styles.searchBarText,
                  {color: colors.dark, fontWeight: '500'},
                ]}
                numberOfLines={1}>
                {state.route.origin.SEARCHVAL}
              </Text>
            ) : (
              <Text style={styles.searchBarText}>Choose starting point</Text>
            )}
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={handleOnPressDestination}
            style={styles.searchBar}>
            {state.route.destination ? (
              <Text
                style={[
                  styles.searchBarText,
                  {color: colors.dark, fontWeight: '500'},
                ]}
                numberOfLines={1}>
                {state.route.destination.SEARCHVAL}
              </Text>
            ) : (
              <Text style={styles.searchBarText}>Choose destination</Text>
            )}
          </TouchableWithoutFeedback>
        </View>
      </Card>
      {state.route.origin && state.route.destination ? (
        <RoutePlanList
          start={{
            latitude: state.route.origin.LATITUDE,
            longitude: state.route.origin.LONGITUDE,
          }}
          end={{
            latitude: state.route.destination.LATITUDE,
            longitude: state.route.destination.LONGITUDE,
          }}
        />
      ) : (
        <>
          {recentSearches && recentSearches.length > 0 && (
            <View style={{flex: 1, backgroundColor: colors.lightGray}}>
              <ScrollView>
                <View style={{backgroundColor: colors.white}}>
                  <Text style={styles.recentSearchText}>Recent history</Text>
                </View>
                {getRecentSearches(state).map(address => {
                  return (
                    <AddressPanel
                      key={address.POSTAL}
                      {...address}
                      onPress={handleOnPressHistory}
                    />
                  );
                })}
              </ScrollView>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarCard: {
    flexDirection: 'row',
  },
  searchBarIconContainer: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginRight: sizes.xs,
  },
  searchBarContainer: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: sizes.xxs,
    paddingHorizontal: 10,
    borderColor: colors.lightGray,
    borderWidth: 1,
    height: sizes.xxxlg,
  },
  searchBarText: {
    color: colors.gray,
    textTransform: 'capitalize',
  },
  recentSearchText: {
    marginRight: sizes.md,
    textAlign: 'right',
    fontSize: sizes.md - 2,
    color: colors.gray,
    paddingTop: sizes.sm,
  },
});
