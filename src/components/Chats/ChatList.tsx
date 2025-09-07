import { Chat } from "@/tsx-types";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Badge from "../Badge";

export default function ChatList({
  chats,
  selectedChat,
  onSelect,
}: {
  chats: Chat[];
  selectedChat: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <FlatList
      data={chats}
      keyExtractor={(i) => i.id}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onSelect(item.id)}
          style={[
            styles.chatItem,
            selectedChat === item.id ? styles.selectedChat : styles.normalChat,
          ]}
        >
          <View style={styles.chatContent}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                {item.online && <View style={styles.onlineIndicator} />}
              </View>
            </View>
            <View style={styles.textContainer}>
              <View style={styles.header}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
              <View style={styles.messageRow}>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
                <Badge value={item.unread} />
              </View>
            </View>
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  chatItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  selectedChat: {
    backgroundColor: "#eff6ff",
  },
  normalChat: {
    backgroundColor: "white",
  },
  chatContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    backgroundColor: "#10b981",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 6,
  },
  textContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontWeight: "500",
    color: "#111827",
    fontSize: 16,
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: "#6b7280",
  },
  messageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: "#4b5563",
    flex: 1,
  },
});
