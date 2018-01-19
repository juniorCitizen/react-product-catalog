import axios from 'axios'
import config from '../config'

export function jwt_info(token) {
  if (token) {
    try {
      let payload = token.split('.')
      return JSON.parse(new Buffer(payload[1], 'base64').toString())
    } catch (e) {
      console.log(e)
      return null
    }
  }
  return null
}

export function test() {
  axios({
    method: 'get',
    url: config.route.series.list,
  })
  .then(function (response) {
    //console.log(response.data)
    if (response.status === 200) {

    } else {
      console.log(response)
    }
  }).catch(function (error) {
    console.log(error)
  })

  return {
    aaa:  (res) => {
      console.log(res)
    }
  }

  /*
  function addContact(id, refreshCallback) {
    refreshCallback();
    // You can also pass arguments if you need to
    // refreshCallback(id);
  }

  function refreshContactList() {
      alert('Hello World');
  }

  addContact(1, refreshContactList);
  */
}