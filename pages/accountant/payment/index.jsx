import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import {
    Grid6
} from "iconsax-react";

import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";

import Popup_chitietThere from "../components/detailThere";
import Popup_chitiet from "./components/detail";
import Popup_dspc from "./components/popup";

import { _ServerInstance as Axios } from "/services/axios";

import { BtnAction } from "@/components/UI/BtnAction";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import DateToDateComponent from "@/components/UI/filterComponents/dateTodateComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import Loading from "@/components/UI/loading/loading";
import Pagination from "@/components/UI/pagination";

import { useChangeValue } from "@/hooks/useChangeValue";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import useActionRole from "@/hooks/useRole";
import { useSetData } from "@/hooks/useSetData";
import useStatusExprired from "@/hooks/useStatusExprired";

import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { TagColorMore, TagColorOrange, TagColorRed, TagColorSky } from "@/components/UI/common/Tag/TagStatus";
import { Container, ContainerBody, ContainerTable, ContainerTotal } from "@/components/UI/common/layout";
import CustomAvatar from "@/components/UI/common/user/CustomAvatar";
import NoData from "@/components/UI/noData/nodata";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import useSetingServer from "@/hooks/useConfigNumber";
import useToast from "@/hooks/useToast";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatMoneyConfig from "@/utils/helpers/formatMoney";

const Index = (props) => {
    const dataLang = props.dataLang;

    const initialValue = {
        idBranch: null,
        idObject: null,
        idMethod: null,
        valueDate: { startDate: null, endDate: null },
    };

    const dataSeting = useSetingServer()

    const initialData = { data: [], data_ex: [], dataMethod: [], dataObject: [], listBr: [] };

    const router = useRouter();

    const isShow = useToast()

    const { paginate } = usePagination();

    const [total, sTotal] = useState({});

    const [keySearch, sKeySearch] = useState("");

    const statusExprired = useStatusExprired();

    const [onFetching, sOnFetching] = useState(false);

    const { isData, updateData } = useSetData(initialData);

    const { isValue, onChangeValue } = useChangeValue(initialValue);

    const [onFetching_filter, sOnFetching_filter] = useState(false);

    const { data, data_ex, dataMethod, dataObject, listBr } = isData;

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkEdit, checkExport } = useActionRole(auth, 'payment');

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
        return formatMoneyConfig(+number, dataSeting)
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
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.payment_title || "payment_title"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.payment_title || "payment_title"}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="space-y-3 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.payment_title || 'payment_title'}
                            </h2>
                            <div className="flex justify-end items-center gap-2">
                                {role == true || checkAdd ?
                                    <Popup_dspc
                                        onRefresh={_ServerFetching.bind(this)}
                                        dataLang={dataLang}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" /> :
                                    <button
                                        type="button"
                                        onClick={() => {
                                            isShow("warning", WARNING_STATUS_ROLE);
                                        }}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    >{dataLang?.branch_popup_create_new}
                                    </button>
                                }
                            </div>
                        </div>
                        <ContainerTable>
                            <div className="xl:space-y-3 space-y-2">
                                <div className="bg-slate-100 w-full rounded-t-lg items-center grid grid-cols-9 2xl:xl:p-2 xl:p-1.5 p-1.5">
                                    <div className="col-span-7">
                                        <div className="grid grid-cols-10 gap-2">
                                            <SearchComponent
                                                dataLang={dataLang}
                                                onChange={_HandleOnChangeKeySearch.bind(this)}
                                                colSpan={2}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.price_quote_branch || "price_quote_branch",
                                                        isDisabled: true,
                                                    },
                                                    ...listBr,
                                                ]}
                                                isClearable={true}
                                                onChange={onChangeValue("idBranch")}
                                                value={isValue?.idBranch}
                                                placeholder={dataLang?.price_quote_branch || 'price_quote_branch'}
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
                                                        label: dataLang?.payment_ob || "payment_ob",
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
                                            <DateToDateComponent
                                                colSpan={2}
                                                value={isValue?.valueDate}
                                                onChange={onChangeValue("valueDate")}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex justify-end items-center gap-2">
                                            <OnResetData sOnFetching={sOnFetching} />
                                            {(role == true || checkExport) ?
                                                <div className={``}>
                                                    {data_ex?.length > 0 && (
                                                        <ExcelFileComponent
                                                            multiDataSet={multiDataSet}
                                                            filename="Danh phiếu chi"
                                                            title="DSPC"
                                                            dataLang={dataLang}
                                                        />)}
                                                </div>
                                                :
                                                <button onClick={() => isShow('warning', WARNING_STATUS_ROLE)} className={`xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}>
                                                    <Grid6 className="2xl:scale-100 xl:scale-100 scale-75" size={18} />
                                                    <span>{dataLang?.client_list_exportexcel}</span>
                                                </button>
                                            }
                                            <div>
                                                <DropdowLimit sLimit={updateLimit} limit={limit} dataLang={dataLang} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Customscrollbar className="min:h-[200px] h-[88%] max:h-[500px]">
                                <div className="w-full">
                                    <HeaderTable gridCols={13} className="grid grid-cols-13 items-center sticky top-0 p-2 z-10 rounded-xl shadow-sm bg-white divide-x">
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.payment_date || "payment_date"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.payment_code || "payment_code"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.payment_obType || "payment_obType"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.payment_ob || "payment_ob"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.payment_typeOfDocument || "payment_typeOfDocument"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.payment_voucherCode || "payment_voucherCode"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {"PTTT"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.payment_costs || "payment_costs"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.payment_amountOfMoney || "payment_amountOfMoney"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.payment_creator || "payment_creator"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.payment_branch || "payment_branch"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.payment_note || "payment_note"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.payment_action || "payment_action"}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {onFetching ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : data?.length > 0 ? (
                                        <>
                                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                                {data?.map((e) => (
                                                    <RowTable gridCols={13} key={e.id.toString()}
                                                    >
                                                        <RowItemTable colSpan={1} textAlign={'center'}>
                                                            {e?.date != null ? formatMoment(e?.date, FORMAT_MOMENT.DATE_SLASH_LONG) : ""}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'center'}>
                                                            <Popup_chitiet
                                                                dataLang={dataLang}
                                                                className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] hover:text-blue-600 transition-all ease-in-out  rounded-md text-center text-[#0F4F9E]" name={e?.code}
                                                                id={e?.id}
                                                            />
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className="flex items-center w-fit mx-auto">
                                                            {(e?.objects === "client" && (
                                                                <TagColorSky name={dataLang[e?.objects] || e?.objects} />
                                                            )) ||
                                                                (e?.objects === "supplier" && (
                                                                    <TagColorOrange name={dataLang[e?.objects] || e?.objects} />
                                                                )) ||
                                                                (e?.objects === "other" && (
                                                                    <TagColorRed name={dataLang[e?.objects] || e?.objects} />
                                                                ))}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'left'}>
                                                            {e?.object_text}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className="flex items-center w-fit mx-auto">

                                                            {(e?.type_vouchers === "import" && (
                                                                <TagColorMore color={'#a855f7'} backgroundColor={"#e9d5ff"} name={dataLang[e?.type_vouchers] || e?.type_vouchers} />
                                                            )) ||
                                                                (e?.type_vouchers === "deposit" && (
                                                                    <TagColorMore color={'#06b6d4'} backgroundColor={"#a5f3fc"} name={dataLang[e?.type_vouchers] || e?.type_vouchers} />
                                                                )) ||
                                                                (e?.type_vouchers === "service" && (
                                                                    <TagColorRed name={dataLang[e?.type_vouchers] || e?.type_vouchers} />
                                                                )) ||
                                                                (e?.type_vouchers === "order" && (
                                                                    <TagColorMore color={'#22c55e'} backgroundColor={'#bbf7d0'} name={dataLang[e?.type_vouchers] || e?.type_vouchers} />

                                                                ))}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className="mx-auto">
                                                            {e?.voucher?.map((code) => (
                                                                <React.Fragment key={code.id}>
                                                                    <Popup_chitietThere
                                                                        key={code?.id}
                                                                        dataLang={dataLang}
                                                                        className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px]   transition-all ease-in-out px-2 py-0.5  rounded-md text-center text-[#0F4F9E] hover:text-blue-600"
                                                                        type={code.voucher_type}
                                                                        id={code.id}
                                                                        name={code?.code}
                                                                    >
                                                                        {code?.code}
                                                                    </Popup_chitietThere>
                                                                </React.Fragment>
                                                            ))}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'center'}>
                                                            {e?.payment_mode_name}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'left'}>
                                                            {e?.cost_name?.map((code, index) => (
                                                                <React.Fragment key={code}>
                                                                    {code}
                                                                    {index !== e.cost_name.length - 1 && ", "}
                                                                </React.Fragment>
                                                            ))}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'right'}>
                                                            {formatNumber(e?.total)}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1}>
                                                            <CustomAvatar fullName={e?.staff_name} profileImage={e?.profile_image} />
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className="mx-auto">
                                                            <TagBranch className="w-fit">
                                                                {e?.branch_name}
                                                            </TagBranch>
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'left'} className="truncate">
                                                            {e?.note}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className="flex justify-center">
                                                            <BtnAction
                                                                onRefresh={_ServerFetching.bind(this)}
                                                                dataLang={dataLang}
                                                                id={e?.id}
                                                                type="payment"
                                                                className="bg-slate-100 xl:px-4 px-2 xl:py-1.5 py-1 rounded 2xl:text-base xl:text-xs text-[9px]"
                                                            />
                                                        </RowItemTable>
                                                    </RowTable>
                                                ))}
                                            </div>
                                        </>
                                    ) : <NoData />}
                                </div>
                            </Customscrollbar>
                        </ContainerTable>
                    </div>
                    <ContainerTotal className="!grid grid-cols-13">
                        <ColumnTable colSpan={8} className="p-2 text-center">
                            {dataLang?.purchase_order_table_total_outside || "purchase_order_table_total_outside"}
                        </ColumnTable>
                        <ColumnTable colSpan={1} textAlign={'right'} className={'p-2'}>
                            {formatNumber(total?.sum_total)}
                        </ColumnTable>
                    </ContainerTotal>
                    {data?.length != 0 && (
                        <ContainerPagination>
                            <TitlePagination
                                dataLang={dataLang}
                                totalItems={totalItem?.iTotalDisplayRecords}
                            />
                            <Pagination
                                postsPerPage={limit}
                                totalPosts={Number(totalItem?.iTotalDisplayRecords)}
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
