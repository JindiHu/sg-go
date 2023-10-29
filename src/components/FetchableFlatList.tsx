import {DependencyList, FC, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  RefreshControl,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {colors, sizes} from '../constants';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {handleApiError} from '../services/error';

type FetchableFlatListProps<ItemT = any> = FC<
  Omit<FlatListProps<ItemT>, 'data'> & {
    fetchData: () => Promise<ItemT>;
    dependencies?: DependencyList;
    errorMsg?: string;
  }
>;

export const FetchableFlatList: FetchableFlatListProps = ({
  fetchData,
  dependencies = [],
  errorMsg,
  ...flatListProps
}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const doFetch = async () => {
    try {
      const result = await fetchData();
      setData(result);
      setHasError(false);
    } catch (e) {
      setHasError(true);
      handleApiError(e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    doFetch();
  }, dependencies);

  const onRefresh = () => {
    setIsRefreshing(true);
    doFetch();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  const handleReload = () => {
    setIsLoading(true);
    doFetch();
  };
  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>
          {errorMsg ? errorMsg : 'Something went wrong'}
        </Text>
        <TouchableOpacity onPress={handleReload}>
          <View style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Try again</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      {...flatListProps}
      data={data}
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
  loadingContainer: {
    flex: 1,
    paddingTop: sizes.lg,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorMessage: {
    color: colors.gray,
  },
  retryButton: {
    marginTop: sizes.sm,
    backgroundColor: colors.blue,
    paddingHorizontal: sizes.sm,
    paddingVertical: sizes.xs,
    borderRadius: sizes.xs,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '500',
  },
});
