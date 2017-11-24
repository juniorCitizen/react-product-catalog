import dotEnv from 'dotenv'
import fs from 'fs-extra'
import path from 'path'
import Promise from 'bluebird'

dotEnv.config()
const logging = require('../../../server/controllers/logging')

module.exports = (Countries) => {
  let countryDataPath = path.resolve('./node_modules/world-countries/dist/countries.json')
  let flagSvgPath = path.resolve('./node_modules/world-countries/data')
  let countries = []
  return fs.readJson(countryDataPath)
    .then((countriesInformation) => {
      countriesInformation.forEach((country) => {
        let id = country.cca3.toLowerCase()
        countries.push({
          id,
          name: country.name.common,
          region: country.region === '' ? 'Other' : country.region,
          flagSvg: fs.readFileSync(path.join(flagSvgPath, id + '.svg'), 'utf8')
        })
      })
      return Promise.resolve()
    })
    .then(() => Countries.bulkCreate(countries))
    .then(logging.resolve('國家/國旗資料建立... 成功'))
    .catch(logging.reject('國家/國旗資料寫入失敗'))
}
