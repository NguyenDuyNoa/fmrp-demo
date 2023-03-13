import React, { useEffect, useState } from "react";
import Head from "next/head";
import {useRouter} from 'next/router';

import { ListBtn_Setting } from "./index";
import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import {_ServerInstance as Axios} from '/services/axios';
import Pagination from '/components/UI/pagination';

import PhoneInput from "react-phone-input-2";
import { Edit as IconEdit, Trash as IconDelete, SearchNormal1 as IconSearch } from "iconsax-react";
import Swal from "sweetalert2";
import 'react-phone-input-2/lib/style.css'
 
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

  const [query, sQuery] = useState("")
  const [limit, sLimit] = useState(15);
  const [totalItem, sTotalItem] = useState(0);

  const _ServerFetching =  ()=>{
    Axios("GET", `/api_web/Api_Branch/branch?csrf_protection=true?&search=${query}&limit=${limit}`, {
      params: {
        page: router.query?.page || 1,
      }
    }, (err, response) => {
        if(!err){
            var data =  response.data.rResult;
            var totalItem = response.data?.output?.iTotalRecords
            sData(data)
            sTotalItem(totalItem)
        }
      sOnFetching(false)
    })
  }
  
  useEffect(() => {
    onFetching && _ServerFetching()
  }, [onFetching])
  
  useEffect(() => {
    sOnFetching(true)
  }, [query,limit,router.query?.page])

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
        Axios("DELETE", `/api_web/Api_Branch/branch/${id}?csrf_protection=true`, {
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
        pathname: '/settings/branch',
        query: { page: pageNumber }
    })
  }

  return (
    <React.Fragment>
      <Head>
        <title>{dataLang?.branch_title}</title>
      </Head>
      <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
          <h6 className="text-[#141522]/40">{dataLang?.branch_seting}</h6>
          <span className="text-[#141522]/40">/</span>
          <h6>{dataLang?.branch_title}</h6>
        </div>
        <div className="grid grid-cols-9 gap-5">
          <div className="col-span-2 h-fit p-5 rounded bg-[#E2F0FE] space-y-3 sticky ">
            <ListBtn_Setting dataLang={dataLang} />
          </div>
          <div className="col-span-7 space-y-3">
            <h2 className="text-2xl text-[#52575E]">{dataLang?.branch_title}</h2>
            <div className=" pb-3 space-y-2.5 h-screen flex flex-col justify-between">
              <div className="3xl:h-[65%] 2xl:h-[60%] xl:h-[55%] h-[57%] space-y-2">
                <div className="flex justify-end items-center">
                  <div className="flex space-x-3 items-center">
                    <Popup_ChiNhanh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />
                  </div>
                </div>

                <div className="xl:space-y-3 space-y-2">
                    <div className="bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2">
                        <form className="flex items-center relative">
                          <IconSearch size={20} className="absolute left-3 z-10 text-[#cccccc]" />
                          <input
                              className=" relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10 pr-5 py-2 rounded-md w-[400px]"
                              type="text" 
                              onChange={(e) => sQuery(e.target.value)} 
                              placeholder={dataLang?.branch_search}
                          />
                        </form>
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
                
                {/* list danh sách */}
                <div className="min:h-[500px] h-[100%] max:h-[900px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <div className="xl:w-[100%] w-[110%] pr-2">
                    <div className="flex items-center sticky top-0 bg-white p-2 z-10">
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[23%] font-[300] text-left">{dataLang?.branch_popup_name}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[50%] font-[300] text-left">{dataLang?.branch_popup_address}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[300] text-left">{dataLang?.branch_popup_phone}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[300] text-center">{dataLang?.branch_popup_properties}</h4>
                    </div>
                    {onFetching ?
                      <Loading className="h-80"color="#0f4f9e" /> 
                      : 
                      data.length > 0 ? 
                      (
                        <>
                         <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px]">                       
                          {(data.map((e) => 
                            <div className="flex items-center py-1.5 px-2 hover:bg-slate-100/40 " key={e.id.toString()}>
                              <h6 className="xl:text-base text-xs px-2 w-[23%] text-left">{e.name}</h6>
                              <h6 className="xl:text-base text-xs px-2 w-[50%]">{e.address}</h6>
                              <h6 className="xl:text-base text-xs px-2 w-[20%] text-left">{e.number_phone}</h6>
                              <div className="space-x-2 w-[20%] text-center">
                                <Popup_ChiNhanh onRefresh={_ServerFetching.bind(this)} className="xl:text-base text-xs" dataLang={dataLang} name={e.name} phone={e.number_phone} address={e.address} id={e.id} />
                                <button onClick={()=>handleDelete(e.id)} className="xl:text-base text-xs"><IconDelete color="red"/></button>
                              </div>
                            </div>
                            ))}   
                        <div className="flex justify-between space-x-5 fixed bottom-0 left-[24%] border-none">
                          <p className="text-[#667085] font-[400] xl:text-base text-xs">{dataLang?.branch_pagination} 1 {dataLang?.branch_pagination_arrive} 15 {dataLang?.branch_pagination_to} 20 {dataLang?.branch_pagination_items}</p>
                          <Pagination 
                            postsPerPage={limit}
                            totalPosts={Number(totalItem)}
                            paginate={paginate}
                            currentPage={router.query?.page || 1}
                          />
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
                                  <Popup_ChiNhanh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />    
                              </div>
                            </div>
                          </div>
                      )}    
                  </div>
                  </div>
                   
              </div>             
           </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const Popup_ChiNhanh = (props) => {
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);

    const [onSending, sOnSending] = useState(false);

    const [name, sName] = useState(props.name ? props.name : "");
    const [address, sAddress] = useState(props.address ? props.address : "");
    const [phone, sPhone] = useState(props.phone ? props.phone : "");
    const id = props.id

    const _HandleChangeInput = (type, value) => {
        if(type == "name"){
            sName(value.target?.value)
        }else if(type == "address"){
            sAddress(value.target?.value)
        }else if(type == "phone"){
            sPhone(value.target?.value)
        }
    }

  const _ServerSending = () => {
    var data = new FormData();
    data.append('name', name);
    data.append('number_phone', phone);
    data.append('address', address);

    Axios("POST", `${props.id ? `/api_web/Api_Branch/branch/${id}?csrf_protection=true` : "/api_web/Api_Branch/branch?csrf_protection=true"}`, {
      data: data,
      headers: {"Content-Type": "multipart/form-data"} 
    }, (err, response) => {
      if(!err){
            var isSuccess = response.data?.isSuccess;
            if(isSuccess){
                Toast.fire({
                    icon: 'success',
                    title: `${props.dataLang?.aler_success}`
                })
            }
            sName(props.name ? props.name : "")
            sAddress(props.address ? props.address : "")
            sPhone(props.phone ? props.phone : "")
        }
        props.onRefresh && props.onRefresh()
        sOpen(false)
        sOnSending(false)
    })
  }

    useEffect(() => {
        onSending && _ServerSending()
    }, [onSending]);

    const _HandleSubmit = (e) => {
        e.preventDefault()
        sOnSending(true)
    }

  return(
    <PopupEdit  
      title={props.id ? `${props.dataLang?.branch_popup_edit}` : `${props.dataLang?.branch_popup_create_new_branch}`} 
      button={props.id ? <IconEdit/> : `${props.dataLang?.branch_popup_create_new}`} 
      onClickOpen={_ToggleModal.bind(this, true)} 
      open={open} onClose={_ToggleModal.bind(this,false)}
      classNameBtn={props.className}
    >
      <div className="content mt-4">
        <form onSubmit={_HandleSubmit.bind(this)}>
          <div>
            <div className="flex flex-wrap justify-between">
              <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.branch_popup_name}</label>
              <input
                required
                value={name}
                onChange={_HandleChangeInput.bind(this, "name")}
                name="fname"                       
                type="text"
                className="placeholder-[color:#667085] w-full bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none mb-6"
              />
            </div>
            <div className="flex flex-wrap justify-between">
              <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.branch_popup_address} </label>
              <input
                required
                value={address}
                onChange={_HandleChangeInput.bind(this, "address")}
                name="adress"                       
                type="text"
                className="placeholder-[color:#667085] w-full bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none mb-6"
              />     
            </div>
            <label className="text-[#344054] font-normal text-sm mb-1">{props.dataLang?.branch_popup_phone}</label>
            <PhoneInput
              country={"vn"}
              value={phone}
              onChange={(phone)=>sPhone(phone)}
              inputProps={{
                required: true,
                autoFocus: true,
              }}
              inputStyle={{
                width: "100%",
                border: "1px solid #d0d5dd",
                borderRadius: "8px",                 
                paddingTop: "8px",
                paddingBottom: "8px",
                height: "auto",
              }}
            />
       
            <div className="text-right mt-5 space-x-2">
              <button onClick={_ToggleModal.bind(this,false)} className="button text-[#344054] font-normal text-base py-2 px-4 rounded-lg border border-solid border-[#D0D5DD]"
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

export default Index;