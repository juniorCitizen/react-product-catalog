const Promise = require('bluebird')

const db = require('../../controllers/database')

module.exports = [
  (req, res, next) => {
    return db.Series
      .max('menuLevel')
      .then(maxMenuLevel => {
        // set base option
        let includeOptions = {
          include: [
            {
              model: db.Products,
              attributes: { exclude: ['name', 'specification', 'description', 'seriesId'] },
              include: [{
                model: db.Tags,
                attributes: { exclude: ['color'] }
              }]
            },
            { model: db.Series, as: 'childSeries' }
          ]
        }
        // run recursive function to construct child menu query options
        setupIncludeOptions(maxMenuLevel, includeOptions)
        // construct order query options
        let orderOptions = []
        orderOptions.push('order')
        orderOptions.push([db.Products, 'code'])
        orderOptions.push([db.Products, db.Tags, 'name'])
        for (let counter = 0; counter < maxMenuLevel; counter++) {
          orderOptions.push(['order'])
          orderOptions.push([db.Products, 'code'])
          orderOptions.push([db.Products, db.Tags, 'name'])
          for (let counter2 = 0; counter2 <= counter; counter2++) {
            orderOptions[(counter + 1) * 3].splice(0, 0, { model: db.Series, as: 'childSeries' })
            orderOptions[(counter + 1) * 3 + 1].splice(0, 0, { model: db.Series, as: 'childSeries' })
            orderOptions[(counter + 1) * 3 + 2].splice(0, 0, { model: db.Series, as: 'childSeries' })
          }
        }
        return Promise.resolve(Object.assign(
          {},
          includeOptions,
          { where: { menuLevel: 0 } },
          { order: orderOptions })
        )
      })
      // run query to get the series menu
      .then(queryOptions => db.Series.findAll(queryOptions))
      .then(data => {
        // make a copy of the retrieve data
        // so it could be modified
        let seriesTree = JSON.parse(JSON.stringify(data))
        // traverse through the tree node-by-node
        // append tag menus
        return traverseSeriesTree(seriesTree)
          .then(() => {
            req.resJson = { data: seriesTree }
            next()
            return Promise.resolve()
          })
      })
      .catch(error => next(error))
  }
]

// recursive function to traverse through series data tree structure
function traverseSeriesTree (seriesTreeLevel) {
  return Promise.each(
    seriesTreeLevel,
    (seriesTreeNode, index) => {
      // prep a none repeating list of tags from products under a node
      if (seriesTreeNode.products.length > 0) {
        return constructTagMenu(seriesTreeNode)
          .then(() => {
            // calls this function again to traverse it's child nodes
            if (seriesTreeNode.childSeries.length > 0) {
              return traverseSeriesTree(seriesTreeNode.childSeries)
            } else {
              return Promise.resolve()
            }
          })
      } else {
        // calls this function again to traverse it's child nodes
        if (seriesTreeNode.childSeries.length > 0) {
          return traverseSeriesTree(seriesTreeNode.childSeries)
        } else {
          return Promise.resolve()
        }
      }
    }
  )
}

// custom function to be used in tagArray.find
// compare a tag against an exist list
function compareTags (searchTarget) {
  return (existingTag) => {
    return existingTag.id === searchTarget.id
  }
}

// return a non-repeating array of tags from a list of products
function constructTagMenu (seriesTreeNode) {
  let tagList = []
  // loop through each product
  seriesTreeNode.products.forEach(product => {
    // loop through each tag in the current product
    product.tags.forEach(tag => {
      // push a tag onto list if it's not found on the list yet
      if (tagList.find(compareTags(tag)) === undefined) {
        tagList.push(tag)
      }
    })
  })
  seriesTreeNode.tagMenus = []
  return Promise
    .each(tagList, tag => {
      return db.Tags
        .findAll({
          where: { id: tag.id },
          include: [{
            model: db.Products,
            where: { seriesId: seriesTreeNode.id },
            attributes: { exclude: ['name', 'specification', 'description', 'seriesId'] }
          }],
          order: [
            'name',
            [db.Products, 'code']
          ]
        })
        .then(tag => {
          seriesTreeNode.tagMenus.push(tag[0])
          return Promise.resolve()
        })
    })
    .then(() => Promise.resolve())
    .catch(error => Promise.reject(error))
}

// recursive function to construct nested includeOptions
function setupIncludeOptions (levelCount, parent, counter = 0) {
  if (counter < (levelCount)) {
    Object.assign(parent['include'][1], {
      include: [
        {
          model: db.Products,
          attributes: { exclude: ['name', 'specification', 'description', 'seriesId'] },
          include: [{
            model: db.Tags,
            attributes: { exclude: ['color'] }
          }]
        },
        { model: db.Series, as: 'childSeries' }
      ]
    })
    setupIncludeOptions(levelCount, parent['include'][1], counter + 1)
  }
}
