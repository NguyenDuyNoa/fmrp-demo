import { combineReducers, createStore } from 'redux'

const adminState = {
	auth: null,
  availableLang: [
    {label: "English", code: "en"},
    {label: "Tiếng Việt", code: "vi"},
  ],
  lang: "vi",
  unit_NVL: null,
  branch: null,
  variant_NVL: null
}

function adminReducer(state = adminState, action) {
  switch (action.type) {
    case 'auth/update':
      return { ...state, auth: action.payload }
    case 'lang/update':
      return { ...state, lang: action.payload }
    case 'unit_NVL/update':
      return { ...state, unit_NVL: action.payload }
    case 'branch/update':
      return { ...state, branch: action.payload }
    case 'variant_NVL/update':
      return { ...state, variant_NVL: action.payload }
    default:
      return state
  }
}

const store = createStore(adminReducer);
export default store;