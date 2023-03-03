import { combineReducers, createStore } from 'redux'

const adminState = {
	auth: true,
}

function adminReducer(state = adminState, action) {
  switch (action.type) {
    case 'auth/update':
      return { ...state, auth: action.payload }
    default:
      return state
  }
}

const store = createStore(adminReducer);
export default store;