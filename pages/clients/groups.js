import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import {useRouter} from 'next/router';

import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import {_ServerInstance as Axios} from '/services/axios';
import Pagination from '/components/UI/pagination';
import ReactExport from "react-data-export";


import { Edit as IconEdit, Trash as IconDelete, SearchNormal1 as IconSearch,  Grid6 as IconExcel } from "iconsax-react";
import Swal from "sweetalert2";
import 'react-phone-input-2/lib/style.css'
import Select,{components} from "react-select"
import { da } from "date-fns/locale";

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
  const router = useRouter();
  const dataLang = props.dataLang;

  const [data, sData] = useState([])
  const [onFetching, sOnFetching] = useState(true)
  const [data_ex, sData_ex] = useState([]);

  const [keySearch, sKeySearch] = useState("")
  const [limit, sLimit] = useState(15);
  const [totalItem, sTotalItem] = useState([]);

  const _ServerFetching =  () =>{
    Axios("GET", `/api_web/Api_client/group?csrf_protection=true`, {
      params: {
        search: keySearch,
        limit: limit,
        page: router.query?.page || 1,
        "filter[branch_id]": idBranch?.length > 0 ? idBranch.map(e => e.value) : null
      }
    }, (err, response) => {
      if(!err){
          var {rResult, output} = response.data
          sData(rResult)
          sTotalItem(output)
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
  
  useEffect(() => {
    onFetching && _ServerFetching() || onFetching && _ServerFetching_brand()
  }, [onFetching])
  
  useEffect(() => {
    sOnFetching(true) || (keySearch && sOnFetching(true)) || (idBranch?.length > 0 && sOnFetching(true))
  }, [limit,router.query?.page,idBranch])

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
       
        
        Axios("DELETE", `/api_web/Api_client/group/${id}?csrf_protection=true`, {
        }, (err, response) => {
          if(!err){
            var isSuccess = response.data?.isSuccess;
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

  const paginate = pageNumber => {
    router.push({
        pathname: '/clients/groups',
        query: { page: pageNumber }
    })
  }

  const _HandleOnChangeKeySearch = ({target: {value}}) => {
    sKeySearch(value)
    router.replace('/clients/groups');
    setTimeout(() => {
      if(!value){
        sOnFetching(true)
      }
      sOnFetching(true)
    }, 500);
  };

  const multiDataSet = [
    {
        columns: [
            {title: "ID", width: {wch: 4}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
            {title: `${dataLang?.client_group_name}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
            {title: `${dataLang?.client_group_colorcode}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
            {title:`${dataLang?.client_list_brand}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
           
        ],
        data: data_ex?.map((e) =>
       
            [
                {value: `${e.id}`, style: {numFmt: "0"}},
                {value: `${e.name ? e.name : ""}`},
                {value: `${e.color ? e.color : ""}`},
                {value: `${e.branch ? e.branch?.map(i => i.name) : ""}`},
            ]    
        ),
    }
  ];

  return (
    <React.Fragment>
      <Head>
        <title>{dataLang?.client_groupuser_title}</title>
      </Head>
      <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
          <h6 className="text-[#141522]/40">{dataLang?.client_group_client}</h6>
          <span className="text-[#141522]/40">/</span>
          <h6>{dataLang?.client_groupuser_title}</h6>
        </div>
        <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
          <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 h-[96%] overflow-hidden">
                <div className="flex justify-between">
                <h2 className="text-2xl text-[#52575E]">{dataLang?.client_groupuser}</h2>
                  <div className="flex justify-end items-center">
                    <Popup_groupKh listBr={listBr} onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />
                  </div>
                </div>
                <div className='ml-1 w-[20%]'>
                <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>{dataLang?.client_list_brand}</h6>
                <Select 
                    options={listBr_filter}
                    onChange={onchang_filterBr.bind(this, "branch")}
                    value={idBranch}
                    hideSelectedOptions={false}
                    isMulti
                    isClearable={true}
                    placeholder={dataLang?.client_list_filterbrand} 
                    className="rounded-md py-0.5 bg-white border-none xl:text-base text-[14.5px] z-20" 
                    isSearchable={true}
                    noOptionsMessage={() => "Không có dữ liệu"}
                    components={{ MultiValue }}
                    closeMenuOnSelect={false}
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
                    </div>
              <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">
                <div className="xl:space-y-3 space-y-2">
                    <div className="bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2">
                        <form className="flex items-center relative">
                          <IconSearch size={20} className="absolute left-3 z-10 text-[#cccccc]" />
                          <input
                              className=" relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10 pr-5 py-2 rounded-md w-[400px]"
                              type="text" 
                              onChange={_HandleOnChangeKeySearch.bind(this)} 
                              placeholder={dataLang?.branch_search}
                          />
                        </form>
                        <div className="flex space-x-2 items-center">
                        {
                          data_ex?.length > 0 &&(
                            <ExcelFile filename="Nhóm khách hàng" title="Nkh" element={
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
                <div className="min:h-[200px] h-[82%] max:h-[600px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  
                
                <div className="xl:w-[100%] w-[110%] pr-2 ">
                    <div className="flex items-center sticky top-0 bg-white p-2 z-10">
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[50%] font-[300] text-left">{dataLang?.client_group_name}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[300] text-left">{dataLang?.client_group_colorcode}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[300] text-left">{dataLang?.client_group_color}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[300] text-left">{dataLang?.client_list_brand}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[300] text-center">{dataLang?.branch_popup_properties}</h4>
                    </div>
                    {onFetching ?
                      <Loading className="h-80"color="#0f4f9e" /> 
                      : 
                      data?.length > 0 ? 
                      (
                        <>
                          <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px] ">                       
                          {(data?.map((e) => 
                            <div className="flex items-center py-1.5 px-2 hover:bg-slate-100/40 " key={e.id.toString()}>
                              <h6 className="xl:text-base text-xs  px-2 py-3 w-[50%] text-left">{e.name}</h6>
                              <h6 className="xl:text-base text-xs  px-2 py-3 w-[15%]  rounded-md ">{e.color}</h6>
                              <h6 style={{
                                backgroundColor:e.color
                              }} className="xl:text-base text-xs  px-2 py-3 w-[15%]  rounded-md "></h6> 
                              <h6 className="xl:text-base text-xs  px-2 py-3 w-[15%]  rounded-md  "><span className="flex flex-wrap justify-between ">{e?.branch?.map(e => (<span className="mb-1 w-fit xl:text-base text-xs px-2 text-[#0F4F9E] font-[300] py-0.5 border border-[#0F4F9E] rounded-lg">{e.name}</span>))}</span></h6>

                              <div className="space-x-2 w-[20%] text-center">
                                <Popup_groupKh onRefresh={_ServerFetching.bind(this)} className="xl:text-base text-xs " listBr={listBr} sValueBr={e.branch}  dataLang={dataLang} name={e.name} color={e.color} id={e.id} />
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
                                <Popup_groupKh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />    
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
};

const Popup_groupKh = (props) => {
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
    const [color, sColor] = useState("");
    const [errInput, sErrInput] = useState(false);
    
    const [errInputBr, sErrInputBr] = useState(false);
    const [valueBr, sValueBr] = useState([])
    // const branch = valueBr.map(e => e.value)

    useEffect(() => {
      sErrInputBr(false)
      sErrInput(false)
      sName(props.name ? props.name : "")
      sColor(props.color ? props.color : "")
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
        }else if(type == "color"){
          sColor(value.target?.value)
        }
    }

    useEffect(() => {
        sErrInput(false) 
    }, [name.length > 0])
    useEffect(() => {
        sErrInputBr(false)
    }, [branch_id?.length > 0]);
    
  const _ServerSending = () => {
    const id =props.id;
    var data = new FormData();
    data.append('name', name);
    data.append('color', color);
    Axios("POST", `${props.id ? `/api_web/Api_client/group/${id}?csrf_protection=true` : "/api_web/Api_client/group?csrf_protection=true"}`, {
      data: {
      name:name,
      color:color,
      branch_id:branch_id,
      },
      headers: {"Content-Type": "multipart/form-data"} 
    }, (err, response) => {
      if(!err){
            var {isSuccess, message} = response.data;
            if(isSuccess){
                Toast.fire({
                    icon: 'success',
                    title: `${props.dataLang[message]}`
                })
                sErrInput(false)
                sName("")
                sColor("")
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
        if(name.length == 0 || branch_id?.length==0){
          name?.length ==0 &&  sErrInput(true)
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
  return(
    <PopupEdit  
      title={props.id ? `${props.dataLang?.client_group_edit}` : `${props.dataLang?.client_group_add}`} 
      button={props.id ? <IconEdit/> : `${props.dataLang?.branch_popup_create_new}`} 
      onClickOpen={_ToggleModal.bind(this, true)} 
      open={open} onClose={_ToggleModal.bind(this,false)}
      classNameBtn={props.className}
    >
      <div className="w-96 mt-4">
        <form onSubmit={_HandleSubmit.bind(this)}>
          <div>
          <div className="flex flex-wrap justify-between">
                    <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_group_name} <span className="text-red-500">*</span></label>
                    <input
                      value={name}                
                      onChange={_HandleChangeInput.bind(this, "name")}
                      name="fname"                      
                      type="text"
                      className={`${errInput ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2`}
                    />
                    {errInput && <label className="mb-2  text-[14px] text-red-500">{props.dataLang?.client_group_please_name}</label>}
              </div>
              <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_list_brand} <span className="text-red-500">*</span></label>
                              <Select   
                                 closeMenuOnSelect={false}
                                  placeholder={props.dataLang?.client_list_brand}
                                  options={brandpOpt}
                                  isSearchable={true}
                                  onChange={_HandleChangeInput.bind(this, "valueBr")}
                                  LoadingIndicator
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
                                className={`${errInputBr ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full  text-[#52575E] font-normal border outline-none rounded-lg bg-white border-none xl:text-base text-[14.5px]`}
                              />
                              {errInputBr && <label className="mb-2  text-[14px] text-red-500">{props.dataLang?.client_list_bran}</label>}
            <div className="flex flex-wrap justify-between mt-2">
              <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_group_color}</label>
              <input
                value={color}
                onChange={_HandleChangeInput.bind(this, "color")}
                name="color"                       
                type="color"
                className="placeholder-[color:#667085] w-full min-h-[50px] bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none mb-6"
              />     
            </div>
            <div className="text-right mt-5 space-x-2">
              <button  type="button" onClick={_ToggleModal.bind(this,false)} className="button text-[#344054] font-normal text-base py-2 px-4 rounded-lg border border-solid border-[#D0D5DD]"
              >{props.dataLang?.branch_popup_exit}</button>
              <button 
                type="submit"
                className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-lg bg-[#0F4F9E]"
              >{props.dataLang?.branch_popup_save}</button>
            </div>
          </div>
        </form>
      </div>
    </PopupEdit>
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