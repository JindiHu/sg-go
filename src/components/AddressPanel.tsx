import {FC} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors, sizes} from '../constants';
import {Address} from '../services/onemap';

export const AddressPanel: FC<Address & {onPress: (a: Address) => void}> = ({
  onPress,
  ...address
}) => {
  return (
    <TouchableOpacity onPress={() => onPress(address)}>
      <View style={styles.row}>
        <View>
          <View>
            <Text
              style={[
                styles.rowText,
                {fontWeight: '500', fontSize: sizes.md, color: colors.dark},
              ]}>
              {address.SEARCHVAL}
            </Text>
          </View>
          {address.SEARCHVAL != address.ADDRESS && (
            <View style={{marginTop: sizes.xxs}}>
              <Text style={[styles.rowText, {fontSize: sizes.md - 2}]}>
                {address.ADDRESS}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
