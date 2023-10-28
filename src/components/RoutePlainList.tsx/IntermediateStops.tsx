import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {FC, useState} from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {colors, sizes} from '../../constants';
import {Leg} from '../../services/onemap';
import {toHoursAndMinutes} from '../../utils';

export const IntermediateStops: FC<Leg> = props => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handlePress = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View>
      {props.intermediateStops.length > 0 ? (
        <TouchableWithoutFeedback onPress={handlePress}>
          <View style={styles.itineraryRouteLegStops}>
            {isExpanded ? (
              <FontAwesomeIcon
                icon={faChevronDown}
                color={colors.dark}
                size={sizes.sm}
              />
            ) : (
              <FontAwesomeIcon
                icon={faChevronUp}
                color={colors.dark}
                size={sizes.sm}
              />
            )}
            <Text
              style={[
                styles.numberOfStopsText,
                {
                  marginLeft: sizes.xs,
                },
              ]}>
              Ride {props.numIntermediateStops}{' '}
              {props.numIntermediateStops > 1 ? 'stops' : 'stop'} (
              {toHoursAndMinutes(props.duration)})
            </Text>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View style={styles.itineraryRouteLegStops}>
          <Text style={styles.numberOfStopsText}>
            Ride {props.numIntermediateStops}{' '}
            {props.numIntermediateStops > 1 ? 'stops' : 'stop'} (
            {toHoursAndMinutes(props.duration)})
          </Text>
        </View>
      )}
      {isExpanded && props.intermediateStops.length > 0 && (
        <View style={styles.intermediateStops}>
          {props.intermediateStops.map(stop => {
            return (
              <View style={styles.intermediateStop} key={stop.stopId}>
                <Text style={styles.intermediateStopText}>{stop.name}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itineraryRouteLegStops: {
    flexDirection: 'row',
    marginTop: sizes.xs,
    alignItems: 'center',
  },
  numberOfStopsText: {
    fontWeight: '500',
  },
  intermediateStops: {
    marginLeft: sizes.lg,
  },
  intermediateStop: {
    marginTop: sizes.xs,
  },
  intermediateStopText: {
    color: colors.gray,
    fontSize: sizes.sm,
  },
});
