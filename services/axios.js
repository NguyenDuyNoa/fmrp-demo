import axios from 'axios'
// import { notification } from 'antd';
import store from "/services/redux";

// axios.defaults.baseURL = 'http://192.168.1.8:7000/private';
axios.defaults.baseURL = 'http://192.168.1.178/FMRP/api_web';
axios.defaults.withCredentials = true;
axios.defaults.include = true;

const _ServerInstance = (method, url, dataObject, callback) => {
	var token = null;
	try{
		token = localStorage?.getItem('tokenPP')
	}catch(err){
		token = null;
	}
	
	axios({
	    method: method,
	    url: url,
	    withCredentials: true,
	    include: true,
		...dataObject,
	    headers: {
	      	"Content-Type": dataObject.headers?.["Content-Type"] ? dataObject.headers?.["Content-Type"] : "application/json",
			"authorization": token
	    },
	    retries: 3,
	    timeout: 8000
	}).then(async function (response) {
      	callback && callback(null, response)
    }).catch(function (error){
		if(error.response && error.response?.status === 401){
			swal({
				title: "Hết Phiên Đăng Nhập",
				text: "Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập lại.",
				icon: "warning",
				timer: 3000,
				showConfirmButton: true,
				button: "Đăng Nhập Lại",
				timerProgressBar: true
			}).then((value) => {
				store.dispatch({type: "auth/update", payload: false})
			});
		}else{
			callback && callback(error, null)
		}
    });
}

const _ServerInstanceFile = (method, url, dataObject, callback) => {
	var privateToken = null;
	var publicToken = null;
	try{
		privateToken = localStorage?.getItem('privateToken')
		publicToken = localStorage?.getItem('publicToken')
	}catch(err){
		privateToken = null;
		publicToken = null;
	}

	var instance = method == "POST" ? axios.post : axios.put;
	instance(url, dataObject, {
		headers: {
		  'Content-Type': 'multipart/form-data',
		  "token": privateToken,
		  "authorization": "Basic Y25rOjA4MDg0NWRkZmM5ZmQyOGNjNjRkNDIxZGNkY2ExOTlk"
		},
		withCredentials: true,
	    include: true,
	    retries: 3,
	    timeout: 8000,
	}).then(async function (response) {
		callback && callback(null, response)
	}).catch(function (error){
		callback && callback(error, null)
	})
}

export {_ServerInstance, _ServerInstanceFile, axios};