const uuidV4 = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const Photos = sequelize.define('photos', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidV4().toUpperCase(),
      validate: { isUUID: 4 }
    },
    primary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    encoding: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    seriesId: {
      type: DataTypes.UUID,
      allowNull: true,
      unique: true,
      validate: { isUUID: 4 }
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: true,
      validate: { isUUID: 4 }
    }
  }, {
    name: {
      singular: 'photo',
      plural: 'photos'
    },
    defaultScope: {
      attributes: { exclude: ['data'] },
      order: [['primary', 'desc']]
    }
  })
  return Photos
}
