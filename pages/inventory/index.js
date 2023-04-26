import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { 
    SearchNormal1 as IconSearch
} from "iconsax-react";

const Index = (props) => {
    const dataLang = props.dataLang;
    return (
        <>
            <Head>
                <title>Kiểm kê kho</title>
            </Head>
            <div className='xl:px-10 px-3 xl:pt-24 pt-[88px] pb-3 space-y-2.5 h-screen overflow-hidden flex flex-col justify-between'>
                <div className='h-[97%] space-y-3 overflow-hidden'>
                    <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                        <h6 className='text-[#141522]/40'>Kho & Sản xuất</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6 className='text-[#141522]/40'>Kho hàng</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6>Kiểm kê kho</h6>
                    </div>
                    <div className='flex justify-between items-center'>
                        <h2 className='xl:text-3xl text-xl font-medium '>Kiểm Kê Kho</h2>
                        <Link href="/inventory/form" className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105 outline-none'>Tạo mới</Link>
                    </div>
                    <div className='bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2'>
                        <div className='flex gap-2'>
                            <form className="flex items-center relative">
                                <IconSearch size={20} className="absolute left-3 z-10 text-[#cccccc]" />
                                <input
                                    className=" relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10 pr-5 py-2 rounded-md 2xl:w-[400px] w-[250px]"
                                    type="text"  
                                    // onChange={_HandleOnChangeKeySearch.bind(this)} 
                                    placeholder={dataLang?.branch_search}
                                />
                            </form>
                        </div>
                        {/* {data.length != 0 &&
                            <div className='flex space-x-6'>
                                <ExcelFile filename={dataLang?.product} element={
                                    <button className='xl:px-4 px-3 xl:py-2.5 py-1.5 xl:text-sm text-xs flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition'>
                                        <IconExcel size={18} />
                                        <span>{dataLang?.client_list_exportexcel}</span>
                                    </button>
                                }>
                                    <ExcelSheet dataSet={multiDataSet} data={multiDataSet} name={dataLang?.product} />
                                </ExcelFile>

                                <div className="flex space-x-2 items-center">
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
                        } */}
                    </div>
                    <div className='min:h-[500px] 2xl:h-[76%] h-[70%] max:h-[800px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 tooltipBoundary'>
                        <div className='pr-2'>
                            <div className='grid grid-cols-7 items-center sticky top-0 bg-white p-2 z-10 shadow-[-20px_-9px_20px_0px_#0000003d]'>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase font-[300] text-center'>Ngày chứng từ</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase font-[300] text-center'>Mã chứng từ</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Index;
