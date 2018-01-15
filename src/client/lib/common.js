export function jwt_info(token) {
  if (token) {
    try {
      let payload = token.split('.')
      return JSON.parse(new Buffer(payload[1], 'base64').toString())
    } catch (e) {
      console.log(e)
      return null
    }
  }
  return null
}