const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

/* =========================
   PROTECT
   Verifies the JWT and attaches the logged-in user to req.user
========================= */
exports.protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Not authorized, no token provided');
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const error = new Error(
      err.name === 'TokenExpiredError'
        ? 'Session expired, please log in again'
        : 'Invalid token'
    );
    error.statusCode = 401;
    return next(error);
  }

  // Make sure the user still exists (e.g. wasn't deleted after the token was issued)
  const user = await User.findById(decoded.id).select('-password +passwordChangedAt');

  if (!user) {
    const error = new Error('User no longer exists');
    error.statusCode = 401;
    return next(error);
  }

  // If the password was changed after this token was issued, the token is stale.
  if (user.passwordChangedAt && decoded.iat) {
    const changedAtSeconds = Math.floor(user.passwordChangedAt.getTime() / 1000);
    if (decoded.iat < changedAtSeconds) {
      const error = new Error('Password was recently changed. Please log in again.');
      error.statusCode = 401;
      return next(error);
    }
  }

  req.user = user;
  next();
});

/* =========================
   INSTRUCTOR ONLY
========================= */
exports.instructorOnly = (req, res, next) => {
  if (req.user.role !== 'instructor') {
    const error = new Error('Access denied. Instructor only.');
    error.statusCode = 403;
    return next(error);
  }
  next();
};


