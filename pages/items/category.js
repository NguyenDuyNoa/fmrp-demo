import Head from "next/head";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

import { _ServerInstance as Axios } from "/services/axios";

import {
    Minus as IconMinus,
    SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    Trash as IconDelete,
    Edit as IconEdit,
    Grid6,
} from "iconsax-react";

import Loading from "@/components/UI/loading";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import SelectOptionLever from "@/components/UI/selectOptionLever/selectOptionLever";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";

import Popup_NVL from "./components/category/popup";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import useStatusExprired from "@/hooks/useStatusExprired";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import { CONFIRM_DELETION, TITLE_DELETE } from "@/constants/delete/deleteTable";
import { Container, ContainerBody, ContainerTable } from "@/components/UI/common/layout";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import useActionRole from "@/hooks/useRole";
import BtnAction from "@/components/UI/BtnAction";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";

const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const isShow = useToast()

    const dispatch = useDispatch();

    const trangthaiExprired = useStatusExprired();

    //Bộ lọc Danh mục
    const [dataOption, sDataOption] = useState([]);

    const [idCategory, sIdCategory] = useState(null);
    //Bộ lọc Chi nhánh
    const [dataBranchOption, sDataBranchOption] = useState([]);

    const [idBranch, sIdBranch] = useState(null);

    const _HandleFilterOpt = (type, value) => {
        if (type == "category") {
            sIdCategory(value);
        } else if (type == "branch") {
            sIdBranch(value);
        }
    };

    const [onFetching, sOnFetching] = useState(false);

    const [onFetchingOpt, sOnFetchingOpt] = useState(false);

    const [data, sData] = useState([]);

    const [keySearch, sKeySearch] = useState("");

    const { limit, updateLimit: sLimit, totalItems: totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems()

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkExport } = useActionRole(auth, 'material_category');


    const _ServerFetching = () => {
        Axios(
            "GET",
            "/api_web/api_material/category?csrf_protection=true",
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[id]": idCategory?.value ? idCategory?.value : null,
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

    const _ServerFetchingOtp = () => {
        Axios("GET", "/api_web/api_material/categoryOption?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var { rResult } = response.data;
                sDataOption(
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
        sOnFetchingOpt(false);
    };

    useEffect(() => {
        onFetchingOpt && _ServerFetchingOtp();
    }, [onFetchingOpt]);

    useEffect(() => {
        sOnFetchingOpt(true);
    }, []);

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        sOnFetching(true) ||
            (keySearch && sOnFetching(true)) ||
            (idCategory && sOnFetching(true)) ||
            (idBranch?.length > 0 && sOnFetching(true));
    }, [limit, router.query?.page, idCategory, idBranch]);

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
                    title: `${dataLang?.category_material_group_code}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.category_material_group_name}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_popup_note}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],
            data: data?.map((e) => [
                { value: `${e.id}`, style: { numFmt: "0" } },
                { value: `${e.code}` },
                { value: `${e.name}` },
                { value: `${e.note}` },
            ]),
        },
    ];

    //Set data cho bộ lọc chi nhánh
    const hiddenOptions = idBranch?.length > 3 ? idBranch?.slice(0, 3) : [];

    const options = dataBranchOption.filter((x) => !hiddenOptions.includes(x.value));

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.header_category_material_group}</title>
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
                        <h6>{dataLang?.header_category_material_group || "header_category_material_group"}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="space-y-3 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.category_material_group_title}
                            </h2>
                            <div className="flex justify-end items-center gap-2">
                                {role == true || checkAdd ?
                                    <Popup_NVL
                                        onRefresh={_ServerFetching.bind(this)}
                                        onRefreshOpt={_ServerFetchingOtp.bind(this)}
                                        dataLang={dataLang}
                                        data={data}
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
                                                isClearable={true}
                                                onChange={_HandleFilterOpt.bind(this, "branch")}
                                                value={idBranch}
                                                placeholder={dataLang?.price_quote_branch || "price_quote_branch"}
                                                colSpan={3}
                                                components={{ MultiValue }}
                                                isMulti={true}
                                                closeMenuOnSelect={false}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.category_material_group_code || "category_material_group_code",
                                                        isDisabled: true,
                                                    },
                                                    ...dataOption,
                                                ]}
                                                isClearable={true}
                                                onChange={_HandleFilterOpt.bind(this, "category")}
                                                value={idCategory}
                                                placeholder={dataLang?.category_material_group_code || "category_material_group_code"}
                                                colSpan={3}
                                                formatOptionLabel={SelectOptionLever}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex space-x-2 items-center justify-end">
                                            <OnResetData sOnFetching={sOnFetching} />

                                            {(role == true || checkExport) ?
                                                <div className={``}>
                                                    {data?.length > 0 && (
                                                        <ExcelFileComponent
                                                            multiDataSet={multiDataSet}
                                                            filename="Nhóm nvl"
                                                            title="Hiii"
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
                            <Customscrollbar className="min:h-[200px] h-[90%] max:h-[650px]o pb-2">
                                <div className="w-[100%] lg:w-[100%] ">
                                    <div className="grid grid-cols-11 items-center sticky top-0 rounded-xl shadow-sm bg-white divide-x p-2 z-10 ">
                                        {/* <div className="col-span-1 flex justify-center">
                                            <input type="checkbox" className="scale-125" />
                                        </div> */}
                                        <h4 className="col-span-1" />
                                        <h4 className="col-span-2 3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center">
                                            {dataLang?.category_material_group_code}
                                        </h4>
                                        <h4 className="col-span-3 3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center">
                                            {dataLang?.category_material_group_name}
                                        </h4>
                                        <h4 className="col-span-2 3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center">
                                            {dataLang?.client_popup_note}
                                        </h4>
                                        <h4 className="col-span-2 3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center">
                                            Chi nhánh
                                        </h4>
                                        <h4 className="col-span-1 3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center">
                                            {dataLang?.branch_popup_properties}
                                        </h4>
                                    </div>
                                    <div className="divide-y divide-slate-200">
                                        {
                                            onFetching ? (
                                                <Loading />
                                            ) : data?.length > 0 ? (
                                                data.map((e) => (
                                                    <Items
                                                        onRefresh={_ServerFetching.bind(this)}
                                                        onRefreshOpt={_ServerFetchingOtp.bind(this)}
                                                        dataLang={dataLang}
                                                        key={e.id}
                                                        data={e}
                                                    />
                                                ))
                                            ) : (
                                                <NoData />
                                            )
                                        }
                                    </div>
                                </div>
                            </Customscrollbar>
                        </ContainerTable>
                    </div>
                    {data?.length != 0 && (
                        <div className="flex space-x-5 my-2 items-center">
                            <h6>
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

const Items = React.memo((props) => {
    const isShow = useToast();

    const [hasChild, sHasChild] = useState(false);

    const _ToggleHasChild = () => sHasChild(!hasChild);

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkEdit } = useActionRole(auth, 'material_category');


    useEffect(() => {
        sHasChild(false);
    }, [props.data?.children?.length == null]);

    return (
        <div key={props.data?.id}>
            <div className="grid grid-cols-11 items-center py-2 px-2 bg-white hover:bg-slate-50 relative">
                <div className="col-span-1 flex justify-center">
                    <button
                        disabled={props.data?.children?.length > 0 ? false : true}
                        onClick={_ToggleHasChild.bind(this)}
                        className={`${hasChild ? "bg-red-600" : "bg-green-600 disabled:bg-slate-300"
                            } hover:opacity-80 hover:disabled:opacity-100 transition relative flex flex-col justify-center items-center h-5 w-5 rounded-full text-white outline-none`}
                    >
                        <IconMinus size={16} />
                        <IconMinus size={16} className={`${hasChild ? "" : "rotate-90"} transition absolute`} />
                    </button>
                </div>
                <h6 className="col-span-2 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5  rounded-md text-left">
                    {props.data?.code}
                </h6>
                <h6 className="col-span-3 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5  rounded-md text-left">
                    {props.data?.name}
                </h6>
                <h6 className="col-span-2 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5  rounded-md text-left">
                    {props.data?.note}
                </h6>
                <h6 className="col-span-2 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5  rounded-md text-left">
                    <span className="flex gap-2 flex-wrap justify-start ">
                        {props.data?.branch?.map((e) => (
                            <span className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">
                                {e.name}
                            </span>
                        ))}
                    </span>

                </h6>
                <div className="col-span-1 flex justify-center space-x-2">
                    {role == true || checkEdit ?
                        <Popup_NVL
                            onRefresh={props.onRefresh}
                            onRefreshOpt={props.onRefreshOpt}
                            dataLang={props.dataLang}
                            data={props.data}
                            dataOption={props.dataOption}
                        />
                        :
                        <IconEdit className="cursor-pointer" onClick={() => isShow('warning', WARNING_STATUS_ROLE)} />
                    }
                    <BtnAction
                        onRefresh={props.onRefresh}
                        onRefreshGroup={props.onRefreshOpt}
                        dataLang={props.dataLang}
                        id={props.data?.id}
                        type="material_category"
                    />

                </div>
            </div>
            {hasChild && (
                <div className="bg-slate-50/50">
                    {props.data?.children?.map((e) => (
                        <ItemsChild
                            onRefresh={props.onRefresh}
                            onRefreshOpt={props.onRefreshOpt}
                            dataLang={props.dataLang}
                            key={e.id}
                            data={e}
                            grandchild="0"
                            children={e?.children?.map((e) => (
                                <ItemsChild
                                    onRefresh={props.onRefresh}
                                    onRefreshOpt={props.onRefreshOpt}
                                    dataLang={props.dataLang}
                                    key={e.id}
                                    data={e}
                                    grandchild="1"
                                    children={e?.children?.map((e) => (
                                        <ItemsChild
                                            onRefresh={props.onRefresh}
                                            onRefreshOpt={props.onRefreshOpt}
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
    const isShow = useToast()
    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);
    const { checkEdit } = useActionRole(auth, 'material_category');
    return (
        <React.Fragment key={props.data?.id}>
            <div className={`grid grid-cols-11 items-center py-2.5 px-2 hover:bg-slate-100/40 `}>
                {props.data?.level == "3" && (
                    <div className="col-span-1 h-full flex justify-center items-center pl-24">
                        <IconDown className="rotate-45" />
                    </div>
                )}
                {props.data?.level == "2" && (
                    <div className="col-span-1 h-full flex justify-center items-center pl-12">
                        <IconDown className="rotate-45" />
                        <IconMinus className="mt-1.5" />
                        <IconMinus className="mt-1.5" />
                    </div>
                )}
                {props.data?.level == "1" && (
                    <div className="col-span-1 h-full flex justify-center items-center ">
                        <IconDown className="rotate-45" />
                        <IconMinus className="mt-1.5" />
                        <IconMinus className="mt-1.5" />
                        <IconMinus className="mt-1.5" />
                        <IconMinus className="mt-1.5" />
                    </div>
                )}
                <h6 className="col-span-2 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5  rounded-md text-left">
                    {props.data?.code}
                </h6>
                <h6 className="col-span-3 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5  rounded-md text-left">
                    {props.data?.name}
                </h6>
                <h6 className="col-span-2 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5  rounded-md text-left">
                    {props.data?.note}
                </h6>
                <div className="col-span-2 gap-2 flex flex-wrap px-2">
                    {props.data?.branch.map((e) => (
                        <span key={e?.id} className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">
                            {e.name}
                        </span>
                    ))}
                </div>
                <div className="col-span-1 flex justify-center space-x-2">
                    {role == true || checkEdit ?
                        <Popup_NVL
                            onRefresh={props.onRefresh}
                            onRefreshOpt={props.onRefreshOpt}
                            dataLang={props.dataLang}
                            data={props.data}
                        />
                        :
                        <IconEdit className="cursor-pointer" onClick={() => isShow('warning', WARNING_STATUS_ROLE)} />
                    }
                    <BtnAction
                        onRefresh={props.onRefresh}
                        onRefreshGroup={props.onRefreshOpt}
                        dataLang={props.dataLang}
                        id={props.data?.id}
                        type="material_category"
                    />
                </div>
            </div>
            {props.children}
        </React.Fragment>
    );
});


export default Index;
