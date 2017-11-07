const db = require('../../controllers/database/database')
const routerResponse = require('../../controllers/routerResponse')

module.exports = (req, res) => {
  return db.sequelize // initialize transaction
    .transaction((trx) => {
      let trxObj = { transaction: trx }
      let originalPosition = null
      return db.Series
        .findById(req.body.id, trxObj)
        .catch(error => Promise.reject(error))
        .then((targetRecord) => {
          originalPosition = targetRecord.displaySequence
          if ((req.body.name !== undefined) && (req.body.name !== targetRecord.name)) {
            return targetRecord
              .update({ name: req.body.name }, trxObj)
              .catch(error => Promise.reject(error))
          } else {
            return Promise.resolve()
          }
        })
        .then(() => {
          // make sure sequential reorder is only done when:
          // 1. req data actually has a displaySequence value
          // 2. the requested value is different from the original displaySeq value
          if ((req.body.displaySequence !== undefined) && (req.body.displaySequence !== originalPosition)) {
            return db.Series
              .findAll({ order: ['displaySequence'] }, trxObj)
              .catch(error => Promise.reject(error))
              .then((seriesDataset) => {
                if (req.body.displaySequence !== undefined) {
                  // prevent skipping of displaySequence (e.g. 0, 1, 2, 4)
                  if (req.body.displaySequence > seriesDataset.length) {
                    req.body.displaySequence = seriesDataset.length
                  }
                }
                if (req.body.displaySequence < originalPosition) { // advance in sequential order
                  return db.Series
                    .update({
                      displaySequence: db.Sequelize.literal('`displaySequence` + 1')
                    }, Object.assign({
                      where: {
                        id: { [db.Sequelize.Op.ne]: req.body.id },
                        displaySequence: {
                          [db.Sequelize.Op.between]: [req.body.displaySequence, originalPosition - 1]
                        }
                      }
                    }, trxObj))
                    .catch(error => Promise.reject(error))
                } else { // push back in sequential order
                  return db.Series
                    .update({
                      displaySequence: db.Sequelize.literal('`displaySequence` - 1')
                    }, Object.assign({
                      where: {
                        id: { [db.Sequelize.Op.ne]: req.body.id },
                        displaySequence: {
                          [db.Sequelize.Op.between]: [originalPosition + 1, req.body.displaySequence]
                        }
                      }
                    }, trxObj))
                    .catch(error => Promise.reject(error))
                }
              })
              .then(() => {
                // actually update the target record's sequential order
                return db.Series
                  .findById(req.body.id, trxObj)
                  .catch(error => Promise.reject(error))
                  .then((targetRecord) => {
                    return targetRecord.update({ displaySequence: req.body.displaySequence }, trxObj)
                  })
              })
          }
          return Promise.resolve()
        })
    })
    .then(() => {
      let queryParameter = req.query.products === 'true'
        ? {
          include: [{
            model: db.Products,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            include: [{
              model: db.Tags,
              attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
            }, {
              model: db.Photos,
              attributes: { exclude: ['data', 'createdAt', 'updatedAt', 'deletedAt'] }
            }]
          }, {
            model: db.Photos,
            attributes: { exclude: ['data', 'createdAt', 'updatedAt', 'deletedAt'] }
          }],
          order: [
            'displaySequence',
            [db.Products, 'code'],
            [db.Products, db.Tags, 'name'],
            [db.Products, db.Photos, 'primary', 'DESC']
          ]
        }
        : { order: ['displaySequence'] }
      return db.Series
        .findAll(queryParameter)
        .catch(error => Promise.reject(error))
    })
    .then((series) => {
      return routerResponse.json({
        req: req,
        res: res,
        statusCode: 200,
        data: series
      })
    })
    .catch(error => routerResponse.json({
      req: req,
      res: res,
      statusCode: 500,
      error: error
    }))
}
