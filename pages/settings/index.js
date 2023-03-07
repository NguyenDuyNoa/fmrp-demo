import React, {useState, useRef} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {Camera as IconCamera} from "iconsax-react";

const Index = () => {
    const inputUpload = useRef();
    const [hoverImg, sHoverImg] = useState(false);

    const _HoverImg = (e) => sHoverImg(e);

    const [data, sData] = useState();

    const _HandleChangeFileThumb = ({target: {files}}) => {
        var [file] = files;
        if(file){
            sData({...data,thumb:URL.createObjectURL(file), file: file})
        }
        inputUpload.current.value = null;
    }
    return (
        <React.Fragment>
            <Head>
                <title>Cài đặt</title>
            </Head>
            <div className='px-10 xl:pt-24 pt-[88px] pb-10 space-y-4'>
                <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                    <h6 className='text-[#141522]/40'>Trang chủ</h6>
                    <span className='text-[#141522]/40'>/</span>
                    <h6>Cài đặt</h6>
                </div>
                <div className='grid grid-cols-9 gap-5'>
                    <div className='col-span-2 h-fit p-5 rounded bg-[#E2F0FE] space-y-3 sticky top-20'>
                        <p className='font-[400] text-[15px] text-[#0F4F9E] uppercase'>Danh sách cài đặt</p>
                        <div>
                            <Btn_Setting url="/settings" isActive="/settings">Thông tin doanh nghiệp</Btn_Setting>
                            <Btn_Setting>Thông tin dịch vụ FMRP</Btn_Setting>
                            <Btn_Setting>Thiết lập chi nhánh</Btn_Setting>
                            <Btn_Setting>Tài chính</Btn_Setting>
                            <Btn_Setting>Báo giá</Btn_Setting>
                            <Btn_Setting>Đơn hàng</Btn_Setting>
                            <Btn_Setting>Giai đoạn sản xuất</Btn_Setting>
                            <Btn_Setting>Danh mục</Btn_Setting>
                        </div>
                    </div>
                    <div className='col-span-7 space-y-3'>
                        <h2 className='text-2xl text-[#52575E]'>Thông Tin Doanh Nghiệp</h2>
                        <div className='bg-[#F3F4F6] p-4 rounded grid grid-cols-3 gap-5'>
                            <div className='space-y-3'>
                                <div className='flex justify-center'>
                                    <div className=''>
                                        <input onChange={_HandleChangeFileThumb.bind(this)} ref={inputUpload} type="file" multiple accept="image/png, image/jpeg" hidden id="upload" />
                                        <label htmlFor="upload" className="w-28 h-28 rounded overflow-hidden bg-[#000000]/50 flex flex-col justify-center items-center cursor-pointer">
                                            {data?.thumb && 
                                                <div className='relative'>
                                                    <img alt="logo" onMouseEnter={_HoverImg.bind(this, true)} onMouseLeave={_HoverImg.bind(this, false)} crossOrigin="anonymous" src={typeof(data?.thumb)==="string" ? data?.thumb : URL.createObjectURL(data?.thumb)} className="w-full h-full object-cover"/>
                                                    {hoverImg ? 
                                                        <div onMouseEnter={_HoverImg.bind(this, true)} onMouseLeave={_HoverImg.bind(this, false)} className='absolute top-0 right-0 w-full h-full bg-[#000000]/50 z-10 flex flex-col justify-center items-center backdrop-blur-sm'>
                                                            <IconCamera size="30" variant='Bold' className='text-white' />
                                                            <span className='text-white text-xs'>Upload logo</span>
                                                        </div>
                                                        : 
                                                        null
                                                    }
                                                </div>
                                            }
                                            {!data?.thumb && 
                                                <React.Fragment>
                                                    <IconCamera size="30" variant='Bold' className='text-white' />
                                                    <span className='text-white text-xs'>Upload logo</span>
                                                </React.Fragment>
                                            }
                                        </label>
                                    </div>
                                </div>
                                <p className='text-[#52575E] font-light text-sm'>
                                    *Khi thay đổi Ảnh logo này sẽ được áp dụng cho toàn bộ logo trên Biểu mẫu in ấn của hệ thống
                                </p>
                            </div>
                            <div className='col-span-2 h-full flex flex-col justify-between'>
                                <h3 className='text-[#344054]'>Hồ sơ HĐĐT của đơn vị đã hoàn thiện 94%</h3>
                                <div className='w-full h-2.5 bg-white rounded-full relative'>
                                    <div className='absolute left-0 bg-gradient-to-r from-[#1556D9] to-[#8FE8FA] w-3/4 h-2.5 rounded-full' />
                                </div>
                                <p className='text-[#667085] font-[300]'>Hãy hoàn thiện hồ sơ HĐĐT của bạn để phát hành hóa đơn điện tử nhanh chóng, tránh sai sót.</p>
                                <div>
                                    <h5 className='text-[#11315B] '>Thông tin còn thiếu</h5>
                                    <h6 className='text-[#EE1E1E] font-[300] text-[15px]'>Thông tin liên hệ</h6>
                                </div>
                            </div>
                        </div>
                        <div className='space-y-3 pt-3'>
                            <h1 className='text-[15px] uppercase w-full p-3 rounded bg-[#ECF0F4] flex items-center space-x-3'>
                                <span>Thông tin đơn vị</span>
                                <img src="/icon/Verified.png" className='w-[25px] h-[25px]' />
                            </h1>
                            <div className='grid grid-cols-2 gap-7'>
                                <div className='space-y-3'>
                                    <div className='space-y-1'>
                                        <h6 className='text-[14.5px]'>Tên Doanh Nghiệp</h6>
                                        <input
                                            type="text"
                                            placeholder='Nhập tên Doanh Nghiệp'
                                            // value={code}
                                            // onChange={_HandleInputChange.bind(this, "code")}
                                            className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-2.5 rounded-md w-full'
                                        />
                                    </div>
                                    <div className='space-y-1'>
                                        <h6 className='text-[14.5px]'>Email</h6>
                                        <input
                                            type="text"
                                            placeholder='Nhập email'
                                            // value={code}
                                            // onChange={_HandleInputChange.bind(this, "code")}
                                            className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-2.5 rounded-md w-full'
                                        />
                                    </div>
                                    <div className='space-y-1'>
                                        <h6 className='text-[14.5px]'>Website</h6>
                                        <input
                                            type="text"
                                            placeholder='Nhập website'
                                            // value={code}
                                            // onChange={_HandleInputChange.bind(this, "code")}
                                            className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-2.5 rounded-md w-full'
                                        />
                                    </div>
                                </div>
                                <div className='space-y-3'>
                                    <div className='space-y-1'>
                                        <h6 className='text-[14.5px]'>Số điện thoại</h6>
                                        <input
                                            type="text"
                                            placeholder='Nhập số điện thoại'
                                            // value={code}
                                            // onChange={_HandleInputChange.bind(this, "code")}
                                            className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-2.5 rounded-md w-full'
                                        />
                                    </div>
                                    <div className='space-y-1'>
                                        <h6 className='text-[14.5px]'>Địa chỉ</h6>
                                        <textarea 
                                            type="text"
                                            placeholder='Nhập địa chỉ'
                                            rows={3}
                                            // value={code}
                                            // onChange={_HandleInputChange.bind(this, "code")}
                                            className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-2.5 rounded-md w-full resize-none'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='space-y-3 pt-3'>
                            <h1 className='text-[15px] uppercase w-full p-3 rounded bg-[#ECF0F4] flex items-center space-x-3'>Thông tin người đại diện pháp luật</h1>
                            <div className='grid grid-cols-2 gap-7'>
                                <div className='space-y-3'>
                                    <div className='space-y-1'>
                                        <h6 className='text-[14.5px]'>Số tiền thanh toán</h6>
                                        <input
                                            type="text"
                                            placeholder='Nhập số tiền thanh toán'
                                            // value={code}
                                            // onChange={_HandleInputChange.bind(this, "code")}
                                            className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-2.5 rounded-md w-full'
                                        />
                                    </div>
                                    <div className='space-y-1'>
                                        <h6 className='text-[14.5px]'>Phương thức thanh toán</h6>
                                        <input
                                            type="text"
                                            placeholder='Nhập phương thức thanh toán'
                                            // value={code}
                                            // onChange={_HandleInputChange.bind(this, "code")}
                                            className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-2.5 rounded-md w-full'
                                        />
                                    </div>
                                </div>
                                <div className='space-y-3'>
                                    <div className='space-y-1'>
                                        <h6 className='text-[14.5px]'>Người thu</h6>
                                        <input
                                            type="text"
                                            placeholder='Nhập người thu'
                                            // value={code}
                                            // onChange={_HandleInputChange.bind(this, "code")}
                                            className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-2.5 rounded-md w-full'
                                        />
                                    </div>
                                    <div className='space-y-1'>
                                        <h6 className='text-[14.5px]'>TT Thanh toán</h6>
                                        <input
                                            type="text"
                                            placeholder='Nhập TT thanh toán'
                                            // value={code}
                                            // onChange={_HandleInputChange.bind(this, "code")}
                                            className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-2.5 rounded-md w-full'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex space-x-5 pt-5'>
                            <button className="px-8 py-2.5 rounded transition hover:scale-105 bg-[#0F4F9E] text-white">Lưu</button>
                            <button className="px-8 py-2.5 rounded transition hover:scale-105 bg-slate-200">Hủy</button>
                        </div>
                    </div>
                    
                </div>
            </div>
        </React.Fragment>
    );
}

const Btn_Setting = React.memo((props) => {
    const router = useRouter();
    return(
        <Link href={props.url ? props.url : "#"} alt={props.children}>
            <button className={`${router.asPath === props.isActive ? "text-white bg-[#11315B]" : "text-[#11315B] hover:bg-[#11315B]/5" } flex items-center space-x-2 rounded w-full text-left font-[400] py-2 px-3 my-1`}>
                <div className={`${router.asPath === props.isActive ? "bg-white" : "bg-[#11315B]" } w-1.5 h-1.5 rounded `} />
                <span>{props.children}</span>
            </button>
        </Link>
    )
})

export default Index;
