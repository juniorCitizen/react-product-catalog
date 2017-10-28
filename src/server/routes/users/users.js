import express from 'express'

import localhostOnly from '../../middlewares/localhostOnly'
import validatePasswordFormat from '../../middlewares/validatePasswordFormat'

const router = express.Router()

router
    .post(
        '/addUser',
        localhostOnly,
        validatePasswordFormat,
        require('./addUser')
    )

module.exports = router
