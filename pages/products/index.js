import Head from "next/head";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { _ServerInstance as Axios } from "/services/axios";
import {
    SearchNormal1 as IconSearch,
    UserEdit as IconUserEdit,
    TickCircle as IconTick,
    Grid6,
} from "iconsax-react";
import ModalImage from "react-modal-image";

import Loading from "@/components/UI/loading";
import BtnAction from "@/components/UI/BtnAction";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import SelectOptionLever from "@/components/UI/selectOptionLever/selectOptionLever";
import { Container, ContainerBody, ContainerTable } from "@/components/UI/common/layout";

import useToast from "@/hooks/useToast";
import useActionRole from "@/hooks/useRole";
import useFeature from "@/hooks/useConfigFeature";
import useStatusExprired from "@/hooks/useStatusExprired";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";

import Popup_ThanhPham from "./components/product/popupThanhPham";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";

import Popup_ThongTin from "./components/product/popupThongtin";

import useSetingServer from "@/hooks/useConfigNumber";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const feature = useFeature()

    const dispatch = useDispatch();

    const trangthaiExprired = useStatusExprired();

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

    const [onFetching, sOnFetching] = useState(false);

    const [onFetchingAnother, sOnFetchingAnother] = useState(false);
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

    const _ServerFetching = () => {
        Axios(
            "GET",
            "/api_web/api_product/product/?csrf_protection=true",
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id][]": idBranch?.length > 0 ? idBranch.map((e) => e.value) : null,
                    "filter[type_products]": router.query?.tab === "all" ? 0 : router.query?.tab,
                    "filter[category_id]": valueCategory?.value ? valueCategory?.value : "",
                    "filter[id]": valueFinishedPro?.value ? valueFinishedPro?.value : "",
                },
            },
            (err, response) => {
                if (!err) {
                    const { output, rResult } = response.data;
                    sData(rResult);
                    sTotalItems(output);
                }
                sOnFetching(false);
            }
        );
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        sOnFetching(true) ||
            (keySearch && sOnFetching(true)) ||
            (idBranch?.length > 0 && sOnFetching(true)) ||
            (valueCategory && sOnFetching(true)) ||
            (valueFinishedPro && sOnFetching(true));
    }, [limit, router.query?.page, idBranch, router.query?.tab, valueCategory, valueFinishedPro]);

    const paginate = (pageNumber) => {
        router.push({
            pathname: router.route,
            query: { page: pageNumber },
        });
    };

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        sKeySearch(value);
        router.replace(router.route);
        sOnFetching(true);
    }, 500)



    const _ServerFetchingAnother = () => {
        Axios("GET", "/api_web/Api_Branch/branch/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                const { rResult } = response?.data;
                sDataBranchOption(rResult?.map((e) => ({ label: e.name, value: e.id })));
                dispatch({
                    type: "branch/update",
                    payload: rResult?.map((e) => ({
                        label: e.name,
                        value: e.id,
                    })),
                });
            }
        });

        Axios("GET", "/api_web/api_product/productType/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                const data = response?.data;
                dispatch({
                    type: "type_finishedProduct/update",
                    payload: data?.map((e) => ({
                        label: dataLang[e.name],
                        value: e.code,
                    })),
                });
            }
        });

        Axios("GET", "/api_web/Api_unit/unit/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                const { rResult } = response?.data;
                dispatch({
                    type: "unit_finishedProduct/update",
                    payload: rResult?.map((e) => ({
                        label: e.unit,
                        value: e.id,
                    })),
                });
            }
        });

        Axios("GET", "/api_web/Api_variation/variation?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                const { rResult } = response?.data;
                dispatch({
                    type: "variant_NVL/update",
                    payload: rResult?.map((e) => ({
                        label: e.name,
                        value: e.id,
                        option: e.option,
                    })),
                });
            }
        });

        Axios("GET", "api_web/api_product/categoryOption/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                const { rResult } = response.data;
                sDataCategory(
                    rResult.map((e) => ({
                        label: `${e.name + " " + "(" + e.code + ")"}`,
                        value: e.id,
                        level: e.level,
                        code: e.code,
                        parent_id: e.parent_id,
                    }))
                );
            }
        });

        Axios("GET", "/api_web/api_product/product/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                const { rResult } = response.data;
                sDataFinishedPro(
                    rResult.map((e) => ({
                        label: `${e.code} (${e.name})`,
                        value: e.id,
                    }))
                );
                sDataExcel(rResult);
            }
        });

        Axios("GET", `/api_web/api_product/stage/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                const { rResult } = response.data;
                dispatch({
                    type: "congdoan_finishedProduct/update",
                    payload: rResult?.map((e) => ({
                        label: e.name,
                        value: e.id,
                    })),
                });
            }
        });
        sOnFetchingAnother(false);
    };

    useEffect(() => {
        onFetchingAnother && _ServerFetchingAnother();
    }, [onFetchingAnother]);

    useEffect(() => {
        sOnFetchingAnother(true);
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
                {trangthaiExprired ? (
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
                                        onRefresh={_ServerFetching.bind(this)}
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
                                className={`${router.query?.tab === "all"
                                    ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]"
                                    : "hover:text-[#0F4F9E] "
                                    } 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}
                            >
                                {props.dataLang?.all_group}
                            </button>
                            <button
                                onClick={_HandleSelectTab.bind(this, "products")}
                                className={`${router.query?.tab === "products"
                                    ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]"
                                    : "hover:text-[#0F4F9E] "
                                    } 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}
                            >
                                {dataLang?.product}
                            </button>
                            <button
                                onClick={_HandleSelectTab.bind(this, "semi_products")}
                                className={`${router.query?.tab === "semi_products"
                                    ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]"
                                    : "hover:text-[#0F4F9E] "
                                    } 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}
                            >
                                {dataLang?.catagory_finishedProduct_type_semi_products}
                            </button>
                            <button
                                onClick={_HandleSelectTab.bind(this, "semi_products_outside")}
                                className={`${router.query?.tab === "semi_products_outside"
                                    ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]"
                                    : "hover:text-[#0F4F9E] "
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
                                            <OnResetData sOnFetching={sOnFetching} />
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
                                    <div className="grid grid-cols-13 items-center sticky top-0 rounded-xl shadow-sm bg-white divide-x p-2 z-10 ">
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.image || "image"}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.category_titel}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.code_finishedProduct}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.name_finishedProduct}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.type_finishedProduct}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.unit || "unit"}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.category_material_list_variant || "category_material_list_variant"}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.stock || "stock"}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.bom_finishedProduct}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.settings_category_stages_title || "settings_category_stages_title"}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.note || "note"}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.client_list_brand || "client_list_brand"}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.branch_popup_properties || "branch_popup_properties"}
                                        </h4>
                                    </div>
                                    {onFetching ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : (
                                        <React.Fragment>
                                            {data.length == 0 && (
                                                <NoData />
                                            )}
                                            <div className="divide-y divide-slate-200">
                                                {data.map((e) => (
                                                    <div key={e?.id.toString()} className="grid grid-cols-13 items-center p-2 hover:bg-slate-50 relative">
                                                        <div className="col-span-1  justify-center flex self-center">
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
                                                        </div>
                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] col-span-1 xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5  rounded-md text-left">
                                                            {e?.category_name}
                                                        </h6>
                                                        <div className="3xl:text-base 2xl:text-[12.5px] col-span-1 xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5  rounded-md text-left">
                                                            <Popup_ThongTin
                                                                id={e?.id}
                                                                dataProductExpiry={dataProductExpiry}
                                                                dataLang={dataLang}
                                                            >
                                                                <button className=" text-[#0F4F9E] hover:text-blue-500 transition-all ease-linear w-fit outline-none">
                                                                    {e?.code}
                                                                </button>
                                                            </Popup_ThongTin>
                                                        </div>
                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] col-span-1 xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5  rounded-md text-left">
                                                            {e?.name}
                                                        </h6>
                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] col-span-1 xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5  rounded-md text-left">
                                                            <span
                                                                className={`xl:py-[1px] xl:px-1.5 px-0.5 rounded border h-fit font-[300] break-words leading-relaxed ${(e?.type_products?.id === 0 &&
                                                                    "text-lime-500 border-lime-500") ||
                                                                    (e?.type_products?.id === 1 &&
                                                                        "text-orange-500 border-orange-500") ||
                                                                    (e?.type_products?.id === 2 &&
                                                                        "text-sky-500 border-sky-500")
                                                                    }`}
                                                            >
                                                                {dataLang[e?.type_products?.name] || ""}
                                                            </span>
                                                        </h6>
                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] col-span-1 xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5  rounded-md text-center">
                                                            {e?.unit}
                                                        </h6>
                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] col-span-1 xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5  rounded-md text-center">
                                                            {formatNumber(e?.variation_count)}
                                                        </h6>
                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] col-span-1 xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5  rounded-md text-center">
                                                            {formatNumber(e?.stock_quantity)}
                                                        </h6>
                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] col-span-1 xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5  rounded-md text-center flex items-center justify-center">
                                                            {Number(e?.variation_count) == 0 ? (
                                                                Number(e?.ct_versions) != 0 && (
                                                                    <IconTick className="text-green-500" />
                                                                )
                                                            ) : Number(e?.variation_count) > Number(e?.ct_versions) ? (
                                                                Number(e?.ct_versions) == 0 ? (
                                                                    ""
                                                                ) : (
                                                                    formatNumber(e?.ct_versions)
                                                                )
                                                            ) : (
                                                                <IconTick className="text-green-500" />
                                                            )}
                                                        </h6>
                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] col-span-1 xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5  rounded-md flex items-center justify-center">
                                                            {Number(e?.ct_versions_stage) == 0 ? (
                                                                ""
                                                            ) : (
                                                                <IconTick className="text-green-500" />
                                                            )}
                                                        </h6>
                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] col-span-1 xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5  rounded-md text-left">
                                                            {e?.note}
                                                        </h6>
                                                        <div className="px-2 py-2.5 col-span-1 flex flex-wrap">
                                                            {e?.branch.map((e) => (
                                                                <h6
                                                                    key={e?.id.toString()}
                                                                    className="xl:text-[14px] text-xs mr-1 mb-1 xl:py-[1px] xl:px-1.5 px-0.5 text-[#0F4F9E] rounded border border-[#0F4F9E] h-fit font-[300] break-words"
                                                                >
                                                                    {e?.name}
                                                                </h6>
                                                            ))}
                                                        </div>
                                                        <div className="pl-2 py-2.5 col-span-1 flex space-x-2 justify-center">
                                                            <BtnAction
                                                                onRefresh={_ServerFetching.bind(this)}
                                                                dataLang={dataLang}
                                                                dataProductExpiry={dataProductExpiry}
                                                                id={e.id}
                                                                name={e.name}
                                                                code={e.code}
                                                                bom={Number(e?.ct_versions)}
                                                                stage={Number(e?.ct_versions_stage)}
                                                                type="products"
                                                                typeOpen="add"
                                                                className="bg-slate-100 tooltipBoundary xl:px-2 px-1 xl:py-2 py-1.5 rounded xl:text-[13px] text-xs"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </React.Fragment>
                                    )}
                                </div>
                            </Customscrollbar>
                        </ContainerTable>
                    </div>
                    {data?.length != 0 && (
                        <div className="flex space-x-5 my-2 items-center">
                            <h6>
                                {/* Hiển thị {totalItems?.iTotalDisplayRecords} thành phần */}
                                {dataLang?.display} {totalItems?.iTotalDisplayRecords} {dataLang?.ingredient}
                                {/* trong số {totalItems?.iTotalRecords} biến thể */}
                            </h6>
                            <Pagination
                                postsPerPage={limit}
                                totalPosts={Number(totalItems?.iTotalDisplayRecords)}
                                paginate={paginate}
                                currentPage={router.query?.page || 1}
                            />
                        </div>
                    )}
                </ContainerBody>
            </Container>
        </React.Fragment>
    );
};
export default Index;
