import React, { useContext, useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import Video from "react-native-video";
import axios from "axios";
import { UserType } from "../UserContext";

const API_URL = "http://10.0.2.2:3000";

const GroupChat = ({ navigation }) => {
  const route = useRoute();
  const { groupId } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [groupName, setGroupName] = useState("Group Chat");
  const [admin, setAdmin] = useState(null);
  const [members, setMembers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { userId } = useContext(UserType);

  useEffect(() => {
    if (groupId) {
      fetchGroupDetails();
      const interval = setInterval(fetchMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [groupId]);

  useEffect(() => {
    console.log("User ID:", userId); // Debugging
  }, [userId]);

  const fetchGroupDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/groups/${groupId}`);
      setGroupName(res.data.name);
      setAdmin(res.data.admin);
      setMembers(res.data.members);
      console.log("Group details ", res.data);
    } catch (error) {
      console.error("Error fetching group details", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_URL}/groups/${groupId}/messages`);
      console.log("Fetched messages:", res.data);
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim()) return;
    try {
      await axios.post(`${API_URL}/send-message`, {
        senderId: userId,
        groupId,
        message: messageText,
        messageType: "text",
      });

      setMessageText(""); // Clear input field
      fetchMessages(); // Refresh messages
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return isNaN(date.getTime())
      ? ""
      : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>{groupName}</Text>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Text style={styles.infoButton}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const isMyMessage = item.senderId._id === userId;
          return (
            <View
              style={[
                styles.messageContainer,
                isMyMessage
                  ? styles.myMessageContainer
                  : styles.otherMessageContainer,
              ]}
            >
              {!isMyMessage && (
                <Image
                  source={{
                    uri:
                      item.senderId.profilePicture ||
                      "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                  }}
                  style={styles.avatar}
                />
              )}
              <View
                style={[
                  styles.messageBox,
                  isMyMessage ? styles.myMessage : styles.otherMessage,
                ]}
              >
                <Text style={styles.sender}>{item.senderId.name}</Text>
                {item.messageType === "video" ? (
                  <Video
                    source={{ uri: item.message }}
                    style={styles.video}
                    resizeMode="contain"
                    controls
                  />
                ) : (
                  <Text style={styles.text}>{item.message}</Text>
                )}
                <Text style={styles.timestamp}>
                  {formatTime(item.createdAt)}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Message Input */}
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

      {/* Group Info Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Group Members</Text>

            <Text style={styles.adminTitle}>Admin</Text>
            {admin && (
              <View style={styles.memberRow}>
                <Image
                  source={{
                    uri:
                      admin.profilePicture ||
                      "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                  }}
                  style={styles.avatarSmall}
                />
                <Text style={styles.memberName}>{admin.name}</Text>
              </View>
            )}

            <Text style={styles.membersTitle}>👥 Members</Text>
            {members.map((member) => (
              <View key={member._id} style={styles.memberRow}>
                <Image
                  source={{
                    uri:
                      member.profilePicture ||
                      "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                  }}
                  style={styles.avatarSmall}
                />
                <Text style={styles.memberName}>{member.name}</Text>
              </View>
            ))}

            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default GroupChat;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ECE5DD" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#075E54",
    justifyContent: "space-between",
  },
  backButton: { color: "#FFF", fontSize: 18, marginRight: 10 },
  headerText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  adminTitle: { fontSize: 16, fontWeight: "bold", color: "red" },
  membersTitle: { fontSize: 16, fontWeight: "bold", marginTop: 10 },

  memberRow: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  avatarSmall: { width: 30, height: 30, borderRadius: 15, marginRight: 10 },
  memberName: { fontSize: 16 },

  closeButton: { color: "blue", marginTop: 15, textAlign: "center" },

  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 10,
  },

  myMessageContainer: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
    flexDirection: "row",
  },

  messageBox: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 10,
  },
  myMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end", // Align to right
    marginRight: 10,
  },
  otherMessage: {
    backgroundColor: "#FFF",
    alignSelf: "flex-start", // Align to left
    marginLeft: 10,
  },

  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  sender: { fontSize: 14, fontWeight: "bold" },
  text: { fontSize: 16 },

  timestamp: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  video: { width: 200, height: 150, borderRadius: 10, marginTop: 5 },

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
    backgroundColor: "#075E54",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  sendText: { color: "#FFF", fontWeight: "bold" },
});
