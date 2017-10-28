module.exports = (sequelize, DataTypes) => {
    const Products = sequelize.define('products', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            validate: { isUUID: 4 }
        },
        seriesId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
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
            singular: 'product',
            plural: 'products'
        }
    })
    return Products
}
