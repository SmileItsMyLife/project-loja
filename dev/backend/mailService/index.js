require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sendVerificationEmail = require("./mail/sendVerificationEmail");
const ApiError = require("./error/ApiError");

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON bodies

const PORT = process.env.PORT || 4244;

// Health-check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Email Service" });
});

/**
 * POST /send-verification
 * Body: { "toEmail": "user@example.com", "verificationLink": "https://…" }
 */
app.post("/send-verification", async (req, res, next) => {
    console.log(req.body)
  const { toEmail, verificationLink } = req.body;

  // Basic input validation
  if (!toEmail || !verificationLink) {
    return next(ApiError.badRequest("Missing toEmail or verificationLink"));
  }

  try {
    await sendVerificationEmail(toEmail, verificationLink);
    return res.json({ success: true, message: "Email sent" });
  } catch (err) {
    // If it’s an ApiError, forward it; otherwise wrap in a generic error
    if (err instanceof ApiError) {
      return next(err);
    }
    return next(ApiError.internal("Unexpected error sending email"));
  }
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("💥 API ERROR:", err);
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ success: false, message });
});

app.listen(PORT, () => {
  console.log(`🚀 Email Service listening on port ${PORT}`);
});
