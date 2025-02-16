import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigator from "./StackNavigator";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserContext } from './UserContext';
import { MenuProvider } from "react-native-popup-menu";
import UserProvider from "./context/UserContext";

export default function App() {
  return (
    <MenuProvider>
      <UserProvider>
        <UserContext>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StackNavigator />
          </GestureHandlerRootView>
        </UserContext>
      </UserProvider>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
