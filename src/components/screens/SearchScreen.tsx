import {StackScreenProps} from '@react-navigation/stack';
import {FC, useEffect, useState} from 'react';
import {Button, StyleSheet, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {colors, sizes} from '../../constants';
import {useDebounce} from '../../hooks/useDebounce';
import {handleApiError} from '../../services/error';
import {Address, onemapService} from '../../services/onemap';
import {Card} from '../Card/Card';
import {SearchBar} from '../SearchBar';
import {RootStackParamList} from '../navigations/RootStack';

export const SearchScreen: FC<
  StackScreenProps<RootStackParamList, 'Search'>
> = ({navigation}) => {
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
        handleApiError('Onemap', error);
      }
    }

    if (debouncedSearchQuery) {
      doSearch(debouncedSearchQuery);
    } else {
      setAddresses([]);
    }
  }, [debouncedSearchQuery]);
  console.log(addresses);

  return (
    <ScrollView style={{}}>
      <Card>
        <SearchBar
          onChangeText={onChange}
          placeholder={'Choose starting point'}
          value={searchQuery}
        />
      </Card>
      <Text>Home Screen</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    margin: sizes.sm,
    borderWidth: 1,
    borderRadius: sizes.xxs,
    borderColor: colors.gray,
    padding: sizes.sm,
    fontSize: sizes.md,
  },
});
