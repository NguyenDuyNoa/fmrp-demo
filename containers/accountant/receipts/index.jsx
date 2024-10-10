import { BtnAction } from "@/components/UI/BtnAction";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { TagColorMore, TagColorOrange, TagColorRed, TagColorSky } from "@/components/UI/common/Tag/TagStatus";
import { Container, ContainerBody, ContainerTable, ContainerTotal } from "@/components/UI/common/layout";
import CustomAvatar from "@/components/UI/common/user/CustomAvatar";
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
import { useBranchList } from "@/hooks/common/useBranch";
import { useObjectCombobox } from "@/hooks/common/useObject";
import { usePayment } from "@/hooks/common/usePayment";
import { useChangeValue } from "@/hooks/useChangeValue";
import useSetingServer from "@/hooks/useConfigNumber";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import useActionRole from "@/hooks/useRole";
import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import { Grid6 } from "iconsax-react";
import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import PopupDetailThere from "../components/detailThere";
import PopupDetail from "./components/detail";
import Popup_dspt from "./components/popup";
import { useReceiptsList } from "./hooks/useReceiptsList";


const inistialValue = {
    idBranch: null,
    idObject: null,
    idMethod: null,
    valueDate: { startDate: null, endDate: null },
};


const Receipts = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const isShow = useToast();

    const { paginate } = usePagination();

    const dataSeting = useSetingServer();

    const statusExprired = useStatusExprired();

    const [keySearch, sKeySearch] = useState("");

    const { limit, updateLimit: sLimit } = useLimitAndTotalItems();

    const { isValue: value, onChangeValue } = useChangeValue(inistialValue);

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    //thay type
    // other_payslips_coupon
    const { checkAdd, checkEdit, checkExport } = useActionRole(auth, "receipts");

    const parameters = {
        limit: limit,
        page: router.query?.page || 1,
        "filter[search]": keySearch,
        "filter[objects]": value.idObject != null ? value.idObject.value : null,
        "filter[branch_id]": value.idBranch != null ? value.idBranch.value : null,
        "filter[payment_mode]": value.idMethod != null ? value.idMethod.value : null,
        "filter[end_date]": value.valueDate?.endDate != null ? value.valueDate?.endDate : null,
        "filter[start_date]": value.valueDate?.startDate != null ? value.valueDate?.startDate : null,
    };

    const { data: listBr = [] } = useBranchList()

    const { data: listPayment = [] } = usePayment()

    const { data: dataObject = [] } = useObjectCombobox(dataLang)

    const { data, refetch, isLoading, isFetching } = useReceiptsList(parameters);

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        sKeySearch(value);
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
                    title: `${dataLang?.payment_date || "payment_date"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_code || "payment_code"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_obType || "payment_obType"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_ob || "payment_ob"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_typeOfDocument || "payment_typeOfDocument"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_voucherCode || "payment_voucherCode"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_TT_method || "payment_TT_method"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_amountOfMoney || "payment_amountOfMoney"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_creator || "payment_creator"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_branch || "payment_branch"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_note || "payment_note"}`,
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
                { value: `${e?.objects ? (dataLang[e.objects] !== undefined ? dataLang[e.objects] : "") : ""}` },
                { value: `${e?.object_text ? e?.object_text : ""}` },
                { value: `${e?.type_vouchers ? dataLang[e?.type_vouchers] || e?.type_vouchers : ""}` },
                { value: `${e?.voucher ? e?.voucher.map((e) => e.code).join(", ") : ""}` },
                { value: `${e?.payment_mode_name ? e?.payment_mode_name : ""}` },
                { value: `${e?.total ? formatMoney(e?.total) : ""}` },
                { value: `${e?.staff_name ? e?.staff_name : ""}` },
                { value: `${e?.branch_name ? e?.branch_name : ""}` },
                { value: `${e?.note ? e?.note : ""}` },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.receipts_title || "receipts_title"}</title>
            </Head>
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">{dataLang?.receipts_title || "receipts_title"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.receipts_title || "receipts_title"}</h6>
                    </div>
                )}

                <ContainerBody>
                    <div className="space-y-3 h-[96%] overflow-hidden">
                        <div className="flex justify-between mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.receipts_title}
                            </h2>
                            <div className="flex items-center justify-end gap-2">
                                {(role == true || checkAdd)
                                    ?
                                    <Popup_dspt
                                        onRefresh={refetch.bind(this)}
                                        dataLang={dataLang}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    />
                                    :
                                    <button
                                        type="button"
                                        onClick={() => {
                                            isShow("warning", WARNING_STATUS_ROLE);
                                        }}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    >
                                        {dataLang?.branch_popup_create_new}
                                    </button>
                                }
                            </div>
                        </div>
                        <ContainerTable>
                            <div className="space-y-2 xl:space-y-3">
                                <div className="bg-slate-100 w-full rounded-t-lg items-center grid grid-cols-8 2xl:xl:p-2 xl:p-1.5 p-1.5">
                                    <div className="col-span-6">
                                        <div className="grid grid-cols-10 gap-2">
                                            <SearchComponent
                                                dataLang={dataLang}
                                                onChange={_HandleOnChangeKeySearch.bind(this)}
                                                colSpan={2}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.price_quote_branch || "price_quote_branch",
                                                        isDisabled: true,
                                                    },
                                                    ...listBr,
                                                ]}
                                                isClearable={true}
                                                value={value.idBranch}
                                                onChange={onChangeValue("idBranch")}
                                                placeholder={dataLang?.price_quote_branch || "price_quote_branch"}
                                                colSpan={2}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.payment_TT_method || "payment_TT_method",
                                                        isDisabled: true,
                                                    },
                                                    ...listPayment,
                                                ]}
                                                isClearable={true}
                                                onChange={onChangeValue("idMethod")}
                                                value={value.idMethod}
                                                placeholder={dataLang?.payment_TT_method || "payment_TT_method"}
                                                colSpan={2}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.payment_ob || "payment_ob",
                                                        isDisabled: true,
                                                    },
                                                    ...dataObject,
                                                ]}
                                                isClearable={true}
                                                onChange={onChangeValue("idObject")}
                                                value={value.idObject}
                                                placeholder={dataLang?.payment_ob || "payment_ob"}
                                                colSpan={2}
                                            />
                                            <DateToDateComponent
                                                colSpan={2}
                                                value={value.valueDate}
                                                onChange={onChangeValue("valueDate")}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex items-center justify-end gap-2">
                                            <OnResetData onClick={() => refetch()} sOnFetching={() => { }} />
                                            {(role == true || checkExport)
                                                ?
                                                <div className={``}>
                                                    {data?.rResult?.length > 0 && (
                                                        <ExcelFileComponent
                                                            multiDataSet={multiDataSet}
                                                            filename={dataLang?.receipts_lits || "receipts_lits"}
                                                            title="DSPT"
                                                            dataLang={dataLang}
                                                        />
                                                    )}
                                                </div>
                                                :
                                                <button
                                                    onClick={() => isShow("warning", WARNING_STATUS_ROLE)}
                                                    className={`xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}
                                                >
                                                    <Grid6 className="scale-75 2xl:scale-100 xl:scale-100" size={18} />
                                                    <span>{dataLang?.client_list_exportexcel}</span>
                                                </button>
                                            }
                                            <div className="">
                                                <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Customscrollbar className="min:h-[200px] h-[88%] max:h-[500px]">
                                <div className="w-full">
                                    <HeaderTable gridCols={12} display={"grid"}>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.payment_date || "payment_date"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.payment_code || "payment_code"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.payment_obType || "payment_obType"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.payment_ob || "payment_ob"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.payment_typeOfDocument || "payment_typeOfDocument"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.payment_voucherCode || "payment_voucherCode"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {"PTTT"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.payment_amountOfMoney || "payment_amountOfMoney"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.payment_creator || "payment_creator"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.payment_branch || "payment_branch"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.payment_note || "payment_note"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.payment_action || "payment_action"}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {(isLoading || isFetching) ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : data?.rResult?.length > 0 ? (
                                        <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                            {data?.rResult?.map((e) => (
                                                <RowTable gridCols={12} key={e.id.toString()}>
                                                    <RowItemTable colSpan={1} textAlign={"center"}>
                                                        {e?.date != null ? formatMoment(e?.date, FORMAT_MOMENT.DATE_SLASH_LONG) : ""}
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1} textAlign={"center"}>
                                                        <PopupDetail
                                                            dataLang={dataLang}
                                                            className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] hover:text-blue-600 transition-all ease-in-out  rounded-md text-center text-[#0F4F9E]"
                                                            name={e?.code}
                                                            id={e?.id}
                                                        />
                                                    </RowItemTable>
                                                    <RowItemTable
                                                        colSpan={1}
                                                        textAlign={"center"}
                                                        className={"flex items-center justify-center"}
                                                    >
                                                        {
                                                            (e?.objects === "client" && <TagColorSky name={dataLang[e?.objects] || e?.objects} />)
                                                            ||
                                                            (e?.objects === "supplier" && <TagColorOrange name={dataLang[e?.objects] || e?.objects} />)
                                                            ||
                                                            (e?.objects === "other" && <TagColorRed name={dataLang[e?.objects] || e?.objects} />)
                                                        }
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1} textAlign={"left"}>
                                                        {e?.object_text}
                                                    </RowItemTable>
                                                    <RowItemTable
                                                        colSpan={1}
                                                        className={"flex items-center justify-center"}
                                                    >
                                                        {
                                                            (e?.type_vouchers === "import" && (
                                                                <TagColorMore
                                                                    color={"#a855f7"}
                                                                    backgroundColor={"#e9d5ff"}
                                                                    name={dataLang[e?.type_vouchers] || e?.type_vouchers}
                                                                />
                                                            ))
                                                            ||
                                                            (e?.type_vouchers === "deposit" && (
                                                                <TagColorMore
                                                                    color={"#06b6d4"}
                                                                    backgroundColor={"#a5f3fc"}
                                                                    name={dataLang[e?.type_vouchers] || e?.type_vouchers}
                                                                />
                                                            ))
                                                            ||
                                                            (e?.type_vouchers === "service" && <TagColorRed name={dataLang[e?.type_vouchers] || e?.type_vouchers} />)
                                                            ||
                                                            (e?.type_vouchers === "order" && (
                                                                <TagColorMore
                                                                    color={"#22c55e"}
                                                                    backgroundColor={"#bbf7d0"}
                                                                    name={dataLang[e?.type_vouchers] || e?.type_vouchers}
                                                                />
                                                            ))
                                                        }
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1} className="" textAlign={"left"}>
                                                        {e?.voucher?.map((code, index) => (
                                                            <PopupDetailThere
                                                                key={code?.id}
                                                                dataLang={dataLang}
                                                                className=" hover:text-blue-600 transition-all ease-in-out 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px]  px-2 py-1  rounded-md text-center text-[#0F4F9E]"
                                                                type={code.voucher_type}
                                                                id={code.id}
                                                                name={code?.code}
                                                            >
                                                                {code?.code}
                                                            </PopupDetailThere>
                                                        ))}
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1} textAlign={"center"}>
                                                        {e?.payment_mode_name}
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1} textAlign={"right"}>
                                                        {formatMoney(e?.total)}
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1} className={""}>
                                                        <CustomAvatar
                                                            fullName={e?.staff_name}
                                                            profileImage={e?.profile_image}
                                                        />
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1} className="col-span-1 mx-auto">
                                                        <TagBranch className="w-fit">{e?.branch_name}</TagBranch>
                                                    </RowItemTable>
                                                    <RowItemTable
                                                        colSpan={1}
                                                        textAlign={"left"}
                                                        className={"truncate"}
                                                    >
                                                        {e?.note}
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1} className="flex justify-center">
                                                        <BtnAction
                                                            onRefresh={refetch.bind(this)}
                                                            dataLang={dataLang}
                                                            id={e?.id}
                                                            type="receipts"
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
                        <ColumnTable colSpan={7} className="p-2" textAlign={"center"}>
                            {dataLang?.purchase_order_table_total_outside || "purchase_order_table_total_outside"}
                        </ColumnTable>
                        <ColumnTable colSpan={1} textAlign={"right"} className="p-2 mr-1">
                            {formatMoney(data?.rTotal?.sum_total)}
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

export default Receipts;
