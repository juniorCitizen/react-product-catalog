const logging = require('../logging')

module.exports = (db) => {
  logging.console('配置 ORM 系統資料表關聯...')
  // contact information relationships\
  db.Countries.hasMany(db.Companies, injectOptions('countryId', 'id'))
  db.Companies.belongsTo(db.Countries, injectOptions('countryId', 'id'))
  db.Companies.hasMany(db.Contacts, injectOptions('companyId', 'id'))
  db.Contacts.belongsTo(db.Companies, injectOptions('companyId', 'id'))
  // contacts and product ordering relationships
  db.Contacts.hasMany(db.PurchaseOrders, injectOptions('contactId', 'id'))
  db.PurchaseOrders.belongsTo(db.Contacts, injectOptions('contactId', 'id'))
  db.PurchaseOrders.belongsToMany(db.Products, injectOptions('purchaseOrderId', 'id', db.OrderDetails))
  db.Products.belongsToMany(db.PurchaseOrders, injectOptions('productId', 'id', db.OrderDetails))

  db.OrderDetails.belongsTo(db.PurchaseOrders, injectOptions('purchaseOrderId', 'id'))
  db.PurchaseOrders.hasMany(db.OrderDetails, injectOptions('purchaseOrderId', 'id'))
  db.OrderDetails.belongsTo(db.Products, injectOptions('productId', 'id'))
  db.Products.hasMany(db.OrderDetails, injectOptions('productId', 'id'))
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
