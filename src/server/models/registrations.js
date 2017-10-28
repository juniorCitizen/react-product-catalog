module.exports = (sequelize, DataTypes) => {
    const Registrations = sequelize.define('registrations', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            validate: { isUUID: 4 }
        },
        company: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { isEmail: true }
        },
        countryId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        comments: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        notified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        contacted: {
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
            singular: 'registration',
            plural: 'registrations'
        }
    })
    return Registrations
}
