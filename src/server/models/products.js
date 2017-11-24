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
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    specification: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    name: {
      singular: 'product',
      plural: 'products'
    }
  })
  return Products
}
