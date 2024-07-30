import { BtnAction } from "@/components/UI/BtnAction";
import TabFilter from "@/components/UI/TabFilter";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { Container, ContainerBody, ContainerFilterTab, ContainerTable } from "@/components/UI/common/layout";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import Loading from "@/components/UI/loading";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import { useBranchList } from "@/hooks/common/useBranchList";
import { useProvinceList } from "@/hooks/common/useProvinceList";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import useActionRole from "@/hooks/useRole";
import useStatusExprired from "@/hooks/useStatusExprired";
import useTab from "@/hooks/useTab";
import useToast from "@/hooks/useToast";
import { Grid6, Edit as IconEdit } from "iconsax-react";
import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Popup_chitiet from "./components/popup/detail";
import Popup_dsncc from "./components/popup/popup";
import { useSupplierGroup } from "./hooks/useSupplierGroup";
import { useSupplierList } from "./hooks/useSupplierList";

const initalState = {
    keySearch: "",
    idBranch: null,
};

const Supplier = (props) => {
    const dataLang = props.dataLang;

    const isShow = useToast();

    const router = useRouter();

    const tabPage = router.query?.tab;

    const { paginate } = usePagination();

    const statusExprired = useStatusExprired();

    const { handleTab: _HandleSelectTab } = useTab("0")

    const [isState, setIsState] = useState(initalState);

    const { limit, updateLimit: sLimit } = useLimitAndTotalItems();

    const queryState = (key) => setIsState((prev) => ({ ...prev, ...key }));

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkEdit, checkExport } = useActionRole(auth, "suppliers");

    const params = {
        search: isState.keySearch,
        limit: limit,
        page: router.query?.page || 1,
        "filter[supplier_group_id]": tabPage !== "0" ? (tabPage !== "-1" ? tabPage : -1) : null,
        "filter[branch_id]": isState.idBranch?.length > 0 ? isState.idBranch.map((e) => e.value) : null,
    }

    const { data, isFetching, isLoading, refetch } = useSupplierList(params)

    const { data: listBr = [] } = useBranchList({})

    const { data: listGroup, refetch: refetchGroup } = useSupplierGroup(params)

    const { data: listProvince } = useProvinceList({})

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
                    title: `${dataLang?.suppliers_supplier_code} `,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.suppliers_supplier_name}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.suppliers_supplier_reper}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.suppliers_supplier_taxcode}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.suppliers_supplier_phone}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.suppliers_supplier_adress}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.suppliers_supplier_group}`,
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
                    title: `${dataLang?.suppliers_supplier_date}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],
            data: data?.rResult?.map((e) => [
                { value: `${e.id}`, style: { numFmt: "0" } },
                { value: `${e.code ? e.code : ""}` },
                { value: `${e.name ? e.name : ""}` },
                { value: `${e.representative ? e.representative : ""}` },
                { value: `${e.tax_code ? e.tax_code : ""}` },
                { value: `${e.phone_number ? e.phone_number : ""}` },
                { value: `${e.address ? e.address : ""}` },
                {
                    value: `${e.supplier_group ? e.supplier_group?.map((i) => i.name) : ""}`,
                },
                { value: `${e.branch ? e.branch?.map((i) => i.name) : ""}` },
                { value: `${e.date_create ? e.date_create : ""}` },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.suppliers_supplier_title}</title>
            </Head>
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.suppliers_supplier_title || "suppliers_supplier_title"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.suppliers_supplier_title || "suppliers_supplier_title"}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="space-y-0.5 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.suppliers_supplier_title}
                            </h2>
                            <div className="flex justify-end items-center gap-2">
                                {role == true || checkAdd ? (
                                    <Popup_dsncc
                                        listProvince={listProvince}
                                        listBr={listBr}
                                        isState={isState}
                                        onRefresh={refetch.bind(this)}
                                        onRefreshGroup={refetchGroup.bind(this)}
                                        dataLang={dataLang}
                                        nameModel={"suppliers"}
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
                            {listGroup &&
                                listGroup?.map((e) => {
                                    return (
                                        <div>
                                            <TabFilter
                                                backgroundColor="#e2f0fe"
                                                key={e.id}
                                                onClick={_HandleSelectTab.bind(this, `${e.id}`)}
                                                total={e.count}
                                                active={e.id}
                                                className={`text-[#0F4F9E]`}
                                            >
                                                {dataLang[e.name] || e.name}
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
                                                    ...listBr,
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
                                            <OnResetData onClick={refetch.bind(this)} sOnFetching={(e) => { }} />
                                            {role == true || checkExport ? (
                                                <div className={``}>
                                                    {data?.rResult?.length > 0 && (
                                                        <ExcelFileComponent
                                                            multiDataSet={multiDataSet}
                                                            filename="Danh sách nhà cung cấp"
                                                            title="Dsncc"
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
                                    <HeaderTable gridCols={8} display={"grid"}>
                                        <ColumnTable colSpan={1} textAlign="center">
                                            {dataLang?.suppliers_supplier_code || "suppliers_supplier_code"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.suppliers_supplier_name || "suppliers_supplier_name"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.suppliers_supplier_taxcode || "suppliers_supplier_taxcode"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.suppliers_supplier_phone || "suppliers_supplier_phone"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.suppliers_supplier_adress || "suppliers_supplier_adress"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.suppliers_supplier_group || "suppliers_supplier_group"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.client_list_brand || "client_list_brand"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.branch_popup_properties || "branch_popup_properties"}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {(isLoading || isFetching) ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : data?.rResult?.length > 0 ? (
                                        <>
                                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                                {data?.rResult?.map((e) => (
                                                    <RowTable gridCols={8} key={e.id.toString()}>
                                                        <RowItemTable colSpan={1} textAlign={"center"}>
                                                            {e.code}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={"left"}>
                                                            <Popup_chitiet
                                                                dataLang={dataLang}
                                                                className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] px-2 py-0.5 col-span-1   rounded-md text-left text-[#0F4F9E] hover:text-blue-600 transition-all ease-linear"
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
                                                            colSpan={1}
                                                            className="flex justify-start flex-wrap "
                                                        >
                                                            {e.supplier_group?.map((h) => {
                                                                return (
                                                                    <span
                                                                        key={h.id}
                                                                        style={{ backgroundColor: "#e2f0fe" }}
                                                                        className={`text-[#0F4F9E]  mr-2 mb-1 w-fit 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-normal text-[9px] px-2 rounded-md py-0.5`}
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
                                                            {e.branch?.map((i) => (
                                                                <TagBranch key={i}>{i.name}</TagBranch>
                                                            ))}
                                                        </RowItemTable>
                                                        <RowItemTable
                                                            colSpan={1}
                                                            className="space-x-2 text-center flex items-center justify-center"
                                                        >
                                                            {role == true || checkEdit ? (
                                                                <Popup_dsncc
                                                                    onRefresh={refetch.bind(this)}
                                                                    className="xl:text-base text-xs "
                                                                    isState={isState}
                                                                    dataLang={dataLang}
                                                                    listProvince={listProvince}
                                                                    listBr={listBr}
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
                                                                    debt_begin={e.debt_begin}
                                                                    city={e.city}
                                                                    district={e.district}
                                                                    ward={e.ward}
                                                                    id={e?.id}
                                                                    nameModel={"contacts_suppliers"}
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
                                                                onRefreshGroup={refetchGroup.bind(this)}
                                                                dataLang={dataLang}
                                                                id={e?.id}
                                                                type="suppliers"
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

export default Supplier;
