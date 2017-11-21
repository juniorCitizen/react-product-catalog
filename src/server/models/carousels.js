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
    }
  }, {
    name: {
      singular: 'carousel',
      plural: 'carousels'
    }
  })
  return Carousels
}
