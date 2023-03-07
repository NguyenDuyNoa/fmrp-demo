import axios from 'axios'
import store from "/services/redux";

axios.defaults.baseURL = 'https://demo.fososoft.com/FMRP/api_web';
// axios.defaults.baseURL = 'http://192.168.1.178/FMRP/api_web';
axios.defaults.withCredentials = false;
axios.defaults.include = true;

const _ServerInstance = (method, url, dataObject, callback) => {
	var token = null;
	try{
		token = localStorage?.getItem('tokenFMRP')
	}catch(err){
		token = null;
	}

	var databaseApp = null;
	try{
		databaseApp = localStorage?.getItem('databaseappFMRP')
	}catch(err){
		databaseApp = null;
	}
	console.log(databaseApp)
	
	axios({
	    method: method,
	    url: url,
	    withCredentials: false,
	    include: true,
		...dataObject,
	    headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
			'x-api-key': databaseApp
	    },
	    retries: 3,
	    timeout: 8000
	}).then(async function (response) {
      	callback && callback(null, response)
    }).catch(function (error){
		if(error.response && error.response?.status === 403){
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

export {_ServerInstance, axios};