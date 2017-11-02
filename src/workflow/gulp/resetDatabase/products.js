import faker from 'faker'

import logging from '../../../server/controllers/logging'

require('dotenv').config()

module.exports = (Products, seriesIdList) => {
  let products = []
  seriesIdList.forEach((seriesId) => {
    let productCount = faker.random.number({
      min: parseInt(process.env.PRODUCTS_PER_SERIES_FLOOR),
      max: parseInt(process.env.PRODUCTS_PER_SERIES_CEILING)
    })
    for (let counter = 0; counter < productCount; counter++) {
      products.push({
        seriesId: seriesId,
        code: faker.random.number({ min: 100, max: 999 }).toString() + '-' + faker.random.alphaNumeric(6).toUpperCase(),
        name: faker.commerce.productName(),
        specification: faker.lorem.sentences(faker.random.number({ min: 2, max: 5 })),
        description: faker.lorem.paragraphs(faker.random.number({ min: 2, max: 5 }), '\n')
      })
    }
  })
  return Products
    .bulkCreate(products)
    .then(() => {
      logging.warning('寫入產品資料... 成功')
      return Promise.resolve()
    })
    .catch((error) => {
      logging.error(error, 'resetDatabase/product.js errored...')
      return Promise.reject(error)
    })
}
