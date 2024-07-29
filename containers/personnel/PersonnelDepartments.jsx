import { BtnAction } from "@/components/UI/BtnAction";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { Container, ContainerBody, ContainerTable } from "@/components/UI/common/layout";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
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
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import useActionRole from "@/hooks/useRole";
import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import { Grid6, Edit as IconEdit } from "iconsax-react";
import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";
import Popup_phongban from "./components/departments/popup";
import { useDepartmentList } from "./hooks/departments/useDepartmentList";


const initalState = {
    keySearch: "",
    onFetchingBrand: false,
    valueBr: [],
};
const PersonnelDepartments = (props) => {
    const router = useRouter();

    const dataLang = props.dataLang;

    const { paginate } = usePagination();

    const isShow = useToast();

    const statusExprired = useStatusExprired();

    const { limit, updateLimit: sLimit, totalItems: totalItem, updateTotalItems: sTotalItem } = useLimitAndTotalItems();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkEdit, checkExport } = useActionRole(auth, "department");

    const [isState, sIsState] = useState(initalState);

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));


    const params = {
        search: isState.keySearch,
        limit: limit,
        page: router.query?.page || 1,
        "filter[branch_id]": isState.valueBr?.length > 0 ? isState.valueBr.map((e) => e.value) : null,
    }

    const { data, isFetching, refetch } = useDepartmentList(params, sTotalItem);

    const { data: listBranch = [] } = useBranchList();

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryState({ keySearch: value });
        router.replace("/personnels/departments");
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
                    title: `${dataLang?.personnels_deparrtments_name}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.personnels_deparrtments_email}`,
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
            data: data?.rResult?.map((e) => [
                { value: `${e.id}`, style: { numFmt: "0" } },
                { value: `${e.name ? e.name : ""}` },
                { value: `${e.email ? e.email : ""}` },
                { value: `${e.branch ? e.branch?.map((i) => i.name) : ""}` },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.personnels_deparrtments_title}</title>
            </Head>
            <Container>
                {statusExprired ? (
                    <div className="p-2"></div>
                ) : (
                    <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                        <h6 className="text-[#141522]/40">{dataLang?.personnels_deparrtments_title}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.personnels_deparrtments_title}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="space-y-3 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.personnels_deparrtments_title}
                            </h2>
                            <div className="flex justify-end items-center gap-2">
                                {role == true || checkAdd ? (
                                    <Popup_phongban
                                        isState={isState}
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

                        <ContainerTable>
                            <div className="xl:space-y-3 space-y-2">
                                <div className="bg-slate-100 w-full rounded grid grid-cols-6 items-center justify-between xl:p-3 p-2">
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
                                                    ...listBranch,
                                                ]}
                                                onChange={(e) => queryState({ valueBr: e })}
                                                value={isState.valueBr}
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
                                                            filename="Phòng ban"
                                                            title="Pb"
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
                            <Customscrollbar className="min:h-[500px] 2xl:h-[92%] xl:h-[69%] h-[72%] max:h-[800px]   overflow-auto pb-2">
                                <div className="w-full">
                                    <HeaderTable gridCols={12} display={"grid"}>
                                        <ColumnTable colSpan={3} textAlign={"center"}>
                                            {dataLang?.personnels_deparrtments_name || "personnels_deparrtments_name"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={3} textAlign={"center"}>
                                            {dataLang?.personnels_deparrtments_email || "personnels_deparrtments_email"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={4} textAlign={"center"}>
                                            {dataLang?.client_list_brand || "client_list_brand"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.branch_popup_properties || "branch_popup_properties"}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {isFetching ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : data?.rResult?.length > 0 ? (
                                        <>
                                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px] ">
                                                {data?.rResult?.map((e) => (
                                                    <RowTable gridCols={12} key={e.id.toString()}>
                                                        <RowItemTable colSpan={3} textAlign={"left"}>
                                                            {e.name}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={3} textAlign={"left"}>
                                                            {e.email}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={4}>
                                                            <span className="flex flex-wrap space-x-2">
                                                                {e.branch?.map((i) => (
                                                                    <TagBranch key={i}>{i.name}</TagBranch>
                                                                ))}
                                                            </span>
                                                        </RowItemTable>
                                                        <RowItemTable
                                                            colSpan={2}
                                                            className="space-x-2 text-center flex items-center justify-center"
                                                        >
                                                            {role == true || checkEdit ? (
                                                                <Popup_phongban
                                                                    onRefresh={refetch.bind(this)}
                                                                    className="xl:text-base text-xs "
                                                                    isState={isState}
                                                                    sValueBr={e.branch}
                                                                    dataLang={dataLang}
                                                                    name={e.name}
                                                                    email={e.email}
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
                                                                type="department"
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

export default PersonnelDepartments;
