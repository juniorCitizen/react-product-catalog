const uuidV4 = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const Registrations = sequelize.define('registrations', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => {
        return uuidV4().toUpperCase()
      },
      validate: { isUUID: 4 }
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true }
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
      singular: 'registration',
      plural: 'registrations'
    },
    timestamps: true,
    paranoid: false,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: null
  })
  return Registrations
}
