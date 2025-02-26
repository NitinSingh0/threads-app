import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Entypo from "@expo/vector-icons/Entypo";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";

const ChatMessagesScreen = () => {
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const { userId } = useContext(UserType);
  const route = useRoute();
  const { recepientId } = route.params;
  const [recepientData, setRecepientData] = useState("");
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState("");
  const [message, setMessage] = useState("");
  const scrollViewRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleContentSizeChange = () => {
    scrollToBottom();
  };

  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://10.0.2.2:3000/messages/${userId}/${recepientId}`
      );
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
      } else {
        console.log("Error showing messages", response.status.message);
      }
    } catch (error) {
      console.log("Error fetching messages ", error);
    }
  };
  

  useEffect(() => {
    fetchMessages(); // Initial fetch

    const interval = setInterval(() => {
      fetchMessages();
    }, 1000); // Fetch messages every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);


  useEffect(() => {
    const fetchRecepientData = async () => {
      try {
        const response = await fetch(
          `http://10.0.2.2:3000/user/recepient/${recepientId}`
        );
        const data = await response.json();
        setRecepientData(data);
        console.log("Recepiengt data : ", recepientData);
      } catch (error) {
        console.log("Error retreving details : ", error);
      }
    };
    fetchRecepientData();
  }, []);

  const handleSend = async (messageType, imageUri) => {
    try {
      const formData = new FormData();
      formData.append("senderId", userId);
      formData.append("recepientId", recepientId);

      // If message type is image or normal text
      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUri,
          name: "image.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text");
        formData.append("messageText", message);
      }

      const response = await fetch("http://10.0.2.2:3000/messages", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("");
        setSelectedImage("");
        fetchMessages(); // Refetch messages to update UI
      } else {
        console.log(
          "Error sending the message:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.log("Error sending the message:", error);
    }
  };

  // console.log("Recepient data ", recepientData);
  console.log("MEssages : ", selectedMessages);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="black"
          />
          {selectedMessages.length > 0 ? (
            <View>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {selectedMessages.length}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignContent: "center" }}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  resizeMode: "cover",
                }}
                source={{ uri: recepientData?.image }}
              />
              <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
                {recepientData?.name}
              </Text>
            </View>
          )}
        </View>
      ),
      headerRight: () =>
        selectedMessages.length > 0 ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="arrow-redo" size={24} color="black" />
            <Ionicons name="arrow-undo" size={24} color="black" />
            <Octicons name="star-fill" size={24} color="black" />
            <MaterialIcons
              onPress={() => deleteMessages(selectedMessages)}
              name="delete"
              size={24}
              color="black"
            />
          </View>
        ) : null,
    });
  }, [recepientData, selectedMessages]);
  const deleteMessages = async (messageIds) => {
    try {
      const response = await fetch("http://10.0.2.2:3000/deleteMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messageIds }),
      });
      if (response.ok) {
        setSelectedMessages((previousMessages) =>
          previousMessages.filter((id) => !messageIds.includes(id))
        );
        fetchMessages();
      } else {
        console.log("Error deleting messages", response.status);
      }
    } catch (error) {
      console.log("Error deleting messages", error);
    }
  };
  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-IN", options);
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log("Result : ", result);
    if (!result.canceled) {
      handleSend("image", result.assets[0].uri);
    }
  };
  const handleSelectMessage = (message) => {
    //check if the message is laready selected
    const isSelected = selectedMessages.includes(message._id);
    if (isSelected) {
      setSelectedMessages((previousMessages) =>
        previousMessages.filter((id) => id !== message._id)
      );
    } else {
      setSelectedMessages((previousMessages) => [
        ...previousMessages,
        message._id,
      ]);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={handleContentSizeChange}
      >
        {messages.map((item, index) => {
          if (item.messageType === "text") {
            const isSelected = selectedMessages.includes(item._id);
            return (
              <Pressable
                onLongPress={() => handleSelectMessage(item)}
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      },
                  isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                ]}
              >
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: isSelected ? "right" : "left",
                  }}
                >
                  {item?.message}
                </Text>
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 9,
                    color: "gray",
                    marginTop: 5,
                  }}
                >
                  {formatTime(item.timeStamp)}
                </Text>
              </Pressable>
            );
          }
          if (item.messageType === "image") {
            const baseUrl = "/F:/Projects/ChitChat/api/files/";

            const imageUrl = item.imageUrl;
            const filename = imageUrl.split("\\").pop();
            const source = { uri: baseUrl + filename };
            //console.log("source", source);
            return (
              <Pressable
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      },
                ]}
              >
                <View>
                  <Image
                    source={{ uri: source?.uri }}
                    style={{ width: 200, height: 200, borderRadius: 7 }}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      textAlign: "right",
                      fontSize: 9,
                      color: "gray",
                      position: "absolute",
                      right: 10,
                      bottom: 7,
                      color: "black",
                      marginTop: 5,
                    }}
                  >
                    {formatTime(item.timeStamp)}
                  </Text>
                </View>
              </Pressable>
            );
          }
        })}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 0 : 25,
        }}
      >
        <Entypo
          onPress={handleEmojiPress}
          style={{ marginRight: 5 }}
          name="emoji-flirt"
          size={24}
          color="gray"
        />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type your message.."
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 8,
          }}
        >
          <Entypo onPress={pickImage} name="camera" size={24} color="gray" />
          <Entypo name="mic" size={24} color="gray" />
        </View>

        <Pressable
          onPress={() => handleSend("text")}
          style={{
            backgroundColor: "#007bff",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </Pressable>
      </View>
      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage((prevMessage) => prevMessage + emoji);
          }}
          columns={8} // Optional, controls the number of emojis per row
          showSearchBar={false} // Optional, remove search bar to reduce complexity
          categoryFontSize={16} // Explicitly set category font size
          emojiFontSize={20} // Explicitly set emoji font size
          style={{ height: 250 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessagesScreen;

const styles = StyleSheet.create({});
