import {
  faCircleDot,
  faEllipsisVertical,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {StackScreenProps} from '@react-navigation/stack';
import {FC, useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {colors, sizes} from '../../constants';
import {handleApiError} from '../../services/error';
import {tourismHubService} from '../../services/tourismHub';
import {Card} from '../Card/Card';
import {Header} from '../Header';
import {RouteStackParamList} from '../navigations/RouteStack';
import {ShopList} from '../ShopList';

export const RouteScreen: FC<
  StackScreenProps<RouteStackParamList, 'Route'>
> = ({route, navigation}) => {
  const headerHeight = sizes.xxxlg + sizes.md * 2 + sizes.md / 2;

  const handleOnPressOrigin = () => {
    console.log('open modal');
  };

  const handleOnPressDestination = () => {};
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
            <Text style={styles.searchBarText}>Choose tarting point</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={handleOnPressDestination}
            style={styles.searchBar}>
            <Text style={styles.searchBarText}>Choose destination</Text>
          </TouchableWithoutFeedback>
        </View>
      </Card>
      <ShopList />
      {/* <ScrollView>
        <Text>Home Screen</Text>
      </ScrollView> */}
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
  },
});
