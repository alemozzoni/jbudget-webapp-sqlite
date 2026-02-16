const { Transaction, Tag } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// @route   GET /api/transactions
// @desc    Get all transactions for logged user
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const { type, startDate, endDate, tagId, search } = req.query;

    // Build query filters
    const where = { user_id: req.user.id };

    if (type) {
      where.type = type;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = startDate;
      if (endDate) where.date[Op.lte] = endDate;
    }

    if (search) {
      where.description = {
        [Op.iLike]: `%${search}%`
      };
    }

    // Query options
    const queryOptions = {
      where,
      include: [{
        model: Tag,
        as: 'tags',
        through: { attributes: [] }
      }],
      order: [['date', 'DESC'], ['created_at', 'DESC']]
    };

    // Filter by tag if specified
    if (tagId) {
      queryOptions.include[0].where = { id: tagId };
      queryOptions.include[0].required = true;
    }

    const transactions = await Transaction.findAll(queryOptions);

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @route   GET /api/transactions/:id
// @desc    Get single transaction
// @access  Private
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      include: [{
        model: Tag,
        as: 'tags',
        through: { attributes: [] }
      }]
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @route   POST /api/transactions
// @desc    Create new transaction
// @access  Private
exports.createTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { amount, type, date, description, recurrence_type, payment_method, tagIds } = req.body;

    // Create transaction
    const transaction = await Transaction.create({
      user_id: req.user.id,
      amount,
      type,
      date,
      description,
      payment_method: payment_method || 'CASH',
      recurrence_type: recurrence_type || 'NONE'
    });

    // Add tags if provided
    if (tagIds && tagIds.length > 0) {
      const tags = await Tag.findAll({
        where: {
          id: tagIds,
          user_id: req.user.id
        }
      });
      await transaction.setTags(tags);
    }

    // Fetch complete transaction with tags
    const completeTransaction = await Transaction.findByPk(transaction.id, {
      include: [{
        model: Tag,
        as: 'tags',
        through: { attributes: [] }
      }]
    });

    res.status(201).json({
      success: true,
      data: completeTransaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @route   PUT /api/transactions/:id
// @desc    Update transaction
// @access  Private
exports.updateTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    const { amount, type, date, description, recurrence_type, payment_method, tagIds } = req.body;

    // Update transaction
    await transaction.update({
      amount,
      type,
      date,
      description,
      payment_method,
      recurrence_type
    });

    // Update tags if provided
    if (tagIds !== undefined) {
      if (tagIds.length === 0) {
        await transaction.setTags([]);
      } else {
        const tags = await Tag.findAll({
          where: {
            id: tagIds,
            user_id: req.user.id
          }
        });
        await transaction.setTags(tags);
      }
    }

    // Fetch updated transaction
    const updatedTransaction = await Transaction.findByPk(transaction.id, {
      include: [{
        model: Tag,
        as: 'tags',
        through: { attributes: [] }
      }]
    });

    res.json({
      success: true,
      data: updatedTransaction
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction
// @access  Private
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    await transaction.destroy();

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @route   GET /api/transactions/stats
// @desc    Get statistics
// @access  Private
exports.getStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = { user_id: req.user.id };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = startDate;
      if (endDate) where.date[Op.lte] = endDate;
    }

    const transactions = await Transaction.findAll({
      where,
      include: [{
        model: Tag,
        as: 'tags',
        through: { attributes: [] }
      }]
    });

    // Calculate statistics
    const stats = {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      transactionCount: transactions.length,
      byType: {
        INCOME: 0,
        EXPENSE: 0
      },
      byTag: {},
      byMonth: {},
      byPaymentMethod: {
        CASH: { income: 0, expense: 0, count: 0 },
        CARD: { income: 0, expense: 0, count: 0 },
        BANK_TRANSFER: { income: 0, expense: 0, count: 0 },
        OTHER: { income: 0, expense: 0, count: 0 }
      }
    };

    transactions.forEach(t => {
      const amount = parseFloat(t.amount);
      
      if (t.type === 'INCOME') {
        stats.totalIncome += amount;
        stats.byType.INCOME++;
      } else {
        stats.totalExpense += amount;
        stats.byType.EXPENSE++;
      }

      // By tag
      t.tags.forEach(tag => {
        if (!stats.byTag[tag.name]) {
          stats.byTag[tag.name] = { income: 0, expense: 0, count: 0 };
        }
        stats.byTag[tag.name].count++;
        if (t.type === 'INCOME') {
          stats.byTag[tag.name].income += amount;
        } else {
          stats.byTag[tag.name].expense += amount;
        }
      });

      // By month
      const month = t.date.substring(0, 7); // YYYY-MM
      if (!stats.byMonth[month]) {
        stats.byMonth[month] = { income: 0, expense: 0 };
      }
      if (t.type === 'INCOME') {
        stats.byMonth[month].income += amount;
      } else {
        stats.byMonth[month].expense += amount;
      }

      // By payment method
      const paymentMethod = t.payment_method || 'CASH';
      if (stats.byPaymentMethod[paymentMethod]) {
        stats.byPaymentMethod[paymentMethod].count++;
        if (t.type === 'INCOME') {
          stats.byPaymentMethod[paymentMethod].income += amount;
        } else {
          stats.byPaymentMethod[paymentMethod].expense += amount;
        }
      }
    });

    stats.balance = stats.totalIncome - stats.totalExpense;

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
