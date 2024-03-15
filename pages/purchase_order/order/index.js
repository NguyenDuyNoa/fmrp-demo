import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

import {
    Grid6 as IconExcel,
    Filter as IconFilter,
    Calendar as IconCalendar,
    SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    TickCircle,
    ArrowCircleDown,
    Refresh2,
    Grid6,
} from "iconsax-react";

import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment/moment";

import { _ServerInstance as Axios } from "/services/axios";

import ReactExport from "react-data-export";
import { useEffect } from "react";
import Popup_chitietThere from "../detailThere";
import Popup_chitiet from "./(popup)/popup";

import Loading from "@/components/UI/loading";
import BtnAction from "@/components/UI/BtnAction";
import Pagination from "@/components/UI/pagination";
import { routerOrder } from "routers/buyImportGoods";

import useStatusExprired from "@/hooks/useStatusExprired";
import { debounce } from "lodash";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

import formatMoneyConfig from "@/utils/helpers/formatMoney";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import useSetingServer from "@/hooks/useConfigNumber";
import { Container, ContainerBody, ContainerFilterTab, ContainerTable } from "@/components/UI/common/layout";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import TabFilter from "@/components/UI/TabFilter";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import DatepickerComponent from "@/components/UI/filterComponents/dateTodateComponent";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import { useSelector } from "react-redux";
import useActionRole from "@/hooks/useRole";


const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const trangthaiExprired = useStatusExprired();

    const dataSeting = useSetingServer()

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems()

    const [total, sTotal] = useState({});

    const initalState = {
        data: [],
        dataExcel: [],
        onFetching: false,
        onFetching_filter: false,
        onFetchingGr: false,
        keySearch: "",
        listBr: [],
        lisCode: [],
        listSupplier: [],
        listOrderType: [],
        valueBr: null,
        valueCode: null,
        valueSupplier: null,
        valueOrderType: null,
        listDs: [],
        valueDate: {
            startDate: null,
            endDate: null,
        }
    }


    const [isState, sIsState] = useState(initalState);

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkExport } = useActionRole(auth, "order")



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
        queryState({ onFetching_filter: true, onFetchingGr: true });
    }, []);

    const _ServerFetching = () => {
        const tabPage = router.query?.tab;
        Axios("GET", `/api_web/Api_purchase_order/purchase_order/?csrf_protection=true`,
            {
                params: {
                    search: isState.keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id]": isState.valueBr != null ? isState.valueBr?.value : null,
                    "filter[id]": isState.valueCode != null ? isState.valueCode?.value : null,
                    "filter[status_bar]": tabPage ?? null,
                    "filter[supplier_id]": isState.valueSupplier ? isState.valueSupplier.value : null,
                    "filter[order_type]": isState.valueOrderType ? isState.valueOrderType.value : null,
                    "filter[start_date]": isState.valueDate?.startDate != null ? isState.valueDate?.startDate : null,
                    "filter[end_date]": isState.valueDate?.endDate != null ? isState.valueDate?.endDate : null,
                },
            },
            (err, response) => {
                if (!err) {
                    const { rResult, output, rTotal } = response.data;
                    queryState({ data: rResult, dataExcel: rResult })
                    sTotalItems(output);
                    sTotal(rTotal);
                }
                queryState({
                    onFetching: false
                })
            }
        );
    };
    const _ServerFetching_group = () => {
        Axios("GET", `/api_web/Api_purchase_order/filterBar/?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                    search: isState.keySearch,
                    "filter[branch_id]": isState.valueBr != null ? isState.valueBr?.value : null,
                    "filter[id]": isState.valueCode != null ? isState.valueCode?.value : null,
                    "filter[supplier_id]": isState.valueSupplier ? isState.valueSupplier.value : null,
                    "filter[order_type]": isState.valueOrderType ? isState.valueOrderType.value : null,
                    "filter[start_date]": isState.valueDate?.startDate != null ? isState.valueDate?.startDate : null,
                    "filter[end_date]": isState.valueDate?.endDate != null ? isState.valueDate?.endDate : null,
                },
            },
            (err, response) => {
                if (!err) {
                    const data = response.data;
                    queryState({ listDs: data });
                }
                queryState({ onFetchingGr: false });
            }
        );
    };

    const _ServerFetching_filter = () => {
        Axios("GET", `/api_web/Api_Branch/branch/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                const { rResult } = response.data;
                queryState({ listBr: rResult?.map((e) => ({ label: e.name, value: e.id })) || [] });
            }
        });

        Axios("GET", `/api_web/Api_purchase_order/purchase_order/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                const { rResult } = response.data;
                queryState({ listCode: rResult?.map((e) => ({ label: e.code, value: e.id })) || [] });
            }
        });

        Axios("GET", "/api_web/api_supplier/supplier/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                const db = response.data.rResult;
                queryState({ listSupplier: db?.map((e) => ({ label: e.name, value: e.id })) || [] });
            }
        });

        Axios("GET", "/api_web/Api_purchase_order/order_type_option/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                const data = response.data;
                queryState({ listOrderType: data?.map((e) => ({ label: dataLang[e?.name], value: e.id })) });
            }
        });

        queryState({ onFetching_filter: false });
    };

    useEffect(() => {
        isState.onFetching && _ServerFetching()
    }, [isState.onFetching]);

    useEffect(() => {
        (isState.onFetchingGr && _ServerFetching_group());
    }, [isState.onFetchingGr]);

    useEffect(() => {
        isState.onFetching_filter && _ServerFetching_filter();
    }, [isState.onFetching_filter]);

    useEffect(() => {
        queryState({ onFetching: true });
    }, [
        limit,
        router.query?.page,
        router.query?.tab,
        isState.valueCode,
        isState.valueBr,
        isState.valueSupplier,
        isState.valueOrderType,
        isState.valueDate.endDate,
        isState.valueDate.startDate,
    ]);



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
        queryState({ onFetching: true, });
    }, 500)

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const formatMoney = (number) => {
        return formatMoneyConfig(+number, dataSeting);
    }

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
                    title: `${dataLang?.purchase_order_table_dayvoucers || "purchase_order_table_dayvoucers"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_order_table_code || "purchase_order_table_code"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_order_table_ordertype || "purchase_order_table_ordertype"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_order_table_number || "purchase_order_table_number"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_order_table_total || "purchase_order_table_total"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_order_table_totalTax || "purchase_order_table_totalTax"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_order_table_intoMoney || "purchase_order_table_intoMoney"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                // {title: `${dataLang?.purchase_order_table_statusOfSpending || "purchase_order_table_statusOfSpending"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {
                    title: `${dataLang?.purchase_order_table_importStatus || "purchase_order_table_importStatus"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_order_note || "purchase_order_note"}`,
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
                { value: `${e?.code ? e?.code : ""}` },
                { value: `${e?.supplier_name ? e?.supplier_name : ""}` },
                {
                    value: `${e?.order_type ? (e?.order_type == "0" ? "Tạo mới" : "Theo YCHM") : ""}`,
                },
                {
                    value: `${e?.purchases
                        ? e?.purchases?.map((e) => {
                            return e?.code;
                        })
                        : ""
                        }`,
                },
                {
                    value: `${e?.total_price ? formatMoney(e?.total_price) : ""}`,
                },
                {
                    value: `${e?.total_tax_price ? formatMoney(e?.total_tax_price) : ""}`,
                },
                {
                    value: `${e?.total_amount ? formatMoney(e?.total_amount) : ""}`,
                },
                // {value: `${e?.import_status ? e?.import_status === "0" && "Chưa chi" || e?.import_status === "1" && "Chi 1 phần" ||  e?.import_status === "2"  &&"Đã chi đủ" : ""}`},
                {
                    value: `${e?.status_pay
                        ? (e?.status_pay === "0" && "Chưa nhập") ||
                        (e?.status_pay === "1" && "Nhập 1 phần") ||
                        (e?.status_pay === "2" && "Đã nhập đủ đủ")
                        : ""
                        }`,
                },
                { value: `${e?.branch_name ? e?.branch_name : ""}` },
                { value: `${e?.note ? e?.note : ""}` },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.purchase_order || "purchase_order"} </title>
            </Head>
            <Container>
                {trangthaiExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.purchase_order || "purchase_order"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.purchase_order_list || "purchase_order_list"}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="space-y-0.5 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.delivery_receipt_list || "delivery_receipt_list"}
                            </h2>
                            <button
                                onClick={() => {
                                    if (role) {
                                        router.push(routerOrder.form)
                                    } else if (checkAdd) {
                                        router.push(routerOrder.form)
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

                        <ContainerFilterTab>
                            {isState.listDs &&
                                isState.listDs.map((e) => {
                                    return (
                                        <div>
                                            <TabFilter
                                                style={{
                                                    backgroundColor: "#e2f0fe",
                                                }}
                                                dataLang={dataLang}
                                                key={e.id}
                                                onClick={_HandleSelectTab.bind(this, `${e.id}`)}
                                                total={e.count}
                                                active={e.id}
                                                className={"text-[#0F4F9E]"}
                                            >
                                                {dataLang[e?.name] || e?.name}
                                            </TabFilter>
                                        </div>
                                    );
                                })}
                        </ContainerFilterTab>
                        <ContainerTable>
                            <div className="xl:space-y-3 space-y-2">
                                <div className="bg-slate-100 w-full rounded-t-lg items-center grid grid-cols-7 2xl:grid-cols-9 xl:col-span-8 lg:col-span-7 2xl:xl:p-2 xl:p-1.5 p-1.5">
                                    <div className="col-span-6 2xl:col-span-7 xl:col-span-5 lg:col-span-5">
                                        <div className="grid grid-cols-6 gap-2">
                                            <SearchComponent colSpan={1} dataLang={dataLang} placeholder={dataLang?.branch_search} onChange={_HandleOnChangeKeySearch.bind(this)} />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.purchase_order_branch || "purchase_order_branch",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.listBr,
                                                ]}
                                                onChange={(e) => queryState({ valueBr: e })}
                                                value={isState.valueBr}
                                                placeholder={dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}
                                                hideSelectedOptions={false}
                                                isClearable={true}
                                                colSpan={1}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label:
                                                            dataLang?.purchase_order_vouchercode ||
                                                            "purchase_order_vouchercode",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.lisCode,
                                                ]}
                                                onChange={(e) => queryState({ valueCode: e })}
                                                value={isState.valueCode}
                                                placeholder={dataLang?.purchase_order_table_code || "purchase_order_table_code"}
                                                hideSelectedOptions={false}
                                                isClearable={true}
                                                colSpan={1}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.purchase_order_supplier || "purchase_order_supplier",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.listSupplier,
                                                ]}
                                                onChange={(e) => queryState({ valueSupplier: e })}
                                                value={isState.valueSupplier}
                                                placeholder={dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"}
                                                hideSelectedOptions={false}
                                                isClearable={true}
                                                isSearchable={true}
                                                noOptionsMessage={() => "Không có dữ liệu"}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: "Loại đặt hàng",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.listOrderType,
                                                ]}
                                                onChange={(e) => queryState({ valueOrderType: e })}
                                                value={isState.valueOrderType}
                                                placeholder={"Loại đặt hàng"}
                                                hideSelectedOptions={false}
                                                isClearable={true}
                                                colSpan={1}
                                            />
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
                                                            filename="Danh sách yêu cầu mua hàng"
                                                            title="DSYCMH"
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
                            <div className="min:h-[200px] h-[82%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                <div className="pr-2 w-[100%] lx:w-[120%] ">
                                    <div className="grid grid-cols-12 items-center sticky top-0  p-2 z-10 rounded-xl shadow-sm bg-white divide-x">
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.purchase_order_table_dayvoucers ||
                                                "purchase_order_table_dayvoucers"}
                                        </h4>
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.purchase_order_table_code || "purchase_order_table_code"}
                                        </h4>
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.purchase_order_table_supplier ||
                                                "purchase_order_table_supplier"}
                                        </h4>
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.purchase_order_table_ordertype ||
                                                "purchase_order_table_ordertype"}
                                        </h4>
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.purchase_order_table_number || "purchase_order_table_number"}
                                        </h4>
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.purchase_order_table_total || "purchase_order_table_total"}
                                        </h4>
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.purchase_order_table_totalTax ||
                                                "purchase_order_table_totalTax"}
                                        </h4>
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.purchase_order_table_intoMoney ||
                                                "purchase_order_table_intoMoney"}
                                        </h4>
                                        {/* <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center'>{dataLang?.purchase_order_table_statusOfSpending || "purchase_order_table_statusOfSpending"}</h4> */}
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.purchase_order_table_importStatus ||
                                                "purchase_order_table_importStatus"}
                                        </h4>
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.purchase_order_note || "purchase_order_note"}
                                        </h4>
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}
                                        </h4>
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.purchase_order_table_operations ||
                                                "purchase_order_table_operations"}
                                        </h4>
                                    </div>
                                    {isState.onFetching ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : isState.data?.length > 0 ? (
                                        <>
                                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px] ">
                                                {isState.data?.map((e) => (
                                                    <div
                                                        className="grid grid-cols-12 items-center py-1.5 px-2 hover:bg-slate-100/40 "
                                                        key={e.id.toString()}
                                                    >
                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-center">
                                                            {e?.date != null
                                                                ? moment(e?.date).format("DD/MM/YYYY")
                                                                : ""}
                                                        </h6>
                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] hover:text-blue-600 transition-all ease-in-out xl:text-[11px] font-medium text-[9px]  px-2 col-span-1 text-center text-[#0F4F9E]  cursor-pointer">
                                                            <Popup_chitiet
                                                                dataLang={dataLang}
                                                                className="text-left"
                                                                name={e?.code}
                                                                id={e?.id}
                                                            />
                                                        </h6>
                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-left">
                                                            {e.supplier_name}
                                                        </h6>
                                                        <h6 className="px-2 py-2.5 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 col-span-1 flex items-center justify-center text-center">
                                                            {e?.order_type == "0" ? (
                                                                <span className="font-normal text-red-500  rounded-xl py-1 px-3  bg-red-200 2xl:text-xs xl:text-xs text-[8px] min-w-[80px]">
                                                                    Tạo mới
                                                                </span>
                                                            ) : (
                                                                <span className="min-w-[80px] font-normal 2xl:text-xs xl:text-xs text-[8px] text-lime-500  rounded-xl py-1 px-3  bg-lime-200">
                                                                    YCMH
                                                                </span>
                                                            )}
                                                        </h6>
                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] px-2 col-span-1 text-left flex flex-wrap text-[#0F4F9E] hover:text-blue-600 transition-all ease-in-out">
                                                            {/* {e?.purchases?.reduce((acc, cur) => acc + (acc ? ', ' : '') + cur.code, '').split('').join('').replace(/^,/, '')} */}
                                                            {e?.purchases?.map((purchase, index) => (
                                                                <React.Fragment key={purchase.id}>
                                                                    {index !== 0 && ","}
                                                                    <Popup_chitietThere
                                                                        dataLang={dataLang}
                                                                        className="text-left"
                                                                        type={e?.order_type}
                                                                        id={purchase.id}
                                                                        name={purchase.code}
                                                                    />
                                                                </React.Fragment>
                                                            ))}
                                                        </h6>
                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-right">
                                                            {formatMoney(e.total_price)}
                                                        </h6>
                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-right">
                                                            {formatMoney(e.total_tax_price)}
                                                        </h6>
                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-right">
                                                            {formatMoney(e.total_amount)}
                                                        </h6>
                                                        {/* <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-1 flex items-center justify-center text-center '>
                                    {e?.status_pay === "0" && <span className=' font-normal text-sky-500  rounded-xl py-1 px-2  bg-sky-200'>{dataLang?.purchase_order_table_havent_spent_yet || "purchase_order_table_havent_spent_yet"}</span>||
                                     e?.status_pay === "1" &&  <span className=' font-normal text-orange-500 rounded-xl py-1 px-2  bg-orange-200'>{dataLang?.purchase_order_table_spend_one_part || "purchase_order_table_spend_one_part"}</span> ||
                                     e?.status_pay === "2" &&   <span className='flex items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2  bg-lime-200'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{dataLang?.purchase_order_table_enough_spent || "purchase_order_table_enough_spent"}</span>
                                    }
                                </h6> */}
                                                        <h6 className="px-2 py-2.5  col-span-1 flex items-center justify-center text-center ">
                                                            {(e?.import_status === "not_stocked" && (
                                                                <span className=" font-normal 2xl:text-xs xl:text-xs text-[8px] text-sky-500  rounded-xl py-1 px-2  min-w-[100px] bg-sky-200">
                                                                    {dataLang[e?.import_status] || e?.import_status}{" "}
                                                                </span>
                                                            )) ||
                                                                (e?.import_status === "stocked_part" && (
                                                                    <span className=" font-normal 2xl:text-xs xl:text-xs text-[8px] text-orange-500 rounded-xl py-1 px-2  min-w-[100px] bg-orange-200">
                                                                        {dataLang[e?.import_status] ||
                                                                            e?.import_status}
                                                                    </span>
                                                                )) ||
                                                                (e?.import_status === "stocked" && (
                                                                    <span className="flex 2xl:text-xs xl:text-xs text-[8px] items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2  min-w-[100px] bg-lime-200">
                                                                        <TickCircle
                                                                            className="bg-lime-500 rounded-full "
                                                                            color="white"
                                                                            size={15}
                                                                        />
                                                                        {dataLang[e?.import_status] ||
                                                                            e?.import_status}
                                                                    </span>
                                                                ))}
                                                        </h6>
                                                        <h6 className="2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-left truncate ">
                                                            {e.note}
                                                        </h6>
                                                        <h6 className="col-span-1 w-fit mx-auto">
                                                            <div className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">
                                                                {e?.branch_name}
                                                            </div>
                                                        </h6>
                                                        <div className="col-span-1 flex justify-center">
                                                            <BtnAction
                                                                onRefresh={_ServerFetching.bind(this)}
                                                                dataLang={dataLang}
                                                                id={e?.id}
                                                                status={e?.import_status}
                                                                status_pay={e?.status_pay}
                                                                type="order"
                                                                data={e}
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
                                                    {dataLang?.purchase_order_table_item_not_found ||
                                                        "purchase_order_table_item_not_found"}
                                                </h1>
                                                <div className="flex items-center justify-around mt-6 "></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ContainerTable>
                    </div>
                    <div className="grid grid-cols-12 bg-gray-100 items-center">
                        <div className="col-span-5 p-2 text-center">
                            <h3 className="uppercase font-normal 2xl:text-base xl:text-xs text-[8px]">
                                {dataLang?.purchase_order_table_total_outside ||
                                    "purchase_order_table_total_outside"}
                            </h3>
                        </div>
                        <div className="col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap">
                            <h3 className="font-normal 2xl:text-base xl:text-xs text-[8px]">
                                {formatMoney(total?.total_price)}
                            </h3>
                        </div>
                        <div className="col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap ">
                            <h3 className="font-normal 2xl:text-base xl:text-xs text-[8px]">
                                {formatMoney(total?.total_tax_price)}
                            </h3>
                        </div>
                        <div className="col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap">
                            <h3 className="font-normal 2xl:text-base xl:text-xs text-[8px]">
                                {formatMoney(total?.total_amount)}
                            </h3>
                        </div>
                    </div>
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
        </React.Fragment>
    );
};


export default Index;
