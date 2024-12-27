const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

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

//enspoint to accepet all the user except the loggen in user

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
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ messsage: "An error occured while fetching post" });
  }
});