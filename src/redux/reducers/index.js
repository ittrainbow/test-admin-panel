import { combineReducers } from 'redux'
import Auth from './Auth'
import Theme from './Theme'
import App from './App'

const reducers = combineReducers({
  app: App,
  theme: Theme,
  auth: Auth
})

export default reducers
