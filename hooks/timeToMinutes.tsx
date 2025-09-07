const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const getDurationInHours = (start: string, end: string): number => {
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);

  let diff = endMinutes - startMinutes;

  if (diff < 0) {
    diff += 24 * 60;
  }

  return diff / 60;
};
