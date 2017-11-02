import logging from '../../../server/controllers/logging'

const seriesData = [{
  id: 0,
  name: 'Crutches',
  displaySequence: 0
}, {
  id: 1,
  name: 'Canes',
  displaySequence: 1
}, {
  id: 2,
  name: 'Forearm Crutches',
  displaySequence: 2
}, {
  id: 3,
  name: 'Quad Canes',
  displaySequence: 3
}, {
  id: 4,
  name: 'Bath Seats',
  displaySequence: 4
}, {
  id: 5,
  name: 'Walkers',
  displaySequence: 5
}, {
  id: 6,
  name: 'Commode Chairs',
  displaySequence: 6
}, {
  id: 7,
  name: 'Bathroom Safety',
  displaySequence: 7
}, {
  id: 8,
  name: 'Patient-Aids',
  displaySequence: 8
}, {
  id: 9,
  name: 'Rollators',
  displaySequence: 9
}, {
  id: 10,
  name: 'Accessories',
  displaySequence: 10
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
