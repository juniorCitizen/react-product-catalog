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
      singular: 'flag',
      plural: 'flags'
    }
  })
  return Flags
}
