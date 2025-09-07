import { notifications as data } from "@/mockData";
import NotificationItem from "@/src/components/NotificationItem";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NotificationsScreen() {
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        {/* <Header /> */}
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>Notifications</Text>
            <TouchableOpacity>
              <Text style={styles.markAllText}>Mark all as read</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={data}
            keyExtractor={(i) => i.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => <NotificationItem item={item} />}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flex: 1,
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  markAllText: {
    color: "#2563eb",
    fontWeight: "500",
    fontSize: 16,
  },
  separator: {
    height: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
});
