import apiComons from "@/Api/apiComon/apiComon";
import apiWarehouse from "@/Api/apiManufacture/warehouse/apiWarehouse/apiWarehouse";
import apiVariant from "@/Api/apiSettings/apiVariant";
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
import Loading from "@/components/UI/loading";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import { reTryQuery } from "@/configs/configRetryQuery";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
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
import { useQuery } from "@tanstack/react-query";
import { Grid6, Edit as IconEdit } from "iconsax-react";
import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ModalImage from "react-modal-image";
import { useSelector } from "react-redux";
import PopupWarehouse from "./components/popup";

const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const isShow = useToast();

    const { paginate } = usePagination();

    const dataSeting = useSetingServer();

    const statusExprired = useStatusExprired();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkExport, checkEdit } = useActionRole(auth, "warehouse");

    const { dataMaterialExpiry, dataProductExpiry, dataProductSerial, } = useFeature();

    const [data_ex, sData_ex] = useState([]);

    const initialState = {
        idWarehouse: "",
        dataWarehouse: [],
        dataWarehouseDetail: [],
        limitItemWarehouseDetail: 10,
        totalItemWarehouseDetail: [],
        dataWarehouseExcel: [],
        keySearchItem: "",
        listBranchWarehouse: [],
        idBranch: null,
        listLocationWarehouse: [],
        idLocationWarehouse: null,
        listVariant: [],
        idVariantMain: null,
        idVariantSub: null,
        isLoading: false,
    };

    const [isState, setIsState] = useState(initialState);

    const queryKeyIsState = (key) => setIsState((prev) => ({ ...prev, ...key }));

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems();

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const convertArray = (arr) => {
        return arr?.map((e) => ({ label: e?.name, value: e?.id })) || []
    }

    const { refetch: refetchBranchWarehouse } = useQuery({
        queryKey: ["api_list_branch_warehouse"],
        queryFn: async () => {
            const { result } = await apiComons.apiBranchCombobox();

            queryKeyIsState({ listBranchWarehouse: convertArray(result) });

            return result
        },
        enabled: false,
        ...reTryQuery
    });


    const { refetch: refetchFilterLocationWarehouse } = useQuery({
        queryKey: ["api_list_location_warehouse", isState.idWarehouse],
        queryFn: async () => {
            const { rResult } = await apiWarehouse.apiLocationWarehouse(isState.idWarehouse);

            queryKeyIsState({ listLocationWarehouse: convertArray(rResult) });

            return rResult
        },
        enabled: !!isState.idWarehouse,
        ...reTryQuery
    });


    const { refetch: refetchFilterVariationWarehouse } = useQuery({
        queryKey: ["api_listVariant_warehouse"],
        queryFn: async () => {
            const { rResult } = await apiVariant.apiListVariant({});

            const options = rResult?.flatMap(({ option }) => option) ?? [];

            queryKeyIsState({ listVariant: convertArray(options) });

            return rResult
        },
        enabled: false,
        ...reTryQuery
    });


    const handleOpenSelect = (type) => {
        if (type === "branch" && isState?.listBranchWarehouse?.length === 0) {
            refetchBranchWarehouse();
        } else if (type === "locationWarehouse" && isState?.listLocationWarehouse?.length === 0 && isState.idWarehouse) {
            // fetch list vị trí kho theo từng kho
            refetchFilterLocationWarehouse();
        } else if (type === "mainVariation" && isState?.listVariant?.length === 0) {
            refetchFilterVariationWarehouse();
        } else if (type === "subVariation") {
        }
    };

    // fetch danh sách kho

    const param = {
        limit: undefined,
        page: router.query?.page || 1,
        "filter[branch_id]": isState?.idBranch?.length > 0 ? isState?.idBranch.map((e) => e.value) : null,
    };

    const { isFetching, refetch } = useQuery({
        queryKey: ["api_data_warehouse", param, isState.idBranch],
        queryFn: async () => {
            const { rResult, output } = await apiWarehouse.apiListWarehouse({ param: param });

            if (rResult?.length > 0) {
                queryKeyIsState({ idWarehouse: rResult[0].id });
            } else {
                queryKeyIsState({ idWarehouse: null, dataWarehouseDetail: [] });
            }

            queryKeyIsState({ dataWarehouse: rResult });

            sTotalItems(output);

            sData_ex(rResult);

            return rResult
        },
        ...reTryQuery
    })

    // fetch data chi tiết của kho
    const params = {
        search: isState.keySearchItem,
        limit: isState.limitItemWarehouseDetail,
        page: router.query?.page || 1,
        "filter[location_id]": isState.idLocationWarehouse?.value ? isState.idLocationWarehouse?.value : null,
        "filter[variation_option_id_1]": isState.idVariantMain?.value ? isState.idVariantMain?.value : null,
        "filter[variation_option_id_2]": isState.idVariantSub?.value ? isState.idVariantSub?.value : null,
    };

    const { refetch: refetchWarehouseDetail, isFetching: isFetchingWarehouseDetail } = useQuery({
        queryKey: ["api_data_warehouse_detail", params, isState.idWarehouse],
        queryFn: async () => {
            const { rResult, output } = await apiWarehouse.apiWarehouseDetail(isState.idWarehouse, { params: params });
            queryKeyIsState({
                dataWarehouseDetail: rResult,
                dataWarehouseExcel: rResult,
                totalItemWarehouseDetail: output,
            });
            return rResult
        },
        enabled: !!isState.idWarehouse,
        ...reTryQuery
    })


    const onChangeFilter = (type, value) => {
        if (type == "branch") {
            // fetch list chi nhánh kho
            queryKeyIsState({
                idBranch: value,
            });
        } else if (type == "location") {
            queryKeyIsState({
                idLocationWarehouse: value,
            });
        } else if (type == "MainVariation") {
            queryKeyIsState({
                idVariantMain: value,
            });
        } else if (type == "SubVariation") {
            queryKeyIsState({
                idVariantSub: value,
            });
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

    //excel
    // const multiDataSet = [
    //     {
    //         columns: [
    //             {
    //                 title: "ID",
    //                 width: { wch: 4 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.Warehouse_code || "Warehouse_code"}`,
    //                 width: { wpx: 100 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.Warehouse_poppup_name || "Warehouse_poppup_name"}`,
    //                 width: { wpx: 100 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.Warehouse_total || "Warehouse_total"}`,
    //                 width: { wch: 40 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.Warehouse_inventory || "Warehouse_inventory"}`,
    //                 width: { wch: 40 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.Warehouse_poppup_address || "Warehouse_poppup_address"}`,
    //                 width: { wch: 40 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.client_popup_note || "client_popup_note"}`,
    //                 width: { wch: 40 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.Warehouse_factory || "Warehouse_factory"}`,
    //                 width: { wch: 40 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //         ],
    //         data: data_ex?.map((e) => [
    //             { value: `${e.id}`, style: { numFmt: "0" } },
    //             { value: `${e.code ? e.code : ""}` },
    //             { value: `${e.name ? e.name : ""}` },
    //             { value: `${"Tổng mặt hàng "}` },
    //             { value: `${"Tổng tồn kho"}` },
    //             { value: `${e.address ? e.address : ""}` },
    //             { value: `${e.note ? e.note : ""}` },
    //             { value: `${e.branch ? e.branch?.map((i) => i.name) : ""}` },
    //         ]),
    //     },
    // ];
    const newResult = isState.dataWarehouseExcel?.map((item) => {
        const detail = item.detail || [];
        return detail.map((detailItem) => ({
            ...item,
            detail: detailItem,
        }));
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
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.Warehouse_title || "Warehouse_title"}
                            </h2>
                            <div className="flex justify-end items-center gap-2">
                                {role == true || checkAdd ? (
                                    <PopupWarehouse
                                        W onRefresh={refetch.bind(this)}
                                        onRefreshGroup={refetchWarehouseDetail.bind(this)}
                                        dataLang={dataLang}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    />
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            isShow("warning", WARNING_STATUS_ROLE);
                                        }}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    >
                                        {dataLang?.branch_popup_create_new}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="3xl:space-y-3 space-y-2">
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
                                                ...isState.listBranchWarehouse,
                                            ]}
                                            onMenuOpen={() => handleOpenSelect("branch")}
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
                                                ...isState.listLocationWarehouse,
                                            ]}
                                            onMenuOpen={() => handleOpenSelect("locationWarehouse")}
                                            onChange={onChangeFilter.bind(this, "location")}
                                            value={isState.idLocationWarehouse}
                                            hideSelectedOptions={false}
                                            isClearable={true}
                                            placeholder={dataLang?.warehouses_detail_filterWare || "warehouses_detail_filterWare"}
                                            className="rounded-md bg-white 3xl:text-base xxl:text-sm text-xs z-20"
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
                                                ...isState.listVariant,
                                            ]}
                                            onMenuOpen={() => handleOpenSelect("mainVariation")}
                                            onChange={onChangeFilter.bind(this, "MainVariation")}
                                            value={isState.idVariantMain}
                                            hideSelectedOptions={false}
                                            isClearable={true}
                                            placeholder={dataLang?.warehouses_detail_filterMain || "warehouses_detail_filterMain"}
                                            className="rounded-md bg-white 3xl:text-base xxl:text-sm text-xs z-20"
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
                                                ...isState.listVariant,
                                            ]}
                                            onMenuOpen={() => handleOpenSelect("subVariation")}
                                            onChange={onChangeFilter.bind(this, "SubVariation")}
                                            value={isState.idVariantSub}
                                            hideSelectedOptions={false}
                                            isClearable={true}
                                            placeholder={dataLang?.warehouses_detail_filterSub || "warehouses_detail_filterSub"}
                                            className="rounded-md bg-white 3xl:text-base xxl:text-sm text-xs z-20"
                                            isSearchable={true}
                                            noOptionsMessage={() => "Không có dữ liệu"}
                                            components={{ MultiValue }}
                                            colSpan={1}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-1 xl:col-span-2 lg:col-span-2">
                                    <div className="flex justify-end gap-2 space-x-2 items-center">
                                        <OnResetData
                                            sOnFetching={() => { }}
                                            onClick={() => {
                                                refetch()
                                                refetchWarehouseDetail()
                                            }}
                                        />
                                        {role == true || checkExport ? (
                                            <div className={``}>
                                                {data_ex?.length > 0 && (
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
                        <div className="grid grid-cols-10">
                            <ul className="col-span-2 3xl:max-h-[620px] 3xl:h-[620px] 2xl:max-h-[440px] 2xl:h-[440px] max-h-[440px] h-[440px] rounded-xl w-full list-disc list-inside flex flex-col gap-2 bg-[#F7FAFE] 3xl:px-6 3xl:py-4 py-3 px-2 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                {isState.dataWarehouse &&
                                    isState.dataWarehouse.map((item, index) => (
                                        <PopupParent
                                            trigger={
                                                <div key={item.id} className="grid grid-cols-12 relative">
                                                    <li
                                                        className={`group col-span-12 ${isState.idWarehouse === item.id
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
                                                                    {/* {item.is_system == 1 && <span className={`${isState.idWarehouse === item.id ? "text-white" : "text-[#6C9AC4] group-hover:text-white"} lowercase`}>(Kho hệ thống)</span>} */}
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
                                                            <span className="relative flex h-3 w-3">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                            closeOnDocumentClick={false}
                                            position="right top"
                                            on={["hover"]}
                                            arrow={false}
                                        >
                                            {isState.idWarehouse === item.id && item.is_system == 0 && (
                                                <div className="ml-2 flex items-center gap-2  rounded-md bg-gray-200 3xl:py-3 py-2 px-4">
                                                    {role == true || checkEdit ? (
                                                        <PopupWarehouse
                                                            W dataLang={dataLang}
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
                            </ul>
                            <div className="col-span-8 3xl:max-h-[620px] 3xl:h-[620px] 2xl:max-h-[440px] 2xl:h-[440px] max-h-[440px] h-[440px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
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
                                    ) : isState?.dataWarehouseDetail && isState?.dataWarehouseDetail?.length > 0 ? (
                                        <div className=" min:h-[400px] h-[100%] w-full max:h-[600px]  ">
                                            {isState?.dataWarehouseDetail &&
                                                isState?.dataWarehouseDetail?.map((e) => (
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
                                                            <h6 className="xl:text-base text-xs w-full  ">
                                                                {e?.image == null ? (
                                                                    <div className="flex 3xl:gap-3 gap-2 px-2 w-full">
                                                                        <div className="3xl:w-[25%] 3xl:max-w-[25%] xl:w-[35%] xl:max-w-[35%] w-[30%] max-w-[30%] flex items-center">
                                                                            <ModalImage
                                                                                small="/no_image.png"
                                                                                large="/no_image.png"
                                                                                className="xxl:w-[70px] xxl:min-w-[70px] xxl:h-[70px] xl:w-[50px] xl:min-w-[50px] xl:h-[50px] w-[40px] min-w-[40px] h-[40px] rounded object-contain"
                                                                            />
                                                                        </div>
                                                                        <div className="3xl:w-[75%] 3xl:max-w-[75%] xl:w-[65%] xl:max-w-[65%] w-[70%] max-w-[70%] flex flex-col 3xl:gap-2 gap-1">
                                                                            <h6 className="3xl:text-base xl:text-sm lg:text-xs text-xs font-semibold text-zinc-600 w-full text-left">
                                                                                {e.item_name == null
                                                                                    ? "-"
                                                                                    : e.item_name}
                                                                            </h6>

                                                                            <h6 className="3xl:text-sm xl:text-xs lg:text-xs text-xs font-medium text-zinc-500 w-full text-left">
                                                                                {e.item_code == null
                                                                                    ? "-"
                                                                                    : e.item_code}
                                                                            </h6>

                                                                            <h6 className="w-fit text-left ">
                                                                                <span
                                                                                    className={`${e.item_type == "product"
                                                                                        ? "text-lime-500  border-lime-500 "
                                                                                        : " text-orange-500 border-orange-500"
                                                                                        } border rounded 3xl:py-1 3xl:px-1.5 py-0.5 px-1 w-fit 3xl:text-xs xl:text-[11px] text-[9px]`}
                                                                                >
                                                                                    {e.item_type
                                                                                        ? dataLang[e?.item_type]
                                                                                        : ""}
                                                                                </span>
                                                                            </h6>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex 3xl:gap-3 gap-2 px-2 w-full">
                                                                        <div className="3xl:w-[25%] 3xl:max-w-[25%] xl:w-[35%] xl:max-w-[35%] w-[30%] max-w-[30%] flex items-center">
                                                                            <ModalImage
                                                                                small={e?.image}
                                                                                large={e?.image}
                                                                                className="xxl:w-[70px] xxl:min-w-[70px] xxl:h-[70px] xl:w-[50px] xl:min-w-[50px] xl:h-[50px] w-[40px] min-w-[40px] h-[40px] rounded-lg object-cover"
                                                                            />
                                                                        </div>
                                                                        <div className="3xl:w-[75%] 3xl:max-w-[75%] xl:w-[65%] xl:max-w-[65%] w-[70%] max-w-[70%] flex flex-col 3xl:gap-2 gap-1">
                                                                            <h6 className="3xl:text-base xl:text-sm lg:text-xs text-xs font-semibold text-zinc-600 w-full text-left ">
                                                                                {e.item_name == null
                                                                                    ? "-"
                                                                                    : e.item_name}
                                                                            </h6>

                                                                            <h6 className="3xl:text-sm xl:text-xs lg:text-xs text-xs font-medium text-zinc-500 w-full text-left">
                                                                                {e.item_code == null
                                                                                    ? "-"
                                                                                    : e.item_code}
                                                                            </h6>

                                                                            <h6 className="w-fit text-left ">
                                                                                <span
                                                                                    className={`${e.item_type == "product"
                                                                                        ? "text-lime-500  border-lime-500"
                                                                                        : " text-orange-500 border-orange-500"
                                                                                        } border rounded 3xl:py-1 3xl:px-1.5 py-0.5 px-1 w-fit 3xl:text-xs xl:text-[11px] text-[9px]`}
                                                                                >
                                                                                    {e.item_type
                                                                                        ? dataLang[e?.item_type]
                                                                                        : ""}
                                                                                </span>
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
                                                                            : isState.dataMaterialExpiry
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
                                                                    <RowItemTable colSpan={1} className="border-b py-3">
                                                                        {item.location_name == null
                                                                            ? "-"
                                                                            : item.location_name}
                                                                    </RowItemTable>
                                                                    <RowItemTable
                                                                        colSpan={1}
                                                                        className="border-b py-3"
                                                                        textAlign={"center"}
                                                                    >
                                                                        {item.option_name_1 == null
                                                                            ? "-"
                                                                            : item.option_name_1}
                                                                    </RowItemTable>
                                                                    <RowItemTable
                                                                        colSpan={1}
                                                                        className="border-b py-3"
                                                                        textAlign={"center"}
                                                                    >
                                                                        {item.option_name_2 == null
                                                                            ? "-"
                                                                            : item.option_name_2}
                                                                    </RowItemTable>
                                                                    {dataProductSerial?.is_enable === "1" ? (
                                                                        <RowItemTable
                                                                            colSpan={1}
                                                                            className="border-b py-3"
                                                                            textAlign={"center"}
                                                                        >
                                                                            {item.serial == null || item.serial == ""
                                                                                ? "-"
                                                                                : item.serial}
                                                                        </RowItemTable>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                    {dataMaterialExpiry?.is_enable === "1" ||
                                                                        dataProductExpiry?.is_enable === "1" ? (
                                                                        <>
                                                                            <RowItemTable
                                                                                colSpan={1}
                                                                                className="border-b py-3"
                                                                                textAlign={"center"}
                                                                            >
                                                                                {item.lot == null || item.lot == ""
                                                                                    ? "-"
                                                                                    : item.lot}
                                                                            </RowItemTable>
                                                                            <RowItemTable
                                                                                colSpan={1}
                                                                                className="border-b py-3"
                                                                                textAlign={"center"}
                                                                            >
                                                                                {item.expiration_date
                                                                                    ? formatMoment(item.expiration_date, FORMAT_MOMENT.DATE_SLASH_LONG)
                                                                                    : "-"}
                                                                            </RowItemTable>
                                                                        </>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                    <RowItemTable
                                                                        textAlign={"right"}
                                                                        colSpan={1}
                                                                        className="border-b py-3 "
                                                                    >
                                                                        {item.quantity
                                                                            ? formatNumber(+item?.quantity)
                                                                            : "-"}
                                                                    </RowItemTable>
                                                                    <RowItemTable
                                                                        textAlign={"right"}
                                                                        colSpan={1}
                                                                        className="border-b py-3"
                                                                    >
                                                                        {item.amount
                                                                            ? formatNumber(+item?.amount)
                                                                            : "-"}
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
                            </div>
                        </div>
                    </div>
                    {isState?.dataWarehouse?.length != 0 && (
                        <ContainerPagination className={"justify-end"}>
                            {/* <h6 className='3xl:text-base text-sm'>
                                {dataLang?.display} {isState?.totalItemWarehouseDetail?.iTotalDisplayRecords} {dataLang?.among}{" "}
                                {isState?.totalItemWarehouseDetail?.iTotalRecords} {dataLang?.ingredient}
                            </h6> */}
                            <TitlePagination
                                dataLang={dataLang}
                                totalItems={isState?.totalItemWarehouseDetail?.iTotalDisplayRecords}
                            />
                            <Pagination
                                postsPerPage={isState.limitItemWarehouseDetail}
                                totalPosts={Number(isState?.totalItemWarehouseDetail?.iTotalDisplayRecords)}
                                paginate={paginate}
                                currentPage={router.query?.page || 1}
                                className="3xl:text-base text-sm"
                            />
                        </ContainerPagination>
                    )}
                </ContainerBody>
            </Container>
        </React.Fragment>
    );
};

export default Index;
