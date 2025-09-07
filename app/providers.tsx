import { renderGridItem } from "@/hooks/renderGridItem";
import { providers } from "@/mockData";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const Providers = () => {
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <FlatList
          data={providers}
          renderItem={renderGridItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.headerTitle}>All providers</Text>
          }
        />
      </View>
    </ScreenWrapper>
  );
};

export default Providers;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F5F9", padding: 12 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#0F172A",
  },
});
