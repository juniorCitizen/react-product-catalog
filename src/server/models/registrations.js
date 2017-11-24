const uuidV4 = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const Registrations = sequelize.define('registrations', {
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
      singular: 'registration',
      plural: 'registrations'
    },
    timestamps: true,
    paranoid: false,
    createdAt: 'createdAt',
    updatedAt: false,
    deletedAt: false
  })
  return Registrations
}
