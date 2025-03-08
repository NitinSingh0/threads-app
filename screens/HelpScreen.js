import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Button,
  Linking,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const HelpScreen = () => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [expandedTroubleshooting, setExpandedTroubleshooting] = useState(null);
  const [userQuery, setUserQuery] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const faqs = [
    {
      question: "How do I report a post?",
      answer:
        "To report a post, tap the three-dot menu on the post and select 'Report'. Provide a reason for reporting, and our team will review it.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "Go to the Login screen, tap 'Forgot Password', and follow the instructions sent to your email.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can contact support by filling out the form below or emailing us at support@vazeconnect.com.",
    },
    {
      question: "How do I update my profile?",
      answer:
        "Go to your profile page, tap the edit icon, and update your information.",
    },
  ];

  const troubleshootingSteps = [
    {
      step: "App crashes on launch",
      details:
        "Try clearing the app cache or reinstalling the app. If the issue persists, contact support.",
    },
    {
      step: "Unable to log in",
      details:
        "Ensure you are using the correct email and password. If you forgot your password, use the 'Forgot Password' option.",
    },
    {
      step: "Posts not loading",
      details:
        "Check your internet connection. If the issue persists, restart the app or contact support.",
    },
    {
      step: "Notifications not working",
      details:
        "Ensure notifications are enabled in your device settings and within the app.",
    },
  ];

  const handleSubmitQuery = () => {
    if (userQuery.trim()) {
      setIsSubmitted(true);
      setUserQuery("");
      setTimeout(() => setIsSubmitted(false), 3000); // Reset submission message after 3 seconds
    }
  };

  const openUserManual = () => {
    const userManualUrl =
      "https://drive.google.com/drive/folders/18EEfJz8YkreWneu1qhnm3E1fLZyGduBY?usp=sharing"; // Replace with your Google Drive link
    Linking.openURL(userManualUrl).catch(() =>
      Alert.alert("Error", "Unable to open the user manual.")
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Help & Support</Text>
      </View>

      {/* FAQs Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqs.map((faq, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faqItem}
            onPress={() =>
              setExpandedQuestion(expandedQuestion === index ? null : index)
            }
          >
            <View style={styles.faqQuestion}>
              <Ionicons
                name={
                  expandedQuestion === index
                    ? "chevron-down"
                    : "chevron-forward"
                }
                size={20}
                color="#4a90e2"
              />
              <Text style={styles.faqQuestionText}>{faq.question}</Text>
            </View>
            {expandedQuestion === index && (
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Troubleshooting Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Troubleshooting</Text>
        {troubleshootingSteps.map((step, index) => (
          <TouchableOpacity
            key={index}
            style={styles.troubleshootingItem}
            onPress={() =>
              setExpandedTroubleshooting(
                expandedTroubleshooting === index ? null : index
              )
            }
          >
            <View style={styles.troubleshootingStep}>
              <Ionicons
                name={
                  expandedTroubleshooting === index
                    ? "chevron-down"
                    : "chevron-forward"
                }
                size={20}
                color="#4a90e2"
              />
              <Text style={styles.troubleshootingStepText}>{step.step}</Text>
            </View>
            {expandedTroubleshooting === index && (
              <Text style={styles.troubleshootingDetails}>{step.details}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* User Manual Button */}
      <TouchableOpacity
        style={styles.userManualButton}
        onPress={openUserManual}
      >
        <Text style={styles.userManualButtonText}>Open User Manual</Text>
      </TouchableOpacity>

      {/* Contact Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Support</Text>
        <Text style={styles.contactText}>
          If you have any issues or questions, please fill out the form below,
          and our support team will get back to you.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Describe your issue..."
          placeholderTextColor="#999"
          multiline
          value={userQuery}
          onChangeText={setUserQuery}
        />
        <Button title="Submit" onPress={handleSubmitQuery} color="#4a90e2" />
        {isSubmitted && (
          <Text style={styles.submissionMessage}>
            Your query has been submitted. We'll get back to you soon!
          </Text>
        )}
      </View>

      {/* App Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Information</Text>
        <Text style={styles.appInfoText}>Version: 1.0.0</Text>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              "https://drive.google.com/drive/folders/18EEfJz8YkreWneu1qhnm3E1fLZyGduBY?usp=sharing"
            )
          }
        >
          <Text style={styles.linkText}>Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              "https://drive.google.com/drive/folders/18EEfJz8YkreWneu1qhnm3E1fLZyGduBY?usp=sharing"
            )
          }
        >
          <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4a90e2",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  faqItem: {
    marginBottom: 10,
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  faqQuestion: {
    flexDirection: "row",
    alignItems: "center",
  },
  faqQuestionText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
  },
  troubleshootingItem: {
    marginBottom: 10,
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  troubleshootingStep: {
    flexDirection: "row",
    alignItems: "center",
  },
  troubleshootingStepText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  troubleshootingDetails: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
  },
  userManualButton: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  userManualButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  contactText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#FFF",
    fontSize: 14,
    color: "#333",
    minHeight: 100,
  },
  submissionMessage: {
    fontSize: 14,
    color: "#4a90e2",
    marginTop: 10,
    textAlign: "center",
  },
  appInfoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  linkText: {
    fontSize: 14,
    color: "#4a90e2",
    marginBottom: 5,
    textDecorationLine: "underline",
  },
});

export default HelpScreen;
