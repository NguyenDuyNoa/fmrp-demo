import React, { useState } from "react";

import Head from "next/head";
import moment from "moment/moment";
import { useRouter } from "next/router";
import { _ServerInstance as Axios } from "/services/axios";
import { useEffect } from "react";
import { debounce } from "lodash";
import { Grid6, Grid6 as IconExcel, SearchNormal1 as IconSearch } from "iconsax-react";
import "react-datepicker/dist/react-datepicker.css";
import ModalImage from "react-modal-image";
import PopupDetail from "./components/PopupDetail";
import PopupDetailProduct from "../sales_order/components/PopupDetailProduct";

import Loading from "@/components/UI/loading";
import BtnAction from "@/components/UI/BtnAction";
import TabFilter from "@/components/UI/TabFilter";
import Pagination from "@/components/UI/pagination";
import ImageErrors from "@/components/UI/imageErrors";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import ButtonWarehouse from "@/components/UI/btnWarehouse/btnWarehouse";
import { routerDeliveryReceipt } from "routers/sellingGoods";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import useStatusExprired from "@/hooks/useStatusExprired";
import { CONFIRMATION_OF_CHANGES, TITLE_STATUS } from "@/constants/changeStatus/changeStatus";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import useSetingServer from "@/hooks/useConfigNumber";
import { useSelector } from "react-redux";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import DatepickerComponent from "@/components/UI/filterComponents/dateTodateComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import useActionRole from "@/hooks/useRole";

const Index = (props) => {

    const dataLang = props.dataLang;

    const router = useRouter();

    const isShow = useToast();

    const trangthaiExprired = useStatusExprired();

    const dataSeting = useSetingServer()

    const { isOpen, isKeyState, handleQueryId } = useToggle();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkExport } = useActionRole(auth, "deliveryReceipt")

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems()

    const [total, setTotal] = useState({});

    const initialState = {
        data: [],
        dataExcel: [],
        onFetching: false,
        onFetchingFilter: false,
        keySearch: "",
        listBr: [],
        listDelivery: [],
        listCustomer: [],
        idBranch: null,
        idDelivery: null,
        idCustomer: null,
        listTabStatus: [],
        valueDate: {
            startDate: null,
            endDate: null,
        }

    }
    const [isState, sIsState] = useState(initialState);

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const _HandleSelectTab = (e) => {
        router.push({
            pathname: router.route,
            query: { tab: e },
        });
    };

    useEffect(() => {
        router.push({
            pathname: router.route,
            query: { tab: router.query?.tab ? router.query?.tab : -1 },
        });
        queryState({ onFetchingFilter: true, onFetching: true });
    }, []);

    const _ServerFetching = () => {
        const tabPage = router.query?.tab;
        Axios(
            "GET",
            `/api_web/api_delivery/getDeliveries?csrf_protection=true`,
            {
                params: {
                    search: isState.keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    status: tabPage ? tabPage : -1,
                    branch_id: isState.idBranch != null ? isState.idBranch.value : null,
                    delivery_id: isState.idDelivery != null ? isState.idDelivery?.value : null,
                    customer_id: isState.idCustomer != null ? isState.idCustomer.value : null,
                    start_date: isState.valueDate?.startDate != null ? isState.valueDate?.startDate : null,
                    end_date: isState.valueDate?.endDate != null ? isState.valueDate?.endDate : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let { rResult, output, rTotal } = response.data.data;
                    sTotalItems(output);
                    setTotal(rTotal);
                    queryState({
                        data: rResult,
                        dataExcel: rResult,
                        onFetching: false
                    });

                }
            }
        );
    };
    // fetch tab filter
    const _ServerFetching_group = async () => {
        await Axios(
            "GET",
            `/api_web/api_delivery/statusDelivery?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                    search: isState.keySearch,
                    branch_id: isState.idBranch != null ? isState.idBranch.value : null,
                    delivery_id: isState.idDelivery != null ? isState.idDelivery?.value : null,
                    start_date: isState.valueDate?.startDate != null ? isState.valueDate?.startDate : null,
                    end_date: isState.valueDate?.endDate != null ? isState.valueDate?.endDate : null,
                    customer_id: isState.idCustomer != null ? isState.idCustomer.value : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let { data } = response.data;
                    queryState({ listTabStatus: data?.status, onFetchingFilter: false });
                }
            }
        );
    };

    // filter
    const convertArray = (arr) => {
        return arr?.map((e) => ({ label: e?.name, value: e?.id })) || [];
    }
    const _ServerFetching_filter = async () => {
        await Axios("GET", `/api_web/Api_Branch/branch/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let { rResult } = response.data;
                queryState({ listBr: convertArray(rResult) });
            }
        });
        await Axios("GET", `api_web/api_delivery/searchDeliveries?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let { data } = response?.data;
                queryState({ listDelivery: data?.orders?.map((e) => ({ label: e?.reference_no, value: e?.id })) || [] });
            }
        });
        await Axios("GET", "/api_web/api_client/searchClients?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let { data } = response.data;
                queryState({ listCustomer: convertArray(data?.clients) });
            }
        });
        queryState({ onFetchingFilter: false });
    };

    const handleSearchApiClient = debounce((value) => {
        Axios("GET", "/api_web/api_client/searchClients?csrf_protection=true", {
            params: {
                search: value ? value : "",
            },
        }, (err, response) => {
            if (!err) {
                let { data } = response?.data;
                queryState({ listCustomer: convertArray(data?.clients) });
            }
        }
        )
    }, 500)

    const handleSearchApiOrders = debounce((value) => {
        Axios("GET", "/api_web/api_delivery/searchDeliveries?csrf_protection=true", {
            params: {
                search: value ? value : "",
            },
        }, (err, response) => {
            if (!err) {
                let { data } = response?.data;
                queryState({ listDelivery: data?.orders?.map((e) => ({ label: e?.reference_no, value: e?.id })) || [] });
            }
        }
        )
    }, 500)



    useEffect(() => {
        isState.onFetchingFilter && _ServerFetching_filter();
    }, [isState.onFetchingFilter]);

    useEffect(() => {
        (isState.onFetching && _ServerFetching()) || (isState.onFetching && _ServerFetching_group());
    }, [isState.onFetching]);

    useEffect(() => {
        queryState({ onFetching: true });
    }, [limit, router.query?.page, router.query?.tab]);

    useEffect(() => {
        if (
            isState.idBranch != null ||
            (isState.valueDate?.startDate != null && isState.valueDate?.endDate != null) ||
            isState.idCustomer != null ||
            isState.idDelivery != null
        ) {
            router.push({
                pathname: router.route,
                query: {
                    tab: router.query?.tab,
                },
            });
            setTimeout(() => {
                queryState({ onFetching: true })
            }, 300);
        } else {
            queryState({ onFetching: true })
        }
    }, [limit, isState.idBranch, isState.keySearch, isState.idDelivery, isState.idCustomer, isState.valueDate?.endDate, isState.valueDate?.startDate]);


    const paginate = (pageNumber) => {
        router.push({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
                page: pageNumber,
            },
        });
    };

    const handleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryState({ keySearch: value });
        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            },
        });
        queryState({ onFetching: true });
    }, 500);

    const formatMoney = (number) => {
        return formatMoneyConfig(+number, dataSeting);
    };
    // excel
    const multiDataSet = [
        {
            columns: [
                {
                    title: "ID",
                    width: { wch: 4 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.delivery_receipt_date || "delivery_receipt_date"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.delivery_receipt_code || "delivery_receipt_code"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.customer || "customer"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.delivery_receipt_address1 || "delivery_receipt_address1"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.delivery_receipt_OrderNumber || "delivery_receipt_OrderNumber"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.delivery_receipt_intoMoney || "delivery_receipt_intoMoney"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.delivery_receipt_Creator || "delivery_receipt_Creator"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.delivery_receipt_BrowseStorekeepers || "delivery_receipt_BrowseStorekeepers"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.note || "note"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.branch || "branch"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],
            data: isState.dataExcel?.map((e) => [
                { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
                { value: `${e?.date ? e?.date : ""}` },
                { value: `${e?.reference_no ? e?.reference_no : ""}` },
                { value: `${e?.name_client ? e?.name_client : ""}` },
                {
                    value: `${e?.name_address_delivery ? e?.name_address_delivery : ""}`,
                },
                { value: `${e?.reference_no_order ? e?.reference_no_order : ""}` },
                {
                    value: `${e?.grand_total ? formatMoney(e?.grand_total) : 0}`,
                },
                { value: `${e?.created_by_full_name ? e?.created_by_full_name : ""}` },
                {
                    value: `${e?.warehouseman_id === "0" ? "Chưa duyệt kho" : "Đã duyệt kho"}`,
                },
                { value: `${e?.note ? e?.note : ""}` },
                { value: `${e?.name_branch ? e?.name_branch : ""}` },
            ]),
        },
    ];

    const [checkedWare, sCheckedWare] = useState({});
    const handleSaveStatus = () => {
        if (isKeyState?.type === "browser") {
            const checked = isKeyState.value.target.checked;
            const warehousemanId = isKeyState.value.target.value;
            const dataChecked = {
                checked: checked,
                warehousemanId: warehousemanId,
                id: isKeyState?.id,
                checkedpost: isKeyState?.checkedUn,
            };
            sCheckedWare(dataChecked);
            queryState({ data: [...isState.data] });
        }

        handleQueryId({ status: false });
    };

    const _HandleChangeInput = (id, checkedUn, type, value) => {
        handleQueryId({
            status: true,
            initialKey: { id, checkedUn, type, value },
        });
    };

    const _ServerSending = () => {
        let data = new FormData();
        data.append("warehouseman_id", checkedWare?.checkedpost != "0" ? checkedWare?.checkedpost : "");
        data.append("id", checkedWare?.id);
        Axios(
            "POST",
            `/api_web/Api_delivery/confirmWarehouse?csrf_protection=true`,
            {
                data: data,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    let { isSuccess, message, alert_type } = response?.data;
                    if (isSuccess) {
                        isShow(alert_type, dataLang[message] || message);
                        setTimeout(() => {
                            queryState({ onFetching: true });
                        }, 300);
                    } else {
                        isShow(alert_type, dataLang[message] || message);
                    }
                }
                queryState({ onSending: false });
            }
        );
    };

    useEffect(() => {
        isState.onSending && _ServerSending();
    }, [isState.onSending]);

    useEffect(() => {
        checkedWare.id != null && queryState({ onSending: true });
    }, [checkedWare]);

    useEffect(() => {
        checkedWare.id != null && queryState({ onSending: true });
    }, [checkedWare.id != null]);

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.delivery_receipt_list || "delivery_receipt_list"} </title>
            </Head>
            <div className="3xl:pt-[88px] 2xl:pt-[74px] xl:pt-[60px] lg:pt-[60px] 3xl:px-6 3xl:pb-10 2xl:px-4 2xl:pb-8 xl:px-4 xl:pb-10 px-4 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {trangthaiExprired ? (
                    <div className="p-4"></div>
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.delivery_receipt_list || "delivery_receipt_list"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.delivery_receipt_list || "delivery_receipt_list"}</h6>
                    </div>
                )}

                <div className="grid grid-cols gap-1 h-[100%] overflow-hidden">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-0.5 h-[96%] overflow-hidden">
                            <div className="flex justify-between  mt-1 mr-2">
                                <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                    {dataLang?.delivery_receipt_list || "delivery_receipt_list"}
                                </h2>
                                <button
                                    onClick={() => {
                                        if (role) {
                                            router.push(routerDeliveryReceipt.form)
                                        } else if (checkAdd) {
                                            router.push(routerDeliveryReceipt.form)
                                        }
                                        else {
                                            isShow("warning", WARNING_STATUS_ROLE)
                                        }
                                    }}
                                    type="button"
                                    className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                >
                                    {dataLang?.btn_new || "btn_new"}
                                </button>
                            </div>
                            <div className="flex 2xl:space-x-3 lg:space-x-3 items-center 3xl:h-[8vh] 2xl:h-[7vh] xl:h-[8vh] lg:h-[7vh] justify-start overflow-hidden scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                {isState.listTabStatus &&
                                    isState.listTabStatus.map((e) => {
                                        return (
                                            <div>
                                                <TabFilter
                                                    style={{
                                                        backgroundColor: "#e2f0fe",
                                                    }}
                                                    dataLang={dataLang}
                                                    key={e?.id}
                                                    onClick={_HandleSelectTab.bind(this, `${e?.id}`)}
                                                    total={e?.count}
                                                    active={e?.id}
                                                    className={"text-[#0F4F9E]"}
                                                >
                                                    {e?.name}
                                                </TabFilter>
                                            </div>
                                        );
                                    })}
                            </div>
                            {/* table */}
                            <div className="space-y-2 3xl:h-[92%] 2xl:h-[88%] xl:h-[95%] lg:h-[90%] overflow-hidden">
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded-t-lg items-center grid grid-cols-7 2xl:grid-cols-9 xl:col-span-8 lg:col-span-7 2xl:xl:p-2 xl:p-1.5 p-1.5">
                                        <div className="col-span-6 2xl:col-span-7 xl:col-span-5 lg:col-span-5">
                                            <div className="grid grid-cols-5 gap-2">
                                                <div className="col-span-1">
                                                    <SearchComponent dataLang={dataLang} placeholder={dataLang?.branch_search} onChange={handleOnChangeKeySearch.bind(this)} />
                                                </div>
                                                <div className="col-span-1">
                                                    <SelectComponent
                                                        options={[
                                                            {
                                                                value: "",
                                                                label: dataLang?.price_quote_branch || "price_quote_branch",
                                                                isDisabled: true,
                                                            },
                                                            ...isState.listBr,
                                                        ]}
                                                        onChange={(e) => queryState({ idBranch: e })}
                                                        value={isState.idBranch}
                                                        placeholder={dataLang?.price_quote_branch || "price_quote_branch"}
                                                        // placeholder={dataLang?.price_quote_select_branch || "price_quote_select_branch"}
                                                        isClearable={true}
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <SelectComponent
                                                        options={[
                                                            {
                                                                value: "",
                                                                label: dataLang?.delivery_receipt_code || "delivery_receipt_code",
                                                                isDisabled: true,
                                                            },
                                                            ...isState.listDelivery,
                                                        ]}
                                                        onInputChange={handleSearchApiOrders.bind(this)}
                                                        onChange={(e) => queryState({ idDelivery: e })}
                                                        value={isState.idDelivery}
                                                        placeholder={dataLang?.delivery_receipt_code || "delivery_receipt_code"}
                                                        isClearable={true}
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <SelectComponent
                                                        options={[
                                                            {
                                                                value: "",
                                                                label: dataLang?.price_quote_customer || "price_quote_customer",
                                                                isDisabled: true,
                                                            },
                                                            ...isState.listCustomer,
                                                        ]}
                                                        onChange={(e) => queryState({ idCustomer: e })}
                                                        value={isState.idCustomer}
                                                        onInputChange={handleSearchApiClient.bind(this)}
                                                        placeholder={dataLang?.price_quote_customer || "price_quote_customer"}
                                                        // placeholder={dataLang?.price_quote_select_customer || "price_quote_select_customer"}
                                                        isClearable={true}
                                                    />
                                                </div>
                                                <div className="z-20 col-span-1">
                                                    <DatepickerComponent value={isState.valueDate} onChange={(e) => queryState({ valueDate: e })} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-1 xl:col-span-2 lg:col-span-2">
                                            <div className="flex justify-end items-center gap-2">
                                                <OnResetData sOnFetching={(e) => queryState({ onFetching: e })} />
                                                {(role == true || checkExport) ?
                                                    <div className={``}>
                                                        {isState.dataExcel?.length > 0 && (
                                                            <ExcelFileComponent dataLang={dataLang}
                                                                filename={dataLang?.delivery_receipt_list || "delivery_receipt_list"}
                                                                title={'DSPGH'}
                                                                multiDataSet={multiDataSet}
                                                            />)}
                                                    </div>
                                                    :
                                                    <button onClick={() => isShow('warning', WARNING_STATUS_ROLE)} className={`xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}>
                                                        <Grid6 className="2xl:scale-100 xl:scale-100 scale-75" size={18} />
                                                        <span>{dataLang?.client_list_exportexcel}</span>
                                                    </button>
                                                }
                                                <div>
                                                    <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="min:h-[200px] 3xl:h-[82%] 2xl:h-[82%] xl:h-[72%] lg:h-[82%] max:h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className="w-[100%] lg:w-[100%] ">
                                        <div className="grid grid-cols-12 items-center sticky top-0 p-2 z-10 rounded-xl shadow-sm bg-white divide-x">
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.delivery_receipt_date || "delivery_receipt_date"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.delivery_receipt_code || "delivery_receipt_code"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-2 text-center">
                                                {dataLang?.price_quote_customer || "price_quote_table_customer"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.delivery_receipt_address1 || "delivery_receipt_address1"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.delivery_receipt_OrderNumber ||
                                                    "delivery_receipt_OrderNumber"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.price_quote_into_money || "price_quote_into_money"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.delivery_receipt_Creator || "delivery_receipt_Creator"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.delivery_receipt_BrowseStorekeepers ||
                                                    "delivery_receipt_BrowseStorekeepers"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.price_quote_note || "price_quote_note"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.price_quote_branch || "price_quote_branch"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.price_quote_operations || "price_quote_operations"}
                                            </h4>
                                        </div>
                                        {isState.onFetching ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : isState.data?.length > 0 ? (
                                            <>
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px] ">
                                                    {isState.data?.map((e) => (
                                                        <div
                                                            className="relative grid grid-cols-12 items-center py-1.5 px-2 hover:bg-slate-100/40"
                                                            key={e.id.toString()}
                                                        >
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-center">
                                                                {e?.date != null
                                                                    ? moment(e?.date).format("DD/MM/YYYY")
                                                                    : ""}
                                                            </h6>

                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px]  px-2 col-span-1 text-center text-[#0F4F9E] hover:text-blue-500 transition-all ease-linear  cursor-pointer">
                                                                <PopupDetail
                                                                    dataLang={dataLang}
                                                                    className="text-left"
                                                                    name={e?.reference_no}
                                                                    id={e?.id}
                                                                />
                                                            </h6>

                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-2 text-left ">
                                                                {e.name_client}
                                                            </h6>

                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-left">
                                                                {e.name_address_delivery}
                                                            </h6>
                                                            <PopupDetailProduct
                                                                dataLang={dataLang}
                                                                className="text-left"
                                                                name={
                                                                    <h1 className="col-span-1 3xl:text-[14px] 2xl:text-[12.5px] xl:text-[11px] font-normal text-[9px] text-[#0BAA2E] bg-[#EBFEF2] hover:bg-[#0BAA2E]/90 hover:text-[#EBFEF2] py-0.5 rounded-2xl border-[#0BAA2E]/5 border  cursor-pointer transition-all ease-in-out duration-200 text-center ">
                                                                        {e?.reference_no_order}
                                                                    </h1>
                                                                }
                                                                id={e?.order_id}
                                                            />
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-right">
                                                                {formatMoney(e.grand_total)}
                                                            </h6>

                                                            <h6 className="col-span-1 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-1  rounded-md text-left flex items-center space-x-1">
                                                                <div className="relative">
                                                                    <ModalImage
                                                                        small={
                                                                            e?.created_by_profile_image
                                                                                ? e?.created_by_profile_image
                                                                                : "/user-placeholder.jpg"
                                                                        }
                                                                        large={
                                                                            e?.created_by_profile_image
                                                                                ? e?.created_by_profile_image
                                                                                : "/user-placeholder.jpg"
                                                                        }
                                                                        className="h-6 w-6 rounded-full object-cover "
                                                                    >
                                                                        <div className="">
                                                                            <ImageErrors
                                                                                src={e?.created_by_profile_image}
                                                                                width={25}
                                                                                height={25}
                                                                                defaultSrc="/user-placeholder.jpg"
                                                                                alt="Image"
                                                                                className="object-cover  rounded-[100%] text-left cursor-pointer"
                                                                            />
                                                                        </div>
                                                                    </ModalImage>
                                                                    <span className="h-2 w-2 absolute 3xl:bottom-full 3xl:translate-y-[150%] 3xl:left-1/2  3xl:translate-x-[100%] 2xl:bottom-[80%] 2xl:translate-y-full 2xl:left-1/2 bottom-[50%] left-1/2 translate-x-full translate-y-full">
                                                                        <span className="inline-flex relative rounded-full h-2 w-2 bg-lime-500">
                                                                            <span className="animate-ping  inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 absolute"></span>
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                                <h6 className="capitalize">
                                                                    {e?.created_by_full_name}
                                                                </h6>
                                                            </h6>

                                                            <h6 className=" 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1">
                                                                <ButtonWarehouse
                                                                    warehouseman_id={e?.warehouseman_id}
                                                                    _HandleChangeInput={_HandleChangeInput}
                                                                    id={e?.id}
                                                                />
                                                            </h6>

                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-right truncate">
                                                                {e?.note}
                                                            </h6>
                                                            <h6 className="col-span-1 w-fit mx-auto">
                                                                <div className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">
                                                                    {e?.name_branch}
                                                                </div>
                                                            </h6>

                                                            <div className="col-span-1 flex justify-center">
                                                                <BtnAction
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    onRefreshGroup={_ServerFetching_group.bind(this)}
                                                                    dataLang={dataLang}
                                                                    warehouseman_id={e?.warehouseman_id}
                                                                    id={e?.id}
                                                                    type="deliveryReceipt"
                                                                    className="bg-slate-100 xl:px-4 px-2 xl:py-1.5 py-1 rounded 2xl:text-base xl:text-xs text-[9px]"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className=" max-w-[352px] mt-24 mx-auto">
                                                <div className="text-center">
                                                    <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                                                        <IconSearch />
                                                    </div>
                                                    <h1 className="textx-[#141522] text-base opacity-90 font-medium">
                                                        {dataLang?.price_quote_table_item_not_found ||
                                                            "price_quote_table_item_not_found"}
                                                    </h1>
                                                    <div className="flex items-center justify-around mt-6 "></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 bg-gray-100 items-center">
                            <div className="col-span-5 p-2 text-center">
                                <h3 className="uppercase font-normal 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px]">
                                    {dataLang?.total_outside || "total_outside"}
                                </h3>
                            </div>
                            <div className="col-span-2 text-right justify-end pr-4 flex gap-2 flex-wrap ">
                                <h3 className="font-normal 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px] px-1">
                                    {formatMoney(total?.grand_total)}
                                </h3>
                            </div>
                            <div className="col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap">
                                <h3 className="font-normal 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px]"></h3>
                            </div>
                        </div>
                        {isState.data?.length != 0 && (
                            <div className="flex space-x-5 items-center my-2 3xl:text-[18px] 2xl:text-[16px] xl:text-[14px] lg:text-[14px]">
                                <h6>
                                    {/* {dataLang?.price_quote_total_outside} {totalItems?.iTotalDisplayRecords}{" "}
                                    {dataLang?.delivery_receipt_edit_notes || "delivery_receipt_edit_notes"} */}
                                    {dataLang?.display} {totalItems?.iTotalDisplayRecords} {dataLang?.ingredient}
                                </h6>
                                <Pagination
                                    postsPerPage={limit}
                                    totalPosts={Number(totalItems?.iTotalDisplayRecords)}
                                    paginate={paginate}
                                    currentPage={router.query?.page ? router.query?.page : 1}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                nameModel={"deliveryReceipt"}
                title={TITLE_STATUS}
                subtitle={CONFIRMATION_OF_CHANGES}
                isOpen={isOpen}
                save={handleSaveStatus}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment>
    );
};

export default Index;
