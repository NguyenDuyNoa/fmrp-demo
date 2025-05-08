import apiReceipts from "@/Api/apiAccountant/apiReceipts";
import EditIcon from "@/components/icons/common/EditIcon";
import PlusIcon from "@/components/icons/common/PlusIcon";
import InPutMoneyFormat from "@/components/UI/inputNumericFormat/inputMoneyFormat";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import PopupCustom from "@/components/UI/popup";
import { optionsQuery } from "@/configs/optionsQuery";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import { useBranchList } from "@/hooks/common/useBranch";
import { useObjectListPaySlipCombobox, useObjectPaySlipCombobox } from "@/hooks/common/useObject";
import { useVoucherListPayPaySlip, useVoucherPayTypePaySlip } from "@/hooks/common/useOther";
import { usePayment } from "@/hooks/common/usePayment";
import useSetingServer from "@/hooks/useConfigNumber";
import useActionRole from "@/hooks/useRole";
import useToast from "@/hooks/useToast";
import ToatstNotifi from "@/utils/helpers/alerNotification";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import { CreatableSelectCore } from "@/utils/lib/CreatableSelect";
import { SelectCore } from "@/utils/lib/Select";
import { useMutation, useQuery } from "@tanstack/react-query";
import configSelectPopup from "configs/configSelectPopup";
import { debounce } from "lodash";
import moment from "moment/moment";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BiEdit } from "react-icons/bi";
import { BsCalendarEvent } from "react-icons/bs";
import { MdClear } from "react-icons/md";
import { useSelector } from "react-redux";
import { components } from "react-select";

const inistialFetch = {
    onSending: false,
    onFetchingLisObject: false,
};

const inistialError = {
    errBranch: false,
    errObject: false,
    errListObject: false,
    errPrice: false,
    errMethod: false,
    errListTypeDoc: false,
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
    searchListTypeofDoc: ""
};

const Popup_dspt = (props) => {
    let id = props?.id;

    const dataLang = props.dataLang;

    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const isShow = useToast();

    const dataSeting = useSetingServer();

    const [open, sOpen] = useState(false);

    const [error, sError] = useState(inistialError);

    const [fetch, sFetch] = useState(inistialFetch);

    const [listValue, sListValue] = useState(inistialValue);

    const _ToggleModal = (e) => sOpen(e);

    const updateFetch = (update) => sFetch((e) => ({ ...e, ...update }));

    const updateListValue = (updates) => sListValue((e) => ({ ...e, ...updates }));

    const updateError = (update) => sError((e) => ({ ...e, ...update }));

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkEdit } = useActionRole(auth, "receipts");

    const { data: dataMethod = [] } = usePayment()

    const { data: dataBranch = [] } = useBranchList()

    const { data: dataObject = [] } = useObjectPaySlipCombobox(dataLang)

    const { data: dataObjectList = [] } = useObjectListPaySlipCombobox({ type: listValue.object?.value, "filter[branch_id]": listValue.branch?.value }, dataLang)

    const { data: dataTypeofDoc = [] } = useVoucherPayTypePaySlip({ type: listValue.object?.value, branch: listValue.branch, typeOfDocument: listValue.typeOfDocument }, dataLang)
    const showToat = useToast();
    let param = {
        type: listValue.object?.value,
        voucher_type: listValue.typeOfDocument?.value,
        object_id: listValue.listObject?.value,
        "filter[branch_id]": listValue.branch?.value,
        expense_voucher_id: id ? id : "",
    };

    const { data: dataListTypeofDoc = [] } = useVoucherListPayPaySlip(param, listValue.searchListTypeofDoc)

    const initstialState = () => {
        sListValue(inistialValue);
        sError(inistialError);
    };

    const formatNumber = (number) => {
        return formatMoneyConfig(+number, dataSeting);
    };

    useEffect(() => {
        open && initstialState();
    }, [open]);

    useQuery({
        queryKey: ["api_detail_receipts_form", id],
        queryFn: async () => {
            const result = await apiReceipts.apiReceiptsDetail(id);
            updateListValue({
                date: moment(result?.date).toDate(),
                code: result?.code,
                branch: { label: result?.branch_name, value: result?.branch_id },
                object: { label: dataLang[result?.objects] || result?.objects, value: result?.objects },
                listObject: result?.objects === "other"
                    ? { label: result?.object_text, value: result?.object_text }
                    : { label: dataLang[result?.object_text] || result?.object_text, value: result?.objects_id },
                typeOfDocument: result?.type_vouchers ? { label: dataLang[result?.type_vouchers] || result?.type_vouchers, value: result?.type_vouchers } : null,
                listTypeOfDocument: result?.type_vouchers ? result?.voucher?.map(({ code, id, money }) => ({
                    label: code,
                    value: id,
                    money: money,
                })) : [],
                price: +result?.total,
                method: { label: result?.payment_mode_name, value: result?.payment_mode_id },
                note: result?.note,
            });

            return result;
        },
        enabled: open && !!id,
        ...optionsQuery,
    })

    const _HandleSeachApi = debounce((inputValue) => {
        updateListValue({ searchListTypeofDoc: inputValue });
    }, 500);

    useEffect(() => {
        if (fetch.onSending) {
            _ServerSending();
        }
    }, [fetch.onSending,]);

    const _HandleChangeInput = (type, value) => {
        const totalMoney = listValue.listTypeOfDocument.reduce((total, item) => total + parseFloat(item.money), 0);

        let isExceedTotal = false;

        const valueType = {
            [type]: value,
            listObject: null,
            price: "",
            listTypeOfDocument: [],
            typeOfDocument: null,
        };

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
                listValue[type] !== value && updateListValue(valueType);
                break;
            case "object":
                listValue[type] !== value && updateListValue(valueType);
                break;
            case "listObject":
                updateListValue({ listObject: value });
                listValue[type]?.value != value?.value && updateListValue({ listTypeOfDocument: [] });
                break;
            case "typeOfDocument":
                listValue[type]?.value != value?.value &&
                    updateListValue({
                        [type]: value,
                        listTypeOfDocument: [],
                        price: "",
                    });
                break;
            case "listTypeOfDocument":
                updateListValue({ listTypeOfDocument: value });
                if (value && value.length > 0) {
                    const formattedTotal = parseFloat(
                        value.reduce((total, item) => total + parseFloat(item.money || 0), 0)
                    );
                    updateListValue({ price: formattedTotal });
                } else {
                    updateListValue({ price: "" });
                }
                break;
            case "price":
                // const priceChange = parseFloat(value?.target.value.replace(/,/g, ""));
                const priceChange = value?.target.value;
                if (priceChange) {
                    if (listValue.listTypeOfDocument.length > 0 && priceChange > totalMoney) {
                        showToat("error", dataLang?.payment_err_aler || "payment_err_aler");
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
                errMethod: !listValue.method,
                errListObject: !listValue.listObject,
                errPrice: listValue.typeOfDocument?.value == "import" && (listValue.price == 0 || listValue.price == "" || listValue.price == null)
                    ? true
                    : listValue.price == 0 || listValue.price == null || listValue.price == "",
                errListTypeDoc: listValue.typeOfDocument != null && listValue.listTypeOfDocument?.length == 0,
            });
            showToat("error", `${props.dataLang?.required_field_null || "required_field_null"}`);
        } else {
            updateFetch({ onSending: true });
        }
    };

    useEffect(() => {
        listValue.branch && updateError({ errBranch: false });
        listValue.object && updateError({ errObject: false });
        listValue.listObject && updateError({ errListObject: false });
        listValue.price && updateError({ errPrice: false });
        listValue.method && updateError({ errMethod: false });
        if (listValue.typeOfDocument == null && listValue.listTypeOfDocument?.length > 0) {
            updateError({ errListTypeDoc: false });
        }
    }, [
        listValue.price != null,
        listValue.price != "",
        listValue.branch != null,
        listValue.object != null,
        listValue.typeOfDocument == null && listValue.listTypeOfDocument?.length > 0,
        listValue.listObject != null,
        listValue.method != null,
    ]);

    const handleSelectAll = () => {
        updateListValue({
            listTypeOfDocument: [...dataListTypeofDoc],
            price: [...dataListTypeofDoc].reduce((total, item) => {
                if (item.money) {
                    return total + parseFloat(item.money);
                } else {
                    return total;
                }
            }, 0),
        });
    };

    const handleDeselectAll = () => {
        updateListValue({ price: "", listTypeOfDocument: [] });
    };

    const MenuList = (props) => {
        return (
            <components.MenuList {...props}>
                {dataListTypeofDoc?.length > 0 && (
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

    const handingReceip = useMutation({
        mutationFn: async (data) => {
            return await apiReceipts.apiHandingReceipts(id, data);
        }
    })

    const _ServerSending = () => {
        let formData = new FormData();

        formData.append("code", listValue.code ? listValue.code : "");
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
        formData.append("note", listValue.note ? listValue.note : "");

        handingReceip.mutate(formData, {
            onSuccess: ({ isSuccess, message }) => {
                if (isSuccess) {
                    isShow("success", `${dataLang[message] || message}`);
                    initstialState();
                    sError(inistialError);
                    props.onRefresh && props.onRefresh();
                    sOpen(false);
                    return
                }
                isShow("error", `${dataLang[message] || message}`);
            },
            onError: (err) => {

            }
        })
        updateFetch({ onSending: false });
    };

    return (
        <PopupCustom
            title={props.id ? `${props.dataLang?.receipts_edit || "receipts_edit"}` : `${props.dataLang?.receipts_add || "receipts_add"}`}
            button={
                props?.id ? (
                    <div
                        onClick={() => {
                            if (role || checkEdit) {
                                sOpen(true);
                            } else {
                                isShow("error", WARNING_STATUS_ROLE);
                            }
                        }}
                        className="group rounded-lg w-full p-1 border border-transparent transition-all ease-in-out flex items-center gap-2 responsive-text-sm text-left cursor-pointer hover:border-[#064E3B] hover:bg-[#064E3B]/10"
                    >
                        {/* <BiEdit
                            size={20}
                            className="group-hover:text-sky-500 group-hover:scale-110 group-hover:shadow-md "
                        /> */}
                        <EditIcon
                            color="#064E3B"
                            className="size-5"
                        />
                        {/* <p className="group-hover:text-sky-500">
                            {props.dataLang?.payment_editVotes || "payment_editVotes"}
                        </p> */}
                    </div>
                ) :
                    <div onClick={() => {
                        if (role || checkAdd) {
                            sOpen(true);
                        } else {
                            isShow("error", WARNING_STATUS_ROLE);
                        }
                    }}
                    className="flex items-center gap-x-2"
                    >
                        <PlusIcon />
                        {props.dataLang?.branch_popup_create_new || "branch_popup_create_new"}
                    </div>
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
                                            placeholder={dataLang?.price_quote_system_default || "price_quote_system_default"}
                                            className={`border  focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer `}
                                        />
                                        {listValue.date && (
                                            <MdClear
                                                onClick={() => _HandleChangeInput("clear")}
                                                className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                                            />
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
                                    <SelectCore
                                        placeholder={props.dataLang?.payment_branch || "payment_branch"}
                                        options={dataBranch}
                                        onChange={_HandleChangeInput.bind(this, "branch")}
                                        value={listValue.branch}
                                        closeMenuOnSelect={true}
                                        {...configSelectPopup}
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
                                        placeholder={props.dataLang?.payment_method || "payment_method"}
                                        options={dataMethod}
                                        onChange={_HandleChangeInput.bind(this, "method")}
                                        value={listValue.method}
                                        maxMenuHeight="200px"
                                        closeMenuOnSelect={true}
                                        {...configSelectPopup}
                                        className={`${error.errMethod ? "border-red-500" : "border-transparent"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px]  font-normal outline-none border `}
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
                                        placeholder={props.dataLang?.payment_ob || "payment_ob"}
                                        options={dataObject}
                                        onChange={_HandleChangeInput.bind(this, "object")}
                                        value={listValue.object}
                                        {...configSelectPopup}
                                        menuPortalTarget={document.body}
                                        onMenuOpen={handleMenuOpen}
                                        closeMenuOnSelect={true}
                                        className={`${error.errObject ? "border-red-500" : "border-transparent"} 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E]  font-normal outline-none border `}
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
                                        <CreatableSelectCore
                                            options={dataObjectList}
                                            placeholder={props.dataLang?.payment_listOb || "payment_listOb"}
                                            onChange={_HandleChangeInput.bind(this, "listObject")}
                                            isClearable={true}
                                            value={listValue.listObject}
                                            classNamePrefix="Select"
                                            className={`${error.errListObject ? "border-red-500" : "border-transparent"} Select__custom removeDivide  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `}
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
                                            placeholder={props.dataLang?.payment_listOb || "payment_listOb"}
                                            options={dataObjectList}
                                            onChange={_HandleChangeInput.bind(this, "listObject")}
                                            value={listValue.listObject}
                                            {...configSelectPopup}
                                            menuPortalTarget={document.body}
                                            onMenuOpen={handleMenuOpen}
                                            closeMenuOnSelect={true}
                                            className={`${error.errListObject ? "border-red-500" : "border-transparent"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `}
                                        />
                                    )}
                                    {error.errListObject && (
                                        <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">
                                            {props.dataLang?.payment_errListOb || "payment_errListOb"}
                                        </label>
                                    )}
                                </div>
                                <div className="col-span-6">
                                    <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                        {props.dataLang?.payment_typeOfDocument || "payment_typeOfDocument"}
                                    </label>
                                    <SelectCore
                                        placeholder={props.dataLang?.payment_typeOfDocument || "payment_typeOfDocument"}
                                        options={dataTypeofDoc}
                                        onChange={_HandleChangeInput.bind(this, "typeOfDocument")}
                                        value={listValue.typeOfDocument}
                                        closeMenuOnSelect={true}
                                        {...configSelectPopup}
                                        menuPortalTarget={document.body}
                                        onMenuOpen={handleMenuOpen}
                                        className={`border-transparent placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `}
                                    />
                                </div>
                                <div className="col-span-6">
                                    <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">
                                        {props.dataLang?.payment_listOfDoc || "payment_listOfDoc"}
                                    </label>

                                    <SelectCore
                                        placeholder={props.dataLang?.payment_listOfDoc || "payment_listOfDoc"}
                                        options={dataListTypeofDoc}
                                        closeMenuOnSelect={false}
                                        hideSelectedOptions={false}
                                        onInputChange={(event) => {
                                            _HandleSeachApi(event);
                                        }}
                                        onChange={_HandleChangeInput.bind(this, "listTypeOfDocument")}
                                        value={listValue.listTypeOfDocument}
                                        components={{ MenuList, MultiValue }}
                                        {...configSelectPopup}
                                        isMulti
                                        menuPortalTarget={document.body}
                                        onMenuOpen={handleMenuOpen}
                                        className={`${error.errListTypeDoc && listValue.typeOfDocument != null && listValue.listTypeOfDocument?.length == 0
                                            ? "border-red-500"
                                            : "border-transparent"
                                            } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E]  font-normal outline-none border `}
                                    />
                                    {error.errListTypeDoc && listValue.typeOfDocument != null && listValue.listTypeOfDocument?.length == 0 && (
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
                                    <InPutMoneyFormat
                                        value={listValue.price}
                                        disabled={listValue.object === null || listValue.listObject === null}
                                        onChange={_HandleChangeInput.bind(this, "price")}
                                        allowNegative={false}
                                        placeholder={
                                            ((listValue.object == null || listValue.listObject == null) && (props.dataLang?.payment_errObList || "payment_errObList"))
                                            ||
                                            (listValue.object != null && props.dataLang?.payment_amountOfMoney)
                                            ||
                                            "payment_amountOfMoney"
                                        }
                                        isAllowed={(values) => {
                                            if (!values.value) return true;
                                            const { floatValue } = values;
                                            if (listValue.object?.value && listValue.listTypeOfDocument?.length > 0) {
                                                if (listValue.object?.value != "other") {
                                                    let totalMoney = listValue.listTypeOfDocument.reduce(
                                                        (total, item) => total + parseFloat(item.money),
                                                        0
                                                    );
                                                    if (floatValue > totalMoney) {
                                                        isShow("error", `${props.dataLang?.payment_errPlease || "payment_errPlease"} ${formatNumber(totalMoney)}`);
                                                    }
                                                    return false;
                                                    // return floatValue <= totalMoney;
                                                } else {
                                                    return true;
                                                }
                                            } else {
                                                return true;
                                            }
                                        }}
                                        className={`${error.errPrice && (listValue.price == null || listValue.price == "")
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
                                        value={listValue.note}
                                        onChange={_HandleChangeInput.bind(this, "note")}
                                        placeholder={props.dataLang?.payment_note || "payment_note"}
                                        type="text"
                                        className="focus:border-[#92BFF7] border-[#d0d5dd] 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2.5 border outline-none "
                                    />
                                </div>
                            </div>
                            <h2 className="font-normal bg-[#ECF0F4] p-1 2xl:text-[12px] xl:text-[13px] text-[12px]  w-full col-span-12 mt-0.5">
                                {props.dataLang?.receipts_info || "receipts_info"}
                            </h2>
                            <div className="grid items-center grid-cols-12 col-span-12 border border-t-0 border-l-0 border-r-0 divide-x">
                                <h1 className="text-center text-xs p-1.5 text-zinc-800 font-semibold col-span-2">
                                    {"#"}
                                </h1>
                                <h1 className="text-center text-xs p-1.5 text-zinc-800 font-semibold col-span-5">
                                    {props.dataLang?.receipts_code || "receipts_code"}
                                </h1>
                                <h1 className="text-center text-xs p-1.5 text-zinc-800 font-semibold col-span-5">
                                    {props.dataLang?.receipts_money || "receipts_money"}
                                </h1>
                            </div>
                            {listValue.listTypeOfDocument.length > 0 && (
                                <div className="col-span-12 transition-all duration-200 ease-linear border border-b-0 rounded">
                                    <div className={`${listValue.listTypeOfDocument.length > 5 ? " h-[170px] overflow-auto" : ""} scrollbar-thin cursor-pointer scrollbar-thumb-slate-300 scrollbar-track-slate-100`}  >
                                        {listValue.listTypeOfDocument.map((e, index) => {
                                            return (
                                                <div
                                                    key={e.value}
                                                    className="grid items-center grid-cols-12 col-span-12 border-b divide-x"
                                                >
                                                    <h1 className="col-span-2 p-2 text-xs text-center">
                                                        <span className="px-2 py-1 text-purple-500 bg-purple-200 rounded-xl animate-pulse">
                                                            {index + 1}
                                                        </span>
                                                    </h1>
                                                    <h1 className="col-span-5 p-2 text-xs text-center ">
                                                        <span className="px-2 py-1 text-purple-500 bg-purple-200 rounded-xl">
                                                            {e.label}
                                                        </span>
                                                    </h1>
                                                    <h1 className="col-span-5 p-2 text-xs text-right">
                                                        {formatNumber(e.money)}
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
                            className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#003DA0]"
                        >
                            {props.dataLang?.branch_popup_save}
                        </button>
                    </div>
                </form>
            </div>
        </PopupCustom>
    );
};

export default Popup_dspt;
