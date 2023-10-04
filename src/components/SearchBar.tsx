import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {FC} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {colors, sizes} from '../constants';

type SearchBar = {
  onChangeText: (text: string) => void;
  placeholder: string;
  value: string | undefined;
};

export const SearchBar: FC<SearchBar> = ({onChangeText, placeholder}) => {
  return (
    <View style={styles.container}>
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
        onChangeText={onChangeText}
        keyboardType="default"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: sizes.xxs,
    paddingHorizontal: 10,
    borderColor: colors.lightGray,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: sizes.sm,
  },
  input: {
    flex: 1,
    height: sizes.xxxlg,
    color: colors.dark,
  },
});
