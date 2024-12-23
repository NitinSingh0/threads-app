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
app.post("/register", async (requestAnimationFrame, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registed" });
    }

    //create a new user
    const newUser = new User({ name, email, password });

    //generate and store the verification token
    newUser.verifactionToken = crypto.randomBytes(20).toString("hex");

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
    service: "gamil",
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
    text: "please click the following link to verify your email http://localhost:3000/verify/${verificationToken}",
  };
  try {
    await transporter.sendMail(mailOption);
  } catch (error) {
    console.log("error sensing email", error);
  }
}
app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }

    user.verified = true;
    user.verificationtoken = undefined;
    await user.save();

  } catch (error) {
    console.log("error getting token", error);
    res.status(500).json({ message: "Email verification failed" })
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
}
const secretKey = generateSecretKey();

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({message:"Invallid email or password"})
    }
    if (user.password != password) {
      return res.status(404).json({message:"Invalid email or password"})
    }
    const token = jwt.sign({ userId: user._id }, secretKey);
    res.status(500).json({ message: "Login failed" });
  }
    catch (error) {
    res.status(500).json({ message: "Login failed" });
    }
  
})