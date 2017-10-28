module.exports = (sequelize, DataTypes) => {
    const Countries = sequelize.define('countries', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        region: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        deletedAt: {
            type: DataTypes.DATE
        }
    }, {
        name: {
            singular: 'country',
            plural: 'countries'
        }
    })
    return Countries
}
