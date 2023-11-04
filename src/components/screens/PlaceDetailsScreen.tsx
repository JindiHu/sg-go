import {
  faChevronLeft,
  faLocationArrow,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {StackScreenProps} from '@react-navigation/stack';
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';
import {FC} from 'react';
import {
  Dimensions,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {colors, sizes} from '../../constants';
import {tourismHubService} from '../../services/tourismHub';
import {FetchableFlatList} from '../FetchableFlatList';
import {Header} from '../Header/Header';
import Rating from '../Rating';
import {ParamList} from '../navigations/RootStack';
import {useAppContext} from '../../context/AppContext';
import {
  setDestination,
  setOrigin,
} from '../../context/reducers/route/route.actions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const width = windowWidth < windowHeight ? windowWidth : windowHeight;
const containerWidth = width;
const imageSize = containerWidth - sizes.lg;

const renderImageItem: ListRenderItem<string> = ({item}) => {
  return (
    <View style={styles.thumbnailContainer}>
      <Image source={{uri: item}} style={styles.thumbnail} />
    </View>
  );
};

export const PlaceDetailsScreen: FC<StackScreenProps<ParamList, 'Place'>> = ({
  route,
  navigation,
}) => {
  const place = route.params;
  const {dispatch} = useAppContext();

  const fetchImage = async () => {
    const images: string[] = [];
    if (place.images.length > 0) {
      for (let i = 0; i < place.images.length; i++) {
        if (place.images[i].url) {
          images.push(place.images[i].url);
        } else if (place.images[i].uuid) {
          try {
            const path = await tourismHubService.getMedia(place.images[i].uuid);
            images.push(path);
          } catch (_) {}
        }
      }
    }

    return images;
  };

  const addrList: string[] = [];
  if (place.address.block) {
    addrList.push(place.address.block);
  }
  if (place.address.streetName) {
    addrList.push(place.address.streetName);
  }
  if (place.address.floorNumber && place.address.unitNumber) {
    addrList.push(`#${place.address.floorNumber}-${place.address.unitNumber}`);
  }
  if (place.address.postalCode) {
    addrList.push(`(Singapore ${place.address.postalCode})`);
  }

  const handleCheckPublicTransport = () => {
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
        setDestination(dispatch, {
          LATITUDE: place.location.latitude,
          LONGITUDE: place.location.longitude,
          SEARCHVAL: place.name,
          BLK_NO: place.address.block,
          ROAD_NAME: place.address.streetName,
          BUILDING: place.address.buildingName,
          ADDRESS: addrList.join(' '),
          POSTAL: place.address.postalCode,
          X: info.coords.latitude,
          Y: info.coords.longitude,
        });
        navigation.navigate('Root', {screen: 'RouteStack'});
      }
    });
  };

  return (
    <View style={styles.container}>
      <Header route={route} navigation={navigation} />
      <View style={styles.headerBar}>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.goBack();
          }}>
          <View style={styles.leftButton}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              color={colors.white}
              size={sizes.md}
            />
            <Text style={styles.leftButtonText}>Back</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.title}>
          <Text style={styles.titleText}>{place.name}</Text>
        </View>
        <View style={styles.rating}>
          <Text style={styles.ratingText}>{place.rating} </Text>
          <Rating value={place.rating} totalStars={5} />
        </View>
        <FetchableFlatList
          keyExtractor={item => item.uuid}
          fetchData={fetchImage}
          renderItem={renderImageItem}
          horizontal={true}
          refreshing={false}
          refreshControl={undefined}
          pagingEnabled={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
        <View style={styles.address}>
          <View style={styles.addressIcon}>
            <FontAwesomeIcon
              icon={faLocationDot}
              size={sizes.lg}
              color={colors.red}
            />
          </View>
          <View>
            {place.address.buildingName && (
              <Text style={styles.buildingName}>
                {place.address.buildingName}
              </Text>
            )}
            <Text style={{color: colors.gray}}>{addrList.join(' ')}</Text>
          </View>
        </View>
        <View style={styles.publicTransport}>
          <TouchableWithoutFeedback onPress={handleCheckPublicTransport}>
            <View style={styles.publicTransportButton}>
              <FontAwesomeIcon
                icon={faLocationArrow}
                size={sizes.md}
                color={colors.white}
              />
              <Text style={styles.publicTransportButtonText}>
                Check Public Transport
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        {place.reviews.length > 0 && (
          <View style={styles.reviewSummary}>
            <View style={styles.reviewSummaryTitle}>
              <Text style={styles.reviewSummaryTitleText}>
                Reviews ({place.reviews.length})
              </Text>
            </View>
            {place.reviews.map(review => {
              return (
                <View style={styles.review} key={review.authorURL}>
                  <View style={styles.profile}>
                    <Image
                      source={{uri: review.profilePhoto}}
                      style={styles.avatar}
                    />
                    <Text style={styles.authorName}>{review.authorName}</Text>
                  </View>
                  <View
                    style={[
                      styles.rating,
                      {paddingHorizontal: 0, paddingTop: sizes.sm},
                    ]}>
                    <Rating value={review.rating} totalStars={5} />
                    <Text
                      style={[
                        styles.ratingText,
                        {marginLeft: sizes.md, fontSize: sizes.sm},
                      ]}>
                      {moment(review.time).fromNow()}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.reviewText}>{review.text}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  headerBar: {
    flexDirection: 'row',
    backgroundColor: colors.blue,
  },
  leftButton: {
    paddingVertical: sizes.sm,
    paddingHorizontal: sizes.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftButtonText: {
    paddingLeft: sizes.xs,
    color: colors.white,
    fontSize: sizes.md,
    fontWeight: '600',
  },
  content: {
    backgroundColor: colors.white,
  },
  title: {
    flex: 1,
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.xs,
  },
  titleText: {
    textAlign: 'left',
    color: colors.dark,
    fontSize: sizes.lg,
    fontWeight: '600',
  },
  rating: {
    paddingHorizontal: sizes.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.sm,
  },
  ratingText: {
    color: colors.gray,
  },
  thumbnailContainer: {
    alignItems: 'center',
    width: containerWidth,
  },
  thumbnail: {
    width: imageSize,
    height: imageSize,
    borderRadius: sizes.xs,
  },
  address: {
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIcon: {
    marginRight: sizes.lg,
  },
  publicTransport: {
    marginLeft: sizes.xxlg,
    marginBottom: sizes.sm,
    paddingHorizontal: sizes.lg,
    flexDirection: 'row',
  },
  publicTransportButton: {
    backgroundColor: colors.green,
    paddingHorizontal: sizes.lg,
    paddingVertical: sizes.xs,
    borderRadius: sizes.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  publicTransportButtonText: {
    paddingHorizontal: sizes.lg,
    fontSize: sizes.md,
    fontWeight: '500',
    color: colors.white,
    textAlign: 'center',
  },
  buildingName: {
    fontSize: sizes.md,
    color: colors.dark,
    marginBottom: sizes.xs,
  },
  reviewSummary: {
    borderTopWidth: sizes.xs,
    borderTopColor: colors.lightGray,
  },
  reviewSummaryTitle: {
    paddingTop: sizes.sm,
    paddingHorizontal: sizes.md,
  },
  reviewSummaryTitleText: {
    fontSize: sizes.md,
    fontWeight: '500',
    color: colors.dark,
  },
  review: {
    borderBottomWidth: 1,
    paddingHorizontal: sizes.md,
    borderBottomColor: colors.lightGray,
    paddingVertical: sizes.lg,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: sizes.xlg,
    height: sizes.xlg,
  },
  authorName: {
    marginLeft: sizes.lg,
  },
  reviewText: {
    color: colors.gray,
  },
});
