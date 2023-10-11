import {StackScreenProps} from '@react-navigation/stack';
import {FC, useEffect, useState} from 'react';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Text,
} from 'react-native';
import {colors, sizes} from '../../constants';
import {useDebounce} from '../../hooks/useDebounce';
import {handleApiError} from '../../services/error';
import {Address, onemapService} from '../../services/onemap';
import {Card} from '../Card/Card';
import {HeaderWithActions} from '../Header/HeaderWithAction';
import {SearchBar} from '../SearchBar';
import {ParamList} from '../navigations/RootStack';
import {Header} from '../Header/Header';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft, faSearch} from '@fortawesome/free-solid-svg-icons';

export const SearchScreen: FC<StackScreenProps<ParamList, 'SearchAddress'>> = ({
  route,
  navigation,
}) => {
  const {type} = route.params;
  const placeholder =
    type == 'origin' ? 'Choose starting point' : 'Choose destination';

  const [searchQuery, setSearchQuery] = useState<string>();
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const onChangeText = async (text: string) => {
    setSearchQuery(text);
  };

  const doSearch = async (query: string) => {
    try {
      setIsSearching(true);
      const data = await onemapService.search(query);
      setAddresses(data.results);
    } catch (error) {
      setAddresses([]);
      handleApiError('Onemap', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (debouncedSearchQuery) {
      doSearch(debouncedSearchQuery);
    } else {
      setAddresses([]);
    }
  }, [debouncedSearchQuery]);

  const onRefresh = async () => {
    if (debouncedSearchQuery) {
      await doSearch(debouncedSearchQuery);
    }
  };

  return (
    <View style={styles.container}>
      <Header route={route} navigation={navigation} height={sizes.x4xlg} />
      <View style={styles.headerBar}>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.goBack();
          }}>
          <View style={styles.leftButton}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              color={colors.white}
              size={sizes.lg}
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.searchContainer}>
          <FontAwesomeIcon
            icon={faSearch}
            style={styles.searchIcon}
            size={20}
            color={colors.gray}
          />
          <TextInput
            placeholder={placeholder}
            style={styles.input}
            placeholderTextColor={colors.gray}
            autoFocus={true}
            onChangeText={onChangeText}
            keyboardType="default"
          />
        </View>
      </View>
      <FlatList
        data={addresses}
        keyExtractor={addr => addr.ADDRESS}
        renderItem={renderAddress}
        refreshing={isSearching}
        ListHeaderComponent={renderFirstItem({type})}
        refreshControl={
          <RefreshControl
            refreshing={isSearching}
            onRefresh={onRefresh}
            colors={[colors.gray]} // Customize the refresh indicator color(s)
            tintColor={colors.gray} // iOS only: Customize the spinning indicator color
            title={'Pull to Refresh'} // iOS only: Text shown while pulling down to refresh
          />
        }
      />
    </View>
  );
};

const renderFirstItem = ({type}: {type: 'origin' | 'destination'}) => {
  if (type == 'origin') {
    return (
      <View>
        <Text>Current localtion</Text>
      </View>
    );
  }
};

const renderAddress: ListRenderItem<Address> = ({item}) => {
  return (
    <View>
      <Text>{item.ADDRESS}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    height: sizes.x4xlg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftButton: {
    paddingVertical: sizes.xs,
    paddingHorizontal: sizes.xs,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: sizes.lg,
    paddingHorizontal: sizes.sm,
    borderColor: colors.lightGray,
    borderWidth: 1,
    marginRight: sizes.md,
  },
  searchIcon: {
    marginRight: sizes.sm,
  },
  input: {
    flex: 1,
    height: sizes.xxlg,
    color: colors.dark,
  },
});
