import {
  faCircleDot,
  faEllipsisVertical,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {StackScreenProps} from '@react-navigation/stack';
import {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {colors, sizes} from '../../constants';
import {Card} from '../Card/Card';
import {Header} from '../Header/Header';
import {ShopList} from '../ShopList';
import {ParamList} from '../navigations/RootStack';

export const RouteScreen: FC<StackScreenProps<ParamList, 'Route'>> = ({
  route,
  navigation,
}) => {
  const headerHeight = sizes.xxxlg + sizes.md * 2 + sizes.md / 2;

  const handleOnPressOrigin = () => {
    navigation.navigate('SearchAddress', {type: 'origin'});
  };

  const handleOnPressDestination = () => {
    navigation.navigate('SearchAddress', {type: 'destination'});
  };
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
            <Text style={styles.searchBarText}>Choose starting point</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={handleOnPressDestination}
            style={styles.searchBar}>
            <Text style={styles.searchBarText}>Choose destination</Text>
          </TouchableWithoutFeedback>
        </View>
      </Card>
      <ShopList />
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
