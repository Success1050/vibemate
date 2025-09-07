// ==========================
import { Send, X } from "lucide-react-native";
import React from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Chat, Message } from "../../../tsx-types";

export default function ChatWindow({
  chat,
  messages,
  onBack,
  onSend,
}: {
  chat: Chat | undefined;
  messages: Message[];
  onBack: () => void;
  onSend: (text: string) => void;
}) {
  const [text, setText] = React.useState("");
  return (
    <View style={styles.container}>
      {/* Header */}
      {chat ? (
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <X size={20} color="#111827" />
            </TouchableOpacity>
            <Image source={{ uri: chat.avatar }} style={styles.headerAvatar} />
            <View style={styles.headerText}>
              <Text style={styles.headerName}>{chat.name}</Text>
              <Text style={styles.headerStatus}>
                {chat.online ? "Online" : "Last seen 2h ago"}
              </Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* Messages */}
      <FlatList
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        data={messages}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageRow,
              item.senderId === "me"
                ? styles.myMessageRow
                : styles.theirMessageRow,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                item.senderId === "me" ? styles.myMessage : styles.theirMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.senderId === "me"
                    ? styles.myMessageText
                    : styles.theirMessageText,
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  item.senderId === "me"
                    ? styles.myMessageTime
                    : styles.theirMessageTime,
                ]}
              >
                {item.timestamp}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.inputContainer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type your message..."
            style={styles.textInput}
            // onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton}>
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
    borderRadius: 4,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    fontWeight: "500",
    color: "#111827",
    fontSize: 16,
  },
  headerStatus: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  messagesList: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 12,
  },
  messagesContent: {
    paddingVertical: 12,
  },
  messageRow: {
    marginBottom: 12,
  },
  myMessageRow: {
    alignItems: "flex-end",
  },
  theirMessageRow: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  myMessage: {
    backgroundColor: "#2563eb",
  },
  theirMessage: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: "white",
  },
  theirMessageText: {
    color: "#111827",
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  myMessageTime: {
    color: "#bfdbfe",
  },
  theirMessageTime: {
    color: "#6b7280",
  },
  inputContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
