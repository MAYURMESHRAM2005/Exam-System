const { body, validationResult } = require("express-validator");
const { PROCTOR_EVENT_TYPES } = require("./../utils/proctorEventTypes");

/* =========================
   SHARED VALIDATION CHECKER
   Run after the rule arrays below; returns the first error message
========================= */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

/* =========================
   PASSWORD STRENGTH
   Min 8 chars, at least one uppercase, one lowercase, one digit, one
   special character. Shared across register / reset-password / change-password.
========================= */
const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const STRONG_PASSWORD_MESSAGE =
  "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character";

exports.strongPassword = (field) =>
  body(field)
    .matches(STRONG_PASSWORD_REGEX)
    .withMessage(STRONG_PASSWORD_MESSAGE);

/* =========================
   AUTH VALIDATION
========================= */
exports.registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),
  body("password")
    .matches(STRONG_PASSWORD_REGEX)
    .withMessage(STRONG_PASSWORD_MESSAGE),
  // Public registration may only create student or instructor accounts.
  body("role")
    .optional()
    .isIn(["student", "instructor"])
    .withMessage("Role must be 'student' or 'instructor'"),
];

exports.loginValidation = [
  body("email")
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  body("rememberMe").optional().isBoolean().toBoolean(),
];

exports.googleAuthValidation = [
  body("credential")
    .isString()
    .notEmpty()
    .withMessage("Missing Google credential"),
  body("role")
    .optional()
    .isIn(["student", "instructor"])
    .withMessage("Role must be 'student' or 'instructor'"),
  body("rememberMe").optional().isBoolean().toBoolean(),
];

exports.verifyEmailValidation = [
  body("email")
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),
  body("otp")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
    .isNumeric()
    .withMessage("OTP must be 6 digits"),
];

exports.resendOtpValidation = [
  body("email")
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),
];

exports.forgotPasswordValidation = [
  body("email")
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),
];

exports.resetPasswordValidation = [
  body("email")
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),
  body("token").notEmpty().withMessage("Reset token is required"),
  body("newPassword")
    .matches(STRONG_PASSWORD_REGEX)
    .withMessage(STRONG_PASSWORD_MESSAGE),
];

exports.changePasswordValidation = [
  body("oldPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .matches(STRONG_PASSWORD_REGEX)
    .withMessage(STRONG_PASSWORD_MESSAGE),
];

/* =========================
   EMAIL CHANGE VALIDATION
========================= */
exports.requestEmailChangeValidation = [
  body("newEmail")
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Your current password is required"),
];

exports.confirmEmailChangeValidation = [
  body("otp")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
    .isNumeric()
    .withMessage("OTP must be 6 digits"),
];

/* =========================
   EXAM VALIDATION
========================= */
exports.createExamValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("courseCode").trim().notEmpty().withMessage("Course code is required"),
  body("duration")
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive number of minutes"),
  body("totalMarks")
    .isInt({ min: 1 })
    .withMessage("Total marks must be a positive number"),
  body("passingMarks")
    .isInt({ min: 0 })
    .withMessage("Passing marks must be zero or a positive number")
    .custom((value, { req }) => {
      if (Number(value) > Number(req.body.totalMarks)) {
        throw new Error("Passing marks cannot be greater than total marks");
      }
      return true;
    }),
  body("date").notEmpty().withMessage("Date is required"),
  body("time").notEmpty().withMessage("Time is required"),
];

exports.updateExamValidation = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("courseCode").optional().trim().notEmpty().withMessage("Course code cannot be empty"),
  body("duration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive number of minutes"),
  body("totalMarks")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Total marks must be a positive number"),
  body("passingMarks")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Passing marks must be zero or a positive number")
    .custom((value, { req }) => {
      if (req.body.totalMarks !== undefined && Number(value) > Number(req.body.totalMarks)) {
        throw new Error("Passing marks cannot be greater than total marks");
      }
      return true;
    }),
];

/* =========================
   RESULT / EXAM-TAKING VALIDATION
========================= */
exports.saveAnswerValidation = [
  body("questionId").notEmpty().withMessage("questionId is required"),
  body("selectedAnswer")
    .optional({ checkFalsy: false })
    .isString()
    .withMessage("selectedAnswer must be a string"),
  body("sessionToken").notEmpty().withMessage("sessionToken is required"),
];

exports.submitExamValidation = [
  body("sessionToken").notEmpty().withMessage("sessionToken is required"),
  body("answers")
    .optional()
    .isArray()
    .withMessage("answers must be an array"),
];

/* =========================
   PROCTORING VALIDATION (Phase 1 — Foundation)
========================= */
exports.startProctorSessionValidation = [
  body("examId").notEmpty().withMessage("examId is required"),
  body("cameraStatus")
    .optional()
    .isIn(["pending", "granted", "denied", "unavailable"])
    .withMessage("Invalid cameraStatus"),
  body("microphoneStatus")
    .optional()
    .isIn(["pending", "granted", "denied", "unavailable"])
    .withMessage("Invalid microphoneStatus"),
];

exports.logProctorEventValidation = [
  body("eventType")
    .notEmpty()
    .withMessage("eventType is required")
    .isIn(PROCTOR_EVENT_TYPES)
    .withMessage("Invalid eventType"),
];

/* =========================
   STUDENT PROFILE VALIDATION
========================= */
const MOBILE_REGEX = /^[0-9]{7,15}$/; // digits only, 7-15 — deliberately loose about country-code formatting

exports.updateStudentProfileValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("phone")
    .optional({ checkFalsy: true })
    .customSanitizer((v) => String(v).replace(/[\s-()]/g, ""))
    .matches(MOBILE_REGEX)
    .withMessage("Enter a valid mobile number (7-15 digits)"),
  body("dateOfBirth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Date of birth must be a valid date")
    .custom((value) => {
      const dob = new Date(value);
      const now = new Date();
      if (dob > now) throw new Error("Date of birth cannot be in the future");
      const age = (now - dob) / (1000 * 60 * 60 * 24 * 365.25);
      if (age > 120) throw new Error("Date of birth is not valid");
      return true;
    }),
  body("gender")
    .optional({ checkFalsy: true })
    .isIn(["male", "female", "other", "prefer_not_to_say"])
    .withMessage("Invalid gender value"),
  body("address").optional().trim().isLength({ max: 300 }).withMessage("Address is too long"),
  body("city").optional().trim().isLength({ max: 100 }).withMessage("City is too long"),
  body("state").optional().trim().isLength({ max: 100 }).withMessage("State is too long"),
  body("country").optional().trim().isLength({ max: 100 }).withMessage("Country is too long"),
  body("bio").optional().trim().isLength({ max: 1000 }).withMessage("Bio is too long"),
  body("enrollmentNumber").optional().trim().isLength({ max: 50 }).withMessage("Enrollment number is too long"),
  body("collegeName").optional().trim().isLength({ max: 200 }).withMessage("College name is too long"),
  body("branch").optional().trim().isLength({ max: 100 }).withMessage("Branch is too long"),
  body("semester").optional().trim().isLength({ max: 20 }).withMessage("Semester is too long"),
  body("rollNumber").optional().trim().isLength({ max: 50 }).withMessage("Roll number is too long"),
];

exports.uploadProfilePhotoValidation = [
  body("image").notEmpty().withMessage("Image data is required"),
];
