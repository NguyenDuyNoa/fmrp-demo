import { BtnAction } from "@/components/UI/BtnAction";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { ColumnTable, HeaderTable, RowItemTable } from "@/components/UI/common/Table";
import { Container, ContainerBody } from "@/components/UI/common/layout";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import Loading from "@/components/UI/loading/loading";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import { useBranchList } from "@/hooks/common/useBranch";
import { useVariantList } from "@/hooks/common/useItems";
import useFeature from "@/hooks/useConfigFeature";
import useSetingServer from "@/hooks/useConfigNumber";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import useActionRole from "@/hooks/useRole";
import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { PopupParent } from "@/utils/lib/Popup";
import { Grid6, Edit as IconEdit } from "iconsax-react";
import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ModalImage from "react-modal-image";
import { useSelector } from "react-redux";
import PopupWarehouse from "./components/popup";
import { useWarehouseDetail } from "./hooks/useWarehouseDetail";
import { useWarehouseList } from "./hooks/useWarehouseList";
import { useWarehouseLocation } from "./hooks/useWarehouseLocation";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { TagColorProduct } from "@/components/UI/common/Tag/TagStatus";

const initialState = {
    idWarehouse: "",
    limitItemWarehouseDetail: 10,
    keySearchItem: "",
    idBranch: null,
    idLocationWarehouse: null,
    idVariantMain: null,
    idVariantSub: null,
};

const Warehouse = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const isShow = useToast();

    const { paginate } = usePagination();

    const dataSeting = useSetingServer();

    const statusExprired = useStatusExprired();

    const [isState, setIsState] = useState(initialState);

    const { limit, updateLimit: sLimit } = useLimitAndTotalItems();

    const { dataMaterialExpiry, dataProductExpiry, dataProductSerial, } = useFeature();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkExport, checkEdit } = useActionRole(auth, "warehouse");

    const queryKeyIsState = (key) => setIsState((prev) => ({ ...prev, ...key }));

    const paramsWarehouse = {
        limit: undefined,
        page: router.query?.page || 1,
        "filter[branch_id]": isState?.idBranch?.length > 0 ? isState?.idBranch?.map((e) => e.value) : null,
    };

    const paramsDetail = {
        search: isState.keySearchItem,
        limit: isState.limitItemWarehouseDetail,
        page: router.query?.page || 1,
        "filter[location_id]": isState.idLocationWarehouse?.value ? isState.idLocationWarehouse?.value : null,
        "filter[variation_option_id_1]": isState.idVariantMain?.value ? isState.idVariantMain?.value : null,
        "filter[variation_option_id_2]": isState.idVariantSub?.value ? isState.idVariantSub?.value : null,
    };

    const { data: listBranch = [] } = useBranchList();

    const { data: listVariant = [] } = useVariantList();

    const { data: listLocationWarehouse = [] } = useWarehouseLocation(isState.idWarehouse);

    const { data: dataWarehouse, isFetching, refetch } = useWarehouseList(paramsWarehouse);

    const { data, refetch: refetchWarehouseDetail, isFetching: isFetchingWarehouseDetail } = useWarehouseDetail(isState?.idWarehouse, paramsDetail);

    useEffect(() => {
        if (dataWarehouse?.rResult?.length > 0) {
            queryKeyIsState({ idWarehouse: dataWarehouse?.rResult[0].id });
        }
    }, [dataWarehouse?.rResult])

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const onChangeFilter = (type, value) => {
        if (type == "branch") {
            queryKeyIsState({ idBranch: value });
        } else if (type == "location") {
            queryKeyIsState({ idLocationWarehouse: value });
        } else if (type == "MainVariation") {
            queryKeyIsState({
                idVariantMain: value,
            });
        } else if (type == "SubVariation") {
            queryKeyIsState({ idVariantSub: value });
        }
        router.push({
            pathname: router.route,
            query: { page: 1 },
        });
    };

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryKeyIsState({ keySearchItem: value });
        router.replace(router.route);
    }, 500);

    const newResult = data?.rResult?.map((item) => {
        const detail = item.detail || [];
        return detail.map((detailItem) => ({
            ...item,
            detail: detailItem,
        }))
    }).flat();

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
                    title: `${dataLang?.warehouses_detail_type || "warehouses_detail_type"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouses_detail_plu || "warehouses_detail_plu"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouses_detail_productname || "warehouses_detail_productname"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouses_detail_wareLoca || "warehouses_detail_wareLoca"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouses_detail_mainVar || "warehouses_detail_mainVar"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouses_detail_subVar || "warehouses_detail_subVar"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${"Serial"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${"Lot"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouses_detail_date || "warehouses_detail_date"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouses_detail_quantity || "warehouses_detail_quantity"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouses_detail_value || "warehouses_detail_value"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],
            data: newResult?.map((e) => [
                { value: `${e.item_id}`, style: { numFmt: "0" } },
                { value: `${e.item_type ? dataLang?.product : ""}` },
                { value: `${e.item_code ? e.item_code : ""}` },
                { value: `${e.item_name ? e.item_name : ""}` },
                {
                    value: `${e?.detail.location_name ? e?.detail.location_name : ""}`,
                },
                {
                    value: `${e?.detail.option_name_1 ? e?.detail.option_name_1 : ""}`,
                },
                {
                    value: `${e?.detail.option_name_2 ? e?.detail.option_name_2 : ""}`,
                },
                {
                    value: `${dataProductSerial?.is_enable === "1" ? e?.detail.serial != null ? e?.detail.serial : "" : ""}`,
                },
                {
                    value: `${dataMaterialExpiry?.is_enable === "1" ? e?.detail.lot != null ? e?.detail.lot : "" : ""}`,
                },
                {
                    value: `${dataMaterialExpiry?.is_enable === "1" ? e?.detail.expiration_date != null ? e?.detail.expiration_date : "" : ""}`,
                },
                {
                    value: `${e?.detail.quantity != null ? e?.detail.quantity : ""}`,
                },
                {
                    value: `${e?.detail.amount != null ? e?.detail.amount : ""}`,
                },
            ]),
        },
    ];

    const handleClickChooseWarehouse = (item) => {
        queryKeyIsState({ idWarehouse: item.id });
        router.push({
            pathname: router.route,
            query: { page: 1 },
        });
    };
    console.log("data?.rResult", data?.rResult);

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.Warehouse_title || "Warehouse_title"}</title>
            </Head>
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">{dataLang?.Warehouse_title || "Warehouse_title"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.Warehouse_title || "Warehouse_title"}</h6>
                    </div>
                )}

                <ContainerBody>
                    <div className="space-y-3 h-[96%] overflow-hidden">
                        <div className="flex justify-between mt-1 mr-2">
                            <h2 className=" 2xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.Warehouse_title || "Warehouse_title"}
                            </h2>
                            <div className="flex items-center justify-end gap-2">
                                {role == true || checkAdd ? (
                                    <PopupWarehouse
                                        W onRefresh={refetch.bind(this)}
                                        onRefreshGroup={refetchWarehouseDetail.bind(this)}
                                        dataLang={dataLang}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-[#003DA0] text-white rounded btn-animation hover:scale-105"
                                    />
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            isShow("warning", WARNING_STATUS_ROLE);
                                        }}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-[#003DA0] text-white rounded btn-animation hover:scale-105"
                                    >
                                        {dataLang?.branch_popup_create_new}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2 3xl:space-y-3">
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
                                                    label: dataLang?.price_quote_branch || "price_quote_branch",
                                                    isDisabled: true,
                                                },
                                                ...listBranch,
                                            ]}
                                            onChange={onChangeFilter.bind(this, "branch")}
                                            value={isState.idBranch}
                                            isMulti
                                            isClearable={true}
                                            placeholder={dataLang?.price_quote_branch || "price_quote_branch"}
                                            isSearchable={true}
                                            components={{ MultiValue }}
                                            colSpan={1}
                                        />
                                        {/* chọn vị trí kho */}
                                        <SelectComponent
                                            options={[
                                                {
                                                    value: "",
                                                    label: dataLang?.warehouses_detail_filterWare || "warehouses_detail_filterWare",
                                                    isDisabled: true,
                                                },
                                                ...listLocationWarehouse,
                                            ]}
                                            onChange={onChangeFilter.bind(this, "location")}
                                            value={isState.idLocationWarehouse}
                                            hideSelectedOptions={false}
                                            isClearable={true}
                                            placeholder={dataLang?.warehouses_detail_filterWare || "warehouses_detail_filterWare"}
                                            className="z-20 text-xs bg-white rounded-md 3xl:text-base xxl:text-sm"
                                            isSearchable={true}
                                            colSpan={1}
                                        />
                                        <SelectComponent
                                            options={[
                                                {
                                                    value: "",
                                                    label: dataLang?.warehouses_detail_filterMain || "warehouses_detail_filterMain",
                                                    isDisabled: true,
                                                },
                                                ...listVariant,
                                            ]}
                                            onChange={onChangeFilter.bind(this, "MainVariation")}
                                            value={isState.idVariantMain}
                                            hideSelectedOptions={false}
                                            isClearable={true}
                                            placeholder={dataLang?.warehouses_detail_filterMain || "warehouses_detail_filterMain"}
                                            className="z-20 text-xs bg-white rounded-md 3xl:text-base xxl:text-sm"
                                            isSearchable={true}
                                            colSpan={1}
                                            components={{ MultiValue }}
                                        />
                                        <SelectComponent
                                            options={[
                                                {
                                                    value: "",
                                                    label: dataLang?.warehouses_detail_filterSub || "warehouses_detail_filterSub",
                                                    isDisabled: true,
                                                },
                                                ...listVariant,
                                            ]}
                                            onChange={onChangeFilter.bind(this, "SubVariation")}
                                            value={isState.idVariantSub}
                                            hideSelectedOptions={false}
                                            isClearable={true}
                                            placeholder={dataLang?.warehouses_detail_filterSub || "warehouses_detail_filterSub"}
                                            className="z-20 text-xs bg-white rounded-md 3xl:text-base xxl:text-sm"
                                            isSearchable={true}
                                            noOptionsMessage={() => "Không có dữ liệu"}
                                            components={{ MultiValue }}
                                            colSpan={1}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-1 xl:col-span-2 lg:col-span-2">
                                    <div className="flex items-center justify-end gap-2 space-x-2">
                                        <OnResetData
                                            sOnFetching={() => { }}
                                            onClick={() => {
                                                refetch()
                                                refetchWarehouseDetail()
                                            }}
                                        />
                                        {role == true || checkExport ? (
                                            <div className={``}>
                                                {dataWarehouse?.rResult?.length > 0 && (
                                                    <ExcelFileComponent
                                                        dataLang={dataLang}
                                                        filename="Danh sách kho"
                                                        title="Dsk"
                                                        multiDataSet={multiDataSet}
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => isShow("warning", WARNING_STATUS_ROLE)}
                                                className={`xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}
                                            >
                                                <Grid6 className="scale-75 2xl:scale-100 xl:scale-100" size={18} />
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
                        <div className="grid grid-cols-10">
                            <Customscrollbar className="col-span-2 3xl:max-h-[620px] 3xl:h-[620px] 2xl:max-h-[440px] 2xl:h-[440px] max-h-[440px] h-[440px] rounded-xl w-full list-disc list-inside flex flex-col gap-2 bg-[#F7FAFE] 3xl:px-6 3xl:py-4 py-3 px-2 overflow-auto">
                                {dataWarehouse?.rResult && dataWarehouse?.rResult?.map((item, index) => (
                                    <PopupParent
                                        key={item.id}
                                        trigger={
                                            <div className="relative grid grid-cols-12">
                                                <li
                                                    className={` col-span-12 ${isState.idWarehouse === item.id
                                                        ? "bg-[#3276FA] text-white"
                                                        : ""
                                                        } font-medium capitalize flex gap-2 3xl:px-4 px-3 py-2  items-center justify-between w-full rounded-lg cursor-pointer hover:bg-[#3276FA] hover:text-white duration-200 ease-in-out transition`}
                                                    onClick={() => handleClickChooseWarehouse(item)}
                                                >
                                                    <div className="flex xl:w-[90%] xl:max-w-[90%] w-[85%] max-w-[85%] items-center gap-2">
                                                        <div className="w-[6px] h-[6px] rounded-full bg-[#6C9AC4]" />
                                                        <div className="flex flex-col items-start w-full">
                                                            <div className="w-[95%] max-w-[95%] 3xl:text-base xl:text-sm text-xs ">
                                                                {item.name}
                                                            </div>
                                                            {item.is_system == 1 && (
                                                                <div className="items-center rounded-full border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-[#F9ECC9]/35  bg-orange-100 text-[#FF9900] 3xl:text-sm text-xs font-medium cursor-default">
                                                                    Kho hệ thống
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="xl:w-[10%] xl:max-w-[10%] w-[15%] max-w-[15%] bg-[#E1ECFC]/80 p-1 3xl:text-base xl:text-xs text-xs text-center rounded-md text-black">
                                                        {item.totalItems}
                                                    </div>
                                                </li>
                                                {isState.idWarehouse === item.id && item.is_system == 0 && (
                                                    <div className="absolute right-0 -top-1">
                                                        <span className="relative flex w-3 h-3">
                                                            <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-sky-400"></span>
                                                            <span className="relative inline-flex w-3 h-3 rounded-full bg-sky-500"></span>
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        }
                                        closeOnDocumentClick={false}
                                        position="right top"
                                        // keepTooltipInside
                                        on={['click']}
                                        arrow={false}
                                    // mouseLeaveDelay={5000}
                                    >
                                        {isState.idWarehouse === item.id && item.is_system == 0 && (
                                            <div className="flex items-center gap-2 px-4 py-2 ml-2 bg-gray-200 rounded-md 3xl:py-3">
                                                {role == true || checkEdit ? (
                                                    <PopupWarehouse
                                                        dataLang={dataLang}
                                                        id={item?.id}
                                                        name={item?.name}
                                                        code={item?.code}
                                                        address={item?.address}
                                                        note={item?.note}
                                                        branch={item?.branch}
                                                        onRefresh={refetch.bind(this)}
                                                    />
                                                ) : (
                                                    <IconEdit
                                                        className="cursor-pointer"
                                                        onClick={() => isShow("warning", WARNING_STATUS_ROLE)}
                                                    />
                                                )}
                                                <BtnAction
                                                    onRefresh={refetch.bind(this)}
                                                    onRefreshGroup={refetchWarehouseDetail.bind(this)}
                                                    dataLang={dataLang}
                                                    id={item?.id}
                                                    type="warehouse"
                                                />
                                            </div>
                                        )}
                                    </PopupParent>
                                ))}
                            </Customscrollbar>
                            <Customscrollbar className="col-span-8 3xl:max-h-[620px] 3xl:h-[620px] 2xl:max-h-[440px] 2xl:h-[440px] max-h-[440px] h-[440px] overflow-auto pb-2">
                                <div className={`2xl:w-[100%] pr-2`}>
                                    {/* header table */}
                                    <HeaderTable
                                        gridCols={
                                            dataProductSerial?.is_enable == "1" ? dataMaterialExpiry?.is_enable != dataProductExpiry?.is_enable ? 10
                                                : dataMaterialExpiry?.is_enable == "1" ? 10 : 8
                                                : dataMaterialExpiry?.is_enable != dataProductExpiry?.is_enable ? 9 : dataMaterialExpiry?.is_enable == "1" ? 9 : 7
                                        }
                                    >
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.warehouses_detail_product || "warehouses_detail_product"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.warehouses_detail_wareLoca || "warehouses_detail_wareLoca"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.warehouses_detail_mainVar || "warehouses_detail_mainVar"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.warehouses_detail_subVar || "warehouses_detail_subVar"}
                                        </ColumnTable>
                                        {dataProductSerial?.is_enable === "1" && (
                                            <ColumnTable colSpan={1} textAlign={"center"}>
                                                {"Serial"}
                                            </ColumnTable>
                                        )}
                                        {dataMaterialExpiry?.is_enable === "1" || dataProductExpiry?.is_enable === "1" ? (
                                            <>
                                                <ColumnTable colSpan={1} textAlign={"center"}>
                                                    {"Lot"}
                                                </ColumnTable>
                                                <ColumnTable colSpan={1} textAlign={"center"}>
                                                    {dataLang?.warehouses_detail_date || "warehouses_detail_date"}
                                                </ColumnTable>
                                            </>
                                        ) : (
                                            ""
                                        )}
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.warehouses_detail_quantity || "warehouses_detail_quantity"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.warehouses_detail_value || "warehouses_detail_value"}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {/* data table */}
                                    {(isFetching || isFetchingWarehouseDetail) ? (
                                        <Loading
                                            className="3xl:max-h-[560px] 3xl:h-[560px] 2xl:max-h-[400px] 2xl:h-[400px] max-h-[400px] h-[400px]"
                                            color="#0f4f9e"
                                        />
                                    ) : data?.rResult && data?.rResult?.length > 0 ? (
                                        <div className=" min:h-[400px] h-[100%] w-full max:h-[600px]  ">
                                            {data?.rResult &&
                                                data?.rResult?.map((e) => (
                                                    <div
                                                        className={`${dataProductSerial?.is_enable == "1" ? dataMaterialExpiry?.is_enable != dataProductExpiry?.is_enable ? "grid-cols-10"
                                                            : dataMaterialExpiry?.is_enable == "1" ? "grid-cols-10" : "grid-cols-8"
                                                            : dataMaterialExpiry?.is_enable != dataProductExpiry?.is_enable ? "grid-cols-9" : dataMaterialExpiry?.is_enable == "1" ? "grid-cols-9" : "grid-cols-7"
                                                            }  grid hover:bg-slate-50 px-2`}
                                                    >
                                                        <RowItemTable
                                                            colSpan={2}
                                                            className={`flex justify-center items-center border-b py-2`}
                                                        >
                                                            <h6 className="w-full text-xs xl:text-base ">
                                                                {e?.image == null ? (
                                                                    <div className="flex w-full gap-2 px-2 3xl:gap-3">
                                                                        <div className="3xl:w-[25%] 3xl:max-w-[25%] xl:w-[35%] xl:max-w-[35%] w-[30%] max-w-[30%] flex items-center">
                                                                            <ModalImage
                                                                                small="/icon/noimagelogo.png"
                                                                                large="/icon/noimagelogo.png"
                                                                                className="xxl:w-[70px] xxl:min-w-[70px] xxl:h-[70px] xl:w-[50px] xl:min-w-[50px] xl:h-[50px] w-[40px] min-w-[40px] h-[40px] rounded object-contain"
                                                                            />
                                                                        </div>
                                                                        <div className="3xl:w-[75%] 3xl:max-w-[75%] xl:w-[65%] xl:max-w-[65%] w-[70%] max-w-[70%] flex flex-col 3xl:gap-2 gap-1">
                                                                            <h6 className="w-full text-xs font-semibold text-left 3xl:text-base xl:text-sm lg:text-xs text-zinc-600">
                                                                                {e.item_name == null
                                                                                    ? "-"
                                                                                    : e.item_name}
                                                                            </h6>

                                                                            <h6 className="w-full text-xs font-medium text-left 3xl:text-sm xl:text-xs lg:text-xs text-zinc-500">
                                                                                {e.item_code == null
                                                                                    ? "-"
                                                                                    : e.item_code}
                                                                            </h6>

                                                                            <h6 className="text-left w-fit ">
                                                                                {/* <span
                                                                                    className={`${e.item_type == "product"
                                                                                        ? "text-lime-500  border-lime-500 "
                                                                                        : " text-orange-500 border-orange-500"
                                                                                        } border rounded 3xl:py-1 3xl:px-1.5 py-0.5 px-1 w-fit 3xl:text-xs xl:text-[11px] text-[9px]`}
                                                                                >
                                                                                    {e.item_type
                                                                                        ? dataLang[e?.item_type]
                                                                                        : ""}
                                                                                </span> */}
                                                                                <TagColorProduct
                                                                                    dataKey={e?.item_type === "product" ? 0 : 1}
                                                                                    dataLang={dataLang}
                                                                                    name={e?.item_type}
                                                                                />

                                                                            </h6>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex w-full gap-2 px-2 3xl:gap-3">
                                                                        <div className="3xl:w-[25%] 3xl:max-w-[25%] xl:w-[35%] xl:max-w-[35%] w-[30%] max-w-[30%] flex items-center">
                                                                            <ModalImage
                                                                                small={e?.image}
                                                                                large={e?.image}
                                                                                className="xxl:w-[70px] xxl:min-w-[70px] xxl:h-[70px] xl:w-[50px] xl:min-w-[50px] xl:h-[50px] w-[40px] min-w-[40px] h-[40px] rounded-lg object-cover"
                                                                            />
                                                                        </div>
                                                                        <div className="3xl:w-[75%] 3xl:max-w-[75%] xl:w-[65%] xl:max-w-[65%] w-[70%] max-w-[70%] flex flex-col 3xl:gap-2 gap-1">
                                                                            <h6 className="w-full text-xs font-semibold text-left 3xl:text-base xl:text-sm lg:text-xs text-zinc-600 ">
                                                                                {e.item_name == null
                                                                                    ? "-"
                                                                                    : e.item_name}
                                                                            </h6>

                                                                            <h6 className="w-full text-xs font-medium text-left 3xl:text-sm xl:text-xs lg:text-xs text-zinc-500">
                                                                                {e.item_code == null
                                                                                    ? "-"
                                                                                    : e.item_code}
                                                                            </h6>

                                                                            <h6 className="text-left w-fit ">
                                                                                {/* <span
                                                                                    className={`${e.item_type == "product"
                                                                                        ? "text-lime-500  border-lime-500"
                                                                                        : " text-orange-500 border-orange-500"
                                                                                        } border rounded 3xl:py-1 3xl:px-1.5 py-0.5 px-1 w-fit 3xl:text-xs xl:text-[11px] text-[9px]`}
                                                                                >
                                                                                    {e.item_type
                                                                                        ? dataLang[e?.item_type]
                                                                                        : ""}
                                                                                </span> */}
                                                                                <TagColorProduct
                                                                                    dataKey={e?.item_type === "product" ? 0 : 1}
                                                                                    dataLang={dataLang}
                                                                                    name={e?.item_type}
                                                                                />
                                                                            </h6>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </h6>
                                                        </RowItemTable>

                                                        <div
                                                            className={` grid ${dataProductSerial?.is_enable == "1"
                                                                ? dataMaterialExpiry?.is_enable !=
                                                                    dataProductExpiry?.is_enable
                                                                    ? "col-span-8"
                                                                    : dataMaterialExpiry?.is_enable == "1"
                                                                        ? "col-span-8"
                                                                        : "col-span-6"
                                                                : dataMaterialExpiry?.is_enable !=
                                                                    dataProductExpiry?.is_enable
                                                                    ? "col-span-7"
                                                                    : dataMaterialExpiry?.is_enable == "1"
                                                                        ? "col-span-7"
                                                                        : "col-span-5"
                                                                }`}
                                                        >
                                                            {e?.detail.map((item) => (
                                                                <div
                                                                    className={`grid ${dataProductSerial?.is_enable == "1"
                                                                        ? dataMaterialExpiry?.is_enable !=
                                                                            dataProductExpiry?.is_enable
                                                                            ? "grid-cols-8"
                                                                            : dataMaterialExpiry
                                                                                .is_enable == "1"
                                                                                ? "grid-cols-8"
                                                                                : "grid-cols-6"
                                                                        : dataMaterialExpiry?.is_enable !=
                                                                            dataProductExpiry?.is_enable
                                                                            ? "grid-cols-7"
                                                                            : dataMaterialExpiry?.is_enable ==
                                                                                "1"
                                                                                ? "grid-cols-7"
                                                                                : " grid-cols-5"
                                                                        }`}
                                                                >
                                                                    <RowItemTable textSize={'text-[12px]'} colSpan={1} className="py-3 border-b !font-normal">
                                                                        {item.location_name == null ? "-" : item.location_name}
                                                                    </RowItemTable>
                                                                    <RowItemTable
                                                                        colSpan={1}
                                                                        textSize={'text-[13px]'}
                                                                        className="py-3 border-b !font-normal"
                                                                        textAlign={"center"}
                                                                    >
                                                                        {item.option_name_1 == null ? "-" : item.option_name_1}
                                                                    </RowItemTable>
                                                                    <RowItemTable
                                                                        colSpan={1}
                                                                        textSize={'text-[13px]'}
                                                                        className="py-3 border-b !font-normal"
                                                                        textAlign={"center"}
                                                                    >
                                                                        {item.option_name_2 == null ? "-" : item.option_name_2}
                                                                    </RowItemTable>
                                                                    {dataProductSerial?.is_enable === "1" ? (
                                                                        <RowItemTable
                                                                            colSpan={1}
                                                                            textSize={'text-[13px]'}
                                                                            className="py-3 border-b !font-normal"
                                                                            textAlign={"center"}
                                                                        >
                                                                            {item.serial == null || item.serial == "" ? "-" : item.serial}
                                                                        </RowItemTable>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                    {dataMaterialExpiry?.is_enable === "1" || dataProductExpiry?.is_enable === "1" ? (
                                                                        <>
                                                                            <RowItemTable
                                                                                colSpan={1}
                                                                                textSize={'text-[13px]'}
                                                                                className="py-3 border-b !font-normal"
                                                                                textAlign={"center"}
                                                                            >
                                                                                {item.lot == null || item.lot == "" ? "-" : item.lot}
                                                                            </RowItemTable>
                                                                            <RowItemTable
                                                                                colSpan={1}
                                                                                textSize={'text-[13px]'}
                                                                                className="py-3 border-b !font-normal"
                                                                                textAlign={"center"}
                                                                            >
                                                                                {item.expiration_date ? formatMoment(item.expiration_date, FORMAT_MOMENT.DATE_SLASH_LONG) : "-"}
                                                                            </RowItemTable>
                                                                        </>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                    <RowItemTable
                                                                        textAlign={"center"}
                                                                        colSpan={1}
                                                                        textSize={'text-[13px]'}
                                                                        className="py-3 font-semibold border-b"
                                                                    >
                                                                        {
                                                                            item?.quantity
                                                                                ?
                                                                                <>
                                                                                    <span className="">{formatNumber(+item?.quantity)}</span>/
                                                                                    <span className="relative pt-1 pl-0.5 text-xs capitalize top-1">{e?.unit}</span>
                                                                                </>
                                                                                :
                                                                                "-"
                                                                        }

                                                                    </RowItemTable>
                                                                    <RowItemTable
                                                                        textAlign={"right"}
                                                                        colSpan={1}
                                                                        textSize={'text-[13px]'}
                                                                        className="py-3 border-b !font-normal"
                                                                    >
                                                                        {item.amount ? formatNumber(+item?.amount) : "-"}
                                                                    </RowItemTable>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <NoData />
                                    )}
                                </div>
                            </Customscrollbar>
                        </div>
                    </div>
                    {dataWarehouse?.rResult?.length != 0 && (
                        <ContainerPagination className={"justify-end"}>
                            <TitlePagination
                                dataLang={dataLang}
                                totalItems={data?.output?.iTotalDisplayRecords}
                            />
                            <Pagination
                                postsPerPage={isState.limitItemWarehouseDetail}
                                totalPosts={Number(data?.output?.iTotalDisplayRecords)}
                                paginate={paginate}
                                currentPage={router.query?.page || 1}
                                className="text-sm 3xl:text-base"
                            />
                        </ContainerPagination>
                    )}
                </ContainerBody>
            </Container>
        </React.Fragment>
    );
};

export default Warehouse;
