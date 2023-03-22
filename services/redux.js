import { combineReducers, createStore } from 'redux'

const adminState = {
	auth: null,
  availableLang: [
    {label: "English", code: "en"},
    {label: "Tiếng Việt", code: "vi"},
  ],
  lang: "vi",
  option_NhomNVL: null
}

function adminReducer(state = adminState, action) {
  switch (action.type) {
    case 'auth/update':
      return { ...state, auth: action.payload }
    case 'lang/update':
      return { ...state, lang: action.payload }
    case 'option_NhomNVL/update':
      return { ...state, option_NhomNVL: action.payload }
    default:
      return state
  }
}

const store = createStore(adminReducer);
export default store;