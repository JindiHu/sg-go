import {
  faBusSimple,
  faPersonWalking,
  faTrainSubway,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, sizes, transportColors} from '../../constants';
import {Leg} from '../../services/onemap';
import {toHoursAndMinutes} from '../../utils';
import moment from 'moment';
import {IntermediateStops} from './IntermediateStops';
import {BusArrival} from './BusArrival';

const RouteLegDetailsIcon: FC<Leg> = props => {
  switch (props.mode) {
    case 'SUBWAY':
    case 'TRAM':
      return (
        <View
          style={[
            styles.itineraryDetailsIcon,
            {borderColor: transportColors.mrt[props.route]},
          ]}>
          <FontAwesomeIcon
            icon={faTrainSubway}
            color={colors.dark}
            size={sizes.md}
          />
        </View>
      );
    case 'BUS':
      return (
        <View
          style={[
            styles.itineraryDetailsIcon,
            {borderColor: transportColors.bus},
          ]}>
          <FontAwesomeIcon
            icon={faBusSimple}
            color={colors.dark}
            size={sizes.md}
          />
        </View>
      );
    default:
      return (
        <View style={styles.itineraryDetailsIcon}>
          <FontAwesomeIcon
            icon={faPersonWalking}
            color={colors.dark}
            size={sizes.md}
          />
        </View>
      );
  }
};

const RouteLegDescription: FC<Leg> = props => {
  switch (props.mode) {
    case 'SUBWAY':
    case 'TRAM':
      return (
        <View>
          <View style={styles.itineraryRouteLegStops}>
            <Text>{props.from.name}</Text>
          </View>
          <View style={styles.mrtInfoWrapper}>
            <View style={styles.badgeWrapper}>
              <View
                style={[
                  styles.mrtBadge,
                  {backgroundColor: transportColors.mrt[props.route]},
                ]}>
                <Text style={styles.mrtBadgeText}>{props.routeLongName}</Text>
              </View>
            </View>
            <IntermediateStops {...props} />
            <View style={styles.itineraryRouteLegStops}>
              <Text>{props.to.name}</Text>
            </View>
          </View>
        </View>
      );
    case 'BUS':
      return (
        <View>
          <View style={styles.itineraryRouteLegStops}>
            <Text>{props.from.name}</Text>
          </View>
          <View style={styles.busInfoWrapper}>
            <View>
              <View style={styles.badgeWrapper}>
                <View style={styles.busBadge}>
                  <Text style={styles.busBadgeText}>
                    {props.routeShortName}
                  </Text>
                </View>
              </View>
              <IntermediateStops {...props} />
              <View style={styles.itineraryRouteLegStops}>
                <Text>{props.to.name}</Text>
              </View>
            </View>
            <BusArrival
              busStopCode={props.from.stopCode}
              serviceNo={props.routeId}
            />
          </View>
        </View>
      );
    default:
      return (
        <View style={styles.itineraryRouteLegStops}>
          <Text>
            Walk {toHoursAndMinutes(props.duration)} to {props.to.name}
          </Text>
        </View>
      );
  }
};

export const RouteLegDetails: FC<Leg> = props => {
  return (
    <View style={styles.itineraryDetails}>
      <RouteLegDetailsIcon {...props} />
      <View style={[styles.itineraryDescription]}>
        <View>
          <Text style={styles.itineraryDetailsEstimation}>
            {moment(props.startTime).format('hh:mm a')} -{' '}
            {moment(props.endTime).format('hh:mm a')}
          </Text>
        </View>
        <View style={styles.itineraryRouteLeg}>
          <RouteLegDescription {...props} />
        </View>
      </View>
      <View>
        <Text></Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itineraryDetails: {
    flexDirection: 'row',
  },
  itineraryDetailsIcon: {
    paddingTop: sizes.sm,
    paddingHorizontal: sizes.md,
    borderRightWidth: 5,
    borderColor: colors.gray,
  },
  itineraryDescription: {
    flex: 1,
    paddingLeft: sizes.sm,
    paddingVertical: sizes.sm,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  itineraryDetailsEstimation: {
    color: colors.dark,
    fontSize: sizes.sm,
  },
  itineraryRouteLeg: {
    // marginTop: sizes.sm,
  },
  busInfoWrapper: {
    flexDirection: 'row',
    marginTop: sizes.xs,
    justifyContent: 'space-between',
    paddingRight: sizes.lg,
  },
  mrtInfoWrapper: {
    marginTop: sizes.xs,
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itineraryRouteLegStops: {
    marginTop: sizes.xs,
  },
  mrtBadge: {
    paddingHorizontal: sizes.sm,
    borderRadius: 5,
  },
  mrtBadgeText: {
    color: colors.white,
  },
  busBadge: {
    paddingHorizontal: sizes.sm,
    borderRadius: 5,
    backgroundColor: transportColors.bus,
  },
  busBadgeText: {
    color: colors.white,
  },
});
