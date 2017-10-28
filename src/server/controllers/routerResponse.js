import eVars from '../config/environment.js'

const cannedMessage = {
  200: '200 OK',
  201: '201 Created',
  202: '202 Accepted',
  204: '204 No Content',
  400: '400 Bad Request',
  401: '401 Unauthorized',
  403: '403 Forbidden',
  404: '404 Not Found',
  405: '405 Method Not Allowed',
  500: '500 Internal Server Error',
  501: '501 Not Implemented',
  503: '503 Service Unavailable'
}

module.exports = {
  image: imageResponse,
  streamImage: streamImageResponse,
  file: fileResponse,
  json: jsonResponse,
  template: templateResponse
}

// requires an object argument
// {
//     pendingResponse: res object from the route handler,
//     statusCode: intended execution status (integer),
//     reference: string of the template file,
//     data: object to be passed to the template file
// }
// example:
// routerResponse.template({
//     pendingResponse: response, // res obj from route handler param
//     statusCode: 500,
//     reference: 'regFail', // name of template view file
//     data: {
//         title: eVars.SYS_REF
//     }
// });
function templateResponse (args) {
  return args.pendingResponse
    .status(args.statusCode)
    .render(
      args.view,
      args.data
    )
}

// requires an object argument
// {
//     pendingResponse: res object from the route handler,
//     originalRequest: req object from the route handler,
//     statusCode: intended execution status (integer),
//     success: result of the the route handler execution (boolean),
//     error: object containing whatever the route handler had passed (optional),
//     data: object containing whatever the route handler had passed (optional),
//     message: string (optional)
// }
// example:
// routerResponse.json({
//     pendingResponse: response,
//     originalRequest: request,
//     statusCode: 200,
//     success: true,
//     // error: {}, // optional
//     // data: {}, // optional
//     message: 'example message' // optional
// });
function jsonResponse (args) {
  return args.pendingResponse
    .status(args.statusCode)
    .json({
      method: args.originalRequest.method,
      endpoint: `${args.originalRequest.protocol}://${args.originalRequest.hostname}:${eVars.PORT}${args.originalRequest.originalUrl}`,
      success: args.success,
      statusCode: args.pendingResponse.statusCode,
      error: ((!args.success) && (args.error)) ? args.error : null,
      data: ((args.success) && (args.data)) ? args.data : null,
      message: (
        (args.message !== null) &&
        (args.message !== undefined) &&
        (args.message !== '')
      ) ? args.message : cannedMessage[args.pendingResponse.statusCode.toString()]
    }).end()
}

function imageResponse (args) {
  return args.pendingResponse
    .status(args.statusCode)
    .type(args.mimeType)
    .sendFile(args.filePath)
}

function streamImageResponse (args) {
  return args.pendingResponse
    .status(args.statusCode)
    .type(args.mimeType)
    .send(args.dataBuffer)
}

function fileResponse (args) {
  return args.pendingResponse
    .status(args.statusCode)
    .type(args.mimeType)
    .sendFile(args.filePath)
}
