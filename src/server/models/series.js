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
    displaySequence: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    publish: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
      singular: 'series',
      plural: 'series'
    }
  })
  return Series
}
