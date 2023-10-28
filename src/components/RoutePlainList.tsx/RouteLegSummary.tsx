import {
  faTrainSubway,
  faBusSimple,
  faPersonWalking,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, sizes, transportColors} from '../../constants';
import {Leg} from '../../services/onemap';

export const RouteLegSummary: FC<Leg> = ({mode, route, routeShortName}) => {
  switch (mode) {
    case 'SUBWAY':
    case 'TRAM':
      return (
        <View style={styles.itinerarySummaryIcon}>
          <FontAwesomeIcon
            icon={faTrainSubway}
            color={colors.dark}
            size={sizes.md}
          />
          <View
            style={[
              styles.mrtBadge,
              {
                backgroundColor: transportColors.mrt[route],
              },
            ]}>
            <Text style={styles.mrtBadgeText}>{routeShortName}</Text>
          </View>
        </View>
      );
    case 'BUS':
      return (
        <View style={styles.itinerarySummaryIcon}>
          <FontAwesomeIcon
            icon={faBusSimple}
            color={colors.dark}
            size={sizes.md}
          />
          <View style={styles.busBadge}>
            <Text style={styles.busBadgeText}>{routeShortName}</Text>
          </View>
        </View>
      );
    default:
      return (
        <View style={styles.itinerarySummaryIcon}>
          <FontAwesomeIcon
            icon={faPersonWalking}
            color={colors.dark}
            size={sizes.md}
          />
        </View>
      );
  }
};

const styles = StyleSheet.create({
  itinerarySummaryIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: sizes.xs,
    paddingVertical: sizes.sm,
  },
  mrtBadge: {
    marginLeft: sizes.xs,
    paddingHorizontal: sizes.sm,
    borderRadius: 5,
  },
  mrtBadgeText: {
    color: colors.white,
  },
  busBadge: {
    marginLeft: sizes.xs,
    paddingHorizontal: sizes.sm,
    borderRadius: 5,
    backgroundColor: transportColors.bus,
  },
  busBadgeText: {
    color: colors.white,
  },
});
