import logging from '../../../server/controllers/logging'

const seriesData = [{
  id: 0,
  name: 'Crutches',
  order: 0,
  publish: true
}, {
  id: 1,
  name: 'Canes',
  order: 1,
  publish: true
}, {
  id: 2,
  name: 'Forearm Crutches',
  order: 2,
  publish: true
}, {
  id: 3,
  name: 'Quad Canes',
  order: 3,
  publish: true
}, {
  id: 4,
  name: 'Bath Seats',
  order: 4,
  publish: true
}, {
  id: 5,
  name: 'Walkers',
  order: 5,
  publish: true
}, {
  id: 6,
  name: 'Commode Chairs',
  order: 6,
  publish: true
}, {
  id: 7,
  name: 'Bathroom Safety',
  order: 7,
  publish: true
}, {
  id: 8,
  name: 'Patient-Aids',
  order: 8,
  publish: true
}, {
  id: 9,
  name: 'Rollators',
  order: 9,
  publish: true
}, {
  id: 10,
  name: 'Accessories',
  order: 10,
  publish: true
}]

module.exports = (Series) => {
  return Series
    .bulkCreate(seriesData)
    .then(() => {
      logging.warning('寫入產品系列資料... 成功')
      return Series.findAll()
    })
    .map(series => series.id)
    .then((seriesIdList) => {
      return Promise.resolve(seriesIdList)
    })
    .catch((error) => {
      logging.error(error, 'resetDatabase/series.js errored...')
      return Promise.resolve(error)
    })
}
