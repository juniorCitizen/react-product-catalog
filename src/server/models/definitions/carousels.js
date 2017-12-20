module.exports = (sequelize, DataTypes) => {
  const Carousels = sequelize.define('carousels', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      validate: { min: 0 }
    },
    displaySequence: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: true
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
      allowNull: true
    },
    data: {
      type: DataTypes.BLOB,
      allowNull: false
    }
  }, {
    name: {
      singular: 'carousel',
      plural: 'carousels'
    },
    defaultScope: {
      attributes: { exclude: ['data'] },
      order: ['displaySequence']
    }
  })
  return Carousels
}
