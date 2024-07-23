import apiComons from "@/api/apiComon/apiComon";
import apiImport from "@/api/apiPurchaseOrder/apiImport";
import apiSuppliers from "@/api/apiSuppliers/suppliers/apiSuppliers";
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
import { TagColorLime, TagColorOrange, TagColorSky } from "@/components/UI/common/Tag/TagStatus";
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
import Loading from "@/components/UI/loading";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import { reTryQuery } from "@/configs/configRetryQuery";
import { CONFIRMATION_OF_CHANGES, TITLE_STATUS } from "@/constants/changeStatus/changeStatus";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import useSetingServer from "@/hooks/useConfigNumber";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import useActionRole from "@/hooks/useRole";
import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Grid6 } from "iconsax-react";
import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { routerImport } from "routers/buyImportGoods";
import Popup_chitietThere from "../detaiCommon";
import Popup_chitiet from "./components/popup";
import Popup_status from "./components/popupStatus";

const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const isShow = useToast();

    const { paginate } = usePagination();

    const dataSeting = useSetingServer();

    const statusExprired = useStatusExprired();

    const { isOpen, isKeyState, handleQueryId } = useToggle();

    const initalState = {
        data: [],
        dataExcel: [],
        onFetching: false,
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
        },
        data_export: [],
    };

    const [total, sTotal] = useState({});

    const [checkedWare, sCheckedWare] = useState({});

    const [isState, sIsState] = useState(initalState);

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkExport } = useActionRole(auth, "import");

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
    }, []);

    const params = {
        search: isState.keySearch,
        limit: limit,
        page: router.query?.page || 1,
        "filter[status_bar]": router.query?.tab ?? null,
        "filter[id]": isState.valueCode != null ? isState.valueCode?.value : null,
        "filter[branch_id]": isState.valueBr != null ? isState.valueBr.value : null,
        "filter[supplier_id]": isState.valueSupplier ? isState.valueSupplier.value : null,
        "filter[start_date]": isState.valueDate?.startDate != null ? isState.valueDate?.startDate : null,
        "filter[end_date]": isState.valueDate?.endDate != null ? isState.valueDate?.endDate : null,
    }

    const { isFetching, refetch } = useQuery({
        queryKey: ["api_import", { ...params }],
        queryFn: async () => {
            const { rResult, output, rTotal } = await apiImport.apiListImport({ params });

            sTotalItems(output);

            sTotal(rTotal);

            queryState({ data: rResult, dataExcel: rResult });

            return rResult
        },
        ...reTryQuery
    })

    const newParam = { ...params, limit: 0, "filter[status_bar]": undefined }

    const { refetch: refetchFilterBar } = useQuery({

        queryKey: ["api_filter_bar", { ...newParam }],
        queryFn: async () => {
            const data = await apiImport.apiListFilterBar({ params: newParam });
            queryState({ listDs: data });
            return data
        },
        ...reTryQuery
    })

    useQuery({
        queryKey: ["api_filter_combobox"],
        queryFn: async () => {
            const { result: listBr } = await apiComons.apiBranchCombobox();

            const { rResult: listSupplier } = await apiSuppliers.apiListSuppliers();

            const { result: lisCode } = await apiImport.apiImportCombobox('GET');


            queryState({
                listBr: listBr?.map((e) => ({ label: e.name, value: e.id })) || [],
                listSupplier: listSupplier?.map((e) => ({ label: e.name, value: e.id })) || [],
                lisCode: lisCode?.map((e) => ({ label: `${e.code}`, value: e.id })) || []
            });

            return { listBr, listSupplier, lisCode }
        },
        ...reTryQuery
    })

    const _HandleSeachApi = debounce(async (inputValue) => {
        try {
            const { result: lisCode } = await apiImport.apiImportCombobox('POST', {
                data: {
                    term: inputValue,
                }
            });
            queryState({ listCode: lisCode });
        } catch (error) {
        }
    }, 500);


    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

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
                    title: `${dataLang?.import_the_order || "import_the_order"}`,
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
                    title: `${dataLang?.import_payment_status || "import_payment_status"}`,
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
                    value: `${e?.purchase_order_code ? e?.purchase_order_code : ""}`,
                },
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
                    value: `${e?.status === "0"
                        ? "Chưa thanh toán"
                        : "" || e?.status === "1"
                            ? "Thanh toán 1 phần"
                            : "" || e?.status === "2"
                                ? "Thanh toán đủ"
                                : ""
                        }`,
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

    const handingStatus = useMutation({
        mutationFn: (data) => {
            return apiImport.apiHandingStatus(data);
        },
    })

    const _ServerSending = () => {
        let data = new FormData();
        data.append("warehouseman_id", checkedWare?.checkedpost != "0" ? checkedWare?.checkedpost : "");
        data.append("id", checkedWare?.id);
        handingStatus.mutate(data, {
            onSuccess: ({ isSuccess, message, data_export }) => {
                if (isSuccess) {
                    isShow("success", `${dataLang[message] || message}`);
                    refetch()
                } else {
                    isShow("error", `${dataLang[message] || message}`);
                }
                if (data_export?.length > 0) {
                    queryState({ data_export: data_export });
                }
            }
        })
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
                <title>{dataLang?.import_title || "import_title"} </title>
            </Head>
            <Container>
                {isState.data_export.length > 0 && (
                    <Popup_status className="hidden" data_export={isState.data_export} dataLang={dataLang} />
                )}
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">{dataLang?.import_title || "import_title"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.import_list || "import_list"}</h6>
                    </div>
                )}

                <ContainerBody>
                    <div className="space-y-0.5 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.import_list || "import_list"}
                            </h2>
                            <ButtonAddNew
                                onClick={() => {
                                    if (role) {
                                        router.push(routerImport.form);
                                    } else if (checkAdd) {
                                        router.push(routerImport.form);
                                    } else {
                                        isShow("warning", WARNING_STATUS_ROLE);
                                    }
                                }}
                                dataLang={dataLang}
                            />
                        </div>
                        <ContainerFilterTab>
                            {isState.listDs && isState.listDs.map((e) => {
                                return (
                                    <div key={e?.id}>
                                        <TabFilter
                                            backgroundColor="#e2f0fe"
                                            dataLang={dataLang}
                                            key={e?.id}
                                            onClick={_HandleSelectTab.bind(this, `${e?.id}`)}
                                            total={e?.count}
                                            active={e?.id}
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
                                <div className="bg-slate-100 w-full rounded-t-lg items-center grid grid-cols-7 2xl:grid-cols-9 xl:col-span-8 lg:col-span-7 2xl:xl:p-2 xl:p-1.5 p-1.5">
                                    <div className="col-span-6 2xl:col-span-7 xl:col-span-5 lg:col-span-5">
                                        <div className="grid grid-cols-5">
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
                                                        label: dataLang?.purchase_order_branch || "purchase_order_branch",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.listBr,
                                                ]}
                                                colSpan={1}
                                                onChange={(e) => queryState({ valueBr: e })}
                                                value={isState.valueBr}
                                                placeholder={dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}
                                                isClearable={true}
                                            />
                                            <SelectComponent
                                                onInputChange={(event) => {
                                                    _HandleSeachApi(event);
                                                }}
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.purchase_order_vouchercode || "purchase_order_vouchercode",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.lisCode,
                                                ]}
                                                onChange={(e) => queryState({ valueCode: e })}
                                                value={isState.valueCode}
                                                placeholder={dataLang?.purchase_order_table_code || "purchase_order_table_code"}
                                                colSpan={1}
                                                isClearable={true}
                                                className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px]  z-20"
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.purchase_order_supplier || "purchase_order_supplier",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.listSupplier,
                                                ]}
                                                onChange={(e) => queryState({ valueSupplier: e })}
                                                value={isState.valueSupplier}
                                                placeholder={dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"}
                                                colSpan={1}
                                                className="rounded-md bg-white   2xl:text-base xl:text-xs text-[10px]  z-20"
                                                isSearchable={true}
                                            />
                                            <DateToDateComponent
                                                colSpan={1}
                                                value={isState.valueDate}
                                                onChange={(e) => queryState({ valueDate: e })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex justify-end items-center gap-2">
                                            <OnResetData sOnFetching={(e) => { }} onClick={() => refetch()} />
                                            {role == true || checkExport ? (
                                                <div className={``}>
                                                    {isState.dataExcel?.length > 0 && (
                                                        <ExcelFileComponent
                                                            dataLang={dataLang}
                                                            filename="Danh sách nhập hàng"
                                                            title={"SDNH"}
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
                                    <HeaderTable gridCols={13}>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.import_day_vouchers || "import_day_vouchers"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.import_code_vouchers || "import_code_vouchers"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.import_supplier || "import_supplier"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.import_the_order || "import_the_order"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.import_total_amount || "import_total_amount"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.import_tax_money || "import_tax_money"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.import_into_money || "import_into_money"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.import_payment_status || "import_payment_status"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.import_brow_storekeepers || "import_brow_storekeepers"}
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
                                    ) : isState.data?.length > 0 ? (
                                        <>
                                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                                {isState.data?.map((e) => (
                                                    <RowTable gridCols={13} key={e.id.toString()}>
                                                        <RowItemTable colSpan={1} textAlign={"center"}>
                                                            {e?.date != null ? formatMoment(e?.date, FORMAT_MOMENT.DATE_SLASH_LONG) : ""}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={"center"}>
                                                            <Popup_chitiet
                                                                dataLang={dataLang}
                                                                className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px] px-2 font-medium text-center text-[#0F4F9E] hover:text-blue-600 transition-all ease-linear cursor-pointer "
                                                                name={e?.code}
                                                                id={e?.id}
                                                            />
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={2} textAlign={"left"}>
                                                            {e.supplier_name}
                                                        </RowItemTable>
                                                        <RowItemTable
                                                            colSpan={1}
                                                            className="flex items-center w-fit mx-auto"
                                                        >
                                                            <div className="mx-auto">
                                                                <Popup_chitietThere
                                                                    className="3xl:py-0 py-1 3xl:text-[11px] 2xl:text-[10px] xl:text-[8px] text-[7px] px-2 bg-gradient-to-br font-normal text-orange-500 bg-orange-200 items-center rounded-full shadow-2xl cursor-pointer hover:scale-105 transition duration-300 ease-out hover:bg-orange-500 hover:text-white"
                                                                    name={e?.purchase_order_code}
                                                                    dataLang={dataLang}
                                                                    id={e?.purchase_order_id}
                                                                    type={"typePo"}
                                                                ></Popup_chitietThere>
                                                            </div>
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
                                                        <RowItemTable
                                                            colSpan={2}
                                                            className="flex items-center w-fit mx-auto"
                                                        >
                                                            {(e?.status_pay === "not_spent" && (
                                                                <TagColorSky name={"Chưa chi"} />
                                                            )) ||
                                                                (e?.status_pay === "spent_part" && (
                                                                    <TagColorOrange name={`Chi 1 phần (${formatMoney(e?.amount_paid)})`} />
                                                                )) ||
                                                                (e?.status_pay === "spent" && (
                                                                    <TagColorLime name={"Đã chi đủ"} />
                                                                ))}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className="cursor-pointer">
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
                                                                onRefresh={refetch.bind(this)}
                                                                onRefreshGroup={refetchFilterBar.bind(this)}
                                                                dataLang={dataLang}
                                                                warehouseman_id={e?.warehouseman_id}
                                                                status_pay={e?.status_pay}
                                                                id={e?.id}
                                                                type="import"
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
                    <ContainerTotal className={"!grid-cols-13"}>
                        <RowItemTable colSpan={5} textAlign={"center"} className="p-2">
                            {dataLang?.import_total || "import_total"}
                        </RowItemTable>
                        <RowItemTable
                            colSpan={1}
                            textAlign={"right"}
                            className="justify-end p-2 mr-1 flex gap-2 flex-wrap"
                        >
                            {formatNumber(total?.total_price)}
                        </RowItemTable>
                        <RowItemTable
                            colSpan={1}
                            textAlign={"right"}
                            className="justify-end p-2 mr-1 flex gap-2 flex-wrap "
                        >
                            {formatNumber(total?.total_tax_price)}
                        </RowItemTable>
                        <RowItemTable
                            colSpan={1}
                            textAlign={"right"}
                            className="justify-end p-2 mr-1 flex gap-2 flex-wrap "
                        >
                            {formatNumber(total?.total_amount)}
                        </RowItemTable>
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
                nameModel={"import"}
                title={TITLE_STATUS}
                subtitle={CONFIRMATION_OF_CHANGES}
                isOpen={isOpen}
                save={() => handleSaveStatus()}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment>
    );
};

export default Index;
