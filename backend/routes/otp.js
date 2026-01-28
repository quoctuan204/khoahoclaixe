require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

app.post("/api/send-otp", async (req, res) => {
  try {
    const { phone } = req.body; // +84xxxxxxxxx

    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications
      .create({
        to: phone,
        channel: "sms"
      });

    res.json({
      success: true,
      sid: verification.sid
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.post("/api/verify-otp", async (req, res) => {
  try {
    const { phone, code } = req.body;

    const check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks
      .create({
        to: phone,
        code
      });

    if (check.status === "approved") {
      return res.json({ success: true });
    }

    res.status(400).json({
      success: false,
      message: "OTP không đúng"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

await fetch("http://localhost:5000/api/send-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    phone: "+840349292958"
  })
});
