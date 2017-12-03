const logging = require('../logging')

module.exports = (db) => {
  logging.console('配置 ORM 系統資料表關聯...')
  // contact information relationships\
  db.Countries.hasMany(db.Companies, injectOptions('countryId', 'id'))
  db.Companies.belongsTo(db.Countries, injectOptions('countryId', 'id'))
  db.Companies.hasMany(db.Contacts, injectOptions('companyId', 'id'))
  db.Contacts.belongsTo(db.Companies, injectOptions('companyId', 'id'))
  // contacts and product information relationships
  db.Contacts.belongsToMany(db.Products, injectOptions('contactId', 'id', db.Registrations))
  db.Products.belongsToMany(db.Contacts, injectOptions('productId', 'id', db.Registrations))
  // product information relationships
  db.Series.hasMany(db.Products, injectOptions('seriesId', 'id'))
  db.Products.belongsTo(db.Series, injectOptions('seriesId', 'id'))
  db.Products.belongsToMany(db.Tags, injectOptions('productId', 'id', db.Labels))
  db.Tags.belongsToMany(db.Products, injectOptions('tagId', 'id', db.Labels))
  db.Series.hasMany(db.Series, Object.assign({ as: 'childSeries' }, injectOptions('parentSeriesId', 'id')))
  // photo data relationships
  db.Photos.belongsTo(db.Series, injectOptions('seriesId', 'id'))
  db.Series.hasOne(db.Photos, injectOptions('seriesId', 'id'))
  db.Products.hasMany(db.Photos, injectOptions('productId', 'id'))
  db.Photos.belongsTo(db.Products, injectOptions('productId', 'id'))
  return Promise.resolve()
}

function injectOptions (foreignKey, targetKey, throughModel = null, otherKey = null, constraints = true) {
  return Object.assign({
    constraints: constraints,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  }, {
    foreignKey: foreignKey,
    targetKey: targetKey
  },
  throughModel === null ? {} : { through: throughModel },
  otherKey === null ? {} : { otherKey: otherKey }
  )
}
