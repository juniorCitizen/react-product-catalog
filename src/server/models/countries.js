module.exports = (sequelize, DataTypes) => {
  const Countries = sequelize.define('countries', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false
    },
    flagSvg: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    name: {
      singular: 'country',
      plural: 'countries'
    }
  })
  return Countries
}
