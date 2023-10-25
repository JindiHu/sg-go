import {FC, useEffect, useState} from 'react';
import {handleApiError} from '../services/error';
import {Itinerary, RoutePlan, onemapService} from '../services/onemap';
import {FlatList} from 'react-native-gesture-handler';
import {ListRenderItem, View, Text, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faBusSimple,
  faPersonWalking,
  faTrainSubway,
} from '@fortawesome/free-solid-svg-icons';
import {colors, sizes} from '../constants';
import moment from 'moment';
import {toHoursAndMinutes} from '../utils';

type RoutePlanProps = {
  start: {
    latitude: number;
    longitude: number;
  };
  end: {
    latitude: number;
    longitude: number;
  };
};

const ItineraryCard: FC<Itinerary> = props => {
  const summary = props.legs.map((leg, key) => {
    console.log(leg.mode);
    switch (leg.mode) {
      case 'WALK':
        return (
          <View style={styles.itinerarySummaryIcon}>
            <FontAwesomeIcon
              icon={faPersonWalking}
              color={colors.dark}
              size={sizes.lg}
            />
          </View>
        );
      case 'SUBWAY':
        return (
          <View style={styles.itinerarySummaryIcon}>
            <FontAwesomeIcon
              icon={faTrainSubway}
              color={colors.dark}
              size={sizes.lg}
            />
          </View>
        );
      case 'BUS':
        return (
          <View style={styles.itinerarySummaryIcon}>
            <FontAwesomeIcon
              icon={faBusSimple}
              color={colors.dark}
              size={sizes.lg}
            />
          </View>
        );
      default:
        return null;
    }
  });
  return (
    <View style={styles.itineraryCard}>
      <View style={styles.itinerarySummary}>
        <View style={styles.itinerarySummaryTime}>
          <Text style={styles.itinerarySummaryTimeTextLeft}>
            {moment(props.startTime).format('hh:mm a')} -{' '}
            {moment(props.endTime).format('hh:mm a')}
          </Text>
          <Text>{toHoursAndMinutes(props.duration)}</Text>
        </View>
        <View style={styles.itinerarySummaryPath}>{summary}</View>
      </View>
    </View>
  );
};

const renderItinerary: ListRenderItem<Itinerary> = ({item}) => {
  console.log(item.duration);

  return <ItineraryCard {...item} />;
};

export const RoutePlanList: FC<RoutePlanProps> = props => {
  const [plan, setPlan] = useState<RoutePlan | undefined>();
  const getRoutePlan = async () => {
    try {
      const data = await onemapService.getRoutePlan({
        start: {
          latitude: props.start.latitude,
          longitude: props.start.longitude,
        },
        end: {
          latitude: props.end.latitude,
          longitude: props.end.longitude,
        },
      });

      setPlan(data);
    } catch (error) {
      setPlan(undefined);
      handleApiError('onemap', error);
    }
  };

  useEffect(() => {
    getRoutePlan();
  }, [
    props.start.latitude,
    props.start.longitude,
    props.end.latitude,
    props.end.longitude,
  ]);

  return (
    <FlatList data={plan?.plan.itineraries} renderItem={renderItinerary} />
  );
};

const styles = StyleSheet.create({
  itineraryCard: {
    paddingVertical: sizes.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    paddingHorizontal: sizes.sm,
  },
  itinerarySummary: {},
  itinerarySummaryTime: {
    paddingHorizontal: sizes.md,
    paddingBottom: sizes.sm,
  },
  itinerarySummaryTimeTextLeft: {
    color: colors.dark,
    fontSize: sizes.sm,
  },
  itinerarySummaryPath: {
    flexDirection: 'row',
  },
  itinerarySummaryIcon: {
    paddingHorizontal: sizes.xs,
  },
});
