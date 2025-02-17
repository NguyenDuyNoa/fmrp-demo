import { BtnAction } from "@/components/UI/BtnAction";
import TabFilter from "@/components/UI/TabFilter";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { TagColorLime, TagColorOrange, TagColorRed, TagColorSky } from "@/components/UI/common/Tag/TagStatus";
import { Container, ContainerBody, ContainerFilterTab, ContainerTable, ContainerTotal, } from "@/components/UI/common/layout";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import DateToDateComponent from "@/components/UI/filterComponents/dateTodateComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import Loading from "@/components/UI/loading/loading";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import PopupDetail from "@/containers/purchase-order/order/components/popup";
import { useSupplierList } from "@/containers/suppliers/supplier/hooks/useSupplierList";
import { useBranchList } from "@/hooks/common/useBranch";
import useSetingServer from "@/hooks/useConfigNumber";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import useActionRole from "@/hooks/useRole";
import useStatusExprired from "@/hooks/useStatusExprired";
import useTab from "@/hooks/useTab";
import { routerOrder } from "@/routers/buyImportGoods";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import { Grid6 } from "iconsax-react";
import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import PopupDetailThere from "../components/PopupDetailThere";
import { useOrderFilterbar } from "./hooks/useOrderFilterbar";
import { useOrderList, useOrderListCode } from "./hooks/useOrderList";
import { useOrderTypeList } from "./hooks/useOrderTypeList";

const initalState = {
    keySearch: "",
    valueBr: null,
    valueCode: null,
    valueSupplier: null,
    valueOrderType: null,
    valueDate: { startDate: null, endDate: null }
};

const Order = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const { paginate } = usePagination();

    const dataSeting = useSetingServer();

    const statusExprired = useStatusExprired();

    const [isState, sIsState] = useState(initalState);

    const { handleTab: _HandleSelectTab } = useTab('all');

    const { limit, updateLimit: sLimit } = useLimitAndTotalItems();

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkExport } = useActionRole(auth, "order");

    const params = {
        search: isState.keySearch,
        limit: limit,
        page: router.query?.page || 1,
        "filter[branch_id]": isState.valueBr != null ? isState.valueBr?.value : null,
        "filter[id]": isState.valueCode != null ? isState.valueCode?.value : null,
        "filter[status_bar]": router.query?.tab ?? null,
        "filter[supplier_id]": isState.valueSupplier ? isState.valueSupplier.value : null,
        "filter[order_type]": isState.valueOrderType ? isState.valueOrderType.value : null,
        "filter[start_date]": isState.valueDate?.startDate != null ? isState.valueDate?.startDate : null,
        "filter[end_date]": isState.valueDate?.endDate != null ? isState.valueDate?.endDate : null,
    }

    const { data: listBr = [] } = useBranchList()

    const { data: listCode = [] } = useOrderListCode()

    const { data: dataListSupplier } = useSupplierList()

    const { data: listOrderType = [] } = useOrderTypeList(dataLang)

    const listSupplier = dataListSupplier?.rResult?.map((e) => ({ label: e.name, value: e.id })) || []

    const { data: dataFilterbar } = useOrderFilterbar(params)

    const { data, isFetching, refetch } = useOrderList(params)

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryState({ keySearch: value });
        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            },
        });
    }, 500);

    const formatMoney = (number) => {
        return formatMoneyConfig(+number, dataSeting);
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
                    title: `${dataLang?.purchase_order_table_dayvoucers || "purchase_order_table_dayvoucers"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_order_table_code || "purchase_order_table_code"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_order_table_ordertype || "purchase_order_table_ordertype"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_order_table_number || "purchase_order_table_number"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_order_table_total || "purchase_order_table_total"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_order_table_totalTax || "purchase_order_table_totalTax"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_order_table_intoMoney || "purchase_order_table_intoMoney"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                // {title: `${dataLang?.purchase_order_table_statusOfSpending || "purchase_order_table_statusOfSpending"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {
                    title: `${dataLang?.purchase_order_table_importStatus || "purchase_order_table_importStatus"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_order_note || "purchase_order_note"}`,
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
                { value: `${e?.supplier_name ? e?.supplier_name : ""}` },
                {
                    value: `${e?.order_type ? (e?.order_type == "0" ? "Tạo mới" : "Theo YCHM") : ""}`,
                },
                {
                    value: `${e?.purchases
                        ? e?.purchases?.map((e) => {
                            return e?.code;
                        })
                        : ""
                        }`,
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
                // {value: `${e?.import_status ? e?.import_status === "0" && "Chưa chi" || e?.import_status === "1" && "Chi 1 phần" ||  e?.import_status === "2"  &&"Đã chi đủ" : ""}`},
                {
                    value: `${e?.status_pay
                        ? (e?.status_pay === "0" && "Chưa nhập") ||
                        (e?.status_pay === "1" && "Nhập 1 phần") ||
                        (e?.status_pay === "2" && "Đã nhập đủ đủ")
                        : ""
                        }`,
                },
                { value: `${e?.branch_name ? e?.branch_name : ""}` },
                { value: `${e?.note ? e?.note : ""}` },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.purchase_order || "purchase_order"} </title>
            </Head>
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">{dataLang?.purchase_purchase || "purchase_purchase"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.purchase_order || "purchase_order"}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="space-y-0.5 h-[96%] overflow-hidden">
                        <div className="flex justify-between mt-1 mr-2">
                            <h2 className=" 2xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.purchase_order || "purchase_order"}
                            </h2>
                            <button
                                onClick={() => {
                                    if (role) {
                                        router.push(routerOrder.form);
                                    } else if (checkAdd) {
                                        router.push(routerOrder.form);
                                    } else {
                                        isShow("warning", WARNING_STATUS_ROLE);
                                    }
                                }}
                                type="button"
                                className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                            >
                                {dataLang?.btn_new || "btn_new"}
                            </button>
                        </div>

                        <ContainerFilterTab>
                            {dataFilterbar &&
                                dataFilterbar?.map((e) => {
                                    return (
                                        <TabFilter
                                            style={{ backgroundColor: "#e2f0fe" }}
                                            dataLang={dataLang}
                                            key={e.id}
                                            onClick={_HandleSelectTab.bind(this, `${e.id}`)}
                                            total={e.count}
                                            active={e.id}
                                            className={"text-[#0F4F9E]"}
                                        >
                                            {dataLang[e?.name] || e?.name}
                                        </TabFilter>
                                    );
                                })}
                        </ContainerFilterTab>
                        <ContainerTable>
                            <div className="space-y-2 xl:space-y-3">
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
                                                    ...listBr,
                                                ]}
                                                onChange={(e) => queryState({ valueBr: e })}
                                                value={isState.valueBr}
                                                placeholder={dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}
                                                hideSelectedOptions={false}
                                                isClearable={true}
                                                colSpan={1}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.purchase_order_table_code || "purchase_order_table_code",
                                                        isDisabled: true,
                                                    },
                                                    ...listCode,
                                                ]}
                                                onChange={(e) => queryState({ valueCode: e })}
                                                value={isState.valueCode}
                                                placeholder={dataLang?.purchase_order_table_code || "purchase_order_table_code"}
                                                hideSelectedOptions={false}
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
                                                    ...listSupplier,
                                                ]}
                                                onChange={(e) => queryState({ valueSupplier: e })}
                                                value={isState.valueSupplier}
                                                placeholder={dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"}
                                                hideSelectedOptions={false}
                                                isClearable={true}
                                                isSearchable={true}
                                                noOptionsMessage={() => "Không có dữ liệu"}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: "Loại đặt hàng",
                                                        isDisabled: true,
                                                    },
                                                    ...listOrderType,
                                                ]}
                                                onChange={(e) => queryState({ valueOrderType: e })}
                                                value={isState.valueOrderType}
                                                placeholder={"Loại đặt hàng"}
                                                hideSelectedOptions={false}
                                                isClearable={true}
                                                colSpan={1}
                                            />
                                            <div className="z-20 col-span-1">
                                                <DateToDateComponent
                                                    value={isState.valueDate}
                                                    onChange={(e) => queryState({ valueDate: e })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-1 xl:col-span-2 lg:col-span-2">
                                        <div className="flex items-center justify-end gap-2">
                                            <OnResetData onClick={refetch.bind(this)} sOnFetching={(e) => { }} />
                                            {role == true || checkExport ? (
                                                <div className={``}>
                                                    {data?.rResult?.length > 0 && (
                                                        <ExcelFileComponent
                                                            dataLang={dataLang}
                                                            filename="Danh sách yêu cầu mua hàng"
                                                            title="DSYCMH"
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
                            <Customscrollbar>
                                <div className="w-full">
                                    <HeaderTable gridCols={12}>
                                        <ColumnTable colSpan={1} textAlign="center">
                                            {dataLang?.purchase_order_table_dayvoucers || "purchase_order_table_dayvoucers"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.purchase_order_table_code || "purchase_order_table_code"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.purchase_order_table_ordertype || "purchase_order_table_ordertype"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.purchase_order_table_number || "purchase_order_table_number"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.purchase_order_table_total || "purchase_order_table_total"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.purchase_order_table_totalTax || "purchase_order_table_totalTax"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.purchase_order_table_intoMoney || "purchase_order_table_intoMoney"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.purchase_order_table_importStatus || "purchase_order_table_importStatus"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.purchase_order_note || "purchase_order_note"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.purchase_order_table_operations || "purchase_order_table_operations"}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {isFetching ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : data?.rResult?.length > 0 ? (
                                        <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px] ">
                                            {data?.rResult?.map((e) => (
                                                <RowTable key={e?.id} gridCols={12}>
                                                    <RowItemTable colSpan={1} textAlign="center">
                                                        {e?.date != null ? formatMoment(e?.date, FORMAT_MOMENT.DATE_SLASH_LONG) : ""}
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1}>
                                                        <PopupDetail
                                                            dataLang={dataLang}
                                                            className="3xl:text-base 2xl:text-[12.5px] hover:text-blue-600 transition-all ease-in-out xl:text-[11px] font-medium text-[9px]  px-2 col-span-1 text-center text-[#0F4F9E]  cursor-pointer"
                                                            name={e?.code}
                                                            id={e?.id}
                                                        />
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1} textAlign="left">
                                                        {e.supplier_name}
                                                    </RowItemTable>
                                                    <RowItemTable
                                                        colSpan={1}
                                                        className={"flex justify-center text-center"}
                                                    >
                                                        {e?.order_type == "0" ? (
                                                            <TagColorRed name={"Tạo mới"} />
                                                        ) : (
                                                            <TagColorOrange name={"YCMH"} />
                                                        )}
                                                    </RowItemTable>
                                                    <RowItemTable
                                                        colSpan={1}
                                                        className={"flex-col items-center justify-center"}
                                                    >
                                                        {e?.purchases?.map((purchase, index) => (
                                                            <React.Fragment key={purchase.id}>
                                                                <PopupDetailThere
                                                                    dataLang={dataLang}
                                                                    className="3xl:text-base 2xl:text-[12.5px] px-2 col-span-1 text-left flex flex-wrap text-[#0F4F9E] hover:text-blue-600 transition-all ease-in-out"
                                                                    type={e?.order_type}
                                                                    id={purchase.id}
                                                                    name={purchase.code}
                                                                />
                                                            </React.Fragment>
                                                        ))}
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
                                                        colSpan={1}
                                                        className="flex items-center justify-center text-center "
                                                    >
                                                        {(e?.import_status === "not_stocked" && (
                                                            <TagColorSky name={dataLang[e?.import_status] || e?.import_status} />
                                                        )) ||
                                                            (e?.import_status === "stocked_part" && (
                                                                <TagColorOrange name={dataLang[e?.import_status] || e?.import_status} />
                                                            )) ||
                                                            (e?.import_status === "stocked" && (
                                                                <TagColorLime name={dataLang[e?.import_status] || e?.import_status} />
                                                            ))}
                                                    </RowItemTable>
                                                    <RowItemTable
                                                        colSpan={1}
                                                        textAlign={"text-left"}
                                                        className="truncate "
                                                    >
                                                        {e.note}
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1} className="mx-auto">
                                                        <TagBranch className="w-fit">{e?.branch_name}</TagBranch>
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1} className="flex justify-center ">
                                                        <BtnAction
                                                            onRefresh={refetch.bind(this)}
                                                            dataLang={dataLang}
                                                            id={e?.id}
                                                            status={e?.import_status}
                                                            status_pay={e?.status_pay}
                                                            type="order"
                                                            data={e}
                                                            className="bg-slate-100 xl:px-4 px-2 xl:py-1.5 py-1 rounded 2xl:text-base xl:text-xs text-[9px]"
                                                        />
                                                    </RowItemTable>
                                                </RowTable>
                                            ))}
                                        </div>
                                    ) : (
                                        <NoData />
                                    )}
                                </div>
                            </Customscrollbar>
                        </ContainerTable>
                    </div>
                    <ContainerTotal>
                        <ColumnTable colSpan={5} textAlign={"center"} className="p-2">
                            {dataLang?.purchase_order_table_total_outside || "purchase_order_table_total_outside"}
                        </ColumnTable>
                        <ColumnTable
                            colSpan={1}
                            textAlign={"right"}
                            className="justify-end mr-1.5 p-2 flex gap-2 flex-wrap"
                        >
                            {formatMoney(data?.rTotal?.total_price)}
                        </ColumnTable>
                        <ColumnTable
                            colSpan={1}
                            textAlign={"right"}
                            className="justify-end mr-1.5 p-2 flex gap-2 flex-wrap "
                        >
                            {formatMoney(data?.rTotal?.total_tax_price)}
                        </ColumnTable>
                        <ColumnTable
                            colSpan={1}
                            textAlign={"right"}
                            className="justify-end mr-1.5 p-2 flex gap-2 flex-wrap "
                        >
                            {formatMoney(data?.rTotal?.total_amount)}
                        </ColumnTable>
                    </ContainerTotal>
                    {data?.rResult?.length != 0 && (
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
        </React.Fragment>
    );
};

export default Order;
