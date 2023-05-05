import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ReactExport from "react-data-export";
import {_ServerInstance as Axios} from '/services/axios';
import moment from 'moment/moment';
import Popup from 'reactjs-popup';
import Pagination from '/components/UI/pagination';
import Swal from "sweetalert2";
import Select,{components} from "react-select"
import 'react-datepicker/dist/react-datepicker.css';
import Datepicker from 'react-tailwindcss-datepicker'

import { 
    SearchNormal1 as IconSearch,Grid6 as IconExcel,ArrowDown2 as IconDown,Trash as IconDelete, Flag
} from "iconsax-react";

import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import { useRef } from 'react';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet

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
    const [listDs, sListDs] = useState()
    const [listBr, sListBr]= useState([])
    const [idBranch, sIdBranch] = useState(null);
    const [valueDate, sValueDate] = useState({
        startDate: null,
        endDate:null
      });

    const _ServerFetching =   () => {
          Axios("GET", "/api_web/api_inventory/inventory", {
              params: {
                  search: keySearch,
                  limit: limit,
                  page: router.query?.page || 1,
                  "filter[branch_id]": idBranch?.value != null ? idBranch?.value : null,
                  "filter[start_date]": valueDate?.startDate != null ? valueDate?.startDate : null ,
                  "filter[end_date]":valueDate?.endDate != null ? valueDate?.endDate : null ,
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
      const [data_export,sData_export] = useState([])
      const handleDelete = (event) => {
        Swal.fire({
          title: `${dataLang?.aler_ask}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#296dc1',
          cancelButtonColor: '#d33',
          confirmButtonText: `${dataLang?.aler_yes}`,
          cancelButtonText:`${dataLang?.aler_cancel}`
        }).then((result) => {
          if (result.isConfirmed) {
            const id = event;
            Axios("DELETE", `/api_web/api_inventory/inventory/${id}`, {
            }, (err, response) => {
              if(!err){
                var {isSuccess, message,data_export} = response.data
                if(isSuccess){
                  Toast.fire({
                    icon: 'success',
                    title: dataLang[message]
                  })     
                }else{
                  Toast.fire({
                    icon: 'error',
                    title: dataLang[message]
                    
                  }) 
                    if(data_export?.length > 0){
                        sData_export(data_export)
                        
                    } 
                }
              }
              _ServerFetching()
            })     
          }
        })
      }
      
      const onchang_filter = (type, value)=>{
        if(type == "branch"){
            sIdBranch(value)
        }else if(type == "date"){
          sValueDate(value)
        }
      }
      const listBr_filter = listBr ? listBr?.map(e =>({label: e.name, value: e.id})) : []

      const _ServerFetching_filter =  () =>{
        Axios("GET", `/api_web/Api_Branch/branch/?csrf_protection=true`, {}, (err, response) => {
        if(!err){
            var {rResult} =  response.data
            sListBr(rResult)
        }
      })
      sOnFetching_filter(false)
      }




      const paginate = pageNumber => {
        router.push({
            pathname: '/inventory',
            query: { page: pageNumber }
        })
      }
      const _HandleOnChangeKeySearch = ({target: {value}}) => {
        sKeySearch(value)
        router.replace('/inventory');
        setTimeout(() => {
          if(!value){
            sOnFetching(true)
          }
          sOnFetching(true)
        }, 500);
      };
      useEffect(() => {
        onFetching && _ServerFetching() 
      }, [onFetching]);
      useEffect(()=>{
        onFetching_filter && _ServerFetching_filter()
      },[onFetching_filter])
    useEffect(() => {
        sOnFetching(true) || (keySearch && sOnFetching(true))  || sOnFetching_filter(true) || idBranch != null && sOnFetching(true) ||  valueDate.startDate != null && valueDate.endDate != null && sOnFetching(true)
     }, [limit,router.query?.page,idBranch,valueDate.endDate, valueDate.startDate]);



     const multiDataSet = [
        // {
        //     columns: [
        //         {title: "ID", width: {wch: 4}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
        //         {title: `${dataLang?.warehouses_localtion_ware || "warehouses_localtion_ware"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
        //         {title: `${dataLang?.warehouses_localtion_code || "warehouses_localtion_code"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
        //         {title: `${dataLang?.warehouses_localtion_NAME || "warehouses_localtion_NAME"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
        //         {title: `${dataLang?.warehouses_localtion_status || "warehouses_localtion_status"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
        //         {title: `${dataLang?.warehouses_localtion_date || "warehouses_localtion_date"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                
               
        //     ],
        //     data: data_ex?.map((e) =>
        //         [
        //             {value: `${e.id}`, style: {numFmt: "0"}},
        //             {value: `${e.warehouse_name ? e.warehouse_name : ""}`},
        //             {value: `${e.code ? e.code : ""}`},
        //             {value: `${e.name ? e.name : ""}`},
        //             {value: `${e.status ? ( e.status == "1" ? "Đang sử dụng" : "Không sử dụng"):""}`},
        //             {value: `${e.date_create ? e.date_create :""}`}
        //         ]    
        //     ),
        // }
      ];
    return (
        <>
            <Head>
                <title>Kiểm kê kho</title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
              {data_export.length > 0 && <Popup_status className="hidden" data_export={data_export} dataLang={dataLang}/>}
        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
          <h6 className="text-[#141522]/40">{"Kiểm kê"}</h6>
          <span className="text-[#141522]/40">/</span>
          <h6>{"Kiểm kê kho"}</h6>
        </div>
        <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
          <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 h-[96%] overflow-hidden">
              <div className="flex justify-between">
                  <h2 className="text-2xl text-[#52575E]">{"Kiểm kê kho"}</h2>
                  <div className="flex justify-end items-center">
                  <Link href="/inventory/form" className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105 outline-none'>Tạo mới</Link>
                  </div>
              </div>             
              <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">
                <div className="xl:space-y-3 space-y-2">
                    <div className="bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2">
                    <div className='flex gap-2'>
                          <form className="flex items-center relative  w-[15vw]">
                            <IconSearch size={20} className="absolute left-3 z-10 text-[#cccccc]" />
                            <input
                                className=" relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10 pr-5 py-1.5 rounded-md w-[400px]"
                                type="text" 
                                onChange={_HandleOnChangeKeySearch.bind(this)} 
                                placeholder={dataLang?.branch_search}
                            />
                          </form>
                          <div className='ml-1 w-[15vw]'>
                              <Select 
                                  // options={listBr_filter}
                                  options={[{ value: '', label: 'Chi chọn nhánh', isDisabled: true }, ...listBr_filter]}
                                  onChange={onchang_filter.bind(this, "branch")}
                                  value={idBranch}
                                  placeholder={dataLang?.client_list_filterbrand} 
                                  hideSelectedOptions={false}
                                  isClearable={true}
                                  className="rounded-md bg-white  xl:text-base text-[14.5px] z-20" 
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
                          <div className='z-20 ml-1   w-[15vw]'>
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
                        </div>
                    </div>
                        <div className="flex space-x-2 items-center">
                        {
                          dataExcel?.length > 0 &&(
                            <ExcelFile filename="Trạng thái khách hàng" title="Ttkh" element={
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
                <div className="min:h-[500px] 2xl:h-[90%] xl:h-[69%] h-[82%] max:h-[800px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <div className="xl:w-[100%] w-[110%] pr-2">
                    <div className="grid grid-cols-11 sticky top-0 bg-white p-2 z-10 shadow">
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{"Ngày chứng từ"}</h4>   
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase  col-span-1 font-[300] text-center'>{"Mã chứng từ"}</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase  col-span-1 font-[300] text-center'>{"Kho hàng"}</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase  col-span-1 font-[300] text-center'>{"Tổng mặt hàng"}</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase  col-span-1 font-[300] text-center'>{"Tình trạng"}</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase  col-span-1 font-[300] text-center'>{"Người tạo"}</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase  col-span-1 font-[300] text-center'>{"Chi nhánh"}</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase  col-span-3 font-[300] text-center'>{"Ghi chú"}</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase  col-span-1 font-[300] text-center'>{"Thao tác"}</h4>
                            </div>
                    {onFetching ?
                      <Loading className="h-80"color="#0f4f9e" /> 
                      : 
                      data?.length > 0 ? 
                      (
                        <>
                          <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px]">                       
                          {(data?.map((e) => 
                            <div key={e?.id.toString()} className='grid grid-cols-11 hover:bg-slate-50 relative items-center'>
                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-1 text-center '>{e?.date != null ? moment(e?.date).format("DD/MM/YYYY, h:mm:ss") : ""}</h6> 
                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-1 text-center  text-[#0F4F9e] font-medium cursor-pointer'>{e?.code}</h6>
                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-1 text-left '>{e?.waidname}</h6>
                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-1 text-right '>{e?.total_item}</h6>
                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-1 text-center cursor-pointer'>
                                    <Popup
                                        className='dropdown-avt ' key={e?.staff_create_id}
                                      trigger={open => (<span className='border border-orange-500 text-orange-500 p-1 rounded-md'> {e?.adjusted.split("|||").length + " " + " Điều chỉnh"}</span>)}
                                      position="top center" on={['hover']} arrow={false}>
                                     <span className='bg-[#0f4f9e] text-white rounded p-1.5 '>{e?.adjusted?.split('|||')?.map(item => item?.split('--')[1])?.map(e => e).join(", ")} </span>
                                    </Popup>
                                 </h6>
                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-1  flex items-center space-x-2'><img src={e?.staff_create_image}  width={30} height={30} className="object-cover rounded-[100%] text-left"></img>  <span className=''>{e?.staff_create_name} </span></h6>
                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-1 text-center'><span className="mb-1 w-fit xl:text-base text-xs px-2 text-[#0F4F9E] font-[300] py-0.5 border border-[#0F4F9E] rounded-lg">{e?.branch_name}</span></h6>
                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-3 text-left'>{e?.note}</h6>
                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-1 text-center'><button 
                            onClick={()=> handleDelete(e.id)}
                            className="xl:text-base text-xs "><IconDelete color="red"/></button></h6>
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
                              <Link href="/inventory/form" className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105 outline-none'>Tạo mới</Link> 
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
        </>
    );
}

const Popup_status = (props) => {
    const dataLang = props?.dataLang
    const [onFetching, sOnFetching] = useState(false);
    const [open, sOpen] = useState(false);
    const [data,sData] = useState([])

    useEffect(() => {
      sOnFetching(true);
      sData([]);
      sOpen(false);
      if (props?.data_export?.length > 0) {
        sOnFetching(false);
        sOpen(true);
        sData(props?.data_export);
      }
    }, [props?.data_export]);

  return(
    <PopupEdit  
      title={"Các phiếu đã được xuất"} 
      open={open} 
      onClose={() => sOpen(false)}
      classNameBtn={props.className}
    >
      <div className="mt-4 space-x-5 w-[700px] h-auto">        
      <div className="min:h-[200px] h-[82%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <div className="pr-2 w-[100%] lx:w-[120%] ">
                    <div className="grid grid-cols-12 items-center sticky top-0 bg-white p-2 z-10 shadow">
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-4 font-[300] text-center'>{"Ngày chứng từ"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-4 font-[300] text-center'>{"Mã chứng từ"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-4 font-[300] text-center'>{"Phiếu kiểm kê"}</h4>
                    </div>
                    {onFetching ?
                      <Loading className="h-50"color="#0f4f9e" /> 
                      : 
                      data?.length > 0 ? 
                      (<>
                          <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px] ">                       
                          {(data?.map((e) => 
                                <div className='grid grid-cols-12 items-center py-1.5 px-2 hover:bg-slate-100/40 ' >
                                <h6 className='xl:text-base text-xs px-2 col-span-4 text-center'>{e?.date != null ? moment(e?.date).format("DD/MM/YYYY, HH:mm:ss") : ""}</h6>
                                <h6 className='xl:text-base text-xs px-2 col-span-4 text-center  hover:font-normal cursor-pointer'>{e?.code}</h6>
                                <h6 className='xl:text-base text-xs px-2 col-span-4 text-center  hover:font-normal cursor-pointer'>{dataLang[e?.type_text]}</h6>
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
    </PopupEdit>
  )
}


export default Index;