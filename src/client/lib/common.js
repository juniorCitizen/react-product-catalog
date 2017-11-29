export function jwt_info(token) {
    if (token) {
        let payload = token.split('.')
        return JSON.parse(new Buffer(payload[1], 'base64').toString())
    }
}