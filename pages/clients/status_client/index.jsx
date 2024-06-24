import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import {
    Grid6,
    Edit as IconEdit
} from "iconsax-react";
import "react-phone-input-2/lib/style.css";

import BtnAction from "@/components/UI/btnAction";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import ContainerPagination from "@/components/UI/common/containerPagination/containerPagination";
import TitlePagination from "@/components/UI/common/containerPagination/titlePagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { EmptyExprired } from "@/components/UI/common/emptyExprired";
import { Container, ContainerBody, ContainerTable } from "@/components/UI/common/layout";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/table";
import TagBranch from "@/components/UI/common/tag/TagBranch";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import Loading from "@/components/UI/loading";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import Popup_status from "./components/popup";

import apiStatus from "@/Api/apiClients/status/apiStatus";
import apiComons from "@/Api/apiComon/apiComon";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import useActionRole from "@/hooks/useRole";
import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import { useQuery } from "@tanstack/react-query";

const Index = (props) => {
    const isShow = useToast();

    const router = useRouter();

    const dataLang = props.dataLang;

    const { paginate } = usePagination();

    const statusExprired = useStatusExprired();

    const initilaState = {
        data: [],
        listBr: [],
        data_ex: [],
        idBranch: [],
        keySearch: "",
        onFetching: false,
        onFetchingBranch: false,
    };

    const [isState, sIsState] = useState(initilaState);

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkExport, checkEdit, checkAdd } = useActionRole(auth, "client_status");

    const { limit, updateLimit: sLimit, totalItems: totalItem, updateTotalItems } = useLimitAndTotalItems();


    const { isLoading, isFetching, refetch } = useQuery({
        queryKey: ["client_status", limit, router.query?.page, isState.idBranch, isState.keySearch],
        queryFn: async () => {
            const params = {
                search: isState.keySearch,
                limit: limit,
                page: router.query?.page || 1,
                "filter[branch_id]": isState.idBranch?.length > 0 ? isState.idBranch.map((e) => e.value) : null,
            }

            const { rResult, output } = await apiStatus.apiListStatus({ params: params })

            updateTotalItems(output);

            queryState({ data: rResult || [], data_ex: rResult || [] });

            return rResult
        }
    })

    const { isLoading: loadingBranch } = useQuery({
        queryKey: ["apiBranch"],
        queryFn: async () => {

            const { result } = await apiComons.apiBranchCombobox();

            queryState({ listBr: result?.map((e) => ({ label: e.name, value: e.id })) });

            return result
        }
    })

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryState({ keySearch: value });
        router.replace("/clients/status_client");
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
                    title: `${dataLang?.client_group_statusclient}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_group_colorcode}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_list_brand}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],
            data: isState.data_ex?.map((e) => [
                { value: `${e.id}`, style: { numFmt: "0" } },
                { value: `${e.name ? e.name : ""}` },
                { value: `${e.color ? e.color : ""}` },
                { value: `${e.branch ? e.branch?.map((i) => i.name) : ""}` },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.client_group_statusclient}</title>
            </Head>

            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">{dataLang?.client_group_client || "client_group_client"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.client_group_statusclient || "client_group_statusclient"}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="space-y-3 h-full overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.client_group_statusctitle}
                            </h2>
                            <div className="flex justify-end items-center">
                                {role == true || checkAdd ? (
                                    <Popup_status
                                        listBr={isState.listBr}
                                        onRefresh={refetch.bind(this)}
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
                        <ContainerTable>
                            <div className="xl:space-y-3 space-y-2">
                                <div className="bg-slate-100 w-full rounded-t-lg items-center grid grid-cols-6 2xl:xl:p-2 xl:p-1.5 p-1.5">
                                    <div className="col-span-4">
                                        <div className="grid grid-cols-9 gap-2">
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
                                                    ...isState.listBr,
                                                ]}
                                                onChange={(e) => queryState({ idBranch: e })}
                                                value={isState.idBranch}
                                                placeholder={dataLang?.price_quote_branch || "price_quote_branch"}
                                                colSpan={3}
                                                components={{ MultiValue }}
                                                isMulti={true}
                                                closeMenuOnSelect={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex space-x-2 items-center justify-end">
                                            <OnResetData onClick={() => refetch()} sOnFetching={(e) => { }} />
                                            {role == true || checkExport ? (
                                                <div className={``}>
                                                    {isState.data_ex?.length > 0 && (
                                                        <ExcelFileComponent
                                                            multiDataSet={multiDataSet}
                                                            filename="Trạng thái khách hàng"
                                                            title="Ttkh"
                                                            dataLang={dataLang}
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
                            <Customscrollbar className="min:h-[200px] 3xl:h-[90%] 2xl:h-[85%] xl:h-[82%] lg:h-[88%] max:h-[400px] pb-2">
                                <div className="w-full">
                                    <HeaderTable gridCols={12}>
                                        <ColumnTable colSpan={4} textAlign="center">
                                            {dataLang?.client_group_statusclient || "client_group_statusclient"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign="center">
                                            {dataLang?.client_group_colorcode || "client_group_colorcode"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign="center">
                                            {dataLang?.client_group_color || "client_group_color"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign="center">
                                            {dataLang?.client_list_brand || "client_list_brand"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign="center">
                                            {dataLang?.branch_popup_properties || "branch_popup_properties"}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {(isLoading || isFetching) ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : isState.data?.length > 0 ? (
                                        <>
                                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px]">
                                                {isState.data?.map((e) => (
                                                    <RowTable gridCols={12} key={e.id.toString()}>
                                                        <RowItemTable colSpan={4} textAlign="left">
                                                            {e.name}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={2} textAlign="center">
                                                            {e.color}
                                                        </RowItemTable>
                                                        <RowItemTable
                                                            colSpan={2}
                                                            textAlign="center"
                                                            backgroundColor={e.color}
                                                            className="rounded-md py-1"
                                                        >
                                                            {e.color}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={2}>
                                                            <span className="flex flex-wrap justify-start gap-2">
                                                                {e?.branch?.map((e) => (
                                                                    <TagBranch key={e?.id}>{e?.name}</TagBranch>
                                                                ))}
                                                            </span>
                                                        </RowItemTable>
                                                        <RowItemTable
                                                            colSpan={2}
                                                            className="space-x-2 text-center flex items-center justify-center"
                                                        >
                                                            {role == true || checkEdit ? (
                                                                <Popup_status
                                                                    listBr={isState.listBr}
                                                                    sValueBr={e.branch}
                                                                    onRefresh={refetch.bind(this)}
                                                                    className="xl:text-base text-xs "
                                                                    dataLang={dataLang}
                                                                    name={e.name}
                                                                    color={e.color}
                                                                    id={e.id}
                                                                />
                                                            ) : (
                                                                <IconEdit
                                                                    className="cursor-pointer"
                                                                    onClick={() =>
                                                                        isShow("warning", WARNING_STATUS_ROLE)
                                                                    }
                                                                />
                                                            )}
                                                            <BtnAction
                                                                onRefresh={refetch.bind(this)}
                                                                onRefreshGroup={() => { }}
                                                                dataLang={dataLang}
                                                                id={e?.id}
                                                                type="client_status"
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
                    {isState.data?.length != 0 && (
                        <ContainerPagination>
                            <TitlePagination dataLang={dataLang} totalItems={totalItem?.iTotalDisplayRecords} />
                            <Pagination
                                postsPerPage={limit}
                                totalPosts={Number(totalItem?.iTotalDisplayRecords)}
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

export default Index;
