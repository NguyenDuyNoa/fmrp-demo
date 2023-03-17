import React, {useState, useEffect} from 'react';
import Head from 'next/head';

import {_ServerInstance as Axios} from '/services/axios';
import PopupEdit from "/components/UI/popup";

import Popup from 'reactjs-popup';
import { Minus as IconMinus, SearchNormal1 as IconSearch, ArrowDown2 as IconDown } from "iconsax-react";

const Index = () => {
    const [onFetching, sOnFetching] = useState(false);
    const [data, sData] = useState([]);
    const [totalItems, sTotalItems] = useState({});

    const _ServerFetching = () => {
        Axios("GET", "/api_web/api_material/category", {}, (err, response) => {
            if(!err){
                console.log(response)
                var {output, rResult} = response.data;
                sData(rResult);
                sTotalItems(output);
            }
        })
    }

    useEffect(() => {
        onFetching && _ServerFetching()
    }, [onFetching]);

    useEffect(() => {
        sOnFetching(true)
    }, []);

    const dataFake = [
        {
            id: "01",
            name: "mnbsdf smnbsdf",
            note: 'asdasdasd asdasd',
            child: [
                {id: "010", name: "mnbsdf smnbsdf", note: 'poi 098 wer'},
                {
                    id: "011", 
                    name: "mnbsdf smnbsdf", 
                    note: 'poi 098 wer',
                    child: [
                        {
                            id: "0110", 
                            name: "mnbsdf smnbsdf", 
                            note: 'poi 098 wer',
                            child: [
                                {id: "01100", name: "mnbsdf smnbsdfyyyy", note: 'poi 098 wer'},
                                {id: "01101", name: "mnbsdf smnbsdfyyyy", note: 'poi 098 wer'},
                            ]
                        },
                        {id: "0111", name: "mnbsdf smnbsdf", note: 'poi 098 wer'}
                    ]
                },
                {id: "012", name: "mnbsdf smnbsdf", note: 'poi 098 wer'},
            ]
        },{
            id: "02",
            name: "mnbsdf smnbsdf",
            note: 'asdasdasd asdasd',
            child: [
                {id: "020", name: "mnbsdf smnbsdf", note: 'poi 098 wer'},
                {
                    id: "021", 
                    name: "mnbsdf smnbsdf", 
                    note: 'poi 098 wer',
                    child: [
                        {
                            id: "0210", 
                            name: "mnbsdf smnbsdf", 
                            note: 'poi 098 wer',
                            child: [
                                {id: "02100", name: "mnbsdf smnbsdfyyyy", note: 'poi 098 wer'},
                                {id: "02101", name: "mnbsdf smnbsdfyyyy", note: 'poi 098 wer'},
                            ]
                        },
                        {id: "0211", name: "mnbsdf smnbsdf", note: 'poi 098 wer'}
                    ]
                },
                {id: "022", name: "mnbsdf smnbsdf", note: 'poi 098 wer'},
            ]
        },{
            id: "03",
            name: "mnbsdf smnbsdf",
            note: 'asdasdasd asdasd'
        }
    ]
    return (
        <React.Fragment>
            <Head>
                <title>Nhóm nguyên vật liệu</title>
            </Head>
            <div className='px-10 xl:pt-24 pt-[88px] pb-3 space-y-2.5 h-screen overflow-hidden flex flex-col justify-between'>
                <div className='h-[97%] space-y-3 overflow-hidden'>
                    <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                        <h6 className='text-[#141522]/40'>Danh mục</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6 className='text-[#141522]/40'>NVL, thành phẩm, vật tư</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6>Nhóm nguyên vật liệu</h6>
                    </div>
                    <div className='flex justify-between items-center'>
                        <h2 className='xl:text-3xl text-xl font-medium '>Nhóm nguyên vật liệu</h2>
                        <div className='flex space-x-3 items-center'>
                            <Popup_NVL className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105' />
                            <BtnTacVu className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#e2e8f0] via-[#e2e8f0] via-[#cbd5e1] to-[#e2e8f0] rounded btn-animation hover:scale-105 " />
                        </div>
                    </div>
                    <div className='bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2'>
                        <form className="flex items-center relative">
                            <IconSearch size={20} className='absolute left-3 z-10 text-[#cccccc]' />
                            <input
                                className=" relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10 pr-5 py-2 rounded-md w-[400px]"
                                type="text"
                                placeholder="Search by PO number, name, amount..."
                            />
                        </form>
                    </div>
                    <div className='min:h-[500px] h-[81%] max:h-[800px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'>
                        <div className='xl:w-[100%] w-[110%] pr-2'>
                            <div className='flex items-center sticky top-0 bg-white p-2 z-10 shadow-[-20px_-9px_20px_0px_#0000003d]'>
                                <div className='w-[2%] flex justify-center'>
                                    <input type='checkbox' className='scale-125' />
                                </div>
                                <h4 className='w-[8%]'/>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[30%] font-[300]'>mã danh mục</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[300]'>tên danh mục</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[30%] font-[300]'>ghi chú</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300] text-center'>tác vụ</h4>
                            </div>
                            <div className='divide-y divide-slate-200'>
                                {data.map((e) => <Items id={e.id} name={e.name} code={e.code} note={e.note} children={e?.children} />)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className=''>
                    <h6>Hiển thị 8 trong số 8 biến thể</h6>
                </div>
            </div>
        </React.Fragment>
    );
}

const Items = React.memo((props) => {
    const [hasChild, sHasChild] = useState(false);
    const _ToggleHasChild = () => sHasChild(!hasChild);

    return(
        <div>
            <div key={props.id} className='flex items-center py-2 px-2 bg-white hover:bg-slate-50 relative'>
                <div className='w-[2%] flex justify-center'>
                    <input type='checkbox' className='scale-125' />
                </div>
                <div className='w-[8%] flex justify-center'>
                    <button disabled={props?.children?.length > 0 ? false : true} onClick={_ToggleHasChild.bind(this)} className={`${hasChild ? "bg-red-600" : "bg-green-600 disabled:bg-green-800"} hover:opacity-80 hover:disabled:opacity-100 transition relative flex flex-col justify-center items-center h-5 w-5 rounded-full text-white outline-none`}>
                        <IconMinus size={16} />
                        <IconMinus size={16} className={`${hasChild ? "" : "rotate-90"} transition absolute`} />
                    </button>
                </div>
                <h6 className='xl:text-base text-xs px-2 w-[30%]'>{props.id}</h6>
                <h6 className='xl:text-base text-xs px-2 w-[20%]'>{props.name}</h6>
                <h6 className='xl:text-base text-xs px-2 w-[30%]'>{props.note}</h6>
                <div className='w-[10%] bg-red-500 h-2' />
            </div>
            {hasChild &&
                <React.Fragment>
                    {props?.children?.map((e) => 
                        <ItemsChild id={e.id} name={e.name} note={e.note} grandchild="0"
                            children={e?.children?.map((e => 
                                <ItemsChild id={e.id} name={e.name} note={e.note} grandchild="1" 
                                    children={e?.children?.map((e => 
                                        <ItemsChild id={e.id} name={e.name} note={e.note} grandchild="2" />
                                    ))}
                                />
                            ))} 
                        />
                    )}
                </React.Fragment>
            }
        </div>
    )
})

const ItemsChild = React.memo((props) => {
    return(
        <React.Fragment>
            <div key={props.id} className={`flex items-center py-2.5 px-2 hover:bg-slate-100/40 `}>
                {props.grandchild == "2" && 
                    <div className='w-[10%] h-full flex justify-center items-center pl-24'>
                        <IconDown className='rotate-45' />
                    </div>
                }
                {props.grandchild == "1" && 
                    <div className='w-[10%] h-full flex justify-center items-center pl-12'>
                        <IconDown className='rotate-45' />
                        <IconMinus className='mt-1.5' />
                        <IconMinus className='mt-1.5' />
                    </div>
                }
                {props.grandchild == "0" && 
                    <div className='w-[10%] h-full flex justify-center items-center '>
                        <IconDown className='rotate-45' />
                        <IconMinus className='mt-1.5' />
                        <IconMinus className='mt-1.5' />
                        <IconMinus className='mt-1.5' />
                        <IconMinus className='mt-1.5' />
                    </div>
                }
                <h6 className='xl:text-base text-xs px-2 w-[30%]'>{props.id}</h6>
                <h6 className='xl:text-base text-xs px-2 w-[20%]'>{props.name}</h6>
                <h6 className='xl:text-base text-xs px-2 w-[30%]'>{props.note}</h6>
                <div className='w-[10%] bg-red-500 h-2' />
            </div>
            {props.children}
        </React.Fragment>
    )
})

const BtnTacVu = React.memo((props) => {
    return(
        <div>
            <Popup
                trigger={
                    <button className={`flex space-x-1 items-center ` + props.className } >
                        <span>Tác vụ</span>
                        <IconDown size={15} />
                    </button>
                }
                closeOnDocumentClick
                arrow={false}
                position="bottom right"
                className={`dropdown-edit `}
            >
                <div className="w-auto">
                    <div className="bg-white p-0.5 rounded-t w-52">
                        <button className='text-sm hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Export Excel</button>
                        <button className='text-sm hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Import Excel</button>
                        <button className='text-sm hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Import BOM</button>
                        <button className='text-sm hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Import công đoạn</button>
                        <button className='text-sm hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Thống kê và tìm kiếm</button>
                        <button className='text-sm hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Xóa</button>
                    </div>
                </div>
            </Popup>
        </div>
    )
})

const Popup_NVL = React.memo((props) => {
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);

    return(
        <PopupEdit  
            title={props.id ? `Chỉnh sửa` : `Tạo mới`} 
            button={props.id ? <IconEdit/> : `Tạo mới`} 
            onClickOpen={_ToggleModal.bind(this, true)} 
            open={open} 
            onClose={_ToggleModal.bind(this,false)}
            classNameBtn={props.className}
        >
            <div className='py-4 w-96 space-y-5'>
                <div className='space-y-1'>
                    <label className="text-[#344054] font-normal text-base">Mã danh mục <span className='text-red-500'>*</span></label>
                    <input className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder-[color:#667085] w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal  p-2 border outline-none`} />
                    <label className="text-sm text-red-500">Vui lòng nhập mã danh mục</label>
                </div>
                <div className='space-y-1'>
                    <label className="text-[#344054] font-normal text-base">Tên danh mục <span className='text-red-500'>*</span></label>
                    <input className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder-[color:#667085] w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal  p-2 border outline-none`} />
                    <label className="text-sm text-red-500">Vui lòng nhập tên danh mục</label>
                </div>
                <div className='space-y-1'></div>
            </div>
        </PopupEdit>
    )
})

export default Index;