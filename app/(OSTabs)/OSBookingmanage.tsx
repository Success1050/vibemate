// BookingManagement.tsx
import { renderPricingTab } from "@/src/components/pricing";
import {
  getdateTimeSlots,
  removedateslot,
  removeTimeSlotFromDb,
  setPricingDb,
  upsertAvailability,
} from "@/src/osActions/action";
import { useApp } from "@/store";
import { styles } from "@/styles/OSBookingmanage";
import { DateTimeSlot, Ospricesettings, TimeSlot } from "@/tsx-types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
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
  const [dateTimeSlots, setDateTimeSlots] = useState<DateTimeSlot[]>([]);

  useEffect(() => {
    const fetchDateTime = async () => {
      const res = await getdateTimeSlots(userSession, role);
      if (res && res.success) {
        const today = new Date().toISOString().split("T")[0];

        // Filter out past dates and map with IDs
        const withIds = (res.data ?? [])
          .filter((dateSlot: any) => dateSlot.date >= today)
          .map((dateSlot: any) => ({
            date: dateSlot.date,
            timeSlots: (dateSlot.timeSlots || []).map(
              (slot: any, idx: number) => ({
                id: idx,
                start: slot.start,
                end: slot.end,
                isAvailable: slot.isAvailable ?? true,
              })
            ),
          }));
        setDateTimeSlots(withIds);
      } else console.log(res.error);
    };
    fetchDateTime();
  }, []);

  const [pricing, setPricing] = useState<Ospricesettings>({
    pricePerNight: 0,
  });

  const [instantBooking, setInstantBooking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [advanceBookingDays, setAdvanceBookingDays] = useState(30);
  const [newLoading, setNewLoading] = useState<boolean>(false);

  const { userSession, role } = useApp();

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
      id:
        existingDateIndex !== -1
          ? dateTimeSlots[existingDateIndex].timeSlots.length
          : 0,
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

  const removeTimeSlot = async (dateIndex: number, slotIndex: number) => {
    const selectedDateSlot = dateTimeSlots[dateIndex];
    const selectedSlot = selectedDateSlot.timeSlots[slotIndex];

    // Remove from UI immediately
    const updatedSlots = [...dateTimeSlots];
    updatedSlots[dateIndex].timeSlots.splice(slotIndex, 1);
    if (updatedSlots[dateIndex].timeSlots.length === 0) {
      updatedSlots.splice(dateIndex, 1);
    }
    setDateTimeSlots(updatedSlots);

    // Then remove from database
    const res = await removeTimeSlotFromDb(
      userSession,
      role,
      selectedDateSlot.date,
      selectedSlot.start,
      selectedSlot.end
    );

    if (!res.success) console.log("Remove error:", res.error);
  };

  const removeDateSlot = async (dateIndex: number) => {
    const updatedSlots = [...dateTimeSlots];
    updatedSlots.splice(dateIndex, 1);
    setDateTimeSlots(updatedSlots);

    const res = await removedateslot(
      userSession,
      role,
      dateTimeSlots[dateIndex]
    );

    if (res && res.success) {
      Alert.alert("sucess", "deleted successfully");
    }
  };

  const updatePricing = (value: number) => {
    setPricing({ pricePerNight: value });
  };

  const savePricing = async () => {
    try {
      setNewLoading(true);

      const res = await setPricingDb(userSession, role, pricing.pricePerNight);
      if (res && res.success) {
        Alert.alert("successful", "price updated successfully");
        updatePricing(res.data.price_per_night);
      } else {
        Alert.alert("error", "not saved");
      }
    } catch (error) {
    } finally {
      setNewLoading(false);
    }
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

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log("Starting save with dateTimeSlots:", dateTimeSlots);
      console.log("UserSession:", userSession?.user?.id);
      console.log("Role:", role);

      const res = await upsertAvailability(dateTimeSlots, userSession, role);

      console.log("Save response:", res);

      if (!res.success) {
        console.error("Save failed:", res.error);
        Alert.alert("Error", res.error || "Failed to save availability");
      } else {
        Alert.alert("Success", "Availability updated successfully");
      }
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "An unexpected error occurred while saving");
    } finally {
      setLoading(false);
    }
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
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Booking Management</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => handleSave()}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Saving..." : "Save"}
          </Text>
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
          : renderPricingTab(pricing, updatePricing, savePricing, newLoading)}
      </ScrollView>

      {/* Date Time Selection Modal */}
      <Modal
        visible={showDateTimeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDateTimeModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
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

            <ScrollView
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
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
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default BookingManagement;
