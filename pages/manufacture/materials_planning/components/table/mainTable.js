import { SearchNormal1 } from "iconsax-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { v4 as uddid } from "uuid";

import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import Zoom from "@/components/UI/zoomElement/zoomElement";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";

import { _ServerInstance as Axios } from "/services/axios";

import FilterHeader from "../header/filterHeader";

const ScrollArea = dynamic(() => import("react-scrollbar"), { ssr: false });

const TabItem = dynamic(() => import("./tabItem"), { ssr: false });

const TabPlan = dynamic(() => import("./tabPlan"), { ssr: false });

const TabKeepStock = dynamic(() => import("./tabKeepStock"), { ssr: false });

import { CONFIRM_DELETION, TITLE_DELETE_COMMAND } from "@/constants/delete/deleteTable";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatNumber from "@/utils/helpers/formatnumber";
import { debounce } from "lodash";
import PopupKeepStock from "../popup/popupKeepStock";
import PopupPurchase from "../popup/popupPurchase";



const MainTable = ({ dataLang }) => {
    const arrButton = [
        {
            id: 1,
            name: "Giữ kho",
            icon: "/materials_planning/add.png",
        },
        {
            id: 2,
            name: "Thêm KH  mua hàng",
            icon: "/materials_planning/add.png",
        },
        {
            id: 3,
            name: "Xóa",
            icon: "/materials_planning/delete.png",
        },
    ];

    const listTab = [
        {
            id: uddid(),
            name: "Mặt hàng",
            type: "item",
        },
        {
            id: uddid(),
            name: "Kế hoạch Bán thành phẩm & Nguyên vật liệu",
            type: "plan",
        },
        {
            id: uddid(),
            name: "Giữ kho & Yêu cầu mua hàng",
            type: "keepStock",
        },
    ];

    const isShow = useToast();

    const { isMoment } = formatMoment()

    const initialState = {
        isTab: 'item',
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
        },
        next: null
    }

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
        resetPage: false
    }

    const { isOpen, isId, handleQueryId } = useToggle();

    const [dataTable, sDataTable] = useState(initialState);

    const [isValue, sIsValue] = useState(initialValue);

    const queryState = (key) => sDataTable((prve) => ({ ...prve, ...key }));

    const queryValue = (key) => sIsValue((prve) => ({ ...prve, ...key }));

    const [isFetching, sIsFetChing] = useState(false);

    const fetchDataTable = () => {
        Axios("POST", `/api_web/api_manufactures/getProductionPlans?csrf_protection=true&page=${isValue.page}&limit=${isValue.limit}`, {
            params: {
                date_start: isValue.dateStart ? isMoment(isValue.dateStart, 'DD/MM/YYYY') : "",
                date_end: isValue.dateEnd ? isMoment(isValue.dateEnd, 'DD/MM/YYYY') : "",
                search: isValue.search == "" ? "" : isValue.search,
                orders_id: [isValue.valueOrder?.value]?.length > 0 ? [isValue.valueOrder?.value].map(e => e?.value) : "",
                "internal_plans_id": [isValue.valuePlan?.value]?.length > 0 ? [isValue.valuePlan?.value].map(e => e?.value) : ""
            }
        },
            (err, response) => {
                if (!err) {
                    const { data } = response?.data

                    const item = data?.productionPlans?.map((e, index) => {
                        return {
                            id: e?.id,
                            title: e?.reference_no,
                            time: isMoment(e?.date, 'DD/MM/YYYY'),
                            name: e?.created_by_full_name,
                            productionOrder: [],
                            followUp: e?.listObject?.map(i => {
                                return {
                                    id: i?.pp_id,
                                    nameFollow: i?.reference_no,
                                    typeFollow: i?.object_type == 1 ? 'Đơn hàng' : "Kế hoạch nội bộ",
                                }
                            }),
                            note: ""
                        }
                    })
                    let arrayItem = []
                    if (isValue.resetPage) {
                        arrayItem = item
                    } else {
                        arrayItem = [...dataTable.listDataLeft, ...item]
                    }
                    queryState({
                        countAll: data?.countAll,
                        listDataLeft: arrayItem.map((e, index) => {
                            return {
                                ...e,
                                showParent: index == 0,
                            }
                        }),
                        next: data?.next == 1
                    });
                    if (isValue.search == "" && arrayItem[0]?.id) {
                        fetchDataTableRight(arrayItem[0]?.id)
                    }
                    if (data?.productionPlans?.length == 0) {
                        queryState({
                            listDataRight: {
                                ...dataTable.listDataRight,
                                title: "Không có kế hoạch NVL",
                                dataPPItems: [],
                                dataBom: {
                                    productsBom: [],
                                    materialsBom: []
                                },
                                dataKeepStock: []
                            }
                        })
                    }
                }
            }
        );
    }
    useEffect(() => {
        fetchDataTable()
    }, [isValue.search, isValue.dateStart, isValue.dateEnd, isValue.valueOrder, isValue.valuePlan, isValue.page]);



    const fetchDataTableRight = async (id) => {
        await Axios("GET", `/api_web/api_manufactures/getDetailProductionPlans/${id}?csrf_protection`, {},
            (err, response) => {
                if (!err) {
                    const { data, isSuccess } = response?.data
                    if (isSuccess == 1) {
                        queryState({
                            listDataRight: {
                                title: data?.productionPlan?.reference_no,
                                idCommand: data?.productionPlan?.id,
                                dataPPItems: data?.listPPItems?.map(e => {
                                    return {
                                        id: e?.object_id,
                                        title: e?.reference_no,
                                        showChild: true,
                                        arrListData: e?.items?.map(i => {
                                            return {
                                                id: uddid(),
                                                image: i?.images ? i?.images : "/no_img.png",
                                                name: i?.item_name,
                                                productVariation: i?.product_variation,
                                                subName: i?.item_code,
                                                quantity: +i?.quantity,
                                                unit: i?.unit_name,
                                                timeline: {
                                                    start: isMoment(i?.timeline_start, 'DD/MM/YYYY'),
                                                    end: isMoment(i?.timeline_end, 'DD/MM/YYYY')
                                                }
                                            }
                                        })
                                    }
                                }),
                                dataBom: {
                                    productsBom: data?.listBom?.productsBom?.map(e => {
                                        return {
                                            id: e?.item_id,
                                            name: e?.item_name,
                                            image: e?.images ? e?.images : "/no_img.png",
                                            unit: e?.unit_name,
                                            use: formatNumber(e?.total_quota),//sl sử dụng
                                            exist: formatNumber(e?.quantity_warehouse), //sl tồn
                                            lack: formatNumber(e?.quantity_rest), //sl thiếu
                                            code: e?.item_code,
                                            itemVariation: e?.item_variation
                                        }
                                    }),
                                    materialsBom: data?.listBom?.materialsBom?.map(e => {
                                        return {
                                            id: e?.item_id,
                                            name: e?.item_name,
                                            image: e?.images ? e?.images : "/no_img.png",
                                            unit: e?.unit_name,
                                            use: formatNumber(e?.total_quota),//sl sử dụng
                                            exchange: formatNumber(e?.quota_primary), //sl quy đổi
                                            exist: formatNumber(e?.quantity_warehouse), //sl tồn
                                            lack: formatNumber(e?.quantity_rest), //sl thiếu
                                            code: e?.item_code,
                                            itemVariation: e?.item_variation
                                        }
                                    })
                                },
                                dataKeepStock: []
                            },
                        })
                    }
                }
            }
        );
    };

    const fetDataOrder = debounce(async (value) => {
        await Axios("GET", `/api_web/api_internal_plan/searchOrders?csrf_protection=true`, {
            params: {
                search: value
            }
        },
            (err, response) => {
                if (!err) {
                    const { data } = response?.data
                    if (data?.items) {
                        queryValue({
                            listOrders: data?.items?.map(e => {
                                return {
                                    value: e?.id,
                                    label: e?.reference_no
                                }
                            })
                        })
                    }
                }
            })
    }, 500)

    const fetchDataPlan = debounce(async (value) => {
        await Axios("GET", `/api_web/api_internal_plan/searchInternalPlans?csrf_protection=true`, {
            params: {
                search: value
            }
        },
            (err, response) => {
                if (!err) {
                    const { data } = response?.data
                    if (data?.items) {
                        queryValue({
                            listPlan: data?.items?.map(e => {
                                return {
                                    value: e?.id,
                                    label: e?.reference_no
                                }
                            })
                        })
                    }
                }
            })
    }, 500);

    useEffect(() => {
        fetDataOrder()
        fetchDataPlan()
    }, []);

    const handleShow = (id) => {
        queryState({
            listDataLeft: dataTable.listDataLeft.map((e) => {
                const showParent = e.id == id ? !e.showParent : false;
                if (showParent) {
                    fetchDataTableRight(id)
                } else {
                    queryState({
                        listDataRight: {
                            ...dataTable.listDataRight,
                            dataPPItems: [],
                            dataBom: {
                                productsBom: [],
                                materialsBom: []
                            },
                            dataKeepStock: []
                        }
                    })
                }
                return {
                    ...e,
                    showParent: showParent
                }
            })
        });
        fetchingData()
    }


    const handleActiveTab = (e) => {
        queryState({ isTab: e })
        fetchingData();
    };

    const fetchingData = () => {
        sIsFetChing(true);
        setTimeout(() => {
            sIsFetChing(false);
        }, 1500);
    };

    const handleConfim = async () => {
        await Axios("DELETE", `/api_web/api_manufactures/deleteProductionPlans/${isId}?csrf_protection=true`, {},
            (err, response) => {
                if (!err) {
                    const { isSuccess, message } = response?.data
                    if (isSuccess == 1) {
                        fetchDataTable()
                        isShow("success", `${dataLang[message] || message}`);
                        return
                    }
                    isShow("error", `${dataLang[message] || message}`);
                }
            }
        );
        handleQueryId({ status: false });
    }


    const handShowItem = (id) => {
        queryState({
            listDataRight: {
                ...dataTable.listDataRight,
                dataPPItems: dataTable.listDataRight.dataPPItems?.map(e => {
                    if (e.id == id) {
                        return {
                            ...e,
                            showChild: !e.showChild
                        }
                    }
                    return e
                }),
            },
        })
    }

    const onChangeSearch = debounce((e) => {
        queryValue({ search: e.target.value, page: 1, resetPage: true })
    }, 500)

    const shareProps = {
        dataTable,
        dataLang,
        filterItem: () => { },
        handShowItem,
        handDeleteItem: () => { },
        isFetching,
        isValue,
        queryValue,
        fetDataOrder,
        fetchDataPlan
    };


    return (
        <React.Fragment>
            <FilterHeader {...shareProps} />
            <div className="!mt-[14px]">
                <h1 className="text-[#141522] font-medium text-sm my-2">Tổng số kế hoạch NVL: {dataTable?.countAll}</h1>
                <div className="flex ">
                    <div className="w-[25%] border-r-0 border-[#d8dae5] border">
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
                                    placeholder="Tìm kế hoạch NVL"
                                />
                            </form>
                        </div>
                        <ScrollArea
                            className="3xl:h-[65vh] xxl:h-[52vh] 2xl:h-[56.5vh] xl:h-[52.5vh] lg:h-[55vh] h-[35vh] overflow-y-auto  scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 "
                            speed={1}
                            smoothScrolling={true}
                        >
                            {dataTable.listDataLeft.map((e, eIndex) => (
                                <div
                                    key={e.id}
                                    onClick={() => handleShow(e.id)}
                                    className={`py-2 pl-2 pr-3 ${e.showParent && "bg-[#F0F7FF]"
                                        } hover:bg-[#F0F7FF] cursor-pointer transition-all ease-linear ${dataTable.length - 1 == eIndex ? "border-b-none" : "border-b"
                                        } `}
                                >
                                    <div className="flex justify-between">
                                        <h1 className="3xl:text-base xxl:text-base 2xl:text-sm xl:text-xs lg:text-xs text-sm font-medium text-[#0F4F9E]">
                                            {e.title}
                                        </h1>
                                        <div className="flex flex-col items-end 3xl:my-1 xxl:my-1 2xl:my-1 xl:my-0 my-0">
                                            <h3 className="text-[#667085] font-normal 3xl:text-xs text-[11px]">
                                                Tạo vào{" "}
                                                <span className="text-[#141522] font-medium 3xl:text-xs text-[11px]">
                                                    {e.time}
                                                </span>
                                            </h3>
                                            <h3 className="text-[#667085] font-normal 3xl:text-xs text-[11px]">
                                                bởi{" "}
                                                <span className="text-[#141522] font-medium 3xl:text-xs text-[11px]">
                                                    {e.name}
                                                </span>
                                            </h3>
                                        </div>
                                    </div>
                                    {e.showParent && (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex">
                                                <h3 className="w-[30%] text-[#52575E] font-normal 3xl:text-sm text-xs">
                                                    Lập theo
                                                </h3>
                                                <div className="flex flex-col w-[70%]">
                                                    {e.followUp.map((i) => (
                                                        <React.Fragment key={i.id}>
                                                            <h2 className="text-[#191D23] font-medium 3xl:text-sm text-xs">
                                                                {i.nameFollow}
                                                            </h2>
                                                            <h2 className="text-[#9295A4] font-normal 3xl:text-sm text-xs">
                                                                {i.typeFollow}
                                                            </h2>
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {dataTable.next &&
                                <button type="button" onClick={() => queryValue({ page: isValue.page + 1 })} className="mx-auto text-sm block py-1 bg-blue-50 w-full hover:bg-blue-200 mt-1 transition-all duration-200 ease-linear">Xem thêm</button>
                            }
                        </ScrollArea>
                    </div>
                    <div className="w-[75%] border border-[#d8dae5] ">
                        <div className="flex items-center justify-between py-1 px-4 border-b">
                            <div>
                                <h1 className="text-[#52575E] font-normal text-xs uppercase">Kế hoạch NVL</h1>
                                <h1 className="text-[#3276FA] font-medium 3xl:text-[20px] text-[16px] uppercase">
                                    {dataTable.listDataRight?.title}
                                </h1>
                            </div>
                            <div className="flex gap-4">
                                {arrButton.map((e) => (
                                    <Zoom key={e.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 1.08 }} className="w-fit">
                                        {e.id == 3 &&
                                            <button
                                                className=" bg-[#F3F4F6] rounded-lg  outline-none focus:outline-none"
                                                onClick={() => {
                                                    if (+dataTable?.countAll == 0) {
                                                        return isShow('error', 'Vui lòng thêm kế hoạch sản xuất')
                                                    }
                                                    if (e.id == 3) {
                                                        queryValue({ page: 1, resetPage: true })
                                                        handleQueryId({ status: true, id: dataTable.listDataRight?.idCommand })
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center gap-2 py-2 px-3 ">
                                                    <Image height={16} width={16} src={e.icon} className="object-cover" />
                                                    <h3 className="text-[#141522] font-medium 3xl:text-base text-xs">
                                                        {e.name}
                                                    </h3>
                                                </div>
                                            </button>
                                            ||
                                            e.id == 1 && <PopupKeepStock id={e.id} dataLang={dataLang} title={e.name} dataTable={dataTable} icon={e.icon} />
                                            ||
                                            e.id == 2 && <PopupPurchase id={e.id} dataLang={dataLang} title={e.name} dataTable={dataTable} icon={e.icon} />
                                        }
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
                save={handleConfim}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment>
    );
};
export default MainTable;
