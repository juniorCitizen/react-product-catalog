module.exports = (sequelize, DataTypes) => {
  const Series = sequelize.define('series', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      validate: {
        min: 0
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    menuLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    name: {
      singular: 'series',
      plural: 'series'
    }
  })
  return Series
}
