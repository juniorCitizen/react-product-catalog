const uuidV4 = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const Labels = sequelize.define('labels', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidV4().toUpperCase(),
      validate: { isUUID: 4 }
    }
  }, {
    name: {
      singular: 'label',
      plural: 'labels'
    }
  })
  return Labels
}
