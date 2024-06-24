import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Grid6,
    ArrowDown2 as IconDown,
    Edit as IconEdit,
    Minus as IconMinus
} from "iconsax-react";

import BtnAction from "@/components/UI/btnAction";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Container, ContainerBody, ContainerTable } from "@/components/UI/common/layout";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import Loading from "@/components/UI/loading";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import SelectOptionLever from "@/components/UI/selectOptionLever/selectOptionLever";

import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import useActionRole from "@/hooks/useRole";
import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";

import apiComons from "@/Api/apiComon/apiComon";
import apiCategory from "@/Api/apiProducts/category/apiCategory";
import ContainerPagination from "@/components/UI/common/ContainerPagination/containerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/titlePagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { reTryQuery } from "@/configs/configRetryQuery";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import usePagination from "@/hooks/usePagination";
import { useQuery } from "@tanstack/react-query";
import Popup_ThanhPham from "./components/category/popup";

const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const isShow = useToast();

    const { paginate } = usePagination();

    const dispatch = useDispatch();

    const statusExprired = useStatusExprired();


    const [onFetchingAnother, sOnFetchingAnother] = useState(false);


    const [data, sData] = useState([]);
    //Bộ lọc Chi nhánh
    const [dataBranchOption, sDataBranchOption] = useState([]);

    const [idBranch, sIdBranch] = useState(null);
    //Bộ lọc Chức vụ
    const [dataCategoryOption, sDataCategoryOption] = useState([]);

    const [idCategory, sIdCategory] = useState(null);

    const [keySearch, sKeySearch] = useState("");

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkExport } = useActionRole(auth, "category_products");

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems();


    const { isFetching, refetch } = useQuery({
        queryKey: ["api_category", limit, router.query?.page, idCategory, idBranch, keySearch],
        queryFn: async () => {
            try {
                const params = {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[id]": idCategory?.value ? idCategory?.value : null,
                    "filter[branch_id][]": idBranch?.length > 0 ? idBranch.map((e) => e.value) : null,
                }
                const { output, rResult } = await apiCategory.apiListCategory({ params });
                sData(rResult);
                sTotalItems(output);

            } catch (error) {
            }
        },
        ...reTryQuery
    })

    const _HandleFilterOpt = (type, value) => {
        if (type == "category") {
            sIdCategory(value);
        } else if (type == "branch") {
            sIdBranch(value);
        }
    };

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        sKeySearch(value);
        router.replace(router.route);
    }, 500);

    const { refetch: refetchSup } = useQuery({
        queryKey: ["api_category_option"],
        queryFn: async () => {
            try {
                const { rResult } = await apiCategory.apiOptionCategory();
                sDataCategoryOption(
                    rResult.map((e) => ({
                        label: `${e.name + " " + "(" + e.code + ")"}`,
                        value: e.id,
                        level: e.level,
                        code: e.code,
                        parent_id: e.parent_id,
                    }))
                );
                dispatch({
                    type: "categoty_finishedProduct/update",
                    payload: rResult.map((e) => ({
                        label: `${e.name + " " + "(" + e.code + ")"}`,
                        value: e.id,
                        level: e.level,
                        code: e.code,
                        parent_id: e.parent_id,
                    })),
                });
                return rResult

            } catch (error) { }
        }
    })

    useQuery({
        queryKey: ["api_branch_option"],
        queryFn: async () => {
            try {
                const { result } = await apiComons.apiBranchCombobox();
                sDataBranchOption(result.map((e) => ({ label: e.name, value: e.id })));
                dispatch({
                    type: "branch/update",
                    payload: result.map((e) => ({
                        label: e.name,
                        value: e.id,
                    })),
                });
                return result
            } catch (error) { }
        }
    })

    //Set data cho bộ lọc chi nhánh
    const hiddenOptions = idBranch?.length > 2 ? idBranch?.slice(0, 2) : [];

    const options = dataBranchOption.filter((x) => !hiddenOptions.includes(x.value));

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
                    title: `${dataLang?.category_material_group_code || "category_material_group_code"}`,
                    width: { wpx: 150 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.category_material_group_name || "category_material_group_name"}`,
                    width: { wch: 30 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.note || "note"}`,
                    width: { wch: 30 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_list_brand || "client_list_brand"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],
            data: data.map((e) => [
                { value: `${e.id}`, style: { numFmt: "0" } },
                { value: `${e.code}` },
                { value: `${e.name}` },
                { value: `${e.note}` },
                { value: `${e.branch?.map((e) => e.name).join(", ")}` },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>
                    {dataLang?.header_category_finishedProduct_group || "header_category_finishedProduct_group"}
                </title>
            </Head>
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.header_category_material || "header_category_material"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>
                            {dataLang?.header_category_finishedProduct_group || "header_category_finishedProduct_group"}
                        </h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="space-y-3 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.catagory_finishedProduct_group_title ||
                                    "catagory_finishedProduct_group_title"}
                            </h2>
                            <div className="flex justify-end items-center gap-2">
                                {role == true || checkAdd ? (
                                    <Popup_ThanhPham
                                        onRefresh={refetch.bind(this)}
                                        onRefreshSub={refetchSup.bind(this)}
                                        dataLang={dataLang}
                                        // nameModel={"client_contact"}
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
                                                    ...options,
                                                ]}
                                                onChange={_HandleFilterOpt.bind(this, "branch")}
                                                value={idBranch}
                                                placeholder={dataLang?.price_quote_branch || "price_quote_branch"}
                                                colSpan={3}
                                                components={{ MultiValue }}
                                                isMulti={true}
                                                isClearable={true}
                                                closeMenuOnSelect={false}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label:
                                                            dataLang?.category_material_group_code ||
                                                            "category_material_group_code",
                                                        isDisabled: true,
                                                    },
                                                    ...dataCategoryOption,
                                                ]}
                                                formatOptionLabel={SelectOptionLever}
                                                onChange={_HandleFilterOpt.bind(this, "category")}
                                                value={idCategory}
                                                placeholder={
                                                    dataLang?.category_material_group_code ||
                                                    "category_material_group_code"
                                                }
                                                colSpan={3}
                                                isClearable={true}
                                                closeMenuOnSelect={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex space-x-2 items-center justify-end">
                                            <OnResetData sOnFetching={() => { }} onClick={refetch.bind(this)} />
                                            {role == true || checkExport ? (
                                                <div className={``}>
                                                    {data?.length > 0 && (
                                                        <ExcelFileComponent
                                                            multiDataSet={multiDataSet}
                                                            filename={
                                                                dataLang?.header_category_finishedProduct_group ||
                                                                "header_category_finishedProduct_group"
                                                            }
                                                            title="DSNTP"
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

                            <Customscrollbar className="min:h-[200px] h-[90%] max:h-[650px] pb-2">
                                <div className="w-[100%] lg:w-[100%] ">
                                    <HeaderTable gridCols={11}>
                                        <ColumnTable colSpan={1} />
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.category_material_group_code || "category_material_group_code"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={3} textAlign={"center"}>
                                            {dataLang?.category_material_group_name || "category_material_group_name"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.note || "note"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.client_list_brand || "client_list_brand"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.branch_popup_properties || "branch_popup_properties"}
                                        </ColumnTable>
                                    </HeaderTable>
                                    <div className="divide-y divide-slate-200">
                                        {isFetching ? (
                                            <Loading />
                                        ) : data?.length > 0 ? (
                                            data.map((e) => (
                                                <Item
                                                    onRefresh={refetch.bind(this)}
                                                    onRefreshSub={refetchSup.bind(this)}
                                                    dataLang={dataLang}
                                                    key={e.id}
                                                    data={e}
                                                />
                                            ))
                                        ) : (
                                            <NoData />
                                        )}
                                    </div>
                                </div>
                            </Customscrollbar>
                        </ContainerTable>
                    </div>
                    {data?.length != 0 && (
                        <ContainerPagination className="flex space-x-5 my-2 items-center">
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
        </React.Fragment>
    );
};

const Item = React.memo((props) => {
    const [hasChild, sHasChild] = useState(false);

    const isShow = useToast();

    const _ToggleHasChild = () => sHasChild(!hasChild);

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkEdit } = useActionRole(auth, "category_products");

    useEffect(() => {
        sHasChild(false);
    }, [props.data?.children?.length == null]);

    return (
        <div key={props.data?.id}>
            <RowTable gridCols={11}>
                <RowItemTable colSpan={1} className="flex justify-center">
                    <button
                        disabled={props.data?.children?.length > 0 ? false : true}
                        onClick={_ToggleHasChild.bind(this)}
                        className={`${hasChild ? "bg-red-600" : "bg-green-600 disabled:bg-slate-300"
                            } hover:opacity-80 hover:disabled:opacity-100 transition relative flex flex-col justify-center items-center h-5 w-5 rounded-full text-white outline-none`}
                    >
                        <IconMinus size={16} />
                        <IconMinus size={16} className={`${hasChild ? "" : "rotate-90"} transition absolute`} />
                    </button>
                </RowItemTable>
                <RowItemTable colSpan={2} textAlign={"left"}>
                    {props.data?.code}
                </RowItemTable>
                <RowItemTable colSpan={3} textAlign={"left"}>
                    {props.data?.name}
                </RowItemTable>
                <RowItemTable colSpan={2} textAlign={"left"}>
                    {props.data?.note}
                </RowItemTable>
                <RowItemTable colSpan={2}>
                    <span className="flex gap-2 flex-wrap justify-start ">
                        {props.data?.branch?.map((e) => (
                            <TagBranch key={e?.id}>{e.name}</TagBranch>
                        ))}
                    </span>
                </RowItemTable>
                <RowItemTable colSpan={1} className="flex justify-center space-x-2 px-2">
                    {role == true || checkEdit ? (
                        <Popup_ThanhPham
                            onRefresh={props.onRefresh}
                            onRefreshSub={props.onRefreshSub}
                            dataLang={props.dataLang}
                            id={props.data?.id}
                        />
                    ) : (
                        <IconEdit className="cursor-pointer" onClick={() => isShow("warning", WARNING_STATUS_ROLE)} />
                    )}
                    <BtnAction
                        onRefresh={props.onRefresh}
                        onRefreshGroup={props.onRefreshOpt}
                        dataLang={props.dataLang}
                        id={props.data?.id}
                        type="category_products"
                    />
                </RowItemTable>
            </RowTable>
            {hasChild && (
                <div className="bg-slate-50/50">
                    {props.data?.children?.map((e) => (
                        <ItemsChild
                            onRefresh={props.onRefresh}
                            onRefreshSub={props.onRefreshSub}
                            dataLang={props.dataLang}
                            key={e.id}
                            data={e}
                            grandchild="0"
                            children={e?.children?.map((e) => (
                                <ItemsChild
                                    onRefresh={props.onRefresh}
                                    onRefreshSub={props.onRefreshSub}
                                    dataLang={props.dataLang}
                                    key={e.id}
                                    data={e}
                                    grandchild="1"
                                    children={e?.children?.map((e) => (
                                        <ItemsChild
                                            onRefresh={props.onRefresh}
                                            onRefreshSub={props.onRefreshSub}
                                            dataLang={props.dataLang}
                                            key={e.id}
                                            data={e}
                                            grandchild="2"
                                        />
                                    ))}
                                />
                            ))}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

const ItemsChild = React.memo((props) => {
    const isShow = useToast();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkEdit } = useActionRole(auth, "category_products");
    return (
        <React.Fragment key={props.data?.id}>
            <RowTable gridCols={11}>
                {props.data?.level == "3" && (
                    <RowItemTable colSpan={1} className="h-full flex justify-center items-center pl-24">
                        <IconDown className="rotate-45" />
                    </RowItemTable>
                )}
                {props.data?.level == "2" && (
                    <RowItemTable colSpan={1} className="h-full flex justify-center items-center pl-12">
                        <IconDown className="rotate-45" />
                        <IconMinus className="mt-1.5" />
                        <IconMinus className="mt-1.5" />
                    </RowItemTable>
                )}
                {props.data?.level == "1" && (
                    <RowItemTable colSpan={1} className="h-full flex justify-center items-center ">
                        <IconDown className="rotate-45" />
                        <IconMinus className="mt-1.5" />
                        <IconMinus className="mt-1.5" />
                        <IconMinus className="mt-1.5" />
                        <IconMinus className="mt-1.5" />
                    </RowItemTable>
                )}
                <RowItemTable colSpan={2} textAlign={"left"}>
                    {props.data?.code}
                </RowItemTable>
                <RowItemTable colSpan={3} textAlign={"left"}>
                    {props.data?.name}
                </RowItemTable>
                <RowItemTable colSpan={2} textAlign={"left"}>
                    {props.data?.note}
                </RowItemTable>
                <RowItemTable colSpan={2} className="gap-2 flex flex-wrap px-2">
                    {props.data?.branch.map((e) => (
                        <TagBranch key={e?.id}>{e.name}</TagBranch>
                    ))}
                </RowItemTable>
                <RowItemTable colSpan={1} className="flex justify-center space-x-2">
                    {role == true || checkEdit ? (
                        <Popup_ThanhPham
                            onRefresh={props.onRefresh}
                            onRefreshSub={props.onRefreshSub}
                            dataLang={props.dataLang}
                            data={props.data}
                            id={props.data?.id}
                        />
                    ) : (
                        <IconEdit className="cursor-pointer" onClick={() => isShow("warning", WARNING_STATUS_ROLE)} />
                    )}
                    <BtnAction
                        onRefresh={props.onRefresh}
                        onRefreshGroup={props.onRefreshOpt}
                        dataLang={props.dataLang}
                        id={props.data?.id}
                        type="category_products"
                    />
                </RowItemTable>
            </RowTable>
            {props.children}
        </React.Fragment>
    );
});

export default Index;
