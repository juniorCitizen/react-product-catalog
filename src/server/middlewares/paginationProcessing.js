const formatLinkHeader = require('format-link-header')

const eVars = require('../config/eVars')

module.exports = (req, res, next) => {
  let query = req.query

  // check if pagination is required
  if (!('per_page' in query) || !('page' in query)) return next()

  // get total record count of dataset
  let recordCount = req.dataSourceRecordCount
  // determine per_page value
  let perPage = (() => {
    return parseInt(req.query.per_page) > req.dataSourceRecordCount
      ? req.dataSourceRecordCount
      : parseInt(req.query.per_page) < 1
        ? 1
        : parseInt(req.query.per_page)
  })()
  // calculate last page
  let lastPage = Math.ceil(recordCount / perPage)
  // determin current page
  let currentPage = (() => {
    return parseInt(req.query.page) > lastPage
      ? lastPage
      : parseInt(req.query.page) < 1
        ? 1
        : parseInt(req.query.page)
  })()

  let baseStructure = {
    page: null,
    per_page: null,
    url: `${eVars.APP_ROUTE}/api${req.path}`
  }

  req.linkHeader = {}

  req.linkHeader.self = Object.assign({ rel: 'self' }, baseStructure)
  req.linkHeader.self.page = currentPage
  req.linkHeader.self.per_page = perPage
  req.linkHeader.self.url += `?per_page=${perPage}&page=${currentPage}`

  req.linkHeader.first = Object.assign({ rel: 'first' }, baseStructure)
  req.linkHeader.first.page = 1
  req.linkHeader.first.per_page = perPage
  req.linkHeader.first.url += `?per_page=${perPage}&page=1`

  req.linkHeader.last = Object.assign({ rel: 'last' }, baseStructure)
  req.linkHeader.last.page = lastPage
  req.linkHeader.last.per_page = perPage
  req.linkHeader.last.url += `?per_page=${perPage}&page=${lastPage}`

  if (currentPage > 1) {
    req.linkHeader.prev = Object.assign({ rel: 'prev' }, baseStructure)
    req.linkHeader.prev.page = currentPage - 1
    req.linkHeader.prev.per_page = perPage
    req.linkHeader.prev.url += `?per_page=${perPage}&page=${currentPage - 1}`
  }

  if (currentPage < lastPage) {
    req.linkHeader.next = Object.assign({ rel: 'next' }, baseStructure)
    req.linkHeader.next.page = currentPage + 1
    req.linkHeader.next.per_page = perPage
    req.linkHeader.next.url += `?per_page=${perPage}&page=${currentPage + 1}`
  }
  // place additional url query properties back into the generated url's
  ['first', 'prev', 'self', 'next', 'last'].forEach((linkHeaderProp) => {
    if (linkHeaderProp in req.linkHeader) {
      for (let urlQueryProp in req.query) {
        if ((urlQueryProp !== 'page') && (urlQueryProp !== 'per_page')) {
          req.linkHeader[linkHeaderProp].url += `&${urlQueryProp}=${req.query[urlQueryProp]}`
        }
      }
    }
  })
  req.queryOptions.limit = perPage
  req.queryOptions.offset = perPage * (currentPage - 1)
  // put link header into the res object
  res.set('Link', formatLinkHeader(req.linkHeader))
  return next()
}
