const Joi = require('joi');
const AppError = require('../utils/appError');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details.map((el) => el.message).join('. ');
      return next(new AppError(message, 400));
    }
    next();
  };
};

const signupSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Please provide your name',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Please provide your email',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Please provide a password',
  }),
  role: Joi.string().valid('Student', 'Faculty', 'Admin').default('Student'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Please provide your email',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Please provide your password',
  }),
});

const resourceSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().required(),
  category: Joi.string()
    .valid(
      'Notes',
      'PYQs',
      'Lab Manuals',
      'Placement Preparation',
      'Resume Templates',
      'Coding Sheets',
      'Interview Experiences',
      'Projects'
    )
    .required(),
});

module.exports = {
  validateRequest,
  signupSchema,
  loginSchema,
  resourceSchema,
};
