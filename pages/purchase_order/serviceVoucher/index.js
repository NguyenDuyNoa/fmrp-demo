import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import {
    Grid6 as IconExcel,
    Filter as IconFilter,
    Calendar as IconCalendar,
    SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    Edit as IconEdit,
    Trash as IconDelete,
    TickCircle,
    Grid6,
} from "iconsax-react";

import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import moment from "moment/moment";
import vi from "date-fns/locale/vi";
registerLocale("vi", vi);


import { _ServerInstance as Axios } from "/services/axios";

import Popup_servie from "./components/popup";
import Popup_chitiet from "./components/detail";

import Loading from "@/components/UI/loading";
import BtnAction from "@/components/UI/BtnAction";
import Pagination from "@/components/UI/pagination";

import useStatusExprired from "@/hooks/useStatusExprired";
import { debounce } from "lodash";
import { Container, ContainerBody, ContainerFilterTab, ContainerTable, ContainerTotal } from "@/components/UI/common/layout";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import TabFilter from "@/components/UI/TabFilter";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import DatepickerComponent from "@/components/UI/filterComponents/dateTodateComponent";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import NoData from "@/components/UI/noData/nodata";
import { useSelector } from "react-redux";
import useActionRole from "@/hooks/useRole";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import useToast from "@/hooks/useToast";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import useSetingServer from "@/hooks/useConfigNumber";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { TagColorLime, TagColorOrange, TagColorSky } from "@/components/UI/common/Tag/TagStatus";
const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const isShow = useToast()

    const dataSeting = useSetingServer()

    const trangthaiExprired = useStatusExprired();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkEdit, checkExport } = useActionRole(auth, 'serviceVoucher');

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems()

    const [total, sTotal] = useState({});

    const initialState = {
        onFetching: false,
        onFetchingFilter: false,
        onFetchingGroup: false,
        data: [],
        dataExcel: [],
        keySearch: "",
        listBr: [],
        listCode: [],
        listDs: [],
        valueBr: null,
        valueCode: null,
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
            query: { tab: router.query?.tab ? router.query?.tab : "all" },
        });
        queryState({ onFetchingFilter: true, onFetchingGroup: true });
    }, []);

    const _ServerFetching = () => {
        const tabPage = router.query?.tab;
        Axios("GET", `/api_web/Api_service/service/?csrf_protection=true`,
            {
                params: {
                    search: isState.keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[status_bar]": tabPage ? tabPage : null,
                    "filter[id]": isState.valueCode != null ? isState.valueCode?.value : null,
                    "filter[branch_id]": isState.valueBr != null ? isState.valueBr.value : null,
                    "filter[start_date]": isState.valueDate?.startDate != null ? isState.valueDate?.startDate : null,
                    "filter[end_date]": isState.valueDate?.endDate != null ? isState.valueDate?.endDate : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let { rResult, output, rTotal } = response.data;
                    sTotalItems(output);
                    sTotal(rTotal);
                    queryState({ data: rResult, dataExcel: rResult });
                }
                queryState({ onFetching: false });
            }
        );
    };

    const _ServerFetching_filter = () => {
        Axios("GET", `/api_web/Api_Branch/branchCombobox/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let { result } = response?.data;
                queryState({ listBr: result?.map((e) => ({ label: e.name, value: e.id })) });
            }
        });

        Axios("GET", `/api_web/Api_service/serviceCombobox/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let { result } = response?.data;
                queryState({ listCode: result?.map((e) => ({ label: e?.code, value: e?.id })) });
            }
        });

        Axios("GET", `/api_web/Api_staff/staffOption?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let { rResult } = response?.data;
                queryState({ listUser: rResult });
            }
        });
        queryState({ onFetchingFilter: false });
    };

    useEffect(() => {
        isState.onFetchingFilter && _ServerFetching_filter();
    }, [isState.onFetchingFilter]);

    const _HandleSeachApi = debounce((inputValue) => {
        Axios("POST", `/api_web/Api_service/serviceCombobox/?csrf_protection=true`,
            {
                data: {
                    term: inputValue,
                },
            },
            (err, response) => {
                if (!err) {
                    let { isSuccess, result } = response?.data;
                    queryState({ listCode: result?.map((e) => ({ label: e?.code, value: e?.id })) });
                }
            }
        );
    }, 500)

    const _ServerFetching_group = () => {
        Axios(
            "GET",
            `/api_web/Api_service/filterBar/?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                    search: isState.keySearch,
                    "filter[id]": isState.valueCode != null ? isState.valueCode?.value : null,
                    "filter[branch_id]": isState.valueBr != null ? isState.valueBr.value : null,
                    "filter[start_date]": isState.valueDate?.startDate != null ? isState.valueDate?.startDate : null,
                    "filter[end_date]": isState.valueDate?.endDate != null ? isState.valueDate?.endDate : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let data = response.data;
                    queryState({ listDs: data });
                }
                queryState({ onFetchingGroup: false });
            }
        );
    };

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryState({ keySearch: value });
        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            },
        });
        queryState({ onFetching: true });
    }, 500)

    const paginate = (pageNumber) => {
        router.push({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
                page: pageNumber,
            },
        });
    };

    useEffect(() => {
        (isState.onFetching && _ServerFetching())
    }, [isState.onFetching]);

    useEffect(() => {
        (isState.onFetchingGroup && _ServerFetching_group());
    }, [isState.onFetchingGroup]);

    useEffect(() => {
        queryState({ onFetching: true, onFetchingGroup: true });
    }, [limit, router.query?.page, router.query?.tab, isState.valueBr, isState.valueCode, isState.valueDate]);

    // const formatNumber = (number) => {
    //     if (!number && number !== 0) return 0;
    //     const integerPart = Math.floor(number);
    //     const decimalPart = number - integerPart;
    //     const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
    //     const roundedNumber = integerPart + roundedDecimalPart;
    //     return roundedNumber.toLocaleString("en");
    // };

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    }

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
                    title: `${dataLang?.serviceVoucher_day_vouchers || "serviceVoucher_day_vouchers"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.serviceVoucher_voucher_code || "serviceVoucher_voucher_code"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.serviceVoucher_supplier || "serviceVoucher_supplier"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.serviceVoucher_total_amount || "serviceVoucher_total_amount"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.serviceVoucher_tax_money || "serviceVoucher_tax_money"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.serviceVoucher_into_money || "serviceVoucher_into_money"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.serviceVoucher_status_of_spending || "serviceVoucher_status_of_spending"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.serviceVoucher_note || "serviceVoucher_note"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.serviceVoucher_branch || "serviceVoucher_branch"}`,
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
                    value: `${e?.total_price ? formatMoney(e?.total_price) : ""}`,
                },
                {
                    value: `${e?.total_tax_price ? formatMoney(e?.total_tax_price) : ""}`,
                },
                {
                    value: `${e?.total_amount ? formatMoney(e?.total_amount) : ""}`,
                },
                // {value: `${e?.status_pay ? e?.status_pay === "0" && "Chưa nhập" || e?.status_pay === "1" && "Nhập 1 phần" ||  e?.status_pay === "2"  && "Đã nhập đủ đủ" : ""}`},
                { value: `${"Chưa chi"}` },
                { value: `${e?.note ? e?.note : ""}` },
                { value: `${e?.branch_name ? e?.branch_name : ""}` },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.serviceVoucher_title || "serviceVoucher_title"} </title>
            </Head>
            <Container>
                {trangthaiExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.serviceVoucher_title || "serviceVoucher_title"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.serviceVoucher_title_lits || "serviceVoucher_title_lits"}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="space-y-0.5 h-[96%] overflow-hidden">
                        {/* <div className="flex justify-between">
                            <h2 className="text-2xl text-[#52575E] capitalize">
                                {dataLang?.serviceVoucher_title_lits || "serviceVoucher_title_lits"}
                            </h2>
                            <div className="flex justify-end items-center">
                                <Popup_servie
                                    onRefreshGroup={_ServerFetching_group.bind(this)}
                                    onRefresh={_ServerFetching.bind(this)}
                                    dataLang={dataLang}
                                    className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                >
                                    {dataLang?.serviceVoucher_create_new || "serviceVoucher_create_new"}
                                </Popup_servie>
                            </div>
                        </div> */}
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.serviceVoucher_title_lits || "serviceVoucher_title_lits"}
                            </h2>
                            <div className="flex justify-end items-center gap-2">
                                {role == true || checkAdd ?
                                    <Popup_servie
                                        onRefreshGroup={_ServerFetching_group.bind(this)}
                                        onRefresh={_ServerFetching.bind(this)}
                                        dataLang={dataLang}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    /> :
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
                        <ContainerFilterTab>
                            {isState.listDs &&
                                isState.listDs.map((e) => {
                                    return (
                                        <div>
                                            <TabFilter
                                                backgroundColor="#e2f0fe"
                                                dataLang={dataLang}
                                                key={e.id}
                                                onClick={_HandleSelectTab.bind(this, `${e.id}`)}
                                                total={e.count}
                                                active={e.id}
                                                className={"text-[#0F4F9E] "}
                                            >
                                                {dataLang[e?.name] || e?.name}
                                            </TabFilter>
                                        </div>
                                    );
                                })}
                        </ContainerFilterTab>
                        <ContainerTable>
                            <div className="xl:space-y-3 space-y-2">
                                <div className="bg-slate-100 w-full rounded-t-lg items-center grid grid-cols-6 2xl:xl:p-2 xl:p-1.5 p-1.5">
                                    <div className="col-span-4">
                                        <div className="grid grid-cols-8 gap-2">
                                            <SearchComponent
                                                dataLang={dataLang}
                                                onChange={_HandleOnChangeKeySearch.bind(this)}
                                                colSpan={2}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.serviceVoucher_branch || "serviceVoucher_branch",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.listBr,
                                                ]}
                                                onChange={(e) => queryState({ valueBr: e })}
                                                value={isState.valueBr}
                                                placeholder={dataLang?.serviceVoucher_branch || "serviceVoucher_branch"}
                                                colSpan={2}
                                                isClearable={true}
                                            />
                                            <SelectComponent
                                                onInputChange={_HandleSeachApi.bind(this)}
                                                options={[
                                                    {
                                                        value: "",
                                                        label:
                                                            dataLang?.serviceVoucher_voucher_code || "serviceVoucher_voucher_code",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.listCode,
                                                ]}
                                                onChange={(e) => queryState({ valueCode: e })}
                                                placeholder={dataLang?.serviceVoucher_voucher_code || "serviceVoucher_voucher_code"
                                                }
                                                isClearable={true}
                                                colSpan={2}
                                            />
                                            <DatepickerComponent
                                                value={isState.valueDate}
                                                colSpan={2}
                                                onChange={(e) => queryState({ valueDate: e })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex space-x-2 items-center justify-end">
                                            <OnResetData sOnFetching={(e) => queryState({ onFetching: e })} />
                                            {(role == true || checkExport) ?
                                                <div className={``}>
                                                    {isState.dataExcel?.length > 0 && (
                                                        <ExcelFileComponent
                                                            multiDataSet={multiDataSet}
                                                            filename="Danh sách phiếu dịch vụ"
                                                            title="DSPDV"
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
                                                <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Customscrollbar>
                                <div className="w-full">
                                    <HeaderTable gridCols={12}>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.serviceVoucher_day_vouchers || "serviceVoucher_day_vouchers"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.serviceVoucher_voucher_code || "serviceVoucher_voucher_code"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={'center'}>
                                            {dataLang?.serviceVoucher_supplier || "serviceVoucher_supplier"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.serviceVoucher_total_amount || "serviceVoucher_total_amount"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.serviceVoucher_tax_money || "serviceVoucher_tax_money"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.serviceVoucher_into_money || "serviceVoucher_into_money"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={'center'}>
                                            {dataLang?.serviceVoucher_status_of_spending || "serviceVoucher_status_of_spending"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.serviceVoucher_note || "serviceVoucher_note"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.serviceVoucher_branch || "serviceVoucher_branch"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.serviceVoucher_operation || "serviceVoucher_operation"}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {isState.onFetching ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : isState.data?.length > 0 ? (
                                        <>
                                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                                {isState.data?.map((e) => (
                                                    <RowTable gridCols={12} key={e.id.toString()} >
                                                        <RowItemTable colSpan={1} textAlign={'center'}>
                                                            {e?.date != null ? moment(e?.date).format("DD/MM/YYYY") : ""}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1}>
                                                            <Popup_chitiet
                                                                dataLang={dataLang}
                                                                className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] hover:text-blue-600 transition-all ease-in-out px-2 col-span-1 text-center text-[#0F4F9E]  cursor-pointer"
                                                                name={e?.code}
                                                                id={e?.id}
                                                            />
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={2} textAlign={'left'} >
                                                            {e.supplier_name}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'right'}>
                                                            {formatMoney(e.total_price)}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'right'}>
                                                            {formatMoney(e.total_tax_price)}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'right'}>
                                                            {formatMoney(e.total_amount)}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={2} className=" flex items-center justify-center w-fit mx-auto">
                                                            {(e?.status_pay === "not_spent" && (
                                                                <TagColorSky name={"Chưa chi"} />
                                                            )) ||
                                                                (e?.status_pay === "spent_part" && (
                                                                    <TagColorOrange name={`Chi 1 phần (${formatNumber(e?.amount_paid)})`} />
                                                                )) ||
                                                                (e?.status_pay === "spent" && (
                                                                    <TagColorLime name={"Đã chi đủ"} />
                                                                ))}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'left'} className="truncate">
                                                            {e.note}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className={'mx-auto'}>
                                                            <TagBranch className='w-fit'>
                                                                {e?.branch_name}
                                                            </TagBranch>
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className="flex justify-center">
                                                            <BtnAction
                                                                onRefresh={_ServerFetching.bind(this)}
                                                                onRefreshGroup={_ServerFetching_group.bind(this)}
                                                                dataLang={dataLang}
                                                                status_pay={e?.status_pay}
                                                                type="serviceVoucher"
                                                                id={e?.id}
                                                                className="bg-slate-100 xl:px-4 px-2 xl:py-1.5 py-1 rounded 2xl:text-base xl:text-xs text-[9px]"
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
                        <RowItemTable colSpan={4} textAlign={'center'}>
                            {dataLang?.purchase_order_table_total_outside || "purchase_order_table_total_outside"}
                        </RowItemTable>
                        <RowItemTable colSpan={1} textAlign={'right'} className="justify-end p-2 flex gap-2 flex-wrap">
                            {formatMoney(total?.total_price)}
                        </RowItemTable>
                        <RowItemTable colSpan={1} textAlign={'right'} className="justify-end p-2 flex gap-2 flex-wrap ">
                            {formatMoney(total?.total_tax_price)}
                        </RowItemTable>
                        <RowItemTable colSpan={1} textAlign={'right'} className="justify-end p-2 flex gap-2 flex-wrap">
                            {formatMoney(total?.total_amount)}
                        </RowItemTable>
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
        </React.Fragment >
    );
};


export default Index;
