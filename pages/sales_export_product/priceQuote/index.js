import React, { useRef, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ModalImage from "react-modal-image";
import 'react-datepicker/dist/react-datepicker.css';

import {
    Grid6 as IconExcel, Filter as IconFilter, Calendar as IconCalendar, SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    TickCircle,
    ArrowCircleDown
} from "iconsax-react";
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import Datepicker from 'react-tailwindcss-datepicker'
import DatePicker, { registerLocale } from "react-datepicker";
import Popup from 'reactjs-popup';
import moment from 'moment/moment';
import vi from "date-fns/locale/vi"
registerLocale("vi", vi);

const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});

import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from '/services/axios';
import Pagination from '/components/UI/pagination';

import Swal from "sweetalert2";

import ReactExport from "react-data-export";
import { useEffect } from 'react';
import { debounce } from 'lodash';
import PopupDetail from './popup_detail';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;


const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
})


const Index = (props) => {
    const dataLang = props.dataLang;
    const router = useRouter();
    const [data, sData] = useState([]);
    const [dataExcel, sDataExcel] = useState([]);
    const [onFetching, sOnFetching] = useState(false);
    const [onFetching_filter, sOnFetching_filter] = useState(false);
    const [totalItems, sTotalItems] = useState([]);
    const [keySearch, sKeySearch] = useState("")
    const [limit, sLimit] = useState(15);
    const [total, sTotal] = useState({})
    const [listBr, sListBr] = useState([])
    const [listQuoteCode, sListQuoteCode] = useState([])
    const [listCustomer, sListCustomer] = useState([])
    const [listOrderType, sListOrderType] = useState([])
    const [idBranch, sIdBranch] = useState(null);
    const [idQuoteCode, sIdQuoteCode] = useState(null);
    const [idCustomer, sIdCustomer] = useState(null);
    const [idOrderType, sIdOrderType] = useState(null);
    const [listTabStatus, sListTabStatus] = useState()
    const [valueDate, sValueDate] = useState({
        startDate: null,
        endDate: null
    });

    const [statusButton, sStatusButton] = useState(data.map(e => ({ status: e?.status })))
    const [active, sActive] = useState(null)
    const [onSending, sOnSending] = useState(null)

    const [dateRange, sDateRange] = useState([]);
    const formatDate = (date) => {
        const day = date?.getDate().toString().padStart(2, '0');
        const month = (date?.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
        const year = date?.getFullYear();
        return `${year}-${month}-${day}`;
    };
    const formattedDateRange = dateRange.map((date) => formatDate(date));

    const _HandleSelectTab = (e) => {
        router.push({
            pathname: router.route,
            query: { tab: e }
        })
    }
    useEffect(() => {
        router.push({
            pathname: router.route,
            query: { tab: router.query?.tab ? router.query?.tab : "all" }
        })
    }, []);

    const _ServerFetching = () => {
        const tabPage = router.query?.tab;
        console.log("tabPage : ", tabPage)
        Axios("GET", `/api_web/Api_quotation/quotation/?csrf_protection=true`, {
            params: {
                search: keySearch,
                limit: limit,
                page: router.query?.page || 1,
                "filter[branch_id]": idBranch != null ? idBranch.value : null,
                "filter[id]": idQuoteCode != null ? idQuoteCode?.value : null,
                "filter[status_bar]": tabPage ?? null,
                "filter[client_id]": idCustomer ? idCustomer.value : null,
                "filter[start_date]": valueDate?.startDate != null ? valueDate?.startDate : null,
                "filter[end_date]": valueDate?.endDate != null ? valueDate?.endDate : null,
            }
        }, (err, response) => {

            if (!err) {
                var { rResult, output, rTotal } = response.data
                sData(rResult)
                sTotalItems(output)
                sDataExcel(rResult)
                sTotal(rTotal)
            }

            sOnFetching(false)
        })
    }

    // fetch tab
    const _ServerFetching_group = () => {
        Axios("GET", `/api_web/Api_quotation/filterBar?csrf_protection=true`, {
            params: {
                limit: 0,
                search: keySearch,
                "filter[branch_id]": idBranch != null ? idBranch.value : null,
            }
        }, (err, response) => {
            if (!err) {
                var data = response.data
                sListTabStatus(data)
            }
            sOnFetching(false)
        })
    }

    // filter
    const _ServerFetching_filter = () => {
        Axios("GET", `/api_web/Api_Branch/branch/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                var { rResult } = response.data
                sListBr(rResult)
            }
        })
        Axios("GET", `/api_web/Api_quotation/quotationCombobox/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                var rResult = response.data.result
                sListQuoteCode(rResult)
            }
        })
        Axios("GET", "/api_web/api_client/client_option/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var db = response.data.rResult
                sListCustomer(db?.map(e => ({ label: e.name, value: e.id })))
            }
        })
        sOnFetching_filter(false)
    }


    useEffect(() => {
        onFetching && _ServerFetching() || onFetching && _ServerFetching_group()
        console.log('server fetching')
    }, [onFetching]);
    useEffect(() => {
        console.log('server fetching filter')
        onFetching_filter && _ServerFetching_filter()
    }, [onFetching_filter])
    useEffect(() => {
        router.query.tab && sOnFetching(true) || (keySearch && sOnFetching(true)) || router.query?.tab && sOnFetching_filter(true) || idBranch != null && sOnFetching(true) || idQuoteCode != null && sOnFetching(true) || idCustomer != null && sOnFetching(true) || idOrderType != null && sOnFetching(true) || valueDate.startDate != null && valueDate.endDate != null && sOnFetching(true)
    }, [limit, router.query?.page, router.query?.tab, idBranch, idQuoteCode, idCustomer, idOrderType, valueDate.endDate, valueDate.startDate]);

    const listBr_filter = listBr ? listBr?.map(e => ({ label: e.name, value: e.id })) : []
    const listCode_filter = listQuoteCode ? listQuoteCode?.map(e => ({ label: e.reference_no, value: e.id })) : []

    const typeFunctions = {
        "branch": sIdBranch,
        "code": sIdQuoteCode,
        "customer": sIdCustomer,
        "date": sValueDate,
    };

    const onchange_filter = (type, value) => {
        console.log("check type filter : ", type)
        console.log("check value filter : ", value)
        // if (type == "branch") {
        //     sIdBranch(value)
        // } else if (type == "code") {
        //     sIdQuoteCode(value)
        // } else if (type == "customer") {
        //     sIdCustomer(value)
        // } else if (type == "date") {
        //     sValueDate(value)
        // }
        const updateFunction = typeFunctions[type];
        if (updateFunction) {
            updateFunction(value);
        }

    }

    const paginate = pageNumber => {
        router.push({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
                page: pageNumber
            }
        })
    }

    const _HandleOnChangeKeySearch = _.debounce(({ target: { value } }) => {
        sKeySearch(value)
        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            }
        });
        if (!value) {
            sOnFetching(true)
        }
        sOnFetching(true)

    }, 500);

    const formatNumber = (number) => {
        if (!number && number !== 0) return 0;
        const integerPart = Math.floor(number)
        return integerPart.toLocaleString("en")
    }

    const _ToggleStatus = (id) => {
        const index = data.findIndex(x => x.id === id);

        Swal.fire({
            title: `${"Thay đổi trạng thái"}`,
            icon: 'warning',
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonColor: '#0F4F9E',
            denyButtonColor: '#d33',
            cancelButtonColor: 'gray',
            confirmButtonText: `${data[index].status === 'confirmed' ? dataLang?.aler_not_yet_approved : dataLang?.aler_approved}`,
            denyButtonText: `${data[index].status === 'no_confirmed' ? dataLang?.aler_not_yet_approved : dataLang?.aler_no_approved}`,
            cancelButtonText: `${dataLang?.aler_cancel}`,
            didOpen: () => {
                const confirmButton = document.querySelector('.swal2-confirm');
                confirmButton.classList.add('w-32');
            }
        }).then((result) => {
            if (result.isConfirmed) {
                let newStatus = "";

                if (data[index].status === "not_confirmed") {
                    newStatus = "confirmed";
                } else if (data[index].status === "confirmed") {
                    newStatus = "not_confirmed";
                } else if (data[index].status === "no_confirmed") {
                    newStatus = "confirmed";
                }

                _ServerPostStatus(id, newStatus);
                sActive(newStatus);
            }
            if (result.isDenied) {
                const newStatus = data[index].status === "no_confirmed" ? "not_confirmed" : "no_confirmed";

                _ServerPostStatus(id, newStatus);
                sActive(newStatus);
            }
        });
    };

    const handleToggleOrdered = (id) => {
        const index = data.findIndex(x => x.id === id);

        if (data[index].status === 'ordered') {
            Toast.fire({
                icon: 'error',
                title: `${dataLang?.no_change_status_when_order || 'no_change_status_when_order'}`
            })
        }
    }

    // excel
    const multiDataSet = [
        {
            columns: [
                { title: "ID", width: { wch: 4 }, style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } } },
                { title: `${dataLang?.price_quote_date || "price_quote_date"}`, width: { wpx: 100 }, style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } } },
                { title: `${dataLang?.price_quote_code || "price_quote_code"}`, width: { wch: 40 }, style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } } },
                { title: `${dataLang?.price_quote_customer || "price_quote_customer"}`, width: { wch: 40 }, style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } } },
                { title: `${dataLang?.price_quote_total || "price_quote_total"}`, width: { wch: 40 }, style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } } },
                { title: `${dataLang?.price_quote_tax_money || "price_quote_tax_money"}`, width: { wch: 40 }, style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } } },
                { title: `${dataLang?.price_quote_into_money || "price_quote_into_money"}`, width: { wch: 40 }, style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } } },
                { title: `${dataLang?.price_quote_effective_date || "price_quote_effective_date"}`, width: { wch: 40 }, style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } } },
                { title: `${dataLang?.price_quote_order_status || "price_quote_order_status"}`, width: { wch: 40 }, style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } } },
                { title: `${dataLang?.price_quote_branch || "price_quote_branch"}`, width: { wch: 40 }, style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } } },
                { title: `${dataLang?.price_quote_note || "price_quote_note"}`, width: { wch: 40 }, style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } } },
            ],
            data: dataExcel?.map((e) =>
                [
                    { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
                    { value: `${e?.date ? e?.date : ""}` },
                    { value: `${e?.reference_no ? e?.reference_no : ""}` },
                    { value: `${e?.client_name ? e?.client_name : ""}` },
                    // tiền chưa!
                    { value: `${e?.total_price ? formatNumber(e?.total_price) : ""}` },
                    { value: `${e?.total_tax_price ? formatNumber(e?.total_tax_price) : ""}` },
                    { value: `${e?.total_amount ? formatNumber(e?.total_amount) : ""}` },

                    { value: `${e?.validity ? e?.validity : ""}` },
                    // order status chưa
                    // {value: `${e?.import_status ? e?.import_status === "0" && "Chưa chi" || e?.import_status === "1" && "Chi 1 phần" ||  e?.import_status === "2"  &&"Đã chi đủ" : ""}`},
                    { value: `${e?.status ? e?.status === "not_confirmed" && "Chưa duyệt" || e?.status === "confirmed" && "Đã duyệt" || e?.status === "no_confirmed" && "Không duyệt" || e?.status === 'ordered' && "Đã tạo đơn đặt hàng" : ""}` },

                    { value: `${e?.branch_name ? e?.branch_name : ""}` },
                    { value: `${e?.note ? e?.note : ""}` },

                ]
            ),
        }
    ];

    const _ServerPostStatus = (id, newStatus) => {
        const formData = new FormData();

        formData.append("id", id);
        formData.append("status", newStatus);

        Axios("POST", `/api_web/Api_quotation/changeStatus/${id}/${newStatus}?csrf_protection=true`, {
            data: formData,
            headers: { "Content-Type": "multipart/form-data" }
        }, (err, response) => {
            if (!err) {
                var { isSuccess } = response.data;

                if (isSuccess !== false) {
                    Toast.fire({
                        icon: 'success',
                        title: `${dataLang?.change_status_when_order || 'change_status_when_order'}`
                    })
                }
                sOnSending(false)
                _ServerFetching()
                _ServerFetching_group()
            }
        })
    }
    useEffect(() => {
        active != null && sOnSending(true)
    }, [active != null])


    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.price_quote || "price_quote"} </title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
                <div className="flex space-x-3 xl:text-xs text-[12px]">
                    <h6 className="text-[#141522]/40">{dataLang?.price_quote || "price_quote"}</h6>
                    <span className="text-[#141522]/40">/</span>
                    <h6>{dataLang?.price_quote_list || "price_quote"}</h6>
                </div>

                <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-3 h-[96%] overflow-hidden">
                            <div className='flex justify-between'>
                                <h2 className="text-2xl text-[#52575E] capitalize">{dataLang?.price_quote || "price_quote"}</h2>
                                <div className="flex justify-end items-center">
                                    <Link href="/sales_export_product/priceQuote/form" className='xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105'>{dataLang?.price_quote_btn_new || "price_quote_btn_new"}</Link>
                                    {/* <Popup_dsncc  listBr={listBr}  listSelectCt={listSelectCt}  onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" /> */}
                                </div>
                            </div>

                            <div className="flex space-x-3 items-center h-[8vh] justify-start overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                {listTabStatus && listTabStatus.map((e) => {
                                    return (
                                        <div>
                                            <TabClient
                                                style={{
                                                    backgroundColor: "#e2f0fe"
                                                }} dataLang={dataLang}
                                                key={e?.id}
                                                onClick={_HandleSelectTab.bind(this, `${e?.id}`)}
                                                total={e?.count}
                                                active={e?.id}
                                                className={"text-[#0F4F9E]"}
                                            >
                                                {dataLang[e?.name]}
                                            </TabClient>
                                        </div>
                                    )
                                })
                                }
                            </div>
                            <div className="space-y-2 2xl:h-[91%] h-[92%] overflow-hidden">
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded grid grid-cols-7  xl:p-3 p-2 gap-2">
                                        <div className='col-span-6'>
                                            <div className='grid grid-cols-5'>
                                                <div className='col-span-1'>
                                                    <form className="flex items-center relative">
                                                        <IconSearch size={20} className="absolute 2xl:left-3 z-10  text-[#cccccc] xl:left-[4%] left-[1%]" />
                                                        <input
                                                            className=" relative bg-white  outline-[#D0D5DD] focus:outline-[#0F4F9E]  2xl:text-left 2xl:pl-10 xl:pl-0 p-0 2xl:py-1.5  py-2.5 rounded 2xl:text-base text-xs xl:text-center text-center 2xl:w-full xl:w-full w-[100%]"
                                                            type="text"
                                                            onChange={_HandleOnChangeKeySearch.bind(this)}
                                                            placeholder={dataLang?.branch_search}
                                                        />
                                                    </form>
                                                </div>
                                                <div className='ml-1 col-span-1'>
                                                    <Select
                                                        options={[{ value: '', label: dataLang?.price_quote_branch || "price_quote_branch", isDisabled: true }, ...listBr_filter]}
                                                        onChange={onchange_filter.bind(this, "branch")}
                                                        value={idBranch}
                                                        placeholder={dataLang?.price_quote_select_branch || "price_quote_select_branch"}
                                                        hideSelectedOptions={false}
                                                        isClearable={true}
                                                        className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px] z-20"
                                                        isSearchable={true}
                                                        noOptionsMessage={() => "Không có dữ liệu"}
                                                        // components={{ MultiValue }}
                                                        closeMenuOnSelect={true}
                                                        style={{ border: "none", boxShadow: "none", outline: "none" }}
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            colors: {
                                                                ...theme.colors,
                                                                primary25: '#EBF5FF',
                                                                primary50: '#92BFF7',
                                                                primary: '#0F4F9E',
                                                            },
                                                        })}
                                                        styles={{
                                                            placeholder: (base) => ({
                                                                ...base,
                                                                color: "#cbd5e1",
                                                            }),
                                                            control: (base, state) => ({
                                                                ...base,
                                                                border: 'none',
                                                                outline: 'none',
                                                                boxShadow: 'none',
                                                                ...(state.isFocused && {
                                                                    boxShadow: '0 0 0 1.5px #0F4F9E',
                                                                }),
                                                            })
                                                        }}
                                                    />
                                                </div>
                                                <div className='ml-1  col-span-1'>
                                                    <Select
                                                        // onInputChange={_HandleSeachApi.bind(this)}
                                                        options={[{ value: '', label: dataLang?.price_quote_select_code || "price_quote_select_code", isDisabled: true }, ...listCode_filter]}
                                                        onChange={onchange_filter.bind(this, "code")}
                                                        value={idQuoteCode}
                                                        placeholder={dataLang?.price_quote_code || "price_quote_code"}
                                                        hideSelectedOptions={false}
                                                        isClearable={true}
                                                        className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px] z-20"
                                                        isSearchable={true}
                                                        noOptionsMessage={() => "Không có dữ liệu"}
                                                        // components={{ MultiValue }}
                                                        style={{ border: "none", boxShadow: "none", outline: "none" }}
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            colors: {
                                                                ...theme.colors,
                                                                primary25: '#EBF5FF',
                                                                primary50: '#92BFF7',
                                                                primary: '#0F4F9E',
                                                            },
                                                        })}
                                                        styles={{
                                                            placeholder: (base) => ({
                                                                ...base,
                                                                color: "#cbd5e1",
                                                            }),
                                                            control: (base, state) => ({
                                                                ...base,
                                                                border: 'none',
                                                                outline: 'none',
                                                                boxShadow: 'none',
                                                                ...(state.isFocused && {
                                                                    boxShadow: '0 0 0 1.5px #0F4F9E',
                                                                }),
                                                            })
                                                        }}
                                                    />
                                                </div>
                                                <div className='ml-1 col-span-1'>
                                                    <Select
                                                        //  options={listBr_filter}
                                                        options={[{ value: '', label: dataLang?.price_quote_select_customer || "price_quote_select_customer", isDisabled: true }, ...listCustomer]}
                                                        onChange={onchange_filter.bind(this, "customer")}
                                                        value={idCustomer}
                                                        placeholder={dataLang?.price_quote_customer || "price_quote_customer"}
                                                        hideSelectedOptions={false}
                                                        isClearable={true}
                                                        className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px] z-20"
                                                        isSearchable={true}
                                                        noOptionsMessage={() => "Không có dữ liệu"}
                                                        style={{ border: "none", boxShadow: "none", outline: "none" }}
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            colors: {
                                                                ...theme.colors,
                                                                primary25: '#EBF5FF',
                                                                primary50: '#92BFF7',
                                                                primary: '#0F4F9E',
                                                            },
                                                        })}
                                                        styles={{
                                                            placeholder: (base) => ({
                                                                ...base,
                                                                color: "#cbd5e1",
                                                            }),
                                                            control: (base, state) => ({
                                                                ...base,
                                                                border: 'none',
                                                                outline: 'none',
                                                                boxShadow: 'none',
                                                                ...(state.isFocused && {
                                                                    boxShadow: '0 0 0 1.5px #0F4F9E',
                                                                }),
                                                            })
                                                        }}
                                                    />
                                                </div>
                                                <div className='z-20 ml-1 col-span-1'>
                                                    <Datepicker
                                                        value={valueDate}
                                                        i18n={"vi"}
                                                        primaryColor={"blue"}
                                                        onChange={onchange_filter.bind(this, "date")}
                                                        showShortcuts={true}
                                                        displayFormat={"DD/MM/YYYY"}
                                                        configs={{
                                                            shortcuts: {
                                                                today: "Hôm nay",
                                                                yesterday: "Hôm qua",
                                                                past: period => `${period}  ngày qua`,
                                                                currentMonth: "Tháng này",
                                                                pastMonth: "Tháng trước"
                                                            },
                                                            footer: {
                                                                cancel: "Từ bỏ",
                                                                apply: "Áp dụng"
                                                            }
                                                        }}
                                                        className="react-datepicker__input-container 2xl:placeholder:text-xs xl:placeholder:text-xs placeholder:text-[8px]"
                                                        inputClassName="rounded-md w-full 2xl:p-2 xl:p-[11px] p-3 bg-white focus:outline-[#0F4F9E]  2xl:placeholder:text-xs xl:placeholder:text-xs placeholder:text-[8px] border-none  2xl:text-base xl:text-xs text-[10px]  focus:outline-none focus:ring-0 focus:border-transparent"
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className='flex justify-end items-center gap-2'>
                                                <div>
                                                    {
                                                        dataExcel?.length > 0 && (
                                                            <ExcelFile filename="Danh sách báo giá" title="DSBG" element={
                                                                <button className='xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition'>
                                                                    <IconExcel className='2xl:scale-100 xl:scale-100 scale-75' size={18} /><span>{dataLang?.client_list_exportexcel}</span></button>}>
                                                                <ExcelSheet dataSet={multiDataSet} data={multiDataSet} name="Organization" />
                                                            </ExcelFile>
                                                        )
                                                    }
                                                </div>
                                                <div>
                                                    <div className="font-[300] text-slate-400 2xl:text-xs xl:text-sm text-[8px]">{dataLang?.display}</div>
                                                    <select className="outline-none  text-[10px] xl:text-xs 2xl:text-sm" onChange={(e) => sLimit(e.target.value)} value={limit}>
                                                        <option className='text-[10px] xl:text-xs 2xl:text-sm hidden' disabled>{limit == -1 ? "Tất cả" : limit}</option>
                                                        <option className='text-[10px] xl:text-xs 2xl:text-sm' value={15}>15</option>
                                                        <option className='text-[10px] xl:text-xs 2xl:text-sm' value={20}>20</option>
                                                        <option className='text-[10px] xl:text-xs 2xl:text-sm' value={40}>40</option>
                                                        <option className='text-[10px] xl:text-xs 2xl:text-sm' value={60}>60</option>
                                                        {/* <option value={-1}>Tất cả</option> */}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="min:h-[200px] h-[82%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className="pr-2 w-[100%] lx:w-[120%] ">
                                        <div className="grid grid-cols-11 items-center sticky top-0 bg-white p-2 z-10">
                                            <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.price_quote_date || "price_quote_table_date"}</h4>
                                            <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.price_quote_code || "price_quote_table_code"}</h4>
                                            <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.price_quote_customer || "price_quote_table_customer"}</h4>
                                            <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.price_quote_total || "price_quote_table_total"}</h4>
                                            <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.price_quote_tax_money || "price_quote_tax_money"}</h4>
                                            <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.price_quote_into_money || "price_quote_into_money"}</h4>
                                            <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.price_quote_effective_date || "price_quote_table_effective_date"}</h4>
                                            <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.price_quote_order_status || "price_quote_order_status"}</h4>
                                            <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.price_quote_note || "price_quote_note"}</h4>
                                            <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300]'>{dataLang?.price_quote_branch || "price_quote_branch"}</h4>
                                            <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.price_quote_operations || "price_quote_operations"}</h4>
                                        </div>
                                        {onFetching ?
                                            <Loading className="h-80" color="#0f4f9e" />
                                            :
                                            data?.length > 0 ?
                                                (
                                                    <>
                                                        <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px] ">
                                                            {(data?.map((e) =>
                                                                <div className='grid grid-cols-11 items-center py-1.5 px-2 hover:bg-slate-100/40 ' key={e.id.toString()}>
                                                                    <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-center'>
                                                                        {e?.date != null ? moment(e?.date).format("DD/MM/YYYY") : ""}
                                                                    </h6>

                                                                    <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-center text-[#0F4F9E] hover:font-normal cursor-pointer'>
                                                                        <PopupDetail dataLang={dataLang} className="text-left" name={e?.reference_no} id={e?.id} />
                                                                    </h6>

                                                                    <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-left '>
                                                                        {e.client_name}
                                                                    </h6>

                                                                    <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-right'>
                                                                        {formatNumber(e.total_price)}
                                                                    </h6>

                                                                    <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-right'>
                                                                        {formatNumber(e.total_tax_price)}
                                                                    </h6>

                                                                    <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-right'>
                                                                        {formatNumber(e.total_amount)}
                                                                    </h6>

                                                                    <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-center'>
                                                                        {e?.validity != null ? moment(e?.validity).format("DD/MM/YYYY") : ""}
                                                                    </h6>

                                                                    <h6 className='px-2 col-span-1 flex items-center justify-center text-center '>
                                                                        {/* {e?.import_status === "not_stocked" && <span className=' font-normal 2xl:text-xs xl:text-xs text-[8px] text-sky-500  rounded-xl py-1 px-2  min-w-[100px] bg-sky-200'>{dataLang[e?.import_status]}</span> ||
                                                                        e?.import_status === "stocked_part" && <span className=' font-normal 2xl:text-xs xl:text-xs text-[8px] text-orange-500 rounded-xl py-1 px-2  min-w-[100px] bg-orange-200'>{dataLang[e?.import_status]}</span> ||
                                                                        e?.import_status === "stocked" && <span className='flex 2xl:text-xs xl:text-xs text-[8px] items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2  min-w-[100px] bg-lime-200'><TickCircle className='bg-lime-500 rounded-full ' color='white' size={15} />{dataLang[e?.import_status]}</span>
                                                                    } */}
                                                                        <h6 className='px-2 py-1 2xl:text-base xl:text-xs text-[8px] col-span-1 flex items-center justify-center text-center cursor-pointer'>
                                                                            {
                                                                                e?.status === "confirmed" &&
                                                                                (
                                                                                    <div className='border border-lime-500 px-2 py-1 rounded text-lime-500 font-normal flex justify-center  items-center gap-1 3xl:text-[14px] 2xl:text-[14px] xl:text-xs text-[8px]' onClick={() => _ToggleStatus(e?.id)}>
                                                                                        Đã duyệt
                                                                                        <TickCircle className='bg-lime-500 rounded-full' color='white' size={19} />
                                                                                    </div>
                                                                                )
                                                                                ||
                                                                                e?.status === "not_confirmed" &&
                                                                                (
                                                                                    <div className='border border-red-500 px-2 py-1 rounded text-red-500  font-normal flex justify-center items-center gap-1 3xl:text-[14px] 2xl:text-[14px] xl:text-xs text-[8px]' onClick={() => _ToggleStatus(e?.id)}>
                                                                                        Chưa duyệt <TickCircle size={19} />
                                                                                    </div>
                                                                                )
                                                                                ||
                                                                                e?.status === "no_confirmed" &&
                                                                                (
                                                                                    <div className='border border-[#0F4F9E] px-2 py-1 rounded text-[#0F4F9E]  font-normal flex justify-center items-center gap-1 3xl:text-[14px] 2xl:text-[14px] xl:text-xs text-[8px]' onClick={() => _ToggleStatus(e?.id)}>
                                                                                        Không duyệt <TickCircle size={19} />
                                                                                    </div>
                                                                                )
                                                                                ||
                                                                                e?.status === "ordered" &&
                                                                                (
                                                                                    <div className='border border-[#FF8C00] px-2 py-1 rounded text-[#FF8C00]  font-normal flex justify-center items-center gap-1 3xl:text-[14px] 2xl:text-[14px] xl:text-xs text-[8px] xl:max-w-[130px] max-w-[80px]' onClick={() => handleToggleOrdered(e?.id)}>
                                                                                        Đã tạo đơn đặt hàng <TickCircle color='#FF8C00' size={33} />
                                                                                    </div>
                                                                                )
                                                                            }
                                                                        </h6>

                                                                    </h6>

                                                                    <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-left'>
                                                                        {e?.note}
                                                                    </h6>

                                                                    <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1'>
                                                                        <span className="mr-2 mb-1 w-fit 2xl:text-base xl:text-xs text-[8px] px-2 text-[#0F4F9E] font-[300] py-0.5 border border-[#0F4F9E] rounded-[5.5px]">
                                                                            {e?.branch_name}
                                                                        </span>
                                                                    </h6>

                                                                    <div className='col-span-1 flex justify-center'>
                                                                        <BtnTacVu onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} status={e?.status} id={e?.id} className="bg-slate-100 xl:px-4 px-3 xl:py-1.5 py-1 rounded 2xl:text-base xl:text-xs text-[8px]" />
                                                                        {/* <button className='bg-slate-100 xl:px-4 px-3 xl:py-1.5 py-1 rounded xl:text-base text-xs'>Tác vụ</button> */}
                                                                    </div>
                                                                </div>

                                                            ))}
                                                        </div>
                                                    </>
                                                )
                                                :
                                                (
                                                    <div className=" max-w-[352px] mt-24 mx-auto" >
                                                        <div className="text-center">
                                                            <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                                                            <h1 className="textx-[#141522] text-base opacity-90 font-medium">{dataLang?.purchase_order_table_item_not_found || "purchase_order_table_item_not_found"}</h1>
                                                            <div className="flex items-center justify-around mt-6 ">
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='grid grid-cols-11 bg-gray-100 items-center'>
                            <div className='col-span-3 p-2 text-center'>
                                <h3 className='uppercase font-normal 2xl:text-base xl:text-xs text-[8px]'>{dataLang?.purchase_order_table_total_outside || "purchase_order_table_total_outside"}</h3>
                            </div>
                            <div className='col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap'>
                                <h3 className='font-normal 2xl:text-base xl:text-xs text-[8px]'>{formatNumber(total?.total_price)}</h3>
                            </div>
                            <div className='col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap '>
                                <h3 className='font-normal 2xl:text-base xl:text-xs text-[8px]'>{formatNumber(total?.total_tax_price)}</h3>
                            </div>
                            <div className='col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap'>
                                <h3 className='font-normal 2xl:text-base xl:text-xs text-[8px]'>{formatNumber(total?.total_amount)}</h3>
                            </div>
                        </div>
                        {data?.length != 0 &&
                            <div className='flex space-x-5 items-center'>
                                <h6>{dataLang?.display} {totalItems?.iTotalDisplayRecords}</h6>
                                {/* <h6>{dataLang?.display} {totalItems?.iTotalDisplayRecords} {dataLang?.among} {totalItems?.iTotalRecords} {dataLang?.ingredient}</h6> */}
                                <Pagination
                                    postsPerPage={limit}
                                    totalPosts={Number(totalItems?.iTotalDisplayRecords)}
                                    paginate={paginate}
                                    currentPage={router.query?.page || 1}
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </React.Fragment >
    );
}
const TabClient = React.memo((props) => {
    const router = useRouter();
    // console.log("check prrops : ", props)
    return (
        <button style={props.style} onClick={props.onClick} className={`${props.className} justify-center min-w-[180px] flex gap-2 2xl:text-sm xl:text-sm text-xs items-center rounded-[5.5px] px-2 py-2 outline-none relative`}>
            {router.query?.tab === `${props.active}` && <ArrowCircleDown size="20" color="#0F4F9E" />}
            {props.children}
            <span className={`${props?.total > 0 && "absolute min-w-[29px] top-0 right-0 bg-[#ff6f00]  translate-x-2.5 -translate-y-2 text-white rounded-[100%] px-2 text-center items-center flex justify-center 2xl:py-1 py-1"} `}>
                {props?.total > 0 && props?.total}
            </span>
        </button>

    )
})

const BtnTacVu = React.memo((props) => {
    const [openTacvu, sOpenTacvu] = useState(false);
    const _ToggleModal = (e) => sOpenTacvu(e);

    const [openDetail, sOpenDetail] = useState(false);
    const router = useRouter()

    const _HandleDelete = (id) => {
        Swal.fire({
            title: `${props.dataLang?.aler_ask} `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#296dc1',
            cancelButtonColor: '#d33',
            confirmButtonText: `${props.dataLang?.aler_yes} `,
            cancelButtonText: `${props.dataLang?.aler_cancel} `
        }).then((result) => {
            if (result.isConfirmed) {
                Axios("DELETE", `/ api_web / Api_purchase_order / purchase_order / ${id}?csrf_protection = true`, {
                }, (err, response) => {
                    if (!err) {
                        var { isSuccess, message } = response.data;
                        if (isSuccess) {
                            Toast.fire({
                                icon: 'success',
                                title: props.dataLang[message]
                            })
                            props.onRefresh && props.onRefresh()
                        } else {
                            Toast.fire({
                                icon: 'error',
                                title: props.dataLang[message]
                            })
                        }
                    }
                })
            }
        })
    }
    const handleClick = () => {
        // if (props?.status != "not_stocked") {
        //     Toast.fire({
        //         icon: 'error',
        //         title: `${"Đơn đặt hàng đã có phiếu Nhập. Không thể sửa"} `
        //     })
        // }
        // else {
        router.push(`/sales_export_product/priceQuote/form?id=${props.id}`);
        // }
    };

    return (
        <div>
            <Popup
                trigger={
                    <button className={`flex space-x-1 items-center ` + props.className} >
                        <span>
                            {props.dataLang?.price_quote_action || "price_quote_action"}
                        </span>
                        <IconDown size={12} />
                    </button>
                }
                arrow={false}
                position="bottom right"
                className={`dropdown-edit`}
                keepTooltipInside={props.keepTooltipInside}
                closeOnDocumentClick
                nested
                onOpen={_ToggleModal.bind(this, true)}
                onClose={_ToggleModal.bind(this, false)}
            >
                <div className="w-auto rounded">
                    <div className="bg-white rounded-t flex flex-col overflow-hidden">
                        <button
                            onClick={handleClick}
                            className="2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full">
                            {props.dataLang?.purchase_order_table_edit || "purchase_order_table_edit"}
                        </button>
                        <button onClick={_HandleDelete.bind(this, props.id)} className='2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full'>
                            {props.dataLang?.purchase_order_table_delete || "purchase_order_table_delete"}
                        </button>
                    </div>
                </div>
            </Popup>
        </div>
    )
})


export default Index;