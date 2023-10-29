import {StackScreenProps} from '@react-navigation/stack';
import {FC, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDebounce} from '../../hooks/useDebounce';
import {handleApiError} from '../../services/error';
import {Address, onemapService} from '../../services/onemap';
import {tourismHubService} from '../../services/tourismHub';
import {Header} from '../Header/Header';
import {PlaceList} from '../PlaceList';
import {ParamList} from '../navigations/RootStack';

export const HomeScreen: FC<StackScreenProps<ParamList, 'Home'>> = ({
  route,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState<string>();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const onChange = async (text: string) => {
    setSearchQuery(text);
  };

  useEffect(() => {
    async function doSearch(query: string) {
      try {
        const data = await onemapService.search(query);
        setAddresses(data.results);
      } catch (error) {
        handleApiError(error);
      }
    }

    if (debouncedSearchQuery) {
      doSearch(debouncedSearchQuery);
    } else {
      setAddresses([]);
    }
  }, [debouncedSearchQuery]);

  return (
    <View style={styles.container}>
      <Header route={route} navigation={navigation} />
      <PlaceList fetchData={tourismHubService.getAttriactions} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
