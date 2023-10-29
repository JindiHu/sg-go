import {FC, useEffect, useState} from 'react';
import {Image, ListRenderItem, StyleSheet, Text, View} from 'react-native';
import {Place, tourismHubService} from '../services/tourismHub';
import {FetchableFlatList} from './FetchableFlatList';

const PlaceCard: FC<Place> = props => {
  const [thumbnail, setThumbnail] = useState<string>();

  const fetchImage = async () => {
    if (props.thumbnails.length > 0) {
      if (props.thumbnails[0].url) {
        setThumbnail(props.thumbnails[0].url);
      } else if (props.thumbnails[0].uuid) {
        try {
          const base64 = await tourismHubService.getMedia(
            props.thumbnails[0].uuid,
          );
          setThumbnail(base64);
        } catch (_) {}
      }
    }
  };
  useEffect(() => {
    fetchImage();
  }, []);

  return (
    <View style={styles.placeItem}>
      <Image source={{uri: thumbnail}} style={styles.thumbnail} />
      <View style={styles.placeInfo}>
        <Text style={styles.placeName}>{props.name}</Text>
      </View>
    </View>
  );
};

const renderPlaceItem: ListRenderItem<Place> = ({item}) => {
  return <PlaceCard {...item} />;
};

type PlaceListProps = {
  fetchData: () => Promise<Place[]>;
};

export const PlaceList: FC<PlaceListProps> = ({fetchData}) => {
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
      fetchData={doFetch}
      keyExtractor={place => place.uuid}
      renderItem={renderPlaceItem}
    />
  );
};

const styles = StyleSheet.create({
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  thumbnail: {
    width: 64,
    height: 64,
    marginRight: 16,
    borderRadius: 4,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 10,
    marginBottom: 20,
  },
});
