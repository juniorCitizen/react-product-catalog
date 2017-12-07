import * as co from '../../lib/common'
import { expect } from 'chai'

describe('test lib common', () => {
    describe('test jwt_info function', () => {
        it('token is empty return null', () => {
            expect(co.jwt_info('')).to.be.equal(null)
        })
        it('token decoded success', () => {
            let token =
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ" +
                "zdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4" +
                "gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cB" +
                "ab30RMHrHDcEfxjoYZgeFONFh7HgQ"
            let expected = {
                "sub": "1234567890",
                "name": "John Doe",
                "admin": true
            }
            expect(co.jwt_info(token)).to.be.deep.equal(expected)
        })
    })
})