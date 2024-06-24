import { SearchNormal1 } from "iconsax-react";
import React, { useEffect, useState } from "react";
import { v4 as uddid } from "uuid";

import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import Zoom from "@/components/UI/zoomElement/zoomElement";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";

import { _ServerInstance as Axios } from "/services/axios";

import FilterHeader from "../header/filterHeader";

// const TabItem = dynamic(() => import("./tabItem"), { ssr: false });
import TabItem from "./tabItem";

// const TabPlan = dynamic(() => import("./tabPlan"), { ssr: false });
import TabPlan from "./tabPlan";

// const TabKeepStock = dynamic(() => import("./tabKeepStock"), { ssr: false });
import TabKeepStock from "./tabKeepStock";

import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import TagBranch from "@/components/UI/common/tag/TagBranch";
import { CONFIRM_DELETION, TITLE_DELETE_COMMAND } from "@/constants/delete/deleteTable";
import { formatMoment } from "@/utils/helpers/formatMoment";
import { debounce } from "lodash";
import { MdAdd } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import PopupKeepStock from "../popup/popupKeepStock";
import PopupPurchase from "../popup/popupPurchase";
import apiMaterialsPlanning from "@/Api/apiManufacture/manufacture/materialsPlanning/apiMaterialsPlanning";
import apiComons from "@/Api/apiComon/apiComon";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";

const MainTable = ({ dataLang }) => {
    const arrButton = [
        {
            id: 1,
            name: dataLang?.salesOrder_keep_stock || "salesOrder_keep_stock",
            icon: <MdAdd className="text-base text-blue-600" />,
        },
        {
            id: 2,
            name: dataLang?.materials_planning_add_purchase || "materials_planning_add_purchase",
            icon: <MdAdd className="text-base text-blue-600" />,
            // icon: "/materials_planning/add.png",
        },
        {
            id: 3,
            name: dataLang?.materials_planning_delete || "materials_planning_delete",
            icon: <RiDeleteBin5Line className="text-base text-red-600" />,
            // icon: "/materials_planning/delete.png",
        },
    ];

    const listTab = [
        {
            id: uddid(),
            name: dataLang?.materials_planning_items || "materials_planning_items",
            type: "item",
        },
        {
            id: uddid(),
            name: dataLang?.materials_planning_plan || "materials_planning_plan",
            type: "plan",
        },
        {
            id: uddid(),
            name: dataLang?.materials_planning_keep_stock || "materials_planning_keep_stock",
            type: "keepStock",
        },
    ];

    const isShow = useToast();

    const initialState = {
        isTab: "item",
        countAll: 0,
        listDataLeft: [],
        listDataRight: {
            title: "",
            dataPPItems: [],
            dataBom: {
                materialsBom: [],
                productsBom: [],
            },
            dataKeepStock: [],
            dataPurchase: [],
        },
        next: null,
    };

    const initialValue = {
        page: 1,
        limit: 15,
        search: "",
        dateStart: null,
        dateEnd: null,
        listOrders: [],
        listPlan: [],
        valueOrder: null,
        valuePlan: null,
        listBr: [],
        valueBr: null,
    };

    const { isOpen, isId, handleQueryId, isIdChild } = useToggle();

    const [dataTable, sDataTable] = useState(initialState);

    const [isValue, sIsValue] = useState(initialValue);

    const [isMounted, sIsMounted] = useState(false);

    const queryState = (key) => sDataTable((prve) => ({ ...prve, ...key }));

    const queryValue = (key) => sIsValue((prve) => ({ ...prve, ...key }));

    const [isFetching, sIsFetChing] = useState(false);

    useEffect(() => {
        sIsMounted(true);
    }, []);

    const convertArrData = (arr) => {
        const newData = arr?.map((e, index) => {
            return {
                id: e?.id,
                title: e?.reference_no,
                time: formatMoment(e?.date, FORMAT_MOMENT.DATE_SLASH_LONG),
                name: e?.created_by_full_name,
                nameBranch: e?.name_branch,
                productionOrder: [],
                followUp: e?.listObject?.map((i) => {
                    return {
                        id: i?.pp_id,
                        nameFollow: i?.reference_no,
                        typeFollow: i?.object_type == 1 ? "Đơn hàng" : "Kế hoạch nội bộ",
                    };
                }),
                note: "",
            };
        });
        return newData;
    };

    const params = {
        date_start: isValue.dateStart ? formatMoment(isValue.dateStart, FORMAT_MOMENT.DATE_SLASH_LONG) : "",
        date_end: isValue.dateEnd ? formatMoment(isValue.dateEnd, FORMAT_MOMENT.DATE_SLASH_LONG) : "",
        search: isValue.search == "" ? "" : isValue.search,
        orders_id: [isValue.valueOrder?.value]?.length > 0 ? [isValue.valueOrder?.value].map((e) => e) : "",
        internal_plans_id: [isValue.valuePlan?.value]?.length > 0 ? [isValue.valuePlan?.value].map((e) => e) : "",
        branch_id: isValue.valueBr?.value || "",
    };

    const fetchDataTable = async (page) => {
        const { data } = await apiMaterialsPlanning.apiProductionPlans(page, isValue.limit, { params: params });
        const arrayItem = convertArrData(data?.productionPlans);
        queryState({
            countAll: data?.countAll,
            listDataLeft: arrayItem.map((e, index) => {
                return {
                    ...e,
                    showParent: index == 0,
                };
            }),
            next: data?.next == 1,
        });
        if (isValue.search == "" && arrayItem[0]?.id) {
            fetchDataTableRight(arrayItem[0]?.id);
        }
        if (data?.productionPlans?.length == 0) {
            queryState({
                listDataRight: {
                    ...dataTable.listDataRight,
                    title: null,
                    dataPPItems: [],
                    dataBom: {
                        productsBom: [],
                        materialsBom: [],
                    },
                    dataKeepStock: [],
                    dataPurchases: [],
                },
            });
        }
    };

    useEffect(() => {
        if (isMounted) {
            fetchDataTable(isValue.page);
        }
    }, [
        isValue.search,
        isValue.dateStart,
        isValue.dateEnd,
        isValue.valueOrder,
        isValue.valuePlan,
        isValue.valueBr,
        isMounted,
    ]);

    const fetchDataTableSeeMore = async () => {
        const { data } = await apiMaterialsPlanning.apiProductionPlans(isValue.page, isValue.limit, { params: params });
        const item = convertArrData(data?.productionPlans);
        let arrayItem = [...dataTable.listDataLeft, ...item];
        queryState({
            countAll: data?.countAll,
            listDataLeft: arrayItem.map((e, index) => {
                return {
                    ...e,
                    showParent: index == 0,
                };
            }),
            next: data?.next == 1,
        });
        if (isValue.search == "" && arrayItem[0]?.id) {
            fetchDataTableRight(arrayItem[0]?.id);
        }
        if (data?.productionPlans?.length == 0) {
            queryState({
                listDataRight: {
                    ...dataTable.listDataRight,
                    title: null,
                    dataPPItems: [],
                    dataBom: {
                        productsBom: [],
                        materialsBom: [],
                    },
                    dataKeepStock: [],
                    dataPurchases: [],
                },
            });
        }
    };

    useEffect(() => {
        if (isValue.page != 1) {
            fetchDataTableSeeMore();
        }
    }, [isValue.page]);

    const fetchDataTableRight = async (id) => {
        const { data, isSuccess } = await apiMaterialsPlanning.apiDetailProductionPlans(id);
        if (isSuccess == 1) {
            queryState({
                listDataRight: {
                    title: data?.productionPlan?.reference_no,
                    idCommand: data?.productionPlan?.id,
                    dataPPItems: data?.listPPItems?.map((e) => {
                        return {
                            id: e?.object_id,
                            title: e?.reference_no,
                            showChild: true,
                            arrListData: e?.items?.map((i) => {
                                return {
                                    id: uddid(),
                                    image: i?.images ? i?.images : "/no_img.png",
                                    name: i?.item_name,
                                    itemVariation: i?.product_variation,
                                    code: i?.item_code,
                                    quantity: +i?.quantity,
                                    unit: i?.unit_name,
                                    timeline: {
                                        start: formatMoment(i?.timeline_start, FORMAT_MOMENT.DATE_SLASH_LONG),
                                        end: formatMoment(i?.timeline_end, FORMAT_MOMENT.DATE_SLASH_LONG),
                                    },
                                };
                            }),
                        };
                    }),
                    dataBom: {
                        productsBom: data?.listBom?.productsBom?.map((e) => {
                            return {
                                id: e?.item_id,
                                name: e?.item_name,
                                image: e?.images ? e?.images : "/no_img.png",
                                unit: e?.unit_name,
                                use: e?.total_quota, //sl sử dụng
                                exist: e?.quantity_warehouse, //sl tồn
                                lack: e?.quantity_rest, //sl thiếu
                                code: e?.item_code,
                                itemVariation: e?.item_variation,
                                quantityKeep: e?.quantity_keep, //sl đã giữ
                            };
                        }),
                        materialsBom: data?.listBom?.materialsBom?.map((e) => {
                            return {
                                id: e?.item_id,
                                name: e?.item_name,
                                image: e?.images ? e?.images : "/no_img.png",
                                unit: e?.unit_name,
                                use: e?.total_quota, //sl sử dụng
                                exchange: e?.quota_primary, //sl quy đổi
                                exist: e?.quantity_warehouse, //sl tồn
                                lack: e?.quantity_rest, //sl thiếu
                                code: e?.item_code,
                                itemVariation: e?.item_variation,
                                quantityKeep: e?.quantity_keep, //sl đã giữ
                            };
                        }),
                    },
                    dataKeepStock: data?.keepWarehouses?.map((e) => {
                        return {
                            id: e?.id,
                            title: e?.code,
                            time: formatMoment(e?.date, FORMAT_MOMENT.DATE_SLASH_LONG),
                            user: e?.created_by_name,
                            warehousemanId: e?.warehouseman_id,
                            warehouseFrom: e?.name_w_from,
                            warehouseTo: e?.name_w_to,
                            arrListData: e?.items?.map((i) => {
                                return {
                                    id: i?.id_transfer,
                                    image: i?.images ? i?.images : "/no_img.png",
                                    name: i?.item_name,
                                    quantity: i?.quantity_net,
                                    unit: i?.unit_name,
                                    lot: i?.lot,
                                    expiration_date: i?.expiration_date,
                                    serial: i?.serial,
                                    code: i?.item_code,
                                    itemVariation: i?.item_variation,
                                    locationFrom: i?.name_location_from,
                                    locationTo: i?.name_location_to,
                                };
                            }),
                        };
                    }),
                    dataPurchases: data?.purchases?.map((e) => {
                        return {
                            id: e?.id,
                            title: e?.code,
                            time: formatMoment(e?.date, FORMAT_MOMENT.DATE_SLASH_LONG),
                            user: e?.created_by_name,
                            status: e?.status,
                            arrListData: e?.items?.map((i) => {
                                return {
                                    id: i?.id_transfer,
                                    image: i?.images ? i?.images : "/no_img.png",
                                    name: i?.item_name,
                                    quantity: i?.quantity_net,
                                    unit: i?.unit_name,
                                    lot: i?.lot,
                                    expiration_date: i?.expiration_date,
                                    serial: i?.serial,
                                    code: i?.item_code,
                                    itemVariation: i?.item_variation,
                                    processBar: [
                                        {
                                            id: uddid(),
                                            active: i?.quantity_order && i?.quantity_order > 0 ? true : false,
                                            title: "Đặt hàng",
                                            quantity: i?.quantity_order,
                                        },
                                        {
                                            id: uddid(),
                                            active: i?.quantity_import && i?.quantity_import > 0 ? true : false,
                                            title: "Nhập hàng",
                                            quantity: i?.quantity_import,
                                        },
                                    ],
                                };
                            }),
                        };
                    }),
                },
            });
        }
    };

    const fetDataOrder = debounce(async (value) => {
        const { data } = await apiMaterialsPlanning.apiSearchOrders({ params: { search: value } });
        if (data?.items) {
            queryValue({
                listOrders: data?.items?.map((e) => {
                    return {
                        value: e?.id,
                        label: e?.reference_no,
                    };
                }),
            });
        }
    }, 500);

    const fetchDataPlan = debounce(async (value) => {
        const { data } = await apiMaterialsPlanning.apiSearchInternalPlans({ params: { search: value } });
        if (data?.items) {
            queryValue({
                listPlan: data?.items?.map((e) => {
                    return {
                        value: e?.id,
                        label: e?.reference_no,
                    };
                }),
            });
        }
    }, 500);

    const fetchDataBranch = debounce(async (value) => {
        const { result } = await apiComons.apiBranchCombobox();
        queryValue({ listBr: result?.map((e) => ({ label: e?.name, value: e?.id })) || [] });
    }, 500);

    useEffect(() => {
        if (isMounted) {
            fetDataOrder();
            fetchDataPlan();
            fetchDataBranch();
        }
    }, [isMounted]);

    const handleShow = (id) => {
        queryState({
            listDataLeft: dataTable.listDataLeft.map((e) => {
                // const showParent = e.id == id ? !e.showParent : false;
                const showParent = e.id == id;
                // if (showParent) {
                //     fetchDataTableRight(id);
                // } else {
                //     queryState({
                //         listDataRight: {
                //             ...dataTable.listDataRight,
                //             title: null,
                //             dataPPItems: [],
                //             dataBom: {
                //                 productsBom: [],
                //                 materialsBom: [],
                //             },
                //             dataKeepStock: [],
                //             dataPurchase: [],
                //         },
                //     });
                // }
                showParent && fetchDataTableRight(id);
                return {
                    ...e,
                    showParent: showParent,
                };
            }),
        });
        fetchingData();
    };

    const handleActiveTab = (e) => {
        queryState({ isTab: e });
        fetchingData();
    };

    const fetchingData = () => {
        sIsFetChing(true);
        setTimeout(() => {
            sIsFetChing(false);
        }, 1500);
    };

    const handleConfim = async () => {
        const { isSuccess, message } = await apiMaterialsPlanning.apiDeleteProductionPlans(isId);
        if (isSuccess == 1) {
            fetchDataTable();
            isShow("success", `${dataLang[message] || message}`);
        } else {
            isShow("error", `${dataLang[message] || message}`);
        }
        handleQueryId({ status: false });
    };

    const handShowItem = (id, type) => {
        queryState({
            listDataRight: {
                ...dataTable.listDataRight,
                [type]: dataTable.listDataRight?.[type]?.map((e) => {
                    if (e.id == id) {
                        return {
                            ...e,
                            showChild: !e.showChild,
                        };
                    }
                    return e;
                }),
            },
        });
    };

    const onChangeSearch = debounce((e) => {
        queryValue({ search: e.target.value, page: 1 });
    }, 500);

    const handDeleteItem = (id, type) => {
        queryValue({ page: 1 });
        handleQueryId({ status: true, id: id, idChild: type });
    };

    const handleConfimDeleteItem = async () => {
        const type = {
            dataKeepStock: `/api_web/Api_transfer/transfer/${isId}?csrf_protection=true`,
            dataPurchases: `/api_web/Api_purchases/purchases/${isId}?csrf_protection=true`,
        };
        const { isSuccess, message } = await apiMaterialsPlanning.apiDeletePurchasesTransfer(type[isIdChild]);
        if (isSuccess) {
            fetchDataTable(1);
            queryValue({ page: 1 });
            isShow("success", dataLang[message] || message);
        } else {
            isShow("error", dataLang[message] || message);
        }
        handleQueryId({ status: false });
    };

    const shareProps = {
        dataTable,
        dataLang,
        filterItem: () => { },
        handShowItem,
        handDeleteItem,
        isFetching,
        isValue,
        queryValue,
        fetDataOrder,
        fetchDataPlan,
        fetchDataTable,
    };

    if (!isMounted) return null;

    return (
        <React.Fragment>
            <FilterHeader {...shareProps} />
            <div className="!mt-[14px]">
                <h1 className="text-[#141522] font-medium text-sm my-2">
                    {dataLang?.materials_planning_total_nvl || "materials_planning_total_nvl"}: {dataTable?.countAll}
                </h1>
                <div className="flex ">
                    <div className="w-[20%] border-r-0 border-[#d8dae5] border">
                        <div className="border-b py-2 px-1 flex items-center justify-center bg-[#D0D5DD]/20 ">
                            <form className="flex items-center relative  w-full">
                                <SearchNormal1
                                    size={20}
                                    className="absolute 2xl:left-3 z-10 text-[#cccccc] xl:left-[4%] left-[1%]"
                                />
                                <input
                                    onChange={(e) => onChangeSearch(e)}
                                    className="relative border border-[#d8dae5] bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] 2xl:text-left 2xl:pl-10 xl:pl-0 p-0 2xl:py-1.5 py-2.5 rounded-md 2xl:text-base text-xs xl:text-center text-center 2xl:w-full xl:w-full w-[100%]"
                                    type="text"
                                    placeholder={dataLang?.materials_planning_find_nvl || "materials_planning_find_nvl"}
                                />
                            </form>
                        </div>
                        <Customscrollbar className="3xl:h-[65vh] xxl:h-[52vh] 2xl:h-[56.5vh] xl:h-[52.5vh] lg:h-[55vh] h-[35vh] overflow-y-auto  scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 ">
                            {dataTable.listDataLeft.map((e, eIndex) => (
                                <div
                                    key={e.id}
                                    onClick={() => handleShow(e.id)}
                                    className={`py-2 pl-2 pr-3 ${e.showParent && "bg-[#F0F7FF]"
                                        } hover:bg-[#F0F7FF] cursor-pointer transition-all ease-linear ${dataTable.length - 1 == eIndex ? "border-b-none" : "border-b"
                                        } `}
                                >
                                    <div className="flex justify-between">
                                        <div className="flex flex-col gap-1">
                                            <h1 className="3xl:text-base xxl:text-base 2xl:text-sm xl:text-xs lg:text-xs text-sm font-medium text-[#0F4F9E]">
                                                {e.title}
                                            </h1>
                                            <h3 className="text-[#667085] font-normal text-[11px]">
                                                {dataLang?.materials_planning_create_on ||
                                                    "materials_planning_create_on"}{" "}
                                                <span className="text-[#141522] font-medium 3xl:text-xs text-[11px]">
                                                    {e.time}
                                                </span>
                                            </h3>
                                            <TagBranch className="w-fit">{e?.nameBranch}</TagBranch>
                                        </div>
                                        {/* <div className="flex flex-col items-end 3xl:my-1 xxl:my-1 2xl:my-1 xl:my-0 my-0">
                                            <h3 className="text-[#667085] font-normal 3xl:text-xs text-[11px]">
                                                {dataLang?.materials_planning_create_on || 'materials_planning_create_on'}{" "}
                                                <span className="text-[#141522] font-medium 3xl:text-xs text-[11px]">
                                                    {e.time}
                                                </span>
                                            </h3>
                                            <h3 className="text-[#667085] font-normal 3xl:text-xs text-[11px]">
                                                {dataLang?.materials_planning_by || 'materials_planning_by'}{" "}
                                                <span className="text-[#141522] font-medium 3xl:text-xs text-[11px]">
                                                    {e.name}
                                                </span>
                                            </h3>
                                        </div> */}
                                    </div>
                                    {e.showParent && (
                                        <div className="flex flex-col gap-2 mt-1">
                                            <div className="flex items-center gap-1">
                                                <h3 className=" text-[#52575E] font-normal 3xl:text-sm text-xs">
                                                    {dataLang?.materials_planning_foloww_up ||
                                                        "materials_planning_foloww_up"}
                                                    :
                                                </h3>
                                                <div className="flex items-center gap-1">
                                                    {e.followUp.map((i) => (
                                                        <React.Fragment key={i.id}>
                                                            <h2 className="text-[#191D23] font-medium 3xl:text-sm text-xs">
                                                                {i.nameFollow}
                                                            </h2>
                                                            {/* <h2 className="text-[#9295A4] font-normal 3xl:text-sm text-xs">
                                                                {i.typeFollow}
                                                            </h2> */}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {dataTable.next && (
                                <button
                                    type="button"
                                    onClick={() => queryValue({ page: isValue.page + 1 })}
                                    className="mx-auto text-sm block py-1 bg-blue-50 w-full hover:bg-blue-200 mt-1 transition-all duration-200 ease-linear"
                                >
                                    {dataLang?.materials_planning_see_more || "materials_planning_see_more"}
                                </button>
                            )}
                        </Customscrollbar>
                    </div>
                    <div className="w-[80%] border border-[#d8dae5] ">
                        <div className="flex items-center justify-between py-1 px-4 border-b">
                            <div>
                                <h1 className="text-[#52575E] font-normal text-xs uppercase">
                                    {dataLang?.materials_planning_nvl || "materials_planning_nvl"}
                                </h1>
                                <h1 className="text-[#3276FA] font-medium 3xl:text-[20px] text-[16px] uppercase">
                                    {dataTable.listDataRight?.title ??
                                        (dataLang?.materials_planning_no_nvl || "materials_planning_no_nvl")}
                                </h1>
                            </div>
                            <div className="flex gap-4">
                                {arrButton.map((e) => (
                                    <Zoom
                                        key={e.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 1.08 }}
                                        className="w-fit"
                                    >
                                        {(e.id == 3 && (
                                            <button
                                                className=" bg-red-100 rounded-lg  outline-none focus:outline-none"
                                                onClick={() => {
                                                    if (+dataTable?.countAll == 0) {
                                                        return isShow(
                                                            "error",
                                                            dataLang?.materials_planning_please_add ||
                                                            "materials_planning_please_add"
                                                        );
                                                    }
                                                    if (e.id == 3) {
                                                        queryValue({ page: 1 });
                                                        handleQueryId({
                                                            status: true,
                                                            id: dataTable.listDataRight?.idCommand,
                                                        });
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center gap-2 py-2 px-3 ">
                                                    {/* <Image height={16} width={16} src={e.icon} className="object-cover text-red-500" /> */}
                                                    {e.icon}
                                                    <h3 className="text-red-600 font-medium 3xl:text-base text-xs">
                                                        {e.name}
                                                    </h3>
                                                </div>
                                            </button>
                                        )) ||
                                            (e.id == 1 && (
                                                <PopupKeepStock
                                                    id={e.id}
                                                    queryValue={queryValue}
                                                    fetchDataTable={fetchDataTable}
                                                    dataLang={dataLang}
                                                    title={e.name}
                                                    dataTable={dataTable}
                                                    icon={e.icon}
                                                />
                                            )) ||
                                            (e.id == 2 && (
                                                <PopupPurchase
                                                    id={e.id}
                                                    queryValue={queryValue}
                                                    fetchDataTable={fetchDataTable}
                                                    dataLang={dataLang}
                                                    title={e.name}
                                                    dataTable={dataTable}
                                                    icon={e.icon}
                                                />
                                            ))}
                                    </Zoom>
                                ))}
                            </div>
                        </div>
                        <div className="mx-4">
                            <div className="border-b my-6 ">
                                <div className="flex items-center gap-4 ">
                                    {listTab.map((e) => (
                                        <button
                                            key={e.id}
                                            onClick={() => handleActiveTab(e.type)}
                                            className={`hover:bg-[#F7FBFF] ${dataTable.isTab == e.type && "border-[#0F4F9E] border-b bg-[#F7FBFF]"
                                                } hover:border-[#0F4F9E] hover:border-b group transition-all duration-200 ease-linear outline-none focus:outline-none`}
                                        >
                                            <h3
                                                className={`py-[10px] px-2  font-normal ${dataTable.isTab == e.type ? "text-[#0F4F9E]" : "text-[#667085]"
                                                    } 3xl:text-base text-sm group-hover:text-[#0F4F9E] transition-all duration-200 ease-linear`}
                                            >
                                                {e.name}
                                            </h3>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                {dataTable.isTab == "item" && <TabItem {...shareProps} />}
                                {dataTable.isTab == "plan" && <TabPlan {...shareProps} />}
                                {dataTable.isTab == "keepStock" && <TabKeepStock {...shareProps} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                title={TITLE_DELETE_COMMAND}
                subtitle={CONFIRM_DELETION}
                isOpen={isOpen}
                save={() => {
                    if (isIdChild) {
                        handleConfimDeleteItem();
                    } else {
                        handleConfim();
                    }
                }}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment>
    );
};
export default MainTable;
