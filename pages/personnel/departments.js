import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";
import Pagination from "/components/UI/pagination";

import {
    Edit as IconEdit,
    Trash as IconDelete,
    Grid6 as IconExcel,
    SearchNormal1 as IconSearch,
    Refresh2,
} from "iconsax-react";
import ReactExport from "react-data-export";
import Swal from "sweetalert2";
import "react-phone-input-2/lib/style.css";
import Select, { components } from "react-select";
import Popup_phongban from "./(popupDepartments)/popup";
import { useSelector } from "react-redux";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Index = (props) => {
    const router = useRouter();
    const dataLang = props.dataLang;

    const [data, sData] = useState([]);
    const [data_ex, sData_ex] = useState([]);
    const [onFetching, sOnFetching] = useState(true);

    const [keySearch, sKeySearch] = useState("");
    const [limit, sLimit] = useState(15);
    const [totalItem, sTotalItem] = useState([]);

    const _ServerFetching = () => {
        Axios(
            "GET",
            `/api_web/api_staff/department/?csrf_protection=true`,
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id]":
                        idBranch?.length > 0
                            ? idBranch.map((e) => e.value)
                            : null,
                },
            },
            (err, response) => {
                if (!err) {
                    var { rResult, output } = response.data;
                    sData(rResult);
                    sTotalItem(output);
                    sData_ex(rResult);
                }
                sOnFetching(false);
            }
        );
    };
    const [listBr, sListBr] = useState();
    const _ServerFetching_brand = () => {
        Axios(
            "GET",
            `/api_web/Api_Branch/branch/?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                },
            },
            (err, response) => {
                if (!err) {
                    var { rResult, output } = response.data;
                    sListBr(rResult);
                }
                sOnFetching(false);
            }
        );
    };
    const listBr_filter = listBr
        ? listBr?.map((e) => ({ label: e.name, value: e.id }))
        : [];
    const [idBranch, sIdBranch] = useState(null);
    const onchang_filterBr = (type, value) => {
        if (type == "branch") {
            sIdBranch(value);
        }
    };

    useEffect(() => {
        (onFetching && _ServerFetching()) ||
            (onFetching && _ServerFetching_brand());
    }, [onFetching]);

    useEffect(() => {
        sOnFetching(true) ||
            (keySearch && sOnFetching(true)) ||
            (idBranch?.length > 0 && sOnFetching(true));
    }, [limit, router.query?.page, idBranch]);

    const handleDelete = (event) => {
        Swal.fire({
            title: `${dataLang?.aler_ask}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#296dc1",
            cancelButtonColor: "#d33",
            confirmButtonText: `${dataLang?.aler_yes}`,
            cancelButtonText: `${dataLang?.aler_cancel}`,
        }).then((result) => {
            if (result.isConfirmed) {
                const id = event;
                Axios(
                    "DELETE",
                    `/api_web/api_staff/department/${id}?csrf_protection=true`,
                    {},
                    (err, response) => {
                        if (!err) {
                            var isSuccess = response.data?.isSuccess;
                            if (isSuccess) {
                                Toast.fire({
                                    icon: "success",
                                    title: dataLang?.aler_success_delete,
                                });
                            }
                        }
                        _ServerFetching();
                    }
                );
            }
        });
    };

    const paginate = (pageNumber) => {
        router.push({
            pathname: "/personnels/departments",
            query: { page: pageNumber },
        });
    };

    const _HandleOnChangeKeySearch = ({ target: { value } }) => {
        sKeySearch(value);
        router.replace("/personnels/departments");
        setTimeout(() => {
            if (!value) {
                sOnFetching(true);
            }
            sOnFetching(true);
        }, 500);
    };
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
            data: data_ex?.map((e) => [
                { value: `${e.id}`, style: { numFmt: "0" } },
                { value: `${e.name ? e.name : ""}` },
                { value: `${e.email ? e.email : ""}` },
                { value: `${e.branch ? e.branch?.map((i) => i.name) : ""}` },
            ]),
        },
    ];
    const trangthaiExprired = useSelector((state) => state?.trangthaiExprired);

    const _HandleFresh = () => sOnFetching(true);
    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.personnels_deparrtments_title}</title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
                {trangthaiExprired ? (
                    <div className="p-2"></div>
                ) : (
                    <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.personnels_deparrtments_title}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.personnels_deparrtments_title}</h6>
                    </div>
                )}
                <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-3 h-[96%] overflow-hidden">
                            <div className="flex justify-between">
                                <h2 className="text-2xl text-[#52575E]">
                                    {dataLang?.personnels_deparrtments_title}
                                </h2>
                                <div className="flex justify-end items-center">
                                    <Popup_phongban
                                        listBr={listBr}
                                        onRefresh={_ServerFetching.bind(this)}
                                        dataLang={dataLang}
                                        className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded grid grid-cols-6 items-center justify-between xl:p-3 p-2">
                                        <div className="grid grid-cols-5 gap-2 col-span-4">
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
                                            <div className="ml-1 col-span-1">
                                                {/* <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>{dataLang?.client_list_brand}</h6> */}
                                                <Select
                                                    // options={listBr_filter}
                                                    options={[
                                                        {
                                                            value: "",
                                                            label: "Chọn chi nhánh",
                                                            isDisabled: true,
                                                        },
                                                        ...listBr_filter,
                                                    ]}
                                                    onChange={onchang_filterBr.bind(
                                                        this,
                                                        "branch"
                                                    )}
                                                    value={idBranch}
                                                    hideSelectedOptions={false}
                                                    isMulti
                                                    isClearable={true}
                                                    placeholder={
                                                        dataLang?.client_list_filterbrand
                                                    }
                                                    className="rounded-md bg-white  xl:text-base text-[14.5px] z-20"
                                                    isSearchable={true}
                                                    noOptionsMessage={() =>
                                                        "Không có dữ liệu"
                                                    }
                                                    components={{ MultiValue }}
                                                    closeMenuOnSelect={false}
                                                    style={{
                                                        border: "none",
                                                        boxShadow: "none",
                                                        outline: "none",
                                                    }}
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        colors: {
                                                            ...theme.colors,
                                                            primary25:
                                                                "#EBF5FF",
                                                            primary50:
                                                                "#92BFF7",
                                                            primary: "#0F4F9E",
                                                        },
                                                    })}
                                                    styles={{
                                                        placeholder: (
                                                            base
                                                        ) => ({
                                                            ...base,
                                                            color: "#cbd5e1",
                                                        }),
                                                        control: (
                                                            base,
                                                            state
                                                        ) => ({
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
                                        <div className="col-span-2">
                                            <div className="flex space-x-2 items-center justify-end">
                                                <button
                                                    onClick={_HandleFresh.bind(
                                                        this
                                                    )}
                                                    type="button"
                                                    className="bg-green-50 hover:bg-green-200 hover:scale-105 group p-2 rounded-md transition-all ease-in-out"
                                                >
                                                    <Refresh2
                                                        className="group-hover:-rotate-45 transition-all ease-in-out"
                                                        size="22"
                                                        color="green"
                                                    />
                                                </button>
                                                {data_ex?.length > 0 && (
                                                    <ExcelFile
                                                        filename="Phòng ban"
                                                        title="Pb"
                                                        element={
                                                            <button className="xl:px-4 px-3 xl:py-2.5 py-1.5 xl:text-sm text-xs flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition">
                                                                <IconExcel
                                                                    size={18}
                                                                />
                                                                <span>
                                                                    {
                                                                        dataLang?.client_list_exportexcel
                                                                    }
                                                                </span>
                                                            </button>
                                                        }
                                                    >
                                                        <ExcelSheet
                                                            dataSet={
                                                                multiDataSet
                                                            }
                                                            data={multiDataSet}
                                                            name="Organization"
                                                        />
                                                    </ExcelFile>
                                                )}
                                                <label className="font-[300] text-slate-400">
                                                    {dataLang?.display}
                                                </label>
                                                <select
                                                    className="outline-none"
                                                    onChange={(e) =>
                                                        sLimit(e.target.value)
                                                    }
                                                    value={limit}
                                                >
                                                    <option
                                                        disabled
                                                        className="hidden"
                                                    >
                                                        {limit == -1
                                                            ? "Tất cả"
                                                            : limit}
                                                    </option>
                                                    <option value={15}>
                                                        15
                                                    </option>
                                                    <option value={20}>
                                                        20
                                                    </option>
                                                    <option value={40}>
                                                        40
                                                    </option>
                                                    <option value={60}>
                                                        60
                                                    </option>
                                                    <option value={-1}>
                                                        Tất cả
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="min:h-[500px] 2xl:h-[92%] xl:h-[69%] h-[72%] max:h-[800px]   overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className="xl:w-[100%] w-[110%] pr-2 ">
                                        <div className="flex items-center sticky top-0 rounded-xl shadow-sm bg-white divide-x p-2 z-10">
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[30%] font-[600] text-center">
                                                {
                                                    dataLang?.personnels_deparrtments_name
                                                }
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[25%] font-[600] text-center">
                                                {
                                                    dataLang?.personnels_deparrtments_email
                                                }
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[25%] font-[600] text-center">
                                                {dataLang?.client_list_brand}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[20%] font-[600] text-center">
                                                {
                                                    dataLang?.branch_popup_properties
                                                }
                                            </h4>
                                        </div>
                                        {onFetching ? (
                                            <Loading
                                                className="h-80"
                                                color="#0f4f9e"
                                            />
                                        ) : data?.length > 0 ? (
                                            <>
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px] ">
                                                    {data?.map((e) => (
                                                        <div
                                                            className="flex items-center py-1.5 px-2 hover:bg-slate-100/40 "
                                                            key={e.id.toString()}
                                                        >
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 py-3 w-[30%] text-left">
                                                                {e.name}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 py-3 w-[25%] text-left">
                                                                {e.email}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px]   px-2 py-3 w-[25%]  rounded-md  ">
                                                                <span className="flex flex-wrap space-x-2">
                                                                    {e?.branch?.map(
                                                                        (e) => (
                                                                            <span
                                                                                key={
                                                                                    e.id
                                                                                }
                                                                                className="mb-1 w-fit xl:text-base text-xs px-2 text-[#0F4F9E] font-[300] py-0.5 border border-[#0F4F9E] rounded-lg"
                                                                            >
                                                                                {
                                                                                    e.name
                                                                                }
                                                                            </span>
                                                                        )
                                                                    )}
                                                                </span>
                                                            </h6>
                                                            <div className="space-x-2 w-[20%] text-center">
                                                                <Popup_phongban
                                                                    onRefresh={_ServerFetching.bind(
                                                                        this
                                                                    )}
                                                                    className="xl:text-base text-xs "
                                                                    listBr={
                                                                        listBr
                                                                    }
                                                                    sValueBr={
                                                                        e.branch
                                                                    }
                                                                    dataLang={
                                                                        dataLang
                                                                    }
                                                                    name={
                                                                        e.name
                                                                    }
                                                                    email={
                                                                        e.email
                                                                    }
                                                                    id={e.id}
                                                                />
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            e.id
                                                                        )
                                                                    }
                                                                    className="xl:text-base text-xs "
                                                                >
                                                                    <IconDelete color="red" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className=" max-w-[352px] mt-24 mx-auto">
                                                <div className="text-center">
                                                    <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                                                        <IconSearch />
                                                    </div>
                                                    <h1 className="textx-[#141522] text-base opacity-90 font-medium">
                                                        Không tìm thấy các mục
                                                    </h1>
                                                    <div className="flex items-center justify-around mt-6 ">
                                                        <Popup_phongban
                                                            onRefresh={_ServerFetching.bind(
                                                                this
                                                            )}
                                                            dataLang={dataLang}
                                                            className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                                        />
                                                    </div>
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
                                    {dataLang?.display}{" "}
                                    {totalItem?.iTotalDisplayRecords}{" "}
                                    {dataLang?.among} {totalItem?.iTotalRecords}{" "}
                                    {dataLang?.ingredient}
                                </h6>
                                <Pagination
                                    postsPerPage={limit}
                                    totalPosts={Number(
                                        totalItem?.iTotalDisplayRecords
                                    )}
                                    paginate={paginate}
                                    currentPage={router.query?.page || 1}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

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
    const maxToShow = 3;
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
