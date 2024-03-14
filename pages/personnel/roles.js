import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { _ServerInstance as Axios } from "/services/axios";

import {
    Minus as IconMinus,
    SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    Trash as IconDelete,
    Edit as IconEdit,
    Grid6 as IconExcel,
    SearchNormal1,
    Grid6,
} from "iconsax-react";
import Select, { components } from "react-select";
import Swal from "sweetalert2";

import Loading from "@/components/UI/loading";
import PopupEdit from "@/components/UI/popup";
import Pagination from "@/components/UI/pagination";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";

import { useToggle } from "@/hooks/useToggle";
import useStatusExprired from "@/hooks/useStatusExprired";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import { CONFIRM_DELETION, TITLE_DELETE } from "@/constants/delete/deleteTable";
import useToast from "@/hooks/useToast";
import { debounce } from "lodash";
import { MdClear } from "react-icons/md";
import NoData from "@/components/UI/noData/nodata";
import useSetingServer from "@/hooks/useConfigNumber";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import SelectOptionLever from "@/components/UI/selectOptionLever/selectOptionLever";
import Popup_ChucVu from "./components/roles/popupChucvu";
import useActionRole from "@/hooks/useRole";
import { Container, ContainerBody, ContainerTable } from "@/components/UI/common/layout";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import BtnAction from "@/components/UI/BtnAction";

const Index = (props) => {
    const dataLang = props.dataLang;

    const trangthaiExprired = useStatusExprired();

    const router = useRouter();

    const isShow = useToast()

    const dispatch = useDispatch();

    const [onFetching, sOnFetching] = useState(false);

    const [onFetchingAnother, sOnFetchingAnother] = useState(false);

    const [onFetchingSub, sOnFetchingSub] = useState(false);

    const [data, sData] = useState([]);
    //Bộ lọc Chi nhánh
    const [dataBranchOption, sDataBranchOption] = useState([]);

    const [idBranch, sIdBranch] = useState(null);
    //Bộ lọc Chức vụ
    const [dataPositionOption, sDataPositionOption] = useState([]);

    const [idPosition, sIdPosition] = useState(null);

    const [keySearch, sKeySearch] = useState("");

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems()

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkEdit, checkExport } = useActionRole(auth, 'position');

    const _ServerFetching = () => {
        Axios(
            "GET",
            "/api_web/api_staff/position/?csrf_protection=true",
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[position_id]": idPosition?.value ? idPosition?.value : null,
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
    }, [onFetching]);

    useEffect(() => {
        sOnFetching(true);
    }, [limit, router.query?.page, idPosition, idBranch]);

    const paginate = (pageNumber) => {
        router.push({
            pathname: router.route,
            query: { page: pageNumber },
        });
    };

    const _HandleFilterOpt = (type, value) => {
        if (type == "position") {
            sIdPosition(value);
        } else if (type == "branch") {
            sIdBranch(value);
        }
    };

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        sKeySearch(value);
        router.replace(router.route);
        sOnFetching(true);
    }, 500)

    const _ServerFetchingSub = () => {
        Axios("GET", "/api_web/api_staff/positionOption?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var { rResult } = response.data;
                sDataPositionOption(
                    rResult.map((e) => ({
                        label: e.name,
                        value: e.id,
                        level: e.level,
                    }))
                );
                dispatch({
                    type: "position_staff/update",
                    payload: rResult.map((e) => ({
                        label: e.name,
                        value: e.id,
                        level: e.level,
                    })),
                });
            }
            sOnFetchingSub(false);
        });
    };

    useEffect(() => {
        onFetchingSub && _ServerFetchingSub();
    }, [onFetchingSub]);

    const _ServerFetchingAnother = () => {
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
        Axios("GET", "/api_web/api_staff/department/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var { rResult } = response.data;
                dispatch({
                    type: "department_staff/update",
                    payload: rResult.map((e) => ({
                        label: e.name,
                        value: e.id,
                    })),
                });
            }
        });
    };

    useEffect(() => {
        onFetchingAnother && _ServerFetchingAnother();
    }, [onFetchingAnother]);

    useEffect(() => {
        sOnFetchingAnother(true);
        sOnFetchingSub(true);
    }, []);

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
                    title: `${dataLang?.category_personnel_position_name || "category_personnel_position_name"}`,
                    width: { wpx: 150 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.category_personnel_position_amount || "category_personnel_position_amount"}`,
                    width: { wch: 30 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.category_personnel_position_department || "category_personnel_position_department"
                        }`,
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
            data: data?.map((e) => [
                { value: `${e.id}`, style: { numFmt: "0" } },
                { value: `${e.name}` },
                { value: `${e.name}` },
                { value: `${e.department_name}` },
                { value: `${JSON.stringify(e.branch.map((e) => e.name))}` },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.header_category_personnel_position || "header_category_personnel_position"}</title>
            </Head>
            <Container>
                {trangthaiExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.header_category_personnel || "header_category_personnel"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.header_category_personnel_position || "header_category_personnel_position"}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="space-y-3h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.category_personnel_position_title || 'category_personnel_position_title'}
                            </h2>
                            <div className="flex justify-end items-center gap-2">
                                {role == true || checkAdd ?
                                    <Popup_ChucVu
                                        dataLang={dataLang}
                                        onRefresh={_ServerFetching.bind(this)}
                                        onRefreshSub={_ServerFetchingSub.bind(this)}
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
                                                        label: dataLang?.price_quote_branch || 'price_quote_branch',
                                                        isDisabled: true,
                                                    },
                                                    ...options,
                                                ]}
                                                onChange={_HandleFilterOpt.bind(this, "branch")}
                                                value={idBranch}
                                                placeholder={dataLang?.price_quote_branch || 'price_quote_branch'}
                                                colSpan={3}
                                                components={{ MultiValue }}
                                                isMulti={true}
                                                closeMenuOnSelect={false}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.category_personnel_position_name || "category_personnel_position_name",
                                                        isDisabled: true,
                                                    },
                                                    ...dataPositionOption,
                                                ]}
                                                formatOptionLabel={SelectOptionLever}
                                                onChange={_HandleFilterOpt.bind(this, "position")}
                                                value={idPosition}
                                                placeholder={dataLang?.category_personnel_position_name}
                                                colSpan={3}
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
                                                            filename={
                                                                dataLang?.header_category_personnel_position ||
                                                                "header_category_personnel_position"
                                                            }
                                                            title="DSCV"
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
                                <Customscrollbar className="min:h-[500px] h-[91%] max:h-[800px] overflow-y-auto pb-2">
                                    <div className="w-full">
                                        <div className="grid grid-cols-10 items-center sticky top-0 rounded-xl shadow-sm bg-white divide-x p-2 z-10">
                                            <h4 className="col-span-1" />
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-2 text-center">
                                                {dataLang?.category_personnel_position_name || "category_personnel_position_name"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-2 text-center">
                                                {dataLang?.category_personnel_position_amount ||
                                                    "category_personnel_position_amount"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-2 text-center">
                                                {dataLang?.category_personnel_position_department ||
                                                    "category_personnel_position_department"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-2 text-center">
                                                {dataLang?.client_list_brand || "client_list_brand"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.branch_popup_properties || "branch_popup_properties"}
                                            </h4>
                                        </div>
                                        <div className="divide-y divide-slate-200">
                                            {onFetching ? (
                                                <Loading className="h-80" color="#0f4f9e" />
                                            ) : data?.length > 0 ? (
                                                data.map((e) => (
                                                    <Item
                                                        onRefresh={_ServerFetching.bind(this)}
                                                        onRefreshSub={_ServerFetchingSub.bind(this)}
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
                            </div>
                        </ContainerTable>
                    </div>
                    {data?.length != 0 && (
                        <div className="flex space-x-5 my-2 items-center">
                            <h6>
                                Hiển thị {totalItems?.iTotalDisplayRecords} thành phần
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

const Item = React.memo((props) => {
    const [hasChild, sHasChild] = useState(false);

    const _ToggleHasChild = () => sHasChild(!hasChild);

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkEdit } = useActionRole(auth, 'personnel_roles');

    const isShow = useToast()

    useEffect(() => {
        sHasChild(false);
    }, [props.data?.children?.length == null]);

    return (
        <div>
            <div className="grid grid-cols-10 py-2 px-2 bg-white hover:bg-slate-50">
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
                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-2 text-left">
                    {props.data?.name}
                </h6>
                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-2 text-center">
                    Thành viên
                </h6>
                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-2 text-left">
                    {props.data?.department_name}
                </h6>
                <h6 className="flex items-center justify-start col-span-2  gap-1 flex-wrap">
                    {props?.data?.branch?.map((i) => (
                        <span
                            key={i}
                            className="cursor-default w-fit 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase ml-2"
                        >
                            {i.name}
                        </span>
                    ))}
                </h6>
                <div className="flex justify-center space-x-2 col-span-1 px-2">
                    {role == true || checkEdit ?
                        <Popup_ChucVu
                            onRefresh={props.onRefresh}
                            onRefreshSub={props.onRefreshSub}
                            dataLang={props.dataLang}
                            id={props.data?.id}
                        />
                        :
                        <IconEdit className="cursor-pointer" onClick={() => isShow('warning', WARNING_STATUS_ROLE)} />
                    }
                    <BtnAction
                        onRefresh={props.onRefresh}
                        onRefreshGroup={props.onRefreshOpt}
                        dataLang={props.dataLang}
                        id={props.data?.id}
                        type="personnel_roles"
                    />
                </div>
            </div>
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
    const isShow = useToast()

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkEdit } = useActionRole(auth, 'personnel_roles');

    return (
        <React.Fragment key={props.data?.id}>
            <div className={`grid grid-cols-10 items-center py-2.5 px-2 hover:bg-slate-100/40 `}>
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
                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-2 text-left">
                    {props.data?.name}
                </h6>
                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-2 text-center">
                    0
                </h6>
                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-2 text-left">
                    {props.data?.department_name}
                </h6>
                <h6 className="flex col-span-2  gap-1 flex-wrap">
                    {props.data.branch?.map((i) => (
                        <span
                            key={i}
                            className="cursor-default w-fit 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase ml-2"
                        >
                            {i.name}
                        </span>
                    ))}
                </h6>
                <div className="col-span-1 flex justify-center space-x-2">

                    {role == true || checkEdit ?
                        <Popup_ChucVu
                            onRefresh={props.onRefresh}
                            onRefreshSub={props.onRefreshSub}
                            dataLang={props.dataLang}
                            id={props.data?.id}
                        />
                        :
                        <IconEdit className="cursor-pointer" onClick={() => isShow('warning', WARNING_STATUS_ROLE)} />
                    }
                    <BtnAction
                        onRefresh={props.onRefresh}
                        onRefreshGroup={props.onRefreshOpt}
                        dataLang={props.dataLang}
                        id={props.data?.id}
                        type="personnel_roles"
                    />
                </div>
            </div>
            {props.children}
        </React.Fragment>
    );
});



export default Index;
