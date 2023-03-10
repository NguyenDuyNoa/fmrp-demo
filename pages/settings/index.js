import React, {useState, useRef, useEffect} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {_ServerInstance as Axios} from '/services/axios';
import LoadingItems from "/components/UI/loading"

import {Camera as IconCamera} from "iconsax-react";
import Swal from 'sweetalert2'

const Index = (props) => {
    const dataLang = props.dataLang

    const inputUpload = useRef();
    const [hoverImg, sHoverImg] = useState(false);

    const _HoverImg = (e) => sHoverImg(e);

    const [onFetching, sOnFetching] = useState(false);
    const [onSending, sOnSending] = useState(false);
    const [data, sData] = useState([]);

    const _ServerFetching = () => {
        Axios("GET", "/api_web/Api_Setting/companyInfo?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {isSuccess, data} = response.data;
                if(isSuccess){
                    sData({...data})
                }else {
                    dispatch({type: "auth/update", payload: false})
                }
                sOnFetching(false)
            }
        })
    }

    useEffect(() => {
        onFetching && _ServerFetching()
    }, [onFetching]);

    useEffect(() => {
        sOnFetching(true)
    }, []);

    const _HandleImg = (e) => {
        let file = e.target.files[0]
        if(file){
            sData({...data, company_logo: file})
        }
        inputUpload.current.value = null;
    }
    // console.log(URL.createObjectURL(data?.company_logo))

    const _HandleChangeValue = (type, value) => {
        if(type == "name"){
            sData({...data, company_name:value.target?.value})
        }else if(type == "phone"){
            sData({...data, company_phone_number:value.target?.value})
        }else if(type == "email"){
            sData({...data, company_email:value.target?.value})
        }else if(type == "address"){
            sData({...data, company_address:value.target?.value})
        }else if(type == "website"){
            sData({...data, company_website:value.target?.value})
        }else if(type == "nameDD"){
            sData({...data, representative_name:value.target?.value})
        }else if(type == "phoneDD"){
            sData({...data, representative_phone_number:value.target?.value})
        }else if(type == "emailDD"){
            sData({...data, representative_email:value.target?.value})
        }else if(type == "addressDD"){
            sData({...data, representative_address:value.target?.value})
        }
    }
    
    const _ServerSending = () => {
        var formData = new  FormData()

        formData.append("company_name", data?.company_name)
        formData.append("company_email", data?.company_email)
        formData.append("company_address", data?.company_address)
        formData.append("company_phone_number", data?.company_phone_number)
        formData.append("company_website", data?.company_website)
        formData.append("representative_address", data?.representative_address)
        formData.append("representative_email", data?.representative_email)
        formData.append("representative_name", data?.representative_name)
        formData.append("representative_phone_number", data?.representative_phone_number)

        // formData.append("company_logo", data?.company_logo)
        setTimeout(
            Axios("POST", "/api_web/Api_Setting/companyInfo?csrf_protection=true", {
                data: formData,
                headers: {'Content-Type': 'multipart/form-data'}
            }, (err, response) => {
                if(!err){
                    var {isSuccess} = response.data;
                    if(isSuccess){
                        Toast.fire({
                            icon: 'success',
                            title: 'Cập nhật dữ liệu thành công'
                        })
                    }
                }
                sOnSending(false)
            }), 1000
        )
    }

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
    })

    useEffect(() => {
        onSending && _ServerSending()
    }, [onSending]);

    const _HandleSubmit = () => {
        sOnSending(true);
    }

    
    return (
        <React.Fragment>
            <Head>
                <title>Cài đặt</title>
            </Head>
            <div className='px-10 xl:pt-24 pt-[88px] pb-10 space-y-4'>
                <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                    <h6 className='text-[#141522]/40'>Cài đặt</h6>
                    <span className='text-[#141522]/40'>/</span>
                    <h6>Thông Tin Doanh Nghiệp</h6>
                </div>
                <div className='grid grid-cols-9 gap-5'>
                    <div className='col-span-2 h-fit p-5 rounded bg-[#E2F0FE] space-y-3 sticky top-20'>
                        <ListBtn_Setting dataLang={dataLang} />
                    </div>
                    <div className='col-span-7 space-y-3'>
                        <h2 className='text-2xl text-[#52575E]'>Thông Tin Doanh Nghiệp</h2>
                        <div className='bg-[#F3F4F6] p-4 rounded grid grid-cols-3 gap-5'>
                            <div className='space-y-3'>
                                <div className='flex justify-center'>
                                    <div className=''>
                                        <input onChange={_HandleImg.bind(this)} ref={inputUpload} type="file" accept="image/png, image/jpeg" hidden id="upload" />
                                        <label htmlFor="upload" className="w-28 h-28 rounded overflow-hidden bg-[#000000]/50 flex flex-col justify-center items-center cursor-pointer">
                                            {data?.company_logo && 
                                                <div className='relative h-full w-full'>
                                                    <img alt="logo" onMouseEnter={_HoverImg.bind(this, true)} onMouseLeave={_HoverImg.bind(this, false)} crossOrigin="anonymous" src={data?.company_logo} className="w-full h-full object-cover"/>
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
                                            {!data?.company_logo && 
                                                <React.Fragment>
                                                    <IconCamera size="30" variant='Bold' className='text-white' />
                                                    <span className='text-white text-xs'>Upload logo</span>
                                                </React.Fragment>
                                            }
                                        </label>
                                    </div>
                                </div>
                                <p className='text-[#52575E] font-light text-sm'>*Khi thay đổi Ảnh logo này sẽ được áp dụng cho toàn bộ logo trên Biểu mẫu in ấn của hệ thống</p>
                            </div>
                            <div className='col-span-2 h-full flex flex-col justify-between'>
                                <h3 className='text-[#344054]'>Hồ sơ HĐĐT của đơn vị đã hoàn thiện 10%</h3>
                                <div className='w-full h-2.5 bg-white rounded-full relative'>
                                    <div className='absolute left-0 bg-gradient-to-r from-[#1556D9] to-[#8FE8FA] h-2.5 rounded-full' style={{width: `10%`}} />
                                </div>
                                <p className='text-[#667085] font-[300]'>Hãy hoàn thiện hồ sơ HĐĐT của bạn để phát hành hóa đơn điện tử nhanh chóng, tránh sai sót.</p>
                                <div>
                                    <h5 className='text-[#11315B] '>Thông tin còn thiếu</h5>
                                    <div className='flex divide-x divide-red-500'>
                                        {/* {listInfo.map((e, i) => 
                                            <h6 key={i} className='text-[#EE1E1E] font-[300] text-[14px] px-2 w-fit'>{e}</h6>
                                        )} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='space-y-3 pt-3'>
                            <h1 className='text-[15px] uppercase w-full p-3 rounded bg-[#ECF0F4] flex items-center space-x-3'>
                                <span>Thông tin đơn vị</span>
                                <img src="/icon/Verified.png" className='w-[25px] h-[25px]' />
                            </h1>
                            {onFetching ? 
                                <LoadingItems className="h-60"color="#0f4f9e" />
                                :
                                <div className='grid grid-cols-2 gap-7'>
                                    <div className='space-y-3'>
                                        <div className='space-y-1'>
                                            <h6 className='text-[14.5px]'>Tên Doanh Nghiệp</h6>
                                            <input
                                                type="text"
                                                placeholder='Nhập tên Doanh Nghiệp'
                                                value={data?.company_name}
                                                onChange={_HandleChangeValue.bind(this, "name")}
                                                className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-2.5 rounded-md w-full'
                                            />
                                        </div>
                                        <div className='space-y-1'>
                                            <h6 className='text-[14.5px]'>Email Doanh Nghiệp</h6>
                                            <input
                                                type="email"
                                                placeholder='Nhập email Doanh Nghiệp'
                                                value={data?.company_email}
                                                onChange={_HandleChangeValue.bind(this, "email")}
                                                className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-2.5 rounded-md w-full'
                                            />
                                        </div>
                                        <div className='space-y-1'>
                                            <h6 className='text-[14.5px]'>Website Doanh Nghiệp</h6>
                                            <input
                                                type="text"
                                                placeholder='Nhập website Doanh Nghiệp'
                                                value={data?.company_website}
                                                onChange={_HandleChangeValue.bind(this, "website")}
                                                className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-2.5 rounded-md w-full'
                                            />
                                        </div>
                                    </div>
                                    <div className='space-y-3'>
                                        <div className='space-y-1'>
                                            <h6 className='text-[14.5px]'>Số điện thoại Doanh Nghiệp</h6>
                                            <input
                                                type="text"
                                                placeholder='Nhập số điện thoại Doanh Nghiệp'
                                                value={data?.company_phone_number}
                                                onChange={_HandleChangeValue.bind(this, "phone")}
                                                className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-2.5 rounded-md w-full'
                                            />
                                        </div>
                                        <div className='space-y-1'>
                                            <h6 className='text-[14.5px]'>Địa chỉ Doanh Nghiệp</h6>
                                            <textarea 
                                                type="text"
                                                placeholder='Nhập địa chỉ Doanh Nghiệp'
                                                rows={3}
                                                value={data?.company_address}
                                                onChange={_HandleChangeValue.bind(this, "address")}
                                                className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-2.5 rounded-md w-full resize-none'
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className='space-y-3 pt-3'>
                            <h1 className='text-[15px] uppercase w-full p-3 rounded bg-[#ECF0F4] flex items-center space-x-3'>Thông tin người đại diện pháp luật</h1>
                            {onFetching ? 
                                <LoadingItems className="h-60"color="#0f4f9e" />
                                :
                                <div className='grid grid-cols-2 gap-7'>
                                    <div className='space-y-3'>
                                        <div className='space-y-1'>
                                            <h6 className='text-[14.5px]'>Tên Người Đại Diện</h6>
                                            <input
                                                type="text"
                                                placeholder='Nhập tên Người Đại Diện'
                                                value={data?.representative_name}
                                                onChange={_HandleChangeValue.bind(this, "nameDD")}
                                                className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-2.5 rounded-md w-full'
                                            />
                                        </div>
                                        <div className='space-y-1'>
                                            <h6 className='text-[14.5px]'>Email Người Đại Diện</h6>
                                            <input
                                                type="email"
                                                placeholder='Nhập email Người Đại Diện'
                                                value={data?.representative_email}
                                                onChange={_HandleChangeValue.bind(this, "emailDD")}
                                                className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-2.5 rounded-md w-full'
                                            />
                                        </div>
                                    </div>
                                    <div className='space-y-3'>
                                        <div className='space-y-1'>
                                            <h6 className='text-[14.5px]'>Số điện thoại Người Đại Diện</h6>
                                            <input
                                                type="text"
                                                placeholder='Nhập số điện thoại Người Đại Diện'
                                                value={data?.representative_phone_number}
                                                onChange={_HandleChangeValue.bind(this, "phoneDD")}
                                                className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-2.5 rounded-md w-full'
                                            />
                                        </div>
                                        <div className='space-y-1'>
                                            <h6 className='text-[14.5px]'>Địa chỉ Người Đại Diện</h6>
                                            <textarea 
                                                type="text"
                                                placeholder='Nhập địa chỉ Người Đại Diện'
                                                rows={3}
                                                value={data?.representative_address}
                                                onChange={_HandleChangeValue.bind(this, "addressDD")}
                                                className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-2.5 rounded-md w-full resize-none'
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className='flex space-x-5 pt-5'>
                            <button onClick={_HandleSubmit.bind(this)} className="px-8 py-2.5 rounded transition hover:scale-105 bg-[#0F4F9E] text-white">Lưu</button>
                            <button className="px-8 py-2.5 rounded transition hover:scale-105 bg-slate-200">Hủy</button>
                        </div>
                    </div>
                    
                </div>
            </div>
        </React.Fragment>
    );
}

const ListBtn_Setting = React.memo((props) => {
    return(
        <React.Fragment>
            <p className='font-[400] text-[15px] text-[#0F4F9E] uppercase'>{props.dataLang?.branch_settings_list}</p>
            <div>
                <Btn_Setting url="/settings" isActive="/settings">{props.dataLang?.list_btn_seting_information}</Btn_Setting>
                <Btn_Setting>{props.dataLang?.list_btn_seting_services}</Btn_Setting>
                <Btn_Setting url="/settings/branch" isActive="/settings/branch">{props.dataLang?.list_btn_seting_setup}</Btn_Setting>
                <Btn_Setting>{props.dataLang?.list_btn_seting_finance}</Btn_Setting>
                <Btn_Setting>{props.dataLang?.list_btn_seting_qt}</Btn_Setting>
                <Btn_Setting>{props.dataLang?.list_btn_seting_order}</Btn_Setting>
                <Btn_Setting>{props.dataLang?.list_btn_seting_stage}</Btn_Setting>
                <Btn_Setting>{props.dataLang?.list_btn_seting_category}</Btn_Setting>
                <Btn_Setting url="/settings/variant" isActive="/settings/variant">Thiết lập biến thể</Btn_Setting>
            </div>
        </React.Fragment>
    )
})

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

export {ListBtn_Setting};
export default Index;
