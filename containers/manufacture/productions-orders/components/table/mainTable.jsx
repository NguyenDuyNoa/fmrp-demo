import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import Loading from "@/components/UI/loading/loading";
import NoData from "@/components/UI/noData/nodata";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import { optionsQuery } from "@/configs/optionsQuery";
import { CONFIRM_DELETION, TITLE_DELETE_PRODUCTIONS_ORDER } from "@/constants/delete/deleteTable";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { useBranchList } from "@/hooks/common/useBranch";
import { useInternalPlansSearchCombobox } from "@/hooks/common/useInternalPlans";
import { useItemsVariantSearchCombobox } from "@/hooks/common/useItems";
import { useOrdersSearchCombobox } from "@/hooks/common/useOrder";
import { useToggle } from "@/hooks/useToggle";
import { formatMoment } from "@/utils/helpers/formatMoment";
import { useQuery } from "@tanstack/react-query";
import { SearchNormal1 } from "iconsax-react";
import { debounce } from "lodash";
import dynamic from "next/dynamic";
import React, { useContext, useEffect, useState } from "react";
import { v4 as uddid } from "uuid";
import { ProductionsOrdersContext } from "../../context/productionsOrders";
import { useProductionOrdersCombobox } from "../../hooks/useProductionOrdersCombobox";
import { useProductionOrdersComboboxDetail } from "../../hooks/useProductionOrdersComboboxDetail";
import FilterHeader from "../header/filterHeader";
import ModalDetail from "../modal/modalDetail";
import TabItem from "./tabItem";
import TabSemi from "./tabSemi";
import PopupConfimStage from "../popup/PopupConfimStage";

// const PopupConfimStage = dynamic(() => import("../popup/PopupConfimStage"), { ssr: false });

const MainTable = ({ dataLang }) => {
    const listTab = [
        {
            id: uddid(),
            name: dataLang?.import_finished_product || "import_finished_product",
            type: "products",
        },
        {
            id: uddid(),
            name: dataLang?.materials_planning_semi || "materials_planning_semi",
            type: "semiProduct",
        },
    ];

    const { data: listBr = [] } = useBranchList()

    const [isMouted, setIsMouted] = useState(false);

    const { isOpen, handleQueryId, isIdChild } = useToggle();

    const { isStateProvider: isState, queryState } = useContext(ProductionsOrdersContext);

    const { data: listOrders = [] } = useOrdersSearchCombobox(isState.searchOrders);

    const { data: listPlan = [] } = useInternalPlansSearchCombobox(isState.searchPlan);

    const { data: comboboxProductionOrdersDetail = [] } = useProductionOrdersComboboxDetail()

    const { data: listProducts = [] } = useItemsVariantSearchCombobox(isState.searchItemsVariant);

    const { data: comboboxProductionOrders = [] } = useProductionOrdersCombobox(isState.searchProductionOrders)

    const handleFilter = (type, value) => queryState({ [type]: value, page: 1 });

    useEffect(() => {
        setIsMouted(true);
    }, []);

    const convertArrData = (arr) => {
        const newData = arr?.map((e) => {
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
                        typeFollow: "",
                    };
                }),
                // processBar: [
                //     { id: uddid(), active: true, date: new Date(), title: 'Bồi', status: "Đã điều độ", quantity: 100 },
                //     { id: uddid(), active: true, date: new Date(), title: 'Bế', status: "Đã điều độ", quantity: 150 },
                //     { id: uddid(), active: true, date: new Date(), title: 'Dán TP', status: "Đã điều độ", quantity: 200 },
                //     { id: uddid(), active: false, date: new Date(), title: 'Đóng gói', status: "Đã điều độ", quantity: 0 },
                // ],
                note: "",
            };
        });
        return newData;
    };

    const params = {
        branch_id: isState.valueBr?.value || "",
        _po_id: isState.valueProductionOrders?.value || "",
        search: isState.search == "" ? "" : isState.search,
        _pod_id: isState.valueProductionOrdersDetail?.value || "",
        orders_id: [isState.valueOrders?.value]?.length > 0 ? [isState.valueOrders?.value].map((e) => e) : "",
        date_end: isState.date.dateEnd ? formatMoment(isState.date.dateEnd, FORMAT_MOMENT.DATE_SLASH_LONG) : "",
        internal_plans_id: [isState.valuePlan?.value]?.length > 0 ? [isState.valuePlan?.value].map((e) => e) : "",
        date_start: isState.date.dateStart ? formatMoment(isState.date.dateStart, FORMAT_MOMENT.DATE_SLASH_LONG) : "",
        item_variation_id: isState.valueProducts?.length > 0 ? isState.valueProducts.map((e) => e?.e?.item_variation_id) : null,
    };

    const fetchState = async () => {
        try {
            const { data } = await apiProductionsOrders.apiProductionOrders(isState.page, isState.limit, { params: params });
            const arrayItem = convertArrData(data?.productionOrders);
            queryState({
                countAll: data?.countAll,
                listDataLeft: arrayItem.map((e, index) => {
                    return {
                        ...e,
                        showParent: isState?.search ? index == 0 : e?.id == isState.idDetailProductionOrder ? true : !isState.idDetailProductionOrder ? index == 0 : false,
                    };
                }),
                next: data?.next == 1,
            });
            // if (isState.search == "" && arrayItem[0]?.id) {
            //     queryState({ idDetailProductionOrder: arrayItem[0]?.id });
            // }
            if (isState.search == "") {
                if (isState.idDetailProductionOrder) {
                    queryState({ idDetailProductionOrder: isState.idDetailProductionOrder });
                } else {
                    queryState({ idDetailProductionOrder: arrayItem[0]?.id });
                }
            } else {
                queryState({ idDetailProductionOrder: arrayItem[0]?.id });
            }
            if (data?.productionOrders?.length == 0) {
                queryState({
                    listDataRight: {
                        ...isState.listDataRight,
                        title: null,
                        dataPPItems: [],
                        dataSemiItems: [],
                    },
                });
            }
            return data;
        } catch (error) {
            throw new Error(error);
        }
    };

    const { isLoading, refetch: refetchProductionsOrders } = useQuery({
        queryKey: ["api_production_orders",
            isState.page,
            isState.search,
            isState.date.dateStart,
            isState.date.dateEnd,
            isState.valueProductionOrders,
            isState.valueProductionOrdersDetail,
            isState.valueBr,
            isState.valueOrders,
            isState.valuePlan,
            isState.valueProducts],
        queryFn: () => fetchState(),
        // enabled: isState.openModal == false,
        ...optionsQuery
    })


    const fetchisStateSeeMore = async () => {

        try {
            const { data } = await apiProductionsOrders.apiProductionOrders(isState.page, isState.limit, { params: params });
            const item = convertArrData(data?.productionOrders);
            let arrayItem = [...isState.listDataLeft, ...item];
            queryState({
                countAll: data?.countAll,
                listDataLeft: arrayItem.map((e, index) => {
                    return {
                        ...e,
                        showParent: isState?.search ? index == 0 : e?.id == isState.idDetailProductionOrder ? true : !isState.idDetailProductionOrder ? index == 0 : false,
                    };
                }),
                next: data?.next == 1,

            });
            if (isState.search == "") {
                if (isState.idDetailProductionOrder) {
                    queryState({ idDetailProductionOrder: isState.idDetailProductionOrder });
                } else {
                    queryState({ idDetailProductionOrder: arrayItem[0]?.id });
                }
            } else {
                queryState({ idDetailProductionOrder: arrayItem[0]?.id });
            }
            if (data?.productionOrders?.length == 0) {
                queryState({
                    listDataRight: {
                        ...isState.listDataRight,
                        title: null,
                        dataPPItems: [],
                        dataSemiItems: [],
                    },
                });
            }
            return data
        } catch (error) {
            throw error
        }
    };

    useEffect(() => {
        if (isState.page != 1) {
            fetchisStateSeeMore();
        }
    }, [isState.page]);

    const { isLoading: isLoadingRight } = useQuery({
        queryKey: ['api_detail_production_orders', isState.idDetailProductionOrder],
        queryFn: () => fetchisStateRight(),
        enabled: !!isState.idDetailProductionOrder,
        ...optionsQuery
    })

    const fetchisStateRight = async () => {
        try {
            const { data, isSuccess } = await apiProductionsOrders.apiDetailProductionOrders(isState.idDetailProductionOrder);
            if (!isSuccess == 1) return;
            queryState({
                listDataRight: {
                    title: data?.productionOrder?.reference_no,
                    idCommand: data?.productionOrder?.id,
                    dataPPItems: data?.listPOItems?.map((e) => {
                        return {
                            id: e?.object_id,
                            title: e?.reference_no,
                            showChild: true,
                            arrListData: e?.items_products?.map((i) => {
                                return {
                                    id: i?.poi_id,
                                    image: i?.images ? i?.images : "/no_img.png",
                                    name: i?.item_name,
                                    itemVariation: i?.product_variation,
                                    code: i?.item_code,
                                    quantity: +i?.quantity,
                                    unit: i?.unit_name,
                                    processBar: i?.list_stages?.map((j) => {
                                        return {
                                            id: uddid(),
                                            active: false,
                                            date: new Date(),
                                            title: j?.name_stage,
                                            status: "",
                                            quantity: 0,
                                        };
                                    }),
                                    childProducts: i?.semi_products,
                                };
                            }),
                        };
                    }),
                    dataSemiItems: data?.listSemiItems?.map((e) => {
                        return {
                            id: e?.object_id,
                            title: e?.reference_no,
                            showChild: true,
                            arrListData: e?.semi_products?.map((i) => {
                                return {
                                    id: uddid(),
                                    image: i?.images ? i?.images : "/no_img.png",
                                    name: i?.item_name,
                                    itemVariation: i?.product_variation,
                                    code: i?.item_code,
                                    quantity: +i?.quantity,

                                    unit: i?.unit_name,
                                    processBar: i?.list_stages?.map((j) => {
                                        return {
                                            id: uddid(),
                                            active: false,
                                            date: new Date(),
                                            title: j?.name_stage,
                                            status: "",
                                            quantity: 0,
                                        };
                                    }),
                                    childProducts: {
                                        ...i?.products_parent,
                                        image: i?.products_parent?.image ? i?.products_parent?.image : "/no_img.png",
                                    },
                                };
                            }),
                        };
                    }),
                },
            });
            return data
        } catch (error) {
            throw new Error(error);
        }
    };

    const fetchComboboxProductionOrders = debounce(async (value) => {
        try {
            queryState({ searchProductionOrders: value });
        } catch (error) { }
    }, 500);

    const fetchDataItems = debounce(async (value) => {
        try {
            queryState({ searchItemsVariant: value });
        } catch (error) { }
    }, 500);

    const fetDataOrder = debounce(async (value) => {
        try {
            queryState({ searchOrders: value });
        } catch (error) { }
    }, 500);


    const fetchDataPlan = debounce(async (value) => {
        try {
            queryState({ searchPlan: value });
        } catch (error) { }
    }, 500);

    const handleShow = (id) => {
        queryState({
            listDataLeft: isState.listDataLeft.map((e) => {
                const showParent = e.id == id;
                showParent && queryState({ idDetailProductionOrder: id })
                return {
                    ...e,
                    showParent: showParent,
                };
            }),
            openModal: false,
            dataModal: {},
        });
    };

    const handleActiveTab = (e) => {
        queryState({ isTab: e });
    };

    const handleConfim = async () => {
        handleQueryId({ status: false });
    };

    const handShowItem = (id, type) => {
        queryState({
            listDataRight: {
                ...isState.listDataRight,
                [type]: isState.listDataRight?.[type]?.map((e) => {
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
        queryState({ search: e.target.value, page: 1, openModal: false });
    }, 500);

    const handDeleteItem = (id, type) => {
        queryState({ page: 1 });
        handleQueryId({ status: true, id: id, idChild: type });
    };

    const handleConfimDeleteItem = async () => {
        // const type = {
        //     // dataKeepStock: `/api_web/Api_transfer/transfer/${isId}?csrf_protection=true`,
        //     // dataPurchases: `/api_web/Api_purchases/purchases/${isId}?csrf_protection=true`,
        // };
        // await Axios("DELETE", type[isIdChild], {}, (err, response) => {
        //     if (!err) {
        //         let { isSuccess, message } = response.data;
        //         if (isSuccess) {
        //             fetchState(1);
        //             queryState({ page: 1 });
        //             isShow("success", dataLang[message] || message);
        //         } else {
        //             isShow("error", dataLang[message] || message);
        //         }
        //     }
        // });
        // handleQueryId({ status: false });
    };

    const handleShowModel = (item) => {
        queryState({ openModal: true, dataModal: item });
    };


    const shareProps = {
        dataLang,
        handShowItem,
        handDeleteItem,
        handleShowModel,
        handleFilter,
        fetchComboboxProductionOrders,
        fetDataOrder,
        fetchDataPlan,
        fetchDataItems,
        listBr,
        listOrders,
        listPlan,
        listProducts,
        comboboxProductionOrders,
        comboboxProductionOrdersDetail,
        isLoadingRight,
        refetchProductionsOrders
    };

    if (!isMouted) {
        return null;
    }

    return (
        <React.Fragment>
            <FilterHeader {...shareProps} />
            <div className="!mt-[14px]">
                <h1 className="text-[#141522] font-medium text-sm my-2">
                    {dataLang?.productions_orders_total || "productions_orders_total"}: {isState?.countAll}
                </h1>
                <div className="flex ">
                    <div className="w-[25%] border-r-0 border-[#d8dae5] border">
                        <div className="border-b py-2 px-1 flex items-center justify-center bg-[#D0D5DD]/20 ">
                            <form className="relative flex items-center w-full">
                                <SearchNormal1
                                    size={20}
                                    className="absolute 2xl:left-3 z-10 text-[#cccccc] xl:left-[4%] left-[1%]"
                                />
                                <input
                                    onChange={(e) => onChangeSearch(e)}
                                    className="relative border border-[#d8dae5] bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] 2xl:text-left 2xl:pl-10 xl:pl-0 p-0 2xl:py-1.5 py-2.5 rounded-md 2xl:text-base text-xs xl:text-center text-center 2xl:w-full xl:w-full w-[100%]"
                                    type="text"
                                    placeholder={dataLang?.productions_orders_find || "productions_orders_find"}
                                />
                            </form>
                        </div>
                        <Customscrollbar className="3xl:h-[65vh] xxl:h-[52vh] 2xl:h-[56.5vh] xl:h-[52.5vh] lg:h-[55vh] h-[35vh] overflow-y-auto  scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 ">
                            {isLoading
                                ?
                                <Loading />
                                :
                                isState.listDataLeft?.length > 0 ?
                                    isState.listDataLeft.map((e, eIndex) => (
                                        <div
                                            key={e.id}
                                            onClick={() => handleShow(e.id)}
                                            className={`py-2 pl-2 pr-3 ${e.showParent && "bg-[#F0F7FF]"} hover:bg-[#F0F7FF] cursor-pointer transition-all ease-linear ${isState.length - 1 == eIndex ? "border-b-none" : "border-b"} `}
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
                                                </div>
                                                <TagBranch className="w-fit h-fit">{e?.nameBranch}</TagBranch>
                                            </div>
                                            {e.showParent && (
                                                <div className="flex flex-col w-full gap-2 mt-1">
                                                    <div className="flex items-center gap-1">
                                                        <h3 className=" text-[#52575E] font-normal 3xl:text-sm text-xs">
                                                            {dataLang?.materials_planning_foloww_up || "materials_planning_foloww_up"} :
                                                        </h3>
                                                        <div className="flex items-center gap-1">
                                                            {e.followUp.map((i, index) => (
                                                                <div key={index}>
                                                                    <h2 className="text-[#191D23] font-medium 3xl:text-sm text-xs">
                                                                        {i.nameFollow}
                                                                    </h2>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {isState.listDataRight?.title && (
                                                        <span className="text-[#FF8F0D] bg-[#FEF8EC] text-xs pl-2 pr-4 py-2 rounded font-medium w-fit">
                                                            <span className="bg-[#FF8F0D] h-2 w-2 rounded-full inline-block mr-2" />
                                                            {dataLang?.productions_orders_produced || "productions_orders_produced"}
                                                        </span>
                                                    )}
                                                    {/* <div className="flex items-center w-full">
                                                {e.processBar.map((j, JIndex) => {
                                                    return (
                                                        <div key={j.id} className="flex flex-col items-start w-full">
                                                            <p className={`${j.active ? "text-[#0BAA2E]" : "text-gray-500"} font-normal 3xl:text-[10px] text-[9px] flex flex-col`}>
                                                                <span>{j.status}</span>
                                                                <span>({moment(j.date).format('DD/MM/YYYY')})</span>
                                                            </p>

                                                            <li className={`${JIndex == e.processBar.length - 1 ? 'flex w-full relative text-gray-900 '
                                                                :
                                                                `flex w-full relative text-gray-900  after:content-[''] after:w-full after:h-0.5 ${j.active ? 'after:bg-[#00C170]' : 'after:bg-gray-500'}   after:inline-block after:absolute after:top-1 after:left-[25px]`}`}
                                                            >
                                                                <div className="z-10 block whitespace-nowrap">
                                                                    <span className={`w-[10px] h-[10px]  border-2  ${j.active ? 'bg-[#00C170] border-[#00C170]' : 'bg-gray-500 border-gray-500'} rounded-full flex justify-center items-center mx-auto mb-1 text-sm`}></span>
                                                                    <p className={`${j.active ? "text-[#0BAA2E]" : "text-gray-500"} font-normal 3xl:text-[11px] text-[10px]`}>
                                                                        {j.title}
                                                                    </p>

                                                                    <p className={` ${j.quantity > 0 ? "opacity-100" : "opacity-0"} text-[#0BAA2E] font-normal text-[10px]`}>
                                                                        SL:
                                                                        <span className="text-[#0BAA2E] font-semibold text-[11px] px-1">
                                                                            {j.quantity > 0 ? formatNumber(j.quantity) : "-"}
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            </li >
                                                        </div>
                                                    )
                                                })}
                                            </div> */}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                    : <NoData />
                            }

                            {isState.next && (
                                <button
                                    type="button"
                                    onClick={() => queryState({ page: isState.page + 1 })}
                                    className="block w-full py-1 mx-auto mt-1 text-sm transition-all duration-200 ease-linear bg-blue-50 hover:bg-blue-200"
                                >
                                    {dataLang?.materials_planning_see_more || "materials_planning_see_more"}
                                </button>
                            )}
                        </Customscrollbar>
                    </div>
                    <div className="w-[75%] border border-[#d8dae5] ">
                        {isLoading
                            ?
                            <Loading />
                            :
                            (isState.listDataRight?.dataPPItems?.length > 0 || isState.listDataRight?.dataSemiItems?.length > 0)
                                ?
                                <>
                                    <div className="flex items-center justify-between px-4 py-1 border-b">
                                        <div className="">
                                            <h1 className="text-[#52575E] font-normal text-xs uppercase">
                                                {dataLang?.productions_orders || "productions_orders"}
                                            </h1>
                                            <div className="flex items-center gap-2">
                                                <h1 className="text-[#3276FA] font-medium 3xl:text-[20px] text-[16px] uppercase">
                                                    {isState.listDataRight?.title ?? (dataLang?.productions_orders_no_orders || "productions_orders_no_orders")}
                                                </h1>
                                            </div>
                                        </div>
                                        {/* <div className="text-base font-medium text-blue-500 cursor-pointer">
                                            Hoàn thành công đoạn
                                        </div> */}
                                        <PopupConfimStage dataLang={dataLang} dataRight={isState} />
                                        {/* <button
                                className="bg-red-100 rounded-lg outline-none focus:outline-none"
                                onClick={() => {
                                    if (+isState?.countAll == 0) {
                                        return isShow(
                                            "error",
                                            dataLang?.materials_planning_please_add || "materials_planning_please_add"
                                        );
                                    }
                                    if (!isState.listDataRight?.title) {
                                        return isShow(
                                            "error",
                                            dataLang?.productions_orders_please_select ||
                                                "productions_orders_please_select"
                                        );
                                    }
                                    queryState({ page: 1 });
                                    handleQueryId({ status: true, id: isState.listDataRight?.idCommand });
                                }}
                            >
                                <div className="flex items-center gap-2 px-3 py-2 ">
                                    <RiDeleteBin5Line className="text-base text-red-600" />
                                    <h3 className="text-xs font-medium text-red-600 3xl:text-base">
                                        {dataLang?.materials_planning_delete || "materials_planning_delete"}
                                    </h3>
                                </div>
                            </button> */}
                                    </div>
                                    <div className="mx-4">
                                        <div className="my-6 border-b ">
                                            <div className="flex items-center gap-4 ">
                                                {listTab.map((e) => (
                                                    <button
                                                        key={e.id}
                                                        onClick={() => handleActiveTab(e.type)}
                                                        className={`hover:bg-[#F7FBFF] ${isState.isTab == e.type && "border-[#0F4F9E] border-b bg-[#F7FBFF]"} hover:border-[#0F4F9E] hover:border-b group transition-all duration-200 ease-linear outline-none focus:outline-none`}
                                                    >
                                                        <h3 className={`py-[10px] px-2  font-normal ${isState.isTab == e.type ? "text-[#0F4F9E]" : "text-[#667085]"} 3xl:text-base text-sm group-hover:text-[#0F4F9E] transition-all duration-200 ease-linear`} >
                                                            {e.name}
                                                        </h3>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            {isState.isTab == "products" && <TabItem {...shareProps} />}
                                            {isState.isTab == "semiProduct" && <TabSemi {...shareProps} />}
                                        </div>
                                    </div>
                                </>
                                :
                                <NoData />
                        }
                    </div>
                </div>
                <ModalDetail {...shareProps} />
            </div>
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                title={TITLE_DELETE_PRODUCTIONS_ORDER}
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
