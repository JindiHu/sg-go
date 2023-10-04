import {StackScreenProps} from '@react-navigation/stack';
import {FC, useEffect, useState} from 'react';
import {Button, StyleSheet, Text, TextInput} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {colors, sizes} from '../../constants';
import {useDebounce} from '../../hooks/useDebounce';
import {handleApiError} from '../../services/error';
import {Address, onemapService} from '../../services/onemap';
import {RouteStackParamList} from '../navigations/RouteStack';

export const HomeScreen: FC<StackScreenProps<RouteStackParamList, 'Route'>> = ({
  navigation,
}) => {
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
      <TextInput
        style={styles.input}
        onChangeText={onChange}
        value={searchQuery}
        placeholder="useless placeholder"
        keyboardType="default"
      />
      <Text>Home Screen</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />
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
