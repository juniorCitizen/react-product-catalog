const uuidV4 = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define('products', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidV4().toUpperCase(),
      validate: { isUUID: 4 }
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'uniquProductCode'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    specification: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    seriesId: {
      type: DataTypes.UUID,
      allowNull: true,
      validate: { isUUID: 4 }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
      unique: 'uniquProductCode'
    }
  }, {
    name: {
      singular: 'product',
      plural: 'products'
    },
    timestamps: true,
    paranoid: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      order: ['code']
    }
  })
  return Products
}
