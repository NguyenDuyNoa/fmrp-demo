import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";


import { _ServerInstance as Axios } from "/services/axios";


import Popup_chitietPhatsinh from "./components/details_arises";
import Popup_chitietDauki from "./components/details_first";

import OnResetData from "@/components/UI/btnResetData/btnReset";
import ContainerPagination from "@/components/UI/common/containerPagination/containerPagination";
import TitlePagination from "@/components/UI/common/containerPagination/titlePagination";
import { Customscrollbar } from "@/components/UI/common/customscrollbar";
import { EmptyExprired } from "@/components/UI/common/emptyExprired";
import { HeaderTable } from "@/components/UI/common/table";
import { Container, ContainerBody, ContainerTable } from "@/components/UI/common/layout";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import DateToDateComponent from "@/components/UI/filterComponents/dateTodateComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import Loading from "@/components/UI/loading";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";

import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { useChangeValue } from "@/hooks/useChangeValue";
import useSetingServer from "@/hooks/useConfigNumber";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import useStatusExprired from "@/hooks/useStatusExprired";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const { paginate } = usePagination();

    const dataSeting = useSetingServer();

    const [data, sData] = useState([]);

    const statusExprired = useStatusExprired();

    const [dataExcel, sDataExcel] = useState([]);

    const [onFetching, sOnFetching] = useState(false);

    const [onFetching_filter, sOnFetching_filter] = useState(false);

    const [keySearch, sKeySearch] = useState("");

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems();

    const [total, sTotal] = useState({});

    const [listBr, sListBr] = useState([]);

    const [listSupplier, sListSupplier] = useState([]);

    const pastDays = 30;

    const today = new Date();

    const pastDate = new Date(today);

    pastDate.setDate(today.getDate() - pastDays);

    const inistialValue = {
        idCode: null,
        idSupplier: null,
        idBranch: null,
        valueDate: { startDate: pastDate, endDate: today },
    };

    const { isValue, onChangeValue } = useChangeValue(inistialValue);

    useEffect(() => {
        router.push({
            pathname: router.route,
            query: { tab: router.query?.tab ? router.query?.tab : "all" },
        });
        sOnFetching_filter(true);
    }, []);

    const _ServerFetching = async () => {
        await Axios(
            "GET",
            `/api_web/Api_debt_supplier/GetDebtSuppliers?csrf_protection=true&cong=true`,
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id]": isValue?.idBranch != null ? isValue?.idBranch.value : null,
                    "filter[supplier_id]": isValue?.idSupplier ? isValue?.idSupplier.value : null,
                    "filter[start_date]":
                        isValue?.valueDate?.startDate != null
                            ? formatMoment(isValue?.valueDate?.startDate, FORMAT_MOMENT.DATE_LONG)
                            : null,
                    "filter[end_date]":
                        isValue?.valueDate?.endDate != null
                            ? formatMoment(isValue?.valueDate?.endDate, FORMAT_MOMENT.DATE_LONG)
                            : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let { rResult, output, rTotal } = response.data;
                    sData(rResult);
                    sTotalItems(output);
                    sDataExcel(rResult);
                    sTotal(rTotal);
                }
                sOnFetching(false);
            }
        );
    };

    const _ServerFetching_filter = () => {
        Axios("GET", `/api_web/Api_Branch/branchCombobox/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let { result } = response?.data;
                sListBr(result);
            }
        });
        Axios("GET", "/api_web/api_supplier/supplier/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let db = response.data.rResult;
                sListSupplier(db?.map((e) => ({ label: e.name, value: e.id })));
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
        sOnFetching(true);
    }, [
        limit,
        router.query?.page,
        router.query?.tab,
        isValue?.idBranch,
        isValue?.valueDate.endDate,
        isValue?.valueDate.startDate,
        isValue?.idSupplier,
        isValue?.idCode,
    ]);

    const formatNumber = (number) => {
        return formatMoneyConfig(+number, dataSeting);
    };

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        sKeySearch(value);
        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            },
        });
        sOnFetching(true);
    }, 500);

    const listBr_filter = listBr ? listBr?.map((e) => ({ label: e.name, value: e.id })) : [];

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
                    title: `${dataLang?.debt_suppliers_code || "debt_suppliers_code"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.debt_suppliers_name || "debt_suppliers_name"}`,
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
            data: dataExcel?.map((e) => [
                { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
                { value: `${e?.code ? e?.code : ""}` },
                { value: `${e?.name ? e?.name : ""}` },
                { value: `${e?.no_start ? formatNumber(e?.no_start) : ""}` },
                { value: `${e?.chi_start ? formatNumber(e?.chi_start) : ""}` },
                { value: `${e?.no_debt ? formatNumber(e?.no_debt) : ""}` },
                { value: `${e?.chi_debt ? formatNumber(e?.chi_debt) : ""}` },
                { value: `${e?.no_end ? formatNumber(e?.no_end) : ""}` },
                { value: `${e?.chi_end ? formatNumber(e?.chi_end) : ""}` },
            ]),
        },
    ];
    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.debt_suppliers || "debt_suppliers"} </title>
            </Head>
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">{dataLang?.debt_suppliers || "debt_suppliers"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.debt_suppliers || "debt_suppliers"}</h6>
                    </div>
                )}

                <ContainerBody>
                    <div className="space-y-0.5 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.debt_suppliers || "debt_suppliers"}
                            </h2>
                        </div>
                        <ContainerTable>
                            <div className="xl:space-y-3 space-y-2">
                                <div className="bg-slate-100 w-full rounded-lg grid grid-cols-6 justify-between xl:p-3 p-2">
                                    <div className="col-span-5">
                                        <div className="grid grid-cols-5">
                                            <SearchComponent
                                                dataLang={dataLang}
                                                colSpan={1}
                                                onChange={_HandleOnChangeKeySearch.bind(this)}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label:
                                                            dataLang?.purchase_order_table_branch ||
                                                            "purchase_order_table_branch",
                                                        isDisabled: true,
                                                    },
                                                    ...listBr_filter,
                                                ]}
                                                colSpan={1}
                                                isClearable={true}
                                                value={isValue.idBranch}
                                                onChange={onChangeValue("idBranch")}
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
                                                            dataLang?.purchase_order_table_supplier ||
                                                            "purchase_order_table_supplier",
                                                        isDisabled: true,
                                                    },
                                                    ...listSupplier,
                                                ]}
                                                colSpan={1}
                                                isClearable={true}
                                                value={isValue?.idSupplier}
                                                onChange={onChangeValue("idSupplier")}
                                                placeholder={
                                                    dataLang?.purchase_order_table_supplier ||
                                                    "purchase_order_table_supplier"
                                                }
                                            />
                                            <DateToDateComponent
                                                value={isValue?.valueDate}
                                                onChange={onChangeValue("valueDate")}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <div className="flex justify-end items-center gap-2">
                                            <OnResetData sOnFetching={sOnFetching} />
                                            <div>
                                                {dataExcel?.length > 0 && (
                                                    <ExcelFileComponent
                                                        multiDataSet={multiDataSet}
                                                        filename={"Danh sách công nợ nhà cung cấp"}
                                                        title="DSCNNCC"
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
                            <Customscrollbar className="min:h-[200px] 3xl:h-[92%] 2xl:h-[92%] xl:h-[82%] lg:h-[82%] max:h-[400px]">
                                <div className="w-full">
                                    <HeaderTable gridCols={12}>
                                        <div className="col-span-1 grid items-center">
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]   text-center ">
                                                {dataLang?.debt_suppliers_code || "debt_suppliers_code"}
                                            </h4>
                                        </div>
                                        <div className="col-span-2 grid items-center">
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]   text-center ">
                                                {dataLang?.debt_suppliers_name || "debt_suppliers_name"}
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
                                                {dataLang?.debt_suppliers_Spend || "debt_suppliers_Spend"}
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
                                                {dataLang?.debt_suppliers_Spend || "debt_suppliers_Spend"}
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
                                                {dataLang?.debt_suppliers_Spend || "debt_suppliers_Spend"}
                                            </h4>
                                        </div>
                                    </HeaderTable>
                                    {onFetching ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : data?.length > 0 ? (
                                        <>
                                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                                {data?.map((e) => (
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
                                                                        dataLang={dataLang}
                                                                        className="text-left"
                                                                        name={
                                                                            e.no_start == "0"
                                                                                ? "-"
                                                                                : formatNumber(e.no_start)
                                                                        }
                                                                        id={e?.id}
                                                                        type={"no_start"}
                                                                        date={isValue.valueDate}
                                                                        supplier_name={e.name}
                                                                        idBranch={isValue?.idBranch}
                                                                        idSupplier={isValue?.idSupplier}
                                                                    />
                                                                )}
                                                            </h4>
                                                            <h4 className="text-right 3xl:text-base 2xl:text-[12.5px] py-2 xl:text-[11px] font-medium text-[9px] text-[#0F4F9E] hover:text-blue-600 transition-all duration-300 ease-in-out px-2 col-span-2 capitalize">
                                                                {e.chi_start == "0" ? (
                                                                    "-"
                                                                ) : (
                                                                    <Popup_chitietDauki
                                                                        dataLang={dataLang}
                                                                        className="text-left"
                                                                        name={
                                                                            e.chi_start == "0"
                                                                                ? "-"
                                                                                : formatNumber(e.chi_start)
                                                                        }
                                                                        date={isValue.valueDate}
                                                                        supplier_name={e.name}
                                                                        id={e?.id}
                                                                        type={"chi_start"}
                                                                        idBranch={isValue?.idBranch}
                                                                        idSupplier={isValue?.idSupplier}
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
                                                                        dataLang={dataLang}
                                                                        className="text-left uppercase"
                                                                        supplier_name={e.name}
                                                                        name={
                                                                            e.no_debt == "0"
                                                                                ? "-"
                                                                                : formatNumber(e.no_debt)
                                                                        }
                                                                        id={e?.id}
                                                                        date={isValue.valueDate}
                                                                        type={"no_debt"}
                                                                        idBranch={isValue?.idBranch}
                                                                        idSupplier={isValue?.idSupplier}
                                                                    />
                                                                )}
                                                            </h4>

                                                            <h4 className="text-right 3xl:text-base 2xl:text-[12.5px] py-2 xl:text-[11px] font-medium text-[9px] text-[#0F4F9E] hover:text-blue-600 transition-all duration-300 ease-in-out px-2 col-span-2 capitalize">
                                                                {e.chi_debt == "0" ? (
                                                                    "-"
                                                                ) : (
                                                                    <Popup_chitietPhatsinh
                                                                        dataLang={dataLang}
                                                                        className="text-left uppercase"
                                                                        supplier_name={e.name}
                                                                        name={
                                                                            e.chi_debt == "0"
                                                                                ? "-"
                                                                                : formatNumber(e.chi_debt)
                                                                        }
                                                                        id={e?.id}
                                                                        date={isValue.valueDate}
                                                                        type={"chi_debt"}
                                                                        idBranch={isValue?.idBranch}
                                                                        idSupplier={isValue?.idSupplier}
                                                                    />
                                                                )}
                                                            </h4>
                                                        </div>

                                                        <div className="col-span-3 grid grid-cols-4  items-center justify-center">
                                                            <h4 className="text-right 3xl:text-base 2xl:text-[12.5px] py-2 xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-2 capitalize">
                                                                {e.no_end == "0" ? "-" : formatNumber(e.no_end)}
                                                            </h4>
                                                            <h4 className="text-right 3xl:text-base 2xl:text-[12.5px] py-2 xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-2 capitalize">
                                                                {e.chi_end == "0" ? "-" : formatNumber(e.chi_end)}
                                                            </h4>
                                                        </div>
                                                    </div>
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
                                {formatNumber(total?.chi_start)}
                            </h3>
                        </div>
                        <div className="col-span-3 grid grid-cols-4  items-center justify-center">
                            <h3 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-zinc-600 font-medium text-[8px] px-4 col-span-2 text-right border-r">
                                {formatNumber(total?.no_debt)}
                            </h3>
                            <h3 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-zinc-600 font-medium text-[8px] px-4 col-span-2 text-right border-r">
                                {formatNumber(total?.chi_debt)}
                            </h3>
                        </div>
                        <div className="col-span-3 grid grid-cols-4  items-center justify-center">
                            <h3 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-zinc-600 font-medium text-[8px] px-4 col-span-2 text-right border-r">
                                {formatNumber(total?.no_end)}
                            </h3>
                            <h3 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-zinc-600 font-medium text-[8px] px-4 col-span-2 text-right ">
                                {formatNumber(total?.chi_end)}
                            </h3>
                        </div>
                    </div>
                    {data?.length != 0 && (
                        <ContainerPagination>
                            <TitlePagination dataLang={dataLang} totalItems={totalItems?.iTotalDisplayRecords} />
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
