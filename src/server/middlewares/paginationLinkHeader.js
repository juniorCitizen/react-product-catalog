const formatLinkHeader = require('format-link-header')

const eVars = require('../config/eVars')

module.exports = (getRecordCountAsyncFn, perPageDefault = 5, perPageCeiling = 20) => {
  return async (req, res, next) => {
    let query = req.query
    // get total record count of dataset
    let recordCount = await getRecordCountAsyncFn
    // determine per_page value
    let perPage = 'per_page' in query // if per_page is specified
      ? parseInt(query.per_page) <= perPageCeiling
        ? parseInt(query.per_page) // set to specified if within ceiling
        : perPageCeiling // set to ceiling if over
      : perPageDefault // use default if perPage not specified
    // calculate last page
    let lastPage = Math.ceil(recordCount / perPage)
    // determin current page
    let currentPage = 'page' in query
      ? parseInt(query.page) < 1 // if client specifies
        ? 1 // set to one, if less than one
        : parseInt(query.page) > lastPage
          ? lastPage // set to lastPage if too big
          : parseInt(query.page) // set to client specified
      : 1 // set to one, if not found

    let baseStructure = {
      page: null,
      per_page: null,
      url: `${eVars.PROTOCOL}://${eVars.DOMAIN}:${eVars.PORT}/${eVars.SYS_REF}/api${req.path}`
    }

    if (lastPage === 1) return next() // exit middleware if there's only one page

    req.linkHeader = {}
    req.linkHeader.first = Object.assign({ rel: 'first' }, baseStructure)
    req.linkHeader.first.page = 1
    req.linkHeader.first.per_page = perPage
    req.linkHeader.first.url += `?per_page=${perPage}&page=1`

    req.linkHeader.self = Object.assign({ rel: 'self' }, baseStructure)
    req.linkHeader.self.page = currentPage
    req.linkHeader.self.per_page = perPage
    req.linkHeader.self.url += `?per_page=${perPage}&page=${currentPage}`

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
    next()
  }
}
