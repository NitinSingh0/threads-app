const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  image: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
  },
  backgroundPicture: {
    type: String,
    default:
      "https://img.freepik.com/free-vector/colored-points-connected-net_1048-12426.jpg?ga=GA1.1.1157197616.1706377125&semt=ais_hybrid",
  },
  bio: {
    type: String,
  },
  course: {
    type: String,
  },
  userRole: {
    type: String,
  },
  passingYear: {
    type:String,
  },
  joinedDate: { type: Date, default: Date.now },
  sentFollowRequest: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  receivedFollowRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ],
  friendRequest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  sentFriendRequest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  verified: {
    type: Boolean,
    default: false,
  },
  verficationToken: String,
});
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
