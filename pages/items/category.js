import React, {useState} from 'react';
import Head from 'next/head';

import Popup from 'reactjs-popup';
import {
    Minus as IconMinus, Filter as IconFilter, Calendar as IconCalendar, SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown
} from "iconsax-react";
const Index = () => {

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
                                {
                                    id: "01100", 
                                    name: "mnbsdf smnbsdfyyyy", 
                                    note: 'poi 098 wer',
                                    child: [{id: "011000", name: "mnbsdf smnbsdf", note: 'poi 098 wer'},]
                                },
                            ]
                        },
                        {id: "0111", name: "mnbsdf smnbsdf", note: 'poi 098 wer'}
                    ]
                },
                {id: "012", name: "mnbsdf smnbsdf", note: 'poi 098 wer'},
            ]
        }
    ]

    const [hasChild, sHasChild] = useState(false);
    const _ToggleHasChild = () => sHasChild(!hasChild);

    return (
        <React.Fragment>
            <Head>
                <title>Nhóm nguyên vật liệu</title>
            </Head>
            <div className='px-10 xl:pt-24 pt-[88px] pb-3 space-y-2.5 h-screen flex flex-col justify-between'>
                <div className='3xl:h-[65%] 2xl:h-[60%] xl:h-[55%] h-[57%] space-y-3'>
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
                            <button className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105'>Tạo mới</button>
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
                    <div className='min:h-[500px] h-[100%] max:h-[900px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'>
                        <div className='xl:w-[100%] w-[110%] pr-2'>
                            <div className='flex items-center sticky top-0 bg-white p-2 z-10'>
                                <div className='w-[2%] flex justify-center'>
                                    <input type='checkbox' className='scale-125' />
                                </div>
                                <h4 className='w-[8%]'/>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[30%] font-[300]'>mã danh mục</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[300]'>tên danh mục</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[30%] font-[300]'>ghi chú</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300] text-center'>tác vụ</h4>
                            </div>
                            <div className='divide-y divide-slate-200 overflow-auto min:h-[400px] h-[100%] max:h-[600px]'>
                                {dataFake.map((e,i) => 
                                    <div>
                                        <div key={i} className='flex items-center py-1.5 px-2 bg-white z-10 relative'>
                                            <div className='w-[2%] flex justify-center'>
                                                <input type='checkbox' className='scale-125' />
                                            </div>
                                            <div className='w-[8%] flex justify-center'>
                                                <button disabled={e?.child.length > 0 ? false : true} onClick={_ToggleHasChild.bind(this)} className={`${hasChild ? "bg-red-600" : "bg-green-600 disabled:bg-green-800"} transition relative flex flex-col justify-center items-center h-5 w-5 rounded-full text-white outline-none`}>
                                                    <IconMinus size={16} />
                                                    <IconMinus size={16} className={`${hasChild ? "" : "rotate-90"} transition absolute`} />
                                                </button>
                                            </div>
                                            <h6 className='xl:text-base text-xs px-2 w-[30%]'>{e.id}</h6>
                                            <h6 className='xl:text-base text-xs px-2 w-[20%]'>{e.name}</h6>
                                            <h6 className='xl:text-base text-xs px-2 w-[30%]'>{e.note}</h6>
                                            <div className='w-[10%] bg-red-500 h-2' />
                                        </div>
                                        {/* {hasChild && 
                                            <div className='flex justify-end'>
                                                <div className='bg-slate-200/20 rounded-md w-[95%] px-4 pb-3'>
                                                    <div className='grid grid-cols-10 gap-5 py-2 px-5'>
                                                        <h5 className='col-span-3'>Mã</h5>
                                                        <h5 className='col-span-3'>Tên</h5>
                                                        <h5 className='col-span-3'>Ghi chú</h5>
                                                        <h5 className='col-span-1 text-center'>Tác vụ</h5>
                                                    </div>
                                                    {e?.child.map((e) => 
                                                        <ItemsChild 
                                                            sid={e.id} 
                                                            name={e.name} 
                                                            note={e.note} 
                                                            child={
                                                                (e.child?.map((e) => 
                                                                    <ItemsChild 
                                                                        id={e.id} 
                                                                        name={e.name} 
                                                                        note={e.note} 
                                                                        child={
                                                                            (e.child?.map((e) => 
                                                                                <ItemsChild 
                                                                                    id={e.id} 
                                                                                    name={e.name} 
                                                                                    note={e.note} 
                                                                                />
                                                                            ))
                                                                        }
                                                                    />
                                                                ))
                                                            } 
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        } */}
                                        <div className={`${hasChild ? "translate-y-0" : "-translate-y-[100%]" } transition`}></div>
                                        <div className={`${hasChild ? "translate-y-0" : "-translate-y-[100%]" } flex items-center py-1.5 px-2 hover:bg-red-100/40 transition `}>
                                            <div className='w-[10%] h-2 bg-red-200'></div>
                                            <h6 className='xl:text-base text-xs px-2 w-[30%]'>{e.id}</h6>
                                            <h6 className='xl:text-base text-xs px-2 w-[20%]'>{e.name}</h6>
                                            <h6 className='xl:text-base text-xs px-2 w-[30%]'>{e.note}</h6>
                                            <div className='w-[10%] bg-red-500 h-2' />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

const ItemsChild = React.memo((props) => {
    return(
        <React.Fragment>
            <div key={props.id} className='grid grid-cols-10 gap-5 py-2 px-5 hover:bg-slate-100/40'>
                <h5 className='col-span-3'>{props.id}</h5>
                <h5 className='col-span-3'>{props.name}</h5>
                <h5 className='col-span-3'>{props.note}</h5>
                <h5 className='col-span-1 text-center'>Tác vụ</h5>
            </div>
            {props.child}
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

export default Index;