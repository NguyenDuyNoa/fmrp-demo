import axios from "axios";
import store from "/services/redux";
import { ulrExel as url } from "/services/URL";
// axios.defaults.baseURL = "https://demo.fososoft.com/FMRP";
axios.defaults.baseURL = `${url}`;

axios.defaults.withCredentials = false;
axios.defaults.include = true;

const _ServerInstance = (method, url, dataObject, callback) => {
  var token = null;
  try {
    token = localStorage?.getItem("tokenFMRP");
  } catch (err) {
    token = null;
  }

  var databaseApp = null;
  try {
    databaseApp = localStorage?.getItem("databaseappFMRP");
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
      "Content-Type": dataObject.headers?.["Content-Type"]
        ? dataObject.headers?.["Content-Type"]
        : "application/json",
      Authorization: `Bearer ${token}`,
      "x-api-key": databaseApp,
      // "Access-Control-Allow-Headers": "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
    },
    retries: 3,
    timeout: 8000,
  })
    .then(async function (response) {
      callback && callback(null, response);
    })
    .catch(function (error) {
      if (error.response && error.response?.status === 500) {
        // store.dispatch({type: "auth/update", payload: null})
      } else {
        callback && callback(error, null);
      }
    });
};

export { _ServerInstance, axios };
