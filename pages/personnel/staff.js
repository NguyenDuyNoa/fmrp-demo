import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { _ServerInstance as Axios } from "/services/axios";
const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});
import Image from "next/image";
import ReactExport from "react-data-export";
import ModalImage from "react-modal-image";

import Swal from "sweetalert2";

import {
    Edit as IconEdit,
    Grid6 as IconExcel,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    Add as IconAdd,
    Eye as IconEye,
    EyeSlash as IconEyeSlash,
    Image as IconImage,
    GalleryEdit as IconEditImg,
    Refresh2,
} from "iconsax-react";
import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import Pagination from "/components/UI/pagination";
import dynamic from "next/dynamic";
import moment from "moment/moment";
import Select, { components } from "react-select";
import Popup from "reactjs-popup";
import Popup_chitiet from "./(popupStaff)/popupDetail";
import Popup_dsnd from "./(popupStaff)/popup";
import { useSelector } from "react-redux";

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

    const [keySearch, sKeySearch] = useState("");
    const [limit, sLimit] = useState(15);
    const [totalItem, sTotalItems] = useState([]);

    const [onFetching, sOnFetching] = useState(false);
    const [data, sData] = useState({});
    const [data_ex, sData_ex] = useState([]);
    const [listDs, sListDs] = useState();
    const [onSending, sOnSending] = useState(false);
    const [dataOption, sDataOption] = useState([]);
    const [idPos, sIdPos] = useState(null);
    const [onFetchingOpt, sOnFetchingOpt] = useState(false);

    const [room, sRoom] = useState([]);

    const _ServerFetching_room = async () => {
        await Axios(
            "GET",
            `/api_web/api_staff/department/?csrf_protection=true`,
            {},
            (err, response) => {
                if (!err) {
                    var { rResult } = response.data;
                    sRoom(rResult);
                }
                sOnFetching(false);
            }
        );
    };
    const _ServerFetching = async () => {
        await Axios(
            "GET",
            `/api_web/api_staff/staff/?csrf_protection=true" }`,
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id]":
                        idBranch?.length > 0
                            ? idBranch.map((e) => e.value)
                            : null,
                    "filter[position_id]": idPos?.value,
                },
            },
            (err, response) => {
                if (!err) {
                    var { rResult, output } = response.data;
                    sData(rResult);
                    sTotalItems(output);
                    sData_ex(rResult);
                }
                sOnFetching(false);
            }
        );
    };

    const [listBr, sListBr] = useState();
    const _ServerFetching_brand = async () => {
        await Axios(
            "GET",
            `/api_web/Api_Branch/branch/?csrf_protection=true`,
            {
                params: {},
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
    const listBr_filter = listBr?.map((e) => ({ label: e.name, value: e.id }));
    const [idBranch, sIdBranch] = useState(null);
    const onchang_filterBr = (type, value) => {
        if (type == "branch") {
            sIdBranch(value);
        }
    };

    const _ServerFetchingOtp = async () => {
        await Axios(
            "GET",
            "/api_web/api_staff/positionOption",
            {},
            (err, response) => {
                if (!err) {
                    var { rResult } = response.data;
                    sDataOption(
                        rResult.map((x) => ({
                            label: `${x.name}`,
                            value: x.id,
                            level: x.level,
                            code: x.code,
                            parent_id: x.parent_id,
                        }))
                    );
                }
            }
        );
        sOnFetchingOpt(false);
    };
    const _HandleFilterOpt = (type, value) => {
        if (type == "pos") {
            sIdPos(value);
        }
    };
    useEffect(() => {
        onFetchingOpt && _ServerFetchingOtp();
    }, [onFetchingOpt]);

    useEffect(() => {
        sOnFetchingOpt(true);
    }, []);

    const hiddenOptions = idBranch?.length > 3 ? idBranch?.slice(0, 3) : [];
    const options = listBr_filter
        ? listBr_filter?.filter((x) => !hiddenOptions.includes(x.value))
        : [];
    const paginate = (pageNumber) => {
        router.push({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
                page: pageNumber,
            },
        });
    };

    const _HandleOnChangeKeySearch = ({ target: { value } }) => {
        sKeySearch(value);
        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            },
        });
        setTimeout(() => {
            if (!value) {
                sOnFetching(true);
            }
            sOnFetching(true);
        }, 500);
    };
    useEffect(() => {
        (onFetching && _ServerFetching()) ||
            (onFetching && _ServerFetching_brand()) ||
            (onFetching && _ServerFetching_room());
    }, [onFetching]);
    useEffect(() => {
        sOnFetching(true) ||
            (keySearch && sOnFetching(true)) ||
            (idBranch?.length > 0 && sOnFetching(true)) ||
            (idPos && sOnFetching(true));
    }, [limit, router.query?.page, , idBranch, idPos]);

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
                    `/api_web/api_staff/staff/${id}?csrf_protection=true`,
                    {},
                    (err, response) => {
                        if (!err) {
                            var { isSuccess, message } = response.data;

                            if (isSuccess) {
                                Toast.fire({
                                    icon: "success",
                                    title: dataLang?.aler_success_delete,
                                });
                            } else if (message) {
                                Toast.fire({
                                    icon: "error",
                                    title: `${dataLang[message]}`,
                                });
                            }
                        }
                        _ServerFetching();
                    }
                );
            }
        });
    };
    const [status, sStatus] = useState("");
    const [active, sActive] = useState("");
    // const [fecthActive,sFecthActive] = useState(false)
    // const _ToggleStatus = (id, value) => {
    //   var index = data.findIndex(x => {
    //     if(x.id === id){
    //       return x.id === id
    //     }
    //   });
    //   var db =  data[index].active = value.target.checked
    //   // sActive()
    //   sStatus(id)
    //   sData([...data])
    //   // console.log(data[index] = !active);
    //   // data[index]?.active = !active
    //   // sData([...data])
    // }
    const _ToggleStatus = (id) => {
        Swal.fire({
            title: `${"Thay đổi trạng thái"}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#296dc1",
            cancelButtonColor: "#d33",
            confirmButtonText: `${dataLang?.aler_yes}`,
            cancelButtonText: `${dataLang?.aler_cancel}`,
        }).then((result) => {
            if (result.isConfirmed) {
                sStatus(id);
                var index = data.findIndex((x) => x.id === id);
                if (index !== -1 && data[index].active === "0") {
                    sActive((data[index].active = "1"));
                } else if (index !== -1 && data[index].active === "1") {
                    sActive((data[index].active = "0"));
                }
                sData([...data]);
            }
        });
    };
    const _ServerSending = async () => {
        let id = status;
        var data = new FormData();
        data.append("active", active);
        await Axios(
            "POST",
            `${
                id &&
                `/api_web/api_staff/change_status_staff/${id}?csrf_protection=true`
            }`,
            {
                data: {
                    active: active,
                },
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess, message } = response.data;
                    if (isSuccess) {
                        Toast.fire({
                            icon: "success",
                            title: `${dataLang[message]}`,
                        });
                    }
                }
                sOnSending(false);
            }
        );
    };
    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    useEffect(() => {
        sOnSending(true);
    }, [active]);
    useEffect(() => {
        sOnSending(true);
    }, [status]);
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
                    title: `${dataLang?.personnels_staff_table_fullname}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.personnels_staff_table_code}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.personnels_staff_table_email}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.personnels_staff_table_depart}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.personnels_staff_position}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.personnels_staff_table_logged}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.personnels_staff_table_active}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.personnels_staff_popup_manager}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.personnels_staff_position}`,
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
                { value: `${e.full_name ? e.full_name : ""}` },
                { value: `${e.code ? e.code : ""}` },
                { value: `${e.email ? e.email : ""}` },
                {
                    value: `${
                        e.department ? e.department?.map((e) => e.name) : ""
                    }`,
                },
                { value: `${e.position_name ? e.position_name : ""}` },
                { value: `${e.last_login ? e.last_login : ""}` },

                {
                    value: `${
                        e.active
                            ? e.active == "1"
                                ? "Đang hoạt động"
                                : "Không hoạt động"
                            : ""
                    }`,
                },
                {
                    value: `${
                        e.admin
                            ? e.admin == "1" && "Có"
                            : e.admin == "0" && "Không"
                    }`,
                },
                { value: `${e.position_name ? e.position_name : ""}` },
                { value: `${e.branch ? e.branch?.map((i) => i.name) : ""}` },
            ]),
        },
    ];
    const trangthaiExprired = useSelector((state) => state?.trangthaiExprired);
    const _HandleFresh = () => sOnFetching(true);
    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.personnels_staff_title}</title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
                {trangthaiExprired ? (
                    <div className="p-2"></div>
                ) : (
                    <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.personnels_staff_title}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.personnels_staff_title}</h6>
                    </div>
                )}
                <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-3 h-[96%] overflow-hidden">
                            <div className="flex justify-between">
                                <h2 className="text-2xl text-[#52575E] capitalize">
                                    {dataLang?.personnels_staff_title}
                                </h2>
                                <div className="flex justify-end items-center">
                                    <Popup_dsnd
                                        room={room}
                                        listBr={listBr}
                                        dataOption={dataOption}
                                        onRefresh={_ServerFetching.bind(this)}
                                        dataLang={dataLang}
                                        data={data}
                                        className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded grid grid-cols-6 justify-between xl:p-3 p-2">
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
                                                <div className="ml-1 col-span-1">
                                                    {/* <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>{dataLang?.client_list_brand}</h6> */}
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
                                                        onChange={onchang_filterBr.bind(
                                                            this,
                                                            "branch"
                                                        )}
                                                        value={idBranch}
                                                        hideSelectedOptions={
                                                            false
                                                        }
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
                                                        components={{
                                                            MultiValue,
                                                        }}
                                                        closeMenuOnSelect={
                                                            false
                                                        }
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
                                                                primary:
                                                                    "#0F4F9E",
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
                                                                boxShadow:
                                                                    "none",
                                                                ...(state.isFocused && {
                                                                    boxShadow:
                                                                        "0 0 0 1.5px #0F4F9E",
                                                                }),
                                                            }),
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-1 col-span-1">
                                                    {/* <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>{dataLang?.personnels_staff_position}</h6> */}
                                                    <Select
                                                        // options={dataOption}
                                                        options={[
                                                            {
                                                                value: "",
                                                                label: "Chọn chức vụ",
                                                                isDisabled: true,
                                                            },
                                                            ...dataOption,
                                                        ]}
                                                        formatOptionLabel={
                                                            CustomSelectOption
                                                        }
                                                        onChange={_HandleFilterOpt.bind(
                                                            this,
                                                            "pos"
                                                        )}
                                                        value={idPos}
                                                        isClearable={true}
                                                        placeholder={
                                                            dataLang?.personnels_staff_position_click
                                                        }
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
                                                                primary25:
                                                                    "#EBF5FF",
                                                                primary50:
                                                                    "#92BFF7",
                                                                primary:
                                                                    "#0F4F9E",
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
                                                                boxShadow:
                                                                    "none",
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
                                                        filename="Danh sách người dùng"
                                                        title="Dsnd"
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
                                <div className="min:h-[500px] 2xl:h-[92%] xl:h-[69%] h-[72%] max:h-[800px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className="pr-2 w-[100%] lx:w-[115%] ">
                                        <div className="flex items-center sticky top-0 rounded-xl shadow-sm bg-white divide-x p-2 z-10">
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600  uppercase w-[18%] font-semibold text-center">
                                                {
                                                    dataLang?.personnels_staff_table_avtar
                                                }
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600  uppercase w-[20%] font-semibold text-center">
                                                {
                                                    dataLang?.personnels_staff_table_fullname
                                                }
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600  uppercase w-[20%] font-semibold text-center">
                                                {
                                                    dataLang?.personnels_staff_table_code
                                                }
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600  uppercase w-[22%] font-semibold text-center">
                                                {
                                                    dataLang?.personnels_staff_table_email
                                                }
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600  uppercase w-[15%] font-semibold text-center">
                                                {
                                                    dataLang?.personnels_staff_table_depart
                                                }
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600  uppercase w-[15%] font-semibold text-center">
                                                {
                                                    dataLang?.personnels_staff_position
                                                }
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600  uppercase w-[28%] font-semibold text-center">
                                                {
                                                    dataLang?.personnels_staff_table_logged
                                                }
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600  uppercase w-[20%] font-semibold text-center">
                                                {
                                                    dataLang?.personnels_staff_table_active
                                                }
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600  uppercase w-[20%] font-semibold text-center">
                                                {dataLang?.client_list_brand}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600  uppercase w-[10%] font-semibold text-center">
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
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px]">
                                                    {data?.map((e) => (
                                                        <div
                                                            className="flex items-center py-1.5 px-2 hover:bg-slate-100/40 "
                                                            key={e?.id.toString()}
                                                        >
                                                            <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[18%]  rounded-md text-center ">
                                                                <div className="w-[60px] h-[60px] mx-auto">
                                                                    {e?.profile_image ==
                                                                    null ? (
                                                                        <ModalImage
                                                                            small="/no_image.png"
                                                                            large="/no_image.png"
                                                                            className="w-full h-full rounded object-contain"
                                                                        />
                                                                    ) : (
                                                                        <>
                                                                            <ModalImage
                                                                                small={
                                                                                    e?.profile_image
                                                                                }
                                                                                large={
                                                                                    e?.profile_image
                                                                                }
                                                                                className="w-[60px] h-[60px]  rounded-[100%] object-cover"
                                                                            />
                                                                            {/* <Image width={60} height={60} quality={100} src={e?.profile_image} alt="thumb type" className="w-[60px] h-[60px] rounded-[100%] object-cover" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/> */}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px]   px-2 py-0.5 w-[20%]  rounded-md text-left text-[#0F4F9E] hover:textx-blue-600 transition-all ease-linear">
                                                                <Popup_chitiet
                                                                    dataLang={
                                                                        dataLang
                                                                    }
                                                                    className="text-left"
                                                                    name={
                                                                        e.full_name
                                                                    }
                                                                    id={e?.id}
                                                                />
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5 w-[20%]  rounded-md text-left">
                                                                {e.code}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5 w-[22%]  rounded-md text-left">
                                                                {e.email}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5 w-[15%]  rounded-md text-left">
                                                                <div className="flex flex-wrap gap-2">
                                                                    {e.department?.map(
                                                                        (e) => {
                                                                            return (
                                                                                <span
                                                                                    key={
                                                                                        e.id
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        e.name
                                                                                    }
                                                                                </span>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5 w-[15%]  rounded-md text-center">
                                                                {
                                                                    e.position_name
                                                                }
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5 w-[28%]  rounded-md text-left">
                                                                {e.last_login !=
                                                                null
                                                                    ? moment(
                                                                          e.last_login
                                                                      ).format(
                                                                          "DD/MM/YYYY, h:mm:ss"
                                                                      )
                                                                    : ""}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5 w-[20%]  rounded-md text-center">
                                                                <label
                                                                    htmlFor={
                                                                        e.id
                                                                    }
                                                                    className="relative inline-flex items-center cursor-pointer"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        className="sr-only peer"
                                                                        value={
                                                                            e.active
                                                                        }
                                                                        id={
                                                                            e.id
                                                                        }
                                                                        // defaultChecked
                                                                        checked={
                                                                            e.active ==
                                                                            "0"
                                                                                ? false
                                                                                : true
                                                                        }
                                                                        onChange={_ToggleStatus.bind(
                                                                            this,
                                                                            e.id
                                                                        )}
                                                                    />

                                                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                                </label>
                                                            </h6>
                                                            <h6 className="w-[20%] flex  gap-1 flex-wrap">
                                                                {e.branch?.map(
                                                                    (i) => (
                                                                        <span
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="cursor-default w-fit 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase ml-2"
                                                                        >
                                                                            {
                                                                                i.name
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}
                                                            </h6>
                                                            {/* <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px]   px-2 py-0.5 w-[20%] rounded-md text-left flex justify-start flex-wrap ">
                                                                {e.branch?.map(
                                                                    (i) => (
                                                                        <span
                                                                            key={
                                                                                i.id
                                                                            }
                                                                            className="mr-2 mb-1 w-fit xl:text-base text-xs px-2 text-[#0F4F9E] font-[300] py-0.5 border border-[#0F4F9E] rounded-[5.5px]"
                                                                        >
                                                                            {
                                                                                i.name
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}
                                                            </h6> */}
                                                            <div className="space-x-2 w-[10%] text-center">
                                                                <Popup_dsnd
                                                                    room={room}
                                                                    listBr={
                                                                        listBr
                                                                    }
                                                                    dataOption={
                                                                        dataOption
                                                                    }
                                                                    onRefresh={_ServerFetching.bind(
                                                                        this
                                                                    )}
                                                                    className="xl:text-base text-xs "
                                                                    listDs={
                                                                        listDs
                                                                    }
                                                                    dataLang={
                                                                        dataLang
                                                                    }
                                                                    name={
                                                                        e.name
                                                                    }
                                                                    code={
                                                                        e.code
                                                                    }
                                                                    phone_number={
                                                                        e.phone_number
                                                                    }
                                                                    email={
                                                                        e.email
                                                                    }
                                                                    id={e?.id}
                                                                    department={
                                                                        e.department
                                                                    }
                                                                    position_name={
                                                                        e.position_name
                                                                    }
                                                                    last_login={
                                                                        e.last_login
                                                                    }
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
                                                    <div className="flex items-center justify-around mt-6 "></div>
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
