import { combineReducers, createStore } from "redux";

const adminState = {
    auth: null,
    availableLang: [
        { label: "English", code: "en" },
        { label: "Tiếng Việt", code: "vi" },
    ],
    lang: "vi",
    information: null,
    unit_NVL: null,
    branch: null,
    variant_NVL: null,
    department_staff: null,
    position_staff: null,
    categoty_finishedProduct: null,
    type_finishedProduct: null,
    unit_finishedProduct: null,
    congdoan_finishedProduct: null,
    vitrikho_kiemke: null,
};

function adminReducer(state = adminState, action) {
    switch (action.type) {
        case "auth/update":
            return { ...state, auth: action.payload };
        case "lang/update":
            return { ...state, lang: action.payload };
        case "unit_NVL/update":
            return { ...state, unit_NVL: action.payload };
        case "branch/update":
            return { ...state, branch: action.payload };
        case "variant_NVL/update":
            return { ...state, variant_NVL: action.payload };
        case "department_staff/update":
            return { ...state, department_staff: action.payload };
        case "position_staff/update":
            return { ...state, position_staff: action.payload };
        case "categoty_finishedProduct/update":
            return { ...state, categoty_finishedProduct: action.payload };
        case "type_finishedProduct/update":
            return { ...state, type_finishedProduct: action.payload };
        case "unit_finishedProduct/update":
            return { ...state, unit_finishedProduct: action.payload };
        case "congdoan_finishedProduct/update":
            return { ...state, congdoan_finishedProduct: action.payload };
        case "vitrikho_kiemke/update":
            return { ...state, vitrikho_kiemke: action.payload };
        case "trangthai":
            return { ...state, trangthai: action.payload };
        case "trangthaiExprired":
            return { ...state, trangthaiExprired: action.payload };
        default:
            return state;
    }
}

const store = createStore(adminReducer);
export default store;
