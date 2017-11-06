const routerResponse = require('../../controllers/routerResponse')

module.exports = {
  preventDoubleQueryParameters: preventDoubleQueryParameters,
  ensureSingleQueryParameter: ensureSingleQueryParameter
}

function preventDoubleQueryParameters (req, res, next) {
  if ((req.query.id !== undefined) && (req.query.name !== undefined)) {
    return routerResponse.json({
      req: req,
      res: res,
      statusCode: 400,
      message: '不接受 id & name query 條件同時存在'
    })
  }
  return next()
}

function ensureSingleQueryParameter (req, res, next) {
  if ((req.query.id !== undefined) && (req.query.name !== undefined)) {
    return routerResponse.json({
      req: req,
      res: res,
      statusCode: 400,
      message: '不接受 id & name query 條件同時存在'
    })
  } else if ((req.query.id === undefined) && (req.query.name === undefined)) {
    return routerResponse.json({
      req: req,
      res: res,
      statusCode: 400,
      message: '必須使用 id 或者是 name query 其一'
    })
  }
  return next()
}
