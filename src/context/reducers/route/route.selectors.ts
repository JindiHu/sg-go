import {Address} from '../../../services/onemap';
import {AppState} from '../rootReducer';

export const getRecentSearches = (state: AppState): Address[] => {
  return Object.values(state.route.recentSearches)
    .sort((a, b) => {
      return b.timestamp - a.timestamp;
    })
    .map(({timestamp, ...address}) => {
      return address;
    });
};
