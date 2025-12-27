import { styles } from "@/styles/OSBookingmanage";
import { Ospricesettings } from "@/tsx-types";
import { Text, TextInput, View } from "react-native";
import Button from "./Button";

export const renderPricingTab = (
  pricing: Ospricesettings,
  updatePricing: (value: number) => void,
  savePricing: () => void,
  newLoading: boolean
) => (
  <View style={styles.tabContent}>
    <Text style={styles.sectionTitle}>Pricing Settings</Text>
    <Text style={styles.sectionSubtitle}>
      Set your rates and booking requirements
    </Text>

    <View style={styles.pricingCard}>
      <Text style={styles.cardTitle}>Per Night</Text>

      <View style={styles.priceInputContainer}>
        <Text style={styles.currencySymbol}>₦</Text>
        <TextInput
          style={styles.priceInput}
          value={pricing?.pricePerNight?.toString() || ""}
          onChangeText={(text) => updatePricing(Number(text) || 0)}
          keyboardType="numeric"
          placeholder="150"
        />
        <Text style={styles.priceUnit}>/night</Text>
      </View>

      <Text style={styles.priceDescription}>
        This is what clients will pay per Night for your services
      </Text>
    </View>

    <View style={styles.previewCard}>
      <Text style={styles.cardTitle}>Price Preview</Text>
      <View style={styles.previewRow}>
        <Text style={styles.previewLabel}>2 hours booking:</Text>
        <Text style={styles.previewValue}>₦{pricing.pricePerNight}</Text>
      </View>
      <View style={styles.previewBreakdown}>
        <Text style={styles.breakdownText}>₦{pricing.pricePerNight}</Text>
      </View>
    </View>

    <Button
      onpress={savePricing}
      buttonStyle={{ padding: 5 }}
      title={`${newLoading ? "Saving..." : "Save settings"}`}
    />
  </View>
);
