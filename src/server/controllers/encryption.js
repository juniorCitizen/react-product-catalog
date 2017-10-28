import crypto from 'crypto'

module.exports = {
    saltGen: saltGen,
    sha512: sha512
}

function saltGen(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length)
}

function sha512(password, salt) {
    let hash = crypto.createHmac('sha512', salt)
    hash.update(password)
    let value = hash.digest('hex')
    return {
        salt: salt,
        passwordHash: value
    }
}
