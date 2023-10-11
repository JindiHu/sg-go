import {StackHeaderProps, StackNavigationProp} from '@react-navigation/stack';
import {FC} from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, sizes} from '../../constants';
import {ParamListBase, Route} from '@react-navigation/native';

export type HeaderProps = {
  route: Route<string>;
  navigation: StackNavigationProp<ParamListBase>;
  height: number;
};

export const Header: FC<HeaderProps> = ({height}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        {
          height: height + insets.top,
          marginBottom: -height,
        },
      ]}>
      <LinearGradient
        colors={[colors.secondBlue, colors.blue]}
        style={{flex: 1, paddingTop: insets.top}}></LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    zIndex: -1,
  },
});
