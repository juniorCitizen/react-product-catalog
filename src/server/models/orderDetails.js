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
    deletedAt: 'deletedAt'
  })
  return OrderDetails
}
