const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

// Validation rules
const transactionValidation = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('type').isIn(['INCOME', 'EXPENSE']).withMessage('Type must be INCOME or EXPENSE'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('recurrence_type').optional().isIn(['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  body('tagIds').optional().isArray().withMessage('Tag IDs must be an array')
];

// All routes are protected
router.use(auth);

// @route   GET /api/transactions/stats
router.get('/stats', transactionController.getStatistics);

// @route   GET /api/transactions
router.get('/', transactionController.getTransactions);

// @route   GET /api/transactions/:id
router.get('/:id', transactionController.getTransaction);

// @route   POST /api/transactions
router.post('/', transactionValidation, transactionController.createTransaction);

// @route   PUT /api/transactions/:id
router.put('/:id', transactionValidation, transactionController.updateTransaction);

// @route   DELETE /api/transactions/:id
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
