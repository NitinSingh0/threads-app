import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  Animated,
  Easing,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";
import { UserType } from "../UserContext";

const HomeScreen = () => {
  const { setUserId } = useContext(UserType);
  const navigation = useNavigation();
  const [userId, setLocalUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [likeScale] = useState(new Animated.Value(1)); // Animation for like button
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      Alert.alert("Logged out", "You have been logged out successfully.");
      navigation.replace("Login");
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "An error occurred during logout.");
    }
  };

  const animateLike = () => {
    Animated.sequence([
      Animated.timing(likeScale, {
        toValue: 1.5,
        duration: 150,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(likeScale, {
        toValue: 1,
        duration: 150,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const [user, setUser] = useState({
    name: "Anonymous",
    followers: [],
    postsCount: 0,
    followingCount: 0,
    posts: [],
  });
  const [commentInput, setCommentInput] = useState({
    user: "Anonymous",
    content: " ",
  });

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const userId = jwtDecode(token).userId;
        setLocalUserId(userId);
        setUserId(userId);
      } catch (error) {
        console.error("Error decoding token", error);
      }
    };

    fetchUserId();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:3000/profile/${userId}`
      );
      const { user } = response.data;
      setUser(user);
      console.log("User : ", user);
    } catch (error) {
      console.log("Error fetching profile", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:3000/get-posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  const handleLike = async (postId) => {
    if (!userId) return;
    animateLike();
    try {
      const response = await axios.put(
        `http://10.0.2.2:3000/post/${postId}/${userId}/like`
      );
      const updatedPost = response.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
    } catch (error) {
      console.error("Error liking the post", error);
    }
  };

  const handleUnlike = async (postId) => {
    if (!userId) return;
    try {
      const response = await axios.put(
        `http://10.0.2.2:3000/post/${postId}/${userId}/unlike`
      );
      const updatedPost = response.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
    } catch (error) {
      console.error("Error unliking the post", error);
    }
  };

  const handleAddComment = async (postId, newComment) => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `http://10.0.2.2:3000/post/${postId}/comment`,
        { comment: newComment, userId }
      );

      const updatedPost = response.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    // Add the user's message to the chat
    const newMessage = { sender: "user", text: userMessage };
    setChatMessages((prev) => [...prev, newMessage]);
    setUserMessage("");

    try {
      // Check for specific keywords related to study and Campus Connect
      const studyKeywords = [
        "study",
        "course",
        "assignment",
        "exam",
        "campus connect",
        "education",
        "hii",
        "hello",
        "hlo",
        "hey",
        "heyy",
        "good",
        "morning",
        "evening",
        "night",
        "byy",
        "thank",
      ];
      const isEducationalQuery = studyKeywords.some((keyword) =>
        userMessage.toLowerCase().includes(keyword)
      );

      if (!isEducationalQuery) {
        const botReply =
          "This bot is for educational purposes. Please ask study or Campus Connect-related questions.";
        setChatMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
        return;
      }

      // Initialize the Google Generative AI SDK
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(
        "AIzaSyCBMtfl0J6pE8HmMC0drHyv_nLTJlBa59Y"
      );

      // Define chatbot configuration
      const chatbotConfig = {
        model: "gemini-1.5-flash", // Specify the model
        temperature: 1, // Controls creativity (0: deterministic, 1: very creative)
        max_tokens: 50, // Limit the length of the response
        top_p: 0.9, // Controls diversity via nucleus sampling
      };

      // Create a generative model with the specified configuration
      const model = genAI.getGenerativeModel({ model: chatbotConfig.model });

      // Generate content using the chatbot configuration
      const prompt = userMessage;
      const result = await model.generateContent(prompt, {
        temperature: chatbotConfig.temperature,
        maxTokens: chatbotConfig.max_tokens,
        topP: chatbotConfig.top_p,
      });

      // Extract the bot's reply
      const botReply = result.response.text();

      // Add the bot's reply to the chat
      setChatMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error fetching chatbot reply", error);

      // Fallback message in case of an error
      if (error.response) {
        console.error("Chatbot API Error:", error.response.data);
      } else {
        console.error("Network Error:", error.message);
      }
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Unable to process your request. Please try again later.",
        },
      ]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            style={styles.profileImage}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
            }}
          />
          <Text style={styles.appName}>Campus Connect</Text>
          <View style={styles.headerIcons}>
            <Ionicons
              onPress={() => navigation.navigate("Chats")}
              name="chatbox-ellipses-outline"
              size={28}
              color="#fff"
              style={styles.icon}
            />
            <MaterialIcons
              onPress={handleLogout}
              name="logout"
              size={28}
              color="#fff"
              style={styles.icon}
            />
          </View>
        </View>

        {/* Posts */}
        <View style={styles.postsContainer}>
          {posts.map((post) => (
            <View key={post._id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <Image
                  style={styles.postProfileImage}
                  source={{
                    uri:
                      post?.user?.profilePicture ||
                      "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                  }}
                />
                <Text style={styles.postUserName}>{post.user.name}</Text>
              </View>
              <Text style={styles.postContent}>{post.content}</Text>
              <View style={styles.postActions}>
                {post.likes.includes(userId) ? (
                  <Animated.View style={{ transform: [{ scale: likeScale }] }}>
                    <AntDesign
                      onPress={() => handleUnlike(post._id)}
                      name="heart"
                      size={22}
                      color="red"
                    />
                  </Animated.View>
                ) : (
                  <AntDesign
                    onPress={() => handleLike(post._id)}
                    name="hearto"
                    size={22}
                    color="gray"
                  />
                )}
                <FontAwesome name="comment-o" size={22} color="gray" />
                <Ionicons name="share-social-outline" size={22} color="gray" />
              </View>
              <Text style={styles.postFooter}>
                {post.likes.length} Kudos | {post.replies.length} Insights
              </Text>

              {/* Comment Section */}
              <View style={styles.commentsSection}>
                <Text style={styles.commentsTitle}>Comments:</Text>
                <ScrollView style={styles.commentsList}>
                  {post.comments.map((comment, index) => (
                    <View key={index} style={styles.comment}>
                      <Text style={styles.commentAuthor}>
                        {comment.user.name}:
                      </Text>
                      <Text style={styles.commentText}>{comment.text}</Text>
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.commentInputContainer}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    value={commentInput[post._id] || ""}
                    onChangeText={(text) =>
                      setCommentInput((prev) => ({ ...prev, [post._id]: text }))
                    }
                  />
                  <Button
                    title="Post"
                    onPress={() => {
                      handleAddComment(post._id, commentInput[post._id] || "");
                      setCommentInput((prev) => ({ ...prev, [post._id]: "" }));
                    }}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Chatbot Icon */}
      <TouchableOpacity
        style={styles.chatbotIcon}
        onPress={() => setIsChatbotOpen(true)}
      >
        <Ionicons name="chatbubbles" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Chatbot Modal */}
      <Modal visible={isChatbotOpen} animationType="slide" transparent>
        <View style={styles.chatbotModal}>
          <View style={styles.chatbotHeader}>
            <Text style={styles.chatbotTitle}>SmartBuddy</Text>
            <TouchableOpacity onPress={() => setIsChatbotOpen(false)}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.chatMessages}>
            {chatMessages.map((msg, index) => (
              <View
                key={index}
                style={
                  msg.sender === "user" ? styles.userMessage : styles.botMessage
                }
              >
                <Text>{msg.text}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.chatInput}
              placeholder="Type your message..."
              value={userMessage}
              onChangeText={setUserMessage}
            />
            <Button title="Send" onPress={handleSendMessage} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECEFF1", // Light background for contrast
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "linear-gradient(90deg, #6A11CB, #2575FC)", // Attractive gradient
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4, // Add a shadow effect
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
  },
  appName: {
    flex: 1,
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1.5,
    fontFamily: "Roboto", // Modern font
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 16,
    color: "#fff",
  },
  postsContainer: {
    padding: 16,
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0", // Light border
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  postProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  postUserName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Roboto",
  },
  postContent: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
    fontFamily: "Roboto",
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 10,
  },
  postFooter: {
    marginTop: 10,
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
  chatbotIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#6A11CB",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  chatbotModal: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  chatbotHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  chatbotTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  chatMessages: {
    flex: 1,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
    maxWidth: "70%",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ECECEC",
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
    maxWidth: "70%",
  },
  chatInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  chatInput: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  commentsSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
  },
  commentsTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  commentsList: {
    maxHeight: 100,
    marginBottom: 10,
  },
  comment: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  commentAuthor: {
    fontWeight: "bold",
    marginRight: 5,
  },
  commentText: {
    flex: 1,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 5,
    marginRight: 5,
  },
});