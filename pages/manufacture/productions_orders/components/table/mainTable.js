import { SearchNormal1 } from "iconsax-react";
import React, { useEffect, useState } from "react";
import { v4 as uddid } from "uuid";

import PopupConfim from "@/components/UI/popupConfim/popupConfim";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";

import { _ServerInstance as Axios } from "/services/axios";

import FilterHeader from "../header/filterHeader";

import TabItem from "./tabItem";



import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { CONFIRM_DELETION, TITLE_DELETE_PRODUCTIONS_ORDER } from "@/constants/delete/deleteTable";
import { formatMoment } from "@/utils/helpers/formatMoment";
import { debounce } from "lodash";
import { RiDeleteBin5Line } from "react-icons/ri";
import ModalFilter from "../modal/modalFilter";
import moment from "moment";
import useSetingServer from "@/hooks/useConfigNumber";
import formatNumberConfig from "@/utils/helpers/formatnumber";



const MainTable = ({ dataLang }) => {

    const listTab = [
        {
            id: uddid(),
            name: "Thành phẩm",
            type: "products",
        },
        {
            id: uddid(),
            name: 'Bán thành phẩm',
            type: "semiProduct",
        },
    ];

    const isShow = useToast();

    const { isMoment } = formatMoment()

    const initialState = {
        isTab: 'products',
        countAll: 0,
        listDataLeft: [],
        listDataRight: {
            title: "",
            dataPPItems: [],

        },
        openModal: false,
        next: null,
        page: 1,
        limit: 15,
        search: "",
        dataModal: {}
        // dateStart: null,
        // dateEnd: null,
        // listOrders: [],
        // listPlan: [],
        // valueOrder: null,
        // valuePlan: null,
        // listBr: [],
        // valueBr: null,
    }


    const { isOpen, isId, handleQueryId, isIdChild } = useToggle();

    const [isState, sIsState] = useState(initialState);

    const queryState = (key) => sIsState((prve) => ({ ...prve, ...key }));

    const [isFetching, sIsFetChing] = useState(false);

    const dataSeting = useSetingServer();

    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);

    const convertArrData = (arr) => {
        const newData = arr?.map((e, index) => {
            return {
                id: e?.id,
                title: e?.reference_no,
                time: isMoment(e?.date, 'DD/MM/YYYY'),
                name: e?.created_by_full_name,
                nameBranch: e?.name_branch,
                productionOrder: [],
                followUp: e?.listObject?.map(i => {
                    return {
                        id: i?.pp_id,
                        nameFollow: i?.reference_no,
                        typeFollow: i?.object_type == 1 ? 'Đơn hàng' : "Kế hoạch nội bộ",
                    }
                }),
                processBar: [
                    { id: uddid(), active: true, date: new Date(), title: 'Bồi', status: "Đã điều độ", quantity: 100 },
                    { id: uddid(), active: true, date: new Date(), title: 'Bế', status: "Đã điều độ", quantity: 150 },
                    { id: uddid(), active: true, date: new Date(), title: 'Dán TP', status: "Đã điều độ", quantity: 200 },
                    { id: uddid(), active: false, date: new Date(), title: 'Đóng gói', status: "Đã điều độ", quantity: 0 },
                ],
                note: ""
            }
        })
        return newData
    }

    const params = {
        date_start: isState.dateStart ? isMoment(isState.dateStart, 'DD/MM/YYYY') : "",
        date_end: isState.dateEnd ? isMoment(isState.dateEnd, 'DD/MM/YYYY') : "",
        search: isState.search == "" ? "" : isState.search,
        "orders_id": [isState.valueOrder?.value]?.length > 0 ? [isState.valueOrder?.value].map(e => e) : "",
        "internal_plans_id": [isState.valuePlan?.value]?.length > 0 ? [isState.valuePlan?.value].map(e => e) : "",
        'branch_id': isState.valueBr?.value || "",
    }

    const fetchisState = (page) => {
        Axios("POST", `/api_web/api_manufactures/getProductionPlans?csrf_protection=true&page=${page}&limit=${isState.limit}`, {
            params: params
        },
            (err, response) => {
                if (!err) {
                    const { data } = response?.data
                    const arrayItem = convertArrData(data?.productionPlans)
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
                    if (isState.search == "" && arrayItem[0]?.id) {
                        fetchisStateRight(arrayItem[0]?.id)
                    }
                    if (data?.productionPlans?.length == 0) {
                        queryState({
                            listDataRight: {
                                ...isState.listDataRight,
                                title: null,
                                dataPPItems: [],
                            }
                        })
                    }
                }
            }
        );
    }

    useEffect(() => {
        fetchisState(isState.page)
    }, [isState.search, isState.dateStart, isState.dateEnd, isState.valueOrder, isState.valuePlan, isState.valueBr]);


    const fetchisStateSeeMore = () => {
        Axios("POST", `/api_web/api_manufactures/getProductionPlans?csrf_protection=true&page=${isState.page}&limit=${isState.limit}`, {
            params: params
        },
            (err, response) => {
                if (!err) {
                    const { data } = response?.data
                    const item = convertArrData(data?.productionPlans)
                    let arrayItem = [...isState.listDataLeft, ...item]
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
                    if (isState.search == "" && arrayItem[0]?.id) {
                        fetchisStateRight(arrayItem[0]?.id)
                    }
                    if (data?.productionPlans?.length == 0) {
                        queryState({
                            listDataRight: {
                                ...isState.listDataRight,
                                title: null,
                                dataPPItems: [],
                            }
                        })
                    }
                }
            }
        );
    }

    useEffect(() => {
        if (isState.page != 1) {
            fetchisStateSeeMore()
        }
    }, [isState.page]);

    const fetchisStateRight = async (id) => {
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
                                                itemVariation: i?.product_variation,
                                                code: i?.item_code,
                                                quantity: +i?.quantity,
                                                unit: i?.unit_name,
                                                processBar: [
                                                    { id: uddid(), active: true, date: new Date(), title: "Đặt hàng", status: "Đã điều độ", quantity: 200 },
                                                    { id: uddid(), active: true, date: new Date(), title: "Nhập hàng", status: "Đã điều độ", quantity: 200 },
                                                    { id: uddid(), active: false, date: new Date(), title: "Đóng gói", status: "Đã điều độ", quantity: 0 },
                                                    { id: uddid(), active: false, date: new Date(), title: "Sản xuất", status: "Đã điều độ", quantity: 0 },
                                                    { id: uddid(), active: false, date: new Date(), title: "Hoàn thành", status: "Đã điều độ", quantity: 0 },
                                                ],
                                                semiProduct: {
                                                    name: 'Bán thành phẩm 1',
                                                    quantity: 200,
                                                    date: new Date()
                                                }
                                            }
                                        })
                                    }
                                }),
                            },
                        })
                    }
                }
            }
        );
    };

    const fetDataOrder = debounce(async (value) => {
        await Axios("GET", `/api_web/api_internal_plan/searchOrders?csrf_protection=true`, {
            params: { search: value }
        },
            (err, response) => {
                if (!err) {
                    const { data } = response?.data
                    if (data?.items) {
                        queryState({
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
            params: { search: value }
        },
            (err, response) => {
                if (!err) {
                    const { data } = response?.data
                    if (data?.items) {
                        queryState({
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


    const fetchDataBranch = debounce(async (value) => {
        await Axios("GET", `/api_web/Api_Branch/branchCombobox/?csrf_protection=true`, {
            // params: { search: value }
        },
            (err, response) => {
                if (!err) {
                    let { result } = response?.data;
                    queryState({ listBr: result?.map((e) => ({ label: e?.name, value: e?.id })) || [] });
                }
            })
    }, 500);

    useEffect(() => {
        fetDataOrder()
        fetchDataPlan()
        fetchDataBranch()
    }, []);

    const handleShow = (id) => {
        queryState({
            listDataLeft: isState.listDataLeft.map((e) => {
                const showParent = e.id == id ? !e.showParent : false;
                if (showParent) {
                    fetchisStateRight(id)
                } else {
                    queryState({
                        listDataRight: {
                            ...isState.listDataRight,
                            title: null,
                            dataPPItems: [],
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
                        fetchisState()
                        isShow("success", `${dataLang[message] || message}`);
                        return
                    }
                    isShow("error", `${dataLang[message] || message}`);
                }
            }
        );
        handleQueryId({ status: false });
    }


    const handShowItem = (id, type) => {
        queryState({
            listDataRight: {
                ...isState.listDataRight,
                [type]: isState.listDataRight?.[type]?.map(e => {
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
        queryState({ search: e.target.value, page: 1 })
    }, 500)

    const handDeleteItem = (id, type) => {
        queryState({ page: 1 })
        handleQueryId({ status: true, id: id, idChild: type })
    }

    const handleConfimDeleteItem = async () => {
        const type = {
            // dataKeepStock: `/api_web/Api_transfer/transfer/${isId}?csrf_protection=true`,
            // dataPurchases: `/api_web/Api_purchases/purchases/${isId}?csrf_protection=true`,
        }
        await Axios("DELETE", type[isIdChild], {},
            (err, response) => {
                if (!err) {
                    let { isSuccess, message } = response.data;
                    if (isSuccess) {
                        fetchisState(1)
                        queryState({ page: 1 })
                        isShow("success", dataLang[message] || message);
                    } else {
                        isShow("error", dataLang[message] || message);
                    }
                }
            }
        );
        handleQueryId({ status: false });
    }

    const handleShowModel = (item) => {
        queryState({ openModal: true, dataModal: item })
    }

    const shareProps = {
        isState,
        dataLang,
        handShowItem,
        handDeleteItem,
        isFetching,
        isState,
        queryState,
        handleShowModel
    };
    return (
        <React.Fragment>
            <FilterHeader {...shareProps} />
            <div className="!mt-[14px]">
                <h1 className="text-[#141522] font-medium text-sm my-2">{'Tổng số LSX'}: {isState?.countAll}</h1>
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
                                    placeholder={'Tìm lệnh sản xuất'}
                                />
                            </form>
                        </div>
                        <Customscrollbar
                            className="3xl:h-[65vh] xxl:h-[52vh] 2xl:h-[56.5vh] xl:h-[52.5vh] lg:h-[55vh] h-[35vh] overflow-y-auto  scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 "
                        >
                            {isState.listDataLeft.map((e, eIndex) => (
                                <div
                                    key={e.id}
                                    onClick={() => handleShow(e.id)}
                                    className={`py-2 pl-2 pr-3 ${e.showParent && "bg-[#F0F7FF]"
                                        } hover:bg-[#F0F7FF] cursor-pointer transition-all ease-linear ${isState.length - 1 == eIndex ? "border-b-none" : "border-b"
                                        } `}
                                >
                                    <div className="flex justify-between">
                                        <div className="flex flex-col gap-1">
                                            <h1 className="3xl:text-base xxl:text-base 2xl:text-sm xl:text-xs lg:text-xs text-sm font-medium text-[#0F4F9E]">
                                                {e.title}
                                            </h1>
                                            <h3 className="text-[#667085] font-normal text-[11px]">
                                                {dataLang?.materials_planning_create_on || 'materials_planning_create_on'}{" "}
                                                <span className="text-[#141522] font-medium 3xl:text-xs text-[11px]">
                                                    {e.time}
                                                </span>
                                            </h3>
                                        </div>
                                        <TagBranch className='w-fit h-fit'>{e?.nameBranch}</TagBranch>
                                    </div>
                                    {e.showParent && (
                                        <div className="flex flex-col gap-2 mt-1 w-full">
                                            <div className="flex items-center gap-1">
                                                <h3 className=" text-[#52575E] font-normal 3xl:text-sm text-xs">
                                                    {dataLang?.materials_planning_foloww_up || 'materials_planning_foloww_up'}:
                                                </h3>
                                                <div className="flex items-center gap-1">
                                                    {e.followUp.map((i) => (
                                                        <React.Fragment key={i.id}>
                                                            <h2 className="text-[#191D23] font-medium 3xl:text-sm text-xs">
                                                                {i.nameFollow}
                                                            </h2>
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="w-full flex items-center">
                                                {e.processBar.map((j, JIndex) => {
                                                    return (
                                                        <div key={j.id} className="flex flex-col w-full items-start">
                                                            <p className={`${j.active ? "text-[#0BAA2E]" : "text-gray-500"} font-normal 3xl:text-[10px] text-[9px] flex flex-col`}>
                                                                <span>{j.status}</span>
                                                                <span>({moment(j.date).format('DD/MM/YYYY')})</span>
                                                            </p>

                                                            <li className={`${JIndex == e.processBar.length - 1 ? 'flex w-full relative text-gray-900 '
                                                                :
                                                                `flex w-full relative text-gray-900  after:content-[''] after:w-full after:h-0.5 ${j.active ? 'after:bg-[#00C170]' : 'after:bg-gray-500'}   after:inline-block after:absolute after:top-1 after:left-[25px]`}`}
                                                            >
                                                                <div className="block whitespace-nowrap z-10">
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
                                            </div>

                                        </div>
                                    )}
                                </div>
                            ))}
                            {isState.next &&
                                <button type="button" onClick={() => queryState({ page: isState.page + 1 })} className="mx-auto text-sm block py-1 bg-blue-50 w-full hover:bg-blue-200 mt-1 transition-all duration-200 ease-linear">
                                    {dataLang?.materials_planning_see_more || 'materials_planning_see_more'}
                                </button>
                            }
                        </Customscrollbar>
                    </div>
                    <div className="w-[75%] border border-[#d8dae5] ">
                        <div className="flex items-center justify-between py-1 px-4 border-b">
                            <div className="">
                                <h1 className="text-[#52575E] font-normal text-xs uppercase">{'Lệnh sản xuất'}</h1>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-[#3276FA] font-medium 3xl:text-[20px] text-[16px] uppercase">
                                        {isState.listDataRight?.title ?? (dataLang?.materials_planning_no_nvl || 'materials_planning_no_nvl')}
                                    </h1>
                                    <span className="text-[#FF8F0D] bg-[#FEF8EC] text-xs pl-2 pr-4 py-2 rounded-2xl font-medium">
                                        <span className="bg-[#FF8F0D] h-2 w-2 rounded-full inline-block mr-2" />
                                        Chưa sản xuất</span>
                                </div>
                            </div>
                            <button
                                className=" bg-red-100 rounded-lg  outline-none focus:outline-none"
                                onClick={() => {
                                    if (+isState?.countAll == 0) {
                                        return isShow('error', dataLang?.materials_planning_please_add || 'materials_planning_please_add')
                                    }
                                    queryState({ page: 1 })
                                    handleQueryId({ status: true, id: isState.listDataRight?.idCommand })
                                }}
                            >
                                <div className="flex items-center gap-2 py-2 px-3 ">
                                    <RiDeleteBin5Line className="text-base text-red-600" />
                                    <h3 className="text-red-600 font-medium 3xl:text-base text-xs">
                                        Xóa
                                    </h3>
                                </div>
                            </button>
                        </div>
                        <div className="mx-4">
                            <div className="border-b my-6 ">
                                <div className="flex items-center gap-4 ">
                                    {listTab.map((e) => (
                                        <button
                                            key={e.id}
                                            onClick={() => handleActiveTab(e.type)}
                                            className={`hover:bg-[#F7FBFF] ${isState.isTab == e.type && "border-[#0F4F9E] border-b bg-[#F7FBFF]"
                                                } hover:border-[#0F4F9E] hover:border-b group transition-all duration-200 ease-linear outline-none focus:outline-none`}
                                        >
                                            <h3
                                                className={`py-[10px] px-2  font-normal ${isState.isTab == e.type ? "text-[#0F4F9E]" : "text-[#667085]"
                                                    } 3xl:text-base text-sm group-hover:text-[#0F4F9E] transition-all duration-200 ease-linear`}
                                            >
                                                {e.name}
                                            </h3>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <TabItem {...shareProps} />
                            </div>
                        </div>
                    </div>
                </div>
                <ModalFilter {...shareProps} />
            </div>
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                title={TITLE_DELETE_PRODUCTIONS_ORDER}
                subtitle={CONFIRM_DELETION}
                isOpen={isOpen}
                save={() => {
                    if (isIdChild) {
                        handleConfimDeleteItem()
                    } else {
                        handleConfim()
                    }
                }}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment>
    );
};
export default MainTable;
