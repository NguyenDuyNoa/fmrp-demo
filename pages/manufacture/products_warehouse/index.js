import Head from "next/head";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

import {
    Grid6 as IconExcel,
    Filter as IconFilter,
    Calendar as IconCalendar,
    SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    Grid6,
} from "iconsax-react";

import moment from "moment/moment";
import ModalImage from "react-modal-image";
import "react-datepicker/dist/react-datepicker.css";

import { _ServerInstance as Axios } from "/services/axios";

import Popup_chitiet from "./components/pupup";
import Popup_status from "../components/popupStatus";
import LinkWarehouse from "../components/linkWarehouse";

import Loading from "@/components/UI/loading";
import BtnAction from "@/components/UI/BtnAction";
import TabFilter from "@/components/UI/TabFilter";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import ImageErrors from "@/components/UI/imageErrors";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import ButtonWarehouse from "@/components/UI/btnWarehouse/btnWarehouse";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import DatepickerComponent from "@/components/UI/filterComponents/dateTodateComponent";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import { Container, ContainerBody, ContainerFilterTab, ContainerTable, ContainerTotal } from "@/components/UI/common/layout";


import useToast from "@/hooks/useToast";
import useActionRole from "@/hooks/useRole";
import { useToggle } from "@/hooks/useToggle";
import useSetingServer from "@/hooks/useConfigNumber";
import useStatusExprired from "@/hooks/useStatusExprired";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";

import { routerProductsWarehouse } from "@/routers/manufacture";

import { CONFIRMATION_OF_CHANGES, TITLE_STATUS } from "@/constants/changeStatus/changeStatus";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import formatNumberConfig from "@/utils/helpers/formatnumber";


const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const isShow = useToast();

    const dataSeting = useSetingServer()

    const statusExprired = useStatusExprired();

    const { isKeyState, isOpen, handleQueryId } = useToggle();

    const initalState = {
        data: [],
        keySearch: "",
        dataExcel: [],
        onFetching: false,
        onSending: false,
        onFetching_filter: false,
        onFetchingGroup: false,
        listBr: [],
        listCode: [],
        dataWarehouse: [],
        listDs: [],
        idImportWarehouse: null,
        idCode: null,
        idSupplier: null,
        idBranch: null,
        valueDate: { startDate: null, endDate: null },
        data_export: []
    }

    const [isState, sIsState] = useState(initalState);

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const [total, sTotal] = useState({});

    const [checkedWare, sCheckedWare] = useState({});


    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkExport } = useActionRole(auth, "productsWarehouse")

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems()

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
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
        queryState({ onFetching_filter: true });
    }, []);

    const _ServerFetching = () => {
        const tabPage = router.query?.tab;
        Axios("GET", `/api_web/Api_product_receipt/productReceipt/?csrf_protection=true`,
            {
                params: {
                    search: isState.keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[status_bar]": tabPage ?? null,
                    "filter[id]": isState.idCode != null ? isState.idCode?.value : null,
                    "filter[branch_id]": isState.idBranch != null ? isState.idBranch.value : null,
                    "filter[start_date]": isState.valueDate?.startDate != null ? isState.valueDate?.startDate : null,
                    "filter[end_date]": isState.valueDate?.endDate != null ? isState.valueDate?.endDate : null,
                    "filter[warehouse_id]": isState.idImportWarehouse != null ? isState.idImportWarehouse?.value : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let { rResult, output, rTotal } = response.data;
                    sTotalItems(output);
                    sTotal(rTotal);
                    queryState({ data: rResult, dataExcel: rResult })
                }
                queryState({ onFetching: false })
            }
        );
    };

    const _ServerFetching_group = () => {
        Axios("GET", `/api_web/Api_product_receipt/filterBar/?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                    search: isState.keySearch,
                    "filter[id]": isState.idCode != null ? isState.idCode?.value : null,
                    "filter[branch_id]": isState.idBranch != null ? isState.idBranch.value : null,
                    "filter[start_date]": isState.valueDate?.startDate != null ? isState.valueDate?.startDate : null,
                    "filter[end_date]": isState.valueDate?.endDate != null ? isState.valueDate?.endDate : null,
                    "filter[warehouse_id]": isState.idImportWarehouse != null ? isState.idImportWarehouse?.value : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let data = response.data;
                    queryState({ listDs: data || [] })

                }
                queryState({ onFetchingGroup: false })
            }
        );
    };

    const _ServerFetching_filter = () => {
        Axios("GET", `/api_web/Api_Branch/branchCombobox/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let { result } = response?.data;
                queryState({ listBr: result?.map((e) => ({ label: e.name, value: e.id })) || [] })
            }
        });
        Axios("GET", "/api_web/Api_product_receipt/productReceiptCombobox/?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    let { result } = response?.data;
                    queryState({ listCode: result?.map((e) => ({ label: e.code, value: e.id })) || [] })
                }
            }
        );
        Axios("GET", "/api_web/Api_warehouse/warehouseCombobox/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let data = response?.data;
                queryState({ dataWarehouse: data?.map((e) => ({ label: e?.warehouse_name, value: e?.id })) || [] })
            }
        });
        queryState({ onFetching_filter: false })
    };

    const _HandleSeachApi = debounce((inputValue) => {
        Axios("POST", `/api_web/Api_product_receipt/productReceiptCombobox/?csrf_protection=true`,
            {
                data: {
                    term: inputValue,
                },
            },
            (err, response) => {
                if (!err) {
                    let { result } = response?.data;
                    queryState({ listCode: result?.map((e) => ({ label: e.code, value: e.id })) || [] })
                }
            }
        );
    }, 500)

    useEffect(() => {
        isState.onFetching_filter && _ServerFetching_filter();
    }, [isState.onFetching_filter]);

    useEffect(() => {
        (isState.onFetching && _ServerFetching())
    }, [isState.onFetching]);

    useEffect(() => {
        (isState.onFetchingGroup && _ServerFetching_group());
    }, [isState.onFetchingGroup]);

    useEffect(() => {
        queryState({ onFetching: true, onFetchingGroup: true });
    }, [
        limit,
        router.query?.page,
        router.query?.tab,
        isState.idBranch,
        isState.valueDate.endDate,
        isState.valueDate.startDate,
        isState.idSupplier,
        isState.idCode,
        isState.idImportWarehouse,
    ]);


    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryState({ keySearch: value });
        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            },
        });
        queryState({ onFetching: true })
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
                    title: `${dataLang?.productsWarehouse_QtyImport || "productsWarehouse_QtyImport"}`,
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
                    value: `${e?.count_item ? formatNumber(e?.count_item) : ""}`,
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
    const _ServerSending = () => {
        let data = new FormData();
        data.append("warehouseman_id", checkedWare?.checkedpost != "0" ? checkedWare?.checkedpost : "");
        data.append("id", checkedWare?.id);
        Axios("POST", `/api_web/Api_product_receipt/ConfirmWarehous?csrf_protection=true`,
            {
                data: data,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    let { isSuccess, message, data_export } = response.data;

                    if (isSuccess) {
                        isShow("success", `${dataLang[message] || message}`);

                        setTimeout(() => {
                            queryState({ onFetching: true });
                        }, 300);
                    } else {
                        isShow("error", `${dataLang[message] || message}`);
                    }
                    if (data_export?.length > 0) {
                        queryState({ data_export: data_export });
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
        checkedWare.id != null && queryState({ onSending: true })
    }, [checkedWare]);

    useEffect(() => {
        checkedWare.id != null && queryState({ onSending: true })
    }, [checkedWare.id != null]);

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.productsWarehouse_title || "productsWarehouse_title"}</title>
            </Head>
            <Container>
                {isState.data_export.length > 0 && (
                    <Popup_status
                        type="productsWarehouse"
                        className="hidden"
                        data_export={isState.data_export}
                        dataLang={dataLang}
                    />
                )}
                {statusExprired ? (
                    <EmptyExprired />
                ) : (

                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.productsWarehouse_title || "productsWarehouse_title"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.productsWarehouse_title || "productsWarehouse_title"}</h6>
                    </div>
                )}

                <ContainerBody>
                    <div className="space-y-0.5 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.productsWarehouse_title || "productsWarehouse_title"}
                            </h2>
                            <button
                                onClick={() => {
                                    if (role) {
                                        router.push(routerProductsWarehouse.form)
                                    } else if (checkAdd) {
                                        router.push(routerProductsWarehouse.form)
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
                                                onChange={(e) => queryState({ idBranch: e })}
                                                value={isState.idBranch}
                                                placeholder={dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}
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
                                                    ...isState.listCode,
                                                ]}
                                                onChange={(e) => queryState({ idCode: e })}
                                                value={isState.idCode}
                                                placeholder={dataLang?.purchase_order_table_code || "purchase_order_table_code"}
                                                isClearable={true}
                                                colSpan={1}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.productsWarehouse_warehouseImport || "productsWarehouse_warehouseImport",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.dataWarehouse,
                                                ]}
                                                onChange={(e) => queryState({ idImportWarehouse: e })}
                                                value={isState.idImportWarehouse}
                                                placeholder={dataLang?.productsWarehouse_warehouseImport || "productsWarehouse_warehouseImport"}
                                                isClearable={true}
                                                isSearchable={true}
                                            />
                                            <DatepickerComponent colSpan={1} value={isState.valueDate} onChange={(e) => queryState({ valueDate: e })} />
                                        </div>
                                    </div>
                                    <div className="col-span-1 xl:col-span-2 lg:col-span-2">
                                        <div className="flex justify-end items-center gap-2">
                                            <OnResetData sOnFetching={(e) => queryState({ onFetching: e })} />
                                            {(role == true || checkExport) ?
                                                <div className={``}>
                                                    {isState.dataExcel?.length > 0 && (
                                                        <ExcelFileComponent dataLang={dataLang}
                                                            filename={"Danh sách nhập kho thành phẩm"}
                                                            title="DSNKTP"
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
                            <Customscrollbar>
                                <div className="w-full">
                                    <HeaderTable gridCols={10} display={'grid'}>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.import_day_vouchers || "import_day_vouchers"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.import_code_vouchers || "import_code_vouchers"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.production_warehouse_LSX || "production_warehouse_LSX"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.productsWarehouse_warehouseImport || "productsWarehouse_warehouseImport"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.productsWarehouse_total || "productsWarehouse_total"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.production_warehouse_note || "production_warehouse_note"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.production_warehouse_creator || "production_warehouse_creator"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.production_warehouse_browse || "production_warehouse_browse"}
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
                                                    <RowTable gridCols={10} key={e.id.toString()} >
                                                        <RowItemTable colSpan={1} textAlign={'center'}>
                                                            {e?.date != null
                                                                ? moment(e?.date).format("DD/MM/YYYY")
                                                                : ""}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'center'} >
                                                            <Popup_chitiet
                                                                dataLang={dataLang}
                                                                className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] px-2 col-span-1 text-center text-[#0F4F9E] hover:text-[#5599EC] transition-all ease-linear cursor-pointer " name={e?.code}
                                                                id={e?.id}
                                                            />
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'right'}></RowItemTable>
                                                        <LinkWarehouse
                                                            colSpan={1}
                                                            warehouse_id={e?.warehouse_id}
                                                            warehouse_name={e?.warehouse_name}
                                                        />
                                                        <RowItemTable colSpan={1} textAlign={'right'}>
                                                            {formatNumber(e?.count_item)}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'left'} className={'truncate'}>
                                                            {e?.note}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className={'flex items-center justify-start gap-2'}>
                                                            <div className="relative">
                                                                <ModalImage
                                                                    small={e?.staff_create?.profile_image ? e?.staff_create?.profile_image : "/user-placeholder.jpg"}
                                                                    large={e?.staff_create?.profile_image ? e?.staff_create?.profile_image : "/user-placeholder.jpg"}
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
                                                            <h6 className="capitalize">
                                                                {e?.staff_create?.full_name}
                                                            </h6>
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} >
                                                            <ButtonWarehouse
                                                                warehouseman_id={e?.warehouseman_id}
                                                                _HandleChangeInput={_HandleChangeInput}
                                                                id={e?.id}
                                                            />
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className="mx-auto">
                                                            <TagBranch className="w-fit">
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
                                                                type="productsWarehouse"
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
                    <ContainerTotal className="!grid-cols-10">
                        <ColumnTable colSpan={4} textAlign={'center'} className="p-2">
                            {dataLang?.productsWarehouse_total || "productsWarehouse_total"}
                        </ColumnTable>
                        <ColumnTable colSpan={1} textAlign={'right'} className="justify-end p-2 flex gap-2 flex-wrap  mr-1">
                            {formatNumber(total?.total_count_item)}
                        </ColumnTable>
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
            </Container >
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                nameModel={"productsWarehouse"}
                title={TITLE_STATUS}
                subtitle={CONFIRMATION_OF_CHANGES}
                isOpen={isOpen}
                save={handleSaveStatus}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment >
    );
};

export default Index;
