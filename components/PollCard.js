import React, { useCallback, useContext, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { UserContext } from "../context/UserContext";
import UserProfileInfo from "./UserProfileInfo";
import PollAction from "./PollAction";
import PollContent from "./PollContent";
import Toast from "react-native-toast-message";
import PollingResultContent from "./PollingResultContent";
import { UserType } from "../UserContext";
import axios from "axios";

const PollCard = ({
  pollId,
  question,
  type,
  options,
  voters,
  responses,
  creatorProfileImg,
  creatorName,
  creatorUsername,
  userHasVoted,
  isMyPoll,
  isPollClosed,
  createdAt,
}) => {
  const BASE_URL = "https://campusconnect-phi.vercel.app";
  const { userId } = useContext(UserType);
  const { user, onUserVoted, toggleBookmarkId } = useContext(UserContext);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  const [rating, setRating] = useState(0);
  const [userResponse, setUserResponse] = useState("");
  const [isVoteComplete, setIsVoteComplete] = useState(userHasVoted);
  const [pollResult, setPollResult] = useState({ options, voters, responses });
  const isPollBookmarked = user?.bookmarkedPolls?.includes(pollId) || false;
  const [pollBookmarked, setPollBookmarked] = useState(isPollBookmarked);
  const [pollClosed, setPollClosed] = useState(isPollClosed || false);
  const [pollDeleted, setPollDeleted] = useState(false);

  const handleInput = (value) => {
    if (type === "rating") setRating(value);
    else if (type === "open-ended") setUserResponse(value);
    else setSelectedOptionIndex(value);
  };

  const getPostData = useCallback(() => {
    if (type === "open-ended")
      return { responseText: userResponse, voterId: userId };
    if (type === "rating") return { optionIndex: rating - 1, voterId: userId };
    return { optionIndex: selectedOptionIndex, voterId: userId };
  }, [type, userResponse, rating, selectedOptionIndex, user]);

  const handleVoteSubmit = async () => {
    try {
      await axios.post(
        `${BASE_URL}/polls/${userId}/${pollId}/vote`,
        getPostData()
      );
      onUserVoted();
      setIsVoteComplete(true);
      Toast.show({ type: "success", text1: "Vote submitted successfully!" });
    } catch (error) {
      console.error(error.response?.data?.message || "Error submitting vote");
    }
  };

  const toggleBookmark = async () => {
    try {
      await axios.post(`${BASE_URL}/polls/${userId}/${pollId}/bookmark`);
      toggleBookmarkId(pollId);
      setPollBookmarked((prev) => !prev);
      Toast.show({ type: "success", text1: "Bookmark status updated!" });
    } catch (error) {
      console.error(error.response?.data?.message || "Error bookmarking poll");
    }
  };

  return (
    !pollDeleted && (
      <View style={styles.card}>
        <View style={styles.header}>
          <UserProfileInfo
            imgUrl={creatorProfileImg}
            fullname={creatorName}
            username={creatorUsername}
            createdAt={createdAt}
          />
          <PollAction
            pollId={pollId}
            isVoteComplete={isVoteComplete}
            inputCaptured={
              !!(userResponse || selectedOptionIndex >= 0 || rating)
            }
            onVoteSubmit={handleVoteSubmit}
            isBookmarked={pollBookmarked}
            toggleBookmark={toggleBookmark}
            isMyPoll={isMyPoll}
            pollClosed={pollClosed}
            onClosePoll={() => {}}
            onDelete={() => {}}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.question}>{question}</Text>
          <View style={styles.pollContainer}>
            {isVoteComplete || isPollClosed ? (
              <PollingResultContent
                type={type}
                options={pollResult.options || []}
                voters={pollResult.voters}
                responses={pollResult.responses || []}
              />
            ) : (
              <PollContent
                type={type}
                options={options}
                selectedOptionIndex={selectedOptionIndex}
                onOptionSelect={handleInput}
                rating={rating}
                onRatingChange={handleInput}
                userResponse={userResponse}
                onResponseChange={handleInput}
              />
            )}
          </View>
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    backdropFilter: "blur(10px)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    marginTop: 12,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    lineHeight: 24,
    marginBottom: 10,
  },
  pollContainer: {
    marginTop: 10,
  },
});

export default PollCard;
