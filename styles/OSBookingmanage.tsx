import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1D1D1F",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  tabNavigation: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: "#007AFF15",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#8E8E93",
    marginLeft: 8,
  },
  activeTabText: {
    color: "#007AFF",
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1D1D1F",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 24,
    lineHeight: 22,
  },
  addDateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderStyle: "dashed",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addDateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginHorizontal: 12,
  },
  dateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dateInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    marginLeft: 8,
  },
  removeDateButton: {
    padding: 4,
  },
  timeSlotsContainer: {
    marginTop: 12,
  },
  timeSlot: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  timeSlotInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeSlotText: {
    fontSize: 14,
    color: "#1D1D1F",
    marginLeft: 8,
  },
  removeButton: {
    padding: 4,
  },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 16,
  },
  settingItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  settingInfo: {
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1D1D1F",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  numberInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  inputUnit: {
    fontSize: 16,
    color: "#8E8E93",
    marginLeft: 12,
  },
  pricingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 16,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1D1D1F",
  },
  priceInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    color: "#1D1D1F",
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  priceUnit: {
    fontSize: 16,
    color: "#8E8E93",
  },
  priceDescription: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 20,
  },
  durationContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  durationItem: {
    flex: 1,
  },
  durationLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1D1D1F",
    marginBottom: 8,
  },
  durationInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
  },
  durationInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  durationUnit: {
    fontSize: 14,
    color: "#8E8E93",
  },
  previewCard: {
    backgroundColor: "#F2F2F7",
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 16,
    color: "#1D1D1F",
  },
  previewValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34C759",
  },
  previewBreakdown: {
    marginTop: 4,
  },
  // Add these styles to the existing StyleSheet.create() object:

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    minHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  closeButton: {
    padding: 4,
  },
  modalScrollView: {
    flex: 1,
  },

  // Calendar Styles
  calendarContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 12,
  },

  // Time Input Styles
  timeInputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    marginTop: 16,
  },
  timeInputTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 16,
    textAlign: "center",
  },
  timeInputRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  timeInputGroup: {
    flex: 1,
  },
  timeInputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1D1D1F",
    marginBottom: 8,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    textAlign: "center",
  },
  timeInputHint: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 4,
  },

  // Modal Button Styles
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#F2F2F7",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8E8E93",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // Additional Missing Styles
  breakdownText: {
    fontSize: 14,
    color: "#8E8E93",
    fontStyle: "italic",
  },
});
