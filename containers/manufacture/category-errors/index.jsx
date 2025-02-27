import { BtnAction } from "@/components/UI/BtnAction";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { Container, ContainerBody, ContainerTable } from "@/components/UI/common/layout";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import Loading from "@/components/UI/loading/loading";
import NoData from "@/components/UI/noData/nodata";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import { useBranchList } from "@/hooks/common/useBranch";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import useActionRole from "@/hooks/useRole";
import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import { Grid6 } from "iconsax-react";
import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";
import PopupCategoryErrors from "./components/popup";
import { useCategoryErrorsList } from "./hooks/useCategoryErrorsList";
import Pagination from "@/components/UI/pagination";

const initilaState = {
    keySearch: "",
    idBranch: [],
};

const CategoryErrors = (props) => {
    const router = useRouter();

    const isShow = useToast();

    const dataLang = props.dataLang;

    const { paginate } = usePagination()

    const statusExprired = useStatusExprired();

    const [isState, sIsState] = useState(initilaState);

    const { limit, updateLimit: sLimit } = useLimitAndTotalItems();

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkExport, checkEdit, checkAdd } = useActionRole(auth, "client_group");


    const params = {
        search: isState.keySearch,
        limit: limit,
        page: router.query?.page || 1,
        branch_id: isState.idBranch?.value ?? "",
    };

    const { data: dataBranch = [] } = useBranchList()

    const { data, isFetching, isLoading, refetch } = useCategoryErrorsList(params)

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryState({ keySearch: value });
        router.replace("/manufacture/category-errors");
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
                    title: `${dataLang?.error_category || "error_category"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.error_category_name || "error_category_name"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.error_category_note || "error_category_note"}`,
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
            ],
            data: data?.dtResult?.map((e) => [
                { value: `${e.id}`, style: { numFmt: "0" } },
                { value: `${e.code ? e.code : ""}` },
                { value: `${e.name ? e.name : ""}` },
                { value: `${e.note ? e.note : ""}` },
                { value: `${e.name_branch ? e.name_branch : ""}` },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.error_category || "error_category"}</title>
            </Head>
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">{"QC"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.error_category || "error_category"}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="h-full space-y-3 overflow-hidden">
                        <div className="flex justify-between mt-1 mr-2">
                            <h2 className=" 2xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.error_category || "error_category"}
                            </h2>
                            <PopupCategoryErrors
                                onRefresh={refetch.bind(this)}
                                dataLang={dataLang}
                                className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                            />
                            {/* <div className="flex items-center justify-end">
                                {role == true || checkAdd ? (
                                    <Popup_groupKh
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
                            </div> */}
                        </div>
                        <ContainerTable>
                            <div className="space-y-2 xl:space-y-3">
                                <div className="bg-slate-100 w-full rounded-t-lg items-center grid grid-cols-6 2xl:xl:p-2 xl:p-1.5 p-1.5">
                                    <div className="col-span-4">
                                        <div className="grid grid-cols-5">
                                            <SearchComponent
                                                dataLang={dataLang}
                                                onChange={_HandleOnChangeKeySearch.bind(this)}
                                                colSpan={1}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.price_quote_branch || "price_quote_branch",
                                                        isDisabled: true,
                                                    },
                                                    ...dataBranch,
                                                ]}
                                                isClearable={true}
                                                onChange={(e) => queryState({ idBranch: e })}
                                                value={isState.idBranch}
                                                placeholder={dataLang?.price_quote_branch || "price_quote_branch"}
                                                colSpan={2}
                                                closeMenuOnSelect={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex items-center justify-end space-x-2">
                                            <OnResetData sOnFetching={(e) => { }} onClick={refetch.bind(this)} />
                                            {role == true || checkExport ? (
                                                <div className={``}>
                                                    {
                                                        data?.dtResult?.length > 0 && (
                                                            <ExcelFileComponent
                                                                multiDataSet={multiDataSet}
                                                                filename="Danh mục lỗi"
                                                                title="DML"
                                                                dataLang={dataLang}
                                                            />
                                                        )
                                                    }
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
                            <Customscrollbar className="min:h-[200px] 3xl:h-[90%] 2xl:h-[85%] xl:h-[82%] lg:h-[88%] max:h-[400px] pb-2">
                                <div className="w-full">
                                    <HeaderTable gridCols={9}>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.error_category_code || "error_category_code"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.error_category_name || "error_category_name"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.error_category_note || "error_category_note"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.import_branch || "import_branch"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.import_action || "import_action"}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {(isLoading || isFetching) ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : data?.dtResult?.length > 0 ? (
                                        <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px] ">
                                            {data?.dtResult?.map((e) => (
                                                <RowTable gridCols={9} key={e.id.toString()}>
                                                    <RowItemTable colSpan={2} textAlign={"left"}>
                                                        {e?.code}
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={2} textAlign={"left"}>
                                                        {e?.name}
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={2} textAlign={"left"}>
                                                        {e?.note}
                                                    </RowItemTable>
                                                    <RowItemTable
                                                        colSpan={2}
                                                        textAlign={"center"}
                                                        className={"mx-auto"}
                                                    >
                                                        <TagBranch className="w-fit">{e?.name_branch}</TagBranch>
                                                    </RowItemTable>
                                                    <RowItemTable
                                                        colSpan={1}
                                                        className="flex items-center justify-center space-x-2 text-center"
                                                    >
                                                        {/* {role == true || checkEdit ? (
                                                                <PopupCategoryErrors
                                                                    onRefresh={refetch.bind(this)}
                                                                    className="text-xs xl:text-base "
                                                                    listBr={isState.listBr}
                                                                    sValueBr={e.branch}
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
                                                            )} */}
                                                        <PopupCategoryErrors
                                                            onRefresh={refetch.bind(this)}
                                                            className="text-xs xl:text-base "
                                                            dataLang={dataLang}
                                                            id={e.id}
                                                        />
                                                        <BtnAction
                                                            onRefresh={refetch.bind(this)}
                                                            onRefreshGroup={() => { }}
                                                            dataLang={dataLang}
                                                            id={e?.id}
                                                            type="category_errors"
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
                    {data?.dtResult?.length != 0 && (
                        <ContainerPagination>
                            <TitlePagination dataLang={dataLang} totalItems={data?.countAll} />
                            <Pagination
                                postsPerPage={limit}
                                totalPosts={Number(data?.countAll)}
                                paginate={paginate}
                                currentPage={router.query?.page || 1}
                            />
                        </ContainerPagination>
                        // <ContainerPagination>
                        //     <TitlePagination dataLang={dataLang} totalItems={data?.output?.iTotalDisplayRecords} />
                        //     <Pagination
                        //         postsPerPage={limit}
                        //         totalPosts={Number(data?.output?.iTotalDisplayRecords)}
                        //         paginate={paginate}
                        //         currentPage={router.query?.page || 1}
                        //     />
                        // </ContainerPagination>
                    )}
                </ContainerBody>
            </Container>
        </React.Fragment>
    );
};

export default CategoryErrors;
