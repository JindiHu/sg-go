import {DependencyList, FC, useEffect, useState} from 'react';
import {Alert, Dimensions} from 'react-native';
import {Image, ListRenderItem, StyleSheet, Text, View} from 'react-native';
import {Place, tourismHubService} from '../services/tourismHub';
import {FetchableFlatList} from './FetchableFlatList';
import {colors, sizes} from '../constants';
import Rating from './Rating';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

type PlaceListProps = {
  fetchData: () => Promise<Place[]>;
  numOfItemsPerPage?: number;
  dependencies?: DependencyList;
  onCardPress: (p: Place) => void;
};

export const PlaceList: FC<PlaceListProps> = ({
  fetchData,
  numOfItemsPerPage = 2,
  dependencies = [],
  onCardPress,
}) => {
  const PlaceCard: FC<Place> = props => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const width = windowWidth < windowHeight ? windowWidth : windowHeight;
    const containerWidth = width / numOfItemsPerPage;
    const imageWidth = containerWidth - sizes.lg;
    const imageHeight = imageWidth < 130 ? imageWidth : 130;

    const [thumbnail, setThumbnail] = useState<string>();

    const fetchImage = async () => {
      if (props.thumbnails.length > 0) {
        if (props.thumbnails[0].url) {
          setThumbnail(props.thumbnails[0].url);
        } else if (props.thumbnails[0].uuid) {
          try {
            const path = await tourismHubService.getMedia(
              props.thumbnails[0].uuid,
            );
            setThumbnail(path);
          } catch (_) {}
        }
      }
    };
    useEffect(() => {
      fetchImage();
    }, []);

    const handlePress = () => {
      onCardPress(props);
    };

    return (
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={[styles.placeItem, {width: containerWidth}]}>
          <View style={styles.thumbnail}>
            <Image
              source={{uri: thumbnail}}
              style={[
                {
                  width: imageWidth,
                  height: imageHeight,
                  borderRadius: sizes.xs,
                },
              ]}
            />
            <View style={styles.ratingBackground}></View>
            <View style={styles.rating}>
              <Rating value={props.rating} totalStars={5} />
            </View>
          </View>
          <View style={styles.placeInfo}>
            <Text style={styles.placeName} numberOfLines={1}>
              {props.name}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderPlaceItem: ListRenderItem<Place> = ({item}) => {
    return <PlaceCard {...item} />;
  };

  const doFetch = async () => {
    const data = await fetchData();

    return data.filter(place => {
      if (place.thumbnails.length > 0) {
        if (place.thumbnails[0].url || place.thumbnails[0].uuid) {
          return true;
        }
      }
      return false;
    });
  };

  useEffect(() => {
    doFetch();
  }, []);

  return (
    <FetchableFlatList
      style={styles.listContainer}
      fetchData={doFetch}
      keyExtractor={place => place.uuid}
      renderItem={renderPlaceItem}
      horizontal={true}
      refreshing={false}
      refreshControl={undefined}
      pagingEnabled={true}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      dependencies={dependencies}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: colors.white,
  },
  placeItem: {
    alignItems: 'center',
    paddingVertical: sizes.md,
  },
  thumbnail: {
    position: 'relative',
  },
  ratingBackground: {
    position: 'absolute',
    left: sizes.sm - 4,
    bottom: sizes.sm - 4,
    width: sizes.sm * 5 + 8,
    height: sizes.sm + 8,
    backgroundColor: colors.dark,
    opacity: 0.7,
    borderRadius: 2,
  },
  rating: {
    left: 0,
    bottom: 0,
    position: 'absolute',
    padding: sizes.sm,
  },
  placeInfo: {
    paddingTop: sizes.xs,
    paddingHorizontal: sizes.md,
  },
  placeName: {
    textAlign: 'center',
    fontSize: sizes.sm,
    color: colors.gray,
  },
});
