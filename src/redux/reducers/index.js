import { combineReducers } from 'redux'
import Auth from './Auth'
import Theme from './Theme'
import App from './App'
import DragDrop from './DragDrop'

const reducers = combineReducers({
  app: App,
  theme: Theme,
  auth: Auth,
  dragdrop: DragDrop
})

export default reducers
