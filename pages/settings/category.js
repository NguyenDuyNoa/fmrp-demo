import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { ListBtn_Setting } from "./information";
import PopupEdit from "../../components/UI/popup";
import {_ServerInstance as Axios} from '/services/axios';
import Pagination from '/components/UI/pagination';

import {
  Edit as IconEdit,
  Trash as IconDelete,
  SearchNormal1 as IconSearch,
} from "iconsax-react";
import Loading from "components/UI/loading";
import Swal from "sweetalert2";
const Index = (props) => {
  const dataLang = props.dataLang;
  const router = useRouter();
  
  const _HandleSelectTab = (e) => {
      router.push({
          pathname: '/settings/category',    
          query: { tab: e }
      })
  }
  useEffect(() => {
      router.push({
          pathname: '/settings/category',    
          query: { tab: router.query?.tab ? router.query?.tab : "units"  }
      })
  }, []);
  const [data, sData] = useState([]);
  const [onFetching, sOnFetching] = useState(false);
  const [totalItems, sTotalItems] = useState([]);
  const [keySearch, sKeySearch] = useState("")
  const [limit, sLimit] = useState(15);
const _ServerFetching = () => {
  Axios("GET", `${(router.query?.tab === "units" && `/api_web/Api_unit/unit/?csrf_protection=true`) } `, {
      // params: {
      //     search: keySearch,
      //     limit: limit,
      //     page: router.query?.page || 1
      // }
  }, (err, response) => {
      if(!err){
          var {rResult, output} = response.data
          sData(rResult)
          sTotalItems(output)
      }
      sOnFetching(false)
  })
}

useEffect(() => {
  onFetching && _ServerFetching()
}, [onFetching]);

useEffect(() => {
  router.query.tab && sOnFetching(true)
}, [limit,router.query?.page, router.query?.tab]);
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
        Axios("DELETE",  `${(router.query.tab === "units" && `/api_web/Api_unit/unit/${id}?csrf_protection=true`) } `, {
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
        pathname: `/settings/category`,
        query: {
          tab: router.query?.tab,
           page: pageNumber ,
        }
    })
  }
  const _HandleOnChangeKeySearch = ({target: {value}}) => {
    sKeySearch(value)
    if(!value){
      sOnFetching(true)
    }
    sOnFetching(true)
  };
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  })

  return (
  <React.Fragment>
    <Head>
        <title>{dataLang?.category_unit}</title>
    </Head>
    <div className='px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen'>
        <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
            <h6 className='text-[#141522]/40'>{dataLang?.branch_seting}</h6>
            <span className='text-[#141522]/40'>/</span>
            <h6>{dataLang?.category_unit}</h6>
        </div>
        <div className='grid grid-cols-9 gap-5 h-[99%]'>
            <div className="col-span-2 h-fit p-5 rounded bg-[#E2F0FE] space-y-3 sticky ">
                <ListBtn_Setting dataLang={dataLang} />
            </div>
            <div className='col-span-7 h-[100%] flex flex-col justify-between'>
                <div className='space-y-3 h-[96%] overflow-hidden'>
                    <h2 className='text-2xl text-[#52575E]'>{dataLang?.category_unit}</h2>
                    <div className="flex space-x-3 items-center justify-start">
                        <button onClick={_HandleSelectTab.bind(this, "units")} className={`${router.query?.tab === "units" ? "text-[#0F4F9E] bg-[#e2f0fe]" : "hover:text-[#0F4F9E] hover:bg-[#e2f0fe]/30"} rounded-lg px-4 py-2 outline-none`}>{dataLang?.category_unit}</button>
                       
                    </div>
                    <div className="3xl:h-[65%] 2xl:h-[60%] xl:h-[55%] h-[57%] space-y-2">
                        <div className="flex justify-end">
                            <Popup_danhmuc onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />
                        </div>
                        <div className="xl:space-y-3 space-y-2">
                            <div className="bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2">
                                <form className="flex items-center relative">
                                    <IconSearch size={20} className="absolute left-3 z-10 text-[#cccccc]" />
                                    <input
                                        className=" relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10 pr-5 py-2 rounded-md w-[400px]"
                                        type="text" 
                                        // onChange={props.onChange}
                                        placeholder={dataLang?.branch_search}
                                    />
                                </form>
                                <div className="flex space-x-2">
                                    <label className="font-[300] text-slate-400">Hiển thị :</label>
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
                        <div className="min:h-[200px] h-[82%] max:h-[500px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                            <div className={`${(router.query?.tab === "units")? "w-[100%]" : "w-[110%]" } 2xl:w-[100%] pr-2`}>
                                <div className={`${(router.query?.tab === "units")? "grid-cols-6" : "grid-cols-9" } grid gap-5 sticky top-0 bg-white p-2 z-10`}>
                                    {((router.query?.tab === "units") ) && 
                                        <React.Fragment>
                                            <h4 className="xl:text-[14px] px-2 text-[12px] col-span-5 text-[#667085] uppercase font-[300] text-left">
                                                {router.query?.tab === "units" && dataLang?.category_unit_name}
                                                
                                            </h4>
                                        
                                        </React.Fragment>
                                    }
                                    <h4 className="xl:text-[14px] px-2 text-[12px] col-span-1 text-[#667085] uppercase font-[300] text-center">
                                        {dataLang?.branch_popup_properties}
                                    </h4>
                                </div>
                                {onFetching ? 
                                    <Loading className="h-80"color="#0f4f9e" /> 
                                    :
                                    <React.Fragment>
                                        {data.length == 0 &&
                                            <div className=" max-w-[352px] mt-24 mx-auto" >
                                                <div className="text-center">
                                                    <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                                                    <h1 className="textx-[#141522] text-base opacity-90 font-medium">Không tìm thấy các mục</h1>
                                                    <div className="flex items-center justify-around mt-6 ">
                                                        <Popup_danhmuc onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />    
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px]"> 
                                            {data.map((e) => 
                                                <div key={e.id.toString()} className={`${(router.query?.tab === "units")  ? "grid-cols-6" : "grid-cols-9" } grid gap-5 py-1.5 px-2 hover:bg-slate-100/40 `}>
                                                    {((router.query?.tab === "units") || (router.query?.tab === "currencies")) && 
                                                        <React.Fragment>
                                                            <h6 className="xl:text-base text-xs px-2 col-span-5">
                                                            {router.query?.tab === "units" && e?.unit}                
                                                            </h6>                                                          
                                                        </React.Fragment>
                                                    }
                                                
                                                    <div className="flex space-x-2 justify-center ">
                                                       <Popup_danhmuc onRefresh={_ServerFetching.bind(this)} className="xl:text-base text-xs " dataLang={dataLang} data={e} />
                                                      <button className="xl:text-base text-xs  ">
                                                      <IconDelete onClick={()=>handleDelete(e.id)}  color="red"/>
                                                      </button>
                                                    </div>
                                              </div>
                                            )}
                                        </div>
                                    </React.Fragment>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </React.Fragment>
    )
}

const Popup_danhmuc = (props) => {
    const router = useRouter();
    const tabPage = router.query?.tab;

    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);

    const [unit, sUnit] = useState(props.data?.unit ? props.data?.unit : "");

    const _HandleChangeInput = (type, value) => {
      if(type == "unit"){
        sUnit(value.target?.value)
      }
    }

    const handleSubmit = (event) => {
      event.preventDefault();
      const id =props.data?.id;
      var data = new FormData();
      data.append('unit', (tabPage === "units" && unit) );
      Axios("POST", id ? 
          `${(tabPage === "units" && `/api_web/Api_unit/unit/${id}?csrf_protection=true`)} `
        :
          `${(tabPage === "units" && `/api_web/Api_unit/unit/?csrf_protection=true`) } `
        , {
        data: data,
        headers: {"Content-Type": "multipart/form-data"} 
      }, (err, response) => {
        if(!err){
          var {isSuccess, message} = response.data;
          if(isSuccess){
            Toast.fire({
              icon: 'success',
              title: props.dataLang[message]
            })   
            sUnit("")
            sOpen(false)
            props.onRefresh && props.onRefresh()
        }else {
            Toast.fire({
              icon: 'error',
              title: props.dataLang[message]
            })  
          }
        }
      }) 
    }

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    })

    return(
      <PopupEdit  
        title={props.data?.id ? `${(tabPage === "units" && props.dataLang?.category_unit_edit) }` : `${(tabPage === "units" && props.dataLang?.category_unit_add) }`} 
        button={props.data?.id ? <IconEdit/> : `${props.dataLang?.branch_popup_create_new}`} 
        onClickOpen={_ToggleModal.bind(this, true)} 
        open={open} onClose={_ToggleModal.bind(this,false)}
        classNameBtn={props.className}
      >
        <div className={`w-96 mt-4`}>
          <form onSubmit={ handleSubmit}>
            <div>
              {tabPage === "units" &&
                <React.Fragment>
                  <div className="flex flex-wrap justify-between">
                    <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.category_unit_name} <span className="text-red-500">*</span></label>
                    <input
                      value={unit}
                      onChange={_HandleChangeInput.bind(this, "unit")}
                      name="fname"                       
                      type="text"
                      className="placeholder-[color:#667085] w-full bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none mb-6"
                    />
                  </div>
                      
                </React.Fragment>
              }

              <div className="text-right mt-5 space-x-2">
                <button type="button" onClick={_ToggleModal.bind(this,false)} className="button text-[#344054] font-normal text-base py-2 px-4 rounded-lg border border-solid border-[#D0D5DD]">{props.dataLang?.branch_popup_exit}</button>
                <button type="submit" className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-lg bg-[#0F4F9E]">{props.dataLang?.branch_popup_save}</button>
              </div>
            </div>
          </form>
        </div>
      </PopupEdit>
    )
}

export default Index;