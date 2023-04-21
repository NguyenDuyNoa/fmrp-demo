import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import {ListBtn_Setting} from "./information"
import {_ServerInstance as Axios} from '/services/axios';

const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});
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
    const [onSending, sOnSending] = useState(false);

    const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});
    const [dataProductExpiry, sDataProductExpiry] = useState({});
    const [dataProductSerial, sDataProductSerial] = useState({});

    const [data, sData] = useState([]);

    const _ServerFetching = () => {
        Axios("GET", "/api_web/api_setting/feature/?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var data = response.data;
                sDataMaterialExpiry(data.find(x => x.code == "material_expiry"));
                sDataProductExpiry(data.find(x => x.code == "product_expiry"));
                sDataProductSerial(data.find(x => x.code == "product_serial"));
            }
        })
    }

    useEffect(() => {
        onFetching && _ServerFetching()
    }, [onFetching]);

    useEffect(() => {
        sOnFetching(true)
    }, []);

    const _ToggleStatus  = (code) => {
        if(code == "material_expiry"){
            if(dataMaterialExpiry?.is_enable == "0"){
                sDataMaterialExpiry({...dataMaterialExpiry, is_enable: "1"})
            }else if(dataMaterialExpiry?.is_enable == "1"){
                sDataMaterialExpiry({...dataMaterialExpiry, is_enable: "0"})
            }
        }else if(code == "product_expiry"){
            if(dataProductExpiry?.is_enable == "0"){
                if(dataProductSerial?.is_enable == "0"){
                    sDataProductExpiry({...dataProductExpiry, is_enable: "1"})
                }else{
                    sDataProductExpiry({...dataProductExpiry, is_enable: "1"})
                    sDataProductSerial({...dataProductSerial, is_enable: "0"})
                }
            }else if(dataProductExpiry?.is_enable == "1"){
                sDataProductExpiry({...dataProductExpiry, is_enable: "0"})
            }
        }else if(code == "product_serial"){
            if(dataProductSerial?.is_enable == "0"){
                if(dataProductExpiry?.is_enable == "0"){
                    sDataProductSerial({...dataProductSerial, is_enable: "1"})
                }else{
                    sDataProductSerial({...dataProductSerial, is_enable: "1"})
                    sDataProductExpiry({...dataProductExpiry, is_enable: "0"})
                }
            }else if(dataProductSerial?.is_enable == "1"){
                sDataProductSerial({...dataProductSerial, is_enable: "0"})
            }
        }
    }

    const _ServerSending = () => {
        var formData = new FormData();

        data.forEach((item, index) => {
            formData.append(`feature[${index}][code]`, item.code);
            formData.append(`feature[${index}][is_enable]`, item.is_enable);
        });

        data
        Axios("POST", "/api_web/api_setting/feature/?csrf_protection=true", {
            data: formData
        }, (err, response) => {
            if(!err){
                var {isSuccess, message} = response.data;
                if(isSuccess){
                    Toast.fire({
                        icon: 'success',
                        title: `${props.dataLang[message]}`
                    })
                }else{
                    Toast.fire({
                        icon: 'error',
                        title: `${props.dataLang[message]}`
                    })
                }
            }
            sOnSending(false)
        })
    }

    useEffect(() => {
        onSending && _ServerSending()
    }, [onSending]);

    const _HandleSubmit = (e) => {
        e.preventDefault();
        sData([{...dataMaterialExpiry}, {...dataProductExpiry}, {...dataProductSerial}])
        sOnSending(true)
    }

    return (
        <React.Fragment>
            <Head>
                <tilte>Thiết lập chung</tilte>
            </Head>
            <div className='px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen'>
                <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                    <h6 className='text-[#141522]/40'>{dataLang?.branch_seting}</h6>
                    <span className='text-[#141522]/40'>/</span>
                    <h6>Thiết lập chung</h6>
                </div>
                <div className='grid grid-cols-9 gap-5 h-[99%]'>
                    <div className="col-span-2 h-fit p-5 rounded bg-[#E2F0FE] space-y-3 sticky ">
                        <ListBtn_Setting dataLang={dataLang} />
                    </div>
                    <div className='col-span-7 h-[100%] flex flex-col justify-between overflow-hidden'>
                        <div className='space-y-5 h-[96%] overflow-hidden'>
                            <h2 className='text-2xl text-[#52575E]'>Thiết Lập Chung</h2>
                            <ScrollArea className="max-h-[600px] min:h-[500px] h-[90%] max:h-[800px]" speed={1} smoothScrolling={true}>
                                <div className='space-y-4'>
                                    <div className='space-y-1'>
                                        <h1 className='text-[15px] uppercase w-full p-3 rounded bg-[#ECF0F4]'>nguyên vật liệu</h1>
                                        <div className='divide-y divide-[#ECF0F4]'>
                                            <div className='space-y-2 py-1.5'>
                                                <h6>Quản lý thời hạn sử dụng</h6>
                                                <label htmlFor={dataMaterialExpiry.code} className="relative inline-flex items-center cursor-pointer ml-1">
                                                    <input type="checkbox"  className="sr-only peer" value={dataMaterialExpiry.is_enable} id={dataMaterialExpiry.code} checked={dataMaterialExpiry.is_enable == "0" ? false : true} onChange={_ToggleStatus.bind(this, dataMaterialExpiry.code)}/>
                                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='space-y-1'>
                                        <h1 className='text-[15px] uppercase w-full p-3 rounded bg-[#ECF0F4]'>thành phẩm</h1>
                                        <div className='divide-y divide-[#ECF0F4]'>
                                            <div className='space-y-2 py-1.5'>
                                                <h6>Quản lý thời hạn sử dụng</h6>
                                                <label htmlFor={dataProductExpiry.code} className="relative inline-flex items-center cursor-pointer ml-1">
                                                    <input type="checkbox"  className="sr-only peer" value={dataProductExpiry.is_enable} id={dataProductExpiry.code} checked={dataProductExpiry.is_enable == "0" ? false : true} onChange={_ToggleStatus.bind(this, dataProductExpiry.code)}/>
                                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                            <div className='space-y-2 py-1.5'>
                                                <h6>Quản lý serial</h6>
                                                <label htmlFor={dataProductSerial.code} className="relative inline-flex items-center cursor-pointer ml-1">
                                                    <input type="checkbox"  className="sr-only peer" value={dataProductSerial.is_enable} id={dataProductSerial.code} checked={dataProductSerial.is_enable == "0" ? false : true} onChange={_ToggleStatus.bind(this, dataProductSerial.code)}/>
                                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                        <div className='flex space-x-5 py-5'>
                            <button onClick={_HandleSubmit.bind(this)} className="px-8 py-2.5 rounded transition hover:scale-105 bg-[#0F4F9E] text-white">Lưu</button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Index;