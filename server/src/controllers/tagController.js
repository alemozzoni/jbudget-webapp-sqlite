const { Tag, Transaction } = require('../models');
const { validationResult } = require('express-validator');

// @route   GET /api/tags
// @desc    Get all tags for logged user
// @access  Private
exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.findAll({
      where: { user_id: req.user.id },
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @route   GET /api/tags/:id
// @desc    Get single tag
// @access  Private
exports.getTag = async (req, res) => {
  try {
    const tag = await Tag.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      include: [{
        model: Transaction,
        as: 'transactions',
        through: { attributes: [] }
      }]
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    res.json({
      success: true,
      data: tag
    });
  } catch (error) {
    console.error('Get tag error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @route   POST /api/tags
// @desc    Create new tag
// @access  Private
exports.createTag = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, color, description } = req.body;

    // Check if tag with same name exists
    const existingTag = await Tag.findOne({
      where: {
        user_id: req.user.id,
        name
      }
    });

    if (existingTag) {
      return res.status(400).json({
        success: false,
        message: 'Tag with this name already exists'
      });
    }

    // Create tag
    const tag = await Tag.create({
      user_id: req.user.id,
      name,
      color: color || '#3498db',
      description
    });

    res.status(201).json({
      success: true,
      data: tag
    });
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @route   PUT /api/tags/:id
// @desc    Update tag
// @access  Private
exports.updateTag = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const tag = await Tag.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    const { name, color, description } = req.body;

    // Check if new name conflicts with existing tag
    if (name && name !== tag.name) {
      const existingTag = await Tag.findOne({
        where: {
          user_id: req.user.id,
          name
        }
      });

      if (existingTag) {
        return res.status(400).json({
          success: false,
          message: 'Tag with this name already exists'
        });
      }
    }

    // Update tag
    await tag.update({
      name: name || tag.name,
      color: color || tag.color,
      description: description !== undefined ? description : tag.description
    });

    res.json({
      success: true,
      data: tag
    });
  } catch (error) {
    console.error('Update tag error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @route   DELETE /api/tags/:id
// @desc    Delete tag
// @access  Private
exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    await tag.destroy();

    res.json({
      success: true,
      message: 'Tag deleted successfully'
    });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
