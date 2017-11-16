const formatLinkHeader = require('format-link-header')

const eVars = require('../config/eVars')

module.exports = (perPageDefault = 5, perPageCeilingDefault = 20, getRecordCountAsyncFn) => {
  return async (req, res, next) => {
    if (req.query.hasOwnProperty('per_page')) {
      let recordCount = await getRecordCountAsyncFn
      let perPage = (() => {
        let a = parseInt(req.query.per_page) || perPageDefault
        if (perPageCeilingDefault === 0) {
          return a
        } else {
          return a > perPageCeilingDefault ? perPageCeilingDefault : a
        }
      })()
      let currentPage = parseInt(req.query.page) || 1
      let lastPage = Math.ceil(recordCount / perPage)
      let baseStructure = {
        page: null,
        per_page: null,
        url: `${eVars.PROTOCOL}://${eVars.DOMAIN}:${eVars.PORT}/${eVars.SYS_REF}/api${req.path}`
      }
      if (lastPage === 1) return next()

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
      res.set('Link', formatLinkHeader(req.linkHeader))
    }
    next()
  }
}
