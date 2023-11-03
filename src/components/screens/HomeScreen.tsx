import {StackScreenProps} from '@react-navigation/stack';
import {FC, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {colors, sizes} from '../../constants';
import {Place, tourismHubService} from '../../services/tourismHub';
import {Header} from '../Header/Header';
import {PlaceList} from '../PlaceList';
import {ParamList} from '../navigations/RootStack';

export const HomeScreen: FC<StackScreenProps<ParamList, 'Home'>> = ({
  route,
  navigation,
}) => {
  const [reloadKey, setReloadKey] = useState<number>(0);
  const onRefresh = () => {
    setReloadKey(reloadKey + 1);
  };

  const handleCardPress = (place: Place) => {
    navigation.navigate('Place', place);
  };

  return (
    <View style={styles.container}>
      <Header route={route} navigation={navigation} />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            colors={[colors.gray]} // Customize the refresh indicator color(s)
            tintColor={colors.gray} // iOS only: Customize the spinning indicator color
            title={'Pull to Refresh'} // iOS only: Text shown while pulling down to refresh
          />
        }>
        <View style={styles.content}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Attractions</Text>
          </View>
          <PlaceList
            fetchData={tourismHubService.getAttractions}
            numOfItemsPerPage={2}
            dependencies={[reloadKey]}
            onCardPress={handleCardPress}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Accommodation</Text>
          </View>
          <PlaceList
            fetchData={tourismHubService.getAccommodation}
            numOfItemsPerPage={3}
            dependencies={[reloadKey]}
            onCardPress={handleCardPress}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Bars & Clubs</Text>
          </View>
          <PlaceList
            fetchData={tourismHubService.getBarsClubs}
            numOfItemsPerPage={2}
            dependencies={[reloadKey]}
            onCardPress={handleCardPress}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Shops</Text>
          </View>
          <PlaceList
            fetchData={tourismHubService.getShops}
            numOfItemsPerPage={3}
            dependencies={[reloadKey]}
            onCardPress={handleCardPress}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  content: {
    borderBottomWidth: sizes.sm,
    borderBottomColor: colors.lightGray,
  },
  title: {
    padding: sizes.md,
    backgroundColor: colors.white,
  },
  titleText: {
    fontSize: sizes.lg,
    fontWeight: '600',
    color: colors.dark,
  },
});
