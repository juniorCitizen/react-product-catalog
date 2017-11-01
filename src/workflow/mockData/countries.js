module.exports = (() => {
  let worldCountries = require('world-countries/dist/countries.json')
  let records = []
  worldCountries.forEach((worldCountry) => {
    records.push({
      id: worldCountry.cca3,
      name: worldCountry.name.common,
      region: worldCountry.region === '' ? 'Other' : worldCountry.region
    })
  })
  return records
})()
