// BookingManagement.tsx
import { styles } from "@/styles/OSBookingmanage";
import { DateTimeSlot, PricingSettings, TimeSlot } from "@/tsx-types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

const BookingManagement = () => {
  const [activeTab, setActiveTab] = useState("availability");
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [showTimeInputs, setShowTimeInputs] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState({ start: "", end: "" });

  // Store availability by specific dates instead of just days
  const [dateTimeSlots, setDateTimeSlots] = useState<DateTimeSlot[]>([
    {
      date: "2025-09-10",
      timeSlots: [{ start: "14:00", end: "18:00", isAvailable: true }],
    },
    {
      date: "2025-09-12",
      timeSlots: [{ start: "10:00", end: "14:00", isAvailable: true }],
    },
  ]);

  const [pricing, setPricing] = useState<PricingSettings>({
    pricePerHour: 150,
    serviceFee: 25,
    minimumBookingHours: 1,
    maximumBookingHours: 8,
  });

  const [instantBooking, setInstantBooking] = useState(false);
  const [advanceBookingDays, setAdvanceBookingDays] = useState(30);

  const today = new Date().toISOString().split("T")[0];

  // Create marked dates for calendar
  const markedDates = dateTimeSlots.reduce((acc, dateSlot) => {
    acc[dateSlot.date] = {
      marked: true,
      dotColor: "#007AFF",
      selected: dateSlot.date === selectedDate,
      selectedColor: dateSlot.date === selectedDate ? "#007AFF" : undefined,
    };
    return acc;
  }, {} as any);

  const addDateTimeSlot = () => {
    setShowDateTimeModal(true);
  };

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    setShowTimeInputs(true);
  };

  const formatTime = (time: string) => {
    // Convert 24-hour format to 12-hour format for display
    if (time.includes(":")) {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    }
    return time;
  };

  const parseTime = (timeString: string) => {
    // Convert 12-hour format input to 24-hour format
    const time = timeString.trim().toUpperCase();
    if (time.includes("AM") || time.includes("PM")) {
      const [timePart, period] = time.split(/\s+(AM|PM)/);
      const [hours, minutes = "00"] = timePart.split(":");
      let hour = parseInt(hours);

      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;

      return `${hour.toString().padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    }
    return timeString; // Return as-is if already in 24-hour format
  };

  const saveTimeSlot = () => {
    if (!newTimeSlot.start || !newTimeSlot.end || !selectedDate) {
      Alert.alert(
        "Error",
        "Please select a date and enter both start and end times"
      );
      return;
    }

    const startTime24 = parseTime(newTimeSlot.start);
    const endTime24 = parseTime(newTimeSlot.end);

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime24) || !timeRegex.test(endTime24)) {
      Alert.alert(
        "Error",
        "Please enter valid times (e.g., '9:00 AM' or '14:00')"
      );
      return;
    }

    // Check if start time is before end time
    if (startTime24 >= endTime24) {
      Alert.alert("Error", "End time must be after start time");
      return;
    }

    const existingDateIndex = dateTimeSlots.findIndex(
      (slot) => slot.date === selectedDate
    );

    const newSlot: TimeSlot = {
      start: startTime24,
      end: endTime24,
      isAvailable: true,
    };

    if (existingDateIndex !== -1) {
      // Add to existing date
      const updatedSlots = [...dateTimeSlots];
      updatedSlots[existingDateIndex].timeSlots.push(newSlot);
      setDateTimeSlots(updatedSlots);
    } else {
      // Create new date entry
      const newDateSlot: DateTimeSlot = {
        date: selectedDate,
        timeSlots: [newSlot],
      };
      setDateTimeSlots([...dateTimeSlots, newDateSlot]);
    }

    setNewTimeSlot({ start: "", end: "" });
    setShowTimeInputs(false);
    setSelectedDate("");
    setShowDateTimeModal(false);
  };

  const removeTimeSlot = (dateIndex: number, slotIndex: number) => {
    const updatedSlots = [...dateTimeSlots];
    updatedSlots[dateIndex].timeSlots.splice(slotIndex, 1);

    // Remove the entire date if no time slots remain
    if (updatedSlots[dateIndex].timeSlots.length === 0) {
      updatedSlots.splice(dateIndex, 1);
    }

    setDateTimeSlots(updatedSlots);
  };

  const removeDateSlot = (dateIndex: number) => {
    const updatedSlots = [...dateTimeSlots];
    updatedSlots.splice(dateIndex, 1);
    setDateTimeSlots(updatedSlots);
  };

  const updatePricing = (field: keyof PricingSettings, value: number) => {
    setPricing((prev) => ({ ...prev, [field]: value }));
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderAvailabilityTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Date & Time Availability</Text>
      <Text style={styles.sectionSubtitle}>
        Set specific dates and times when you're available
      </Text>

      {/* Add New Date/Time Button */}
      <TouchableOpacity style={styles.addDateButton} onPress={addDateTimeSlot}>
        <Ionicons name="calendar-outline" size={24} color="#007AFF" />
        <Text style={styles.addDateText}>Add Available Date & Time</Text>
        <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
      </TouchableOpacity>

      {/* Existing Date Time Slots */}
      {dateTimeSlots.map((dateSlot, dateIndex) => (
        <View key={dateSlot.date} style={styles.dateCard}>
          <View style={styles.dateHeader}>
            <View style={styles.dateInfo}>
              <Ionicons name="calendar" size={20} color="#007AFF" />
              <Text style={styles.dateName}>
                {formatDisplayDate(dateSlot.date)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => removeDateSlot(dateIndex)}
              style={styles.removeDateButton}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>

          <View style={styles.timeSlotsContainer}>
            {dateSlot.timeSlots.map((slot: any, slotIndex: any) => (
              <View key={slotIndex} style={styles.timeSlot}>
                <View style={styles.timeSlotInfo}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.timeSlotText}>
                    {formatTime(slot.start)} - {formatTime(slot.end)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeTimeSlot(dateIndex, slotIndex)}
                  style={styles.removeButton}
                >
                  <Ionicons name="close-circle" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.settingsCard}>
        <Text style={styles.settingsTitle}>Booking Settings</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Instant Booking</Text>
            <Text style={styles.settingDescription}>
              Allow clients to book without your approval
            </Text>
          </View>
          <Switch
            value={instantBooking}
            onValueChange={setInstantBooking}
            trackColor={{ false: "#E5E5EA", true: "#34C759" }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Advance Booking</Text>
          <Text style={styles.settingDescription}>
            How many days in advance can clients book?
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.numberInput}
              value={advanceBookingDays.toString()}
              onChangeText={(text) => setAdvanceBookingDays(Number(text) || 0)}
              keyboardType="numeric"
              placeholder="30"
            />
            <Text style={styles.inputUnit}>days</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderPricingTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Pricing Settings</Text>
      <Text style={styles.sectionSubtitle}>
        Set your rates and booking requirements
      </Text>

      <View style={styles.pricingCard}>
        <Text style={styles.cardTitle}>Hourly Rate</Text>

        <View style={styles.priceInputContainer}>
          <Text style={styles.currencySymbol}>₦</Text>
          <TextInput
            style={styles.priceInput}
            value={pricing.pricePerHour.toString()}
            onChangeText={(text) =>
              updatePricing("pricePerHour", Number(text) || 0)
            }
            keyboardType="numeric"
            placeholder="150"
          />
          <Text style={styles.priceUnit}>/hour</Text>
        </View>

        <Text style={styles.priceDescription}>
          This is what clients will pay per hour for your services
        </Text>
      </View>

      <View style={styles.pricingCard}>
        <Text style={styles.cardTitle}>Service Fee</Text>

        <View style={styles.priceInputContainer}>
          <Text style={styles.currencySymbol}>₦</Text>
          <TextInput
            style={styles.priceInput}
            value={pricing.serviceFee.toString()}
            onChangeText={(text) =>
              updatePricing("serviceFee", Number(text) || 0)
            }
            keyboardType="numeric"
            placeholder="25"
          />
        </View>

        <Text style={styles.priceDescription}>
          Additional fee added to each booking
        </Text>
      </View>

      <View style={styles.pricingCard}>
        <Text style={styles.cardTitle}>Booking Duration</Text>

        <View style={styles.durationContainer}>
          <View style={styles.durationItem}>
            <Text style={styles.durationLabel}>Minimum</Text>
            <View style={styles.durationInputContainer}>
              <TextInput
                style={styles.durationInput}
                value={pricing.minimumBookingHours.toString()}
                onChangeText={(text) =>
                  updatePricing("minimumBookingHours", Number(text) || 1)
                }
                keyboardType="numeric"
                placeholder="1"
              />
              <Text style={styles.durationUnit}>hrs</Text>
            </View>
          </View>

          <View style={styles.durationItem}>
            <Text style={styles.durationLabel}>Maximum</Text>
            <View style={styles.durationInputContainer}>
              <TextInput
                style={styles.durationInput}
                value={pricing.maximumBookingHours.toString()}
                onChangeText={(text) =>
                  updatePricing("maximumBookingHours", Number(text) || 8)
                }
                keyboardType="numeric"
                placeholder="8"
              />
              <Text style={styles.durationUnit}>hrs</Text>
            </View>
          </View>
        </View>

        <Text style={styles.priceDescription}>
          Set minimum and maximum booking duration
        </Text>
      </View>

      <View style={styles.previewCard}>
        <Text style={styles.cardTitle}>Price Preview</Text>
        <View style={styles.previewRow}>
          <Text style={styles.previewLabel}>2 hours booking:</Text>
          <Text style={styles.previewValue}>
            ₦{pricing.pricePerHour * 2 + pricing.serviceFee}
          </Text>
        </View>
        <View style={styles.previewBreakdown}>
          <Text style={styles.breakdownText}>
            ₦{pricing.pricePerHour} × 2hrs + ₦{pricing.serviceFee} service fee
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Booking Management</Text>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "availability" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("availability")}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={activeTab === "availability" ? "#007AFF" : "#8E8E93"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "availability" && styles.activeTabText,
            ]}
          >
            Availability
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "pricing" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("pricing")}
        >
          <Ionicons
            name="pricetag-outline"
            size={20}
            color={activeTab === "pricing" ? "#007AFF" : "#8E8E93"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "pricing" && styles.activeTabText,
            ]}
          >
            Pricing
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "availability"
          ? renderAvailabilityTab()
          : renderPricingTab()}
      </ScrollView>

      {/* Date Time Selection Modal */}
      <Modal
        visible={showDateTimeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDateTimeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Available Date & Time</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowDateTimeModal(false);
                  setSelectedDate("");
                  setShowTimeInputs(false);
                  setNewTimeSlot({ start: "", end: "" });
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              {/* Calendar */}
              <View style={styles.calendarContainer}>
                <Text style={styles.calendarTitle}>Select Date</Text>
                <Calendar
                  current={today}
                  minDate={today}
                  onDayPress={onDayPress}
                  markedDates={{
                    ...markedDates,
                    [selectedDate]: {
                      ...markedDates[selectedDate],
                      selected: true,
                      selectedColor: "#007AFF",
                    },
                  }}
                  theme={{
                    backgroundColor: "#ffffff",
                    calendarBackground: "#ffffff",
                    textSectionTitleColor: "#b6c1cd",
                    selectedDayBackgroundColor: "#007AFF",
                    selectedDayTextColor: "#ffffff",
                    todayTextColor: "#007AFF",
                    dayTextColor: "#2d4150",
                    textDisabledColor: "#d9e1e8",
                    dotColor: "#007AFF",
                    selectedDotColor: "#ffffff",
                    arrowColor: "#007AFF",
                    monthTextColor: "#2d4150",
                    textDayFontWeight: "500",
                    textMonthFontWeight: "600",
                    textDayHeaderFontWeight: "600",
                  }}
                />
              </View>

              {/* Time Inputs */}
              {showTimeInputs && (
                <View style={styles.timeInputContainer}>
                  <Text style={styles.timeInputTitle}>
                    Set Time for {formatDisplayDate(selectedDate)}
                  </Text>

                  <View style={styles.timeInputRow}>
                    <View style={styles.timeInputGroup}>
                      <Text style={styles.timeInputLabel}>Start Time</Text>
                      <TextInput
                        style={styles.timeInput}
                        value={newTimeSlot.start}
                        onChangeText={(text) =>
                          setNewTimeSlot((prev) => ({ ...prev, start: text }))
                        }
                        placeholder="9:00 AM"
                        placeholderTextColor="#999"
                      />
                      <Text style={styles.timeInputHint}>
                        e.g., 9:00 AM or 14:00
                      </Text>
                    </View>

                    <View style={styles.timeInputGroup}>
                      <Text style={styles.timeInputLabel}>End Time</Text>
                      <TextInput
                        style={styles.timeInput}
                        value={newTimeSlot.end}
                        onChangeText={(text) =>
                          setNewTimeSlot((prev) => ({ ...prev, end: text }))
                        }
                        placeholder="6:00 PM"
                        placeholderTextColor="#999"
                      />
                      <Text style={styles.timeInputHint}>
                        e.g., 6:00 PM or 18:00
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={() => {
                        setShowDateTimeModal(false);
                        setSelectedDate("");
                        setShowTimeInputs(false);
                        setNewTimeSlot({ start: "", end: "" });
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.confirmButton]}
                      onPress={saveTimeSlot}
                    >
                      <Text style={styles.confirmButtonText}>Add Slot</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BookingManagement;
