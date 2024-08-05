import apiWarehouseTransfer from "@/Api/apiManufacture/warehouse/warehouseTransfer/apiWarehouseTransfer";
import { BtnAction } from "@/components/UI/BtnAction";
import TabFilter from "@/components/UI/TabFilter";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import ButtonWarehouse from "@/components/UI/btnWarehouse/btnWarehouse";
import ButtonAddNew from "@/components/UI/button/buttonAddNew";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { TagColorOrange, TagColorSky } from "@/components/UI/common/Tag/TagStatus";
import { Container, ContainerBody, ContainerFilterTab, ContainerTable, ContainerTotal, } from "@/components/UI/common/layout";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import DateToDateComponent from "@/components/UI/filterComponents/dateTodateComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import ImageErrors from "@/components/UI/imageErrors";
import Loading from "@/components/UI/loading";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import { CONFIRMATION_OF_CHANGES, TITLE_STATUS } from "@/constants/changeStatus/changeStatus";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import { useBranchList } from "@/hooks/common/useBranch";
import { useWarehouseByBranch } from "@/hooks/common/useWarehouses";
import useSetingServer from "@/hooks/useConfigNumber";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import useActionRole from "@/hooks/useRole";
import useStatusExprired from "@/hooks/useStatusExprired";
import useTab from "@/hooks/useTab";
import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import { Grid6 } from "iconsax-react";
import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ModalImage from "react-modal-image";
import { useSelector } from "react-redux";
import { routerWarehouseTransfer } from "routers/manufacture";
import LinkWarehouse from "../components/linkWarehouse";
import PopupStatus from "../components/popupStatus";
import PopupDetail from "./components/pupup";
import { useWarehouseTransferCombobox } from "./hooks/useWarehouseTransferCombobox";
import { useWarehouseTransferFilterbar } from "./hooks/useWarehouseTransferFilterbar";
import { useWarehouseTransferList } from "./hooks/useWarehouseTransferList";

const initialState = {
    onSending: false,
    keySearch: "",
    keySearchCode: "",
    idExportWarehouse: null,
    idReceivingWarehouse: null,
    idCode: null,
    idSupplier: null,
    idBranch: null,
    valueDate: { startDate: null, endDate: null, },
    dataExport: [],
};
const WarehouseTransfer = (props) => {
    const dataLang = props.dataLang;

    const isShow = useToast();

    const router = useRouter();

    const { paginate } = usePagination();

    const dataSeting = useSetingServer();

    const statusExprired = useStatusExprired();

    const { handleTab: _HandleSelectTab } = useTab('all');

    const [checkedWare, sCheckedWare] = useState({});

    const [isState, sIsState] = useState(initialState);

    const { limit, updateLimit: sLimit } = useLimitAndTotalItems()

    const { isOpen, isKeyState, handleQueryId } = useToggle();

    const queryState = (key) => sIsState((prve) => ({ ...prve, ...key }));

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkExport } = useActionRole(auth, "warehouseTransfer");

    const params = {
        search: isState.keySearch,
        limit: limit,
        page: router.query?.page || 1,
        "filter[status_bar]": router.query?.tab ?? null,
        "filter[id]": isState.idCode != null ? isState.idCode?.value : null,
        "filter[branch_id]": isState.idBranch != null ? isState.idBranch.value : null,
        "filter[start_date]": isState.valueDate?.startDate != null ? isState.valueDate?.startDate : null,
        "filter[end_date]": isState.valueDate?.endDate != null ? isState.valueDate?.endDate : null,
        "filter[warehouses_id]": isState.idExportWarehouse != null ? isState.idExportWarehouse?.value : null,
        "filter[warehouses_to]": isState.idReceivingWarehouse != null ? isState.idReceivingWarehouse?.value : null,
    };

    const { data: dataBranch = [] } = useBranchList();

    const { data: dataWarehouse = [] } = useWarehouseByBranch()

    const { data, isFetching, refetch } = useWarehouseTransferList(params);

    const { data: dataCode = [] } = useWarehouseTransferCombobox(isState.keySearchCode);

    const { data: dataFilterbar, refetch: refetchFilterBar } = useWarehouseTransferFilterbar(params);

    const _HandleSeachApi = debounce(async (inputValue) => {
        queryState({ keySearchCode: inputValue });
    }, 500);

    const formatMoney = (number) => {
        return formatMoneyConfig(+number, dataSeting);
    };

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryState({ keySearch: value });
        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            },
        });
    }, 500);

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
            const { isSuccess, message, alert_type, dataExport } = await apiWarehouseTransfer.apiHandingStatusTransfer(data);

            if (isSuccess) {
                isShow(alert_type, dataLang[message] || message);
                await refetch()
                await refetchFilterBar()
                queryState({ onSending: false });
            } else {
                isShow("error", dataLang[message] || message);
            }

            if (dataExport?.length > 0) {
                queryState({ dataExport: dataExport });
            }
        } catch (error) { }
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
                    title: `${dataLang?.warehouseTransfer_transferWarehouse || "warehouseTransfer_transferWarehouse"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouseTransfer_receivingWarehouse || "warehouseTransfer_receivingWarehouse"
                        }`,
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
                    title: `${dataLang?.warehouses_localtion_status || "warehouses_localtion_status"}`,
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
            data: data?.rResult?.map((e) => [
                { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
                { value: `${e?.date ? e?.date : ""}` },
                { value: `${e?.code ? e?.code : ""}` },
                { value: `${"Số LSX chi tiết"}` },
                { value: `${e?.warehouses_id_name ? e?.warehouses_id_name : ""}` },
                { value: `${e?.warehouses_to_name ? e?.warehouses_to_name : ""}` },
                { value: `${e?.grand_total ? formatMoney(e?.grand_total) : ""}` },
                { value: `${e?.order_id != 0 ? "Đã giữ kho" : "Chưa giữ kho"}`, },
                { value: `${e?.note ? e?.note : ""}` },
                { value: `${e?.staff_create?.full_name ? e?.staff_create?.full_name : ""}`, },
                { value: `${e?.warehouseman_id === "0" ? "Chưa duyệt kho" : "Đã duyệt kho"}`, },
                { value: `${e?.branch_name_id ? e?.branch_name_id : ""}` },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.warehouseTransfer_title || "warehouseTransfer_title"}</title>
            </Head>
            <Container>
                {isState.dataExport?.length > 0 && (
                    <PopupStatus
                        type="warehouseTransfer"
                        className="hidden"
                        dataExport={isState.dataExport}
                        dataLang={dataLang}
                    />
                )}
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.warehouseTransfer_title || "warehouseTransfer_title"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.warehouseTransfer_list || "warehouseTransfer_list"}</h6>
                    </div>
                )}

                <ContainerBody>
                    <div className="space-y-0.5 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.warehouseTransfer_title || "warehouseTransfer_title"}
                            </h2>
                            <ButtonAddNew
                                onClick={() => {
                                    if (role) {
                                        router.push(routerWarehouseTransfer.form);
                                    } else if (checkAdd) {
                                        router.push(routerWarehouseTransfer.form);
                                    } else {
                                        isShow("warning", WARNING_STATUS_ROLE);
                                    }
                                }}
                                dataLang={dataLang}
                            />
                        </div>

                        <ContainerFilterTab>
                            {dataFilterbar && dataFilterbar?.map((e) => {
                                return (
                                    <TabFilter
                                        style={{ backgroundColor: "#e2f0fe" }}
                                        dataLang={dataLang}
                                        key={e?.id}
                                        onClick={_HandleSelectTab.bind(this, `${e?.id}`)}
                                        total={e?.count}
                                        active={e?.id}
                                    >
                                        {dataLang[e?.name] || e?.name}
                                    </TabFilter>
                                );
                            })}
                        </ContainerFilterTab>
                        <ContainerTable>
                            <div className="xl:space-y-3 space-y-2">
                                <div className="bg-slate-100 w-full rounded-t-lg items-center grid grid-cols-7 2xl:grid-cols-9 xl:col-span-8 lg:col-span-7 2xl:xl:p-2 xl:p-1.5 p-1.5">
                                    <div className="col-span-6 2xl:col-span-7 xl:col-span-5 lg:col-span-5">
                                        <div className="grid grid-cols-6 gap-2">
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
                                                        label: dataLang?.purchase_order_table_branch || "purchase_order_table_branch",
                                                        isDisabled: true,
                                                    },
                                                    ...dataBranch,
                                                ]}
                                                onChange={(e) => queryState({ idBranch: e })}
                                                value={isState.idBranch}
                                                placeholder={dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}
                                                isClearable={true}
                                                colSpan={1}
                                            />
                                            <SelectComponent
                                                colSpan={1}
                                                onInputChange={(event) => {
                                                    _HandleSeachApi(event);
                                                }}
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.purchase_order_table_code || "purchase_order_table_code",
                                                        isDisabled: true,
                                                    },
                                                    ...dataCode,
                                                ]}
                                                onChange={(e) => queryState({ idCode: e })}
                                                value={isState.idCode}
                                                placeholder={dataLang?.purchase_order_table_code || "purchase_order_table_code"}
                                                isClearable={true}
                                            />
                                            <SelectComponent
                                                colSpan={1}
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.warehouseTransfer_transferWarehouse || "warehouseTransfer_transferWarehouse",
                                                        isDisabled: true,
                                                    },
                                                    ...dataWarehouse,
                                                ]}
                                                onChange={(e) => queryState({ idExportWarehouse: e })}
                                                value={isState.idExportWarehouse}
                                                placeholder={dataLang?.warehouseTransfer_transferWarehouse || "warehouseTransfer_transferWarehouse"}
                                                isClearable={true}
                                            />
                                            <SelectComponent
                                                colSpan={1}
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.warehouseTransfer_receivingWarehouse || "warehouseTransfer_receivingWarehouse",
                                                        isDisabled: true,
                                                    },
                                                    ...dataWarehouse,
                                                ]}
                                                onChange={(e) => queryState({ idReceivingWarehouse: e })}
                                                value={isState.idReceivingWarehouse}
                                                placeholder={dataLang?.warehouseTransfer_receivingWarehouse || "warehouseTransfer_receivingWarehouse"}
                                                isClearable={true}
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
                                            <OnResetData sOnFetching={(e) => { }} onClick={refetch.bind(this)} />
                                            {role == true || checkExport ? (
                                                <div className={``}>
                                                    {data?.rResult?.length > 0 && (
                                                        <ExcelFileComponent
                                                            dataLang={dataLang}
                                                            filename={dataLang?.warehouseTransfer_list || "warehouseTransfer_list"}
                                                            title="DSCK"
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
                                    <HeaderTable gridCols={11} display={"grid"}>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.import_day_vouchers || "import_day_vouchers"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.import_code_vouchers || "import_code_vouchers"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.warehouseTransfer_transferWarehouse || "warehouseTransfer_transferWarehouse"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.warehouseTransfer_receivingWarehouse || "warehouseTransfer_receivingWarehouse"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.production_warehouse_Total_value || "production_warehouse_Total_value"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.warehouses_localtion_status || "warehouses_localtion_status"}
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
                                    {isFetching ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : data?.rResult.length > 0 ? (
                                        <>
                                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                                {data?.rResult.map((e) => (
                                                    <RowTable gridCols={11} key={e.id.toString()}>
                                                        <RowItemTable colSpan={1} textAlign={"center"}>
                                                            {e?.date != null ? formatMoment(e?.date, FORMAT_MOMENT.DATE_SLASH_LONG) : ""}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={"center"}>
                                                            <PopupDetail
                                                                dataLang={dataLang}
                                                                className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] px-2 text-[#0F4F9E] hover:text-[#5599EC] transition-all ease-linear cursor-pointer "
                                                                name={e?.code}
                                                                id={e?.id}
                                                            />
                                                        </RowItemTable>

                                                        <LinkWarehouse
                                                            colSpan={1}
                                                            warehouse_id={e?.warehouses_id}
                                                            warehouse_name={e?.warehouses_id_name}
                                                        />
                                                        <LinkWarehouse
                                                            colSpan={1}
                                                            warehouse_id={e?.warehouses_to}
                                                            warehouse_name={e?.warehouses_to_name}
                                                            color="text-green-600"
                                                        />

                                                        <RowItemTable colSpan={1} textAlign={"right"}>
                                                            {formatMoney(e?.grand_total)}
                                                        </RowItemTable>
                                                        <RowItemTable
                                                            colSpan={1}
                                                            className="mx-auto flex items-center justify-center"
                                                        >
                                                            {e?.order_id != 0 || e?.plan_id != 0 ? (
                                                                <TagColorOrange name={"Đã giữ kho"} />
                                                            ) : (
                                                                <TagColorSky name={"Chưa giữ kho"} />
                                                            )}
                                                        </RowItemTable>
                                                        <RowItemTable
                                                            colSpan={1}
                                                            textAlign={"left"}
                                                            className={"truncate"}
                                                        >
                                                            {e?.note}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className={"flex items-center gap-2"}>
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
                                                            <h6 className="capitalize">{e?.staff_create?.full_name}</h6>
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1}>
                                                            <ButtonWarehouse
                                                                warehouseman_id={e?.warehouseman_id}
                                                                _HandleChangeInput={_HandleChangeInput}
                                                                id={e?.id}
                                                            />
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className={"mx-auto"}>
                                                            <TagBranch className="w-fit">{e?.branch_name_id}</TagBranch>
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className="flex justify-center">
                                                            <BtnAction
                                                                onRefresh={refetch.bind(this)}
                                                                onRefreshGroup={refetchFilterBar.bind(this)}
                                                                dataLang={dataLang}
                                                                warehouseman_id={e?.warehouseman_id}
                                                                status_pay={e?.status_pay}
                                                                id={e?.id}
                                                                type="warehouseTransfer"
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
                    <ContainerTotal className="!grid-cols-11">
                        <ColumnTable colSpan={4} textAlign={"center"} className="p-2">
                            {dataLang?.import_total || "import_total"}
                        </ColumnTable>
                        <ColumnTable colSpan={1} textAlign={"right"} className={"text-right"}>
                            {formatMoney(data?.rTotal?.amount)}
                        </ColumnTable>
                    </ContainerTotal>
                    {data?.rResult.length != 0 && (
                        <ContainerPagination>
                            <TitlePagination dataLang={dataLang} totalItems={data?.output?.iTotalDisplayRecords} />
                            <Pagination
                                postsPerPage={limit}
                                totalPosts={Number(data?.output?.iTotalDisplayRecords)}
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
                nameModel={"warehouseTransfer"}
                title={TITLE_STATUS}
                subtitle={CONFIRMATION_OF_CHANGES}
                isOpen={isOpen}
                save={handleSaveStatus}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment>
    );
};

export default WarehouseTransfer;
