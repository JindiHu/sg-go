import {faAngleRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import moment from 'moment';
import {FC, Fragment, useState} from 'react';
import {
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {colors, sizes} from '../../constants';
import {Itinerary, onemapService} from '../../services/onemap';
import {toHoursAndMinutes} from '../../utils';
import {FetchableFlatList} from '../FetchableFlatList';
import {RouteLegDetails} from './RouteLegDetails';
import {RouteLegSummary} from './RouteLegSummary';
import {mockRoutePlan} from '../../mock/oneMapRoutePlan';

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
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const summary = props.legs.map((leg, key) => {
    return (
      <Fragment key={key}>
        {key > 0 && (
          <View style={styles.itinerarySummaryIcon}>
            <FontAwesomeIcon
              icon={faAngleRight}
              color={colors.gray}
              size={sizes.sm}
            />
          </View>
        )}
        <RouteLegSummary {...leg} />
      </Fragment>
    );
  });

  const details = props.legs.map((leg, key) => {
    return (
      <Fragment key={key}>
        <RouteLegDetails {...leg} />
      </Fragment>
    );
  });

  const handleOnPress = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.itineraryCard}>
      <TouchableWithoutFeedback onPress={handleOnPress}>
        <View style={styles.itinerarySummary}>
          <View style={styles.itinerarySummaryTime}>
            <Text style={styles.itinerarySummaryTimeTextLeft}>
              {moment(props.startTime).format('hh:mm a')} -{' '}
              {moment(props.endTime).format('hh:mm a')}
            </Text>
            <Text style={styles.itinerarySummaryTimeTextRight}>
              {toHoursAndMinutes(props.duration)}
            </Text>
          </View>
          <View style={styles.itinerarySummaryPath}>{summary}</View>
        </View>
      </TouchableWithoutFeedback>
      {isExpanded && <View>{details}</View>}
    </View>
  );
};

const renderItinerary: ListRenderItem<Itinerary> = ({item}) => {
  return <ItineraryCard {...item} />;
};

export const RoutePlanList: FC<RoutePlanProps> = props => {
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
      return data.plan.itineraries;
    } catch (e) {
      return mockRoutePlan.plan.itineraries;
    }
  };

  return (
    <FetchableFlatList
      style={styles.container}
      fetchData={getRoutePlan}
      renderItem={renderItinerary}
      dependencies={[
        props.start.latitude,
        props.start.longitude,
        props.end.latitude,
        props.end.longitude,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGray,
  },
  itineraryCard: {
    backgroundColor: colors.white,
    borderBottomWidth: sizes.xs,
    borderBottomColor: colors.lightGray,
  },
  itinerarySummary: {
    paddingHorizontal: sizes.md,
  },
  itinerarySummaryTime: {
    paddingTop: sizes.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itinerarySummaryTimeTextLeft: {
    color: colors.dark,
    fontSize: sizes.md,
    fontWeight: '500',
  },
  itinerarySummaryTimeTextRight: {
    color: colors.black,
    fontSize: sizes.md,
    fontWeight: '600',
  },
  itinerarySummaryPath: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  itinerarySummaryIcon: {
    marginRight: sizes.xs,
  },
});
