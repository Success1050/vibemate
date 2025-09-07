import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
// import Header from "../components/Header";
import { chats as chatList, chatMessages } from "@/mockData";
import ChatList from "@/src/components/Chats/ChatList";
import ChatWindow from "@/src/components/Chats/ChatWindow";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

export default function ChatsScreen() {
  const [selectedChat, setSelectedChat] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState(chatMessages);

  const current = chatList.find((c) => c.id === selectedChat);

  const handleSend = (text: string) => {
    if (!selectedChat) return;
    const newMsg = {
      id: Date.now().toString(),
      senderId: "me",
      text,
      timestamp: new Date().toLocaleTimeString(),
      type: "text" as const,
    };
    setMessages((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg],
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.chatContainer}>
          {/* Responsive layout */}
          <View style={styles.chatContent}>
            {/* List */}
            <View
              style={[
                styles.chatListContainer,
                selectedChat && !isTablet ? styles.hidden : styles.visible,
                isTablet && styles.tabletChatList,
              ]}
            >
              <ChatList
                chats={chatList}
                selectedChat={selectedChat}
                onSelect={setSelectedChat}
              />
            </View>
            {/* Window */}
            <View
              style={[
                styles.chatWindowContainer,
                selectedChat || isTablet ? styles.visible : styles.hidden,
                isTablet && styles.tabletChatWindow,
              ]}
            >
              {selectedChat ? (
                <ChatWindow
                  chat={current}
                  messages={messages[selectedChat] || []}
                  onBack={() => setSelectedChat(null)}
                  onSend={handleSend}
                />
              ) : (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.emptyStateTitle}>
                    Select a conversation
                  </Text>
                  <Text style={styles.emptyStateSubtitle}>
                    Choose from your existing conversations or start a new one
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  chatContent: {
    flex: 1,
    flexDirection: isTablet ? "row" : "column",
  },
  chatListContainer: {
    borderRightWidth: isTablet ? 1 : 0,
    borderRightColor: "#e5e7eb",
  },
  tabletChatList: {
    width: 320,
  },
  chatWindowContainer: {
    flex: 1,
  },
  tabletChatWindow: {
    flex: 1,
  },
  hidden: {
    display: "none",
  },
  visible: {
    flex: 1,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyStateTitle: {
    color: "#6b7280",
    fontSize: 18,
    fontWeight: "500",
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },
});
