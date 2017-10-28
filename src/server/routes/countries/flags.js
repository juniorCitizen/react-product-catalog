import path from 'path'

import routerResponse from '../../controllers/routerResponse'

module.exports = (req, res) => {
  return routerResponse.image({
    pendingResponse: res,
    statusCode: 200,
    mimeType: 'image/svg+xml',
    filePath: path.join(__dirname, `../../client/assets/${req.query.countryId}.svg`)
  })
}
