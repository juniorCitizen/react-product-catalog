const db = require('../../controllers/database/database')
const routerResponse = require('../../controllers/routerResponse')

module.exports = (req, res) => {
  return db.sequelize // initialize transaction
    .transaction((trx) => {
      let trxObj = { transaction: trx }
      let originalPosition = null
      return db.Series
        .findById(req.body.id, trxObj)
        .then((targetRecord) => {
          originalPosition = targetRecord.displaySequence
          if ((req.body.name !== undefined) && (req.body.name !== targetRecord.name)) {
            return targetRecord.update({ name: req.body.name }, trxObj)
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
              .then((seriesDataset) => {
                // prevent skipping of displaySequence (e.g. 0, 1, 2, 4)
                if ((req.body.displaySequence !== undefined) && (req.body.displaySequence > seriesDataset.length)) {
                  req.body.displaySequence = seriesDataset.length
                }
                if (req.body.displaySequence < originalPosition) { // advance in sequential order
                  return db.Series.update({
                    displaySequence: db.Sequelize.literal('`displaySequence` + 1')
                  }, Object.assign({
                    where: {
                      id: { [db.Sequelize.Op.ne]: req.body.id },
                      displaySequence: {
                        [db.Sequelize.Op.between]: [req.body.displaySequence, originalPosition - 1]
                      }
                    }
                  }, trxObj))
                } else { // push back in sequential order
                  return db.Series.update({
                    displaySequence: db.Sequelize.literal('`displaySequence` - 1')
                  }, Object.assign({
                    where: {
                      id: { [db.Sequelize.Op.ne]: req.body.id },
                      displaySequence: {
                        [db.Sequelize.Op.between]: [originalPosition + 1, req.body.displaySequence]
                      }
                    }
                  }, trxObj))
                }
              })
              .then(() => {
                // actually update the target record's sequential order
                return db.Series
                  .findById(req.body.id, trxObj)
                  .then((targetRecord) => {
                    return targetRecord.update({ displaySequence: req.body.displaySequence }, trxObj)
                  })
              })
          }
          return Promise.resolve()
        })
    })
    .then(() => {
      return db.Series.findAll({ order: ['displaySequence'] })
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
