const faker = require('faker')
const uuidV4 = require('uuid/v4')

const logging = require('../../../server/controllers/logging')

const LEVEL_ENTRY_COUNT = [3, 2]

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
    .catch(logging.reject('寫入產品類別/系列資料... 失敗'))
}
