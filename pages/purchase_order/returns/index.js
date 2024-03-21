import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";

import {
    Grid6 as IconExcel,
    Filter as IconFilter,
    Calendar as IconCalendar,
    SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    Grid6,
} from "iconsax-react";

import "react-datepicker/dist/react-datepicker.css";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment/moment";

import { _ServerInstance as Axios } from "/services/axios";


import Popup_chitiet from "./components/pupup";

import Loading from "@/components/UI/loading";
import BtnAction from "@/components/UI/BtnAction";
import Pagination from "@/components/UI/pagination";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import ButtonWarehouse from "@/components/UI/btnWarehouse/btnWarehouse";

import { routerReturns } from "@/routers/buyImportGoods";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import useStatusExprired from "@/hooks/useStatusExprired";

import { CONFIRMATION_OF_CHANGES, TITLE_STATUS } from "@/constants/changeStatus/changeStatus";
import { debounce } from "lodash";
import { Container, ContainerBody, ContainerFilterTab, ContainerTable, ContainerTotal } from "@/components/UI/common/layout";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import { useSelector } from "react-redux";
import useActionRole from "@/hooks/useRole";
import TabFilter from "@/components/UI/TabFilter";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import NoData from "@/components/UI/noData/nodata";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import useSetingServer from "@/hooks/useConfigNumber";
import DatepickerComponent from "@/components/UI/filterComponents/dateTodateComponent";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import { TagColorOrange, TagColorSky } from "@/components/UI/common/Tag/TagStatus";
const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const isShow = useToast();

    const dataSeting = useSetingServer()

    const trangthaiExprired = useStatusExprired();

    const initialState = {
        data: [],
        dataExcel: [],
        onFetching: false,
        onFetchingGroup: false,
        onFetchingFilter: false,
        onSending: false,
        keySearch: "",
        listBr: [],
        lisCode: [],
        listSupplier: [],
        listDs: [],
        valueBr: null,
        valueCode: null,
        valueSupplier: null,
        valueDate: {
            startDate: null,
            endDate: null,
        }
    }

    const [isState, sIstate] = useState(initialState);

    const queryState = (key) => sIstate((prev) => ({ ...prev, ...key }));

    const { isOpen, isKeyState, handleQueryId } = useToggle();

    const [total, sTotal] = useState({});

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems()

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkExport } = useActionRole(auth, "returns")

    const [checkedWare, sCheckedWare] = useState({});

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
        Axios(
            "GET",
            `/api_web/Api_return_supplier/returnSupplier/?csrf_protection=true`,
            {
                params: {
                    search: isState.keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[status_bar]": tabPage ?? null,
                    "filter[id]": isState.valueCode != null ? isState.valueCode?.value : null,
                    "filter[branch_id]": isState.valueBr != null ? isState.valueBr.value : null,
                    "filter[supplier_id]": isState.valueSupplier ? isState.valueSupplier.value : null,
                    "filter[start_date]": isState.valueDate?.startDate != null ? isState.valueDate?.startDate : null,
                    "filter[end_date]": isState.valueDate?.endDate != null ? isState.valueDate?.endDate : null,
                },
            },
            (err, response) => {
                if (!err) {
                    const { rResult, output, rTotal } = response.data;
                    sTotalItems(output);
                    sTotal(rTotal);
                    queryState({ data: rResult, dataExcel: rResult });
                }
                queryState({ onFetching: false });
            }
        );
    };

    const _ServerFetching_group = () => {
        Axios(
            "GET",
            `/api_web/Api_return_supplier/filterBar/?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                    search: isState.keySearch,
                    "filter[id]": isState.valueCode != null ? isState.valueCode?.value : null,
                    "filter[branch_id]": isState.valueBr != null ? isState.valueBr.value : null,
                    "filter[supplier_id]": isState.valueSupplier ? isState.valueSupplier.value : null,
                    "filter[start_date]": isState.valueDate?.startDate != null ? isState.valueDate?.startDate : null,
                    "filter[end_date]": isState.valueDate?.endDate != null ? isState.valueDate?.endDate : null,
                },
            },
            (err, response) => {
                if (!err) {
                    const data = response.data;
                    queryState({ listDs: data });
                }
                queryState({ onFetchingGroup: false });
            }
        );
    };

    const _ServerFetching_filter = () => {
        Axios("GET", `/api_web/Api_Branch/branchCombobox/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                const { result } = response.data;
                queryState({ listBr: result?.map((e) => ({ label: e.name, value: e.id })) });
            }
        });
        Axios("GET", "/api_web/api_supplier/supplier/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                const db = response.data.rResult;
                queryState({ listSupplier: db?.map((e) => ({ label: e.name, value: e.id })) || [] });
            }
        });
        Axios(
            "GET",
            "/api_web/Api_return_supplier/returnsupplierCombobox/?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    const { result } = response?.data;
                    queryState({ lisCode: result?.map((e) => ({ label: e.code, value: e.id })) || [] });

                }
            }
        );
        queryState({ onFetchingFilter: false });
    };

    const _HandleSeachApi = debounce((inputValue) => {
        Axios(
            "POST",
            `/api_web/Api_import/importCombobox/?csrf_protection=true`,
            {
                data: {
                    term: inputValue,
                },
            },
            (err, response) => {
                if (!err) {
                    const { result } = response?.data;
                    queryState({ listCode: result?.map((e) => ({ label: e.code, value: e.id })) || [] });
                }
            }
        );
    }, 500)

    useEffect(() => {
        isState.onFetchingFilter && _ServerFetching_filter();
    }, [isState.onFetchingFilter]);

    useEffect(() => {
        (isState.onFetching && _ServerFetching())
    }, [isState.onFetching]);
    useEffect(() => {
        (isState.onFetchingGroup && _ServerFetching_group());
    }, [isState.onFetchingGroup]);

    useEffect(() => {
        queryState({ onFetching: true, onFetchingGroup: true })
    }, [
        limit,
        router.query?.page,
        router.query?.tab,
        isState.valueBr,
        isState.valueDate.endDate,
        isState.valueDate.startDate,
        isState.valueCode,
        isState.valueSupplier,
    ]);

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const formatMoney = (number) => {
        return formatMoneyConfig(+number, dataSeting);

    }

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
                    title: `${dataLang?.import_day_vouchers || "import_day_vouchers"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.import_code_vouchers || "import_code_vouchers"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.import_supplier || "import_supplier"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.import_total_amount || "import_total_amount"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.import_tax_money || "import_tax_money"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.import_into_money || "import_into_money"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${"Hình thức"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.import_brow_storekeepers || "import_brow_storekeepers"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.import_branch || "import_branch"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.import_from_note || "import_from_note"}`,
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
                    value: `${e?.total_price ? formatNumber(e?.total_price) : ""}`,
                },
                {
                    value: `${e?.total_tax_price ? formatNumber(e?.total_tax_price) : ""}`,
                },
                {
                    value: `${e?.total_amount ? formatNumber(e?.total_amount) : ""}`,
                },
                {
                    value: `${e?.treatment_methods === "2" ? "Giảm trừ công nợ" : "Trả tiền mặt"}`,
                },
                {
                    value: `${e?.warehouseman_id === "0" ? "Chưa duyệt kho" : "Đã duyệt kho"}`,
                },
                { value: `${e?.branch_name ? e?.branch_name : ""}` },
                { value: `${e?.note ? e?.note : ""}` },
            ]),
        },
    ];

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
        var data = new FormData();
        data.append("warehouseman_id", checkedWare?.checkedpost != "0" ? checkedWare?.checkedpost : "");
        data.append("id", checkedWare?.id);
        Axios(
            "POST",
            `/api_web/Api_return_supplier/ConfirmWarehous?csrf_protection=true`,
            {
                data: data,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    let { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", `${dataLang[message]}` || message);
                        setTimeout(() => {
                            queryState({ onFetching: true });
                        }, 300);
                    } else {
                        isShow("error", `${dataLang[message]}` || message);
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
                <title>{dataLang?.returns_title || "returns_title"} </title>
            </Head>
            <Container>
                {/* {data_export.length > 0 && <Popup_status className="hidden" data_export={data_export} dataLang={dataLang}/>} */}
                {trangthaiExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.returns_title || "returns_title"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.returns_list || "returns_list"}</h6>
                    </div>
                )}

                <ContainerBody>
                    <div className="space-y-0.5 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.returns_list || "returns_list"}
                            </h2>
                            <button
                                onClick={() => {
                                    if (role) {
                                        router.push(routerReturns.form)
                                    } else if (checkAdd) {
                                        router.push(routerReturns.form)
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
                                                backgroundColor="#e2f0fe"
                                                dataLang={dataLang}
                                                key={e.id}
                                                onClick={_HandleSelectTab.bind(this, `${e.id}`)}
                                                total={e.count}
                                                active={e.id}
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
                                        <div className="grid grid-cols-5">
                                            <SearchComponent colSpan={1} dataLang={dataLang} placeholder={dataLang?.branch_search} onChange={_HandleOnChangeKeySearch.bind(this)} />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.purchase_order_table_branch || "purchase_order_table_branch",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.listBr,
                                                ]}
                                                onChange={(e) => queryState({ valueBr: e })}
                                                value={isState.valueBr}
                                                placeholder={dataLang?.purchase_order_table_branch || "purchase_order_table_branch"
                                                }
                                                isClearable={true}
                                                colSpan={1}

                                            />
                                            <SelectComponent
                                                onInputChange={_HandleSeachApi.bind(this)}
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.purchase_order_table_code || "purchase_order_table_code",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.lisCode,
                                                ]}
                                                onChange={(e) => queryState({ valueCode: e })}
                                                value={isState.valueCode}
                                                placeholder={dataLang?.purchase_order_table_code || "purchase_order_table_code"
                                                }
                                                isClearable={true}
                                                colSpan={1}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.listSupplier,
                                                ]}
                                                onChange={(e) => queryState({ valueSupplier: e })}
                                                value={isState.valueSupplier}
                                                placeholder={dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"
                                                }
                                                hideSelectedOptions={false}
                                                isClearable={true}
                                                isSearchable={true}
                                                colSpan={1}

                                            />
                                            <DatepickerComponent
                                                colSpan={1}
                                                value={isState.valueDate}
                                                onChange={(e) => queryState({ valueDate: e })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1 xl:col-span-2 lg:col-span-2">
                                        <div className="flex justify-end items-center gap-2">
                                            <OnResetData sOnFetching={(e) => queryState({ onFetching: e })} />
                                            {(role == true || checkExport) ?
                                                <div className={``}>
                                                    {isState.dataExcel?.length > 0 && (
                                                        <ExcelFileComponent dataLang={dataLang}
                                                            filename={dataLang?.returns_list || "returns_list"}
                                                            title="DSTH"
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
                            <Customscrollbar className="min:h-[200px] 3xl:h-[82%] 2xl:h-[82%] xl:h-[72%] lg:h-[82%] max:h-[400px]">
                                <div className="w-full">
                                    <HeaderTable gridCols={10} >
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.import_day_vouchers || "import_day_vouchers"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.import_code_vouchers || "import_code_vouchers"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.import_supplier || "import_supplier"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.import_total_amount || "import_total_amount"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.import_tax_money || "import_tax_money"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.import_into_money || "import_into_money"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.returns_form || "returns_form"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.import_brow_storekeepers || "import_brow_storekeepers"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.import_branch || "import_branch"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.import_action || "import_action"}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {isState.onFetching ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : isState.data?.length > 0 ? (
                                        <>
                                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                                {isState.data?.map((e) => (
                                                    <RowTable gridCols={10} key={e.id.toString()}  >
                                                        <RowItemTable colSpan={1} textAlign={'center'}>
                                                            {e?.date != null
                                                                ? moment(e?.date).format("DD/MM/YYYY")
                                                                : ""}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'center'}>
                                                            <Popup_chitiet
                                                                dataLang={dataLang}
                                                                className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] px-2 text-center text-[#0F4F9E] hover:text-[#5599EC] transition-all ease-linear cursor-pointer " name={e?.code}
                                                                id={e?.id}
                                                            />
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'left'}>
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
                                                        <RowItemTable colSpan={1} className="mx-auto flex items-center w-fit">
                                                            {(e?.treatment_methods === "1" && (
                                                                <TagColorSky name={dataLang?.pay_down || "pay_down"} />
                                                            )) ||
                                                                (e?.treatment_methods === "2" && (
                                                                    <TagColorOrange name={dataLang?.debt_reduction || "debt_reduction"} />
                                                                ))}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1}>
                                                            <ButtonWarehouse
                                                                warehouseman_id={e?.warehouseman_id}
                                                                _HandleChangeInput={_HandleChangeInput}
                                                                id={e?.id}
                                                            />
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className="mx-auto">
                                                            <TagBranch className='w-fit'>
                                                                {e?.branch_name}
                                                            </TagBranch>
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className="flex justify-center">
                                                            <BtnAction
                                                                onRefresh={_ServerFetching.bind(this)}
                                                                onRefreshGroup={_ServerFetching_group.bind(this)}
                                                                dataLang={dataLang}
                                                                warehouseman_id={e?.warehouseman_id}
                                                                status_pay={e?.status_pay}
                                                                id={e?.id}
                                                                type="returns"
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
                    <ContainerTotal className="grid-cols-10">
                        <RowItemTable colSpan={3} textAlign={'center'} className="p-2">
                            {dataLang?.import_total || "import_total"}
                        </RowItemTable>
                        <RowItemTable colSpan={1} textAlign={'right'}>
                            {formatMoney(total?.total_price)}
                        </RowItemTable>
                        <RowItemTable colSpan={1} textAlign={'right'}>
                            {formatMoney(total?.total_tax_price)}
                        </RowItemTable>
                        <RowItemTable colSpan={1} textAlign={'right'}>
                            {formatMoney(total?.total_amount)}
                        </RowItemTable>
                    </ContainerTotal>
                    {isState.
                        data?.length != 0 && (
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
                nameModel={"returns"}
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
