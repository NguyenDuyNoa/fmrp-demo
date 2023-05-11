import React, {useRef, useState} from 'react';
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
import DatePicker,{registerLocale } from "react-datepicker";
import Popup from 'reactjs-popup';
import moment from 'moment/moment';
import vi from "date-fns/locale/vi"
registerLocale("vi", vi);

const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});

import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import {_ServerInstance as Axios} from '/services/axios';
import Pagination from '/components/UI/pagination';

import Swal from "sweetalert2";

import ReactExport from "react-data-export";
import { useEffect } from 'react';
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
    const [listBr, sListBr]= useState([])
    const [lisCode, sListCode]= useState([])
    const [listSupplier, sListSupplier]= useState([])
    const [listOrderType, sListOrderType]= useState([])
    const [idBranch, sIdBranch] = useState(null);
    const [idCode, sIdCode] = useState(null);
    const [idSupplier, sIdSupplier] = useState(null);
    const [idOrderType, sIdOrderType] = useState(null);
    const [listDs, sListDs] = useState()
    const [valueDate, sValueDate] = useState({
      startDate: null,
      endDate:null
    });

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
            query: { tab: router.query?.tab ? router.query?.tab : "all"  }
        })
      }, []);
      const _ServerFetching =  () => {
        const tabPage = router.query?.tab;
          Axios("GET", `/api_web/Api_purchase_order/purchase_order/?csrf_protection=true`, {
              params: {
                  search: keySearch,
                  limit: limit,  
                  page: router.query?.page || 1,  
                  "filter[branch_id]": idBranch != null ? idBranch.value : null ,
                  "filter[id]":idCode != null ? idCode?.value : null,
                  "filter[status_bar]": tabPage  ?? null,
                  "filter[supplier_id]": idSupplier ? idSupplier.value : null,
                  "filter[order_type]": idOrderType ? idOrderType.value : null,
                  // "filter[start_date]":  formattedDateRange[0] == "undefined-NaN-undefined" ? null : formattedDateRange[0],
                  // "filter[end_date]":  formattedDateRange[1] == "undefined-NaN-undefined" ? null : formattedDateRange[1],
                  "filter[start_date]": valueDate?.startDate != null ? valueDate?.startDate : null ,
                  "filter[end_date]":valueDate?.endDate != null ? valueDate?.endDate : null ,
              }
          }, (err, response) => {
              if(!err){
                  var {rResult, output,rTotal} =  response.data
                  sData(rResult)
                  sTotalItems(output)
                  sDataExcel(rResult)
                  sTotal(rTotal)
              }
              sOnFetching(false)
          })
      }
      const _ServerFetching_group =  () =>{
        Axios("GET", `/api_web/Api_purchase_order/filterBar/?csrf_protection=true`, {
          params:{
            limit: 0,
            search: keySearch,
            // "filter[branch_id]": idBranch?.length > 0 ? idBranch.map(e => e.value) : null
          }
      }, (err, response) => {
        if(!err){
            var data =  response.data
            sListDs(data)
        }
        sOnFetching(false)
      })
      }

      const _ServerFetching_filter =  () =>{
        Axios("GET", `/api_web/Api_Branch/branch/?csrf_protection=true`, {}, (err, response) => {
        if(!err){
            var {rResult} =  response.data
            sListBr(rResult)
        }
      })
        Axios("GET", `/api_web/Api_purchase_order/purchase_order/?csrf_protection=true`, {}, (err, response) => {
        if(!err){
            var {rResult} =  response.data
            sListCode(rResult)
        }
      })
      Axios("GET", "/api_web/api_supplier/supplier/?csrf_protection=true", {}, (err, response) => {
        if(!err){
            var db =  response.data.rResult
            sListSupplier(db?.map(e => ({label: e.name, value:e.id })))
        }
      })
      Axios("GET", "/api_web/Api_purchase_order/order_type_option/?csrf_protection=true", {}, (err, response) => {
        if(!err){
            var data =  response.data
            sListOrderType(data?.map(e => ({label: dataLang[e?.name], value:e.id})))
        }
      })
      sOnFetching_filter(false)
      }

    useEffect(() => {
    onFetching && _ServerFetching() || onFetching && _ServerFetching_group()
    }, [onFetching]);
    useEffect(()=>{
      onFetching_filter && _ServerFetching_filter()
    },[onFetching_filter])
    useEffect(() => {
        router.query.tab && sOnFetching(true) || (keySearch && sOnFetching(true)) ||  router.query?.tab && sOnFetching_filter(true) || idBranch != null && sOnFetching(true) || idCode !=null && sOnFetching(true) || idSupplier != null && sOnFetching(true)|| idOrderType != null && sOnFetching(true) ||  valueDate.startDate != null && valueDate.endDate != null && sOnFetching(true)
    }, [limit,router.query?.page, router.query?.tab,idBranch,idCode,idSupplier,idOrderType,valueDate.endDate, valueDate.startDate]);
    
    const listBr_filter = listBr ? listBr?.map(e =>({label: e.name, value: e.id})) : []
    const listCode_filter = lisCode ? lisCode?.map(e =>({label: e.code, value: e.id})) : []
    const onchang_filter = (type, value)=>{
      if(type == "branch"){
          sIdBranch(value)
      }else if(type == "code"){
        sIdCode(value)
      }else if(type == "supplier"){
        sIdSupplier(value)
      }else if(type == "OrderType"){
        sIdOrderType(value)
      }else if(type == "date"){
        // sDateRange(value)
        sValueDate(value)
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

    const _HandleOnChangeKeySearch = ({target: {value}}) => {
        sKeySearch(value)
        router.replace({
          pathname: router.route,
          query: { 
            tab: router.query?.tab,
          }
        });
        setTimeout(() => {
          if(!value){
            sOnFetching(true)
          }
          sOnFetching(true)
        }, 500);
      };

      // const formatNumber = (number) => {
      //   const integerPart = Math.floor(number).toString();
      //   return integerPart;
      // }
      const formatNumber = (number) => {
        if (!number && number !== 0) return 0;
        const integerPart = Math.floor(number)
        return integerPart.toLocaleString("en")
      }
      // const formatNumberWithCommas = (number) => {
      //   return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      //   // return number
      // }
      // const formatNumber = (number) => {
      //   const formattedNumber = formatNumberWithCommas(number)
      //   return formattedNumber;
      //   // return number
      // }

      const multiDataSet = [
        {
            columns: [
                {title: "ID", width: {wch: 4}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.purchase_order_table_dayvoucers || "purchase_order_table_dayvoucers"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.purchase_order_table_code || "purchase_order_table_code"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.purchase_order_table_ordertype || "purchase_order_table_ordertype"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.purchase_order_table_number || "purchase_order_table_number"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.purchase_order_table_total || "purchase_order_table_total"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.purchase_order_table_totalTax || "purchase_order_table_totalTax"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.purchase_order_table_intoMoney || "purchase_order_table_intoMoney"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.purchase_order_table_statusOfSpending || "purchase_order_table_statusOfSpending"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.purchase_order_table_importStatus || "purchase_order_table_importStatus"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
            ],
            data: dataExcel?.map((e) =>
                [
                    {value: `${e?.id ? e.id : ""}`, style: {numFmt: "0"}},
                    {value: `${e?.date ? e?.date : ""}`},
                    {value: `${e?.code ? e?.code : ""}`},
                    {value: `${e?.supplier_name ? e?.supplier_name : ""}`},
                    {value: `${e?.order_type ? (e?.order_type == "0" ? "Tạo mới" : "Theo YCHM") : ""}`},
                    {value: `${e?.purchases ? e?.purchases?.map(e => {return e?.code}) : ""}`},
                    {value: `${e?.total_price ? e?.total_price : ""}`},
                    {value: `${e?.total_tax_price ? e?.total_tax_price : ""}`},
                    {value: `${e?.total_amount ? e?.total_amount : ""}`},
                    {value: `${e?.import_status ? e?.import_status === "0" && "Chưa chi" || e?.import_status === "1" && "Chi 1 phần" ||  e?.import_status === "2"  &&"Đã chi đủ" : ""}`},
                    {value: `${e?.status_pay ? e?.status_pay === "0" && "Chưa nhập" || e?.status_pay === "1" && "Nhập 1 phần" ||  e?.status_pay === "2"  && "Đã nhập đủ đủ" : ""}`},
                    {value: `${e?.branch_name ? e?.branch_name :""}`},
                   
                ]    
            ),
        }
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.purchase_order || "purchase_order"} </title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
            <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
            <h6 className="text-[#141522]/40">{dataLang?.purchase_order || "purchase_order"}</h6>
            <span className="text-[#141522]/40">/</span>
            <h6>{dataLang?.purchase_order_list || "purchase_order"}</h6>
            </div>

        <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
          <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 h-[96%] overflow-hidden">
                <div className='flex justify-between'>
                    <h2 className="text-2xl text-[#52575E] capitalize">{dataLang?.purchase_order || "purchase_order"}</h2>
                    <div className="flex justify-end items-center">
                    <Link href="/purchase_order/order/form" className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105'>{dataLang?.purchase_order_new || "purchase_order_new"}</Link>
                    {/* <Popup_dsncc  listBr={listBr}  listSelectCt={listSelectCt}  onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" /> */}
                  </div>
                </div>
                
                <div  className="flex space-x-3 items-center  h-[8vh] justify-start overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                     {listDs &&   listDs.map((e)=>{
                          return (
                            <div>
                            <TabClient 
                              style={{
                                backgroundColor: "#e2f0fe"
                              }} dataLang={dataLang}
                              key={e.id} 
                              onClick={_HandleSelectTab.bind(this, `${e.id}`)} 
                              total={e.count} 
                              active={e.id} 
                              className={"text-[#0F4F9E] "}
                            >{dataLang[e?.name]}</TabClient> 
                          </div>
                          )
                      })
                     }
                </div>
              <div className="space-y-2 2xl:h-[91%] h-[92%] overflow-hidden">    
                <div className="xl:space-y-3 space-y-2">
                    <div className="bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2">
                        <div className='flex space-x-5'>
                        <div className='w-[12vw]'>
                            <form className="flex items-center relative ">
                                <IconSearch size={20} className="absolute left-3 z-10 text-[#cccccc]" />
                                <input
                                    className=" relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10  py-1.5 rounded-md "
                                    type="text" 
                                    onChange={_HandleOnChangeKeySearch.bind(this)} 
                                    placeholder={dataLang?.branch_search}
                                />
                            </form>
                        </div>
                        <div className='ml-1 w-[12vw]'>
                            <Select 
                                 options={[{ value: '', label: dataLang?.purchase_order_branch || "purchase_order_branch", isDisabled: true }, ...listBr_filter]}
                                 onChange={onchang_filter.bind(this, "branch")}
                                 value={idBranch}
                                 placeholder={dataLang?.purchase_order_table_branch || "purchase_order_table_branch"} 
                                hideSelectedOptions={false}
                                isClearable={true}
                                className="rounded-md bg-white  xl:text-base text-[14.5px] z-20" 
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
                                  control: (base,state) => ({
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
                        <div className='ml-1   w-[12vw]'>
                            <Select 
                                 options={[{ value: '', label: dataLang?.purchase_order_vouchercode || "purchase_order_vouchercode", isDisabled: true }, ...listCode_filter]}
                                 onChange={onchang_filter.bind(this, "code")}
                                 value={idCode}
                                 placeholder={dataLang?.purchase_order_table_code || "purchase_order_table_code"} 
                                hideSelectedOptions={false}
                                isClearable={true}
                                className="rounded-md bg-white  xl:text-base text-[14.5px] z-20" 
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
                                  control: (base,state) => ({
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
                        <div className='ml-1   w-[12vw]'>
                            <Select 
                                //  options={listBr_filter}
                                 options={[{ value: '', label: dataLang?.purchase_order_supplier || "purchase_order_supplier", isDisabled: true }, ...listSupplier]}
                                 onChange={onchang_filter.bind(this, "supplier")}
                                 value={idSupplier}
                                 placeholder={dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"} 
                                hideSelectedOptions={false}
                                isClearable={true}
                                className="rounded-md bg-white  xl:text-base text-[14.5px] z-20" 
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
                                  control: (base,state) => ({
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
                        <div className='ml-1   w-[13vw]'>
                            <Select 
                                //  options={listBr_filter}
                                 options={[{ value: '', label: 'Chọn loại đặt hàng', isDisabled: true }, ...listOrderType]}
                                 onChange={onchang_filter.bind(this, "OrderType")}
                                 value={idOrderType}
                                 placeholder={"Loại đặt hàng"} 
                                hideSelectedOptions={false}
                                isClearable={true}
                                className="rounded-md bg-white  xl:text-base text-[14.5px] z-20" 
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
                                  control: (base,state) => ({
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
                        <div className='z-20 ml-1   w-[12vw]'>
                        <Datepicker            
                                value={valueDate} 
                                i18n={"vi"} 
                                primaryColor={"blue"} 
                                onChange={onchang_filter.bind(this, "date")}
                                showShortcuts={true} 
                                displayFormat={"DD/MM/YYYY"} 
                                configs={{
                                  shortcuts: {
                                  today: "Hôm nay" ,
                                  yesterday: "Hôm qua" ,
                                  past: period => `${period}  ngày qua` ,
                                  currentMonth: "Tháng này" ,
                                  pastMonth: "Tháng trước" 
                                  },
                                  footer: {
                                  cancel: "Từ bỏ" ,
                                  apply: "Áp dụng" 
                                  }
                                  }} 
                                className="react-datepicker__input-container"
                                inputClassName="rounded-md w-full p-2 bg-white  placeholder:text-xs border-none xl:text-base text-[14.5px] focus:outline-none focus:ring-0 focus:border-transparent"
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
                                  placeholderText={dataLang?.purchase_order_table_dayvoucers || "purchase_order_table_dayvoucers"}
                                  className="bg-white w-full py-[7px] rounded pl-10 text-black outline-[#0F4F9E]"
                                  />
                                  <IconCalendar size={20} className="absolute left-3 text-[#cccccc]" />
                          </div> */}
                        </div>
                        </div>
                        <div className="flex space-x-2 items-center">
                        {
                        dataExcel?.length > 0 &&(
                            <ExcelFile filename="Danh sách đơn đặt hàng (PO)" title="DSDDH" element={
                            <button className='xl:px-4 px-3 xl:py-2.5 py-1.5 xl:text-sm text-xs flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition'>
                                <IconExcel size={18} /><span>{dataLang?.client_list_exportexcel}</span></button>}>
                            <ExcelSheet dataSet={multiDataSet} data={multiDataSet} name="Organization" />
                        </ExcelFile>
                        )
                        }
                        <label className="font-[300] text-slate-400">{dataLang?.display}</label>
                            <select className="outline-none" onChange={(e) => sLimit(e.target.value)} value={limit}>
                                <option disabled className="hidden">{limit == -1 ? "Tất cả": limit}</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                                <option value={40}>40</option>
                                <option value={60}>60</option>
                                {/* <option value={-1}>Tất cả</option> */}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="min:h-[200px] h-[82%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <div className="pr-2 w-[100%] lx:w-[120%] ">
                    <div className="grid grid-cols-12 items-center sticky top-0 bg-white p-2 z-10">
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_dayvoucers || "purchase_order_table_dayvoucers"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_code || "purchase_order_table_code"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_ordertype || "purchase_order_table_ordertype"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_number || "purchase_order_table_number"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_total || "purchase_order_table_total"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_totalTax || "purchase_order_table_totalTax"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_intoMoney || "purchase_order_table_intoMoney"}</h4>
                                {/* <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_statusOfSpending || "purchase_order_table_statusOfSpending"}</h4> */}
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_importStatus || "purchase_order_table_importStatus"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_note || "purchase_order_note"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300]'>{dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.purchase_order_table_operations || "purchase_order_table_operations"}</h4>
                    </div>
                    {onFetching ?
                      <Loading className="h-80"color="#0f4f9e" /> 
                      : 
                      data?.length > 0 ? 
                      (<>
                          <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px] ">                       
                          {(data?.map((e) => 
                                <div className='grid grid-cols-12 items-center py-1.5 px-2 hover:bg-slate-100/40 ' key={e.id.toString()}>
                                <h6 className='xl:text-base text-xs px-2 col-span-1 text-center'>{e?.date != null ? moment(e?.date).format("DD/MM/YYYY") : ""}</h6>
                                <h6 className='xl:text-base text-xs px-2 col-span-1 text-center text-[#0F4F9E] hover:font-normal cursor-pointer'><Popup_chitiet dataLang={dataLang} className="text-left" name={e?.code} id={e?.id}/></h6>
                                <h6 className='xl:text-base text-xs px-2 col-span-1 text-left'>{e.supplier_name}</h6>
                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-1 flex items-center justify-center text-center'>{e?.order_type  == "0" ? (<span className='font-normal text-red-500  rounded-xl py-1 px-3  bg-red-200'>Tạo mới</span>) : (<span className='font-normal text-lime-500  rounded-xl py-1 px-3  bg-lime-200'>YCMH</span>)}</h6>
                                <h6 className='xl:text-base text-xs px-2 col-span-1 text-left flex gap-2 flex-wrap'>{e?.purchases?.reduce((acc, cur) => acc + (acc ? ', ' : '') + cur.code, '').split('').join('').replace(/^,/, '')}</h6>
                                <h6 className='xl:text-base text-xs px-2 col-span-1 text-right'>{formatNumber(e.total_price)}</h6>
                                <h6 className='xl:text-base text-xs px-2 col-span-1 text-right'>{formatNumber(e.total_tax_price)}</h6>
                                <h6 className='xl:text-base text-xs px-2 col-span-1 text-right'>{formatNumber(e.total_amount)}</h6>
                                {/* <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-1 flex items-center justify-center text-center '>
                                    {e?.status_pay === "0" && <span className=' font-normal text-sky-500  rounded-xl py-1 px-2  bg-sky-200'>{dataLang?.purchase_order_table_havent_spent_yet || "purchase_order_table_havent_spent_yet"}</span>||
                                     e?.status_pay === "1" &&  <span className=' font-normal text-orange-500 rounded-xl py-1 px-2  bg-orange-200'>{dataLang?.purchase_order_table_spend_one_part || "purchase_order_table_spend_one_part"}</span> ||
                                     e?.status_pay === "2" &&   <span className='flex items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2  bg-lime-200'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{dataLang?.purchase_order_table_enough_spent || "purchase_order_table_enough_spent"}</span>
                                    }
                                </h6> */}
                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-1 flex items-center justify-center text-center '>
                                    {e?.import_status  === "0" && <span className=' font-normal text-sky-500  rounded-xl py-1 px-2  bg-sky-200'>{dataLang?.purchase_order_table_not_yet_entered || "purchase_order_table_not_yet_entered"}</span>||
                                     e?.import_status  === "1" &&  <span className=' font-normal text-orange-500 rounded-xl py-1 px-2  bg-orange-200'>{dataLang?.purchase_order_table_enter_one_part || "purchase_order_table_enter_one_part"}</span> ||
                                     e?.import_status  === "2" &&   <span className='flex items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2  bg-lime-200'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{dataLang?.purchase_order_table_enter_enough || "purchase_order_table_enter_enough"}</span>
                                    }
                                </h6>
                                <h6 className='xl:text-base text-xs px-2 col-span-1 text-left'>{e.note}</h6>
                                <h6 className='xl:text-base text-xs px-2 col-span-1'><span className="mr-2 mb-1 w-fit xl:text-base text-xs px-2 text-[#0F4F9E] font-[300] py-0.5 border border-[#0F4F9E] rounded-[5.5px]">{e?.branch_name}</span></h6> 
                                <div className='col-span-1 flex justify-center'>
                                    <BtnTacVu onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} status={e?.status} id={e?.id}className="bg-slate-100 xl:px-4 px-3 xl:py-1.5 py-1 rounded xl:text-base text-xs" />
                                    {/* <button className='bg-slate-100 xl:px-4 px-3 xl:py-1.5 py-1 rounded xl:text-base text-xs'>Tác vụ</button> */}
                                </div>
                                </div>
       
                          ))}              
                        </div>                     
                        </>
                      )  : 
                      (
                        <div className=" max-w-[352px] mt-24 mx-auto" >
                          <div className="text-center">
                            <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                            <h1 className="textx-[#141522] text-base opacity-90 font-medium">{dataLang?.purchase_order_table_item_not_found || "purchase_order_table_item_not_found"}</h1>
                            <div className="flex items-center justify-around mt-6 ">
                                {/* <Popup_dsncc onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                            </div>
                          </div>
                        </div>
                      )}    
                  </div>
                </div>
              </div>     
            </div>
            <div className='grid grid-cols-12 bg-gray-100 items-center'>
                    <div className='col-span-5 p-2 text-center'>
                        <h3 className='uppercase font-normal'>{dataLang?.purchase_order_table_total_outside || "purchase_order_table_total_outside"}</h3>
                    </div>  
                    <div className='col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap'>
                        <h3 className='font-normal'>{formatNumber(total?.total_price)}</h3>
                    </div>  
                    <div className='col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap '>
                        <h3 className='font-normal'>{formatNumber(total?.total_tax_price)}</h3>
                    </div>  
                    <div className='col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap'>
                        <h3 className='font-normal'>{formatNumber(total?.total_amount)}</h3>
                    </div>  
            </div>
            {data?.length != 0 &&
              <div className='flex space-x-5 items-center'>
                <h6>{dataLang?.display} {totalItems?.iTotalDisplayRecords} {dataLang?.among} {totalItems?.iTotalRecords} {dataLang?.ingredient}</h6>
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
        </React.Fragment>
    );
}
const TabClient = React.memo((props) => {
  const router = useRouter();
  return(
    <button  style={props.style} onClick={props.onClick} className={`${props.className} justify-center min-w-[220px] flex gap-2 items-center rounded-[5.5px] px-4 py-2 outline-none relative `}>
      {router.query?.tab === `${props.active}` && <ArrowCircleDown   size="20" color="#0F4F9E" />}
      {props.children}
      <span className={`${props?.total > 0 && "absolute min-w-[29px] top-0 right-0 bg-[#ff6f00] text-xs translate-x-2.5 -translate-y-2 text-white rounded-[100%] px-2 text-center items-center flex justify-center py-1.5"} `}>{props?.total > 0 && props?.total}</span>
    </button>


  )
})

const Popup_chitiet =(props)=>{
  const scrollAreaRef = useRef(null);
  const [open, sOpen] = useState(false);
  const _ToggleModal = (e) => sOpen(e);
  const [data,sData] =useState()
  const [onFetching, sOnFetching] = useState(false);

  useEffect(() => {
    props?.id && sOnFetching(true) 
  }, [open]);

  // const formatNumber = num => {
  //   if (!num && num !== 0) return 0;
  //   return Math.floor(num).toLocaleString("en");
  // };
  const formatNumber = num => {
    if (!num && num !== 0) return 0;
    const roundedNum = Number(num).toFixed(2);
    return parseFloat(roundedNum).toLocaleString("en");
  };

  const _ServerFetching_detailUser = () =>{
    Axios("GET", `/api_web/Api_purchase_order/purchase_order/${props?.id}?csrf_protection=true`, {}, (err, response) => {
    if(!err){
        var db =  response.data

        sData(db)
    }
    sOnFetching(false)
  })
  }

  useEffect(() => {
    onFetching && _ServerFetching_detailUser()
  }, [open]);

  
  const scrollableDiv = document.querySelector('.customsroll');
  scrollableDiv?.addEventListener('wheel', (event) => {
    const deltaY = event.deltaY;
    const top = scrollableDiv.scrollTop;
    const height = scrollableDiv.scrollHeight;
    const offset = scrollableDiv.offsetHeight;
    const isScrolledToTop = top === 0;
    const isScrolledToBottom = top === height - offset;
  
    if ((deltaY < 0 && isScrolledToTop) || (deltaY > 0 && isScrolledToBottom)) {
      event.preventDefault();
    }
  });
 
return (
<>
 <PopupEdit   
    title={props.dataLang?.purchase_order_detail_title || "purchase_order_detail_title"} 
    button={props?.name} 
    onClickOpen={_ToggleModal.bind(this, true)} 
    open={open} onClose={_ToggleModal.bind(this,false)}
    classNameBtn={props?.className} 
  >
  <div className='flex items-center space-x-4 my-3 border-[#E7EAEE] border-opacity-70 border-b-[1px]'>
     
  </div>  
          <div className="mt-4 space-x-5 w-[999px] xl:h-[550px] customsroll overflow-hidden  3xl:h-auto 2xl:scrollbar-thin 2xl:scrollbar-thumb-slate-300 2xl:scrollbar-track-slate-100">        
          <div>
           <div className='w-[999px]'>
             <div  className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
             <h2 className='font-normal bg-[#ECF0F4] p-2'>{props?.dataLang?.purchase_order_detail_general_informatione || "purchase_order_detail_general_informatione"}</h2>       
              <div className='grid grid-cols-8  min-h-[170px] p-2'>
                  <div className='col-span-3'>
                      <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.purchase_order_detail_day_vouchers || "purchase_order_detail_day_vouchers"}</h3><h3 className='col-span-1 font-normal'>{data?.date != null ? moment(data?.date).format("DD/MM/YYYY, HH:mm:ss") : ""}</h3></div>
                      <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.purchase_order_detail_delivery_date || "purchase_order_detail_delivery_date"}</h3><h3 className='col-span-1 font-normal'>{data?.delivery_date != null ? moment(data?.delivery_date).format("DD/MM/YYYY") : ""}</h3></div>
                      <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.purchase_order_detail_voucher_code || "purchase_order_detail_voucher_code"}</h3><h3 className='col-span-1 font-normal'>{data?.code}</h3></div>
                      <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.purchase_order_table_ordertype || "purchase_order_table_ordertype"}</h3><h3 className='col-span-1 font-normal'>{data?.order_type  == "0" ? (<span className='font-normal text-red-500  rounded-xl py-1 px-3  bg-red-200'>Tạo mới</span>) : (<span className='font-normal text-lime-500  rounded-xl py-1 px-3  bg-lime-200'>YCMH</span>)}</h3></div>
                  </div>

                  <div className='col-span-2 mx-auto'>
                      <div className='my-4 font-medium '>{"Trạng thái nhập hàng"}</div>
                      <div className='flex flex-wrap  gap-2 items-center justify-start'>
                      {
                        data?.import_status  === "0" && <span className=' font-normal text-sky-500  rounded-xl py-1 px-2  bg-sky-200'>{props.dataLang?.purchase_order_table_not_yet_entered || "purchase_order_table_not_yet_entered"}</span>||
                        data?.import_status  === "1" &&  <span className=' font-normal text-orange-500 rounded-xl py-1 px-2  bg-orange-200'>{props.dataLang?.purchase_order_table_enter_one_part || "purchase_order_table_enter_one_part"}</span> ||
                        data?.import_status  === "2" &&   <span className='flex items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2  bg-lime-200'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{props.dataLang?.purchase_order_table_enter_enough || "purchase_order_table_enter_enough"}</span>
                       }
                      </div>
                      <div className='my-4 font-medium '>{props.dataLang?.purchase_order_table_number || "purchase_order_table_number"}</div>
                      <div className='flex flex-wrap  gap-2 items-center justify-start'>
                          {data?.purchases?.reduce((acc, cur) => acc + (acc ? ', ' : '') + cur.code, '').split('').join('').replace(/^,/, '')}
                      </div>
                  </div>
                  <div className='col-span-3 '>
                      {/* <div className='flex flex-wrap  gap-2 items-center justify-start'>
                      {data?.status_pay === "0" && <span className=' font-normal text-sky-500  rounded-xl py-1 px-2  bg-sky-200'>{props.dataLang?.purchase_order_table_havent_spent_yet || "purchase_order_table_havent_spent_yet"}</span>||
                        data?.status_pay === "1" &&  <span className=' font-normal text-orange-500 rounded-xl py-1 px-2  bg-orange-200'>{props.dataLang?.purchase_order_table_spend_one_part || "purchase_order_table_spend_one_part"}</span> ||
                        data?.status_pay === "2" &&   <span className='flex items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2  bg-lime-200'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{props.dataLang?.purchase_order_table_enough_spent || "purchase_order_table_enough_spent"}</span>
                       }
                      </div> */}
                      <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"}</h3><h3 className='col-span-1 font-normal'>{data?.supplier_name}</h3></div>
                      <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}</h3><h3 className="mr-2 mb-1 w-fit xl:text-base text-xs px-2 text-[#0F4F9E] font-[400] py-0.5 border border-[#0F4F9E] rounded-[5.5px] col-span-1">{data?.branch_name}</h3></div>
                      <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.purchase_order_note || "purchase_order_note"}</h3><h3 className='col-span-1 font-normal'>{data?.note}</h3></div>
                  </div>
                  
              </div>
              <div className="pr-2 w-[100%] lx:w-[110%] ">
                <div className="grid grid-cols-12 sticky top-0 bg-slate-100 p-2 z-10">
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-left">{props.dataLang?.purchase_image || "purchase_image"}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_items || "purchase_items"}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_variant || "purchase_variant"}</h4> 
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_unit || "purchase_unit"}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_quantity || "purchase_quantity"}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_order_detail_unit_price || "purchase_order_detail_unit_price"}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_order_detail_discount || "purchase_order_detail_discount"}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-2 font-[400] text-center">{props.dataLang?.purchase_order_detail_after_discount || "purchase_order_detail_after_discount"}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_order_detail_tax || "purchase_order_detail_tax"}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_order_detail_into_money || "purchase_order_detail_into_money"}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_order_note || "purchase_order_note"}</h4>
                </div>
                {onFetching ?
                  <Loading className="h-20 2xl:h-[160px]"color="#0f4f9e" /> 
                  : 
                  data?.item?.length > 0 ? 
                  (<>
                       <ScrollArea     
                         className="min-h-[90px] max-h-[200px] 2xl:max-h-[250px] overflow-hidden"  speed={1}  smoothScrolling={true}>
                    <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">                       
                      {(data?.item?.map((e) => 
                        <div className="grid items-center grid-cols-12 py-1.5 px-2 hover:bg-slate-100/40 " key={e.id?.toString()}>
                          <h6 className="xl:text-base text-xs   py-0.5 col-span-1  rounded-md text-left">
                          {e?.item?.images != null ? (<ModalImage   small={e?.item?.images} large={e?.item?.images} alt="Product Image"  className='custom-modal-image object-cover rounded w-[50px] h-[60px]' />):
                                  <div className='w-[50px] h-[60px] object-cover  flex items-center justify-center rounded'>
                                    <ModalImage small="/no_img.png" large="/no_img.png" className='w-full h-full rounded object-contain p-1' > </ModalImage>
                                  </div>
                          }
                          </h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-left">{e?.item?.name}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-left break-words">{e?.item?.product_variation}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-center break-words">{e?.item?.unit_name}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-center">{formatNumber(e?.quantity)}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-center">{formatNumber(e?.price)}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-center">{e?.discount_percent + "%"}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-2  rounded-md text-center">{formatNumber(e?.price_after_discount)}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-center">{formatNumber(e?.tax_rate) + "%"}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-center">{formatNumber(e?.amount)}</h6>                
                                         
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-left">{e?.note != undefined ? e?.note : ""}</h6>                
                        </div>
                      ))}              
                    </div>   
                      </ScrollArea>                       
                    </>
                  )  : 
                  (
                    <div className=" max-w-[352px] mt-24 mx-auto" >
                      <div className="text-center">
                        <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                        <h1 className="textx-[#141522] text-base opacity-90 font-medium">{props.dataLang?.purchase_order_table_item_not_found || "purchase_order_table_item_not_found"}</h1>
                        <div className="flex items-center justify-around mt-6 ">
                            {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                        </div>
                      </div>
                    </div>
                  )}    
              </div>
          <h2 className='font-normal p-2  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]'>{props.dataLang?.purchase_total || "purchase_total"}</h2>  
              <div className="text-right mt-5  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
              <div className='col-span-7'>
              </div>
             <div className='col-span-2 space-y-2'>
                  <div className='font-normal text-left'><h3>{props.dataLang?.purchase_order_table_total || "purchase_order_table_total"}</h3></div>
                  <div className='font-normal text-left'><h3>{props.dataLang?.purchase_order_detail_discounty || "purchase_order_detail_discounty"}</h3></div>
                  <div className='font-normal text-left'><h3>{props.dataLang?.purchase_order_detail_money_after_discount || "purchase_order_detail_money_after_discount"}</h3></div>
                  <div className='font-normal text-left'><h3>{props.dataLang?.purchase_order_detail_tax_money || "purchase_order_detail_tax_money"}</h3></div>
                  <div className='font-normal text-left'><h3>{props.dataLang?.purchase_order_detail_into_money || "purchase_order_detail_into_money"}</h3></div>
             </div>
             <div className='col-span-3 space-y-2'>
                  <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600'>{formatNumber(data?.total_price)}</h3></div>
                  <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600'>{formatNumber(data?.total_discount)}</h3></div>
                  <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600'>{formatNumber(data?.total_price_after_discount)}</h3></div>
                  <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600'>{formatNumber(data?.total_tax)}</h3></div>
                  <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600'>{formatNumber(data?.total_amount)}</h3></div>
             </div>
          </div>   
            </div>
          </div>
    
     </div>
  
    </div>    
  </PopupEdit>
</>
)
}


// const Tab_DanhSach = React.memo(() => {
//     const [tab, sTab] = useState(0);
//     const _HandleSelectTab = (e) => sTab(e);

//     return(
//         <div className='xl:space-y-3 space-y-2'>
//             <div className='flex space-x-1 border-b border-slate-200'>
//                 <button onClick={_HandleSelectTab.bind(this, 0)} className={`${tab === 0 ? "text-[#0F4F9E] border-[#0F4F9E] from-[#0F4F9E]/10" : "text-slate-400 hover:text-[#0F4F9E]/70 border-transparent" } xl:text-base text-xs bg-gradient-to-t border-b-[2px] xl:py-2 py-1 xl:px-4 px-3 font-medium`}>Tất cả</button>
//                 <button onClick={_HandleSelectTab.bind(this, 1)} className={`${tab === 1 ? "text-[#0F4F9E] border-[#0F4F9E] from-[#0F4F9E]/10" : "text-slate-400 hover:text-[#0F4F9E]/70 border-transparent" } xl:text-base text-xs bg-gradient-to-t border-b-[2px] xl:py-2 py-1 xl:px-4 px-3 font-medium`}>Hóa đơn thuế (0)</button>
//                 <button onClick={_HandleSelectTab.bind(this, 2)} className={`${tab === 2 ? "text-[#0F4F9E] border-[#0F4F9E] from-[#0F4F9E]/10" : "text-slate-400 hover:text-[#0F4F9E]/70 border-transparent" } xl:text-base text-xs bg-gradient-to-t border-b-[2px] xl:py-2 py-1 xl:px-4 px-3 font-medium`}>Hóa đơn lẻ (20)</button>
//                 <button onClick={_HandleSelectTab.bind(this, 3)} className={`${tab === 3 ? "text-[#0F4F9E] border-[#0F4F9E] from-[#0F4F9E]/10" : "text-slate-400 hover:text-[#0F4F9E]/70 border-transparent" } xl:text-base text-xs bg-gradient-to-t border-b-[2px] xl:py-2 py-1 xl:px-4 px-3 font-medium`}>Đã chi (3)</button>
//                 <button onClick={_HandleSelectTab.bind(this, 4)} className={`${tab === 4 ? "text-[#0F4F9E] border-[#0F4F9E] from-[#0F4F9E]/10" : "text-slate-400 hover:text-[#0F4F9E]/70 border-transparent" } xl:text-base text-xs bg-gradient-to-t border-b-[2px] xl:py-2 py-1 xl:px-4 px-3 font-medium`}>Chi 1 phần (1)</button>
//                 <button onClick={_HandleSelectTab.bind(this, 5)} className={`${tab === 5 ? "text-[#0F4F9E] border-[#0F4F9E] from-[#0F4F9E]/10" : "text-slate-400 hover:text-[#0F4F9E]/70 border-transparent" } xl:text-base text-xs bg-gradient-to-t border-b-[2px] xl:py-2 py-1 xl:px-4 px-3 font-medium`}>Chưa chi (17)</button>
//             </div>
//             
//         </div>
//     )
// })
const BtnTacVu = React.memo((props) => {
    const [openTacvu, sOpenTacvu] = useState(false);
    const _ToggleModal = (e) => sOpenTacvu(e);

    const [openDetail, sOpenDetail] = useState(false);
    const router = useRouter()

    const _HandleDelete = (id) => {
        Swal.fire({
            title: `${props.dataLang?.aler_ask}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#296dc1',
            cancelButtonColor: '#d33',
            confirmButtonText: `${props.dataLang?.aler_yes}`,
            cancelButtonText:`${props.dataLang?.aler_cancel}`
        }).then((result) => {
          if (result.isConfirmed) {
            Axios("DELETE", `/api_web/Api_purchase_order/purchase_order/${id}?csrf_protection=true`, {
            }, (err, response) => {
              if(!err){
                var {isSuccess, message} = response.data;
                if(isSuccess){
                  Toast.fire({
                    icon: 'success',
                    title: props.dataLang[message]
                  })     
                  props.onRefresh && props.onRefresh()
                }else{
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
        if (props?.status === "1") {
            Toast.fire({
                icon: 'error',
                title: `${props.dataLang?.confirmed_cant_edit}`
              })   
        } else {
          router.push(`/purchase_order/order/form?id=${props.id}`);
        }
      };
    return(
        <div>
            <Popup
                trigger={<button className={`flex space-x-1 items-center ` + props.className } ><span>{props.dataLang?.purchase_action || "purchase_action"}</span><IconDown size={12} /></button>}
                arrow={false}
                position="bottom right"
                className={`dropdown-edit `}
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
                         className="text-sm hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full">{props.dataLang?.purchase_order_table_edit || "purchase_order_table_edit"}</button>
                        <button onClick={_HandleDelete.bind(this, props.id)} className='text-sm hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full'>{props.dataLang?.purchase_order_table_delete || "purchase_order_table_delete"}</button>
                    </div>
                </div>
            </Popup>
        </div>
    )
})

// const BtnTacVu = React.memo((props) => {
//     return(
//         <div>
//             <Popup
//                 trigger={
//                     <button className={`flex space-x-1 items-center ` + props.className } >
//                         <span>Tác vụ</span>
//                         <IconDown size={15} />
//                     </button>
//                 }
//                 closeOnDocumentClick
//                 arrow={false}
//                 position="bottom right"
//                 className={`dropdown-edit `}
//             >
//                 <div className="w-auto">
//                     <div className="bg-white p-0.5 rounded-t w-52">
//                         <button className='text-sm hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Export Excel</button>
//                         <button className='text-sm hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Import Excel</button>
//                         <button className='text-sm hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Import BOM</button>
//                         <button className='text-sm hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Import công đoạn</button>
//                         <button className='text-sm hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Thống kê và tìm kiếm</button>
//                         <button className='text-sm hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Xóa</button>
//                     </div>
//                 </div>
//             </Popup>
//         </div>
//     )
// })

export default Index;