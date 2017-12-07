import * as re  from '../../reducers/loginReducer'
import { expect } from 'chai'

describe('test loginReducer', () => {
    it('USER_INFO', () => {
        let info = Math.random().toString(36).substring(7)
        let action = { type: 'USER_INFO', info: info }
        let expected = { auth: true, info: info }
        let actual = re.login({}, action).user_info
        expect(actual).to.be.deep.equal(expected)
    })
    
    it('ADMIN_INFO', () => {
        let info = Math.random().toString(36).substring(7)
        let action = { type: 'ADMIN_INFO', info: info }
        let expected = { auth: true, info: info }
        let actual = re.login({}, action).admin_info
        expect(actual).to.be.deep.equal(expected)
    })

    it('USER_LOGOUT', () => {
        let info = Math.random().toString(36).substring(7)
        let action = { type: 'USER_LOGOUT' }
        let expected = { auth: false, info: null }
        let actual = re.login({}, action).user_info
        expect(actual).to.be.deep.equal(expected)
    })
    
    it('ADMIN_LOGOUT', () => {
        let info = Math.random().toString(36).substring(7)
        let action = { type: 'ADMIN_LOGOUT' }
        let expected = { auth: false, info: null }
        let actual = re.login({}, action).admin_info
        expect(actual).to.be.deep.equal(expected)
    })
})