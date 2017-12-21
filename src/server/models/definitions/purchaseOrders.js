const uuidV4 = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const PurchaseOrders = sequelize.define('purchaseOrders', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidV4().toUpperCase(),
      validate: { isUUID: 4 }
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    contacted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    contactId: {
      type: DataTypes.UUID,
      allowNull: false,
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
      type: DataTypes.DATE
    }
  }, {
    name: {
      singular: 'purchaseOrder',
      plural: 'purchaseOrders'
    },
    timestamps: true,
    paranoid: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    defaultScope: {
      attributes: { exclude: ['deletedAt'] },
      order: [['updatedAt', 'desc']]
    }
  })
  return PurchaseOrders
}
