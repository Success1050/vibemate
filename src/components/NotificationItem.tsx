import {
  Bell,
  Clock,
  MessageCircle,
  Star,
  Wallet as WalletIcon,
} from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Notification } from "../../tsx-types";

function getIcon(type: Notification["type"]) {
  switch (type) {
    case "booking":
      return <Clock size={20} color="#3b82f6" />;
    case "payment":
      return <WalletIcon size={20} color="#16a34a" />;
    case "message":
      return <MessageCircle size={20} color="#9333ea" />;
    case "review":
      return <Star size={20} color="#f59e0b" />;
    default:
      return <Bell size={20} color="#6b7280" />;
  }
}

export default function NotificationItem({ item }: { item: Notification }) {
  return (
    <View style={[styles.container, item.read ? styles.read : styles.unread]}>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.iconContainer}>{getIcon(item.type)}</View>
          )}
        </View>
        <View style={styles.textContainer}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>
        </View>
        {!item.read && <View style={styles.unreadIndicator} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  read: {
    backgroundColor: "white",
    borderColor: "#e5e7eb",
  },
  unread: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatarContainer: {
    marginRight: 12,
    marginTop: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 4,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    backgroundColor: "#3b82f6",
    borderRadius: 4,
  },
});
