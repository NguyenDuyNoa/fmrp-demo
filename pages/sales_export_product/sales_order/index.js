import vi from "date-fns/locale/vi";
import React, { useState, useEffect } from "react";

import Head from "next/head";
import { debounce } from "lodash";
import moment from "moment/moment";
import { useRouter } from "next/router";
import { registerLocale } from "react-datepicker";
import { _ServerInstance as Axios } from "/services/axios";
import { Grid6, Grid6 as IconExcel, SearchNormal1 as IconSearch, TickCircle } from "iconsax-react";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("vi", vi);

import PopupDetailProduct from "./components/PopupDetailProduct";
import PopupDetailQuote from "../price_quote/components/PopupDetailQuote";

import Loading from "@/components/UI/loading";
import BtnAction from "@/components/UI/BtnAction";
import TabFilter from "@/components/UI/TabFilter";
import Pagination from "@/components/UI/pagination";
import Zoom from "@/components/UI/zoomElement/zoomElement";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import useStatusExprired from "@/hooks/useStatusExprired";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import { CONFIRMATION_OF_CHANGES, TITLE_STATUS } from "@/constants/changeStatus/changeStatus";
import { routerSalesOrder } from "@/routers/sellingGoods";
import formatMoney from "@/utils/helpers/formatMoney";
import { useSelector } from "react-redux";
import useSetingServer from "@/hooks/useConfigNumber";
import BtnStatusApproved from "@/components/UI/btnStatusApproved/BtnStatusApproved";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import DatepickerComponent from "@/components/UI/filterComponents/dateTodateComponent";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import useActionRole from "@/hooks/useRole";
import { Container, ContainerBody, ContainerFilterTab, ContainerTable, ContainerTotal } from "@/components/UI/common/layout";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import NoData from "@/components/UI/noData/nodata";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { TagColorLime, TagColorOrange, TagColorSky } from "@/components/UI/common/Tag/TagStatus";


const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const initialValue = {
        idBranch: null,
        idQuoteCode: null,
        idCustomer: null,
        valueDate: {
            startDate: null,
            endDate: null,
        },
    };
    const initialData = {
        data: [],
        dataExcel: [],
        listBr: [],
        listQuoteCode: [],
        listCustomer: [],
        listTabStatus: [],
    };

    const isShow = useToast();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkExport } = useActionRole(auth, "sales_product")

    const dataSeting = useSetingServer()

    const trangthaiExprired = useStatusExprired();

    const { isOpen, isId, isIdChild: status, handleQueryId } = useToggle();

    const [initData, sInitData] = useState(initialData);

    const [valueChange, sValueChange] = useState(initialValue);

    const [onFetching, sOnFetching] = useState(false);

    const [onFetchingGroup, sOnFetchingGroup] = useState(false);

    const [onFetching_filter, sOnFetching_filter] = useState(false);

    const [keySearch, sKeySearch] = useState("");

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems()

    const [total, setTotal] = useState({});

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleShowAll = () => setIsExpanded(!isExpanded);

    const _HandleSelectTab = (e) => {
        router.push({
            pathname: router.route,
            query: { tab: e },
        });
    };

    useEffect(() => {
        router.push({
            pathname: router.route,
            query: { tab: router.query?.tab ? router.query?.tab : "all" },
        });
    }, []);
    useEffect(() => {
        dataSeting?.tables_pagination_limit && sLimit(dataSeting?.tables_pagination_limit)
    }, [dataSeting?.tables_pagination_limit]);

    const _ServerFetching = () => {
        const tabPage = router.query?.tab;
        Axios(
            "GET",
            `/api_web/Api_sale_order/saleOrder/?csrf_protection=true`,
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id]": valueChange.idBranch != null ? valueChange.idBranch.value : null,
                    "filter[status_bar]": tabPage ?? null,
                    "filter[id]": valueChange.idQuoteCode != null ? valueChange.idQuoteCode?.value : null,
                    "filter[client_id]": valueChange.idCustomer != null ? valueChange.idCustomer.value : null,
                    "filter[start_date]":
                        valueChange.valueDate?.startDate != null ? valueChange.valueDate?.startDate : null,
                    "filter[end_date]": valueChange.valueDate?.endDate != null ? valueChange.valueDate?.endDate : null,
                },
            },
            (err, response) => {
                if (!err && response && response.data) {
                    let { rResult, output, rTotal } = response?.data;
                    sInitData((e) => ({ ...e, data: rResult?.map((e) => ({ ...e, show: false })), dataExcel: rResult }));
                    sTotalItems(output);
                    setTotal(rTotal);
                    sOnFetching(false);
                }
            }
        );
    };
    // fetch tab filter
    const _ServerFetching_group = async () => {
        await Axios(
            "GET",
            `/api_web/Api_sale_order/filterBar?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                    search: keySearch,
                    "filter[branch_id]": valueChange.idBranch != null ? valueChange.idBranch.value : null,
                    "filter[id]": valueChange.idQuoteCode != null ? valueChange.idQuoteCode?.value : null,
                    "filter[client_id]": valueChange.idCustomer != null ? valueChange.idCustomer.value : null,
                    "filter[start_date]":
                        valueChange.valueDate?.startDate != null ? valueChange.valueDate?.startDate : null,
                    "filter[end_date]": valueChange.valueDate?.endDate != null ? valueChange.valueDate?.endDate : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let data = response.data;
                    sInitData((e) => ({ ...e, listTabStatus: data || [] }));
                }
                sOnFetchingGroup(false);
            }
        );
    };

    // filter
    const _ServerFetching_filter = async () => {
        await Axios("GET", `/api_web/Api_Branch/branch/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let { rResult } = response.data;
                sInitData((e) => ({ ...e, listBr: rResult?.map(({ name, id }) => ({ label: name, value: id })) }));
            }
        });
        await Axios("GET", `/api_web/api_sale_order/searchOrders?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let { data } = response?.data;
                sInitData((e) => ({
                    ...e,
                    listQuoteCode: data?.orders?.map(({ reference_no, id }) => ({ label: reference_no, value: id })),
                }));
            }
        });
        await Axios("GET", "/api_web/api_client/searchClients?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let { data } = response?.data;
                sInitData((e) => ({
                    ...e,
                    listCustomer: data?.clients?.map(({ name, id }) => ({ label: name, value: id })),
                }));

            }
        });

        sOnFetching_filter(false);
    };

    const handleSearchApi = debounce((value) => {
        Axios("GET", "/api_web/api_client/searchClients?csrf_protection=true", {
            params: {
                search: value ? value : "",
            },
        }, (err, response) => {
            if (!err) {
                let { data } = response?.data;
                sInitData((e) => ({
                    ...e,
                    listCustomer: data?.clients?.map(({ name, id }) => ({ label: name, value: id })),
                }));
            }
        }
        )
    }, 500)

    const handleSearchApiOrders = debounce((value) => {
        Axios("GET", `/api_web/api_sale_order/searchOrders?csrf_protection=true`, {
            params: {
                search: value ? value : "",
            },
        }, (err, response) => {
            if (!err) {
                let { data } = response?.data;
                sInitData((e) => ({
                    ...e,
                    listQuoteCode: data?.orders?.map(({ reference_no, id }) => ({ label: reference_no, value: id })),
                }));
            }
        });
    }, 500)

    useEffect(() => {
        (onFetching && _ServerFetching())
    }, [onFetching]);

    useEffect(() => {
        onFetching_filter && _ServerFetching_filter();
    }, [onFetching_filter]);

    useEffect(() => {
        sOnFetchingGroup(true)
    }, [valueChange.idBranch, valueChange.idQuoteCode, valueChange.idCustomer, valueChange.valueDate?.startDate, valueChange.valueDate?.endDate])

    useEffect(() => {
        onFetchingGroup && _ServerFetching_group()
    }, [onFetchingGroup])

    useEffect(() => {
        sOnFetching_filter(true)
    }, [])

    useEffect(() => {
        (router.query.tab && sOnFetching(true))
    }, [limit, router.query?.page, router.query?.tab]);

    useEffect(() => {
        if (
            valueChange.idBranch != null ||
            (valueChange.valueDate.startDate != null && valueChange.valueDate.endDate != null) ||
            valueChange.idCustomer != null ||
            valueChange.idQuoteCode != null
        ) {
            router.push({
                pathname: router.route,
                query: {
                    tab: router.query?.tab,
                },
            });
            setTimeout(() => {
                (valueChange.idBranch != null && sOnFetching(true)) ||
                    (valueChange.valueDate.startDate != null &&
                        valueChange.valueDate.endDate != null &&
                        sOnFetching(true)) ||
                    (valueChange.idCustomer != null && sOnFetching(true)) ||
                    (valueChange.idQuoteCode != null && sOnFetching(true)) ||
                    (keySearch && sOnFetching(true));
            }, 300);
        } else {
            sOnFetching(true);
        }
    }, [
        limit,
        valueChange.idBranch,
        valueChange.idQuoteCode,
        valueChange.idCustomer,
        valueChange.valueDate.endDate,
        valueChange.valueDate.startDate,
    ]);

    const onChangeFilter = (type) => (event) => sValueChange((e) => ({ ...e, [type]: event }));

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
        sKeySearch(value);
        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            },
        });
        sOnFetching(true);
    }, 500);

    const formatNumber = (number) => {
        const money = formatMoney(+number, dataSeting)
        return money
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
                    title: `${dataLang?.sales_product_date || "sales_product_date"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.sales_product_code || "sales_product_code"}`,
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
                    title: `${dataLang?.sales_product_type_order || "sales_product_type_order"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.sales_product_quote || "sales_product_quote"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.sales_product_total || "sales_product_total"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.sales_product_staff_in_charge || "sales_product_staff_in_charge"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.status_table || "status_table"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.sales_product_order_process || "sales_product_order_process"}`,
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
            data: initData.dataExcel?.map((e) => [
                { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
                { value: `${e?.date ? e?.date : ""}` },
                { value: `${e?.code ? e?.code : ""}` },
                { value: `${e?.client_name ? e?.client_name : ""}` },
                {
                    value: `${e?.quote_code !== null && e?.quote_id !== "0" ? "Phiếu báo giá" : "Tạo mới"}`,
                },
                { value: `${e?.quote_code ? e?.quote_code : ""}` },

                {
                    value: `${e?.total_amount ? formatNumber(e?.total_amount) : 0}`,
                },
                { value: `${e?.staff_name ? e?.staff_name : ""}` },
                {
                    value: `${e?.status
                        ? (e?.status === "un_approved" && "Chưa duyệt") || (e?.status === "approved" && "Đã duyệt")
                        : ""
                        }`,
                },
                { value: `${e?.process ? e?.process : ""}` },
                { value: `${e?.note ? e?.note : ""}` },

                { value: `${e?.branch_name ? e?.branch_name : ""}` },
            ]),
        },
    ];

    const toggleStatus = () => {
        const index = initData.data.findIndex((x) => x.id === isId);

        let newStatus = "";

        if (initData.data[index].status === "approved") {
            newStatus = "un_approved";
        } else if (initData.data[index].status === "un_approved") {
            newStatus = "approved";
        }

        handlePostStatus(isId, newStatus);

        handleQueryId({ status: false });
    };

    const handlePostStatus = (id, newStatus) => {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("status", newStatus);

        Axios(
            "POST",
            `/api_web/Api_sale_order/confirm/${id}/${newStatus}?csrf_protection=true`,
            {
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    let { isSuccess, message } = response.data;

                    if (isSuccess) {
                        isShow("success", `${dataLang?.change_status_when_order || "change_status_when_order"}` || message);
                    } else {
                        isShow("error", `${dataLang[message]}` || message);
                    }
                    _ServerFetching();
                    _ServerFetching_group();
                }
            }
        );
    };

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.sales_product_list || "sales_product_list"} </title>
            </Head>
            <Container>
                {trangthaiExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.sales_product_list || "sales_product_list"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.sales_product_list || "sales_product_list"}</h6>
                    </div>

                )}

                <ContainerBody>
                    <div className="space-y-0.5 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.sales_product_list || "sales_product_list"}
                            </h2>
                            <div className={` flex justify-end items-center`}>
                                <button
                                    onClick={() => {
                                        if (role) {
                                            router.push(routerSalesOrder.form)
                                        } else if (checkAdd) {
                                            router.push(routerSalesOrder.form)
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
                        </div>
                        <ContainerFilterTab>
                            {initData?.listTabStatus &&
                                initData?.listTabStatus?.map((e) => {
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
                                                {dataLang[e?.name]}
                                            </TabFilter>
                                        </div>
                                    );
                                })}
                        </ContainerFilterTab>
                        {/* table */}
                        <ContainerTable>
                            {/* combobox search, excel */}
                            <div className="xl:space-y-1 space-y-2">
                                <div className="bg-slate-100 w-full rounded-t-lg items-center grid grid-cols-7 2xl:grid-cols-9 xl:col-span-8 lg:col-span-7 2xl:xl:p-2 xl:p-1.5 p-1.5">
                                    <div className="col-span-6 2xl:col-span-7 xl:col-span-5 lg:col-span-5">
                                        <div className="grid grid-cols-5 gap-2">
                                            <div className="col-span-1">
                                                <SearchComponent dataLang={dataLang} onChange={handleOnChangeKeySearch} />
                                            </div>
                                            <div className="col-span-1">
                                                <SelectComponent
                                                    options={[
                                                        {
                                                            value: "",
                                                            label: dataLang?.price_quote_branch || "price_quote_branch",
                                                            isDisabled: true,
                                                        },
                                                        ...initData.listBr,
                                                    ]}
                                                    onChange={onChangeFilter("idBranch")}
                                                    value={valueChange.idBranch}
                                                    placeholder={dataLang?.price_quote_branch || "price_quote_branch"}
                                                    isClearable={true}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <SelectComponent
                                                    isLoading={initData.listQuoteCode == [] ? true : false}
                                                    options={[
                                                        {
                                                            value: "",
                                                            label: dataLang?.sales_product_code || "sales_product_code",
                                                            isDisabled: true,
                                                        },
                                                        ...initData.listQuoteCode,
                                                    ]}
                                                    onChange={onChangeFilter("idQuoteCode")}
                                                    onInputChange={handleSearchApiOrders}
                                                    value={valueChange.idQuoteCode}
                                                    placeholder={
                                                        dataLang?.sales_product_code || "sales_product_code"
                                                    }
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
                                                        ...initData.listCustomer,
                                                    ]}
                                                    onInputChange={handleSearchApi}
                                                    onChange={onChangeFilter("idCustomer")}
                                                    value={valueChange.idCustomer}
                                                    placeholder={dataLang?.price_quote_customer || "price_quote_customer"}
                                                    isClearable={true}
                                                />
                                            </div>
                                            <div className="z-20 col-span-1">
                                                <DatepickerComponent value={valueChange.valueDate} onChange={onChangeFilter("valueDate")} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-1 xl:col-span-2 lg:col-span-2">
                                        <div className="flex justify-end items-center gap-2">
                                            <OnResetData sOnFetching={sOnFetching} />
                                            {(role == true || checkExport) ?
                                                <div className={``}>
                                                    {initData.dataExcel?.length > 0 && (
                                                        <ExcelFileComponent dataLang={dataLang} filename="Danh sách đơn hàng bán" title="DSĐHB" multiDataSet={multiDataSet} />
                                                    )}
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

                            {/* table */}
                            <Customscrollbar className="min:h-[200px] 3xl:h-[82%] 2xl:h-[82%] xl:h-[72%] lg:h-[82%] max:h-[400px]">
                                <div className="w-full">
                                    <HeaderTable gridCols={13}>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.sales_product_date || "sales_product_date"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.sales_product_code || "sales_product_code"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'left'}>
                                            {dataLang?.customer || "customer"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.sales_product_type_order || "sales_product_type_order"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.sales_product_total_into_money ||
                                                "sales_product_total_into_money"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.sales_product_status || "sales_product_status"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.sales_product_statusTT || "sales_product_statusTT"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.branch || "branch"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={4} textAlign={'center'}>
                                            {dataLang?.sales_product_order_process || "sales_product_order_process"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.sales_product_action || "sales_product_action"}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {/* {loading ? */}
                                    {onFetching ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : initData.data?.length > 0 ? (
                                        <>
                                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px] ">
                                                {initData.data?.map((e) => (
                                                    <>
                                                        <RowTable gridCols={13} key={e.id.toString()}>
                                                            <RowItemTable colSpan={1} textAlign='center'>
                                                                {e?.date != null
                                                                    ? moment(e?.date).format("DD/MM/YYYY")
                                                                    : ""}
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={1} textAlign={'center'}>
                                                                <PopupDetailProduct
                                                                    dataLang={dataLang}
                                                                    className="3xl:text-base font-medium 2xl:text-[12.5px] xl:text-[11px] text-[9px] px-2 col-span-1 text-center text-[#0F4F9E] hover:text-blue-500 transition-all duration-200 ease-in-out cursor-pointer" name={e?.code ? e?.code : ""}
                                                                    id={e?.id}
                                                                />
                                                            </RowItemTable>

                                                            <RowItemTable colSpan={1} textAlign='left'>
                                                                {e?.client_name}
                                                            </RowItemTable>

                                                            {/* fix */}
                                                            <RowItemTable colSpan={1} textAlign={'center'}>
                                                                {e?.quote_code !== null && e?.quote_id !== "0" ? (
                                                                    // <div className="border  rounded-xl mx-auto w-2/3 group bg-lime-200 border-lime-200 text-lime-500">
                                                                    <Zoom
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                    >
                                                                        <div className="3xl:text-[11px] 2xl:text-[10px] xl:text-[8px] text-[7px] border font-medium flex justify-center items-center rounded-2xl mx-auto  px-3 py-0 bg-lime-200 border-lime-200 text-lime-500 ">
                                                                            {/* <div>Phiếu báo giá</div> */}
                                                                            {/* {"("}
                                                                            <PopupDetailQuote
                                                                                dataLang={dataLang}
                                                                                className="text-left group-hover:text-green-500"
                                                                                name={e?.quote_code ? e.quote_code : ""}
                                                                                id={e?.quote_id}
                                                                            />
                                                                            {")"} */}

                                                                            <PopupDetailQuote
                                                                                dataLang={dataLang}
                                                                                className="text-left "
                                                                                name={"Phiếu báo giá"}
                                                                                id={e?.quote_id}
                                                                            />
                                                                        </div>
                                                                    </Zoom>
                                                                ) : (
                                                                    <div className="3xl:text-[11px] 2xl:text-[10px] xl:text-[8px] text-[7px] border font-medium flex justify-center items-center rounded-2xl mx-auto w-fit px-3 py-0 bg-red-200 border-red-200 text-red-500">
                                                                        Tạo mới
                                                                    </div>
                                                                )}
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={1} textAlign={'right'}>
                                                                {formatNumber(e.total_amount)}
                                                            </RowItemTable>

                                                            <RowItemTable colSpan={1} textAlign={'center'}>
                                                                <h6 className="flex items-center justify-center text-center cursor-pointer">
                                                                    {(e?.status === "approved" && (
                                                                        <BtnStatusApproved
                                                                            onClick={() =>
                                                                                handleQueryId({
                                                                                    id: e?.id,
                                                                                    status: true,
                                                                                    idChild: "approved",
                                                                                })
                                                                            }
                                                                            type="1"
                                                                        />
                                                                    )) ||
                                                                        (e?.status === "un_approved" && (
                                                                            <BtnStatusApproved
                                                                                onClick={() =>
                                                                                    handleQueryId({
                                                                                        id: e?.id,
                                                                                        status: true,
                                                                                        idChild: "un_approved",
                                                                                    })
                                                                                }
                                                                                type="0"
                                                                            />

                                                                        ))}
                                                                </h6>
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={1} className={'flex items-center justify-center'}>
                                                                {(["payment_unpaid"].includes(
                                                                    e?.status_payment
                                                                ) && (
                                                                        <TagColorSky className={''} name={dataLang[e?.status_payment] || e?.status_payment} />
                                                                    )) ||
                                                                    (["payment_partially_paid"].includes(
                                                                        e?.status_payment
                                                                    ) && (
                                                                            <TagColorOrange className={''} name={`${dataLang[e?.status_payment] ||
                                                                                e?.status_payment} (${formatNumber(e?.total_payment)})`} />
                                                                        )) ||
                                                                    (["payment_paid"].includes(
                                                                        e?.status_payment
                                                                    ) && (
                                                                            <TagColorLime name={dataLang[e?.status_payment] || e?.status_payment} />

                                                                        ))}
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={1} className="w-fit mx-auto">
                                                                <TagBranch>
                                                                    {e?.branch_name}
                                                                </TagBranch>
                                                            </RowItemTable>

                                                            <RowItemTable colSpan={4}>
                                                                <div className="flex items-start py-2 ml-3">
                                                                    {e?.process.map((item, i) => {
                                                                        const isValue = [
                                                                            "production_plan",
                                                                            "produced_at_company",
                                                                            "import_warehouse",
                                                                            "delivery",
                                                                        ].includes(item?.code);

                                                                        const isValueDelivery = [
                                                                            "delivery",
                                                                        ].includes(item?.code);

                                                                        return (
                                                                            <>
                                                                                <div
                                                                                    className="relative"
                                                                                    key={`process-${i}`}
                                                                                >
                                                                                    {![
                                                                                        "keep_stock",
                                                                                        "import_outsourcing",
                                                                                    ].includes(item?.code) && (
                                                                                            <>
                                                                                                <div className="flex items-center">
                                                                                                    <div
                                                                                                        className={`${item?.active
                                                                                                            ? `h-2 w-2 rounded-full bg-green-500`
                                                                                                            : `h-2 w-2 rounded-full bg-gray-400`
                                                                                                            } `}
                                                                                                    />
                                                                                                    {!isValueDelivery && (
                                                                                                        <div
                                                                                                            className={`${item?.active
                                                                                                                ? `w-full bg-green-500 h-0.5 `
                                                                                                                : `w-full bg-gray-200 h-0.5 dark:bg-gray-400`
                                                                                                                }`}
                                                                                                        />
                                                                                                    )}
                                                                                                </div>
                                                                                                <div className="mt-2 3xl:w-[120px] xxl:w-[90px] 2xl:w-[90px] xl:w-[70px] lg:w-[50px]">
                                                                                                    <div
                                                                                                        className={`${item?.active
                                                                                                            ? "text-green-500"
                                                                                                            : "text-slate-500"
                                                                                                            } block w-full text-center mb-2 3xl:text-[10px] xxl:text-[8px] 2xl:text-[8px] xl:text-[6px] lg:text-[5px] font-semibold leading-none  dark:text-gray-500 absolute 3xl:translate-x-[-38%] 2xl:translate-x-[-40%] xl:translate-x-[-40%] translate-x-[-40%] 3xl:translate-y-[-10%] 2xl:translate-y-[-20%] xl:translate-y-[-20%] translate-y-[-20%]`}
                                                                                                    >
                                                                                                        <div className="flex justify-center items-center w-full gap-1">
                                                                                                            <h6>
                                                                                                                {
                                                                                                                    dataLang[
                                                                                                                    item
                                                                                                                        ?.name
                                                                                                                    ]
                                                                                                                }
                                                                                                            </h6>
                                                                                                            {isValueDelivery && (
                                                                                                                <h6
                                                                                                                    className={`${item?.active &&
                                                                                                                        isValueDelivery
                                                                                                                        ? "text-green-500"
                                                                                                                        : "text-orange-500"
                                                                                                                        } 3xl:text-[8px] xxl:text-[7px] 2xl:text-[7px] xl:text-[6px] lg:text-[4.5px] text-[6px]`}
                                                                                                                >{`(${dataLang[
                                                                                                                    item
                                                                                                                        ?.status
                                                                                                                ] ||
                                                                                                                    item?.status
                                                                                                                    })`}</h6>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </>
                                                                                        )}
                                                                                    <p className="text-blue-700 cursor-pointer  3xl:text-[9.5px] xxl:text-[9px] 2xl:text-[9px] xl:text-[7.5px] lg:text-[6px] text-[7px]  left-0 3xl:-translate-x-[15%] 2xl:-translate-x-1/4 xl:-translate-x-1/4 lg:-translate-x-1/4 -translate-x-1/4 py-2 font-semibold">
                                                                                        {/* <p className="text-blue-700 cursor-pointer  3xl:text-[9.5px] xxl:text-[9px] 2xl:text-[9px] xl:text-[7.5px] lg:text-[6px] text-[7px]  left-0 3xl:-translate-x-[17%] 2xl:-translate-x-1/3 xl:-translate-x-1/3 lg:-translate-x-1/3 -translate-x-1/4 3xl:translate-y-[10%] xxl:translate-y-1/3 2xl:translate-y-1/3 xl:translate-y-1/2 lg:translate-y-full translate-y-1/2 font-semibold"> */}
                                                                                        {isValue &&
                                                                                            item?.reference &&
                                                                                            item?.reference
                                                                                                .slice(
                                                                                                    0,
                                                                                                    isExpanded
                                                                                                        ? item
                                                                                                            ?.reference
                                                                                                            .length
                                                                                                        : 2
                                                                                                )
                                                                                                .map(
                                                                                                    (ci, index) => (
                                                                                                        <div
                                                                                                            className="flex-col flex"
                                                                                                            key={
                                                                                                                index
                                                                                                            }
                                                                                                        >
                                                                                                            {
                                                                                                                ci?.code
                                                                                                            }
                                                                                                        </div>
                                                                                                    )
                                                                                                )}
                                                                                        {item?.reference &&
                                                                                            item?.reference.length >
                                                                                            2 && (
                                                                                                <button
                                                                                                    onClick={
                                                                                                        toggleShowAll
                                                                                                    }
                                                                                                >
                                                                                                    {isExpanded
                                                                                                        ? "Rút gọn"
                                                                                                        : "Xem thêm"}
                                                                                                </button>
                                                                                            )}
                                                                                    </p>
                                                                                </div>
                                                                            </>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={1} >
                                                                <BtnAction
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    dataLang={dataLang}
                                                                    status={e?.status}
                                                                    id={e?.id}
                                                                    type="sales_product"
                                                                />
                                                            </RowItemTable>
                                                        </RowTable>
                                                    </>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <NoData />
                                    )}
                                </div>
                            </Customscrollbar>
                        </ContainerTable>
                    </div>
                    <ContainerTotal className={'grid-cols-12'}>
                        <ColumnTable colSpan={4} textAlign={"center"} className="p-2">
                            {dataLang?.total_outside || "total_outside"}
                        </ColumnTable>
                        <ColumnTable colSpan={2} textAlign={'right'} className="ustify-end pr-4 flex gap-2 flex-wrap ">
                            {formatNumber(total?.total_amount)}
                        </ColumnTable>
                    </ContainerTotal>
                    {initData.data?.length != 0 && (
                        <ContainerPagination>
                            <TitlePagination
                                dataLang={dataLang}
                                totalItems={totalItems?.iTotalDisplayRecords}
                            />
                            <Pagination
                                postsPerPage={limit}
                                totalPosts={Number(totalItems?.iTotalDisplayRecords)}
                                paginate={paginate}
                                currentPage={router.query?.page ? router.query?.page : 1}
                            />
                        </ContainerPagination>
                    )}
                </ContainerBody>
            </Container>
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                nameModel={"sales_product_status"}
                title={TITLE_STATUS}
                subtitle={CONFIRMATION_OF_CHANGES}
                isOpen={isOpen}
                status={status}
                save={toggleStatus}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment >
    );
};

export default Index;
