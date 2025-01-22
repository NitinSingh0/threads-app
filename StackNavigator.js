import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//import { jwtDecode } from "jwt-decode";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import ThreadsScreen from "./screens/ThreadsScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import ActivityScreen from "./screens/ActivityScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ChatsScreen from "./screens/ChatsScreen";
import OverviewScreen from "./screens/OverviewScreen";
import FriendsScreen from "./screens/FriendsScreen";
import ChatMessagesScreen from "./screens/ChatMessagesScreen";
// Add animation for stack transitions
const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  function BottomTabs() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          tabBarStyle: {
            backgroundColor: "#F2F2F2",
            borderTopWidth: 0,
            elevation: 5,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: -5 },
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Bulletin",
            tabBarLabelStyle: { color: "black", fontSize: 12 },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={24} color="#4F91F3" />
              ) : (
                <AntDesign name="home" size={24} color="gray" />
              ),
          }}
        />
        <Tab.Screen
          name="Thread"
          component={ThreadsScreen}
          options={{
            tabBarLabel: "CampusVoice",
            tabBarLabelStyle: { color: "black", fontSize: 12 },
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "create" : "create-outline"}
                size={24}
                color={focused ? "#4F91F3" : "gray"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Activity"
          component={ActivityScreen}
          options={{
            tabBarLabel: "Engagements",
            tabBarLabelStyle: { color: "black", fontSize: 12 },
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <AntDesign
                name={focused ? "heart" : "hearto"}
                size={24}
                color={focused ? "#4F91F3" : "gray"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Activityy"
          component={OverviewScreen}
          options={{
            tabBarLabel: "Engagements",
            tabBarLabelStyle: { color: "black", fontSize: 12 },

            tabBarIcon: ({ focused }) => (
              <AntDesign
                name={focused ? "heart" : "hearto"}
                size={24}
                color={focused ? "#4F91F3" : "gray"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Message"
          component={ChatsScreen}
          options={{
            tabBarLabel: "Chat Room",
            tabBarLabelStyle: { color: "black", fontSize: 12 },
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <AntDesign
                name={focused ? "heart" : "hearto"}
                size={24}
                color={focused ? "#4F91F3" : "gray"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "My Space",
            tabBarLabelStyle: { color: "black", fontSize: 12 },
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={focused ? "#4F91F3" : "gray"}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#4F91F3",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          animation: "fade_from_bottom", // Add animation when navigating between screens
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chats"
          component={ChatsScreen}
          options={{
            headerShown: true, // Customize the header title for this screen
          }}
        />
        <Stack.Screen
          name="Messages"
          component={ChatMessagesScreen}
          options={{
            headerShown: true, // Customize the header title for this screen
          }}
        />
        <Stack.Screen
          name="Friends"
          component={FriendsScreen}
          options={{
            headerShown: true, // Customize the header title for this screen
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

// You can add your styles here, if necessary
const styles = StyleSheet.create({
  // Add custom styles here if needed Friends
});
