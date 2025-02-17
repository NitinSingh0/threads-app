import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import axios from "axios";

const API_URL = "http://10.0.2.2:3000";

const GroupChat = ({ groupId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [lastMessageId, setLastMessageId] = useState(null);

  // Fetch messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [groupId, lastMessageId]);

  // Fetch Group Messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_URL}${groupId}/messages`);
      setMessages(res.data);
      if (res.data.length > 0)
        setLastMessageId(res.data[res.data.length - 1]._id);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  // Send Message
  const sendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const res = await axios.post(`${API_URL}/send-message`, {
        senderId: userId,
        groupId,
        message: messageText,
        messageType: "text",
      });

      setMessages([...messages, res.data.data]);
      setMessageText(""); // Clear input
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.senderId._id === userId
                ? styles.myMessage
                : styles.otherMessage,
            ]}
          >
            <Image
              source={{ uri: item.senderId.profilePicture }}
              style={styles.avatar}
            />
            <Text style={styles.text}>{item.message}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GroupChat;

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },
  message: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  myMessage: { backgroundColor: "#DCF8C6", alignSelf: "flex-end" },
  otherMessage: { backgroundColor: "#FFF", alignSelf: "flex-start" },
  avatar: { width: 30, height: 30, borderRadius: 15, marginRight: 10 },
  text: { fontSize: 16 },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 10,
    borderRadius: 5,
  },
  sendButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  sendText: { color: "#FFF", fontWeight: "bold" },
});
