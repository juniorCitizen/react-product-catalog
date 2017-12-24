const formatLinkHeader = require('format-link-header')

const eVars = require('../config/eVars')

module.exports = (getRecordCountFn) => {
  return async (req, res, next) => {
    let query = req.query

    // check if pagination is required
    if (!('per_page' in query) || !('page' in query)) return next()

    // get total record count of dataset
    let recordCount = await getRecordCountFn()

    if (recordCount === 0) return next()

    // determine per_page value
    let perPage = parseInt(query.per_page) > recordCount
      ? recordCount
      : parseInt(query.per_page) < 1
        ? 1
        : parseInt(query.per_page)

    // calculate last page
    let lastPage = Math.ceil(recordCount / perPage)

    // determin current page
    let currentPage = parseInt(query.page) > lastPage
      ? lastPage
      : parseInt(query.page) < 1
        ? 1
        : parseInt(query.page)

    let baseStructure = {
      page: null,
      per_page: null,
      url: `${eVars.APP_ROUTE}/api${req.path}`
    }

    let linkHeader = {}

    linkHeader.self = Object.assign({ rel: 'self' }, baseStructure)
    linkHeader.self.page = currentPage
    linkHeader.self.per_page = perPage
    linkHeader.self.url += `?per_page=${perPage}&page=${currentPage}`

    linkHeader.first = Object.assign({ rel: 'first' }, baseStructure)
    linkHeader.first.page = 1
    linkHeader.first.per_page = perPage
    linkHeader.first.url += `?per_page=${perPage}&page=1`

    linkHeader.last = Object.assign({ rel: 'last' }, baseStructure)
    linkHeader.last.page = lastPage
    linkHeader.last.per_page = perPage
    linkHeader.last.url += `?per_page=${perPage}&page=${lastPage}`

    if (currentPage > 1) {
      linkHeader.prev = Object.assign({ rel: 'prev' }, baseStructure)
      linkHeader.prev.page = currentPage - 1
      linkHeader.prev.per_page = perPage
      linkHeader.prev.url += `?per_page=${perPage}&page=${currentPage - 1}`
    }

    if (currentPage < lastPage) {
      linkHeader.next = Object.assign({ rel: 'next' }, baseStructure)
      linkHeader.next.page = currentPage + 1
      linkHeader.next.per_page = perPage
      linkHeader.next.url += `?per_page=${perPage}&page=${currentPage + 1}`
    }

    // place additional url query properties back into the generated url's
    ['first', 'prev', 'self', 'next', 'last'].forEach((linkHeaderProp) => {
      if (linkHeaderProp in linkHeader) {
        for (let urlQueryProp in query) {
          if ((urlQueryProp !== 'page') && (urlQueryProp !== 'per_page')) {
            linkHeader[linkHeaderProp].url += `&${urlQueryProp}`
            if (query[urlQueryProp]) linkHeader[linkHeaderProp].url += `=${query[urlQueryProp]}`
          }
        }
      }
    })

    req.linkHeader = linkHeader

    if (!('queryOptions' in req)) req.queryOptions = {}
    req.queryOptions.limit = perPage
    req.queryOptions.offset = perPage * (currentPage - 1)

    // put link header into the res object
    res.set('Link', formatLinkHeader(req.linkHeader))
    return next()
  }
}
