const faker = require('faker')
const uuidV4 = require('uuid/v4')

const logging = require('../../../server/controllers/logging')

const LEVEL_ENTRY_COUNT = [10, 10, 10]

let menuRecords = []

// generate first level menu
for (let counter = 0; counter < LEVEL_ENTRY_COUNT[0]; counter++) {
  menuRecords.push({
    id: uuidV4().toUpperCase(),
    name: faker.hacker.noun(),
    order: counter,
    active: true,
    menuLevel: 0
  })
}

// generate 2nd level menu
let secondLevelMenu = JSON.parse(JSON.stringify(menuRecords))

secondLevelMenu.forEach(menuRecord => {
  for (
    let counter = faker.random.number({ min: 0, max: (LEVEL_ENTRY_COUNT[1] - 1) });
    counter >= 0;
    counter--
  ) {
    menuRecords.push({
      id: uuidV4().toUpperCase(),
      name: faker.hacker.noun(),
      order: counter,
      active: true,
      menuLevel: 1,
      parentSeriesId: menuRecord.id
    })
  }
})

// generate 3rd level menu
let thirdLevelMenu =
  JSON.parse(
    JSON.stringify(
      menuRecords.filter(menuRecord => { return menuRecord.menuLevel === 1 })
    )
  )

thirdLevelMenu.forEach(menuRecord => {
  for (
    let counter = faker.random.number({ min: 0, max: (LEVEL_ENTRY_COUNT[2] - 1) });
    counter >= 0;
    counter--
  ) {
    menuRecords.push({
      id: uuidV4().toUpperCase(),
      name: faker.hacker.noun(),
      order: counter,
      active: true,
      menuLevel: 2,
      parentSeriesId: menuRecord.id
    })
  }
})

module.exports = (Series) => {
  return Series
    .bulkCreate(menuRecords) // create first level menu
    .then(logging.resolve('寫入產品類別/系列資料... 成功'))
    // example to get menu trees dynamically
    .then(() => Series.max('menuLevel'))
    .then(maxMenuLevel => {
      // recursive function to construct nested includeOptions
      function setupIncludeOption (key, parent, child, counter, ceiling) {
        parent[key] = Object.assign({}, child)
        if (counter < (ceiling - 1)) {
          if (counter === (ceiling - 2)) delete child[key]
          parent = setupIncludeOption(key, parent[key], child, counter + 1, ceiling)
        } else {
          return parent
        }
      }
      // set base option
      let includeOption = { include: {} }
      // run recursive function on dynamic menu level
      setupIncludeOption(
        'include',
        includeOption,
        {
          model: Series,
          as: 'childSeries',
          include: {}
        },
        0,
        maxMenuLevel)
      let orderOption = ['order']
      for (let counter = 0; counter < maxMenuLevel; counter++) {
        orderOption.push(['order'])
        for (let counter2 = 0; counter2 <= counter; counter2++) {
          orderOption[counter + 1].splice(0, 0, { model: Series, as: 'childSeries' })
        }
      }
      return Promise.resolve(Object.assign(
        {},
        includeOption,
        { where: { menuLevel: 0 } },
        orderOption)
      )
    })
    .then((options) => Series.findAll(options))
    .then((data) => {
      console.log(data[0].dataValues)
      console.log(data[0].childSeries[0].dataValues)
      console.log(data[0].childSeries[0].childSeries[0].dataValues)
      return Promise.resolve()
    })
    .then(() => Series.findAll())
    .map(series => series.id)
    .then((seriesIdList) => Promise.resolve(seriesIdList))
    .catch(logging.reject('寫入產品類別/系列資料... 失敗'))
}
