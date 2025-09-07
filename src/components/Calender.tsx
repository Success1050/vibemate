// 👇 changes are commented with // ✅

import { CalendarPickerProps } from "@/tsx-types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

const availableHoursByDate: {
  [key: string]: { start: string; end: string }[];
} = {
  "2025-09-10": [
    { start: "14:00", end: "18:00" },
    { start: "20:00", end: "00:00" },
  ],
  "2025-09-12": [
    { start: "10:00", end: "14:00" },
    { start: "18:00", end: "22:00" },
  ],
  "2025-09-14": [
    { start: "09:00", end: "13:00" },
    { start: "16:00", end: "20:00" },
  ],
};

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  visible,
  onClose,
  onDateTimeSelect,
  selectedDate,
  selectedTime,
}) => {
  const [currentSelectedDate, setCurrentSelectedDate] = useState<string>(
    selectedDate || ""
  );
  const [currentSelectedTime, setCurrentSelectedTime] = useState<{
    start: string;
    end: string;
  } | null>(null);

  const [showHours, setShowHours] = useState<boolean>(false);

  const today = new Date().toISOString().split("T")[0];

  // ✅ Create marked dates so only available ones are clickable
  const markedDates = Object.keys(availableHoursByDate).reduce((acc, date) => {
    acc[date] = {
      selected: date === currentSelectedDate,
      selectedColor: date === currentSelectedDate ? "#572083" : undefined,
      marked: true,
      dotColor: "#572083",
    };
    return acc;
  }, {} as any);

  const onDayPress = (day: any) => {
    const dateString = day.dateString;
    if (availableHoursByDate[dateString]) {
      setCurrentSelectedDate(dateString);
      setCurrentSelectedTime(null);
      setShowHours(true);
    } else {
      // ✅ User taps unavailable date
      Alert.alert("Not Available", "This date has no available time slots.");
    }
  };

  const onTimePress = (slot: { start: string; end: string }) => {
    setCurrentSelectedTime(slot);
  };

  const handleConfirm = () => {
    if (currentSelectedDate && currentSelectedTime) {
      onDateTimeSelect(currentSelectedDate, {
        start: currentSelectedTime.start,
        end: currentSelectedTime.end,
      });
      onClose();
    } else {
      Alert.alert("Selection Required", "Please select both date and time.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const availableHours = currentSelectedDate
    ? availableHoursByDate[currentSelectedDate] || []
    : [];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Date & Time</Text>
          <TouchableOpacity onPress={handleConfirm} style={styles.doneButton}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Calendar */}
          <View style={styles.calendarContainer}>
            <Text style={styles.sectionTitle}>Choose a date</Text>
            <Calendar
              current={today}
              minDate={today}
              onDayPress={onDayPress}
              markedDates={markedDates}
              // ✅ Disabled days will not be clickable
              disableAllTouchEventsForDisabledDays={true}
              theme={{
                backgroundColor: "#ffffff",
                calendarBackground: "#ffffff",
                textSectionTitleColor: "#b6c1cd",
                selectedDayBackgroundColor: "#572083",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#572083",
                dayTextColor: "#2d4150",
                textDisabledColor: "#d9e1e8",
                dotColor: "#572083",
                selectedDotColor: "#ffffff",
                arrowColor: "#572083",
                disabledArrowColor: "#d9e1e8",
                monthTextColor: "#2d4150",
                indicatorColor: "#572083",
                textDayFontWeight: "500",
                textMonthFontWeight: "600",
                textDayHeaderFontWeight: "600",
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
            />
          </View>

          {/* Selected Date Display */}
          {currentSelectedDate && (
            <View style={styles.selectedDateContainer}>
              <Text style={styles.selectedDateText}>
                {formatDate(currentSelectedDate)}
              </Text>
            </View>
          )}

          {/* Time Slots */}
          {showHours && availableHours.length > 0 && (
            <View style={styles.timeContainer}>
              <Text style={styles.sectionTitle}>Available times</Text>
              <View style={styles.timeGrid}>
                {availableHours.map((slot, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.timeButton,
                      currentSelectedTime?.start === slot.start &&
                        currentSelectedTime?.end === slot.end &&
                        styles.selectedTimeButton,
                    ]}
                    onPress={() => onTimePress(slot)}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        currentSelectedTime?.start === slot.start &&
                          currentSelectedTime?.end === slot.end &&
                          styles.selectedTimeText,
                      ]}
                    >
                      {slot.start} - {slot.end}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Selection Summary */}
          {currentSelectedDate && currentSelectedTime && (
            <View style={styles.summaryContainer}>
              <View style={styles.summaryCard}>
                <Ionicons name="calendar-outline" size={24} color="#572083" />
                <View style={styles.summaryText}>
                  <Text style={styles.summaryLabel}>Selected Date & Time</Text>
                  <Text style={styles.summaryValue}>
                    {formatDate(currentSelectedDate)}{" "}
                    {`from ${currentSelectedTime.start} to ${currentSelectedTime.end}`}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

// ✅ kept your styles the same
const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  doneButton: { paddingHorizontal: 16, paddingVertical: 8 },
  doneText: { fontSize: 16, fontWeight: "600", color: "#572083" },
  content: { flex: 1 },
  calendarContainer: { padding: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  selectedDateContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#572083",
    textAlign: "center",
  },
  timeContainer: { padding: 20 },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  timeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
    minWidth: 120, // ✅ wider for start-end times
    alignItems: "center",
  },
  selectedTimeButton: { backgroundColor: "#572083", borderColor: "#572083" },
  timeText: { fontSize: 16, fontWeight: "500", color: "#333" },
  selectedTimeText: { color: "#fff" },
  summaryContainer: { padding: 20, paddingTop: 0 },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f4ff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e8ff",
  },
  summaryText: { marginLeft: 12, flex: 1 },
  summaryLabel: { fontSize: 14, color: "#666", marginBottom: 4 },
  summaryValue: { fontSize: 16, fontWeight: "600", color: "#333" },
});

export default CalendarPicker;
