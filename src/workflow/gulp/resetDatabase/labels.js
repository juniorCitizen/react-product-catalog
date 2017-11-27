import dotEnv from 'dotenv'
import faker from 'faker'
import Promise from 'bluebird'

dotEnv.config()

const logging = require('../../../server/controllers/logging')

const TAG_COUNT_FLOOR = 2
const TAG_COUNT_CEILING = 10

module.exports = (Products, Tags) => {
  return Promise
    .all([
      Products.findAll(),
      Tags.findAll()
    ])
    .spread((products, tags) => {
      // loop through each product
      products.forEach((product) => {
        // randomly decide how many mock tags to attach
        let tagCount = faker.random.number({
          min: TAG_COUNT_FLOOR,
          max: TAG_COUNT_CEILING
        })
        // set a flag to determine if adding a tag (20% chance)
        let addTag = (Math.random() < 0.2)
        if ((tagCount > 0) && addTag) {
          shuffleArray(tags)
          //
          for (let counter = 0; counter < tagCount; counter++) {
            product.addTags(tags[counter])
          }
        }
      })
      return Promise.resolve()
    })
    .then(logging.resolve('寫入產品VS標籤關聯資料... 成功'))
    .catch(logging.reject('寫入產品VS標籤關聯資料... 失敗'))
}

function shuffleArray (array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
}
