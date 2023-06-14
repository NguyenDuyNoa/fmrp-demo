import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import moment from 'moment/moment';

import {
    Grid6 as IconExcel, Filter as IconFilter, Calendar as IconCalendar, SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,Add as IconAdd, TickCircle, ArrowCircleDown,Image as IconImage
} from "iconsax-react";
import Select from 'react-select';
import Popup from 'reactjs-popup';
import { useRef } from 'react';
import { useRouter } from 'next/router';

import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import {_ServerInstance as Axios} from '/services/axios';
import Pagination from '/components/UI/pagination';
import 'react-datepicker/dist/react-datepicker.css';
import Datepicker from 'react-tailwindcss-datepicker'
import DatePicker,{registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import vi from "date-fns/locale/vi"
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import ModalImage from "react-modal-image";

dayjs.locale('vi');

import Swal from "sweetalert2";
const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
})

import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;


const Index = (props) => {
    const dataLang = props.dataLang;
    const router = useRouter();
    const [data, sData] = useState([]);
    const [dataExcel, sDataExcel] = useState([]);
    const [onFetching, sOnFetching] = useState(false);
    const [onnFetching_filter, sOnFetching_filter] = useState(false);
    const [totalItems, sTotalItems] = useState([]);
    const [keySearch, sKeySearch] = useState("")
    const [limit, sLimit] = useState(15);
    const [listDs, sListDs] = useState()
    const tabPage = router.query?.tab;

    const [listBr, sListBr]= useState()
    const [listCode, sListCode]= useState()
    const [listUser, sListUser]= useState()
    const [idBranch, sIdBranch] = useState(null);
    const [idCode, sIdCode] = useState(null);
    const [idUser, sIdUser] = useState(null);
    const [status, sStatus] = useState("")
    const [active,sActive] = useState(null)
    const [onSending, sOnSending] = useState(false);
    const [dateRange, setDateRange] = useState([]);
    const [valueDate, sValueDate] = useState({
      startDate: null,
      endDate:null
    });

    const formatDate = (date) => {
      const day = date?.getDate().toString().padStart(2, '0');
      const month = (date?.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
      const year = date?.getFullYear();
      return `${year}-${month}-${day}`;
    };
    const formattedDateRange = dateRange?.map((date) => formatDate(date));

    const _HandleSelectTab = (e) => {
      router.push({
          pathname: router.route,    
          query: { tab: e }
      })
    }
    useEffect(() => {
      router.push({
          pathname: router.route,    
          query: { tab: router.query?.tab ? router.query?.tab : ""  }
      })
    }, []);
    const _ServerFetching =   () => {
      const id = Number(tabPage)
        Axios("GET", "/api_web/Api_purchases/purchases/?csrf_protection=true", {
            params: {
                search: keySearch,
                limit: limit,
                page: router.query?.page || 1,
                "filter[branch_id]": idBranch != null ? idBranch.value : null,
                // "filter[status]": tabPage !== "" ? (tabPage !== "1" ? id : 1) : null ,
                "filter[status]": tabPage,
                "filter[id]": idCode?.value,
                "filter[staff_id]" : idUser?.value,
                // "filter[start_date]": formattedDateRange[0],
                // "filter[end_date]": formattedDateRange[1],
                "filter[start_date]": valueDate?.startDate,
                "filter[end_date]":valueDate?.endDate,
            }
        }, (err, response) => {
            if(!err){
                var {output, rResult} =  response.data;
                sData(rResult)
                sDataExcel(rResult)
                sTotalItems(output)
              
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
      Axios("GET", `/api_web/Api_purchases/purchases/?csrf_protection=true`, {}, (err, response) => {
        if(!err){
            var {rResult} =  response.data
            sListCode(rResult)
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
    
    const listBr_filter = listBr ? listBr?.map(e =>({label: e.name, value: e.id})) : []
    const listCode_filter = listCode ? listCode?.map(e => ({label: e.code, value : e.id})): []
    const listUser_filter = listUser ? listUser?.map(e => ({label: e.name, value : e.staffid})): []

    const onchang_filter= (type, value) => {
      if(type == "branch"){
        sIdBranch(value)
      }else if(type == "code"){
        sIdCode(value)
      }else if(type == "user"){
        sIdUser(value)
      }else if(type == "date"){
        // setDateRange(value)
        sValueDate(value)
      }
    }

    const _ServerFetching_group =  () =>{
        Axios("GET", `/api_web/Api_purchases/purchasesFilterBar/?csrf_protection=true`, {
          params:{
            limit: 0,
            search: keySearch,
            "filter[branch_id]": idBranch != null ? idBranch.value : null,
            "filter[id]": idCode?.value,
            "filter[staff_id]" : idUser?.value,
            "filter[start_date]": valueDate?.startDate,
            "filter[end_date]":valueDate?.endDate,
          }
      }, (err, response) => {
        if(!err){
            var data =  response.data
            sListDs(data)
        }
        sOnFetching(false)
      })
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
      useEffect(() => {
        onFetching && _ServerFetching() || onFetching && _ServerFetching_group()    
      }, [onFetching]);
      useEffect(() => {
        onnFetching_filter && _ServerFetching_filter()      
      }, [onnFetching_filter]);
      useEffect(() => {
        router.query.tab && sOnFetching(true) || (keySearch && sOnFetching(true)) || sOnFetching_filter(true)  || router.query.tab == "" && sOnFetching(true) || (idBranch != null && sOnFetching(true)) || (idCode != null && sOnFetching(true)) || (idUser != null && sOnFetching(true)) ||  valueDate.startDate != null && valueDate.endDate != null && sOnFetching(true) 
      }, [limit,router.query?.page, router.query?.tab,idBranch,idCode,idUser,valueDate.endDate, valueDate.startDate]); 

      // const _ToggleStatus = (id,db) => {
      //       Swal.fire({
      //          title: `${"Thay đổi trạng thái"}`,
      //          icon: 'warning',
      //          showCancelButton: true,
      //          confirmButtonColor: '#296dc1',
      //          cancelButtonColor: '#d33',
      //          confirmButtonText: `${dataLang?.aler_yes}`,
      //          cancelButtonText:`${dataLang?.aler_cancel}`
      //        }).then((result) => {
      //          if (result.isConfirmed) {
      //             sStatus(id)
      //             var index = data.findIndex(x => x.id === id);
      //             console.log(data[index]?.status);
      //            if (index !== -1 && data[index].status === "0") {
      //               sActive(data[index].status = "1")
      //            }else if (index !== -1 && data[index].status === "1") {
      //               sActive(data[index].status = "0")
      //             }
      //            sData([...data])
      //          }
      //        })
      //      }
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
          Axios("POST",`${`/api_web/Api_purchases/updateStatus/${id}/${newStatus}?csrf_protection=true`}`, {
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
                _ServerFetching_group()
            })
        }

        // useEffect(() => {
        //     onSending && _ServerSending()  
        // }, [onSending]);
        useEffect(()=>{
          active != null && sOnSending(true)
        },[active != null])
        // useEffect(()=>{
        //   stt != undefined && sOnSending(true)
        // },[stt])
        // useEffect(()=>{
        //    sOnSending(true)
        // },[status])
        const multiDataSet = [
            {
                columns: [
                    {title: "ID", width: {wch: 4}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                    {title: `${dataLang?.purchase_day || "purchase_day"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                    {title: `${dataLang?.purchase_code || "purchase_code"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                    {title: `${dataLang?.purchase_planNumber || "purchase_planNumber"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                    {title: `${dataLang?.purchase_propnent || "purchase_propnent"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                    {title: `${dataLang?.purchase_status || "purchase_status"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                    {title: `${dataLang?.purchase_totalitem || "purchase_totalitem"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                    {title: `${dataLang?.purchase_orderStatus || "purchase_orderStatus"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                    {title: `${dataLang?.purchase_branch || "purchase_branch"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                    {title: `${dataLang?.purchase_note || "purchase_note"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                ],
                data: dataExcel?.map((e) =>
                    [
                        {value: `${e?.id ? e.id : ""}`, style: {numFmt: "0"}},
                        {value: `${e?.date ? e?.date : ""}`},
                        {value: `${e?.code ? e?.code : ""}`},
                        {value: `${e?.reference_no ? e?.reference_no : ""}`},
                        {value: `${e?.staff_create_name ? e?.staff_create_name : ""}`},
                        {value: `${e?.status ? (e?.status === "1" ? "Đã duyệt" : "Chưa duyệt") : ""}`},
                        {value: `${e?.total_item ? e?.total_item  : ""}`},
                        {value: e?.order_status?.status === "purchase_ordered" ? dataLang[e?.order_status?.status] :""
                        ||  `${e?.order_status.status === "purchase_portion" ?  dataLang[e?.order_status?.status] + " " + `(${e?.order_status?.count})` :""}` 
                        ||  `${e?.order_status.status === "purchase_enough" ?  dataLang[e?.order_status?.status] + " " + `(${e?.order_status?.count})` : ""}`},
                        {value: `${e?.branch_name ? e?.branch_name :""}`},
                        {value: `${e?.note ? e?.note :""}`},
                       
                    ]    
                ),
            }
        ];

        const formatNumber = (number) => {
          const integerPart = Math.floor(number)
          return integerPart.toLocaleString("en")
        }

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.purchase_title}</title>
            </Head>
            <div className='xl:px-10 px-3 xl:pt-24 pt-[88px] pb-3 space-y-2.5 h-screen overflow-hidden flex flex-col justify-between'>
                <div className='h-[97%] space-y-3 overflow-hidden'>
                    <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                        <h6 className='text-[#141522]/40'>{dataLang?.purchase_title}</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6 className='text-[#141522]/40'>{dataLang?.purchase_title}</h6>
                       
                    </div>
                    <div className='flex justify-between items-center'>
                        <h2 className='xl:text-3xl text-xl font-medium '>{dataLang?.purchase_title}</h2>
                        <div className='flex space-x-3 items-center'>
                        <Link href="/purchase_order/purchases/form" className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105'>Tạo mới</Link>
                        </div>
                    </div>
                    <div  className="flex space-x-3 items-center h-[8vh] justify-start overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                         {listDs &&   listDs.map((e)=>{
                          return (
                           <div>
                              <TabStatus
                                key={e.id} 
                                onClick={_HandleSelectTab.bind(this, `${e.id}`)} 
                                total={e.count} 
                                active={e.id} 
                                className={`${e.color ? "text-white" : "text-[#0F4F9E] bg-[#e2f0fe] "}`}
                              >{dataLang[e?.name] || e?.name}</TabStatus> 
                            </div>
                          )
                      })
                     }
                    </div>
                    
                    <div className="bg-slate-100 w-full rounded grid grid-cols-6  xl:p-3 p-2 gap-2">
                        <div className='col-span-5'>
                           <div className='grid grid-cols-5'>
                             <div className='col-span-1'>
                                  <form className="flex items-center relative">
                                      <IconSearch size={20} className="absolute 2xl:left-3 z-10  text-[#cccccc] xl:left-[4%] left-[1%]" />
                                        <input
                                            className=" relative bg-white  outline-[#D0D5DD] focus:outline-[#0F4F9E]  2xl:text-left 2xl:pl-10 xl:pl-0 p-0 2xl:py-2    xl:py-3 py-3 rounded 2xl:text-base text-xs xl:text-center text-center 2xl:w-full xl:w-full w-[100%]"
                                            type="text" 
                                            onChange={_HandleOnChangeKeySearch.bind(this)} 
                                            placeholder={dataLang?.branch_search}
                                        />
                                  </form>
                              </div>
                              <div className='ml-1 col-span-1'>
                                  <Select 
                                      options={[{ value: '', label: dataLang?.client_list_filterbrand, isDisabled: true }, ...listBr_filter]}
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
                                      options={[{ value: '', label: dataLang?.purchase_code, isDisabled: true }, ...listCode_filter]}
                                      onChange={onchang_filter.bind(this, "code")}
                                      value={idCode}
                                      noOptionsMessage={() => `${dataLang?.no_data_found}`}
                                      isClearable={true}
                                      placeholder={dataLang?.purchase_code || "purchase_code"}
                                      className="rounded-md py-0.5 bg-white border-none 2xl:text-base xl:text-xs text-[10px] z-20" 
                                      isSearchable={true}
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
                                      options={[{ value: '', label: dataLang?.purchase_propnent, isDisabled: true }, ...listUser_filter]}
                                      // formatOptionLabel={CustomSelectOption}
                                      onChange={onchang_filter.bind(this, "user")}
                                      value={idUser}
                                      noOptionsMessage={() => `${dataLang?.no_data_found}`}
                                      isClearable={true}
                                      placeholder={dataLang?.purchase_propnent || "purchase_propnent"}
                                      className="rounded-md py-0.5 bg-white border-none 2xl:text-base xl:text-xs text-[10px] z-20" 
                                      isSearchable={true}
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
                              <div className='ml-1 col-span-1 z-20'>
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
                          <div className='flex justify-end items-center gap-2'>
                             <div>
                             {
                              dataExcel?.length > 0 &&(
                                  <ExcelFile filename="Danh sách đơn đặt hàng (PO)" title="DSDDH" element={
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
                    <div className='min:h-[500px] 2xl:h-[76%] h-[70%] max:h-[800px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 tooltipBoundary'>
                        <div className='pr-2'>
                            <div className='grid grid-cols-12 sticky top-0 bg-white p-2 z-10 shadow-lg'>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1  text-center'>{dataLang?.purchase_day || "purchase_day"}</h4>   
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500]  col-span-1 '>{dataLang?.purchase_code || "purchase_code"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500]  col-span-1 '>{dataLang?.purchase_planNumber || "purchase_planNumber"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500]  col-span-1 '>{dataLang?.purchase_propnent || "purchase_propnent"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500]  col-span-1  text-center'>{dataLang?.purchase_status || "purchase_status"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500]  col-span-1 text-center '>{dataLang?.purchase_totalitem || "purchase_totalitem"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] text-center col-span-2 '>{dataLang?.purchase_orderStatus || "purchase_orderStatus"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] text-left col-span-2 '>{dataLang?.purchase_note || "purchase_note"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] col-span-1 '>{dataLang?.purchase_branch || "purchase_branch"}</h4>
                                <h4 className='2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-400 uppercase  font-[500] text-center  col-span-1 '>{dataLang?.purchase_action || "purchase_action"}</h4>
                            </div>
                            {onFetching ?
                                <Loading className="h-80"color="#0f4f9e" /> :
                                data?.length > 0 ? (
                                    <div className="divide-y divide-slate-200"> 
                                        {data?.map((e) => 
                                            <div key={e?.id.toString()} className='grid grid-cols-12 items-center hover:bg-slate-50 relative'>
                                                <h6 className='px-2 py-2.5 2xl:text-base xl:text-xs text-[8px] col-span-1 flex items-center justify-center'>{e?.date != null ? moment(e?.date).format("DD/MM/YYYY") : ""}</h6> 
                                                <h6 className='px-2 py-2.5 2xl:text-base xl:text-xs text-[8px] col-span-1 flex items-center  text-[#0F4F9e] font-medium cursor-pointer'><Popup_chitiet dataLang={dataLang} className="text-left" name={e?.code} id={e?.id}/></h6>
                                                <h6 className='px-2 py-2.5 2xl:text-base xl:text-xs text-[8px] col-span-1 flex items-center '>{e?.reference_no }</h6>
                                                <h6 className='px-2 py-2.5 2xl:text-base xl:text-xs text-[8px] col-span-1 flex items-center '>{e?.staff_create_name}</h6>
                                                <h6 className='px-2 py-2.5 2xl:text-base xl:text-xs text-[8px] col-span-1 flex items-center justify-center text-center cursor-pointer'>{e?.status == "1" ? (<div className='border border-lime-500 px-2 py-1 rounded text-lime-500 font-normal flex justify-center  items-center gap-1 3xl:text-[16px] 2xl:text-[14px] xl:text-[10px] text-[8px] bg-gradient-to-l from-[#ecfccb]  via-transparent to-transparent btn-animation' onClick={() => _ToggleStatus(e?.id)}>Đã duyệt <TickCircle className='bg-lime-500 rounded-full ' color='white'  size={19} /></div>) : (<div className='border border-red-500 3xl:px-2 px-0 py-1 rounded text-red-500  font-normal flex justify-center items-center gap-1 3xl:text-[16px] 2xl:text-[13px] xl:text-[10px] text-[8px]  bg-gradient-to-l from-[#fee2e2]  via-transparent to-transparent btn-animation ' onClick={() => _ToggleStatus(e?.id)}>Chưa duyệt <TickCircle size={22}/></div>)}</h6>
                                                <h6 className='px-2 py-2.5 2xl:text-base xl:text-xs text-[8px] col-span-1 flex items-center justify-center '>{formatNumber(e?.total_item)}</h6>
                                                <h6 className='px-2 py-2.5 2xl:text-base xl:text-xs text-[8px] col-span-2 flex items-center '>
                                                  <div className='mx-auto'>
                                                   {
                                                  e?.order_status?.status === "purchase_ordered" && <span className='flex items-center justify-center font-normal text-sky-500  rounded-xl py-1 px-2 min-w-[135px]  bg-sky-200 text-center 2xl:text-sm xl:text-xs text-[8px]'>{dataLang[e?.order_status?.status]}</span>||
                                                  e?.order_status?.status === "purchase_portion" && <span className=' flex items-center justify-center font-normal text-orange-500 rounded-xl py-1 px-2 min-w-[135px]  bg-orange-200 text-center 2xl:text-sm xl:text-xs text-[8px]'>{dataLang[e?.order_status?.status]} {`(${e?.order_status?.count})`}</span>||
                                                  e?.order_status?.status === "purchase_enough" && <span className='flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 min-w-[135px]  bg-lime-200 text-center 2xl:text-sm xl:text-xs text-[8px]'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{dataLang[e?.order_status?.status]} {`(${e?.order_status?.count})`}</span>
                                                    }
                                                  </div>
                                                </h6>
                                                <h6 className='2xl:text-base xl:text-xs text-[8px] px-2 col-span-2 text-left truncate '>{e?.note}</h6>
                                                <h6 className="col-span-1 w-fit"><span className="3xl:items-center 3xl-text-[16px] 2xl:text-[13px] xl:text-xs text-[8px] text-[#0F4F9E] font-[300] px-2 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">{e?.branch_name}</span></h6>
                                                <div className='pl-2 py-2.5 col-span-1 flex space-x-2 justify-center'>
                                                    <BtnTacVu order={e?.order_status} onRefreshGroup={_ServerFetching_group.bind(this)}  dataLang={dataLang} id={e.id} name={e.name} code={e.code} onRefresh={_ServerFetching.bind(this)} status={e?.status} keepTooltipInside=".tooltipBoundary" className="bg-slate-100 xl:px-2 px-1 xl:py-2 py-1.5 rounded xl:text-[13px] 2xl:text-base xl:text-xs text-[8px]" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                                :(
                                  <div className=" max-w-[352px] mt-24 mx-auto" >
                                    <div className="text-center">
                                        <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                                        <h1 className="textx-[#141522] text-base opacity-90 font-medium">{dataLang?.no_data_found || "no_data_found"}</h1>
                                    </div>
                                </div>
                                )
                                
                            }
                        </div>
                    </div>
                </div>
                {data?.length != 0 &&
                    <div className='flex space-x-5 items-center'>
                        <h6>Hiển thị {totalItems?.iTotalDisplayRecords} trong số {totalItems?.iTotalRecords} thành phần</h6>
                        <Pagination 
                        postsPerPage={limit}
                        totalPosts={Number(totalItems?.iTotalDisplayRecords)}
                        paginate={paginate}
                        currentPage={router.query?.page || 1}
                        />
                    </div> 
                }
            </div>
        </React.Fragment>
    );
}
const TabStatus = React.memo((props) => {
    const router = useRouter();
    return(
      <button  style={props.style} onClick={props.onClick} className={`${props.className} justify-center min-w-[180px] flex gap-2 2xl:text-sm xl:text-sm text-xs items-center rounded-[5.5px] px-2 py-2 outline-none relative `}>
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
            Axios("DELETE", `/api_web/Api_purchases/purchases/${id}?csrf_protection=true`, {
            }, (err, response) => {
              if(!err){
                var {isSuccess, message} = response.data;
                if(isSuccess){
                  Toast.fire({
                    icon: 'success',
                    title: props.dataLang[message]
                  })     
                  props.onRefresh && props.onRefresh()
                  props.onRefreshGroup && props.onRefreshGroup()
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
      if(props?.order?.status != "purchase_ordered"){
        Toast.fire({
          icon: 'error',
          title: `${props.dataLang?.purchases_ordered_cant_edit}`
        })  
      } 
       else if (props?.status === "1") {
            Toast.fire({
                icon: 'error',
                title: `${props.dataLang?.confirmed_cant_edit}`
              })   
        }
        else {
          router.push(`/purchase_order/purchases/form?id=${props.id}`);
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
                // open={open || openDetail || openBom}
            >
                <div className="w-auto rounded">
                    <div className="bg-white rounded-t flex flex-col overflow-hidden">
                        {/* <Popup_GiaiDoan setOpen={sOpen} isOpen={open} dataLang={props.dataLang} id={props.id} name={props.name} code={props.code} type="add" className='text-sm hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full' />
                        <Popup_Bom setOpen={sOpenBom} isOpen={openBom} dataLang={props.dataLang} id={props.id} name={props.name} code={props.code} className='text-sm hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full' />
                        <Popup_ThanhPham onRefresh={props.onRefresh} dataProductExpiry={props.dataProductExpiry} dataLang={props.dataLang} id={props?.id} setOpen={sOpenDetail} isOpen={openDetail} className="text-sm hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full" /> */}
                        <button onClick={handleClick}className="2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full">{props.dataLang?.purchase_editVoites || "purchase_editVoites"}</button>
                        <button onClick={_HandleDelete.bind(this, props.id)} className='2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full'>{props.dataLang?.purchase_deleteVoites || "purchase_deleteVoites"}</button>
                    </div>
                </div>
            </Popup>
        </div>
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
    const _ServerFetching_detailUser = () =>{
      Axios("GET", `/api_web/Api_purchases/purchases/${props?.id}?csrf_protection=true`, {}, (err, response) => {
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

    let listQty = data?.items
    let totalQuantity = 0;
    for (let i = 0; i < listQty?.length; i++) {
    totalQuantity += parseInt(listQty[i].quantity);
    }

    const formatNumber = (number) => {
      const integerPart = Math.floor(number)
      return integerPart.toLocaleString("en")
    }

  return (
  <>
   <PopupEdit   
      title={props.dataLang?.purchase_detail_title || "purchase_detail_title"} 
      button={props?.name} 
      onClickOpen={_ToggleModal.bind(this, true)} 
      open={open} onClose={_ToggleModal.bind(this,false)}
      classNameBtn={props?.className} 
    >
    <div className='flex items-center space-x-4 my-3 border-[#E7EAEE] border-opacity-70 border-b-[1px]'>
       
    </div>  
            <div className="mt-4 space-x-5 w-[999px] h-auto ">        
            <div>
             <div className='w-[999px]'>
               <div className="min:h-[170px] h-[72%] max:h-[100px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
               <h2 className='font-normal bg-[#ECF0F4] p-2'>{props?.dataLang?.purchase_general || "purchase_general"}</h2>       
                <div className='grid grid-cols-8  min-h-[170px] p-2'>
                    <div className='col-span-3'>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.purchase_day || "purchase_day"}</h3><h3 className='col-span-1 font-normal'>{data?.date != null ? moment(data?.date).format("DD/MM/YYYY") : ""}</h3></div>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.purchase_code || "purchase_code"}</h3><h3 className='col-span-1 font-normal'>{data?.code}</h3></div>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.purchase_planNumber || "purchase_planNumber"}</h3><h3 className='col-span-1 font-normal'>{data?.reference_no}</h3></div>
                    </div>

                    <div className='col-span-2 mx-auto'>
                        <div className='my-4 font-medium '>{props.dataLang?.purchase_orderStatus || "purchase_orderStatus"}</div>
                        <div className='flex flex-wrap  gap-2 items-center justify-start'>
                            {
                          data?.order_status?.status === "purchase_ordered" && <span className=' font-normal text-sky-500  rounded-xl py-1 px-2 min-w-[135px]  bg-sky-200'>{props.dataLang[data?.order_status?.status]}</span>||
                          data?.order_status?.status === "purchase_portion" && <span className=' font-normal text-orange-500 rounded-xl py-1 px-2 min-w-[135px]  bg-orange-200'>{props.dataLang[data?.order_status?.status]} {`(${data?.order_status?.count})`}</span>||
                          data?.order_status?.status === "purchase_enough" && <span className='flex items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 min-w-[135px]  bg-lime-200'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{props.dataLang[data?.order_status?.status]} {`(${data?.order_status?.count})`}</span>
                            }
                        </div>
                        {/* <div className=' font-normal text-sky-500  rounded-xl py-1 px-2 max-w-[180px] my-2 text-center  bg-sky-200'>{props.dataLang?.purchase_ordered || "purchase_ordered"}</div>
                        <div className=' font-normal text-orange-500 rounded-xl py-1 px-2 max-w-[180px] my-2 text-center  bg-orange-200'>{props.dataLang?.purchase_portion || "purchase_portion"} (0)</div>
                        <div className='flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 max-w-[180px] my-2 text-center  bg-lime-200'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{props.dataLang?.purchase_enough || "purchase_enough"} (0)</div> */}
                    </div>
                    <div className='col-span-3 '>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.purchase_status || "purchase_status"}</h3><h3 className='col-span-1'>{data?.status == "1" ? (<div className='border border-lime-500 px-2 py-1 rounded text-lime-500 font-normal flex justify-center  items-center gap-1'>{props.dataLang?.purchase_approved || "purchase_approved"} <TickCircle className='bg-lime-500 rounded-full' color='white'  size={19} /></div>) : (<div className='border border-red-500 px-2 py-1 rounded text-red-500  font-normal flex justify-center items-center gap-1' >{props.dataLang?.purchase_notapproved || "purchase_notapproved"} <TickCircle size={22}/></div>)}</h3></div>  
                        {/* <div className='my-4 font-medium grid grid-cols-2'>Tổng số lượng</div> */}
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.purchase_propnent || "purchase_propnent"}</h3><h3 className='col-span-1 font-normal'>{data?.user_create_name}</h3></div>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.purchase_branch || "purchase_branch"}</h3><h3 className="3xl:items-center 3xl-text-[16px] w-fit 2xl:text-[13px] xl:text-xs text-[8px] text-[#0F4F9E] font-[300] px-2 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">{data?.branch_name}</h3></div>
                    </div>
                    
                </div>
                <div className="pr-2 w-[100%] lx:w-[110%] ">
                  <div className="grid grid-cols-8 sticky top-0 bg-slate-50 shadow-lg p-2 z-10">
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-left">{props.dataLang?.purchase_image || "purchase_image"}</h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center">{props.dataLang?.purchase_items || "purchase_items"}</h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center">{props.dataLang?.purchase_variant || "purchase_variant"}</h4> 
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center">{props.dataLang?.purchase_unit || "purchase_unit"}</h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center">{props.dataLang?.purchase_quantity || "purchase_quantity"}</h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center">{props.dataLang?.purchase_quantity_purchased || "purchase_quantity_purchased"}</h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center">{props.dataLang?.purchase_reaining_amout || "purchase_reaining_amout"}</h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center">{props.dataLang?.purchase_note || "purchase_note"}</h4>
                  </div>
                  {onFetching ?
                    <Loading className="max-h-28"color="#0f4f9e" /> 
                    : 
                    data?.items?.length > 0 ? 
                    (<>
                         <ScrollArea     
                           className="min-h-[90px] max-h-[200px] 2xl:max-h-[166px] overflow-hidden"  speed={1}  smoothScrolling={true}>
                      <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">                       
                        {(data?.items?.map((e) => 
                          <div className="grid items-center grid-cols-8 py-1.5 px-2 hover:bg-slate-100/40 " key={e.id.toString()}>
                            <h6 className="xl:text-base text-xs   py-0.5 col-span-1  rounded-md text-left">
                            {e?.item?.images != null ? (<ModalImage  small={e?.item?.images} large={e?.item?.images} alt="Product Image"  className='object-cover rounded w-[50px] h-[60px]' />):
                                    <div className='w-[50px] h-[60px] object-cover  flex items-center justify-center rounded'>
                                      {/* <IconImage/> */}
                                      <ModalImage small="/no_img.png" large="/no_img.png" className='w-full h-full rounded object-contain p-1' > </ModalImage>
                                    </div>
                                  }
                            </h6>   

                            <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-left">{e?.item?.name}</h6>                
                            <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-center break-words">{e?.item?.product_variation}</h6>                
                            <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-center break-words">{e?.item?.unit_name}</h6>                
                            <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-center">{formatNumber(e?.quantity)}</h6>                
                            <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-center">{formatNumber(e?.quantity_create)}</h6>                
                            <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-center">{Number(e?.quantity_left) < 0 ? "Đặt dư" +" "+ formatNumber(Number(Math.abs(e?.quantity_left)))  : formatNumber(e?.quantity_left)}</h6>                
                            <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-left">{e?.note}</h6>                
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
                          <h1 className="textx-[#141522] text-base opacity-90 font-medium">Không tìm thấy các mục</h1>
                          <div className="flex items-center justify-around mt-6 ">
                              {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                          </div>
                        </div>
                      </div>
                    )}    
                </div>
            <h2 className='font-normal p-2  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]'>{props.dataLang?.purchase_total || "purchase_total"}</h2>  
              <div className=" mt-5  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10">
                  <div className='col-span-9'>
                    <h3 className='text-[13px] p-1'>{props.dataLang?.purchase_note || "import_from_note"}</h3>
                  <textarea 
                  className="resize-none scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 placeholder:text-slate-300 w-[90%] min-h-[70px]  max-h-[70px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1 outline-none "
                  disabled value={data?.note}/>
                </div>
               <div className='col-span-3 space-y-2'>
                <div className='flex justify-between '>
                    <div className='font-normal'><h3>{props.dataLang?.purchase_totalCount || "purchase_totalCount"}</h3></div>
                    <div className='font-normal'><h3 className='text-blue-600'>{formatNumber(totalQuantity)}</h3></div>
                  </div>
                  <div className='flex justify-between '>
                    <div className='font-normal'><h3>{props.dataLang?.purchase_totalItem || "purchase_totalItem"}</h3></div>
                    <div className='font-normal'><h3 className='text-blue-600'>{formatNumber(data?.items?.length)}</h3></div>
                  </div>  
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