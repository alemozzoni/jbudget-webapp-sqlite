const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tag = sequelize.define('Tag', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(7), // #RRGGBB
      allowNull: false,
      defaultValue: '#3498db',
      validate: {
        is: /^#[0-9A-F]{6}$/i
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'tags',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'name']
      }
    ]
  });

  // Associations
  Tag.associate = (models) => {
    Tag.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Tag.belongsToMany(models.Transaction, {
      through: 'transaction_tags',
      foreignKey: 'tag_id',
      otherKey: 'transaction_id',
      as: 'transactions'
    });
  };

  return Tag;
};
