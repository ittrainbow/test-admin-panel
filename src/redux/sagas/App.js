import { call, delay, put, takeEvery } from 'redux-saga/effects'
import {
  DELAY,
  ERROR,
  FETCH_PRODUCTS,
  FETCH_USERS,
  SET_LOADING_FALSE,
  SET_LOADING_TRUE,
  SET_PRODUCTS,
  SET_USERS
} from 'redux/constants/App'

const fetchData = async (string) => {
  const data = await fetch(string).then((resp) => resp.json())
  return data
}

function* fetchProductsSaga() {
  yield put({ type: SET_LOADING_TRUE })

  try {
    const products = yield call(fetchData, 'https://fakestoreapi.com/products/')
    yield delay(1000)
    yield put({ type: SET_PRODUCTS, payload: products })
  } catch (error) {
    if (console.error instanceof Error) {
      yield put({ type: ERROR, payload: error.message })
    }
  }

  yield put({ type: SET_LOADING_FALSE })
}

function* fetchUsersSaga() {
  yield put({ type: SET_LOADING_TRUE })

  try {
    const users = yield call(fetchData, 'https://jsonplaceholder.typicode.com/users/')
    yield delay(1000)
    yield put({ type: SET_USERS, payload: users })
  } catch (error) {
    if (console.error instanceof Error) {
      yield put({ type: ERROR, payload: error.message })
    }
  }

  yield put({ type: SET_LOADING_FALSE })
}

function* delaySaga() {
  yield put({ type: SET_LOADING_TRUE })
  yield delay(1000)
  yield put({ type: SET_LOADING_FALSE })
}

export default function* appSagas() {
  yield takeEvery(FETCH_PRODUCTS, fetchProductsSaga)
  yield takeEvery(FETCH_USERS, fetchUsersSaga)
  yield takeEvery(DELAY, delaySaga)
}
