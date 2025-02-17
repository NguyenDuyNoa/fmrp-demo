import apiProductionWarehouse from "@/Api/apiManufacture/warehouse/productionWarehouse/apiProductionWarehouse";
import ButtonBack from "@/components/UI/button/buttonBack";
import ButtonSubmit from "@/components/UI/button/buttonSubmit";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Container } from "@/components/UI/common/layout";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import Loading from "@/components/UI/loading/loading";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import { CONFIRMATION_OF_CHANGES, TITLE_DELETE_ITEMS } from "@/constants/delete/deleteItems";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { useBranchList } from "@/hooks/common/useBranch";
import useFeature from "@/hooks/useConfigFeature";
import useSetingServer from "@/hooks/useConfigNumber";
import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import { routerProductionWarehouse } from "@/routers/manufacture";
import { isAllowedNumber } from "@/utils/helpers/common";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { SelectCore } from "@/utils/lib/Select";
import { useQuery } from "@tanstack/react-query";
import { Add, Trash as IconDelete, Minus } from "iconsax-react";
import moment from "moment/moment";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { BsCalendarEvent } from "react-icons/bs";
import { MdClear } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { useProductionWarehouseItems } from "./hooks/useProductionWarehouseItems";

const ProductionWarehouseForm = (props) => {
    const router = useRouter();

    const isShow = useToast();

    const dataSeting = useSetingServer();

    const id = router.query?.id;

    const dataLang = props?.dataLang;

    const { isOpen, isKeyState, handleQueryId } = useToggle();

    const [onLoadingChild, sOnLoadingChild] = useState(false);

    const [onSending, sOnSending] = useState(false);

    const [code, sCode] = useState("");

    const [startDate, sStartDate] = useState(new Date());

    const [note, sNote] = useState("");

    const [date, sDate] = useState(moment().format(FORMAT_MOMENT.DATE_TIME_LONG));

    const statusExprired = useStatusExprired();

    const { dataMaterialExpiry, dataProductExpiry, dataProductSerial } = useFeature();

    //new
    const [listData, sListData] = useState([]);

    const [idBranch, sIdBranch] = useState(null);

    const [load, sLoad] = useState(false);

    const [errDate, sErrDate] = useState(false);

    const [errBranch, sErrBranch] = useState(false);

    const [errWarehouse, sErrWarehouse] = useState(false);

    const [errUnit, sErrUnit] = useState(false);

    const [errQty, sErrQty] = useState(false);

    const { data: dataBranch = [] } = useBranchList();

    const { data: dataItems } = useProductionWarehouseItems({ idBranch })

    useEffect(() => {
        router.query && sErrDate(false);
        router.query && sErrBranch(false);
        router.query && sStartDate(new Date());
        router.query && sNote("");
    }, [router.query]);

    const { isFetching } = useQuery({
        queryKey: ["api_production_warehouse_detail_page", id],
        queryFn: async () => {
            const rResult = await apiProductionWarehouse.apiDetailPageProductionWarehouse(id);
            sIdBranch({
                label: rResult?.branch_name,
                value: rResult?.branch_id,
            });
            sCode(rResult?.code);
            sStartDate(moment(rResult?.date).toDate());
            sNote(rResult?.note);
            sListData(rResult?.items.map((e) => ({
                id: e?.item?.id,
                idParenBackend: e?.item?.id,
                item: {
                    e: e?.item,
                    label: `${e.item?.name} <span style={{display: none}}>${e.item?.code + e.item?.product_variation + e.item?.text_type + e.item?.unit_name}</span>`,
                    value: e.item?.id,
                },
                child: e?.child.map((ce) => ({
                    idChildBackEnd: Number(ce?.id),
                    id: Number(ce?.id),
                    disabledDate:
                        (ce?.text_type == "material" && dataMaterialExpiry?.is_enable == "1" && false) ||
                        (ce?.text_type == "material" && dataMaterialExpiry?.is_enable == "0" && true) ||
                        (ce?.text_type == "products" && dataProductExpiry?.is_enable == "1" && false) ||
                        (ce?.text_type == "products" && dataProductExpiry?.is_enable == "0" && true),
                    location:
                        ce?.warehouse_location?.location_name ||
                            ce?.warehouse_location?.id ||
                            ce?.warehouse_location?.warehouse_name ||
                            ce?.warehouse_location?.quantity
                            ? {
                                label: ce?.warehouse_location?.location_name || null,
                                value: ce?.warehouse_location?.id || null,
                                warehouse_name: ce?.warehouse_location?.warehouse_name || null,
                                qty: +ce?.warehouse_location?.quantity || null,
                            }
                            : null,
                    serial: ce?.serial == null ? "" : ce?.serial,
                    lot: ce?.lot == null ? "" : ce?.lot,
                    date: ce?.expiration_date != null ? moment(ce?.expiration_date).toDate() : null,
                    unit: {
                        label: ce?.unit_data.unit,
                        value: ce?.unit_data.id,
                        coefficient: +ce?.unit_data.coefficient,
                    },
                    dataWarehouse: e?.item?.warehouse.map((ye) => ({
                        label: ye?.location_name,
                        value: ye?.id,
                        warehouse_name: ye?.warehouse_name,
                        qty: +ye?.quantity,
                    })),
                    dataUnit: e?.item?.unit?.map((e) => ({
                        label: e?.unit,
                        value: e?.id,
                        coefficient: +e?.coefficient,
                    })),
                    exportQuantity: +ce?.quantity,
                    exchangeValue: +ce?.coefficient,
                    numberOfConversions: +ce?.quantity_exchange,
                    note: ce?.note,
                })),
            })));
        },
        enabled: !!id,
    })

    const resetValue = () => {
        if (isKeyState?.type === "branch") {
            sListData([]);
            sIdBranch(isKeyState?.value);
        }
        handleQueryId({ status: false });
    };

    const _HandleChangeInput = (type, value) => {
        if (type == "code") {
            sCode(value.target.value);
        } else if (type === "date") {
            sDate(formatMoment(value.target.value, FORMAT_MOMENT.DATE_TIME_LONG));
        } else if (type === "note") {
            sNote(value.target.value);
        } else if (type == "branch" && idBranch != value) {
            if (listData?.length > 0) {
                if (type === "branch" && idBranch != value) {
                    handleQueryId({ status: true, initialKey: { type, value } });
                }
            } else {
                sIdBranch(value);
            }
        }
    };
    const handleClearDate = (type) => {
        if (type === "effectiveDate") {
        }
        if (type === "startDate") {
            sStartDate(new Date());
        }
    };
    const handleTimeChange = (date) => {
        sStartDate(date);
    };

    const _HandleSubmit = (e) => {
        e.preventDefault();
        const hasNullKho = listData.some((item) => item.child?.some((childItem) => childItem.location === null));

        const hasNullUnit = listData.some((item) => item.child?.some((childItem) => childItem.unit === null));

        const hasNullQty = listData.some((item) => item.child?.some((childItem) => childItem.exportQuantity === null || childItem.exportQuantity === "" || childItem.exportQuantity == 0));

        const isEmpty = listData?.length === 0 ? true : false;

        if (idBranch == null || hasNullKho || hasNullUnit || hasNullQty || isEmpty) {
            idBranch == null && sErrBranch(true);
            hasNullKho && sErrWarehouse(true);
            hasNullUnit && sErrUnit(true);
            hasNullQty && sErrQty(true);
            if (isEmpty) {
                handleCheckError("Chưa nhập thông tin mặt hàng");
            } else {
                handleCheckError(dataLang?.required_field_null);
            }
        } else {
            sErrWarehouse(false);
            sErrUnit(false);
            sErrQty(false);
            sOnSending(true);
        }
    };
    useEffect(() => {
        sErrDate(false);
    }, [date != null]);

    useEffect(() => {
        sErrBranch(false);
    }, [idBranch != null]);


    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const _ServerSending = async () => {
        let formData = new FormData();
        formData.append("code", code);
        formData.append("date", formatMoment(startDate, FORMAT_MOMENT.DATE_TIME_LONG));
        formData.append("branch_id", idBranch?.value);
        formData.append("note", note ?? "");
        listData.forEach((item, index) => {
            formData.append(`items[${index}][id]`, id ? item?.idParenBackend : "");
            formData.append(`items[${index}][item]`, item?.item?.value);
            item?.child?.forEach((childItem, childIndex) => {
                formData.append(`items[${index}][child][${childIndex}][row_id]`, id ? childItem?.idChildBackEnd : "");
                formData.append(`items[${index}][child][${childIndex}][unit]`, childItem?.unit?.value);
                formData.append(`items[${index}][child][${childIndex}][note]`, childItem?.note ? childItem?.note : "");
                formData.append(`items[${index}][child][${childIndex}][location_warehouses_id]`, childItem?.location?.value || 0);
                formData.append(`items[${index}][child][${childIndex}][quantity]`, childItem?.exportQuantity);
            });
        });
        try {
            const { isSuccess, message, item } = await apiProductionWarehouse.apiHangdingProductionWarehouse(id ? id : undefined, formData);
            if (isSuccess) {
                isShow("success", `${dataLang[message]}` || message);
                sCode("");
                sStartDate(new Date());
                sIdBranch(null);
                sNote("");
                sErrBranch(false);
                sErrDate(false);
                sListData([]);
                router.push(routerProductionWarehouse.home);
                sOnSending(false);
            } else {
                handleCheckError(`${dataLang[message]} ${item !== undefined && item !== null && item !== "" ? item : ""}`);
            }
        } catch (error) {
            throw error
        }
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    //new
    const _HandleAddChild = (parentId, value) => {
        sOnLoadingChild(true);
        const newData = listData?.map((e) => {
            if (e?.id === parentId) {
                const newChild = {
                    id: uuidv4(),
                    disabledDate:
                        (value?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "1" && false) ||
                        (value?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "0" && true) ||
                        (value?.e?.text_type === "products" && dataProductExpiry?.is_enable === "1" && false) ||
                        (value?.e?.text_type === "products" && dataProductExpiry?.is_enable === "0" && true),
                    location: null,
                    unit: null,
                    dataWarehouse: value?.e?.warehouse.map((e) => ({
                        label: e?.location_name,
                        value: e?.id,
                        warehouse_name: e?.warehouse_name,
                        qty: e?.quantity,
                    })),
                    dataUnit: value?.e?.unit.map((e) => ({
                        label: e?.unit,
                        value: e?.id,
                        coefficient: e?.coefficient,
                    })),
                    exportQuantity: null,
                    exchangeValue: null,
                    numberOfConversions: null,
                    note: "",
                    idChildBackEnd: null,
                };
                return { ...e, child: [...e.child, newChild] };
            } else {
                return e;
            }
        });
        setTimeout(() => {
            sOnLoadingChild(false);
        }, 500);

        sListData(newData);
    };

    const _HandleAddParent = (value) => {
        sOnLoadingChild(true);

        const checkData = listData?.some((e) => e?.item?.value === value?.value);

        if (!checkData) {
            const newData = {
                id: Date.now(),
                idParenBackend: null,
                item: value,
                child: [
                    {
                        idChildBackEnd: null,
                        id: uuidv4(),
                        disabledDate:
                            (value?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "1" && false) ||
                            (value?.e?.text_type === "material" && dataMaterialExpiry?.is_enable === "0" && true) ||
                            (value?.e?.text_type === "products" && dataProductExpiry?.is_enable === "1" && false) ||
                            (value?.e?.text_type === "products" && dataProductExpiry?.is_enable === "0" && true),
                        location: null,
                        dataWarehouse: value?.e?.warehouse.map((e) => ({
                            label: e?.location_name,
                            value: e?.id,
                            warehouse_name: e?.warehouse_name,
                            qty: e?.quantity,
                        })),
                        unit: {
                            label: value?.e?.unit[0].unit,
                            value: value?.e?.unit[0].id,
                            coefficient: value?.e?.unit[0].coefficient,
                        },
                        dataUnit: value?.e?.unit.map((e) => ({
                            label: e?.unit,
                            value: e?.id,
                            coefficient: e?.coefficient,
                        })),
                        exportQuantity: null,
                        exchangeValue: value?.e?.unit[0].coefficient,
                        numberOfConversions: null,
                        note: "",
                    },
                ],
            };
            setTimeout(() => {
                sOnLoadingChild(false);
            }, 500);
            sListData([newData, ...listData]);
        } else {
            handleCheckError(dataLang?.returns_err_ItemSelect || "returns_err_ItemSelect");
        }
    };

    const _HandleDeleteChild = (parentId, childId) => {
        const newData = listData.map((e) => {
            if (e.id === parentId) {
                const newChild = e.child?.filter((ce) => ce?.id !== childId);
                return { ...e, child: newChild };
            }
            return e;
        }).filter((e) => e.child?.length > 0);
        sListData([...newData]);
    };

    const _HandleDeleteAllChild = (parentId) => {
        const newData = listData.map((e) => {
            if (e.id === parentId) {
                const newChild = e.child?.filter((ce) => ce?.location !== null);
                return { ...e, child: newChild };
            }
            return e;
        }).filter((e) => e.child?.length > 0);
        sListData([...newData]);
    };

    const _HandleChangeChild = (parentId, childId, type, value) => {
        // Tạo một bản sao của listData để thay đổi
        const newData = [...listData];

        // Tìm vị trí của phần tử cần cập nhật trong mảng newData
        const parentIndex = newData.findIndex((e) => e.id === parentId);
        if (parentIndex !== -1) {
            const childIndex = newData[parentIndex].child.findIndex((ce) => ce.id === childId);
            if (childIndex !== -1) {
                // Thực hiện cập nhật dữ liệu tại vị trí tìm thấy
                const updatedChild = {
                    ...newData[parentIndex].child[childIndex],
                };
                if (type === "exportQuantity") {
                    const newSoluongxuat = Number(value?.value);
                    const newSoluongquydoi = newSoluongxuat / Number(updatedChild?.exchangeValue);
                    if (newSoluongquydoi > +updatedChild?.location?.qty) {
                        handleQuantityError(updatedChild?.location?.qty);
                        setTimeout(() => {
                            sLoad(true);
                        }, 500);
                        setTimeout(() => {
                            sLoad(false);
                        }, 1000);
                        updatedChild.exportQuantity = null;
                        updatedChild.numberOfConversions = null;
                    } else {
                        sLoad(false);
                        updatedChild.exportQuantity = newSoluongxuat;
                        updatedChild.numberOfConversions = newSoluongquydoi;
                    }
                } else if (type === "location") {
                    const checkKho = newData[parentIndex].child
                        .map((house) => house)
                        .some((i) => i?.location?.value === value?.value);
                    if (checkKho) {
                        handleCheckError("Kho đã được chọn");
                    } else {
                        updatedChild.location = value;
                    }
                } else if (type === "unit") {
                    updatedChild.unit = value;
                    updatedChild.exchangeValue = Number(value?.coefficient);
                } else if (type === "increase") {
                    if (updatedChild.location == null) {
                        handleCheckError("Vui lòng chọn kho trước");
                    } else if (updatedChild.unit == null) {
                        handleCheckError("Vui lòng chọn đơn vị tính trước");
                    } else if (
                        updatedChild.numberOfConversions == updatedChild.location?.qty ||
                        (id && updatedChild.numberOfConversions >= updatedChild.location?.qty)
                    ) {
                        handleQuantityError(updatedChild?.location?.qty);
                    } else {
                        updatedChild.exportQuantity = Number(updatedChild.exportQuantity) + 1;
                        updatedChild.numberOfConversions =
                            Number(updatedChild.exportQuantity) * Number(updatedChild.exchangeValue);
                    }
                } else if (type === "decrease") {
                    if (updatedChild.location == null) {
                        handleCheckError("Vui lòng chọn kho trước");
                    } else if (updatedChild.unit == null) {
                        handleCheckError("Vui lòng chọn đơn vị tính trước");
                    } else if (updatedChild.exportQuantity >= 2) {
                        updatedChild.exportQuantity = Number(updatedChild.exportQuantity) - 1;
                        updatedChild.numberOfConversions =
                            Number(updatedChild.exportQuantity) * Number(updatedChild.exchangeValue);
                    }
                } else if (type === "note") {
                    updatedChild.note = value?.target.value;
                }
                newData[parentIndex].child[childIndex] = updatedChild;
            }
        }
        sListData(newData);
    };

    const handleQuantityError = (e) => {
        isShow("error", `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(e)} số lượng tồn`);
        setTimeout(() => {
            sLoad(true);
        }, 500);
        setTimeout(() => {
            sLoad(false);
        }, 1000);
    };

    const _HandleChangeValue = (parentId, value) => {
        sOnLoadingChild(true);
        const checkData = listData?.some((e) => e?.item?.value === value?.value);
        if (!checkData) {
            const newData = listData?.map((e) => {
                if (e?.id === parentId) {
                    return {
                        ...e,
                        item: value,
                        child: [
                            {
                                idChildBackEnd: null,
                                id: uuidv4(),
                                location: null,
                                dataWarehouse: value?.e?.warehouse.map((e) => ({
                                    label: e?.location_name,
                                    value: e?.id,
                                    warehouse_name: e?.warehouse_name,
                                    qty: e?.quantity,
                                })),
                                disabledDate:
                                    (value?.e?.text_type === "material" &&
                                        dataMaterialExpiry?.is_enable === "1" &&
                                        false) ||
                                    (value?.e?.text_type === "material" &&
                                        dataMaterialExpiry?.is_enable === "0" &&
                                        true) ||
                                    (value?.e?.text_type === "products" &&
                                        dataProductExpiry?.is_enable === "1" &&
                                        false) ||
                                    (value?.e?.text_type === "products" &&
                                        dataProductExpiry?.is_enable === "0" &&
                                        true),
                                unit: {
                                    label: value?.e?.unit[0].unit,
                                    value: value?.e?.unit[0].id,
                                    coefficient: value?.e?.unit[0].coefficient,
                                },

                                dataUnit: value?.e?.unit.map((e) => ({
                                    label: e?.unit,
                                    value: e?.id,
                                    coefficient: e?.coefficient,
                                })),
                                exportQuantity: null,
                                exchangeValue: value?.e?.unit[0].coefficient,
                                numberOfConversions: null,
                                note: "",
                            },
                        ],
                    };
                } else {
                    return e;
                }
            });
            setTimeout(() => {
                sOnLoadingChild(false);
            }, 500);
            sListData([...newData]);
        } else {
            handleCheckError(dataLang?.returns_err_ItemSelect || "returns_err_ItemSelect");
        }
    };

    const handleCheckError = (e) => isShow("error", `${e}`);

    return (
        <React.Fragment>
            <Head>
                <title>{id ? dataLang?.production_warehouse_edit : dataLang?.production_warehouse_add}</title>
            </Head>
            <Container className={"!h-auto"}>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.production_warehouse || "production_warehouse"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>
                            {" "}
                            {id
                                ? dataLang?.production_warehouse_edit || "production_warehouse_edit"
                                : dataLang?.production_warehouse_add || "production_warehouse_add"}
                        </h6>
                    </div>
                )}
                <div className="h-[97%] space-y-3 overflow-hidden">
                    <div className="flex items-center justify-between">
                        <h2 className=" 2xl:text-lg text-base text-[#52575E] capitalize">
                            {id
                                ? dataLang?.production_warehouse_edit || "production_warehouse_edit"
                                : dataLang?.production_warehouse_add || "production_warehouse_add"}
                        </h2>
                        <div className="flex items-center justify-end mr-2">
                            <ButtonBack
                                onClick={() => router.push(routerProductionWarehouse.home)}
                                dataLang={dataLang}
                            />
                        </div>
                    </div>

                    <div className="w-full rounded ">
                        <div className="">
                            <h2 className="font-normal bg-[#ECF0F4] p-2">
                                {dataLang?.purchase_order_detail_general_informatione ||
                                    "purchase_order_detail_general_informatione"}
                            </h2>
                            <div className="grid items-center grid-cols-8 gap-3 mt-2">
                                <div className="col-span-2">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.import_code_vouchers || "import_code_vouchers"}{" "}
                                    </label>
                                    <input
                                        value={code}
                                        onChange={_HandleChangeInput.bind(this, "code")}
                                        name="fname"
                                        type="text"
                                        placeholder={
                                            dataLang?.purchase_order_system_default || "purchase_order_system_default"
                                        }
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
                                            selected={startDate}
                                            onSelect={(date) => sStartDate(date)}
                                            onChange={(e) => handleTimeChange(e)}
                                            placeholderText="DD/MM/YYYY HH:mm:ss"
                                            dateFormat="dd/MM/yyyy h:mm:ss aa"
                                            timeInputLabel={"Time: "}
                                            placeholder={
                                                dataLang?.price_quote_system_default || "price_quote_system_default"
                                            }
                                            className={`border ${errDate ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                } placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer `}
                                        />
                                        {startDate && (
                                            <>
                                                <MdClear
                                                    className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                                                    onClick={() => handleClearDate("startDate")}
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
                                        value={idBranch}
                                        isClearable={true}
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={dataLang?.import_branch || "import_branch"}
                                        noOptionsMessage={() => dataLang?.returns_nodata || "returns_nodata"}
                                        className={`${errBranch ? "border-red-500" : "border-transparent"
                                            } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
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
                                                zIndex: 9999, // Giá trị z-index tùy chỉnh
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
                                    {errBranch && (
                                        <label className="text-sm text-red-500">
                                            {dataLang?.purchase_order_errBranch || "purchase_order_errBranch"}
                                        </label>
                                    )}
                                </div>
                                <div className="col-span-2 ">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.production_warehouse_LSX || "production_warehouse_LSX"}
                                    </label>
                                    <SelectCore
                                        options={[]}
                                        onChange={_HandleChangeInput.bind(this, "")}
                                        value={""}
                                        isClearable={true}
                                        noOptionsMessage={() => dataLang?.returns_nodata || "returns_nodata"}
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={dataLang?.production_warehouse_LSX || "production_warehouse_LSX"}
                                        className={`${"border-transparent"} placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
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
                                                zIndex: 9999, // Giá trị z-index tùy chỉnh
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
                            <div className="grid grid-cols-8">
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-2   text-center  truncate font-[400]">
                                    {dataLang?.production_warehouse_location || "production_warehouse_location"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                    {"ĐVT"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                    {dataLang?.production_warehouse_export_quantity || "production_warehouse_export_quantity"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                    {dataLang?.production_warehouse_exchange_value || "production_warehouse_exchange_value"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                    {dataLang?.production_warehouse_amount_of_conversion || "production_warehouse_amount_of_conversion"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                    {dataLang?.production_warehouse_note || "production_warehouse_note"}
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
                                onChange={_HandleAddParent.bind(this)}
                                className="col-span-2 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]"
                                placeholder={dataLang?.returns_items || "returns_items"}
                                noOptionsMessage={() => dataLang?.returns_nodata || "returns_nodata"}
                                menuPortalTarget={document.body}
                                formatOptionLabel={(option) => (
                                    <div className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-[40px] h-h-[60px]">
                                                {option.e?.images != null ? (
                                                    <img
                                                        src={option.e?.images}
                                                        alt="Product Image"
                                                        className="max-w-[30px] h-[40px] text-[8px] object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className=" w-[30px] h-[40px] object-cover  flex items-center justify-center rounded">
                                                        <img
                                                            src="/nodata.png"
                                                            alt="Product Image"
                                                            className="w-[30px] h-[30px] object-cover rounded"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                    {option.e?.name}
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
                                                <div className="flex items-center gap-2 italic">
                                                    {dataProductSerial.is_enable === "1" && (
                                                        <div className="text-[11px] text-[#667085] font-[500]">
                                                            Serial: {option.e?.serial ? option.e?.serial : "-"}
                                                        </div>
                                                    )}
                                                    {dataMaterialExpiry.is_enable === "1" || dataProductExpiry.is_enable === "1" ? (
                                                        <>
                                                            <div className="text-[11px] text-[#667085] font-[500]">
                                                                Lot: {option.e?.lot ? option.e?.lot : "-"}
                                                            </div>
                                                            <div className="text-[11px] text-[#667085] font-[500]">
                                                                Date:{" "}
                                                                {option.e?.expiration_date ? formatMoment(option.e?.expiration_date, FORMAT_MOMENT.DATE_SLASH_LONG) : "-"}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                            <div className="grid grid-cols-8 border-t border-b border-l border-r divide-x">
                                <div className="col-span-2">
                                    <SelectCore
                                        classNamePrefix="customDropdowDefault"
                                        placeholder={dataLang?.production_warehouse_location || 'production_warehouse_location'}
                                        className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]"
                                        isDisabled={true}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <SelectCore
                                        classNamePrefix="customDropdowDefault"
                                        placeholder={dataLang?.production_warehouse_unit || "production_warehouse_unit"}
                                        className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]"
                                        isDisabled={true}
                                    />
                                </div>
                                <div className="flex items-center justify-center col-span-1">
                                    <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full">
                                        <Minus className="scale-50 2xl:scale-100 xl:scale-100" size="16" />
                                    </button>
                                    <div className=" text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]  3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal  focus:outline-none border-b w-full border-gray-200">
                                        1
                                    </div>
                                    <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full">
                                        <Add className="scale-50 2xl:scale-100 xl:scale-100" size="16" />
                                    </button>
                                </div>

                                <div className="col-span-1 text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium pr-3 text-black flex items-center justify-center">
                                    0
                                </div>
                                <div className="col-span-1 text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium pr-3 text-black  flex items-center justify-center">
                                    1
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
                            {isFetching ? (
                                <Loading className="w-full h-10" color="#0f4f9e" />
                            ) : (
                                <>
                                    {listData?.map((e) => (
                                        <div
                                            key={e?.id?.toString()}
                                            className="grid items-start grid-cols-12 gap-1 my-1"
                                        >
                                            <div className="h-full col-span-3 p-2 pb-1 border border-r">
                                                <div className="relative mt-5">
                                                    <SelectCore
                                                        options={dataItems}
                                                        value={e?.item}
                                                        className=""
                                                        onChange={_HandleChangeValue.bind(this, e?.id)}
                                                        menuPortalTarget={document.body}
                                                        formatOptionLabel={(option) => (
                                                            <div className="flex items-center justify-between py-2">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-[40px] h-h-[60px]">
                                                                        {option.e?.images != null ? (
                                                                            <img
                                                                                src={option.e?.images}
                                                                                alt="Product Image"
                                                                                className="max-w-[30px] h-[40px] text-[8px] object-cover rounded"
                                                                            />
                                                                        ) : (
                                                                            <div className=" w-[30px] h-[40px] object-cover  flex items-center justify-center rounded">
                                                                                <img
                                                                                    src="/nodata.png"
                                                                                    alt="Product Image"
                                                                                    className="w-[30px] h-[30px] object-cover rounded"
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                            {option.e?.name}
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
                                                                        <div className="flex items-center gap-2 italic">
                                                                            {dataProductSerial.is_enable === "1" && (
                                                                                <div className="text-[11px] text-[#667085] font-[500]">
                                                                                    Serial:{" "}
                                                                                    {option.e?.serial
                                                                                        ? option.e?.serial
                                                                                        : "-"}
                                                                                </div>
                                                                            )}
                                                                            {dataMaterialExpiry.is_enable === "1" ||
                                                                                dataProductExpiry.is_enable === "1" ? (
                                                                                <>
                                                                                    <div className="text-[11px] text-[#667085] font-[500]">
                                                                                        Lot:{" "}
                                                                                        {option.e?.lot
                                                                                            ? option.e?.lot
                                                                                            : "-"}
                                                                                    </div>
                                                                                    <div className="text-[11px] text-[#667085] font-[500]">
                                                                                        Date:{" "}
                                                                                        {option.e?.expiration_date
                                                                                            ? formatMoment(option.e?.expiration_date, FORMAT_MOMENT.DATE_SLASH_LONG) : "-"}
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        noOptionsMessage={() =>
                                                            dataLang?.returns_nodata || "returns_nodata"
                                                        }
                                                        classNamePrefix="customDropdow"
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
                                                    <button
                                                        onClick={_HandleAddChild.bind(this, e?.id, e?.item)}
                                                        className="absolute flex flex-col items-center justify-center w-10 h-10 transition ease-in-out rounded bg-slate-100 -top-5 right-5 hover:rotate-45 hover:bg-slate-200 hover:scale-105 hover:text-red-500"
                                                    >
                                                        <Add className="" />
                                                    </button>
                                                </div>
                                                {e?.child?.filter((e) => e?.location == null)?.length >= 2 && (
                                                    <button
                                                        onClick={_HandleDeleteAllChild.bind(this, e?.id, e?.item)}
                                                        className="w-full rounded mt-1.5 px-5 py-1 overflow-hidden group bg-rose-500 relative hover:bg-gradient-to-r hover:from-rose-500 hover:to-rose-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-rose-400 transition-all ease-out duration-300"
                                                    >
                                                        <span className="absolute right-0 w-full h-full -mt-8 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                                                        <span className="relative text-xs">
                                                            Xóa {e?.child?.filter((e) => e?.location == null)?.length}{" "} hàng chưa chọn kho
                                                        </span>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="items-center col-span-9">
                                                <div className="grid grid-cols-8  3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] border-b divide-x divide-y border-r">
                                                    {load ? (
                                                        <Loading className="h-2 col-span-8" color="#0f4f9e" />
                                                    ) : (
                                                        e?.child?.map((ce, index) => (
                                                            <React.Fragment key={ce?.id?.toString()}>
                                                                <div className="flex flex-col justify-center h-full col-span-2 p-1 border-t border-l">
                                                                    <SelectCore
                                                                        options={ce?.dataWarehouse}
                                                                        value={ce?.location}
                                                                        isLoading={ce?.location != null ? false : onLoadingChild}
                                                                        onChange={_HandleChangeChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id,
                                                                            "location"
                                                                        )}
                                                                        className={`${errWarehouse && ce?.location == null
                                                                            ? "border-red-500 border"
                                                                            : ""
                                                                            }  my-1 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] placeholder:text-slate-300 w-full  rounded text-[#52575E] font-normal `}
                                                                        noOptionsMessage={() => dataLang?.returns_nodata || "returns_nodata"}
                                                                        menuPortalTarget={document.body}
                                                                        placeholder={dataLang?.production_warehouse_location || 'production_warehouse_location'}
                                                                        formatOptionLabel={(option) => {
                                                                            return (
                                                                                (option?.warehouse_name ||
                                                                                    option?.label) && (
                                                                                    <div className="z-[999]">
                                                                                        <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] z-[999]">
                                                                                            {dataLang?.import_Warehouse || "import_Warehouse"}  : {option?.warehouse_name}
                                                                                        </h2>
                                                                                        <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] z-[999]">
                                                                                            {option?.label}
                                                                                        </h2>
                                                                                        <div className="flex gap-1">
                                                                                            {
                                                                                                <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium">
                                                                                                    {dataLang?.returns_survive || "returns_survive"}
                                                                                                    :
                                                                                                </h2>
                                                                                            }
                                                                                            <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] uppercase font-semibold">
                                                                                                {formatNumber(option?.qty)}
                                                                                            </h2>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            );
                                                                        }}
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
                                                                        classNamePrefix="customDropdow"
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col items-center justify-center h-full p-1 ">
                                                                    <SelectCore
                                                                        options={ce?.dataUnit}
                                                                        value={ce?.unit}
                                                                        isLoading={
                                                                            ce?.unit == null ? onLoadingChild : false
                                                                        }
                                                                        onChange={_HandleChangeChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id,
                                                                            "unit"
                                                                        )}
                                                                        noOptionsMessage={() =>
                                                                            dataLang?.returns_nodata || "returns_nodata"
                                                                        }
                                                                        placeholder={
                                                                            dataLang?.production_warehouse_unit ||
                                                                            "production_warehouse_unit"
                                                                        }
                                                                        className={`${errUnit && ce?.unit == null
                                                                            ? "border-red-500 border"
                                                                            : ""
                                                                            }  my-1 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] placeholder:text-slate-300 w-full  rounded text-[#52575E] font-normal`}
                                                                        menuPortalTarget={document.body}
                                                                        style={{
                                                                            border: "none",
                                                                            boxShadow: "none",
                                                                            outline: "none",
                                                                        }}
                                                                        formatOptionLabel={(option) => (
                                                                            <div className="flex flex-wrap items-center justify-start">
                                                                                <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] w-full ">
                                                                                    {dataLang?.production_warehouse_unit ||
                                                                                        "production_warehouse_unit"}
                                                                                    : {option?.label}
                                                                                </h2>
                                                                                <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] ">
                                                                                    {`${dataLang?.production_warehouse_exchange_value ||
                                                                                        "production_warehouse_exchange_value"
                                                                                        }: (${option?.coefficient})`}
                                                                                </h2>
                                                                            </div>
                                                                        )}
                                                                        theme={(theme) => ({
                                                                            ...theme,
                                                                            colors: {
                                                                                ...theme.colors,
                                                                                primary25: "#EBF5FF",
                                                                                primary50: "#92BFF7",
                                                                                primary: "#0F4F9E",
                                                                            },
                                                                        })}
                                                                        classNamePrefix="customDropdow"
                                                                    />
                                                                </div>
                                                                <div className="flex items-center justify-center  h-full p-0.5">
                                                                    <button
                                                                        className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full"
                                                                        onClick={_HandleChangeChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id,
                                                                            "decrease"
                                                                        )}
                                                                    >
                                                                        <Minus
                                                                            className="scale-50 2xl:scale-100 xl:scale-100"
                                                                            size="16"
                                                                        />
                                                                    </button>

                                                                    <InPutNumericFormat
                                                                        placeholder={
                                                                            (ce?.location == null ||
                                                                                ce?.unit == null) &&
                                                                            "Chọn kho và Đvt trước"
                                                                        }
                                                                        disabled={
                                                                            ce?.location == null || ce?.unit == null
                                                                        }
                                                                        className={`${errQty &&
                                                                            (ce?.exportQuantity == null ||
                                                                                ce?.exportQuantity == "" ||
                                                                                ce?.exportQuantity == 0)
                                                                            ? "border-red-500 border-b"
                                                                            : ""
                                                                            }
                                                                            ${(ce?.exportQuantity == null ||
                                                                                ce?.exportQuantity == "" ||
                                                                                ce?.exportQuantity == 0) &&
                                                                            "border-b border-red-500"
                                                                            }
                                                                            placeholder:3xl:text-[11px] placeholder:xxl:text-[9px] placeholder:2xl:text-[8.5px] placeholder:xl:text-[7px] placeholder:lg:text-[6.3px] placeholder:text-[10px] appearance-none text-center  3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-1 font-normal w-full focus:outline-none border-b border-gray-200 disabled:bg-transparent`}
                                                                        onValueChange={_HandleChangeChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id,
                                                                            "exportQuantity"
                                                                        )}
                                                                        value={ce?.exportQuantity}
                                                                        isAllowed={isAllowedNumber}
                                                                    />

                                                                    <button
                                                                        className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full"
                                                                        onClick={_HandleChangeChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id,
                                                                            "increase"
                                                                        )}
                                                                    >
                                                                        <Add
                                                                            className="scale-50 2xl:scale-100 xl:scale-100"
                                                                            size="16"
                                                                        />
                                                                    </button>
                                                                </div>
                                                                <div className="justify-center pr-1  p-0.5 h-full flex flex-col items-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                    {ce?.exchangeValue}
                                                                </div>
                                                                <div className="justify-center pr-1  p-0.5 h-full flex flex-col items-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                    {formatNumber(
                                                                        ce?.exportQuantity / ce?.exchangeValue || 0
                                                                    )}{" "}
                                                                    {ce?.unit?.label}
                                                                </div>
                                                                <div className="col-span-1 flex items-center justify-center  h-full p-0.5">
                                                                    <input
                                                                        value={ce?.note}
                                                                        onChange={_HandleChangeChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id,
                                                                            "note"
                                                                        )}
                                                                        placeholder="Ghi chú"
                                                                        type="text"
                                                                        className="  placeholder:text-slate-300  w-full bg-white rounded-[5.5px] text-[#52575E] font-normal p-2 outline-none"
                                                                    />
                                                                </div>
                                                                <div className=" h-full p-0.5 flex flex-col items-center justify-center">
                                                                    <button
                                                                        title="Xóa"
                                                                        onClick={_HandleDeleteChild.bind(
                                                                            this,
                                                                            e?.id,
                                                                            ce?.id
                                                                        )}
                                                                        className="flex flex-col items-center justify-center p-2 text-red-500 transition-all ease-linear rounded-md hover:scale-110 bg-red-50 hover:bg-red-200 animate-bounce-custom"
                                                                    >
                                                                        <IconDelete />
                                                                    </button>
                                                                </div>
                                                            </React.Fragment>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                    <h2 className="font-normal bg-[white]  p-2 border-b border-b-[#a9b5c5]  border-t border-t-[#a9b5c5]">
                        {dataLang?.purchase_total || "purchase_total"}
                    </h2>
                </div>
                <div className="grid grid-cols-12">
                    <div className="col-span-9">
                        <div className="text-[#344054] font-normal text-sm mb-1 ">
                            {dataLang?.returns_reason || "returns_reason"}
                        </div>
                        <textarea
                            value={note}
                            placeholder={dataLang?.returns_reason || "returns_reason"}
                            onChange={_HandleChangeInput.bind(this, "note")}
                            name="fname"
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-[40%] min-h-[220px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 max-h-[220px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none "
                        />
                    </div>
                    <div className="flex-col justify-between col-span-3 mt-5 space-y-4 text-right ">
                        <div className="flex justify-between "></div>
                        <div className="flex justify-between ">
                            <div className="font-normal">
                                <h3>{dataLang?.production_warehouse_totalItem || "production_warehouse_totalItem"}</h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">{formatNumber(listData?.length)}</h3>
                            </div>
                        </div>
                        <div className="flex justify-between ">
                            <div className="font-normal">
                                <h3>{dataLang?.production_warehouse_totalEx || "production_warehouse_totalEx"}</h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">
                                    {formatNumber(
                                        listData?.reduce((total, item) => {
                                            item?.child?.forEach((childItem) => {
                                                if (
                                                    childItem.exportQuantity !== undefined &&
                                                    childItem.exportQuantity !== null
                                                ) {
                                                    total += childItem.exportQuantity;
                                                }
                                            });
                                            return total;
                                        }, 0)
                                    )}
                                </h3>
                            </div>
                        </div>
                        <div className="space-x-2">
                            <ButtonBack
                                onClick={() => router.push(routerProductionWarehouse.home)}
                                dataLang={dataLang}
                            />
                            <ButtonSubmit onClick={_HandleSubmit.bind(this)} dataLang={dataLang} loading={onSending} />
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
                save={resetValue}
                nameModel={"change_item"}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment>
    );
};

export default ProductionWarehouseForm;
