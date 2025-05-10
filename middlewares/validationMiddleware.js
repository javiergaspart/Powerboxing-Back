// src/middleware/validationMiddleware.js

const { body, validationResult } = require('express-validator');

const validateSession = [
  body('date')
    .isISO8601().withMessage('Date must be a valid date format (ISO 8601).'),
  body('timeSlot')
    .isString().withMessage('Time slot must be a string.'),
  body('participants')
    .isArray().withMessage('Participants must be an array of user IDs.')
    .notEmpty().withMessage('Participants array cannot be empty.'),
  body('punchingBags')
    .isArray().withMessage('Punching bags must be an array of punching bag IDs.')
    .notEmpty().withMessage('Punching bags array cannot be empty.'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateSession,
  handleValidationErrors,
};
