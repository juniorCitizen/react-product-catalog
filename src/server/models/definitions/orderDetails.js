const uuidV4 = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const OrderDetails = sequelize.define('orderDetails', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidV4().toUpperCase(),
      validate: { isUUID: 4 }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 1 }
    },
    purchaseOrderId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: { isUUID: 4 }
    },
    productId: {
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
      singular: 'orderDetail',
      plural: 'orderDetails'
    },
    timestamps: true,
    paranoid: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
    }
  })
  return OrderDetails
}
