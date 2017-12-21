module.exports = (sequelize, DataTypes) => {
  const Tags = sequelize.define('tags', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      validate: { min: 0 }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false
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
      singular: 'tag',
      plural: 'tags'
    },
    timestamps: true,
    paranoid: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      order: ['name']
    }
  })
  return Tags
}
