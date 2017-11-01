import eVars from '../../../server/config/eVars'

module.exports = (() => {
  return [{
    id: 0,
    title: 'Gentry Way Co., Ltd.',
    address: 'No. 152, Wufu Road, Yanshui District, Tainan City, 737',
    countryId: 'TWN',
    telephone: '+886-(0)6-6529052',
    fax: '+886-(0)6-6527093',
    website: `${eVars.HOST}/${eVars.SYS_REF}`
  }, {
    id: 1,
    title: 'Gentry Hardware Products Co., Ltd.',
    address: 'No. 158, Dongcheng Rd., Dongsheng Town, Zhongshan, Guangdong, China',
    countryId: 'CHN',
    telephone: '+86-760-22229026 ~ 28',
    fax: '+86-760-22820916',
    website: `${eVars.HOST}/${eVars.SYS_REF}`
  }]
})()
