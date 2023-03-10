import React from 'react';
import Head from 'next/head';

import {ListBtn_Setting} from "./index"

import {SearchNormal1 as IconSearch} from "iconsax-react"

const Index = () => {
    return (
        <React.Fragment>
            <Head>
                <title>Thiết lập biến thể</title>
            </Head>
            <div className='px-10 xl:pt-24 pt-[88px] pb-10 space-y-4'>
                <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                    <h6 className='text-[#141522]/40'>Cài đặt</h6>
                    <span className='text-[#141522]/40'>/</span>
                    <h6>Thiết lập biến thể</h6>
                </div>
                <div className='grid grid-cols-9 gap-5'>
                    <div className='col-span-2 h-fit p-5 rounded bg-[#E2F0FE] space-y-3 sticky top-20'>
                        <ListBtn_Setting />
                    </div>
                    <div className='col-span-7 space-y-3'>
                        <div className='flex justify-between'>
                            <h2 className='text-2xl text-[#52575E]'>Thiết Lập Biến Thể</h2>
                            <button>Tạo mới</button>
                        </div>
                        <div className="bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2">
                            <form className="flex items-center relative ">
                                <IconSearch size={20} className="absolute left-3 z-10 text-[#cccccc]"/>
                                <input
                                    className=" relative bg-white outline-none border border-transparent focus:border-slate-200 pl-10 pr-5 py-2 rounded-md w-[400px]"
                                    type="text" 
                                    placeholder="Search by PO number, name, amount..."
                                />
                            </form>
                        </div>
                        <div className='grid grid-cols-10 gap-5'>
                            <h4 className="xl:text-[14px] text-[12px] col-span-3 text-[#667085] uppercase font-[300] text-left">tên biến thể</h4>
                            <h4 className="xl:text-[14px] text-[12px] col-span-5 text-[#667085] uppercase font-[300] text-left">các tùy chọn</h4>
                            <h4 className="xl:text-[14px] text-[12px] col-span-2 text-[#667085] uppercase font-[300] text-center">thuộc tính</h4>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Index;
