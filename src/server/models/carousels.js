module.exports = (sequelize, DataTypes) => {
  const Carousels = sequelize.define('carousels', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      validate: { isUUID: 4 }
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    primary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    encoding: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data: {
      type: DataTypes.BLOB,
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
      singular: 'carousel',
      plural: 'carousels'
    }
  })
  return Carousels
}
