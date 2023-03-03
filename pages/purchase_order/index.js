import React, {useState} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import {Grid6 as IconExcel, Filter as IconFilter} from "iconsax-react";
import Select from 'react-select';
const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
  });

const Index = () => {
    const dataMaChungTu = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]
    return (
        <React.Fragment>
            <Head>
                <title>Đơn đặt hàng (PO)</title>
            </Head>
            <div className='px-10 xl:pt-24 pt-[88px] pb-3 space-y-2.5 h-screen flex flex-col justify-between'>
                <div className='3xl:h-[65%] 2xl:h-[60%] xl:h-[55%] h-[57%] space-y-2'>
                    <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                        <h6 className='text-[#141522]/40'>Mua & Nhập hàng</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6>Đơn mua hàng</h6>
                    </div>
                    <div className='flex justify-between items-center'>
                        <h2 className='xl:text-3xl text-xl font-medium '>Đơn Đặt Hàng (PO)</h2>
                        <div className='flex space-x-3 items-center'>
                            <button className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105'>Tạo mới</button>
                            <button className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#e2e8f0] via-[#e2e8f0] via-[#cbd5e1] to-[#e2e8f0] rounded btn-animation hover:scale-105'>Lập hóa đơn thuế tổng</button>
                        </div>
                    </div>
                    <div className='grid grid-cols-4 gap-8'>
                        <div className=''>
                            <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>Mã chứng từ</h6>
                            <Select 
                                options={dataMaChungTu}
                                placeholder="Chọn mã chứng từ" 
                                className="rounded-md py-0.5 bg-white border-none xl:text-base text-[14.5px]" 
                                isSearchable={false}
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
                        <div className=''>
                            <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>Trạng thái giao hàng</h6>
                            <Select 
                                options={dataMaChungTu}
                                placeholder="Chọn trạng thái giao hàng" 
                                className="rounded-md py-0.5 bg-white border-none xl:text-base text-[14.5px]" 
                                isSearchable={false}
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
                        <div className=''>
                            <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>Tên nhà cung cấp</h6>
                            <Select 
                                options={dataMaChungTu}
                                placeholder="Chọn tên nhà cung cấp" 
                                className="rounded-md py-0.5 bg-white border-none xl:text-base text-[14.5px]" 
                                isSearchable={false}
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
                        <div className=''>
                            <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>Ngày chứng từ</h6>
                            <Select 
                                options={dataMaChungTu}
                                placeholder="Chọn mã chứng từ" 
                                className="rounded-md py-0.5 bg-white border-none xl:text-base text-[14.5px]" 
                                isSearchable={false}
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
                    <Tab_DanhSach />
                    <List_DanhSach />
                </div>
                <div className='flex justify-between '>
                    <p className='text-[#667085] font-[400] xl:text-base text-xs'>Hiển thị từ 1 đến 15 của 20 các mục</p>
                </div>
            </div>
        </React.Fragment>
    );
}

const Tab_DanhSach = React.memo(() => {
    const [tab, sTab] = useState(0);
    const _HandleSelectTab = (e) => sTab(e);

    return(
        <div className='xl:space-y-3 space-y-2'>
            <div className='flex space-x-1 border-b border-slate-200'>
                <button onClick={_HandleSelectTab.bind(this, 0)} className={`${tab === 0 ? "text-[#0F4F9E] border-[#0F4F9E] from-[#0F4F9E]/10" : "text-slate-400 hover:text-[#0F4F9E]/70 border-transparent" } xl:text-base text-xs bg-gradient-to-t border-b-[2px] xl:py-2 py-1 xl:px-4 px-3 font-medium`}>Tất cả</button>
                <button onClick={_HandleSelectTab.bind(this, 1)} className={`${tab === 1 ? "text-[#0F4F9E] border-[#0F4F9E] from-[#0F4F9E]/10" : "text-slate-400 hover:text-[#0F4F9E]/70 border-transparent" } xl:text-base text-xs bg-gradient-to-t border-b-[2px] xl:py-2 py-1 xl:px-4 px-3 font-medium`}>Hóa đơn thuế (0)</button>
                <button onClick={_HandleSelectTab.bind(this, 2)} className={`${tab === 2 ? "text-[#0F4F9E] border-[#0F4F9E] from-[#0F4F9E]/10" : "text-slate-400 hover:text-[#0F4F9E]/70 border-transparent" } xl:text-base text-xs bg-gradient-to-t border-b-[2px] xl:py-2 py-1 xl:px-4 px-3 font-medium`}>Hóa đơn lẻ (20)</button>
                <button onClick={_HandleSelectTab.bind(this, 3)} className={`${tab === 3 ? "text-[#0F4F9E] border-[#0F4F9E] from-[#0F4F9E]/10" : "text-slate-400 hover:text-[#0F4F9E]/70 border-transparent" } xl:text-base text-xs bg-gradient-to-t border-b-[2px] xl:py-2 py-1 xl:px-4 px-3 font-medium`}>Đã chi (3)</button>
                <button onClick={_HandleSelectTab.bind(this, 4)} className={`${tab === 4 ? "text-[#0F4F9E] border-[#0F4F9E] from-[#0F4F9E]/10" : "text-slate-400 hover:text-[#0F4F9E]/70 border-transparent" } xl:text-base text-xs bg-gradient-to-t border-b-[2px] xl:py-2 py-1 xl:px-4 px-3 font-medium`}>Chi 1 phần (1)</button>
                <button onClick={_HandleSelectTab.bind(this, 5)} className={`${tab === 5 ? "text-[#0F4F9E] border-[#0F4F9E] from-[#0F4F9E]/10" : "text-slate-400 hover:text-[#0F4F9E]/70 border-transparent" } xl:text-base text-xs bg-gradient-to-t border-b-[2px] xl:py-2 py-1 xl:px-4 px-3 font-medium`}>Chưa chi (17)</button>
            </div>
            <div className='bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2'>
                <input/>
                <div className='flex space-x-3'>
                    <button className='xl:px-4 px-3 xl:py-2.5 py-1.5 xl:text-base text-xs flex items-center space-x-2 bg-white rounded'>
                        <IconFilter size={18} />
                        <span>Lọc</span>
                    </button>
                    <button className='xl:px-4 px-3 xl:py-2.5 py-1.5 xl:text-base text-xs flex items-center space-x-2 bg-[#C7DFFB] rounded'>
                        <IconExcel size={18} />
                        <span>Xuất Excel</span>
                    </button>
                </div>
            </div>
        </div>
    )
})

const List_DanhSach = React.memo(() => {
    
    const data = [
        {
            id: 1,
            type: 0,
            vendor: "Jane Cooper",
            date: "22/02/2022",
            amount: 2000000,
            note: "hi",
            status: 0
        },{
            id: 2,
            type: 0,
            vendor: "Jane Cooper",
            date: "22/02/2022",
            amount: 2000000,
            note: "hi",
            status: 0
        },{
            id: 3,
            type: 0,
            vendor: "Jane Cooper",
            date: "22/02/2022",
            amount: 2000000,
            note: "hi",
            status: 0
        },{
            id: 4,
            type: 0,
            vendor: "Jane Cooper",
            date: "22/02/2022",
            amount: 2000000,
            note: "hi",
            status: 0
        },{
            id: 5,
            type: 0,
            vendor: "Jane Cooper",
            date: "22/02/2022",
            amount: 2000000,
            note: "hi",
            status: 0
        },{
            id: 6,
            type: 0,
            vendor: "Jane Cooper",
            date: "22/02/2022",
            amount: 2000000,
            note: "hi",
            status: 0
        },{
            id: 7,
            type: 0,
            vendor: "Jane Cooper",
            date: "22/02/2022",
            amount: 2000000,
            note: "hi",
            status: 0
        },{
            id: 8,
            type: 0,
            vendor: "Jane Cooper",
            date: "22/02/2022",
            amount: 2000000,
            note: "hi",
            status: 0
        },{
            id: 9,
            type: 0,
            vendor: "Jane Cooper",
            date: "22/02/2022",
            amount: 2000000,
            note: "hi",
            status: 0
        },{
            id: 10,
            type: 0,
            vendor: "Jane Cooper",
            date: "22/02/2022",
            amount: 2000000,
            note: "hi",
            status: 0
        },{
            id: 11,
            type: 0,
            vendor: "Jane Cooper",
            date: "22/02/2022",
            amount: 2000000,
            note: "hi",
            status: 0
        },{
            id: 12,
            type: 0,
            vendor: "Jane Cooper",
            date: "22/02/2022",
            amount: 2000000,
            note: "hi",
            status: 0
        },{
            id: 13,
            type: 0,
            vendor: "Jane Cooper",
            date: "22/02/2022",
            amount: 2000000,
            note: "hi",
            status: 0
        }
    ]
    return(
        <div className='min:h-[500px] h-[100%] max:h-[900px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'>
            <div className='xl:w-[100%] w-[110%] pr-2'>
                <div className='flex items-center sticky top-0 bg-white p-2 z-10'>
                    <div className='w-[2%]'>
                        <input type='checkbox' className='scale-125' />
                    </div>
                    <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[13%] font-[300]'>DOCUMENT NUMBER</h4>
                    <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[13%] font-[300] text-center'>loại</h4>
                    <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[14%] font-[300]'>Vendor</h4>
                    <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[12%] font-[300] text-center'>Billing day</h4>
                    <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[12%] font-[300] text-center'>Status</h4>
                    <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[13%] font-[300] text-right'>Amount</h4>
                    <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[13%] font-[300]'>Note</h4>
                </div>
                <div className='divide-y divide-slate-200 overflow-auto min:h-[400px] h-[100%] max:h-[600px]'>
                    {data.map((e) => 
                        <div className='flex items-center py-1.5 px-2 hover:bg-slate-100/40 ' key={e.id.toString()}>
                            <div className='w-[2%]'>
                                <input type='checkbox' className='scale-125' />
                            </div>
                            <h6 className='xl:text-base text-xs px-2 w-[13%]'>{e.id}</h6>
                            <h6 className='xl:text-base text-xs px-2 w-[13%] text-center'>{e.type}</h6>
                            <h6 className='xl:text-base text-xs px-2 w-[14%]'>{e.vendor}</h6>
                            <h6 className='xl:text-base text-xs px-2 w-[12%] text-center'>{e.date}</h6>
                            <h6 className='xl:text-base text-xs px-2 w-[12%] text-center'>{e.status}</h6>
                            <h6 className='xl:text-base text-xs px-2 w-[13%] text-right'>{e.amount?.toLocaleString()}</h6>
                            <h6 className='xl:text-base text-xs px-2 w-[13%]'>{e.note}</h6>
                            <div className='w-[8%] flex justify-end'>
                                <button className='bg-slate-100 xl:px-4 px-3 xl:py-1.5 py-1 rounded xl:text-base text-xs'>Tác vụ</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
})

export default Index;
