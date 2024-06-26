import axios from "axios";
import useToast from "@/hooks/useToast";
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


const _ServerInstance = (method, url, dataObject = {}, callback) => {
    const showToat = useToast()

    let token = null;

    try {
        // token = localStorage?.getItem("tokenFMRP");
        token = Cookies.get("tokenFMRP") ?? ""
    } catch (err) {
        token = null;
    }

    let databaseApp = null;

    try {
        databaseApp = Cookies.get("databaseappFMRP") ?? ""
        // databaseApp = localStorage?.getItem("databaseappFMRP");
    } catch (err) {
        databaseApp = null;
    }

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "x-api-key": databaseApp,
        ...dataObject.headers
    };
    // Check if dataObject contains FormData
    if (dataObject instanceof FormData) {
        headers["Content-Type"] = "multipart/form-data";
    } else if (dataObject.headers?.["Content-Type"]) {
        headers["Content-Type"] = dataObject.headers["Content-Type"] ? dataObject.headers["Content-Type"] : 'application/json';
    }
    // const controller = new AbortController();

    return axios({
        method: method,
        url: url,
        withCredentials: false,
        ...(dataObject && dataObject instanceof FormData ? { data: dataObject } : dataObject),
        headers,
        // retries: 3,
        timeout: 5000
        // signal: controller.signal
    })
        .then(async (response) => {
            if (callback) {
                callback(null, response);
            }

            return await response;
        })
        .catch((error) => {
            if (callback) {
                callback(error, null);
            }
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || "An error occurred";

                if (status === 500) {
                    console.log("error.response 500", error.response);
                    // window.location.href = '/error/500';
                } else if (status === 403) {
                    console.log("error.response 403", error.response.data);
                    showToat("error", message);
                    setTimeout(() => window.location.href = '/error/403', 1500);
                } else if (status === 404) {
                    console.log("error.response 404", error.response.data);
                    showToat("error", message);
                    window.location.href = '/error/404';
                }
            } else {
                console.log("error", error);
            }
            throw error;
        });

};

export { _ServerInstance, axios };
