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

const MoreSelectedBadge = ({ items }) => {
    const style = {
        marginLeft: "auto",
        background: "#d4eefa",
        borderRadius: "4px",
        fontSize: "14px",
        padding: "1px 3px",
        order: 99,
    };

    const title = items.join(", ");
    const length = items.length;
    const label = `+ ${length}`;

    return (
        <div style={style} title={title}>
            {label}
        </div>
    );
};

const MultiValue = ({ index, getValue, ...props }) => {
    const maxToShow = 2;
    const overflow = getValue()
        .slice(maxToShow)
        .map((x) => x.label);

    return index < maxToShow ? (
        <components.MultiValue {...props} />
    ) : index === maxToShow ? (
        <MoreSelectedBadge items={overflow} />
    ) : null;
};


const CustomSelectOption = ({ value, label, level }) => (
    <div className="flex space-x-2 truncate">
        {level == 1 && <span>--</span>}
        {level == 2 && <span>----</span>}
        {level == 3 && <span>------</span>}
        {level == 4 && <span>--------</span>}
        <span className="2xl:max-w-[300px] max-w-[150px] w-fit truncate">{label}</span>
    </div>
);

const Index = (props) => {
    const dataLang = props.dataLang;

    const trangthaiExprired = useStatusExprired();

    const router = useRouter();

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
            <div className="px-10 xl:pt-24 pt-[88px] pb-3 space-y-2.5 h-screen overflow-hidden flex flex-col justify-between">
                <div className="h-[97%] space-y-3 overflow-hidden">
                    {trangthaiExprired ? (
                        <div className="p-2"></div>
                    ) : (
                        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                            <h6 className="text-[#141522]/40">{dataLang?.list_btn_seting_category}</h6>
                            <span className="text-[#141522]/40">/</span>
                            <h6 className="text-[#141522]/40">
                                {dataLang?.header_category_personnel || "header_category_personnel"}
                            </h6>
                            <span className="text-[#141522]/40">/</span>
                            <h6>
                                {dataLang?.header_category_personnel_position || "header_category_personnel_position"}
                            </h6>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <h2 className="xl:text-3xl text-xl font-medium ">
                            {dataLang?.category_personnel_position_title || "category_personnel_position_title"}
                        </h2>
                        <div className="flex space-x-3 items-center">
                            <Popup_ChucVu
                                dataLang={dataLang}
                                onRefresh={_ServerFetching.bind(this)}
                                onRefreshSub={_ServerFetchingSub.bind(this)}
                                className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-100 w-full rounded grid grid-cols-6 items-center justify-between xl:p-3 p-2">
                        <div className="col-span-4 grid grid-cols-5">
                            <div className="col-span-1">
                                <form className="flex items-center relative">
                                    <IconSearch
                                        size={20}
                                        className="absolute 2xl:left-3 z-10  text-[#cccccc] xl:left-[4%] left-[1%]"
                                    />
                                    <input
                                        className=" relative bg-white  outline-[#D0D5DD] focus:outline-[#0F4F9E]  2xl:text-left 2xl:pl-10 xl:pl-0 p-0 2xl:py-1.5  py-2.5 rounded 2xl:text-base text-xs xl:text-center text-center 2xl:w-full xl:w-full w-[100%]"
                                        type="text"
                                        onChange={_HandleOnChangeKeySearch.bind(this)}
                                        placeholder={dataLang?.branch_search}
                                    />
                                </form>
                            </div>
                            <SelectComponent
                                options={[
                                    {
                                        value: "",
                                        label: "Chọn chi nhánh",
                                        isDisabled: true,
                                    },
                                    ...options,
                                ]}
                                onChange={_HandleFilterOpt.bind(this, "branch")}
                                value={idBranch}
                                placeholder={dataLang?.client_list_filterbrand}
                                colSpan={idBranch?.length > 1 ? 2 : 1}
                                components={{ MultiValue }}
                                isMulti={true}
                                closeMenuOnSelect={false}
                            />
                            <SelectComponent
                                options={[
                                    {
                                        value: "",
                                        label: "Chọn chức vụ",
                                        isDisabled: true,
                                    },
                                    ...dataPositionOption,
                                ]}
                                formatOptionLabel={CustomSelectOption}
                                onChange={_HandleFilterOpt.bind(this, "position")}
                                value={idPosition}
                                placeholder={dataLang?.category_personnel_position_name}
                                colSpan={1}
                            />
                        </div>
                        <div className="col-span-2">
                            <div className="flex space-x-2 items-center justify-end">
                                <OnResetData sOnFetching={sOnFetching} />
                                {data?.length != 0 && (
                                    <ExcelFileComponent
                                        multiDataSet={multiDataSet}
                                        filename={
                                            dataLang?.header_category_personnel_position ||
                                            "header_category_personnel_position"
                                        }
                                        title="DSCV"
                                        dataLang={dataLang}
                                    />
                                )}

                                <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                            </div>
                        </div>
                    </div>
                    <div className="min:h-[500px] h-[91%] max:h-[800px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                        <div className="xl:w-[100%] w-[110%] pr-2">
                            <div className="flex items-center sticky top-0 rounded-xl shadow-sm bg-white divide-x p-2 z-10">
                                <h4 className="w-[10%]" />
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[20%] font-medium truncate text-center">
                                    {dataLang?.category_personnel_position_name || "category_personnel_position_name"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[15%] font-medium truncate text-center">
                                    {dataLang?.category_personnel_position_amount ||
                                        "category_personnel_position_amount"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[20%] font-medium truncate text-center">
                                    {dataLang?.category_personnel_position_department ||
                                        "category_personnel_position_department"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[25%] font-medium text-center">
                                    {dataLang?.client_list_brand || "client_list_brand"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[10%] font-medium text-center">
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
                                    <div className=" max-w-[352px] mt-24 mx-auto">
                                        <div className="text-center">
                                            <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                                                <IconSearch />
                                            </div>
                                            <h1 className="textx-[#141522] text-base opacity-90 font-medium">
                                                Không tìm thấy các mục
                                            </h1>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {data?.length != 0 && (
                    <div className="flex space-x-5 items-center">
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
            </div>
        </React.Fragment>
    );
};

const Item = React.memo((props) => {
    const [hasChild, sHasChild] = useState(false);

    const _ToggleHasChild = () => sHasChild(!hasChild);

    const { isOpen, isId, handleQueryId } = useToggle();

    const handleDelete = async () => {
        Axios("DELETE", `/api_web/api_staff/position/${isId}?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                var { isSuccess, message } = response.data;
                if (isSuccess) {
                    isShow("success", props.dataLang[message]);
                } else {
                    isShow("error", props.dataLang[message]);
                }
            }
            _ServerFetching();
        });

        handleQueryId({ status: false });
    };

    useEffect(() => {
        sHasChild(false);
    }, [props.data?.children?.length == null]);

    return (
        <div>
            <div className="flex py-2 px-2 bg-white hover:bg-slate-50">
                <div className="w-[10%] flex justify-center">
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
                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 w-[20%]">
                    {props.data?.name}
                </h6>
                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 w-[15%] text-center">
                    Thành viên
                </h6>
                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 w-[20%]">
                    {props.data?.department_name}
                </h6>
                <div className="flex flex-wrap px-2 w-[25%]">
                    {props.data?.branch.map((e) => (
                        <h6
                            key={e?.id.toString()}
                            className="text-[15px] mr-1 mb-1 py-[1px] px-1.5 text-[#0F4F9E] font-[300] rounded border border-[#0F4F9E] h-fit"
                        >
                            {e?.name}
                        </h6>
                    ))}
                </div>
                <div className="flex justify-center space-x-2 w-[10%] px-2">
                    <Popup_ChucVu
                        onRefresh={props.onRefresh}
                        onRefreshSub={props.onRefreshSub}
                        dataLang={props.dataLang}
                        id={props.data?.id}
                    />
                    <button
                        onClick={() => handleQueryId({ id: props.data?.id, status: true })}
                        className="xl:text-base text-xs outline-none"
                    >
                        <IconDelete color="red" />
                    </button>
                </div>
            </div>
            {hasChild && (
                <div className="bg-slate-50/50">
                    {props.data?.children?.map((e) => (
                        <ItemsChild
                            onClick={() => handleQueryId({ id: e.id, status: true })}
                            onRefresh={props.onRefresh}
                            onRefreshSub={props.onRefreshSub}
                            dataLang={props.dataLang}
                            key={e.id}
                            data={e}
                            grandchild="0"
                            children={e?.children?.map((e) => (
                                <ItemsChild
                                    onClick={() => handleQueryId({ id: e.id, status: true })}
                                    onRefresh={props.onRefresh}
                                    onRefreshSub={props.onRefreshSub}
                                    dataLang={props.dataLang}
                                    key={e.id}
                                    data={e}
                                    grandchild="1"
                                    children={e?.children?.map((e) => (
                                        <ItemsChild
                                            onClick={() => handleQueryId({ id: e.id, status: true })}
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
            <PopupConfim
                dataLang={props.dataLang}
                type="warning"
                title={TITLE_DELETE}
                subtitle={CONFIRM_DELETION}
                isOpen={isOpen}
                save={handleDelete}
                cancel={() => handleQueryId({ status: false })}
            />
        </div>
    );
});

const ItemsChild = React.memo((props) => {
    return (
        <React.Fragment key={props.data?.id}>
            <div className={`flex items-center py-2.5 px-2 hover:bg-slate-100/40 `}>
                {props.data?.level == "3" && (
                    <div className="w-[10%] h-full flex justify-center items-center pl-24">
                        <IconDown className="rotate-45" />
                    </div>
                )}
                {props.data?.level == "2" && (
                    <div className="w-[10%] h-full flex justify-center items-center pl-12">
                        <IconDown className="rotate-45" />
                        <IconMinus className="mt-1.5" />
                        <IconMinus className="mt-1.5" />
                    </div>
                )}
                {props.data?.level == "1" && (
                    <div className="w-[10%] h-full flex justify-center items-center ">
                        <IconDown className="rotate-45" />
                        <IconMinus className="mt-1.5" />
                        <IconMinus className="mt-1.5" />
                        <IconMinus className="mt-1.5" />
                        <IconMinus className="mt-1.5" />
                    </div>
                )}
                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 w-[20%]">
                    {props.data?.name}
                </h6>
                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 w-[15%] text-center">
                    0
                </h6>
                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 w-[20%]">
                    {props.data?.department_name}
                </h6>
                <div className="w-[25%] flex flex-wrap px-2">
                    {props.data?.branch.map((e) => (
                        <h6
                            key={e?.id.toString()}
                            className="text-[15px] mr-1 mb-1 py-[1px] px-1.5 text-[#0F4F9E] font-[300] rounded border border-[#0F4F9E] h-fit"
                        >
                            {e?.name}
                        </h6>
                    ))}
                </div>
                <div className="w-[10%] flex justify-center space-x-2">
                    <Popup_ChucVu
                        onRefresh={props.onRefresh}
                        onRefreshSub={props.onRefreshSub}
                        dataLang={props.dataLang}
                        id={props.data?.id}
                    />
                    <button onClick={props.onClick} className="xl:text-base text-xs">
                        <IconDelete color="red" />
                    </button>
                </div>
            </div>
            {props.children}
        </React.Fragment>
    );
});

const Popup_ChucVu = React.memo((props) => {
    const dataOptBranch = useSelector((state) => state.branch);

    const dataOptDepartment = useSelector((state) => state.department_staff);

    const dataOptPosition = useSelector((state) => state.position_staff);

    const isShow = useToast();

    const initalState = {
        open: false,
        dataOption: [],
        onSending: false,
        onFetching: false,
        name: "",
        position: "",
        department: "",
        valueBranch: [],
        errBranch: false,
        errName: false,
        errDepartment: false,
        tab: 0,
        dataPower: [],
        valueSearch: ""
    }

    const [isState, setIsState] = useState(initalState)

    const queryState = (key) => setIsState((prev) => ({ ...prev, ...key }))

    useEffect(() => {
        isState.open && fetchDataPower()
        isState.open && props?.id && queryState({ onFetching: true, open: true });
    }, [isState.open]);

    const transformData = (data) => {
        const transformedData = {};
        data.forEach(item => {
            const { key, is_check, name, child } = item;
            const transformedChild = {};

            if (child) {
                child.forEach(childItem => {
                    const { key: childKey, name: childName, permissions } = childItem;
                    const transformedPermissions = {};
                    if (permissions) {
                        permissions.forEach(permission => {
                            transformedPermissions[permission.key] = {
                                name: permission.name,
                                is_check: permission.is_check
                            };
                        });
                    }

                    transformedChild[childKey] = {
                        name: childName,
                        permissions: transformedPermissions
                    };
                });
            }
            transformedData[key] = {
                is_check,
                name,
                child: transformedChild
            };
        });

        return transformedData;
    }


    const fetchDataPower = () => {
        Axios("GET", props?.id ? `/api_web/api_staff/getPermissions/${props?.id}?csrf_protection=true` : `/api_web/api_staff/getPermissions?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                const { data, isSuccess, message } = response?.data;
                if (isSuccess == 1) {
                    const permissionsArray = Object.entries(data.permissions)?.map(([key, value]) => ({
                        key,
                        ...value,
                        child: Object.entries(value?.child)?.map(([childKey, childValue]) => ({
                            key: childKey,
                            ...childValue,
                            permissions: Object.entries(childValue?.permissions)?.map(([permissionsKey, permissionsValue]) => ({
                                key: permissionsKey,
                                ...permissionsValue,
                            }))
                        }))
                    }));
                    queryState({ dataPower: permissionsArray })
                }
            } else {
                {
                    console.log("err", err);
                }
            }
        });
    }

    const _ServerSending = () => {
        let formData = new FormData();
        const transformedResult = transformData(isState.dataPower);
        formData.append("name", isState.name ? isState.name : "");
        formData.append("position_parent_id", isState.position?.value ? isState.position?.value : "");
        formData.append("department_id", isState.department?.value ? isState.department?.value : "");
        isState.valueBranch.forEach((e) => formData.append("branch_id[]", e?.value));
        const utf8Bytes = JSON.stringify(transformedResult)
        formData.append("permissions", utf8Bytes);
        // Object.keys(transformedResult).forEach((key) => {
        //     formData.append(key, transformedResult[key]);
        // });
        Axios(
            "POST",
            `${props?.id
                ? `/api_web/api_staff/position/${props?.id}?csrf_protection=true`
                : "/api_web/api_staff/position?csrf_protection=true"
            }`,
            {
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", props.dataLang[message] || message);
                        setIsState(initalState)
                        props.onRefresh && props.onRefresh();
                        props.onRefreshSub && props.onRefreshSub();
                    } else {
                        isShow("error", props.dataLang[message] || message);
                    }
                    queryState({ onSending: false });
                }
                else {
                    console.log("err", err);
                }
            }
        );
    };

    useEffect(() => {
        isState.onSending && _ServerSending();
    }, [isState.onSending]);

    const _HandleSubmit = (e) => {
        e.preventDefault();
        if (isState.name == "" || isState.department == "" || isState.valueBranch?.length == 0) {
            isState.name == "" && queryState({ errName: true });
            isState.department == "" && queryState({ errDepartment: true });
            isState.valueBranch?.length == 0 && queryState({ errBranch: true })
            isShow("error", props.dataLang?.required_field_null);
        } else {
            queryState({ onSending: true });
        }
    };

    useEffect(() => {
        queryState({ errName: false });
    }, [isState.name != ""])

    useEffect(() => {
        queryState({ errDepartment: false });
    }, [isState.department != ""])

    useEffect(() => {
        queryState({ errBranch: false });
    }, [isState.valueBranch?.length > 0])

    const _ServerFetching = () => {
        Axios("GET", `/api_web/api_staff/position/${props?.id}?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                const list = response.data;
                queryState({
                    name: list?.name,
                    department: { value: list?.department_id, label: list?.department_name },
                    position: list?.position_parent_id == 0 ? null : { value: list?.position_parent_id, label: list?.position_parent_name },
                    valueBranch: list?.branch.map((e) => ({
                        label: e.name,
                        value: e.id,
                    })),
                })
            }
        });
        Axios("GET", `/api_web/api_staff/positionOption/${props?.id}?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                const { rResult } = response.data;
                queryState({
                    dataOption: rResult.map((x) => ({
                        label: x.name,
                        value: x.id,
                        level: x.level,
                    }))
                })
            }
        });
        queryState({ onFetching: false });
    };

    useEffect(() => {
        setTimeout(() => {
            isState.onFetching && _ServerFetching();
        }, 500);
    }, [isState.onFetching]);

    const handleChange = (parent, child = null, permissions = null) => {
        const newData = isState.dataPower?.map((e) => {
            if (child == null && e?.key == parent?.key) {
                return {
                    ...e,
                    child: e?.child?.map((x) => {
                        return {
                            ...x,
                            permissions: x?.permissions?.map((y) => {
                                return {
                                    ...y,
                                    is_check: parent.is_check == 0 ? 1 : 0
                                };
                            })
                        };
                    }),
                    is_check: parent.is_check == 0 ? 1 : 0
                };
            } else if (child != null && e?.key == parent && e?.is_check == 1) {
                return {
                    ...e,
                    child: e?.child?.map((x) => {
                        if (x?.key == child) {
                            return {
                                ...x,
                                permissions: x?.permissions?.map((y) => {
                                    if (y?.key == permissions?.key) {
                                        return {
                                            ...y,
                                            is_check: y.is_check === 0 ? 1 : 0
                                        };
                                    }
                                    return y;
                                })
                            };
                        }
                        return x;
                    })
                };
            }
            return e;
        });

        queryState({ dataPower: newData });
    };


    useEffect(() => {
        const filteredData = isState.dataPower.filter(item => item.name.toLowerCase().includes(isState.valueSearch.toLowerCase()));
        const newdb = isState.dataPower.map((item) => {
            const itemChecked = filteredData.find((x) => item.key == x.key);
            if (itemChecked) {
                return {
                    ...item,
                    ...itemChecked,
                    hidden: false
                }
            }
            return {
                ...item,
                hidden: true
            }

        })
        queryState({ dataPower: newdb });

    }, [isState.valueSearch])

    const styleSelect = {
        theme: (theme) => ({
            ...theme,
            colors: {
                ...theme.colors,
                primary25: "#EBF5FF",
                primary50: "#92BFF7",
                primary: "#0F4F9E",
            },
        }),
        styles: {
            placeholder: (base) => ({
                ...base,
                color: "#cbd5e1",
            }),
        }
    }

    return (
        <PopupEdit
            title={
                props?.id
                    ? `${props.dataLang?.category_personnel_position_edit || "category_personnel_position_edit"}`
                    : `${props.dataLang?.category_personnel_position_addnew || "category_personnel_position_addnew"}`
            }
            button={props?.id ? <IconEdit /> : `${props.dataLang?.branch_popup_create_new}`}
            onClickOpen={() => queryState({ open: true })}
            open={isState.open}
            onClose={() => queryState({ open: false })}
            classNameBtn={props.className}
        >
            <div className="flex items-center space-x-4 my-3 border-[#E7EAEE] border-opacity-70 border-b-[1px]">
                <button
                    onClick={() => queryState({ tab: 0 })}
                    className={`${isState.tab === 0 ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "
                        }  px-4 py-2 outline-none font-semibold`}
                >
                    {props.dataLang?.personnels_staff_popup_info}
                </button>
                <button
                    onClick={() => queryState({ tab: 1 })}
                    className={`${isState.tab === 1 ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "
                        }  px-4 py-2 outline-none font-semibold`}
                >
                    {props.dataLang?.personnels_staff_popup_power}
                </button>
            </div>
            <div className="py-4 w-[600px]  space-y-4">
                {isState.onFetching ? (
                    <Loading className="h-80" color="#0f4f9e" />
                ) : (

                    <React.Fragment>
                        {isState.tab == 0 && (
                            <div className="space-y-2">
                                <div className="space-y-1">
                                    <label className="text-[#344054] font-normal text-base">
                                        {props.dataLang?.client_list_brand || "client_list_brand"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <SelectComponent
                                        classParent={"m-0"}
                                        options={dataOptBranch}
                                        value={isState.valueBranch}
                                        onChange={(value) => queryState({ valueBranch: value })}
                                        isClearable={true}
                                        placeholder={props.dataLang?.client_list_brand || "client_list_brand"}
                                        isMulti
                                        noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                        closeMenuOnSelect={false}
                                        className={`${isState.errBranch ? "border-red-500" : "border-transparent"
                                            } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border p-0`}
                                        {...styleSelect}
                                    />
                                    {isState.errBranch && (
                                        <label className="text-sm text-red-500">
                                            {props.dataLang?.client_list_bran || "client_list_bran"}
                                        </label>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[#344054] font-normal text-base">
                                        {props.dataLang?.category_personnel_position_department ||
                                            "category_personnel_position_department"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <SelectComponent
                                        classParent={"m-0"}
                                        options={dataOptDepartment}
                                        value={isState.department}
                                        onChange={(value) => queryState({ department: value })}
                                        noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                        isClearable={true}
                                        placeholder={
                                            props.dataLang?.category_personnel_position_department ||
                                            "category_personnel_position_department"
                                        }
                                        className={`${isState.errDepartment ? "border-red-500" : "border-transparent"
                                            } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border p-0`}
                                        isSearchable={true}
                                        {...styleSelect}
                                    />
                                    {isState.errDepartment && (
                                        <label className="text-sm text-red-500">
                                            {props.dataLang?.category_personnel_position_err_department ||
                                                "category_personnel_position_err_department"}
                                        </label>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[#344054] font-normal text-base">
                                        {props.dataLang?.category_personnel_position_name || "category_personnel_position_name"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={isState.name}
                                        onChange={(e) => queryState({ name: e.target.value })}
                                        type="text"
                                        placeholder={props.dataLang?.category_material_group_name}
                                        className={`${isState.errName ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "
                                            } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-1.5 border outline-none `}
                                    />
                                    {isState.errName && (
                                        <label className="text-sm text-red-500">
                                            {props.dataLang?.category_personnel_position_err_name ||
                                                "category_personnel_position_err_name"}
                                        </label>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[#344054] font-normal text-base">
                                        {props.dataLang?.category_personnel_position_manage_position ||
                                            "category_personnel_position_manage_position"}
                                    </label>
                                    <SelectComponent
                                        classParent={"m-0"}
                                        options={props?.id ? isState.dataOption : dataOptPosition}
                                        formatOptionLabel={CustomSelectOption}
                                        noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                        defaultValue={isState.position}
                                        value={isState.position}
                                        onChange={(value) => queryState({ position: value })}
                                        isClearable={true}
                                        placeholder={
                                            props.dataLang?.category_personnel_position_manage_position ||
                                            "category_personnel_position_manage_position"
                                        }
                                        className="placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none p-0"
                                        isSearchable={true}
                                        {...styleSelect}
                                    />

                                </div>
                            </div>
                        )}
                        {isState.tab == 1 && (
                            <>
                                <div className="w-full">
                                    <label>Tìm kiếm</label>
                                    <div className="relative flex items-center">
                                        <SearchNormal1 size={20} className="absolute 2xl:left-3 z-10 text-[#cccccc] xl:left-[4%] left-[1%]" />
                                        <input
                                            onChange={(e) => queryState({ valueSearch: e?.target?.value })}
                                            dataLang={props.dataLang}
                                            value={isState.valueSearch}
                                            className={"border py-1.5 rounded border-gray-300 2xl:text-left 2xl:pl-10 xl:!text-left xl:pl-16 relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] 2xl:text-base text-xs  text-center 2xl:w-full xl:w-full w-[100%]"} />
                                        {
                                            isState.valueSearch != "" && <MdClear size={32} onClick={() => queryState({ valueSearch: "" })} className="absolute cursor-pointer hover:bg-gray-300 p-2 right-5 bottom-0.5 rounded-full transition-all duration-200 ease-linear" />
                                        }
                                    </div>

                                </div>
                                <div className="space-y-2 max-h-[500px] h-auto overflow-y-auo scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">

                                    <div className={`grid grid-cols-1`}>
                                        {isState.dataPower?.map((e) => {
                                            return (
                                                <div className={e?.hidden ? "hidden" : ""} key={e?.key}>
                                                    <div className="flex w-max items-center">
                                                        <div className="inline-flex items-center">
                                                            <label
                                                                className="relative flex cursor-pointer items-center rounded-full p-3"
                                                                htmlFor={e?.key}
                                                                data-ripple-dark="true"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 hover:before:opacity-10"
                                                                    id={e?.key}
                                                                    value={e?.name}
                                                                    checked={e?.is_check == 1 ? true : false}
                                                                    onChange={(value) => handleChange(e)}
                                                                />
                                                                <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-3.5 w-3.5"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                        stroke="currentColor"
                                                                        stroke-width="1"
                                                                    >
                                                                        <path
                                                                            fill-rule="evenodd"
                                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                            clip-rule="evenodd"
                                                                        ></path>
                                                                    </svg>
                                                                </div>
                                                            </label>
                                                        </div>
                                                        <label
                                                            htmlFor={e?.key}
                                                            className="text-[#344054] font-medium text-base cursor-pointer"
                                                        >
                                                            {e?.name}
                                                        </label>
                                                    </div>
                                                    {e?.is_check == 1 && (
                                                        <div className="">
                                                            {e?.child?.map((i, index) => {
                                                                return (
                                                                    <div key={i?.key} className={`${e?.child?.length - 1 == index && "border-b"} ml-10 border-t border-x`}>
                                                                        <div className="border-b p-2 text-sm">{i?.name}</div>
                                                                        <div className="grid grid-cols-3 gap-1 ">
                                                                            {i?.permissions?.map((s) => {
                                                                                return (
                                                                                    <div key={s?.key} className="flex w-full items-center">
                                                                                        <div className="inline-flex items-center">
                                                                                            <label
                                                                                                className="relative flex cursor-pointer items-center rounded-full p-3"
                                                                                                htmlFor={s?.key + "" + i?.key}
                                                                                                data-ripple-dark="true"
                                                                                            >
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 hover:before:opacity-10"
                                                                                                    id={s?.key + "" + i?.key}
                                                                                                    value={s?.name}
                                                                                                    checked={s?.is_check == 1 ? true : false}
                                                                                                    onChange={(value) => {
                                                                                                        handleChange(e?.key, i?.key, s)
                                                                                                    }}
                                                                                                />
                                                                                                <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                                                                    <svg
                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                        className="h-3.5 w-3.5"
                                                                                                        viewBox="0 0 20 20"
                                                                                                        fill="currentColor"
                                                                                                        stroke="currentColor"
                                                                                                        stroke-width="1"
                                                                                                    >
                                                                                                        <path
                                                                                                            fill-rule="evenodd"
                                                                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                                                            clip-rule="evenodd"
                                                                                                        ></path>
                                                                                                    </svg>
                                                                                                </div>
                                                                                            </label>
                                                                                        </div>
                                                                                        <label
                                                                                            htmlFor={s?.key + "" + i?.key}
                                                                                            className="text-[#344054] font-medium text-sm cursor-pointer"
                                                                                        >
                                                                                            {s?.name}
                                                                                        </label>
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                            </>
                        )}
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => queryState({ open: false, })}
                                className="text-base py-2 px-4 rounded-lg bg-slate-200 hover:opacity-90 hover:scale-105 transition"
                            >
                                {props.dataLang?.branch_popup_exit}
                            </button>
                            <button
                                onClick={_HandleSubmit.bind(this)}
                                className="text-[#FFFFFF] text-base py-2 px-4 rounded-lg bg-[#0F4F9E] hover:opacity-90 hover:scale-105 transition"
                            >
                                {props.dataLang?.branch_popup_save}
                            </button>
                        </div>
                    </React.Fragment>
                )}
            </div>
        </PopupEdit>
    );
});

export default Index;
