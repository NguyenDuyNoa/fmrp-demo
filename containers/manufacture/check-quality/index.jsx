import apiComons from "@/Api/apiComon/apiComon";
import apiCategoryErrors from "@/Api/apiManufacture/qc/categoryErrors/apiCategoryErrors";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import ButtonAddNew from "@/components/UI/button/buttonAddNew";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import { Container, ContainerBody, ContainerTable } from "@/components/UI/common/layout";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import DateToDateComponent from "@/components/UI/filterComponents/dateTodateComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import Loading from "@/components/UI/loading/loading";
import NoData from "@/components/UI/noData/nodata";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import useActionRole from "@/hooks/useRole";
import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import { routerQc } from "@/routers/manufacture";
import { Grid6 } from "iconsax-react";
import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";
import PopupCheckQuality from "./components/popup";
import Pagination from "/components/UI/pagination";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import { useBranchList } from "@/hooks/common/useBranch";
import { useCheckQualityList } from "./hooks/useCheckQualityList";

const initilaState = {
    data: [],
    data_ex: [],
    keySearch: "",
    onFetching: false,
    onFetchingBranch: false,
    idBranch: [],
};

const CheckQuality = (props) => {
    const router = useRouter();

    const isShow = useToast();

    const dataLang = props.dataLang;

    const statusExprired = useStatusExprired();

    const [isState, sIsState] = useState(initilaState);

    const { paginate } = usePagination();

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkExport, checkEdit, checkAdd } = useActionRole(auth, "client_group");

    // đổi type

    const { limit, updateLimit: sLimit, totalItems: totalItem, updateTotalItems } = useLimitAndTotalItems();

    const { data: listBranch = [] } = useBranchList()

    const params = {
        search: isState.keySearch,
        limit: limit,
        page: router.query?.page || 1,
        branch_id: isState.idBranch?.value ?? "",
    };

    const { data, isFetching, isLoading, refetch } = useCheckQualityList(params)
    console.log("data11", data);


    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryState({ keySearch: value });
        router.replace("/manufacture/check-quality");
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
                <title>{"Kiểm tra chất lượng"}</title>
            </Head>
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">{"QC"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{"Kiểm tra chất lượng"}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="h-full space-y-3 overflow-hidden">
                        <div className="flex justify-between mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {"Kiểm tra chất lượng"}
                            </h2>
                            <ButtonAddNew
                                onClick={() => {
                                    // if (role) {
                                    //     router.push(routerExportToOther.form)
                                    // } else if (checkAdd) {
                                    //     router.push(routerExportToOther.form)
                                    // }
                                    // else {
                                    //     isShow("warning", WARNING_STATUS_ROLE)
                                    // }
                                    router.push(routerQc.form);
                                }}
                                dataLang={dataLang}
                            />
                            {/* <div className="flex items-center justify-end">
                                {role == true || checkAdd ? (
                                    <Popup_groupKh
                                        listBr={isState.listBr}
                                        onRefresh={_ServerFetching.bind(this)}
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
                                            {/* <DateToDateComponent
                                                // value={isState.valueDate}
                                                // onChange={() => queryState({ valueDate: e })}
                                                colSpan={2}
                                            /> */}
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.price_quote_branch || "price_quote_branch",
                                                        isDisabled: true,
                                                    },
                                                    ...listBranch,
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
                                            <OnResetData sOnFetching={(e) => queryState({ onFetching: e })} />
                                            {role == true || checkExport ? (
                                                <div className={``}>
                                                    {data?.dtResult?.length > 0 && (
                                                        <ExcelFileComponent
                                                            multiDataSet={multiDataSet}
                                                            filename="Kiểm tra chất lượng"
                                                            title="KTTCL"
                                                            dataLang={dataLang}
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
                            <Customscrollbar className="min:h-[200px] 3xl:h-[90%] 2xl:h-[85%] xl:h-[82%] lg:h-[88%] max:h-[400px] pb-2">
                                <div className="w-full">
                                    <HeaderTable gridCols={12}>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {"Ngày"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {"Số phiếu QC"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {"Số lệnh sản xuất"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {"Sản phẩm"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {"Số lượng QC"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {"Số lượng đạt"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {"Số lượng lỗi"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {"Ghi chú"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {"Trạng thái"}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {(isLoading || isFetching)
                                        ?
                                        <Loading className="h-80" color="#0f4f9e" />
                                        :
                                        data?.dtResult > 0
                                            ?
                                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px] ">
                                                {
                                                    data?.dtResult?.map((e) => (
                                                        <RowTable gridCols={12} key={e.id.toString()}>
                                                            <RowItemTable colSpan={1} textAlign={"left"}></RowItemTable>
                                                            <RowItemTable colSpan={2} textAlign={"left"}>
                                                                <PopupCheckQuality
                                                                    name="QC-110624142 - Long An"
                                                                    dataLang={dataLang}
                                                                    className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] px-2 text-center text-[#0F4F9E] hover:text-[#5599EC] transition-all ease-linear cursor-pointer "
                                                                    id={e?.id}
                                                                />
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={2} textAlign={"left"}></RowItemTable>
                                                            <RowItemTable colSpan={2} textAlign={"left"}></RowItemTable>
                                                            <RowItemTable colSpan={1} textAlign={"left"}></RowItemTable>
                                                            <RowItemTable colSpan={1} textAlign={"left"}></RowItemTable>
                                                            <RowItemTable colSpan={1} textAlign={"left"}></RowItemTable>
                                                            <RowItemTable colSpan={1} textAlign={"left"}></RowItemTable>
                                                            <RowItemTable colSpan={1} textAlign={"left"}></RowItemTable>
                                                        </RowTable>
                                                    ))
                                                }
                                            </div>
                                            :
                                            <NoData />
                                    }
                                </div>
                            </Customscrollbar>
                        </ContainerTable>
                    </div>
                    {
                        data?.dtResult?.length != 0 && (
                            <ContainerPagination>
                                <TitlePagination dataLang={dataLang} totalItems={data?.countAll} />
                                <Pagination
                                    postsPerPage={limit}
                                    totalPosts={Number(data?.countAll)}
                                    paginate={paginate}
                                    currentPage={router.query?.page || 1}
                                />
                            </ContainerPagination>
                        )
                    }
                </ContainerBody>
            </Container>
        </React.Fragment>
    );
};

export default CheckQuality;
