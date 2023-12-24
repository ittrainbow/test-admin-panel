import { all, call, spawn } from 'redux-saga/effects'
import Auth from './Auth'
import App from './App'

const sagas = [Auth, App]

export default function* rootSaga(getState) {
  const run = sagas.map((saga) => {
    return spawn(function* () {
      while (true) {
        try {
          yield call(saga)
          break
        } catch (error) {
          console.error(error)
        }
      }
    })
  })

  yield all(run)
}
