const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jwt = require("jsonwebtoken");

mongoose
  .connect(
    "mongodb+srv://nitin:nitin@cluster0.syfmj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to  mongodb");
  })
  .catch((err) => {
    console.log("Error connecting mongodb", err);
  });
app.listen(port, () => {
  console.log("Server running on port 3000");
});

const User = require("./models/user");
const Post = require("./models/post");
const Message = require("./models/message");
const Poll = require("./models/Poll");
const Report = require("./models/report");
const Group = require("./models/group");

//endpoint to register a user in the backend
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registed" });
    }

    //create a new user
    const newUser = new User({ name, email, password });

    //generate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    //sace the user to the database
    await newUser.save();

    //send the verfication email to the user
    sendVerificationEmail(newUser.email, newUser.verificationToken);
    res.status(200).json({ message: "Registration successfull" });
  } catch (error) {
    console.log("error registering user", error);
    res.status(500).json({ message: "error registering user" });
  }
});
const sendVerificationEmail = async (email, verificationToken) => {
  //create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "itinventrix@gmail.com",
      pass: "kncj yjzx fcfa mqhh",
    },
  });
  //compose the email messgage
  const mailOption = {
    from: "threads.com",
    to: email,
    subject: "Email Verification",
    text: `please click the following link to verify your email http://localhost:3000/verify/${verificationToken}`,
  };
  try {
    await transporter.sendMail(mailOption);
  } catch (error) {
    console.log("error sensing email", error);
  }
};
app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();
  } catch (error) {
    console.log("error getting token", error);
    res.status(500).json({ message: "Email verification failed" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};
const secretKey = generateSecretKey();

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user.account_status == "suspended") {
      return res.status(404).json({ message: "Your account is suspended!" });
    }
    if (!user) {
      return res.status(404).json({ message: "Invallid email or password" });
    }
    if (user.password != password) {
      return res.status(404).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, secretKey);
    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

//end point to accepet all the user except the loggen in user

app.get("/user/:userId", (req, res) => {
  try {
    const loggedInUSerId = req.params.userId;
    User.find({ _id: { $ne: loggedInUSerId } })
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => {
        console.log("Error : ", error);
        res.status(500).json("error");
      });
  } catch (error) {
    res.status(500).json({ message: "error getting user" });
  }
});

//endpoint to get the friend list
app.get("/user/friendslist/:userId", (req, res) => {
  try {
    const loggedInUSerId = req.params.userId;
    User.find({ _id: { $ne: loggedInUSerId } })
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => {
        console.log("Error : ", error);
        res.status(500).json("error");
      });
  } catch (error) {
    res.status(500).json({ message: "error getting user" });
  }
});

//endpoint to follow a particular user
app.post("/follow", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;
  try {
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { followers: currentUserId },
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error in following a user" });
  }
});

//endpoint to unfollow a user

app.post("/users/unfollow", async (req, res) => {
  const { loggedInUserId, targetUserId } = req.body; // Fixed property name
  try {
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: loggedInUserId },
    });
    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unfollowing the user", error });
  }
});

//endpoints to create a new post in the backend

app.post("/create-post", async (req, res) => {
  try {
    const { content, userId } = req.body;
    console.log("Received data:", { content, userId });
    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }
    const newPostData = {
      user: userId,
    };
    if (content) {
      newPostData.content = content;
    }
    console.log("Post Data to Save:", newPostData);
    const newPost = new Post(newPostData);
    await newPost.save();
    res
      .status(200)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Post creation failed" });
  }
});

//end point for liking a particular post

app.put("/post/:postId/:userId/like", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;
    const post = await Post.findById(postId).populate("user", "name");
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "post not found" });
    }
    updatedPost.user = post.user;
    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured while liking" });
  }
});
//endpoint to update the profile
app.put("/profile/:userId", async (req, res) => {
  const { userId } = req.params; // Extract userId from the request params
  const { name, profilePicture, backgroundPicture, course, bio, passingYear } =
    req.body; // Destructure data from the request body

  try {
    // Find the user by ID and update their profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        profilePicture,
        backgroundPicture,
        course,
        bio,
        passingYear,
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the updated user
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile", error });
  }
});
//endpoint to unlike a particular post
app.put("/post/:postId/:userId/unlike", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;
    const post = await Post.findById(postId).populate("user", "name");
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "post not found" });
    }
    updatedPost.user = post.user;
    res.json(updatedPost);
  } catch (error) {
    console.error("Error unliking post", error);
    res.status(500).json({ message: "An error occured while unliking" });
  }
});

//endpoints to get all the posts

app.get("/get-posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name user_type course ")
      .populate("replies.user", "name picture")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ messsage: "An error occured while fetching post" });
  }
});

app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404)._construct({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ mesasge: "Error while getting the profile" });
  }
});

app.get("/posts/user/:userId", async (req, res) => {
  try {
    const userID = req.params.userId;
    const posts = await Post.find({ user: userID })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    if (!posts.length) {
      return res.status(404).json({ message: "No posts found for this user" });
    }
    res.status(200).json({ posts }); // Return posts as an object with a 'posts' key
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching posts", error });
  }
});

//dummy code
app.get("/users/:userId", (req, res) => {
  const loggedInUserId = req.params.userId;
  User.find({ _id: { $ne: loggedInUserId } })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log("Error retrieving users", err);
      res.status(500).json({ message: "Error retreiving user" });
    });
});

//end point to send a request to a user
app.post("/friend-request", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;
  try {
    //update the recepients friend request array
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { friendRequest: currentUserId },
    });
    //update the senders send frirnd request array
    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendRequest: selectedUserId },
    });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

//endpoint to show all the friend request of a pparticular user
app.get("/friend-request/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    //fetch the user document based on the User id
    const user = await User.findById(userId)
      .populate("friendRequest", "name email image")
      .lean();

    const friendRequests = user.friendRequest;
    res.json(friendRequests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//endpoint to accept a request of particular person
app.post("/friend-request/accept", async (req, res) => {
  try {
    const { senderId, recepientId } = req.body;
    //retreive the document of sender and the receipient
    const sender = await User.findById(senderId);
    const receipient = await User.findById(recepientId);

    receipient.friends.push(senderId);
    sender.friends.push(recepientId);

    receipient.friendRequest = receipient.friendRequest.filter(
      (request) => request.toString() !== senderId.toString()
    );

    sender.sentFriendRequest = sender.sentFriendRequest.filter(
      (request) => request.toString() !== receipient.toString()
    );
    await sender.save();
    await receipient.save();
    res.status(200).json({ message: "Friend request accepted successfully" });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//endpoint to access all the friends of logged in users
app.get("/accepted-friends/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "friends",
      "name email image"
    );
    const acceptedFriends = user.friends;
    res.json(acceptedFriends);
  } catch (error) {
    console.log("Error : ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
const multer = require("multer");
//configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); //specify the desired destination folder
  },
  filename: function (req, file, cb) {
    //generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
//end point to post messages and store in backend
app.post("/messages", upload.single("imageFile"), async (req, res) => {
  try {
    const { senderId, recepientId, messageType, messageText } = req.body;
    // if (messageType === "image" && req.file) {
    //   // Process image
    //   const imageUrl = req.file.path; // Path to the uploaded image
    //   // Save imageUrl to your database as needed
    // }

    const newMessage = new Message({
      senderId,
      recepientId,
      messageType,
      message: messageText,
      timestamp: new Date(),
      imageUrl: messageType === "image" ? req.file.path : null,
    });
    await newMessage.save();
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.log("Error : ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//end point to get the userDetails to design the chat room header

app.get("/user/recepient/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    //fetch the user data from the userID
    const recepientId = await User.findById(userId);

    res.json(recepientId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//endpoint to fetch the messages between two user in the chatroom
app.get("/messages/:senderId/:recepientId", async (req, res) => {
  try {
    const { senderId, recepientId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: senderId, recepientId: recepientId },
        { senderId: recepientId, recepientId: senderId },
      ],
    }).populate("senderId", "_id name");
    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/friends/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    User.findById(userId)
      .populate("friends")
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        const friendsIds = user.friends.map((friend) => friend._id);
        res.status(200).json(friendsIds);
      });
  } catch (error) {
    console.log("Error : ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/friend-requests/sent/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("sentFriendRequest", "name email image")
      .lean();
    const sentFriendRequests = user.sentFriendRequest;
    res.json(sentFriendRequests);
  } catch (error) {
    console.log("Error : ", error);
    res.status(500).json({ error: "Internal server " });
  }
});

app.post("/post/:postId/comment", async (req, res) => {
  const { postId } = req.params;
  const { userId, comment } = req.body;

  try {
    const post = await Post.findById(postId);
    post.replies.push({ user: userId, content: comment });
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
});

//endpoint to delete the messages!
app.post("/deleteMessages", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "Invalid request body!" });
    }
    await Message.deleteMany({ _id: { $in: messages } });
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log("Error : ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Get All Polls
app.get("/polls/:userId", async (req, res) => {
  const { type, creatorId, page = 1, limit = 10 } = req.query;
  const filter = {};
  const { userId } = req.params;

  if (type) filter.type = type;
  if (creatorId) filter.creator = creatorId;
  console.log("Data : ", { page, limit, filter });

  try {
    //Calculate pagination parameters
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    //Fetch polls with pagination
    const polls = await Poll.find(filter)
      .populate("creator", "name username email profileImageUrl")
      .populate({
        path: "responses.voterId",
        select: "username profileImageUrl name",
      })
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });
    //Add 'userHasVoted' flag for each poll
    const updatedPolls = polls.map((poll) => {
      const userHasVoted = poll.voters.some((voterId) =>
        voterId.equals(userId)
      );
      return {
        ...poll.toObject(),
        userHasVoted,
      };
    });

    //Get total count of polls for paginatin metadata
    const totalPolls = await Poll.countDocuments(filter);
    const stats = await Poll.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          type: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);
    //ensure all types are included in stats even those with zero counts
    const allTypes = [
      { type: "single-choice", label: "Single Choice" },
      { type: "yes/no", label: "Yes/No" },
      { type: "rating", label: "Rating" },
      { type: "image-based", label: "Image Based" },
      { type: "open-ended", label: "Open Ended" },
    ];
    const statsWithDefaults = allTypes
      .map((pollType) => {
        const stat = stats.find((item) => item.type === pollType.type);
        return {
          label: pollType.label,
          type: pollType.type,
          count: stat ? stat.count : 0,
        };
      })
      .sort((a, b) => b.count - a.count);
    res.status(200).json({
      polls: updatedPolls,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalPolls / pageSize),
      totalPolls,
      stats: statsWithDefaults,
    });
  } catch (err) {
    console.error("Error is : ", err);
    res
      .status(500)
      .json({ message: "Error fetching poll details : ", error: err.message });
  }
});

//Get Poll by id /polls/${userId}/${pollId}
app.get("/polls/:userId/:pollId", async (req, res) => {
  const { userId, pollId } = req.params; // Extract userId and pollId from URL

  try {
    const poll = await Poll.findById(pollId)
      .populate("creator", "username email")
      .populate({
        path: "responses.voterId",
        select: "username profileImageUrl name",
      });

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    res.status(200).json(poll);
  } catch (err) {
    res.status(500).json({
      message: "Server error while fetching poll",
      error: err.message,
    });
  }
});

//Vote on Poll
app.post("/polls/:userId/:pollId/vote", async (req, res) => {
  const { userId, pollId } = req.params;
  const { optionIndex, voterId, responseText } = req.body;
  console.log("USer is ", userId);
  try {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }
    if (poll.closed) {
      return res.status(400).json({ message: "Poll is closed" });
    }
    if (poll.voters.includes(voterId)) {
      return res
        .status(400)
        .json({ message: "User has already voted on this poll." });
    }

    if (poll.type === "open-ended") {
      if (!responseText) {
        return res
          .status(400)
          .json({ message: "Response text is required for open-ended polls." });
      }
      poll.responses.push({ voterId, responseText });
    } else {
      if (
        optionIndex === undefined ||
        optionIndex < 0 ||
        optionIndex >= poll.options.length
      ) {
        return res.status(400).json({ message: "Invalid option index." });
      }
      poll.options[optionIndex].votes += 1;
    }

    poll.voters.push(voterId);
    await poll.save();
    res.status(200).json(poll);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while voting on poll", error: err.message });
  }
});

app.get("/polls/:userId/:pollId/bookmark", async (req, res) => {
  const { userId, pollId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //Check if poll is already booked
    const isBookmarked = user.bookmarkedPolls.includes(pollId);
    if (isBookmarked) {
      //remove poll from bookmarks
      user.bookmarkedPolls = user.bookmarkedPolls.filter(
        (pollId) => pollId.toString() !== pollId
      );
      await user.save();
      return res.status(200).json({
        message: "Poll removed from bookmarks",
        bookmarkedPolls: user.bookmarkedPolls,
      });
    }
    //Add poll to bookmarks
    user.bookmarkedPolls.push(pollId);
    await user.save();
    res.status(200).json({
      message: "Poll bookmarked successfully",
      bookmarkedPolls: user.bookmarkedPolls,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error Bookmarking poll", error: err.message });
  }
});

//Grouup MEssaging

// Create a new group

app.post("/create", async (req, res) => {
  try {
    const { name, description, admin, members } = req.body;

    console.log("Received Data:", req.body); // ✅ Log incoming request data

    // Check if required fields are present
    if (!name || !admin) {
      return res
        .status(400)
        .json({ message: "Group name and adminId are required" });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(admin)) {
      return res.status(400).json({ message: "Invalid adminId format" });
    }

    const group = new Group({
      name,
      description: description || "", // Set default value if undefined
      admin: admin,
      members: [admin, ...(members || [])], // Ensure members exist
    });

    await group.save();
    res.status(201).json(group);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: "Error creating group", error });
  }
});

//Add members
app.post("/add-members", async (req, res) => {
  try {
    const { groupId, members } = req.body;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    group.members.push(...members);
    await group.save();

    res.json({ message: "Members added successfully", group });
  } catch (error) {
    res.status(500).json({ message: "Error adding members", error });
  }
});

//Send a group message
app.post("/send-message", async (req, res) => {
  try {
    const { senderId, groupId, messageType, message, imageUrl } = req.body;

    const newMessage = new Message({
      senderId,
      groupId,
      messageType,
      message,
      imageUrl,
    });

    await newMessage.save();

    await Group.findByIdAndUpdate(groupId, {
      $push: { messages: newMessage._id },
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
});

//Get a group message
app.get("/:groupId/messages", async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await Message.find({ groupId }).populate(
      "senderId",
      "name profilePicture"
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
});
// 📌 Get User's Groups
app.get("/groupList/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const groups = await Group.find({
      members: userId, // Fetch only groups where user is a member
    });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: "Error fetching groups" });
  }
});

//get users friend
app.get("/fetchFriendss/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "friends",
      "_id name image"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// 📌 1️⃣ Fetch Group Details
app.get("/groups/:groupId", async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate("admin", "_id name profilePicture") // Populate admin details
      .populate("members", "_id name profilePicture");
    if (!group) return res.status(404).json({ error: "Group not found" });
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: "Error fetching group details" });
  }
});

// 📌 2️⃣ Fetch Group Messages groups/${groupId}/messages
app.get("/groups/:groupId/messages", async (req, res) => {
  try {
    const messages = await Message.find({
      groupId: req.params.groupId,
    }).populate("senderId", "name profilePicture");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
});

//  Fetch User Details
app.get("/users/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user details" });
  }
});

// Send Message
app.post("/send-message", async (req, res) => {
  try {
    const { senderId, groupId, message, messageType } = req.body;

    const newMessage = new Message({ senderId, groupId, message, messageType });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Error sending message" });
  }
});

//endpoint to create a report
app.post("/report", async (req, res) => {
  try {
    const { postId, reportedBy, reason, reportedAt } = req.body;

    // Validate request
    if (!postId || !reportedBy || !reason) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the post exists
    const postExists = await Post.findById(postId);
    if (!postExists) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Create and save report
    const report = new Report({ postId, reportedBy, reason, reportedAt });
    await report.save();

    res
      .status(200)
      .json({ success: true, message: "Report submitted successfully." });
  } catch (error) {
    console.error("Error reporting post:", error);
    res
      .status(500)
      .json({ message: "An error occurred while reporting the post." });
  }
});