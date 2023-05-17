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
    const [total, sTotal] = useState({})

    const [listBr, sListBr]= useState([])
    const [lisCode, sListCode]= useState([])
    const [listSupplier, sListSupplier]= useState([])

    const [listDs, sListDs] = useState()

    const [idCode, sIdCode] = useState(null);
    const [idSupplier, sIdSupplier] = useState(null);
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
        Axios("GET", `/api_web/Api_import/import/?csrf_protection=true`, {
            params: {
                search: keySearch,
                limit: limit,  
                page: router.query?.page || 1,  
                "filter[status_bar]": tabPage  ?? null,
                "filter[id]":idCode != null ? idCode?.value : null,
                "filter[branch_id]": idBranch != null ? idBranch.value : null ,
                "filter[supplier_id]": idSupplier ? idSupplier.value : null,
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
      Axios("GET", `/api_web/Api_import/filterBar/?csrf_protection=true`, {
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
      sOnFetching_filter(false)
   }

    useEffect(()=>{
      onFetching_filter && _ServerFetching_filter()
    },[onFetching_filter])

    useEffect(() => {
      onFetching && _ServerFetching()  || onFetching && _ServerFetching_group()    
      }, [onFetching]);
     
      useEffect(() => {
        router.query.tab && sOnFetching(true) || (keySearch && sOnFetching(true)) || router.query?.tab && sOnFetching_filter(true) || idBranch != null && sOnFetching(true) ||  valueDate.startDate != null && valueDate.endDate != null && sOnFetching(true) || idSupplier != null && sOnFetching(true) || idCode != null && sOnFetching(true)
    }, [limit,router.query?.page, router.query?.tab,idBranch, valueDate.endDate, valueDate.startDate,idSupplier,idCode]);

    const formatNumber = (number) => {
      if (!number && number !== 0) return 0;
      const integerPart = Math.floor(number)
      return integerPart.toLocaleString("en")
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

    const listBr_filter = listBr ? listBr?.map(e =>({label: e.name, value: e.id})) : []
    const listCode_filter = lisCode ? lisCode?.map(e =>({label: e.code, value: e.id})) : []

    const onchang_filter = (type, value)=>{
      if(type == "branch"){
          sIdBranch(value)
      }else if(type == "date"){
        sValueDate(value)
      }else if(type == "supplier"){
        sIdSupplier(value)
      }else if(type == "code"){
        sIdCode(value)
      }
    }


    const _ToggleStatus =  (id) => {
        
      Swal.fire({
          title: `${"Thay đổi trạng thái"}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#296dc1',
          cancelButtonColor: '#d33',
          confirmButtonText: `${dataLang?.aler_yes}`,
          cancelButtonText:`${dataLang?.aler_cancel}`
      }).then((result) => {
          if (result.isConfirmed) {
              // Xác định trạng thái mới
              const index = data.findIndex(x => x.id === id);
              const newStatus = data[index].status === "0" ? "1" : "0";
              // Gửi yêu cầu cập nhật trạng thái lên server
              _ServerSending(id, newStatus)
              sActive(newStatus)
              // Không cần cập nhật trạng thái trên giao diện ngay tại đây
          }
      });
  };
      const _ServerSending =  (id, newStatus) => {
          // let id = status
        Axios("POST",`${``}`, {
              headers: {"Content-Type": "multipart/form-data"} 
          }, (err, response) => {
              if(!err){
                  var {isSuccess, message} = response.data;  
                  if(isSuccess){
                      Toast.fire({
                          icon: 'success',
                          title: `${dataLang[message]}`
                      })
                    }
                    else{
                      Toast.fire({
                        icon: 'error',
                        title: `${dataLang[message]}`
                    })
                  }
              }
              sOnSending(false)
              _ServerFetching()
              // _ServerFetching_group()
          })
      }

      // useEffect(() => {
      //     onSending && _ServerSending()  
      // }, [onSending]);
      const [active ,sActive] = useState()
      useEffect(()=>{
        active != null && sOnSending(true)
      },[active != null])


    const multiDataSet = [
      {
          columns: [
              {title: "ID", width: {wch: 4}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${"Ngày chứng từ"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${"Mã chứng từ"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${"Nhà cung cấp"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${"Đơn đặt hàng"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${"Tổng tiền"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${"Tiền thuế"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${"Thành tiền"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${"Trạng thái thanh toán"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${"Duyệt thủ kho"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${"Chi nhánh"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
          ],
          data: dataExcel?.map((e) =>
              [
                  {value: `${e?.id ? e.id : ""}`, style: {numFmt: "0"}},
                  {value: `${e?.date ? e?.date : ""}`},
                  {value: `${e?.code ? e?.code : ""}`},
                  {value: `${e?.supplier_name ? e?.supplier_name : ""}`},
                  {value: `${e?.purchase_order_code ? e?.purchase_order_code : ""}`},
                  {value: `${e?.total_price ? formatNumber(e?.total_price) : ""}`},
                  {value: `${e?.total_tax_price ? formatNumber(e?.total_tax_price) : ""}`},
                  {value: `${e?.total_amount ? formatNumber(e?.total_amount) : ""}`},
                  {value: `${"Trạng thái thanh toán"}`},
                  {value: `${e?.warehouseman_id === "0" ? "Chưa duyệt": "Đã duyệt"}`},
                  {value: `${e?.branch_name ? e?.branch_name :""}`},
                 
              ]    
          ),
      }
  ];


    return (
        <React.Fragment>
            <Head>
                <title>{"Nhập hàng"} </title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
            <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
            <h6 className="text-[#141522]/40">{"Nhập hàng"}</h6>
            <span className="text-[#141522]/40">/</span>
            <h6>{"Danh sách nhập hàng"}</h6>
            </div>

        <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
          <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 h-[96%] overflow-hidden">
                <div className='flex justify-between'>
                    <h2 className="text-2xl text-[#52575E] capitalize">{"Danh sách nhập hàng"}</h2>
                    <div className="flex justify-end items-center">
                     <Link href="/purchase_order/import/form" className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105'>{dataLang?.purchase_order_new || "purchase_order_new"}</Link>
                  </div>
                </div>
                
                <div  className="flex space-x-3 items-center  h-[6vh] justify-start overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
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
                            >{dataLang[e?.name]}</TabStatus> 
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
                                  options={[{ value: '', label: dataLang?.purchase_order_branch || "purchase_order_branch", isDisabled: true }, ...listBr_filter]}
                                  onChange={onchang_filter.bind(this, "branch")}
                                  value={idBranch}
                                  placeholder={dataLang?.purchase_order_table_branch || "purchase_order_table_branch"} 
                                  hideSelectedOptions={false}
                                  isClearable={true}
                                  className="rounded-md bg-white  xl:text-base  2xl:text-base xl:text-xs text-[10px]  z-20" 
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
                          <div className='ml-1 col-span-1'>
                              <Select 
                                  options={[{ value: '', label: dataLang?.purchase_order_vouchercode || "purchase_order_vouchercode", isDisabled: true }, ...listCode_filter]}
                                  onChange={onchang_filter.bind(this, "code")}
                                  value={idCode}
                                  placeholder={dataLang?.purchase_order_table_code || "purchase_order_table_code"} 
                                  hideSelectedOptions={false}
                                  isClearable={true}
                                  className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px]  z-20" 
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
                          <div className='ml-1 col-span-1'>
                              <Select 
                                  //  options={listBr_filter}
                                  options={[{ value: '', label: dataLang?.purchase_order_supplier || "purchase_order_supplier", isDisabled: true }, ...listSupplier]}
                                  onChange={onchang_filter.bind(this, "supplier")}
                                  value={idSupplier}
                                  placeholder={dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"} 
                                  hideSelectedOptions={false}
                                  isClearable={true}
                                  className="rounded-md bg-white   2xl:text-base xl:text-xs text-[10px]  z-20" 
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
                                  <ExcelFile filename="Danh sách nhập hàng" title="SDNH" element={
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
                                      {/* <option value={-1}>Tất cả</option> */}
                                  </select>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
                <div className="min:h-[200px] h-[82%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <div className="pr-2 w-[100%] lx:w-[120%] ">
                    <div className="grid grid-cols-12 items-center sticky top-0 bg-white p-2 z-10 shadow">
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{"Ngày chứng từ"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{"Mã chứng từ"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{"Nhà cung cấp"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{"Đơn đặt hàng"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{"Tổng tiền"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{"Tiền thuế"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{"Thành tiền"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-2 font-[300] text-center'>{"Trạng thái thanh toán"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{"Duyệt thủ kho"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{"Chi nhánh"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-[#667085] uppercase col-span-1 font-[300]'>{"Tác vụ"}</h4>
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
                                {/* <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-center text-[#0F4F9E] hover:font-normal cursor-pointer'><Popup_chitiet dataLang={dataLang} className="text-left" name={e?.code} id={e?.id}/></h6> */}
                                <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-center text-[#0F4F9E] hover:font-normal cursor-pointer'>{e?.code}</h6>
                                <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-left'>{e.supplier_name}</h6>
                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-1 flex items-center justify-center text-center'>{<span className='font-normal text-lime-500  rounded-xl py-1 px-3  bg-lime-200 min-w-[100px]'>{e?.purchase_order_code}</span>}</h6>
                                {/* <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-left flex gap-2 flex-wrap'>{e?.purchases?.map(e => {return (<span>{e.code}</span>)})}</h6> */}
                                <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-right'>{formatNumber(e.total_price)}</h6>
                                <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-right'>{formatNumber(e.total_tax_price)}</h6>
                                <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1 text-right'>{formatNumber(e.total_amount)}</h6>
                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-2 flex items-center justify-center text-center cursor-pointer'>{e?.status == "1" ? (<div className='border border-lime-500 px-2 py-1 rounded text-lime-500 font-normal flex justify-center  items-center gap-1' onClick={() => _ToggleStatus(e?.id)}>Đã duyệt <TickCircle className='bg-lime-500 rounded-full' color='white'  size={19} /></div>) : (<div className='border border-red-500 px-2 py-1 rounded text-red-500  font-normal flex justify-center items-center gap-1' onClick={() => _ToggleStatus(e?.id)}>Chưa duyệt <TickCircle size={22}/></div>)}</h6>
                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-1 flex items-center justify-center text-center '>
                                    {e?.warehouseman_id  === "0" && <span className='2xl:text-sm xl:text-xs text-[8px] font-normal text-sky-500  rounded-xl py-1 px-2  bg-sky-200 cursor-pointer'>{"Chưa duyệt"}</span>||
                                     e?.warehouseman_id  === "1" &&  <span className='2xl:text-sm xl:text-xs text-[8px] font-normal text-orange-500 rounded-xl py-1 px-2  bg-orange-200 cursor-pointer'>{"Đã duyệt"}</span> ||
                                     e?.warehouseman_id  === "2" &&   <span className='2xl:text-sm xl:text-xs text-[8px] flex items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2  bg-lime-200'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{"Đã có xuất kho"}</span>
                                    }
                                </h6>
                                <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-1'><span className="mr-2 mb-1 w-fit 2xl:text-base xl:text-xs text-[8px] px-2 text-[#0F4F9E] font-[300] py-0.5 border border-[#0F4F9E] rounded-[5.5px]">{e?.branch_name}</span></h6> 
                                <div className='col-span-1 flex justify-center'>
                                    <BtnTacVu onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} warehouseman_id={e?.status} id={e?.id}className="bg-slate-100 xl:px-4 px-3 xl:py-1.5 py-1 rounded 2xl:text-base xl:text-xs text-[8px]" />
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
            <div className='grid grid-cols-12 bg-gray-100 items-center'>
                    <div className='col-span-4 p-2 text-center'>
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
    <button  style={props.style} onClick={props.onClick} className={`${props.className} justify-center min-w-[220px] flex gap-2 2xl:text-sm xl:text-sm text-xs items-center rounded-[5.5px] px-4 py-2 outline-none relative `}>
      {router.query?.tab === `${props.active}` && <ArrowCircleDown   size="20" color="#0F4F9E" />}
      {props.children}
      <span className={`${props?.total > 0 && "absolute min-w-[29px] top-0 right-0 bg-[#ff6f00] text-xs translate-x-2.5 -translate-y-2 text-white rounded-[100%] px-2 text-center items-center flex justify-center py-1.5"} `}>{props?.total > 0 && props?.total}</span>
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
          title: `${props.dataLang?.aler_ask}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#296dc1',
          cancelButtonColor: '#d33',
          confirmButtonText: `${props.dataLang?.aler_yes}`,
          cancelButtonText:`${props.dataLang?.aler_cancel}`
      }).then((result) => {
        if (result.isConfirmed) {
          Axios("DELETE", `/api_web/Api_import/import/${id}?csrf_protection=true`, {
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
     router.push(`/purchase_order/import/form?id=${props.id}`);
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
                       className=" hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full 2xl:text-sm xl:text-sm text-[8px]">{props.dataLang?.purchase_order_table_edit || "purchase_order_table_edit"}</button>
                      <button onClick={_HandleDelete.bind(this, props.id)} className='2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full'>{props.dataLang?.purchase_order_table_delete || "purchase_order_table_delete"}</button>
                  </div>
              </div>
          </Popup>
      </div>
  )
})



export default Index;