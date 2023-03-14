import React, {useState, useEffect} from 'react';
import Head from 'next/head';

import {ListBtn_Setting} from "./information"
import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import {_ServerInstance as Axios} from '/services/axios';

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
    const dataLang = props.dataLang;
    const [onFetching, sOnFetching] = useState(false);
    const [data, sData] = useState([]);
    const [totalItems, sTotalItems] = useState("");

    const _ServerFetching = () => {
        Axios("GET", "/api_web/Api_variation/variation?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {rResult, output} = response.data
                sData(rResult)
                sTotalItems(output?.iTotalRecords)
            }
            sOnFetching(false)
        })
    }

    useEffect(() => {
        onFetching && _ServerFetching()
    }, [onFetching]);
    useEffect(() => {
        sOnFetching(true)
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>Thiết lập biến thể</title>
            </Head>
            <div className='px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen'>
                <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                    <h6 className='text-[#141522]/40'>Cài đặt</h6>
                    <span className='text-[#141522]/40'>/</span>
                    <h6>Thiết lập biến thể</h6>
                </div>
                <div className='grid grid-cols-9 gap-5 h-full'>
                    <div className="col-span-2 h-fit p-5 rounded bg-[#E2F0FE] space-y-3 sticky ">
                        <ListBtn_Setting dataLang={dataLang} />
                    </div>
                    <div className='col-span-7 h-[99%] flex flex-col justify-between'>
                        <div className='space-y-3'>
                            <h2 className='text-2xl text-[#52575E]'>Thiết Lập Biến Thể</h2>
                            <div className=" pb-3 space-y-2.5 flex flex-col justify-between">
                                <div className="3xl:h-[65%] 2xl:h-[60%] xl:h-[55%] h-[57%] space-y-2">
                                    <div className="flex justify-end">
                                        <Popup_ChiNhanh dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />
                                    </div>
                                    <div className="xl:space-y-3 space-y-2">
                                        <div className="bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2">
                                            <form className="flex items-center relative">
                                                <IconSearch size={20} className="absolute left-3 z-10 text-[#cccccc]" />
                                                <input
                                                    className=" relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10 pr-5 py-2 rounded-md w-[400px]"
                                                    type="text"  
                                                    // value={props.result}
                                                    // onChange={props.onChange}
                                                    placeholder={dataLang?.branch_search}
                                                />
                                            </form>
                                        </div>
                                    </div>
                                    <div className="min:h-[500px] h-[100%] max:h-[900px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                        <div className="xl:w-[100%] w-[110%] pr-2">
                                            <div className='grid grid-cols-10 gap-5 sticky top-0 bg-white p-2 z-10'>
                                                <h4 className="xl:text-[14px] px-2 text-[12px] col-span-3 text-[#667085] uppercase font-[300] text-left">tên biến thể</h4>
                                                <h4 className="xl:text-[14px] px-2 text-[12px] col-span-5 text-[#667085] uppercase font-[300] text-left">các tùy chọn</h4>
                                                <h4 className="xl:text-[14px] px-2 text-[12px] col-span-2 text-[#667085] uppercase font-[300] text-center">thuộc tính</h4>
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
                                                                    <Popup_ChiNhanh name={e.name} option={e.option} id={e.id} className="xl:text-base text-xs" dataLang={dataLang} />
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
                        </div>
                        {data?.length != 0 &&
                            <div className='flex flex-col justify-end'>Hiển thị 2 trong số 2 biến thể</div>                   
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

    const [name, sName] = useState(props.name ? props.name : "");
    const [option, sOption] = useState(props.option ? props.option : []);
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
    //   if(!err){
    //         var isSuccess = response.data?.isSuccess;
    //         if(isSuccess){
    //             Toast.fire({
    //                 icon: 'success',
    //                 title: `${props.dataLang?.aler_success}`
    //             })
    //         }
    //         sName(props.name ? props.name : "")
    //         sAddress(props.address ? props.address : "")
    //         sPhone(props.phone ? props.phone : "")
    //     }
    //     props.onRefresh && props.onRefresh()
    //     sOpen(false)
        sOnSending(false)
        console.log(err, response)
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
      title={props.id ? `${props.dataLang?.branch_popup_edit}` : `${props.dataLang?.branch_popup_create_new_branch}`} 
      button={props.id ? <IconEdit/> : `${props.dataLang?.branch_popup_create_new}`} 
      onClickOpen={_ToggleModal.bind(this, true)} 
      open={open} onClose={_ToggleModal.bind(this,false)}
      classNameBtn={props.className}
    >
      <div className="content mt-4 w-80">
        <form onSubmit={_HandleSubmit.bind(this)} className="space-y-6">
            <div className="flex flex-wrap justify-between">
              <label className="text-[#344054] font-normal text-sm mb-1 ">Tên biến thể</label>
              <input
                required
                value={name}
                onChange={_HandleChangeInput.bind(this, "name")}
                name="fname"                       
                type="text"
                className="placeholder-[color:#667085] w-full bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none"
              />
            </div>
            <div className="space-y-2">
              <h6 className="text-[#344054] font-normal text-sm mb-1 ">Các tùy chọn</h6>
              {option.map((e) => 
                <div className='flex space-x-3 items-center' key={e.id?.toString()}>
                    <input
                        value={e.name}
                        onChange={_OnChangeOption.bind(this, e.id)}
                        placeholder="Nhập tùy chọn"                       
                        type="text"
                        className="placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none"
                    />     
                    <button onClick={_HandleDelete.bind(this, e.id)} type='button' title='Xóa' className='transition hover:scale-105 min-w-[40px] h-10 rounded-lg text-red-500 flex flex-col justify-center items-center'><IconDelete /></button>
                </div>
              )}
              <div className='flex space-x-3 items-center'>
                <input
                    value={optionName}
                    onChange={_HandleChangeInput.bind(this, "optionName")}
                    placeholder="Nhập tùy chọn"                      
                    type="text"
                    className="placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none"
                />     
                <button type='button' onClick={_HandleAddNew.bind(this)} title='Thêm' className='transition hover:scale-105 min-w-[40px] h-10 rounded-lg bg-slate-100 flex flex-col justify-center items-center'><IconAdd /></button>
              </div>
            </div>       
            <div className="text-right pt-5 space-x-2">
              <button onClick={_ToggleModal.bind(this,false)} className="button text-[#344054] font-normal text-base py-2 px-4 rounded-lg border border-solid border-[#D0D5DD]"
              >{props.dataLang?.branch_popup_exit}</button>
              <button 
                type="submit"
                className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-lg bg-[#0F4F9E]"
              >{props.dataLang?.branch_popup_save}</button>
            </div>
        </form>
      </div>
    </PopupEdit>
  )
}

export default Index;
