//const env = require('../../src/server/config/eVars')
//const env = process.env
const sys_ref = '/reactProductCatalog'
const api = '/reactProductCatalog/api'
export default {
  sys_ref: sys_ref,
  api: api,
  route: {
    contacts: {
      contacts: api + '/contacts/',
      register: api + '/contacts',
      tokens: api + '/login',
    },
    productMenu: api + '/productMenus',
    products: {
      detail: api + '/products/',
    },
    photos: {
      getPhoto: api + '/photos/',
    },
  },
  project: {
    name: 'reactProductCatalog',
  },
  contact: {
    name: '秀田醫療器材有限公司',
    info: {
      address: '嘉義市保忠三街116號',
      tel: '(05)2755-699',
      fax: '(05)2755-099',
      mail: '615666@gmail.com',
    },
    slogan: '醫療專業 貼心服務',
  }
}