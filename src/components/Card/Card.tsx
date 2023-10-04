import React, {PropsWithChildren} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {colors, sizes} from '../../constants';

interface CardProps {
  style?: ViewStyle;
}

export const Card: React.FC<PropsWithChildren<CardProps>> = ({
  children,
  style,
}) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: sizes.xs,
    elevation: 5, // Android shadow
    shadowColor: colors.black, // iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: sizes.xxs,
    margin: sizes.md,
    padding: sizes.md,
  },
});
