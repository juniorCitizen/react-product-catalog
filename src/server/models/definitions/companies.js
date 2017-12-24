const uuidV4 = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const Companies = sequelize.define('companies', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidV4().toUpperCase(),
      validate: { isUUID: 4 }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fax: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    host: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    countryId: {
      type: DataTypes.STRING,
      allowNull: true
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
      singular: 'company',
      plural: 'companies'
    },
    timestamps: true,
    paranoid: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      order: ['title']
    }
  })
  return Companies
}
