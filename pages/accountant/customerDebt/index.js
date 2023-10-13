import React, { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import "react-datepicker/dist/react-datepicker.css";
import { Grid6 as IconExcel, SearchNormal1 as IconSearch } from "iconsax-react";

import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";
import Pagination from "/components/UI/pagination";
import Popup_chitietPhatsinh from "./(popup)/details_arises";
import Popup_chitietDauki from "./(popup)/details_first";
import moment from "moment";
import { useSelector } from "react-redux";
import DropdowLimit from "components/UI/dropdowLimit/dropdowLimit";
import SearchComponent from "components/UI/filterComponents/searchComponent";
import SelectComponent from "components/UI/filterComponents/selectComponent";
import DatepickerComponent from "components/UI/filterComponents/dateTodateComponent";
import OnResetData from "components/UI/btnResetData/btnReset";
import ExcelFileComponent from "components/UI/filterComponents/excelFilecomponet";

const Index = (props) => {
    const initialData = {
        data: [],
        dataExcel: [],
        listBr: [],
        listSupplier: [],
    };
    const initialValue = {
        idSupplier: null,
        idBranch: null,
        valueDate: {
            startDate: null,
            endDate: null,
        },
    };
    const trangthaiExprired = useSelector((state) => state?.trangthaiExprired);
    const dataLang = props.dataLang;
    const router = useRouter();
    const [onFetching, sOnFetching] = useState(false);
    const [onFetching_filter, sOnFetching_filter] = useState(false);
    const [totalItems, sTotalItems] = useState([]);
    const [keySearch, sKeySearch] = useState("");
    const [limit, sLimit] = useState(15);
    const [total, sTotal] = useState({});
    const [dataTable, sDataTable] = useState(initialData);
    const [valueChange, sValueChange] = useState(initialValue);

    useEffect(() => {
        router.push({
            pathname: router.route,
            query: { tab: router.query?.tab ? router.query?.tab : "all" },
        });
        const pastDays = 30;
        const today = new Date();
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - pastDays);
        sValueChange((e) => ({ ...e, valueDate: { startDate: pastDate, endDate: today } }));
    }, []);

    const _ServerFetching = async () => {
        await Axios(
            "GET",
            `/api_web/Api_debt_client/debtClient?csrf_protection=true`,
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id]": valueChange.idBranch != null ? valueChange.idBranch.value : null,
                    "filter[supplier_id]": valueChange.idSupplier ? valueChange.idSupplier.value : null,
                    "filter[start_date]":
                        valueChange.valueDate?.startDate != null
                            ? moment(valueChange.valueDate?.startDate).format("YYYY-MM-DD")
                            : null,
                    "filter[end_date]":
                        valueChange.valueDate?.endDate != null
                            ? moment(valueChange.valueDate?.endDate).format("YYYY-MM-DD")
                            : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let { rResult, output, rTotal } = response.data;
                    sDataTable((e) => ({ ...e, data: rResult, dataExcel: rResult }));
                    sTotalItems(output);
                    sTotal(rTotal);
                }
                sOnFetching(false);
            }
        );
    };

    const _ServerFetching_filter = async () => {
        await Axios("GET", `/api_web/Api_Branch/branchCombobox/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let { result } = response.data;
                sDataTable((e) => ({ ...e, listBr: result?.map((e) => ({ label: e.name, value: e.id })) }));
            }
        });
        await Axios("GET", "/api_web/api_supplier/supplier/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let { rResult } = response.data;
                sDataTable((e) => ({ ...e, listSupplier: rResult?.map((e) => ({ label: e.name, value: e.id })) }));
            }
        });
        sOnFetching_filter(false);
    };

    useEffect(() => {
        onFetching_filter && _ServerFetching_filter();
    }, [onFetching_filter]);

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        (router.query.tab && sOnFetching(true)) ||
            (keySearch && sOnFetching(true)) ||
            (router.query?.tab && sOnFetching_filter(true)) ||
            (valueChange.idBranch != null && sOnFetching(true)) ||
            (valueChange.valueDate.startDate != null && valueChange.valueDate.endDate != null && sOnFetching(true)) ||
            (valueChange.idSupplier != null && sOnFetching(true));
    }, [
        limit,
        router.query?.page,
        router.query?.tab,
        valueChange.idBranch,
        valueChange.valueDate.endDate,
        valueChange.valueDate.startDate,
        valueChange.idSupplier,
    ]);

    const formatNumber = (number) => {
        if (!number && number !== 0) return 0;
        const integerPart = Math.floor(number);
        const decimalPart = number - integerPart;
        const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
        const roundedNumber = integerPart + roundedDecimalPart;
        return roundedNumber.toLocaleString("en");
    };

    const _HandleOnChangeKeySearch = ({ target: { value } }) => {
        sKeySearch(value);
        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            },
        });
        setTimeout(() => {
            if (!value) {
                sOnFetching(true);
            }
            sOnFetching(true);
        }, 500);
    };

    const paginate = (pageNumber) => {
        router.push({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
                page: pageNumber,
            },
        });
    };

    const onchangFilter = (type) => (value) => sValueChange((e) => ({ ...e, [type]: value }));

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
                    title: `${"Mã KH"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${"Tên khách hàng"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.debt_suppliers_detail_opening || "debt_suppliers_detail_opening"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.debt_suppliers_detail_period || "debt_suppliers_detail_period"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.debt_suppliers_detail_incurred || "debt_suppliers_detail_incurred"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.debt_suppliers_detail_expenses || "debt_suppliers_detail_expenses"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.debt_suppliers_detail_debt_period || "debt_suppliers_detail_debt_period"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.debt_suppliers_detail_Ending || "debt_suppliers_detail_Ending"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],
            data: dataTable.dataExcel?.map((e) => [
                { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
                { value: `${e?.code ? e?.code : ""}` },
                { value: `${e?.name ? e?.name : ""}` },
                { value: `${e?.no_start ? formatNumber(e?.no_start) : ""}` },
                { value: `${e?.thu_start ? formatNumber(e?.thu_start) : ""}` },
                { value: `${e?.no_debt ? formatNumber(e?.no_debt) : ""}` },
                { value: `${e?.thu_debt ? formatNumber(e?.thu_debt) : ""}` },
                { value: `${e?.no_end ? formatNumber(e?.no_end) : ""}` },
                { value: `${e?.thu_end ? formatNumber(e?.thu_end) : ""}` },
            ]),
        },
    ];

    const propsPopup = {
        dataLang,
        date: valueChange.valueDate,
        idBranch: valueChange.idBranch,
        idSupplier: valueChange.idSupplier,
    };
    return (
        <React.Fragment>
            <Head>
                <title>{"Công nợ khách hàng"} </title>
            </Head>
            <div className="3xl:pt-[88px] 2xl:pt-[74px] xl:pt-[60px] lg:pt-[60px] 3xl:px-10 3xl:pb-10 2xl:px-10 2xl:pb-8 xl:px-10 xl:pb-10 lg:px-5 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {trangthaiExprired ? (
                    <div className="p-3"></div>
                ) : (
                    <div className={` flex space-x-3 xl:text-[14.5px] text-[12px]`}>
                        <h6 className="text-[#141522]/40">{"Công nợ khách hàng"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{"Công nợ khách hàng"}</h6>
                    </div>
                )}

                <div className="grid grid-cols gap-1 h-[100%] overflow-hidden ">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-0.5 h-[96%] overflow-hidden">
                            <div className="flex justify-between">
                                <h2 className="text-2xl text-[#52575E] capitalize">{"Công nợ khách hàng"}</h2>
                            </div>
                            <div className="space-y-2 3xl:h-[92%] 2xl:h-[88%] xl:h-[95%] lg:h-[90%] overflow-hidden">
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded-lg grid grid-cols-6 justify-between xl:p-3 p-2">
                                        <div className="col-span-5">
                                            <div className="grid grid-cols-5">
                                                <SearchComponent
                                                    dataLang={dataLang}
                                                    onChange={_HandleOnChangeKeySearch.bind(this)}
                                                />
                                                <SelectComponent
                                                    options={[
                                                        {
                                                            value: "",
                                                            label:
                                                                dataLang?.purchase_order_branch ||
                                                                "purchase_order_branch",
                                                            isDisabled: true,
                                                        },
                                                        ...dataTable.listBr,
                                                    ]}
                                                    value={valueChange.idBranch}
                                                    onChange={onchangFilter("idBranch")}
                                                    placeholder={
                                                        dataLang?.purchase_order_table_branch ||
                                                        "purchase_order_table_branch"
                                                    }
                                                />
                                                <SelectComponent
                                                    options={[
                                                        {
                                                            value: "",
                                                            label:
                                                                dataLang?.purchase_order_supplier ||
                                                                "purchase_order_supplier",
                                                            isDisabled: true,
                                                        },
                                                        ...dataTable.listSupplier,
                                                    ]}
                                                    onChange={onchangFilter("idSupplier")}
                                                    value={valueChange.idSupplier}
                                                    placeholder={
                                                        dataLang?.purchase_order_table_supplier ||
                                                        "purchase_order_table_supplier"
                                                    }
                                                />
                                                <DatepickerComponent
                                                    value={valueChange.valueDate}
                                                    onChange={onchangFilter("valueDate")}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="flex justify-end items-center gap-2">
                                                <OnResetData sOnFetching={sOnFetching} />
                                                <div>
                                                    {dataTable.dataExcel?.length > 0 && (
                                                        <ExcelFileComponent
                                                            multiDataSet={multiDataSet}
                                                            filename={"Danh sách công nợ khách hàng"}
                                                            title="DSCNKH"
                                                            dataLang={dataLang}
                                                        />
                                                    )}
                                                </div>
                                                <div className="">
                                                    <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="min:h-[200px] 3xl:h-[92%] 2xl:h-[92%] xl:h-[82%] lg:h-[82%] max:h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className="pr-2 w-[100%]">
                                        <div className="grid grid-cols-12  sticky top-0 z-10 rounded-xl shadow-md bg-gray-50 divide-x">
                                            <div className="col-span-1 grid items-center">
                                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]   text-center ">
                                                    {dataLang?.customerDebt_code || "customerDebt_code"}
                                                </h4>
                                            </div>
                                            <div className="col-span-2 grid items-center">
                                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]   text-center ">
                                                    {dataLang?.customerDebt_suppliert || "customerDebt_suppliert"}
                                                </h4>
                                            </div>
                                            <div className="col-span-3 grid grid-cols-4  items-center justify-center">
                                                <h4 className="2xl:text-[14px] xl:text-[10px] border-b text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]  col-span-4 text-center ">
                                                    {dataLang?.debt_suppliers_balance || "debt_suppliers_balance"}
                                                </h4>
                                                <h4 className="2xl:text-[14px] pt-1 xl:text-[10px] border-r border-gray-200  text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]  col-span-2 text-center ">
                                                    {dataLang?.debt_suppliers_inDebt || "debt_suppliers_inDebt"}
                                                </h4>
                                                <h4 className="2xl:text-[14px] pt-1 xl:text-[10px]  text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]  col-span-2 text-center ">
                                                    {dataLang?.customerDebt_collect || "customerDebt_collect"}
                                                </h4>
                                            </div>
                                            <div className="col-span-3 grid grid-cols-4   items-center justify-center">
                                                <h4 className="2xl:text-[14px] xl:text-[10px] border-b text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]  col-span-4 text-center ">
                                                    {dataLang?.debt_suppliers_Arise || "debt_suppliers_Arise"}
                                                </h4>
                                                <h4 className="2xl:text-[14px] pt-1 xl:text-[10px] border-r border-gray-200  text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]  col-span-2 text-center ">
                                                    {dataLang?.debt_suppliers_inDebt || "debt_suppliers_inDebt"}
                                                </h4>
                                                <h4 className="2xl:text-[14px] pt-1 xl:text-[10px]  text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]  col-span-2 text-center ">
                                                    {dataLang?.customerDebt_collect || "customerDebt_collect"}
                                                </h4>
                                            </div>
                                            <div className="col-span-3 grid grid-cols-4  items-center justify-center">
                                                <h4 className="2xl:text-[14px] xl:text-[10px] border-b text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]  col-span-4 text-center ">
                                                    {dataLang?.debt_suppliers_Ending || "debt_suppliers_Ending"}
                                                </h4>
                                                <h4 className="2xl:text-[14px] pt-1 xl:text-[10px] border-r border-gray-200  text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]  col-span-2 text-center ">
                                                    {dataLang?.debt_suppliers_inDebt || "debt_suppliers_inDebt"}
                                                </h4>
                                                <h4 className="2xl:text-[14px] pt-1 xl:text-[10px]  text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]  col-span-2 text-center ">
                                                    {dataLang?.customerDebt_collect || "customerDebt_collect"}
                                                </h4>
                                            </div>
                                        </div>
                                        {onFetching ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : dataTable.data?.length > 0 ? (
                                            <>
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                                    {dataTable.data?.map((e) => (
                                                        <div
                                                            className="relative  grid grid-cols-12 items-center py-1.5  hover:bg-slate-100/40 group"
                                                            key={e.id.toString()}
                                                        >
                                                            <h6 className="text-center 3xl:text-base 2xl:text-[12.5px] py-2 xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 capitalize">
                                                                {e.code}
                                                            </h6>
                                                            <h6 className="text-left 3xl:text-base 2xl:text-[12.5px] py-2 xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-2 capitalize">
                                                                {e.name}
                                                            </h6>
                                                            <div className="col-span-3 grid grid-cols-4  items-center justify-center">
                                                                <h4 className="text-right 3xl:text-base 2xl:text-[12.5px] py-2 xl:text-[11px] font-medium text-[9px] text-[#0F4F9E] hover:text-blue-600 transition-all duration-300 ease-in-out px-2 col-span-2 capitalize">
                                                                    {e.no_start == "0" ? (
                                                                        "-"
                                                                    ) : (
                                                                        <Popup_chitietDauki
                                                                            name={
                                                                                e.no_start == "0"
                                                                                    ? "-"
                                                                                    : formatNumber(e.no_start)
                                                                            }
                                                                            id={e?.id}
                                                                            type={"no_start"}
                                                                            className="text-left"
                                                                            supplier_name={e.name}
                                                                            {...propsPopup}
                                                                        />
                                                                    )}
                                                                </h4>
                                                                <h4 className="text-right 3xl:text-base 2xl:text-[12.5px] py-2 xl:text-[11px] font-medium text-[9px] text-[#0F4F9E] hover:text-blue-600 transition-all duration-300 ease-in-out px-2 col-span-2 capitalize">
                                                                    {e.thu_start == "0" ? (
                                                                        "-"
                                                                    ) : (
                                                                        <Popup_chitietDauki
                                                                            name={
                                                                                e.thu_start == "0"
                                                                                    ? "-"
                                                                                    : formatNumber(e.thu_start)
                                                                            }
                                                                            id={e?.id}
                                                                            className="text-left"
                                                                            supplier_name={e.name}
                                                                            {...propsPopup}
                                                                        />
                                                                    )}
                                                                </h4>
                                                            </div>
                                                            <div className="col-span-3 grid grid-cols-4  items-center justify-center">
                                                                <h4 className="text-right 3xl:text-base 2xl:text-[12.5px] py-2 xl:text-[11px] font-medium text-[9px] text-[#0F4F9E] hover:text-blue-600 transition-all duration-300 ease-in-out px-2 col-span-2 capitalize">
                                                                    {e.no_debt == "0" ? (
                                                                        "-"
                                                                    ) : (
                                                                        <Popup_chitietPhatsinh
                                                                            name={
                                                                                e.no_debt == "0"
                                                                                    ? "-"
                                                                                    : formatNumber(e.no_debt)
                                                                            }
                                                                            className="text-left uppercase"
                                                                            id={e?.id}
                                                                            type={"no_debt"}
                                                                            supplier_name={e.name}
                                                                            {...propsPopup}
                                                                        />
                                                                    )}
                                                                </h4>

                                                                <h4 className="text-right 3xl:text-base 2xl:text-[12.5px] py-2 xl:text-[11px] font-medium text-[9px] text-[#0F4F9E] hover:text-blue-600 transition-all duration-300 ease-in-out px-2 col-span-2 capitalize">
                                                                    {e.thu_debt == "0" ? (
                                                                        "-"
                                                                    ) : (
                                                                        <Popup_chitietPhatsinh
                                                                            className="text-left uppercase"
                                                                            name={
                                                                                e.thu_debt == "0"
                                                                                    ? "-"
                                                                                    : formatNumber(e.thu_debt)
                                                                            }
                                                                            id={e?.id}
                                                                            type={"thu_debt"}
                                                                            supplier_name={e.name}
                                                                            {...propsPopup}
                                                                        />
                                                                    )}
                                                                </h4>
                                                            </div>

                                                            <div className="col-span-3 grid grid-cols-4  items-center justify-center">
                                                                <h4 className="text-right 3xl:text-base 2xl:text-[12.5px] py-2 xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-2 capitalize">
                                                                    {e.no_end == "0" ? "-" : formatNumber(e.no_end)}
                                                                </h4>
                                                                <h4 className="text-right 3xl:text-base 2xl:text-[12.5px] py-2 xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-2 capitalize">
                                                                    {e.thu_end == "0" ? "-" : formatNumber(e.thu_end)}
                                                                </h4>
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
                            </div>
                        </div>
                        <div className="grid grid-cols-12 bg-slate-100 shadow items-center rounded-md">
                            <div className="col-span-3 p-2 text-center">
                                <h3 className="uppercase text-gray-600 font-medium 3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-[9px]">
                                    {dataLang?.import_total || "import_total"}
                                </h3>
                            </div>

                            <div className="col-span-3 grid grid-cols-4  items-center justify-center">
                                <h3 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-zinc-600 font-medium text-[8px] px-4 col-span-2 text-right border-r">
                                    {formatNumber(total?.no_start)}
                                </h3>
                                <h3 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-zinc-600 font-medium text-[8px] px-4 col-span-2 text-right border-r">
                                    {formatNumber(total?.thu_start)}
                                </h3>
                            </div>
                            <div className="col-span-3 grid grid-cols-4  items-center justify-center">
                                <h3 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-zinc-600 font-medium text-[8px] px-4 col-span-2 text-right border-r">
                                    {formatNumber(total?.no_debt)}
                                </h3>
                                <h3 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-zinc-600 font-medium text-[8px] px-4 col-span-2 text-right border-r">
                                    {formatNumber(total?.thu_debt)}
                                </h3>
                            </div>
                            <div className="col-span-3 grid grid-cols-4  items-center justify-center">
                                <h3 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-zinc-600 font-medium text-[8px] px-4 col-span-2 text-right border-r">
                                    {formatNumber(total?.no_end)}
                                </h3>
                                <h3 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-zinc-600 font-medium text-[8px] px-4 col-span-2 text-right ">
                                    {formatNumber(total?.thu_end)}
                                </h3>
                            </div>
                        </div>
                        {dataTable.data?.length != 0 && (
                            <div className="flex space-x-5 items-center">
                                <h6 className="">
                                    {dataLang?.display} {totalItems?.iTotalDisplayRecords} {dataLang?.among}{" "}
                                    {totalItems?.iTotalRecords} {dataLang?.ingredient}
                                </h6>
                                <Pagination
                                    postsPerPage={limit}
                                    totalPosts={Number(totalItems?.iTotalDisplayRecords)}
                                    paginate={paginate}
                                    currentPage={router.query?.page || 1}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
export default Index;
