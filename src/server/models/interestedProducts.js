module.exports = (sequelize, DataTypes) => {
    const InterestedProducts = sequelize.define('interestedProducts', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            validate: { isUUID: 4 }
        },
        registrationId: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            validate: { isUUID: 4 }
        },
        productId: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            validate: { isUUID: 4 }
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
            singular: 'interestedProduct',
            plural: 'interestedProducts'
        }
    })
    return InterestedProducts
}
