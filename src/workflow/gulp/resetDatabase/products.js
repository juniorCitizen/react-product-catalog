import faker from 'faker'

const logging = require('../../../server/controllers/logging')

const PRODUCTS_PER_SERIES_FLOOR = 2
const PRODUCTS_PER_SERIES_CEILING = 30

module.exports = (Products, Series) => {
  return Series
    .findAll()
    .map(series => series.id)
    .then(seriesIdList => {
      let products = []
      seriesIdList.forEach((seriesId) => {
        let productCount = faker.random.number({
          min: PRODUCTS_PER_SERIES_FLOOR,
          max: PRODUCTS_PER_SERIES_CEILING
        })
        for (let counter = 0; counter < productCount; counter++) {
          products.push({
            seriesId: seriesId,
            code: faker.random.number({ min: 100, max: 999 }).toString() + '-' + faker.random.alphaNumeric(6).toUpperCase(),
            name: faker.commerce.productName(),
            specification: faker.lorem.sentences(faker.random.number({ min: 2, max: 5 })),
            description: faker.lorem.paragraphs(faker.random.number({ min: 2, max: 5 }), '\n'),
            active: true
          })
        }
      })
      return Products.bulkCreate(products)
    })
    .then(logging.resolve('寫入產品資料... 成功'))
    .catch(logging.reject('寫入產品資料... 失敗'))
}
