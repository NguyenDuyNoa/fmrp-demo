import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ModalImage from "react-modal-image";

import { Grid6 } from "iconsax-react";

import "react-datepicker/dist/react-datepicker.css";


import ReactExport from "react-data-export";

import LinkWarehouse from "../components/linkWarehouse";
import Popup_chitiet from "./components/pupup";

import BtnAction from "@/components/UI/btnAction";
import ButtonWarehouse from "@/components/UI/btnWarehouse/btnWarehouse";
import ImageErrors from "@/components/UI/imageErrors";
import Loading from "@/components/UI/loading";
import Pagination from "@/components/UI/pagination";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";

import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";

import { routerProductionWarehouse } from "@/routers/manufacture";

import apiComons from "@/Api/apiComon/apiComon";
import apiProductionWarehouse from "@/Api/apiManufacture/warehouse/productionWarehouse/apiProductionWarehouse";
import TabFilter from "@/components/UI/tabFilter";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import ButtonAddNew from "@/components/UI/button/buttonAddNew";
import ContainerPagination from "@/components/UI/common/containerPagination/containerPagination";
import TitlePagination from "@/components/UI/common/containerPagination/titlePagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { EmptyExprired } from "@/components/UI/common/emptyExprired";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/table";
import TagBranch from "@/components/UI/common/tag/tagBranch";
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
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { debounce } from "lodash";
import { useSelector } from "react-redux";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const isShow = useToast();

    const { paginate } = usePagination();

    const dataSeting = useSetingServer();

    const statusExprired = useStatusExprired();

    const { isOpen, isKeyState, handleQueryId } = useToggle();

    const initialState = {
        data: [],
        dataExcel: [],
        onFetching: false,
        onFetching_filter: false,
        onFetchingGroup: false,
        onSending: false,
        keySearch: "",
        listBr: [],
        lisCode: [],
        idExportWarehouse: null,
        dataWarehouse: [],
        listDs: [],
        idCode: null,
        idSupplier: null,
        idBranch: null,
        valueDate: {
            startDate: null,
            endDate: null,
        },
    };

    const [checkedWare, sCheckedWare] = useState({});

    const [isState, sIsState] = useState(initialState);

    const queryState = (key) => sIsState((prve) => ({ ...prve, ...key }));

    const [total, sTotal] = useState({});

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkExport } = useActionRole(auth, "production_warehouse");

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems();

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

        queryState({ onFetching_filter: true, onFetchingGroup: true });
    }, []);

    const _ServerFetching = async () => {
        const tabPage = router.query?.tab;

        const params = {
            search: isState.keySearch,
            limit: limit,
            page: router.query?.page || 1,
            "filter[status_bar]": tabPage ?? null,
            "filter[id]": isState.idCode != null ? isState.idCode?.value : null,
            "filter[branch_id]": isState.idBranch != null ? isState.idBranch.value : null,
            "filter[start_date]": isState.valueDate?.startDate != null ? isState.valueDate?.startDate : null,
            "filter[end_date]": isState.valueDate?.endDate != null ? isState.valueDate?.endDate : null,
            "filter[warehouse_id]": isState.idExportWarehouse != null ? isState.idExportWarehouse?.value : null,
        };

        try {
            const { rResult, output, rTotal } = await apiProductionWarehouse.apiListProductionWarehouse({
                params: params,
            });

            sTotalItems(output);

            sTotal(rTotal);

            queryState({ data: rResult, dataExcel: rResult, onFetching: false });
        } catch (error) { }
    };

    const _ServerFetching_group = async () => {
        const params = {
            limit: 0,
            search: isState.keySearch,
            "filter[id]": isState.idCode != null ? isState.idCode?.value : null,
            "filter[branch_id]": isState.idBranch != null ? isState.idBranch.value : null,
            "filter[start_date]": isState.valueDate?.startDate != null ? isState.valueDate?.startDate : null,
            "filter[end_date]": isState.valueDate?.endDate != null ? isState.valueDate?.endDate : null,
            "filter[warehouse_id]": isState.idExportWarehouse != null ? isState.idExportWarehouse?.value : null,
        };

        try {
            const data = await apiProductionWarehouse.apiListGroupProductionWarehouse({ params: params });

            queryState({ listDs: data, onFetchingGroup: false });
        } catch (error) { }
    };

    const _ServerFetching_filter = async () => {
        try {
            const { result: listBr } = await apiComons.apiBranchCombobox();

            const { result: exportProductionCombobox } = await apiProductionWarehouse.apiCodeProductionWarehouse();

            const data = await apiProductionWarehouse.apiComboboxWarehouse();

            queryState({
                listBr: listBr?.map((e) => ({ label: e.name, value: e.id })),
                lisCode: exportProductionCombobox?.map((e) => ({ label: e.code, value: e.id })),
                dataWarehouse: data?.map((e) => ({ label: e?.warehouse_name, value: e?.id })),
                onFetching_filter: false,
            });
        } catch (error) { }
    };

    const _HandleSeachApi = debounce(async (inputValue) => {
        try {
            const { result } = await apiProductionWarehouse.apiAjaxCodeProductionWarehouse({
                data: {
                    term: inputValue,
                },
            });
            queryState({ lisCode: result?.map((e) => ({ label: e.code, value: e.id })) });
        } catch (error) { }
    }, 500);

    useEffect(() => {
        isState.onFetching_filter && _ServerFetching_filter();
    }, [isState.onFetching_filter]);

    useEffect(() => {
        isState.onFetching && _ServerFetching();
    }, [isState.onFetching]);
    useEffect(() => {
        isState.onFetchingGroup && _ServerFetching_group();
    }, [isState.onFetchingGroup]);

    useEffect(() => {
        queryState({ onFetchingGroup: true, onFetching: true });
    }, [
        limit,
        router.query?.page,
        router.query?.tab,
        isState.idBranch,
        isState.valueDate.endDate,
        isState.valueDate.startDate,
        isState.idSupplier,
        isState.idCode,
        isState.idExportWarehouse,
    ]);

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
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
    }, 500);

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
                    title: `${dataLang?.production_warehouse_orderNumber || "production_warehouse_orderNumber"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.production_warehouse_expWarehouse || "production_warehouse_expWarehouse"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.production_warehouse_Total_value || "production_warehouse_Total_value"}`,
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
                {
                    title: `${dataLang?.production_warehouse_creator || "production_warehouse_creator"}`,
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
            ],
            data: isState.dataExcel?.map((e) => [
                { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
                { value: `${e?.date ? e?.date : ""}` },
                { value: `${e?.code ? e?.code : ""}` },
                { value: `${"Số LSX chi tiết"}` },
                { value: `${e?.warehouse_name ? e?.warehouse_name : ""}` },
                {
                    value: `${e?.grand_total ? formatNumber(e?.grand_total) : ""}`,
                },
                { value: `${e?.note ? e?.note : ""}` },
                {
                    value: `${e?.staff_create?.full_name ? e?.staff_create?.full_name : ""}`,
                },
                {
                    value: `${e?.warehouseman_id === "0" ? "Chưa duyệt kho" : "Đã duyệt kho"}`,
                },
                { value: `${e?.branch_name ? e?.branch_name : ""}` },
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
    const _ServerSending = async () => {
        let data = new FormData();

        data.append("warehouseman_id", checkedWare?.checkedpost != "0" ? checkedWare?.checkedpost : "");

        data.append("id", checkedWare?.id);

        try {
            const { isSuccess, message, data_export } = await apiProductionWarehouse.apiHangdingStatusWarehouse({
                data: data,
            });

            if (isSuccess) {
                isShow("success", `${dataLang[message]}`);
                await _ServerFetching();
                await _ServerFetching_group();
            } else {
                isShow("error", `${dataLang[message]}`);
            }
        } catch (error) { }
        queryState({ onSending: false });
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
                <title>{dataLang?.production_warehouse || "production_warehouse"} </title>
            </Head>
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.production_warehouse || "production_warehouse"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.production_warehouse || "production_warehouse"}</h6>
                    </div>
                )}

                <ContainerBody>
                    <div className="space-y-0.5 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.production_warehouse || "production_warehouse"}
                            </h2>
                            <ButtonAddNew
                                onClick={() => {
                                    if (role) {
                                        router.push(routerProductionWarehouse.form);
                                    } else if (checkAdd) {
                                        router.push(routerProductionWarehouse.form);
                                    } else {
                                        isShow("warning", WARNING_STATUS_ROLE);
                                    }
                                }}
                                dataLang={dataLang}
                            />
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
                                                onClick={_HandleSelectTab.bind(this, e.id)}
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
                                        <div className="grid grid-cols-5 gap-2">
                                            <SearchComponent
                                                colSpan={1}
                                                dataLang={dataLang}
                                                placeholder={dataLang?.branch_search}
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
                                                    ...isState.listBr,
                                                ]}
                                                onChange={(e) => queryState({ idBranch: e })}
                                                value={isState.idBranch}
                                                placeholder={
                                                    dataLang?.purchase_order_table_branch ||
                                                    "purchase_order_table_branch"
                                                }
                                                isClearable={true}
                                                colSpan={1}
                                            />
                                            <SelectComponent
                                                onInputChange={(event) => {
                                                    _HandleSeachApi(event);
                                                }}
                                                options={[
                                                    {
                                                        value: "",
                                                        label:
                                                            dataLang?.purchase_order_table_code ||
                                                            "purchase_order_table_code",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.lisCode,
                                                ]}
                                                onChange={(e) => queryState({ idCode: e })}
                                                value={isState.idCode}
                                                placeholder={
                                                    dataLang?.purchase_order_table_code || "purchase_order_table_code"
                                                }
                                                isClearable={true}
                                                colSpan={1}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label:
                                                            dataLang?.production_warehouse_expWarehouse ||
                                                            "production_warehouse_expWarehouse",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.dataWarehouse,
                                                ]}
                                                onChange={(e) => queryState({ idExportWarehouse: e })}
                                                value={isState.idExportWarehouse}
                                                placeholder={
                                                    dataLang?.production_warehouse_expWarehouse ||
                                                    "production_warehouse_expWarehouse"
                                                }
                                                isClearable={true}
                                                colSpan={1}
                                            />
                                            <DateToDateComponent
                                                colSpan={1}
                                                value={isState.valueDate}
                                                onChange={(e) => queryState({ valueDate: e })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1 xl:col-span-2 lg:col-span-2">
                                        <div className="flex justify-end items-center gap-2">
                                            <OnResetData sOnFetching={(e) => queryState({ onFetching: e })} />
                                            {role == true || checkExport ? (
                                                <div className={``}>
                                                    {isState.dataExcel?.length > 0 && (
                                                        <ExcelFileComponent
                                                            dataLang={dataLang}
                                                            filename={"Danh sách xuất kho sản xuất"}
                                                            title="DSXKSX"
                                                            multiDataSet={multiDataSet}
                                                        />
                                                    )}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => isShow("warning", WARNING_STATUS_ROLE)}
                                                    className={`xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}
                                                >
                                                    <Grid6 className="2xl:scale-100 xl:scale-100 scale-75" size={18} />
                                                    <span>{dataLang?.client_list_exportexcel}</span>
                                                </button>
                                            )}
                                            <div>
                                                <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Customscrollbar>
                                <div className="w-full">
                                    <HeaderTable gridCols={10}>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.import_day_vouchers || "import_day_vouchers"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.import_code_vouchers || "import_code_vouchers"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.production_warehouse_LSX || "production_warehouse_LSX"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.production_warehouse_expWarehouse ||
                                                "production_warehouse_expWarehouse"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.production_warehouse_Total_value ||
                                                "production_warehouse_Total_value"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.production_warehouse_note || "production_warehouse_note"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.production_warehouse_creator || "production_warehouse_creator"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.production_warehouse_browse || "production_warehouse_browse"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.import_branch || "import_branch"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.import_action || "import_action"}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {isState.onFetching ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : isState.data?.length > 0 ? (
                                        <>
                                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                                {isState.data?.map((e) => (
                                                    <RowTable gridCols={10} key={e.id.toString()}>
                                                        <RowItemTable colSpan={1} textAlign={"center"}>
                                                            {e?.date != null ? formatMoment(e?.date, FORMAT_MOMENT.DATE_SLASH_LONG) : ""}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={"center"}>
                                                            <Popup_chitiet
                                                                dataLang={dataLang}
                                                                className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] px-2 text-[#0F4F9E] hover:text-[#5599EC] transition-all ease-linear cursor-pointer "
                                                                name={e?.code}
                                                                id={e?.id}
                                                            />
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={"center"}>
                                                            {/* {formatNumber(e.total_price)} */}
                                                        </RowItemTable>
                                                        <LinkWarehouse
                                                            colSpan={1}
                                                            warehouse_id={e?.warehouse_id}
                                                            warehouse_name={e?.warehouse_name}
                                                        />
                                                        <RowItemTable colSpan={1} textAlign={"right"}>
                                                            {formatNumber(e?.grand_total)}
                                                        </RowItemTable>
                                                        <RowItemTable
                                                            colSpan={1}
                                                            textAlign={"left"}
                                                            className="truncate"
                                                        >
                                                            {e?.note}
                                                        </RowItemTable>
                                                        <RowItemTable
                                                            colSpan={1}
                                                            className="flex items-center gap-2 justify-start"
                                                        >
                                                            <div className="relative">
                                                                <ModalImage
                                                                    small={
                                                                        e?.staff_create?.profile_image
                                                                            ? e?.staff_create?.profile_image
                                                                            : "/user-placeholder.jpg"
                                                                    }
                                                                    large={
                                                                        e?.staff_create?.profile_image
                                                                            ? e?.staff_create?.profile_image
                                                                            : "/user-placeholder.jpg"
                                                                    }
                                                                    className="h-6 w-6 rounded-full object-cover "
                                                                >
                                                                    <div className="">
                                                                        <ImageErrors
                                                                            src={e?.staff_create?.profile_image}
                                                                            width={25}
                                                                            height={25}
                                                                            defaultSrc="/user-placeholder.jpg"
                                                                            alt="Image"
                                                                            className="object-cover  rounded-[100%] text-left cursor-pointer"
                                                                        />
                                                                    </div>
                                                                </ModalImage>
                                                                <span className="h-2 w-2 absolute 3xl:bottom-full 3xl:translate-y-[150%] 3xl:left-1/2  3xl:translate-x-[100%] 2xl:bottom-[80%] 2xl:translate-y-full 2xl:left-1/2 bottom-[50%] left-1/2 translate-x-full translate-y-full">
                                                                    <span className="inline-flex relative rounded-full h-2 w-2 bg-lime-500">
                                                                        <span className="animate-ping  inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 absolute"></span>
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            <h6 className="capitalize">{e?.staff_create?.full_name}</h6>
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1}>
                                                            <ButtonWarehouse
                                                                warehouseman_id={e?.warehouseman_id}
                                                                _HandleChangeInput={_HandleChangeInput}
                                                                id={e?.id}
                                                            />
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className="mx-auto">
                                                            <TagBranch className="w-fit">{e?.branch_name}</TagBranch>
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className="flex justify-center">
                                                            <BtnAction
                                                                onRefresh={_ServerFetching.bind(this)}
                                                                onRefreshGroup={_ServerFetching_group.bind(this)}
                                                                dataLang={dataLang}
                                                                warehouseman_id={e?.warehouseman_id}
                                                                status_pay={e?.status_pay}
                                                                id={e?.id}
                                                                type="production_warehouse"
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
                        <ColumnTable colSpan={4} textAlign={"center"} className="p-2">
                            {dataLang?.import_total || "import_total"}
                        </ColumnTable>
                        <ColumnTable colSpan={1} textAlign="right" className={"p-2 mr-1"}>
                            {formatNumber(total?.grand_total)}
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
                </ContainerBody>
            </Container>
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                nameModel={"production_warehouse"}
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
