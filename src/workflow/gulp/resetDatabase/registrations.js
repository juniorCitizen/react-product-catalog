import dotEnv from 'dotenv'
import faker from 'faker'
import Promise from 'bluebird'

dotEnv.config()

const logging = require('../../../server/controllers/logging')
const encryption = require('../../../server/controllers/encryption')

const MOCK_CONTACT_COUNT = 30
const INTERESTED_PRODUCT_COUNT = 20

module.exports = (Countries, Companies, Contacts, Products, Registrations) => {
  return Countries
    .findAll()
    .then(countries => {
      let companies = []
      for (let counter = 0; counter < MOCK_CONTACT_COUNT; counter++) {
        companies.push({
          id: faker.random.uuid().toUpperCase(),
          title: faker.company.companyName(),
          address: faker.address.streetAddress(true),
          telephone: faker.phone.phoneNumber(),
          fax: faker.phone.phoneNumber(),
          website: faker.internet.url(),
          host: false,
          countryId: faker.random.arrayElement(countries).id
        })
      }
      return Promise.resolve(companies)
    })
    .then(companies => {
      let contacts = []
      let encryptedPassword = encryption.sha512(
        process.env.DEFAULT_CONTACT_PASSWORD,
        encryption.saltGen(16)
      )
      for (let counter = 0; counter < MOCK_CONTACT_COUNT; counter++) {
        contacts.push({
          email: faker.internet.email().toLowerCase(),
          name: faker.name.firstName(),
          loginId: 'fake' + counter.toString(),
          hash: encryptedPassword.passwordHash,
          salt: encryptedPassword.salt,
          admin: false,
          companyId: companies[counter].id
        })
      }
      return Companies
        .bulkCreate(companies)
        .then(() => Contacts.bulkCreate(contacts))
        .then(() => Promise.resolve(contacts))
    })
    .map(contact => contact.email)
    .then(contactEmails => {
      return Products
        .findAll()
        .map(product => product.id)
        .then(productIds => {
          let registrations = []
          for (let counter = 0; counter < contactEmails.length; counter++) {
            shuffleArray(productIds)
            for (let counter2 = 0; counter2 < INTERESTED_PRODUCT_COUNT; counter2++) {
              let addTag = (Math.random() < 0.2)
              if (addTag) {
                registrations.push({
                  comments: faker.lorem.paragraph(),
                  contactId: contactEmails[counter],
                  productId: productIds[counter2],
                  notified: true,
                  contacted: true
                })
              }
            }
          }
          return Registrations.bulkCreate(registrations)
        })
    })
    .then(logging.resolve('建立範例客戶資訊登錄資料... 成功'))
    .catch(logging.reject('建立範例客戶資訊登錄資料... 失敗'))
}

function shuffleArray (array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
}
