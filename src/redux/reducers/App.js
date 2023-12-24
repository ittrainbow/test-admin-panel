import {
  ERROR,
  FETCH_PRODUCTS,
  FETCH_USERS,
  SET_LOADING_FALSE,
  SET_LOADING_TRUE,
  SET_PRODUCTS,
  SET_USERS
} from 'redux/constants/App'
import {
  AUTHENTICATED,
  SHOW_AUTH_MESSAGE,
  SIGNIN_WITH_FACEBOOK_AUTHENTICATED,
  SIGNIN_WITH_GOOGLE_AUTHENTICATED,
  SIGNOUT_SUCCESS,
  SIGNUP_SUCCESS
} from 'redux/constants/Auth'

const initState = {
  loading: false,
  users: [],
  products: [],
  error: null
}

const app = (state = initState, action) => {
  switch (action.type) {
    case SET_LOADING_TRUE:
    case FETCH_USERS:
    case FETCH_PRODUCTS:
      return {
        ...state,
        loading: true
      }

    case SET_LOADING_FALSE:
    case AUTHENTICATED:
    case SHOW_AUTH_MESSAGE:
    case SIGNOUT_SUCCESS:
    case SIGNUP_SUCCESS:
    case SIGNIN_WITH_GOOGLE_AUTHENTICATED:
    case SIGNIN_WITH_FACEBOOK_AUTHENTICATED:
      return {
        ...state,
        loading: false
      }

    case SET_PRODUCTS:
      return {
        ...state,
        products: action.payload
      }

    case SET_USERS:
      return {
        ...state,
        users: action.payload
      }

    case ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      }

    default:
      return state
  }
}

export default app
