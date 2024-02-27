import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import moment from "moment/moment";

import {
    Grid6 as IconExcel,
    Filter as IconFilter,
    Calendar as IconCalendar,
    SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    Add as IconAdd,
    TickCircle,
    ArrowCircleDown,
    Image as IconImage,
    Refresh2,
} from "iconsax-react";

import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";

import Select from "react-select";
import Popup from "reactjs-popup";
import { useRouter } from "next/router";

import "react-datepicker/dist/react-datepicker.css";
import Datepicker from "react-tailwindcss-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import "dayjs/locale/vi";

import { _ServerInstance as Axios } from "/services/axios";

dayjs.locale("vi");

import Swal from "sweetalert2";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

import ReactExport from "react-data-export";
import Popup_chitiet from "./(popup)/popup";

import Loading from "@/components/UI/loading";
import Pagination from "@/components/UI/pagination";
import { routerPurchases } from "routers/buyImportGoods";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import useStatusExprired from "@/hooks/useStatusExprired";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";

import { CONFIRMATION_OF_CHANGES, TITLE_STATUS } from "@/constants/changeStatus/changeStatus";
import BtnAction from "@/components/UI/BtnAction";
import { CONFIRM_DELETION, TITLE_DELETE } from "@/constants/delete/deleteTable";
import { debounce } from "lodash";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const formatNumber = (number) => {
        const integerPart = Math.floor(number);
        return integerPart.toLocaleString("en");
    };

    const isShow = useToast();

    const { isOpen, isId, handleQueryId } = useToggle();

    const _HandleFresh = () => sOnFetching(true);

    const trangthaiExprired = useStatusExprired();

    const [data, sData] = useState([]);

    const [dataExcel, sDataExcel] = useState([]);

    const [onFetching, sOnFetching] = useState(false);

    const [onnFetching_filter, sOnFetching_filter] = useState(false);

    const [totalItems, sTotalItems] = useState([]);

    const [keySearch, sKeySearch] = useState("");

    const [limit, sLimit] = useState(15);

    const [listDs, sListDs] = useState();

    const tabPage = router.query?.tab;

    const [listBr, sListBr] = useState();

    const [listCode, sListCode] = useState();

    const [listUser, sListUser] = useState();

    const [idBranch, sIdBranch] = useState(null);

    const [idCode, sIdCode] = useState(null);

    const [idUser, sIdUser] = useState(null);

    const [active, sActive] = useState(null);

    const [onSending, sOnSending] = useState(false);

    const [valueDate, sValueDate] = useState({
        startDate: null,
        endDate: null,
    });

    const _HandleSelectTab = (e) => {
        router.push({
            pathname: router.route,
            query: { tab: e },
        });
    };
    useEffect(() => {
        router.push({
            pathname: router.route,
            query: { tab: router.query?.tab ? router.query?.tab : "" },
        });
    }, []);
    const _ServerFetching = () => {
        Axios(
            "GET",
            "/api_web/Api_purchases/purchases/?csrf_protection=true",
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id]": idBranch != null ? idBranch.value : null,
                    "filter[status]": tabPage,
                    "filter[id]": idCode?.value,
                    "filter[staff_id]": idUser?.value,
                    "filter[start_date]": valueDate?.startDate,
                    "filter[end_date]": valueDate?.endDate,
                },
            },
            (err, response) => {
                if (!err) {
                    let { output, rResult } = response.data;
                    sData(rResult);
                    sDataExcel(rResult);
                    sTotalItems(output);
                }
                sOnFetching(false);
            }
        );
    };

    const _ServerFetching_filter = () => {
        Axios("GET", `/api_web/Api_Branch/branch/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let { rResult } = response.data;
                sListBr(rResult);
            }
        });

        Axios("GET", `/api_web/Api_purchases/purchases/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let { rResult } = response.data;
                sListCode(rResult);
            }
        });

        Axios("GET", `/api_web/Api_staff/staffOption?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let { rResult } = response.data;
                sListUser(rResult);
            }
        });

        sOnFetching_filter(false);
    };

    const listBr_filter = listBr ? listBr?.map((e) => ({ label: e.name, value: e.id })) : [];

    const listCode_filter = listCode ? listCode?.map((e) => ({ label: e.code, value: e.id })) : [];

    const listUser_filter = listUser ? listUser?.map((e) => ({ label: e.name, value: e.staffid })) : [];

    const onchang_filter = (type, value) => {
        if (type == "branch") {
            sIdBranch(value);
        } else if (type == "code") {
            sIdCode(value);
        } else if (type == "user") {
            sIdUser(value);
        } else if (type == "date") {
            sValueDate(value);
        }
    };

    const _ServerFetching_group = () => {
        Axios(
            "GET",
            `/api_web/Api_purchases/purchasesFilterBar/?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                    search: keySearch,
                    "filter[branch_id]": idBranch != null ? idBranch.value : null,
                    "filter[id]": idCode?.value,
                    "filter[staff_id]": idUser?.value,
                    "filter[start_date]": valueDate?.startDate,
                    "filter[end_date]": valueDate?.endDate,
                },
            },
            (err, response) => {
                if (!err) {
                    let data = response.data;
                    sListDs(data);
                }
                sOnFetching(false);
            }
        );
    };

    const paginate = (pageNumber) => {
        router.push({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
                page: pageNumber,
            },
        });
    };

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        sKeySearch(value);

        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            },
        });

        // setTimeout(() => {
        //     if (!value) {
        //         sOnFetching(true);
        //     }
        //     sOnFetching(true);
        // }, 500);
        sOnFetching(true);
    }, 500)

    useEffect(() => {
        (onFetching && _ServerFetching()) || (onFetching && _ServerFetching_group());
    }, [onFetching]);

    useEffect(() => {
        onnFetching_filter && _ServerFetching_filter();
    }, [onnFetching_filter]);

    useEffect(() => {
        (router.query.tab && sOnFetching(true)) ||
            (keySearch && sOnFetching(true)) ||
            sOnFetching_filter(true) ||
            (router.query.tab == "" && sOnFetching(true)) ||
            (idBranch != null && sOnFetching(true)) ||
            (idCode != null && sOnFetching(true)) ||
            (idUser != null && sOnFetching(true)) ||
            (valueDate.startDate != null && valueDate.endDate != null && sOnFetching(true));
    }, [
        limit,
        router.query?.page,
        router.query?.tab,
        idBranch,
        idCode,
        idUser,
        valueDate.endDate,
        valueDate.startDate,
    ]);

    const _ToggleStatus = () => {
        const index = data.findIndex((x) => x.id === isId);
        const newStatus = data[index].status === "0" ? "1" : "0";

        _ServerSending(isId, newStatus);

        sActive(newStatus);

        handleQueryId({ status: false });
    };

    const _ServerSending = (id, newStatus) => {
        Axios(
            "POST",
            `${`/api_web/Api_purchases/updateStatus/${id}/${newStatus}?csrf_protection=true`}`,
            {
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    let { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", `${dataLang[message]}`);
                    } else {
                        isShow("error", `${dataLang[message]}`);
                    }
                }

                sOnSending(false);

                _ServerFetching();

                _ServerFetching_group();
            }
        );
    };

    useEffect(() => {
        active != null && sOnSending(true);
    }, [active != null]);

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
                    title: `${dataLang?.purchase_day || "purchase_day"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_code || "purchase_code"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_planNumber || "purchase_planNumber"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_propnent || "purchase_propnent"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_status || "purchase_status"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_totalitem || "purchase_totalitem"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_orderStatus || "purchase_orderStatus"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_branch || "purchase_branch"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.purchase_note || "purchase_note"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],
            data: dataExcel?.map((e) => [
                { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
                { value: `${e?.date ? e?.date : ""}` },
                { value: `${e?.code ? e?.code : ""}` },
                { value: `${e?.reference_no ? e?.reference_no : ""}` },
                {
                    value: `${e?.staff_create_name ? e?.staff_create_name : ""}`,
                },
                {
                    value: `${e?.status ? (e?.status === "1" ? "Đã duyệt" : "Chưa duyệt") : ""}`,
                },
                { value: `${e?.total_item ? e?.total_item : ""}` },
                {
                    value:
                        e?.order_status?.status === "purchase_ordered"
                            ? dataLang[e?.order_status?.status]
                            : "" ||
                            `${e?.order_status.status === "purchase_portion"
                                ? dataLang[e?.order_status?.status] + " " + `(${e?.order_status?.count})`
                                : ""
                            }` ||
                            `${e?.order_status.status === "purchase_enough"
                                ? dataLang[e?.order_status?.status] + " " + `(${e?.order_status?.count})`
                                : ""
                            }`,
                },
                { value: `${e?.branch_name ? e?.branch_name : ""}` },
                { value: `${e?.note ? e?.note : ""}` },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.purchase_title}</title>
            </Head>
            <div className="xl:px-10 px-3 xl:pt-24 pt-[88px] pb-3 space-y-2.5 h-screen overflow-hidden flex flex-col justify-between">
                <div className="h-[97%] space-y-3 overflow-hidden">
                    {trangthaiExprired ? (
                        <div className="p-2"></div>
                    ) : (
                        <div className="flex space-x-3 text-[12px]">
                            <h6 className="text-[#141522]/40">{dataLang?.purchase_title}</h6>
                            <span className="text-[#141522]/40">/</span>
                            <h6 className="">{dataLang?.purchase_title}</h6>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl text-[#52575E] capitalize ">{dataLang?.purchase_title}</h2>
                        <div className="flex space-x-3 items-center">
                            <Link
                                href={routerPurchases.form}
                                className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                            >
                                Tạo mới
                            </Link>
                        </div>
                    </div>
                    <div className="flex space-x-3 items-center h-[8vh] justify-start overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                        {listDs &&
                            listDs.map((e) => {
                                return (
                                    <div>
                                        <TabStatus
                                            key={e.id}
                                            onClick={_HandleSelectTab.bind(this, `${e.id}`)}
                                            total={e.count}
                                            active={e.id}
                                            className={`${e.color ? "text-white" : "text-[#0F4F9E] bg-[#e2f0fe] "}`}
                                        >
                                            {dataLang[e?.name] || e?.name}
                                        </TabStatus>
                                    </div>
                                );
                            })}
                    </div>

                    <div className="bg-slate-100 w-full rounded grid grid-cols-6  xl:p-3 p-2 gap-2">
                        <div className="col-span-5">
                            <div className="grid grid-cols-5">
                                <div className="col-span-1">
                                    <form className="flex items-center relative">
                                        <IconSearch
                                            size={20}
                                            className="absolute 2xl:left-3 z-10  text-[#cccccc] xl:left-[4%] left-[1%]"
                                        />
                                        <input
                                            className=" relative bg-white  outline-[#D0D5DD] focus:outline-[#0F4F9E]  2xl:text-left 2xl:pl-10 xl:pl-0 p-0 2xl:py-2    xl:py-3 py-3 rounded 2xl:text-base text-xs xl:text-center text-center 2xl:w-full xl:w-full w-[100%]"
                                            type="text"
                                            onChange={_HandleOnChangeKeySearch.bind(this)}
                                            placeholder={dataLang?.branch_search}
                                        />
                                    </form>
                                </div>
                                <div className="ml-1 col-span-1">
                                    <Select
                                        options={[
                                            {
                                                value: "",
                                                label: dataLang?.client_list_filterbrand,
                                                isDisabled: true,
                                            },
                                            ...listBr_filter,
                                        ]}
                                        onChange={onchang_filter.bind(this, "branch")}
                                        value={idBranch}
                                        isClearable={true}
                                        // isMulti
                                        closeMenuOnSelect={false}
                                        hideSelectedOptions={false}
                                        placeholder={dataLang?.client_list_brand || "client_list_brand"}
                                        className="rounded-md py-0.5 bg-white border-none 2xl:text-base xl:text-xs text-[10px] z-20"
                                        isSearchable={true}
                                        // components={{ MultiValue }}
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
                                                    boxShadow: "0 0 0 1.5px #0F4F9E",
                                                }),
                                            }),
                                        }}
                                    />
                                </div>
                                <div className="ml-1 col-span-1">
                                    <Select
                                        options={[
                                            {
                                                value: "",
                                                label: dataLang?.purchase_code,
                                                isDisabled: true,
                                            },
                                            ...listCode_filter,
                                        ]}
                                        onChange={onchang_filter.bind(this, "code")}
                                        value={idCode}
                                        noOptionsMessage={() => `${dataLang?.no_data_found}`}
                                        isClearable={true}
                                        placeholder={dataLang?.purchase_code || "purchase_code"}
                                        className="rounded-md py-0.5 bg-white border-none 2xl:text-base xl:text-xs text-[10px] z-20"
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
                                                    boxShadow: "0 0 0 1.5px #0F4F9E",
                                                }),
                                            }),
                                        }}
                                    />
                                </div>
                                <div className="ml-1 col-span-1">
                                    <Select
                                        options={[
                                            {
                                                value: "",
                                                label: dataLang?.purchase_propnent,
                                                isDisabled: true,
                                            },
                                            ...listUser_filter,
                                        ]}
                                        // formatOptionLabel={CustomSelectOption}
                                        onChange={onchang_filter.bind(this, "user")}
                                        value={idUser}
                                        noOptionsMessage={() => `${dataLang?.no_data_found}`}
                                        isClearable={true}
                                        placeholder={dataLang?.purchase_propnent || "purchase_propnent"}
                                        className="rounded-md py-0.5 bg-white border-none 2xl:text-base xl:text-xs text-[10px] z-20"
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
                                                    boxShadow: "0 0 0 1.5px #0F4F9E",
                                                }),
                                            }),
                                        }}
                                    />
                                </div>
                                <div className="ml-1 col-span-1 z-20">
                                    <Datepicker
                                        value={valueDate}
                                        i18n={"vi"}
                                        primaryColor={"blue"}
                                        onChange={onchang_filter.bind(this, "date")}
                                        showShortcuts={true}
                                        displayFormat={"DD/MM/YYYY"}
                                        configs={{
                                            shortcuts: {
                                                today: "Hôm nay",
                                                yesterday: "Hôm qua",
                                                past: (period) => `${period}  ngày qua`,
                                                currentMonth: "Tháng này",
                                                pastMonth: "Tháng trước",
                                            },
                                            footer: {
                                                cancel: "Từ bỏ",
                                                apply: "Áp dụng",
                                            },
                                        }}
                                        className="react-datepicker__input-container 2xl:placeholder:text-xs xl:placeholder:text-xs placeholder:text-[8px]"
                                        inputClassName="rounded-md w-full 2xl:p-2 xl:p-[11px] p-3 bg-white focus:outline-[#0F4F9E]  2xl:placeholder:text-xs xl:placeholder:text-xs placeholder:text-[8px] border-none  2xl:text-base xl:text-xs text-[10px]  focus:outline-none focus:ring-0 focus:border-transparent"
                                    />
                                    {/* <div className='relative flex items-center'>
                              <DatePicker
                                  selectsRange={true}
                                  startDate={dateRange[0]}
                                  endDate={dateRange[1]}
                                  onChange={onchang_filter.bind(this, "date")}
                                  locale={'vi'}
                                  dateFormat="dd-MM-yyyy"
                                  isClearable={true}
                                  placeholderText="Chọn ngày chứng từ"
                                  className="bg-white w-full py-2 rounded pl-10 text-black outline-[#0F4F9E]"
                                  />
                                  <IconCalendar size={20} className="absolute left-3 text-[#cccccc]" />
                              </div> */}
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex justify-end items-center gap-2">
                                <button
                                    onClick={_HandleFresh.bind(this)}
                                    type="button"
                                    className="bg-green-50 hover:bg-green-200 hover:scale-105 group p-2 rounded-md transition-all ease-in-out animate-pulse hover:animate-none"
                                >
                                    <Refresh2
                                        className="group-hover:-rotate-45 transition-all ease-in-out "
                                        size="22"
                                        color="green"
                                    />
                                </button>
                                <div>
                                    {dataExcel?.length > 0 && (
                                        <ExcelFile
                                            filename="Danh sách đơn đặt hàng (PO)"
                                            title="DSDDH"
                                            element={
                                                <button className="xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition">
                                                    <IconExcel
                                                        className="2xl:scale-100 xl:scale-100 scale-75"
                                                        size={18}
                                                    />
                                                    <span>{dataLang?.client_list_exportexcel}</span>
                                                </button>
                                            }
                                        >
                                            <ExcelSheet
                                                dataSet={multiDataSet}
                                                data={multiDataSet}
                                                name="Organization"
                                            />
                                        </ExcelFile>
                                    )}
                                </div>
                                <div className="">
                                    <div className="font-[300] text-slate-400 2xl:text-xs xl:text-sm text-[8px]">
                                        {dataLang?.display}
                                    </div>
                                    <select
                                        className="outline-none  text-[10px] xl:text-xs 2xl:text-sm"
                                        onChange={(e) => sLimit(e.target.value)}
                                        value={limit}
                                    >
                                        <option className="text-[10px] xl:text-xs 2xl:text-sm hidden" disabled>
                                            {limit == -1 ? "Tất cả" : limit}
                                        </option>
                                        <option className="text-[10px] xl:text-xs 2xl:text-sm" value={15}>
                                            15
                                        </option>
                                        <option className="text-[10px] xl:text-xs 2xl:text-sm" value={20}>
                                            20
                                        </option>
                                        <option className="text-[10px] xl:text-xs 2xl:text-sm" value={40}>
                                            40
                                        </option>
                                        <option className="text-[10px] xl:text-xs 2xl:text-sm" value={60}>
                                            60
                                        </option>
                                        {/* <option value={-1}>Tất cả</option> */}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="min:h-[500px] 2xl:h-[76%] h-[70%] max:h-[800px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 tooltipBoundary">
                        <div className="pr-2">
                            <div className="grid grid-cols-12 sticky top-0 bg-white p-2 z-10 rounded-xl shadow-sm  divide-x">
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1  text-center">
                                    {dataLang?.purchase_day || "purchase_day"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                    {dataLang?.purchase_code || "purchase_code"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                    {dataLang?.purchase_planNumber || "purchase_planNumber"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                    {dataLang?.purchase_propnent || "purchase_propnent"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1  text-center">
                                    {dataLang?.purchase_status || "purchase_status"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                    {dataLang?.purchase_totalitem || "purchase_totalitem"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center col-span-2 ">
                                    {dataLang?.purchase_orderStatus || "purchase_orderStatus"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center col-span-2 ">
                                    {dataLang?.purchase_note || "purchase_note"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                    {dataLang?.purchase_branch || "purchase_branch"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center  col-span-1 ">
                                    {dataLang?.purchase_action || "purchase_action"}
                                </h4>
                            </div>
                            {onFetching ? (
                                <Loading className="h-80" color="#0f4f9e" />
                            ) : data?.length > 0 ? (
                                <div className="divide-y divide-slate-200">
                                    {data?.map((e) => (
                                        <div
                                            key={e?.id.toString()}
                                            className="grid grid-cols-12 items-center hover:bg-slate-50 relative"
                                        >
                                            <h6 className="px-2 py-2.5 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 col-span-1 flex items-center justify-center">
                                                {e?.date != null ? moment(e?.date).format("DD/MM/YYYY") : ""}
                                            </h6>
                                            <h6 className="px-2 py-2.5 3xl:text-base text-center justify-center 2xl:text-[12.5px] xl:text-[11px] font-semibold text-[9px]  col-span-1 flex items-center  text-[#0F4F9e] hover:text-[#5599EC] transition-all ease-linear  cursor-pointer">
                                                <Popup_chitiet
                                                    dataLang={dataLang}
                                                    className="text-left"
                                                    name={e?.code}
                                                    id={e?.id}
                                                />
                                            </h6>
                                            <h6 className="px-2 py-2.5 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 col-span-1 flex items-center ">
                                                {e?.reference_no}
                                            </h6>
                                            <h6 className="px-2 py-2.5 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 col-span-1 flex items-center ">
                                                {e?.staff_create_name}
                                            </h6>
                                            <h6 className="px-2 py-2.5 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 col-span-1 flex items-center justify-center text-center cursor-pointer">
                                                {e?.status == "1" ? (
                                                    <div
                                                        className="border border-green-500 px-2 py-1 rounded text-green-500 hover:bg-green-500 hover:text-white font-normal flex justify-center  items-center gap-1 3xl:text-[16px] 2xl:text-[14px] xl:text-[10px] text-[8px]  transition-all duration-300 ease-in-out"
                                                        onClick={() => handleQueryId({ id: e?.id, status: true })}
                                                    >
                                                        Đã duyệt{" "}
                                                        <TickCircle
                                                            className="bg-green-500 rounded-full "
                                                            color="white"
                                                            size={19}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="border border-red-500 3xl:px-2 px-0 py-1 rounded text-red-500 hover:bg-red-500 hover:text-white  font-normal flex justify-center items-center gap-1 3xl:text-[16px] 2xl:text-[13px] xl:text-[10px] text-[8px]   transition-all duration-300 ease-in-out "
                                                        onClick={() => handleQueryId({ id: e?.id, status: true })}
                                                    >
                                                        Chưa duyệt <TickCircle size={22} />
                                                    </div>
                                                )}
                                            </h6>
                                            <h6 className="px-2 py-2.5 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 col-span-1 flex items-center justify-center ">
                                                {formatNumber(e?.total_item)}
                                            </h6>
                                            <h6 className="px-2 py-2.5 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 col-span-2 flex items-center ">
                                                <div className="mx-auto">
                                                    {(e?.order_status?.status === "purchase_ordered" && (
                                                        <span className="flex items-center justify-center font-normal text-sky-500  rounded-xl py-1 px-2 min-w-[135px]  bg-sky-200 text-center 2xl:text-sm xl:text-xs text-[8px]">
                                                            {dataLang[e?.order_status?.status]}
                                                        </span>
                                                    )) ||
                                                        (e?.order_status?.status === "purchase_portion" && (
                                                            <span className=" flex items-center justify-center font-normal text-orange-500 rounded-xl py-1 px-2 min-w-[135px]  bg-orange-200 text-center 2xl:text-sm xl:text-xs text-[8px]">
                                                                {dataLang[e?.order_status?.status]}{" "}
                                                                {`(${e?.order_status?.count})`}
                                                            </span>
                                                        )) ||
                                                        (e?.order_status?.status === "purchase_enough" && (
                                                            <span className="flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 min-w-[135px]  bg-lime-200 text-center 2xl:text-sm xl:text-xs text-[8px]">
                                                                <TickCircle
                                                                    className="bg-lime-500 rounded-full"
                                                                    color="white"
                                                                    size={15}
                                                                />
                                                                {dataLang[e?.order_status?.status]}{" "}
                                                                {`(${e?.order_status?.count})`}
                                                            </span>
                                                        ))}
                                                </div>
                                            </h6>
                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-2 text-left truncate ">
                                                {e?.note}
                                            </h6>
                                            <h6 className="col-span-1 w-fit mx-auto">
                                                <div className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">
                                                    {e?.branch_name}
                                                </div>
                                            </h6>
                                            <div className="pl-2 py-2.5 col-span-1 flex space-x-2 justify-center">
                                                <BtnAction
                                                    onRefresh={_ServerFetching.bind(this)}
                                                    onRefreshGroup={_ServerFetching_group.bind(this)}
                                                    dataLang={dataLang}
                                                    id={e?.id}
                                                    order={e?.order_status}
                                                    status={e?.status}
                                                    type="purchases"
                                                    className="bg-slate-100 xl:px-4 px-2 xl:py-1.5 py-1 rounded 2xl:text-base xl:text-xs text-[9px]"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className=" max-w-[352px] mt-24 mx-auto">
                                    <div className="text-center">
                                        <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                                            <IconSearch />
                                        </div>
                                        <h1 className="textx-[#141522] text-base opacity-90 font-medium">
                                            {dataLang?.no_data_found || "no_data_found"}
                                        </h1>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {data?.length != 0 && (
                    <div className="flex space-x-5 items-center">
                        <h6>
                            Hiển thị {totalItems?.iTotalDisplayRecords} trong số {totalItems?.iTotalRecords} thành phần
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
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                title={TITLE_STATUS}
                subtitle={CONFIRMATION_OF_CHANGES}
                isOpen={isOpen}
                save={_ToggleStatus}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment>
    );
};

const TabStatus = React.memo((props) => {
    const router = useRouter();
    return (
        <button
            style={props.style}
            onClick={props.onClick}
            className={`${props.className} justify-center min-w-[180px] flex gap-2 2xl:text-sm xl:text-sm text-xs items-center rounded-[5.5px] px-2 py-2 outline-none relative `}
        >
            {router.query?.tab === `${props.active}` && <ArrowCircleDown size="20" color="#0F4F9E" />}
            {props.children}
            <span
                className={`${props?.total > 0 &&
                    "absolute min-w-[29px] top-0 right-0 bg-[#ff6f00] text-xs translate-x-2.5 -translate-y-2 text-white rounded-[100%] px-2 text-center items-center flex justify-center py-1.5"
                    } `}
            >
                {props?.total > 0 && props?.total}
            </span>
        </button>
    );
});

export default Index;
