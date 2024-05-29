import React, { useState, useRef, useEffect } from "react";
import { _ServerInstance as Axios } from "/services/axios";
import ReactExport from "react-data-export";

import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

import { MdClear } from "react-icons/md";
import { BsCalendarEvent } from "react-icons/bs";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";

import {
    Edit as IconEdit,
    Grid6 as IconExcel,
    ArrowDown2 as IconDown,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    Add as IconAdd,
    Add,
} from "iconsax-react";

import { BiEdit } from "react-icons/bi";

import PopupEdit from "/components/UI/popup";
import dynamic from "next/dynamic";
import moment from "moment/moment";
import { components } from "react-select";
import { useSelector } from "react-redux";
import formatNumber from "@/utils/helpers/formatnumber";
import ToatstNotifi from "@/utils/helpers/alerNotification";
import { debounce } from "lodash";
import useActionRole from "@/hooks/useRole";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import useToast from "@/hooks/useToast";
import { SelectCore } from "@/utils/lib/select";
import { CreatableSelectCore } from "@/utils/lib/creatableSelect";
import InPutMoneyFormat from "@/components/UI/inputNumericFormat/inputMoneyFormat";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import MultiValue from "@/components/UI/mutiValue/multiValue";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

const CustomSelectOption = ({ value, label, level, code }) => (
    <div className="flex space-x-2 truncate">
        {level == 1 && <span>--</span>}
        {level == 2 && <span>----</span>}
        {level == 3 && <span>------</span>}
        {level == 4 && <span>--------</span>}
        <span className="2xl:max-w-[300px] max-w-[150px] w-fit truncate">{label}</span>
    </div>
);

const Popup_dspc = (props) => {
    let id = props?.id;

    const dataLang = props.dataLang;

    const scrollAreaRef = useRef(null);

    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const isShow = useToast()

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkEdit } = useActionRole(auth, 'payment');

    const [open, sOpen] = useState(false);

    const _ToggleModal = (e) => sOpen(e);

    const inistFetch = {
        onSending: false,
        onFetching: false,
        onFetching_LisObject: false,
        onFetching_TypeOfDocument: false,
        onFetching_ListTypeOfDocument: false,
        onFetching_ListCost: false,
        onFetchingDetail: false,
        onFetchingTable: false,
    };

    const inistArrr = {
        dataBranch: [],
        dataObject: [],
        dataList_Object: [],
        dataMethod: [],
        dataTypeofDoc: [],
        dataListTypeofDoc: [],
        dataListCost: [],
        dataTable: [],
    };

    const inistError = {
        errBranch: false,
        errObject: false,
        errListObject: false,
        errPrice: false,
        errMethod: false,
        errListTypeDoc: false,
        errCosts: false,
        errSotien: false,
    };

    const [error, sError] = useState(inistError);

    const [data, sData] = useState(inistArrr);

    const [fetch, sFetch] = useState(inistFetch);

    const [date, sDate] = useState(new Date());

    const [code, sCode] = useState(null);

    const [branch, sBranch] = useState(null);

    const [object, sObject] = useState(null);

    const [listObject, sListObject] = useState(null);

    const [typeOfDocument, sTypeOfDocument] = useState(null);

    const [listTypeOfDocument, sListTypeOfDocument] = useState([]);

    const [price, sPrice] = useState(null);

    const [method, sMethod] = useState(null);

    const [note, sNote] = useState("");

    const [option, sOption] = useState([
        {
            id: Date.now(),
            chiphi: "",
            sotien: null,
        },
    ]);

    const slicedArr = option.slice(1);

    const sortedArr = slicedArr.sort((a, b) => b.id - a.id);

    sortedArr.unshift(option[0]);

    const initstialState = () => {
        sDate(new Date());
        sCode(null);
        sBranch(null);
        sObject(null);
        sListObject(null);
        sTypeOfDocument(null);
        sListTypeOfDocument([]);
        sPrice(null);
        sMethod(null);
        sNote("");
        sNote("");
        sError(inistError);
        sOption([{ id: Date.now(), chiphi: "", sotien: null }]);
        sData(inistArrr);
    };

    useEffect(() => {
        open && initstialState();
        props?.id && sFetch((e) => ({ ...e, onFetchingDetail: true }));
    }, [open]);

    const _ServerFetching_detail = () => {
        Axios(
            "GET",
            `/api_web/Api_expense_voucher/expenseVoucher/${props?.id}?csrf_protection=true`,
            {},
            (err, response) => {
                if (!err) {
                    let db = response.data;
                    sDate(moment(db?.date).toDate());
                    sCode(db?.code);
                    sBranch({ label: db?.branch_name, value: db?.branch_id });
                    sMethod({
                        label: db?.payment_mode_name,
                        value: db?.payment_mode_id,
                    });
                    sObject({
                        label: dataLang[db?.objects] || db?.objects,
                        value: db?.objects,
                    });
                    sPrice(Number(db?.total));
                    sNote(db?.note);
                    sListObject(
                        db?.objects === "other"
                            ? { label: db?.object_text, value: db?.object_text }
                            : {
                                label: dataLang[db?.object_text] || db?.object_text,
                                value: db?.objects_id,
                            }
                    );
                    sTypeOfDocument(
                        db?.type_vouchers
                            ? {
                                label: dataLang[db?.type_vouchers],
                                value: db?.type_vouchers,
                            }
                            : null
                    );
                    sListTypeOfDocument(
                        db?.type_vouchers
                            ? db?.voucher?.map((e) => ({
                                label: e?.code,
                                value: e?.id,
                                money: e?.money,
                            }))
                            : []
                    );
                    sOption(
                        db?.detail?.map((e) => ({
                            id: e?.id,
                            chiphi: {
                                label: e?.costs_name,
                                value: e?.id_costs,
                            },
                            sotien: Number(e?.total),
                        }))
                    );
                    db?.type_vouchers == "import" && sData((e) => ({ ...e, dataTable: db?.tbDeductDeposit }));
                }
                sFetch((e) => ({ ...e, onFetchingDetail: false }));
            }
        );
    };

    // Chi nhánh, PTTT, Đối tượng
    const _ServerFetching = () => {
        Axios("GET", "/api_web/Api_Branch/branchCombobox/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let { isSuccess, result } = response.data;
                sData((e) => ({ ...e, dataBranch: result?.map((e) => ({ label: e.name, value: e.id })) }));
            }
        });
        Axios("GET", "/api_web/Api_expense_voucher/object/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let data = response.data;
                sData((e) => ({
                    ...e,
                    dataObject: data?.map((e) => ({
                        label: dataLang[e?.name],
                        value: e?.id,
                    })),
                }));
            }
        });
        Axios("GET", "/api_web/Api_payment_method/payment_method/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let { rResult } = response.data;
                sData((e) => ({
                    ...e,
                    dataMethod: rResult?.map((e) => ({ label: e?.name, value: e?.id })),
                }));
            }
        });
        sFetch((e) => ({ ...e, onFetching: false }));
    };

    //Danh sách đối tượng
    //Api Danh sách đối tượng: truyền Đối tượng vào biến type, truyền Chi nhánh vào biến filter[branch_id]

    const _ServerFetching_LisObject = () => {
        Axios(
            "GET",
            "/api_web/Api_expense_voucher/objectList/?csrf_protection=true",
            {
                params: {
                    type: object?.value,
                    "filter[branch_id]": branch?.value,
                },
            },
            (err, response) => {
                if (!err) {
                    let { isSuccess, rResult } = response.data;
                    sData((e) => ({
                        ...e,
                        dataList_Object: rResult?.map((e) => ({ label: e?.name, value: e?.id })),
                    }));
                }
            }
        );
        sFetch((e) => ({ ...e, onFetching_LisObject: false }));
    };

    // Loại chứng từ
    //Api Loại chứng từ: truyền Đối tượng vào biến type

    const _ServerFetching_TypeOfDocument = () => {
        Axios(
            "GET",
            "/api_web/Api_expense_voucher/voucher_type/?csrf_protection=true",
            {
                params: {
                    type: object?.value,
                },
            },
            (err, response) => {
                if (!err) {
                    var db = response.data;
                    sData((e) => ({
                        ...e,
                        dataTypeofDoc: db?.map((e) => ({
                            label: dataLang[e?.name],
                            value: e?.id,
                        })),
                    }));
                }
            }
        );
        sFetch((e) => ({ ...e, onFetching_TypeOfDocument: false }));
    };

    useEffect(() => {
        branch != null && sFetch((e) => ({ ...e, onFetching_ListCost: true }));
    }, [branch]);
    useEffect(() => {
        typeOfDocument?.value == "import" && listTypeOfDocument && sFetch((e) => ({ ...e, onFetchingTable: true }));
    }, [listTypeOfDocument]);
    useEffect(() => {
        open && sFetch((e) => ({ ...e, onFetching: true }));
    }, [open]);
    useEffect(() => {
        branch != null && object != null && sFetch((e) => ({ ...e, onFetching_LisObject: true }));
    }, [object, branch]);
    useEffect(() => {
        object != null && sFetch((e) => ({ ...e, onFetching_TypeOfDocument: true }));
    }, [object]);
    useEffect(() => {
        typeOfDocument && sFetch((e) => ({ ...e, onFetching_ListTypeOfDocument: true }));
    }, [typeOfDocument, branch, object]);
    useEffect(() => {
        fetch.onFetchingDetail && props?.id && _ServerFetching_detail();
    }, [open]);

    useEffect(() => {
        if (fetch.onFetching) {
            _ServerFetching();
        }
        if (fetch.onFetching_ListCost) {
            _ServerFetching_ListCost();
        }
        if (fetch.onFetchingTable) {
            _ServerFetching_ListTable();
        }
        if (fetch.onFetching_TypeOfDocument) {
            _ServerFetching_TypeOfDocument();
        }
        if (fetch.onFetching_ListTypeOfDocument) {
            _ServerFetching_ListTypeOfDocument();
        }
        if (fetch.onFetching_LisObject) {
            _ServerFetching_LisObject();
        }
        if (fetch.onSending) {
            _ServerSending();
        }
    }, [
        fetch.onFetching_ListCost,
        fetch.onFetchingTable,
        fetch.onFetching_TypeOfDocument,
        fetch.onFetching_ListTypeOfDocument,
        fetch.onFetching_LisObject,
        fetch.onFetching,
        fetch.onSending,
    ]);

    //Danh sách chứng từ
    //Api Danh sách chứng từ: truyền Đối tượng vào biến type, truyền Loại chứng từ vào biến voucher_type, truyền Danh sách đối tượng vào object_id

    const _ServerFetching_ListTypeOfDocument = () => {
        Axios(
            "GET",
            "/api_web/Api_expense_voucher/voucher_list/?csrf_protection=true",
            {
                params: {
                    type: object?.value,
                    voucher_type: typeOfDocument?.value,
                    object_id: listObject?.value,
                    "filter[branch_id]": branch?.value,
                    expense_voucher_id: id ? id : "",
                },
            },
            (err, response) => {
                if (!err) {
                    var db = response.data;
                    sData((c) => ({
                        ...c,
                        dataListTypeofDoc: db?.map((e) => ({
                            label: e?.code,
                            value: e?.id,
                            money: e?.money,
                        })),
                    }));
                }
            }
        );
        sFetch((e) => ({ ...e, onFetching_ListTypeOfDocument: false }));
    };

    let searchTimeout;

    const _HandleSeachApi = debounce((inputValue) => {
        Axios(
            "POST",
            `/api_web/Api_expense_voucher/voucher_list/?csrf_protection=true`,
            {
                data: {
                    term: inputValue,
                },
                params: {
                    type: object?.value ? object?.value : null,
                    voucher_type: typeOfDocument?.value ? typeOfDocument?.value : null,
                    object_id: listObject?.value ? listObject?.value : null,
                    "filter[branch_id]": branch?.value ? branch?.value : null,
                    expense_voucher_id: id ? id : "",
                },
            },
            (err, response) => {
                if (!err) {
                    let db = response.data;
                    sData((e) => ({
                        ...e,
                        dataListTypeofDoc: db?.map((e) => ({
                            label: e?.code,
                            value: e?.id,
                            money: e?.money,
                        })),
                    }));
                }
            }
        );
    }, 500)

    //Loại chi phí
    const _ServerFetching_ListCost = () => {
        Axios(
            "GET",
            "/api_web/Api_cost/costCombobox/?csrf_protection=true",
            {
                params: {
                    "filter[branch_id]": branch?.value,
                },
            },
            (err, response) => {
                if (!err) {
                    let { rResult } = response.data;
                    sData((e) => ({
                        ...e,
                        dataListCost: rResult.map((x) => ({
                            label: `${x.name}`,
                            value: x.id,
                            level: x.level,
                            code: x.code,
                            parent_id: x.parent_id,
                        })),
                    }));
                }
            }
        );
        sFetch((e) => ({ ...e, onFetching_ListCost: false }));
    };

    const _ServerFetching_ListTable = () => {
        let db = new FormData();
        listTypeOfDocument.forEach((e, index) => {
            db.append(`import_id[${index}]`, e?.value);
        });
        id && db.append("ignore_id", id ? id : "");
        Axios(
            "POST",
            "/api_web/Api_expense_voucher/deductDeposit/?csrf_protection=true",
            {
                data: db,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    let db = response.data;
                    sData((e) => ({
                        ...e,
                        dataTable: db,
                    }));
                }
            }
        );
        sFetch((e) => ({ ...e, onFetchingTable: false }));
    };

    const _HandleChangeInput = (type, value) => {
        if (type == "date") {
            sDate(value);
        } else if (type == "code") {
            sCode(value?.target?.value);
        } else if (type === "clear") {
            sDate(new Date());
        } else if (type == "branch" && branch != value) {
            sBranch(value);
            sData((e) => ({ ...e, dataList_Object: [], dataListCost: [], dataListTypeofDoc: [] }));
            sListObject(null);
            sPrice(null);
            sListTypeOfDocument([]);
            sTypeOfDocument(null);
            const updatedOptions = option.map((item) => {
                return {
                    ...item,
                    chiphi: "",
                    sotien: "",
                };
            });
            sOption(updatedOptions);
        } else if (type == "object" && object != value) {
            sObject(value);
            sListObject(null);
            sData((e) => ({ ...e, dataList_Object: [], dataListTypeofDoc: [] }));
            sTypeOfDocument(null);
            sListTypeOfDocument([]);
            sPrice(null);
            sOption((prevOption) => {
                const newOption = prevOption.map((item, index) => {
                    return { ...item, sotien: "" };
                });
                return newOption;
            });
        } else if (type == "listObject") {
            sListObject(value);
        } else if (type == "typeOfDocument" && typeOfDocument != value) {
            sTypeOfDocument(value);
            sData((e) => ({ ...e, dataListTypeofDoc: [] }));
            sListTypeOfDocument([]);
            sPrice(null);
            sOption((prevOption) => {
                const newOption = prevOption.map((item, index) => {
                    return { ...item, sotien: "" };
                });
                return newOption;
            });
        } else if (type == "listTypeOfDocument") {
            sListTypeOfDocument(value);
            if (value && value.length > 0) {
                const totalMoney = value.reduce((total, item) => total + parseFloat(item.money || 0), 0);
                const formattedTotal = parseFloat(totalMoney);
                sPrice(formattedTotal);
                sOption((prevOption) => {
                    const newOption = prevOption.map((item, index) => {
                        if (index === 0) {
                            return { ...item, sotien: formattedTotal };
                        } else {
                            return { ...item, sotien: null };
                        }
                    });
                    return newOption;
                });
            } else if (value && value.length == 0) {
                sPrice(null);
                sOption((prevOption) => {
                    const newOption = prevOption.map((item, index) => {
                        return { ...item, sotien: "" };
                    });
                    return newOption;
                });
            }
        } else if (type === "price") {
            let totalMoney = listTypeOfDocument.reduce((total, item) => total + parseFloat(item.money), 0);
            const priceChange = parseFloat(value?.target.value.replace(/,/g, ""));
            let isExceedTotal = false; // Biến flag để kiểm tra trạng thái vượt quá giá trị
            if (!isNaN(priceChange)) {
                if (listTypeOfDocument?.length > 0) {
                    if (priceChange > totalMoney) {
                        // Giá nhập vượt quá tổng số tiền, trả về tổng ban đầu
                        ToatstNotifi("error", `${dataLang?.payment_err_aler || "payment_err_aler"}`);
                        sPrice(totalMoney);
                        isExceedTotal = true; // Đánh dấu trạng thái vượt quá giá trị
                    } else {
                    }
                    sPrice(priceChange);
                } else {
                    sPrice(priceChange);
                }
            }
            sOption((prevOption) => {
                if (isExceedTotal) {
                    return prevOption.map((item, index) => {
                        if (index === 0) {
                            return { ...item, sotien: totalMoney };
                        } else {
                            return { ...item, sotien: null };
                        }
                    });
                } else {
                    return prevOption.map((item, index) => {
                        if (index === 0) {
                            return { ...item, sotien: priceChange };
                        } else {
                            return { ...item, sotien: null };
                        }
                    });
                }
            });

            if (isExceedTotal) {
                // Trở về giá trị ban đầu nếu cố tình nhập tiếp
                sPrice(totalMoney);
            }
        } else if (type == "method") {
            sMethod(value);
        } else if (type == "note") {
            sNote(value?.target.value);
        }
    };

    const _HandleSubmit = (e) => {
        e.preventDefault();
        const hasNullLabel = option.some((item) => item.chiphi === "");
        const hasNullSotien = option.some((item) => item.sotien === "" || item.sotien === null);
        const totalSotienErr = option.reduce((total, item) => total + item.sotien, 0);
        console.log("price", price);
        if (
            branch == null ||
            object == null ||
            listObject == null ||
            price == null ||
            method == null ||
            hasNullLabel ||
            hasNullSotien ||
            totalSotienErr < price ||
            (typeOfDocument != null && listTypeOfDocument?.length == 0)
        ) {
            sError((e) => ({
                ...e,
                errBranch: branch == null,
                errObject: object == null,
                errListObject: listObject == null,
                errPrice:
                    typeOfDocument?.value == "import" && (price == 0 || price == null)
                        ? true
                        : price == 0 || price == null,
                errMethod: method == null,
                errCosts: hasNullLabel,
                errSotien: hasNullSotien,
                errListTypeDoc: typeOfDocument != null && listTypeOfDocument?.length == 0,
            }));
            ToatstNotifi(
                "error",
                `${totalSotienErr < price
                    ? props?.dataLang.payment_err_alerTotalThan || "payment_err_alerTotalThan"
                    : props.dataLang?.required_field_null || "required_field_null"
                }`
            );
        } else {
            sFetch((e) => ({ ...e, onSending: true }));
        }
    };
    useEffect(() => {
        if (branch != null) {
            sError((e) => ({ ...e, errBranch: false }));
        }
        if (object != null) {
            sError((e) => ({ ...e, errObject: false }));
        }
        if (typeOfDocument == null && listTypeOfDocument?.length > 0) {
            sError((e) => ({ ...e, errListTypeDoc: false }));
        }
        if (listObject != null) {
            sError((e) => ({ ...e, errListObject: false }));
        }
        if (price != null) {
            sError((e) => ({ ...e, errPrice: false }));
        }
        if (method != null) {
            sError((e) => ({ ...e, errMethod: false }));
        }
    }, [
        price != null,
        branch != null,
        object != null,
        typeOfDocument == null && listTypeOfDocument?.length > 0,
        listObject != null,
        method != null,
    ]);

    const _HandleChangeInputOption = (id, type, value) => {
        var index = option.findIndex((x) => x.id === id);
        if (type === "chiphi") {
            const hasSelectedOption = option.some((o) => o.chiphi === value);
            if (hasSelectedOption) {
                ToatstNotifi("error", `${props?.dataLang?.payment_err_alerselected || "payment_err_alerselected"}`);
                return; // Dừng xử lý tiếp theo nếu đã hiển thị thông báo lỗi
            } else {
                option[index].chiphi = value;
            }
        } else if (type === "sotien") {
            option[index].sotien = parseFloat(value?.value);
            const totalSotien = option.reduce((sum, opt) => sum + parseFloat(opt.sotien || 0), 0);
            if (totalSotien > parseFloat(price)) {
                option.forEach((opt, optIndex) => {
                    const currentValue = option[optIndex].sotien; // Lưu giá trị hiện tại
                    option[optIndex].sotien = "";
                    if (optIndex === index) {
                        option[optIndex].sotien = currentValue; // Gán lại giá trị hiện tại
                    }
                });
                ToatstNotifi("error", `${props?.dataLang?.payment_err_alerExeeds || "payment_err_alerExeeds"}`);
            } else {
                option[index].sotien = parseFloat(value?.value);
            }
        }
        sOption([...option]);
    };

    const _HandleAddNew = () => {
        sOption([...option, { id: uuidv4(), chiphi: "", sotien: null }]);
    };

    const _HandleDelete = (id) => {
        if (id === option[0].id) {
            return ToatstNotifi("error", `${props.dataLang?.payment_err_alerNotDelete || "payment_err_alerNotDelete"}`);
        }
        const newOption = option.filter((x) => x.id !== id); // loại bỏ phần tử cần xóa
        sOption(newOption); // cập nhật lại mảng
    };

    const allItems = [...data.dataListTypeofDoc];

    const handleSelectAll = () => {
        sListTypeOfDocument(allItems);
        Promise.resolve()
            .then(() => {
                const totalMoney = allItems.reduce((total, item) => {
                    if (!isNaN(parseFloat(item.money))) {
                        return total + parseFloat(item.money);
                    } else {
                        return total;
                    }
                }, 0);
                return totalMoney;
            })
            .then((formattedTotal) => {
                sPrice(formattedTotal);
                sOption((prevOption) => {
                    const newOption = prevOption.map((item, index) => {
                        if (index === 0) {
                            return { ...item, sotien: formattedTotal };
                        } else {
                            return { ...item, sotien: null };
                        }
                    });
                    return newOption;
                });
            });
    };

    const handleDeselectAll = () => {
        sListTypeOfDocument([]);
        sPrice(null);
        sOption((prevOption) => {
            const newOption = prevOption.map((item) => {
                return { ...item, sotien: null };
            });
            return newOption;
        });
    };

    const MenuList = (props) => {
        return (
            <components.MenuList {...props}>
                {data.dataListTypeofDoc?.length > 0 && (
                    <div className="grid grid-cols-2 items-center  cursor-pointer">
                        <div
                            className="hover:bg-slate-200 p-2 col-span-1 text-center text-xs "
                            onClick={handleSelectAll}
                        >
                            {dataLang?.payment_selectAll || "payment_selectAll"}
                        </div>
                        <div
                            className="hover:bg-slate-200 p-2 col-span-1 text-center text-xs "
                            onClick={handleDeselectAll}
                        >
                            {dataLang?.payment_DeselectAll || "payment_DeselectAll"}
                        </div>
                    </div>
                )}
                {props.children}
            </components.MenuList>
        );
    };

    const _ServerSending = () => {
        let formData = new FormData();
        formData.append("code", code == null ? "" : code);
        formData.append("date", moment(date).format("YYYY-MM-DD HH:mm:ss"));
        formData.append("branch_id", branch?.value);
        formData.append("objects", object?.value);
        formData.append("type_vouchers", typeOfDocument ? typeOfDocument?.value : "");
        formData.append("total", price);
        formData.append("payment_modes", method?.value);
        if (object?.value == "other") {
            formData.append("objects_text", listObject?.value);
        } else {
            formData.append("objects_id", listObject?.value);
        }
        listTypeOfDocument?.forEach((e, index) => {
            formData.append(`voucher_id[${index}]`, e?.value);
        });
        formData.append("note", note);
        sortedArr.forEach((item, index) => {
            formData.append(`cost[${index}][id_costs]`, item?.chiphi ? item?.chiphi?.value : "");
            formData.append(`cost[${index}][total]`, item?.sotien ? item?.sotien : "");
        });
        Axios(
            "POST",
            `${id
                ? `/api_web/Api_expense_voucher/expenseVoucher/${id}?csrf_protection=true`
                : "/api_web/Api_expense_voucher/expenseVoucher/?csrf_protection=true"
            }`,
            {
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess, message } = response.data;
                    if (isSuccess) {
                        ToatstNotifi("success", `${dataLang[message]}`);
                        sDate(new Date());
                        sCode("");
                        sBranch(null);
                        sMethod(null);
                        sObject(null);
                        sListObject(null);
                        sTypeOfDocument(null);
                        sListTypeOfDocument([]);
                        sPrice("");
                        sNote("");
                        sError(inistError);
                        sOption([{ id: Date.now(), chiphi: "", sotien: null }]);
                        props.onRefresh && props.onRefresh();
                        sOpen(false);
                    } else {
                        ToatstNotifi("error", `${dataLang[message]}`);
                    }
                }
                sFetch((e) => ({ ...e, onSending: false }));
            }
        );
    };

    return (
        <>
            <PopupEdit
                title={
                    props.id
                        ? `${props.dataLang?.payment_edit || "payment_edit"}`
                        : `${props.dataLang?.payment_add || "payment_add"}`
                }
                button={
                    props?.id ?
                        <div
                            onClick={() => {
                                if (role || checkEdit) {
                                    sOpen(true)
                                } else {
                                    isShow("warning", WARNING_STATUS_ROLE)
                                }
                            }}
                            className={"group outline-none transition-all ease-in-out flex items-center justify-start gap-1 hover:bg-slate-50 text-left cursor-pointer roundedw-full"}>
                            <BiEdit
                                size={20}
                                className="group-hover:text-sky-500 group-hover:scale-110 group-hover:shadow-md "
                            />
                            <p className="group-hover:text-sky-500">
                                {props.dataLang?.payment_editVotes || "payment_editVotes"}
                            </p>

                        </div>

                        : <div
                            onClick={() => {
                                if (role || checkAdd) {
                                    sOpen(true)
                                } else {
                                    isShow("warning", WARNING_STATUS_ROLE)
                                }
                            }}
                        >{props.dataLang?.branch_popup_create_new || 'branch_popup_create_new'}</div>

                }
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props.className}
            >
                <div className="flex items-center space-x-4 3xl:my-3 2xl:my-1 my-1 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <h2 className="font-normal bg-[#ECF0F4] p-1 2xl:text-[12px] xl:text-[13px] text-[12px]  ">
                    {props.dataLang?.payment_general_information || "payment_general_information"}
                </h2>
                <div className="w-[40vw]">
                    <form onSubmit={_HandleSubmit.bind(this)} className="">
                        <div className="">
                            <div className="grid grid-cols-12 gap-1 items-center ">
                                <div className="col-span-12 grid grid-cols-12 items-center gap-1 overflow-auto 3xl:max-h-[400px] xxl:max-h-[300px] 2xl:max-h-[350px] xl:max-h-[300px] lg:max-h-[280px] max-h-[300px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className="col-span-6 relative">
                                        <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] mb-1 ">
                                            {dataLang?.serviceVoucher_day_vouchers}{" "}
                                        </label>
                                        <div className="custom-date-picker flex flex-row ">
                                            <DatePicker
                                                blur
                                                fixedHeight
                                                showTimeSelect
                                                selected={date}
                                                onSelect={(date) => _HandleChangeInput("date", date)}
                                                onChange={(e) => _HandleChangeInput("date", e)}
                                                placeholderText="DD/MM/YYYY HH:mm:ss"
                                                dateFormat="dd/MM/yyyy h:mm:ss aa"
                                                timeInputLabel={"Time: "}
                                                placeholder={
                                                    dataLang?.price_quote_system_default || "price_quote_system_default"
                                                }
                                                className={`border  focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer `}
                                            />
                                            {date && (
                                                <>
                                                    <MdClear
                                                        className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                                                        onClick={() => _HandleChangeInput("clear")}
                                                    />
                                                </>
                                            )}
                                            <BsCalendarEvent className="absolute right-0 -translate-x-[75%] translate-y-[70%] text-[#CCCCCC] scale-110 cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="col-span-6">
                                        <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] mb-1 ">
                                            {dataLang?.serviceVoucher_voucher_code || "serviceVoucher_voucher_code"}
                                        </label>
                                        <input
                                            value={code}
                                            onChange={_HandleChangeInput.bind(this, "code")}
                                            placeholder={props.dataLang?.payment_systemDefaul || "payment_systemDefaul"}
                                            type="text"
                                            className="focus:border-[#92BFF7] border-[#d0d5dd] 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2.5 border outline-none "
                                        />
                                    </div>
                                    <div className="col-span-6">
                                        <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                            {props.dataLang?.payment_branch || "payment_branch"}{" "}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <SelectCore
                                            closeMenuOnSelect={true}
                                            placeholder={props.dataLang?.payment_branch || "payment_branch"}
                                            options={data.dataBranch}
                                            isSearchable={true}
                                            onChange={_HandleChangeInput.bind(this, "branch")}
                                            value={branch}
                                            LoadingIndicator
                                            noOptionsMessage={() => "Không có dữ liệu"}
                                            maxMenuHeight="200px"
                                            isClearable={true}
                                            menuPortalTarget={document.body}
                                            onMenuOpen={handleMenuOpen}
                                            theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: "#EBF5FF",
                                                    primary50: "#92BFF7",
                                                    primary: "#0F4F9E",
                                                },
                                            })}
                                            styles={{
                                                placeholder: (base) => ({
                                                    ...base,
                                                    color: "#cbd5e1",
                                                }),
                                                menuPortal: (base) => ({
                                                    ...base,
                                                    zIndex: 9999,
                                                    position: "absolute",
                                                }),
                                            }}
                                            className={`${error.errBranch ? "border-red-500" : "border-transparent"
                                                }  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px]  font-normal outline-none border `}
                                        />
                                        {error.errBranch && (
                                            <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">
                                                {props.dataLang?.payment_errBranch || "payment_errBranch"}
                                            </label>
                                        )}
                                    </div>
                                    <div className="col-span-6">
                                        <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                            {props.dataLang?.payment_method || "payment_method"}{" "}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <SelectCore
                                            closeMenuOnSelect={true}
                                            placeholder={props.dataLang?.payment_method || "payment_method"}
                                            options={data.dataMethod}
                                            isSearchable={true}
                                            onChange={_HandleChangeInput.bind(this, "method")}
                                            value={method}
                                            LoadingIndicator
                                            noOptionsMessage={() => "Không có dữ liệu"}
                                            maxMenuHeight="200px"
                                            isClearable={true}
                                            menuPortalTarget={document.body}
                                            onMenuOpen={handleMenuOpen}
                                            theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: "#EBF5FF",
                                                    primary50: "#92BFF7",
                                                    primary: "#0F4F9E",
                                                },
                                            })}
                                            styles={{
                                                placeholder: (base) => ({
                                                    ...base,
                                                    color: "#cbd5e1",
                                                }),
                                                menuPortal: (base) => ({
                                                    ...base,
                                                    zIndex: 9999,
                                                    position: "absolute",
                                                }),
                                            }}
                                            className={`${error.errMethod ? "border-red-500" : "border-transparent"
                                                } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px]  font-normal outline-none border `}
                                        />
                                        {error.errMethod && (
                                            <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">
                                                {props.dataLang?.payment_errMethod || "payment_errMethod"}
                                            </label>
                                        )}
                                    </div>
                                    <div className="col-span-6">
                                        <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                            {props.dataLang?.payment_ob || "payment_ob"}{" "}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <SelectCore
                                            closeMenuOnSelect={true}
                                            placeholder={props.dataLang?.payment_ob || "payment_ob"}
                                            options={data.dataObject}
                                            isSearchable={true}
                                            onChange={_HandleChangeInput.bind(this, "object")}
                                            value={object}
                                            LoadingIndicator
                                            noOptionsMessage={() => "Không có dữ liệu"}
                                            maxMenuHeight="200px"
                                            isClearable={true}
                                            menuPortalTarget={document.body}
                                            onMenuOpen={handleMenuOpen}
                                            theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: "#EBF5FF",
                                                    primary50: "#92BFF7",
                                                    primary: "#0F4F9E",
                                                },
                                            })}
                                            styles={{
                                                placeholder: (base) => ({
                                                    ...base,
                                                    color: "#cbd5e1",
                                                }),
                                                menuPortal: (base) => ({
                                                    ...base,
                                                    zIndex: 9999,
                                                    position: "absolute",
                                                }),
                                            }}
                                            className={`${error.errObject ? "border-red-500" : "border-transparent"
                                                } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E]  font-normal outline-none border `}
                                        />
                                        {error.errObject && (
                                            <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">
                                                {props.dataLang?.payment_errOb || "payment_errOb"}
                                            </label>
                                        )}
                                    </div>
                                    <div className="col-span-6">
                                        <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                            {props.dataLang?.payment_listOb || "payment_listOb"}{" "}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        {object?.value == "other" ? (
                                            <CreatableSelectCore
                                                options={data.dataList_Object}
                                                placeholder={props.dataLang?.payment_listOb || "payment_listOb"}
                                                onChange={_HandleChangeInput.bind(this, "listObject")}
                                                isClearable={true}
                                                value={listObject}
                                                classNamePrefix="Select"
                                                className={`${error.errListObject ? "border-red-500" : "border-transparent"
                                                    } Select__custom removeDivide  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `}
                                                isSearchable={true}
                                                noOptionsMessage={() => `Chưa có gợi ý`}
                                                formatCreateLabel={(value) => `Tạo "${value}"`}
                                                menuPortalTarget={document.body}
                                                onMenuOpen={handleMenuOpen}
                                                style={{
                                                    border: "none",
                                                    boxShadow: "none",
                                                    outline: "none",
                                                }}
                                                theme={(theme) => ({
                                                    ...theme,
                                                    colors: {
                                                        ...theme.colors,
                                                        primary25: "#EBF5FF",
                                                        primary50: "#92BFF7",
                                                        primary: "#0F4F9E",
                                                    },
                                                })}
                                                styles={{
                                                    placeholder: (base) => ({
                                                        ...base,
                                                        color: "#cbd5e1",
                                                    }),
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                        position: "absolute",
                                                    }),
                                                    control: (base, state) => ({
                                                        ...base,
                                                        boxShadow: "none",
                                                        ...(state.isFocused && {
                                                            border: "0 0 0 1px #92BFF7",
                                                        }),
                                                    }),
                                                    dropdownIndicator: (base) => ({
                                                        ...base,
                                                        display: "none",
                                                    }),
                                                }}
                                            />
                                        ) : (
                                            <SelectCore
                                                closeMenuOnSelect={true}
                                                placeholder={props.dataLang?.payment_listOb || "payment_listOb"}
                                                options={data.dataList_Object}
                                                isSearchable={true}
                                                onChange={_HandleChangeInput.bind(this, "listObject")}
                                                value={listObject}
                                                LoadingIndicator
                                                noOptionsMessage={() => "Không có dữ liệu"}
                                                maxMenuHeight="200px"
                                                isClearable={true}
                                                menuPortalTarget={document.body}
                                                onMenuOpen={handleMenuOpen}
                                                theme={(theme) => ({
                                                    ...theme,
                                                    colors: {
                                                        ...theme.colors,
                                                        primary25: "#EBF5FF",
                                                        primary50: "#92BFF7",
                                                        primary: "#0F4F9E",
                                                    },
                                                })}
                                                styles={{
                                                    placeholder: (base) => ({
                                                        ...base,
                                                        color: "#cbd5e1",
                                                    }),
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                        position: "absolute",
                                                    }),
                                                }}
                                                className={`${error.errListObject ? "border-red-500" : "border-transparent"
                                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `}
                                            />
                                        )}
                                        {error.errListObject && (
                                            <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">
                                                {props.dataLang?.payment_errListOb || "payment_errListOb"}
                                            </label>
                                        )}
                                    </div>
                                    <div className="col-span-6  ">
                                        <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                            {props.dataLang?.payment_typeOfDocument || "payment_typeOfDocument"}
                                        </label>
                                        <SelectCore
                                            closeMenuOnSelect={true}
                                            placeholder={
                                                props.dataLang?.payment_typeOfDocument || "payment_typeOfDocument"
                                            }
                                            options={data.dataTypeofDoc}
                                            isSearchable={true}
                                            onChange={_HandleChangeInput.bind(this, "typeOfDocument")}
                                            value={typeOfDocument}
                                            LoadingIndicator
                                            noOptionsMessage={() => "Không có dữ liệu"}
                                            maxMenuHeight="200px"
                                            isClearable={true}
                                            menuPortalTarget={document.body}
                                            onMenuOpen={handleMenuOpen}
                                            theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: "#EBF5FF",
                                                    primary50: "#92BFF7",
                                                    primary: "#0F4F9E",
                                                },
                                            })}
                                            styles={{
                                                placeholder: (base) => ({
                                                    ...base,
                                                    color: "#cbd5e1",
                                                }),
                                                menuPortal: (base) => ({
                                                    ...base,
                                                    zIndex: 9999,
                                                    position: "absolute",
                                                }),
                                            }}
                                            className={`border-transparent placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `}
                                        />
                                    </div>
                                    <div className="col-span-6  ">
                                        <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                            {props.dataLang?.payment_listOfDoc || "payment_listOfDoc"}
                                        </label>
                                        <SelectCore
                                            closeMenuOnSelect={false}
                                            placeholder={props.dataLang?.payment_listOfDoc || "payment_listOfDoc"}
                                            onInputChange={_HandleSeachApi.bind(this)}
                                            options={data.dataListTypeofDoc}
                                            isSearchable={true}
                                            onChange={_HandleChangeInput.bind(this, "listTypeOfDocument")}
                                            value={listTypeOfDocument}
                                            components={{ MenuList, MultiValue }}
                                            isMulti
                                            LoadingIndicator
                                            noOptionsMessage={() => "Không có dữ liệu"}
                                            maxMenuHeight="200px"
                                            isClearable={true}
                                            menuPortalTarget={document.body}
                                            onMenuOpen={handleMenuOpen}
                                            theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: "#EBF5FF",
                                                    primary50: "#92BFF7",
                                                    primary: "#0F4F9E",
                                                },
                                            })}
                                            styles={{
                                                placeholder: (base) => ({
                                                    ...base,
                                                    color: "#cbd5e1",
                                                }),
                                                menuPortal: (base) => ({
                                                    ...base,
                                                    zIndex: 9999,
                                                    position: "absolute",
                                                }),
                                            }}
                                            className={`${error.errListTypeDoc &&
                                                typeOfDocument != null &&
                                                listTypeOfDocument?.length == 0
                                                ? "border-red-500"
                                                : "border-transparent"
                                                } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E]  font-normal outline-none border `}
                                        />
                                        {error.errListTypeDoc &&
                                            typeOfDocument != null &&
                                            listTypeOfDocument?.length == 0 && (
                                                <label className="2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">
                                                    {props.dataLang?.payment_errlistOfDoc || "payment_errlistOfDoc"}
                                                </label>
                                            )}
                                    </div>
                                    {data.dataTable.length > 0 && (
                                        <div className="col-span-12 border border-b-0 rounded m-1 transition-all duration-200 ease-linear">
                                            <div className="col-span-12 grid grid-cols-4 items-center divide-x border border-l-0 border-t-0 border-r-0">
                                                <h1 className="text-center text-xs p-1.5 text-zinc-800 font-semibold">
                                                    {props.dataLang?.payment_numberEnterd || "payment_numberEnterd"}
                                                </h1>
                                                <h1 className="text-center text-xs p-1.5 text-zinc-800 font-semibold">
                                                    {props.dataLang?.payment_numberSlips || "payment_numberSlips"}
                                                </h1>
                                                <h1 className="text-center text-xs p-1.5 text-zinc-800 font-semibold">
                                                    {props.dataLang?.payment_deductionMoney || "payment_deductionMoney"}
                                                </h1>
                                                <h1 className="text-center text-xs p-1.5 text-zinc-800 font-semibold">
                                                    {props.dataLang?.payment_cashInReturn || "payment_cashInReturn"}
                                                </h1>
                                            </div>
                                            <Customscrollbar
                                                className={`${data.dataTable.length > 5 ? " h-[170px] overflow-auto" : ""
                                                    } cursor-pointer`}
                                            >
                                                {data.dataTable.map((e) => {
                                                    return (
                                                        <div className="col-span-12 grid grid-cols-4 items-center divide-x border-b">
                                                            <h1 className="text-center text-xs p-2 ">
                                                                <span className="py-1 px-2 bg-purple-200 text-purple-500 rounded-xl">
                                                                    {e.import_code}
                                                                </span>
                                                            </h1>
                                                            <h1 className="text-center text-xs p-2">
                                                                <span className="py-1 px-2 bg-orange-200 text-orange-500 rounded-xl">
                                                                    {e.payslip_code}
                                                                </span>
                                                            </h1>
                                                            <h1 className="text-center text-xs p-2">
                                                                {formatNumber(e.deposit_amount)}
                                                            </h1>
                                                            <h1 className="text-center text-xs p-2">
                                                                {formatNumber(e.amount_left)}
                                                            </h1>
                                                        </div>
                                                    );
                                                })}
                                            </Customscrollbar>
                                        </div>
                                    )}
                                    <div className="col-span-6">
                                        <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                            {props.dataLang?.payment_amountOfMoney || "payment_amountOfMoney"}{" "}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <InPutMoneyFormat
                                            value={price}
                                            disabled={object === null || listObject === null}
                                            onChange={_HandleChangeInput.bind(this, "price")}
                                            placeholder={
                                                ((object == null || listObject == null) &&
                                                    (props.dataLang?.payment_errObList || "payment_errObList")) ||
                                                (object != null && props.dataLang?.payment_amountOfMoney) ||
                                                "payment_amountOfMoney"
                                            }
                                            isAllowed={(values) => {
                                                if (!values.value) return true;
                                                const { floatValue } = values;
                                                if (object?.value && listTypeOfDocument?.length > 0) {
                                                    if (object?.value != "other") {
                                                        let totalMoney = listTypeOfDocument.reduce(
                                                            (total, item) => total + parseFloat(item.money),
                                                            0
                                                        );
                                                        if (floatValue > totalMoney) {
                                                            Toast.fire({
                                                                icon: "error",
                                                                title: `${props.dataLang?.payment_errPlease ||
                                                                    "payment_errPlease"
                                                                    } ${totalMoney.toLocaleString("en")}`,
                                                            });
                                                        }
                                                        return false
                                                    } else {
                                                        return true;
                                                    }
                                                } else {
                                                    return true;
                                                }
                                            }}
                                            className={`${error.errPrice && price == null
                                                ? "border-red-500"
                                                : "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300"
                                                } 3xl:placeholder:text-[13px] 2xl:placeholder:text-[12px] xl:placeholder:text-[10px] placeholder:text-[9px] placeholder:text-slate-300  w-full disabled:bg-slate-100 bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px]  font-normal outline-none border p-[9.5px]`}
                                        />
                                        {error.errPrice && (
                                            <label className="2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">
                                                {props.dataLang?.payment_errAmount || "payment_errAmount"}
                                            </label>
                                        )}
                                    </div>
                                    <div className="col-span-6">
                                        <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] mb-1 ">
                                            {props.dataLang?.payment_note || "payment_note"}
                                        </label>
                                        <input
                                            value={note}
                                            onChange={_HandleChangeInput.bind(this, "note")}
                                            placeholder={props.dataLang?.payment_note || "payment_note"}
                                            type="text"
                                            className="focus:border-[#92BFF7] border-[#d0d5dd] 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2.5 border outline-none "
                                        />
                                    </div>
                                </div>
                                <h2 className="font-normal bg-[#ECF0F4] p-1 2xl:text-[12px] xl:text-[13px] text-[12px]  w-full col-span-12 mt-0.5">
                                    {props.dataLang?.payment_costInfo || "payment_costInfo"}
                                </h2>
                                <div className="col-span-12 max-h-[140px] min-h-[140px] overflow-hidden ">
                                    <div className="grid grid-cols-12 items-center  sticky top-0  bg-[#F7F8F9] py-2 z-10 min-h-50px max-h-[50px]">
                                        <h4 className="2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-6    text-center  truncate font-[400] flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={_HandleAddNew.bind(this)}
                                                title="Thêm"
                                                className="transition hover:bg-red-100 hover:animate-pulse	 rounded-full bg-slate-200 flex flex-col justify-center items-center"
                                            >
                                                <Add color="red" size={20} className="" />
                                            </button>
                                            {props.dataLang?.payment_costs || "payment_costs"}
                                        </h4>
                                        <h4 className="2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-4    text-center  truncate font-[400]">
                                            {props.dataLang?.payment_amountOfMoney || "payment_amountOfMoney"}
                                        </h4>
                                        <h4 className="2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-2   text-center  truncate font-[400]">
                                            {props.dataLang?.payment_operation || "payment_operation"}
                                        </h4>
                                    </div>
                                    <Customscrollbar
                                        className="min-h-[100px] max-h-[100px]"
                                    >
                                        {sortedArr.map((e, index) => (
                                            <div className="grid grid-cols-12 items-center gap-1 py-1 " key={e?.id}>
                                                <div className="col-span-6  my-auto ">
                                                    <SelectCore
                                                        closeMenuOnSelect={true}
                                                        placeholder={
                                                            props.dataLang?.payment_expense || "payment_expense"
                                                        }
                                                        options={data.dataListCost}
                                                        isSearchable={true}
                                                        formatOptionLabel={CustomSelectOption}
                                                        onChange={_HandleChangeInputOption.bind(this, e?.id, "chiphi")}
                                                        value={e?.chiphi}
                                                        menuPlacement="top"
                                                        LoadingIndicator
                                                        noOptionsMessage={() => "Không có dữ liệu"}
                                                        maxMenuHeight="145px"
                                                        isClearable={true}
                                                        menuPortalTarget={document.body}
                                                        onMenuOpen={handleMenuOpen}
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            colors: {
                                                                ...theme.colors,
                                                                primary25: "#EBF5FF",
                                                                primary50: "#92BFF7",
                                                                primary: "#0F4F9E",
                                                            },
                                                        })}
                                                        styles={{
                                                            placeholder: (base) => ({
                                                                ...base,
                                                                color: "#cbd5e1",
                                                            }),
                                                            menuPortal: (base) => ({
                                                                ...base,
                                                                zIndex: 9999,
                                                                position: "absolute",
                                                            }),
                                                        }}
                                                        className={`${error.errCosts && e?.chiphi === ""
                                                            ? "border-red-500"
                                                            : "border-transparent"
                                                            } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] mb-2 font-normal outline-none border `}
                                                    />
                                                </div>
                                                <div className="col-span-4 text-center flex items-center justify-center">
                                                    <InPutMoneyFormat
                                                        value={e?.sotien}
                                                        disabled={price == null}
                                                        placeholder={
                                                            price == null &&
                                                            (props.dataLang?.payment_errAmountAbove ||
                                                                "payment_errAmountAbove")
                                                        }
                                                        onValueChange={_HandleChangeInputOption.bind(
                                                            this,
                                                            e?.id,
                                                            "sotien"
                                                        )}
                                                        isAllowed={(values) => {
                                                            if (!values.value) return true;
                                                            const { floatValue } = values;
                                                            if (object?.value != "other") {
                                                                if (floatValue > price) {
                                                                    Toast.fire({
                                                                        icon: "error",
                                                                        title: `${props.dataLang?.payment_errPlease ||
                                                                            "payment_errPlease"
                                                                            } ${price.toLocaleString("en")}`,
                                                                    });
                                                                }
                                                                return false;
                                                            } else {
                                                                return true;
                                                            }
                                                        }}
                                                        className={`${error.errSotien && (e?.sotien === "" || e?.sotien === null)
                                                            ? "border-b-red-500"
                                                            : " border-gray-200"
                                                            } placeholder:text-[10px] border-b-2 appearance-none 2xl:text-[12px] xl:text-[13px] text-[12px] text-center py-1 px-1 font-normal w-[90%] focus:outline-none `}
                                                    />
                                                </div>
                                                <div className="col-span-2 flex items-center justify-center">
                                                    <button
                                                        onClick={_HandleDelete.bind(this, e?.id)}
                                                        type="button"
                                                        title="Xóa"
                                                        className="transition  w-full bg-slate-100 h-10 rounded-[5.5px] text-red-500 flex flex-col justify-center items-center mb-2"
                                                    >
                                                        <IconDelete />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </Customscrollbar>
                                </div>
                            </div>
                        </div>
                        <div className="text-right mt-1 space-x-2">
                            <button
                                type="button"
                                onClick={_ToggleModal.bind(this, false)}
                                className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]"
                            >
                                {props.dataLang?.branch_popup_exit}
                            </button>
                            <button
                                type="submit"
                                className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]"
                            >
                                {props.dataLang?.branch_popup_save}
                            </button>
                        </div>
                    </form>
                </div>
            </PopupEdit>
        </>
    );
};

export default Popup_dspc;
