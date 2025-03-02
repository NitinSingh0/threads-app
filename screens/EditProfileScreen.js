import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";

const EditProfileScreen = ({ route }) => {
  const { userId, user } = route.params; // Get userId and user data from navigation params
  const navigation = useNavigation();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [course, setCourse] = useState(user?.course || "");
  const [profilePicture, setProfilePicture] = useState(user?.image || "");
  const [backgroundPicture, setBackgroundPicture] = useState(
    user?.backgroundPicture || ""
  );
  const [passingYear, setPassingYear] = useState(user?.passingYear || "");

  const handleSave = async () => {
    try {
      await axios.put(
        `https://campusconnect-phi.vercel.app/profile/${userId}`,
        {
          name,
          profilePicture,
          backgroundPicture,
          course,
          bio,
          passingYear,
        }
      );

      alert("Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log("Result : ", result);
    if (result.didCancel) {
      console.log("User cancelled image picker");
    } else if (result.errorMessage) {
      console.error("Image picker error:", result.errorMessage);
    } else if (result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;
      if (type === "profile") {
        setProfilePicture(selectedImage);
      } else if (type === "background") {
        setBackgroundPicture(selectedImage);
      }
    }
  };

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log("Result : ", result);
    if (result.didCancel) {
      console.log("User cancelled image picker");
    } else if (result.errorMessage) {
      console.error("Image picker error:", result.errorMessage);
    } else if (result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;
      if (type === "profile") {
        setProfilePicture(selectedImage);
      } else if (type === "background") {
        setBackgroundPicture(selectedImage);
      }
    }
  };

  const selectImagee = async (type) => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.8,
    });

    if (result.didCancel) {
      console.log("User cancelled image picker");
    } else if (result.errorMessage) {
      console.error("Image picker error:", result.errorMessage);
    } else if (result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;
      if (type === "profile") {
        setProfilePicture(selectedImage);
      } else if (type === "background") {
        setBackgroundPicture(selectedImage);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.title}>Edit Profile</Text>

          <Pressable onPress={pickImage}>
            <Image
              style={styles.backgroundImage}
              source={{
                uri:
                  backgroundPicture ||
                  "https://img.freepik.com/free-vector/abstract-blue-polygon-technology-background_1035-17380.jpg?ga=GA1.1.1157197616.1706377125&semt=ais_hybrid",
              }}
            />
            <Text style={styles.editLabel}>Edit Background</Text>
          </Pressable>

          <View style={styles.profileSection}>
            <Pressable onPress={() => selectImage("profile")}>
              <Image
                style={styles.profileImage}
                source={{
                  uri:
                    profilePicture ||
                    "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                }}
              />
            </Pressable>
            <Text style={styles.editLabel}>Edit Profile Picture</Text>
          </View>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={styles.input}
            value={bio}
            onChangeText={setBio}
            placeholder="Enter your Bio"
          />

          <Text style={styles.label}>Course</Text>
          <TextInput
            style={styles.input}
            value={course}
            onChangeText={setCourse}
            placeholder="Enter your course name"
          />
          <Text style={styles.label}>Passing Year</Text>
          <TextInput
            style={styles.input}
            value={passingYear}
            onChangeText={setPassingYear}
            placeholder="Enter your passing Year"
          />
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  backgroundImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  editLabel: {
    fontSize: 14,
    color: "#007BFF",
    marginTop: 5,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    },
  
});
