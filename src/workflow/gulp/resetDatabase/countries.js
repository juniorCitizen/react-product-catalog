import logging from '../../../server/controllers/logging'

module.exports = (Countries) => {
  let countries = []
  require('world-countries/dist/countries.json').forEach((country) => {
    countries.push({
      id: country.cca3,
      name: country.name.common,
      region: country.region === '' ? 'Other' : country.region
    })
  })
  return Countries
    .bulkCreate(countries)
    .then(() => {
      logging.warning('寫入國家資料... 成功')
      return Promise.resolve()
    })
    .catch((error) => {
      logging.error(error, 'resetDatabase/countries.js errored...')
      return Promise.resolve(error)
    })
}
