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
    }
    // ,
    // createdAt: {
    //   type: DataTypes.DATE,
    //   allowNull: false,
    //   defaultValue: DataTypes.NOW
    // },
    // updatedAt: {
    //   type: DataTypes.DATE,
    //   allowNull: false,
    //   defaultValue: DataTypes.NOW
    // },
    // deletedAt: {
    //   type: DataTypes.DATE,
    //   allowNull: true
    // }
  }, {
    name: {
      singular: 'country',
      plural: 'countries'
    }
  })
  return Countries
}
