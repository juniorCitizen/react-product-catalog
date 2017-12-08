const baseOptions = {
  carousels: (req) => {
    return (('per_page' in req.query) && ('page' in req.query))
      ? { attributes: ['data', 'mimeType'] }
      : { attributes: { exclude: ['data'] }, order: ['displaySequence'] }
  },
  countries: () => {
    return {
      attributes: { exclude: ['flagSvg'] },
      order: ['region', 'name']
    }
  },
  products: () => { return { order: ['code'] } },
  series: () => { return { order: ['displaySequence'] } }
}

module.exports = (modelReference) => {
  return (req, res, next) => {
    if (!(modelReference in baseOptions)) {
      res.status(501)
      let error = new Error(`資料表模板 ${modelReference} 基礎查詢選項尚未設置`)
      error.message = `資料表模板 ${modelReference} 基礎查詢選項尚未設置`
      return next(error)
    }
    req.queryOptions = baseOptions[modelReference](req)
    return next()
  }
}
