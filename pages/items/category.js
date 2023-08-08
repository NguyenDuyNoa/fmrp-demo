import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { _ServerInstance as Axios } from "/services/axios";
import PopupEdit from "/components/UI/popup";
import Pagination from "/components/UI/pagination";
import Loading from "components/UI/loading";

import {
    Minus as IconMinus,
    SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    Trash as IconDelete,
    Edit as IconEdit,
    Grid6 as IconExcel,
    Refresh2,
} from "iconsax-react";
import Swal from "sweetalert2";
import Select, { components } from "react-select";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

const CustomSelectOption = ({ value, label, level, code }) => (
    <div className="flex space-x-2 truncate">
        {level == 1 && <span>--</span>}
        {level == 2 && <span>----</span>}
        {level == 3 && <span>------</span>}
        {level == 4 && <span>--------</span>}
        <span className="2xl:max-w-[300px] max-w-[150px] w-fit truncate">
            {label}
        </span>
    </div>
);

const Index = (props) => {
    const dataLang = props.dataLang;
    const router = useRouter();
    const dispatch = useDispatch();

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

    const [totalItems, sTotalItems] = useState({});
    const [keySearch, sKeySearch] = useState("");
    const [limit, sLimit] = useState(15);

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
                    "filter[branch_id][]":
                        idBranch?.length > 0
                            ? idBranch.map((e) => e.value)
                            : null,
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
        Axios(
            "GET",
            "/api_web/api_material/categoryOption?csrf_protection=true",
            {},
            (err, response) => {
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
            }
        );
        Axios(
            "GET",
            "/api_web/Api_Branch/branch/?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    var { rResult } = response.data;
                    sDataBranchOption(
                        rResult.map((e) => ({ label: e.name, value: e.id }))
                    );
                    dispatch({
                        type: "branch/update",
                        payload: rResult.map((e) => ({
                            label: e.name,
                            value: e.id,
                        })),
                    });
                }
            }
        );
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

    const _HandleOnChangeKeySearch = ({ target: { value } }) => {
        sKeySearch(value);
        router.replace(router.route);
        setTimeout(() => {
            if (!value) {
                sOnFetching(true);
            }
            sOnFetching(true);
        }, 1500);
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
    const options = dataBranchOption.filter(
        (x) => !hiddenOptions.includes(x.value)
    );

    const _HandleFresh = () => {
        sOnFetching(true);
    };

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.header_category_material_group}</title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-3 space-y-2.5 h-screen overflow-hidden flex flex-col justify-between">
                <div className="h-[97%] space-y-3 overflow-hidden">
                    <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.list_btn_seting_category}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6 className="text-[#141522]/40">
                            {dataLang?.header_category_material}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.header_category_material_group}</h6>
                    </div>
                    <div className="flex justify-between items-center">
                        <h2 className="xl:text-3xl text-xl font-medium ">
                            {dataLang?.category_material_group_title}
                        </h2>
                        <div className="flex space-x-3 items-center">
                            <Popup_NVL
                                onRefresh={_ServerFetching.bind(this)}
                                onRefreshOpt={_ServerFetchingOtp.bind(this)}
                                dataLang={dataLang}
                                data={data}
                                className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-100 w-full rounded grid grid-cols-6 items-center justify-between xl:p-3 p-2">
                        <div className="col-span-4">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="col-span-1">
                                    <form className="flex items-center relative">
                                        <IconSearch
                                            size={20}
                                            className="absolute 2xl:left-3 z-10  text-[#cccccc] xl:left-[4%] left-[1%]"
                                        />
                                        <input
                                            className=" relative bg-white  outline-[#D0D5DD] focus:outline-[#0F4F9E]  2xl:text-left 2xl:pl-10 xl:pl-0 p-0 2xl:py-1.5  py-2.5 rounded 2xl:text-base text-xs xl:text-center text-center 2xl:w-full xl:w-full w-[100%]"
                                            type="text"
                                            onChange={_HandleOnChangeKeySearch.bind(
                                                this
                                            )}
                                            placeholder={
                                                dataLang?.branch_search
                                            }
                                        />
                                    </form>
                                </div>
                                <div className=" ml-1 col-span-1">
                                    <Select
                                        // options={options}
                                        options={[
                                            {
                                                value: "",
                                                label: "Chọn chi nhánh",
                                                isDisabled: true,
                                            },
                                            ...options,
                                        ]}
                                        onChange={_HandleFilterOpt.bind(
                                            this,
                                            "branch"
                                        )}
                                        value={idBranch}
                                        isClearable={true}
                                        isMulti
                                        closeMenuOnSelect={false}
                                        hideSelectedOptions={false}
                                        placeholder="Chọn chi nhánh"
                                        className="rounded-md bg-white  xl:text-base text-[14.5px] z-20"
                                        isSearchable={true}
                                        components={{ MultiValue }}
                                        style={{
                                            border: "none",
                                            boxShadow: "none",
                                            outline: "none",
                                        }}
                                        theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                                ...theme.colors,
                                                primary25: "#EBF5FF",
                                                primary50: "#92BFF7",
                                                primary: "#0F4F9E",
                                            },
                                        })}
                                        styles={{
                                            placeholder: (base) => ({
                                                ...base,
                                                color: "#cbd5e1",
                                            }),
                                            control: (base, state) => ({
                                                ...base,
                                                border: "none",
                                                outline: "none",
                                                boxShadow: "none",
                                                ...(state.isFocused && {
                                                    boxShadow:
                                                        "0 0 0 1.5px #0F4F9E",
                                                }),
                                            }),
                                        }}
                                    />
                                </div>
                                <div className="ml-1 col-span-1">
                                    <Select
                                        // options={dataOption}
                                        options={[
                                            {
                                                value: "",
                                                label: "Chọn mã danh mục",
                                                isDisabled: true,
                                            },
                                            ...dataOption,
                                        ]}
                                        formatOptionLabel={CustomSelectOption}
                                        onChange={_HandleFilterOpt.bind(
                                            this,
                                            "category"
                                        )}
                                        value={idCategory}
                                        isClearable={true}
                                        placeholder="Chọn mã danh mục"
                                        className="rounded-md bg-white  xl:text-base text-[14.5px] z-20"
                                        isSearchable={true}
                                        style={{
                                            border: "none",
                                            boxShadow: "none",
                                            outline: "none",
                                        }}
                                        theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                                ...theme.colors,
                                                primary25: "#EBF5FF",
                                                primary50: "#92BFF7",
                                                primary: "#0F4F9E",
                                            },
                                        })}
                                        styles={{
                                            placeholder: (base) => ({
                                                ...base,
                                                color: "#cbd5e1",
                                            }),
                                            control: (base, state) => ({
                                                ...base,
                                                border: "none",
                                                outline: "none",
                                                boxShadow: "none",
                                                ...(state.isFocused && {
                                                    boxShadow:
                                                        "0 0 0 1.5px #0F4F9E",
                                                }),
                                            }),
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className="flex space-x-2 items-center justify-end">
                                <button
                                    onClick={_HandleFresh.bind(this)}
                                    type="button"
                                    className="bg-green-50 hover:bg-green-200 hover:scale-105 group p-2 rounded-md transition-all ease-in-out"
                                >
                                    <Refresh2
                                        className="group-hover:-rotate-45 transition-all ease-in-out"
                                        size="22"
                                        color="green"
                                    />
                                </button>
                                {data.length != 0 && (
                                    <ExcelFile
                                        filename="nhóm nvl"
                                        title="Hiii"
                                        element={
                                            <button className="xl:px-4 px-3 xl:py-2.5 py-1.5 xl:text-sm text-xs flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition">
                                                <IconExcel size={18} />
                                                <span>
                                                    {
                                                        dataLang?.client_list_exportexcel
                                                    }
                                                </span>
                                            </button>
                                        }
                                    >
                                        <ExcelSheet
                                            dataSet={multiDataSet}
                                            data={multiDataSet}
                                            name="Nhóm NVL"
                                        />
                                    </ExcelFile>
                                )}

                                <div className="flex space-x-2 items-center">
                                    <label className="font-[300] text-slate-400">
                                        {dataLang?.display} :
                                    </label>
                                    <select
                                        className="outline-none"
                                        onChange={(e) => sLimit(e.target.value)}
                                        value={limit}
                                    >
                                        <option disabled className="hidden">
                                            {limit == -1 ? "Tất cả" : limit}
                                        </option>
                                        <option value={15}>15</option>
                                        <option value={20}>20</option>
                                        <option value={40}>40</option>
                                        <option value={60}>60</option>
                                        <option value={-1}>Tất cả</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="min:h-[500px] h-[91%] max:h-[800px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                        <div className="xl:w-[100%] w-[110%] pr-2">
                            <div className="flex items-center sticky top-0 rounded-xl shadow-sm bg-white divide-x p-2 z-10 ">
                                <div className="w-[2%] flex justify-center">
                                    <input
                                        type="checkbox"
                                        className="scale-125"
                                    />
                                </div>
                                <h4 className="w-[8%]" />
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[16%] font-[600] text-center">
                                    {dataLang?.category_material_group_code}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[25%] font-[600] truncate text-center">
                                    {dataLang?.category_material_group_name}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[15%] font-[600] text-center">
                                    {dataLang?.client_popup_note}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[24%] font-[600] text-center">
                                    Chi nhánh
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[10%] font-[600] text-center">
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
                                                onRefresh={_ServerFetching.bind(
                                                    this
                                                )}
                                                onRefreshOpt={_ServerFetchingOtp.bind(
                                                    this
                                                )}
                                                dataLang={dataLang}
                                                key={e.id}
                                                data={e}
                                            />
                                        ))
                                    ) : (
                                        // {!onFetching && data?.length == 0 && (
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
                                    )
                                    // )}
                                    // {onFetching && <Loading />}
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {data?.length != 0 && (
                    <div className="flex space-x-5 items-center">
                        <h6>
                            Hiển thị {totalItems?.iTotalDisplayRecords} trong số{" "}
                            {totalItems?.iTotalRecords} biến thể
                        </h6>
                        <Pagination
                            postsPerPage={limit}
                            totalPosts={Number(
                                totalItems?.iTotalDisplayRecords
                            )}
                            paginate={paginate}
                            currentPage={router.query?.page || 1}
                        />
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};

const Items = React.memo((props) => {
    const [hasChild, sHasChild] = useState(false);
    const _ToggleHasChild = () => sHasChild(!hasChild);

    const _HandleDelete = (id) => {
        Swal.fire({
            title: `${props.dataLang?.aler_ask}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#296dc1",
            cancelButtonColor: "#d33",
            confirmButtonText: `${props.dataLang?.aler_yes}`,
            cancelButtonText: `${props.dataLang?.aler_cancel}`,
        }).then((result) => {
            if (result.isConfirmed) {
                Axios(
                    "DELETE",
                    `/api_web/api_material/category/${id}?csrf_protection=true`,
                    {},
                    (err, response) => {
                        if (!err) {
                            var { isSuccess, message } = response.data;
                            if (isSuccess) {
                                Toast.fire({
                                    icon: "success",
                                    title: props.dataLang[message],
                                });
                            } else {
                                Toast.fire({
                                    icon: "error",
                                    title: props.dataLang[message],
                                });
                            }
                        }
                        props.onRefresh && props.onRefresh();
                        props.onRefreshOpt && props.onRefreshOpt();
                    }
                );
            }
        });
    };

    useEffect(() => {
        sHasChild(false);
    }, [props.data?.children?.length == null]);

    return (
        <div key={props.data?.id}>
            <div className="flex items-center py-2 px-2 bg-white hover:bg-slate-50 relative">
                <div className="w-[2%] flex justify-center">
                    <input type="checkbox" className="scale-125" />
                </div>
                <div className="w-[8%] flex justify-center">
                    <button
                        disabled={
                            props.data?.children?.length > 0 ? false : true
                        }
                        onClick={_ToggleHasChild.bind(this)}
                        className={`${
                            hasChild
                                ? "bg-red-600"
                                : "bg-green-600 disabled:bg-slate-300"
                        } hover:opacity-80 hover:disabled:opacity-100 transition relative flex flex-col justify-center items-center h-5 w-5 rounded-full text-white outline-none`}
                    >
                        <IconMinus size={16} />
                        <IconMinus
                            size={16}
                            className={`${
                                hasChild ? "" : "rotate-90"
                            } transition absolute`}
                        />
                    </button>
                </div>
                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 w-[16%]">
                    {props.data?.code}
                </h6>
                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 w-[25%] truncate">
                    {props.data?.name}
                </h6>
                <h6 className="px-2 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 w-[15%] ">
                    {props.data?.note}
                </h6>
                <div className="w-[24%] flex flex-wrap px-2">
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
                    <Popup_NVL
                        onRefresh={props.onRefresh}
                        onRefreshOpt={props.onRefreshOpt}
                        dataLang={props.dataLang}
                        data={props.data}
                        dataOption={props.dataOption}
                    />
                    <button
                        onClick={_HandleDelete.bind(this, props.data?.id)}
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
                            onClick={_HandleDelete.bind(this, e.id)}
                            onRefresh={props.onRefresh}
                            onRefreshOpt={props.onRefreshOpt}
                            dataLang={props.dataLang}
                            key={e.id}
                            data={e}
                            grandchild="0"
                            children={e?.children?.map((e) => (
                                <ItemsChild
                                    onClick={_HandleDelete.bind(this, e.id)}
                                    onRefresh={props.onRefresh}
                                    onRefreshOpt={props.onRefreshOpt}
                                    dataLang={props.dataLang}
                                    key={e.id}
                                    data={e}
                                    grandchild="1"
                                    children={e?.children?.map((e) => (
                                        <ItemsChild
                                            onClick={_HandleDelete.bind(
                                                this,
                                                e.id
                                            )}
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
    return (
        <React.Fragment key={props.data?.id}>
            <div
                className={`flex items-center py-2.5 px-2 hover:bg-slate-100/40 `}
            >
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
                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 w-[16%]">
                    {props.data?.code}
                </h6>
                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 w-[25%] truncate">
                    {props.data?.name}
                </h6>
                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 w-[15%]">
                    {props.data?.note}
                </h6>
                {/* <h6 className='xl:text-base text-xs px-2 w-[24%]'>{props.data?.note}</h6> */}
                <div className="w-[24%] flex flex-wrap px-2">
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
                    <Popup_NVL
                        onRefresh={props.onRefresh}
                        onRefreshOpt={props.onRefreshOpt}
                        dataLang={props.dataLang}
                        data={props.data}
                    />
                    <button
                        onClick={props.onClick}
                        className="xl:text-base text-xs"
                    >
                        <IconDelete color="red" />
                    </button>
                </div>
            </div>
            {props.children}
        </React.Fragment>
    );
});

const Popup_NVL = React.memo((props) => {
    const dataOptBranch = useSelector((state) => state.branch);

    const [dataOption, sDataOption] = useState([]);

    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);

    const [onFetching, sOnFetching] = useState(false);
    const [onSending, sOnSending] = useState(false);

    const [branch, sBranch] = useState([]);
    const branch_id = branch?.map((e) => e.value);

    const [code, sCode] = useState("");
    const [name, sName] = useState("");
    const [editorValue, sEditorValue] = useState("");

    const [errBranch, sErrBranch] = useState(false);
    const [errCode, sErrCode] = useState(false);
    const [errName, sErrName] = useState(false);

    useEffect(() => {
        open && sCode(props.data?.code ? props.data?.code : "");
        open && sName(props.data?.name ? props.data?.name : "");
        open && sEditorValue(props.data?.note ? props.data?.note : "");
        open &&
            sIdCategory(props.data?.parent_id ? props.data?.parent_id : null);
        open &&
            sBranch(
                props.data?.branch?.length > 0
                    ? props.data?.branch?.map((e) => ({
                          label: e.name,
                          value: e.id,
                      }))
                    : []
            );
        open && sErrCode(false);
        open && sErrName(false);
        open && sErrBranch(false);
        open && sOnFetching(true);
    }, [open]);

    const _HandleChangeInput = (type, value) => {
        if (type == "name") {
            sName(value.target?.value);
        } else if (type == "code") {
            sCode(value.target?.value);
        } else if (type == "editor") {
            sEditorValue(value.target?.value);
        } else if (type == "branch") {
            sBranch(value);
        }
    };

    const _ServerFetching = () => {
        Axios(
            "GET",
            `${
                props.data?.id
                    ? `/api_web/api_material/categoryOption/${props.data?.id}?csrf_protection=true`
                    : "api_web/api_material/categoryOption?csrf_protection=true"
            }`,
            {},
            (err, response) => {
                if (!err) {
                    var { rResult } = response.data;
                    sDataOption(
                        rResult.map((e) => ({
                            label: e.name + " " + "(" + e.code + ")",
                            value: e.id,
                            level: e.level,
                        }))
                    );
                }
                sOnFetching(false);
            }
        );
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    const _ServerSending = () => {
        var formData = new FormData();

        formData.append("code", code);
        formData.append("name", name);
        formData.append("note", editorValue);
        formData.append("parent_id", idCategory ? idCategory : null);
        branch_id.forEach((id) => formData.append("branch_id[]", id));

        Axios(
            "POST",
            `${
                props.data?.id
                    ? `/api_web/api_material/category/${props.data?.id}?csrf_protection=true`
                    : "/api_web/api_material/category?csrf_protection=true"
            }`,
            {
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess, message } = response.data;
                    if (isSuccess) {
                        Toast.fire({
                            icon: "success",
                            title: `${props.dataLang[message]}`,
                        });
                        sName("");
                        sCode("");
                        sEditorValue("");
                        sIdCategory([]);
                        props.onRefresh && props.onRefresh();
                        props.onRefreshOpt && props.onRefreshOpt();
                        sOpen(false);
                    } else {
                        Toast.fire({
                            icon: "error",
                            title: `${props.dataLang[message]}`,
                        });
                    }
                    sOnSending(false);
                }
            }
        );
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    const _HandleSubmit = (e) => {
        e.preventDefault();
        if (name?.length == 0 || code?.length == 0 || branch?.length == 0) {
            name?.length == 0 && sErrName(true);
            code?.length == 0 && sErrCode(true);
            branch?.length == 0 && sErrBranch(true);
            Toast.fire({
                icon: "error",
                title: `${props.dataLang?.required_field_null}`,
            });
        } else {
            sOnSending(true);
        }
    };

    useEffect(() => {
        sErrName(false);
    }, [name?.length > 0]);

    useEffect(() => {
        sErrCode(false);
    }, [code?.length > 0]);

    useEffect(() => {
        sErrBranch(false);
    }, [branch?.length > 0]);

    const [idCategory, sIdCategory] = useState(null);
    const valueIdCategory = (e) => sIdCategory(e?.value);

    return (
        <PopupEdit
            title={
                props.data?.id
                    ? `${props.dataLang?.category_material_group_edit}`
                    : `${props.dataLang?.category_material_group_addnew}`
            }
            button={
                props.data?.id ? (
                    <IconEdit />
                ) : (
                    `${props.dataLang?.branch_popup_create_new}`
                )
            }
            onClickOpen={_ToggleModal.bind(this, true)}
            open={open}
            onClose={_ToggleModal.bind(this, false)}
            classNameBtn={props.className}
        >
            <div className="py-4 w-[600px] space-y-5">
                <div className="space-y-1">
                    <label className="text-[#344054] font-normal text-base">
                        {props.dataLang?.client_list_brand ||
                            "client_list_brand"}{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <Select
                        options={dataOptBranch}
                        formatOptionLabel={CustomSelectOption}
                        value={branch}
                        onChange={_HandleChangeInput.bind(this, "branch")}
                        isClearable={true}
                        placeholder={
                            props.dataLang?.client_list_brand ||
                            "client_list_brand"
                        }
                        isMulti
                        noOptionsMessage={() =>
                            `${props.dataLang?.no_data_found}`
                        }
                        closeMenuOnSelect={false}
                        className={`${
                            errBranch ? "border-red-500" : "border-transparent"
                        } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                        theme={(theme) => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary25: "#EBF5FF",
                                primary50: "#92BFF7",
                                primary: "#0F4F9E",
                            },
                        })}
                        styles={{
                            placeholder: (base) => ({
                                ...base,
                                color: "#cbd5e1",
                            }),
                        }}
                    />
                    {errBranch && (
                        <label className="text-sm text-red-500">
                            {props.dataLang?.client_list_bran ||
                                "client_list_bran"}
                        </label>
                    )}
                </div>
                <div className="space-y-1">
                    <label className="text-[#344054] font-normal text-base">
                        {props.dataLang?.category_material_group_code}{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={code}
                        onChange={_HandleChangeInput.bind(this, "code")}
                        type="text"
                        placeholder={
                            props.dataLang?.category_material_group_code
                        }
                        className={`${
                            errCode
                                ? "border-red-500"
                                : "focus:border-[#92BFF7] border-[#d0d5dd] "
                        } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}
                    />
                    {errCode && (
                        <label className="text-sm text-red-500">
                            {props.dataLang?.category_material_group_err_code}
                        </label>
                    )}
                </div>
                <div className="space-y-1">
                    <label className="text-[#344054] font-normal text-base">
                        {props.dataLang?.category_material_group_name}{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={name}
                        onChange={_HandleChangeInput.bind(this, "name")}
                        type="text"
                        placeholder={
                            props.dataLang?.category_material_group_name
                        }
                        className={`${
                            errName
                                ? "border-red-500"
                                : "focus:border-[#92BFF7] border-[#d0d5dd] "
                        } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}
                    />
                    {errName && (
                        <label className="text-sm text-red-500">
                            {props.dataLang?.category_material_group_err_name}
                        </label>
                    )}
                </div>
                <div className="space-y-1">
                    <label className="text-[#344054] font-normal text-base">
                        {props.dataLang?.category_material_group_level}
                    </label>
                    <Select
                        options={dataOption}
                        formatOptionLabel={CustomSelectOption}
                        defaultValue={
                            idCategory == "0" || !idCategory
                                ? {
                                      label: `${props.dataLang?.category_material_group_level}`,
                                  }
                                : {
                                      label: dataOption.find(
                                          (x) => x?.parent_id == idCategory
                                      )?.label,
                                      code: dataOption.find(
                                          (x) => x?.parent_id == idCategory
                                      )?.code,
                                      value: idCategory,
                                  }
                        }
                        value={
                            idCategory == "0" || !idCategory
                                ? { label: "Nhóm cha", code: "nhóm cha" }
                                : {
                                      label: dataOption.find(
                                          (x) => x?.value == idCategory
                                      )?.label,
                                      code: dataOption.find(
                                          (x) => x?.value == idCategory
                                      )?.code,
                                      value: idCategory,
                                  }
                        }
                        onChange={valueIdCategory.bind(this)}
                        isClearable={true}
                        placeholder={
                            props.dataLang?.category_material_group_level
                        }
                        className="placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none"
                        isSearchable={true}
                        theme={(theme) => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary25: "#EBF5FF",
                                primary50: "#92BFF7",
                                primary: "#0F4F9E",
                            },
                        })}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[#344054] font-normal text-base">
                        {props.dataLang?.client_popup_note}
                    </label>
                    <textarea
                        type="text"
                        placeholder={props.dataLang?.client_popup_note}
                        rows={5}
                        value={editorValue}
                        onChange={_HandleChangeInput.bind(this, "editor")}
                        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none resize-none"
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={_ToggleModal.bind(this, false)}
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
            </div>
        </PopupEdit>
    );
});

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

export default Index;
