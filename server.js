const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const midtransClient = require("midtrans-client");
const nodemailer = require("nodemailer");
const axios = require("axios");
const admin = require("firebase-admin");
require("dotenv").config();

// Initialize Express App
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase
const serviceAccount = require("./firebase-service-account.json"); // File JSON Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Midtrans Configuration
const snap = new midtransClient.Snap({
  isProduction: false, // Set to true for production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Your email
    pass: process.env.GMAIL_PASS, // Your email password or app password
  },
});

// LimeSurvey Configuration
const LS_BASEURL = process.env.LS_BASEURL;
const LS_USER = process.env.LS_USER;
const LS_PASSWORD = process.env.LS_PASSWORD;

// Helper Functions for LimeSurvey
const getSessionKey = async () => {
  try {
    const response = await axios.post(LS_BASEURL, {
      method: "get_session_key",
      params: [LS_USER, LS_PASSWORD],
      id: 1,
    });
    if (response.data.error) throw new Error(response.data.error);
    return response.data.result;
  } catch (error) {
    console.error("Error getting LimeSurvey session key:", error.message);
    throw error;
  }
};

const addParticipant = async (sessionKey, surveyID, participant) => {
  try {
    const response = await axios.post(LS_BASEURL, {
      method: "add_participants",
      params: [sessionKey, surveyID, [participant], true],
      id: 1,
    });
    if (response.data.error) throw new Error(response.data.error);
    return response.data.result;
  } catch (error) {
    console.error("Error adding participant to LimeSurvey:", error.message);
    throw error;
  }
};

const releaseSessionKey = async (sessionKey) => {
  try {
    const response = await axios.post(LS_BASEURL, {
      method: "release_session_key",
      params: [sessionKey],
      id: 1,
    });
    if (response.data.error) throw new Error(response.data.error);
  } catch (error) {
    console.error("Error releasing LimeSurvey session key:", error.message);
  }
};

// Fetch Tests from Firebase
const getTests = async () => {
  const testsSnapshot = await db.collection("tests").get();
  return testsSnapshot.docs.map((doc) => doc.data());
};

// Routes
app.get("/", (req, res) => {
  res.send("Hello World! Server is running.");
});

app.post("/api/email-event", async (req, res) => {
  const { email, tests, name } = req.body;

  try {
    const mailOptions = {
      from: '"Event Organizer" <no-reply@example.com>',
      to: email,
      subject: "Event Registration Confirmation",
      html: `
        <h1>Hi ${name},</h1>
        <p>Thank you for registering for the event.</p>
        <p>Here are your test details:</p>
        <ul>
          ${tests
            .map((test) => `<li>${test.title}: <a href="${test.link}">${test.link}</a></li>`)
            .join("")}
        </ul>
        <p>Good luck!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/assign-event", async (req, res) => {
  const { event, form } = req.body;

  try {
    // Fetch related tests from Firebase
    const tests = await getTests();
    const selectedTests = tests.filter((test) => test.surveyID === event.survey_id);

    if (!selectedTests.length) {
      return res.status(400).json({ message: "No tests found for this event." });
    }

    if (!event.payment) {
      // If payment is not required, register participant with LimeSurvey
      const sessionKey = await getSessionKey();
      const surveyID = event.survey_id;

      const participant = {
        firstname: form.name,
        email: form.email,
      };

      const participantResponse = await addParticipant(sessionKey, surveyID, participant);

      if (!participantResponse || participantResponse.length === 0 || !participantResponse[0]?.token) {
        throw new Error("Failed to retrieve token from LimeSurvey.");
      }

      const token = participantResponse[0].token;
      const surveyLink = `${LS_BASEURL}/index.php/${surveyID}?token=${token}`;

      // Send email with survey link
      const mailOptions = {
        from: '"Event Organizer" <no-reply@example.com>',
        to: form.email,
        subject: `Your Test Link: ${event.name}`,
        html: `
          <h1>Hi ${form.name},</h1>
          <p>Thank you for registering for the event <strong>${event.name}</strong>.</p>
          <p>This is your test link:</p>
          <a href="${surveyLink}" target="_blank">${surveyLink}</a>
          <p>Good luck!</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      await releaseSessionKey(sessionKey);
      return res.json({ message: "Participant registered and email sent successfully." });
    }

    // If payment is required, create Midtrans transaction
    const orderId = `EVENT-${event.id}-${Date.now()}`;
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: parseInt(event.amount),
      },
      customer_details: {
        first_name: form.name,
        email: form.email,
      },
      item_details: [
        {
          id: event.id,
          price: parseInt(event.amount),
          quantity: 1,
          name: event.name,
        },
      ],
    };

    const transaction = await snap.createTransaction(parameter);
    res.json({ paymentToken: transaction.token, orderId });
  } catch (error) {
    console.error("Error processing event:", error);
    res.status(500).json({ message: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
