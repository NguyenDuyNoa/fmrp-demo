import Head from "next/head";
import Link from "next/link";
import Swal from "sweetalert2";
import moment from "moment/moment";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import { MdClear } from "react-icons/md";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import Loading from "@/components/UI/loading";
import { BsCalendarEvent } from "react-icons/bs";
import Select, { components } from "react-select";
import { NumericFormat } from "react-number-format";
import React, { useState, useEffect } from "react";
import { _ServerInstance as Axios } from "/services/axios";
import { routerInternalPlan } from "@/components/UI/router/internalPlan";
import TransitionMotion from "@/components/UI/transition/motionTransition";
import ToatstNotifi from "@/components/UI/alerNotification/alerNotification";
import { Add, Trash as IconDelete, Image as IconImage, Minus } from "iconsax-react";

const Index = (props) => {
    const initsFetching = {
        onFetching: false,
        onFetchingDetail: false,
        onFetchingCondition: false,
        onFetchingItemsAll: false,
        onLoading: false,
        onLoadingChild: false,
        onSending: false,
        load: false,
    };
    const initsErors = {
        errBranch: false,
        errQuantity: false,
        errPlan: false,
        errDate: false,
    };
    const initsArr = { dataBranch: [], dataItems: [] };
    const initsValue = {
        code: "",
        date: new Date(),
        idBranch: null,
        namePlan: "",
        note: "",
        dateAll: null,
    };
    const router = useRouter();
    const id = router.query?.id;
    const dataLang = props?.dataLang;
    const trangthaiExprired = useSelector((state) => state?.trangthaiExprired);
    const [fetChingData, sFetchingData] = useState(initsFetching);
    const [dataSelect, sDataSelect] = useState(initsArr);
    const [idChange, sIdChange] = useState(initsValue);
    const [errors, sErrors] = useState(initsErors);
    const [listData, sListData] = useState([]);
    const resetAllStates = () => {
        sIdChange(initsValue);
        sErrors(initsErors);
    };

    useEffect(() => {
        router.query && resetAllStates();
    }, [router.query]);

    const _ServerFetching = () => {
        sFetchingData((e) => ({ ...e, onLoading: true }));
        Axios("GET", "/api_web/Api_Branch/branchCombobox/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let { result } = response.data;
                sDataSelect((e) => ({
                    ...e,
                    dataBranch: result?.map(({ name, id }) => ({ label: name, value: id })),
                }));
                sFetchingData((e) => ({ ...e, onLoading: false }));
            }
        });
        sFetchingData((e) => ({ ...e, onFetching: false }));
    };

    useEffect(() => {
        fetChingData.onFetching && _ServerFetching();
    }, [fetChingData.onFetching]);

    const options = dataSelect.dataItems?.map((e) => ({
        label: `${e.name}
            <spa style={{display: none}}>${e.code}</spa
            <span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,
        value: e.id,
        e,
    }));

    const _ServerFetchingDetailPage = () => {
        Axios(
            "GET",
            `/api_web/api_internal_plan/detailInternalPlan/${id}?csrf_protection=true`,
            {},
            (err, response) => {
                if (!err) {
                    let { data } = response?.data;
                    sListData(
                        data?.internalPlansItems.map((e) => {
                            return {
                                id: e?.id,
                                idParenBackend: e?.id,
                                matHang: {
                                    e: e,
                                    label: `${e?.item_name} <span style={{display: none}}>${
                                        e?.code + e?.product_variation + e?.text_type + e?.unit_name
                                    }</span>`,
                                    value: e?.item_id,
                                },
                                unit: e?.unit_name,
                                quantity: Number(e?.quantity),
                                note: e?.note_item,
                                date: moment(e?.date_needed).toDate(),
                            };
                        })
                    );
                    checkValue({
                        code: data?.internalPlans?.reference_no,
                        date: moment(data?.internalPlans?.date).toDate(),
                        idBranch: {
                            label: data?.internalPlans?.name_branch,
                            value: data?.internalPlans?.branch_id,
                        },
                        namePlan: data?.internalPlans.plan_name,
                        note: data?.internalPlans?.note,
                    });
                }
                sFetchingData((e) => ({ ...e, onFetchingDetail: false }));
            }
        );
    };

    useEffect(() => {
        fetChingData.onFetchingDetail && _ServerFetchingDetailPage();
    }, [fetChingData.onFetchingDetail]);

    const _ServerFetching_ItemsAll = () => {
        Axios(
            "POST",
            "/api_web/api_internal_plan/searchProductsVariant?csrf_protection=true&term",
            {
                params: {
                    "filter[branch_id]": idChange.idBranch !== null ? +idChange.idBranch.value : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let { result } = response.data.data;
                    sDataSelect((e) => ({ ...e, dataItems: result }));
                }
            }
        );
        sFetchingData((e) => ({ ...e, onFetchingItemsAll: false }));
    };

    let searchTimeout;

    const _HandleSeachApi = (inputValue) => {
        if (inputValue == "") return;
        else {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                Axios(
                    "POST",
                    `/api_web/api_internal_plan/searchProductsVariant?csrf_protection=true`,
                    {
                        params: {
                            "filter[branch_id]": idChange.idBranch !== null ? +idChange.idBranch.value : null,
                        },
                        data: {
                            term: inputValue,
                        },
                    },
                    (err, response) => {
                        if (!err) {
                            let { result } = response.data.data;
                            sDataSelect((e) => ({ ...e, dataItems: result }));
                        }
                    }
                );
            }, 500);
        }
    };

    const checkListData = (value, sDataSelect, sListData, sId, id) => {
        return Swal.fire({
            title: `${dataLang?.returns_err_DeleteItem || "returns_err_DeleteItem"}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#296dc1",
            cancelButtonColor: "#d33",
            confirmButtonText: `${dataLang?.aler_yes}`,
            cancelButtonText: `${dataLang?.aler_cancel}`,
        }).then((result) => {
            if (result.isConfirmed) {
                sDataSelect((e) => ({ ...e, dataItems: [] }));
                sListData([]);
                sId(value);
            } else {
                sId({ ...id });
            }
        });
    };

    const sIdBranch = (e) => {
        sIdChange((list) => ({ ...list, idBranch: e }));
    };

    const checkValue = (data) => {
        sIdChange((e) => ({ ...e, ...data }));
    };

    const handleChangeCode = (value) => {
        checkValue({ code: value.target.value });
    };

    const handleChangeDate = (value) => {
        checkValue({ date: moment(value).format("YYYY-MM-DD HH:mm:ss") });
    };

    const handleStartDate = () => {
        checkValue({ date: new Date() });
    };

    const handleChangeNamePlan = (value) => {
        checkValue({ namePlan: value.target.value });
    };

    const handleChangeNote = (value) => {
        checkValue({ note: value.target.value });
    };

    const handleBranchChange = (value) => {
        if (idChange.idBranch !== value) {
            if (listData?.length > 0) {
                checkListData(value, sDataSelect, sListData, sIdBranch, idChange.idBranch);
            } else {
                checkValue({ idBranch: value });
            }
        }
    };

    const handleDateAllChange = (value) => {
        checkValue({ dateAll: value });
        if (listData?.length > 0) {
            const newData = listData.map((e) => ({
                ...e,
                date: value,
            }));
            sListData(newData);
        }
    };

    const _HandleChangeInput = (type, value) => {
        const onChange = {
            code: () => handleChangeCode(value),
            date: () => handleChangeDate(value),
            startDate: () => handleStartDate(),
            namePlan: () => handleChangeNamePlan(value),
            note: () => handleChangeNote(value),
            branch: () => handleBranchChange(value),
            dateAll: () => handleDateAllChange(value),
        };
        onChange[type]?.();
    };

    useEffect(() => {
        router.query && sFetchingData((e) => ({ ...e, onFetching: true }));
    }, [router.query]);

    useEffect(() => {
        if (idChange.idBranch !== null) sErrors((prevErrors) => ({ ...prevErrors, errBranch: false }));
        if (idChange.idBranch !== null) sFetchingData((e) => ({ ...e, onFetchingItemsAll: true }));
    }, [idChange.idBranch]);

    useEffect(() => {
        if (idChange.namePlan !== null) sErrors((prevErrors) => ({ ...prevErrors, errPlan: false }));
    }, [idChange.namePlan]);

    useEffect(() => {
        fetChingData.onFetchingItemsAll && _ServerFetching_ItemsAll();
    }, [fetChingData.onFetchingItemsAll]);

    const formatNumber = (number) => {
        const integerPart = Math.floor(number);
        return integerPart.toLocaleString("en");
    };

    const _DataValueItem = (value) => {
        return {
            parent: {
                id: uuidv4(),
                matHang: value,
                idParenBackend: "",
                unit: value?.e?.unit_name,
                quantity: null,
                date: idChange.dateAll ? idChange.dateAll : "",
                note: null,
            },
        };
    };

    const _HandleAddParent = (value) => {
        const checkData = listData?.some((e) => e?.matHang?.value === value?.value);
        if (!checkData) {
            const { parent } = _DataValueItem(value);
            sListData([parent, ...listData]);
        } else {
            ToatstNotifi("error", `${dataLang?.returns_err_ItemSelect || "returns_err_ItemSelect"}`);
        }
    };

    const _HandleDeleteParent = (parentId) => {
        const newData = listData.filter((e) => e?.id !== parentId);
        sListData([...newData]);
    };

    const _HandleChangeChild = (parentId, type, value) => {
        const newData = listData.map((e) => {
            if (e?.id == parentId) {
                switch (type) {
                    case "quantity":
                        e.quantity = Number(value?.value);
                        break;
                    case "increase":
                        e.quantity = Number(e?.quantity) + 1;
                        break;
                    case "decrease":
                        e.quantity = Number(e?.quantity) - 1;
                        break;
                    case "date":
                        e.date = value;
                        break;
                    case "note":
                        e.note = value?.target.value;
                        break;
                    default:
                }
            }
            return e;
        });
        sListData([...newData]);
    };
    const _HandleChangeValue = (parentId, value) => {
        const checkData = listData?.some((e) => e?.matHang?.value === value?.value);
        if (!checkData) {
            const newData = listData?.map((e) => {
                if (e?.id === parentId) {
                    const { parent } = _DataValueItem(value);
                    return parent;
                } else {
                    return e;
                }
            });
            sListData([...newData]);
        } else {
            ToatstNotifi("error", `${dataLang?.returns_err_ItemSelect || "returns_err_ItemSelect"}`);
        }
    };

    const selectItemsLabel = (option) => {
        return (
            <div className="py-1">
                <div className="flex items-center gap-1">
                    <div className="w-[40px] h-[50px]">
                        {option.e?.images != null ? (
                            <img
                                src={option.e?.images}
                                alt="Product Image"
                                className="max-w-[40px] h-[50px] text-[8px] object-cover rounded"
                            />
                        ) : (
                            <div className=" w-[40px] h-[50px] object-cover  flex items-center justify-center rounded">
                                <img
                                    src="/no_img.png"
                                    alt="Product Image"
                                    className="w-[30px] h-[30px] object-cover rounded"
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                            {option.e?.item_name}
                        </h3>
                        <div className="flex gap-2">
                            <h5 className="text-gray-400 font-normal 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                {option.e?.code}
                            </h5>
                            <h5 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                {option.e?.product_variation}
                            </h5>
                        </div>
                        <h5 className="text-gray-400 font-medium text-xs 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                            {dataLang[option.e?.text_type]}
                        </h5>
                    </div>
                </div>
            </div>
        );
    };

    const _HandleSubmit = (e) => {
        e.preventDefault();
        const hasNullQuantity = listData.some((e) => e.quantity == "" || e.quantity == null || e.quantity == 0);
        const hasNullDate = listData.some((e) => e.date == null || e.date == "");

        const isEmpty = listData?.length == 0;

        if (!idChange.idBranch || !idChange.namePlan || hasNullQuantity || isEmpty || hasNullDate) {
            sErrors((e) => ({
                ...e,
                errBranch: !idChange.idBranch,
                errQuantity: hasNullQuantity,
                errPlan: !idChange.namePlan,
                errDate: hasNullDate,
            }));
            if (!idChange.idBranch || !idChange.namePlan) {
                ToatstNotifi("error", `${dataLang?.required_field_null}`);
            } else if (isEmpty) {
                ToatstNotifi("error", `Chưa nhập thông tin mặt hàng`);
            } else {
                ToatstNotifi("error", `${dataLang?.required_field_null}`);
            }
        } else {
            sFetchingData((e) => ({ ...e, onSending: true }));
        }
    };
    const _ServerSending = async () => {
        let formData = new FormData();
        formData.append("reference_no", idChange.code ? idChange.code : "");
        formData.append(
            "date",
            moment(idChange.date).format("YYYY-MM-DD HH:mm:ss")
                ? moment(idChange.date).format("YYYY-MM-DD HH:mm:ss")
                : ""
        );
        formData.append("branch_id", idChange.idBranch?.value ? idChange.idBranch?.value : "");
        formData.append("plan_name", idChange.namePlan ? idChange.namePlan : "");
        formData.append("note", idChange.note ? idChange.note : "");
        listData.forEach((item, index) => {
            formData.append(`items[${index}][id]`, id ? item?.idParenBackend : "");
            formData.append(`items[${index}][item_id]`, item?.matHang?.value);
            formData.append(`items[${index}][quantity]`, item?.quantity ? item?.quantity : "");
            formData.append(`items[${index}][date_needed]`, item?.date ? moment(item?.date).format("DD/MM/YYYY") : "");
            formData.append(`items[${index}][note_item]`, item?.note ? item?.note : "");
        });
        await Axios(
            "POST",
            `${
                id
                    ? `/api_web/api_internal_plan/handling/${id}?csrf_protection=true`
                    : "/api_web/api_internal_plan/handling?csrf_protection=true"
            }`,
            {
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    let { isSuccess, message } = response.data;
                    if (isSuccess) {
                        ToatstNotifi("success", `${dataLang[message] || message}`);
                        resetAllStates();
                        sListData([]);
                        router.push(routerInternalPlan.home);
                    } else {
                        ToatstNotifi("error", `${dataLang[message] || message}`);
                    }
                }
                sFetchingData((e) => ({ ...e, onSending: false }));
            }
        );
    };

    useEffect(() => {
        fetChingData.onSending && _ServerSending();
    }, [fetChingData.onSending]);

    return (
        <React.Fragment>
            <Head>
                <title>
                    {id
                        ? dataLang?.internal_plan_edit || "internal_plan_edit"
                        : dataLang?.internal_plan_add || "internal_plan_add"}
                </title>
            </Head>
            <div className="xl:px-10 px-3 xl:pt-24 pt-[88px] pb-3 space-y-2.5 flex flex-col justify-between">
                <div className="h-[97%] space-y-3 overflow-hidden">
                    {trangthaiExprired ? (
                        <div className="p-2"></div>
                    ) : (
                        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                            <h6 className="text-[#141522]/40">{dataLang?.internal_planEnd || "internal_planEnd"}</h6>
                            <span className="text-[#141522]/40">/</span>
                            <h6>
                                {id
                                    ? dataLang?.internal_plan_edit || "internal_plan_edit"
                                    : dataLang?.internal_plan_add || "internal_plan_add"}
                            </h6>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <h2 className="xl:text-2xl text-xl ">{dataLang?.internal_plan_add || "internal_plan_add"}</h2>
                        <div className="flex justify-end items-center">
                            <button
                                onClick={() => router.push(routerInternalPlan.home)}
                                className="xl:text-sm text-xs xl:px-5 px-3 hover:bg-blue-500 hover:text-white transition-all ease-in-out xl:py-2.5 py-1.5  bg-slate-100  rounded btn-animation hover:scale-105"
                            >
                                {dataLang?.import_comeback || "import_comeback"}
                            </button>
                        </div>
                    </div>

                    <div className=" w-full rounded">
                        <div className="">
                            <h2 className="font-normal bg-[#ECF0F4] p-2">
                                {dataLang?.purchase_order_detail_general_informatione ||
                                    "purchase_order_detail_general_informatione"}
                            </h2>
                            <div className="grid grid-cols-8 gap-3 items-center mt-2">
                                <div className="col-span-2">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.import_code_vouchers || "import_code_vouchers"}{" "}
                                    </label>
                                    <input
                                        value={idChange.code}
                                        onChange={_HandleChangeInput.bind(this, "code")}
                                        name="fname"
                                        type="text"
                                        placeholder={
                                            dataLang?.purchase_order_system_default || "purchase_order_system_default"
                                        }
                                        className={`focus:border-[#92BFF7] border-[#d0d5dd]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal   p-2 border outline-none`}
                                    />
                                </div>
                                <div className="col-span-2 relative">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.import_day_vouchers || "import_day_vouchers"}
                                    </label>
                                    <div className="custom-date-picker flex flex-row">
                                        <DatePicker
                                            blur
                                            fixedHeight
                                            showTimeSelect
                                            selected={idChange.date}
                                            onSelect={(date) => sIdChange((e) => ({ ...e, date: date }))}
                                            onChange={(e) => _HandleChangeInput(e, "date")}
                                            placeholderText="DD/MM/YYYY HH:mm:ss"
                                            dateFormat="dd/MM/yyyy h:mm:ss aa"
                                            timeInputLabel={"Time: "}
                                            placeholder={
                                                dataLang?.price_quote_system_default || "price_quote_system_default"
                                            }
                                            className={`border ${"focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer `}
                                        />
                                        {idChange.date && (
                                            <>
                                                <MdClear
                                                    className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                                                    onClick={() => _HandleChangeInput("startDate")}
                                                />
                                            </>
                                        )}
                                        <BsCalendarEvent className="absolute right-0 -translate-x-[75%] translate-y-[70%] text-[#CCCCCC] scale-110 cursor-pointer" />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.import_branch || "import_branch"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        options={dataSelect.dataBranch}
                                        onChange={_HandleChangeInput.bind(this, "branch")}
                                        value={idChange.idBranch}
                                        isLoading={idChange.idBranch != null ? false : fetChingData.onLoading}
                                        isClearable={true}
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={dataLang?.import_branch || "import_branch"}
                                        className={`${
                                            errors.errBranch ? "border-red-500" : "border-transparent"
                                        } placeholder:text-slate-300 w-full z-30 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                        isSearchable={true}
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
                                            menu: (provided) => ({
                                                ...provided,
                                                // zIndex: 9999, // Giá trị z-index tùy chỉnh
                                            }),
                                            control: (base, state) => ({
                                                ...base,
                                                boxShadow: "none",
                                                padding: "2.7px",
                                                ...(state.isFocused && {
                                                    border: "0 0 0 1px #92BFF7",
                                                }),
                                            }),
                                        }}
                                    />
                                    {errors.errBranch && (
                                        <label className="text-sm text-red-500">
                                            {dataLang?.purchase_order_errBranch || "purchase_order_errBranch"}
                                        </label>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.internal_plan_name || "internal_plan_name"}
                                    </label>{" "}
                                    <span className="text-red-500">*</span>
                                    <input
                                        value={idChange.namePlan}
                                        onChange={_HandleChangeInput.bind(this, "namePlan")}
                                        name="fname"
                                        type="text"
                                        placeholder={dataLang?.internal_plan_name || "internal_plan_name"}
                                        className={`focus:border-[#92BFF7] ${
                                            errors.errPlan ? "border-red-500 " : "border-[#d0d5dd]"
                                        }   placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal   p-2 border outline-none`}
                                    />
                                    {errors.errPlan && (
                                        <label className="text-sm text-red-500">
                                            {dataLang?.internal_plan_errName || "internal_plan_errName"}
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" bg-[#ECF0F4] p-2 grid  grid-cols-12">
                        <div className="font-normal col-span-12">
                            {dataLang?.import_item_information || "import_item_information"}
                        </div>
                    </div>
                    <div className="grid grid-cols-12 items-center  sticky top-0  bg-[#F7F8F9] py-2 z-10">
                        <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-3 text-center truncate font-[400]">
                            {dataLang?.import_from_items || "import_from_items"}
                        </h4>
                        <div className="col-span-9">
                            <div className="grid grid-cols-5">
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                    {"ĐVT"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                    {dataLang?.import_from_quantity || "import_from_quantity"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                    {dataLang?.internal_plan_dateFrom || "internal_plan_dateFrom"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]">
                                    {dataLang?.import_from_note || "import_from_note"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]">
                                    {dataLang?.import_from_operation || "import_from_operation"}
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 items-center gap-1 py-2">
                        <div className="col-span-3">
                            <Select
                                options={options}
                                value={null}
                                onInputChange={_HandleSeachApi.bind(this)}
                                onChange={_HandleAddParent.bind(this)}
                                className="col-span-2 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]"
                                placeholder={dataLang?.returns_items || "returns_items"}
                                noOptionsMessage={() => dataLang?.returns_nodata || "returns_nodata"}
                                menuPortalTarget={document.body}
                                formatOptionLabel={selectItemsLabel}
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
                                        // zIndex: 9999,
                                    }),
                                    control: (base, state) => ({
                                        ...base,
                                        ...(state.isFocused && {
                                            border: "0 0 0 1px #92BFF7",
                                            boxShadow: "none",
                                        }),
                                    }),
                                    menu: (provided, state) => ({
                                        ...provided,
                                        width: "100%",
                                    }),
                                }}
                            />
                        </div>
                        <div className="col-span-9">
                            <div className="grid grid-cols-5  divide-x border-t border-b border-r border-l rounded">
                                <div className="col-span-1"></div>
                                <div className="col-span-1 flex  justify-center items-center">
                                    <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full">
                                        <Minus className="2xl:scale-100 xl:scale-100 scale-50" size="16" />
                                    </button>
                                    <div className=" text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]  3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal 3xl:w-24 2xl:w-[60px] xl:w-[50px] w-[40px]  focus:outline-none border-b border-gray-200">
                                        1
                                    </div>
                                    <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full">
                                        <Add className="2xl:scale-100 xl:scale-100 scale-50" size="16" />
                                    </button>
                                </div>
                                <div className="col-span-1 justify-center flex items-center">
                                    <div className=" 3xl:text-[12px] w-full 2xl:text-[10px] xl:text-[9.5px] text-[9px] text-center py-[9px] px-2 font-medium bg-slate-50 text-black">
                                        25/10/2023
                                    </div>
                                </div>
                                <input
                                    placeholder={dataLang?.returns_note || "returns_note"}
                                    disabled
                                    className=" disabled:bg-gray-50 col-span-1 placeholder:text-slate-300 w-full bg-[#ffffff] 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]  p-1.5 "
                                />
                                <button
                                    title={dataLang?.returns_delete || "returns_delete"}
                                    disabled
                                    className="col-span-1 disabled:opacity-50 transition w-full h-full bg-slate-100  rounded-[5.5px] text-red-500 flex flex-col justify-center items-center"
                                >
                                    <IconDelete />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                        <div className="min:h-[400px] h-[100%] max:h-[800px] w-full">
                            {fetChingData.onFetchingDetail ? (
                                <Loading className="h-10 w-full" color="#0f4f9e" />
                            ) : (
                                <>
                                    {listData?.map((e) => (
                                        <TransitionMotion>
                                            <div
                                                key={e?.id?.toString()}
                                                className="grid grid-cols-12  my-1 items-center "
                                            >
                                                <div className="col-span-3 h-full ">
                                                    <div className="relative">
                                                        <Select
                                                            options={options}
                                                            value={e?.matHang}
                                                            onInputChange={_HandleSeachApi.bind(this)}
                                                            className=""
                                                            onChange={_HandleChangeValue.bind(this, e?.id)}
                                                            menuPortalTarget={document.body}
                                                            formatOptionLabel={selectItemsLabel}
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
                                                                    // zIndex: 9999,
                                                                }),
                                                                control: (base, state) => ({
                                                                    ...base,
                                                                    ...(state.isFocused && {
                                                                        border: "0 0 0 1px #92BFF7",
                                                                        boxShadow: "none",
                                                                    }),
                                                                }),
                                                                menu: (provided, state) => ({
                                                                    ...provided,
                                                                    width: "100%",
                                                                }),
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-5 items-center col-span-9 border divide-x ml-1">
                                                    <div className="col-span-1 py-5 flex justify-center items-center text-sm">
                                                        {e.unit}
                                                    </div>
                                                    <div className="col-span-1 py-5 relative">
                                                        <div className="flex items-center justify-center h-full p-0.5">
                                                            <button
                                                                disabled={
                                                                    e.quantity === 1 ||
                                                                    e.quantity === "" ||
                                                                    e.quantity === null ||
                                                                    e.quantity === 0
                                                                }
                                                                className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full"
                                                                onClick={_HandleChangeChild.bind(
                                                                    this,
                                                                    e?.id,
                                                                    "decrease"
                                                                )}
                                                            >
                                                                <Minus
                                                                    className="2xl:scale-100 xl:scale-100 scale-50"
                                                                    size="16"
                                                                />
                                                            </button>
                                                            <NumericFormat
                                                                onValueChange={_HandleChangeChild.bind(
                                                                    this,
                                                                    e.id,
                                                                    "quantity"
                                                                )}
                                                                value={e.quantity || null}
                                                                className={`${
                                                                    errors.errQuantity &&
                                                                    (e.quantity == null ||
                                                                        e.quantity == "" ||
                                                                        e.quantity == 0)
                                                                        ? "border-b border-red-500"
                                                                        : "border-b border-gray-200"
                                                                } appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal 3xl:w-24 2xl:w-[60px] xl:w-[50px] w-[40px]  focus:outline-none `}
                                                                allowNegative={false}
                                                                decimalScale={0}
                                                                isNumericString={true}
                                                                thousandSeparator=","
                                                                isAllowed={(values) => {
                                                                    const { value } = values;
                                                                    const newValue = +value;

                                                                    return true;
                                                                }}
                                                            />
                                                            <button
                                                                className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full"
                                                                onClick={_HandleChangeChild.bind(
                                                                    this,
                                                                    e?.id,
                                                                    "increase"
                                                                )}
                                                            >
                                                                <Add
                                                                    className="2xl:scale-100 xl:scale-100 scale-50"
                                                                    size="16"
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-1 py-3 flex justify-center items-center">
                                                        <div className="h-full w-fit">
                                                            <DatePicker
                                                                selected={e.date}
                                                                dateFormat="dd/MM/yyyy"
                                                                onChange={_HandleChangeChild.bind(this, e?.id, "date")}
                                                                isClearable
                                                                value={e.date}
                                                                placeholderText="Chọn ngày"
                                                                className={`outline-none ${
                                                                    errors.errDate && (e.date == null || e.date == "")
                                                                        ? "border-b border-red-500"
                                                                        : "border-b border-gray-200"
                                                                } border py-2 px-1 rounded-md placeholder:text-xs w-fit`}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-span-1 py-5 flex items-center justify-center ">
                                                        <input
                                                            value={e.note}
                                                            onChange={_HandleChangeChild.bind(this, e.id, "note")}
                                                            placeholder={
                                                                dataLang?.delivery_receipt_note ||
                                                                "delivery_receipt_note"
                                                            }
                                                            type="text"
                                                            className="  placeholder:text-slate-300 text-xs px-1 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal outline-none "
                                                        />
                                                    </div>
                                                    <div className="col-span-1  h-full flex items-center justify-center">
                                                        <div>
                                                            <button
                                                                title="Xóa"
                                                                onClick={_HandleDeleteParent.bind(this, e.id)}
                                                                className=" text-red-500 flex p-1 justify-center items-center hover:scale-110 bg-red-50  rounded-md hover:bg-red-200 transition-all ease-linear animate-bounce-custom"
                                                            >
                                                                <IconDelete size={24} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TransitionMotion>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-12 mb-3 font-normal bg-[#ecf0f475] p-2 items-center">
                        <div className="col-span-4  flex items-center gap-2">
                            <h2>{dataLang?.internal_plan_dateFrom || "internal_plan_dateFrom"}</h2>
                            <div className="col-span-2 text-center flex items-center justify-center">
                                <DatePicker
                                    selected={idChange.dateAll}
                                    dateFormat="dd/MM/yyyy"
                                    onChange={_HandleChangeInput.bind(this, "dateAll")}
                                    isClearable
                                    value={idChange.dateAll}
                                    placeholderText="Chọn ngày"
                                    className="outline-none border py-2 px-1 rounded-md placeholder:text-xs w-fit"
                                />
                            </div>
                        </div>
                    </div>
                    <h2 className="font-normal bg-[white]  p-2 border-b border-b-[#a9b5c5]  border-t border-t-[#a9b5c5]">
                        {dataLang?.purchase_order_table_total_outside || "purchase_order_table_total_outside"}{" "}
                    </h2>
                </div>
                <div className="grid grid-cols-12">
                    <div className="col-span-9">
                        <div className="text-[#344054] font-normal text-sm mb-1 ">
                            {dataLang?.returns_reason || "returns_reason"}
                        </div>
                        <textarea
                            value={idChange.note}
                            placeholder={dataLang?.returns_reason || "returns_reason"}
                            onChange={_HandleChangeInput.bind(this, "note")}
                            name="fname"
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-[40%] min-h-[220px] max-h-[220px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none "
                        />
                    </div>
                    <div className="text-right mt-5 space-y-4 col-span-3 flex-col justify-between ">
                        <div className="flex justify-between "></div>
                        <div className="flex justify-between ">
                            <div className="font-normal ">
                                <h3>{dataLang?.internal_plan_total || "internal_plan_total"}</h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">
                                    {formatNumber(
                                        listData?.reduce((accumulator, item) => {
                                            return accumulator + item.quantity;
                                        }, 0)
                                    )}
                                </h3>
                            </div>
                        </div>
                        <div className="space-x-2">
                            <button
                                onClick={() => router.push(routerInternalPlan.home)}
                                className="button text-[#344054] font-normal text-base hover:bg-blue-500 hover:text-white hover:scale-105 ease-in-out transition-all btn-amination py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]"
                            >
                                {dataLang?.purchase_order_purchase_back || "purchase_order_purchase_back"}
                            </button>
                            <button
                                onClick={_HandleSubmit.bind(this)}
                                type="submit"
                                className="button text-[#FFFFFF] hover:bg-blue-500 font-normal text-base hover:scale-105 ease-in-out transition-all btn-amination py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]"
                            >
                                {dataLang?.purchase_order_purchase_save || "purchase_order_purchase_save"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
const MoreSelectedBadge = ({ items }) => {
    const title = items.join(", ");
    const length = items.length;
    const label = `+ ${length}`;
    // const label = ``;

    return (
        <div className="ml-auto bg-sky-500 rounded-md text-xs px-1 py-1 order-[99] text-white" title={title}>
            {label}
        </div>
    );
};

const MultiValue = ({ index, getValue, ...props }) => {
    const maxToShow = 0;
    const overflow = getValue()
        .slice(maxToShow)
        .map((x) => x.label);

    return index < maxToShow ? (
        <components.MultiValue {...props} />
    ) : index === maxToShow ? (
        <MoreSelectedBadge items={overflow} />
    ) : null;
};

export default Index;
