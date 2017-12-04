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
    deletedAt: 'deletedAt'
  })
  return PurchaseOrders
}
