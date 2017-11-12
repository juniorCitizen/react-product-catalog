const uuidV4 = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const Labels = sequelize.define('labels', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => {
        return uuidV4().toUpperCase()
      },
      validate: { isUUID: 4 }
    }
    // ,
    // productId: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    //   defaultValue: DataTypes.UUIDV4,
    //   validate: { isUUID: 4 }
    // },
    // tagId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false
    // },
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
      singular: 'label',
      plural: 'labels'
    }
  })
  return Labels
}
