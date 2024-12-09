import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import midtransClient from "midtrans-client";
import nodemailer from "nodemailer";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Midtrans Configuration
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// LimeSurvey Configuration
const LS_BASEURL = "https://test.suxesstories.com/admin/remotecontrol";
const LS_USER = process.env.LS_USER;
const LS_PASSWORD = process.env.LS_PASSWORD;

// LimeSurvey Functions
const getSessionKey = async () => {
  const response = await axios.post(LS_BASEURL, {
    method: "get_session_key",
    params: [LS_USER, LS_PASSWORD],
    id: 1,
  });
  return response.data.result;
};

const addParticipant = async (sessionKey, surveyID, participant) => {
  const response = await axios.post(LS_BASEURL, {
    method: "add_participants",
    params: [sessionKey, surveyID, [participant], true],
    id: 1,
  });
  return response.data.result;
};

const releaseSessionKey = async (sessionKey) => {
  await axios.post(LS_BASEURL, {
    method: "release_session_key",
    params: [sessionKey],
    id: 1,
  });
};

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/email-event", async (req, res) => {
  const { email, tests, name } = req.body;

  try {
    const mailOptions = {
      from: '"Event Organizer" <your-email@gmail.com>',
      to: email,
      subject: "Event Registration Confirmation",
      html: `
        <h1>Hi ${name},</h1>
        <p>Thank you for registering for the event.</p>
        <p>Here are your test details:</p>
        <ul>
          ${tests
            .map((test) => `<li>${test.title} : ${test.link}</li>`)
            .join("")}
        </ul>
        <p>We look forward to seeing you at the event!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/api/assign-event", async (req, res) => {
  const { event, form, tests } = req.body;

  try {
    // Jika pembayaran tidak diperlukan, lanjutkan proses LimeSurvey
    if (!event.payment) {
      // 1. Dapatkan session key dari LimeSurvey
      const sessionKey = await getSessionKey();

      // 2. Tambahkan peserta ke survei
      const surveyID = event.survey_id; // Pastikan survey_id tersedia dalam event
      const participant = {
        firstname: form.name,
        email: form.email,
      };
      const participantResponse = await addParticipant(sessionKey, surveyID, participant);

      // 3. Dapatkan token survei
      const token = participantResponse[0].token;

      // 4. Buat tautan survei
      const surveyLink = `https://test.suxesstories.com/index.php/${surveyID}?token=${token}`;

      // 5. Kirim email dengan tautan survei
      const mailOptions = {
        from: '"Event Organizer" <no-reply@suxesstories.com>',
        to: form.email,
        subject: "Your Test Link",
        html: `
          <h1>Hi ${form.name},</h1>
          <p>This is your test link for the event <strong>${event.name}</strong>:</p>
          <a href="${surveyLink}" target="_blank">${surveyLink}</a>
          <p>Good luck!</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      // 6. Lepaskan session key LimeSurvey
      await releaseSessionKey(sessionKey);

      return res.json({ message: "Participant added and email sent successfully" });
    }

    // Proses pembayaran melalui Midtrans
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

    return res.json({
      paymentToken: transaction.token,
      orderId,
    });
  } catch (error) {
    console.error("Error assigning event:", error);
    return res.status(500).json({ message: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
