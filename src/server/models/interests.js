const uuidV4 = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const Interests = sequelize.define('interests', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => {
        return uuidV4().toUpperCase()
      },
      validate: { isUUID: 4 }
    }
  }, {
    name: {
      singular: 'interest',
      plural: 'interests'
    }
  })
  return Interests
}
