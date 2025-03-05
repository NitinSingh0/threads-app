import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";

const ProfileScreen = () => {
  const [user, setUser] = useState({
    name: "",
    followers: [],
    postsCount: 0,
    followingCount: 0,
    posts: [],
  });
  const [posts, setPosts] = useState([]);
  const [likeScale] = useState(new Animated.Value(1));
  const navigation = useNavigation();

  const { userId } = useContext(UserType);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `https://campusconnect-phi.vercel.app/profile/${userId}`
        );
        const { user } = response.data;
        setUser(user);

        // Fetch the user's posts
        const postsResponse = await axios.get(
          `https://campusconnect-phi.vercel.app/posts/user/${userId}`
        );
        setPosts(postsResponse.data.posts);
        console.log("Post ::", posts);
      } catch (error) {
        console.log("Error fetching profile or posts:", error);
      }
    };
    fetchProfile();
  }, [userId]);

  const logout = () => {
    clearAuthToken();
  };

  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
    console.log("cleared auth token");
    navigation.replace("Login");
  };
  console.log("Posts : ", posts);
  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.profileHeader}>
            <Image
              style={styles.coverImage}
              source={{
                uri: user?.backgroundPicture,
              }}
            />
            <View style={styles.profileInfo}>
              <Image
                style={styles.profilePicture}
                source={{
                  uri: user?.profilePicture || user?.image,
                }}
              />
              <Text style={styles.username}>{user?.name || "Unknown"}</Text>
              <View style={styles.collegeBadge}>
                <Text style={styles.collegeName}>{user?.user_type}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.academicInfo}>
              <Text style={styles.academicText}>Course: {user?.course}</Text>
              <Text style={styles.academicText}>
                Joined on {moment(user?.joinedDate).format("MMMM D, YYYY")}
              </Text>
              <Text style={styles.academicText}>
                Passing Year: {user?.passingYear}
              </Text>
            </View>

            <View style={styles.interestsSection}>
              <Text style={styles.interestsText}>V.G. Vaze College</Text>
              <Text style={styles.interestsTitle}>About:</Text>
              <Text style={styles.interestsText}>{user?.bio}</Text>
            </View>

            <Text style={styles.followersCount}>
              {user?.followers?.length || "5"} followers
            </Text>
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              {/* {posts.length} */}
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{10}</Text>
              {/* user?.followers?.length */}
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {user?.followingCount || "10"}
              </Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          <View style={styles.buttonsSection}>
            <Pressable
              onPress={() => {
                navigation.navigate("EditProfile", { userId: user._id, user });
              }}
              style={styles.editProfileButton}
            >
              <Text>Edit Profile</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                navigation.navigate("ResetPassword", { userId: userId })
              }
              style={styles.resetPasswordButton}
            >
              <Text>Reset Password</Text>
            </Pressable>
            <Pressable onPress={logout} style={styles.logoutButton}>
              <Text>Logout</Text>
            </Pressable>
          </View>
          <View>
            <Text
              style={{ fontSize: 25, marginLeft: 10, alignItems: "center" }}
            >
              Posts:
            </Text>
          </View>
          {/* Posts */}
          <View style={styles.postsContainer}>
            {posts.map((post) => (
              <View key={post._id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <Image
                    style={styles.postProfileImage}
                    source={{
                      uri: user.profileImage,
                    }}
                  />
                  <Text style={styles.postUserName}>{post.user.name}</Text>
                </View>
                <Text style={styles.postContent}>{post.content}</Text>

                <Text style={styles.postFooter}>
                  {post.likes.length} Kudos | {post.replies.length} Insights
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Campus Connect</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileHeader: {
    position: "relative",
    backgroundColor: "#F5F5F5",
  },
  coverImage: {
    width: "100%",
    height: 200,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  profileInfo: {
    alignItems: "center",
    marginTop: -70,
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  username: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 10,
  },
  collegeBadge: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "#D0D0D0",
    borderRadius: 20,
  },
  collegeName: {
    fontSize: 14,
    fontWeight: "500",
  },
  detailsSection: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  academicInfo: {
    marginBottom: 10,
  },
  academicText: {
    fontSize: 16,
    color: "#333",
  },
  interestsSection: {
    marginBottom: 10,
  },
  interestsTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  interestsText: {
    fontSize: 16,
    color: "#555",
  },
  followersCount: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 15,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  statLabel: {
    fontSize: 14,
    color: "#777",
  },
  buttonsSection: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
    marginBottom: 30,
    flexWrap: "wrap",
    gap: 10,
  },
  editProfileButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  resetPasswordButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
    backgroundColor: "#6A11CB",
  },
  logoutButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
    backgroundColor: "#FF3B30",
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#F5F5F5",
  },
  footerText: {
    fontSize: 16,
    color: "#888",
  },
  postItem: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 8,
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
  postFooter: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
});
