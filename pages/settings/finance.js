import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import {ListBtn_Setting} from "./information";
import Loading from "components/UI/loading";
import PopupEdit from "/components/UI/popup";
import {_ServerInstance as Axios} from '/services/axios';
import Pagination from '/components/UI/pagination';

import { Edit as IconEdit, Trash as IconDelete, SearchNormal1 as IconSearch } from "iconsax-react";
import Swal from "sweetalert2";

const Index = (props) => {
    const dataLang = props.dataLang;
    const router = useRouter();
    
    const _HandleSelectTab = (e) => {
        router.push({
            pathname: '/settings/finance',    
            query: { tab: e }
        })
    }
    useEffect(() => {
        router.push({
            pathname: '/settings/finance',    
            query: { tab: router.query?.tab ? router.query?.tab : "taxes"  }
        })
    }, []);

    const [data, sData] = useState([]);
    const [onFetching, sOnFetching] = useState(false);

    const [totalItems, sTotalItems] = useState([]);
    const [keySearch, sKeySearch] = useState("")
    const [limit, sLimit] = useState(15);

    const _ServerFetching = () => {
        Axios("GET", `${(router.query?.tab === "taxes" && "/api_web/Api_tax/tax?csrf_protection=true") || (router.query?.tab === "currencies" && "/api_web/Api_currency/currency?csrf_protection=true") || (router.query?.tab === "paymentmodes" && "/api_web/Api_tax/tax?csrf_protection=true")}`, {
            // params: {
            //     search: keySearch,
            //     limit: limit,
            //     page: router.query?.page || 1
            // }
        }, (err, response) => {
            if(!err){
                var {rResult, output} = response.data
                sData(rResult)
                sTotalItems(output)
            }
            sOnFetching(false)
        })
    }

    useEffect(() => {
        onFetching && _ServerFetching()
    }, [onFetching]);

    useEffect(() => {
        sOnFetching(true)
    }, [limit,router.query?.page, router.query?.tab]);

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
                <div className='grid grid-cols-9 gap-5 h-[99%]'>
                    <div className="col-span-2 h-fit p-5 rounded bg-[#E2F0FE] space-y-3 sticky ">
                        <ListBtn_Setting dataLang={dataLang} />
                    </div>
                    <div className='col-span-7 h-[100%] flex flex-col justify-between'>
                        <div className='space-y-3 h-[96%] overflow-hidden'>
                            <h2 className='text-2xl text-[#52575E]'>{dataLang?.list_btn_seting_finance}</h2>
                            <div className="flex space-x-3 items-center justify-start">
                                <button onClick={_HandleSelectTab.bind(this, "taxes")} className={`${router.query?.tab === "taxes" ? "text-[#0F4F9E] bg-[#e2f0fe]" : "hover:text-[#0F4F9E] hover:bg-[#e2f0fe]/30"} rounded-lg px-4 py-2 outline-none`}>{dataLang?.branch_popup_finance_exchange_rate}</button>
                                <button onClick={_HandleSelectTab.bind(this, "currencies")} className={`${router.query?.tab === "currencies" ? "text-[#0F4F9E] bg-[#e2f0fe]" : "hover:text-[#0F4F9E] hover:bg-[#e2f0fe]/30"} rounded-lg px-4 py-2 outline-none`}>{dataLang?.branch_popup_finance_unit}</button>
                                <button onClick={_HandleSelectTab.bind(this, "paymentmodes")} className={`${router.query?.tab === "paymentmodes" ? "text-[#0F4F9E] bg-[#e2f0fe]" : "hover:text-[#0F4F9E] hover:bg-[#e2f0fe]/30"} rounded-lg px-4 py-2 outline-none`}>{dataLang?.branch_popup_finance_payment}</button>
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
                                        <div className="flex space-x-2">
                                            <label className="font-[300] text-slate-400">Hiển thị :</label>
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
                                </div>
                                <div className="min:h-[200px] h-[82%] max:h-[500px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className={`${(router.query?.tab === "taxes") || (router.query?.tab === "currencies") ? "w-[100%]" : "w-[110%]" } 2xl:w-[100%] pr-2`}>
                                        <div className={`${(router.query?.tab === "taxes") || (router.query?.tab === "currencies") ? "grid-cols-6" : "grid-cols-9" } grid gap-5 sticky top-0 bg-white p-2 z-10`}>
                                            {((router.query?.tab === "taxes") || (router.query?.tab === "currencies")) && 
                                                <React.Fragment>
                                                    <h4 className="xl:text-[14px] px-2 text-[12px] col-span-3 text-[#667085] uppercase font-[300] text-left">
                                                        {router.query?.tab === "taxes" && dataLang?.branch_popup_finance_name}
                                                        {router.query?.tab === "currencies" && dataLang?.branch_popup_currency_name}
                                                    </h4>
                                                    <h4 className="xl:text-[14px] px-2 text-[12px] col-span-2 text-[#667085] uppercase font-[300] text-left">
                                                        {router.query?.tab === "taxes" && dataLang?.branch_popup_finance_rate}
                                                        {router.query?.tab === "currencies" && dataLang?.branch_popup_curency_symbol}
                                                    </h4>
                                                </React.Fragment>
                                            }
                                            {router.query?.tab === "paymentmodes" && 
                                                <React.Fragment>
                                                    <h4 className="xl:text-[14px] px-2 text-[12px] col-span-3 text-[#667085] uppercase font-[300] text-left">{dataLang?.branch_popup_payment_name}</h4>
                                                    <h4 className="xl:text-[14px] px-2 text-[12px] col-span-1 text-[#667085] uppercase font-[300] text-left">{dataLang?.branch_popup_payment_type}</h4>
                                                    <h4 className="xl:text-[14px] px-2 text-[12px] col-span-2 text-[#667085] uppercase font-[300] text-left">{dataLang?.branch_popup_payment_balance}</h4>
                                                    <h4 className="xl:text-[14px] px-2 text-[12px] col-span-2 text-[#667085] uppercase font-[300] text-left">{dataLang?.branch_popup_payment_bank}</h4>
                                                </React.Fragment>
                                            }
                                            <h4 className="xl:text-[14px] px-2 text-[12px] col-span-1 text-[#667085] uppercase font-[300] text-center">
                                                {dataLang?.branch_popup_properties}
                                            </h4>
                                        </div>
                                        {onFetching ? 
                                            <Loading className="h-80"color="#0f4f9e" /> 
                                            :
                                            <React.Fragment>
                                                {data.length == 0 &&
                                                    <div className=" max-w-[352px] mt-24 mx-auto" >
                                                        <div className="text-center">
                                                            <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                                                            <h1 className="textx-[#141522] text-base opacity-90 font-medium">Không tìm thấy các mục</h1>
                                                            <div className="flex items-center justify-around mt-6 ">
                                                                {/* <Popup_ChiNhanh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px]"> 
                                                    {data.map((e) => 
                                                        <div key={e.id.toString()} className={`${(router.query?.tab === "taxes") || (router.query?.tab === "currencies") ? "grid-cols-6" : "grid-cols-9" } grid gap-5 py-1.5 px-2 hover:bg-slate-100/40 `}>
                                                            {((router.query?.tab === "taxes") || (router.query?.tab === "currencies")) && 
                                                                <React.Fragment>
                                                                    <h6 className="xl:text-base text-xs px-2 col-span-3">
                                                                        {e?.name}
                                                                    </h6>
                                                                    <h6 className="xl:text-base text-xs px-2 col-span-2">
                                                                        {router.query?.tab === "taxes" && e?.tax_rate}
                                                                        {router.query?.tab === "currencies" && e?.symbol}
                                                                    </h6>
                                                                </React.Fragment>
                                                            }
                                                            {router.query?.tab === "paymentmodes" && 
                                                                <React.Fragment>
                                                                    <h6 className="xl:text-base text-xs px-2 col-span-3">{dataLang?.branch_popup_payment_name}</h6>
                                                                    <h6 className="xl:text-base text-xs px-2 col-span-3">{dataLang?.branch_popup_payment_type}</h6>
                                                                    <h6 className="xl:text-base text-xs px-2 col-span-3">{dataLang?.branch_popup_payment_balance}</h6>
                                                                    <h6 className="xl:text-base text-xs px-2 col-span-3">{dataLang?.branch_popup_payment_bank}</h6>
                                                                </React.Fragment>
                                                            }
                                                            <div className="space-x-2 col-span-1 flex justify-center items-start">
                                                                {/* <Popup_ChiNhanh name={e.name} option={e.option} id={e.id} className="xl:text-base text-xs" dataLang={dataLang} /> */}
                                                                <button onClick={()=>handleDelete(e.id)} className="xl:text-base text-xs"><IconDelete color="red"/></button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </React.Fragment>
                                        }
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
