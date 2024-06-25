import Head from "next/head";
import React, { useEffect, useState } from "react";

import { Grid6 } from "iconsax-react";

import { useRouter } from "next/router";

import dayjs from "dayjs";
import "dayjs/locale/vi";
import "react-datepicker/dist/react-datepicker.css";


dayjs.locale("vi");

import Popup_chitiet from "./components/popup";

import Loading from "@/components/UI/loading";
import Pagination from "@/components/UI/pagination";
import { routerPurchases } from "routers/buyImportGoods";

import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";

import apiComons from "@/Api/apiComon/apiComon";
import apiPurchases from "@/Api/apiPurchaseOrder/apiPurchases";
import { BtnAction } from "@/components/UI/BtnAction";
import TabFilter from "@/components/UI/TabFilter";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import BtnStatusApproved from "@/components/UI/btnStatusApproved/BtnStatusApproved";
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

const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const { paginate } = usePagination();

    const dataSeting = useSetingServer();
    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const isShow = useToast();

    const { isOpen, isId, handleQueryId } = useToggle();

    const statusExprired = useStatusExprired();

    const initialData = {
        data: [],
        dataExcel: [],
        onFetching: false,
        onFetchingBranch: false,
        onFetchingCode: false,
        onFetchingUser: false,
        onFetchingFilter: false,
        onFetchingGroup: false,
        onSending: false,
        keySearch: "",
        listDs: [],
        listBr: [],
        listCode: [],
        listUser: [],
        idBranch: null,
        idCode: null,
        idUser: null,
        active: null,
        valueDate: {
            startDate: null,
            endDate: null,
        },
    };

    const [isState, sIsState] = useState(initialData);

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkExport } = useActionRole(auth, "purchases");

    const tabPage = router.query?.tab;

    const _HandleSelectTab = (e) => {
        router.push({
            pathname: router.route,
            query: { tab: e },
        });
    };
    useEffect(() => {
        router.push({
            pathname: router.route,
            query: { tab: router.query?.tab ? router.query?.tab : "" },
        });
        queryState({ onFetchingFilter: true });
    }, []);
    const _ServerFetching = async () => {
        try {
            const { output, rResult } = await apiPurchases.apiListPurchases({
                params: {
                    search: isState.keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id]": isState.idBranch != null ? isState.idBranch.value : null,
                    "filter[status]": tabPage,
                    "filter[id]": isState.idCode?.value,
                    "filter[staff_id]": isState.idUser?.value,
                    "filter[start_date]": isState.valueDate?.startDate,
                    "filter[end_date]": isState.valueDate?.endDate,
                },
            })
            queryState({ data: rResult || [], dataExcel: rResult || [], onFetching: false });
            sTotalItems(output);
        } catch (error) {

        }
    };

    const _ServerFetching_filter = async () => {
        try {
            const { result: listBr } = await apiComons.apiBranchCombobox();
            const { rResult: listCode } = await apiPurchases.apiComboboxPurchases()
            const { rResult: listUser } = await apiPurchases.apiStaffOptionPurchases()
            queryState({
                listBr: listBr?.map((e) => ({ label: e.name, value: e.id })) || [],
                listCode: listCode?.map((e) => ({ label: e.code, value: e.id || [] })),
                listUser: listUser?.map((e) => ({ label: e.name, value: e.staffid })) || [],
                onFetchingFilter: false
            });
        } catch (error) {

        }

    };

    const _ServerFetching_group = async () => {
        try {
            const data = await apiPurchases.apiGroupPurchases({
                params: {
                    limit: 0,
                    search: isState.keySearch,
                    "filter[branch_id]": isState.idBranch != null ? isState.idBranch.value : null,
                    "filter[id]": isState.idCode?.value,
                    "filter[staff_id]": isState.idUser?.value,
                    "filter[start_date]": isState.valueDate?.startDate,
                    "filter[end_date]": isState.valueDate?.endDate,
                },
            })
            queryState({ listDs: data || [], onFetchingGroup: false });
        } catch (error) {

        }
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

    useEffect(() => {
        isState.onFetching && _ServerFetching();
    }, [isState.onFetching]);

    useEffect(() => {
        isState.onFetchingGroup && _ServerFetching_group();
    }, [isState.onFetchingGroup]);

    useEffect(() => {
        isState.onFetchingFilter && _ServerFetching_filter();
    }, [isState.onFetchingFilter]);

    useEffect(() => {
        queryState({ onFetching: true, onFetchingGroup: true });
    }, [
        limit,
        router.query?.page,
        router.query?.tab,
        isState.idBranch,
        isState.idCode,
        isState.idUser,
        isState.valueDate.endDate,
        isState.valueDate.startDate,
    ]);

    const _ToggleStatus = () => {
        const index = isState.data.findIndex((x) => x.id === isId);
        const newStatus = isState.data[index].status === "0" ? "1" : "0";

        _ServerSending(isId, newStatus);

        handleQueryId({ status: false, active: newStatus });
    };

    const _ServerSending = async (id, newStatus) => {
        try {

            const { isSuccess, message } = await apiPurchases.apiHandingStatusPurchases(id, newStatus)

            if (isSuccess) {
                isShow("success", `${dataLang[message]}`);
            } else {
                isShow("error", `${dataLang[message]}`);
            }

            queryState({ onSending: false });

            await _ServerFetching();

            await _ServerFetching_group();
        } catch (error) {

        }
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
            data: isState.dataExcel?.map((e) => [
                { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
                { value: `${e?.date ? e?.date : ""}` },
                { value: `${e?.code ? e?.code : ""}` },
                { value: `${e?.reference_no ? e?.reference_no : ""}` },
                {
                    value: `${e?.staff_create_name ? e?.staff_create_name : ""}`,
                },
                {
                    value: `${e?.status ? (e?.status === "1" ? "Đã duyệt" : "Chưa duyệt") : ""}`,
                },
                { value: `${e?.total_item ? formatNumber(e?.total_item) : ""}` },
                {
                    value:
                        e?.order_status?.status === "purchase_ordered"
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
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.purchase_title || "purchase_title"}
                            </h2>
                            <ButtonAddNew
                                onClick={() => {
                                    if (role) {
                                        router.push(routerPurchases.form);
                                    } else if (checkAdd) {
                                        router.push(routerPurchases.form);
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
                                                key={e.id}
                                                onClick={_HandleSelectTab.bind(this, `${e.id}`)}
                                                total={e.count}
                                                active={e.id}
                                                className={`${e.color ? "text-white" : "text-[#0F4F9E] bg-[#e2f0fe] "}`}
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
                                                    ...isState.listBr,
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
                                                    ...isState.listCode,
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
                                                    ...isState.listUser,
                                                ]}
                                                onChange={(e) => queryState({ idUser: e })}
                                                value={isState.idUser}
                                                noOptionsMessage={() => `${dataLang?.no_data_found}`}
                                                isClearable={true}
                                                placeholder={dataLang?.purchase_propnent || "purchase_propnent"}
                                                isSearchable={true}
                                                colSpan={1}
                                            />
                                            <div className="ml-1 col-span-1 z-20">
                                                <DateToDateComponent
                                                    value={isState.valueDate}
                                                    onChange={(e) => queryState({ valueDate: e })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-1 xl:col-span-2 lg:col-span-2">
                                        <div className="flex justify-end items-center gap-2">
                                            <OnResetData sOnFetching={(e) => queryState({ onFetching: e })} />
                                            <div className="flex space-x-2 items-center justify-end">
                                                {role == true || checkExport ? (
                                                    <div className={``}>
                                                        {isState.dataExcel?.length > 0 && (
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
                                    {isState.onFetching ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : isState.data?.length > 0 ? (
                                        <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px] ">
                                            {isState.data?.map((e) => (
                                                <>
                                                    <RowTable key={e?.id.toString()} gridCols={12}>
                                                        <RowItemTable colSpan={1} textAlign={"center"}>
                                                            {e?.date != null ? formatMoment(e?.date, FORMAT_MOMENT.DATE_SLASH_LONG) : ""}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1}>
                                                            <Popup_chitiet
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
                                                                        name={`${dataLang[e?.order_status?.status]
                                                                            } (${formatNumber(e?.order_status?.count)})`}
                                                                    />
                                                                )) ||
                                                                (e?.order_status?.status === "purchase_enough" && (
                                                                    <TagColorLime
                                                                        name={`${dataLang[e?.order_status?.status]} (${e?.order_status?.count
                                                                            })`}
                                                                    />
                                                                ))}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={2} textAlign={"left"}>
                                                            {e?.note}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className=" w-fit mx-auto">
                                                            <TagBranch>{e?.branch_name}</TagBranch>
                                                        </RowItemTable>
                                                        <RowItemTable
                                                            colSpan={1}
                                                            className="pl-2 py-2.5 flex space-x-2 justify-center"
                                                        >
                                                            <BtnAction
                                                                onRefresh={_ServerFetching.bind(this)}
                                                                onRefreshGroup={_ServerFetching_group.bind(this)}
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

export default Index;
