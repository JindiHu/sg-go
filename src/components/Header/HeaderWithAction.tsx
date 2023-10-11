import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {FC} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {colors, sizes} from '../../constants';
import {Header, HeaderProps} from './Header';

type HeaderWithActionsProps = HeaderProps & {};

export const HeaderWithActions: FC<HeaderWithActionsProps> = ({
  route,
  navigation,
  height,
}) => {
  return (
    <>
      <Header route={route} navigation={navigation} height={sizes.xxlg} />
      <View style={styles.headerBar}>
        <TouchableWithoutFeedback
          style={styles.leftButton}
          onPress={() => {
            console.log('back');
            navigation.goBack();
          }}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            color={colors.white}
            size={sizes.lg}
          />
        </TouchableWithoutFeedback>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerBar: {height: sizes.xxlg, flexDirection: 'row', backgroundColor: 'red'},
  leftButton: {
    backgroundColor: 'yellow',
    width: sizes.xxlg,
    paddingHorizontal: sizes.md,
  },
});
