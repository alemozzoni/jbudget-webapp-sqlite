const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().notEmpty().withMessage('Name is required')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required')
];

const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

// @route   POST /api/auth/register
router.post('/register', registerValidation, authController.register);

// @route   POST /api/auth/login
router.post('/login', loginValidation, authController.login);

// @route   GET /api/auth/me
router.get('/me', auth, authController.getMe);

// @route   PUT /api/auth/profile
router.put('/profile', auth, updateProfileValidation, authController.updateProfile);

// @route   PUT /api/auth/password
router.put('/password', auth, updatePasswordValidation, authController.updatePassword);

// @route   DELETE /api/auth/account
router.delete('/account', auth, authController.deleteAccount);

module.exports = router;
