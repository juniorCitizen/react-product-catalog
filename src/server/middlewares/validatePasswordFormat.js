module.exports = (req, res, next) => {
  if (!('password' in req.body)) {
    res.status(400)
    let error = new Error('Password not found')
    return next(error)
  } else if ((req.body.password.length < 8) || (req.body.password.length > 20)) {
    res.status(400)
    let error = new Error('Illegal password length')
    error.message = 'Password should be 8 to 20 characters long'
    return next(error)
  }
  return next()
}
