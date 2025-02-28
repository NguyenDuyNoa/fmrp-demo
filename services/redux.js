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
    stage_finishedProduct: null,
    location_inventory: null,
    setings: {},
    stateBoxChatAi: {
        open: false,
        typeChat: null,
        contentChat: "",
        messenger: [
            { text: "Chào bạn! Tôi có thể giúp gì?", sender: "ai" },
        ],
        openViewModal: false,
        isShowAi: false,
        dataReview: null,
        typeData: "",
        // generateContentClient: {
        //     content: "",
        //     textDataRequest: "",
        // },
        // chat: {
        //     content: "",
        //     quantityWord: {}
        // },
        // dataTableShowBom: [],
    },
    statePopupAccountInformation: {
        open: false,
    },
    statePopupChangePassword: {
        open: false
    },
    statePopupRecommendation: {
        open: false
    },
    statePopupUpdateVersion: {
        open: false
    },
    statePopupParent: {
        open: false
    }
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
        case "stage_finishedProduct/update":
            return { ...state, stage_finishedProduct: action.payload };
        case "location_inventory/update":
            return { ...state, location_inventory: action.payload };
        case "status/user":
            return { ...state, statusUser: action.payload };
        case "status/exprired":
            return { ...state, statusExprired: action.payload };
        case "setings/server":
            return { ...state, setings: action.payload };
        case "setings/feature":
            return { ...state, feature: action.payload };
        case "stateBoxChatAi":
            return { ...state, stateBoxChatAi: action.payload };
        case "statePopupAccountInformation":
            return { ...state, statePopupAccountInformation: action.payload };
        case "statePopupChangePassword":
            return { ...state, statePopupChangePassword: action.payload };
        case "statePopupRecommendation":
            return { ...state, statePopupRecommendation: action.payload };
        case "statePopupUpdateVersion":
            return { ...state, statePopupUpdateVersion: action.payload };
        case "statePopupParent":
            return { ...state, statePopupParent: action.payload };
        default:
            return state;
    }
}

const store = createStore(adminReducer);
export default store;
