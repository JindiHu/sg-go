import {faAngleRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import moment from 'moment';
import {FC, Fragment, useEffect, useState} from 'react';
import {
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {colors, sizes} from '../../constants';
import {handleApiError} from '../../services/error';
import {Itinerary, RoutePlan, onemapService} from '../../services/onemap';
import {toHoursAndMinutes} from '../../utils';
import {RouteLegDetails} from './RouteLegDetails';
import {RouteLegSummary} from './RouteLegSummary';

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
      <TouchableOpacity onPress={handleOnPress}>
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
      </TouchableOpacity>
      {isExpanded && <View>{details}</View>}
    </View>
  );
};

const renderItinerary: ListRenderItem<Itinerary> = ({item}) => {
  return <ItineraryCard {...item} />;
};

export const RoutePlanList: FC<RoutePlanProps> = props => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [plan, setPlan] = useState<RoutePlan | undefined>();

  const getRoutePlan = async () => {
    try {
      setIsRefreshing(true);
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
    } finally {
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    getRoutePlan(); // Fetch data when the user pulls down to refresh
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
    <FlatList
      style={styles.container}
      data={plan?.plan.itineraries}
      renderItem={renderItinerary}
      refreshing={isRefreshing}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={[colors.gray]} // Customize the refresh indicator color(s)
          tintColor={colors.gray} // iOS only: Customize the spinning indicator color
          title={'Pull to Refresh'} // iOS only: Text shown while pulling down to refresh
        />
      }
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
