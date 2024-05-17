import axios from "axios";
import useToast from "@/hooks/useToast";
import { CookieCore } from "@/utils/lib/cookie";
import Cookies from "js-cookie";
axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_URL_API}`;

axios.defaults.withCredentials = false;

axios.defaults.include = true;


axios.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        console.log("error response", error);
        return Promise.reject(error);
    }
);

axios.interceptors.request.use(
    (config) => {
        // Thực hiện các xử lý trước khi gửi request, ví dụ như thêm headers
        // config.headers.Authorization = 'Bearer YourAccessToken';
        return config;
    },
    (error) => {
        // Xử lý lỗi nếu có
        console.log("error request", error);
        return Promise.reject(error);
    }
);


const _ServerInstance = (method, url, dataObject, callback) => {
    const showToat = useToast()
    var token = null;
    try {
        // token = localStorage?.getItem("tokenFMRP");
        token = Cookies.get("tokenFMRP") ?? ""
    } catch (err) {
        token = null;
    }

    var databaseApp = null;
    try {
        databaseApp = Cookies.get("databaseappFMRP") ?? ""
        // databaseApp = localStorage?.getItem("databaseappFMRP");
    } catch (err) {
        databaseApp = null;
    }

    axios({
        method: method,
        url: url,
        withCredentials: false,
        include: true,
        ...dataObject,
        headers: {
            "Content-Type": dataObject.headers?.["Content-Type"] ? dataObject.headers?.["Content-Type"]
                : "application/json",
            Authorization: `Bearer ${token}`,
            "x-api-key": databaseApp,
            // "Access-Control-Allow-Headers": "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
        },
        retries: 3,
        // timeout: 8000,
    })
        .then(async function (response) {
            callback && callback(null, response);
        })
        .catch(function (error) {
            if (error.response && error.response?.status == 500) {
                // store.dispatch({type: "auth/update", payload: null})
                // showToat("error", 'Đã xảy ra lỗi vui lòng làm mới trang')
                console.log("error.response 500", error.response);
                // window.location.href = '/error/405';
            }
            else if (error.response && error.response?.status == 403) {
                console.log("error.response 403", error.response?.data);
                showToat("error", error.response?.data?.message)
                setTimeout(() => {
                    window.location.href = '/error/403';
                }, 1500)
                // window.location.href = '/error/403';
                // store.dispatch({type: "auth/update", payload: null})
            }
            else if (error.response && error.response?.status == 404) {
                console.log("error.response 404", error.response?.data);
                showToat("error", error.response?.data?.message)
                window.location.href = '/error/404';
                // store.dispatch({type: "auth/update", payload: null})
            }
            else {
                callback && callback(error, null);
            }
        });
};

export { _ServerInstance, axios };
