import { useEffect, useRef, useState } from "react";
import ReactExport from "react-data-export";
import { _ServerInstance as Axios } from "/services/axios";


import { NumericFormat } from "react-number-format";
import Swal from "sweetalert2";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsCalendarEvent } from "react-icons/bs";
import { MdClear } from "react-icons/md";



import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import ToatstNotifi from "@/utils/helpers/alerNotification";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatNumber from "@/utils/helpers/formatnumber";
import moment from "moment/moment";
import dynamic from "next/dynamic";
import { Controller, useForm } from "react-hook-form";
import Select, { components } from "react-select";
import CreatableSelect from "react-select/creatable";
import PopupCustom from "/components/UI/popup";

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
        <span className="2xl:max-w-[300px] max-w-[150px] w-fit truncate">{label}</span>
    </div>
);

const Popup_dspt = (props) => {
    let id = props?.id;
    const dataLang = props.dataLang;
    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };
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
    const inistialValue = {
        date: new Date(),
        code: null,
        branch: null,
        object: null,
        listObject: null,
        typeOfDocument: null,
        listTypeOfDocument: [],
        price: null,
        method: null,
        note: null,
    };
    const [error, sError] = useState(inistError);
    const [data, sData] = useState(inistArrr);
    const [fetch, sFetch] = useState(inistFetch);
    const [listValue, sListValue] = useState(inistialValue);

    const initstialState = () => {
        sListValue(inistialValue);
        sError(inistError);
        sData(inistArrr);
    };

    const updateFetch = (update) => {
        sFetch((e) => ({
            ...e,
            ...update,
        }));
    };

    const updateListValue = (updates) => {
        sListValue((e) => ({
            ...e,
            ...updates,
        }));
    };

    const updateData = (update) => {
        sData((e) => ({
            ...e,
            ...update,
        }));
    };

    const updateError = (update) => {
        sError((e) => ({
            ...e,
            ...update,
        }));
    };

    useEffect(() => {
        open && initstialState();
        props?.id && updateFetch({ onFetchingDetail: true });
        fetch.onFetchingDetail && props?.id && _ServerFetching_detail();
    }, [open]);
    const { register, control, handleSubmit } = useForm({
        defaultValues: {
            branch: null,
        },
    });
    const onSubmit = (data) => console.log(data);
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
                    db?.type_vouchers == "import" && sData((e) => ({ ...e, dataTable: db?.tbDeductDeposit }));
                }
                updateFetch({ onFetchingDetail: false });
            }
        );
    };

    // Chi nhánh, PTTT, Đối tượng
    const _ServerFetching = () => {
        Axios("GET", "/api_web/Api_Branch/branchCombobox/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var { isSuccess, result } = response.data;
                updateData({ dataBranch: result?.map((e) => ({ label: e.name, value: e.id })) });
            }
        });
        Axios("GET", "/api_web/Api_expense_voucher/object/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var data = response.data;
                updateData({
                    dataObject: data?.map((e) => ({
                        label: dataLang[e?.name],
                        value: e?.id,
                    })),
                });
            }
        });
        Axios("GET", "/api_web/Api_payment_method/payment_method/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var { rResult } = response.data;
                updateData({ dataMethod: rResult?.map((e) => ({ label: e?.name, value: e?.id })) });
            }
        });
        updateFetch({ onFetching: false });
    };

    //Danh sách đối tượng
    //Api Danh sách đối tượng: truyền Đối tượng vào biến type, truyền Chi nhánh vào biến filter[branch_id]
    const _ServerFetching_LisObject = () => {
        Axios(
            "GET",
            "/api_web/Api_expense_voucher/objectList/?csrf_protection=true",
            {
                params: {
                    type: listValue.object?.value,
                    "filter[branch_id]": listValue.branch?.value,
                },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess, rResult } = response.data;
                    updateData({ dataList_Object: rResult?.map((e) => ({ label: e?.name, value: e?.id })) });
                }
            }
        );
        updateFetch({ onFetching_LisObject: false });
    };

    // Loại chứng từ
    //Api Loại chứng từ: truyền Đối tượng vào biến type

    const _ServerFetching_TypeOfDocument = () => {
        Axios(
            "GET",
            "/api_web/Api_expense_voucher/voucher_type/?csrf_protection=true",
            {
                params: {
                    type: listValue.object?.value,
                },
            },
            (err, response) => {
                if (!err) {
                    var db = response.data;
                    updateData({
                        dataTypeofDoc: db?.map((e) => ({
                            label: dataLang[e?.name],
                            value: e?.id,
                        })),
                    });
                }
            }
        );
        updateFetch({ onFetching_TypeOfDocument: false });
    };

    //Danh sách chứng từ
    //Api Danh sách chứng từ: truyền Đối tượng vào biến type, truyền Loại chứng từ vào biến voucher_type, truyền Danh sách đối tượng vào object_id

    const _ServerFetching_ListTypeOfDocument = () => {
        Axios(
            "GET",
            "/api_web/Api_expense_voucher/voucher_list/?csrf_protection=true",
            {
                params: {
                    type: listValue.object?.value,
                    voucher_type: listValue.typeOfDocument?.value,
                    object_id: listValue.listObject?.value,
                    "filter[branch_id]": listValue.branch?.value,
                    expense_voucher_id: id ? id : "",
                },
            },
            (err, response) => {
                if (!err) {
                    var db = response.data;
                    updateData({
                        dataListTypeofDoc: db?.map((e) => ({
                            label: e?.code,
                            value: e?.id,
                            money: e?.money,
                        })),
                    });
                }
            }
        );
        updateFetch({ onFetching_ListTypeOfDocument: false });
    };

    let searchTimeout;

    const _HandleSeachApi = (inputValue) => {
        if (inputValue == "") return;
        else {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                Axios(
                    "POST",
                    `/api_web/Api_expense_voucher/voucher_list/?csrf_protection=true`,
                    {
                        data: {
                            term: inputValue,
                        },
                        params: {
                            type: listValue.object?.value ? listValue.object?.value : null,
                            voucher_type: listValue.typeOfDocument?.value ? listValue.typeOfDocument?.value : null,
                            object_id: listValue.listObject?.value ? listValue.listObject?.value : null,
                            "filter[branch_id]": listValue.branch?.value ? listValue.branch?.value : null,
                            expense_voucher_id: id ? id : "",
                        },
                    },
                    (err, response) => {
                        if (!err) {
                            let db = response.data;
                            updateData({
                                dataListTypeofDoc: db?.map((e) => ({
                                    label: e?.code,
                                    value: e?.id,
                                    money: e?.money,
                                })),
                            });
                        }
                    }
                );
            }, 500);
        }
    };

    //Loại chi phí
    const _ServerFetching_ListCost = () => {
        Axios(
            "GET",
            "/api_web/Api_cost/costCombobox/?csrf_protection=true",
            {
                params: {
                    "filter[branch_id]": listValue.branch?.value,
                },
            },
            (err, response) => {
                if (!err) {
                    var { rResult } = response.data;
                    updateData({
                        dataListCost: rResult.map((x) => ({
                            label: `${x.name}`,
                            value: x.id,
                            level: x.level,
                            code: x.code,
                            parent_id: x.parent_id,
                        })),
                    });
                }
            }
        );
        updateFetch({ onFetching_ListCost: false });
    };

    const _ServerFetching_ListTable = () => {
        let db = new FormData();
        listValue.listTypeOfDocument.forEach((e, index) => {
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
                    var db = response.data;
                    updateData({ dataTable: db });
                }
            }
        );
        updateFetch({ onFetchingTable: false });
    };

    useEffect(() => {
        if (listValue.branch != null) {
            updateFetch({ onFetching_ListCost: true });
        }
        if (listValue.typeOfDocument?.value == "import" && listValue.listTypeOfDocument) {
            updateFetch({ onFetchingTable: true });
        }
        if (listValue.object != null) {
            updateFetch({ onFetching_TypeOfDocument: true });
        }
    }, [listValue.branch, listValue.typeOfDocument, listValue.object]);

    useEffect(() => {
        open && updateFetch({ onFetching: true });
    }, [open]);

    useEffect(() => {
        listValue.branch != null && listValue.object != null && updateFetch({ onFetching_LisObject: true });
    }, [listValue.object, listValue.branch]);

    useEffect(() => {
        listValue.typeOfDocument && updateFetch({ onFetching_ListTypeOfDocument: true });
    }, [listValue.typeOfDocument, listValue.branch, listValue.object]);

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
    const _HandleChangeInput = (type, value) => {
        const totalMoney = listValue.listTypeOfDocument.reduce((total, item) => total + parseFloat(item.money), 0);
        let isExceedTotal = false;
        switch (type) {
            case "date":
                updateListValue({ date: value });
                break;
            case "code":
                updateListValue({ code: value?.target?.value });
                break;
            case "clear":
                updateListValue({ date: new Date() });
                break;
            case "branch":
                if (listValue.branch !== value) {
                    updateListValue({
                        branch: value,
                        listObject: null,
                        price: null,
                        listTypeOfDocument: [],
                        typeOfDocument: null,
                    });
                    updateData({ dataList_Object: [], dataListCost: [], dataListTypeofDoc: [] });
                }
                break;
            case "object":
                if (listValue.object !== value) {
                    updateListValue({
                        object: value,
                        listObject: null,
                        price: null,
                        listTypeOfDocument: [],
                        typeOfDocument: null,
                    });
                    updateData({ dataList_Object: [], dataListTypeofDoc: [] });
                }
                break;
            case "listObject":
                updateListValue({ listObject: value });
                break;
            case "typeOfDocument":
                if (listValue.typeOfDocument !== value) {
                    updateListValue({
                        typeOfDocument: value,
                        listTypeOfDocument: [],
                        price: null,
                    });
                    updateData({ dataListTypeofDoc: [] });
                }
                break;
            case "listTypeOfDocument":
                updateListValue({ listTypeOfDocument: value });
                if (value && value.length > 0) {
                    const formattedTotal = parseFloat(
                        value.reduce((total, item) => total + parseFloat(item.money || 0), 0)
                    );
                    updateListValue({ price: formattedTotal });
                } else {
                    updateListValue({ price: null });
                }
                break;
            case "price":
                const priceChange = parseFloat(value?.target.value.replace(/,/g, ""));
                if (!isNaN(priceChange)) {
                    if (listValue.listTypeOfDocument.length > 0 && priceChange > totalMoney) {
                        ToatstNotifi("error", dataLang?.payment_err_aler || "payment_err_aler");
                        updateListValue({ price: totalMoney });
                        isExceedTotal = true;
                    } else {
                        updateListValue({ price: priceChange });
                    }
                }
                if (isExceedTotal) {
                    updateListValue({ price: totalMoney });
                }
                break;
            case "method":
                updateListValue({ method: value });
                break;
            case "note":
                updateListValue({ note: value?.target.value });
                break;
            default:
                break;
        }
    };
    const _HandleSubmit = (e) => {
        e.preventDefault();
        if (
            !listValue.branch ||
            !listValue.object ||
            !listValue.listObject ||
            !listValue.price ||
            !listValue.method ||
            (listValue.typeOfDocument != null && listValue.listTypeOfDocument?.length == 0)
        ) {
            updateError({
                errBranch: !listValue.branch,
                errObject: !listValue.object,
                errListObject: !listValue.listObject,
                errPrice:
                    listValue.typeOfDocument?.value == "import" && (listValue.price == 0 || listValue.price == null)
                        ? true
                        : listValue.price == 0 || listValue.price == null,
                errMethod: !listValue.method,
                errListTypeDoc: listValue.typeOfDocument != null && listValue.listTypeOfDocument?.length == 0,
            });
            ToatstNotifi("error", `${props.dataLang?.required_field_null || "required_field_null"}`);
        } else {
            updateFetch({ onSending: true });
        }
    };

    useEffect(() => {
        if (listValue.branch != null) {
            updateError({ errBranch: false });
        }
        if (listValue.object != null) {
            updateError({ errObject: false });
        }
        if (listValue.typeOfDocument == null && listValue.listTypeOfDocument?.length > 0) {
            updateError({ errListTypeDoc: false });
        }
        if (listValue.listObject != null) {
            updateError({ errListObject: false });
        }
        if (listValue.price != null) {
            updateError({ errPrice: false });
        }
        if (listValue.method != null) {
            updateError({ errMethod: false });
        }
    }, [
        listValue.price != null,
        listValue.branch != null,
        listValue.object != null,
        listValue.typeOfDocument == null && listValue.listTypeOfDocument?.length > 0,
        listValue.listObject != null,
        listValue.method != null,
    ]);

    const allItems = [...data.dataListTypeofDoc];
    const handleSelectAll = () => {
        updateListValue({ listTypeOfDocument: allItems });
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
                updateListValue({ price: formattedTotal });
            });
    };

    const handleDeselectAll = () => {
        updateListValue({ price: null, listTypeOfDocument: [] });
    };

    const MenuList = (props) => {
        return (
            <components.MenuList {...props}>
                {data.dataListTypeofDoc?.length > 0 && (
                    <div className="grid items-center grid-cols-2 cursor-pointer">
                        <div
                            className="col-span-1 p-2 text-xs text-center hover:bg-slate-200 "
                            onClick={handleSelectAll}
                        >
                            {dataLang?.payment_selectAll || "payment_selectAll"}
                        </div>
                        <div
                            className="col-span-1 p-2 text-xs text-center hover:bg-slate-200 "
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
        formData.append("code", listValue.code == null ? "" : listValue.code);
        formData.append("date", formatMoment(listValue.date, FORMAT_MOMENT.DATE_TIME_LONG));
        formData.append("branch_id", listValue.branch?.value);
        formData.append("objects", listValue.object?.value);
        formData.append("type_vouchers", listValue.typeOfDocument ? listValue.typeOfDocument?.value : "");
        formData.append("total", listValue.price);
        formData.append("payment_modes", listValue.method?.value);
        if (listValue.object?.value == "other") {
            formData.append("objects_text", listValue.listObject?.value);
        } else {
            formData.append("objects_id", listValue.listObject?.value);
        }
        listValue.listTypeOfDocument?.forEach((e, index) => {
            formData.append(`voucher_id[${index}]`, e?.value);
        });
        formData.append("note", listValue.note);
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
                        initstialState();
                        sError(inistError);
                        props.onRefresh && props.onRefresh();
                        sOpen(false);
                    } else {
                        ToatstNotifi("error", `${dataLang[message]}`);
                    }
                }
                updateFetch({ onSending: false });
            }
        );
    };

    return (
        <>
            <PopupCustom
                title={props.id ? `${"Sửa phiếu thu"}` : `${"Tạo phiếu thu"}`}
                button={
                    props.id
                        ? props.dataLang?.payment_editVotes || "payment_editVotes"
                        : `${props.dataLang?.branch_popup_create_new}`
                }
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props.className}
            >
                <div className="flex items-center space-x-4 3xl:my-3 2xl:my-1 my-1 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <h2 className="font-normal bg-[#ECF0F4] p-1 2xl:text-[12px] xl:text-[13px] text-[12px]  ">
                    {props.dataLang?.payment_general_information || "payment_general_information"}
                </h2>
                <div className="w-[40vw]">
                    {/* <form onSubmit={_HandleSubmit.bind(this)} className=""> */}
                    <form onSubmit={handleSubmit(onSubmit)} className="">
                        <div className="">
                            <div className="grid items-center grid-cols-12 gap-1 ">
                                <div className="col-span-12 grid grid-cols-12 items-center gap-1 overflow-auto 3xl:max-h-[400px] xxl:max-h-[300px] 2xl:max-h-[350px] xl:max-h-[300px] lg:max-h-[280px] max-h-[300px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className="relative col-span-6">
                                        <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] mb-1 ">
                                            {dataLang?.serviceVoucher_day_vouchers}{" "}
                                        </label>
                                        <div className="flex flex-row custom-date-picker ">
                                            <DatePicker
                                                blur
                                                fixedHeight
                                                showTimeSelect
                                                selected={listValue.date}
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
                                            {listValue.date && (
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
                                            value={listValue.code}
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
                                        <Controller
                                            // name="branch"
                                            {...register("branch")}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    closeMenuOnSelect={true}
                                                    placeholder={props.dataLang?.payment_branch || "payment_branch"}
                                                    options={data.dataBranch}
                                                    isSearchable={true}
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
                                            )}
                                        />
                                    </div>
                                    {/* <div className="col-span-6">
                                        <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                            {props.dataLang?.payment_branch || "payment_branch"}{" "}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <Select
                                            closeMenuOnSelect={true}
                                            placeholder={props.dataLang?.payment_branch || "payment_branch"}
                                            options={data.dataBranch}
                                            isSearchable={true}
                                            onChange={_HandleChangeInput.bind(this, "branch")}
                                            value={listValue.branch}
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
                                            className={`${
                                                error.errBranch ? "border-red-500" : "border-transparent"
                                            }  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px]  font-normal outline-none border `}
                                        />
                                        {error.errBranch && (
                                            <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">
                                                {props.dataLang?.payment_errBranch || "payment_errBranch"}
                                            </label>
                                        )}
                                    </div> */}
                                    <div className="col-span-6">
                                        <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                            {props.dataLang?.payment_method || "payment_method"}{" "}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <Select
                                            closeMenuOnSelect={true}
                                            placeholder={props.dataLang?.payment_method || "payment_method"}
                                            options={data.dataMethod}
                                            isSearchable={true}
                                            onChange={_HandleChangeInput.bind(this, "method")}
                                            value={listValue.method}
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
                                        <Select
                                            closeMenuOnSelect={true}
                                            placeholder={props.dataLang?.payment_ob || "payment_ob"}
                                            options={data.dataObject}
                                            isSearchable={true}
                                            onChange={_HandleChangeInput.bind(this, "object")}
                                            value={listValue.object}
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
                                        {listValue.object?.value == "other" ? (
                                            <CreatableSelect
                                                options={data.dataList_Object}
                                                placeholder={props.dataLang?.payment_listOb || "payment_listOb"}
                                                onChange={_HandleChangeInput.bind(this, "listObject")}
                                                isClearable={true}
                                                value={listValue.listObject}
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
                                            <Select
                                                closeMenuOnSelect={true}
                                                placeholder={props.dataLang?.payment_listOb || "payment_listOb"}
                                                options={data.dataList_Object}
                                                isSearchable={true}
                                                onChange={_HandleChangeInput.bind(this, "listObject")}
                                                value={listValue.listObject}
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
                                    <div className="col-span-6 ">
                                        <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                            {props.dataLang?.payment_typeOfDocument || "payment_typeOfDocument"}
                                        </label>
                                        <Select
                                            closeMenuOnSelect={true}
                                            placeholder={
                                                props.dataLang?.payment_typeOfDocument || "payment_typeOfDocument"
                                            }
                                            options={data.dataTypeofDoc}
                                            isSearchable={true}
                                            onChange={_HandleChangeInput.bind(this, "typeOfDocument")}
                                            value={listValue.typeOfDocument}
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
                                    <div className="col-span-6 ">
                                        <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                            {props.dataLang?.payment_listOfDoc || "payment_listOfDoc"}
                                        </label>
                                        <Select
                                            closeMenuOnSelect={false}
                                            placeholder={props.dataLang?.payment_listOfDoc || "payment_listOfDoc"}
                                            options={data.dataListTypeofDoc}
                                            isSearchable={true}
                                            onChange={_HandleChangeInput.bind(this, "listTypeOfDocument")}
                                            value={listValue.listTypeOfDocument}
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
                                                listValue.typeOfDocument != null &&
                                                listValue.listTypeOfDocument?.length == 0
                                                ? "border-red-500"
                                                : "border-transparent"
                                                } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E]  font-normal outline-none border `}
                                        />
                                        {error.errListTypeDoc &&
                                            listValue.typeOfDocument != null &&
                                            listValue.listTypeOfDocument?.length == 0 && (
                                                <label className="2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">
                                                    {props.dataLang?.payment_errlistOfDoc || "payment_errlistOfDoc"}
                                                </label>
                                            )}
                                    </div>

                                    <div className="col-span-6">
                                        <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                            {props.dataLang?.payment_amountOfMoney || "payment_amountOfMoney"}{" "}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <NumericFormat
                                            value={listValue.price}
                                            disabled={listValue.object === null || listValue.listObject === null}
                                            onChange={_HandleChangeInput.bind(this, "price")}
                                            allowNegative={false}
                                            placeholder={
                                                ((listValue.object == null || listValue.listObject == null) &&
                                                    (props.dataLang?.payment_errObList || "payment_errObList")) ||
                                                (listValue.object != null && props.dataLang?.payment_amountOfMoney) ||
                                                "payment_amountOfMoney"
                                            }
                                            decimalScale={0}
                                            isNumericString={true}
                                            isAllowed={(values) => {
                                                if (!values.value) return true;
                                                const { floatValue } = values;
                                                if (
                                                    listValue.object?.value &&
                                                    listValue.listTypeOfDocument?.length > 0
                                                ) {
                                                    if (listValue.object?.value != "other") {
                                                        let totalMoney = listValue.listTypeOfDocument.reduce(
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
                                                        return floatValue <= totalMoney;
                                                    } else {
                                                        return true;
                                                    }
                                                } else {
                                                    return true;
                                                }
                                            }}
                                            className={`${error.errPrice && listValue.price == null
                                                ? "border-red-500"
                                                : "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300"
                                                } 3xl:placeholder:text-[13px] 2xl:placeholder:text-[12px] xl:placeholder:text-[10px] placeholder:text-[9px] placeholder:text-slate-300  w-full disabled:bg-slate-100 bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px]  font-normal outline-none border p-[9.5px]`}
                                            thousandSeparator=","
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
                                            value={listValue.note}
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
                                <div className="grid items-center grid-cols-4 col-span-12 border border-t-0 border-l-0 border-r-0 divide-x">
                                    <h1 className="text-center text-xs p-1.5 text-zinc-800 font-semibold">{""}</h1>
                                    <h1 className="text-center text-xs p-1.5 text-zinc-800 font-semibold">{""}</h1>
                                    <h1 className="text-center text-xs p-1.5 text-zinc-800 font-semibold">{""}</h1>
                                    <h1 className="text-center text-xs p-1.5 text-zinc-800 font-semibold">{""}</h1>
                                </div>
                                {data.dataTable.length > 0 && (
                                    <div className="col-span-12 m-1 transition-all duration-200 ease-linear border border-b-0 rounded">
                                        <div
                                            className={`${data.dataTable.length > 5 ? " h-[170px] overflow-auto" : ""
                                                } scrollbar-thin cursor-pointer scrollbar-thumb-slate-300 scrollbar-track-slate-100`}
                                        >
                                            {data.dataTable.map((e) => {
                                                return (
                                                    <div className="grid items-center grid-cols-4 col-span-12 border-b divide-x">
                                                        <h1 className="p-2 text-xs text-center ">
                                                            <span className="px-2 py-1 text-purple-500 bg-purple-200 rounded-xl">
                                                                {e.import_code}
                                                            </span>
                                                        </h1>
                                                        <h1 className="p-2 text-xs text-center">
                                                            <span className="px-2 py-1 text-orange-500 bg-orange-200 rounded-xl">
                                                                {e.payslip_code}
                                                            </span>
                                                        </h1>
                                                        <h1 className="p-2 text-xs text-center">
                                                            {formatNumber(e.deposit_amount)}
                                                        </h1>
                                                        <h1 className="p-2 text-xs text-center">
                                                            {formatNumber(e.amount_left)}
                                                        </h1>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-1 space-x-2 text-right">
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
            </PopupCustom>
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
export default Popup_dspt;
