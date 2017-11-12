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
  file: fileResponse,
  image: imageResponse,
  imageBuffer: imageBufferResponse,
  json: jsonResponse,
  stream: streamResponse,
  template: templateResponse
}

// requires an object argument
// {
//     res: res object from the route handler,
//     statusCode: intended execution status (integer),
//     view: string of the template file,
//     data: object to be passed to the template file
// }
// example:
// routerResponse.template({
//     res: res, // res obj from route handler param
//     statusCode: 500,
//     view: 'regFail', // name of template view file
//     data: {
//         title: eVars.SYS_REF
//     }
// });
function templateResponse (args) {
  return args.res
    .status(args.statusCode)
    .render(args.view, args.data || {})
}

// requires an object argument
// {
//     req: req object from the route handler,
//     res: res object from the route handler,
//     statusCode: intended execution status (integer),
//     success: result of the the route handler execution (boolean),
//     error: object containing whatever the route handler had passed (optional),
//     data: object containing whatever the route handler had passed (optional),
//     message: string (optional)
// }
// example:
// routerResponse.json({
//     req: req,
//     res: res,
//     statusCode: 200,
//     error: {}, // optional
//     data: {}, // optional
//     message: 'example message' // optional
// });
function jsonResponse (args) {
  return args.res
    .status(args.statusCode)
    .json({
      method: args.req.method,
      endpoint: `${args.req.protocol}://${args.req.hostname}:${eVars.PORT}${args.req.originalUrl}`,
      statusCode: args.res.statusCode,
      error: args.error ? args.error : null,
      data: args.data ? args.data : null,
      message: args.message ? args.message : cannedMessage[args.res.statusCode.toString()]
    }).end()
}

function imageBufferResponse (args) {
  return args.res
    .status(args.statusCode)
    .type(args.mimeType)
    .send(args.dataBuffer)
}

function imageResponse (args) {
  return args.res
    .status(args.statusCode)
    .type(args.mimeType)
    .sendFile(args.filePath)
}

function fileResponse (args) {
  return args.res
    .status(args.statusCode)
    .type(args.mimeType)
    .sendFile(args.filePath)
}

function streamResponse (args) {
  args.res
    .status(args.statusCode)
    .type(args.mimeType)
    .attachment(args.filenName)
  return args.stream.pipe(args.res)
}
