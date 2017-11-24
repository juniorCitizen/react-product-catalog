module.exports = (sequelize, DataTypes) => {
  const Carousels = sequelize.define('carousels', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      validate: {
        min: 0
      }
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    name: {
      singular: 'carousel',
      plural: 'carousels'
    }
  })
  return Carousels
}
