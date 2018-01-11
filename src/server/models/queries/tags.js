const Promise = require('bluebird')

const db = require('../../controllers/database')
const logging = require('../../controllers/logging')

module.exports = {
  getTagMenus
}

function getTagMenus (productInstanceList) {
  if (!productInstanceList) return Promise.resolve(null)
  let tagList = []
  // loop through each product
  productInstanceList.forEach(productInstance => {
    // loop through each tag in the current product
    productInstance.tags.forEach(tag => {
      // push a tag onto list if it's not found on the list yet
      if (tagList.find(compareTags(tag)) === undefined) {
        tagList.push(tag)
      }
    })
  })
  // sort the tag list alphabetically
  tagList.sort(sortTagList)
  // construct the tagMenu from the tagList
  let tagMenu = []
  // loop through the tagList sequentially
  return Promise.each(tagList, tag => {
    // get the current tag with products that
    // are associated with the current seriesTreeNode
    return db.Tags.findById(tag.id, {
      include: [{
        model: db.Products,
        include: [{ model: db.Photos, attributes: ['id', 'primary'] }],
        where: { seriesId: productInstanceList[0].seriesId }
      }],
      order: [
        'name',
        [db.Products, 'code']
      ]
    }).then(tag => {
      // push the tag onto the tagMenu
      if (tag) tagMenu.push(tag)
      return Promise.resolve()
    }).catch(error => Promise.reject(error))
  }).then(() => {
    return Promise.resolve(tagMenu)
  }).catch(error => {
    logging.error(error, '/models/queries/tags.getTagMenus() errored')
    return Promise.reject(error)
  })
}

// compare an element against existing list
function compareTags (searchTarget) {
  return (existingElement) => {
    return existingElement.id === searchTarget.id
  }
}

// function to facilitate tagList.sort()
function sortTagList (tagA, tagB) {
  return tagA.name.toUpperCase() > tagB.name.toUpperCase()
    ? 1
    : tagA.name.toUpperCase() < tagB.name.toUpperCase()
      ? -1
      : 0
}
