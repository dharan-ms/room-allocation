const nodemailer = require("nodemailer");

const isEmailConfigAvailable = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);

const sendOtpEmail = async ({ to, otp, name = "Student" }) => {
  if (!isEmailConfigAvailable()) {
    console.log(`[DEV OTP] Email config missing. OTP for ${to}: ${otp}`);
    return { delivered: false };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: "Smart Hostel Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Password Reset OTP</h2>
        <p>Hello ${name},</p>
        <p>Your OTP for password reset is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
  return { delivered: true };
};

module.exports = { sendOtpEmail, isEmailConfigAvailable };
