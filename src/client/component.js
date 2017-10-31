import './assets/app.css'
import bulma from './assets/bulma.scss'

export default (text = 'bulma') => {
  const element = document.createElement('div')

  element.innerHTML = text

  element.className = `${bulma.button} ${bulma['is-danger']}`

  return element
}
