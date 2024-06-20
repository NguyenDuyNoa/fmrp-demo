import { useEffect, useRef, useState } from "react";
import ReactExport from "react-data-export";
import { _ServerInstance as Axios } from "/services/axios";
const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});

import { NumericFormat } from "react-number-format";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsCalendarEvent } from "react-icons/bs";
import { MdClear } from "react-icons/md";

import {
    Add,
    Trash as IconDelete
} from "iconsax-react";


import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import moment from "moment/moment";
import dynamic from "next/dynamic";
import Select, { components } from "react-select";
import CreatableSelect from "react-select/creatable";
import PopupEdit from "/components/UI/popup";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

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
        <span className="2xl:max-w-[300px] max-w-[150px] w-fit truncate">
            {label}
        </span>
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
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);

    const [onSending, sOnSending] = useState(false);
    const [onFetching, sOnFetching] = useState(false);
    const [onFetching_LisObject, sOnFetching_LisObject] = useState(false);
    const [onFetching_TypeOfDocument, sOnFetching_TypeOfDocument] =
        useState(false);
    const [onFetching_ListTypeOfDocument, sOnFetching_ListTypeOfDocument] =
        useState(false);
    const [onFetching_ListCost, sOnFetching_ListCost] = useState(false);

    const [onFetchingDetail, sOnFetchingDetail] = useState(false);

    const [dataBranch, sDataBranch] = useState([]);
    const [dataObject, sDataObject] = useState([]);
    const [dataList_Object, sData_ListObject] = useState([]);
    const [dataMethod, sDataMethod] = useState([]);
    const [dataTypeofDoc, sDataTypeofDoc] = useState([]);
    const [dataListTypeofDoc, sDataListTypeofDoc] = useState([]);
    const [dataListCost, sDataListCost] = useState([]);

    const [date, sDate] = useState(new Date());
    const [code, sCode] = useState(null);
    const [branch, sBranch] = useState(null);
    const [object, sObject] = useState(null);
    const [listObject, sListObject] = useState(null);
    const [typeOfDocument, sTypeOfDocument] = useState(null);
    const [listTypeOfDocument, sListTypeOfDocument] = useState([]);
    const [price, sPrice] = useState("");
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

    const [errBranch, sErrBranch] = useState(false);
    const [errObject, sErrObject] = useState(false);
    const [errListObject, sErrListObject] = useState(false);
    const [errPrice, sErrPrice] = useState(false);
    const [errMethod, sErrMethod] = useState(false);
    const [errListTypeDoc, sErrListTypeDoc] = useState(false);

    const [errService, sErrService] = useState(false);
    const [errCosts, sErrCosts] = useState(false);
    const [errSotien, sErrSotien] = useState(false);
    const [errSmall, sErrSmall] = useState(false);

    useEffect(() => {
        open && sDate(new Date());
        open && sCode(null);
        open && sBranch(null);
        open && sObject(null);
        open && sListObject(null);
        open && sTypeOfDocument(null);
        open && sListTypeOfDocument([]);
        open && sPrice("");
        open && sMethod(null);
        open && sNote("");
        open && sNote("");
        open && sErrSmall(false);
        open && sErrBranch(false);
        open && sErrObject(false);
        open && sErrListObject(false);
        open && sErrListTypeDoc(false);
        open && sErrPrice(false);
        open && sErrMethod(false);
        open && sErrService(false);
        open && sErrCosts(false);
        open && sErrSotien(false);
        open && sOption([{ id: Date.now(), chiphi: "", sotien: null }]);

        open && sOnFetching(true);
        open && sOnFetching_LisObject(false);
        open && sData_ListObject([]);
        open && sDataListCost([]);
        props?.id && sOnFetchingDetail(true);
    }, [open]);

    const _ServerFetching_detail = () => {
        Axios(
            "GET",
            `/api_web/Api_expense_voucher/expenseVoucher/${props?.id}?csrf_protection=true`,
            {},
            (err, response) => {
                if (!err) {
                    var db = response.data;
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
                                label:
                                    dataLang[db?.object_text] ||
                                    db?.object_text,
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
                }
                sOnFetchingDetail(false);
            }
        );
    };

    useEffect(() => {
        onFetchingDetail && props?.id && _ServerFetching_detail();
    }, [open]);

    // Chi nhánh, PTTT, Đối tượng
    const _ServerFetching = () => {
        Axios(
            "GET",
            "/api_web/Api_Branch/branchCombobox/?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    var { isSuccess, result } = response.data;
                    sDataBranch(
                        result?.map((e) => ({ label: e.name, value: e.id }))
                    );
                }
            }
        );
        Axios(
            "GET",
            "/api_web/Api_expense_voucher/object/?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    var data = response.data;
                    sDataObject(
                        data?.map((e) => ({
                            label: dataLang[e?.name],
                            value: e?.id,
                        }))
                    );
                }
            }
        );
        Axios(
            "GET",
            "/api_web/Api_payment_method/payment_method/?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    var { rResult } = response.data;
                    sDataMethod(
                        rResult?.map((e) => ({ label: e?.name, value: e?.id }))
                    );
                }
            }
        );
        sOnFetching(false);
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        open && sOnFetching(true);
    }, [open]);

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
                    var { isSuccess, rResult } = response.data;
                    sData_ListObject(
                        rResult?.map((e) => ({ label: e.name, value: e.id }))
                    );
                }
            }
        );
        sOnFetching_LisObject(false);
    };

    useEffect(() => {
        onFetching_LisObject && _ServerFetching_LisObject();
    }, [onFetching_LisObject]);

    useEffect(() => {
        branch != null && object != null && sOnFetching_LisObject(true);
    }, [object, branch]);

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
                    // sDataTypeofDoc(db?.map(e => ({label: dataLang[e?.name], value: dataLang[e?.id]})))
                    sDataTypeofDoc(
                        db?.map((e) => ({
                            label: dataLang[e?.name],
                            value: e?.id,
                        }))
                    );
                }
            }
        );
        sOnFetching_TypeOfDocument(false);
    };

    useEffect(() => {
        onFetching_TypeOfDocument && _ServerFetching_TypeOfDocument();
    }, [onFetching_TypeOfDocument]);

    useEffect(() => {
        object != null && sOnFetching_TypeOfDocument(true);
    }, [object]);

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
                    sDataListTypeofDoc(
                        db?.map((e) => ({
                            label: e?.code,
                            value: e?.id,
                            money: e?.money,
                        }))
                    );
                }
            }
        );
        sOnFetching_ListTypeOfDocument(false);
    };

    useEffect(() => {
        onFetching_ListTypeOfDocument && _ServerFetching_ListTypeOfDocument();
    }, [onFetching_ListTypeOfDocument]);

    useEffect(() => {
        // (branch != null && object != null && listObject != null && typeOfDocument != null) && sOnFetching_ListTypeOfDocument(true)
        typeOfDocument != null && sOnFetching_ListTypeOfDocument(true);
    }, [typeOfDocument]);

    const _HandleSeachApi = (inputValue) => {
        Axios(
            "POST",
            `/api_web/Api_expense_voucher/voucher_list/?csrf_protection=true`,
            {
                data: {
                    term: inputValue,
                },
                params: {
                    type: object?.value ? object?.value : null,
                    voucher_type: typeOfDocument?.value
                        ? typeOfDocument?.value
                        : null,
                    object_id: listObject?.value ? listObject?.value : null,
                    "filter[branch_id]": branch?.value ? branch?.value : null,
                    expense_voucher_id: id ? id : "",
                },
            },
            (err, response) => {
                if (!err) {
                    var db = response.data;
                    sDataListTypeofDoc(
                        db?.map((e) => ({
                            label: e?.code,
                            value: e?.id,
                            money: e?.money,
                        }))
                    );
                }
            }
        );
    };

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
                    var { rResult } = response.data;
                    sDataListCost(
                        rResult.map((x) => ({
                            label: `${x.name}`,
                            value: x.id,
                            level: x.level,
                            code: x.code,
                            parent_id: x.parent_id,
                        }))
                    );
                }
            }
        );
        sOnFetching_ListCost(false);
    };

    useEffect(() => {
        onFetching_ListCost && _ServerFetching_ListCost();
    }, [onFetching_ListCost]);

    useEffect(() => {
        branch != null && sOnFetching_ListCost(true);
    }, [branch]);

    const _HandleChangeInput = (type, value) => {
        if (type == "date") {
            sDate(value);
        } else if (type == "code") {
            sCode(value?.target?.value);
        } else if (type === "clear") {
            sDate(new Date());
        } else if (type == "branch" && branch != value) {
            sBranch(value);
            sData_ListObject([]);
            sListObject(null);
            sDataListCost([]);
            sPrice("");
            sListTypeOfDocument([]);
            sDataListTypeofDoc([]);
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
            sData_ListObject([]);
            sDataTypeofDoc([]);
            sTypeOfDocument(null);
            sListTypeOfDocument([]);
            sDataListTypeofDoc([]);
            sPrice("");
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
            sDataListTypeofDoc([]);
            sListTypeOfDocument([]);
            sPrice("");
            sOption((prevOption) => {
                const newOption = prevOption.map((item, index) => {
                    return { ...item, sotien: "" };
                });
                return newOption;
            });
        } else if (type == "listTypeOfDocument") {
            sListTypeOfDocument(value);
            if (value && value.length > 0) {
                const totalMoney = value.reduce(
                    (total, item) => total + parseFloat(item.money || 0),
                    0
                );
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
                sPrice("");
                sOption((prevOption) => {
                    const newOption = prevOption.map((item, index) => {
                        return { ...item, sotien: "" };
                    });
                    return newOption;
                });
            }
        } else if (type === "price") {
            let totalMoney = listTypeOfDocument.reduce(
                (total, item) => total + parseFloat(item.money),
                0
            );
            const priceChange = parseFloat(
                value?.target.value.replace(/,/g, "")
            );
            let isExceedTotal = false; // Biến flag để kiểm tra trạng thái vượt quá giá trị
            if (!isNaN(priceChange)) {
                if (listTypeOfDocument?.length > 0) {
                    if (priceChange > totalMoney) {
                        // Giá nhập vượt quá tổng số tiền, trả về tổng ban đầu
                        Toast.fire({
                            icon: "error",
                            title: `${dataLang?.payment_err_aler || "payment_err_aler"
                                }`,
                        });
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
    // useEffect(() => {
    //   if (price == null) return;
    //   sOption(prevOption => {
    //     const newOption = [...prevOption];
    //     newOption.forEach((item, index) => {
    //       if(index == 0){
    //         item.sotien = price;
    //       }else{
    //         item.sotien = null;
    //       }
    //     });
    //     return newOption;
    //   });
    // }, [price]);

    const _HandleSubmit = (e) => {
        e.preventDefault();
        const hasNullLabel = option.some((item) => item.chiphi === "");
        const hasNullSotien = option.some(
            (item) => item.sotien === "" || item.sotien === null
        );
        const totalSotienErr = option.reduce(
            (total, item) => total + item.sotien,
            0
        );
        if (
            branch == null ||
            object == null ||
            listObject == null ||
            price == "" ||
            method == null ||
            hasNullLabel ||
            hasNullSotien ||
            totalSotienErr < price ||
            (typeOfDocument != null && listTypeOfDocument?.length == 0)
        ) {
            branch == null && sErrBranch(true);
            object == null && sErrObject(true);
            listObject == null && sErrListObject(true);
            price == "" && sErrPrice(true);
            method == null && sErrMethod(true);
            hasNullLabel && sErrCosts(true);
            hasNullSotien && sErrSotien(true);
            typeOfDocument != null &&
                listTypeOfDocument?.length == 0 &&
                sErrListTypeDoc(true);
            Toast.fire({
                icon: "error",
                title: `${totalSotienErr < price
                        ? props?.dataLang.payment_err_alerTotalThan ||
                        "payment_err_alerTotalThan"
                        : props.dataLang?.required_field_null ||
                        "required_field_null"
                    }`,
            });
        } else {
            sOnSending(true);
        }
    };

    useEffect(() => {
        sErrBranch(false);
    }, [branch != null]);

    useEffect(() => {
        sErrObject(false);
    }, [object != null]);

    useEffect(() => {
        sErrListTypeDoc(false);
    }, [typeOfDocument == null && listTypeOfDocument?.length > 0]);

    useEffect(() => {
        sErrListObject(false);
    }, [listObject != null]);

    useEffect(() => {
        sErrPrice(false);
    }, [price != ""]);

    useEffect(() => {
        sErrMethod(false);
    }, [method != null]);
    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    const _HandleChangeInputOption = (id, type, value) => {
        var index = option.findIndex((x) => x.id === id);
        if (type === "chiphi") {
            const hasSelectedOption = option.some((o) => o.chiphi === value);
            if (hasSelectedOption) {
                Toast.fire({
                    title: `${props?.dataLang?.payment_err_alerselected ||
                        "payment_err_alerselected"
                        }`,
                    icon: "error",
                    confirmButtonColor: "#296dc1",
                    cancelButtonColor: "#d33",
                    confirmButtonText: dataLang?.aler_yes,
                });
                return; // Dừng xử lý tiếp theo nếu đã hiển thị thông báo lỗi
            } else {
                option[index].chiphi = value;
            }
        } else if (type === "sotien") {
            option[index].sotien = parseFloat(value?.value);
            const totalSotien = option.reduce(
                (sum, opt) => sum + parseFloat(opt.sotien || 0),
                0
            );
            if (totalSotien > parseFloat(price)) {
                option.forEach((opt, optIndex) => {
                    const currentValue = option[optIndex].sotien; // Lưu giá trị hiện tại
                    option[optIndex].sotien = "";
                    if (optIndex === index) {
                        option[optIndex].sotien = currentValue; // Gán lại giá trị hiện tại
                    }
                });
                Toast.fire({
                    title: `${props?.dataLang?.payment_err_alerExeeds ||
                        "payment_err_alerExeeds"
                        }`,
                    icon: "error",
                    confirmButtonColor: "#296dc1",
                    cancelButtonColor: "#d33",
                    confirmButtonText: dataLang?.aler_yes,
                    timer: 3000,
                });
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
            return Toast.fire({
                title: `${props.dataLang?.payment_err_alerNotDelete ||
                    "payment_err_alerNotDelete"
                    }`,
                icon: "error",
                confirmButtonColor: "#296dc1",
                cancelButtonColor: "#d33",
                confirmButtonText: `${dataLang?.aler_yes}`,
            });
        }
        const newOption = option.filter((x) => x.id !== id); // loại bỏ phần tử cần xóa
        sOption(newOption); // cập nhật lại mảng
    };

    const allItems = [...dataListTypeofDoc];

    // const handleSelectAll = () => {
    //   sListTypeOfDocument(allItems);
    //   Promise.resolve().then(() => {
    //     const totalMoney = allItems.reduce((total, item) => {
    //       if (!isNaN(parseFloat(item.money))) {
    //         return total + parseFloat(item.money);
    //       } else {
    //         return total;
    //       }
    //     }, 0);
    //     return totalMoney
    //   }).then((formattedTotal) => {
    //     sPrice(formattedTotal);
    //   });
    // };

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
    // const handleDeselectAll = () => {
    //   sListTypeOfDocument([]);
    //   sPrice('');
    //   Promise.resolve().then(() => {
    //     sPrice('');
    //   });
    // };
    const handleDeselectAll = () => {
        sListTypeOfDocument([]);
        sPrice("");
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
                {dataListTypeofDoc?.length > 0 && (
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
                            {dataLang?.payment_DeselectAll ||
                                "payment_DeselectAll"}
                        </div>
                    </div>
                )}
                {props.children}
            </components.MenuList>
        );
    };

    const _ServerSending = () => {
        var formData = new FormData();
        formData.append("code", code == null ? "" : code);
        formData.append("date", formatMoment(date, FORMAT_MOMENT.DATE_TIME_LONG));
        formData.append("branch_id", branch.value);
        formData.append("objects", object.value);
        formData.append(
            "type_vouchers",
            typeOfDocument ? typeOfDocument.value : ""
        );
        formData.append("total", price);
        formData.append("payment_modes", method.value);
        if (object?.value == "other") {
            formData.append("objects_text", listObject.value);
        } else {
            formData.append("objects_id", listObject.value);
        }
        listTypeOfDocument?.forEach((e, index) => {
            formData.append(`voucher_id[${index}]`, e?.value);
        });
        formData.append("note", note);
        sortedArr.forEach((item, index) => {
            formData.append(
                `cost[${index}][id_costs]`,
                item?.chiphi ? item?.chiphi?.value : ""
            );
            formData.append(
                `cost[${index}][total]`,
                item?.sotien ? item?.sotien : ""
            );
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
                        Toast.fire({
                            icon: "success",
                            title: `${dataLang[message]}`,
                        });
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
                        sErrBranch(false);
                        sErrMethod(false);
                        sErrObject(false);
                        sErrListObject(false);
                        sErrPrice(false);
                        sOption([{ id: Date.now(), chiphi: "", sotien: null }]);
                        props.onRefresh && props.onRefresh();
                        sOpen(false);
                    } else {
                        Toast.fire({
                            icon: "error",
                            title: `${dataLang[message]}`,
                        });
                    }
                }
                sOnSending(false);
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
                    props.id
                        ? props.dataLang?.payment_editVotes ||
                        "payment_editVotes"
                        : `${props.dataLang?.branch_popup_create_new}`
                }
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props.className}
            >
                <div className="flex items-center space-x-4 3xl:my-3 2xl:my-1 my-1 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <h2 className="font-normal bg-[#ECF0F4] p-1 2xl:text-[12px] xl:text-[13px] text-[12px]  ">
                    {props.dataLang?.payment_general_information ||
                        "payment_general_information"}
                </h2>
                <div className="w-[40vw]">
                    <form onSubmit={_HandleSubmit.bind(this)} className="">
                        <div className="">
                            <div className="grid grid-cols-12 space-x-1 items-center">
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
                                            onSelect={(date) =>
                                                _HandleChangeInput("date", date)
                                            }
                                            onChange={(e) =>
                                                _HandleChangeInput("date", e)
                                            }
                                            placeholderText="DD/MM/YYYY HH:mm:ss"
                                            dateFormat="dd/MM/yyyy h:mm:ss aa"
                                            timeInputLabel={"Time: "}
                                            placeholder={
                                                dataLang?.price_quote_system_default ||
                                                "price_quote_system_default"
                                            }
                                            className={`border  focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer `}
                                        />
                                        {date && (
                                            <>
                                                <MdClear
                                                    className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                                                    onClick={() =>
                                                        _HandleChangeInput(
                                                            "clear"
                                                        )
                                                    }
                                                />
                                            </>
                                        )}
                                        <BsCalendarEvent className="absolute right-0 -translate-x-[75%] translate-y-[70%] text-[#CCCCCC] scale-110 cursor-pointer" />
                                    </div>
                                </div>
                                <div className="col-span-6">
                                    <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] mb-1 ">
                                        {dataLang?.serviceVoucher_voucher_code ||
                                            "serviceVoucher_voucher_code"}
                                    </label>
                                    <input
                                        value={code}
                                        onChange={_HandleChangeInput.bind(
                                            this,
                                            "code"
                                        )}
                                        placeholder={
                                            props.dataLang
                                                ?.payment_systemDefaul ||
                                            "payment_systemDefaul"
                                        }
                                        type="text"
                                        className="focus:border-[#92BFF7] border-[#d0d5dd] 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2.5 border outline-none "
                                    />
                                </div>
                                <div className="col-span-6">
                                    <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                        {props.dataLang?.payment_branch ||
                                            "payment_branch"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        closeMenuOnSelect={true}
                                        placeholder={
                                            props.dataLang?.payment_branch ||
                                            "payment_branch"
                                        }
                                        options={dataBranch}
                                        isSearchable={true}
                                        onChange={_HandleChangeInput.bind(
                                            this,
                                            "branch"
                                        )}
                                        value={branch}
                                        LoadingIndicator
                                        noOptionsMessage={() =>
                                            "Không có dữ liệu"
                                        }
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
                                        className={`${errBranch
                                                ? "border-red-500"
                                                : "border-transparent"
                                            } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px]  font-normal outline-none border `}
                                    />
                                    {errBranch && (
                                        <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">
                                            {props.dataLang
                                                ?.payment_errBranch ||
                                                "payment_errBranch"}
                                        </label>
                                    )}
                                </div>
                                <div className="col-span-6">
                                    <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                        {props.dataLang?.payment_method ||
                                            "payment_method"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        closeMenuOnSelect={true}
                                        placeholder={
                                            props.dataLang?.payment_method ||
                                            "payment_method"
                                        }
                                        options={dataMethod}
                                        isSearchable={true}
                                        onChange={_HandleChangeInput.bind(
                                            this,
                                            "method"
                                        )}
                                        value={method}
                                        LoadingIndicator
                                        noOptionsMessage={() =>
                                            "Không có dữ liệu"
                                        }
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
                                        className={`${errMethod
                                                ? "border-red-500"
                                                : "border-transparent"
                                            } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px]  font-normal outline-none border `}
                                    />
                                    {errMethod && (
                                        <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">
                                            {props.dataLang
                                                ?.payment_errMethod ||
                                                "payment_errMethod"}
                                        </label>
                                    )}
                                </div>
                                <div className="col-span-6">
                                    <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                        {props.dataLang?.payment_ob ||
                                            "payment_ob"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        closeMenuOnSelect={true}
                                        placeholder={
                                            props.dataLang?.payment_ob ||
                                            "payment_ob"
                                        }
                                        options={dataObject}
                                        isSearchable={true}
                                        onChange={_HandleChangeInput.bind(
                                            this,
                                            "object"
                                        )}
                                        value={object}
                                        LoadingIndicator
                                        noOptionsMessage={() =>
                                            "Không có dữ liệu"
                                        }
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
                                        className={`${errObject
                                                ? "border-red-500"
                                                : "border-transparent"
                                            } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E]  font-normal outline-none border `}
                                    />
                                    {errObject && (
                                        <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">
                                            {props.dataLang?.payment_errOb ||
                                                "payment_errOb"}
                                        </label>
                                    )}
                                </div>
                                <div className="col-span-6">
                                    <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                        {props.dataLang?.payment_listOb ||
                                            "payment_listOb"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    {object?.value == "other" ? (
                                        <CreatableSelect
                                            options={dataList_Object}
                                            placeholder={
                                                props.dataLang
                                                    ?.payment_listOb ||
                                                "payment_listOb"
                                            }
                                            onChange={_HandleChangeInput.bind(
                                                this,
                                                "listObject"
                                            )}
                                            isClearable={true}
                                            value={listObject}
                                            classNamePrefix="Select"
                                            className={`${errListObject
                                                    ? "border-red-500"
                                                    : "border-transparent"
                                                } Select__custom removeDivide  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `}
                                            isSearchable={true}
                                            noOptionsMessage={() =>
                                                `Chưa có gợi ý`
                                            }
                                            formatCreateLabel={(value) =>
                                                `Tạo "${value}"`
                                            }
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
                                        <Select
                                            closeMenuOnSelect={true}
                                            placeholder={
                                                props.dataLang
                                                    ?.payment_listOb ||
                                                "payment_listOb"
                                            }
                                            options={dataList_Object}
                                            isSearchable={true}
                                            onChange={_HandleChangeInput.bind(
                                                this,
                                                "listObject"
                                            )}
                                            value={listObject}
                                            LoadingIndicator
                                            noOptionsMessage={() =>
                                                "Không có dữ liệu"
                                            }
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
                                            className={`${errListObject
                                                    ? "border-red-500"
                                                    : "border-transparent"
                                                } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `}
                                        />
                                    )}
                                    {errListObject && (
                                        <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">
                                            {props.dataLang
                                                ?.payment_errListOb ||
                                                "payment_errListOb"}
                                        </label>
                                    )}
                                </div>
                                <div className="col-span-6  ">
                                    <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                        {props.dataLang
                                            ?.payment_typeOfDocument ||
                                            "payment_typeOfDocument"}
                                    </label>
                                    <Select
                                        closeMenuOnSelect={true}
                                        placeholder={
                                            props.dataLang
                                                ?.payment_typeOfDocument ||
                                            "payment_typeOfDocument"
                                        }
                                        options={dataTypeofDoc}
                                        isSearchable={true}
                                        onChange={_HandleChangeInput.bind(
                                            this,
                                            "typeOfDocument"
                                        )}
                                        value={typeOfDocument}
                                        LoadingIndicator
                                        noOptionsMessage={() =>
                                            "Không có dữ liệu"
                                        }
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
                                        className={`border-transparent 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `}
                                    />
                                </div>
                                <div className="col-span-6  ">
                                    <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                        {props.dataLang?.payment_listOfDoc ||
                                            "payment_listOfDoc"}
                                    </label>
                                    <Select
                                        closeMenuOnSelect={false}
                                        placeholder={
                                            props.dataLang?.payment_listOfDoc ||
                                            "payment_listOfDoc"
                                        }
                                        onInputChange={_HandleSeachApi.bind(
                                            this
                                        )}
                                        options={dataListTypeofDoc}
                                        isSearchable={true}
                                        onChange={_HandleChangeInput.bind(
                                            this,
                                            "listTypeOfDocument"
                                        )}
                                        value={listTypeOfDocument}
                                        components={{ MenuList, MultiValue }}
                                        isMulti
                                        LoadingIndicator
                                        noOptionsMessage={() =>
                                            "Không có dữ liệu"
                                        }
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
                                        className={`${errListTypeDoc &&
                                                typeOfDocument != null &&
                                                listTypeOfDocument?.length == 0
                                                ? "border-red-500"
                                                : "border-transparent"
                                            } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E]  font-normal outline-none border `}
                                    />
                                    {errListTypeDoc &&
                                        typeOfDocument != null &&
                                        listTypeOfDocument?.length == 0 && (
                                            <label className="2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">
                                                {props.dataLang
                                                    ?.payment_errlistOfDoc ||
                                                    "payment_errlistOfDoc"}
                                            </label>
                                        )}
                                </div>
                                <div className="col-span-6">
                                    <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                        {props.dataLang
                                            ?.payment_amountOfMoney ||
                                            "payment_amountOfMoney"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <NumericFormat
                                        value={price}
                                        disabled={
                                            object === null ||
                                            listObject === null
                                        }
                                        onChange={_HandleChangeInput.bind(
                                            this,
                                            "price"
                                        )}
                                        allowNegative={false}
                                        placeholder={
                                            ((object == null ||
                                                listObject == null) &&
                                                (props.dataLang
                                                    ?.payment_errObList ||
                                                    "payment_errObList")) ||
                                            (object != null &&
                                                props.dataLang
                                                    ?.payment_amountOfMoney) ||
                                            "payment_amountOfMoney"
                                        }
                                        decimalScale={0}
                                        isNumericString={true}
                                        isAllowed={(values) => {
                                            if (!values.value) return true;
                                            const { floatValue } = values;
                                            if (
                                                object?.value &&
                                                listTypeOfDocument?.length > 0
                                            ) {
                                                if (object?.value != "other") {
                                                    let totalMoney =
                                                        listTypeOfDocument.reduce(
                                                            (total, item) =>
                                                                total +
                                                                parseFloat(
                                                                    item.money
                                                                ),
                                                            0
                                                        );
                                                    if (
                                                        floatValue > totalMoney
                                                    ) {
                                                        Toast.fire({
                                                            icon: "error",
                                                            title: `${props.dataLang
                                                                    ?.payment_errPlease ||
                                                                "payment_errPlease"
                                                                } ${totalMoney.toLocaleString(
                                                                    "en"
                                                                )}`,
                                                        });
                                                    }
                                                    return (
                                                        floatValue <= totalMoney
                                                    );
                                                } else {
                                                    return true;
                                                }
                                            } else {
                                                return true;
                                            }
                                        }}
                                        className={`${errPrice
                                                ? "border-red-500"
                                                : "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300"
                                            } 3xl:placeholder:text-[13px] 2xl:placeholder:text-[12px] xl:placeholder:text-[10px] placeholder:text-[9px] placeholder:text-slate-300  w-full disabled:bg-slate-100 bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px]  font-normal outline-none border p-[9.5px]`}
                                        thousandSeparator=","
                                    />
                                    {errPrice && (
                                        <label className="2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">
                                            {props.dataLang
                                                ?.payment_errAmount ||
                                                "payment_errAmount"}
                                        </label>
                                    )}
                                </div>
                                <div className="col-span-6">
                                    <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] mb-1 ">
                                        {props.dataLang?.payment_note ||
                                            "payment_note"}
                                    </label>
                                    <input
                                        value={note}
                                        onChange={_HandleChangeInput.bind(
                                            this,
                                            "note"
                                        )}
                                        placeholder={
                                            props.dataLang?.payment_note ||
                                            "payment_note"
                                        }
                                        type="text"
                                        className="focus:border-[#92BFF7] border-[#d0d5dd] 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2.5 border outline-none "
                                    />
                                </div>
                                <h2 className="font-normal bg-[#ECF0F4] p-1 2xl:text-[12px] xl:text-[13px] text-[12px]  w-full col-span-12 mt-0.5">
                                    {props.dataLang?.payment_costInfo ||
                                        "payment_costInfo"}
                                </h2>
                                <div className="col-span-12 max-h-[140px] min-h-[140px] overflow-hidden ">
                                    <div className="grid grid-cols-12 items-center  sticky top-0  bg-[#F7F8F9] py-2 z-10 min-h-50px max-h-[50px]">
                                        <h4 className="2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-6    text-center  truncate font-[400] flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={_HandleAddNew.bind(
                                                    this
                                                )}
                                                title="Thêm"
                                                className="transition hover:bg-red-100 hover:animate-pulse	 rounded-full bg-slate-200 flex flex-col justify-center items-center"
                                            >
                                                <Add
                                                    color="red"
                                                    size={20}
                                                    className=""
                                                />
                                            </button>
                                            {props.dataLang?.payment_costs ||
                                                "payment_costs"}
                                        </h4>
                                        <h4 className="2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-4    text-center  truncate font-[400]">
                                            {props.dataLang
                                                ?.payment_amountOfMoney ||
                                                "payment_amountOfMoney"}
                                        </h4>
                                        <h4 className="2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-2   text-center  truncate font-[400]">
                                            {props.dataLang
                                                ?.payment_operation ||
                                                "payment_operation"}
                                        </h4>
                                    </div>
                                    <ScrollArea
                                        ref={scrollAreaRef}
                                        className="min-h-[100px] max-h-[100px]  overflow-hidden"
                                        speed={1}
                                        smoothScrolling={true}
                                    >
                                        {sortedArr.map((e, index) => (
                                            <div
                                                className="grid grid-cols-12 items-center gap-1 py-1 "
                                                key={e?.id}
                                            >
                                                <div className="col-span-6  my-auto ">
                                                    <Select
                                                        closeMenuOnSelect={true}
                                                        placeholder={
                                                            props.dataLang
                                                                ?.payment_expense ||
                                                            "payment_expense"
                                                        }
                                                        options={dataListCost}
                                                        isSearchable={true}
                                                        formatOptionLabel={
                                                            CustomSelectOption
                                                        }
                                                        onChange={_HandleChangeInputOption.bind(
                                                            this,
                                                            e?.id,
                                                            "chiphi"
                                                        )}
                                                        value={e?.chiphi}
                                                        menuPlacement="top"
                                                        LoadingIndicator
                                                        noOptionsMessage={() =>
                                                            "Không có dữ liệu"
                                                        }
                                                        maxMenuHeight="145px"
                                                        isClearable={true}
                                                        menuPortalTarget={
                                                            document.body
                                                        }
                                                        onMenuOpen={
                                                            handleMenuOpen
                                                        }
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            colors: {
                                                                ...theme.colors,
                                                                primary25:
                                                                    "#EBF5FF",
                                                                primary50:
                                                                    "#92BFF7",
                                                                primary:
                                                                    "#0F4F9E",
                                                            },
                                                        })}
                                                        styles={{
                                                            placeholder: (
                                                                base
                                                            ) => ({
                                                                ...base,
                                                                color: "#cbd5e1",
                                                            }),
                                                            menuPortal: (
                                                                base
                                                            ) => ({
                                                                ...base,
                                                                zIndex: 9999,
                                                                position:
                                                                    "absolute",
                                                            }),
                                                        }}
                                                        className={`${errCosts &&
                                                                e?.chiphi === ""
                                                                ? "border-red-500"
                                                                : "border-transparent"
                                                            } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] mb-2 font-normal outline-none border `}
                                                    />
                                                </div>
                                                <div className="col-span-4 text-center flex items-center justify-center">
                                                    <NumericFormat
                                                        value={e?.sotien}
                                                        disabled={price == ""}
                                                        placeholder={
                                                            price == "" &&
                                                            (props.dataLang
                                                                ?.payment_errAmountAbove ||
                                                                "payment_errAmountAbove")
                                                        }
                                                        onValueChange={_HandleChangeInputOption.bind(
                                                            this,
                                                            e?.id,
                                                            "sotien"
                                                        )}
                                                        allowNegative={false}
                                                        decimalScale={0}
                                                        isAllowed={(values) => {
                                                            if (!values.value)
                                                                return true;
                                                            const {
                                                                floatValue,
                                                            } = values;
                                                            if (
                                                                object?.value !=
                                                                "other"
                                                            ) {
                                                                if (
                                                                    floatValue >
                                                                    price
                                                                ) {
                                                                    Toast.fire({
                                                                        icon: "error",
                                                                        title: `${props
                                                                                .dataLang
                                                                                ?.payment_errPlease ||
                                                                            "payment_errPlease"
                                                                            } ${price.toLocaleString(
                                                                                "en"
                                                                            )}`,
                                                                    });
                                                                }
                                                                return (
                                                                    floatValue <=
                                                                    price
                                                                );
                                                            } else {
                                                                return true;
                                                            }
                                                        }}
                                                        isNumericString={true}
                                                        className={`${errSotien &&
                                                                (e?.sotien === "" ||
                                                                    e?.sotien ===
                                                                    null)
                                                                ? "border-b-red-500"
                                                                : " border-gray-200"
                                                            } placeholder:text-[10px] border-b-2 appearance-none 2xl:text-[12px] xl:text-[13px] text-[12px] text-center py-1 px-1 font-normal w-[90%] focus:outline-none `}
                                                        thousandSeparator=","
                                                    />
                                                </div>
                                                <div className="col-span-2 flex items-center justify-center">
                                                    <button
                                                        onClick={_HandleDelete.bind(
                                                            this,
                                                            e?.id
                                                        )}
                                                        type="button"
                                                        title="Xóa"
                                                        className="transition  w-full bg-slate-100 h-10 rounded-[5.5px] text-red-500 flex flex-col justify-center items-center mb-2"
                                                    >
                                                        <IconDelete />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </ScrollArea>
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

const MoreSelectedBadge = ({ items }) => {
    const style = {
        marginLeft: "auto",
        background: "#d4eefa",
        borderRadius: "4px",
        fontSize: "14px",
        padding: "1px 3px",
        order: 99,
    };

    const title = items.join(", ");
    const length = items.length;
    const label = `+ ${length}`;

    return (
        <div style={style} title={title}>
            {label}
        </div>
    );
};

const MultiValue = ({ index, getValue, ...props }) => {
    const maxToShow = 1;
    const overflow = getValue()
        .slice(maxToShow)
        .map((x) => x.label);

    return index < maxToShow ? (
        <components.MultiValue {...props} />
    ) : index === maxToShow ? (
        <MoreSelectedBadge items={overflow} />
    ) : null;
};
export default Popup_dspc;
