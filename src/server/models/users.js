module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('users', {
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
    password: {
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
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    name: {
      singular: 'user',
      plural: 'users'
    }
  })
  return Users
}
