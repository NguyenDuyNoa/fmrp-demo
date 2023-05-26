import React, { useEffect, useRef, useState } from "react";
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
  ArrowCircleDown,
  CloseCircle,
  TickCircle, Minus as IconMinus,ArrowDown2 as IconDown,
} from "iconsax-react";
import Loading from "components/UI/loading";
import Swal from "sweetalert2";
import Select, { components } from 'react-select';



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
  const [onFetchingOpt, sOnFetchingOpt] = useState(false);

  const [totalItems, sTotalItems] = useState([]);
  const [keySearch, sKeySearch] = useState("")
  const [limit, sLimit] = useState(15);
const _ServerFetching = () => {
  Axios("GET", `${(router.query?.tab === "units" && `/api_web/Api_unit/unit/?csrf_protection=true`) || (router.query?.tab === "stages" && "/api_web/api_product/stage/?csrf_protection=true") || (router.query?.tab === "costs" && "/api_web/Api_cost/cost/?csrf_protection=true")} `, {
      params: {
          search: keySearch,
          limit: limit,
          page: router.query?.page || 1
      }
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
  
  router.query.tab && sOnFetching(true) || (keySearch && sOnFetching(true))

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
        Axios("DELETE",  `${(router.query.tab === "units" && `/api_web/Api_unit/unit/${id}?csrf_protection=true`) || (router.query.tab === "stages" && `/api_web/api_product/stage/${id}?csrf_protection=true`) || (router.query.tab === "costs" && `/api_web/Api_cost/cost/${id}?csrf_protection=true`) } `, {
        }, (err, response) => {
          if(!err){
            var {isSuccess,message} = response.data
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
          }
          }
          _ServerFetching()
        })     
      }
    })
   
  }
  const paginate = pageNumber => {
    router.push({
      pathname: '/settings/category',
      query: { 
        tab: router.query?.tab,
        page: pageNumber 
      }
  })
  }
  const _HandleOnChangeKeySearch = ({target: {value}}) => {
    sKeySearch(value)
    router.replace({
      pathname: '/settings/category',
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
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  })

  const _ServerFetchingOtp = () => {
    // Axios("GET", "/api_web/Api_cost/costCombobox/?csrf_protection=true", {}, (err, response) => {
    //     if(!err){
    //         var {rResult} = response.data;
    //         console.log();
    //         sDataOption(rResult.map(x => ({label: `${x.name + " " + "(" + x.code + ")"}`, value: x.id, level: x.level, code: x.code, parent_id: x.parent_id})))
    //     }
    // })
    Axios("GET", "/api_web/Api_Branch/branch/?csrf_protection=true", {}, (err, response) => {
        if(!err){
            var {rResult} = response.data;
            sDataBranchOption(rResult.map(e => ({label: e.name, value: e.id})))
            dispatch({type: "branch/update", payload: rResult.map(e => ({label: e.name, value: e.id}))})
        }
    })
    sOnFetchingOpt(false)
}

  useEffect(() => {
    onFetchingOpt && _ServerFetchingOtp()
  }, [onFetchingOpt]);

  useEffect(() => {
    sOnFetchingOpt(true)
  }, []);



  return (
  <React.Fragment>
    <Head>
        <title>{ router.query.tab === "units" && dataLang?.category_unit || router.query.tab === "stages" && dataLang?.settings_category_stages_title}</title>
    </Head>
    <div className='px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen'>
        <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
            <h6 className='text-[#141522]/40'>{dataLang?.branch_seting}</h6>
            <span className='text-[#141522]/40'>/</span>
            <h6>{ router.query.tab === "units" && dataLang?.category_unit || router.query.tab === "stages" && dataLang?.settings_category_stages_title}</h6>
        </div>
        <div className='grid grid-cols-9 gap-5 h-[99%]'>
            <div className="col-span-2 h-fit p-5 rounded bg-[#E2F0FE] space-y-3 sticky ">
                <ListBtn_Setting dataLang={dataLang} />
            </div>
            <div className='col-span-7 h-[100%] flex flex-col justify-between overflow-hidden'>
                <div className='space-y-3 h-[96%] overflow-hidden'>
                    <h2 className='text-2xl text-[#52575E]'>{dataLang?.category_titel}</h2>
                    <div className="flex space-x-3 items-center justify-start">
                        <button onClick={_HandleSelectTab.bind(this, "units")} className={`${router.query?.tab === "units" ? "text-[#0F4F9E] bg-[#e2f0fe]" : "hover:text-[#0F4F9E] hover:bg-[#e2f0fe]/30"} rounded-lg px-4 py-2 outline-none`}>{dataLang?.category_unit}</button>
                        <button onClick={_HandleSelectTab.bind(this, "stages")} className={`${router.query?.tab === "stages" ? "text-[#0F4F9E] bg-[#e2f0fe]" : "hover:text-[#0F4F9E] hover:bg-[#e2f0fe]/30"} rounded-lg px-4 py-2 outline-none`}>{dataLang?.settings_category_stages_title}</button>
                        <button onClick={_HandleSelectTab.bind(this, "costs")} className={`${router.query?.tab === "costs" ? "text-[#0F4F9E] bg-[#e2f0fe]" : "hover:text-[#0F4F9E] hover:bg-[#e2f0fe]/30"} rounded-lg px-4 py-2 outline-none`}>{"Loại chi phí"}</button>
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
                              onChange={_HandleOnChangeKeySearch.bind(this)} 
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
                        <div className="min:h-[200px] h-[100%] max:h-[500px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                            <div className={`${(router.query?.tab === "units")? "w-[100%]" : "w-[110%]" } 2xl:w-[100%] pr-2`}>
                                <div className={`${(router.query?.tab === "units") ? "grid-cols-6" : router.query?.tab === "stages" ? "grid-cols-9" : "grid-cols-11"} grid  sticky top-0 bg-white p-2 z-10`}>
                                    {((router.query?.tab === "units") ) && 
                                        <React.Fragment>
                                            <h4 className="xl:text-[14px] px-2 text-[12px] col-span-5 text-[#667085] uppercase font-[300] text-left">
                                                {router.query?.tab === "units" && dataLang?.category_unit_name}
                                                
                                            </h4>
                                        
                                        </React.Fragment>
                                    }
                                      {router.query?.tab === "stages" && 
                                        <React.Fragment>
                                            <h4 className="xl:text-[14px] px-2 text-[12px] col-span-2 text-[#667085] uppercase font-[300] text-left">{dataLang?.settings_category_stages_code}</h4>
                                            <h4 className="xl:text-[14px] px-2 text-[12px] col-span-2 text-[#667085] uppercase font-[300] text-left">{dataLang?.settings_category_stages_name}</h4>
                                            <h4 className="xl:text-[14px] px-2 text-[12px] col-span-2 text-[#667085] uppercase font-[300] text-center">{dataLang?.settings_category_stages_status}</h4>
                                            <h4 className="xl:text-[14px] px-2 text-[12px] col-span-2 text-[#667085] uppercase font-[300] text-left">{dataLang?.settings_category_stages_note}</h4>
                                        </React.Fragment>
                                    }
                                      {router.query?.tab === "costs" && 
                                        <React.Fragment>
                                            <h4 className="xl:text-[14px] px-2 text-[12px] col-span-1 text-[#667085] uppercase font-[300] text-center">{"#"}</h4>
                                            <h4 className="xl:text-[14px] px-2 text-[12px] col-span-3 text-[#667085] uppercase font-[300] text-left">{"Mã chi phí"}</h4>
                                            <h4 className="xl:text-[14px] px-2 text-[12px] col-span-2 text-[#667085] uppercase font-[300] text-left">{"Tên chi phí"}</h4>
                                            <h4 className="xl:text-[14px] px-2 text-[12px] col-span-2 text-[#667085] uppercase font-[300] text-center">{"Cấp"}</h4>
                                            <h4 className="xl:text-[14px] px-2 text-[12px] col-span-2 text-[#667085] uppercase font-[300] text-center">{"Chi nhánh"}</h4>
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
                                                <div key={e.id.toString()} className={`${(router.query?.tab === "units")  ? "grid-cols-6" : router.query?.tab === "stages" ? "grid-cols-9" : "grid-cols-11"} grid gap-5 py-2.5 px-2 hover:bg-slate-100/40 `}>
                                                    {((router.query?.tab === "units") || (router.query?.tab === "currencies")) && 
                                                        <React.Fragment>
                                                            <h6 className="xl:text-base text-xs px-2 col-span-5">
                                                            {router.query?.tab === "units" && e?.unit}                
                                                            </h6>                                                          
                                                        </React.Fragment>
                                                    }
                                                    {router.query?.tab === "stages" && 
                                                        <React.Fragment>
                                                            <h6 className="xl:text-base text-xs px-2 col-span-2">{router.query?.tab === "stages" && e?.code}</h6>
                                                            <h6 className="xl:text-base text-xs px-2 col-span-2">{router.query?.tab === "stages" && e?.name}</h6>
                                                            <h6 className="xl:text-base text-xs px-2 col-span-2 mx-auto">{router.query?.tab === "stages" && e?.status_qc === "1" ? <TickCircle size={32} color="#0BAA2E"/> :  <CloseCircle size={32} color="#EE1E1E"/>}</h6>
                                                            <h6 className="xl:text-base text-xs px-2 col-span-2">{router.query?.tab === "stages" && e?.note}</h6>
                                                          
                                                        </React.Fragment>
                                                    }
                                                    {router.query?.tab === "costs" && 
                                                        <React.Fragment>
                                                            <div className="col-span-11"><Items onRefresh={_ServerFetching.bind(this)} onRefreshOpt={_ServerFetchingOtp.bind(this)} dataLang={dataLang} key={e.id} data={e} className="col-span-11"/></div>
                                                        </React.Fragment>
                                                    }
                                                  {router.query?.tab === "units" && 
                                                    <div className="flex space-x-2 justify-center ">
                                                       <Popup_danhmuc onRefresh={_ServerFetching.bind(this)} className="xl:text-base text-xs " dataLang={dataLang} data={e} />
                                                      <button className="xl:text-base text-xs  ">
                                                      <IconDelete onClick={()=>handleDelete(e.id)}  color="red"/>
                                                      </button>
                                                    </div>
                                                    }
                                                  {router.query?.tab === "stages" && 
                                                    <div className="flex space-x-2 justify-center ">
                                                       <Popup_danhmuc onRefresh={_ServerFetching.bind(this)} className="xl:text-base text-xs " dataLang={dataLang} data={e} />
                                                      <button className="xl:text-base text-xs  ">
                                                      <IconDelete onClick={()=>handleDelete(e.id)}  color="red"/>
                                                      </button>
                                                    </div>
                                                    }
                                                    
                                              </div>
                                            )}
                                        </div>
                                    </React.Fragment>
                                }
                            </div>
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
        </div>
    </div>
  </React.Fragment>
    )
}

const Items = React.memo((props) => {
  const [hasChild, sHasChild] = useState(false);
  const _ToggleHasChild = () => sHasChild(!hasChild);

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
          Axios("DELETE", `/api_web/Api_cost/cost/${id}?csrf_protection=true`, {
          }, (err, response) => {
            if(!err){
              var {isSuccess, message} = response.data;
              if(isSuccess){
                Toast.fire({
                  icon: 'success',
                  title: props.dataLang[message]
                })     
              }else{
                  Toast.fire({
                      icon: 'error',
                      title: props.dataLang[message]
                  }) 
              }
            }
            props.onRefresh && props.onRefresh()
            props.onRefreshOpt && props.onRefreshOpt()
          })     
      }
      })
  }

  useEffect(() => {
      sHasChild(false)
  }, [props.data?.children?.length == null]);

  return(
      <div key={props.data?.id}>
          <div className='grid grid-cols-11 py-2  bg-white hover:bg-slate-50 relative'>
              <div className='col-span-1 flex justify-center'>
                  <button disabled={props.data?.children?.length > 0 ? false : true} onClick={_ToggleHasChild.bind(this)} className={`${hasChild ? "bg-red-600" : "bg-green-600 disabled:bg-slate-300"} hover:opacity-80 hover:disabled:opacity-100 transition relative flex flex-col justify-center items-center h-5 w-5 rounded-full text-white outline-none`}>
                      <IconMinus size={16} />
                      <IconMinus size={16} className={`${hasChild ? "" : "rotate-90"} transition absolute`} />
                  </button>
              </div>
              <h6 className='xl:text-base text-xs px-2 col-span-3'>{props.data?.code}</h6>
              <h6 className='xl:text-base text-xs px-2 col-span-2'>{props.data?.name}</h6>
              <h6 className='xl:text-base text-xs px-2 col-span-2 text-center'>{props.data?.level}</h6>
              <div className=' col-span-2 flex flex-wrap px-2'>
                  {props.data?.branch?.map(e => 
                      <h6 key={e?.id.toString()} className='text-[15px] mr-1 mb-1 py-[1px] px-1.5 text-[#0F4F9E] font-[300] rounded border border-[#0F4F9E] h-fit'>{e?.name}</h6>
                  )}
              </div>
              <div className='col-span-1 flex justify-center space-x-3'>
                  <Popup_danhmuc onRefresh={props.onRefresh} onRefreshOpt={props.onRefreshOpt} dataLang={props.dataLang} data={props.data} dataOption={props.dataOption} />
                  <button onClick={_HandleDelete.bind(this, props.data?.id)} className="xl:text-base text-xs outline-none"><IconDelete color="red"/></button>
              </div>
          </div>
          {hasChild &&
              <div className='bg-slate-50/50'>
                  {props.data?.children?.map((e) => 
                      <ItemsChild onClick={_HandleDelete.bind(this, e.id)} onRefresh={props.onRefresh} onRefreshOpt={props.onRefreshOpt} dataLang={props.dataLang} key={e.id} data={e}  grandchild="0"
                          children={e?.children?.map((e => 
                              <ItemsChild onClick={_HandleDelete.bind(this, e.id)} onRefresh={props.onRefresh} onRefreshOpt={props.onRefreshOpt} dataLang={props.dataLang} key={e.id} data={e} grandchild="1"
                                  children={e?.children?.map((e => 
                                      <ItemsChild onClick={_HandleDelete.bind(this, e.id)} onRefresh={props.onRefresh} onRefreshOpt={props.onRefreshOpt} dataLang={props.dataLang} key={e.id} data={e} grandchild="2" />
                                  ))}
                              />
                          ))} 
                      />
                  )}
              </div>
          }
      </div>
  )
})

const ItemsChild = React.memo((props) => {
  return(
      <React.Fragment key={props.data?.id}>
          <div className={`grid grid-cols-11 py-2.5 px-2 hover:bg-slate-100/40 `}>
              {props.data?.level == "3" && 
                  <div className='col-span-1 h-full flex justify-center items-center pl-24'>
                      <IconDown className='rotate-45' />
                  </div>
              }
              {props.data?.level == "2" && 
                  <div className='col-span-1 h-full flex justify-center items-center pl-12'>
                      <IconDown className='rotate-45' />
                      <IconMinus className='mt-1.5' />
                      <IconMinus className='mt-1.5' />
                  </div>
              }
              {props.data?.level == "1" && 
                  <div className='col-span-1 h-full flex justify-center items-center '>
                      <IconDown className='rotate-45' />
                      <IconMinus className='mt-1.5' />
                      <IconMinus className='mt-1.5' />
                      <IconMinus className='mt-1.5' />
                      <IconMinus className='mt-1.5' />
                  </div>
              }
              <h6 className='xl:text-base text-xs col-span-3 px-2 '>{props.data?.code}</h6>
              <h6 className='xl:text-base text-xs col-span-2 px-2  truncate'>{props.data?.name}</h6>
              <h6 className='xl:text-base text-xs col-span-2 px-2 text-center truncate'>{props.data?.level}</h6>
              <div className='col-span-2 flex flex-wrap px-2'>
                  {props.data?.branch.map(e => 
                      <h6 key={e?.id.toString()} className='text-[15px] mr-1 mb-1 py-[1px] px-1.5 text-[#0F4F9E] font-[300] rounded border border-[#0F4F9E] h-fit'>{e?.name}</h6>
                  )}
              </div>
              <div className='col-span-1 flex justify-center space-x-2'>
                  <Popup_danhmuc onRefresh={props.onRefresh}  dataLang={props.dataLang} data={props.data} />
                  <button onClick={props.onClick} className="xl:text-base text-xs"><IconDelete color="red"/></button>
              </div>
          </div>
          {props.children}
      </React.Fragment>
  )
})


const Popup_danhmuc = (props) => {
    const router = useRouter();
    const tabPage = router.query?.tab;

    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
    const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const [onSending, sOnSending] = useState(false);
    

    const [dataOption,sDataOption] = useState([])
    const [dataBranch,sDataBranch] = useState([])
    const [onFetching, sOnFetching] = useState(false);

    const [unit, sUnit] = useState("");
    
    const [stages_code ,sTagesCode] = useState("")
    const [stages_name ,sTagesName] = useState("")
    const [stages_status, sTagesStatus] = useState("0")
    const [stages_note, sTagesNote] = useState("")

    const [costs_code, sCosts_Code] = useState(null)
    const [costs_name, sCosts_Name] = useState(null)
    const [costs_branch, sCosts_Branch] = useState([])

    const [errInput, sErrInput] = useState(false);
    const [errInputcode, sErrInputcode] = useState(false);
    const [errInputName, sErrInputName] = useState(false);

    const [errCode , sErrcode] = useState(false);
    const [errName , sErrName] = useState(false);
    const [errBranch , sErrBranch] = useState(false);
    
    const [idCategory, sIdCategory] = useState(null);

    useEffect(() => {
      sErrInput(false)
      open && sCosts_Code(props.data?.code ? props.data?.code : "" )
      open && sCosts_Name(props.data?.name ? props.data?.name : "" )
      open && sCosts_Branch(props.data?.branch?.length > 0 ? props.data?.branch?.map(e => ({label: e.name, value: e.id})) : [] )
      open && sIdCategory(props.data?.parent_id ? props.data?.parent_id : null )
      sErrcode(false)
      sErrName(false)
      sErrBranch(false)
      sErrInputcode(false)
      sErrInputName(false)
      sTagesName(props.data?.name ? props.data?.name : "")
      sTagesCode(props.data?.code ? props.data?.code : "")
      sTagesStatus((props.data?.status_qc ? props.data?.status_qc : ""))
      sTagesNote(props.data?.note ? props.data?.note : "")
      sUnit(props.data?.unit ? props.data?.unit : "")
      open && sOnFetching(true);
    }, [open]);


    const _ServerSending = () => {
      const id =props.data?.id;
      var data = new FormData();
      if(tabPage === "units"){
        data.append('unit', unit);
      }
      if(tabPage === "stages"){
        data.append('code',  stages_code );
        data.append('name',  stages_name );
        data.append('status_qc',  stages_status);
        data.append('note',  stages_note );
      }if(tabPage === "costs"){
        data.append('code', costs_code);
        data.append('name', costs_name);
        data.append('parent_id', idCategory);
        costs_branch?.map((e, index) => {
          data.append(`branch_id[${index}]`, e?.value);
        })
      }
      Axios("POST", id ? 
      `${(tabPage === "units" && `/api_web/Api_unit/unit/${id}?csrf_protection=true ` || (tabPage === "stages" && `/api_web/api_product/stage/${id}?csrf_protection=true`) || (tabPage === "costs" && `/api_web/Api_cost/cost/${id}?csrf_protection=true`))} `
    :
      `${(tabPage === "units" && `/api_web/Api_unit/unit/?csrf_protection=true`)  || (tabPage === "stages" && `/api_web/api_product/stage/?csrf_protection=true`) || (tabPage === "costs" && `/api_web/Api_cost/cost/?csrf_protection=true`)} `
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
        sTagesCode("")
        sTagesName("")
        sTagesNote("")
        sTagesStatus("")
        sErrInput(false)
        sErrcode(false)
        sErrName(false)
        sCosts_Code('')
        sCosts_Name('')
        sIdCategory(null)
        sErrInputcode(false)
        sErrInputName(false)
        sCosts_Branch([])
        sErrBranch(false)
        sOpen(false)
        props.onRefresh && props.onRefresh()
    }else {
        Toast.fire({
          icon: 'error',
          title: props.dataLang[message]
        })  
      }
    } sOnSending(false)
  })
    }
    useEffect(() => {
      onSending && _ServerSending()
    }, [onSending])

    const _HandleChangeInput = (type, value) => {
      if(type == "unit"){
        sUnit(value.target?.value)
      }else if(type == "code"){
        sTagesCode(value.target?.value)
      }else if(type == "name"){
        sTagesName(value.target?.value)
      }else if(type === "status"){
        if(value.target?.checked === false){
          sTagesStatus("0")
        }else if(value.target?.checked === true){
        sTagesStatus("1")
      }
      }else if(type == "note"){
        sTagesNote(value.target?.value)
      }else if(type == "costs_code"){
        sCosts_Code(value.target?.value)
      }else if(type == "costs_name"){
        sCosts_Name(value.target?.value)
      }else if(type == "costs_branch"){
        sCosts_Branch(value)
      }
    }

    const valueIdCategory = (e) => sIdCategory(e?.value)


      const _ServerFetching =  () => {
        Axios("GET", "/api_web/Api_Branch/branchCombobox/?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {isSuccess, result} =  response.data
                sDataBranch(result?.map(e =>({label: e.name, value:e.id})))       
            }
        })
        Axios("GET", `${props.data?.id ? `/api_web/Api_cost/costCombobox/${props.data?.id}?csrf_protection=true` : "/api_web/Api_cost/costCombobox/?csrf_protection=true"}`, {}, (err, response) => {
          if(!err){
              var {rResult} = response.data;
              sDataOption(rResult.map(e => ({label: e.name + " " + "(" + e.code + ")", value: e.id, level: e.level})))
          }
        })
    sOnFetching(false)  
    }
   
  useEffect(() => {
      onFetching && _ServerFetching()
  }, [onFetching]);


    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    })
    const _HandleSubmit = (e) => {
      e.preventDefault()
      if(tabPage === "units"){
        if(unit?.length == 0){
          unit?.length ==0 && sErrInput(true) 
             Toast.fire({
          icon: 'error',
          title: `${props.dataLang?.required_field_null}`
      })}else{
          sOnSending(true)
        }}else if(tabPage === "stages"){
        if(stages_name?.length == 0 || stages_code?.length == 0){
          stages_name?.length == 0 && sErrInputName(true) 
          stages_code?.length == 0 && sErrInputcode(true) 
             Toast.fire({
          icon: 'error',
          title: `${props.dataLang?.required_field_null}`
      })}else{
          sOnSending(true)
        }
      }else if(tabPage === "costs"){
        if(costs_code == "" || costs_name == "" || costs_branch?.length == 0){
          costs_code == "" && sErrcode(true)
          costs_name == "" && sErrName(true) 
          costs_branch?.length == 0 && sErrBranch(true)
             Toast.fire({
          icon: 'error',
          title: `${props.dataLang?.required_field_null}`
      })}else{
          sOnSending(true)
        }
      }
    }
    useEffect(() => {
      sErrInput(false)
    }, [unit.length > 0])

    useEffect(() => {
      sErrInputName(false) 
      sErrInputcode(false)
    }, [stages_code.length > 0, stages_name?.length > 0])

    useEffect(() =>{
       sErrcode(false)
    },[costs_code != ""])

    useEffect(() =>{
       sErrName(false)
    },[costs_name != ""])

    useEffect(() =>{
      sErrBranch(false)
   },[costs_branch?.length > 0])

    const hiddenOptionsClient = costs_branch?.length > 3 ? costs_branch?.slice(0, 3) : [];
    const optionsClient = dataBranch ? dataBranch?.filter((x) => !hiddenOptionsClient.includes(x.value)) : [];

    return(
      <PopupEdit  
        title={props.data?.id ? `${(tabPage === "units" && props.dataLang?.category_unit_edit) || (tabPage === "stages" && props.dataLang?.settings_category_stages_edit) || (tabPage === "costs" && "Sửa loại chi phí") }` : `${(tabPage === "units" && props.dataLang?.category_unit_add) || (tabPage === "stages" && props.dataLang?.settings_category_stages_add) || (tabPage === "costs" && "Tạo loại chi phí")}`} 
        button={props.data?.id ? <IconEdit/> : `${props.dataLang?.branch_popup_create_new}`} 
        onClickOpen={_ToggleModal.bind(this, true)} 
        open={open} onClose={_ToggleModal.bind(this,false)}
        classNameBtn={props.className}
      >
        <div className={`w-[33vw] mt-4`}>
          <form onSubmit={_HandleSubmit.bind(this)}>
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
                      className={`${errInput ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}

                    />
                              {errInput && <label className="mb-4  text-[14px] text-red-500">{"Vui lòng nhập tên đơn vị"}</label>}

                  </div>
                      
                </React.Fragment>
              }
              {tabPage === "stages" &&
                <React.Fragment>
                  <div className="flex flex-wrap justify-between">
                    <div className="w-full">
                      <label className="text-[#344054] font-normal text-sm mb-1 ">{"Mã chi phí"}<span className="text-red-500">*</span></label>
                      <div>
                        <input
                          // value={stages_code}                
                          // onChange={_HandleChangeInput.bind(this, "code")}
                          placeholder={"Mã chi phí"}
                          name="fname"                      
                          type="text"
                          className={`"focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <label className="text-[#344054] font-normal text-sm mb-1 ">{"Tên chi phí"}<span className="text-red-500">*</span></label>
                      <div>
                        <input
                          // value={stages_code}                
                          // onChange={_HandleChangeInput.bind(this, "code")}
                          placeholder={"Tên chi phí"}
                          name="fname"                      
                          type="text"
                          className={`"focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                        />
                      </div>
                    </div>
                    <div className="w-full">
                   <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.settings_category_stages_name}<span className="text-red-500">*</span></label>
                    <div>
                      <input
                         value={stages_name}                
                        onChange={_HandleChangeInput.bind(this, "name")}
                        placeholder={props.dataLang?.settings_category_stages_name}
                        name="fname"                      
                        type="text"
                        className={`${errInputName ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                      />
                      {errInputName && <label className="mb-4  text-[14px] text-red-500">{props.dataLang?.settings_category_stages_errName}</label>}
                     </div>
                   </div>
                  
                  <div className="w-full flex justify-between flex-wrap">
                          <div className='inline-flex items-center w-[50%] gap-3.5' >               
                            <label className="relative flex cursor-pointer items-center rounded-full p-1" htmlFor="1" data-ripple-dark="true" > 
                                        <input
                                            type="checkbox"
                                            className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 "
                                            id="1"
                                          
                                                 value={stages_status}
                                       checked={stages_status === "0" ? false : stages_status === "1" && true}
                                        onChange={_HandleChangeInput.bind(this, "status")}
                                        />
                                        <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                            <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3.5 w-3.5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            stroke="currentColor"
                                            stroke-width="1"

                                            >
                                            <path
                                                fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd"
                                            ></path>
                                            </svg>
                                        </div>
                                        
                                    </label>
                              <label htmlFor="1" className='text-[#344054] font-medium text-base  cursor-pointer '>{props.dataLang?.settings_category_stages_status}</label>
                            
                          </div>
                          
                          
                         
                    </div>
                    
                  <div className="w-full flex justify-between flex-wrap">
                          <div className='w-full ' >               
                          <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.settings_category_stages_note}</label>
                              <textarea
                                value={stages_note}  
                                placeholder={props.dataLang?.settings_category_stages_note}             
                                onChange={_HandleChangeInput.bind(this, "note")}
                                name="fname"                      
                                type="text"
                                className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[140px] h-[40px] max-h-[240px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
                              />                          
                          </div>
                    </div>
                  </div>  
                </React.Fragment>
              }
              {tabPage === "costs" &&
               <React.Fragment>
                 <div className='py-4 space-y-5'>
                 <div className='space-y-1'>
                    <label className="text-[#344054] font-normal text-base">{"Mã chi phí"} <span className='text-red-500'>*</span></label>
                    <input 
                    value={costs_code} onChange={_HandleChangeInput.bind(this, "costs_code")}
                     type="text" placeholder={"Mã chi phí"} className={`${errCode ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`} />
                    {errCode && <label className="text-sm text-red-500">{"Vui lòng chọn mã chi phí"}</label>}
                </div>
                 <div className='space-y-1'>
                    <label className="text-[#344054] font-normal text-base">{"Tên chi phí"} <span className='text-red-500'>*</span></label>
                    <input 
                    value={costs_name} onChange={_HandleChangeInput.bind(this, "costs_name")}
                     type="text" placeholder={"Tên chi phí"} className={`${errName ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`} />
                    {errName && <label className="text-sm text-red-500">{"Vui lòng nhập tên chi phí"}</label>}
                </div>
                <div className='col-span-6 max-h-[65px] min-h-[65px]'>
                            <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] mb-1 ">{"Chi nhánh"} <span className="text-red-500">*</span></label>
                              <Select   
                                  closeMenuOnSelect={true}
                                  placeholder={"Chi nhánh"}
                                  options={dataBranch}
                                  isSearchable={true}
                                  onChange={_HandleChangeInput.bind(this, "costs_branch")}
                                  value={costs_branch}
                                  isMulti
                                  components={{ MultiValue }}
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
                                className={`${errBranch ? "border-red-500" : "border-transparent" } text-sm placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] mb-2 font-normal outline-none border `} 
                              />
                                {errBranch && <label className="mb-2 text-sm text-red-500">{"Vui lòng chọn chi nhánh"}</label>}
                            </div>
                  <div className='space-y-1 mt-2'>
                    <label className="text-[#344054] font-normal text-base">{"Nhóm cha"}</label>
                    <Select 
                        options={dataOption}
                        formatOptionLabel={CustomSelectOption}
                        defaultValue={(idCategory == "0" || !idCategory) ? {label: `${"Nhóm cha"}`} : {label: dataOption.find(x => x?.parent_id == idCategory)?.label, code:dataOption.find(x => x?.parent_id == idCategory)?.code, value: idCategory}}
                        value={(idCategory == "0" || !idCategory) ? {label: "Nhóm cha", code: "nhóm cha"} : {label: dataOption.find(x => x?.value == idCategory)?.label, code:dataOption.find(x => x?.value == idCategory)?.code, value: idCategory}}
                        onChange={valueIdCategory.bind(this)}
                        isClearable={true}
                        placeholder={"Nhóm cha"}
                        className="placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none" 
                        isSearchable={true}
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