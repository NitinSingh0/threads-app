import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
import * as Animatable from "react-native-animatable"; // For animations

const HomeScreen = () => {
  const { setUserId } = useContext(UserType);
  const navigation = useNavigation();
  const [userId, setLocalUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [likeScale] = useState(new Animated.Value(1)); // Animation for like button
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [visibleComments, setVisibleComments] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  //const [modalVisible, setModalVisible] = useState(false);

  // Toggle comments visibility
  const toggleComments = (postId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const openReportModal = (postId) => {
    setSelectedPostId(postId); // Store the selected post ID
    setModalVisible(true);
  };
  // Function to submit the report
  const submitReport = async (postId) => {
    if (!reportReason.trim()) {
      Alert.alert("Error", "Please provide a reason for reporting.");
      return;
    }
    console.log("Reporting Post ID:", selectedPostId); // Debugging
    try {
      const response = await fetch(
        "https://campusconnect-phi.vercel.app/report",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId: selectedPostId,
            reportedBy: userId,
            reason: reportReason,
            reportedAt: new Date().toISOString(),
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", "Report submitted successfully.");
        setReportReason("");
        setModalVisible(false);
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
        setReportReason("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      Alert.alert("Error", "Failed to submit report. Please try again.");
    }
  };

  // Handle logout
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

  // Animate like button
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

  // Fetch user ID and profile
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
    //fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `https://campusconnect-phi.vercel.app/profile/${userId}`
      );
      const { user } = response.data;
      setUser(user);
      console.log("User : ", user);
    } catch (error) {
      console.log("Error fetching profile", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  // Fetch posts
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "https://campusconnect-phi.vercel.app/get-posts"
      );
      setPosts(response.data);
      console.log("Post : ", response.data);
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  const Cursor = () => {
    const [blink, setBlink] = useState(false);

    useEffect(() => {
      const interval = setInterval(() => {
        setBlink((prev) => !prev);
      }, 500); // Blink every 500ms
      return () => clearInterval(interval);
    }, []);

    return <View style={[styles.cursor, { opacity: blink ? 1 : 0 }]} />;
  };

  // Handle like/unlike
  const handleLike = async (postId) => {
    if (!userId) return;
    animateLike();
    try {
      const response = await axios.put(
        `https://campusconnect-phi.vercel.app/post/${postId}/${userId}/like`
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
        `https://campusconnect-phi.vercel.app/post/${postId}/${userId}/unlike`
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

  // Handle adding comments
  const handleAddComment = async (postId, newComment) => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `https://campusconnect-phi.vercel.app/post/${postId}/comment`,
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

  // Handle chatbot messages
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessage = { sender: "user", text: userMessage };
    setChatMessages((prev) => [...prev, newMessage]);
    setUserMessage("");

    try {
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

      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(
        "AIzaSyCBMtfl0J6pE8HmMC0drHyv_nLTJlBa59Y"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(userMessage);
      const botReply = result.response.text();
      setChatMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error fetching chatbot reply", error);
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
    <View style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <Animatable.View
          animation="fadeInDown"
          duration={1000}
          style={styles.header}
        >
          <Image
            style={styles.profileImage}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
            }}
          />
          <Text style={styles.appName}>Vaze Connect</Text>
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
        </Animatable.View>

        {/* Posts */}
        <View style={styles.postsContainer}>
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <Animatable.View
                key={post._id}
                animation="fadeInUp"
                duration={1000}
                style={styles.postCard}
              >
                <View style={styles.postHeader}>
                  <Image
                    style={styles.postProfileImage}
                    source={{
                      uri:
                        post?.user?.profilePicture ||
                        "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                    }}
                  />
                  <Text style={styles.postUserName}>
                    {post?.user?.name || "Anonymous"}
                  </Text>
                  <View style={styles.userTypeContainer}>
                    {post?.user?.user_type === "student" ? (
                      <MaterialCommunityIcons
                        name="school"
                        size={18}
                        color="blue"
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="account-tie"
                        size={18}
                        color="brown"
                      />
                    )}
                  </View>

                  {/* Course Name if Available */}
                  {post?.user?.course && (
                    <Text style={styles.courseText}>{post.user.course}</Text>
                  )}
                  <Menu style={styles.menuIconContainer}>
                    <MenuTrigger>
                      <Ionicons
                        name="ellipsis-vertical"
                        size={20}
                        color="black"
                      />
                    </MenuTrigger>
                    <MenuOptions>
                      <MenuOption
                        onSelect={() => openReportModal(post._id)}
                        text="Report"
                      />
                    </MenuOptions>
                  </Menu>
                </View>
                <Text style={styles.postContent}>
                  {post.content || "No content"}
                </Text>
                {/* Report Modal */}
                <Modal
                  visible={modalVisible}
                  //animationType="slide"
                  transparent={true}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Report Post</Text>
                      <TextInput
                        placeholder="Enter reason..."
                        style={styles.input}
                        value={reportReason}
                        onChangeText={setReportReason}
                      />
                      <View style={styles.buttonContainer}>
                        <Button
                          title="Cancel"
                          onPress={() => setModalVisible(false)}
                        />
                        <Button title="Submit" onPress={submitReport} />
                      </View>
                    </View>
                  </View>
                </Modal>
                <View style={styles.postActions}>
                  {/* Like/Unlike */}
                  {post.likes?.includes(userId) ? (
                    <Animated.View
                      style={{ transform: [{ scale: likeScale }] }}
                    >
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
                  {/* Comments Toggle */}
                  <FontAwesome
                    name={visibleComments[post._id] ? "comment" : "comment-o"}
                    size={22}
                    color="gray"
                    onPress={() => toggleComments(post._id)}
                  />
                  <Ionicons
                    name="share-social-outline"
                    size={22}
                    color="gray"
                  />
                </View>
                <Text style={styles.postFooter}>
                  {post.likes?.length || 0} Kudos | {post.replies?.length || 0}{" "}
                  Insights
                </Text>

                {/* Comment Section */}
                {visibleComments[post._id] && (
                  <View style={styles.commentsSection}>
                    <Text style={styles.commentsTitle}>Comments:</Text>
                    <ScrollView style={styles.commentsList}>
                      {post.replies && post.replies.length > 0 ? (
                        post.replies.map((replies, index) => (
                          <View key={index} style={styles.comment}>
                            <Text style={styles.commentAuthor}>
                              {replies?.user?.name || "Anonymous"}:
                            </Text>
                            <Text style={styles.commentText}>
                              {replies?.content || ""}
                            </Text>
                          </View>
                        ))
                      ) : (
                        <Text>No comments yet</Text>
                      )}
                    </ScrollView>
                    <View style={styles.commentInputContainer}>
                      <TextInput
                        style={styles.commentInput}
                        placeholder="Add a comment..."
                        placeholderTextColor="#999"
                        value={commentInput[post._id] || ""}
                        onChangeText={(text) =>
                          setCommentInput((prev) => ({
                            ...prev,
                            [post._id]: text,
                          }))
                        }
                      />
                      <Cursor />
                      <TouchableOpacity
                        onPress={() => {
                          handleAddComment(
                            post._id,
                            commentInput[post._id] || ""
                          );
                          setCommentInput((prev) => ({
                            ...prev,
                            [post._id]: "",
                          }));
                        }}
                        style={{
                          backgroundColor: "#6A11CB",
                          padding: 10,
                          borderRadius: 20,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                          Post
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Animatable.View>
            ))
          ) : (
            <Text>No posts available</Text>
          )}
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
  courseText: {
    fontSize: 14,
    color: "#007AFF",
    fontStyle: "italic",
    marginTop: 2,
    marginLeft: 4,
  },
  userTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  userTypeText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#555",
  },
  container: {
    flex: 1,
    backgroundColor: "#1e1e2e", // Soft Charcoal
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#4a90e2", // Royal Blue
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1e2e",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ffd166", // Lemon Yellow
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4a90e2", // Royal Blue
  },
  appName: {
    flex: 1,
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1.5,
    fontFamily: "Poppins",
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
    borderColor: "#E0E0E0",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    //justifyContent: "space-between",
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
    color: "#4a90e2", // Royal Blue
    fontFamily: "Poppins",
  },
  postContent: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
    fontFamily: "Poppins",
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
    backgroundColor: "#ff6b6b",
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
    borderRadius: 20,
    margin: 5,
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
    color: "#4a90e2",
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
    backgroundColor: "#E3EAFD",
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
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  // 3-dot menu (⋮) positioning fix
  menuIconContainer: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 10, // Keeps it on top of the post card
  },
  commentsTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    fontSize: 14,
  },
  commentsList: {
    maxHeight: 100,
    marginBottom: 10,
  },
  comment: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
    padding: 8,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  commentAuthor: {
    fontWeight: "bold",
    marginRight: 5,
    color: "#6A11CB",
  },
  commentText: {
    flex: 1,
    color: "#555",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    backgroundColor: "#FFF",
    fontSize: 14,
    color: "#333",
  },

  // Cursor Animation
  cursor: {
    width: 2,
    height: 20,
    backgroundColor: "#6A11CB",
    marginLeft: 5,
  },

  // Unique Animations
  fadeIn: {
    opacity: 0,
    transform: [{ translateY: 10 }],
  },
  fadeInActive: {
    opacity: 1,
    transform: [{ translateY: 0 }],
    transition: "opacity 0.3s ease, transform 0.3s ease",
  },
});
