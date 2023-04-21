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
    const [idKho, sIdKho] = useState(null);
    const [onSending, sOnSending] = useState(false);
    const _ServerFetching =  () => {
        Axios("GET", `/api_web/api_warehouse/location/?csrf_protection=true`, {
            params: {
                search: keySearch,
                limit: limit,
                page: router.query?.page || 1,
                "filter[warehouse_id]": idKho ? idKho?.value : null
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
    const [listKho, sListKho]= useState()
    const _ServerFetching_kho =  () =>{
      Axios("GET", `/api_web/api_warehouse/warehouse/?csrf_protection=true`, {
       params:{
        limit: 0,  
        "filter[is_system]":2 
       }
    }, (err, response) => {
      if(!err){
          var {rResult, output} =  response.data
          sListKho(rResult)
      }
      sOnFetching(false)
    })
    }

    const listKho_filter = listKho ? listKho?.map(e =>({label: e.name, value: e.id})) : []
    const onchang_filterKho = (type, value) => {
      if(type == "kho"){
        sIdKho(value)
      }
    }
    
    useEffect(() => {
        onFetching && _ServerFetching() || onFetching && _ServerFetching_kho() 
      }, [onFetching]);
    useEffect(() => {
        sOnFetching(true) || (keySearch && sOnFetching(true)) || (idKho && sOnFetching(true))
     }, [limit,router.query?.page,idKho]);
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
          Axios("DELETE",`/api_web/api_warehouse/location/${id}?csrf_protection=true`, {
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

    const [status, sStatus] = useState("")
    const [active,sActive] = useState("")
    const _ToggleStatus = (id) => {
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
          sActive(id)
          var index = data.findIndex(x => x.id === id);
          if (index !== -1 && data[index].status === "0") {
           sStatus(data[index].status = "1")
          
          }else if (index !== -1 && data[index].status === "1") {
          
            sStatus(data[index].status = "0")
           
          }
          sData([...data])
        }
       
      })
     
    }
    const _ServerSending =  () => {
      let id = active
      var data = new FormData();
      data.append('status', status);   
      Axios("POST",`${id && `/api_web/api_warehouse/locationStatus/${id}?csrf_protection=true`}`, {
          data:{
            status:status
          },
          headers: {"Content-Type": "multipart/form-data"} 
      }, (err, response) => {
          if(!err){
              var {isSuccess, message, } = response.data;  
              if(isSuccess){
                  Toast.fire({
                      icon: 'success',
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
  
  useEffect(()=>{
     sOnSending(true)
  },[status])
  useEffect(()=>{
     sOnSending(true)
  },[active])


    const paginate = pageNumber => {
      router.push({
          pathname: '/warehouses/localtion',
          query: { page: pageNumber }
      })
    }
    const _HandleOnChangeKeySearch = ({target: {value}}) => {
      sKeySearch(value)
      router.replace('/warehouses/localtion');
      setTimeout(() => {
        if(!value){
          sOnFetching(true)
        }
        sOnFetching(true)
      }, 500);
    };
    //excel
    const multiDataSet = [
      {
          columns: [
              {title: "ID", width: {wch: 4}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.warehouses_localtion_ware || "warehouses_localtion_ware"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.warehouses_localtion_code || "warehouses_localtion_code"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.warehouses_localtion_NAME || "warehouses_localtion_NAME"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.warehouses_localtion_status || "warehouses_localtion_status"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.warehouses_localtion_date || "warehouses_localtion_date"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              
             
          ],
          data: data_ex?.map((e) =>
              [
                  {value: `${e.id}`, style: {numFmt: "0"}},
                  {value: `${e.warehouse_name ? e.warehouse_name : ""}`},
                  {value: `${e.code ? e.code : ""}`},
                  {value: `${e.name ? e.name : ""}`},
                  {value: `${e.status ? ( e.status == "1" ? "Đang sử dụng" : "Không sử dụng"):""}`},
                  {value: `${e.date_create ? e.date_create :""}`}
              ]    
          ),
      }
    ];
    return (
        <React.Fragment>
      <Head>
        <title>{dataLang?.warehouses_localtion_title}</title>
      </Head>
      <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
          <h6 className="text-[#141522]/40">{dataLang?.warehouses_localtion_title}</h6>
          <span className="text-[#141522]/40">/</span>
          <h6>{dataLang?.warehouses_localtion_title}</h6>
        </div>

        <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
          <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 h-[96%] overflow-hidden">
                <div className='flex justify-between'>
                    <h2 className="text-2xl text-[#52575E] capitalize">{dataLang?.warehouses_localtion_title}</h2>
                    <div className="flex justify-end items-center">
                    <Popup_Vitrikho  listKho={listKho}   onRefresh={_ServerFetching.bind(this)}  dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />
                  </div>
                </div>
                
                {/* <div className='ml-1 w-[20%]'>
                <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>{"Kho"}</h6>
                <Select 
                    options={listKho_filter}
                    onChange={onchang_filterKho.bind(this, "kho")}
                    value={idKho}
                    hideSelectedOptions={false}
                    isClearable={true}
                    placeholder={"Chọn kho"} 
                    className="rounded-md py-0.5 bg-white border-none xl:text-base text-[14.5px] z-20" 
                    isSearchable={true}
                    noOptionsMessage={() => "Không có dữ liệu"}
                    components={{ MultiValue }}
                    closeMenuOnSelect={false}
                    isMulti
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary25: '#EBF5FF',
                            primary50: '#92BFF7',
                            primary: '#0F4F9E',
                        },
                    })}
                   />
                </div> */}
              <div className="space-y-2 2xl:h-[100%] h-[75%] overflow-hidden">    
                <div className="xl:space-y-3 space-y-2">
                    <div className="bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2">
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
                            
                              <Select 
                                 placeholder={
                                   "Chọn kho"
                                  }
                                  menuPlacement="auto"
                                  aria-label={"Chọn kho"}
                                  options={[{ value: '', label: 'Chọn kho', isDisabled: true }, ...listKho_filter]}
                                  onChange={onchang_filterKho.bind(this, "kho")}
                                  value={idKho}
                                  hideSelectedOptions={false}
                                  // isMulti
                                  isClearable={true}
                                  className="rounded-md bg-white  xl:text-base text-[14.5px] z-20" 
                                  isSearchable={true}
                                  noOptionsMessage={() => "Không có dữ liệu"}
                                  components={{ MultiValue }}
                                  // closeMenuOnSelect={false}
                                  menuPosition="fixed"
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
                                    placeholder: (base,state) => ({
                                    ...base,
                                    color: "#cbd5e1",
                                    
                                    }), menu: (base) => ({
                                      ...base,
                                      marginTop: "8px", // Khoảng cách giữa placeholder và option
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
                                >
                              </Select>
                        </div>
                        </div>
                        
                        <div className="flex space-x-2 items-center">
                     {
                      data_ex?.length > 0 &&(
                        <ExcelFile filename="Vị trí kho" title="Vtk" element={
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
                <div className="min:h-[500px] 2xl:h-[85%] xl:h-[69%] h-[100%] max:h-[800px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <div className="pr-2 w-[100%] lx:w-[115%] ">
                    <div className="flex items-center sticky top-0 bg-white p-2 z-10">
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[300] text-left">{dataLang?.warehouses_localtion_ware}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[300] text-left">{dataLang?.warehouses_localtion_code}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[300] text-left">{dataLang?.warehouses_localtion_NAME}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300] text-center">{dataLang?.warehouses_localtion_status}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[300] text-left">{dataLang?.warehouses_localtion_date}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300] text-center">{dataLang?.branch_popup_properties}</h4>
                    </div>
                    {onFetching ?
                      <Loading className="h-80"color="#0f4f9e" /> 
                      : 
                      data?.length > 0 ? 
                      (<>
                          <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px]">                       
                          {(data?.map((e) => 
                            <div className="flex items-center py-1.5 px-2 hover:bg-slate-100/40 " key={e?.id.toString()}>  
                      
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-left">{e.warehouse_name}</h6>
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-left">{e.code}</h6>
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-left">{e.name}</h6>  
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[10%]  rounded-md text-center">
                                <label htmlFor={e.id} className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox"  className="sr-only peer" value={e.status}  id={e.id}
                                  // defaultChecked
                                   checked={e.status == "0" ? false : true}
                                 
                                    onChange={_ToggleStatus.bind(this, e.id)}
                                    />
                                    
                                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </h6>                      
                              {/* <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-left">{e.email}</h6>                 */}
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-left">{e?.date_create != null ? moment(e.date_create).format("DD/MM/YYYY, h:mm:ss") : ""}</h6>                              
                                                   
                              <div className="space-x-2 w-[10%] text-center">
                                <Popup_Vitrikho   onRefresh={_ServerFetching.bind(this)}   valuekho={e} warehouse_name={e.warehouse_name} warehouse_id={e.warehouse_id}   listKho={listKho}  className="xl:text-base text-xs "  dataLang={dataLang} name={e.name} code={e.code}  
                                id={e?.id}  />
                                <button onClick={()=>handleDelete(e.id)} className="xl:text-base text-xs "><IconDelete color="red"/></button>
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
const Popup_Vitrikho = (props) => {
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
      const menuPortalTarget = scrollAreaRef.current;
          return { menuPortalTarget };
      };

    const [onSending, sOnSending] = useState(false);
    const [khoOpt, sListkho] = useState([])
    const [name, sName] = useState("");
    const [code, sCode] = useState("");

    const [errInputCode, sErrInputCode] = useState(false);
    const [errInputName, sErrInputName] = useState(false);
    const [errInputKho, sErrInputKho] = useState(false);
    const [valuekho, sValuekho] = useState([])
    useEffect(() => {
      sErrInputKho(false)
      sErrInputCode(false)
      sErrInputName(false)
      sName(props.name ? props.name : "")
      sCode(props.code ? props.code : "")
      sListkho(props.listKho ? props.listKho && [...props.listKho?.map(e => ({label: e.name, value: Number(e.id)}))] : [])
      sValuekho(props?.valuekho ? props.valuekho && [{label: props.warehouse_name, value: props.warehouse_id}]: [])
    }, [open]);
 
    const kho_id = valuekho?.value || valuekho?.map(e => e.value)
    const _HandleChangeInput = (type, value) => {
        if(type == "name"){
          sName(value.target?.value)
        }else if(type == "valuekho"){
          sValuekho(value)
        }else if(type == "code"){
          sCode(value.target?.value)
        }
    }
  const _ServerSending = () => {
    const id =props.id;
    var data = new FormData();
    data.append('name', name);
    data.append('code', code);
    data.append("warehouse_id", kho_id)
    Axios("POST", `${props.id ? `/api_web/api_warehouse/location/${id}?csrf_protection=true` : "/api_web/api_warehouse/location/?csrf_protection=true"}`, {
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
                  props.onRefresh && props.onRefresh()
                sOpen(false)
                sErrInputCode(false)
                sErrInputName(false)
                sErrInputKho(false)
                sName("")
                sCode("")
                sValuekho([])
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
        if(code.length == 0 || valuekho?.length == 0 || name.length == 0 || valuekho == null ){
            code?.length ==0 &&  sErrInputCode(true)
            name?.length ==0 &&  sErrInputName(true)
             valuekho?.length == 0 && sErrInputKho(true) 
             valuekho == null && sErrInputKho(true) 
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
    }, [code?.length > 0])
    useEffect(() => {
        sErrInputName(false) 
    }, [name?.length > 0])

    useEffect(() => {
      sErrInputKho(false)
    }, [valuekho?.length > 0,valuekho !=null]);
  return(
      <>
      <PopupEdit   
        title={props.id ? `${props.dataLang?.warehouses_localtion_edit}` : `${props.dataLang?.warehouses_localtion_add}`} 
        button={props.id ? <IconEdit/> : `${props.dataLang?.branch_popup_create_new}`} 
        onClickOpen={_ToggleModal.bind(this, true)} 
        open={open} onClose={_ToggleModal.bind(this,false)}
        classNameBtn={props.className} 
      >

              <div className="mt-4">
                  <form onSubmit={_HandleSubmit.bind(this)} className="">
                      <ScrollArea ref={scrollAreaRef} className="h-[280px] overflow-hidden" speed={1} smoothScrolling={true}>
                  <div className='w-[30vw] '>         
                      <div className="flex flex-wrap justify-between "> 
                        <div className='w-full'>
                            <div>
                              <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.warehouses_localtion_code}<span className="text-red-500">*</span></label>
                             <input
                                value={code}                
                                onChange={_HandleChangeInput.bind(this, "code")}
                                placeholder={props.dataLang?.warehouses_localtion_code}
                                name="fname"                      
                                type="text"
                                className={`${errInputCode ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                              />
                              {errInputCode && <label className="mb-4  text-[14px] text-red-500">{props.dataLang?.warehouses_localtion_errCode}</label>}
                             </div>
                             <div>
                              <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.warehouses_localtion_NAME}<span className="text-red-500">*</span></label>
                             <input
                                value={name}                
                                onChange={_HandleChangeInput.bind(this, "name")}
                                placeholder={props.dataLang?.warehouses_localtion_NAME}
                                name="fname"                      
                                type="text"
                                className={`${errInputName ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                              />
                              {errInputName && <label className="mb-4  text-[14px] text-red-500">{props.dataLang?.warehouses_localtion_errName}</label>}
                             </div>
                               
                         <div>
                           <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.warehouses_localtion_ware} <span className="text-red-500">*</span></label>
                              <Select   
                                  placeholder={props.dataLang?.warehouses_localtion_ware}
                                  options={khoOpt}
                                  isSearchable={true}
                                  onChange={_HandleChangeInput.bind(this, "valuekho")}
                                  noOptionsMessage={() => "Không có dữ liệu"}
                                  value={valuekho}
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
                                className={`${errInputKho ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
                              />
                              {errInputKho && <label className="mb-2  text-[14px] text-red-500">{props.dataLang?.warehouses_localtion_errWare}</label>}
                           </div>
                           </div>
                            
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
//                             {/* <Popup_Vitrikho  onRefresh={_ServerFetching.bind(this)}  dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
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