import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';

import {ListBtn_Setting} from "./information"
import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import {_ServerInstance as Axios} from '/services/axios';
import Pagination from '/components/UI/pagination';

import { Edit as IconEdit, Trash as IconDelete, SearchNormal1 as IconSearch, Add as IconAdd } from "iconsax-react";
import Swal from "sweetalert2";

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

    const [data, sData] = useState([]);
    const [onFetching, sOnFetching] = useState(false);
    
    const [totalItems, sTotalItems] = useState([]);
    const [keySearch, sKeySearch] = useState("")
    const [limit, sLimit] = useState(15);

    const _ServerFetching = () => {
        Axios("GET", "/api_web/Api_variation/variation?csrf_protection=true", {
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
        sOnFetching(true) || (keySearch && sOnFetching(true))
    }, [limit,router.query?.page]);

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
            Axios("DELETE", `/api_web/Api_variation/variation/${id}?csrf_protection=true`, {
            }, (err, response) => {
              if(!err){
                var {isSuccess, message} = response.data;
                if(isSuccess){
                  Toast.fire({
                    icon: 'success',
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
            pathname: '/settings/variant',
            query: { page: pageNumber }
        })
    }
    
    const _HandleOnChangeKeySearch = ({target: {value}}) => {
        sKeySearch(value)
        router.replace("/settings/variant")
        setTimeout(() => {
            if(!value){
              sOnFetching(true)
            }
            sOnFetching(true)
        }, 500);
    };

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.list_btn_seting_variant}</title>
            </Head>
            <div className='px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen'>
                <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                    <h6 className='text-[#141522]/40'>{dataLang?.branch_seting}</h6>
                    <span className='text-[#141522]/40'>/</span>
                    <h6>{dataLang?.list_btn_seting_variant}</h6>
                </div>
                <div className='grid grid-cols-9 gap-5 h-[99%]'>
                    <div className="col-span-2 h-fit p-5 rounded bg-[#E2F0FE] space-y-3 sticky ">
                        <ListBtn_Setting dataLang={dataLang} />
                    </div>
                    <div className='col-span-7 h-[100%] flex flex-col justify-between overflow-hidden'>
                        <div className='space-y-3 h-[96%] overflow-hidden'>
                            <h2 className='text-2xl text-[#52575E]'>{dataLang?.list_btn_seting_variant}</h2>
                            <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">
                                <div className="flex justify-end">
                                    <Popup_ChiNhanh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />
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
                                            <label className="font-[300] text-slate-400">{dataLang?.display} :</label>
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
                                    <div className="xl:w-[100%] w-[110%] pr-2">
                                        <div className='grid grid-cols-10 gap-5 sticky top-0 bg-white p-2 z-10'>
                                            <h4 className="xl:text-[14px] px-2 text-[12px] col-span-3 text-[#667085] uppercase font-[300] text-left">{dataLang?.variant_name}</h4>
                                            <h4 className="xl:text-[14px] px-2 text-[12px] col-span-5 text-[#667085] uppercase font-[300] text-left">{dataLang?.branch_popup_variant_option}</h4>
                                            <h4 className="xl:text-[14px] px-2 text-[12px] col-span-2 text-[#667085] uppercase font-[300] text-center">{dataLang?.branch_popup_properties}</h4>
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
                                                                <Popup_ChiNhanh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />    
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px]"> 
                                                    {data.map((e) => 
                                                        <div key={e.id.toString()} className="grid grid-cols-10 gap-5 py-1.5 px-2 hover:bg-slate-100/40 ">
                                                            <h6 className="xl:text-base text-xs px-2 col-span-3 ">{e?.name}</h6>
                                                            <div className='col-span-5 px-2 flex flex-wrap'>
                                                                {e?.option?.map((e) =>
                                                                    <h6 key={e.id.toString()} className="mr-2 mb-1 w-fit xl:text-base text-xs px-2 text-[#0F4F9E] font-[300] py-0.5 border border-[#0F4F9E] rounded-lg">{e.name}</h6>
                                                                )}
                                                            </div>
                                                            <div className="space-x-2 col-span-2 flex justify-center items-start">
                                                                <Popup_ChiNhanh onRefresh={_ServerFetching.bind(this)} name={e.name} option={e.option} id={e.id} className="xl:text-base text-xs" dataLang={dataLang} />
                                                                <button onClick={()=>handleDelete(e.id)} className="xl:text-base text-xs"><IconDelete color="red"/></button>
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
                        {data?.length != 0 &&
                            <div className='flex space-x-5 items-center'>
                                <h6>Hiển thị {totalItems?.iTotalDisplayRecords} trong số {totalItems?.iTotalRecords} biến thể</h6>
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

const Popup_ChiNhanh = (props) => {
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);

    const [onSending, sOnSending] = useState(false);

    const [name, sName] = useState("");
    const [option, sOption] = useState([]);
    const [optionErr, sOptionErr] = useState(false);
    const [listOptErr, sListOptErr] = useState();

    useEffect(() => {
        sOption(props.option ? props.option : []) 
        sName(props.name ? props.name : "")
    }, [open]);

    const [optionName, sOptionName] = useState("");
    const id = props.id

    const _HandleChangeInput = (type, value) => {
        if(type == "name"){
            sName(value.target?.value)
        }else if(type == "optionName"){
            sOptionName(value.target?.value)
        }
    }

    const _OnChangeOption = (id, value) => {
        var index = option.findIndex(x=> x.id === id);
        option[index].name = value.target?.value;
        sOption([...option])
    }

  const _ServerSending = () => {
    Axios("POST", `${props.id ? `/api_web/Api_variation/variation/${id}?csrf_protection=true` : "/api_web/Api_variation/variation?csrf_protection=true"}`, {
      data: {
        name: name,
        option: option
      },
    }, (err, response) => {
      if(!err){
            var {isSuccess, message, same_option} = response.data;
            if(isSuccess){
                Toast.fire({
                    icon: 'success',
                    title: `${props.dataLang[message]}`
                })
                sName("")
                sOption([])
                props.onRefresh && props.onRefresh()
                sOpen(false)
                sListOptErr()
            }else{
                Toast.fire({
                    icon: 'warning',
                    title: `${props.dataLang[message]}`
                })
                // const res = option.filter(i => same_option.some(item => i.name === item));
                sListOptErr(same_option)
            }
            sOnSending(false)
        }
    })
  }

    useEffect(() => {
        onSending && _ServerSending()
    }, [onSending]);

    const _HandleSubmit = (e) => {
        e.preventDefault()
        sOnSending(true)
    }

    const _HandleAddNew = () => {
        sOption([...option, {id: Date.now(), name: optionName}])
        sOptionName("")
    }
    const _HandleDelete = (id) => {
        sOption([...option.filter(x=> x.id !== id)])
    }

  return(
    <PopupEdit  
      title={props.id ? `${props.dataLang?.variant_popup_edit}` : `${props.dataLang?.branch_popup_create_new_variant}`} 
      button={props.id ? <IconEdit/> : `${props.dataLang?.branch_popup_create_new}`} 
      onClickOpen={_ToggleModal.bind(this, true)} 
      open={open} onClose={_ToggleModal.bind(this,false)}
      classNameBtn={props.className}
    >
      <div className="mt-4 w-[400px]">
        <form onSubmit={_HandleSubmit.bind(this)} className="space-y-6">
            <div className="flex flex-wrap justify-between">
              <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.variant_name} <span className='text-red-500'>*</span></label>
              <input
                value={name}
                name="nameVariant"
                onChange={_HandleChangeInput.bind(this, "name")}
                placeholder={props.dataLang?.variant_name}                       
                type="text"
                className="placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <h6 className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.branch_popup_variant_option}</h6>
              <div className='pr-3 max-h-60 overflow-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'>
                {option.map((e) => 
                    <div className='flex space-x-3 items-center' key={e.id?.toString()}>
                        <input
                            value={e.name}
                            onChange={_OnChangeOption.bind(this, e.id)}
                            placeholder="Nhập tùy chọn"      
                            name="optionVariant"                 
                            type="text"
                            className={`${listOptErr?.some(i => i === e.name) ? "border-red-500" : "border-[#d0d5dd] focus:border-[#92BFF7]"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none`}
                        />     
                        <button onClick={_HandleDelete.bind(this, e.id)} type='button' title='Xóa' className='transition hover:scale-105 min-w-[40px] h-10 rounded-lg text-red-500 flex flex-col justify-center items-center'><IconDelete /></button>
                    </div>
                )}
              </div>
              <div className='flex space-x-3 items-center pr-3'>
                <input
                    value={optionName}
                    onChange={_HandleChangeInput.bind(this, "optionName")}
                    placeholder="Nhập tùy chọn"                      
                    type="text"
                    className="placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none"
                />     
                <button type='button' onClick={_HandleAddNew.bind(this)} title='Thêm' className='transition hover:scale-105 min-w-[40px] h-10 rounded-lg bg-slate-100 flex flex-col justify-center items-center'><IconAdd /></button>
              </div>
              {/* <button className='w-full h-10 rounded-lg flex flex-col justify-center items-center bg-slate-100'><IconAdd /></button> */}
            </div>       
            <div className="text-right pt-5 space-x-2">
              <button type='button' onClick={_ToggleModal.bind(this,false)} className="text-base py-2 px-4 rounded-lg bg-slate-200 hover:opacity-90 hover:scale-105 transition">{props.dataLang?.branch_popup_exit}</button>
              <button type="submit" className="text-[#FFFFFF] text-base py-2 px-4 rounded-lg bg-[#0F4F9E] hover:opacity-90 hover:scale-105 transition">{props.dataLang?.branch_popup_save}</button>
            </div>
        </form>
      </div>
    </PopupEdit>
  )
}

export default Index;
