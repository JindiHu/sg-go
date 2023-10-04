import {FC, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {handleApiError} from '../services/error';
import {Shop, tourismHubService} from '../services/tourismHub';

const ShopCard: FC<Shop> = props => {
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
    <View style={styles.shopItem}>
      {thumbnail && (
        <Image source={{uri: thumbnail}} style={styles.thumbnail} />
      )}
      <View style={styles.shopInfo}>
        <Text style={styles.shopName}>{props.name}</Text>
      </View>
    </View>
  );
};

const renderShopItem: ListRenderItem<Shop> = ({item}) => {
  return <ShopCard {...item} />;
};

export const ShopList: FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const fetchData = async () => {
    console.log('fetching data');
    try {
      const data = await tourismHubService.getShops();
      setShops(data);
    } catch (error) {
      setShops([]);
      handleApiError('tourismHub', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData(); // Fetch data when the user pulls down to refresh
  };

  return (
    <FlatList
      data={shops}
      keyExtractor={shop => shop.uuid}
      renderItem={renderShopItem}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={['#3498db']} // Customize the refresh indicator color(s)
          tintColor={'#3498db'} // iOS only: Customize the spinning indicator color
          title={'Pull to Refresh'} // iOS only: Text shown while pulling down to refresh
        />
      }
      ListFooterComponent={
        isRefreshing ? (
          <ActivityIndicator
            size="large"
            color="#3498db"
            style={styles.loadingIndicator}
          />
        ) : null
      }
    />
  );
};
const styles = StyleSheet.create({
  shopItem: {
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
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  shopDescription: {
    fontSize: 14,
    color: '#666',
  },
  loadingIndicator: {
    marginTop: 10,
    marginBottom: 20,
  },
});
