import fs from 'fs-extra'
import path from 'path'
import Promise from 'bluebird'
import Sequelize from 'sequelize' // requires the sequalize libraryc

import dbConfig from '../../config/sqliteDb'

const sequelize = new Sequelize(dbConfig)

const db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    initialize: initialize // project model initialization function
}

const modelsPath = path.join(__dirname, '../../models')

function initialize() {
    let modelSyncOperations = []
    return sequelize
        .authenticate() // verify database connection
        .then(() => {
            return fs.readdir(modelsPath)
        })
        .then((files) => {
            files
                .filter((fileName) => {
                    return ((fileName.indexOf('.') !== 0) && (fileName.slice(-3) === '.js'))
                })
                .forEach((fileName) => {
                    let modelName = fileName.slice(0, -3).charAt(0).toUpperCase() + fileName.slice(0, -3).slice(1)
                    db[modelName] = require(path.join(modelsPath, fileName))(sequelize, Sequelize)
                    modelSyncOperations.push(db[modelName].sync())
                })
            return Promise.all(modelSyncOperations)
        })
        .then(() => {
            db.Series.hasMany(db.Products, {
                constraints: true,
                foreignKey: 'seriesId',
                targetKey: 'id',
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            })
            db.Products.belongsTo(db.Series, {
                constraints: true,
                foreignKey: 'seriesId',
                targetKey: 'id',
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            })
            db.Products.hasOne(db.Descriptions, {
                constraints: true,
                foreignKey: 'productId',
                targetKey: 'id',
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            })
            db.Products.hasMany(db.Photos, {
                constraints: true,
                foreignKey: 'productId',
                targetKey: 'id',
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            })
            db.Products.belongsToMany(db.Registrations, {
                through: db.InterestedProducts,
                constrains: true,
                foreignKey: 'productId',
                // otherKey: 'registrationId',
                targetKey: 'id',
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            })
            db.Photos.belongsTo(db.Products, {
                constraints: true,
                foreignKey: 'productId',
                targetKey: 'id',
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            })
            db.Descriptions.belongsTo(db.Products, {
                constraints: true,
                foreignKey: 'productId',
                targetKey: 'id',
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            })
            db.Countries.hasMany(db.Registrations, {
                constrains: true,
                foreignKey: 'countryId',
                targetKey: 'id',
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            })
            db.Countries.hasMany(db.OfficeLocations, {
                constrains: true,
                foreignKey: 'countryId',
                targetKey: 'id',
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            })
            db.Registrations.belongsTo(db.Countries, {
                constraints: true,
                foreignKey: 'countryId',
                targetKey: 'id',
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            })
            db.Registrations.belongsToMany(db.Products, {
                through: db.InterestedProducts,
                constrains: true,
                foreignKey: 'registrationId',
                // otherKey: 'productId',
                targetKey: 'id',
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            })
            db.OfficeLocations.belongsTo(db.Countries, {
                constraints: true,
                foreignKey: 'countryId',
                targetKey: 'id',
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            })
            db.OfficeLocations.hasMany(db.Users, {
                constrains: true,
                foreignKey: 'officeLocationId',
                targetKey: 'id',
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            })
            db.Users.belongsTo(db.OfficeLocations, {
                constraints: true,
                foreignKey: 'officeLocationId',
                targetKey: 'id',
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            })
            return Promise.resolve()
        })
        .then(() => {
            return fs.readdir(modelsPath)
        })
        .then((dirContents) => {
            let modelSyncOperations = []
            dirContents
                .filter((fileName) => {
                    return ((fileName.indexOf('.') !== 0) && (fileName.slice(-3) === '.js'))
                })
                .forEach((fileName) => {
                    let modelName = fileName.slice(0, -3).charAt(0).toUpperCase() + fileName.slice(0, -3).slice(1)
                    modelSyncOperations.push(db[modelName].sync())
                })
            return Promise.all(modelSyncOperations)
        })
        .catch((error) => {
            console.log(error.name)
            console.log(error.message)
            console.log(error.stack)
            return Promise.reject(error)
        })
}

module.exports = db // export the database access object
