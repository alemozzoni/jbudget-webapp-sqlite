const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    type: {
      type: DataTypes.ENUM('INCOME', 'EXPENSE'),
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    payment_method: {
      type: DataTypes.ENUM('CASH', 'CARD', 'BANK_TRANSFER', 'OTHER'),
      allowNull: true,
      defaultValue: 'CASH'
    },
    recurrence_type: {
      type: DataTypes.ENUM('NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'),
      defaultValue: 'NONE'
    }
  }, {
    tableName: 'transactions',
    indexes: [
      {
        fields: ['user_id', 'date']
      },
      {
        fields: ['user_id', 'type']
      }
    ]
  });

  // Associations
  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Transaction.belongsToMany(models.Tag, {
      through: 'transaction_tags',
      foreignKey: 'transaction_id',
      otherKey: 'tag_id',
      as: 'tags'
    });
  };

  return Transaction;
};
