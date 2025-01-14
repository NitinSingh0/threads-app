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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";

const HomeScreen = () => {
  const { setUserId } = useContext(UserType);
  const navigation = useNavigation();
  const [userId, setLocalUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [likeScale] = useState(new Animated.Value(1)); // Animation for like button
const jwtDecode = require("jwt-decode");

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
  }, []);

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

  return (
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
                  uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
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
              {post.likes.length} likes | {post.replies.length} replies
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#6A11CB",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 16,
  },
  postsContainer: {
    padding: 16,
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  postProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postUserName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  postContent: {
    fontSize: 14,
    color: "#333",
    marginVertical: 10,
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginVertical: 10,
  },
  postFooter: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
});
