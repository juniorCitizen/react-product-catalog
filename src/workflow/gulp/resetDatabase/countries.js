import fs from 'fs-extra'
import path from 'path'
import Promise from 'bluebird'

import logging from '../../../server/controllers/logging'

require('dotenv').config()

module.exports = (Countries, Flags) => {
  let flagSvgPath = path.resolve('./node_modules/world-countries/data')
  let countries = []
  let flags = []
  return fs.readJson(path.resolve('./node_modules/world-countries/dist/countries.json'))
    .then((countriesInformation) => {
      countriesInformation.forEach((country) => {
        countries.push({
          id: country.cca3.toLowerCase(),
          name: country.name.common,
          region: country.region === '' ? 'Other' : country.region
        })
        flags.push({
          id: country.cca3.toLowerCase(),
          data: fs.readFileSync(path.join(flagSvgPath, country.cca3.toLowerCase() + '.svg'))
        })
      })
      return Promise.resolve()
    })
    .catch((error) => {
      logging.error(error, 'resetDatabase/countries.js fs.readJson() errored')
      return Promise.reject(error)
    })
    .then(() => {
      return Promise.each(
        countries.map(country => Countries.create(country)),
        (country, index, length) => {
          if (process.env.ORM_VERBOSE === 'true') {
            logging.console(`進度: ${index + 1}/${length} - ${country.name} 國家資料已建立`)
          }
        }
      )
    })
    .then(() => {
      logging.warning('寫入國家資料... 成功')
      return Promise.resolve()
    })
    .then(() => {
      return Promise.each(
        flags.map(flag => Flags.create(flag)),
        (flag, index, length) => {
          if (process.env.ORM_VERBOSE === 'true') {
            logging.console(`進度: ${index + 1}/${length} - ${countries[index].name} 國旗資料已建立`)
          }
        }
      )
    }).then(() => {
      logging.warning('寫入國旗圖示資料... 成功')
      return Promise.resolve()
    })
    .catch((error) => {
      logging.error(error, 'resetDatabase/countries.js errored...')
      return Promise.reject(error)
    })
}
