import moment from 'moment';
import {FC, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {colors, sizes} from '../../constants';
import {handleApiError} from '../../services/error';
import {ltaService} from '../../services/lta';

type BusArrivalProps = {
  busStopCode: string;
  serviceNo: string;
};

const displayCrowdingLevel = (crowdingLevel: string) => {
  switch (crowdingLevel) {
    case 'SEA':
      return (
        <Text style={[styles.crowdingLevelText, {color: colors.darkGreen}]}>
          Seats Avail
        </Text>
      );
    case 'SDA':
      return (
        <Text style={[styles.crowdingLevelText, {color: colors.yellow}]}>
          Standing Avail
        </Text>
      );
    case 'LSD':
      return (
        <Text style={[styles.crowdingLevelText, {color: colors.red}]}>
          Ltd Standing
        </Text>
      );
    default:
      return '';
  }
};

export const BusArrival: FC<BusArrivalProps> = ({busStopCode, serviceNo}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [durationInMin, setDurationInMin] = useState<number | null>();
  const [crowdingLevel, setCrowdingLevel] = useState<string | null>();

  const fetchData = (delayMs: number) => {
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const busArrival = await ltaService.getBusArrival(
          busStopCode,
          serviceNo,
        );
        if (busArrival.Services && busArrival.Services.length > 0) {
          const arrival = parseInt(
            moment(busArrival.Services[0].NextBus.EstimatedArrival).format('X'),
          );
          const now = parseInt(moment().format('X'));
          const def = arrival - now;
          if (def > 0) {
            setDurationInMin(Math.ceil(def / 60));
            setCrowdingLevel(busArrival.Services[0].NextBus.Load);
          } else {
            const arrival = parseInt(
              moment(busArrival.Services[0].NextBus2.EstimatedArrival).format(
                'X',
              ),
            );
            const now = parseInt(moment().format('X'));
            const def = arrival - now;
            if (def > 0) {
              setDurationInMin(Math.ceil(def / 60));
              setCrowdingLevel(busArrival.Services[0].NextBus2.Load);
            } else {
              const arrival = parseInt(
                moment(busArrival.Services[0].NextBus3.EstimatedArrival).format(
                  'X',
                ),
              );
              const now = parseInt(moment().format('X'));
              const def = arrival - now;
              if (def > 0) {
                setDurationInMin(Math.ceil(def / 60));
                setCrowdingLevel(busArrival.Services[0].NextBus3.Load);
              } else {
                setDurationInMin(null);
                setCrowdingLevel('');
              }
            }
          }
        } else {
          setDurationInMin(null);
          setCrowdingLevel('');
        }
      } catch (error) {
        setDurationInMin(null);
        setCrowdingLevel('');
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    }, delayMs);
  };

  useEffect(() => {
    fetchData(0);
  }, [busStopCode, serviceNo]);

  const handlePress = () => {
    fetchData(1000);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={[styles.busArrivalContainer]}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <>
              <View>
                {durationInMin ? (
                  <>
                    <View>
                      <Text style={styles.busArrivalText}>{durationInMin}</Text>
                    </View>
                    <View>
                      <Text style={styles.busArrivalTextUnit}>min</Text>
                    </View>
                  </>
                ) : (
                  <Text style={styles.busArrivalText}>NA</Text>
                )}
              </View>
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
      {crowdingLevel && (
        <View style={styles.crowdingLevel}>
          {displayCrowdingLevel(crowdingLevel)}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  busArrivalContainer: {
    width: sizes.xxlg,
    height: sizes.xxlg,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: sizes.xs,
  },
  busArrivalText: {
    fontWeight: '600',
    textAlign: 'center',
    color: colors.white,
  },
  busArrivalTextUnit: {
    color: colors.white,
    fontSize: sizes.md - 2,
  },
  crowdingLevel: {
    marginTop: sizes.xs,
  },
  crowdingLevelText: {
    fontSize: sizes.md - 2,
  },
});
