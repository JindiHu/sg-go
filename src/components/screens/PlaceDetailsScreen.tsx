import {
  faAddressBook,
  faAddressCard,
  faChevronLeft,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {StackScreenProps} from '@react-navigation/stack';
import {FC, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {colors, sizes} from '../../constants';
import {Header} from '../Header/Header';
import {ParamList} from '../navigations/RootStack';
import {ScrollView} from 'react-native-gesture-handler';
import {tourismHubService} from '../../services/tourismHub';
import HTMLView from 'react-native-htmlview';
import Rating from '../Rating';
import {FetchableFlatList} from '../FetchableFlatList';
import moment from 'moment';

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

  const addrList = [];
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
        {place.reviews.length > 0 && (
          <View style={styles.reviewSummary}>
            <View style={styles.reviewSummaryTitle}>
              <Text style={styles.reviewSummaryTitleText}>
                Reviews ({place.reviews.length})
              </Text>
            </View>
            {place.reviews.map(review => {
              return (
                <View style={styles.review}>
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
  addressIcon: {marginRight: sizes.lg},
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
