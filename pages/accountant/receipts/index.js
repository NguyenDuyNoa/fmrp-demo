import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

import moment from "moment/moment";
import ModalImage from "react-modal-image";
import { Grid6 as IconExcel, ArrowDown2 as IconDown, SearchNormal1 as IconSearch } from "iconsax-react";

import Popup_chitietThere from "../detailThere";
import Popup_chitiet from "./(popup)/detail";
import Popup_dspt from "./(popup)/popup";

import { _ServerInstance as Axios } from "/services/axios";

import Loading from "@/components/UI/loading";
import BtnAction from "@/components/UI/BtnAction";
import Pagination from "@/components/UI/pagination";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import DatepickerComponent from "@/components/UI/filterComponents/dateTodateComponent";

import { useSetData } from "@/hooks/useSetData";
import { useChangeValue } from "@/hooks/useChangeValue";
import useStatusExprired from "@/hooks/useStatusExprired";
import { debounce } from "lodash";

const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const trangthaiExprired = useStatusExprired();

    const inistialValue = {
        idBranch: null,
        idObject: null,
        idMethod: null,
        valueDate: { startDate: null, endDate: null },
    };

    const initstialData = { table: [], excel: [], total: {}, listBr: [], dataMethod: [], dataObject: [] };

    const inistialFetch = { onFetching: false, onFetching_filter: false };

    const [keySearch, sKeySearch] = useState("");

    const [limit, sLimit] = useState(15);

    const [totalItem, sTotalItems] = useState([]);

    const [fetching, sFetching] = useState(inistialFetch);

    const { isData: dataTable, updateData } = useSetData(initstialData);

    const { isValue: value, onChangeValue } = useChangeValue(inistialValue);

    const updateFetch = (e) => sFetching((i) => ({ ...i, ...e }));

    useEffect(() => {
        router.push({
            pathname: router.route,
            query: { tab: router.query?.tab ? router.query?.tab : 0 },
        });
    }, []);

    const parameters = {
        limit: limit,
        page: router.query?.page || 1,
        "filter[branch_id]": value.idBranch != null ? value.idBranch.value : null,
        "filter[start_date]": value.valueDate?.startDate != null ? value.valueDate?.startDate : null,
        "filter[end_date]": value.valueDate?.endDate != null ? value.valueDate?.endDate : null,
        "filter[payment_mode]": value.idMethod != null ? value.idMethod.value : null,
        "filter[objects]": value.idObject != null ? value.idObject.value : null,
        "filter[search]": keySearch,
    };

    const _ServerFetching = () => {
        Axios(
            "GET",
            `/api_web/Api_expense_payslips/expenseCoupon/?csrf_protection=true`,
            {
                params: parameters,
            },
            (err, response) => {
                if (!err) {
                    let { rResult, output, rTotal } = response.data;

                    updateData({ table: rResult, excel: rResult, total: rTotal });

                    sTotalItems(output);
                }
                updateFetch({ onFetching: false });
            }
        );
    };

    const _ServerFetching_filter = () => {
        Axios("GET", `/api_web/Api_Branch/branchCombobox/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let { result } = response.data;
                updateData({ listBr: result?.map(({ name, id }) => ({ label: name, value: id })) });
            }
        });

        Axios("GET", "/api_web/Api_payment_method/payment_method/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let { rResult } = response.data;
                updateData({ dataMethod: rResult?.map(({ name, id }) => ({ label: name, value: id })) });
            }
        });

        Axios("GET", "/api_web/Api_expense_voucher/object/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let data = response.data;
                updateData({ dataObject: data?.map(({ name, id }) => ({ label: dataLang[name], value: id })) });
            }
        });

        updateFetch({ onFetching_filter: false });
    };

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        sKeySearch(value);

        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            },
        });
        // setTimeout(() => {
        //     if (!value) {
        //         updateFetch({ onFetching: true });
        //     }
        //     updateFetch({ onFetching: true });
        // }, 500);
        updateFetch({ onFetching: true });
    }, 500)

    const paginate = (pageNumber) => {
        const queryParams = { ...router.query, page: pageNumber };

        router.push({
            pathname: router.route,
            query: queryParams,
        });
    };

    useEffect(() => {
        fetching.onFetching_filter && _ServerFetching_filter();
    }, [fetching.onFetching_filter]);

    useEffect(() => {
        fetching.onFetching && _ServerFetching();
    }, [fetching.onFetching]);

    useEffect(() => {
        (router.query.tab && updateFetch({ onFetching: true })) ||
            (keySearch && updateFetch({ onFetching: true })) ||
            (router.query?.tab && updateFetch({ onFetching_filter: true }));
    }, [limit, router.query?.page, router.query?.tab]);

    useEffect(() => {
        if (
            value.idBranch != null ||
            (value.valueDate.startDate != null && value.valueDate.endDate != null) ||
            value.idMethod != null ||
            value.idObject != null
        ) {
            router.push({
                pathname: router.route,
                query: {
                    tab: router.query?.tab,
                },
            });

            setTimeout(() => {
                (value.idBranch != null && updateFetch({ onFetching: true })) ||
                    (value.valueDate.startDate != null &&
                        value.valueDate.endDate != null &&
                        updateFetch({ onFetching: true })) ||
                    (value.idMethod != null && updateFetch({ onFetching: true })) ||
                    (value.idObject != null && updateFetch({ onFetching: true }));
            }, 300);
        } else {
            updateFetch({ onFetching: true });
        }
    }, [value.idBranch, value.valueDate.endDate, value.valueDate.startDate, value.idMethod, value.idObject]);

    const formatNumber = (number) => {
        if (!number && number !== 0) return 0;
        const integerPart = Math.floor(number);
        const decimalPart = number - integerPart;
        const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
        const roundedNumber = integerPart + roundedDecimalPart;
        return roundedNumber.toLocaleString("en");
    };

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
                    title: `${dataLang?.payment_date || "payment_date"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_code || "payment_code"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_obType || "payment_obType"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_ob || "payment_ob"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_typeOfDocument || "payment_typeOfDocument"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_voucherCode || "payment_voucherCode"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_TT_method || "payment_TT_method"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_amountOfMoney || "payment_amountOfMoney"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_creator || "payment_creator"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_branch || "payment_branch"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_note || "payment_note"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],

            data: dataTable.excel?.map((e) => [
                { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
                { value: `${e?.date ? e?.date : ""}` },
                { value: `${e?.code ? e?.code : ""}` },
                { value: `${e?.objects ? (dataLang[e.objects] !== undefined ? dataLang[e.objects] : "") : ""}` },
                { value: `${e?.object_text ? e?.object_text : ""}` },
                { value: `${e?.type_vouchers ? dataLang[e?.type_vouchers] || e?.type_vouchers : ""}` },
                { value: `${e?.voucher ? e?.voucher.map((e) => e.code).join(", ") : ""}` },
                { value: `${e?.payment_mode_name ? e?.payment_mode_name : ""}` },
                { value: `${e?.total ? formatNumber(e?.total) : ""}` },
                { value: `${e?.staff_name ? e?.staff_name : ""}` },
                { value: `${e?.branch_name ? e?.branch_name : ""}` },
                { value: `${e?.note ? e?.note : ""}` },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.receipts_title || "receipts_title"}</title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
                {trangthaiExprired ? (
                    <div className="p-2"></div>
                ) : (
                    <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                        <h6 className="text-[#141522]/40">{dataLang?.receipts_title || "receipts_title"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.receipts_title || "receipts_title"}</h6>
                    </div>
                )}

                <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-3 h-[96%] overflow-hidden">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl text-[#52575E] capitalize">
                                    {dataLang?.receipts_title || "receipts_title"}
                                </h2>
                                <div className="flex justify-end items-center mr-1 mt-1">
                                    <Popup_dspt
                                        onRefresh={_ServerFetching.bind(this)}
                                        dataLang={dataLang}
                                        className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded grid grid-cols-8 justify-between xl:p-3 p-2">
                                        <div className="col-span-7">
                                            <div className="grid grid-cols-10 items-center space-x-1">
                                                <SearchComponent
                                                    dataLang={dataLang}
                                                    onChange={_HandleOnChangeKeySearch.bind(this)}
                                                    colSpan={2}
                                                />
                                                <SelectComponent
                                                    options={[
                                                        {
                                                            value: "",
                                                            label:
                                                                dataLang?.payment_select_branch ||
                                                                "payment_select_branch",
                                                            isDisabled: true,
                                                        },
                                                        ...dataTable.listBr,
                                                    ]}
                                                    isClearable={true}
                                                    value={value.idBranch}
                                                    onChange={onChangeValue("idBranch")}
                                                    placeholder={dataLang?.client_list_filterbrand}
                                                    colSpan={2}
                                                />
                                                <SelectComponent
                                                    options={[
                                                        {
                                                            value: "",
                                                            label: dataLang?.payment_TT_method || "payment_TT_method",
                                                            isDisabled: true,
                                                        },
                                                        ...dataTable.dataMethod,
                                                    ]}
                                                    isClearable={true}
                                                    onChange={onChangeValue("idMethod")}
                                                    value={value.idMethod}
                                                    placeholder={dataLang?.payment_TT_method || "payment_TT_method"}
                                                    colSpan={2}
                                                />
                                                <SelectComponent
                                                    options={[
                                                        {
                                                            value: "",
                                                            label: dataLang?.payment_select_ob || "payment_select_ob",
                                                            isDisabled: true,
                                                        },
                                                        ...dataTable.dataObject,
                                                    ]}
                                                    isClearable={true}
                                                    onChange={onChangeValue("idObject")}
                                                    value={value.idObject}
                                                    placeholder={dataLang?.payment_ob || "payment_ob"}
                                                    colSpan={2}
                                                />
                                                <DatepickerComponent
                                                    colSpan={2}
                                                    value={value.valueDate}
                                                    onChange={onChangeValue("valueDate")}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="flex justify-end items-center gap-2">
                                                <OnResetData sOnFetching={sFetching} />
                                                <div>
                                                    {dataTable.excel?.length > 0 && (
                                                        <ExcelFileComponent
                                                            multiDataSet={multiDataSet}
                                                            filename={dataLang?.receipts_lits || "receipts_lits"}
                                                            title="DSPT"
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
                                <div className="min:h-[200px] h-[88%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className="pr-2 w-[100%] lx:w-[110%] ">
                                        <div className="grid grid-cols-12 items-center sticky top-0 p-2 z-10 rounded-xl shadow-sm bg-white divide-x">
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.payment_date || "payment_date"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.payment_code || "payment_code"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.payment_obType || "payment_obType"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.payment_ob || "payment_ob"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.payment_typeOfDocument || "payment_typeOfDocument"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.payment_voucherCode || "payment_voucherCode"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {"PTTT"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.payment_amountOfMoney || "payment_amountOfMoney"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.payment_creator || "payment_creator"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.payment_branch || "payment_branch"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.payment_note || "payment_note"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.payment_action || "payment_action"}
                                            </h4>
                                        </div>
                                        {fetching.onFetching ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : dataTable.table?.length > 0 ? (
                                            <>
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                                    {dataTable.table?.map((e) => (
                                                        <div
                                                            className="grid grid-cols-12 items-center py-1.5 px-2 hover:bg-slate-100/40 "
                                                            key={e.id.toString()}
                                                        >
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  rounded-md text-center">
                                                                {e?.date != null
                                                                    ? moment(e?.date).format("DD/MM/YYYY")
                                                                    : ""}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] hover:text-blue-600 transition-all ease-in-out  rounded-md text-center text-[#0F4F9E]">
                                                                <Popup_chitiet
                                                                    dataLang={dataLang}
                                                                    className="text-center"
                                                                    name={e?.code}
                                                                    id={e?.id}
                                                                />
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  col-span-1 flex items-center w-fit mx-auto">
                                                                <div className="mx-auto">
                                                                    {(e?.objects === "client" && (
                                                                        <span className="flex items-center justify-center font-normal text-sky-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-sky-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                                            {dataLang[e?.objects] || e?.objects}
                                                                        </span>
                                                                    )) ||
                                                                        (e?.objects === "supplier" && (
                                                                            <span className=" flex items-center justify-center font-normal text-orange-500 rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-orange-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                                                {dataLang[e?.objects] || e?.objects}
                                                                            </span>
                                                                        )) ||
                                                                        (e?.objects === "other" && (
                                                                            <span className="flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-lime-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                                                {dataLang[e?.objects] || e?.objects}
                                                                            </span>
                                                                        ))}
                                                                </div>
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-1  rounded-md text-left">
                                                                {e?.object_text}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  col-span-1 flex items-center w-fit mx-auto">
                                                                <div className="mx-auto">
                                                                    {(e?.type_vouchers === "import" && (
                                                                        <span className="flex items-center justify-center font-normal text-purple-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-purple-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                                            {dataLang[e?.type_vouchers] ||
                                                                                e?.type_vouchers}
                                                                        </span>
                                                                    )) ||
                                                                        (e?.type_vouchers === "deposit" && (
                                                                            <span className=" flex items-center justify-center font-normal text-cyan-500 rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-cyan-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                                                {dataLang[e?.type_vouchers] ||
                                                                                    e?.type_vouchers}
                                                                            </span>
                                                                        )) ||
                                                                        (e?.type_vouchers === "service" && (
                                                                            <span className="flex items-center justify-center gap-1 font-normal text-red-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-rose-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                                                {dataLang[e?.type_vouchers] ||
                                                                                    e?.type_vouchers}
                                                                            </span>
                                                                        )) ||
                                                                        (e?.type_vouchers === "order" && (
                                                                            <span className="flex items-center justify-center gap-1 font-normal text-green-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-green-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                                                {dataLang[e?.type_vouchers] ||
                                                                                    e?.type_vouchers}
                                                                            </span>
                                                                        ))}
                                                                </div>
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px]  px-2 py-1  rounded-md text-center text-[#0F4F9E]">
                                                                {e?.voucher?.map((code, index) => (
                                                                    <Popup_chitietThere
                                                                        key={code?.id}
                                                                        dataLang={dataLang}
                                                                        className="text-left hover:text-blue-600 transition-all ease-in-out"
                                                                        type={code.voucher_type}
                                                                        id={code.id}
                                                                        name={code?.code}
                                                                    >
                                                                        {code?.code}
                                                                    </Popup_chitietThere>
                                                                ))}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-1  rounded-md text-center">
                                                                {e?.payment_mode_name}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-1  rounded-md text-right">
                                                                {formatNumber(e?.total)}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-1  rounded-md text-left flex items-center space-x-1">
                                                                <div className="relative">
                                                                    <ModalImage
                                                                        small={
                                                                            e?.profile_image
                                                                                ? e?.profile_image
                                                                                : "/user-placeholder.jpg"
                                                                        }
                                                                        large={
                                                                            e?.profile_image
                                                                                ? e?.profile_image
                                                                                : "/user-placeholder.jpg"
                                                                        }
                                                                        className="h-6 w-6 rounded-full object-cover "
                                                                    />
                                                                    <span className="h-2 w-2 absolute 3xl:bottom-full 3xl:translate-y-[150%] 3xl:left-1/2  3xl:translate-x-[100%] 2xl:bottom-[80%] 2xl:translate-y-full 2xl:left-1/2 bottom-[50%] left-1/2 translate-x-full translate-y-full">
                                                                        <span className="inline-flex relative rounded-full h-2 w-2 bg-lime-500">
                                                                            <span className="animate-ping  inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 absolute"></span>
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                                <h6 className="capitalize">{e?.staff_name}</h6>
                                                            </h6>
                                                            <h6 className="col-span-1 w-fit mx-auto">
                                                                <div className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">
                                                                    {e?.branch_name}
                                                                </div>
                                                            </h6>
                                                            <h6 className="2xl:text-base xl:text-xs text-[8px]  px-2 py-0.5 col-span-1  rounded-md text-left truncate">
                                                                {e?.note}
                                                            </h6>
                                                            <div className="col-span-1 flex justify-center">
                                                                <BtnAction
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    dataLang={dataLang}
                                                                    id={e?.id}
                                                                    type="receipts"
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
                                                        Không tìm thấy các mục
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
                            <div className="col-span-7 p-2 text-center">
                                <h3 className="uppercase font-normal 2xl:text-base xl:text-xs text-[8px]">
                                    {dataLang?.purchase_order_table_total_outside ||
                                        "purchase_order_table_total_outside"}
                                </h3>
                            </div>
                            <div className="col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap">
                                <h3 className="font-normal 2xl:text-base xl:text-xs text-[8px]">
                                    {formatNumber(dataTable.total?.sum_total)}
                                </h3>
                            </div>
                        </div>
                        {dataTable.table?.length != 0 && (
                            <div className="flex space-x-5 items-center">
                                <h6>
                                    {dataLang?.display} {totalItem?.iTotalDisplayRecords} {dataLang?.among}{" "}
                                    {totalItem?.iTotalRecords} {dataLang?.ingredient}
                                </h6>
                                <Pagination
                                    postsPerPage={limit}
                                    totalPosts={Number(totalItem?.iTotalDisplayRecords)}
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
