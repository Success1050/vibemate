import { TimeSlot } from "@/tsx-types";
import { getDurationInHours } from "./timeToMinutes";

export const getTotalPrice = (
  selectedTime: TimeSlot | undefined,
  hourlyRate: number
): number | string => {
  return selectedTime && selectedTime.start && selectedTime.end
    ? getDurationInHours(selectedTime.start, selectedTime.end) * hourlyRate
    : "nill";
};
