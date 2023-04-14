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


import { Edit as IconEdit,  Grid6 as IconExcel, Trash as IconDelete, SearchNormal1 as IconSearch,Add as IconAdd, LocationTick, User, House2  } from "iconsax-react";
import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import Pagination from '/components/UI/pagination';
import dynamic from 'next/dynamic';
import moment from 'moment/moment';
import Select,{components } from 'react-select';
import Popup from 'reactjs-popup';

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

    const dataLang = props.dataLang
    const router = useRouter();
    const [keySearch, sKeySearch] = useState("")
    const [limit, sLimit] = useState(15);
    const [totalItem, sTotalItems] = useState([]);
    const [onFetching, sOnFetching] = useState(false);
    const [data, sData] = useState({});
    const [data_ex, sData_ex] = useState([]);
    
    const _ServerFetching =  () => {
        Axios("GET", `/api_web/api_warehouse/warehouse/?csrf_protection=true`, {
            params: {
                search: keySearch,
                limit: limit,
                page: router.query?.page || 1,
                "filter[branch_id]": idBranch?.length > 0 ? idBranch.map(e => e.value) : null
            }
        }, (err, response) => {
            if(!err){
                var {rResult, output} =  response.data
                sData(rResult)
                sTotalItems(output)
                sData_ex(rResult)
            }
            sOnFetching(false)
        })
    }
    const [listBr, sListBr]= useState()
    const _ServerFetching_brand =  () =>{
      Axios("GET", `/api_web/Api_Branch/branch/?csrf_protection=true`, {
       params:{
        limit: 0,   
       }
    }, (err, response) => {
      if(!err){
          var {rResult, output} =  response.data
          sListBr(rResult)
      }
      sOnFetching(false)
    })
    }

    const listBr_filter = listBr?.map(e =>({label: e.name, value: e.id}))
    const [idBranch, sIdBranch] = useState(null);
    const onchang_filterBr = (type, value) => {
      if(type == "branch"){
        sIdBranch(value)
      }
    }
    const hiddenOptions = idBranch?.length > 3 ? idBranch?.slice(0, 3) : [];
    const options = listBr_filter ? listBr_filter?.filter((x) => !hiddenOptions.includes(x.value)) : []

    const paginate = pageNumber => {
        router.push({
            pathname: '/warehouses/warehouse',
            query: { page: pageNumber }
        })
      }
      const _HandleOnChangeKeySearch = ({target: {value}}) => {
        sKeySearch(value)
        router.replace('/warehouses/warehouse');
        setTimeout(() => {
          if(!value){
            sOnFetching(true)
          }
          sOnFetching(true)
        }, 500);
      };
    useEffect(() => {
        onFetching && _ServerFetching()    || onFetching && _ServerFetching_brand() 
      }, [onFetching]);
    useEffect(() => {
        sOnFetching(true) || (keySearch && sOnFetching(true)) || (idBranch?.length > 0 && sOnFetching(true))
     }, [limit,router.query?.page,idBranch]);
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
          Axios("DELETE",`/api_web/api_warehouse/warehouse/${id}?csrf_protection=true`, {
          }, (err, response) => {
            if(!err){
              var isSuccess = response.data
              if(isSuccess){
                Toast.fire({
                  icon: 'success',
                  title: dataLang?.aler_success_delete
                })     
              }
            }
            _ServerFetching()
          })     
        }
      })
    }
    //excel
    const multiDataSet = [
      {
          columns: [
              {title: "ID", width: {wch: 4}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.Warehouse_code || "Warehouse_code"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.Warehouse_poppup_name || "Warehouse_poppup_name"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.Warehouse_total || "Warehouse_total"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.Warehouse_inventory || "Warehouse_inventory"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.Warehouse_poppup_address || "Warehouse_poppup_address"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.client_popup_note || "client_popup_note"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.Warehouse_factory || "Warehouse_factory"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              
             
          ],
          data: data_ex?.map((e) =>
              [
                  {value: `${e.id}`, style: {numFmt: "0"}},
                  {value: `${e.code ? e.code : ""}`},
                  {value: `${e.name ? e.name : ""}`},
                  {value: `${"Tổng mặt hàng "}`},
                  {value: `${"Tổng tồn kho"}`},
                  {value: `${e.address ? e.address : ""}`},   
                  {value: `${e.note ? e.note : ""}`},   
                  {value: `${e.branch ? e.branch?.map(i => i.name) : ""}`},
              ]    
          ),
      }
    ];
 
    return (
        <React.Fragment>
      <Head>
        <title>{dataLang?.Warehouse_title}</title>
      </Head>
      <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
          <h6 className="text-[#141522]/40">{dataLang?.Warehouse_title}</h6>
          <span className="text-[#141522]/40">/</span>
          <h6>{dataLang?.Warehouse_title}</h6>
        </div>

        <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
          <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 h-[96%] overflow-hidden">
                <div className='flex justify-between'>
                    <h2 className="text-2xl text-[#52575E] capitalize">{dataLang?.Warehouse_title}</h2>
                    <div className="flex justify-end items-center">
                    <Popup_kho  listBr={listBr}   onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />
                  </div>
                </div>
                
               
              <div className="space-y-2 2xl:h-[95%] h-[93%] overflow-hidden">    
                <div className="xl:space-y-3 space-y-2">
                    <div className="bg-slate-100 w-full rounded flex justify-between items-center  xl:p-3 p-2">
                        <div className='flex gap-2'>
                          <form className="flex items-center relative">
                            <IconSearch size={20} className="absolute left-3 z-10 text-[#cccccc]" />
                            <input
                                className=" relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10 pr-5 py-1.5 rounded-md w-[400px]"
                                type="text" 
                                onChange={_HandleOnChangeKeySearch.bind(this)} 
                                placeholder={dataLang?.branch_search}
                            />
                          </form>
                          <div className='ml-1 w-[23vw]'>
                              {/* <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>{dataLang?.client_list_brand}</h6> */}
                              <Select 
                                  // options={options}
                                  options={[{ value: '', label: 'Chọn chi nhánh', isDisabled: true }, ...options]}
                                  onChange={onchang_filterBr.bind(this, "branch")}
                                  value={idBranch}
                                  hideSelectedOptions={false}
                                  isMulti
                                  isClearable={true}
                                  placeholder={dataLang?.client_list_filterbrand} 
                                  className="rounded-md bg-white  xl:text-base text-[14.5px] z-20" 
                                  isSearchable={true}
                                  noOptionsMessage={() => "Không có dữ liệu"}
                                  components={{ MultiValue }}
                                  closeMenuOnSelect={false}
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
                        </div>
                        <div className="flex space-x-2 items-center">
                     {
                      data_ex?.length > 0 &&(
                        <ExcelFile filename="Danh sách kho" title="Dsk" element={
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
                            <option value={-1}>Tất cả</option>
                          </select>
                        </div>
                    </div>
                </div>
                <div className="min:h-[500px] 2xl:h-[88%] xl:h-[85%] h-[100%] max:h-[800px]] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <div className="pr-2">
                    
                    {onFetching ?
                      <Loading className="h-80"color="#0f4f9e" /> 
                      : 
                      data?.length > 0 ? 
                      (<>
                          <div className="divide-y divide-slate-200 min:h-[400px] max:h-[1000px] h-[100%] ">                       
                          <div className='grid grid-cols-4 gap-5  p-1'>
                            {(data?.map((e) => 
                                    <div key={e?.id} className='bg-white flex flex-col justify-between   min-h-[250px] h-auto border-[0.5px] border-[#0F4F9E] hover:shadow-[0_0px_2px_0.5px_#0F4F9E]    rounded-2xl  overflow-hidden'>
                                       <div className=''>
                                            <div className='flex items-center justify-between gap-2 p-2'>
                                            <div className='flex items-center gap-2 '>
                                                    <House2 size="32" color="#0F4F9E"
                                                    />
                                                    <h3 className='text-[#0F4F9E] font-medium capitalize'>{e?.name}</h3>
                                            </div>
                                            <div>
                                            {e?.is_system === "1" && ( <h3 className='bg-[#EBFEF2] text-[#0BAA2E] rounded-lg font-normal p-1.5'>{dataLang?.Warehouse_system}</h3>)}
                                            </div>
                                            </div>
                                            <div className=''>
                                                <h3 className='font-normal mt-2.5 ml-2.5'>{dataLang?.Warehouse_code}: <span className=' text-[#0F4F9E] font-medium capitalize'>{e?.code}</span></h3>
                                                <h3 className='font-normal mt-2.5 ml-2.5'>{dataLang?.Warehouse_total}: <span className=' text-[#0F4F9E] font-medium capitalize'>{e?.code}</span></h3>
                                                <h3 className='font-normal mt-2.5 ml-2.5'>{dataLang?.Warehouse_inventory}: <span className=' text-[#0F4F9E] font-medium capitalize'>{e?.code}</span></h3>
                                                <h3 className='font-normal mt-2.5 ml-2.5'>{dataLang?.Warehouse_factory} <span className='flex flex-wrap pt-2'>{e?.branch?.map(e => {return (<span key={e?.id} className='mr-2 mb-1 w-fit xl:text-base text-xs px-2 text-[#0F4F9E] font-[300] py-0.5 border border-[#0F4F9E] rounded-[5.5px] capitalize'>{e.name}</span>)})}</span></h3>
                                            </div>
                                       </div>
                                            <div className='flex justify-between items-center p-2  mt-auto'>
                                                    <Link   href={`/warehouses/warehouse/${e?.id}`} className={`rounded-lg w-[80%]  p-2  cursor-pointer bg-[#e2f0fe] hover:bg-[#C7DFFB] text-center`}>
                                                        {dataLang?.Warehouse_detail}
                                                    </Link>
                                                 <div>
                                                 {
                                                    e?.is_system === "0" && (<div className='flex  gap-2 w-[20%]'>
                                                    <div className=''>
                                                        <Popup_kho
                                                        listBr={listBr} sValueBr={e.branch}  onRefresh={_ServerFetching.bind(this)} 
                                                        className="xl:text-base text-xs " 
                                                        dataLang={dataLang} name={e.name} code={e.code}
                                                        address={e.address} note={e.note} id={e?.id}  />
                                                    </div>
                                                    <div>
                                                    <button 
                                                    onClick={()=>handleDelete(e.id)} 
                                                    className="xl:text-base text-xs "><IconDelete color="red"/></button>
                                                    </div>
                                                    </div>)
                                                }
                                                 </div>
                                            </div>
                                    </div>
                              ))}      
                         </div>        
                        </div>                    
                        </>
                      )  : 
                      (
                        <div className=" max-w-[352px] mt-24 mx-auto" >
                          <div className="text-center">
                            <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                            <h1 className="textx-[#141522] text-base opacity-90 font-medium">Không tìm thấy các mục</h1>
                            <div className="flex items-center justify-around mt-6 ">
                                {/* <Popup_kho onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
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
const Popup_kho = (props) => {
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
      const menuPortalTarget = scrollAreaRef.current;
          return { menuPortalTarget };
      };

    const [onSending, sOnSending] = useState(false);
    const [brandpOpt, sListBrand] = useState([])
    const [name, sName] = useState("");
    const [code, sCode] = useState("");
    const [address, sAddress] = useState("");
    const [note, sNote] = useState("");

    const [errInputCode, sErrInputCode] = useState(false);
    const [errInputName, sErrInputName] = useState(false);
    const [errInputAddress, sErrInputAddress] = useState(false);
    const [errInputBr, sErrInputBr] = useState(false);
    const [valueBr, sValueBr] = useState([])
    // const branch = valueBr.map(e => e.value)

    useEffect(() => {
      sErrInputBr(false)
      sErrInputCode(false)
      sErrInputName(false)
      sErrInputAddress(false)
      sName(props.name ? props.name : "")
      sCode(props.code ? props.code : "")
      sAddress(props.address ? props.address : "")
      sNote(props.note ? props.note : "")
      sListBrand(props.listBr ? props.listBr && [...props.listBr?.map(e => ({label: e.name, value: Number(e.id)}))] : [])
      sValueBr(props.sValueBr ? props.listBr && [...props.sValueBr?.map(e => ({label: e.name, value: Number(e.id)}))] : [])
    }, [open]);
    const branch_id = valueBr?.map(e =>{
      return e?.value
    })
    const _HandleChangeInput = (type, value) => {
        if(type == "name"){
          sName(value.target?.value)
        }else if(type == "valueBr"){
          sValueBr(value)
        }else if(type == "code"){
          sCode(value.target?.value)
        }else if(type == "address"){
          sAddress(value.target?.value)
        }else if(type == "note"){
          sNote(value.target?.value)
        }
    }

  const _ServerSending = () => {
    const id =props.id;
    var data = new FormData();
    data.append('name', name);
    data.append('code', code);
    data.append('address', address);
    data.append('note', note);
    branch_id.forEach(id => data.append('branch_id[]', id));
    Axios("POST", `${props.id ? `/api_web/api_warehouse/warehouse/${id}?csrf_protection=true` : "/api_web/api_warehouse/warehouse/?csrf_protection=true"}`, {
        data:data,
      headers: {"Content-Type": "multipart/form-data"} 
    }, (err, response) => {
      if(!err){
            var {isSuccess, message} = response.data;
            if(isSuccess){
                Toast.fire({
                    icon: 'success',
                    title: `${props.dataLang[message]}`
                })
                sErrInputCode(false)
                sErrInputName(false)
                sErrInputAddress(false)
                sName("")
                sCode("")
                sAddress("")
                sNote("")
                sErrInputBr(false)
                sValueBr([])
                props.onRefresh && props.onRefresh()
                sOpen(false)
            }else{
              Toast.fire({
                icon: 'error',
                title: `${props.dataLang[message]}`
              })
            }
        }
        sOnSending(false)
    })
  }
//da up date
    useEffect(() => {
        onSending && _ServerSending()
    }, [onSending]);
    const _HandleSubmit = (e) => {
        e.preventDefault()
        if(code.length == 0 || branch_id?.length==0 || name.length == 0 || address.length ==0 ){
            code?.length ==0 &&  sErrInputCode(true)
            name?.length ==0 &&  sErrInputName(true)
            address?.length ==0 &&  sErrInputAddress(true)
          branch_id?.length==0 && sErrInputBr(true) 
            Toast.fire({
              icon: 'error',
              title: `${props.dataLang?.required_field_null}`
          })
        }else{
            // sErrInput(false)
            sOnSending(true)
        }
    }
    useEffect(() => {
        sErrInputCode(false) 
    }, [code.length > 0])
    useEffect(() => {
        sErrInputName(false) 
    }, [name.length > 0])
    useEffect(() => {
        sErrInputAddress(false) 
    }, [address.length > 0])
    useEffect(() => {
        sErrInputBr(false)
    }, [branch_id?.length > 0]);
  return(
      <>
      <PopupEdit   
        title={props.id ? `${props.dataLang?.Warehouse_poppup_edit}` : `${props.dataLang?.Warehouse_poppup_add}`} 
        button={props.id ? <IconEdit/> : `${props.dataLang?.branch_popup_create_new}`} 
        onClickOpen={_ToggleModal.bind(this, true)} 
        open={open} onClose={_ToggleModal.bind(this,false)}
        classNameBtn={props.className} 
      >

              <div className="mt-4">
                  <form onSubmit={_HandleSubmit.bind(this)} className="">
                      <ScrollArea ref={scrollAreaRef} className="h-[420px] overflow-hidden" speed={1} smoothScrolling={true}>
                  <div className='w-[30vw] '>         
                      <div className="flex flex-wrap justify-between "> 
                        <div className='w-full'>
                            <div>
                              <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.Warehouse_poppup_code}<span className="text-red-500">*</span></label>
                             <input
                                value={code}                
                                onChange={_HandleChangeInput.bind(this, "code")}
                                placeholder={props.dataLang?.Warehouse_poppup_code}
                                name="fname"                      
                                type="text"
                                className={`${errInputCode ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                              />
                              {errInputCode && <label className="mb-4  text-[14px] text-red-500">{props.dataLang?.Warehouse_poppup_errcode}</label>}
                             </div>
                             <div>
                              <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.Warehouse_poppup_name}<span className="text-red-500">*</span></label>
                             <input
                                value={name}                
                                onChange={_HandleChangeInput.bind(this, "name")}
                                placeholder={props.dataLang?.Warehouse_poppup_name}
                                name="fname"                      
                                type="text"
                                className={`${errInputName ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                              />
                              {errInputName && <label className="mb-4  text-[14px] text-red-500">{props.dataLang?.Warehouse_poppup_errname}</label>}
                             </div>
                             <div>
                              <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.Warehouse_poppup_address}<span className="text-red-500">*</span></label>
                             <input
                                value={address}                
                                onChange={_HandleChangeInput.bind(this, "address")}
                                placeholder={props.dataLang?.Warehouse_poppup_address}
                                name="fname"                      
                                type="text"
                                className={`${errInputAddress ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                              />
                              {errInputAddress && <label className="mb-4  text-[14px] text-red-500">{props.dataLang?.Warehouse_poppup_erraddress}</label>}
                             </div>  
                         <div>
                           <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_list_brand} <span className="text-red-500">*</span></label>
                              <Select   
                                 closeMenuOnSelect={false}
                                  placeholder={props.dataLang?.client_list_brand}
                                  options={brandpOpt}
                                  isSearchable={true}
                                  onChange={_HandleChangeInput.bind(this, "valueBr")}
                                  isMulti
                                  noOptionsMessage={() => "Không có dữ liệu"}
                                  value={valueBr}
                                  maxMenuHeight="200px"
                                  isClearable={true} 
                                 menuPortalTarget={document.body}
                                onMenuOpen={handleMenuOpen}
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
                                    // control: base => ({
                                    //   ...base,
                                    //   border: '1px solid #d0d5dd',
                                    //   boxShadow: 'none',
                                     
                                    // })  ,
                                    control: (provided) => ({
                                      ...provided,
                                      border: '1px solid #d0d5dd', 
                                      "&:focus":{
                                        outline:"none",
                                        border:"none"
                                      }
                                    })
                                }}
                                className={`${errInputBr ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
                              />
                              {errInputBr && <label className="mb-2  text-[14px] text-red-500">{props.dataLang?.client_list_bran}</label>}
                           </div>
                           </div>
                            <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_popup_note}</label>
                                <textarea
                                value={note}       
                                placeholder={props.dataLang?.client_popup_note}         
                                onChange={_HandleChangeInput.bind(this, "note")}
                                name="fname"                      
                                type="text"
                                className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[80px] max-h-[150px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
                                />
                          </div>
                    </div>
                  </ScrollArea>
                  
                  <div className="text-right mt-5 space-x-2">
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
// const Popup_chitiet =(props)=>{
//   const scrollAreaRef = useRef(null);
//   const [open, sOpen] = useState(false);
//   const _ToggleModal = (e) => sOpen(e);
//   const [tab, sTab] = useState(0)
//   const _HandleSelectTab = (e) => sTab(e)
//   const [data,sData] =useState()
//   const [onFetching, sOnFetching] = useState(false);
//   useEffect(() => {
//     props?.id && sOnFetching(true) 
//   }, [open]);
//   const _ServerFetching_detailUser = () =>{
//     Axios("GET", `/api_web/api_client/client/${props?.id}?csrf_protection=true`, {}, (err, response) => {
//     if(!err){
//         var db =  response.data

//         sData(db)
//     }
//     sOnFetching(false)
//   })
//   }
//   useEffect(() => {
//     onFetching && _ServerFetching_detailUser()
//   }, [open]);
// return (
// <>
//  <PopupEdit   
//     title={props.dataLang?.client_popup_detailUser} 
//     button={props?.name} 
//     onClickOpen={_ToggleModal.bind(this, true)} 
//     open={open} onClose={_ToggleModal.bind(this,false)}
//     classNameBtn={props?.className} 
//   >
//   <div className='flex items-center space-x-4 my-3 border-[#E7EAEE] border-opacity-70 border-b-[1px]'>
//       <button onClick={_HandleSelectTab.bind(this, 0)} className={`${tab === 0 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "}  px-4 py-2 outline-none font-semibold`}>{props.dataLang?.client_popup_general}</button>
//       <button onClick={_HandleSelectTab.bind(this, 1)} className={`${tab === 1 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "}  px-4 py-2 outline-none font-semibold`}>{props.dataLang?.client_popup_detailContact}</button>
//   </div>  
//           <div className="mt-4 space-x-5 w-[930px] h-auto  ">        
//               {
//                 tab === 0 &&(
//                 <ScrollArea ref={scrollAreaRef}
//                 className="h-[auto] overflow-hidden " 
//                 speed={1} 
//                 smoothScrolling={true}>
//                   {onFetching ?
//                   <Loading className="h-80"color="#0f4f9e" /> 
//                   : data !="" &&(
//                   <div className="flex gap-5 rounded-md ">
//                     <div className='w-[50%] bg-slate-100/40 rounded-md'>
//                       <div className='mb-4 h-[50px] flex justify-between items-center p-2'><span className='text-slate-400 text-sm w-[25%]'>{props.dataLang?.client_list_namecode}:</span> <span className='font-normal capitalize'>{data?.code}</span></div>
//                       <div className='mb-4 flex justify-between flex-wrap p-2'><span className='text-slate-400 text-sm      w-[25%]'>{props.dataLang?.client_list_name}:</span> <span className='font-normal capitalize'>{data?.name}</span></div>
//                       <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm   w-[25%]'>{props.dataLang?.client_list_repre}:</span> <span className='font-normal capitalize'>{data?.representative}</span></div>
//                       <div className='mb-4 flex justify-between  items-center p-2'><span className='text-slate-400 text-sm  w-[25%]'>{props.dataLang?.client_popup_mail}:</span> <span className='font-normal'>{data?.email}</span></div>
//                       <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm   w-[25%]'>{props.dataLang?.client_popup_phone}:</span> <span className='font-normal capitalize'>{data?.phone_number}</span></div>
//                       <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm   w-[25%]'>{props.dataLang?.client_list_taxtcode}:</span> <span className='font-normal capitalize'>{data?.tax_code}</span></div>
//                       <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm   w-[25%]'>{props.dataLang?.client_popup_adress}:</span> <span className='font-normal capitalize'>{data?.address}</span></div> 
//                       <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm   w-[25%]'>{props.dataLang?.client_popup_note}: </span> <span className='font-medium capitalize'>{data?.note}</span></div>
                     
//                     </div>
//                     <div className='w-[50%] bg-slate-100/40'>
                      
//                       <div className='mb-4 min-h-[50px] max-h-[auto] flex  p-2 justify-between  items-center flex-wrap'><span className='text-slate-400 text-sm'>{props.dataLang?.client_popup_char}:</span> 
//                       <span className='flex flex-wrap'>{data?.staff_charge?.map(e=>{ return (
//                         <span className='font-normal capitalize   ml-1'>
//                           <Popup className='dropdown-avt' key={e.id}
//                                   trigger={open => (<img src={e.profile_image}  width={40} height={40} className="object-cover rounded-[100%]"></img>)}
//                                   position="top center" on={['hover']} arrow={false}>
//                             <span className='bg-[#0f4f9e] text-white rounded p-1.5'>{e.full_name} </span>
//                           </Popup>  
//                         </span>)})}
//                       </span>
//                       </div>
//                       <div className='mb-4 flex justify-between  p-2 items-center flex-wrap'><span className='text-slate-400 text-sm'>{props.dataLang?.client_list_brand}:</span> <span className='flex justify-between space-x-1'>{data?.branch?.map(e=>{ return (<span  className='last:ml-0 font-normal capitalize  w-fit xl:text-base text-xs px-2 text-[#0F4F9E] border border-[#0F4F9E] rounded-[5.5px]'> {e.name}</span>)})}</span></div>
//                       <div className='mb-4 justify-between  items-center p-2 flex space-x-2'><span className='text-slate-400 text-sm'>{props.dataLang?.client_list_group}:</span> <span className='flex justify-between space-x-1'>{data?.client_group?.map(e=>{ return (<span style={{ backgroundColor: `${e.color == "" ? "#e2f0fe" : e.color}`, color: `${e.color == "" ? "#0F4F9E" : "white"}`}} className="last:ml-0 font-normal capitalize  w-fit xl:text-base text-xs px-2   rounded-[5.5px]">{e.name} </span>)})}</span></div>
//                       <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm'>{props.dataLang?.client_popup_limit}:</span> <span className='font-normal capitalize'>{data?.debt_limit}</span></div>
//                       <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm'>{props.dataLang?.client_popup_days}:</span> <span className='font-normal capitalize'>{data?.debt_limit_day}</span></div>
//                       {/* <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm'>{props.dataLang?.client_popup_date}:</span> <span className='font-normal capitalize'>{moment(data?.date_create).format("DD/MM/YYYY")}</span></div> */}
//                       <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm'>{props.dataLang?.client_popup_city}:</span> <span className='font-normal capitalize'>{data?.city != "" ?(data?.city.type+" "+data?.city.name) :""}</span></div>                        
//                       <div className='mb-4 flex justify-between p-2 items-center'><span className='text-slate-400 text-sm'>{props.dataLang?.client_popup_district}: </span><span className='font-normal capitalize'>{data?.district != "" ?(data?.district.type+" "+data?.district.name):""}</span>,<span  className='text-slate-400 text-sm'>{props.dataLang?.client_popup_wards}:</span><span className='font-normal capitalize'>{data?.ward != "" ? (data?.ward.type+" "+data?.ward.name) :""}</span></div>
                     
//                     </div>
//                   </div>)
//                   }
//                 </ScrollArea>
//                 )
//               }   
//        { tab === 1 && (
//         <div>
//            <div className='w-[930px]'>
//              <div className="min:h-[200px] h-[72%] max:h-[400px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
//               <div className="pr-2 w-[100%] lx:w-[110%] ">
//                 <div className="flex items-center sticky top-0 bg-slate-100 p-2 z-10">
//                   <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[400] text-left">{props.dataLang?.client_popup_detailName}</h4>
//                   <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[400] text-center">{props.dataLang?.client_popup_phone}</h4>
//                   <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[400] text-left">{props.dataLang?.client_popup_mail}</h4>
//                   <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[400] text-left">{props.dataLang?.client_popup_position}</h4> 
//                   <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[400] text-left">{props.dataLang?.client_popup_birthday}</h4>
//                   <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[400] text-left">{props.dataLang?.client_popup_adress}</h4>
//                 </div>
//                 {onFetching ?
//                   <Loading className="h-80"color="#0f4f9e" /> 
//                   : 
//                   data?.contact?.length > 0 ? 
//                   (<>
//                        <ScrollArea     
//                          className="min-h-[455px] max-h-[455px] overflow-hidden"  speed={1}  smoothScrolling={true}>
//                     <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[500px]">                       
//                       {(data?.contact?.map((e) => 
//                         <div className="flex items-center py-1.5 px-2 hover:bg-slate-100/40 " key={e.id.toString()}>
//                           <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-left">{e.full_name}</h6>                
//                           <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-center">{e.phone_number}</h6>                
//                           <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[15%]  rounded-md text-left break-words">{e.email}</h6>                
//                           <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[10%]  rounded-md text-left break-words">{e.position}</h6>                
//                           <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[15%]  rounded-md text-left">{e.birthday != "0000-00-00" ? moment(e.birthday).format("DD-MM-YYYY") : ""}</h6>                
//                           <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-left">{e.address}</h6>                
//                         </div>
//                       ))}              
//                     </div>   
//                       </ScrollArea>                       
//                     </>
//                   )  : 
//                   (
//                     <div className=" max-w-[352px] mt-24 mx-auto" >
//                       <div className="text-center">
//                         <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
//                         <h1 className="textx-[#141522] text-base opacity-90 font-medium">Không tìm thấy các mục</h1>
//                         <div className="flex items-center justify-around mt-6 ">
//                             {/* <Popup_kho onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
//                         </div>
//                       </div>
//                     </div>
//                   )}    
//               </div>
//             </div>
//           </div>
    
//      </div>
//     ) }
//     </div>    
//   </PopupEdit>
// </>
// )
// }
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