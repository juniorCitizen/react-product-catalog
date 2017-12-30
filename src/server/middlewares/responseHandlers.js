const logging = require('../controllers/logging')
const eVars = require('../config/eVars')

const cannedMessage = {
  200: '200 OK',
  201: '201 Created',
  202: '202 Accepted',
  204: '204 No Content',
  400: '400 Bad Request',
  401: '401 Unauthorized',
  403: '403 Forbidden',
  404: '404 Not Found',
  500: '500 Internal Server Error',
  501: '501 Not Implemented',
  503: '503 Service Unavailable',
  505: '505 Permission Denied'
}

module.exports = {
  file,
  image,
  json,
  redirect,
  // stream: null, // not implemented
  template,
  error
}

function redirect (req, res, next) {
  if (('resRedirect' in req) || (res.statusCode === 404)) {
    return res
      .status(res.statusCode || 301)
      .redirect(req.resRedirect)
      .end()
  } else {
    return next()
  }
}

// not implemented yet
// function streamResponse (args) {
//   args.res
//     .status(args.statusCode)
//     .type(args.mimeType)
//     .attachment(args.fileName)
//   return args.stream.pipe(args.res)
// }

/*
sends a file response
set res.status and a req.resFile object
example:
res.status(200)
req.resFile = {
  mimeType: 'image/jpeg',
  filePath: path.resolve('./somePath/example.jpg') // absolute path
}
*/
function file (req, res, next) {
  if (!('resFile' in req)) return next()
  return res
    .status(res.statusCode || 200)
    .type(req.resFile.mimeType)
    .sendFile(req.resFile.filePath)
    .end()
}

/*
sends an image
set res.status and a req.resImage object
example:
res.status(200)
req.resFile = {
  mimeType: 'image/jpeg',
  data: new Buffer('./someImage.jpg')
}
*/
function image (req, res, next) {
  if (!('resImage' in req)) return next()
  return res
    .status(res.statusCode || 200)
    .type(req.resImage.mimeType)
    .send(req.resImage.data)
    .end()
}

/*
sends a json response
set res.status and add req.resJson object to activate this middleware
example:
res.status(200)
req.resJson = {
  data: data, // (optional)
  message: message // (optional)
}
*/
function json (req, res, next) {
  if (!('resJson' in req)) return next()
  req.resJson.method = req.method.toLowerCase()
  req.resJson.endpoint = `${eVars.HOST}${req.originalUrl}`
  req.resJson.statusCode = res.statusCode
  if (!('message' in req.resJson)) {
    req.resJson.message = cannedMessage[res.statusCode.toString()]
  }
  if ('linkHeader' in req) {
    Object.assign(req.resJson, {
      pagination: {
        totalRecords: req.linkHeader.last.per_page * req.linkHeader.last.page,
        totalPages: req.linkHeader.last.page,
        perPage: req.linkHeader.last.per_page,
        currentPage: req.linkHeader.self.page,
        first: req.linkHeader.first.url,
        prev: req.linkHeader.prev === undefined ? undefined : req.linkHeader.prev.url,
        self: req.linkHeader.self.url,
        next: req.linkHeader.next === undefined ? undefined : req.linkHeader.next.url,
        last: req.linkHeader.last.url
      }
    })
  }
  return res
    .status(res.statusCode || 200)
    .type('application/json;charset=utf-8')
    .json(req.resJson)
    .end()
}

/*
sends the specified template
set res.status and add a req.resTemplate object to activate this middleware
example:
res.status(404)
req.resTemplate = {
  view: 'notFound', // name of the template file
  data: { // (optional) data that will be passed to the template engine
    a: 'fake data'
    b: 'fake data'
    etc: ...
  }
}
*/
function template (req, res, next) {
  if (!('resTemplate' in req)) return next()
  return res
    .status(res.statusCode || 200)
    .type('text/html;charset=utf-8')
    .render(req.resTemplate.view, req.resTemplate.data || {})
}

// router specific global error handler
function error (error, req, res, next) {
  logging.warning('觸發 API 端點全域錯誤處理中介部件')
  res.status(res.statusCode >= 400 ? res.statusCode : 500)
  let resJson = {
    method: req.method.toLowerCase(),
    endpoint: `${req.protocol}://${req.hostname}:${eVars.PORT}${req.originalUrl}`,
    message: 'customMessage' in error
      ? error.customMessage
      : cannedMessage[res.statusCode.toString()]
  }
  if (eVars.NODE_ENV !== 'production') {
    resJson.error = {
      code: error.code,
      name: error.name,
      message: error.message,
      stack: error.stack
    }
  } else {
    resJson.error = {
      name: error.name,
      message: error.message
    }
  }
  delete error.customMessage
  return res
    .type('application/json;charset=utf-8')
    .json(resJson)
}
