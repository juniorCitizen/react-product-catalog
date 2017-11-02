import logging from '../../../server/controllers/logging'

const seriesData = [{
  id: 0,
  reference: 'Crutches',
  displaySequence: 0
}, {
  id: 1,
  reference: 'Canes',
  displaySequence: 1
}, {
  id: 2,
  reference: 'Forearm Crutches',
  displaySequence: 2
}, {
  id: 3,
  reference: 'Quad Canes',
  displaySequence: 3
}, {
  id: 4,
  reference: 'Bath Seats',
  displaySequence: 4
}, {
  id: 5,
  reference: 'Walkers',
  displaySequence: 5
}, {
  id: 6,
  reference: 'Commode Chairs',
  displaySequence: 6
}, {
  id: 7,
  reference: 'Bathroom Safety',
  displaySequence: 7
}, {
  id: 8,
  reference: 'Patient-Aids',
  displaySequence: 8
}, {
  id: 9,
  reference: 'Rollators',
  displaySequence: 9
}, {
  id: 10,
  reference: 'Accessories',
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
