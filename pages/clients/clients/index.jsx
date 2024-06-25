import useActionRole from "@/hooks/useRole";
import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
    Grid6,
    Edit as IconEdit
} from "iconsax-react";
import { Tooltip } from "react-tippy";

import Popup_dskh from "./components/popup/popupAdd";
import Popup_chitiet from "./components/popup/popupDetail";

import { BtnAction } from "@/components/UI/BtnAction";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Container, ContainerBody, ContainerFilterTab, ContainerTable } from "@/components/UI/common/layout";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import ImageErrors from "@/components/UI/imageErrors";
import Loading from "@/components/UI/loading";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import TabFilter from "@/components/UI/TabFilter";

import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";

import apiClient from "@/Api/apiClients/client/apiClient";
import apiComons from "@/Api/apiComon/apiComon";
import { reTryQuery } from "@/configs/configRetryQuery";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import { useQuery } from "@tanstack/react-query";
const Index = (props) => {
    const isShow = useToast();

    const dataLang = props.dataLang;

    const router = useRouter();

    const { paginate } = usePagination();

    const statusExprired = useStatusExprired();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkEdit, checkExport } = useActionRole(auth, "client_customers");

    const { limit, updateLimit: sLimit, totalItems: totalItem, updateTotalItems } = useLimitAndTotalItems();

    const initalState = {
        tabPage: router.query?.tab,
        keySearch: "",
        data: {},
        data_ex: [],
        listDs: [],
        listSelectCt: [],
        listBr: [],
        idBranch: null,
    };
    const [isState, setIsState] = useState(initalState);

    const queryState = (key) => setIsState((prev) => ({ ...prev, ...key }));

    const _HandleSelectTab = (e) => {
        router.push({
            pathname: router.route,
            query: { tab: e },
        });
    };

    useEffect(() => {
        router.push({
            pathname: router.route,
            query: { tab: router.query?.tab ? router.query?.tab : 0 },
        });
    }, []);


    const { isLoading, isFetching, refetch } = useQuery({
        queryKey: ["clients", limit, router.query?.page, router.query?.tab, isState.idBranch, isState.keySearch],
        queryFn: async () => {
            const url = `/api_web/${router.query?.tab === "0" || router.query?.tab === "-1" ? "api_client/client?csrf_protection=true" : "api_client/client/?csrf_protection=true"}`

            const id = router.query?.tab

            const params = {
                search: isState.keySearch,
                limit: limit,
                page: router.query?.page || 1,
                "filter[client_group_id]": router.query?.tab != "0" ? (router.query?.tab != "-1" ? id : -1) : null,
                "filter[branch_id]": isState.idBranch?.length > 0 ? isState.idBranch.map((e) => e.value) : null,
            }

            const { rResult, output } = await apiClient.apiListClient({ params: params }, url);

            updateTotalItems(output);

            queryState({ data: rResult, data_ex: rResult });

            return rResult
        },
        ...reTryQuery
    });

    const { isPending: isPendingBranch } = useQuery({
        queryKey: ["clients_branch"],
        queryFn: async () => {
            const { result } = await apiComons.apiBranchCombobox();
            queryState({ listBr: result?.map((e) => ({ label: e.name, value: e.id })) });
            return result
        },
        ...reTryQuery
    });

    const { isPending, refetch: refetchGroup } = useQuery({
        queryKey: ["clients_group", limit, router.query?.page, router.query?.tab, isState.idBranch, isState.keySearch],
        queryFn: async () => {

            const params = {
                limit: 0,
                search: isState.keySearch,
                "filter[branch_id]": isState.idBranch?.length > 0 ? isState.idBranch.map((e) => e.value) : null,
            }

            const { rResult, output } = await apiClient.apiListGroupClient({ params: params });

            queryState({ listDs: rResult })

            return rResult
        },
        ...reTryQuery
    });

    const { } = useQuery({
        queryKey: ["clients_province"],
        queryFn: async () => {
            const { rResult, output } = await apiClient.apiListProvinceClient();
            queryState({ listSelectCt: rResult });
            return rResult
        },
    });

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryState({ keySearch: value });
        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            },
        });
    }, 500);


    //excel
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
                    title: `${dataLang?.client_list_namecode}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_list_name}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_list_repre}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_list_taxtcode}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },

                {
                    title: `${dataLang?.client_list_phone}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_list_adress}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_list_charge}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_list_group}`,
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
                {
                    title: `${dataLang?.client_list_datecre}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],
            data: isState.data_ex?.map((e) => [
                { value: `${e.id}`, style: { numFmt: "0" } },
                { value: `${e.code ? e.code : ""}` },
                { value: `${e.name ? e.name : ""}` },
                { value: `${e.representative ? e.representative : ""}` },
                { value: `${e.tax_code ? e.tax_code : ""}` },
                { value: `${e.phone_number ? e.phone_number : ""}` },
                { value: `${e.address ? e.address : ""}` },
                {
                    value: `${e.staff_charge ? e.staff_charge?.map((i) => i.full_name) : ""}`,
                },
                {
                    value: `${e.client_group ? e.client_group?.map((i) => i.name) : ""}`,
                },
                { value: `${e.branch ? e.branch?.map((i) => i.name) : ""}` },
                { value: `${e.date_create ? e.date_create : ""}` },
            ]),
        },
    ];
    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.client_list_title}</title>
            </Head>
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">{dataLang?.client_list_title || "client_list_title"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.client_list_title || "client_list_title"}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="space-y-0.5 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.client_list_title}
                            </h2>
                            <div className="flex justify-end items-center gap-2">
                                {role == true || checkAdd ? (
                                    <Popup_dskh
                                        listBr={isState.listBr}
                                        listSelectCt={isState.listSelectCt}
                                        onRefresh={refetch.bind(this)}
                                        dataLang={dataLang}
                                        nameModel={"client_contact"}
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
                        <ContainerFilterTab>
                            {isState.listDs &&
                                isState.listDs.map((e) => {
                                    return (
                                        <div key={e.id}>
                                            <TabFilter
                                                backgroundColor={e.color}
                                                key={e.id}
                                                onClick={_HandleSelectTab.bind(this, `${e.id}`)}
                                                total={e.count}
                                                active={e.id}
                                                className={`${e.color ? "text-white" : "text-[#0F4F9E] bg-[#e2f0fe] "}`}
                                            >
                                                {e.name}
                                            </TabFilter>
                                        </div>
                                    );
                                })}
                        </ContainerFilterTab>
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
                                            <OnResetData onClick={() => refetch()} sOnFetching={() => { }} />
                                            {role == true || checkExport ? (
                                                <div className={``}>
                                                    {isState.data_ex?.length > 0 && (
                                                        <ExcelFileComponent
                                                            multiDataSet={multiDataSet}
                                                            filename="Danh sách khách hàng"
                                                            title="Dskh"
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
                            <Customscrollbar>
                                <div className="w-full">
                                    <HeaderTable gridCols={12}>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.client_list_namecode}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.client_list_name}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.client_list_taxtcode}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.client_list_phone}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.client_list_adress}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.client_list_charge}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.client_list_group}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.client_list_brand}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.branch_popup_properties}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {(isLoading || isFetching) ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : isState.data?.length > 0 ? (
                                        <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px] ">
                                            {isState.data?.map((e) => (
                                                <RowTable gridCols={12} key={e.id.toString()}>
                                                    <RowItemTable colSpan={1} textAlign={"center"}>
                                                        {e.code}
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={2} textAlign={"left"}>
                                                        <Popup_chitiet
                                                            dataLang={dataLang}
                                                            className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] px-2 py-0.5  rounded-md text-left text-[#0F4F9E] hover:text-blue-600 transition-all ease-linear"
                                                            name={e.name}
                                                            id={e?.id}
                                                        />
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1} textAlign={"left"}>
                                                        {e.tax_code}
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1} textAlign={"center"}>
                                                        {e.phone_number}
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1} textAlign={"left"}>
                                                        {e.address}
                                                    </RowItemTable>
                                                    <RowItemTable
                                                        colSpan={2}
                                                        className="flex object-cover  justify-start items-center flex-wrap gap-2"
                                                    >
                                                        {e?.staff_charge
                                                            ? e.staff_charge?.map((d) => {
                                                                return (
                                                                    <>
                                                                        <Tooltip
                                                                            title={d.full_name}
                                                                            arrow
                                                                            theme="dark"
                                                                        >
                                                                            <ImageErrors
                                                                                src={d.profile_image}
                                                                                width={40}
                                                                                height={40}
                                                                                defaultSrc="/user-placeholder.jpg"
                                                                                alt="Image"
                                                                                className="min-w-[40px] min-h-[40px] object-cover rounded-[100%] text-left cursor-pointer"
                                                                            />
                                                                        </Tooltip>
                                                                    </>
                                                                );
                                                            })
                                                            : ""}
                                                    </RowItemTable>
                                                    <RowItemTable
                                                        colSpan={2}
                                                        className="flex justify-start flex-wrap items-center"
                                                    >
                                                        {e.client_group?.map((h) => {
                                                            return (
                                                                <span
                                                                    key={h.id}
                                                                    style={{
                                                                        backgroundColor: `${h.color == "" || h.color == null
                                                                            ? "#e2f0fe"
                                                                            : h.color
                                                                            }`,
                                                                        color: `${h.color == "" || h.color == null
                                                                            ? "#0F4F9E"
                                                                            : "white"
                                                                            }`,
                                                                    }}
                                                                    className={`  mr-2 mb-1 w-fit 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] px-2 rounded-md font-[300] py-0.5`}
                                                                >
                                                                    {h.name}
                                                                </span>
                                                            );
                                                        })}
                                                    </RowItemTable>
                                                    <RowItemTable
                                                        colSpan={1}
                                                        className="flex items-center gap-1 flex-wrap"
                                                    >
                                                        {e.branch?.map((i, index) => (
                                                            <TagBranch key={index}>{i.name}</TagBranch>
                                                        ))}
                                                    </RowItemTable>
                                                    <RowItemTable
                                                        colSpan={1}
                                                        className="space-x-2 text-center flex items-center justify-center"
                                                    >
                                                        {role == true || checkEdit ? (
                                                            <Popup_dskh
                                                                listBr={isState.listBr}
                                                                listSelectCt={isState.listSelectCt}
                                                                onRefresh={refetch.bind(this)}
                                                                className="xl:text-base text-xs "
                                                                listDs={isState.listDs}
                                                                dataLang={dataLang}
                                                                name={e.name}
                                                                representative={e.representative}
                                                                code={e.code}
                                                                tax_code={e.tax_code}
                                                                phone_number={e.phone_number}
                                                                address={e.address}
                                                                date_incorporation={e.date_incorporation}
                                                                note={e.note}
                                                                email={e.email}
                                                                website={e.website}
                                                                debt_limit={e.debt_limit}
                                                                debt_limit_day={e.debt_limit_day}
                                                                debt_begin={e.debt_begin}
                                                                city={e.city}
                                                                district={e.district}
                                                                ward={e.ward}
                                                                id={e?.id}
                                                                nameModel={"client_contact"}
                                                            />
                                                        ) : (
                                                            <IconEdit
                                                                className="cursor-pointer"
                                                                onClick={() => isShow("warning", WARNING_STATUS_ROLE)}
                                                            />
                                                        )}
                                                        <BtnAction
                                                            onRefresh={refetch.bind(this)}
                                                            onRefreshGroup={refetchGroup.bind(this)}
                                                            dataLang={dataLang}
                                                            id={e?.id}
                                                            type="client_customers"
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
