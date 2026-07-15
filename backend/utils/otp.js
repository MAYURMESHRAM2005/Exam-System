const crypto = require("crypto");

// 6-digit numeric OTP, cryptographically random (not Math.random()).
const generateOTP = () => String(crypto.randomInt(100000, 1000000));

const hashOTP = (otp) =>
  crypto.createHash("sha256").update(String(otp)).digest("hex");

module.exports = { generateOTP, hashOTP };
