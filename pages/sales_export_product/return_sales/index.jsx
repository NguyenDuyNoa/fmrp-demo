import React, { useEffect, useState } from "react";

import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import "react-datepicker/dist/react-datepicker.css";

import { _ServerInstance as Axios } from "/services/axios";

import PopupDetail from "./components/PopupDetail";
import Popup_status from "./components/popupStatus";

import { Grid6 } from "iconsax-react";

import BtnAction from "@/components/UI/btnAction";
import TabFilter from "@/components/UI/tabFilter";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import ButtonWarehouse from "@/components/UI/btnWarehouse/btnWarehouse";
import Loading from "@/components/UI/loading";
import Pagination from "@/components/UI/pagination";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import { routerReturnSales } from "routers/sellingGoods";

import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";

import ButtonAddNew from "@/components/UI/button/buttonAddNew";
import ContainerPagination from "@/components/UI/common/ContainerPagination/containerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/titlePagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { TagColorOrange, TagColorSky } from "@/components/UI/common/Tag/TagStatus";
import {
    Container,
    ContainerBody,
    ContainerFilterTab,
    ContainerTable,
    ContainerTotal,
} from "@/components/UI/common/layout";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import DateToDateComponent from "@/components/UI/filterComponents/dateTodateComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import NoData from "@/components/UI/noData/nodata";
import { CONFIRMATION_OF_CHANGES, TITLE_STATUS } from "@/constants/changeStatus/changeStatus";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import useSetingServer from "@/hooks/useConfigNumber";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import useActionRole from "@/hooks/useRole";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import { useSelector } from "react-redux";

const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const tabPage = router.query?.tab;

    const initsArr = {
        data: [],
        dataExcel: [],
        listBr: [],
        listCode: [],
        listClient: [],
        listStatus: [],
        idBranch: null,
        idCode: null,
        idClient: null,
        valueDate: {
            startDate: null,
            endDate: null,
        },
        onFetching: false,
        onFetchingGroup: false,
        onFetchingFilter: false,
        keySearch: "",
        onSending: false,
        data_export: [],
    };

    const isShow = useToast();

    const dataSeting = useSetingServer();

    const { paginate } = usePagination();

    const statusExprired = useStatusExprired();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkExport } = useActionRole(auth, "returnSales");

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems();

    const [isState, sIsState] = useState(initsArr);

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const { isOpen, isKeyState, handleQueryId } = useToggle();

    const [total, sTotal] = useState({});

    const [checkedWare, sCheckedWare] = useState({});

    const formatMoney = (number) => {
        return formatMoneyConfig(+number, dataSeting);
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
        queryState({ onFetchingFilter: true });
    }, []);

    const _ServerFetching = () => {
        Axios(
            "GET",
            `/api_web/Api_return_order/return_order/?csrf_protection=true`,
            {
                params: {
                    search: isState.keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[status_bar]": tabPage ?? null,
                    "filter[id]": isState.idCode != null ? isState.idCode?.value : null,
                    "filter[branch_id]": isState.idBranch != null ? isState.idBranch.value : null,
                    "filter[client_id]": isState?.idClient ? isState?.idClient.value : null,
                    "filter[start_date]": isState?.valueDate?.startDate != null ? isState?.valueDate?.startDate : null,
                    "filter[end_date]": isState?.valueDate?.endDate != null ? isState?.valueDate?.endDate : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let { rResult, output, rTotal } = response?.data;
                    sTotalItems(output);
                    sTotal(rTotal);
                    queryState({ data: rResult || [], dataExcel: rResult || [], onFetching: false });
                }
            }
        );
    };
    // fetch tab filter
    const _ServerFetching_group = async () => {
        await Axios(
            "GET",
            `/api_web/Api_return_order/filterBar/?csrf_protection=true`,
            {
                params: {
                    search: isState.keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[status_bar]": tabPage ?? null,
                    "filter[id]": isState.idCode != null ? isState.idCode?.value : null,
                    "filter[branch_id]": isState.idBranch != null ? isState.idBranch.value : null,
                    "filter[client_id]": isState?.idClient ? isState?.idClient.value : null,
                    "filter[start_date]": isState?.valueDate?.startDate != null ? isState?.valueDate?.startDate : null,
                    "filter[end_date]": isState?.valueDate?.endDate != null ? isState?.valueDate?.endDate : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let data = response.data;
                    queryState({ listStatus: data || [] });
                }
                queryState({ onFetchingGroup: false });
            }
        );
    };

    // filter

    const convertArray = (arr) => {
        return arr?.map((e) => ({ label: e?.name, value: e?.id })) || [];
    };
    const _ServerFetching_filter = async () => {
        await Axios("GET", `/api_web/Api_Branch/branch/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let { rResult } = response.data;
                queryState({ listBr: convertArray(rResult) });
            }
        });
        await Axios("GET", `/api_web/api_return_order/searchReturnOrder?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let { data } = response.data;
                queryState({ listCode: data?.return_order.map((e) => ({ label: e.reference_no, value: e.id })) });
            }
        });
        await Axios("GET", "/api_web/api_client/searchClients?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let { data } = response?.data;
                queryState({ listClient: convertArray(data?.clients) });
            }
        });
        queryState({ onFetchingFilter: false });
    };

    const handleSearchCodesApi = debounce((inputValue) => {
        Axios(
            "GET",
            `/api_web/api_return_order/searchReturnOrder?csrf_protection=true`,
            {
                data: { term: inputValue },
            },
            (err, response) => {
                if (!err) {
                    let { data } = response.data;
                    queryState({ listCode: data?.return_order.map((e) => ({ label: e.reference_no, value: e.id })) });
                }
            }
        );
    }, 500);

    const handleSearchClientsApi = debounce((value) => {
        Axios(
            "GET",
            "/api_web/api_client/searchClients?csrf_protection=true",
            {
                params: {
                    search: value ? value : "",
                },
            },
            (err, response) => {
                if (!err) {
                    let { data } = response?.data;
                    queryState({ listClient: convertArray(data?.clients) });
                }
            }
        );
    }, 500);

    useEffect(() => {
        isState.onFetchingFilter && _ServerFetching_filter();
    }, [isState.onFetchingFilter]);

    useEffect(() => {
        isState.onFetching && _ServerFetching();
    }, [isState.onFetching]);

    useEffect(() => {
        isState.onFetchingGroup && _ServerFetching_group();
    }, [isState.onFetchingGroup]);

    useEffect(() => {
        queryState({ onFetching: true });
    }, [limit, router.query?.page, router.query?.tab]);

    useEffect(() => {
        queryState({ onFetchingGroup: true });
    }, [router.query?.page, router.query?.tab]);

    useEffect(() => {
        if (
            isState.idBranch != null ||
            (isState.valueDate.startDate != null && isState.valueDate.endDate != null) ||
            isState.idClient != null ||
            isState.idCode != null
        ) {
            router.push({
                pathname: router.route,
                query: {
                    tab: router.query?.tab,
                },
            });
            setTimeout(() => {
                queryState({ onFetching: true, onFetchingGroup: true });
            }, 300);
        } else {
            queryState({ onFetching: true, onFetchingGroup: true });
        }
    }, [
        limit,
        isState.keySearch,
        isState.idBranch,
        isState.idClient,
        isState.idCode,
        isState.valueDate.endDate,
        isState.valueDate.startDate,
    ]);

    const onChangeFilter = (type, value) => queryState({ [type]: value });

    const handleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryState({ keySearch: value });
        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            },
        });
        queryState({ onFetching: true });
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
            data: isState?.dataExcel?.map((e) => [
                { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
                { value: `${e?.date ? e?.date : ""}` },
                { value: `${e?.code ? e?.code : ""}` },
                { value: `${e?.client_name ? e?.client_name : ""}` },
                {
                    value: `${e?.total_price ? formatMoney(e?.total_price) : ""}`,
                },
                {
                    value: `${e?.total_tax_price ? formatMoney(e?.total_tax_price) : ""}`,
                },
                {
                    value: `${e?.total_amount ? formatMoney(e?.total_amount) : ""}`,
                },
                {
                    value: `${e?.handling_solution ? dataLang[e?.handling_solution] || e?.handling_solution : ""}`,
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
        let data = new FormData();
        data.append("warehouseman_id", checkedWare?.checkedpost != "0" ? checkedWare?.checkedpost : "");
        data.append("id", checkedWare?.id);
        Axios(
            "POST",
            `/api_web/Api_return_order/ConfirmWarehous?csrf_protection=true`,
            {
                data: data,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    let { isSuccess, message, alert_type, data_export } = response.data;
                    if (isSuccess) {
                        isShow(alert_type, dataLang[message] || message);
                        setTimeout(() => {
                            queryState({ onFetching: true });
                        }, 300);
                    } else {
                        isShow("error", dataLang[message] || message);
                    }
                    if (data_export?.length > 0) {
                        queryState({ data_export: [...data_export] });
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
                <title>{dataLang?.returnSales_titleLits || "returnSales_titleLits"} </title>
            </Head>
            <Container>
                {isState.data_export?.length > 0 && (
                    <Popup_status className="hidden" data_export={isState.data_export} dataLang={dataLang} />
                )}
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">{dataLang?.returnSales_title || "returnSales_title"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.returnSales_titleLits || "returnSales_titleLits"}</h6>
                    </div>
                )}

                <ContainerBody>
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-0.5 h-[96%] overflow-hidden">
                            <div className="flex justify-between  mt-1 mr-2">
                                <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                    {dataLang?.returnSales_titleLits || "returnSales_titleLits"}
                                </h2>
                                <ButtonAddNew
                                    onClick={() => {
                                        if (role) {
                                            router.push(routerReturnSales.form);
                                        } else if (checkAdd) {
                                            router.push(routerReturnSales.form);
                                        } else {
                                            isShow("warning", WARNING_STATUS_ROLE);
                                        }
                                    }}
                                    dataLang={dataLang}
                                />
                            </div>
                            <ContainerFilterTab>
                                {isState.listStatus &&
                                    isState.listStatus.map((e) => {
                                        return (
                                            <div>
                                                <TabFilter
                                                    dataLang={dataLang}
                                                    key={e?.id}
                                                    onClick={_HandleSelectTab.bind(this, `${e?.id}`)}
                                                    total={e?.count}
                                                    active={e?.id}
                                                >
                                                    {dataLang[e?.name] || e?.name}
                                                </TabFilter>
                                            </div>
                                        );
                                    })}
                            </ContainerFilterTab>
                            {/* table */}
                            <ContainerTable>
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded-t-lg items-center grid grid-cols-7 2xl:grid-cols-9 xl:col-span-8 lg:col-span-7 2xl:xl:p-2 xl:p-1.5 p-1.5">
                                        <div className="col-span-6 2xl:col-span-7 xl:col-span-5 lg:col-span-5">
                                            <div className="grid grid-cols-5 gap-2">
                                                <div className="col-span-1">
                                                    <SearchComponent
                                                        dataLang={dataLang}
                                                        onChange={handleOnChangeKeySearch.bind(this)}
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <SelectComponent
                                                        options={[
                                                            {
                                                                value: "",
                                                                label:
                                                                    dataLang?.price_quote_branch ||
                                                                    "price_quote_branch",
                                                                isDisabled: true,
                                                            },
                                                            ...isState.listBr,
                                                        ]}
                                                        onChange={onChangeFilter.bind(this, "idBranch")}
                                                        value={isState.idBranch}
                                                        placeholder={
                                                            dataLang?.price_quote_select_branch ||
                                                            "price_quote_select_branch"
                                                        }
                                                        hideSelectedOptions={false}
                                                        isClearable={true}
                                                        className="3xl:text-[16px] 2xl:text-[16px] xl:text-[13px] lg:text-[12px] w-full rounded-xl bg-white z-20"
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <SelectComponent
                                                        options={[
                                                            {
                                                                value: "",
                                                                label:
                                                                    dataLang?.purchase_order_table_code ||
                                                                    "purchase_order_table_code",
                                                                isDisabled: true,
                                                            },
                                                            ...isState.listCode,
                                                        ]}
                                                        onInputChange={handleSearchCodesApi.bind(this)}
                                                        onChange={onChangeFilter.bind(this, "idCode")}
                                                        value={isState.idCode}
                                                        placeholder={
                                                            dataLang?.purchase_order_table_code ||
                                                            "purchase_order_table_code"
                                                        }
                                                        isClearable={true}
                                                        className="3xl:text-[16px] 2xl:text-[16px] xl:text-[13px] lg:text-[12px] w-full rounded-md bg-white z-20"
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <SelectComponent
                                                        options={[
                                                            {
                                                                value: "",
                                                                label:
                                                                    dataLang?.price_quote_select_customer ||
                                                                    "price_quote_select_customer",
                                                                isDisabled: true,
                                                            },
                                                            ...isState.listClient,
                                                        ]}
                                                        onInputChange={handleSearchClientsApi.bind(this)}
                                                        onChange={onChangeFilter.bind(this, "idClient")}
                                                        value={isState.idClient}
                                                        placeholder={
                                                            dataLang?.price_quote_customer || "price_quote_customer"
                                                        }
                                                        isClearable={true}
                                                        className="3xl:text-[16px] 2xl:text-[16px] xl:text-[13px] lg:text-[12px] w-full rounded-md bg-white z-20"
                                                    />
                                                </div>
                                                <div className="z-20 col-span-1">
                                                    <DateToDateComponent
                                                        value={isState.valueDate}
                                                        onChange={onChangeFilter.bind(this, "valueDate")}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-1 xl:col-span-2 lg:col-span-2">
                                            <div className="flex justify-end items-center gap-2">
                                                <OnResetData sOnFetching={(e) => queryState({ onFetching: e })} />
                                                <div>
                                                    {role == true || checkExport ? (
                                                        <div className={``}>
                                                            {isState.dataExcel?.length > 0 && (
                                                                <ExcelFileComponent
                                                                    classBtn="!px-1"
                                                                    filename={
                                                                        dataLang?.returnSales_titleEx ||
                                                                        "returnSales_titleEx"
                                                                    }
                                                                    title={"DSTLHB"}
                                                                    multiDataSet={multiDataSet}
                                                                    dataLang={dataLang}
                                                                />
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => isShow("warning", WARNING_STATUS_ROLE)}
                                                            className={`xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}
                                                        >
                                                            <Grid6
                                                                className="2xl:scale-100 xl:scale-100 scale-75"
                                                                size={18}
                                                            />
                                                            <span>{dataLang?.client_list_exportexcel}</span>
                                                        </button>
                                                    )}
                                                </div>
                                                <div>
                                                    <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Customscrollbar>
                                    <div className="w-[100%] lg:w-[100%] ">
                                        <HeaderTable gridCols={10}>
                                            <ColumnTable textAlign="center" colSpan={1}>
                                                {dataLang?.import_day_vouchers || "import_day_vouchers"}
                                            </ColumnTable>
                                            <ColumnTable textAlign={"center"} colSpan={1}>
                                                {dataLang?.import_code_vouchers || "import_code_vouchers"}
                                            </ColumnTable>
                                            <ColumnTable textAlign={"center"} colSpan={1}>
                                                {dataLang?.returnSales_client || "returnSales_client"}
                                            </ColumnTable>
                                            <ColumnTable textAlign={"center"} colSpan={1}>
                                                {dataLang?.import_total_amount || "import_total_amount"}
                                            </ColumnTable>
                                            <ColumnTable textAlign={"center"} colSpan={1}>
                                                {dataLang?.import_tax_money || "import_tax_money"}
                                            </ColumnTable>
                                            <ColumnTable textAlign={"center"} colSpan={1}>
                                                {dataLang?.import_into_money || "import_into_money"}
                                            </ColumnTable>
                                            <ColumnTable textAlign={"center"} colSpan={1}>
                                                {dataLang?.returns_form || "returns_form"}
                                            </ColumnTable>
                                            <ColumnTable textAlign={"center"} colSpan={1}>
                                                {dataLang?.import_brow_storekeepers || "import_brow_storekeepers"}
                                            </ColumnTable>
                                            <ColumnTable textAlign={"center"} colSpan={1}>
                                                {dataLang?.import_branch || "import_branch"}
                                            </ColumnTable>
                                            <ColumnTable textAlign={"center"} colSpan={1}>
                                                {dataLang?.import_action || "import_action"}
                                            </ColumnTable>
                                        </HeaderTable>
                                        {isState.onFetching ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : isState.data?.length > 0 ? (
                                            <>
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                                    {isState?.data?.map((e) => (
                                                        <RowTable gridCols={10} key={e.id.toString()}>
                                                            <RowItemTable textAlign={"center"} colSpan={1}>
                                                                {e?.date != null ? formatMoment(e?.date, FORMAT_MOMENT.DATE_SLASH_LONG) : ""}
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={1} textAlign={"center"}>
                                                                <PopupDetail
                                                                    dataLang={dataLang}
                                                                    className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] px-2 col-span-1 text-center text-[#0F4F9E] hover:text-[#5599EC] transition-all ease-linear cursor-pointer "
                                                                    name={e?.code}
                                                                    id={e?.id}
                                                                />
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={1} textAlign={"center"}>
                                                                {e.client_name}
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={1} textAlign={"right"}>
                                                                {formatMoney(e.total_price)}
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={1} textAlign={"right"}>
                                                                {formatMoney(e.total_tax_price)}
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={1} textAlign={"right"}>
                                                                {formatMoney(e.total_amount)}
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={1} className=" mx-auto">
                                                                {(e?.handling_solution === "pay_down" && (
                                                                    <TagColorSky
                                                                        className={"!py-1"}
                                                                        name={
                                                                            dataLang[e?.handling_solution] ||
                                                                            e?.handling_solution
                                                                        }
                                                                    />
                                                                )) ||
                                                                    (e?.handling_solution === "debt_reduction" && (
                                                                        <TagColorOrange
                                                                            className={"!py-1"}
                                                                            name={
                                                                                dataLang[e?.handling_solution] ||
                                                                                e?.handling_solution
                                                                            }
                                                                        />
                                                                    ))}
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={1}>
                                                                <ButtonWarehouse
                                                                    warehouseman_id={e?.warehouseman_id}
                                                                    _HandleChangeInput={_HandleChangeInput}
                                                                    id={e?.id}
                                                                />
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={1} className="w-fit mx-auto">
                                                                <TagBranch>{e?.branch_name}</TagBranch>
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={1} className="flex justify-center">
                                                                <BtnAction
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    onRefreshGroup={_ServerFetching_group.bind(this)}
                                                                    dataLang={dataLang}
                                                                    warehouseman_id={e?.warehouseman_id}
                                                                    id={e?.id}
                                                                    type="returnSales"
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
                        <ContainerTotal className="!grid-cols-10">
                            <ColumnTable colSpan={3} textAlign={"center"} className="p-2">
                                {dataLang?.import_total || "import_total"}
                            </ColumnTable>
                            <ColumnTable colSpan={1} textAlign={"right"}>
                                {formatMoney(total?.total_price)}
                            </ColumnTable>
                            <ColumnTable colSpan={1} textAlign={"right"}>
                                {formatMoney(total?.total_tax_price)}
                            </ColumnTable>
                            <ColumnTable colSpan={1} textAlign={"right"}>
                                {formatMoney(total?.total_amount)}
                            </ColumnTable>
                        </ContainerTotal>
                        {isState.data?.length != 0 && (
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
                    </div>
                </ContainerBody>
            </Container>
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                nameModel={"returnSales"}
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
