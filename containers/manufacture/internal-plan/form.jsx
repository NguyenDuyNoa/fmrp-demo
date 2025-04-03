import apiInternalPlan from "@/Api/apiManufacture/manufacture/internalPlan/apiInternalPlan";
import ButtonBack from "@/components/UI/button/buttonBack";
import ButtonSubmit from "@/components/UI/button/buttonSubmit";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Container } from "@/components/UI/common/layout";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import Loading from "@/components/UI/loading/loading";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import { optionsQuery } from "@/configs/optionsQuery";
import { CONFIRMATION_OF_CHANGES, TITLE_DELETE_ITEMS } from "@/constants/delete/deleteItems";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { useBranchList } from "@/hooks/common/useBranch";
import useSetingServer from "@/hooks/useConfigNumber";
import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import { routerInternalPlan } from "@/routers/manufacture";
import { isAllowedNumber } from "@/utils/helpers/common";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { SelectCore } from "@/utils/lib/Select";
import { useQuery } from "@tanstack/react-query";
import { Add, Trash as IconDelete, Minus } from "iconsax-react";
import { debounce } from "lodash";
import moment from "moment/moment";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { BsCalendarEvent } from "react-icons/bs";
import { MdClear } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { useInternalPlanItems } from "./hooks/useInternalPlanItems";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import Breadcrumb from "@/components/UI/breadcrumb/BreadcrumbCustom";

const initsFetching = {
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

const initsValue = {
    code: "",
    date: new Date(),
    idBranch: null,
    namePlan: "",
    note: "",
    dateAll: null,
};
const InternalPlanForm = (props) => {
    const router = useRouter();

    const isShow = useToast();

    const id = router.query?.id;

    const dataLang = props?.dataLang;

    const dataSeting = useSetingServer();

    const statusExprired = useStatusExprired();

    const [searchItems, sSearchItems] = useState("");

    const { isOpen, isKeyState, handleQueryId } = useToggle();

    const [fetChingData, sFetchingData] = useState(initsFetching);

    const [idChange, sIdChange] = useState(initsValue);

    const [errors, sErrors] = useState(initsErors);

    const [listData, sListData] = useState([]);

    const { data: dataBranch = [] } = useBranchList()

    const { data: dataItems } = useInternalPlanItems(idChange.idBranch, searchItems)

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const resetAllStates = () => {
        sIdChange(initsValue);
        sErrors(initsErors);
    };

    useEffect(() => {
        router.query && resetAllStates();
    }, [router.query]);


    const { isFetching } = useQuery({
        queryKey: ['api_internal_plan_page_detail', id],
        queryFn: async () => {
            const { data } = await apiInternalPlan.apiDetailInternalPlan(id);
            sListData(data?.internalPlansItems.map((e) => {
                return {
                    id: e?.id,
                    idParenBackend: e?.id,
                    item: {
                        e: e,
                        label: `${e?.item_name} <span style={{display: none}}>${e?.code + e?.product_variation + e?.text_type + e?.unit_name}</span>`,
                        value: e?.item_id,
                    },
                    unit: e?.unit_name,
                    quantity: Number(e?.quantity),
                    note: e?.note_item,
                    date: moment(e?.date_needed).toDate(),
                };
            })
            );
            sIdChange({
                code: data?.internalPlans?.reference_no,
                date: moment(data?.internalPlans?.date).toDate(),
                idBranch: {
                    label: data?.internalPlans?.name_branch,
                    value: data?.internalPlans?.branch_id,
                },
                namePlan: data?.internalPlans.plan_name,
                note: data?.internalPlans?.note,
            });
        },
        enabled: !!id,
        ...optionsQuery
    })

    const _HandleSeachApi = debounce(async (inputValue) => {
        try {
            sSearchItems(inputValue);
        } catch (error) { }
    }, 500);

    const handleSaveStatus = () => {
        isKeyState?.sListData([]);
        isKeyState?.sId(isKeyState?.value);
        handleQueryId({ status: false });
    };

    const handleCancleStatus = () => {
        isKeyState?.sId({ ...isKeyState?.id });
        handleQueryId({ status: false });
    };

    const checkListData = (value, sListData, sId, id) => {
        handleQueryId({
            status: true,
            initialKey: {
                value,
                sListData,
                sId,
                id,
            },
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
        checkValue({ date: formatMoment(value, FORMAT_MOMENT.DATE_TIME_LONG) });
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
                checkListData(value, sListData, sIdBranch, idChange.idBranch);
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
        if (idChange.idBranch !== null) sErrors((prevErrors) => ({ ...prevErrors, errBranch: false }));
    }, [idChange.idBranch]);

    useEffect(() => {
        if (idChange.namePlan !== null) sErrors((prevErrors) => ({ ...prevErrors, errPlan: false }));
    }, [idChange.namePlan]);


    const _DataValueItem = (value) => {
        return {
            parent: {
                id: uuidv4(),
                item: value,
                idParenBackend: "",
                unit: value?.e?.unit_name,
                quantity: null,
                date: idChange.dateAll ? idChange.dateAll : "",
                note: null,
            },
        };
    };

    const _HandleAddParent = (value) => {
        const checkData = listData?.some((e) => e?.item?.value === value?.value);
        if (!checkData) {
            const { parent } = _DataValueItem(value);
            sListData([parent, ...listData]);
        } else {
            isShow("error", `${dataLang?.returns_err_ItemSelect || "returns_err_ItemSelect"}`);
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
        const checkData = listData?.some((e) => e?.item?.value === value?.value);
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
            isShow("error", `${dataLang?.returns_err_ItemSelect || "returns_err_ItemSelect"}`);
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
                                    src="/icon/noimagelogo.png"
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
                isShow("error", `${dataLang?.required_field_null}`);
            } else if (isEmpty) {
                isShow("error", `Chưa nhập thông tin mặt hàng`);
            } else {
                isShow("error", `${dataLang?.required_field_null}`);
            }
        } else {
            sFetchingData((e) => ({ ...e, onSending: true }));
        }
    };
    const _ServerSending = async () => {
        let formData = new FormData();
        formData.append("reference_no", idChange.code ? idChange.code : "");

        formData.append("date", formatMoment(idChange.date, FORMAT_MOMENT.DATE_TIME_LONG) ? formatMoment(idChange.date, FORMAT_MOMENT.DATE_TIME_LONG) : "");

        formData.append("branch_id", idChange.idBranch?.value ? idChange.idBranch?.value : "");

        formData.append("plan_name", idChange.namePlan ? idChange.namePlan : "");

        formData.append("note", idChange.note ? idChange.note : "");

        listData.forEach((item, index) => {
            formData.append(`items[${index}][id]`, id ? item?.idParenBackend : "");

            formData.append(`items[${index}][item_id]`, item?.item?.value);

            formData.append(`items[${index}][quantity]`, item?.quantity ? item?.quantity : "");

            formData.append(`items[${index}][date_needed]`, item?.date ? formatMoment(item?.date, FORMAT_MOMENT.DATE_SLASH_LONG) : "");

            formData.append(`items[${index}][note_item]`, item?.note ? item?.note : "");
        });

        const url = id ? `/api_web/api_internal_plan/handling/${id}?csrf_protection=true` : "/api_web/api_internal_plan/handling?csrf_protection=true";

        try {
            const { isSuccess, message } = await apiInternalPlan.apiHandlingInternalPlan(url, formData);
            if (isSuccess) {
                isShow("success", `${dataLang[message] || message}`);

                resetAllStates();

                sListData([]);

                router.push(routerInternalPlan.home);

                sFetchingData((e) => ({ ...e, onSending: false }));
            } else {
                isShow("error", `${dataLang[message] || data?.message}`);
            }
        } catch (error) {
            throw error
        }
    };

    useEffect(() => {
        fetChingData.onSending && _ServerSending();
    }, [fetChingData.onSending]);


    // breadcrumb
    const breadcrumbItems = [
        {
            label: `Sản xuất`,
            // href: "/",
        },
        {
            label: `${dataLang?.internal_plan || "internal_plan"}`,
            href: "/manufacture/internal-plan",
        },
        {
            label: id ? dataLang?.internal_plan_edit || "internal_plan_edit" : dataLang?.internal_plan_add || "internal_plan_add"
        }
    ];

    return (
        <React.Fragment>
            <Head>
                <title>
                    {id ? dataLang?.internal_plan_edit || "internal_plan_edit" : dataLang?.internal_plan_add || "internal_plan_add"}
                </title>
            </Head>
            <Container className={"!h-auto"}>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <Breadcrumb
                        items={breadcrumbItems}
                        className="3xl:text-sm 2xl:text-xs xl:text-[10px] lg:text-[10px]"
                    />
                    // <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                    //     <h6 className="text-[#141522]/40">{dataLang?.internal_planEnd || "internal_planEnd"}</h6>
                    //     <span className="text-[#141522]/40">/</span>
                    //     <h6>
                    //         {id ? dataLang?.internal_plan_edit || "internal_plan_edit" : dataLang?.internal_plan_add || "internal_plan_add"}
                    //     </h6>
                    // </div>
                )}
                <div className="h-[97%] space-y-3 overflow-hidden">
                    <div className="flex items-center justify-between">
                        <h2 className="text-title-section text-[#52575E] capitalize font-medium">
                            {id ? dataLang?.internal_plan_edit || "internal_plan_edit" : dataLang?.internal_plan_add || "internal_plan_add"}
                        </h2>
                        <div className="flex items-center justify-end mr-2">
                            <button
                                onClick={() => router.push(routerInternalPlan.home)}
                                className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5  bg-slate-100  rounded btn-animation hover:scale-105"
                            >
                                {dataLang?.import_comeback || "import_comeback"}
                            </button>
                        </div>
                    </div>

                    <div className="w-full rounded ">
                        <div className="">
                            <h2 className="font-normal bg-[#ECF0F4] p-2 ">
                                {dataLang?.purchase_order_detail_general_informatione || "purchase_order_detail_general_informatione"}
                            </h2>
                            <div className="grid items-center grid-cols-8 gap-3 mt-2">
                                <div className="col-span-2">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.import_code_vouchers || "import_code_vouchers"}{" "}
                                    </label>
                                    <input
                                        value={idChange.code}
                                        onChange={_HandleChangeInput.bind(this, "code")}
                                        name="fname"
                                        type="text"
                                        placeholder={dataLang?.purchase_order_system_default || "purchase_order_system_default"}
                                        className={`focus:border-[#92BFF7] border-[#d0d5dd]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal   p-2 border outline-none`}
                                    />
                                </div>
                                <div className="relative col-span-2">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.import_day_vouchers || "import_day_vouchers"}
                                    </label>
                                    <div className="flex flex-row custom-date-picker">
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
                                            placeholder={dataLang?.price_quote_system_default || "price_quote_system_default"}
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
                                    <SelectCore
                                        options={dataBranch}
                                        onChange={_HandleChangeInput.bind(this, "branch")}
                                        value={idChange.idBranch}
                                        isLoading={idChange.idBranch != null ? false : fetChingData.onLoading}
                                        isClearable={true}
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={dataLang?.import_branch || "import_branch"}
                                        className={`${errors.errBranch ? "border-red-500" : "border-transparent"} placeholder:text-slate-300 w-full z-30 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
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
                                        className={`focus:border-[#92BFF7] ${errors.errPlan ? "border-red-500 " : "border-[#d0d5dd]"
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
                        <div className="col-span-12 font-normal">
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
                    <div className="grid items-center grid-cols-12 gap-1 py-2">
                        <div className="col-span-3">
                            <SelectCore
                                options={dataItems}
                                value={null}
                                onInputChange={(event) => {
                                    _HandleSeachApi(event);
                                }}
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
                            <div className="grid grid-cols-5 border-t border-b border-l border-r divide-x rounded">
                                <div className="col-span-1"></div>
                                <div className="flex items-center justify-center col-span-1">
                                    <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full">
                                        <Minus className="scale-50 2xl:scale-100 xl:scale-100" size="16" />
                                    </button>
                                    <div className=" text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]  3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal 3xl:w-24 2xl:w-[60px] xl:w-[50px] w-[40px]  focus:outline-none border-b border-gray-200">
                                        1
                                    </div>
                                    <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full">
                                        <Add className="scale-50 2xl:scale-100 xl:scale-100" size="16" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-center col-span-1">
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
                    <Customscrollbar className="max-h-[400px] h-[400px]  overflow-auto pb-2">
                        <div className="h-[100%] w-full">
                            {isFetching ? (
                                <Loading className="w-full h-10" color="#0f4f9e" />
                            ) : (
                                <>
                                    {listData?.map((e) => (
                                        <div key={e?.id?.toString()} className="grid items-center grid-cols-12 my-1 ">
                                            <div className="h-full col-span-3 ">
                                                <div className="relative">
                                                    <SelectCore
                                                        options={dataItems}
                                                        value={e?.item}
                                                        onInputChange={(event) => {
                                                            _HandleSeachApi(event);
                                                        }}
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
                                            <div className="grid items-center grid-cols-5 col-span-9 ml-1 border divide-x">
                                                <div className="flex items-center justify-center col-span-1 py-5 text-sm">
                                                    {e.unit}
                                                </div>
                                                <div className="relative col-span-1 py-5">
                                                    <div className="flex items-center justify-center h-full p-0.5">
                                                        <button
                                                            disabled={
                                                                e.quantity === 1 ||
                                                                e.quantity === "" ||
                                                                e.quantity === null ||
                                                                e.quantity === 0
                                                            }
                                                            className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full"
                                                            onClick={_HandleChangeChild.bind(this, e?.id, "decrease")}
                                                        >
                                                            <Minus
                                                                className="scale-50 2xl:scale-100 xl:scale-100"
                                                                size="16"
                                                            />
                                                        </button>
                                                        <InPutNumericFormat
                                                            onValueChange={_HandleChangeChild.bind(
                                                                this,
                                                                e.id,
                                                                "quantity"
                                                            )}
                                                            value={e.quantity || null}
                                                            className={`${errors.errQuantity &&
                                                                (e.quantity == null ||
                                                                    e.quantity == "" ||
                                                                    e.quantity == 0)
                                                                ? "border-b border-red-500"
                                                                : "border-b border-gray-200"
                                                                }
                                                                ${e.quantity == null ||
                                                                    e.quantity == "" ||
                                                                    e.quantity == 0
                                                                    ? "border-b border-red-500"
                                                                    : "border-b border-gray-200"
                                                                }
                                                                appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal 3xl:w-24 2xl:w-[60px] xl:w-[50px] w-[40px]  focus:outline-none `}
                                                            isAllowed={isAllowedNumber}
                                                        />
                                                        <button
                                                            className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full"
                                                            onClick={_HandleChangeChild.bind(this, e?.id, "increase")}
                                                        >
                                                            <Add
                                                                className="scale-50 2xl:scale-100 xl:scale-100"
                                                                size="16"
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-center col-span-1 py-3">
                                                    <div className="h-full w-fit">
                                                        <DatePicker
                                                            selected={e.date}
                                                            dateFormat="dd/MM/yyyy"
                                                            onChange={_HandleChangeChild.bind(this, e?.id, "date")}
                                                            isClearable
                                                            value={e.date}
                                                            placeholderText="Chọn ngày"
                                                            className={`outline-none ${errors.errDate && (e.date == null || e.date == "") ? "border-b border-red-500" : "border-b border-gray-200"} border py-2 px-1 rounded-md placeholder:text-xs w-fit`}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-center col-span-1 py-5 ">
                                                    <input
                                                        value={e.note}
                                                        onChange={_HandleChangeChild.bind(this, e.id, "note")}
                                                        placeholder={dataLang?.delivery_receipt_note || "delivery_receipt_note"}
                                                        type="text"
                                                        className="  placeholder:text-slate-300 text-xs px-1 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal outline-none "
                                                    />
                                                </div>
                                                <div className="flex items-center justify-center h-full col-span-1">
                                                    <div>
                                                        <button
                                                            title="Xóa"
                                                            onClick={_HandleDeleteParent.bind(this, e.id)}
                                                            className="flex items-center justify-center p-1 text-red-500 transition-all ease-linear rounded-md hover:scale-110 bg-red-50 hover:bg-red-200 animate-bounce-custom"
                                                        >
                                                            <IconDelete size={24} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </Customscrollbar>
                    <div className="grid grid-cols-12 mb-3 font-normal bg-[#ecf0f475] p-2 items-center">
                        <div className="flex items-center col-span-4 gap-2">
                            <h2>{dataLang?.internal_plan_dateFrom || "internal_plan_dateFrom"}</h2>
                            <div className="flex items-center justify-center col-span-2 text-center">
                                <DatePicker
                                    selected={idChange.dateAll}
                                    dateFormat="dd/MM/yyyy"
                                    onChange={_HandleChangeInput.bind(this, "dateAll")}
                                    isClearable
                                    value={idChange.dateAll}
                                    placeholderText="Chọn ngày"
                                    className="px-1 py-2 border rounded-md outline-none placeholder:text-xs w-fit"
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
                    <div className="flex-col justify-between col-span-3 mt-5 space-y-4 text-right ">
                        <div className="flex justify-between "></div>
                        <div className="flex justify-between ">
                            <div className="font-normal ">
                                <h3>{dataLang?.internal_plan_total || "internal_plan_total"}</h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">
                                    {formatNumber(listData?.reduce((accumulator, item) => {
                                        return accumulator + item.quantity;
                                    }, 0))}
                                </h3>
                            </div>
                        </div>
                        <div className="space-x-2">
                            <ButtonBack onClick={() => router.push(routerInternalPlan.home)} dataLang={dataLang} />
                            <ButtonSubmit
                                loading={fetChingData.onSending}
                                onClick={(e) => _HandleSubmit(e)}
                                dataLang={dataLang}
                            />
                        </div>
                    </div>
                </div>
            </Container>
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                title={TITLE_DELETE_ITEMS}
                subtitle={CONFIRMATION_OF_CHANGES}
                isOpen={isOpen}
                nameModel={"change_item"}
                save={handleSaveStatus}
                cancel={handleCancleStatus}
            />
        </React.Fragment>
    );
};

export default InternalPlanForm;
