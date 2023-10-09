import { _ServerInstance as Axios } from "/services/axios";

export const getListBranch = async (params, callback) => {
    await Axios("GET", "/api_web/Api_Branch/branchCombobox/?csrf_protection=true", {}, (err, response) => {
        if (!err) {
            let { result } = response.data;
            callback(null, result);
        } else {
            callback(err, null);
        }
    });
};
export const getListObject = (params, callback) => {
    Axios("GET", "/api_web/Api_expense_payslips/object?csrf_protection=true", {}, (err, response) => {
        if (!err) {
            let result = response.data;
            callback(null, result);
        } else {
            callback(err, null);
        }
    });
};
export const getListMethod = (params, callback) => {
    Axios("GET", "/api_web/Api_payment_method/payment_method/?csrf_protection=true", {}, (err, response) => {
        if (!err) {
            let { rResult } = response.data;
            callback(null, rResult);
        } else {
            callback(err, null);
        }
    });
};
export const getListLisObject = (params, callback) => {
    Axios(
        "GET",
        "/api_web/Api_expense_payslips/objectList?csrf_protection=true",
        { params: params },
        (err, response) => {
            if (!err) {
                let { rResult } = response.data;
                callback(null, rResult);
            } else {
                callback(err, null);
            }
        }
    );
};
export const getTypeOfDocument = (params, callback) => {
    Axios(
        "GET",
        "/api_web/Api_expense_payslips/voucher_type?csrf_protection=true",
        { params: params },
        (err, response) => {
            if (!err) {
                let rResult = response.data;
                callback(null, rResult);
            } else {
                callback(err, null);
            }
        }
    );
};
export const getListTypeOfDocument = (params, callback) => {
    Axios(
        "GET",
        "/api_web/Api_expense_payslips/voucher_list?csrf_protection=true",
        { params: params },
        (err, response) => {
            if (!err) {
                let rResult = response.data;
                callback(null, rResult);
            } else {
                callback(err, null);
            }
        }
    );
};
export const postdataListTypeofDoc = (params, data, callback) => {
    Axios(
        "POST",
        "/api_web/Api_expense_payslips/voucher_list?csrf_protection=true",
        { data: data, params: params },
        (err, response) => {
            if (!err) {
                let rResult = response.data;
                callback(null, rResult);
            } else {
                callback(err, null);
            }
        }
    );
};
export const getdataDetail = (id, callback) => {
    Axios("GET", `/api_web/Api_expense_voucher/expenseVoucher/${id}?csrf_protection=true`, {}, (err, response) => {
        if (!err) {
            let rResult = response.data;
            callback(null, rResult);
        } else {
            callback(err, null);
        }
    });
};

export const postData = (params, id, data, callback) => {
    Axios(
        "POST",
        `${
            id
                ? `/api_web/Api_expense_voucher/expenseVoucher/${id}?csrf_protection=true`
                : "/api_web/Api_expense_payslips/expenseCoupon/?csrf_protection=true"
        }`,
        { data: data, headers: { "Content-Type": "multipart/form-data" } },
        (err, response) => {
            if (!err) {
                let { isSuccess, message } = response.data;
                callback(null, { isSuccess, message });
            } else {
                callback(err, { isSuccess: false, message: "Request failed" });
            }
        }
    );
};
