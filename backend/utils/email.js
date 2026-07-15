const nodemailer = require("nodemailer");

let transporter = null;

/* =========================================================
   TRANSPORT RESOLUTION
   - Production: SMTP credentials are required. The server refuses to send
     (and logs a hard error) rather than silently pretending to succeed.
   - Development: if no SMTP credentials are configured, emails are printed
     to the server console instead of being sent. The OTP / reset token
     inside each email is always a real, randomly-generated value that is
     genuinely persisted (hashed) in the database — only the delivery
     transport changes, purely so the auth flows are testable locally
     without needing real SMTP credentials.
========================================================= */
const getTransporter = () => {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    return transporter;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS."
    );
  }

  transporter = {
    sendMail: async (mailOptions) => {
      console.log(
        "\n========== DEV EMAIL (no SMTP configured — set SMTP_HOST/PORT/USER/PASS to send for real) =========="
      );
      console.log("To:", mailOptions.to);
      console.log("Subject:", mailOptions.subject);
      console.log(mailOptions.text || mailOptions.html);
      console.log(
        "======================================================================================\n"
      );
      return { messageId: "dev-console-" + Date.now() };
    },
  };
  return transporter;
};

const sendEmail = async ({ to, subject, text, html }) => {
  const t = getTransporter();
  await t.sendMail({
    from: process.env.EMAIL_FROM || "ExamSecure AI <no-reply@examsecure.ai>",
    to,
    subject,
    text,
    html,
  });
};

module.exports = { sendEmail };
