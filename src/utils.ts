import {Itinerary, Leg} from './services/onemap';
import {TihRoutesData} from './services/tourismHub';

export const toHoursAndMinutes = (totalSeconds: number) => {
  const totalMinutes = Math.ceil(totalSeconds / 60);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  } else {
    return `${minutes} min`;
  }
};

const travelModeMap = {
  WALKING: 'WALK',
};

export const convertTihRoutesToOneMapItineraries = (
  d: TihRoutesData,
): Itinerary[] => {
  const itineraries: Itinerary[] = [];
  if (d.routes.length > 0 && d.routes[0].legs.length > 0) {
    const now = Date.now();
    d.routes[0].legs.forEach(l => {
      const legs: Leg[] = [];

      let endTime = now;
      l.steps.forEach(s => {
        const startTime = endTime;
        endTime = startTime + s.duration;

        let mode: Leg['mode'] = 'WALK';
        let routeId = '';
        let route = '';
        let numOfStops = 0;
        if (s.travelMode == 'TRANSIT') {
          if ((s.transitDetail.line.vehicle.type = 'BUS')) {
            mode = 'BUS';
            routeId = s.transitDetail.line.name;
            route = s.transitDetail.line.name;
            numOfStops = s.transitDetail.numOfStops;
          } else {
            mode = 'SUBWAY';
          }
        }

        const leg: Leg = {
          duration: s.duration,
          startTime: startTime,
          endTime: endTime,
          departureDelay: 0,
          arrivalDelay: 0,
          realTime: false,
          distance: s.distance,
          pathway: false,
          mode: mode,
          routeId: routeId,
          route: route,
          routeShortName: '',
          routeLongName: '',
          numIntermediateStops: numOfStops,
          intermediateStops: [],
          from: {
            name: '',
            lat: 0,
            lon: 0,
            orig: undefined,
            departure: undefined,
            arrival: undefined,
            vertexType: undefined,
            stopId: undefined,
            stopCode: undefined,
            stopIndex: undefined,
            stopSequence: undefined,
          },
          to: {
            name: '',
            lat: 0,
            lon: 0,
            orig: undefined,
            departure: undefined,
            arrival: undefined,
            vertexType: undefined,
            stopId: undefined,
            stopCode: undefined,
            stopIndex: undefined,
            stopSequence: undefined,
          },
        };
        legs.push(leg);
      });

      const itinerary: Itinerary = {
        duration: l.duration,
        startTime: now,
        endTime: now + l.duration,
        walkTime: 0,
        transitTime: 0,
        waitingTime: 0,
        walkDistance: 0,
        walkLimitExceeded: false,
        elevationLost: 0,
        elevationGained: 0,
        transfers: 0,
        legs: legs,
      };
    });
  }

  return itineraries;
};
