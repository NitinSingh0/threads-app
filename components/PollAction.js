import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // You can use any icon library of your choice

const PollAction = ({
  isVoteComplete,
  inputCaptured,
  onVoteSubmit,
  isBookmarked,
  toggleBookmark,
  isMyPoll,
  pollClosed,
  onClosePoll,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);

  const handleVoteClick = async () => {
    setLoading(true);
    try {
      await onVoteSubmit();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {(isVoteComplete || pollClosed) && (
        <Text style={styles.statusText}>{pollClosed ? "Closed" : "Voted"}</Text>
      )}
      <TouchableOpacity onPress={toggleBookmark}>
        <FontAwesome
          name={isBookmarked ? "bookmark" : "bookmark-o"}
          size={20}
          color={isBookmarked ? "#1e3a8a" : "#6b7280"} // Color for bookmark
        />
      </TouchableOpacity>

      {inputCaptured && !isVoteComplete && (
        <TouchableOpacity
          style={styles.voteButton}
          onPress={handleVoteClick}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.voteButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // Equivalent to gap-4 in Tailwind
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4b5563", // Text color for 'Voted' or 'Closed'
    backgroundColor: "#bae6fd", // Sky blue background
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  voteButton: {
    marginLeft: "auto",
    backgroundColor: "#2563eb", // Blue color for submit button
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  voteButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default PollAction;
