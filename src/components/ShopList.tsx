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
import {colors} from '../constants';

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
      <Image source={{uri: thumbnail}} style={styles.thumbnail} />
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
    try {
      const data = await tourismHubService.getShops();

      setShops(
        data.filter(shop => {
          if (shop.thumbnails.length > 0) {
            if (shop.thumbnails[0].url || shop.thumbnails[0].uuid) {
              return true;
            }
          }
          return false;
        }),
      );
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
      refreshing={isRefreshing}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={[colors.gray]} // Customize the refresh indicator color(s)
          tintColor={colors.gray} // iOS only: Customize the spinning indicator color
          title={'Pull to Refresh'} // iOS only: Text shown while pulling down to refresh
        />
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
