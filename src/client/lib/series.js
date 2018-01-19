import axios from 'axios'
import config from '../config'

export function getSeries(msg) {
  axios({
    method: 'get',
    url: config.route.series.list,
  })
  .then(function (response) {
    if (response.status === 200) {
      let series = self.setSeriesActive(response.data.data, selectedId)
      console.log(series)
      dispatch(updateSeries(series))
    } else {
      console.log(response.data)
    }
  }).catch(function (error) {
    console.log(error)
  })

  return {
    then: function(res) {

    }
  }
}