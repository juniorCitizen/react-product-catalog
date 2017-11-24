const uuidV4 = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const Photos = sequelize.define('photos', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => {
        return uuidV4().toUpperCase()
      },
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
      allowNull: true
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
    publish: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    name: {
      singular: 'photo',
      plural: 'photos'
    }
  })
  return Photos
}
