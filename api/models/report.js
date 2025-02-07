const express = require("express");
const mongoose = require("mongoose");

//const router = express.Router();

// Report Schema
const ReportSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: { type: String, required: true },
  report_status: {
    type: String,
    enum: ["checked", "not-checked"],
    default:"not-checked",
  },
  reportedAt: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", ReportSchema);
module.exports = Report;

  // Report Post API
//   router.post("/report", async (req, res) => {
//     try {
//       const { postId, reportedBy, reason } = req.body;

//       if (!postId || !reportedBy || !reason) {
//         return res
//           .status(400)
//           .json({ success: false, message: "All fields are required" });
//       }

//       const newReport = new Report({ postId, reportedBy, reason });
//       await newReport.save();

//       res.json({ success: true, message: "Report submitted successfully" });
//     } catch (error) {
//       console.error("Error reporting post:", error);
//       res
//         .status(500)
//         .json({ success: false, message: "Internal Server Error" });
//     }
//   });

// module.exports = router;
