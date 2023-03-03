import React, {useEffect} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'

import {SearchNormal1 as IconSearch, Back as IconBack} from "iconsax-react";
import CountUp from 'react-countup';

const Index = () => {
    const router = useRouter()
    const _HandleRouterBack = () => router.back();

    useEffect(() => {
        setTimeout(function(){
            router.back();
        }, 5000);
    }, []);
    return (
        <React.Fragment>
            <Head>
                <title>Trang không tìm thấy</title>
            </Head>
            <div className='h-[80vh] w-screen flex flex-col justify-center items-center relative space-y-3'>
                <h2 className='text-2xl pt-20'>Trang không tồn tại</h2>
                <IconSearch className='text-[#1415221b] absolute z-[-1]' size={400} />
                <button onClick={_HandleRouterBack.bind(this)} className='flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-l from-[#e2e8f0] via-[#e2e8f0] via-[#cbd5e1] to-[#e2e8f0] rounded btn-animation'>
                    <IconBack size={18} />
                    <span>Quay về</span>
                </button>
                <span className='text-gray-400 text-[14px]'>Hoặc</span>
                <p>Bạn sẽ được quay về trong <CountUp start={5} end={0} duration={5} /> giây</p>
            </div>
        </React.Fragment>
    );
}

export default Index;
