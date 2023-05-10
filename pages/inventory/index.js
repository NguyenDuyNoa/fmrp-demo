import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import ReactExport from "react-data-export";
import {_ServerInstance as Axios} from '/services/axios';
import moment from 'moment/moment';
import Popup from 'reactjs-popup';
import Pagination from '/components/UI/pagination';
import Swal from "sweetalert2";
import Select,{components} from "react-select"
import 'react-datepicker/dist/react-datepicker.css';
import Datepicker from 'react-tailwindcss-datepicker';
import ModalImage from "react-modal-image";


import { 
    SearchNormal1 as IconSearch,Grid6 as IconExcel,ArrowDown2 as IconDown,Trash as IconDelete, Flag, TickCircle
} from "iconsax-react";

import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import { useRef } from 'react';

const ScrollArea = dynamic(() => import("react-scrollbar"), {
  ssr: false,
});

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
        {
            columns: [
                {title: "ID", width: {wch: 4}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${"Ngày chứng từ"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${"Mã chứng từ"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${"Kho hàng"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${"Tổng mặt hàng"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${"Tình trạng"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${"Người tạo"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${"Chi nhánh"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${"Ghi chú"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
            ],
            data: dataExcel?.map((e) =>
                [
                  {value: `${e?.id ? e.id : ""}`, style: {numFmt: "0"}},
                  {value: `${e?.date ? e?.date : ""}`},
                  {value: `${e?.code ? e?.code : ""}`},
                  {value: `${e?.waidname ? e?.waidname : ""}`},
                  {value: `${e?.total_item ? e?.total_item : ""}`},
                  {value: `${e?.adjusted ? e?.adjusted?.split('|||')?.map(item => item?.split('--')[1])?.map(e => e).join(", ") : ""}`},
                  {value: `${e?.staff_create_name ? e?.staff_create_name : ""}`},
                  {value: `${e?.branch_name ? e?.branch_name : ""}`},
                  {value: `${e?.note ? e?.note : ""}`},
                ]    
            ),
        }
      ];
    return (
        <>
            <Head>
                <title>{dataLang?.inventory_title || "inventory_title"}</title>
            </Head>
      <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">{data_export.length > 0 && <Popup_status className="hidden" data_export={data_export} dataLang={dataLang}/>}
        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
          <h6 className="text-[#141522]/40">{dataLang?.inventory_title_head || "inventory_title_head"}</h6>
          <span className="text-[#141522]/40">/</span>
          <h6>{dataLang?.inventory_title || "inventory_title"}</h6>
        </div>
        <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
          <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden pb-1">
            <div className="space-y-3 h-[96%] overflow-hidden">
              <div className="flex justify-between">
                  <h2 className="text-2xl text-[#52575E]">{dataLang?.inventory_title || "inventory_title"}</h2>
                  <div className="flex justify-end items-center">
                  <Link href="/inventory/form" className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105 outline-none'>{dataLang?.inventory_add || "inventory_add"}</Link>
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
                                  options={[{ value: '', label: dataLang?.inventory_choosebranch || "inventory_choosebranch", isDisabled: true }, ...listBr_filter]}
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
                          <div className='z-20 ml-1 w-[15vw]'>
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
                            <ExcelFile filename="Danh sách kiểm kê kho" title="Dskkk" element={
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
                        <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[300] text-center'>{dataLang?.inventory_dayvouchers || "inventory_dayvouchers"}</h4>   
                        <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase  col-span-1 font-[300] text-center'>{dataLang?.inventory_vouchercode || "inventory_vouchercode"}</h4>
                        <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase  col-span-1 font-[300] text-center'>{dataLang?.inventory_warehouse || "inventory_warehouse"}</h4>
                        <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase  col-span-1 font-[300] text-center'>{dataLang?.inventory_total_item || "inventory_total_item"}</h4>
                        <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase  col-span-1 font-[300] text-center'>{dataLang?.inventory_status || "inventory_status"}</h4>
                        <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase  col-span-1 font-[300] text-center'>{dataLang?.inventory_creator || "inventory_creator"}</h4>
                        <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase  col-span-1 font-[300] text-center'>{dataLang?.inventory_branch || "inventory_branch"}</h4>
                        <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase  col-span-3 font-[300] text-center'>{dataLang?.inventory_note || "inventory_note"}</h4>
                        <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase  col-span-1 font-[300] text-center'>{dataLang?.inventory_operatione || "inventory_operatione"}</h4>
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
                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-1 text-center text-[#0F4F9E]  font-medium cursor-pointer'><Popup_chitiet dataLang={dataLang} className="text-left" name={e?.code} id={e?.id}/></h6>
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
                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs col-span-1 text-center'><button  onClick={()=> handleDelete(e.id)} className="xl:text-base text-xs "><IconDelete color="red"/></button></h6>
                          </div>
                          ))}              
                        </div>                     
                        </>
                      )  : 
                      (
                        <div className=" max-w-[352px] mt-24 mx-auto" >
                          <div className="text-center">
                            <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                            <h1 className="textx-[#141522] text-base opacity-90 font-medium">{dataLang?.inventory_notfound || "inventory_notfound"}</h1>
                            <div className="flex items-center justify-around mt-6 ">
                              <Link href="/inventory/form" className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105 outline-none'>{dataLang?.inventory_add || "inventory_add"}</Link> 
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
    Axios("GET", `/api_web/api_inventory/inventory/${props?.id}`, {}, (err, response) => {
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

  //copy arr
  let listQty = data?.items || []
  //Tổng số lượng trong kho lúc kiểm kê
  let totalQuantity = listQty?.reduce((acc, item) => acc + parseInt(item?.quantity), 0);
  //Tổng số lượng thực
  let quantity_net = listQty?.reduce((acc, item) => acc + parseInt(item?.quantity_net), 0);
  //Tổng số lượng chênh lệch
  let quantity_diff = listQty?.reduce((acc, item) => acc + parseInt(item?.quantity_diff), 0);
  //Thành tiền
  let amount = listQty?.reduce((acc, item) => acc + parseInt(item?.amount), 0);


return (
<>
 <PopupEdit   
    title={props.dataLang?.inventory_title_detail || "inventory_title_detail"} 
    button={props?.name} 
    onClickOpen={_ToggleModal.bind(this, true)} 
    open={open} onClose={_ToggleModal.bind(this,false)}
    classNameBtn={props?.className} 
  >
        <div className="mt-4 space-x-5 w-[1200px] h-auto">        
          <div>
           <div className='w-[1200px]'>
             <div className="min:h-[170px] h-[72%] max:h-[100px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
             <h2 className='font-normal bg-[#ECF0F4] p-2'>{props?.dataLang?.purchase_general || "purchase_general"}</h2>       
              <div className='grid grid-cols-12 gap-2  min-h-[170px] p-2'>
                  <div className='col-span-4'>
                      <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.inventory_dayvouchers || "inventory_dayvouchers"}</h3><h3 className='col-span-1 font-normal'>{data?.date != null ? moment(data?.date).format("DD/MM/YYYY") : ""}</h3></div>
                      <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.inventory_vouchercode || "inventory_vouchercode"}</h3><h3 className='col-span-1 font-normal'>{data?.code}</h3></div>
                     <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.inventory_creator || "inventory_creator"}</h3><h3 className='flex items-center gap-1 col-span-1'><img src={data?.staff_create_image}  width={30} height={30} className="object-cover rounded-[100%] text-left"></img>  <span className='font-normal'>{data?.staff_create_name} </span></h3></div>
                  </div>
                  <div className='col-span-4 '>
                    <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.inventory_warehouse || "inventory_warehouse"}</h3><h3 className='col-span-1 font-normal'>{data?.warehouse_name}</h3></div>
                    <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.inventory_total_item || "inventory_total_item"}</h3><h3 className='col-span-1 font-normal'>{data?.total_item}</h3></div>
                    <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.inventory_status || "inventory_status"}</h3>
                      <h3 className='col-span-1 cursor-pointer'>
                        <Popup
                          className='dropdown-avt ' key={data?.staff_create_id}
                          trigger={open => (<span className='border border-orange-500 text-orange-500 p-1 rounded-md'> {data?.adjusted ? data?.adjusted.split("|||").length + " " + " Điều chỉnh" : ""}</span>)}
                          position="top center" on={['hover']} arrow={false}>
                          <span className='bg-[#0f4f9e] text-white rounded p-1.5 '>{data?.adjusted?.split('|||')?.map(item => item?.split('--')[1])?.map(e => e).join(", ")} </span>
                        </Popup>
                      </h3>
                    </div>
                  </div>
                  <div className='col-span-4 '>
                      <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.inventory_note || "inventory_note"}</h3><h3 className='col-span-1 font-normal'>{data?.note}</h3></div>
                      <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.inventory_branch || "inventory_branch"}</h3><h3 className="mr-2 mb-1 w-fit xl:text-base text-xs px-2 text-[#0F4F9E] font-[400] py-0.5 border border-[#0F4F9E] rounded-[5.5px] col-span-1">{data?.branch_name}</h3></div>
                  </div>
              </div>
              <div className="pr-2 w-[100%] lx:w-[110%] ">
                <div className="grid grid-cols-12 sticky top-0 bg-slate-100 p-2 z-10">
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.inventory_image || "inventory_image"}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.inventory_items || "inventory_items"}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-2 font-[400] text-center">{props.dataLang?.inventory_variant || "inventory_variant"}</h4> 
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.inventory_unit || "inventory_unit"}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.inventory_unit_price || "inventory_unit_price"}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.inventory_warehouse_location || "inventory_warehouse_location"}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.inventory_qty_inventory || "inventory_qty_inventory"}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.inventory_actual_quantity || "inventory_actual_quantity"}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.inventory_qty_difference || "inventory_qty_difference"}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.inventory_qty_into_money || "inventory_qty_into_money"}</h4> 
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.inventory_handle || "inventory_handle"}</h4> 
                </div>
                {onFetching ?
                  <Loading className="h-20 2xl:h-[160px]"color="#0f4f9e" /> 
                  : 
                  data?.items?.length > 0 ? 
                  (<>
                       <ScrollArea     
                         className="min-h-[90px] max-h-[200px] 2xl:max-h-[250px] overflow-hidden"  speed={1}  smoothScrolling={true}>
                    <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">                       
                      {(data?.items?.map((e) => 
                        <div className="grid items-center grid-cols-12 py-1.5 px-2 hover:bg-slate-100/40 " key={e.id.toString()}>
                          <h6 className="xl:text-base text-xs   py-0.5 col-span-1  rounded-md text-left">
                          {e?.item?.images != null ? (<ModalImage  small={e?.item?.images} large={e?.item?.images} alt="Product Image" style={{ width: "50px", height: "60px" }} className='object-cover rounded' />):
                            <div className='w-[50px] h-[60px] object-cover  flex items-center justify-center rounded'>
                              <ModalImage small="/no_img.png" large="/no_img.png" className='w-full h-full rounded object-contain p-1' > </ModalImage>
                            </div>
                          }
                          </h6>   
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1 text-left">{e?.item?.name}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-2 text-left break-words">{e?.item?.product_variation + " - " + props.dataLang[e?.item?.text_type]}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1 text-center break-words">{e?.item?.unit_name}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1 text-right">{e?.price}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1 text-right ">{e?.name_location}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1 text-right">{e?.quantity}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1 text-right">{e?.quantity_net}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1 text-right">{e?.quantity_diff}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1 text-right">{e?.amount}</h6>                
                          <h6 className={`${e?.handling != "" ? "text-left xl:text-base text-xs px-2 py-0.5 col-span-1" : "text-right xl:text-base text-xs  px-2 py-0.5 col-span-1"}`}>{e?.handling != "" && props.dataLang[e?.handling]}{" "}{ Math.abs(e?.quantity_diff)}</h6>                
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
                        <h1 className="textx-[#141522] text-base opacity-90 font-medium">{props.dataLang?.inventory_notfound || "inventory_notfound"}</h1>
                        <div className="flex items-center justify-around mt-6 ">
                            {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                        </div>
                      </div>
                    </div>
                  )}    
              </div>
          <h2 className='font-normal p-2  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]'>{props.dataLang?.purchase_total || "purchase_total"}</h2>  
              <div className="text-right mt-5  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10">
              <div className='col-span-9'>
              </div>
             <div className='col-span-3 space-y-2'>
              <div className='flex justify-between '>
                  <div className='font-normal'><h3 className='text-left'>{props.dataLang?.inventory_total_quantity_inventory || "inventory_total_quantity_inventory"}</h3></div>
                  <div className='font-normal'><h3 className='text-blue-600 text-right'>{totalQuantity}</h3></div>
                </div>
                <div className='flex justify-between '>
                  <div className='font-normal'><h3 className='text-left'>{props.dataLang?.inventory_actual_total_amount || "inventory_actual_total_amount"}</h3></div>
                  <div className='font-normal'><h3 className='text-blue-600 text-right'>{quantity_net}</h3></div>
                </div>  
                <div className='flex justify-between '>
                  <div className='font-normal'><h3 className='text-left'>{props.dataLang?.inventory_total_amount_difference || "inventory_total_amount_difference"}</h3></div>
                  <div className='font-normal'><h3 className='text-blue-600 text-right'>{quantity_diff}</h3></div>
                </div>  
                <div className='flex justify-between '>
                  <div className='font-normal'><h3 className='text-left'>{props.dataLang?.inventory_qty_into_money || "inventory_qty_into_money"}</h3></div>
                  <div className='font-normal'><h3 className='text-blue-600 text-right'>{amount}</h3></div>
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

//data nào có phiếu rồi là không được xóa, hiện table
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
      title={props.dataLang?.inventory_votes || "inventory_votes"} 
      open={open} 
      onClose={() => sOpen(false)}
      classNameBtn={props.className}
    >
      <div className="mt-4 space-x-5 w-[700px] h-auto">        
      <div className="min:h-[200px] h-[82%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <div className="pr-2 w-[100%] lx:w-[120%] ">
                    <div className="grid grid-cols-12 items-center sticky top-0 bg-white p-2 z-10 shadow">
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-4 font-[300] text-center'>{props.dataLang?.inventory_dayvouchers || "inventory_dayvouchers"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-4 font-[300] text-center'>{props.dataLang?.inventory_vouchercode || "inventory_vouchercode"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-4 font-[300] text-center'>{props.dataLang?.inventory_inventory_slip || "inventory_inventory_slip"}</h4>
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