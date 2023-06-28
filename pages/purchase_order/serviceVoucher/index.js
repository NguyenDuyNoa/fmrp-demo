import React, {useRef, useState} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ModalImage from "react-modal-image";
import 'react-datepicker/dist/react-datepicker.css';
import {NumericFormat} from "react-number-format";
import {
    Grid6 as IconExcel, Filter as IconFilter, Calendar as IconCalendar, SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    ArrowCircleDown,
    Minus, Edit as IconEdit,
    Add, Trash as IconDelete, TickCircle
} from "iconsax-react";
import Select from 'react-select';

import 'react-datepicker/dist/react-datepicker.css';
import Datepicker from 'react-tailwindcss-datepicker'

import DatePicker,{registerLocale } from "react-datepicker";
import { MdClear } from 'react-icons/md';
import { BsCalendarEvent } from 'react-icons/bs';

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

import {BiEdit} from 'react-icons/bi'
import {RiDeleteBin6Line} from 'react-icons/ri'

import Swal from "sweetalert2";
import { v4 as uuidv4 } from 'uuid';
import ReactExport from "react-data-export";
import { useEffect } from 'react';
import FilePDF from '../FilePDF';
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

    const [onSending,sOnSending] = useState(false)

    const [totalItems, sTotalItems] = useState([]);
    const [keySearch, sKeySearch] = useState("")
    const [limit, sLimit] = useState(15);

    const [listBr, sListBr]= useState([])

    const [listDs, sListDs] = useState()
    const [dataCode, sDataCode] = useState([])

    const [idCode, sIdCode] = useState(null);
    const [idBranch, sIdBranch] = useState(null);
    const [valueDate, sValueDate] = useState({
      startDate: null,
      endDate:null
    });

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
        Axios("GET", `/api_web/Api_service/service/?csrf_protection=true`, {
            params: {
                search: keySearch,
                limit: limit,  
                page: router.query?.page || 1,  
                "filter[status_bar]": tabPage  ? tabPage : null,
                "filter[id]":idCode != null ? idCode?.value : null,
                "filter[branch_id]": idBranch != null ? idBranch.value : null ,
                "filter[start_date]": valueDate?.startDate != null ? valueDate?.startDate : null ,
                "filter[end_date]":valueDate?.endDate != null ? valueDate?.endDate : null ,
            }
        }, (err, response) => {
            if(!err){
                var {rResult, output, rTotal} =  response.data
                sData(rResult)
                sTotalItems(output)
                sDataExcel(rResult)
            }
            sOnFetching(false)
        })
    }

    const onchang_filter= (type, value) => {
      if(type == "branch"){
        sIdBranch(value)
      }else if(type == "code"){
        sIdCode(value)
      }else if(type == "date"){
        sValueDate(value)
      }
    }

    const _ServerFetching_filter =  () =>{
      Axios("GET", `/api_web/Api_Branch/branchCombobox/?csrf_protection=true`, {}, (err, response) => {
      if(!err){
        var {isSuccess, result} =  response.data
          sListBr(result?.map(e => ({label: e.name, value: e.id})))
        }
      })
      Axios("GET", `/api_web/Api_service/serviceCombobox/?csrf_protection=true`, {}, (err, response) => {
      if(!err){
        var {isSuccess, result} =  response.data
          sDataCode(result?.map(e => ({label: e?.code, value: e?.id})))
        }
      })
      Axios("GET", `/api_web/Api_staff/staffOption?csrf_protection=true`, {}, (err, response) => {
        if(!err){
            var {rResult} =  response.data
            sListUser(rResult)
        }
      })
    sOnFetching_filter(false)
    }

    useEffect(() => {
      onFetching_filter && _ServerFetching_filter()      
    }, [onFetching_filter]);

    const _HandleSeachApi = (inputValue) => {
      Axios("POST", `/api_web/Api_service/serviceCombobox/?csrf_protection=true`, {
        data: {
          term: inputValue,
        }
      }, (err, response) => {
            if(!err){
              var {isSuccess,result} = response?.data
              sDataCode(result?.map(e => ({label: e?.code, value: e?.id})))
          }
      })
  }

  const _ServerFetching_group =  () =>{
    Axios("GET", `/api_web/Api_service/filterBar/?csrf_protection=true`, {
      params:{
        limit: 0,
        search: keySearch,
        "filter[id]":idCode != null ? idCode?.value : null,
        "filter[branch_id]": idBranch != null ? idBranch.value : null ,
        "filter[start_date]": valueDate?.startDate != null ? valueDate?.startDate : null ,
        "filter[end_date]":valueDate?.endDate != null ? valueDate?.endDate : null ,
      }
  }, (err, response) => {
    if(!err){
        var data =  response.data
        sListDs(data)
    }
    sOnFetching(false)
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

  const paginate = pageNumber => {
    router.push({
      pathname: router.route,
      query: { 
        tab: router.query?.tab,
        page: pageNumber 
      }
    })
  }

    useEffect(() => {
      onFetching && _ServerFetching()  || onFetching && _ServerFetching_group()    
      }, [onFetching]);

     
      useEffect(() => {
        router.query.tab && sOnFetching(true) || (keySearch && sOnFetching(true))|| sOnFetching_filter(true) || (idBranch != null && sOnFetching(true)) || (idCode != null && sOnFetching(true)) || router.query?.tab && sOnFetching_filter(true) ||  valueDate.startDate != null && valueDate.endDate != null && sOnFetching(true) 
    }, [limit,router.query?.page, router.query?.tab, idBranch, idCode, valueDate.endDate, valueDate.startDate]);

    

    const formatNumber = (number) => {
      if (!number && number !== 0) return 0;
        const integerPart = Math.floor(number);
        const decimalPart = number - integerPart;
        const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
        const roundedNumber = integerPart + roundedDecimalPart;
        return roundedNumber.toLocaleString("en");
    };

    const multiDataSet = [
      {
          columns: [
              {title: "ID", width: {wch: 4}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.serviceVoucher_day_vouchers || "serviceVoucher_day_vouchers"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.serviceVoucher_voucher_code || "serviceVoucher_voucher_code"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.serviceVoucher_supplier || "serviceVoucher_supplier"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.serviceVoucher_total_amount || "serviceVoucher_total_amount"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.serviceVoucher_tax_money || "serviceVoucher_tax_money"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.serviceVoucher_into_money || "serviceVoucher_into_money"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.serviceVoucher_status_of_spending || "serviceVoucher_status_of_spending"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.serviceVoucher_note || "serviceVoucher_note"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.serviceVoucher_branch || "serviceVoucher_branch"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
          ],
          data: dataExcel?.map((e) =>
              [
                  {value: `${e?.id ? e.id : ""}`, style: {numFmt: "0"}},
                  {value: `${e?.date ? e?.date : ""}`},
                  {value: `${e?.code ? e?.code : ""}`},
                  {value: `${e?.supplier_name ? e?.supplier_name : ""}`},
                  {value: `${e?.total_price ? formatNumber(e?.total_price) : ""}`},
                  {value: `${e?.total_tax_price ? formatNumber(e?.total_tax_price) : ""}`},
                  {value: `${e?.total_amount ? formatNumber(e?.total_amount) : ""}`},
                  // {value: `${e?.status_pay ? e?.status_pay === "0" && "Chưa nhập" || e?.status_pay === "1" && "Nhập 1 phần" ||  e?.status_pay === "2"  && "Đã nhập đủ đủ" : ""}`},
                  {value: `${"Chưa chi"}`},
                  {value: `${e?.note ? e?.note :""}`},
                  {value: `${e?.branch_name ? e?.branch_name :""}`},
                 
              ]    
          ),
      }
  ];


    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.serviceVoucher_title || "serviceVoucher_title"} </title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
            <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
            <h6 className="text-[#141522]/40">{dataLang?.serviceVoucher_title || "serviceVoucher_title"}</h6>
            <span className="text-[#141522]/40">/</span>
            <h6>{dataLang?.serviceVoucher_title_lits || "serviceVoucher_title_lits"}</h6>
            </div>

        <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
          <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 h-[96%] overflow-hidden">
                <div className='flex justify-between'>
                    <h2 className="text-2xl text-[#52575E] capitalize">{dataLang?.serviceVoucher_title_lits || "serviceVoucher_title_lits"}</h2>
                    <div className="flex justify-end items-center">
                     <Popup_servie onRefreshGr={_ServerFetching_group.bind(this)} onRefresh={_ServerFetching.bind(this)} dataLang={dataLang}  className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105'>{dataLang?.serviceVoucher_create_new || "serviceVoucher_create_new"}</Popup_servie>
                   </div>
                </div>
                
                <div  className="flex space-x-3 items-center  h-[8vh] justify-start overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                     {listDs &&   listDs.map((e)=>{
                          return (
                            <div>
                            <TabStatus 
                              style={{
                                backgroundColor: "#e2f0fe"
                              }} dataLang={dataLang}
                              key={e.id} 
                              onClick={_HandleSelectTab.bind(this, `${e.id}`)} 
                              total={e.count} 
                              active={e.id} 
                              className={"text-[#0F4F9E] "}
                            >{dataLang[e?.name] || e?.name}</TabStatus> 
                          </div>
                          )
                      })
                     }
                </div>
              <div className="space-y-2 2xl:h-[91%] h-[92%] overflow-hidden">    
                <div className="xl:space-y-3 space-y-2">
                    <div className="bg-slate-100 w-full rounded grid grid-cols-6 justify-between xl:p-3 p-2">
                    <div className='col-span-5'>
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
                                  options={[{ value: '', label: dataLang?.serviceVoucher_branch || "serviceVoucher_branch", isDisabled: true }, ...listBr]}
                                  onChange={onchang_filter.bind(this, "branch")}
                                  value={idBranch}
                                  placeholder={dataLang?.serviceVoucher_branch || "serviceVoucher_branch"} 
                                  hideSelectedOptions={false}
                                  isClearable={true}
                                  className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px]  z-20" 
                                  isSearchable={true}
                                  noOptionsMessage={() => "Không có dữ liệu"}
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
                          <div className='ml-1 col-span-1'>
                              <Select 
                                  onInputChange={_HandleSeachApi.bind(this)}
                                  options={[{ value: '', label: dataLang?.serviceVoucher_voucher_code || "serviceVoucher_voucher_code", isDisabled: true }, ...dataCode]}
                                  onChange={onchang_filter.bind(this, "code")}
                                  value={idCode}
                                  placeholder={dataLang?.serviceVoucher_voucher_code || "serviceVoucher_voucher_code"} 
                                  hideSelectedOptions={false}
                                  isClearable={true}
                                  className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px]  z-20" 
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
                           <div className='z-20 ml-1 col-span-1'>
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
                              dataExcel?.length > 0 &&(
                                  <ExcelFile filename="Danh sách phiếu dịch vụ" title="DSPDV" element={
                                  <button className='xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition'>
                                      <IconExcel className='2xl:scale-100 xl:scale-100 scale-75' size={18} /><span>{dataLang?.client_list_exportexcel}</span></button>}>
                                  <ExcelSheet dataSet={multiDataSet} data={multiDataSet} name="Organization" />
                              </ExcelFile>
                              )
                              }
                             </div>
                            <div className=''>
                                <div className="font-[300] text-slate-400 2xl:text-xs xl:text-sm text-[8px]">{dataLang?.display}</div>
                                <select className="outline-none  text-[10px] xl:text-xs 2xl:text-sm" onChange={(e) => sLimit(e.target.value)} value={limit}>
                                      <option className='text-[10px] xl:text-xs 2xl:text-sm hidden' disabled>{limit == -1 ? "Tất cả": limit}</option>
                                      <option className='text-[10px] xl:text-xs 2xl:text-sm' value={15}>15</option>
                                      <option className='text-[10px] xl:text-xs 2xl:text-sm' value={20}>20</option>
                                      <option className='text-[10px] xl:text-xs 2xl:text-sm' value={40}>40</option>
                                      <option className='text-[10px] xl:text-xs 2xl:text-sm' value={60}>60</option>
                                  </select>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
                <div className="min:h-[200px] h-[82%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <div className="pr-2 w-[100%] lx:w-[120%] ">
                    <div className="grid grid-cols-12 items-center sticky top-0 bg-white p-2 z-10 shadow-lg">
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1  text-center'>{dataLang?.serviceVoucher_day_vouchers || "serviceVoucher_day_vouchers"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1  text-center'>{dataLang?.serviceVoucher_voucher_code || "serviceVoucher_voucher_code"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-2  text-center'>{dataLang?.serviceVoucher_supplier || "serviceVoucher_supplier"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1  text-center'>{dataLang?.serviceVoucher_total_amount || "serviceVoucher_total_amount"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1  text-center'>{dataLang?.serviceVoucher_tax_money || "serviceVoucher_tax_money"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1  text-center'>{dataLang?.serviceVoucher_into_money || "serviceVoucher_into_money"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-2  text-center'>{dataLang?.serviceVoucher_status_of_spending || "serviceVoucher_status_of_spending"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1  text-center'>{dataLang?.serviceVoucher_note || "serviceVoucher_note"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1  text-center'>{dataLang?.serviceVoucher_branch || "serviceVoucher_branch"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1  text-center'>{dataLang?.serviceVoucher_operation || "serviceVoucher_operation"}</h4>
                    </div>
                    {onFetching ?
                      <Loading className="h-80"color="#0f4f9e" /> 
                      : 
                      data?.length > 0 ? 
                      (<>
                          <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">                       
                          {(data?.map((e) => 
                                <div className='grid grid-cols-12 items-center py-1.5 px-2 hover:bg-slate-100/40 ' key={e.id.toString()}>
                                <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-center'>{e?.date != null ? moment(e?.date).format("DD/MM/YYYY") : ""}</h6>
                                <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-center text-[#0F4F9E] hover:font-normal cursor-pointer'><Popup_chitiet dataLang={dataLang} className="text-left" name={e?.code} id={e?.id}/></h6>
                                <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-2 text-left'>{e.supplier_name}</h6>
                                <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-right'>{formatNumber(e.total_price)}</h6>
                                <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-right'>{formatNumber(e.total_tax_price)}</h6>
                                <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-right'>{formatNumber(e.total_amount)}</h6>
                                <h6 className='3xl:items-center 3xl-text-[18px] 2xl:text-[16px] xl:text-xs text-[8px]  col-span-2 flex items-center w-fit mx-auto'>
                                      <div className='mx-auto'>
                                      {
                                        e?.status_pay === "not_spent" && <span className=' font-normal text-sky-500  rounded-xl py-1 px-2 min-w-[135px]  bg-sky-200 text-center text-[13px]'>{"Chưa chi"}</span>||
                                        e?.status_pay === "spent_part" && <span className=' font-normal text-orange-500 rounded-xl py-1 px-2 min-w-[135px]  bg-orange-200 text-center text-[13px]'>{"Chi 1 phần"} {`(${formatNumber(e?.amount_paid)})`}</span>||
                                        e?.status_pay === "spent" && <span className='flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 min-w-[135px]  bg-lime-200 text-center text-[13px]'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{"Đã chi đủ"}</span>
                                          }
                                        {/* <span className=' font-normal text-sky-500  rounded-xl py-1 px-2 min-w-[100px]  bg-sky-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]'>{"Chưa chi"}</span> */}

                                      </div>
                                  </h6>
                                <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-left truncate '>{e.note}</h6>
                                <h6 className='col-span-1 w-fit '>
                                  <div className='cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase'>
                                      {e?.branch_name}
                                  </div>
                              </h6>
                                <div className='col-span-1 flex justify-center'>
                                    <BtnTacVu type="serviceVoucher" onRefresh={_ServerFetching.bind(this)} onRefreshGr={_ServerFetching_group.bind(this)} dataLang={dataLang} status_pay={e?.status_pay}  id={e?.id}  className="bg-slate-100 xl:px-4 px-3 xl:py-1.5 py-1 rounded 2xl:text-base xl:text-xs text-[8px]" />
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
                            </div>
                          </div>
                        </div>
                      )}    
                  </div>
                </div>
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

const TabStatus = React.memo((props) => {
  const router = useRouter();
  return(
    <button type='button'  style={props.style} onClick={props.onClick} className={`${props.className} justify-center min-w-[180px] flex gap-2 2xl:text-sm xl:text-sm text-xs items-center rounded-[5.5px] px-2 py-2 outline-none relative `}>
    {router.query?.tab === `${props.active}` && <ArrowCircleDown   size="20" color="#0F4F9E" />}
      {props.children}
      <span className={`${props?.total > 0 && "absolute min-w-[29px] top-0 right-0 bg-[#ff6f00] text-xs translate-x-2.5 -translate-y-2 text-white rounded-[100%] px-2 text-center items-center flex justify-center py-1.5"} `}>{props?.total > 0 && props?.total}</span>
    </button>


  )
})





const BtnTacVu = React.memo((props) => {
  // const [open, sOpen] = useState(false);
  const [openTacvu, sOpenTacvu] = useState(false);
  const _ToggleModal = (e) => sOpenTacvu(e);

  const [dataPDF, setData] = useState();
  const [dataCompany, setDataCompany] = useState();


  const fetchDataSettingsCompany = async () => {
    if (props?.id) {
      await  Axios("GET", `/api_web/Api_setting/CompanyInfo?csrf_protection=true`, {}, (err, response) => {
          if(!err){
                  var {data} =  response.data
                  setDataCompany(data)
            }
        })
    }
    if(props?.id){
      await  Axios("GET", `/api_web/Api_service/service/${props?.id}?csrf_protection=true`, {}, (err, response) => {
          if(!err){
            var db =  response.data
            setData(db)
          }
        })
    }
}
  useEffect(() => {
    openTacvu && fetchDataSettingsCompany()
  }, [openTacvu])


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
        Axios("DELETE", `/api_web/Api_service/service/${id}?csrf_protection=true`, {
        }, (err, response) => {
          if(!err){
            var {isSuccess, message} = response.data;
            if(isSuccess){
              Toast.fire({
                icon: 'success',
                title: props.dataLang[message]
              })     
              props.onRefresh && props.onRefresh()
              props.onRefreshGr && props.onRefreshGr()
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
  if(props?.status_pay != "not_spent"){
    Toast.fire({
      icon: 'error',
      title: `${"Phiếu dịch vụ đã chi. Không thể sửa"}`
    })  
  } 
    else {
      // router.push(`/purchase_order/order/form?id=${props.id}`);
    }
  };
  return(
      <div>
          <Popup
              trigger={<button type='button' className={`flex space-x-1 items-center ` + props.className } ><span>{props.dataLang?.purchase_action || "purchase_action"}</span><IconDown size={12} /></button>}
              arrow={false}
              position="bottom right"
              className={`dropdown-edit `}
              keepTooltipInside={props.keepTooltipInside}
              closeOnDocumentClick
              nested
              onOpen={_ToggleModal.bind(this, true)}
              onClose={_ToggleModal.bind(this, false)}
              open={openTacvu}
          >
              <div className="w-auto rounded">
                  <div className="bg-white rounded-t flex flex-col overflow-hidden">
                        <div className='group transition-all ease-in-out flex items-center  gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded  w-full'>
                          <BiEdit size={20} className='group-hover:text-sky-500 group-hover:scale-110 group-hover:shadow-md '/>
                            <Popup_servie status_pay={props?.status_pay} onRefreshGr={props.onRefreshGr}  onClick={handleClick} onRefresh={props.onRefresh} dataLang={props.dataLang} id={props?.id} 
                            className="2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer  rounded py-2.5">{props.dataLang?.purchase_order_table_edit || "purchase_order_table_edit"}</Popup_servie>
                        </div>
                          <FilePDF 
                                  props={props}
                                  openAction={openTacvu}
                                  setOpenAction={sOpenTacvu}
                                  dataCompany={dataCompany}
                                  data={dataPDF}
                           />
                          <button onClick={_HandleDelete.bind(this, props.id)} className='group transition-all ease-in-out flex items-center justify-center gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full'>
                              <RiDeleteBin6Line size={20} className='group-hover:text-[#f87171] group-hover:scale-110 group-hover:shadow-md '/>
                              <p className='group-hover:text-[#f87171]'>{props.dataLang?.purchase_order_table_delete || "purchase_order_table_delete"}</p>
                          </button>
                  </div>
              </div>
          </Popup>
      </div>
  )
})
const Popup_servie = (props) => {
  let id = props?.id
  const dataLang = props.dataLang
  const scrollAreaRef = useRef(null);
  const handleMenuOpen = () => {
  const menuPortalTarget = scrollAreaRef.current;
      return { menuPortalTarget };
  };

  const [open, sOpen] = useState(false);
  const _HandleOpenModal = (e) => {
    if(id){
      if(props?.status_pay != "not_spent"){
        sOpen(false)
        Toast.fire({
          icon: 'error',
          title: `${"Phiếu dịch vụ đã chi. Không thể sửa"}`
        })  
      }else{
        sOpen(true)
      }
    }else{
      sOpen(true)
    }
  };
  const _HandleCloseModal = () => sOpen(false)

  const [onFetching, sOnFetching] = useState(false);
  const [onFetchingDetail, sOnFetchingDetail] = useState(false);
  const [onFetchingSupplier, sOnFetchingSupplier] = useState(false);
  const [onSending, sOnSending] = useState(false);
  const [option, sOption] = useState([
    {
     id: Date.now(),
     idData: '',
     dichvu: "",
     soluong: 1,
     dongia: 0, 
     chietkhau: 0,
     dongiasauck: 0, 
     thue: 0, 
     thanhtien:0, 
     ghichu:""
    }
    ]);
  const slicedArr = option.slice(1);
  const sortedArr = slicedArr.sort((a, b) => b.id - a.id);
  sortedArr.unshift(option[0]);
  const [code , sCode] = useState(null)
  const [date, sDate] = useState(new Date());
  const [valueBr, sValueBr] = useState(null)
  const [valueSupplier, sValueSupplier] = useState(null)
  const [note, sNote] = useState("")
  const [chietkhautong, sChietkhautong] = useState(0)
  const [thuetong, sThuetong] = useState(0)
  const [tab, sTab] = useState(0)
  const _HandleSelectTab = (e) => sTab(e)
  const [dataTasxes, sDataTasxes] = useState([])
  const [dataSupplier, sDataSupplier] = useState([])
  const [dataBranch, sDataBranch] = useState([])
  const [errDate,sErrDate] = useState(false)
  const [errBranch,sErrBranch] = useState(false)
  const [errSupplier,sErrSupplier] = useState(false)
  const [errService, sErrService] = useState(false)
  

  useEffect(() =>{
    open && sDate(new Date())
    open && sCode('')
    open && sValueBr(null)
    open && sValueSupplier(null)
    open && sOption([{id: Date.now(),idData:" ", dichvu: "", soluong: 1, dongia: 0, chietkhau: 0, dongiasauck: 0, thue: 0, thanhtien:0, ghichu: ""}])
    open && sThuetong(0)
    open && sChietkhautong(0)
    open && sNote('')
    open && sErrBranch(false)
    open && sErrSupplier(false)
    open && sErrService(false)
     props?.id && sOnFetchingDetail(true)
  },[open])

  const _ServerFetching_detailUser =  () =>{
    Axios("GET", `/api_web/Api_service/service/${props?.id}?csrf_protection=true`, {}, (err, response) => {
    if(!err){
        var db =  response.data
        sDate(moment(db?.date).toDate())
        sCode(db?.code)
        sValueBr({label: db?.branch_name, value: db?.branch_id})
        sNote(db?.note)
        sValueSupplier({label: db?.supplier_name, value: db?.suppliers_id})
        sOption(db?.item?.map(e => ({id: e?.id, idData: e?.id, dichvu: e?.name, soluong: Number(e?.quantity), dongia: Number(e?.price), chietkhau: Number(e?.discount_percent), dongiasauck: Number(e?.price) * (1 - Number(e?.discount_percent)/100), thue: {label: e?.tax_rate,value:e?.tax_id,tax_rate:Number(e?.tax_rate)}, thanhtien: Number(e?.amount), ghichu: e?.note})))
    }
    sOnFetchingDetail(false)
  })
  }

  useEffect(() => {
    onFetchingDetail && props?.id && _ServerFetching_detailUser()
  }, [open]);

  const _ServerFetching =  () => {
      Axios("GET", "/api_web/Api_Branch/branchCombobox/?csrf_protection=true", {}, (err, response) => {
          if(!err){
              var {isSuccess, result} =  response.data
              sDataBranch(result?.map(e =>({label: e.name, value:e.id})))       
          }
      })
      Axios("GET", "/api_web/Api_tax/tax?csrf_protection=true", {}, (err, response) => {
        if(!err){
            var {rResult} =  response.data
            sDataTasxes(rResult?.map(e =>({label: e.name, value: e.id, tax_rate:e.tax_rate})))       
        }
    })
      sOnFetching(false)  
  }

  const taxOptions = [{ label: "Miễn thuế", value: "0",   tax_rate: "0"}, ...dataTasxes]

  useEffect(() =>{
    onFetching && _ServerFetching()
  },[onFetching])

  useEffect(() =>{
    open && sOnFetching(true)
  },[open])

  const _ServerFetching_Supplier =  () => {
    Axios("GET", "/api_web/api_supplier/supplier/?csrf_protection=true", {
      params:{
        "filter[branch_id]": valueBr != null ? valueBr.value : null ,
      }
    }, (err, response) => {
        if(!err){
            var {rResult} =  response.data
            sDataSupplier(rResult?.map(e => ({label: e.name, value:e.id })))
        }
    })
    sOnFetchingSupplier(false)  
  }

  useEffect(() =>{
    onFetchingSupplier && _ServerFetching_Supplier()
  },[onFetchingSupplier])

  useEffect(() =>{
    valueBr != null && sOnFetchingSupplier(true)
  },[valueBr])


  // add option form
  const _HandleAddNew =  () => {
    sOption([...option, {id: Date.now(),idData:"", dichvu: "", soluong: 1, dongia: 0, chietkhau: 0, dongiasauck: 0, thue: 0, thanhtien:0, ghichu: ""}])
  }

    const _HandleChangeInput = (type, value) => {
      if(type === "date"){
        sDate(value)
      }
     else if (type === 'clear') {
        sDate(new Date())
        }
      else if(type === "code"){
        sCode(value?.target.value)
      }else if(type === "valueBr" && valueBr != value){
        sValueBr(value)
        sValueSupplier(null)
      }else if(type === "valueSupplier"){
        sValueSupplier(value)
      }else if(type === "note"){
        sNote(value?.target.value)
      }else if(type == "thuetong"){
        sThuetong(value)
      }else if(type == "chietkhautong"){
        sChietkhautong(value?.value)
      }
  }

  useEffect(() => {
    if (thuetong == null) return;
    sOption(prevOption => {
      const newOption = [...prevOption];
      const thueValue = thuetong?.tax_rate || 0;
      const chietKhauValue = chietkhautong || 0;
      newOption.forEach((item, index) => {
        const dongiasauchietkhau = item?.dongia * (1 - chietKhauValue / 100);
        const thanhTien = dongiasauchietkhau * (1 + thueValue / 100) * item.soluong
        item.thue = thuetong;
        item.thanhtien = isNaN(thanhTien) ? 0 : thanhTien;
      });
      return newOption;
    });
  }, [thuetong]);

  useEffect(() => {
    if (chietkhautong == null) return;
    sOption(prevOption => {
      const newOption = [...prevOption];
      const thueValue = thuetong?.tax_rate != undefined ? thuetong?.tax_rate : 0
      const chietKhauValue = chietkhautong ? chietkhautong : 0;
      newOption.forEach((item, index) => {
        const dongiasauchietkhau = item?.dongia * (1 - chietKhauValue / 100);
        const thanhTien =  dongiasauchietkhau * (1 + thueValue / 100) * item.soluong
        item.thue = thuetong;
        item.chietkhau = Number(chietkhautong);
        item.dongiasauck = isNaN(dongiasauchietkhau) ? 0 : dongiasauchietkhau;
        item.thanhtien = isNaN(thanhTien) ? 0 : thanhTien;
      });
      return newOption;
    });
  }, [chietkhautong]);



  const _HandleSubmit = (e) => {
      e.preventDefault();
      const hasNullLabel = option.some(item => item.dichvu === "");
      if(date == null || valueSupplier == null  || valueBr == null || hasNullLabel){
        date == null && sErrDate(true)
        valueBr == null && sErrBranch(true)
        valueSupplier == null && sErrSupplier(true)
        hasNullLabel && sErrService(true) 
          Toast.fire({
              icon: 'error',
              title: `${dataLang?.required_field_null}`
          })
      }
      else {
          sOnSending(true)
      }
  }

  useEffect(() => {
    option?.filter(e => e.dichvu === "") && sErrService(false)
  }, [option]);

  useEffect(() => {
    sErrDate(false)
  }, [date != null]);

  useEffect(() => {
    sErrSupplier(false)
  }, [valueSupplier != null]);

  useEffect(() => {
    sErrBranch(false)
  }, [valueBr != null]);


  const _HandleChangeInputOption = (id, type,index3, value) => {
    var index = option.findIndex(x => x.id === id);
    if (type === "dichvu") {
     option[index].dichvu = value.target.value
     if (value.target.value.length > 0 && index === option.length - 1) {
      option.push({ id: uuidv4(),idData:"", dichvu: "", soluong: 1, dongia: 0, chietkhau: chietkhautong ? chietkhautong : 0, dongiasauck: 0, thue: thuetong ? thuetong : 0, thanhtien:0 });
      sOption([...option]);
     }
    }else if(type == "donvitinh"){
      option[index].donvitinh = value.target?.value;
    }else if (type === "soluong") {
      option[index].soluong = Number(value?.value);
      if(option[index].thue?.tax_rate == undefined){
        const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
        option[index].thanhtien = Number(tien.toFixed(2));
      }else{
        const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
        option[index].thanhtien = Number(tien.toFixed(2));
      }
      sOption([...option]);
    }else if(type == "dongia"){
        option[index].dongia = Number(value.value)
        option[index].dongiasauck = +option[index].dongia * (1 - option[index].chietkhau/100);
        option[index].dongiasauck = +(Math.round(option[index].dongiasauck + 'e+2') + 'e-2');
        if(option[index].thue?.tax_rate == undefined){
          const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
          option[index].thanhtien = Number(tien.toFixed(2));
        }else{
          const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
          option[index].thanhtien = Number(tien.toFixed(2));
        }

    }else if(type == "chietkhau"){
        option[index].chietkhau = Number(value.value) 
        option[index].dongiasauck = +option[index].dongia * (1 - option[index].chietkhau/100);
        option[index].dongiasauck = +(Math.round(option[index].dongiasauck + 'e+2') + 'e-2');
        if(option[index].thue?.tax_rate == undefined){
          const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
          option[index].thanhtien = Number(tien.toFixed(2));
        }else{
          const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
          option[index].thanhtien = Number(tien.toFixed(2));
        }
    }else if(type == "thue"){
        option[index].thue = value
        if(option[index].thue?.tax_rate == undefined){
          const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
          option[index].thanhtien = Number(tien.toFixed(2));
        }else{
          const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
          option[index].thanhtien = Number(tien.toFixed(2));
        }
    }else if(type == "ghichu"){
        option[index].ghichu = value?.target?.value;
    }
    sOption([...option])
  }

  const handleIncrease = (id) => {
    const index = option.findIndex((x) => x.id === id);
    const newQuantity = option[index].soluong + 1;
    option[index].soluong = newQuantity;
    if(option[index].thue?.tax_rate == undefined){
      const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
      option[index].thanhtien = Number(tien.toFixed(2));
    }else{
      const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
      option[index].thanhtien = Number(tien.toFixed(2));
    }
    sOption([...option]);
  };

  const handleDecrease = (id) => {
    const index = option.findIndex((x) => x.id === id);
    const newQuantity = Number(option[index].soluong) - 1;
    if (newQuantity >= 1) { // chỉ giảm số lượng khi nó lớn hơn hoặc bằng 1
      option[index].soluong = Number(newQuantity);
      if(option[index].thue?.tax_rate == undefined){
        const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
        option[index].thanhtien = Number(tien.toFixed(2));
      }else{
        const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
        option[index].thanhtien = Number(tien.toFixed(2));
      }
      sOption([...option]);
    }else{
      return  Toast.fire({
        title: `${"Số lượng tối thiểu"}`,
        icon: 'error',
        confirmButtonColor: '#296dc1',
        cancelButtonColor: '#d33',
        confirmButtonText: `${dataLang?.aler_yes}`,
        })
    }
  };

  const _HandleDelete =  (id) => {
  if (id === option[0].id) {
    return Toast.fire({
      title: `${"Mặc định hệ thống, không xóa"}`,
      icon: 'error',
      confirmButtonColor: '#296dc1',
      cancelButtonColor: '#d33',
      confirmButtonText: `${dataLang?.aler_yes}`,
    })
  }
    const newOption = option.filter(x => x.id !== id); // loại bỏ phần tử cần xóa
    sOption(newOption); // cập nhật lại mảng
  }

  // const formatNumber = (num) => {
  //   if (!num && num !== 0) return 0;
  //   const roundedNum = parseFloat(num.toFixed(2));
  //   return roundedNum.toLocaleString("en", {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //     useGrouping: true
  //   });
  // };

  const formatNumber = (number) => {
    const integerPart = Math.floor(number)
    return integerPart.toLocaleString("en")
  }

  const tinhTongTien = (option) => {

    const tongTien = option?.reduce((accumulator, currentValue) => accumulator + currentValue?.dongia * currentValue?.soluong, 0);
  
    const tienChietKhau = option?.reduce((acc, item) => {
      const chiTiet = item?.dongia * (item?.chietkhau/100) * item?.soluong;
      return acc + chiTiet;
    }, 0);
  
    const tongTienSauCK = option?.reduce((acc, item) => {
      const tienSauCK = item?.soluong * item?.dongiasauck;
      return acc + tienSauCK;
    }, 0);
  
    const tienThue = option?.reduce((acc, item) => {
      const tienThueItem = item?.dongiasauck * (isNaN(item?.thue?.tax_rate) ? 0 : (item?.thue?.tax_rate/100)) * item?.soluong;
      return acc + tienThueItem;
    }, 0);
  
    const tongThanhTien = option?.reduce((acc, item) => acc + item?.thanhtien, 0);
    return { tongTien: tongTien || 0, tienChietKhau: tienChietKhau || 0, tongTienSauCK: tongTienSauCK || 0, tienThue: tienThue || 0, tongThanhTien: tongThanhTien || 0 };
  };

  const [tongTienState, setTongTienState] = useState({ tongTien: 0, tienChietKhau: 0, tongTienSauCK: 0, tienThue: 0, tongThanhTien: 0 });
 
  useEffect(() => {
    const tongTien = tinhTongTien(option);
    setTongTienState(tongTien);
  }, [option]);

  const _ServerSending = () => {
    var formData = new FormData();
    formData.append("code", code)
    formData.append("date", (moment(date).format("YYYY-MM-DD HH:mm:ss")))
    formData.append("branch_id", valueBr.value)
    formData.append("suppliers_id", valueSupplier.value)
    formData.append("note", note)
    sortedArr.forEach((item, index) => {
      formData.append(`items[${index}][id]`, props?.id ? item?.idData : "");
      formData.append(`items[${index}][name]`, item?.dichvu ? item?.dichvu : "");
      formData.append(`items[${index}][price]`, item?.dongia ? item?.dongia : "");
      formData.append(`items[${index}][quantity]`, item?.soluong ? item?.soluong : "");
      formData.append(`items[${index}][discount_percent]`, item?.chietkhau ? item?.chietkhau : "");
      formData.append(`items[${index}][tax_id]`, item?.thue?.value != undefined ? item?.thue?.value : "");
      formData.append(`items[${index}][note]`, item?.ghichu ? item?.ghichu : "");

  });  
    Axios("POST", `${id ? `/api_web/Api_service/service/${id}?csrf_protection=true` : "/api_web/Api_service/service/?csrf_protection=true"}`, {
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'}
    }, (err, response) => {
        if(!err){
            var {isSuccess, message} = response.data
            if(isSuccess){
                Toast.fire({
                    icon: 'success',
                    title: `${dataLang[message]}`
                })
                sDate(new Date())
                sCode("")
                sValueBr(null)
                sValueSupplier(null)
                sNote("")
                sErrBranch(false)
                sErrService(false)
                sErrSupplier(false)
                sOption([{id: Date.now(),idData:"", dichvu: "", soluong: 1, dongia: 0, chietkhau: 0, dongiasauck: 0, thue: 0, thanhtien:0}])
                props.onRefresh && props.onRefresh()
                props.onRefreshGr && props.onRefreshGr()
                sOpen(false)
            }else {
              Toast.fire({
                icon: 'error',
                title: `${dataLang[message]}`
              })
            }
        }
        sOnSending(false)
    })
}
useEffect(() => {
  onSending && _ServerSending()
}, [onSending]);


return(
  <>
  <PopupEdit   
    title={props.id ? `${props.dataLang?.serviceVoucher_edit || "serviceVoucher_edit"}` : `${props.dataLang?.serviceVoucher_add || "serviceVoucher_add"}`} 
    button={props.id ? props.dataLang?.serviceVoucher_edit_votes || "serviceVoucher_edit_votes" : `${props.dataLang?.branch_popup_create_new}`} 
    onClickOpen={_HandleOpenModal.bind(this)} 
    open={open} 
    onClose={_HandleCloseModal.bind(this)}
    classNameBtn={props.className} 
  >
          <div className="mt-4  max-w-[60vw] 2xl:max-w-[50vw] xl:max-w-[60vw]">
            <h2 className='font-normal bg-[#ECF0F4] 2xl:text-[12px] xl:text-[13px] text-[12px] p-1'>{dataLang?.serviceVoucher_general_information || "serviceVoucher_general_information"}</h2>       
              <form onSubmit={_HandleSubmit.bind(this)} className="">
                <div className='max-w-[60vw] 2xl:max-w-[50vw] xl:max-w-[60vw] '> 
                  <div className="grid grid-cols-5 gap-5 items-center"> 
                    <div className='col-span-2 max-h-[70px] min-h-[70px] relative'>
                            <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] mb-1 ">{dataLang?.serviceVoucher_day_vouchers} </label>
                            <div className="custom-date-picker flex flex-row " >
                                  <DatePicker
                                    blur
                                    fixedHeight
                                    showTimeSelect
                                    selected={date}
                                    onSelect={(date) => _HandleChangeInput("date",date)}
                                    onChange={(e) => _HandleChangeInput("date",e)}
                                    placeholderText="DD/MM/YYYY HH:mm:ss"
                                    dateFormat="dd/MM/yyyy h:mm:ss aa"
                                    timeInputLabel={'Time: '}
                                    placeholder={dataLang?.price_quote_system_default || "price_quote_system_default"}
                                    className={`border focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer `}
                                  />
                                  {date && (
                                    <>
                                      <MdClear className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer" onClick={() => _HandleChangeInput('clear')} />
                                    </>
                                  )}
                              <BsCalendarEvent className="absolute right-0 -translate-x-[75%] translate-y-[70%] text-[#CCCCCC] scale-110 cursor-pointer" />
                            </div>
                            
                    </div>
                    <div className='col-span-1 max-h-[70px] min-h-[70px]'>
                       <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] mb-1 ">{dataLang?.serviceVoucher_voucher_code || "serviceVoucher_voucher_code"}<span className="text-red-500">*</span></label>
                          <input
                              value={code}                
                              onChange={_HandleChangeInput.bind(this, "code")}
                              placeholder={"Mặc định theo hệ thống"}                     
                              type="text"
                              className="focus:border-[#92BFF7] border-[#d0d5dd] 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2.5 border outline-none mb-2"
                            />
                    </div>
                    <div className='col-span-1 max-h-[70px] min-h-[70px]'>
                          <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] mb-1 ">{props.dataLang?.serviceVoucher_branch} <span className="text-red-500">*</span></label>
                              <Select   
                                  closeMenuOnSelect={true}
                                  placeholder={props.dataLang?.serviceVoucher_branch}
                                  options={dataBranch}
                                  isSearchable={true}
                                  onChange={_HandleChangeInput.bind(this, "valueBr")}
                                  LoadingIndicator
                                  noOptionsMessage={() => "Không có dữ liệu"}
                                  value={valueBr}
                                  maxMenuHeight="200px"
                                  isClearable={true} 
                                  menuPortalTarget={document.body}
                                  onMenuOpen={handleMenuOpen}
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
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                        position: "absolute", 
                                      
                                    }), 
                                }}
                                className={`${errBranch ? "border-red-500" : "border-transparent" } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] mb-2 font-normal outline-none border `} 
                              />
                          {errBranch && <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">{props.dataLang?.client_list_bran}</label>}
                    </div>
                    <div className='col-span-1  max-h-[70px] min-h-[70px]'>
                        <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] mb-1 ">{dataLang?.serviceVoucher_supplier || "serviceVoucher_supplier"} <span className="text-red-500">*</span></label>
                            <Select   
                                closeMenuOnSelect={true}
                                placeholder={dataLang?.serviceVoucher_supplier || "serviceVoucher_supplier"}
                                options={dataSupplier}
                                isSearchable={true}
                                onChange={_HandleChangeInput.bind(this, "valueSupplier")}
                                LoadingIndicator
                                noOptionsMessage={() => "Không có dữ liệu"}
                                value={valueSupplier}
                                maxMenuHeight="200px"
                                isClearable={true} 
                                menuPortalTarget={document.body}
                                onMenuOpen={handleMenuOpen}
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
                                  menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                      position: "absolute", 
                                    
                                  }),
                              }}
                              className={`${errSupplier ? "border-red-500" : "border-transparent" } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] mb-2 rounded text-[#52575E] font-normal outline-none border `} 
                            />
                        {errSupplier && <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">{props.dataLang?.purchase_order_errSupplier}</label>}
                    </div>
                  </div>
                </div>
            <h2 className='font-normal bg-[#ECF0F4] p-1 2xl:text-[12px] xl:text-[13px] text-[12px]  mb-1 '>{dataLang?.serviceVoucher_information_services || "serviceVoucher_information_services"}</h2>  
                <div className='grid grid-cols-12 items-center  sticky top-0  bg-[#F7F8F9] py-2 z-10'>
                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-2    text-center    truncate font-[400] flex items-center gap-1'>
                  <button  type='button' onClick={_HandleAddNew.bind(this)} title='Thêm' className='transition hover:bg-red-100 hover:animate-pulse	 rounded-full bg-slate-200 flex flex-col justify-center items-center'><Add color='red' size={20} className=''/></button>         
                    {dataLang?.serviceVoucher_services_arising || "serviceVoucher_services_arising"}</h4>
                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-2    text-center  truncate font-[400]'>{dataLang?.serviceVoucher_quantity || "serviceVoucher_quantity"}</h4>
                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]'>{dataLang?.serviceVoucher_unit_price || "serviceVoucher_unit_price"}</h4>
                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]'>{"% CK"}</h4>
                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]'>{"ĐGSCK"}</h4>
                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-2    text-center  truncate font-[400]'>{dataLang?.serviceVoucher_tax || "serviceVoucher_tax"}</h4>
                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]'>{dataLang?.serviceVoucher_into_money || "serviceVoucher_into_money"}</h4>
                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]'>{dataLang?.serviceVoucher_note || "serviceVoucher_note"}</h4>
                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]'>{dataLang?.serviceVoucher_operation || "serviceVoucher_operation"}</h4>
               </div> 
                <ScrollArea   ref={scrollAreaRef} className="min-h-[140px] xl:min-h-[140px] 2xl:min-h-[180px] max-h-[140px] xl:max-h-[140px] 2xl:max-h-[180px] overflow-hidden"   speed={1}    smoothScrolling={true}>
               {sortedArr.map((e,index) => 
                            <div className='grid grid-cols-12 gap-1 py-1 ' key={e?.id}>
                            <div className='col-span-2  my-auto '>
                              <textarea
                                  value={e?.dichvu}                
                                  onChange={_HandleChangeInputOption.bind(this, e?.id, "dichvu",index)}
                                  name="optionEmail"    
                                  placeholder='Dịch vụ'                 
                                  type="text"
                                  className={`${errService && e?.dichvu == "" ? "border-red-500" : "border-gray-300" } placeholder:text-slate-300 bg-[#ffffff] rounded text-[#52575E] min-h-[40px] h-[40px] max-h-[80px] 2xl:text-[12px] xl:text-[13px] text-[12px] w-full font-normal outline-none border  p-1.5 `} 
                              />
                            </div>
                         <div className='col-span-2 flex items-center justify-center'>
                           <div className="flex items-center justify-center">
                           <button type='button' className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-[1px]  bg-slate-200 rounded-full"
                              onClick={() => handleDecrease(e?.id)}  
                              ><Minus className='scale-70' size="16"/></button>
                                  <NumericFormat
                                  className="appearance-none text-center 2xl:text-[12px] xl:text-[13px] text-[12px] py-2 px-0.5 font-normal 2xl:w-20 xl:w-[55px] w-[63px]  focus:outline-none border-b-2 border-gray-200"
                                  onValueChange={_HandleChangeInputOption.bind(this, e?.id, "soluong",e)}
                                  value={e?.soluong || 1}
                                  thousandSeparator=","
                                  allowNegative={false}
                                  decimalScale={0}
                                  isNumericString={true}  
                                  isAllowed={(values) => { const {floatValue} = values; return floatValue > 0 }}       
                                  />
                                <button type='button'  className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-[1px]  bg-slate-200 rounded-full"
                                onClick={() => handleIncrease(e.id)}
                                >
                                    <Add className='scale-70' size="16"/>
                                </button>
                           </div>
                         </div>
                         <div className='col-span-1 text-center flex items-center justify-center'>
                          <NumericFormat
                                value={e?.dongia}
                                onValueChange={_HandleChangeInputOption.bind(this, e?.id, "dongia",index)}
                                allowNegative={false}
                                decimalScale={0}
                                isNumericString={true}   
                                className="appearance-none 2xl:text-[12px] xl:text-[13px] text-[12px] text-center py-1 px-1 font-normal w-[90%] focus:outline-none border-b-2 border-gray-200"
                                thousandSeparator=","
                            />
                         </div>
                         <div className='col-span-1 text-center flex items-center justify-center'>
                          <NumericFormat
                              value={e?.chietkhau}
                              onValueChange={_HandleChangeInputOption.bind(this, e?.id, "chietkhau",index)}
                              className="appearance-none text-center py-1 px-1 font-normal w-[90%]  focus:outline-none border-b-2 2xl:text-[12px] xl:text-[13px] text-[12px] border-gray-200"
                              thousandSeparator=","
                              allowNegative={false}
                              isNumericString={true}   
                          />
                         </div>
                         <div className='col-span-1 text-right flex items-center justify-end'>
                           <h3 className='px-2 2xl:text-[12px] xl:text-[13px] text-[12px]'>{formatNumber(e?.dongiasauck)}</h3>
                         </div>
                         <div className='col-span-2 flex justify-center items-center'>
                         <Select   
                                  closeMenuOnSelect={true}
                                  placeholder={props.dataLang?.serviceVoucher_tax || "serviceVoucher_tax"}
                                  options={taxOptions}
                                  isSearchable={true}
                                  onChange={_HandleChangeInputOption.bind(this, e?.id, "thue", index)}
                                  LoadingIndicator
                                  noOptionsMessage={() => "Không có dữ liệu"}
                                  value={e?.thue}
                                  maxMenuHeight="200px"
                                  isClearable={true} 
                                  menuPortalTarget={document.body}
                                  formatOptionLabel={(option) => (
                                    <div className='flex justify-start items-center gap-1 '>
                                        <h2 className='2xl:text-[12px] xl:text-[13px] text-[12px]'>{option?.label}</h2>
                                        <h2 className='2xl:text-[12px] xl:text-[13px] text-[12px]'>{`(${option?.tax_rate})`}</h2>
                                    </div>
                                  )}
                                  onMenuOpen={handleMenuOpen}
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
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                        position: "absolute", 
                                      
                                    }), 
                                }}
                                className="border-transparent placeholder:text-slate-300 w-full 2xl:text-[12px] xl:text-[13px] text-[12px] bg-[#ffffff] rounded text-[#52575E] mb-2 font-normal outline-none border"
                              />
                        </div>
                         <div className='col-span-1 text-right flex items-center justify-end'>
                          <h3 className='px-2 2xl:text-[12px] xl:text-[13px] text-[12px]'>{formatNumber(e?.thanhtien)}</h3>
                         </div>
                         <div className='col-span-1 flex items-center justify-center'>
                             <textarea
                                 value={e?.ghichu}                
                                 onChange={_HandleChangeInputOption.bind(this, e?.id, "ghichu",index)}
                                 name="optionEmail"     
                                 placeholder='Ghi chú'                 
                                 type="text"
                                 className= "focus:border-[#92BFF7] border-[#d0d5dd] min-h-[40px] h-[40px] max-h-[80px] 2xl:text-[12px] xl:text-[13px] text-[12px]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                               /> 
                         </div>
                         <div className='col-span-1 flex items-center justify-center'>
                           <button
                            onClick={_HandleDelete.bind(this, e?.id)}
                             type='button' title='Xóa' className='transition  w-full bg-slate-100 h-10 rounded-[5.5px] text-red-500 flex flex-col justify-center items-center mb-2'><IconDelete /></button>
                         </div>
                           </div>
                          )} 
                </ScrollArea>
           <div className='grid grid-cols-11 mb-1 font-normal bg-[#ecf0f475] p-1.5 items-center'>
            <div className='col-span-3  flex items-center gap-2'>
                <h2 className='2xl:text-[12px] xl:text-[13px] text-[12px]'>{dataLang?.purchase_order_detail_discount || "purchase_order_detail_discount"}</h2>
                <div className='col-span-1 text-center flex items-center justify-center'>
                <NumericFormat
                    value={chietkhautong}
                    onValueChange={_HandleChangeInput.bind(this, "chietkhautong")}
                    className=" text-center 2xl:text-[12px] xl:text-[13px] text-[12px] py-1 px-2 bg-transparent font-normal w-20 focus:outline-none border-b-2 border-gray-300"
                    thousandSeparator=","
                    allowNegative={false}
                    decimalScale={0}
                    isNumericString={true}   
                />
              </div> 
            </div>
            <div className='col-span-3 flex items-center'>
                <h2 className='w-[30%] 2xl:text-[12px] xl:text-[13px] text-[12px]'>{dataLang?.purchase_order_detail_tax || "purchase_order_detail_tax"}</h2>  
              <Select   
                  closeMenuOnSelect={true}
                  placeholder={dataLang?.serviceVoucher_tax || "serviceVoucher_tax"}
                  options={taxOptions}
                  isSearchable={true}
                  onChange={_HandleChangeInput.bind(this, "thuetong")}
                  LoadingIndicator
                  noOptionsMessage={() => "Không có dữ liệu"}
                  value={thuetong}
                  maxMenuHeight="200px"
                  isClearable={true} 
                  menuPortalTarget={document.body}
                  formatOptionLabel={(option) => (
                    <div className='flex justify-start items-center gap-1 '>
                        <h2 className='2xl:text-[12px] xl:text-[13px] text-[12px]'>{option?.label}</h2>
                        <h2 className='2xl:text-[12px] xl:text-[13px] text-[12px]'>{`(${option?.tax_rate})`}</h2>
                    </div>
                  )}
                  onMenuOpen={handleMenuOpen}
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
                    menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                        position: "absolute", 
                    }), 
                    control: (provided, state) => ({
                      ...provided,
                      minHeight:30,
                      maxHeight:30
                    }),
                }}
                className=" text-[12px] border-transparent placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border"
            />
            </div>
        </div>
        <h2 className='font-normal bg-[white] 2xl:text-[12px] xl:text-[13px] text-[12px]  p-1 border-b border-b-[#a9b5c5]  border-t border-t-[#a9b5c5]'>{dataLang?.purchase_order_table_total_outside || "purchase_order_table_total_outside"} </h2>  
        <div className='grid grid-cols-5'>
            <div className='col-span-3'>
                <div className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.purchase_order_note || "purchase_order_note"}</div>
                  <textarea
                    value={note}       
                    placeholder={dataLang?.purchase_order_note || "purchase_order_note"}         
                    onChange={_HandleChangeInput.bind(this, "note")}
                    name="fname"                      
                    type="text"
                    className="focus:border-[#92BFF7] 2xl:text-[12px] xl:text-[13px] text-[12px] border-[#d0d5dd] placeholder:text-slate-300 w-[60%] min-h-[120px] max-h-[150px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none "
                  />
            </div>
            <div className="text-right mt-2 space-y-1 col-span-2 flex-col justify-between ">
                <div className='flex justify-between '>
                </div>
                <div className='flex justify-between '>
                     <div className='font-normal 2xl:text-[14px] xl:text-[13px] text-[12.5px] '><h3>{dataLang?.purchase_order_table_total ||"purchase_order_table_total" }</h3></div>
                    <div className='font-normal 2xl:text-[14px] xl:text-[13px] text-[12.5px]'><h3 className='text-blue-600'>{formatNumber(tongTienState.tongTien)}</h3></div>
                </div>
                <div className='flex justify-between '>
                     <div className='font-normal 2xl:text-[14px] xl:text-[13px] text-[12.5px]'><h3>{dataLang?.purchase_order_detail_discounty || "purchase_order_detail_discounty"}</h3></div>
                    <div className='font-normal 2xl:text-[14px] xl:text-[13px] text-[12.5px]'><h3 className='text-blue-600'>{formatNumber(tongTienState.tienChietKhau)}</h3></div>
                </div>
                <div className='flex justify-between '>
                     <div className='font-normal 2xl:text-[14px] xl:text-[13px] text-[12.5px]'><h3>{dataLang?.purchase_order_detail_money_after_discount || "purchase_order_detail_money_after_discount"}</h3></div>
                    <div className='font-normal 2xl:text-[14px] xl:text-[13px] text-[12.5px]'><h3 className='text-blue-600'>{formatNumber(tongTienState.tongTienSauCK)}</h3></div>
                </div>
                <div className='flex justify-between '>
                     <div className='font-normal 2xl:text-[14px] xl:text-[13px] text-[12.5px]'><h3>{dataLang?.purchase_order_detail_tax_money || "purchase_order_detail_tax_money"}</h3></div>
                    <div className='font-normal 2xl:text-[14px] xl:text-[13px] text-[12.5px]'><h3 className='text-blue-600'>{formatNumber(tongTienState.tienThue)}</h3></div>
                </div>
                <div className='flex justify-between '>
                     <div className='font-normal 2xl:text-[14px] xl:text-[13px] text-[12.5px]'><h3>{dataLang?.purchase_order_detail_into_money || "purchase_order_detail_into_money"}</h3></div>
                    <div className='font-normal 2xl:text-[14px] xl:text-[13px] text-[12.5px]'><h3 className='text-blue-600'>{formatNumber(tongTienState.tongThanhTien)}</h3></div>
                </div>
                <div className='space-x-2'>
                <button
                type='button'
                 onClick={_HandleCloseModal.bind(this)} 
                 className="button text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]">{dataLang?.purchase_order_purchase_back || "purchase_order_purchase_back"}</button>
                  <button 
                  onClick={_HandleSubmit.bind(this)} 
                   type="submit"className="button text-[#FFFFFF]  font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]">{dataLang?.purchase_order_purchase_save || "purchase_order_purchase_save"}</button>
                </div>
            </div>
        </div>
              </form>

        </div>    
  </PopupEdit>
  </>
)
}

const Popup_chitiet =(props)=>{

  const [open, sOpen] = useState(false);
  const _ToggleModal = (e) => sOpen(e);
  const [data,sData] =useState()
  const [onFetching, sOnFetching] = useState(false);

  useEffect(() => {
    props?.id && sOnFetching(true) 
  }, [open]);

  // const formatNumber = num => {
  //   if (!num && num !== 0) return 0;
  //   const roundedNum = Number(num).toFixed(2);
  //   return parseFloat(roundedNum).toLocaleString("en");
  // };
  const formatNumber = (number) => {
    const integerPart = Math.floor(number)
    return integerPart.toLocaleString("en")
  }

  const _ServerFetching_detailUser = () =>{
    Axios("GET", `/api_web/Api_service/service/${props?.id}?csrf_protection=true`, {}, (err, response) => {
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

 
return (
<>
 <PopupEdit   
    title={props.dataLang?.serviceVoucher_service_voucher_details || "serviceVoucher_service_voucher_details"} 
    button={props?.name} 
    onClickOpen={_ToggleModal.bind(this, true)} 
    open={open} onClose={_ToggleModal.bind(this,false)}
    classNameBtn={props?.className} 
  >
  <div className='flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]'>
     
  </div>  
          <div className=" space-x-5 w-[999px]  2xl:h-auto xl:h-auto h-[650px] ">        
          <div>
           <div className='w-[999px]'>
             <div  className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
             <h2 className='font-normal bg-[#ECF0F4] p-2 text-[13px]'>{props?.dataLang?.purchase_order_detail_general_informatione || "purchase_order_detail_general_informatione"}</h2>       
              <div className='grid grid-cols-8  min-h-[100px] px-2'>
                  <div className='col-span-3'>
                      <div className='my-4 font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.serviceVoucher_day_vouchers || "serviceVoucher_day_vouchers"}</h3><h3 className=' text-[13px]  font-normal'>{data?.date != null ? moment(data?.date).format("DD/MM/YYYY") : ""}</h3></div>
                      <div className='my-4 font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.serviceVoucher_voucher_code || "serviceVoucher_voucher_code"}</h3><h3 className=' text-[13px]  font-normal'>{data?.code}</h3></div>
                  </div>
                  <div className='col-span-2 mx-auto'>
                      <div className='my-4 font-medium text-[13px]'>{props.dataLang?.serviceVoucher_status_of_spending || "serviceVoucher_status_of_spending"}</div>
                      <div className='flex flex-wrap  gap-2 items-center justify-center'>
                              {
                            data?.status_pay === "not_spent" && <span className=' font-normal text-sky-500  rounded-xl py-1 px-2 min-w-[135px]  bg-sky-200 text-center text-[13px]'>{"Chưa chi"}</span>||
                            data?.status_pay === "spent_part" && <span className=' font-normal text-orange-500 rounded-xl py-1 px-2 min-w-[135px]  bg-orange-200 text-center text-[13px]'>{"Chi 1 phần"} {`(${formatNumber(data?.amount_paid)})`}</span>||
                            data?.status_pay === "spent" && <span className='flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 min-w-[135px]  bg-lime-200 text-center text-[13px]'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{"Đã chi đủ"}</span>
                              }
                          </div>
                  </div>
                  <div className='col-span-3 '> 
                      <div className='my-4 font-medium grid grid-cols-2'><h3 className='text-[13px]'>{props.dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}</h3><h3 className="3xl:items-center 3xl-text-[16px] 2xl:text-[13px] xl:text-xs text-[8px] text-[#0F4F9E] font-[300] px-2 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase w-fit">{data?.branch_name}</h3></div>
                      <div className='my-4 font-medium grid grid-cols-2'><h3 className='text-[13px] '>{props.dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"}</h3><h3 className='text-[13px] font-normal '>{data?.supplier_name}</h3></div>
                  </div>
                  
              </div>
              <div className=" w-[100%] lx:w-[110%] ">
                <div className="grid grid-cols-12 sticky top-0 bg-slate-50 shadow-lg p-2 z-10">
                  <h4 className="text-[12px] px-2 text-gray-400 uppercase  font-[500] col-span-2  text-left">{props.dataLang?.serviceVoucher_services_arising || "serviceVoucher_services_arising"}</h4>
                  <h4 className="text-[12px] px-2 text-gray-400 uppercase  font-[500] col-span-1  text-center">{props.dataLang?.serviceVoucher_quantity || "serviceVoucher_quantity"}</h4>
                  <h4 className="text-[12px] px-2 text-gray-400 uppercase  font-[500] col-span-1  text-center">{props.dataLang?.serviceVoucher_unit_price || "serviceVoucher_unit_price"}</h4> 
                  <h4 className="text-[12px] px-2 text-gray-400 uppercase  font-[500] col-span-1  text-center">{"% CK"}</h4>
                  <h4 className="text-[12px] px-2 text-gray-400 uppercase  font-[500] col-span-2  text-center">{props.dataLang?.import_from_price_affter || "import_from_price_affter"}</h4>
                  <h4 className="text-[12px] px-2 text-gray-400 uppercase  font-[500] col-span-1  text-center">{props.dataLang?.serviceVoucher_tax || "serviceVoucher_tax"}</h4>
                  <h4 className="text-[12px] px-2 text-gray-400 uppercase  font-[500] col-span-2  text-center">{props.dataLang?.serviceVoucher_into_money || "serviceVoucher_into_money"}</h4>
                  <h4 className="text-[12px] px-2 text-gray-400 uppercase  font-[500] col-span-2  text-center">{props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}</h4>
                </div>
                {onFetching ?
                  <Loading className="max-h-28"color="#0f4f9e" /> 
                  : 
                  data?.item?.length > 0 ? 
                  (<>
                       <ScrollArea     
                         className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px] overflow-hidden"  speed={1}  smoothScrolling={true}>
                    <div className="divide-y divide-slate-200 min:h-[300px] h-[100%] max:h-[400px]">                       
                      {(data?.item?.map((e) => 
                        <div className="grid items-center grid-cols-12 py-1.5 px-2 hover:bg-slate-100/40 " key={e.id?.toString()}>
                          <h6 className="text-[13px]  px-2 py-0.5 col-span-2  rounded-md text-left">{e?.name}</h6>                
                          <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center">{formatNumber(e?.quantity)}</h6>  
                          <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center">{formatNumber(e?.price)}</h6>                
                          <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center">{e?.discount_percent + "%"}</h6>                
                          <h6 className="text-[13px]  px-2 py-0.5 col-span-2  rounded-md text-center">{formatNumber(e?.price_after_discount)}</h6>                
                          <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center">{formatNumber(e?.tax_rate) + "%"}</h6>                
                          <h6 className="text-[13px]  px-2 py-0.5 col-span-2  rounded-md text-right">{formatNumber(e?.amount)}</h6>                
                          <h6 className="text-[13px]  px-2 py-0.5 col-span-2  rounded-md text-left">{e?.note != undefined ? e?.note : ""}</h6>                
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
                        </div>
                      </div>
                    </div>
                  )}    
              </div>
          <h2 className='font-normal p-2 text-[13px]  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]'>{props.dataLang?.purchase_total || "purchase_total"}</h2>  
              <div className=" mt-2  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
              <div className='col-span-7'>
                  <div>
                    <div className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[13px] mb-1 ">{props.dataLang?.purchase_note || "purchase_note"}</div>
                          <textarea
                            value={data?.note}
                            disabled
                            name="fname"                      
                            type="text"
                            className="text-[13px] placeholder:text-slate-300 w-[80%] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 min-h-[100px] max-h-[100px] resize-none bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 outline-none "
                          />
                  </div>
              </div>
             <div className='col-span-2 mt-2 space-y-2'>
                  <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_table_total || "purchase_order_table_total"}</h3></div>
                  <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_detail_discounty || "purchase_order_detail_discounty"}</h3></div>
                  <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_detail_money_after_discount || "purchase_order_detail_money_after_discount"}</h3></div>
                  <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_detail_tax_money || "purchase_order_detail_tax_money"}</h3></div>
                  <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_detail_into_money || "purchase_order_detail_into_money"}</h3></div>
             </div>
             <div className='col-span-3 mt-2 space-y-2'>
                  <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_price)}</h3></div>
                  <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_discount)}</h3></div>
                  <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_price_after_discount)}</h3></div>
                  <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_tax_price)}</h3></div>
                  <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_amount)}</h3></div>
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


export default Index;