import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Loading from "@/components/UI/loading";
import Pagination from "@/components/UI/pagination";
import PopupEdit from "@/components/UI/popup";
import { debounce } from "lodash";
import moment from "moment";
import { _ServerInstance as Axios } from "/services/axios";

import {
    Grid6,
    Edit as IconEdit,
    UserEdit as IconUserEdit
} from "iconsax-react";
const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});

import OnResetData from "@/components/UI/btnResetData/btnReset";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import SelectOptionLever from "@/components/UI/selectOptionLever/selectOptionLever";

import BtnAction from "@/components/UI/BtnAction";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import { ColumnTablePopup, HeaderTablePopup } from "@/components/UI/common/TablePopup";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { Container, ContainerBody } from "@/components/UI/common/layout";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import NoData from "@/components/UI/noData/nodata";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import useFeature from "@/hooks/useConfigFeature";
import useSetingServer from "@/hooks/useConfigNumber";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import useActionRole from "@/hooks/useRole";
import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import ModalImage from "react-modal-image";
import Popup_NVL from "./components/items/popupNvl";
import usePagination from "@/hooks/usePagination";
const Index = (props) => {
    const dataLang = props.dataLang;

    const { paginate } = usePagination();

    const router = useRouter();

    const isShow = useToast();

    const dispatch = useDispatch();

    const feature = useFeature()

    const [data, sData] = useState([]);

    const dataSeting = useSetingServer()

    const statusExprired = useStatusExprired();

    const [onFetching, sOnFetching] = useState(false);

    const [onFetchingUnit, sOnFetchingUnit] = useState(false);

    //Bộ lọc Danh mục
    const [dataCateOption, sDataCateOption] = useState([]);

    const [idCategory, sIdCategory] = useState(null);
    //Bộ lọc Chi nhánh
    const [dataBranchOption, sDataBranchOption] = useState([]);

    const [idBranch, sIdBranch] = useState(null);


    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkEdit, checkExport } = useActionRole(auth, 'materials');

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting)
    }

    const _HandleFilterOpt = (type, value) => {
        if (type == "category") {
            sIdCategory(value);
        } else if (type == "branch") {
            sIdBranch(value);
        }
    };

    const [keySearch, sKeySearch] = useState("");

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems()

    const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});

    const _ServerFetching = () => {
        Axios(
            "GET",
            "/api_web/api_material/material?csrf_protection=true",
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[category_id]": idCategory?.value ? idCategory?.value : null,
                    "filter[branch_id][]": idBranch?.length > 0 ? idBranch.map((e) => e.value) : null,
                },
            },
            (err, response) => {
                if (!err) {
                    var { output, rResult } = response.data;
                    sData(rResult);
                    sTotalItems(output);
                }
                sOnFetching(false);
            }
        );
    };

    useEffect(() => {
        onFetching && _ServerFetching();
        sDataMaterialExpiry(feature?.dataProductSerial)
    }, [onFetching]);

    useEffect(() => {
        sOnFetching(true) ||
            (keySearch && sOnFetching(true)) ||
            (idCategory && sOnFetching(true)) ||
            (idBranch?.length > 0 && sOnFetching(true)) ||
            (router.query?.page && sOnFetching(true));
    }, [limit, router.query?.page, idCategory, idBranch]);

    const _ServerFetchingUnit = () => {
        Axios("GET", "/api_web/Api_unit/unit/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var { rResult } = response.data;
                dispatch({
                    type: "unit_NVL/update",
                    payload: rResult.map((e) => ({
                        label: e.unit,
                        value: e.id,
                    })),
                });
            }
        });
        Axios("GET", "/api_web/Api_Branch/branch/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var { rResult } = response.data;
                sDataBranchOption(rResult.map((e) => ({ label: e.name, value: e.id })));
                dispatch({
                    type: "branch/update",
                    payload: rResult.map((e) => ({
                        label: e.name,
                        value: e.id,
                    })),
                });
            }
        });
        Axios("GET", "/api_web/api_material/categoryOption?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var { rResult } = response.data;
                sDataCateOption(
                    rResult.map((x) => ({
                        label: `${x.name + " " + "(" + x.code + ")"}`,
                        value: x.id,
                        level: x.level,
                        code: x.code,
                        parent_id: x.parent_id,
                    }))
                );
            }
        });
        Axios("GET", "/api_web/Api_variation/variation?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var { rResult } = response.data;
                dispatch({
                    type: "variant_NVL/update",
                    payload: rResult.map((e) => ({
                        label: e.name,
                        value: e.id,
                        option: e.option,
                    })),
                });
            }
        });
        sOnFetchingUnit(false);
    };

    useEffect(() => {
        onFetchingUnit && _ServerFetchingUnit();
    }, [onFetchingUnit]);

    useEffect(() => {
        sOnFetchingUnit(true);
    }, []);

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        sKeySearch(value);
        router.replace(router.route);
        sOnFetching(true);
    }, 500)

    //Set data cho bộ lọc chi nhánh
    const hiddenOptions = idBranch?.length > 2 ? idBranch?.slice(0, 2) : [];

    const options = dataBranchOption.filter((x) => !hiddenOptions.includes(x.value));

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
                    title: `${dataLang?.category_material_group_name}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.category_material_list_code}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.category_material_list_name}`,
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
                    title: `${dataLang?.stock}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.minimum_amount}`,
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
                    title: `${dataLang?.category_material_list_variant}`,
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
            data: data.map((e) => [
                { value: `${e.id}`, style: { numFmt: "0" } },
                { value: `${e.category_name}` },
                { value: `${e.code}` },
                { value: `${e.name}` },
                { value: `${e.unit}` },
                { value: formatNumber(e.stock_quantity) },
                { value: formatNumber(e.minimum_quantity) },
                { value: `${e.note}` },
                { value: `${e.variation?.length}` },
                { value: `${JSON.stringify(e.branch?.map((e) => e.name))}` },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.header_category_material_list}</title>
            </Head>
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.list_btn_seting_category || "list_btn_seting_category"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.header_category_material_list || "header_category_material_list"}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="space-y-3 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.category_material_list_title}
                            </h2>
                            <div className="flex justify-end items-center gap-2">
                                {role == true || checkAdd ?
                                    <Popup_NVL
                                        dataMaterialExpiry={dataMaterialExpiry}
                                        onRefresh={_ServerFetching.bind(this)}
                                        dataLang={dataLang}
                                        nameModel={"materials"}
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
                                            placeholder={dataLang?.price_quote_branch || 'price_quote_branch'}
                                            colSpan={3}
                                            isClearable={true}
                                            components={{ MultiValue }}
                                            isMulti={true}
                                            closeMenuOnSelect={false}
                                        />
                                        <SelectComponent
                                            options={[
                                                {
                                                    value: "",
                                                    label: dataLang?.category_material_group_name || 'category_material_group_name',
                                                    isDisabled: true,
                                                },
                                                ...dataCateOption,
                                            ]}
                                            isClearable={true}
                                            onChange={_HandleFilterOpt.bind(this, "category")}
                                            value={idCategory}
                                            placeholder={dataLang?.category_material_group_name || "category_material_group_name"}
                                            colSpan={3}
                                            formatOptionLabel={SelectOptionLever}
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
                                                        filename="Danh sách nvl"
                                                        title="DSNVL"
                                                        dataLang={dataLang}
                                                    />
                                                )}
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
                                    <ColumnTable colSpan={2} textAlign={'center'}>
                                        {dataLang?.category_material_group_name || "category_material_group_name"}
                                    </ColumnTable>
                                    <ColumnTable colSpan={1} textAlign={'center'}>
                                        {dataLang?.category_material_list_code || "category_material_list_code"}
                                    </ColumnTable>
                                    <ColumnTable colSpan={2} textAlign={'center'}>
                                        {dataLang?.category_material_list_name || "category_material_list_name"}
                                    </ColumnTable>
                                    <ColumnTable colSpan={1} textAlign={'center'}>
                                        {dataLang?.unit || "unit"}
                                    </ColumnTable>
                                    <ColumnTable colSpan={1} textAlign={'center'}>
                                        {dataLang?.stock || "stock"}
                                    </ColumnTable>
                                    <ColumnTable colSpan={1} textAlign={'center'}>
                                        {dataLang?.note || "note"}
                                    </ColumnTable>
                                    <ColumnTable colSpan={1} textAlign={'center'}>
                                        {dataLang?.category_material_list_variant || "category_material_list_variant"}
                                    </ColumnTable>
                                    <ColumnTable colSpan={2} textAlign={'center'}>
                                        {dataLang?.client_list_brand || "client_list_brand"}
                                    </ColumnTable>
                                    <ColumnTable colSpan={1} textAlign={'center'}>
                                        {dataLang?.branch_popup_properties || "branch_popup_properties"}
                                    </ColumnTable>
                                </HeaderTable>
                                {onFetching ? (
                                    <Loading className="h-80" color="#0f4f9e" />
                                ) : (
                                    <React.Fragment>
                                        {data.length == 0 && (
                                            <NoData />
                                        )}
                                        <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px] ">
                                            {data.map((e) => (
                                                <RowTable gridCols={13} key={e?.id ? e?.id.toString() : ""}>
                                                    <RowItemTable colSpan={1} className="select-none justify-center flex">
                                                        <div className="w-[48px] h-[48px] mx-auto">
                                                            {e?.images == null ? (
                                                                <ModalImage
                                                                    small="/no_image.png"
                                                                    large="/no_image.png"
                                                                    className="w-full h-full rounded object-contain"
                                                                />
                                                            ) : (
                                                                <>
                                                                    <ModalImage
                                                                        small={e?.images}
                                                                        large={e?.images}
                                                                        className="w-[48px] h-[48px]  rounded object-cover"
                                                                    />
                                                                </>
                                                            )}
                                                        </div>
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={2} textAlign={'left'}>
                                                        {e?.category_name}
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1} textAlign={'left'}>
                                                        <Popup_ThongTin
                                                            dataMaterialExpiry={dataMaterialExpiry}
                                                            id={e?.id}
                                                            dataLang={dataLang}
                                                        >
                                                            <button className=" text-[#0F4F9E] hover:opacity-70 w-fit outline-none">
                                                                {e?.code}
                                                            </button>
                                                        </Popup_ThongTin>
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={2} textAlign={'left'}>
                                                        {e?.name}
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1} textAlign={'center'}>
                                                        {e?.unit}
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1} textAlign={'center'}>
                                                        {formatNumber(e?.stock_quantity)}
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1} textAlign={'left'}>
                                                        {e?.note}
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1} textAlign={"center"}>
                                                        {e?.variation_count ? e?.variation_count : "0"}
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={2} className="flex  gap-1 flex-wrap">
                                                        {e.branch?.map((i) => (
                                                            <TagBranch key={i}>
                                                                {i.name}
                                                            </TagBranch>
                                                        ))}
                                                    </RowItemTable>
                                                    <RowItemTable colSpan={1} className="space-x-2 text-center flex items-center justify-center">
                                                        {role == true || checkEdit ?
                                                            <Popup_NVL
                                                                dataMaterialExpiry={dataMaterialExpiry}
                                                                onRefresh={_ServerFetching.bind(this)}
                                                                dataLang={dataLang}
                                                                id={e?.id}
                                                                nameModel={"materials"}
                                                            />
                                                            :
                                                            <IconEdit className="cursor-pointer" onClick={() => isShow('warning', WARNING_STATUS_ROLE)} />
                                                        }
                                                        <BtnAction
                                                            onRefresh={_ServerFetching.bind(this)}
                                                            onRefreshGroup={() => { }}
                                                            dataLang={dataLang}
                                                            id={e?.id}
                                                            type="materials"
                                                        />

                                                    </RowItemTable>
                                                </RowTable>
                                            ))}
                                        </div>
                                    </React.Fragment>
                                )}
                            </div>
                        </Customscrollbar>
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
        </React.Fragment >
    );
};


const Popup_ThongTin = React.memo((props) => {
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);

    const dataSeting = useSetingServer();

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting)
    }
    const formatMoney = (number) => {
        return formatMoneyConfig(+number, dataSeting)
    }

    const [tab, sTab] = useState(0);
    const _HandleSelectTab = (e) => sTab(e);

    const [onFetching, sOnFetching] = useState(false);
    const [list, sList] = useState({});

    const _ServerFetching = () => {
        Axios("GET", `/api_web/api_material/material/${props.id}?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                sList({ ...response.data });
            }
            sOnFetching(false);
        });
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        open && sTab(0);
        open && sOnFetching(true);
    }, [open]);

    return (
        <PopupEdit
            title={props.dataLang?.category_material_list_detail || "category_material_list_detail"}
            button={props.children}
            onClickOpen={_ToggleModal.bind(this, true)}
            open={open}
            onClose={_ToggleModal.bind(this, false)}
        >
            <div className="py-4 w-[800px] space-y-5">
                <div className="flex items-center space-x-4 border-[#E7EAEE] border-opacity-70 border-b-[1px]">
                    <button
                        onClick={_HandleSelectTab.bind(this, 0)}
                        className={`${tab === 0 ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "
                            }  px-4 py-2 outline-none font-medium`}
                    >
                        {props.dataLang?.information || "information"}
                    </button>
                    <button
                        onClick={_HandleSelectTab.bind(this, 1)}
                        className={`${tab === 1 ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "
                            }  px-4 py-2 outline-none font-medium`}
                    >
                        {props.dataLang?.category_material_list_variant || "category_material_list_variant"}
                    </button>
                </div>
                {onFetching ? (
                    <Loading className="h-96" color="#0f4f9e" />
                ) : (
                    <React.Fragment>
                        {tab === 0 ? (
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-3 bg-slate-100/40 p-2 rounded-md">
                                    <div className="flex justify-between">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang?.client_list_brand || "client_list_brand"}:
                                        </h5>
                                        <div className="w-[55%] flex items-center gap-1 flex-wrap">
                                            {list?.branch?.map((e) => {
                                                return (
                                                    <TagBranch key={e.id.toString()} className="last:ml-0 w-fit">
                                                        {e.name}
                                                    </TagBranch>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang?.category_titel || "category_titel"}:
                                        </h5>
                                        <h6 className="w-[55%] text-right">{list?.category_name}</h6>
                                    </div>
                                    <div className="flex justify-between">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang?.category_material_list_code ||
                                                "category_material_list_code"}
                                            :
                                        </h5>
                                        <h6 className="w-[55%] text-right">{list?.code}</h6>
                                    </div>
                                    <div className="flex justify-between">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang?.category_material_list_name ||
                                                "category_material_list_name"}
                                            :
                                        </h5>
                                        <h6 className="w-[55%] text-right">{list?.name}</h6>
                                    </div>
                                    <div className="flex justify-between">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang?.category_material_list_cost_price ||
                                                "category_material_list_cost_price"}
                                            :
                                        </h5>
                                        <h6 className="w-[55%] text-right">
                                            {formatMoney(list?.import_price)}
                                        </h6>
                                    </div>
                                    <div className="flex justify-between">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang?.minimum_amount || "minimum_amount"}:
                                        </h5>
                                        <h6 className="w-[55%] text-right">
                                            {formatNumber(list?.minimum_quantity)}
                                        </h6>
                                    </div>
                                    {props.dataMaterialExpiry?.is_enable === "1" ? (
                                        <div className="flex justify-between">
                                            <h5 className="text-slate-400 text-sm w-[40%]">
                                                {props.dataLang?.category_material_list_expiry_date ||
                                                    "category_material_list_expiry_date"}
                                                :
                                            </h5>
                                            <h6 className="w-[55%] text-right">
                                                {Number(list?.expiry).toLocaleString()} {props.dataLang?.date || "date"}
                                            </h6>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    <div className="flex justify-between">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang?.category_material_list_purchase_unit ||
                                                "category_material_list_purchase_unit"}
                                            :
                                        </h5>
                                        <h6 className="w-[55%] text-right">{list?.unit}</h6>
                                    </div>
                                    <h5 className="text-slate-400 text-[15px] font-medium">
                                        {props.dataLang?.category_material_list_converting_unit ||
                                            "category_material_list_converting_unit"}
                                    </h5>
                                    <div className="flex justify-between">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang?.unit || "unit"}:
                                        </h5>
                                        <h6 className="w-[55%] text-right">{list?.unit_convert}</h6>
                                    </div>
                                    <div className="flex justify-between">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang?.category_material_list_converting_amount ||
                                                "category_material_list_converting_amount"}
                                            :
                                        </h5>
                                        <h6 className="w-[55%] text-right">
                                            {formatNumber(list?.coefficient)}
                                        </h6>
                                    </div>
                                </div>
                                <div className="space-y-3 flex flex-col justify-between">
                                    <div className="flex bg-slate-100/40 p-2 rounded-md">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang?.avatar || "avatar"}:
                                        </h5>
                                        {list?.images == null ? (
                                            <img
                                                src="/no_image.png"
                                                className="w-48 h-48 rounded object-contain select-none pointer-events-none"
                                            />
                                        ) : (
                                            <Image
                                                width={200}
                                                height={200}
                                                quality={100}
                                                src={list?.images}
                                                alt="thumb type"
                                                className="w-48 h-48 rounded object-contain select-none pointer-events-none"
                                                loading="lazy"
                                                crossOrigin="anonymous"
                                                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                            />
                                        )}
                                    </div>
                                    <div className="bg-slate-100/40 p-2 rounded-md space-y-3">
                                        <h4 className="flex space-x-2">
                                            <IconUserEdit size={20} />
                                            <span className="text-[15px] font-medium">Người lập phiếu</span>
                                        </h4>
                                        <div className="flex justify-between">
                                            <h5 className="text-slate-400 text-sm w-[30%]">
                                                {props.dataLang?.creator || "creator"}:
                                            </h5>
                                            <h6 className="w-[65%] text-right">{list?.created_by}</h6>
                                        </div>
                                        <div className="flex justify-between">
                                            <h5 className="text-slate-400 text-sm w-[30%]">
                                                {props.dataLang?.date_created || "date_created"}:
                                            </h5>
                                            <h6 className="w-[65%] text-right">
                                                {moment(list?.date_created).format("DD/MM/YYYY")}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <React.Fragment>
                                {list?.variation?.length > 0 ? (
                                    <div className="space-y-2 min-h-[384px]">
                                        <HeaderTablePopup
                                            gridCols={list?.variation[1] ? 3 : 2}
                                        >
                                            <ColumnTablePopup>
                                                Hình đại diện
                                            </ColumnTablePopup>
                                            <ColumnTablePopup>
                                                {list?.variation[0]?.name}
                                            </ColumnTablePopup>
                                            {list?.variation[1] && (
                                                <ColumnTablePopup>
                                                    {list?.variation[1]?.name}
                                                </ColumnTablePopup>
                                            )}
                                        </HeaderTablePopup>
                                        <ScrollArea
                                            className="min-h-[400px] max-h-[450px]"
                                            speed={1}
                                            smoothScrolling={true}
                                        >
                                            <div className="divide-y divide-slate-200">
                                                {list?.variation_option_value?.map((e) => (
                                                    <div
                                                        key={e?.id ? e?.id.toString() : ""}
                                                        className={`${list?.variation[1]
                                                            ? "grid-cols-3"
                                                            : "grid-cols-2"
                                                            } grid gap-2 px-2 py-2.5 hover:bg-slate-50`}
                                                    >
                                                        <div className="flex justify-center self-center">
                                                            {e?.image == null ? (
                                                                <img
                                                                    src="/no_image.png"
                                                                    className="w-auto h-20 rounded object-contain select-none pointer-events-none"
                                                                />
                                                            ) : (
                                                                <Image
                                                                    width={200}
                                                                    height={200}
                                                                    quality={100}
                                                                    src={e?.image}
                                                                    alt="thumb type"
                                                                    className="w-auto h-20 rounded object-contain select-none pointer-events-none"
                                                                    loading="lazy"
                                                                    crossOrigin="anonymous"
                                                                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                                                />
                                                            )}
                                                        </div>
                                                        <h6 className="px-2 xl:text-base text-xs self-center text-center">
                                                            {e?.name}
                                                        </h6>
                                                        {e?.variation_option_2?.length > 0 && (
                                                            <div className="self-center space-y-0.5">
                                                                {e?.variation_option_2?.map((ce) => (
                                                                    <React.Fragment key={ce.id?.toString()}>
                                                                        <h6 className="px-2 xl:text-base text-xs  text-center">
                                                                            {ce.name}
                                                                        </h6>
                                                                    </React.Fragment>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                ) : (
                                    <NoData />
                                )}
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}
            </div>
        </PopupEdit>
    );
});

export default Index;
