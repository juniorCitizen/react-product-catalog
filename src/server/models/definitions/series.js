const uuidV4 = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const Series = sequelize.define('series', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidV4().toUpperCase(),
      validate: { isUUID: 4 }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    displaySequence: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 0 }
    },
    menuLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    parentSeriesId: {
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
      singular: 'series',
      plural: 'series'
    },
    timestamps: true,
    paranoid: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      order: ['menuLevel', 'displaySequence']
    }
  })
  return Series
}
