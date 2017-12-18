import * as ax from '../../actions/loginAction'
import { expect } from 'chai'

describe('test loginAction', () => {
  it('set user info', () => {
    let info = Math.random().toString(36).substring(7)
    let expected = { type: 'USER_INFO', info: info }
    expect(ax.user_info(info)).to.be.deep.equal(expected)
  })

  it('set admin info', () => {
    let info = Math.random().toString(36).substring(7)
    let expected = { type: 'ADMIN_INFO', info: info }
    expect(ax.admin_info(info)).to.be.deep.equal(expected)
  })

  it('user logout', () => {
    let expected = { type: 'USER_LOGOUT' }
    expect(ax.user_logout()).to.be.deep.equal(expected)
  })

  it('admin logout', () => {
    let expected = { type: 'ADMIN_LOGOUT' }
    expect(ax.admin_logout()).to.be.deep.equal(expected)
  })
})


