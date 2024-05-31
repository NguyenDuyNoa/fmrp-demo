import Head from "next/head";
import Link from "next/link";
import { debounce } from "lodash";
import vi from "date-fns/locale/vi";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import PopupDetailQuote from "./components/PopupDetailQuote";

import moment from "moment/moment";
import { registerLocale } from "react-datepicker";
import { _ServerInstance as Axios } from "/services/axios";
import { Grid6, Grid6 as IconExcel, SearchNormal1 as IconSearch, TickCircle } from "iconsax-react";
import "react-datepicker/dist/react-datepicker.css";

import Loading from "@/components/UI/loading";
import BtnAction from "@/components/UI/BtnAction";
import TabFilter from "@/components/UI/TabFilter";
import Pagination from "@/components/UI/pagination";
import OnResetData from "@/components/UI/btnResetData/btnReset";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import useStatusExprired from "@/hooks/useStatusExprired";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";

import { CONFIRMATION_OF_CHANGES, TITLE_STATUS } from "@/constants/changeStatus/changeStatus";
import { routerPriceQuote } from "@/routers/sellingGoods";
import { useSelector } from "react-redux";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import BtnStatusApproved from "@/components/UI/btnStatusApproved/BtnStatusApproved";
import formatMoney from "@/utils/helpers/formatMoney";
import useSetingServer from "@/hooks/useConfigNumber";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import DateToDateComponent from "@/components/UI/filterComponents/dateTodateComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import useActionRole from "@/hooks/useRole";
import { Container, ContainerBody, ContainerFilterTab, ContainerTable, ContainerTotal } from "@/components/UI/common/layout";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import NoData from "@/components/UI/noData/nodata";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import ButtonAddNew from "@/components/UI/button/buttonAddNew";
registerLocale("vi", vi);


const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const isShow = useToast();

    const dataSeting = useSetingServer()

    const statusExprired = useStatusExprired();

    const { isOpen, isId, isIdChild: status, handleQueryId } = useToggle();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems()

    const { checkAdd, checkExport } = useActionRole(auth, "price_quote")

    const initData = {
        data: [],
        dataExcel: [],
        onFetching: false,
        onFetching_filter: false,
        onFetchingBar: false,
        keySearch: "",
        listBr: [],
        listQuoteCode: [],
        listCustomer: [],
        idBranch: null,
        idQuoteCode: null,
        idCustomer: null,
        valueDate: {
            startDate: null,
            endDate: null,
        },
        listTabStatus: [],
    }

    const [isState, sIsState] = useState(initData)

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const [total, sTotal] = useState({});

    const formatNumber = (number) => {
        return formatMoney(+number, dataSeting)
    };

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
        queryState({ onFetchingBar: true, onFetching_filter: true });
    }, []);

    const _ServerFetching = () => {
        const tabPage = router.query?.tab;
        Axios(
            "GET",
            `/api_web/Api_quotation/quotation/?csrf_protection=true`,
            {
                params: {
                    search: isState.keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id]": isState.idBranch != null ? isState.idBranch.value : null,
                    "filter[id]": isState.idQuoteCode != null ? isState.idQuoteCode?.value : null,
                    "filter[status_bar]": tabPage ?? null,
                    "filter[client_id]": isState.idCustomer ? isState.idCustomer.value : null,
                    "filter[start_date]": isState.valueDate?.startDate != null ? isState.valueDate?.startDate : null,
                    "filter[end_date]": isState.valueDate?.endDate != null ? isState.valueDate?.endDate : null,
                },
            },
            (err, response) => {
                if (!err) {
                    const { rResult, output, rTotal } = response.data;
                    queryState({ data: rResult || [], dataExcel: rResult || [] });
                    sTotalItems(output);
                    sTotal(rTotal);
                }
                queryState({ onFetching: false });
            }
        );
    };

    // fetch tab filter
    const _ServerFetching_group = () => {
        Axios(
            "GET",
            `/api_web/Api_quotation/filterBar?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                    search: isState.keySearch,
                    "filter[branch_id]": isState.idBranch != null ? isState.idBranch.value : null,
                },
            },
            (err, response) => {
                if (!err) {
                    const data = response.data;
                    queryState({ listTabStatus: data || [] });
                }
                queryState({ onFetchingBar: false });
            }
        );
    };

    useEffect(() => {
        isState.onFetchingBar && _ServerFetching_group();
    }, [isState.onFetchingBar])

    useEffect(() => {
        queryState({ onFetchingBar: true });
    }, [limit, isState.idBranch, isState.idQuoteCode, isState.idCustomer, isState.valueDate.endDate, isState.valueDate.startDate])

    // filter
    const convertArray = (arr) => {
        return arr?.map((e) => ({ label: e?.name, value: e?.id })) || [];
    }
    const _ServerFetching_filter = () => {
        Axios("GET", `/api_web/Api_Branch/branch/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                const { rResult } = response.data;
                queryState({ listBr: convertArray(rResult) });
            }
        });
        Axios("GET", `/api_web/api_quotation/searchQuotes?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                const { data } = response.data
                queryState({ listQuoteCode: data?.quotes?.map((e) => ({ label: e.reference_no, value: e.id })) || [] });
            }
        });
        Axios("GET", "/api_web/api_client/searchClients?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let { data } = response?.data;
                queryState({ listCustomer: convertArray(data?.clients) });
            }
        })
        queryState({ onFetching_filter: false });
    };


    const handleSearchClientsApi = debounce((value) => {
        Axios("GET", "/api_web/api_client/searchClients?csrf_protection=true", {
            params: {
                search: value ? value : "",
            },
        }, (err, response) => {
            if (!err) {
                let { data } = response?.data;
                queryState({ listCustomer: convertArray(data?.clients) });
            }
        })
    }, 500)

    const handleSearchApi = debounce((value) => {
        Axios("GET", `/api_web/api_quotation/searchQuotes?csrf_protection=true`, {
            params: {
                search: value ? value : "",
            },
        }, (err, response) => {
            if (!err) {
                const { data } = response.data
                queryState({ listQuoteCode: data?.quotes?.map((e) => ({ label: e.reference_no, value: e.id })) });
            }
        })
    }, 500)

    useEffect(() => {
        (isState.onFetching && _ServerFetching())
    }, [isState.onFetching]);

    useEffect(() => {
        isState.onFetching_filter && _ServerFetching_filter();
    }, [isState.onFetching_filter]);

    useEffect(() => {
        (router.query.tab && queryState({ onFetching: true }));
    }, [limit, router.query?.page, router.query?.tab]);

    useEffect(() => {
        if (
            isState.idBranch != null ||
            (isState.valueDate.startDate != null && isState.valueDate.endDate != null) ||
            isState.idCustomer != null ||
            isState.idQuoteCode != null
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
    }, [limit, isState.idBranch, isState.idQuoteCode, isState.keySearch, isState.idCustomer, isState.valueDate.endDate, isState.valueDate.startDate]);

    const paginate = (pageNumber) => {
        router.push({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
                page: pageNumber,
            },
        });
    };

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryState({ keySearch: value })
        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            },
        });
        queryState({ onFetching: true })
    }, 500);



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
                    title: `${dataLang?.price_quote_date || "price_quote_date"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.price_quote_code || "price_quote_code"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.price_quote_customer || "price_quote_customer"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.price_quote_total || "price_quote_total"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.price_quote_tax_money || "price_quote_tax_money"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.price_quote_into_money || "price_quote_into_money"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.price_quote_effective_date || "price_quote_effective_date"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.price_quote_order_status || "price_quote_order_status"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.price_quote_branch || "price_quote_branch"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.price_quote_note || "price_quote_note"}`,
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
                { value: `${e?.client_name ? e?.client_name : ""}` },
                // tiền chưa!
                {
                    value: `${e?.total_price ? formatNumber(e?.total_price) : ""}`,
                },
                {
                    value: `${e?.total_tax_price ? formatNumber(e?.total_tax_price) : ""}`,
                },
                {
                    value: `${e?.total_amount ? formatNumber(e?.total_amount) : ""}`,
                },

                { value: `${e?.validity ? e?.validity : ""}` },
                // order status chưa
                // {value: `${e?.import_status ? e?.import_status === "0" && "Chưa chi" || e?.import_status === "1" && "Chi 1 phần" ||  e?.import_status === "2"  &&"Đã chi đủ" : ""}`},
                {
                    value: `${e?.status
                        ? (e?.status === "not_confirmed" && "Chưa duyệt") ||
                        (e?.status === "confirmed" && "Đã duyệt") ||
                        (e?.status === "no_confirmed" && "Không duyệt") ||
                        (e?.status === "ordered" && "Đã tạo đơn đặt hàng")
                        : ""
                        }`,
                },

                { value: `${e?.branch_name ? e?.branch_name : ""}` },
                { value: `${e?.note ? e?.note : ""}` },
            ]),
        },
    ];

    // chuyen doi trang thai don bao gia

    const handleDelete = () => {
        const index = isState.data.findIndex((x) => x.id === isId);
        let newStatus = "";
        if (isState.data[index].status === "not_confirmed") {
            newStatus = "confirmed";
        } else if (isState.data[index].status === "confirmed") {
            newStatus = "not_confirmed";
        } else if (isState.data[index].status === "no_confirmed") {
            newStatus = "confirmed";
        }
        _ServerPostStatus(isId, newStatus);
        handleQueryId({ status: false });
    };

    const handleNoconfim = () => {
        const index = isState.data.findIndex((x) => x.id === isId);
        const newStatus = isState.data[index].status === "no_confirmed" ? "not_confirmed" : "no_confirmed";
        _ServerPostStatus(isId, newStatus);
        handleQueryId({ status: false });
    };

    const handleToggleOrdered = (id) => {
        const index = isState.data.findIndex((x) => x.id === id);

        if (isState.data[index].status === "ordered") {
            isShow("error", `${dataLang?.no_change_status_when_order || "no_change_status_when_order"}`);
        }
    };

    const _ServerPostStatus = (id, newStatus) => {
        const formData = new FormData();

        formData.append("id", id);
        formData.append("status", newStatus);

        Axios(
            "POST",
            `/api_web/Api_quotation/changeStatus/${id}/${newStatus}?csrf_protection=true`,
            {
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    const { isSuccess } = response.data;

                    if (isSuccess !== false) {
                        isShow("success", `${dataLang?.change_status_when_order || "change_status_when_order"}`);
                    }
                    _ServerFetching();
                    _ServerFetching_group();
                }
            }
        );
    };

    // search

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.price_quote || "price_quote"} </title>
            </Head>
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.price_quote || "price_quote"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.price_quote_list || "price_quote"}</h6>
                    </div>
                )}


                <ContainerBody>
                    <div className="space-y-0.5 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.price_quote || "price_quote"}
                            </h2>
                            <ButtonAddNew
                                onClick={() => {
                                    if (role) {
                                        router.push(routerPriceQuote.form)
                                    } else if (checkAdd) {
                                        router.push(routerPriceQuote.form)
                                    }
                                    else {
                                        isShow("warning", WARNING_STATUS_ROLE)
                                    }
                                }}
                                dataLang={dataLang}
                            />
                        </div>

                        <ContainerFilterTab>
                            {isState.listTabStatus &&
                                isState.listTabStatus.map((e) => {
                                    return (
                                        <div>
                                            <TabFilter
                                                dataLang={dataLang}
                                                key={e?.id}
                                                onClick={_HandleSelectTab.bind(this, `${e?.id}`)}
                                                total={e?.count}
                                                active={e?.id}
                                            >
                                                {dataLang[e?.name]}
                                            </TabFilter>
                                        </div>
                                    );
                                })}
                        </ContainerFilterTab>
                        <ContainerTable>
                            <div className="xl:space-y-3 space-y-2">
                                <div className="bg-slate-100 w-full rounded-t-lg items-center grid grid-cols-7 2xl:grid-cols-9  xl:col-span-8 lg:col-span-7 2xl:xl:p-2 xl:p-1.5 p-1.5">
                                    <div className="col-span-6 2xl:col-span-7 xl:col-span-5 lg:col-span-5">
                                        <div className="grid grid-cols-5 gap-2">
                                            <div className="col-span-1">
                                                <SearchComponent dataLang={dataLang} onChange={_HandleOnChangeKeySearch.bind(this)} />
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
                                                    placeholder={dataLang?.price_quote_select_branch ||
                                                        "price_quote_select_branch"
                                                    }
                                                    isClearable={true}
                                                    closeMenuOnSelect={true}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <SelectComponent
                                                    options={[
                                                        {
                                                            value: "",
                                                            label: dataLang?.price_quote_select_code || "price_quote_select_code",
                                                            isDisabled: true,
                                                        },
                                                        ...isState.listQuoteCode,
                                                    ]}
                                                    onInputChange={handleSearchApi}
                                                    onChange={(e) => queryState({ idQuoteCode: e })}
                                                    value={isState.idQuoteCode}
                                                    placeholder={dataLang?.price_quote_code || "price_quote_code"}
                                                    isClearable={true}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <SelectComponent
                                                    options={[
                                                        {
                                                            value: "",
                                                            label: dataLang?.price_quote_select_customer || "price_quote_select_customer",
                                                            isDisabled: true,
                                                        },
                                                        ...isState.listCustomer,
                                                    ]}
                                                    onInputChange={handleSearchClientsApi}
                                                    onChange={(e) => queryState({ idCustomer: e })}
                                                    value={isState.idCustomer}
                                                    placeholder={
                                                        dataLang?.price_quote_customer || "price_quote_customer"
                                                    }
                                                    isClearable={true}
                                                />
                                            </div>
                                            <div className="z-20 col-span-1">
                                                <DateToDateComponent value={isState.valueDate} onChange={(e) => queryState({ valueDate: e })} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-1 xl:col-span-2 lg:col-span-2">
                                        <div className="flex justify-end items-center gap-2">
                                            <OnResetData sOnFetching={(e) => queryState({ onFetching: e })} />
                                            {(role == true || checkExport) ?
                                                <div className={``}>
                                                    {isState.dataExcel?.length > 0 && (
                                                        <ExcelFileComponent filename={"Danh sách báo giá"} title={"DSBG"} multiDataSet={multiDataSet} dataLang={dataLang} />)}
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
                            <Customscrollbar >
                                <div className="w-[100%] lg:w-[100%] ">
                                    <HeaderTable gridCols={12}>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.price_quote_date || "price_quote_table_date"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.price_quote_code || "price_quote_table_code"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={'center'}>
                                            {dataLang?.price_quote_customer || "price_quote_table_customer"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.price_quote_total || "price_quote_table_total"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.price_quote_tax_money || "price_quote_tax_money"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.price_quote_into_money || "price_quote_into_money"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.price_quote_effective_date || "price_quote_table_effective_date"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.price_quote_order_status || "price_quote_order_status"}
                                        </ColumnTable>
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-1 font-[600] text-left">
                                            {dataLang?.price_quote_note || "price_quote_note"}
                                        </h4>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.price_quote_branch || "price_quote_branch"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.price_quote_operations || "price_quote_operations"}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {isState.onFetching ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : isState.data?.length > 0 ? (
                                        <>
                                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px] ">
                                                {isState.data?.map((e) => (
                                                    <RowTable gridCols={12} key={e.id.toString()}>
                                                        <RowItemTable colSpan={1} textAlign='center'>
                                                            {e?.date != null
                                                                ? moment(e?.date).format("DD/MM/YYYY")
                                                                : ""}
                                                        </RowItemTable>

                                                        <RowItemTable colSpan={1} textAlign={'center'}>
                                                            <PopupDetailQuote
                                                                dataLang={dataLang}
                                                                className="3xl:text-base font-medium 2xl:text-[12.5px] xl:text-[11px] text-[9px] px-2 col-span-1 text-center text-[#0F4F9E] hover:text-blue-500 transition-all duration-200 ease-in-out cursor-pointer"
                                                                name={e?.reference_no}
                                                                id={e?.id}
                                                            />
                                                        </RowItemTable>

                                                        <RowItemTable colSpan={2} textAlign={"left"}>
                                                            {e.client_name}
                                                        </RowItemTable>

                                                        <RowItemTable textAlign={'right'}>
                                                            {formatNumber(e.total_price)}
                                                        </RowItemTable>

                                                        <RowItemTable colSpan={1} textAlign={'right'}>
                                                            {formatNumber(e.total_tax_price)}
                                                        </RowItemTable>

                                                        <RowItemTable colSpan={1} textAlign={'right'}>
                                                            {formatNumber(e.total_amount)}
                                                        </RowItemTable>

                                                        <RowItemTable colSpan={1} textAlign={'right'}>
                                                            {e?.validity != null
                                                                ? moment(e?.validity).format("DD/MM/YYYY")
                                                                : ""}
                                                        </RowItemTable>

                                                        <RowItemTable colSpan={1} className="flex items-center justify-center text-center ">
                                                            <h6 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9px] text-[8px] col-span-1 flex items-center justify-center text-center cursor-pointer">
                                                                {(e?.status === "confirmed" && (
                                                                    <BtnStatusApproved
                                                                        onClick={() =>
                                                                            handleQueryId({
                                                                                id: e?.id,
                                                                                status: true,
                                                                                idChild: "confirmed",
                                                                            })
                                                                        }
                                                                        type="1"
                                                                    />
                                                                )) ||
                                                                    (e?.status === "not_confirmed" && (
                                                                        <BtnStatusApproved
                                                                            onClick={() =>
                                                                                handleQueryId({
                                                                                    id: e?.id,
                                                                                    status: true,
                                                                                    idChild: "not_confirmed",
                                                                                })
                                                                            }
                                                                            type="0" />
                                                                    )) ||
                                                                    (e?.status === "no_confirmed" && (
                                                                        <BtnStatusApproved
                                                                            onClick={() =>
                                                                                handleQueryId({
                                                                                    id: e?.id,
                                                                                    status: true,
                                                                                    idChild: "no_confirmed",
                                                                                })
                                                                            }
                                                                            title="Không duyệt"
                                                                            type="2" />
                                                                    )) ||
                                                                    (e?.status === "ordered" && (
                                                                        <div
                                                                            className="3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[7px] 3xl:w-[120px] 3xl:h-8 2xl:w-[90px] 2xl:h-7 xl:w-[82px] xl:h-6 lg:w-[68px] lg:h-6 relative text-white border border-orange-400 bg-orange-500 hover:bg-orange-600  transition-all duration-300 ease-in-out rounded-md bg-orange-500 hover:bg-orange-600 text-left 3xl:px-3 3xl:py-5 3xl:pr-5 2xl:px-1 2xl:py-4 2xl:pr-5 xl:px-1 xl:py-3.5 xl:pr-4 lg:px-1 lg:py-2 lg:pr-3 font-normal flex justify-center items-center"
                                                                            onClick={() =>
                                                                                handleToggleOrdered(e?.id)
                                                                            }
                                                                        >
                                                                            Đã Tạo Đơn Đặt Hàng
                                                                            <TickCircle className=" absolute 3xl:top-[30%] 3lx:-right-[-5%] 2xl:top-[25%] 2lx:-right-[-5%] xl:top-[25%] xl:-right-[-5%] lg:top-[30%] lg:-right-[-5%] 3xl:w-5 3xl:h-5 2xl:w-4 2xl:h-4 xl:w-3.5 xl:h-3.5 lg:w-3 lg:h-3 text-white border-orange-400" />
                                                                        </div>
                                                                    ))}
                                                            </h6>
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={"left"}>
                                                            {e?.note}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className="w-fit mx-auto">
                                                            <TagBranch>
                                                                {e?.branch_name}
                                                            </TagBranch>
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className="flex items-center justify-center">
                                                            <BtnAction
                                                                onRefresh={_ServerFetching.bind(this)}
                                                                dataLang={dataLang}
                                                                status={e?.status}
                                                                id={e?.id}
                                                                type="price_quote"
                                                            />
                                                        </RowItemTable>
                                                    </RowTable>
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
                    <ContainerTotal>
                        <ColumnTable colSpan={4} textAlign={"center"} className="p-2">
                            {dataLang?.price_quote_total_outside || "price_quote_total_outside"}
                        </ColumnTable>
                        <ColumnTable colSpan={1} textAlign={'right'} className="justify-end p-2 flex gap-2 flex-wrap mr-1">
                            <h3 className="font-normal 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px]">
                                {formatNumber(total?.total_price)}
                            </h3>
                        </ColumnTable>
                        <ColumnTable colSpan={1} textAlign={'right'} className="justify-end p-2 flex gap-2 flex-wrap mr-1">
                            {formatNumber(total?.total_tax_price)}
                        </ColumnTable>
                        <ColumnTable colSpan={1} textAlign={'right'} className="justify-end p-2 flex gap-2 flex-wrap mr-1">
                            {formatNumber(total?.total_amount)}
                        </ColumnTable>
                    </ContainerTotal>
                    {isState.data?.length != 0 && (
                        <ContainerPagination>
                            <TitlePagination
                                dataLang={dataLang}
                                totalItems={totalItems?.iTotalDisplayRecords}
                            />
                            <Pagination
                                postsPerPage={limit}
                                totalPosts={Number(totalItems?.iTotalDisplayRecords)}
                                paginate={paginate}
                                currentPage={router.query?.page || 1}
                            />
                        </ContainerPagination>
                    )}
                </ContainerBody>

            </Container>
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                nameModel={"price_quote_status"}
                title={TITLE_STATUS}
                status={status}
                subtitle={CONFIRMATION_OF_CHANGES}
                isOpen={isOpen}
                save={handleDelete}
                handleNoconfim={handleNoconfim}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment >
    );
};

export default Index;
