const logging = require('../../../server/controllers/logging')

const seriesData = [{
  id: 0,
  name: 'Crutches',
  order: 0,
  active: true
}, {
  id: 1,
  name: 'Canes',
  order: 1,
  active: true
}, {
  id: 2,
  name: 'Forearm Crutches',
  order: 2,
  active: true
}, {
  id: 3,
  name: 'Quad Canes',
  order: 3,
  active: true
}, {
  id: 4,
  name: 'Bath Seats',
  order: 4,
  active: true
}, {
  id: 5,
  name: 'Walkers',
  order: 5,
  active: true
}, {
  id: 6,
  name: 'Commode Chairs',
  order: 6,
  active: true
}, {
  id: 7,
  name: 'Bathroom Safety',
  order: 7,
  active: true
}, {
  id: 8,
  name: 'Patient-Aids',
  order: 8,
  active: true
}, {
  id: 9,
  name: 'Rollators',
  order: 9,
  active: true
}, {
  id: 10,
  name: 'Accessories',
  order: 10,
  active: true
}]

module.exports = (Series) => {
  return Series
    .bulkCreate(seriesData)
    .then(() => {
      logging.warning('寫入產品類別/系列資料... 成功')
      return Series.findAll()
    })
    .map(series => series.id)
    .then((seriesIdList) => Promise.resolve(seriesIdList))
    .catch(logging.reject('產品類別/系列資料寫入失敗'))
}
