import React, { useCallback, useContext, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { UserContext } from "../context/UserContext";
//import { getPollBookmarked } from "../../utils/helper";

import UserProfileInfo from "./UserProfileInfo";
import PollAction from "./PollAction";
import PollContent from "./PollContent";

import Toast from "react-native-toast-message";
import PollingResultContent from "./PollingResultContent";
import { UserType } from "../UserContext";

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
    const { userId } = useContext(UserType);
  const { user, onUserVoted, toggleBookmarkId } = useContext(UserContext);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  const [rating, setRating] = useState(0);
  const [userResponse, setUserResponse] = useState("");
  const [isVoteComplete, setIsVoteComplete] = useState(userHasVoted);
  const [pollResult, setPollResult] = useState({
    options,
    voters,
    responses,
  });
    const getPollBookmarked = (pollId, userBookmarks = []) => {
      return userBookmarks.includes(pollId);
    };
  const isPollBookmarked = getPollBookmarked(
    pollId,
    user.bookmarkedPolls || []
  );
  const [pollBookmarked, setPollBookmarked] = useState(isPollBookmarked);
  const [pollClosed, setPollClosed] = useState(isPollClosed || false);
  const [pollDeleted, setPollDeleted] = useState(false);

  // Handles user input based on the poll type
  const handleInput = (value) => {
    if (type === "rating") setRating(value);
    else if (type === "open-ended") setUserResponse(value);
    else setSelectedOptionIndex(value);
  };

  // Generates post data based on the poll type
  const getPostData = useCallback(() => {
    if (type === "open-ended") {
      return { responseText: userResponse, voterId: userId };
    }
    if (type === "rating") {
      return { optionIndex: rating - 1, voterId: userId };
    }
    return { optionIndex: selectedOptionIndex, voterId: userId };
  }, [type, userResponse, rating, selectedOptionIndex, user]);

  // Get Poll Details by ID
  const getPollDetail = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.POLLS.GET_BY_ID(pollId)
      );

      if (response.data) {
        const pollDetails = response.data;
        setPollResult({
          options: pollDetails.options || [],
          voters: pollDetails.voters.length || 0,
          responses: pollDetails.responses || [],
        });
      }
    } catch (error) {
      console.error(
        error.response?.data?.message || "Error fetching poll details"
      );
    }
  };

  // Handles the submission of votes
  const handleVoteSubmit = async () => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.POLLS.VOTE(pollId),
        getPostData()
      );
      getPollDetail();
      onUserVoted();
      setIsVoteComplete(true);
      Toast.show({ type: "success", text1: "Vote submitted successfully!" });
    } catch (error) {
      console.error(error.response?.data?.message || "Error submitting vote");
    }
  };

  // Toggles the bookmark status of a poll
  const toggleBookmark = async () => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.POLLS.BOOKMARK(pollId)
      );
      toggleBookmarkId(pollId);
      setPollBookmarked((prev) => !prev);
      Toast.show({ type: "success", text1: response.data.message });
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
    backgroundColor: "#f1f5f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  content: {
    marginTop: 10,
  },
  question: {
    fontSize: 15,
    color: "#000",
    lineHeight: 22,
    marginBottom: 8,
  },
  pollContainer: {
    marginTop: 8,
  },
});

export default PollCard;
