module.exports = (sequelize, DataTypes) => {
  const Contacts = sequelize.define('contacts', {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      validate: { isEmail: true }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    loginId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: true
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: true
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    name: {
      singular: 'contact',
      plural: 'contacts'
    }
  })
  return Contacts
}
