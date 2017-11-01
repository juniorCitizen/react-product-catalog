import faker from 'faker'
import Promise from 'bluebird'

import logging from '../../../server/controllers/logging'

const TAG_LIMIT = { min: 0, max: 5 }

module.exports = (Products, Tags) => {
  return Promise
    .all([
      Products.findAll(),
      Tags.findAll()
    ])
    .spread((products, tags) => {
      products.forEach((product) => {
        let tagCount = faker.random.number(TAG_LIMIT)
        let addTag = (Math.random() < 0.2)
        if ((tagCount > 0) && addTag) {
          shuffleArray(tags)
          for (let counter = 0; counter < tagCount; counter++) {
            product.addTags(tags[counter])
          }
        }
      })
      return Promise.resolve()
    })
    .then(() => {
      logging.warning('寫入產品VS標籤關聯資料... 成功')
      return Promise.resolve()
    })
    .catch((error) => {
      logging.error(error, 'resetDatabase/labels.js errored...')
      return Promise.resolve(error)
    })
}

function shuffleArray (array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
}
