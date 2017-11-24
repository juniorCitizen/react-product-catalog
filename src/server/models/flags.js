module.exports = (sequelize, DataTypes) => {
  const Flags = sequelize.define('flags', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    data: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    name: {
      singular: 'flag',
      plural: 'flags'
    }
  })
  return Flags
}
