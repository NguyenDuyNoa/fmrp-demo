import apiPurchases from "@/Api/apiPurchaseOrder/apiPurchases";
import { BtnAction } from "@/components/UI/BtnAction";
import TabFilter from "@/components/UI/TabFilter";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import { BtnStatusApproved } from "@/components/UI/btnStatusApproved/BtnStatusApproved";
import ButtonAddNew from "@/components/UI/button/buttonAddNew";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { TagColorLime, TagColorOrange, TagColorSky } from "@/components/UI/common/Tag/TagStatus";
import { Container, ContainerBody, ContainerFilterTab, ContainerTable } from "@/components/UI/common/layout";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import DateToDateComponent from "@/components/UI/filterComponents/dateTodateComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import Loading from "@/components/UI/loading/loading";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import { CONFIRMATION_OF_CHANGES, TITLE_STATUS } from "@/constants/changeStatus/changeStatus";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import { useBranchList } from "@/hooks/common/useBranch";
import { useStaffOptions } from "@/hooks/common/useStaffs";
import useSetingServer from "@/hooks/useConfigNumber";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import useActionRole from "@/hooks/useRole";
import useStatusExprired from "@/hooks/useStatusExprired";
import useTab from "@/hooks/useTab";
import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { Grid6 } from "iconsax-react";
import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { routerPurchases } from "routers/buyImportGoods";
import PopupDetail from "./components/popup";
import { usePurchasesFilterbar } from "./hooks/usePurchasesFilterbar";
import { usePurchasesList, usePurchasesListCode } from "./hooks/usePurchasesList";
dayjs.locale("vi");

const initialData = {
    onSending: false,
    keySearch: "",
    idBranch: null,
    idCode: null,
    idUser: null,
    active: null,
    refreshing: false,
    valueDate: { startDate: null, endDate: null },
};
const Purchases = (props) => {
    const dataLang = props.dataLang;

    const isShow = useToast();

    const router = useRouter();

    const tabPage = router.query?.tab;

    const { paginate } = usePagination();

    const dataSeting = useSetingServer();

    const statusExprired = useStatusExprired();

    const { handleTab: _HandleSelectTab } = useTab("all")

    const [isState, sIsState] = useState(initialData);

    const { isOpen, isId, handleQueryId } = useToggle();

    const { limit, updateLimit: sLimit } = useLimitAndTotalItems();

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkExport } = useActionRole(auth, "purchases");

    const params = {
        search: isState.keySearch,
        limit: limit,
        page: router.query?.page || 1,
        "filter[branch_id]": isState.idBranch != null ? isState.idBranch.value : null,
        "filter[status]": tabPage === "all" ? "" : tabPage,
        "filter[id]": isState.idCode?.value,
        "filter[staff_id]": isState.idUser?.value,
        "filter[start_date]": isState.valueDate?.startDate,
        "filter[end_date]": isState.valueDate?.endDate,
    }

    const { data: listBranch = [] } = useBranchList()

    const { data: listCode = [] } = usePurchasesListCode()

    const { data: listUser = [] } = useStaffOptions()

    const { data, isLoading, isFetching, refetch } = usePurchasesList(params);

    const { data: dataFilterbar, refetch: refetchGroup } = usePurchasesFilterbar(params);

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
    }, 500);

    const _ToggleStatus = () => {
        const index = data?.rResult.findIndex((x) => x.id === isId);
        const newStatus = data?.rResult[index].status === "0" ? "1" : "0";

        _ServerSending(isId, newStatus);

        handleQueryId({ status: false, active: newStatus });
    };

    const handingStatus = useMutation({
        mutationFn: (data) => {
            return apiPurchases.apiHandingStatusPurchases(data.id, data.newStatus)
        }
    })

    const _ServerSending = async (id, newStatus) => {
        handingStatus.mutate({ id, newStatus }, {
            onSuccess: async ({ isSuccess, message }) => {
                if (isSuccess) {
                    isShow("success", `${dataLang[message] || message}`);
                    queryState({ refreshing: true });
                    await refetch()
                    await refetchGroup()
                    queryState({ onSending: false, refreshing: false });
                } else {
                    isShow("error", `${dataLang[message] || message}`);
                }
            },
            onError: (err) => {
                throw err
            }
        })
    };

    useEffect(() => {
        isState.active != null && queryState({ onSending: true });
    }, [isState.active != null]);

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
                    title: `${dataLang?.purchase_day || "purchase_day"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_code || "purchase_code"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_planNumber || "purchase_planNumber"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_propnent || "purchase_propnent"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_status || "purchase_status"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_totalitem || "purchase_totalitem"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_orderStatus || "purchase_orderStatus"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_branch || "purchase_branch"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_note || "purchase_note"}`,
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
                { value: `${e?.reference_no ? e?.reference_no : ""}` },
                { value: `${e?.staff_create_name ? e?.staff_create_name : ""}` },
                { value: `${e?.status ? (e?.status === "1" ? "Đã duyệt" : "Chưa duyệt") : ""}` },
                { value: `${e?.total_item ? formatNumber(e?.total_item) : ""}` },
                {
                    value: e?.order_status?.status === "purchase_ordered"
                        ? dataLang[e?.order_status?.status]
                        : "" ||
                        `${e?.order_status.status === "purchase_portion"
                            ? dataLang[e?.order_status?.status] + " " + `(${e?.order_status?.count})`
                            : ""
                        }` ||
                        `${e?.order_status.status === "purchase_enough"
                            ? dataLang[e?.order_status?.status] + " " + `(${e?.order_status?.count})`
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
                <title>{dataLang?.purchase_title}</title>
            </Head>
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">{dataLang?.purchase_purchase || "purchase_purchase"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.purchase_title || "purchase_title"}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="space-y-0.5 h-[96%] overflow-hidden">
                        <div className="flex justify-between mt-1 mr-2">
                            <h2 className=" 2xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.purchase_title || "purchase_title"}
                            </h2>
                            <ButtonAddNew
                                onClick={() => {
                                    if (role) {
                                        router.push(routerPurchases.form);
                                    } else if (checkAdd) {
                                        router.push(routerPurchases.form);
                                    } else {
                                        isShow("error", WARNING_STATUS_ROLE);
                                    }
                                }}
                                dataLang={dataLang}
                            />
                        </div>
                        <ContainerFilterTab>
                            {dataFilterbar && dataFilterbar?.map((e) => {
                                return (
                                    <TabFilter
                                        key={e.id}
                                        onClick={_HandleSelectTab.bind(this, `${e.id}`)}
                                        total={e.count}
                                        active={e.id}
                                        className={`${e.color ? "text-white" : "text-[#0F4F9E] bg-[#e2f0fe] "}`}
                                    >
                                        {dataLang[e?.name] || e?.name}
                                    </TabFilter>
                                );
                            })}
                        </ContainerFilterTab>
                        <ContainerTable>
                            <div className="space-y-2 xl:space-y-3">
                                <div className="w-full items-center flex justify-between gap-2">
                                    <div className="flex gap-3 items-center w-full">
                                        <div className="grid grid-cols-5 gap-2">
                                            <SearchComponent
                                                dataLang={dataLang}
                                                onChange={_HandleOnChangeKeySearch.bind(this)}
                                                colSpan={1}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.client_list_brand || "client_list_brand",
                                                        isDisabled: true,
                                                    },
                                                    ...listBranch,
                                                ]}
                                                onChange={(e) => queryState({ idBranch: e })}
                                                value={isState.idBranch}
                                                isClearable={true}
                                                closeMenuOnSelect={false}
                                                hideSelectedOptions={false}
                                                placeholder={dataLang?.client_list_brand || "client_list_brand"}
                                                isSearchable={true}
                                                colSpan={1}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.purchase_code || "purchase_code",
                                                        isDisabled: true,
                                                    },
                                                    ...listCode,
                                                ]}
                                                onChange={(e) => queryState({ idCode: e })}
                                                value={isState.idCode}
                                                noOptionsMessage={() => `${dataLang?.no_data_found}`}
                                                isClearable={true}
                                                placeholder={dataLang?.purchase_code || "purchase_code"}
                                                isSearchable={true}
                                                colSpan={1}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.purchase_propnent,
                                                        isDisabled: true,
                                                    },
                                                    ...listUser,
                                                ]}
                                                onChange={(e) => queryState({ idUser: e })}
                                                value={isState.idUser}
                                                noOptionsMessage={() => `${dataLang?.no_data_found}`}
                                                isClearable={true}
                                                placeholder={dataLang?.purchase_propnent || "purchase_propnent"}
                                                isSearchable={true}
                                                colSpan={1}
                                            />
                                            <div className="z-20 col-span-1 ml-1">
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
                                            <div className="flex items-center justify-end space-x-2">
                                                {role == true || checkExport ? (
                                                    <div className={``}>
                                                        {data?.rResult?.length > 0 && (
                                                            <ExcelFileComponent
                                                                dataLang={dataLang}
                                                                filename="Danh sách đơn đặt hàng (PO)"
                                                                title="DSDDH"
                                                                multiDataSet={multiDataSet}
                                                            />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => isShow("error", WARNING_STATUS_ROLE)}
                                                        className={`xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}
                                                    >
                                                        <Grid6
                                                            className="scale-75 2xl:scale-100 xl:scale-100"
                                                            size={18}
                                                        />
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
                            </div>
                            <Customscrollbar>
                                <div className="w-full">
                                    <HeaderTable gridCols={12}>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.purchase_day || "purchase_day"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.purchase_code || "purchase_code"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.purchase_planNumber || "purchase_planNumber"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.purchase_propnent || "purchase_propnent"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.purchase_status || "purchase_status"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.purchase_totalitem || "purchase_totalitem"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.purchase_orderStatus || "purchase_orderStatus"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.purchase_note || "purchase_note"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.purchase_branch || "purchase_branch"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.purchase_action || "purchase_action"}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {(isFetching && !isState.refreshing) ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : data?.rResult?.length > 0 ? (
                                        <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px] ">
                                            {data?.rResult?.map((e) => (
                                                <>
                                                    <RowTable key={e?.id.toString()} gridCols={12}>
                                                        <RowItemTable colSpan={1} textAlign={"center"}>
                                                            {e?.date != null ? formatMoment(e?.date, FORMAT_MOMENT.DATE_SLASH_LONG) : ""}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1}>
                                                            <PopupDetail
                                                                dataLang={dataLang}
                                                                className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px]  px-2 col-span-1 text-center text-[#0F4F9E] hover:text-blue-500 transition-all ease-linear  cursor-pointer"
                                                                name={e?.code}
                                                                id={e?.id}
                                                            />
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={"center"}>
                                                            {e?.reference_no}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={"center"}>
                                                            {e?.staff_create_name}
                                                        </RowItemTable>
                                                        <RowItemTable
                                                            colSpan={1}
                                                            className="flex items-center justify-center"
                                                        >
                                                            <BtnStatusApproved
                                                                type={e?.status == "1" ? 1 : 0}
                                                                onClick={() =>
                                                                    handleQueryId({ id: e?.id, status: true })
                                                                }
                                                            />
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={"center"}>
                                                            {formatNumber(e?.total_item)}
                                                        </RowItemTable>
                                                        <RowItemTable
                                                            colSpan={2}
                                                            className="flex items-center justify-center "
                                                        >
                                                            {(e?.order_status?.status === "purchase_ordered" && (
                                                                <TagColorSky name={dataLang[e?.order_status?.status]} />
                                                            )) ||
                                                                (e?.order_status?.status === "purchase_portion" && (
                                                                    <TagColorOrange
                                                                        name={`${dataLang[e?.order_status?.status]} (${formatNumber(e?.order_status?.count)})`}
                                                                    />
                                                                )) ||
                                                                (e?.order_status?.status === "purchase_enough" && (
                                                                    <TagColorLime
                                                                        name={`${dataLang[e?.order_status?.status]} (${e?.order_status?.count})`}
                                                                    />
                                                                ))}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={2} textAlign={"left"}>
                                                            {e?.note}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className="mx-auto w-fit">
                                                            <TagBranch>{e?.branch_name}</TagBranch>
                                                        </RowItemTable>
                                                        <RowItemTable
                                                            colSpan={1}
                                                            className="pl-2 py-2.5 flex space-x-2 justify-center"
                                                        >
                                                            <BtnAction
                                                                onRefresh={refetch.bind(this)}
                                                                onRefreshGroup={refetchGroup.bind(this)}
                                                                dataLang={dataLang}
                                                                id={e?.id}
                                                                order={e?.order_status}
                                                                status={e?.status}
                                                                type="purchases"
                                                                className="bg-slate-100 xl:px-4 px-2 xl:py-1.5 py-1 rounded 2xl:text-base xl:text-xs text-[9px]"
                                                            />
                                                        </RowItemTable>
                                                    </RowTable>
                                                </>
                                            ))}
                                        </div>
                                    ) : (
                                        <NoData />
                                    )}
                                </div>
                            </Customscrollbar>
                        </ContainerTable>
                    </div>
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
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                title={TITLE_STATUS}
                subtitle={CONFIRMATION_OF_CHANGES}
                isOpen={isOpen}
                nameModel={"change_item"}
                save={_ToggleStatus}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment>
    );
};

export default Purchases;
