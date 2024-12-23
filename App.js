import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigator from "./StackNavigator";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (<GestureHandlerRootView style={{ flex: 1 }}>
    <StackNavigator />
  </GestureHandlerRootView>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
