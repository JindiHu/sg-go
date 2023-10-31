import {faStar as faStarEmpty} from '@fortawesome/free-regular-svg-icons';
import {faStar, faStarHalfStroke} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {FC} from 'react';
import {View} from 'react-native';
import {sizes} from '../constants';

type RatingProps = {
  value: number;
  totalStars: number;
};

export const Rating: FC<RatingProps> = ({value, totalStars}) => {
  const filledStars = Math.floor(value);
  const halfStar = value - filledStars >= 0.5;

  const starElements = [];
  for (let i = 0; i < filledStars; i++) {
    starElements.push(
      <FontAwesomeIcon key={i} icon={faStar} size={sizes.sm} color="gold" />,
    );
  }

  if (halfStar) {
    starElements.push(
      <FontAwesomeIcon
        key={'half'}
        icon={faStarHalfStroke}
        size={sizes.sm}
        color="gold"
      />,
    );
  }

  while (starElements.length < totalStars) {
    starElements.push(
      <FontAwesomeIcon
        key={`empty-${starElements.length}`}
        icon={faStarEmpty}
        size={sizes.sm}
        color="gold"
      />,
    );
  }

  return <View style={{flexDirection: 'row'}}>{starElements}</View>;
};

export default Rating;
