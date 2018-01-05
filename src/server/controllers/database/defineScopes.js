module.exports = (db) => {
  // /////////////////////////////////
  // query scopes for specific purpose
  // /////////////////////////////////
  db.Carousels.addScope('imageOnly', () => {
    return {
      attributes: ['id', 'displaySequence', 'data', 'mimeType'],
      order: ['displaySequence']
    }
  })
  db.Carousels.addScope('inRange', (pos1, pos2) => {
    return {
      attributes: { exclude: ['data'] },
      where: {
        displaySequence: {
          [db.Sequelize.Op.between]: [
            pos1 < pos2 ? pos1 : pos2,
            pos1 < pos2 ? pos2 : pos1
          ]
        }
      },
      order: ['displaySequence']
    }
  })
  db.Carousels.addScope('siblings', () => {
    return {
      attributes: { exclude: ['data'] },
      order: ['displaySequence']
    }
  })
  db.Contacts.addScope('credentialsOnly', () => {
    return {
      attributes: ['id', 'email', 'hashedPassword', 'salt', 'admin'],
      include: [{
        model: db.Companies,
        attributes: ['id', 'host']
      }]
    }
  })
  db.Countries.addScope('flagOnly', () => {
    return {
      attributes: ['id', 'flagSvg'],
      order: ['id']
    }
  })
  db.Photos.addScope('imageOnly', () => {
    return {
      attributes: ['id', 'data', 'mimeType'],
      order: [['primary', 'desc']]
    }
  })
  db.PurchaseOrders.addScope('pending', () => {
    return {
      attributes: { exclude: ['deletedAt'] },
      where: {
        [db.Sequelize.Op.or]: [
          { contacted: false },
          { notified: false }
        ]
      },
      include: [
        {
          model: db.Contacts,
          include: [{
            model: db.Companies,
            include: [{ model: db.Countries }]
          }]
        },
        { model: db.Products, through: { attributes: ['quantity'] } }
      ],
      order: [
        ['updatedAt', 'desc'],
        [db.Products, 'code']
      ]
    }
  })
  db.Series.addScope('siblings', (parentSeriesId = null) => {
    return {
      where: { parentSeriesId },
      order: ['displaySequence']
    }
  })

  // /////////////////////////////////////
  // query scope for complex joint queries
  // /////////////////////////////////////
  db.Companies.addScope('withContactDetails', () => {
    return {
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      include: [{ model: db.Contacts }],
      order: ['title']
    }
  })
  db.Companies.addScope('withCountryDetails', () => {
    return {
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      include: [{ model: db.Countries }],
      order: [
        [db.Countries, 'region'],
        [db.Countries, 'name'],
        ['title']
      ]
    }
  })
  db.Companies.addScope('detailed', () => {
    return {
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      include: [{ model: db.Countries }, { model: db.Contacts }],
      order: [
        [db.Countries, 'region'],
        [db.Countries, 'name'],
        ['title']
      ]
    }
  })
  db.Contacts.addScope('detailed', () => {
    return {
      attributes: ['id', 'email', 'name', 'mobile', 'companyId'],
      include: [{ model: db.Companies }],
      order: [[db.Companies, 'title'], ['name']]
    }
  })
  db.Countries.addScope('detailed', () => {
    return {
      attributes: { exclude: [] },
      order: ['region', 'name']
    }
  })
  db.Products.addScope('detailed', () => {
    return {
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      include: [{ model: db.Series }, { model: db.Tags }, { model: db.Photos, attributes: { exclude: ['data'] } }],
      order: ['code', [db.Tags, 'name'], [db.Photos, 'primary', 'desc']]
    }
  })
  db.PurchaseOrders.addScope('detailed', () => {
    return {
      attributes: { exclude: ['deletedAt'] },
      include: [
        {
          model: db.Contacts,
          include: [{
            model: db.Companies,
            include: [{ model: db.Countries }]
          }]
        },
        { model: db.Products, through: { attributes: ['quantity'] } }
      ],
      order: [
        'updatedAt',
        [db.Products, 'code']
      ]
    }
  })
  db.Series.addScope('detailed', () => {
    return {
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      include: [
        { model: db.Products },
        { model: db.Photos },
        { model: db.Series, as: 'childSeries' }
      ],
      order: ['menuLevel', 'displaySequence', [db.Products, 'code']]
    }
  })
  return Promise.resolve()
}
