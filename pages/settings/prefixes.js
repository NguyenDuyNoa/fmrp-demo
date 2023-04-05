import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import {ListBtn_Setting} from "./information"
import {_ServerInstance as Axios} from '/services/axios';

import Swal from "sweetalert2";
const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});

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
    const [data, sData] = useState([]);
    const [err, sErr] = useState(false);

    const _ServerFetching = () => {
        Axios("GET", "/api_web/api_prefix/prefix?limit=0?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {rResult} = response.data;
                sData(rResult);
            }
        })
    }

    useEffect(() => {
        onFetching && _ServerFetching()
    }, [onFetching]);
    
    useEffect(() => {
        sOnFetching(true);
    }, []);

    const _HandleChangeInput = (id, value) => {
        var index = data.findIndex(x => x.id === id );
        data[index].prefix = value.target?.value;
        sData([...data])
    }

    const _ServerSending = () => {
        var formData = new FormData();

        data.forEach((item, index) => {
            formData.append(`data[${index}][id]`, item.id);
            formData.append(`data[${index}][type]`, item.type);
            formData.append(`data[${index}][prefix]`, item.prefix);
        });

        Axios("POST", "/api_web/api_prefix/prefix?csrf_protection=true", {
            data: formData
        }, (err, response) => {
            if(!err){
                var { isSuccess, message } = response.data;
                if (isSuccess) {
                    Toast.fire({
                        icon: 'success',
                        title: dataLang[message]
                    })   
                }else{
                    Toast.fire({
                        icon: 'error',
                        title: dataLang[message]
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
        const hasEmptyName = data.some((item) => item.prefix === '');
        if(hasEmptyName){
            sErr(true)
        }else{
            sErr(false)
            sOnSending(true)
        }
    }

    return (
        <React.Fragment>
            <Head>
                <title>Thiết lập tiếp đầu ngữ</title>
            </Head>
            <div className='px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen'>
                <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                    <h6 className='text-[#141522]/40'>{dataLang?.branch_seting}</h6>
                    <span className='text-[#141522]/40'>/</span>
                    <h6>Thiết lập tiếp đầu ngữ</h6>
                </div>
                <div className='grid grid-cols-9 gap-5 h-[99%]'>
                    <div className="col-span-2 h-fit p-5 rounded bg-[#E2F0FE] space-y-3 sticky ">
                        <ListBtn_Setting dataLang={dataLang} />
                    </div>
                    <div className='col-span-7 h-[100%] flex flex-col justify-between overflow-hidden'>
                        <div className='space-y-7 h-[96%] overflow-hidden'>
                            <h2 className='text-2xl text-[#52575E]'>Thiết Lập Tiếp Đầu Ngữ</h2>
                            <ScrollArea className="max-h-[600px] min:h-[500px] h-[90%] max:h-[800px]" speed={1} smoothScrolling={true}>
                                <div className='grid grid-cols-2 gap-5'>
                                    {data.map(e =>
                                        <div>
                                            <div key={e.id?.toString()} className='flex items-center space-x-3 pr-10'>
                                                <label className=''>{dataLang[e.type] || e.type} <span className='text-red-500'>*</span></label>
                                                <input value={e.prefix} onChange={_HandleChangeInput.bind(this, e.id)} type="text" placeholder={`Nhập ${dataLang[e.type] || (e.type)}`} className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-60 bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`} />
                                            </div>
                                            {err && e.prefix === "" && <label className="text-sm text-red-500">Vui lòng nhập {dataLang[e.type] || e.type}</label>}
                                        </div>
                                    )}
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
