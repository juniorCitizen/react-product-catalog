const multer = require('multer')
const Promise = require('bluebird')

const db = require('../../controllers/database')

const productQueries = require('../../models/queries/products')
const seriesQueries = require('../../models/queries/series')
const tagQueries = require('../../models/queries/tags')

const validateJwt = require('../../middlewares/validateJwt')

const Op = db.Sequelize.Op

module.exports = {
  getMenuItems: [
    rejectInvalidTargetRequest,
    async (req, res, next) => {
      let query = !req.targetSeries
        ? seriesQueries.getChildSeries()
        : seriesQueries.getChildSeries(req.targetSeriesId)
      let products = await productQueries.getSeriesProducts(!req.targetSeries ? null : req.targetSeriesId)
      req.resJson = {
        data: {
          childSeries: await query,
          products,
          tagMenus: await tagQueries.getTagMenus(products)
        }
      }
      next()
      return Promise.resolve()
    }
  ],
  // route handlers
  read: [ // GET /series or /series/:seriesId
    rejectInvalidTargetRequest,
    getMaxMenuLevel,
    constructIncludeOptions,
    constructOrderOptions,
    getMenuTree,
    appendTagMenus
  ],
  createRootNode: [ // POST /series
    multer().none(),
    validateJwt({ staff: true }),
    findNodeSiblings,
    insertRecord,
    findTarget('created', true),
    sendTargetData
  ],
  createChildNode: [ // POST /series/:seriesId
    multer().none(),
    validateJwt({ staff: true }),
    findTarget('params', false, false),
    findNodeSiblings,
    insertRecord,
    findTarget('created', true),
    sendTargetData
  ],
  patch: [ // PATCH /series/:seriesId
    ensureValidTargetSeries,
    validateJwt({ staff: true }),
    findTargetParentSeries,
    findOriginalPosition,
    findNodeSiblings,
    findTargetPosition,
    determineProxyTarget,
    findTarget('params', true),
    sendTargetData
  ],
  delete: [ // DELETE /series/:seriesId
    validateJwt({ staff: true }),
    checkPresenceOfChildSeries,
    disassociateAndDelete
  ],
  // common middlewares
  autoFindTarget,
  findTarget,
  sendTargetData
  // specialized middlewares
}

// traverse menu series tree and construct tag menus
function appendTagMenus (req, res, next) {
  return traverseSeriesTree(req.seriesTree)
    .then(() => {
      req.resJson = { data: req.seriesTree }
      next()
      return Promise.resolve()
    }).catch(error => next(error))
}

// find target series record indicated by the request route.param() with :seriesId
function autoFindTarget (req, res, next, seriesId) {
  let targetSeriesId = seriesId.toUpperCase()
  return db.Series
    .scope({ method: ['detailed'] })
    .findById(targetSeriesId)
    .then(targetSeries => {
      req.targetSeriesId = targetSeriesId
      req.targetSeries = targetSeries
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// check if childSeries exists
function checkPresenceOfChildSeries (req, res, next) {
  if (req.targetSeries.childSeries.length > 0) {
    let error = new Error('Not permitted to remove series that holds children series')
    return next(error)
  }
  return next()
}

// compare an element against existing list
function compareTags (searchTarget) {
  return (existingElement) => {
    return existingElement.id === searchTarget.id
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
  // construct the tagMenu from the tagList
  seriesTreeNode.tagMenu = []
  // loop through the tagList sequentially
  return Promise.each(tagList, tag => {
    // get the current tag with products that
    // are associated with the current seriesTreeNode
    return db.Tags.findById(tag.id, {
      include: [{
        model: db.Products,
        include: [{ model: db.Photos, attributes: ['id', 'primary'] }],
        where: { seriesId: seriesTreeNode.id }
      }],
      order: [
        'name',
        [db.Products, 'code']
      ]
    }).then(tag => {
      // push the tag onto the tagMenu
      if (tag) seriesTreeNode.tagMenu.push(tag)
      return Promise.resolve()
    }).catch(error => Promise.reject(error))
  }).then(() => {
    return Promise.resolve()
  }).catch(error => Promise.reject(error))
}

// construct include options for query
function constructIncludeOptions (req, res, next) {
  req.includeOptions = {
    include: [{
      model: db.Products,
      include: [
        { model: db.Photos, attributes: ['id', 'primary'] },
        { model: db.Tags }
      ]
    }, {
      model: db.Series, as: 'childSeries'
    }]
  }
  setupIncludeOptions(req.maxMenuLevel, req.includeOptions, req.targetSeries ? req.targetSeries.menuLevel : 0)
  return next()
}

// construct order query options
function constructOrderOptions (req, res, next) {
  let orderOptions = req.orderOptions = []
  orderOptions.push('displaySequence')
  orderOptions.push([db.Products, 'code'])
  orderOptions.push([db.Products, db.Photos, 'primary', 'desc'])
  orderOptions.push([db.Products, db.Tags, 'name'])
  orderOptions.push([{ model: db.Series, as: 'childSeries' }, 'displaySequence'])
  for (let counter = req.targetSeries ? req.targetSeries : 0; counter < req.maxMenuLevel; counter++) {
    orderOptions.push(['displaySequence'])
    orderOptions.push([db.Products, 'code'])
    orderOptions.push([db.Products, db.Photos, 'primary', 'desc'])
    orderOptions.push([db.Products, db.Tags, 'name'])
    for (let counter2 = 0; counter2 <= counter; counter2++) {
      orderOptions[(counter + 1) * 3 + 1].splice(0, 0, { model: db.Series, as: 'childSeries' })
      orderOptions[(counter + 1) * 3 + 2].splice(0, 0, { model: db.Series, as: 'childSeries' })
      orderOptions[(counter + 1) * 3 + 3].splice(0, 0, { model: db.Series, as: 'childSeries' })
      orderOptions[(counter + 1) * 3 + 4].splice(0, 0, { model: db.Series, as: 'childSeries' })
    }
  }
  return next()
}

// patch route proxy function
function determineProxyTarget (req, res, next) {
  let urlQuery = Object.keys(req.query)[0]
  let error = new Error(`unidentified url query element: '${urlQuery}'`)
  switch (urlQuery) {
    case 'displaySequence':
      return patchDisplaySequence(req, res, next)
    case 'name':
      return patchName(req, res, next)
    case 'parentSeriesId':
      return patchParentSeriesId(req, res, next)
    default:
      res.status(400)
      return next(error)
  }
}

// disassociate from photos and products, then delete record
function disassociateAndDelete (req, res, next) {
  let targetSeries = req.targetSeries
  return db.sequelize.transaction(transaction => {
    // disassociate target series with photos
    return targetSeries
      .setPhoto(null, { transaction })
      // disassociate target series with parentSeries
      .then(() => targetSeries
        .update({ parentSeriesId: null }, { transaction })
        .catch(error => Promise.reject(error)))
      // disassociate target series with products
      .then(() => targetSeries
        .setProducts([], { transaction })
        .catch(error => Promise.reject(error)))
      // remove series (soft delete)
      .then(() => db.Series
        .destroy({ where: { id: req.targetSeriesId }, transaction })
        .catch(error => Promise.reject(error)))
      .catch(error => Promise.reject(error))
  }).then(data => {
    req.resJson = {
      data,
      message: data === 1 ? `series (id: ${req.targetSeriesId}) deleted` : undefined
    }
    next()
    return Promise.resolve()
  }).catch(error => next(error))
}

// make sure the target series record existed
function ensureValidTargetSeries (req, res, next) {
  if (!req.targetSeries) {
    res.status(400)
    let error = new Error(`Target series (id: ${req.params.seriesId.toUpperCase()}) does not exist`)
    return next(error)
  }
  return next()
}

// find a set of siblings at a particular node
function findNodeSiblings (req, res, next) {
  return db.Series
    .scope({ method: ['detailed'] })
    .findAll({
      where: {
        parentSeriesId: req.targetSeries
          ? req.targetSeries.parentSeriesId
          : null
      }
    })
    .then(nodeSiblings => {
      req.nodeSiblings = nodeSiblings
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// find original displaySequence position
function findOriginalPosition (req, res, next) {
  if ('displaySequence' in req.query) {
    req.originalPosition = req.targetSeries.displaySequence
  }
  return next()
}

// find target series' parentSeries
function findTargetParentSeries (req, res, next) {
  if ('parentSeriesId' in req.query) {
    let targetParentSeriesId = req.query.parentSeriesId ? req.query.parentSeriesId.toUpperCase() : null
    if (targetParentSeriesId === null) {
      req.targetParentSeriesId = null
      return db.Series
        .findAll({ where: { parentSeriesId: null } })
        .then(rootNodeSiblings => {
          req.targetParentSeries = {
            id: null,
            name: 'Menu Root',
            childSeries: rootNodeSiblings,
            tagMenu: [],
            products: []
          }
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    } else {
      return db.Series
        .scope({ method: ['detailed'] })
        .findById(targetParentSeriesId)
        .then(targetParentSeries => {
          if (!targetParentSeries) {
            res.status(400)
            let error = new Error(`Target parent series (id: ${targetParentSeriesId}) does not exist`)
            next(error)
            return Promise.resolve()
          } else {
            req.targetParentSeriesId = targetParentSeriesId
            req.targetParentSeries = targetParentSeries
            next()
            return Promise.resolve()
          }
        })
        .catch(error => next(error))
    }
  } else {
    return next()
  }
}

// find target displaySequence position and make sure it's within valid range (displaySequence to set)
function findTargetPosition (req, res, next) {
  if ('displaySequence' in req.query) {
    let targetPosition = parseInt(req.query.displaySequence)
    let nodeSiblings = req.nodeSiblings
    if (targetPosition >= nodeSiblings.length) targetPosition = nodeSiblings.length - 1
    if (targetPosition < 0) targetPosition = 0
    if (targetPosition === req.originalPosition) {
      res.status(400)
      let error = new Error('No change in displaySequence')
      return next(error)
    } else {
      req.targetPosition = targetPosition
      return next()
    }
  } else {
    return next()
  }
}

// find out how far down the menu goes
function getMaxMenuLevel (req, res, next) {
  return db.Series
    .max('menuLevel')
    .then(maxMenuLevel => {
      req.maxMenuLevel = maxMenuLevel
      next()
      return Promise.resolve()
    }).catch(error => next(error))
}

// get a copy of series menu tree from root or the specified node
function getMenuTree (req, res, next) {
  let queryOptions = Object.assign(
    {},
    req.includeOptions,
    req.targetSeriesId
      ? { where: { id: req.targetSeriesId } }
      : { where: { menuLevel: 0 } },
    { order: req.orderOptions })
  return db.Series
    .findAll(queryOptions)
    .then(data => {
      req.seriesTree = JSON.parse(JSON.stringify(data))
      next()
      return Promise.resolve()
    }).catch(error => next(error))
}

// get the target series
function findTarget (source = 'params', failIfNotExist = false, failIfUndeclared = false) {
  return (req, res, next) => {
    let targetSeriesId = null
    if (!('seriesId' in req[source])) {
      if (failIfUndeclared) {
        res.status(400)
        let error = new Error(`Target seriesId must be declared at req.${source}`)
        return next(error)
      }
      req.targetSeriesId = null
      req.targetSeries = null
      return next()
    } else {
      targetSeriesId = req[source].seriesId.toUpperCase()
      return db.Series
        .scope({ method: ['detailed'] })
        .findById(targetSeriesId)
        .then(targetSeries => {
          if (!targetSeries && failIfNotExist) {
            res.status(400)
            let error = new Error(`Target series (id: ${targetSeriesId}) does not exist`)
            return Promise.reject(error)
          }
          req.targetSeriesId = targetSeries ? targetSeries.id : null
          req.targetSeries = targetSeries || null
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }
  }
}

// insert series data record
function insertRecord (req, res, next) {
  return db.Series
    .create({
      name: req.body.name,
      menuLevel: req.targetSeriesId ? (req.targetSeries.menuLevel + 1) : 0,
      parentSeriesId: req.targetSeriesId || null,
      displaySequence: req.nodeSiblings.length
    })
    .then(newSeries => {
      req.created = Object.assign({ seriesId: newSeries.id }, newSeries)
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// patch displaySequence and adjust all affected siblings accordingly
function patchDisplaySequence (req, res, next) {
  let targetSeries = req.targetSeries
  let a = req.originalPosition
  let b = req.targetPosition
  return db.sequelize.transaction(transaction => {
    let trxObj = { transaction }
    // update the affected siblings
    return db.Series
      .update({
        displaySequence: a > b
          ? db.sequelize.literal('`displaySequence` + 1')
          : db.sequelize.literal('`displaySequence` - 1')
      }, {
        where: {
          id: { [Op.ne]: targetSeries.id },
          parentSeriesId: targetSeries.parentSeriesId,
          displaySequence: { [Op.between]: [a > b ? b : a, a > b ? a : b] }
        },
        transaction
      })
      // update target
      .then(() => targetSeries.update({ displaySequence: b }, trxObj))
      .catch(error => next(error))
  }).then(() => {
    next()
    return Promise.resolve()
  }).catch(error => next(error))
}

// patch name field value
function patchName (req, res, next) {
  return req.targetSeries
    .update({ name: req.query.name || null })
    .then(() => {
      next()
      return Promise.resolve()
    }).catch(error => next(error))
}

// patch parentSeriesId field value
function patchParentSeriesId (req, res, next) {
  let originalParentSeriesId = req.targetSeries.parentSeriesId
  let targetParentSeriesId = req.targetParentSeries.id
  return db.sequelize.transaction(transaction => {
    // update siblings
    return db.Series.update({
      displaySequence: db.sequelize.literal('`displaySequence` - 1')
    }, {
      where: {
        parentSeriesId: originalParentSeriesId,
        displaySequence: { [Op.gt]: req.targetSeries.displaySequence }
      },
      transaction
    }).then(() => {
      // update target
      return req.targetSeries.update({
        parentSeriesId: targetParentSeriesId,
        displaySequence: req.targetParentSeries.childSeries.length,
        menuLevel: req.targetParentSeries.menuLevel
          ? req.targetParentSeries.menuLevel + 1
          : 0
      }, { transaction })
    })
  }).then(() => {
    next()
    return Promise.resolve()
  }).catch(error => {
    return next(error)
  })
}

function rejectInvalidTargetRequest (req, res, next) {
  if (req.params.seriesId && !req.targetSeries) {
    res.status(400)
    let error = new Error(`Target series (id: ${req.params.seriesId.toUpperCase()}) does not exist`)
    return next(error)
  }
  return next()
}

// send series data in the server response 'data' property
function sendTargetData (req, res, next) {
  req.resJson = { data: req.targetSeries }
  return next()
}

// recursive function to construct nested includeOptions
function setupIncludeOptions (levelCount, baseIncludeOptions, counter = 0) {
  if (counter < levelCount) {
    Object.assign(baseIncludeOptions['include'][1], {
      include: [
        {
          model: db.Products,
          include: [
            { model: db.Photos, attributes: ['id', 'primary'] },
            { model: db.Tags }
          ]
        },
        { model: db.Series, as: 'childSeries' }
      ]
    })
    setupIncludeOptions(levelCount, baseIncludeOptions['include'][1], counter + 1)
  }
}

// recursive function to traverse through series data tree structure
function traverseSeriesTree (seriesTree) {
  return Promise.each(
    seriesTree,
    (seriesTreeNode, index) => {
      // check if this node contains products
      if (seriesTreeNode.products.length > 0) {
        // prep a none repeating list of tags from products under a node
        return constructTagMenu(seriesTreeNode)
          .then(() => {
            // calls this function again to traverse it's child nodes
            if (seriesTreeNode.childSeries.length > 0) {
              return traverseSeriesTree(seriesTreeNode.childSeries)
            } else {
              // returns when there are no further child series
              return Promise.resolve()
            }
          })
      } else {
        // if no product existed under this node, place an empty array
        seriesTreeNode.tagMenu = []
        // calls this function again to traverse it's child nodes
        if (seriesTreeNode.childSeries.length > 0) {
          return traverseSeriesTree(seriesTreeNode.childSeries)
        } else {
          // returns when there are no further child series
          return Promise.resolve()
        }
      }
    }
  )
}
