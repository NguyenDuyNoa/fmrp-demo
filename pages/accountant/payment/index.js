import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

import {
    Edit as IconEdit,
    Grid6 as IconExcel,
    ArrowDown2 as IconDown,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    Add as IconAdd,
} from "iconsax-react";

import moment from "moment/moment";
import ModalImage from "react-modal-image";
import "react-datepicker/dist/react-datepicker.css";

import Popup_dspc from "./(popup)/popup";
import Popup_chitiet from "./(popup)/detail";
import Popup_chitietThere from "../detailThere";

import { _ServerInstance as Axios } from "/services/axios";

import Loading from "@/components/UI/loading";
import BtnAction from "@/components/UI/BtnAction";
import Pagination from "@/components/UI/pagination";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import DatepickerComponent from "@/components/UI/filterComponents/dateTodateComponent";

import { useSetData } from "@/hooks/useSetData";
import usePagination from "@/hooks/usePagination";
import { useChangeValue } from "@/hooks/useChangeValue";
import useStatusExprired from "@/hooks/useStatusExprired";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import { debounce } from "lodash";

const Index = (props) => {
    const dataLang = props.dataLang;

    const initialValue = {
        idBranch: null,
        idObject: null,
        idMethod: null,
        valueDate: { startDate: null, endDate: null },
    };

    const initialData = { data: [], data_ex: [], dataMethod: [], dataObject: [], listBr: [] };

    const router = useRouter();

    const { paginate } = usePagination();

    const [total, sTotal] = useState({});

    const [keySearch, sKeySearch] = useState("");

    const trangthaiExprired = useStatusExprired();

    const [onFetching, sOnFetching] = useState(false);

    const { isData, updateData } = useSetData(initialData);

    const { isValue, onChangeValue } = useChangeValue(initialValue);

    const [onFetching_filter, sOnFetching_filter] = useState(false);

    const { data, data_ex, dataMethod, dataObject, listBr } = isData;

    const { limit, totalItems: totalItem, updateLimit, updateTotalItems } = useLimitAndTotalItems(15, {});

    useEffect(() => {
        router.push({
            pathname: router.route,
            query: { tab: router.query?.tab ? router.query?.tab : 0 },
        });
    }, []);

    const _ServerFetching = () => {
        Axios(
            "GET",
            `/api_web/Api_expense_voucher/expenseVoucher/?csrf_protection=true`,
            {
                params: {
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id]": isValue?.idBranch != null ? isValue?.idBranch.value : null,
                    "filter[start_date]": isValue?.valueDate?.startDate != null ? isValue?.valueDate?.startDate : null,
                    "filter[end_date]": isValue?.valueDate?.endDate != null ? isValue?.valueDate?.endDate : null,
                    "filter[payment_mode]": isValue?.idMethod != null ? isValue?.idMethod.value : null,
                    "filter[objects]": isValue?.idObject != null ? isValue?.idObject.value : null,
                    "filter[search]": keySearch,
                },
            },
            (err, response) => {
                if (!err) {
                    let { rResult, output, rTotal } = response.data;

                    updateData({ data: rResult, data_ex: rResult });

                    updateTotalItems(output);

                    sTotal(rTotal);
                }

                sOnFetching(false);
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

                updateData({ dataObject: data?.map(({ name, id }) => ({ label: dataLang[name] || name, value: id })) });
            }
        });

        sOnFetching_filter(false);
    };

    useEffect(() => {
        onFetching_filter && _ServerFetching_filter();
    }, [onFetching_filter]);

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
        //         sOnFetching(true);
        //     }
        //     sOnFetching(true);
        // }, 500);
        sOnFetching(true);
    }, 500)

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        (router.query.tab && sOnFetching(true)) ||
            (keySearch && sOnFetching(true)) ||
            (router.query?.tab && sOnFetching_filter(true));
    }, [limit, router.query?.page, router.query?.tab]);

    useEffect(() => {
        if (
            isValue?.idBranch != null ||
            (isValue?.valueDate.startDate != null && isValue?.valueDate.endDate != null) ||
            isValue?.idMethod != null ||
            isValue?.idObject != null
        ) {
            router.push({
                pathname: router.route,
                query: {
                    tab: router.query?.tab,
                },
            });
            setTimeout(() => {
                (isValue?.idBranch != null && sOnFetching(true)) ||
                    (isValue?.valueDate.startDate != null && isValue?.valueDate.endDate != null && sOnFetching(true)) ||
                    (isValue?.idMethod != null && sOnFetching(true)) ||
                    (isValue?.idObject != null && sOnFetching(true));
            }, 300);
        } else {
            sOnFetching(true);
        }
    }, [
        isValue?.idBranch,
        isValue?.valueDate.endDate,
        isValue?.valueDate.startDate,
        isValue?.idMethod,
        isValue?.idObject,
    ]);

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
                    title: `${dataLang?.payment_costs || "payment_costs"}`,
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

            data: data_ex?.map((e) => [
                { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
                { value: `${e?.date ? e?.date : ""}` },
                { value: `${e?.code ? e?.code : ""}` },
                {
                    value: `${e?.objects ? (dataLang[e.objects] !== undefined ? dataLang[e.objects] : "") : ""}`,
                },
                { value: `${e?.object_text ? e?.object_text : ""}` },
                {
                    value: `${e?.type_vouchers
                        ? dataLang[e?.type_vouchers] != undefined
                            ? dataLang[e?.type_vouchers]
                            : ""
                        : ""
                        }`,
                },
                {
                    value: `${e?.voucher_code ? e?.voucher_code.join(", ") : ""}`,
                },
                {
                    value: `${e?.payment_mode_name ? e?.payment_mode_name : ""}`,
                },
                { value: `${e?.cost_name ? e?.cost_name?.join(", ") : ""}` },
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
                <title>{dataLang?.payment_title || "payment_title"}</title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
                {trangthaiExprired ? (
                    <div className="p-2"></div>
                ) : (
                    <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                        <h6 className="text-[#141522]/40">{dataLang?.payment_title || "payment_title"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.payment_title || "payment_title"}</h6>
                    </div>
                )}

                <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-3 h-[96%] overflow-hidden">
                            <div className="flex justify-between">
                                <h2 className="text-2xl text-[#52575E] capitalize">
                                    {dataLang?.payment_title || "payment_title"}
                                </h2>
                                <div className="flex justify-end items-center">
                                    <Popup_dspc
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
                                                        ...listBr,
                                                    ]}
                                                    isClearable={true}
                                                    onChange={onChangeValue("idBranch")}
                                                    value={isValue?.idBranch}
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
                                                        ...dataMethod,
                                                    ]}
                                                    isClearable={true}
                                                    onChange={onChangeValue("idMethod")}
                                                    value={isValue?.idMethod}
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
                                                        ...dataObject,
                                                    ]}
                                                    isClearable={true}
                                                    onChange={onChangeValue("idObject")}
                                                    value={isValue?.idObject}
                                                    placeholder={dataLang?.payment_ob || "payment_ob"}
                                                    colSpan={2}
                                                />
                                                <DatepickerComponent
                                                    colSpan={2}
                                                    value={isValue?.valueDate}
                                                    onChange={onChangeValue("valueDate")}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="flex justify-end items-center gap-2">
                                                {" "}
                                                <OnResetData sOnFetching={sOnFetching} />
                                                <div>
                                                    {data_ex?.length > 0 && (
                                                        <ExcelFileComponent
                                                            multiDataSet={multiDataSet}
                                                            filename="Danh phiếu chi"
                                                            title="DSPC"
                                                            dataLang={dataLang}
                                                        />
                                                    )}
                                                </div>
                                                <div className="">
                                                    <DropdowLimit
                                                        sLimit={updateLimit}
                                                        limit={limit}
                                                        dataLang={dataLang}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="min:h-[200px] h-[88%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className="pr-2 w-[100%] lx:w-[110%] ">
                                        <div className="grid grid-cols-13 items-center sticky top-0 p-2 z-10 rounded-xl shadow-sm bg-white divide-x">
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
                                                {dataLang?.payment_costs || "payment_costs"}
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
                                        {onFetching ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : data?.length > 0 ? (
                                            <>
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                                    {data?.map((e) => (
                                                        <div
                                                            className="grid grid-cols-13 items-center py-1.5 px-2 hover:bg-slate-100/40 "
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
                                                                        ))}
                                                                </div>
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px]   transition-all ease-in-out px-2 py-1  rounded-md text-center text-[#0F4F9E]">
                                                                {e?.voucher?.map((code) => (
                                                                    <React.Fragment key={code.id}>
                                                                        <Popup_chitietThere
                                                                            key={code?.id}
                                                                            dataLang={dataLang}
                                                                            className="text-left hover:text-blue-600"
                                                                            type={code.voucher_type}
                                                                            id={code.id}
                                                                            name={code?.code}
                                                                        >
                                                                            {code?.code}
                                                                        </Popup_chitietThere>
                                                                    </React.Fragment>
                                                                ))}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-1  rounded-md text-center">
                                                                {e?.payment_mode_name}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-1  rounded-md text-left">
                                                                {e?.cost_name?.map((code, index) => (
                                                                    <React.Fragment key={code}>
                                                                        {code}
                                                                        {index !== e.cost_name.length - 1 && ", "}
                                                                    </React.Fragment>
                                                                ))}
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
                                                                    type="payment"
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
                        <div className="grid grid-cols-13 bg-gray-100 items-center">
                            <div className="col-span-8 p-2 text-center">
                                <h3 className="uppercase font-normal 2xl:text-base xl:text-xs text-[8px]">
                                    {dataLang?.purchase_order_table_total_outside ||
                                        "purchase_order_table_total_outside"}
                                </h3>
                            </div>
                            <div className="col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap">
                                <h3 className="font-normal 2xl:text-base xl:text-xs text-[8px]">
                                    {formatNumber(total?.sum_total)}
                                </h3>
                            </div>
                        </div>
                        {data?.length != 0 && (
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
