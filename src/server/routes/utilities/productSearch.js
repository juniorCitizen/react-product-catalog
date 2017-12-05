const db = require('../../controllers/database')

const Op = db.Sequelize.Op

module.exports = [
  (req, res, next) => {
    let wildCard = `%${req.query.wildCard}%`
    let queryString = `SELECT DISTINCT a.id FROM products AS a LEFT JOIN series AS b ON a.seriesId=b.id LEFT JOIN labels AS c ON a.id=c.productId LEFT JOIN tags AS d ON c.tagId=d.id WHERE a.code LIKE :wildCard OR a.name LIKE :wildCard OR a.specification LIKE :wildCard OR a.description LIKE :wildCard OR b.name LIKE :wildCard OR d.name LIKE :wildCard;`
    return db.sequelize
      .query(queryString, { replacements: { wildCard } })
      .spread((results, metadata) => Promise.resolve(results))
      .map(result => result.id)
      .then(productIdList => {
        let productSearchOptions = {
          attributes: { exclude: ['seriesId', 'photos'] },
          where: { id: { [Op.in]: productIdList } },
          include: [
            { model: db.Series },
            { model: db.Tags },
            { model: db.Photos, attributes: { exclude: ['data'] } }
          ],
          order: [
            'code',
            [db.Tags, 'name'],
            [db.Photos, 'primary', 'desc']
          ]
        }
        return db.Products.findAll(productSearchOptions)
      })
      .then(data => {
        req.resJson = { data }
        next()
        return Promise.resolve()
      })
      .catch(error => next(error))
  }
]
