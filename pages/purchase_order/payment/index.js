import React, {useState, useRef, useEffect} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {_ServerInstance as Axios} from '/services/axios';
const ScrollArea = dynamic(() => import("react-scrollbar"), {
  ssr: false,
});
import ReactExport from "react-data-export";

import Swal from 'sweetalert2'
import {NumericFormat} from "react-number-format";
import { v4 as uuidv4 } from 'uuid';

import { MdClear } from 'react-icons/md';
import { BsCalendarEvent } from 'react-icons/bs';
import 'react-datepicker/dist/react-datepicker.css';
import Datepicker from 'react-tailwindcss-datepicker'
import DatePicker,{registerLocale } from "react-datepicker";
import ModalImage from "react-modal-image";

import { Edit as IconEdit,  Grid6 as IconExcel,  ArrowDown2 as IconDown,TickCircle, Trash as IconDelete, SearchNormal1 as IconSearch,Add as IconAdd, LocationTick, User, ArrowCircleDown, Add  } from "iconsax-react";

import {BiEdit} from 'react-icons/bi'
import {RiDeleteBin6Line} from 'react-icons/ri'
import {VscFilePdf} from 'react-icons/vsc'

import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import Pagination from '/components/UI/pagination';
import dynamic from 'next/dynamic';
import moment from 'moment/moment';
import Select,{components } from 'react-select';
import Popup from 'reactjs-popup';
import { data } from 'autoprefixer';
import { useDispatch } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import Popup_chitietThere from '../detailThere';
import FilePDF from '../FilePDF';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
})

const CustomSelectOption = ({value, label, level, code}) => (
  <div className='flex space-x-2 truncate'>
      {level == 1 && <span>--</span>}
      {level == 2 && <span>----</span>}
      {level == 3 && <span>------</span>}
      {level == 4 && <span>--------</span>}
      <span className="2xl:max-w-[300px] max-w-[150px] w-fit truncate">{label}</span>
  </div>
)

const Index = (props) => {

    const dataLang = props.dataLang
    const router = useRouter();
    const tabPage = router.query?.tab;
    const dispatch = useDispatch()

    const [keySearch, sKeySearch] = useState("")
    const [limit, sLimit] = useState(15);
    const [totalItem, sTotalItems] = useState([]);
    const [total, sTotal] = useState({})

    const [onFetching, sOnFetching] = useState(false);
    const [onFetching_filter, sOnFetching_filter] = useState(false);
    const [data, sData] = useState({});
    const [data_ex, sData_ex] = useState([]);
    const [dataMethod, sDataMethod] = useState([])
    const [dataObject, sDataObject] = useState([])

    const [listBr, sListBr]= useState([])
    const [idBranch, sIdBranch] = useState(null);
    const [idObject, sIdObject] = useState(null);
    const [idMethod, sIdMethod] = useState(null);
    const [valueDate, sValueDate] = useState({startDate: null, endDate:null
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
          query: { tab: router.query?.tab ? router.query?.tab : 0  }
      })
    }, []);

    const _ServerFetching =  () => {
        Axios("GET", `/api_web/Api_expense_voucher/expenseVoucher/?csrf_protection=true`, {
            params: {
                limit: limit,  
                page: router.query?.page || 1,  
                "filter[branch_id]": idBranch != null ? idBranch.value : null ,
                "filter[start_date]": valueDate?.startDate != null ? valueDate?.startDate : null ,
                "filter[end_date]":valueDate?.endDate != null ? valueDate?.endDate : null ,
                "filter[payment_mode]": idMethod != null ? idMethod.value : null,
                "filter[objects]": idObject != null ? idObject.value : null,
                "filter[search]": keySearch
            }
        }, (err, response) => {
            if(!err){
                var {rResult, output, rTotal} =  response.data
                sData(rResult)
                sTotalItems(output)
                sData_ex(rResult)
                sTotal(rTotal)
            }
            sOnFetching(false)
        })
    }

    const _ServerFetching_filter =  () =>{
      Axios("GET", `/api_web/Api_Branch/branchCombobox/?csrf_protection=true`, {}, (err, response) => {
        if(!err){
            var {isSuccess, result} =  response.data
            sListBr(result?.map(e =>({label: e.name, value: e.id})))
        }
      })
      Axios("GET", "/api_web/Api_payment_method/payment_method/?csrf_protection=true",{}, (err, response) => {
        if(!err){
            var {rResult} =  response.data
            sDataMethod(rResult?.map(e => ({label: e?.name, value: e?.id})))
        }
      })
      Axios("GET", "/api_web/Api_expense_voucher/object/?csrf_protection=true",{}, (err, response) => {
        if(!err){
          var data =  response.data
          sDataObject(data?.map(e => ({label: dataLang[e?.name], value: e?.id})))
        }
      })
      sOnFetching_filter(false)
   }

    useEffect(()=>{
      onFetching_filter && _ServerFetching_filter()
    },[onFetching_filter])

  const onchang_filter = (type, value)=>{
    if(type == "branch"){
        sIdBranch(value)
    }else if(type == "date"){
      sValueDate(value)
    }else if(type == "method"){
      sIdMethod(value)
    }else if(type == "object"){
      sIdObject(value)
    }
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
  
    // const paginate = pageNumber => {
    //   router.push({
    //     pathname: router.route,
    //     query: { 
    //       tab: router.query?.tab,
    //       page: pageNumber 
    //     }
    //   })
    // }

    const paginate = pageNumber => {
      const queryParams = { ...router.query, page: pageNumber };
      router.push({
        pathname: router.route,
        query: queryParams
      });
    };
  
      useEffect(() => {
        onFetching && _ServerFetching()  
        }, [onFetching]);

      //   useEffect(() => {
      //       router.query.tab && sOnFetching(true) || (keySearch && sOnFetching(true)) || router.query?.tab && sOnFetching_filter(true) || idBranch != null && sOnFetching(true) ||valueDate.startDate != null && valueDate.endDate != null && sOnFetching(true) || idMethod != null && sOnFetching(true) || idObject != null && sOnFetching(true)
      // }, [limit,router.query?.page, router.query?.tab, idBranch, valueDate.endDate, valueDate.startDate, idMethod, idObject]);
      
        useEffect(() => {
            router.query.tab && sOnFetching(true) || (keySearch && sOnFetching(true)) || router.query?.tab && sOnFetching_filter(true) 
      }, [limit,router.query?.page, router.query?.tab]);
      
       useEffect(() =>  {
        if(idBranch != null || valueDate.startDate != null && valueDate.endDate != null || idMethod != null || idObject != null){
          router.push({
              pathname: router.route,
              query: {
                  tab: router.query?.tab
          }
          })  
          setTimeout(() => {
            idBranch != null && sOnFetching(true) || valueDate.startDate != null && valueDate.endDate != null && sOnFetching(true) || idMethod != null && sOnFetching(true) || idObject != null && sOnFetching(true)
          }, 300);
        }
        else{
          sOnFetching(true)
        }
        
    }, [idBranch, valueDate.endDate, valueDate.startDate, idMethod, idObject]);

    


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
                {title: `${dataLang?.payment_date || "payment_date"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.payment_code || "payment_code"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.payment_obType || "payment_obType"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.payment_ob || "payment_ob"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.payment_typeOfDocument || "payment_typeOfDocument"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.payment_voucherCode || "payment_voucherCode"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.payment_TT_method || "payment_TT_method"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.payment_costs || "payment_costs"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.payment_amountOfMoney || "payment_amountOfMoney"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.payment_creator || "payment_creator"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.payment_branch || "payment_branch"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.payment_note || "payment_note"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
            ],
          
            data: data_ex?.map((e) =>
                [
                    {value: `${e?.id ? e.id : ""}`, style: {numFmt: "0"}},
                    {value: `${e?.date ? e?.date : ""}`},
                    {value: `${e?.code ? e?.code : ""}`},
                    {value: `${e?.objects ? (dataLang[e.objects] !== undefined ? dataLang[e.objects] : "") : ""}`},
                    {value: `${e?.object_text ? e?.object_text : ""}`},
                    {value: `${e?.type_vouchers ? dataLang[e?.type_vouchers] != undefined ? dataLang[e?.type_vouchers] : "" : ""}`},
                    {value: `${e?.voucher_code ? e?.voucher_code.join(', ') : ""}`},
                    {value: `${e?.payment_mode_name ? e?.payment_mode_name : ""}`},
                    {value: `${e?.cost_name   ? e?.cost_name?.join(', ') : ""}`},
                    {value: `${e?.total ? formatNumber(e?.total) : ""}`},
                    {value: `${e?.staff_name ? e?.staff_name : ""}`},
                    {value: `${e?.branch_name ? e?.branch_name :""}`},
                    {value: `${e?.note ? e?.note :""}`},
                ]    
            ),
        }
    ];


    return (
        <React.Fragment>
      <Head>
        <title>{dataLang?.payment_title || "payment_title"}</title>
      </Head>
      <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
          <h6 className="text-[#141522]/40">{dataLang?.payment_title || "payment_title"}</h6>
          <span className="text-[#141522]/40">/</span>
          <h6>{dataLang?.payment_title || "payment_title"}</h6>
        </div>

        <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
          <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 h-[96%] overflow-hidden">
                <div className='flex justify-between'>
                    <h2 className="text-2xl text-[#52575E] capitalize">{dataLang?.payment_title || "payment_title"}</h2>
                    <div className="flex justify-end items-center">
                    <Popup_dspc   onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />
                    
                  </div>
                </div>
              <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">    
                <div className="xl:space-y-3 space-y-2">
                    <div className="bg-slate-100 w-full rounded grid grid-cols-8 justify-between xl:p-3 p-2">
                      <div className='col-span-7'>
                        <div className='grid grid-cols-10 items-center space-x-1'>
                          <div className='col-span-2'>
                            <form className="flex items-center relative ">
                                <IconSearch className="absolute 3xl:h-[20px] 2xl:h-[20px] xl:h-[19px] lg:h-[18px] 3xl:w-[20px] 2xl:w-[18px] xl:w-[19px] lg:w-[18px] z-10 3xl:left-[4%] 2xl:left-[4%] xl:left-[8%] lg:left-[10%] text-[#cccccc]" />
                                <input
                                    className="3xl:text-[16px] 2xl:text-[16px] xl:text-[13px] lg:text-[12px] 3xl:h-[40px] 2xl:h-[40px] xl:h-[38px] lg:h-[39px]  2xl:text-left 2xl:pl-10 xl:pl-0 p-0 2xl:py-1.5  xl:py-2.5 lg:py-[11px] rounded 2xl:text-base text-xs xl:text-center text-center 2xl:w-full xl:w-[199px] lg:w-[160px]  relative bg-white  outline-[#D0D5DD] focus:outline-[#0F4F9E] "
                                    type="text"
                                    onChange={_HandleOnChangeKeySearch.bind(this)}
                                    placeholder={dataLang?.branch_search}
                                />
                            </form>
                          </div>
                          <div className='col-span-2'>
                              <Select 
                                  options={[{ value: '', label: dataLang?.payment_select_branch || "payment_select_branch", isDisabled: true }, ...listBr]}
                                  onChange={onchang_filter.bind(this, "branch")}
                                  value={idBranch}
                                  placeholder={dataLang?.client_list_filterbrand} 
                                  hideSelectedOptions={false}
                                  isClearable={true}
                                  className="3xl:text-[16px] 2xl:text-[16px] xl:text-[16px] lg:text-[12px] 3xl:w-full 2xl:w-full xl:w-full lg:w-[160px] 3xl:h-full 2xl:h-full  2xl:text-base xl:text-xs text-[10px] rounded-md bg-white z-20 " 
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
                          <div className=' col-span-2'>
                              <Select 
                                  options={[{ value: '', label: dataLang?.payment_TT_method || "payment_TT_method", isDisabled: true }, ...dataMethod]}
                                  onChange={onchang_filter.bind(this, "method")}
                                  value={idMethod}
                                  placeholder={dataLang?.payment_TT_method || "payment_TT_method"} 
                                  hideSelectedOptions={false}
                                  isClearable={true}
                                  className="3xl:text-[16px] 2xl:text-[16px] xl:text-[16px] lg:text-[12px] 3xl:w-full 2xl:w-full xl:w-full lg:w-[160px] 3xl:h-full 2xl:h-full  2xl:text-base xl:text-xs text-[10px] rounded-md bg-white z-20 " 
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
                          <div className=' col-span-2'>
                              <Select 
                                  options={[{ value: '', label: dataLang?.payment_select_ob || "payment_select_ob", isDisabled: true }, ...dataObject]}
                                  onChange={onchang_filter.bind(this, "object")}
                                  value={idObject}
                                  placeholder={dataLang?.payment_ob || "payment_ob"} 
                                  hideSelectedOptions={false}
                                  isClearable={true}
                                  className="3xl:text-[16px] 2xl:text-[16px] xl:text-[16px] lg:text-[12px] 3xl:w-full 2xl:w-full xl:w-full lg:w-[160px] 3xl:h-full 2xl:h-full  2xl:text-base xl:text-xs text-[10px] rounded-md bg-white z-20 " 
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
                          <div className='z-20 col-span-2'>
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
                              data_ex?.length > 0 &&(
                                  <ExcelFile filename="Danh phiếu chi" title="DSPC" element={
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
                <div className="min:h-[200px] h-[88%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <div className="pr-2 w-[100%] lx:w-[110%] ">
                    <div className="grid grid-cols-13 items-center sticky top-0 bg-white p-2 z-10 shadow-lg">
                                  <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center whitespace-nowrap'>{dataLang?.payment_date || "payment_date"}</h4>
                                  <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center whitespace-nowrap'>{dataLang?.payment_code || "payment_code"}</h4>
                                  <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center whitespace-nowrap'>{dataLang?.payment_obType || "payment_obType"}</h4>
                                  <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center whitespace-nowrap'>{dataLang?.payment_ob || "payment_ob"}</h4>
                                  <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center whitespace-nowrap'>{dataLang?.payment_typeOfDocument || "payment_typeOfDocument"}</h4>
                                  <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center whitespace-nowrap'>{dataLang?.payment_voucherCode || "payment_voucherCode"}</h4>
                                  <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center whitespace-nowrap'>{"PTTT"}</h4>
                                  <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center whitespace-nowrap'>{dataLang?.payment_costs || "payment_costs"}</h4>
                                  <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center whitespace-nowrap'>{dataLang?.payment_amountOfMoney || "payment_amountOfMoney"}</h4>
                                  <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center whitespace-nowrap'>{dataLang?.payment_creator || "payment_creator"}</h4>
                                  <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center whitespace-nowrap'>{dataLang?.payment_branch || "payment_branch"}</h4>
                                  <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center whitespace-nowrap'>{dataLang?.payment_note || "payment_note"}</h4>
                                  <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center whitespace-nowrap'>{dataLang?.payment_action || "payment_action"}</h4>
                      </div>
                    {onFetching ?
                      <Loading className="h-80"color="#0f4f9e" /> 
                      : 
                      data?.length > 0 ? 
                      (
                      <>
                          <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">                       
                          {(data?.map((e) => 
                            <div className="grid grid-cols-13 items-center py-1.5 px-2 hover:bg-slate-100/40 " key={e.id.toString()}>
                              <h6 className="2xl:text-base xl:text-xs text-[8px]  px-2 py-0.5 col-span-1  rounded-md text-center">{e?.date != null ? moment(e?.date).format("DD/MM/YYYY") : ""}</h6>
                              <h6 className="2xl:text-base xl:text-xs text-[8px]  px-2 py-0.5 col-span-1  rounded-md text-center text-[#0F4F9E]"><Popup_chitiet dataLang={dataLang} className="text-center" name={e?.code} id={e?.id}/></h6>
                              <h6 className='3xl:items-center 3xl-text-[18px] 2xl:text-[16px] xl:text-xs text-[8px]  col-span-1 flex items-center w-fit mx-auto'>
                                  <div className='mx-auto'>
                                    {
                                      e?.objects === "client_group_client" && <span className='flex items-center justify-center font-normal text-sky-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-sky-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]'>{dataLang[e?.objects] || e?.objects}</span>||
                                      e?.objects === "supplier" && <span className=' flex items-center justify-center font-normal text-orange-500 rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-orange-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]'>{dataLang[e?.objects] || e?.objects}</span>||
                                      e?.objects === "other" && <span className='flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-lime-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]'>{dataLang[e?.objects] || e?.objects}</span>
                                    }
                                  </div>
                              </h6>
                              <h6 className="2xl:text-base xl:text-xs text-[8px]  px-2 py-0.5 col-span-1  rounded-md text-left">{e?.object_text}</h6>
                              <h6 className='3xl:items-center 3xl-text-[18px] 2xl:text-[16px] xl:text-xs text-[8px]  col-span-1 flex items-center w-fit mx-auto'>
                                    <div className='mx-auto'>
                                      {
                                        e?.type_vouchers === "import" && <span className='flex items-center justify-center font-normal text-purple-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-purple-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]'>{dataLang[e?.type_vouchers] || e?.type_vouchers}</span>||
                                        e?.type_vouchers === "deposit" && <span className=' flex items-center justify-center font-normal text-cyan-500 rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-cyan-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]'>{dataLang[e?.type_vouchers] || e?.type_vouchers}</span>||
                                        e?.type_vouchers === "service" && <span className='flex items-center justify-center gap-1 font-normal text-red-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-rose-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]'>{dataLang[e?.type_vouchers] || e?.type_vouchers}</span>
                                      }
                                    </div>
                              </h6>
                              <h6 className="2xl:text-base xl:text-xs text-[8px]  px-2 py-0.5 col-span-1  rounded-md text-center text-[#0F4F9E]">
                                {e?.voucher?.map((code, index) => (
                                   <React.Fragment key={code.id}>
                                      <Popup_chitietThere key={code?.id} dataLang={dataLang} className="text-left" type={code.voucher_type} id={code.id} name={code?.code} >
                                        {code?.code}
                                      </Popup_chitietThere>
                                        {/* {index !== e.voucher.length - 1 && ', '} */}
                                   </React.Fragment>
                                      
                                ))}
                              </h6>
                              <h6 className="2xl:text-base xl:text-xs text-[8px]  px-2 py-0.5 col-span-1  rounded-md text-center">{e?.payment_mode_name}</h6>
                              <h6 className="2xl:text-base xl:text-xs text-[8px]  px-2 py-0.5 col-span-1  rounded-md text-left">
                                {e?.cost_name?.map((code, index) => (
                                    <React.Fragment key={code}>
                                      {code}
                                      {index !== e.cost_name.length - 1 && ', '}
                                    </React.Fragment>
                                  ))}
                              </h6>
                              <h6 className="2xl:text-base xl:text-xs text-[8px]  px-2 py-0.5 col-span-1  rounded-md text-right">{formatNumber(e?.total)}</h6>
                              <h6 className="2xl:text-base xl:text-xs text-[8px]  px-2 py-0.5 col-span-1  rounded-md text-left flex items-center space-x-1">
                                  <div className='relative'>
                                    <ModalImage small={e?.profile_image ? e?.profile_image : '/user-placeholder.jpg'} large={e?.profile_image ? e?.profile_image : '/user-placeholder.jpg'} className='h-6 w-6 rounded-full object-cover ' /> 
                                     {/* <img className='h-6 w-6 rounded-full object-cover' src={e?.profile_image ? e?.profile_image : '/user-placeholder.jpg'} alt=''></img> */}
                                      <span className="h-2 w-2 absolute 3xl:bottom-full 3xl:translate-y-[150%] 3xl:left-1/2  3xl:translate-x-[100%] 2xl:bottom-[80%] 2xl:translate-y-full 2xl:left-1/2 bottom-[50%] left-1/2 translate-x-full translate-y-full">
                                            <span className="inline-flex relative rounded-full h-2 w-2 bg-lime-500">
                                            <span className="animate-ping  inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 absolute"></span></span>
                                      </span>
                                  </div>
                                  <h6 className="capitalize">{e?.staff_name}</h6>
                              </h6>
                              {/* <h6 className="2xl:text-base xl:text-xs text-[8px]  px-2 py-0.5 col-span-1  rounded-md text-left"><span className="mr-2 mb-1 w-fit 2xl:text-base xl:text-xs text-[8px] px-2 text-[#0F4F9E] font-[300] py-0.5 border border-[#0F4F9E] rounded-[5.5px]">{e?.branch_name}</span></h6> */}
                              <h6 className='col-span-1 w-fit '>
                                  <div className='cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase'>
                                      {e?.branch_name}
                                  </div>
                              </h6>
                              <h6 className="2xl:text-base xl:text-xs text-[8px]  px-2 py-0.5 col-span-1  rounded-md text-left truncate">{e?.note}</h6>
                              <div className='col-span-1 flex justify-center'>
                                    <BtnTacVu type="payment" onRefresh={_ServerFetching.bind(this)} dataLang={dataLang}  id={e?.id}  className="bg-slate-100 xl:px-4 px-3 xl:py-1.5 py-1 rounded 2xl:text-base xl:text-xs text-[8px]" />
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
                            <h1 className="textx-[#141522] text-base opacity-90 font-medium">Không tìm thấy các mục</h1>
                            <div className="flex items-center justify-around mt-6 ">
                            </div>
                          </div>
                        </div>
                      )}    
                  </div>
                </div>
              </div>     
            </div>
            <div className='grid grid-cols-13 bg-gray-100 items-center'>
                    <div className='col-span-8 p-2 text-center'>
                        <h3 className='uppercase font-normal 2xl:text-base xl:text-xs text-[8px]'>{dataLang?.purchase_order_table_total_outside || "purchase_order_table_total_outside"}</h3>
                    </div>  
                    <div className='col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap'>
                        <h3 className='font-normal 2xl:text-base xl:text-xs text-[8px]'>{formatNumber(total?.sum_total)}</h3>
                    </div>  
            </div>
            {data?.length != 0 &&
              <div className='flex space-x-5 items-center'>
                <h6>{dataLang?.display} {totalItem?.iTotalDisplayRecords} {dataLang?.among} {totalItem?.iTotalRecords} {dataLang?.ingredient}</h6>
                <Pagination 
                  postsPerPage={limit}
                  totalPosts={Number(totalItem?.iTotalDisplayRecords)}
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

  const BtnTacVu = React.memo((props) => {

    const [openTacvu, sOpenTacvu] = useState(false);
    const _ToggleModal = (e) => sOpenTacvu(e);

    const [dataCompany, setDataCompany] = useState();
    const [data, setData] = useState();

     const fetchDataSettingsCompany = async () => {
        if (props?.id) {
          Axios("GET", `/api_web/Api_setting/CompanyInfo?csrf_protection=true`, {}, (err, response) => {
            if(!err){
                    var {data} =  response.data
                    setDataCompany(data)
              }
          })
        }
        if(props?.id){
          Axios("GET", `/api_web/Api_expense_voucher/expenseVoucher/${props?.id}?csrf_protection=true`, {}, (err, response) => {
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
          Axios("DELETE", `/api_web/Api_expense_voucher/expenseVoucher/${id}?csrf_protection=true`, {
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
                          <div className='group transition-all ease-in-out flex items-center  gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 '>
                            <BiEdit size={20} className='group-hover:text-sky-500 group-hover:scale-110 group-hover:shadow-md '/>
                            <Popup_dspc onRefresh={props.onRefresh} dataLang={props.dataLang} id={props?.id} 
                            className=" 2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer  rounded ">{props.dataLang?.purchase_order_table_edit || "purchase_order_table_edit"}</Popup_dspc>
                          </div>
                          <div className=' transition-all ease-in-out flex items-center gap-2 group  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5  rounded py-2.5 w-full'>
                            <VscFilePdf size={20} className='group-hover:text-[#65a30d] group-hover:scale-110 group-hover:shadow-md ' />
                            <Popup_Pdf type={props.type} props={props} id={props.id} dataLang={props.dataLang} className='group-hover:text-[#65a30d] '/>
                          </div>
                            <button onClick={_HandleDelete.bind(this, props.id)} className='group transition-all ease-in-out flex items-center gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full'>
                              <RiDeleteBin6Line size={20} className='group-hover:text-[#f87171] group-hover:scale-110 group-hover:shadow-md '/>
                              <p className='group-hover:text-[#f87171]'>{props.dataLang?.purchase_deleteVoites || "purchase_deleteVoites"}</p>
                          </button>
                    </div>
                </div>
            </Popup>
        </div>
    )
  })

  const Popup_Pdf =(props)=>{
    const scrollAreaRef = useRef(null);
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const [data,sData] =useState()
    const [onFetching, sOnFetching] = useState(false);
  
    useEffect(() => {
      props?.id && sOnFetching(true) 
    }, [open]);
  
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
        await  Axios("GET", `/api_web/Api_expense_voucher/expenseVoucher/${props?.id}?csrf_protection=true`, {}, (err, response) => {
            if(!err){
              var db =  response.data
              setData(db)
            }
          })
      }
  }
    useEffect(() => {
      open && fetchDataSettingsCompany()
    }, [open])
  
  
  return (
  <>
   <PopupEdit   
      title={props.dataLang?.option_prin || "option_prin"} 
      button={props.dataLang?.btn_table_print  || "btn_table_print"} 
      onClickOpen={_ToggleModal.bind(this, true)} 
      open={open} onClose={_ToggleModal.bind(this,false)}
      classNameBtn={props?.className} 
    >
    <div className='flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]'>
       
    </div>  
            <div className="space-x-5 w-[400px] h-auto">        
            <div>
             <div className='w-[400px]'>
              <FilePDF 
                props={props}
                openAction={open}
                setOpenAction={sOpen}
                dataCompany={dataCompany}
                data={dataPDF}
                />
            </div>
      
       </div>
    
      </div>    
    </PopupEdit>
  </>
  )
  }

const Popup_dspc = (props) => {

      let id = props?.id

      const dataLang = props.dataLang
      const scrollAreaRef = useRef(null);
      const handleMenuOpen = () => {
      const menuPortalTarget = scrollAreaRef.current;
          return { menuPortalTarget };
      };
      const [open, sOpen] = useState(false);
      const _ToggleModal = (e) => sOpen(e);

      const [onSending, sOnSending] = useState(false);
      const [onFetching, sOnFetching] = useState(false);
      const [onFetching_LisObject, sOnFetching_LisObject] = useState(false);
      const [onFetching_TypeOfDocument, sOnFetching_TypeOfDocument] = useState(false);
      const [onFetching_ListTypeOfDocument, sOnFetching_ListTypeOfDocument] = useState(false);
      const [onFetching_ListCost, sOnFetching_ListCost] = useState(false)

      const [onFetchingDetail, sOnFetchingDetail] = useState(false);

      const [dataBranch, sDataBranch] = useState([])
      const [dataObject, sDataObject] = useState([])
      const [dataList_Object, sData_ListObject] = useState([])
      const [dataMethod, sDataMethod] = useState([])
      const [dataTypeofDoc, sDataTypeofDoc] = useState([])
      const [dataListTypeofDoc, sDataListTypeofDoc] = useState([])
      const [dataListCost, sDataListCost] = useState([])
      
      const [date , sDate] = useState(new Date());
      const [code ,sCode] = useState(null)
      const [branch, sBranch] = useState(null)
      const [object, sObject] = useState(null)
      const [listObject, sListObject] = useState(null)
      const [typeOfDocument, sTypeOfDocument] = useState(null)
      const [listTypeOfDocument, sListTypeOfDocument] = useState([])
      const [price, sPrice] = useState('')
      const [method, sMethod] = useState(null)
      const [note, sNote] = useState("")

      const [option, sOption] = useState([
        {
         id: Date.now(),
         chiphi: "",
         sotien: null,
        }
        ]);
      const slicedArr = option.slice(1);
      const sortedArr = slicedArr.sort((a, b) => b.id - a.id);
      sortedArr.unshift(option[0]);
      
      const [errBranch, sErrBranch] = useState(false)
      const [errObject, sErrObject] = useState(false)
      const [errListObject, sErrListObject] = useState(false)
      const [errPrice, sErrPrice] = useState(false)
      const [errMethod, sErrMethod] = useState(false)
      const [errListTypeDoc, sErrListTypeDoc] = useState(false)

      const [errService, sErrService] = useState(false)
      const [errCosts, sErrCosts] = useState(false)
      const [errSotien, sErrSotien] =useState(false)
      const [errSmall, sErrSmall] =useState(false)

      useEffect(() =>{
        open && sDate(new Date());
        open && sCode(null)
        open && sBranch(null)
        open && sObject(null)
        open && sListObject(null)
        open && sTypeOfDocument(null)
        open && sListTypeOfDocument([])
        open && sPrice('')
        open && sMethod(null)
        open && sNote('')
        open && sNote('')
        open && sErrSmall(false)
        open && sErrBranch(false)
        open && sErrObject(false)
        open && sErrListObject(false)
        open && sErrListTypeDoc(false)
        open && sErrPrice(false)
        open && sErrMethod(false)
        open && sErrService(false)
        open && sErrCosts(false)
        open && sErrSotien(false)
        open &&  sOption([{ id: Date.now(),chiphi: "",sotien: null}]);

        open && sOnFetching(true)
        open && sOnFetching_LisObject(false)
        open && sData_ListObject([])
        open && sDataListCost([])
        props?.id && sOnFetchingDetail(true)
      },[open])


      const _ServerFetching_detail = async  () =>{
      await  Axios("GET", `/api_web/Api_expense_voucher/expenseVoucher/${props?.id}?csrf_protection=true`, {}, (err, response) => {
        if(!err){
            var db =  response.data
            sDate(moment(db?.date).toDate())
            sCode(db?.code)
            sBranch({label: db?.branch_name, value: db?.branch_id})
            sMethod({label: db?.payment_mode_name, value: db?.payment_mode_id})
            sObject({label: dataLang[db?.objects] || db?.objects, value: db?.objects})
            sPrice(Number(db?.total))
            sNote(db?.note)
            sListObject(db?.objects === "other" ? {label: db?.object_text, value: db?.object_text} : {label: dataLang[db?.object_text] || db?.object_text, value: db?.objects_id})
            sTypeOfDocument(db?.type_vouchers ? {label: dataLang[db?.type_vouchers], value: db?.type_vouchers} : null)
            sListTypeOfDocument(db?.type_vouchers ? db?.voucher?.map(e => ({label: e?.code  , value: e?.id, money: e?.money})) :[])
            sOption(db?.detail?.map(e => ({id: e?.id, chiphi: {label: e?.costs_name, value: e?.id_costs}, sotien: Number(e?.total)})))
        }
        sOnFetchingDetail(false)
      })
    }

      useEffect(() => {
        onFetchingDetail && props?.id && _ServerFetching_detail()
      }, [open]);


    // Chi nhánh, PTTT, Đối tượng
  const _ServerFetching =  () => {
    Axios("GET", "/api_web/Api_Branch/branchCombobox/?csrf_protection=true",{}, (err, response) => {
        if(!err){
            var {isSuccess, result} =  response.data
            sDataBranch(result?.map(e =>({label: e.name, value:e.id})))       
        }
    })
    Axios("GET", "/api_web/Api_expense_voucher/object/?csrf_protection=true",{}, (err, response) => {
        if(!err){
            var data =  response.data
            sDataObject(data?.map(e => ({label: dataLang[e?.name], value: e?.id})))
        }
    })
    Axios("GET", "/api_web/Api_payment_method/payment_method/?csrf_protection=true",{}, (err, response) => {
        if(!err){
            var {rResult} =  response.data
            sDataMethod(rResult?.map(e => ({label: e?.name, value: e?.id})))
        }
    })
    sOnFetching(false)  
  }

  useEffect(() =>{
    onFetching && _ServerFetching()
  },[onFetching])

  useEffect(() =>{
    open && sOnFetching(true)
  },[open])

  //Danh sách đối tượng
  //Api Danh sách đối tượng: truyền Đối tượng vào biến type, truyền Chi nhánh vào biến filter[branch_id]

  const _ServerFetching_LisObject =  async () => {
    await Axios("GET", "/api_web/Api_expense_voucher/objectList/?csrf_protection=true",{
      params:{
        type: object?.value,
        "filter[branch_id]": branch?.value
      }
    }, (err, response) => {
        if(!err){
            var {isSuccess, rResult} =  response.data
            sData_ListObject(rResult?.map(e =>({label: e.name, value:e.id})))       
        }
    })
    sOnFetching_LisObject(false)  
  }

  useEffect(() =>{
    onFetching_LisObject && _ServerFetching_LisObject()
  },[onFetching_LisObject])

  useEffect(() =>{
    branch != null && object != null && sOnFetching_LisObject(true)
  },[object,branch])

// Loại chứng từ
//Api Loại chứng từ: truyền Đối tượng vào biến type

  const _ServerFetching_TypeOfDocument =  () => {
    Axios("GET", "/api_web/Api_expense_voucher/voucher_type/?csrf_protection=true",{
      params:{
        type: object?.value,
      }
    }, (err, response) => {
        if(!err){
            var db =  response.data
            // sDataTypeofDoc(db?.map(e => ({label: dataLang[e?.name], value: dataLang[e?.id]})))  
            sDataTypeofDoc(db?.map(e => ({label: dataLang[e?.name], value: e?.id})))  
        }
    })
    sOnFetching_TypeOfDocument(false)  
  }

  useEffect(() =>{
    onFetching_TypeOfDocument && _ServerFetching_TypeOfDocument()
  },[onFetching_TypeOfDocument])

  useEffect(() =>{
    object != null && sOnFetching_TypeOfDocument(true)
  },[object])

  //Danh sách chứng từ
  //Api Danh sách chứng từ: truyền Đối tượng vào biến type, truyền Loại chứng từ vào biến voucher_type, truyền Danh sách đối tượng vào object_id

  const _ServerFetching_ListTypeOfDocument = () => {
   Axios("GET", "/api_web/Api_expense_voucher/voucher_list/?csrf_protection=true",{
      params:{
        type: object?.value,
        voucher_type: typeOfDocument?.value,
        object_id: listObject?.value,
        "filter[branch_id]": branch?.value,
        expense_voucher_id: id ? id : ""
      }
    }, (err, response) => {
        if(!err){
            var db =  response.data
            sDataListTypeofDoc(db?.map(e => ({label: e?.code, value: e?.id, money: e?.money})))  
        }
    })
    sOnFetching_ListTypeOfDocument(false)  
  }

  useEffect(() =>{
    onFetching_ListTypeOfDocument && _ServerFetching_ListTypeOfDocument()
  },[onFetching_ListTypeOfDocument])

  useEffect(() =>{
    // (branch != null && object != null && listObject != null && typeOfDocument != null) && sOnFetching_ListTypeOfDocument(true)
      typeOfDocument != null && sOnFetching_ListTypeOfDocument(true)
  },[typeOfDocument])

  const _HandleSeachApi = (inputValue) => {
      Axios("POST", `/api_web/Api_expense_voucher/voucher_list/?csrf_protection=true`,{
        data: {
          term: inputValue,
        },
        params:{
          type: object?.value ? object?.value : null,
          voucher_type: typeOfDocument?.value ? typeOfDocument?.value : null,
          object_id: listObject?.value ? listObject?.value : null,
          "filter[branch_id]": branch?.value ? branch?.value : null,
          expense_voucher_id: id ? id : ""
        }
      }, (err, response) => {
            if(!err){
              var db =  response.data
              sDataListTypeofDoc(db?.map(e => ({label: e?.code, value: e?.id, money: e?.money})))  
          }
      })
  }

   //Loại chi phí
   const _ServerFetching_ListCost=  () => {
    Axios("GET", "/api_web/Api_cost/costCombobox/?csrf_protection=true", {
      params:{
        "filter[branch_id]": branch?.value
      }
    }, (err, response) => {
        if(!err){
            var {rResult} =  response.data
            sDataListCost(rResult.map(x => ({label: `${x.name }`, value: x.id, level: x.level, code: x.code, parent_id: x.parent_id})))
        }
    })
    sOnFetching_ListCost(false)  
  }

  useEffect(() =>{
    onFetching_ListCost && _ServerFetching_ListCost()
  },[onFetching_ListCost])

  useEffect(() =>{
    branch != null  && sOnFetching_ListCost(true)
  },[branch])

 
      const _HandleChangeInput = (type, value) =>{
        if(type == "date"){
            sDate(value)
        }else if(type == "code"){
            sCode(value?.target?.value)
        }else if (type === 'clear') {
        sDate(new Date())
        }else if(type == "branch" && branch != value){
            sBranch(value)
            sData_ListObject([])
            sListObject(null)
            sDataListCost([])
            sPrice('')
            sListTypeOfDocument([])
            sDataListTypeofDoc([])
            sTypeOfDocument(null)
            const updatedOptions = option.map((item) => {
              return {
                ...item,
                chiphi: "",
                sotien: ''
              };
            });
            sOption(updatedOptions);
        }else if(type == "object" && object != value){
            sObject(value)
            sListObject(null)
            sData_ListObject([])
            sDataTypeofDoc([])
            sTypeOfDocument(null)
            sListTypeOfDocument([])
            sDataListTypeofDoc([])
            sPrice('')
            sOption(prevOption =>{
              const newOption = prevOption.map((item, index) => {
                return { ...item, sotien: '' };
              });
              return newOption;
            })
        }else if(type == "listObject"){
            sListObject(value)
        }else if(type == "typeOfDocument" && typeOfDocument != value){
            sTypeOfDocument(value)
            sDataListTypeofDoc([])
            sListTypeOfDocument([])
            sPrice('')
            sOption((prevOption) => {
              const newOption = prevOption.map((item, index) => {
                return { ...item, sotien: '' };
              });
              return newOption;
            });
        }else if(type == "listTypeOfDocument"){
            sListTypeOfDocument(value)
            if (value && value.length > 0) {
              const totalMoney = value.reduce((total, item) => total + parseFloat(item.money || 0), 0);
              const formattedTotal = parseFloat(totalMoney);
                sPrice(formattedTotal);
                sOption((prevOption) => {
                  const newOption = prevOption.map((item, index) => {
                    if (index === 0) {
                      return { ...item, sotien: formattedTotal };
                    } else {
                      return { ...item, sotien: null };
                    }
                  });
                  return newOption;
                });
            }else if (value && value.length == 0) {
                sPrice('');
                sOption((prevOption) => {
                  const newOption = prevOption.map((item, index) => {
                    return { ...item, sotien: '' };
                  });
                  return newOption;
                });
              }
        }else if (type === "price") {
          let totalMoney = listTypeOfDocument.reduce((total, item) => total + parseFloat(item.money), 0);
          const priceChange = parseFloat(value?.target.value.replace(/,/g, ""));
          let isExceedTotal = false; // Biến flag để kiểm tra trạng thái vượt quá giá trị
          if (!isNaN(priceChange)) {
                if(listTypeOfDocument?.length > 0){
                  if (priceChange > totalMoney) {
                    // Giá nhập vượt quá tổng số tiền, trả về tổng ban đầu
                      Toast.fire({
                        icon: 'error',
                        title: `${dataLang?.payment_err_aler || "payment_err_aler"}`,
                      });
                      sPrice(totalMoney);
                      isExceedTotal = true; // Đánh dấu trạng thái vượt quá giá trị
                    }
                  else {
                }
                sPrice(priceChange);
              }else {
                sPrice(priceChange)
              }
          }
          sOption((prevOption) => {
            if (isExceedTotal) {
              return prevOption.map((item, index) => {
                if (index === 0) {
                  return { ...item, sotien: totalMoney };
                } else {
                  return { ...item, sotien: null };
                }
              });
            } else {
              return prevOption.map((item, index) => {
                if (index === 0) {
                  return { ...item, sotien: priceChange };
                } else {
                  return { ...item, sotien: null };
                }
              });
            }
          });
        
          if (isExceedTotal) {
            // Trở về giá trị ban đầu nếu cố tình nhập tiếp
            sPrice(totalMoney);
          }
        }
        else if(type == "method"){
            sMethod(value)
        }else if(type == "note"){
            sNote(value?.target.value)
        }
      }
      // useEffect(() => {
      //   if (price == null) return;
      //   sOption(prevOption => {
      //     const newOption = [...prevOption];
      //     newOption.forEach((item, index) => {
      //       if(index == 0){
      //         item.sotien = price;
      //       }else{
      //         item.sotien = null;
      //       }
      //     });
      //     return newOption;
      //   });
      // }, [price]);


      const _HandleSubmit = (e) =>{
        e.preventDefault();
        const hasNullLabel = option.some(item => item.chiphi === '');
        const hasNullSotien = option.some(item => item.sotien === '' || item.sotien === null);
        const totalSotienErr = option.reduce((total, item) => total + item.sotien, 0);
        if(branch == null || object == null || listObject == null || price == "" || method == null || hasNullLabel || hasNullSotien || (totalSotienErr < price) || (typeOfDocument != null && listTypeOfDocument?.length == 0)){
            branch == null && sErrBranch(true) 
            object == null && sErrObject(true) 
            listObject == null && sErrListObject(true) 
            price == '' && sErrPrice(true) 
            method == null && sErrMethod(true)
            hasNullLabel && sErrCosts(true) 
            hasNullSotien && sErrSotien(true) 
            typeOfDocument != null && listTypeOfDocument?.length == 0 && sErrListTypeDoc(true)
            Toast.fire({
              icon: 'error',
              title: `${totalSotienErr < price ? props?.dataLang.payment_err_alerTotalThan || "payment_err_alerTotalThan" : props.dataLang?.required_field_null || "required_field_null"}`
          })
          }else{
            sOnSending(true)
          }
      }
      
      useEffect(() => {
        sErrBranch(false)
      }, [branch != null]);
    
      useEffect(() => {
        sErrObject(false)
      }, [object != null]);
      
      useEffect(() => {
         sErrListTypeDoc(false)
      }, [typeOfDocument == null && listTypeOfDocument?.length > 0]);

      useEffect(() => {
        sErrListObject(false)
      }, [listObject != null]);

      useEffect(() => {
        sErrPrice(false)
      }, [price != ""]);

      useEffect(() => {
        sErrMethod(false)
      }, [method != null]);
      useEffect(() => {
        onSending && _ServerSending()
      }, [onSending]);

      const _HandleChangeInputOption = (id, type, value) => {
        var index = option.findIndex(x => x.id === id);
        if (type === "chiphi") {
          const hasSelectedOption = option.some((o) => o.chiphi === value);
          if (hasSelectedOption) {
            Toast.fire({
              title: `${props?.dataLang?.payment_err_alerselected || "payment_err_alerselected"}`,
              icon: 'error',
              confirmButtonColor: '#296dc1',
              cancelButtonColor: '#d33',
              confirmButtonText: dataLang?.aler_yes,
            });
            return; // Dừng xử lý tiếp theo nếu đã hiển thị thông báo lỗi
          } else {
            option[index].chiphi = value;
          }
        }
        else if (type === "sotien") {
          option[index].sotien = parseFloat(value?.value);
          const totalSotien = option.reduce((sum, opt) => sum + parseFloat(opt.sotien || 0), 0);
            if (totalSotien > parseFloat(price)) {
              option.forEach((opt, optIndex) => {
                const currentValue = option[optIndex].sotien; // Lưu giá trị hiện tại
                option[optIndex].sotien = '';
                if (optIndex === index) {
                  option[optIndex].sotien = currentValue; // Gán lại giá trị hiện tại
                }
              });
              Toast.fire({
                title: `${props?.dataLang?.payment_err_alerExeeds || "payment_err_alerExeeds"}`,
                icon: 'error',
                confirmButtonColor: '#296dc1',
                cancelButtonColor: '#d33',
                confirmButtonText: dataLang?.aler_yes,
                timer: 3000
              });
            }
            else {
              option[index].sotien = parseFloat(value?.value);
            }
        }
        sOption([...option])
      }

      const _HandleAddNew =  () => {
        sOption([...option, {id: uuidv4(), chiphi: '', sotien: null}])
      }

      const _HandleDelete =  (id) => {
        if (id === option[0].id) {
          return Toast.fire({
            title: `${props.dataLang?.payment_err_alerNotDelete || "payment_err_alerNotDelete"}`,
            icon: 'error',
            confirmButtonColor: '#296dc1',
            cancelButtonColor: '#d33',
            confirmButtonText: `${dataLang?.aler_yes}`,
          })
        }
          const newOption = option.filter(x => x.id !== id); // loại bỏ phần tử cần xóa
          sOption(newOption); // cập nhật lại mảng
      }

        const allItems = [...dataListTypeofDoc]

        // const handleSelectAll = () => {
        //   sListTypeOfDocument(allItems);
        //   Promise.resolve().then(() => {
        //     const totalMoney = allItems.reduce((total, item) => {
        //       if (!isNaN(parseFloat(item.money))) {
        //         return total + parseFloat(item.money);
        //       } else {
        //         return total;
        //       }
        //     }, 0);
        //     return totalMoney
        //   }).then((formattedTotal) => {
        //     sPrice(formattedTotal);
        //   });
        // };


        const handleSelectAll = () => {
          sListTypeOfDocument(allItems);
          Promise.resolve().then(() => {
            const totalMoney = allItems.reduce((total, item) => {
              if (!isNaN(parseFloat(item.money))) {
                return total + parseFloat(item.money);
              } else {
                return total;
              }
            }, 0);
            return totalMoney;
          }).then((formattedTotal) => {
            sPrice(formattedTotal);
            sOption((prevOption) => {
              const newOption = prevOption.map((item, index) => {
                if (index === 0) {
                  return { ...item, sotien: formattedTotal };
                } else {
                  return { ...item, sotien: null };
                }
              });
              return newOption;
            });
          });
        };
        // const handleDeselectAll = () => {
        //   sListTypeOfDocument([]);
        //   sPrice('');
        //   Promise.resolve().then(() => {
        //     sPrice('');
        //   });
        // };
        const handleDeselectAll = () => {
          sListTypeOfDocument([]);
          sPrice('');
          sOption((prevOption) => {
            const newOption = prevOption.map((item) => {
              return { ...item, sotien: null };
            });
            return newOption;
          });
        };


        
        const MenuList = (props) => {
          return (
            <components.MenuList {...props}>
              {dataListTypeofDoc?.length > 0 &&
              <div className='grid grid-cols-2 items-center  cursor-pointer'>
                <div className='hover:bg-slate-200 p-2 col-span-1 text-center text-xs ' onClick={handleSelectAll}>{dataLang?.payment_selectAll || "payment_selectAll"}</div>
                <div className='hover:bg-slate-200 p-2 col-span-1 text-center text-xs ' onClick={handleDeselectAll}>{dataLang?.payment_DeselectAll || "payment_DeselectAll"}</div>
              </div>
              }
              {props.children}
            </components.MenuList>
          );
        };
    
        const _ServerSending = () => {
          var formData = new FormData();
          formData.append("code", code == null ? "" : code)
          formData.append("date", (moment(date).format("YYYY-MM-DD HH:mm:ss")))
          formData.append("branch_id", branch.value)
          formData.append("objects", object.value)
          formData.append("type_vouchers", typeOfDocument ? typeOfDocument.value : "")
          formData.append("total", price)
          formData.append("payment_modes", method.value)
          if(object?.value == "other"){
           formData.append("objects_text", listObject.value)
          }else{
          formData.append("objects_id", listObject.value)
          }
          listTypeOfDocument?.forEach((e, index) =>{
            formData.append(`voucher_id[${index}]`, e?.value);
          })
          formData.append("note", note)
          sortedArr.forEach((item, index) => {
            formData.append(`cost[${index}][id_costs]`, item?.chiphi ? item?.chiphi?.value : "");
            formData.append(`cost[${index}][total]`, item?.sotien ? item?.sotien : "");
          });  
          Axios("POST", `${id ? `/api_web/Api_expense_voucher/expenseVoucher/${id}?csrf_protection=true` : "/api_web/Api_expense_voucher/expenseVoucher/?csrf_protection=true"}`, {
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
                      sBranch(null)
                      sMethod(null)
                      sObject(null)
                      sListObject(null)
                      sTypeOfDocument(null)
                      sListTypeOfDocument([])
                      sPrice('')
                      sNote("")
                      sErrBranch(false)
                      sErrMethod(false)
                      sErrObject(false)
                      sErrListObject(false)
                      sErrPrice(false)
                      sOption([{id: Date.now(), chiphi: "", sotien: null,}])
                      props.onRefresh && props.onRefresh()
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


  return(
      <>
      <PopupEdit   
        title={props.id ? `${props.dataLang?.payment_edit || "payment_edit"}` : `${props.dataLang?.payment_add || "payment_add"}`} 
        button={props.id ? props.dataLang?.payment_editVotes || "payment_editVotes" : `${props.dataLang?.branch_popup_create_new}`} 
        onClickOpen={_ToggleModal.bind(this, true)} 
        open={open} onClose={_ToggleModal.bind(this,false)}
        classNameBtn={props.className} 
      >
      <div className='flex items-center space-x-4 3xl:my-3 2xl:my-1 my-1 border-[#E7EAEE] border-opacity-70 border-b-[1px]'>
      </div>
      <h2 className='font-normal bg-[#ECF0F4] p-1 2xl:text-[12px] xl:text-[13px] text-[12px]  '>{props.dataLang?.payment_general_information || "payment_general_information"}</h2>  
              <div className="w-[40vw]">
                  <form onSubmit={_HandleSubmit.bind(this)} className="">
                      <div className=''> 
                        <div className="grid grid-cols-12 space-x-1 items-center"> 
                            <div className='col-span-6 relative'>
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
                                    className={`border  focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer `}
                                  />
                                  {date && (
                                    <>
                                      <MdClear className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer" onClick={() => _HandleChangeInput('clear')} />
                                    </>
                                  )}
                              <BsCalendarEvent className="absolute right-0 -translate-x-[75%] translate-y-[70%] text-[#CCCCCC] scale-110 cursor-pointer" />
                            </div>
                            </div>
                            <div className='col-span-6'>
                              <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] mb-1 ">{dataLang?.serviceVoucher_voucher_code || "serviceVoucher_voucher_code"}</label>
                                <input
                                    value={code}                
                                    onChange={_HandleChangeInput.bind(this, "code")}
                                    placeholder={props.dataLang?.payment_systemDefaul || "payment_systemDefaul"}                     
                                    type="text"
                                    className="focus:border-[#92BFF7] border-[#d0d5dd] 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2.5 border outline-none "
                                    />
                            </div>
                            <div className='col-span-6'>
                             <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">{props.dataLang?.payment_branch || "payment_branch"} <span className="text-red-500">*</span></label>
                              <Select   
                                  closeMenuOnSelect={true}
                                  placeholder={props.dataLang?.payment_branch || "payment_branch"}
                                  options={dataBranch}
                                  isSearchable={true}
                                  onChange={_HandleChangeInput.bind(this, "branch")}
                                  value={branch}
                                  LoadingIndicator
                                  noOptionsMessage={() => "Không có dữ liệu"}
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
                                className={`${errBranch ? "border-red-500" : "border-transparent" } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px]  font-normal outline-none border `} 
                              />
                                {errBranch && <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">{props.dataLang?.payment_errBranch || "payment_errBranch"}</label>}
                            </div>
                            <div className='col-span-6'>
                              <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">{props.dataLang?.payment_method || "payment_method"} <span className="text-red-500">*</span></label>
                              <Select   
                                  closeMenuOnSelect={true}
                                  placeholder={props.dataLang?.payment_method || "payment_method"}
                                  options={dataMethod}
                                  isSearchable={true}
                                  onChange={_HandleChangeInput.bind(this, "method")}
                                  value={method}
                                  LoadingIndicator
                                  noOptionsMessage={() => "Không có dữ liệu"}
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
                                className={`${errMethod ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px]  font-normal outline-none border `} 
                              />
                                {errMethod && <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">{props.dataLang?.payment_errMethod || "payment_errMethod"}</label>}
                            </div>
                            <div className='col-span-6'>
                              <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">{props.dataLang?.payment_ob || "payment_ob"} <span className="text-red-500">*</span></label>
                                <Select   
                                    closeMenuOnSelect={true}
                                    placeholder={props.dataLang?.payment_ob || "payment_ob"}
                                    options={dataObject}
                                    isSearchable={true}
                                    onChange={_HandleChangeInput.bind(this, "object")}
                                    value={object}
                                    LoadingIndicator
                                    noOptionsMessage={() => "Không có dữ liệu"}
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
                                  className={`${errObject ? "border-red-500" : "border-transparent" } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E]  font-normal outline-none border `} 
                                />
                                {errObject && <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">{props.dataLang?.payment_errOb || "payment_errOb"}</label>}
                            </div>
                            <div className='col-span-6'>
                              <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">{props.dataLang?.payment_listOb || "payment_listOb"} <span className="text-red-500">*</span></label>
                              {object?.value == "other" ?
                                <CreatableSelect  
                                  options={dataList_Object}
                                  placeholder={props.dataLang?.payment_listOb || "payment_listOb"}
                                  onChange={_HandleChangeInput.bind(this, "listObject")}
                                  isClearable={true}
                                  value={listObject}
                                  classNamePrefix="Select"
                                  className={`${errListObject ? "border-red-500" : "border-transparent" } Select__custom removeDivide  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `} 
                                  isSearchable={true}
                                  noOptionsMessage={() => `Chưa có gợi ý`}
                                  formatCreateLabel={(value) => `Tạo "${value}"`}
                                  menuPortalTarget={document.body}
                                  onMenuOpen={handleMenuOpen}
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
                                      menuPortal: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                          position: "absolute",
                                      }),
                                      control: (base,state) => ({
                                          ...base,
                                          boxShadow: 'none',
                                          ...(state.isFocused && {
                                              border: '0 0 0 1px #92BFF7',
                                          }),
                                      }),
                                      dropdownIndicator: base => ({
                                          ...base,
                                          display: 'none'
                                      })                                                                                
                                  }}
                                />
                                  :
                                  <Select   
                                  closeMenuOnSelect={true}
                                  placeholder={props.dataLang?.payment_listOb || "payment_listOb"}
                                  options={dataList_Object}
                                  isSearchable={true}
                                  onChange={_HandleChangeInput.bind(this, "listObject")}
                                  value={listObject}
                                  LoadingIndicator
                                  noOptionsMessage={() => "Không có dữ liệu"}
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
                                className={`${errListObject ? "border-red-500" : "border-transparent" } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `} 
                                />
                              }
                              {errListObject && <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">{props.dataLang?.payment_errListOb || "payment_errListOb"}</label>}
                            </div>
                            <div className='col-span-6  '>
                             <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">{props.dataLang?.payment_typeOfDocument || "payment_typeOfDocument"}</label>
                               <Select   
                                  closeMenuOnSelect={true}
                                  placeholder={props.dataLang?.payment_typeOfDocument || "payment_typeOfDocument"}
                                  options={dataTypeofDoc}
                                  isSearchable={true}
                                  onChange={_HandleChangeInput.bind(this, "typeOfDocument")}
                                  value={typeOfDocument}
                                  LoadingIndicator
                                  noOptionsMessage={() => "Không có dữ liệu"}
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
                                className={`border-transparent 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `} 
                              />
                            </div>
                            <div className='col-span-6  '>
                             <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">{props.dataLang?.payment_listOfDoc || "payment_listOfDoc"}</label>
                              <Select   
                                  closeMenuOnSelect={false}
                                  placeholder={props.dataLang?.payment_listOfDoc || "payment_listOfDoc"}
                                   onInputChange={_HandleSeachApi.bind(this)}
                                  options={dataListTypeofDoc}
                                  isSearchable={true}
                                  onChange={_HandleChangeInput.bind(this, "listTypeOfDocument")}
                                  value={listTypeOfDocument}
                                  components={{MenuList,MultiValue}}
                                  isMulti
                                  LoadingIndicator
                                  noOptionsMessage={() => "Không có dữ liệu"}
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
                                className={`${(errListTypeDoc && typeOfDocument != null && listTypeOfDocument?.length == 0) ? "border-red-500" : "border-transparent" } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E]  font-normal outline-none border `} 
                              />
                                {(errListTypeDoc && typeOfDocument != null && listTypeOfDocument?.length == 0) && <label className="2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">{props.dataLang?.payment_errlistOfDoc || "payment_errlistOfDoc"}</label>}
                            </div>
                            <div className='col-span-6'>
                               <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">{props.dataLang?.payment_amountOfMoney || "payment_amountOfMoney"} <span className="text-red-500">*</span></label>
                                <NumericFormat
                                    value={price}
                                    disabled={object === null || listObject === null}
                                    onChange={_HandleChangeInput.bind(this, "price")}
                                    allowNegative={false}
                                    placeholder={(object == null || listObject == null) && (props.dataLang?.payment_errObList || "payment_errObList") || object != null && props.dataLang?.payment_amountOfMoney || "payment_amountOfMoney"}
                                    decimalScale={0}
                                    isNumericString={true} 
                                    isAllowed={(values) => {
                                          if (!values.value) return true;
                                          const { floatValue } = values;
                                         if(object?.value && listTypeOfDocument?.length > 0){
                                          if(object?.value != "other"){
                                            let totalMoney = listTypeOfDocument.reduce((total, item) => total + parseFloat(item.money), 0);
                                            if (floatValue > totalMoney) {
                                              Toast.fire({
                                                icon: 'error',
                                                title: `${props.dataLang?.payment_errPlease || "payment_errPlease"} ${totalMoney.toLocaleString("en")}`
                                              })
                                            }
                                            return floatValue <= totalMoney;
                                            }else{
                                              return true
                                          }
                                        }else{
                                          return true
                                        }
                                      }
                                    }
                                    className={`${errPrice ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300" } 3xl:placeholder:text-[13px] 2xl:placeholder:text-[12px] xl:placeholder:text-[10px] placeholder:text-[9px] placeholder:text-slate-300  w-full disabled:bg-slate-100 bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px]  font-normal outline-none border p-[9.5px]`} 
                                    thousandSeparator=","
                                />
                                {errPrice && <label className="2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">{props.dataLang?.payment_errAmount || "payment_errAmount"}</label>}
                            </div>
                            <div className='col-span-6'>
                              <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] mb-1 ">{props.dataLang?.payment_note || "payment_note"}</label>
                                <input
                                    value={note}                
                                    onChange={_HandleChangeInput.bind(this, "note")}
                                    placeholder={props.dataLang?.payment_note || "payment_note"}                     
                                    type="text"
                                    className="focus:border-[#92BFF7] border-[#d0d5dd] 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2.5 border outline-none "
                                    />
                            </div>
                            <h2 className='font-normal bg-[#ECF0F4] p-1 2xl:text-[12px] xl:text-[13px] text-[12px]  w-full col-span-12 mt-0.5'>{props.dataLang?.payment_costInfo || "payment_costInfo"}</h2>  
                            <div className='col-span-12 max-h-[140px] min-h-[140px] overflow-hidden '>
                                <div className='grid grid-cols-12 items-center  sticky top-0  bg-[#F7F8F9] py-2 z-10 min-h-50px max-h-[50px]'>
                                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-6    text-center  truncate font-[400] flex items-center gap-1'>
                                    <button  type='button' onClick={_HandleAddNew.bind(this)} title='Thêm' className='transition hover:bg-red-100 hover:animate-pulse	 rounded-full bg-slate-200 flex flex-col justify-center items-center'><Add color='red' size={20} className=''/></button>         
                                    {props.dataLang?.payment_costs || "payment_costs"}
                                  </h4>
                                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-4    text-center  truncate font-[400]'>{props.dataLang?.payment_amountOfMoney || "payment_amountOfMoney"}</h4>
                                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-2   text-center  truncate font-[400]'>{props.dataLang?.payment_operation || "payment_operation"}</h4>
                              </div> 
                              <ScrollArea   ref={scrollAreaRef} className="min-h-[100px] max-h-[100px]  overflow-hidden"   speed={1}    smoothScrolling={true}>
                                {sortedArr.map((e,index) => 
                                    <div className='grid grid-cols-12 items-center gap-1 py-1 ' key={e?.id}>
                                      <div className='col-span-6  my-auto '>
                                            <Select   
                                                closeMenuOnSelect={true}
                                                placeholder={props.dataLang?.payment_expense || "payment_expense"}
                                                options={dataListCost}
                                                isSearchable={true}
                                                formatOptionLabel={CustomSelectOption}
                                                onChange={_HandleChangeInputOption.bind(this, e?.id, "chiphi")}
                                                value={e?.chiphi}
                                                menuPlacement='top'
                                                LoadingIndicator
                                                noOptionsMessage={() => "Không có dữ liệu"}
                                                maxMenuHeight="145px"
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
                                              className={`${errCosts && e?.chiphi === '' ? "border-red-500" : "border-transparent" } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] mb-2 font-normal outline-none border `} 
                                            />
                                      </div>
                                      <div className='col-span-4 text-center flex items-center justify-center'>
                                        <NumericFormat
                                              value={e?.sotien}
                                              disabled={price == ''}
                                              placeholder={price == '' && (props.dataLang?.payment_errAmountAbove || "payment_errAmountAbove")}
                                              onValueChange={_HandleChangeInputOption.bind(this, e?.id, "sotien")}
                                              allowNegative={false}
                                              decimalScale={0}
                                              isAllowed={(values) => {
                                                if (!values.value) return true;
                                                  const { floatValue } = values;
                                                  if(object?.value != "other"){
                                                    if (floatValue > price) {
                                                      Toast.fire({
                                                        icon: 'error',
                                                        title: `${props.dataLang?.payment_errPlease || "payment_errPlease"} ${price.toLocaleString("en")}`
                                                      })
                                                    }
                                                    return floatValue <= price;
                                                  }
                                                  else{
                                                    return true
                                                  }
                                              }
                                            }
                                              isNumericString={true}   
                                              className={`${errSotien && (e?.sotien === '' || e?.sotien === null) ? "border-b-red-500" : " border-gray-200"} placeholder:text-[10px] border-b-2 appearance-none 2xl:text-[12px] xl:text-[13px] text-[12px] text-center py-1 px-1 font-normal w-[90%] focus:outline-none `}
                                              thousandSeparator=","
                                          />
                                      </div>
                                      <div className='col-span-2 flex items-center justify-center'>
                                        <button
                                          onClick={_HandleDelete.bind(this, e?.id)}
                                          type='button' title='Xóa' className='transition  w-full bg-slate-100 h-10 rounded-[5.5px] text-red-500 flex flex-col justify-center items-center mb-2'><IconDelete /></button>
                                      </div>
                                  </div>
                                 )} 
                                </ScrollArea>
                            </div>
                        </div>
                    </div>
                  <div className="text-right mt-1 space-x-2">
                    <button type='button' onClick={_ToggleModal.bind(this,false)} className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]"
                    >{props.dataLang?.branch_popup_exit}</button>
                    <button 
                      type="submit"
                      className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]"
                    >{props.dataLang?.branch_popup_save}</button>
                  </div>
                  </form>

            </div>    
      </PopupEdit>
      </>
    )
}

const Popup_chitiet =(props)=>{
  const scrollAreaRef = useRef(null);
  const [open, sOpen] = useState(false);
  const _ToggleModal = (e) => sOpen(e);
  const [data,sData] =useState()
  const [onFetching, sOnFetching] = useState(false);

  useEffect(() => {
    props?.id && sOnFetching(true) 
  }, [open]);

  const formatNumber = (number) => {
    if (!number && number !== 0) return 0;
      const integerPart = Math.floor(number);
      const decimalPart = number - integerPart;
      const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
      const roundedNumber = integerPart + roundedDecimalPart;
      return roundedNumber.toLocaleString("en");
  };

  const _ServerFetching_detailThere = () =>{
    Axios("GET", `/api_web/Api_expense_voucher/expenseVoucher/${props?.id}?csrf_protection=true`, {}, (err, response) => {
    if(!err){
        var db =  response.data
        sData(db)
    }
    sOnFetching(false)
  })
  }

  useEffect(() => {
    onFetching && _ServerFetching_detailThere() 
  }, [open]);


return (
<>
 <PopupEdit   
    title={props.dataLang?.payment_detail  || "payment_detail"} 
    button={props?.name} 
    onClickOpen={_ToggleModal.bind(this, true)} 
    open={open} onClose={_ToggleModal.bind(this,false)}
    classNameBtn={props?.className} 
  >
  <div className='flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]'>
     
  </div>  
          {/* <div className=" space-x-5 w-[530px] 3xl:h-auto  2xl:h-auto xl:h-[540px] h-[500px] ">         */}
          <div className=" space-x-5 w-[530px] h-auto">        
          <div>
           <div className='w-[530px]'>
             <div  className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
             <h2 className='font-normal bg-[#ECF0F4] p-2 text-[13px]'>{props.dataLang?.import_detail_info || "import_detail_info"}</h2>       
              <div className='min-h-[130px] px-2 bg-gray-50 '>
                  <div className='grid grid-cols-2 space-x-4'>
                      <div className='col-span-1'>
                          <div className='my-4 font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.import_day_vouchers || "import_day_vouchers"}</h3><h3 className=' text-[13px]  font-normal'>{data?.date != null ? moment(data?.date).format("DD/MM/YYYY") : ""}</h3></div>
                            <div className='my-4 font-medium grid grid-cols-2'><h3 className='text-[13px]'>{props.dataLang?.payment_creator || "payment_creator"}</h3>
                              <div className='flex flex-wrap  gap-2 items-center justify-start relative'>
                                  <div className='relative'>
                                        <ModalImage small={data?.profile_image ? data?.profile_image : '/user-placeholder.jpg'} large={data?.profile_image ? data?.profile_image : '/user-placeholder.jpg'} className='h-6 w-6 rounded-full object-cover'/> 
                                        {/* <img className='h-6 w-6 rounded-full object-cover' src={data?.profile_image ? data?.profile_image : '/user-placeholder.jpg'} alt=''></img> */}
                                        <span className="h-1.5 w-1.5 absolute bottom-1/2 left-1/2 translate-x-[100%]">
                                              <span className="inline-flex relative rounded-full h-1.5 w-1.5 bg-lime-500">
                                              <span className="animate-ping  inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 absolute"></span></span>
                                        </span>
                                   </div>
                                      <h6 className="capitalize">{data?.staff_name}</h6>
                              </div>
                            </div>
                          <div className=' font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.payment_obType || "payment_obType"}</h3>
                              {
                                data?.objects === "client_group_client" && <span className='flex items-center justify-center font-normal text-sky-500  rounded-xl py-1 px-1 bg-sky-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]'>{props.dataLang[data?.objects] || data?.objects}</span>||
                                data?.objects === "supplier" && <span className=' flex items-center justify-center font-normal text-orange-500 rounded-xl py-1 px-1 bg-orange-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]  '>{props.dataLang[data?.objects] || data?.objects}</span>||
                                data?.objects === "other" && <span className='flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-1 bg-lime-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]'>{props.dataLang[data?.objects] || data?.objects}</span>
                              }
                          </div>
                          <div className='my-4 font-medium grid grid-cols-2'><h3 className='text-[13px]'>{props.dataLang?.payment_typeOfDocument || "payment_typeOfDocument"}</h3>
                              {
                                data?.type_vouchers === "import" && <span className='flex items-center justify-center font-normal text-purple-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-purple-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]'>{props.dataLang[data?.type_vouchers] || data?.type_vouchers}</span>||
                                data?.type_vouchers === "deposit" && <span className=' flex items-center justify-center font-normal text-cyan-500 rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-cyan-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]'>{props.dataLang[data?.type_vouchers] || data?.type_vouchers}</span>||
                                data?.type_vouchers === "service" && <span className='flex items-center justify-center gap-1 font-normal text-red-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-rose-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]'>{props.dataLang[data?.type_vouchers] || data?.type_vouchers}</span>
                              }
                            </div>
                      </div>
                        <div className='col-span-1 '>
                          <div className='my-4 font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.payment_code || "payment_code"}</h3><h3 className=' text-[13px]  font-normal'>{data?.code}</h3></div>
                          <div className='my-4 font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.payment_TT_method || "payment_TT_method"}</h3><h3 className=' text-[13px]  font-normal'>{data?.payment_mode_name}</h3></div>
                          <div className='my-4 font-medium grid grid-cols-2'><h3 className='text-[13px]'>{props.dataLang?.payment_ob || "payment_ob"}</h3>
                              <div className='flex flex-wrap  gap-2 items-center justify-start'>
                                <h3 className=' text-[13px]  font-normal'>{data?.object_text}</h3>
                              </div>
                          </div>
                          <div className=' font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{"Chi nhánh"}</h3>
                            <h3 className="3xl:items-center 3xl-text-[16px] 2xl:text-[13px] xl:text-xs text-[8px] text-[#0F4F9E] font-[300] px-2 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase w-fit">{data?.branch_name}</h3>
                          </div>
                        </div> 
                  </div>
                  <div className='mb-4 font-medium col-span-2 grid grid-cols-4 '>
                    <h3 className=' text-[13px] col-span-1 '>{props.dataLang?.payment_voucherCode || "payment_voucherCode"}</h3>
                        <div className='flex flex-wrap col-span-3 gap-2 items-center justify-start font-normal'>
                          {data?.voucher?.map((code, index) => (
                                <React.Fragment key={code?.id} >
                                  {code.code}
                                  {index !== data?.voucher.length - 1 && ', '}
                                </React.Fragment>
                          ))}
                        </div>
                  </div>  
               </div>     
             <h2 className='font-normal bg-[#ECF0F4]  p-1 2xl:text-[12px] xl:text-[13px] text-[12px]  w-full col-span-12 mt-0.5'>{props.dataLang?.payment_costInfo || "payment_costInfo"}</h2>  
              <div className=" w-[100%] lx:w-[110%] ">
                <div className={`grid-cols-3 grid sticky top-0  shadow-lg  z-10`}>
                  <h4 className="text-[13px] col-span-2 px-2 py-1 text-gray-400 uppercase  font-[500] text-center">{props.dataLang?.payment_costs || "payment_costs"}</h4>
                  <h4 className="text-[13px] col-span-1 px-1 py-1 text-gray-400 uppercase  font-[500] text-center">{props.dataLang?.payment_amountOfMoney || "payment_amountOfMoney"}</h4>
                </div>
                {onFetching ?
                  <Loading className="max-h-28" color="#0f4f9e" /> 
                  : 
                  data?.detail?.length > 0 ? 
                  (<>
                       <ScrollArea className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px] overflow-hidden"  speed={1}  smoothScrolling={true}>
                          <div className="divide-y divide-slate-200 min:h-[170px]  max:h-[170px]">                       
                            {(data?.detail?.map((e) => 
                              <div className="grid grid-cols-3 hover:bg-slate-50 items-center border-b" key={e.id?.toString()}>
                                <h6 className="text-[13px] col-span-2  pl-2 py-2  text-left break-words">{e?.costs_name}</h6>                
                                <h6 className="text-[13px] col-span-1 pl-2 py-2  text-center">{formatNumber(e?.total)}</h6>                
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
                        <div className="flex items-center justify-around mt-6 "></div>
                      </div>
                    </div>
                  )}    
              </div>
             <h2 className='font-normal p-2 text-[13px]  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]'>{props.dataLang?.purchase_total || "purchase_total"}</h2>  
                <div className=" mt-2  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
                  <div className='col-span-7'>
                      <h3 className='text-[13px]'>{props.dataLang?.import_from_note || "import_from_note"}</h3>
                      <textarea className="resize-none scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 placeholder:text-slate-300 w-[90%] min-h-[70px]  max-h-[70px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1 outline-none "
                                disabled value={data?.note}/>
                  </div>
                  <div className='col-span-2 space-y-1 text-right'>
                        <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.import_detail_total_amount || "import_detail_total_amount"}</h3></div>
                  </div>
                  <div className='col-span-3 space-y-1 text-right'>
                        <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total)}</h3></div>
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

const MoreSelectedBadge = ({ items }) => {
  const style = {
      marginLeft: "auto",
      background: "#d4eefa",
      borderRadius: "4px",
      fontSize: "14px",
      padding: "1px 3px",
      order: 99
  };

  const title = items.join(", ");
  const length = items.length;
  const label = `+ ${length}`;

  return (
    <div style={style} title={title}>{label}</div>
  );
};

const MultiValue = ({ index, getValue, ...props }) => {
  const maxToShow = 1;
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