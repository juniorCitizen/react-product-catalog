const baseOptions = {
  countries: {
    attributes: { exclude: ['flagSvg'] },
    order: ['region', 'name']
  },
  products: { order: ['code'] },
  series: { order: ['order'] }
}

module.exports = (modelReference) => {
  return (req, res, next) => {
    if (!(modelReference in baseOptions)) {
      res.status(501)
      let error = new Error(`資料表模板 ${modelReference} 基礎查詢選項尚未設置`)
      error.message = `資料表模板 ${modelReference} 基礎查詢選項尚未設置`
      return next(error)
    }
    req.queryOptions = baseOptions[modelReference]
    return next()
  }
}
