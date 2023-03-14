import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import {ListBtn_Setting} from "./information";

import { SearchNormal1 as IconSearch } from "iconsax-react";

const Index = (props) => {
    const dataLang = props.dataLang;
    const router = useRouter();
    
    const _HandleSelectTab = (e) => {
        router.push({
            pathname: '/settings/finance',    
            query: { tab: e  }
        })
    }
    useEffect(() => {
        router.push({
            pathname: '/settings/finance',    
            query: { tab: router.query?.tab ? router.query?.tab : "taxes"  }
        })
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.list_btn_seting_finance}</title>
            </Head>
            <div className='px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen'>
                <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                    <h6 className='text-[#141522]/40'>{dataLang?.branch_seting}</h6>
                    <span className='text-[#141522]/40'>/</span>
                    <h6>{dataLang?.list_btn_seting_finance}</h6>
                </div>
                <div className='grid grid-cols-9 gap-5 h-full'>
                    <div className="col-span-2 h-fit p-5 rounded bg-[#E2F0FE] space-y-3 sticky ">
                        <ListBtn_Setting dataLang={dataLang} />
                    </div>
                    <div className='col-span-7 h-[99%] flex flex-col justify-between'>
                        <div className='space-y-3'>
                            <h2 className='text-2xl text-[#52575E]'>{dataLang?.list_btn_seting_finance}</h2>
                            <div className="flex space-x-5 items-center justify-start">
                                <button onClick={_HandleSelectTab.bind(this, "taxes")} className={`${router.query?.tab === "taxes" ? "text-[#0F4F9E] hover:text-[#0F4F9E] bg-[#e2f0fe] rounded-lg p-2  " : "p-2 "} `}>{dataLang?.branch_popup_finance_exchange_rate}</button>
                                <button onClick={_HandleSelectTab.bind(this, "currencies")} className={`${router.query?.tab === "currencies" ? "text-[#0F4F9E] hover:text-[#0F4F9E] bg-[#e2f0fe] rounded-lg p-2  " : "p-2 "} `}>{dataLang?.branch_popup_finance_unit}</button>
                                <button onClick={_HandleSelectTab.bind(this, "paymentmodes")} className={`${router.query?.tab === "paymentmodes" ? "text-[#0F4F9E] hover:text-[#0F4F9E] bg-[#e2f0fe] rounded-lg p-2  " : "p-2 "} `}>{dataLang?.branch_popup_finance_payment}</button>
                            </div>
                            <div className="3xl:h-[65%] 2xl:h-[60%] xl:h-[55%] h-[57%] space-y-2">
                                <div className="flex justify-end">
                                    {/* <Popup_ChiNhanh dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" /> */}
                                    <button>Tạo mới</button>
                                </div>
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2">
                                        <form className="flex items-center relative">
                                            <IconSearch size={20} className="absolute left-3 z-10 text-[#cccccc]" />
                                            <input
                                                className=" relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10 pr-5 py-2 rounded-md w-[400px]"
                                                type="text" 
                                                // onChange={props.onChange}
                                                placeholder={dataLang?.branch_search}
                                            />
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Index;
