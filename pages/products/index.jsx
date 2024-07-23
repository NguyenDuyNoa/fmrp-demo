import apiComons from "@/api/apiComon/apiComon";
import apiCategory from "@/api/apiProducts/category/apiCategory";
import apiProducts from "@/api/apiProducts/products/apiProducts";
import apiVariant from "@/api/apiSettings/apiVariant";
import { BtnAction } from "@/components/UI/BtnAction";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
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
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import useFeature from "@/hooks/useConfigFeature";
import useSetingServer from "@/hooks/useConfigNumber";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import useActionRole from "@/hooks/useRole";
import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { useQuery } from "@tanstack/react-query";
import { Grid6, TickCircle as IconTick } from "iconsax-react";
import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ModalImage from "react-modal-image";
import { useDispatch, useSelector } from "react-redux";
import Popup_ThanhPham from "./components/product/popupThanhPham";
import Popup_ThongTin from "./components/product/popupThongtin";
const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const { paginate } = usePagination();

    const feature = useFeature()

    const dispatch = useDispatch();

    const statusExprired = useStatusExprired();

    const dataSeting = useSetingServer()

    useEffect(() => {
        router.push({
            pathname: `${router.pathname}`,
            query: { tab: router.query?.tab ? router.query?.tab : "all" },
        });
    }, []);

    const _HandleSelectTab = (e) => {
        router.push({
            pathname: `${router.pathname}`,
            query: { tab: e },
        });
    };

    const isShow = useToast()

    const [openDetail, sOpenDetail] = useState(false);

    const [data, sData] = useState([]);

    const [dataExcel, sDataExcel] = useState([]);

    //Bộ lọc Chi nhánh
    const [dataBranchOption, sDataBranchOption] = useState([]);

    const [idBranch, sIdBranch] = useState(null);
    //Bộ lọc Danh mục
    const [dataCategory, sDataCategory] = useState([]);

    const [valueCategory, sValueCategory] = useState(null);
    //Bộ lọc Thành phẩm
    const [dataFinishedPro, sDataFinishedPro] = useState([]);

    const [valueFinishedPro, sValueFinishedPro] = useState(null);

    const [dataProductExpiry, sDataProductExpiry] = useState({});

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkExport } = useActionRole(auth, 'products');

    const [keySearch, sKeySearch] = useState("");

    const { limit, updateLimit: sLimit, totalItems: totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems()

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting)
    }

    const { isFetching, refetch } = useQuery({
        queryKey: ["api_products", limit, router.query?.page, idBranch, router.query?.tab, valueCategory, valueFinishedPro, keySearch],
        queryFn: async () => {
            const params = {
                search: keySearch,
                limit: limit,
                page: router.query?.page || 1,
                "filter[branch_id][]": idBranch?.length > 0 ? idBranch.map((e) => e.value) : null,
                "filter[type_products]": router.query?.tab === "all" ? 0 : router.query?.tab,
                "filter[category_id]": valueCategory?.value ? valueCategory?.value : "",
                "filter[id]": valueFinishedPro?.value ? valueFinishedPro?.value : "",
            }

            const { output, rResult } = await apiProducts.apiListProducts({ params })

            sData(rResult);


            sDataFinishedPro(
                rResult.map((e) => ({
                    label: `${e.code} (${e.name})`,
                    value: e.id,
                }))
            );
            sDataExcel(rResult);

            sTotalItems(output);

            return rResult
        }
    })

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        sKeySearch(value);
        router.replace(router.route);
    }, 500)

    const db = useQuery({
        queryKey: ["api_orther"],
        queryFn: async () => {
            const { result } = await apiComons.apiBranchCombobox();

            const branch = result?.map((e) => ({ label: e.name, value: e.id }))

            sDataBranchOption(branch);

            dispatch({ type: "branch/update", payload: branch });


            const data = await apiProducts.apiProductTypeProducts();

            dispatch({
                type: "type_finishedProduct/update",
                payload: data?.map((e) => ({
                    label: dataLang[e.name],
                    value: e.code,
                })),
            });

            const { rResult: unit } = await apiComons.apiUnit({});
            dispatch({
                type: "unit_finishedProduct/update",
                payload: unit?.map((e) => ({
                    label: e.unit,
                    value: e.id,
                })),
            });

            const { rResult: variationProducts } = await apiVariant.apiListVariant({});
            dispatch({
                type: "variant_NVL/update",
                payload: variationProducts?.rResult?.map((e) => ({
                    label: e.name,
                    value: e.id,
                    option: e.option,
                })),
            });


            const { rResult: categoryOption } = await apiCategory.apiOptionCategory({});
            sDataCategory(
                categoryOption.map((e) => ({
                    label: `${e.name + " " + "(" + e.code + ")"}`,
                    value: e.id,
                    level: e.level,
                    code: e.code,
                    parent_id: e.parent_id,
                }))
            );

            const { rResult: stage } = await apiProducts.apiStageProducts();
            dispatch({
                type: "stage_finishedProduct/update",
                payload: stage?.map((e) => ({
                    label: e.name,
                    value: e.id,
                })),
            });

            return {
                branch,
                unit,
                variationProducts,
                categoryOption,
                stage,
            }
        }
    })
    useEffect(() => {
        sDataProductExpiry(feature?.dataProductExpiry);
    }, []);

    const _HandleFilterOpt = (type, value) => {
        if (type == "category") {
            sValueCategory(value);
        } else if (type == "branch") {
            sIdBranch(value);
        } else if (type == "finishedPro") {
            sValueFinishedPro(value);
        }
    };

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
                    title: `${dataLang?.category_titel} `,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.code_finishedProduct}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.name_finishedProduct}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.type_finishedProduct}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.unit}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.category_material_list_variant}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.stock}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.note}`,
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
            data: dataExcel?.map((e) => [
                { value: `${e.id}`, style: { numFmt: "0" } },
                { value: `${e.category_name ? e.category_name : ""}` },
                { value: `${e.code ? e.code : ""}` },
                { value: `${e.name ? e.name : ""}` },
                {
                    value: `${e?.type_products?.name ? e?.type_products?.name : ""}`,
                },
                { value: `${e.unit ? e.unit : ""}` },
                { value: `${e.variation ? e.variation?.length : 0}` },
                {
                    value: `${e.stock_quantity ? Number(e?.stock_quantity).toLocaleString() : ""}`,
                },
                { value: `${e.note ? e.note : ""}` },
                { value: `${e.branch ? e.branch?.map((i) => i.name) : ""}` },
            ]),
        },
    ];
    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.header_category_finishedProduct_list}</title>
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
                        <h6>{dataLang?.header_category_finishedProduct_list || "header_category_finishedProduct_list"}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="space-y-0.5 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.list_finishedProduct_title}
                            </h2>
                            <div className="flex justify-end items-center gap-2">
                                {role == true || checkAdd ?
                                    <Popup_ThanhPham
                                        onRefresh={refetch.bind(this)}
                                        dataProductExpiry={dataProductExpiry}
                                        dataLang={dataLang}
                                        setOpen={sOpenDetail}
                                        isOpen={openDetail}
                                        nameModel={"products"}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" /> :
                                    <button
                                        type="button"
                                        onClick={() => {
                                            isShow("warning", WARNING_STATUS_ROLE);
                                        }}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    >{dataLang?.branch_popup_create_new}
                                    </button>
                                }
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 border-[#E7EAEE] border-opacity-70 border-b-[1px]">
                            <button
                                onClick={_HandleSelectTab.bind(this, "all")}
                                className={`${router.query?.tab === "all" ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "
                                    } 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}
                            >
                                {props.dataLang?.all_group}
                            </button>
                            <button
                                onClick={_HandleSelectTab.bind(this, "products")}
                                className={`${router.query?.tab === "products" ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "
                                    } 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}
                            >
                                {dataLang?.product}
                            </button>
                            <button
                                onClick={_HandleSelectTab.bind(this, "semi_products")}
                                className={`${router.query?.tab === "semi_products" ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "
                                    } 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}
                            >
                                {dataLang?.catagory_finishedProduct_type_semi_products}
                            </button>
                            <button
                                onClick={_HandleSelectTab.bind(this, "semi_products_outside")}
                                className={`${router.query?.tab === "semi_products_outside" ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "
                                    } 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}
                            >
                                {dataLang?.catagory_finishedProduct_type_semi_products_outside}
                            </button>
                        </div>
                        <ContainerTable>
                            <div className="xl:space-y-3 space-y-2">
                                <div className="bg-slate-100 w-full rounded-t-lg items-center grid grid-cols-6 2xl:xl:p-2 xl:p-1.5 p-1.5">
                                    <div className="col-span-4">
                                        <div className="grid grid-cols-12 items-center gap-2">
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
                                                    ...dataBranchOption,
                                                ]}
                                                onChange={_HandleFilterOpt.bind(this, "branch")}
                                                value={idBranch}
                                                placeholder={dataLang?.price_quote_branch || 'price_quote_branch'}
                                                colSpan={4}
                                                components={{ MultiValue }}
                                                isMulti={true}
                                                isClearable={true}
                                                closeMenuOnSelect={false}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.category_titel || "category_titel",
                                                        isDisabled: true,
                                                    },
                                                    ...dataCategory,
                                                ]}
                                                formatOptionLabel={SelectOptionLever}
                                                onChange={_HandleFilterOpt.bind(this, "category")}
                                                value={valueCategory}
                                                colSpan={3}
                                                isClearable={true}
                                                placeholder={dataLang?.category_titel || "category_titel"}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: `${dataLang?.product}`,
                                                        isDisabled: true,
                                                    },
                                                    ...dataFinishedPro,
                                                ]}
                                                onChange={_HandleFilterOpt.bind(this, "finishedPro")}
                                                value={valueFinishedPro}
                                                placeholder={dataLang?.product}
                                                colSpan={3}
                                                isClearable={true}
                                                closeMenuOnSelect={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2 ">
                                        <div className="flex space-x-2 items-center justify-end">
                                            <OnResetData sOnFetching={() => { }} onClick={refetch.bind(this)} />
                                            {(role == true || checkExport) ?
                                                <div className={``}>
                                                    {data?.length > 0 && (
                                                        <ExcelFileComponent
                                                            multiDataSet={multiDataSet}
                                                            filename={dataLang?.product}
                                                            title="DSTP"
                                                            dataLang={dataLang}
                                                        />)}
                                                </div>
                                                :
                                                <button onClick={() => isShow('warning', WARNING_STATUS_ROLE)} className={`xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}>
                                                    <Grid6 className="2xl:scale-100 xl:scale-100 scale-75" size={18} />
                                                    <span>{dataLang?.client_list_exportexcel}</span>
                                                </button>
                                            }
                                            <div>
                                                <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Customscrollbar>
                                <div className="w-full">
                                    <HeaderTable gridCols={13}>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.image || "image"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.category_titel}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.code_finishedProduct || 'dataLang?.code_finishedProduct'}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={'center'}>
                                            {dataLang?.product}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.unit || "unit"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.category_material_list_variant || "category_material_list_variant"}
                                        </ColumnTable>
                                        {/* <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.stock || "stock"}
                                        </ColumnTable> */}
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.bom_finishedProduct}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.settings_category_stages_title || "settings_category_stages_title"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.note || "note"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={'center'}>
                                            {dataLang?.client_list_brand || "client_list_brand"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.branch_popup_properties || "branch_popup_properties"}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {isFetching ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : (
                                        <React.Fragment>
                                            {data.length == 0 && (
                                                <NoData />
                                            )}
                                            <div className="divide-y divide-slate-200">
                                                {data.map((e) => (
                                                    <RowTable key={e?.id.toString()} gridCols={13}>
                                                        <RowItemTable colSpan={1} className="justify-center flex self-center">
                                                            {e?.images == null ? (
                                                                <ModalImage
                                                                    small="/no_image.png"
                                                                    large="/no_image.png"
                                                                    className="w-full h-12 rounded object-cover"
                                                                />
                                                            ) : (
                                                                <ModalImage
                                                                    small={e?.images}
                                                                    large={e?.images}
                                                                    className="w-full h-12 rounded object-contain"
                                                                />
                                                            )}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'left'}>
                                                            {e?.category_name}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'left'}>
                                                            <Popup_ThongTin
                                                                id={e?.id}
                                                                dataProductExpiry={dataProductExpiry}
                                                                dataLang={dataLang}
                                                            >
                                                                <button className=" text-[#0F4F9E] hover:text-blue-500 transition-all ease-linear w-fit outline-none">
                                                                    {e?.code}
                                                                </button>
                                                            </Popup_ThongTin>
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={2} textAlign={'left'} className="flex flex-col items-start justify-start">
                                                            <Popup_ThongTin
                                                                id={e?.id}
                                                                dataProductExpiry={dataProductExpiry}
                                                                dataLang={dataLang}
                                                            >
                                                                <button className=" text-[#0F4F9E] hover:text-blue-500 transition-all ease-linear w-fit outline-none  text-left">
                                                                    {e?.name}
                                                                </button>
                                                            </Popup_ThongTin>
                                                            <h6 className="flex gap-1 items-center">
                                                                <span
                                                                    className={`py-[1px] px-1 rounded border h-fit w-fit font-[300] break-words leading-relaxed 2xl:text-[10px] text-[9px]
                                                                     ${(e?.type_products?.id === 0 && "text-lime-500 border-lime-500") ||
                                                                        (e?.type_products?.id === 1 && "text-orange-500 border-orange-500") ||
                                                                        (e?.type_products?.id === 2 && "text-sky-500 border-sky-500")
                                                                        }`}
                                                                >
                                                                    {dataLang[e?.type_products?.name] || ""}
                                                                </span>
                                                            </h6>
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'center'}>
                                                            {e?.unit}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'center'}>
                                                            {formatNumber(e?.variation_count)}
                                                        </RowItemTable>
                                                        {/* <RowItemTable colSpan={1} textAlign={'center'}>
                                                            {formatNumber(e?.stock_quantity)}
                                                        </RowItemTable> */}
                                                        <RowItemTable colSpan={1} className="flex items-center justify-center">
                                                            {
                                                                Number(e?.variation_count) == 0 ?
                                                                    (
                                                                        Number(e?.ct_versions) != 0 && <IconTick className="text-green-500" />
                                                                    )
                                                                    :
                                                                    (
                                                                        Number(e?.variation_count) > Number(e?.ct_versions) ?
                                                                            (
                                                                                Number(e?.ct_versions) == 0 ? "" : formatNumber(e?.ct_versions)
                                                                            )
                                                                            :
                                                                            (
                                                                                <IconTick className="text-green-500" />
                                                                            )
                                                                    )
                                                            }
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className="flex items-center justify-center">
                                                            {Number(e?.ct_versions_stage) == 0 ? (
                                                                ""
                                                            ) : (
                                                                <IconTick className="text-green-500" />
                                                            )}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'left'}>
                                                            {e?.note}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={2} className="flex items-center gap-1 flex-wrap">
                                                            {e?.branch.map((i) => (
                                                                <TagBranch key={i}>
                                                                    {i.name}
                                                                </TagBranch>
                                                            ))}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className="pl-2 py-2.5 flex space-x-2 justify-center">
                                                            <BtnAction
                                                                onRefresh={refetch.bind(this)}
                                                                dataLang={dataLang}
                                                                dataProductExpiry={dataProductExpiry}
                                                                id={e.id}
                                                                name={e.name}
                                                                code={e.code}
                                                                bom={
                                                                    Number(e?.variation_count) == 0 ?
                                                                        (
                                                                            Number(e?.ct_versions) != 0 && true
                                                                        )
                                                                        :
                                                                        (
                                                                            Number(e?.variation_count) > Number(e?.ct_versions) ?
                                                                                (
                                                                                    Number(e?.ct_versions) == 0 ? false : true
                                                                                )
                                                                                :
                                                                                (
                                                                                    true
                                                                                )
                                                                        )

                                                                }
                                                                // bom={Number(e?.ct_versions)}
                                                                stage={Number(e?.ct_versions_stage)}
                                                                type="products"
                                                                typeOpen="add"
                                                                className="bg-slate-100 tooltipBoundary xl:px-2 px-1 xl:py-2 py-1.5 rounded xl:text-[13px] text-xs"
                                                            />
                                                        </RowItemTable>
                                                    </RowTable>
                                                ))}
                                            </div>
                                        </React.Fragment>
                                    )}
                                </div>
                            </Customscrollbar>
                        </ContainerTable>
                    </div>
                    {data?.length != 0 && (
                        <ContainerPagination>
                            <TitlePagination
                                dataLang={dataLang}
                                totalItems={totalItems?.iTotalDisplayRecords}
                            />
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
export default Index;
