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
