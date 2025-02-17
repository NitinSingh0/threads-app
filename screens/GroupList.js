import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import axios from "axios";
import { UserType } from "../UserContext";

const API_URL = "http://10.0.2.2:3000";

const GroupList = ({ navigation }) => {
  const { userId } = useContext(UserType);
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMember, setNewMember] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchUserGroups();
  }, []);

  const fetchUserGroups = async () => {
    try {
      const res = await axios.get(`${API_URL}/groupList/${userId}`);
      setGroups(res.data);
    } catch (error) {
      console.error("Error fetching groups", error.message);
    }
  };

  const createGroup = async () => {
    if (!groupName.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/create`, {
        name: groupName,
        description,
        members: [userId, ...members],
        admin: userId,
      });
      setGroups([...groups, res.data]);
      setGroupName("");
      setDescription("");
      setMembers([]);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating group", error);
    }
  };

  const addMember = () => {
    if (newMember.trim()) {
      setMembers([...members, newMember.trim()]);
      setNewMember("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Groups</Text>

      {/* Go Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>◀ Go Back</Text>
      </TouchableOpacity>

      {/* Create Group Icon */}
      <TouchableOpacity
        style={styles.createIcon}
        onPress={() => setShowCreateForm(!showCreateForm)}
      >
        <Text style={styles.createIconText}>➕ Create Group</Text>
      </TouchableOpacity>

      {showCreateForm && (
        <ScrollView style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Group Name"
            value={groupName}
            onChangeText={setGroupName}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Description"
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Add Members</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.createButton} onPress={createGroup}>
            <Text style={styles.createButtonText}>Create Group</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Display Groups */}
      <FlatList
        data={groups}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.groupItem}
            onPress={() =>
              navigation.navigate("GroupChat", { groupId: item._id })
            }
          >
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal for Adding Members */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Members</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Member ID"
            value={newMember}
            onChangeText={setNewMember}
          />
          <TouchableOpacity style={styles.button} onPress={addMember}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
          <FlatList
            data={members}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.memberItem}>{item}</Text>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default GroupList;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E1E2E", padding: 20 },
  header: { fontSize: 26, fontWeight: "bold", color: "#FFF", marginBottom: 10 },
  backButton: { marginBottom: 15 },
  backText: { color: "#FFD700", fontSize: 16 },
  createIcon: { marginBottom: 10, alignItems: "center" },
  createIconText: { fontSize: 18, color: "#FFD700", fontWeight: "bold" },
  formContainer: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: { color: "#FFF", fontWeight: "bold", textAlign: "center" },
  createButton: {
    backgroundColor: "#28A745",
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  createButtonText: { color: "#FFF", fontWeight: "bold", textAlign: "center" },
  groupItem: {
    padding: 15,
    backgroundColor: "#252540",
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  groupName: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
  groupDescription: { color: "#CCC" },
  modalContainer: { flex: 1, padding: 20, backgroundColor: "#FFF" },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  memberItem: { padding: 8, fontSize: 16, color: "#333" },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#FF5733",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: { color: "#FFF", fontWeight: "bold", textAlign: "center" },
});
