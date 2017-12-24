const uuidV4 = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const Contacts = sequelize.define('contacts', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidV4().toUpperCase(),
      validate: { isUUID: 4 }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: true
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: true
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    companyId: {
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
      type: DataTypes.DATE
    }
  }, {
    name: {
      singular: 'contact',
      plural: 'contacts'
    },
    timestamps: true,
    paranoid: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    defaultScope: {
      attributes: ['id', 'email', 'name', 'mobile', 'companyId'],
      order: ['name']
    }
  })
  return Contacts
}
