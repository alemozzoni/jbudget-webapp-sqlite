const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const tagController = require('../controllers/tagController');
const auth = require('../middleware/auth');

// Validation rules
const tagValidation = [
  body('name').trim().notEmpty().withMessage('Tag name is required'),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color must be in #RRGGBB format'),
  body('description').optional().trim()
];

// All routes are protected
router.use(auth);

// @route   GET /api/tags
router.get('/', tagController.getTags);

// @route   GET /api/tags/:id
router.get('/:id', tagController.getTag);

// @route   POST /api/tags
router.post('/', tagValidation, tagController.createTag);

// @route   PUT /api/tags/:id
router.put('/:id', tagValidation, tagController.updateTag);

// @route   DELETE /api/tags/:id
router.delete('/:id', tagController.deleteTag);

module.exports = router;
