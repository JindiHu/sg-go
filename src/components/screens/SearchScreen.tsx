import {
  faChevronLeft,
  faLocationArrow,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Geolocation from '@react-native-community/geolocation';
import {StackScreenProps} from '@react-navigation/stack';
import React, {FC, useState} from 'react';
import {
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {colors, sizes} from '../../constants';
import {useAppContext} from '../../context/AppContext';
import {
  pushRecentSearch,
  setDestination,
  setOrigin,
  unsetDestination,
  unsetOrigin,
} from '../../context/reducers/route/route.actions';
import {useDebounce} from '../../hooks/useDebounce';
import {Address, onemapService} from '../../services/onemap';
import {FetchableFlatList} from '../FetchableFlatList';
import {Header} from '../Header/Header';
import {ParamList} from '../navigations/RootStack';
import {AddressPanel} from '../AddressPanel';

export const SearchScreen: FC<StackScreenProps<ParamList, 'SearchAddress'>> = ({
  route,
  navigation,
}) => {
  const [reloadKey, setReloadKey] = useState<number>(0);
  const {type} = route.params;
  const inputRef = React.createRef<TextInput>();

  const {state, dispatch} = useAppContext();
  const defaultOriginString = state.route.origin?.ADDRESS || '';
  const defaultDestinationString = state.route.destination?.ADDRESS || '';
  const defaultSearchString =
    type == 'origin' ? defaultOriginString : defaultDestinationString;

  const placeholder =
    type == 'origin' ? 'Choose starting point' : 'Choose destination';

  const [searchQuery, setSearchQuery] = useState<string>(defaultSearchString);
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const onChangeText = (text: string) => {
    setSearchQuery(text);
    if (!text) {
      if (type == 'origin') {
        unsetOrigin(dispatch);
      } else {
        unsetDestination(dispatch);
      }
    }
  };

  const search = async () => {
    const data = await onemapService.search(debouncedSearchQuery);
    return data.results;
  };

  const handleOnEndEditing = async () => {
    if (debouncedSearchQuery) {
      setReloadKey(reloadKey + 1);
    }
  };

  const setCurrentLocation = () => {
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
        navigation.goBack();
      }
    });
  };

  const renderFirstItem = ({type}: {type: 'origin' | 'destination'}) => {
    if (type == 'origin') {
      return (
        <TouchableOpacity onPress={setCurrentLocation}>
          <View style={styles.row}>
            <FontAwesomeIcon
              icon={faLocationArrow}
              color={colors.gray}
              size={sizes.md}
            />
            <Text
              style={[
                styles.rowText,
                {marginLeft: sizes.sm, marginVertical: sizes.xs},
              ]}>
              Current location
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  const renderAddress: ListRenderItem<Address> = ({item}) => {
    const handlePress = (address: Address) => {
      if (type == 'origin') {
        setOrigin(dispatch, address);
      } else {
        setDestination(dispatch, address);
      }
      pushRecentSearch(dispatch, address);
      navigation.goBack();
    };

    return <AddressPanel {...item} onPress={handlePress} />;
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
            ref={inputRef}
            placeholder={placeholder}
            style={styles.input}
            placeholderTextColor={colors.gray}
            autoFocus={true}
            clearButtonMode={'always'}
            onChangeText={onChangeText}
            value={searchQuery}
            keyboardType="default"
            enterKeyHint="search"
            enablesReturnKeyAutomatically={true}
            onEndEditing={handleOnEndEditing}
          />
        </View>
      </View>
      {!debouncedSearchQuery ? (
        renderFirstItem({type})
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <FetchableFlatList
            fetchData={search}
            keyExtractor={addr => addr.ADDRESS + addr.postalCode}
            renderItem={renderAddress}
            ListHeaderComponent={renderFirstItem({type})}
            dependencies={[debouncedSearchQuery, reloadKey]}
          />
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
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
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.sm,
    borderBottomWidth: 2,
    borderBottomColor: colors.lightGray,
  },
  rowText: {
    fontSize: sizes.md,
    color: colors.dark,
    textTransform: 'capitalize',
  },
});
