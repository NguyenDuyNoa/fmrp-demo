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
        // Axios("GET", (router.query?.tab === "taxes" && "/api_web/Api_tax/tax?csrf_protection=true") || (router.query?.tab === "currencies" && "/api_web/Api_currency/currency?csrf_protection=true") || (router.query?.tab === "paymentmodes" && "/api_web/Api_tax/tax?csrf_protection=true"), {
        Axios("GET", `/api_web/${(router.query?.tab === "taxes" && "Api_tax/tax?csrf_protection=true") || (router.query?.tab === "currencies" && "Api_currency/currency?csrf_protection=true") || (router.query?.tab === "paymentmodes" && "Api_tax/tax?csrf_protection=true")}`, {
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
        router.query.tab && sOnFetching(true)
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

// import React, { useEffect, useState } from "react";
// import Head from "next/head";
// import { useRouter } from "next/router";

// import { ListBtn_Setting } from "./information";
// import PopupEdit from "../../components/UI/popup";
// import {_ServerInstance as Axios} from '/services/axios';
// import Pagination from '/components/UI/pagination';

// import {
//   Edit as IconEdit,
//   Trash as IconDelete,
//   SearchNormal1 as IconSearch,
// } from "iconsax-react";
// import Loading from "components/UI/loading";
// import Swal from "sweetalert2";

// const Index = (props) => {
//   const router = useRouter()
//   const _HandleSelectTab = (e) => {
//     router.push({
//         pathname: '/settings/finance',    
//         query: { tab: e ? e : "taxes"  }
//     })
//   }
//   const dataLang = props.dataLang
//   const [data_one, sDataTable_one] =useState([])
//   const [data_two, sDataTable_two] =useState([])
//   const [data_there, sDataTable_there] =useState([])
//   const [onFetching, sOnFetching] = useState(true)
//   const [query, sQuery] = useState("")
//   const [limit, sLimit] = useState(5)
//   const [totalItem, sTotalItem] = useState(0);
//   const [keySearch, sKeySearch] = useState("")
// const _ServerFetching_one =  ()=>{
//   //  Axios("GET", `/api_web/Api_Branch/branch?csrf_protection=true?&search=${query}&page=${curentPage}&limit=${limit}` , {}, (err, response) => {
//    Axios("GET", `/api_web/Api_tax/tax?csrf_protection=true&limit=${limit}`, {
//     // Axios("GET", `${(router.query?.tab === "taxes" && `/api_web/Api_tax/tax?csrf_protection=true&limit=${limit}&search=${query}`) ||(router.query?.tab === "currencies" && `/api_web/Api_currency/currency`) || (router.query?.tab === "paymentmodes" && `/api_web/Api_currency/currency`)}`, {
//     params: {
//       page: router.query?.page || 1,
//       search: keySearch
//     }}, (err, response) => {
//       if(!err){
//       var {rResult, output} = response.data
//       sDataTable_one(rResult)
//       sTotalItem(output)
//       }
//      sOnFetching(false)
//     })
   
//   }
// const _ServerFetching_two =  ()=>{
//    Axios("GET", `/api_web/Api_currency/currency?csrf_protection=true&limit=${limit}`, {
//     params: {
//       page: router.query?.page || 1,
//       search: keySearch
//     }}, (err, response) => {
//       if(!err){
//         var data =  response.data.rResult;  
//       var totalItem = response.data?.output?.iTotalRecords 
//       sDataTable_two(data)
//       sTotalItem(totalItem)
//     }
//     sOnFetching(false)
//     })
//   }
// const _ServerFetching_three =  ()=>{
//    Axios("GET", `/api_web/Api_payment_method/payment_method?csrf_protection=true&limit=${limit}`, {
//     params: {
//       page: router.query?.page || 1,
//       search: keySearch
//     }}, (err, response) => {
//       if(!err){
//         var data =  response.data.rResult;  
//       var totalItem = response.data?.output?.iTotalRecords 
//       sDataTable_there(data)
//       sTotalItem(totalItem)
//     }
//     sOnFetching(false)
//     })
//   }
//   useEffect(() => {
//     onFetching && _ServerFetching_one()
//     onFetching && _ServerFetching_two()
//     onFetching && _ServerFetching_three()
//   }, [onFetching,])
//   useEffect(() => {
//     // if(query.length === 0 || query.length > 2){
//     // } 
//     sOnFetching(true)     
//   }, [keySearch,limit,router.query?.page])

//   const handleDelete = (event) => {
//     Swal.fire({
//       title: `${dataLang?.aler_ask}`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#296dc1',
//       cancelButtonColor: '#d33',
//       confirmButtonText: `${dataLang?.aler_yes}`,
//       cancelButtonText:`${dataLang?.aler_cancel}`
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const id = event; 
//         Axios("DELETE", `/api_web/Api_tax/tax/${id}?csrf_protection=true`, {
//         }, (err, response) => {
//           if(!err){
//             var isSuccess = response.data?.isSuccess;
//             if(isSuccess){
//               Toast.fire({
//                 icon: 'success',
//                 title: dataLang?.aler_success_delete
//               })     
//             }
//           }
//           _ServerFetching_one()
//         })     
//       }
//     })
   
//   }
//   const handleDelete_three = (event) => {
//     Swal.fire({
//       title: `${dataLang?.aler_ask}`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#296dc1',
//       cancelButtonColor: '#d33',
//       confirmButtonText: `${dataLang?.aler_yes}`,
//       cancelButtonText:`${dataLang?.aler_cancel}`
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const id = event; 
//         Axios("DELETE", `/api_web/Api_payment_method/payment_method/${id}?csrf_protection=true`, {
//         }, (err, response) => {
//           if(!err){
//             var isSuccess = response.data?.isSuccess;
//             if(isSuccess){
//               Toast.fire({
//                 icon: 'success',
//                 title: dataLang?.aler_success_delete
//               })     
//             }
//           }
//           _ServerFetching_three()
//         })     
//       }
//     })
   
//   }
//   const handleDelete_two = (event) => {
//     Swal.fire({
//       title: `${dataLang?.aler_ask}`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#296dc1',
//       cancelButtonColor: '#d33',
//       confirmButtonText: `${dataLang?.aler_yes}`,
//       cancelButtonText:`${dataLang?.aler_cancel}`
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const id = event; 
//         Axios("DELETE", `/api_web/Api_currency/currency/${id}?csrf_protection=true`, {
//         }, (err, response) => {
//           if(!err){
//             var isSuccess = response.data?.isSuccess;
//             if(isSuccess){
//               Toast.fire({
//                 icon: 'success',
//                 title: dataLang?.aler_success_delete
//               })     
//             }
//           }
//           _ServerFetching_two()
//         })     
//       }
//     })
   
//   }
//   const paginate = pageNumber => {
//     router.push({
//         pathname: `/settings/finance`,
//         query: {
//           tab: router.query?.tab,
//            page: pageNumber ,
//         }
//     })
//   }
//   const _HandleOnChangeKeySearch = ({target: {value}}) => {
//     sKeySearch(value)
//     if(!value){
//       sOnFetching(true)
//     }
//     sOnFetching(true)
//   };
//   const Toast = Swal.mixin({
//     toast: true,
//     position: 'top-end',
//     showConfirmButton: false,
//     timer: 2000,
//     timerProgressBar: true,
//   })

//   return (
//     <React.Fragment>
//       <Head>
//         <title>{dataLang?.list_btn_seting_finance}</title>
//       </Head>
//       <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
    
//         <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
//           <h6 className="text-[#141522]/40">{dataLang?.branch_seting}</h6>
//           <span className="text-[#141522]/40">/</span>
//           <h6>{dataLang?.list_btn_seting_finance}</h6>
//         </div>   
//         <div className="grid grid-cols-9 gap-5 h-[99%] overflow-hidden">     
//           <div className="col-span-2 h-fit p-5 rounded bg-[#E2F0FE] space-y-3 sticky ">
//             <ListBtn_Setting dataLang={dataLang} />
//           </div>  
                      
//           {
//             router.query.tab ==="taxes" && (
//                     <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">  
//                       <div className="space-y-3 h-[96%] overflow-hidden">
//                         <h2 className="text-2xl text-[#52575E]">{dataLang?.list_btn_seting_finance}</h2> 
//                         <div className="flex space-x-5 items-center justify-start">
//                                 <button onClick={_HandleSelectTab.bind(this, "taxes")} className={`${router.query?.tab === "taxes" ? "text-[#0F4F9E] hover:text-[#0F4F9E] bg-[#e2f0fe] rounded-lg p-2  " : "p-2 "} `}>{dataLang?.branch_popup_finance_exchange_rate}</button>
//                                 <button onClick={_HandleSelectTab.bind(this, "currencies")} className={`${router.query?.tab === "currencies" ? "text-[#0F4F9E] hover:text-[#0F4F9E] bg-[#e2f0fe] rounded-lg p-2  " : "p-2 "} `}>{dataLang?.branch_popup_finance_unittitle}</button>
//                                 <button onClick={_HandleSelectTab.bind(this, "paymentmodes")} className={`${router.query?.tab === "paymentmodes" ? "text-[#0F4F9E] hover:text-[#0F4F9E] bg-[#e2f0fe] rounded-lg p-2  " : "p-2 "} `}>{dataLang?.branch_popup_finance_payment}</button>
//                             </div>      
//                         <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">
//                           <div className="flex justify-end items-center">
//                             <div className="flex space-x-3 items-center">  
//                               <Popup_tigiathue onRefresh={_ServerFetching_one.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />
//                             </div>
//                           </div>
//                           <div className="xl:space-y-3 space-y-2">
//                               <div className="bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2">
//                                   <form className="flex items-center relative">
//                                     <IconSearch size={20} className="absolute left-3 z-10 text-[#cccccc]" />
//                                     <input
//                                         className=" relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10 pr-5 py-2 rounded-md w-[400px]"
//                                         type="text" 
//                                         onChange={_HandleOnChangeKeySearch.bind(this)} 
//                                         placeholder={dataLang?.branch_search}
//                                     />
//                                   </form>
//                                   <select className="outline-none" onChange={(e) => sLimit(e.target.value)} value={limit}>
//                                     <option disabled className="hidden">{limit == -1 ? "Tất cả": limit}</option>
//                                     <option value={15}>15</option>
//                                     <option value={20}>20</option>
//                                     <option value={40}>40</option>
//                                     <option value={60}>60</option>
//                                     <option value={-1}>Tất cả</option>
//                                   </select>
//                               </div>
//                           </div>
//                           <div className="min:h-[200px] h-[82%] max:h-[500px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
//                           <div className="xl:w-[100%] w-[110%] pr-2">
//                             <div className="flex items-center sticky top-0 bg-white p-2 z-10">
//                                 <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[45%] font-[300] text-left">{dataLang?.branch_popup_finance_name}</h4>
//                                 <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[40%] font-[300] text-center">{dataLang?.branch_popup_finance_rate}</h4>
//                                 <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[300] text-center">{dataLang?.branch_popup_properties}</h4>
//                               </div>
//                               {onFetching ?
//                                 <Loading className="h-80"color="#0f4f9e" /> 
//                                 : 
//                                 data_one.length > 0 ? 
//                                 (
//                                   <>
//                                     <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px]">                       
//                                     {(data_one.map((e) => 
//                                       <div
//                                         className="flex items-center py-1.5 px-2 hover:bg-slate-100/40 "
//                                         key={e.id.toString()}
//                                       >                       
                                        
//                                         <h6 className="xl:text-base text-xs px-2 w-[45%] text-left">{e.name}</h6>
//                                         <h6 className="xl:text-base text-xs px-2 w-[40%] text-center">{e.tax_rate}</h6>                         
//                                         <div className="space-x-2 w-[15%]  text-center">
//                                           <Popup_tigiathue onRefresh={_ServerFetching_one.bind(this)} className="xl:text-base text-xs " dataLang={dataLang} name={e.name}  tax_rate={e.tax_rate} id={e.id} />
//                                           <button className="xl:text-base text-xs  ">
//                                           <IconDelete onClick={()=>handleDelete(e.id)}  color="red"/>
//                                           </button>
//                                         </div>
//                                       </div>
//                                       ))}               
//                                   </div>                     
//                                   </>
//                                 )  : 
//                                 (
//                                   <div className=" max-w-[352px] mt-24 mx-auto" >
//                                     <div className="text-center">
//                                       <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
//                                       <h1 className="textx-[#141522] text-base opacity-90 font-medium">Không tìm thấy các mục</h1>
//                                       <div className="flex items-center justify-around mt-6 ">
//                                           <Popup_tigiathue onRefresh={_ServerFetching_one.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />    
//                                       </div>
//                                     </div>
//                                   </div>
//                                 )}    
//                             </div>
//                           </div>
//                         </div>     
//                       </div>
//                       {data_one?.length != 0 &&
//                         <div className='flex space-x-5 items-center'>
//                           <h6>Hiển thị {totalItem?.iTotalDisplayRecords} trong số {totalItem?.iTotalRecords} thành phần</h6>
//                           <Pagination 
//                             postsPerPage={limit}
//                             totalPosts={Number(totalItem?.iTotalRecords)}
//                             paginate={paginate}
//                             currentPage={router.query?.page || 1}
//                           />
//                         </div>                   
//                       } 
//                     </div>

//             )
//           }
//           {
//             router.query.tab ==="currencies" && (
//                     <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">        
//                       <div className="space-y-3 h-[96%] overflow-hidden">
//                         <h2 className="text-2xl text-[#52575E]">{dataLang?.list_btn_seting_finance}</h2> 
//                         <div className="flex space-x-5 items-center justify-start">
//                                 <button onClick={_HandleSelectTab.bind(this, "taxes")} className={`${router.query?.tab === "taxes" ? "text-[#0F4F9E] hover:text-[#0F4F9E] bg-[#e2f0fe] rounded-lg p-2  " : "p-2 "} `}>{dataLang?.branch_popup_finance_exchange_rate}</button>
//                                 <button onClick={_HandleSelectTab.bind(this, "currencies")} className={`${router.query?.tab === "currencies" ? "text-[#0F4F9E] hover:text-[#0F4F9E] bg-[#e2f0fe] rounded-lg p-2  " : "p-2 "} `}>{dataLang?.branch_popup_finance_unittitle}</button>
//                                 <button onClick={_HandleSelectTab.bind(this, "paymentmodes")} className={`${router.query?.tab === "paymentmodes" ? "text-[#0F4F9E] hover:text-[#0F4F9E] bg-[#e2f0fe] rounded-lg p-2  " : "p-2 "} `}>{dataLang?.branch_popup_finance_payment}</button>
//                             </div>      
//                         <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">
//                           <div className="flex justify-end items-center">
//                             <div className="flex space-x-3 items-center">  
//                               <Popup_donvitien onRefresh={_ServerFetching_two.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />
//                             </div>
//                           </div>
//                           <div className="xl:space-y-3 space-y-2">
//                               <div className="bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2">
//                                   <form className="flex items-center relative">
//                                     <IconSearch size={20} className="absolute left-3 z-10 text-[#cccccc]" />
//                                     <input
//                                         className=" relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10 pr-5 py-2 rounded-md w-[400px]"
//                                         type="text" 
//                                         onChange={_HandleOnChangeKeySearch.bind(this)} 
//                                         placeholder={dataLang?.branch_search}
//                                     />
//                                   </form>
//                                   <select className="outline-none" onChange={(e) => sLimit(e.target.value)} value={limit}>
//                                     <option disabled className="hidden">{limit == -1 ? "Tất cả": limit}</option>
//                                     <option value={15}>15</option>
//                                     <option value={20}>20</option>
//                                     <option value={40}>40</option>
//                                     <option value={60}>60</option>
//                                     <option value={-1}>Tất cả</option>
//                                   </select>
//                               </div>
//                           </div>
//                           <div className="min:h-[200px] h-[82%] max:h-[500px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
//                           <div className="xl:w-[100%] w-[110%] pr-2">
//                           <div className="flex items-center sticky top-0 bg-white p-2 z-10">
//                           <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[45%] font-[300] text-left">{dataLang?.branch_popup_currency_name}</h4>
//                           <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[40%] font-[300] text-center">{dataLang?.branch_popup_curency_symbol}</h4>
//                           <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[300] text-center">{dataLang?.branch_popup_properties}</h4>
//                         </div>
//                               {onFetching ?
//                                 <Loading className="h-80"color="#0f4f9e" /> 
//                                 : 
//                                 data_two.length > 0 ? 
//                                 (
//                                     <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px]">                       
//                                     {(data_two.map((e) => 
//                                       <div
//                                         className="flex items-center py-1.5 px-2 hover:bg-slate-100/40 "
//                                         key={e.id.toString()}
//                                       >                       
                                        
//                                         <h6 className="xl:text-base text-xs px-2 w-[45%] text-left">{e.code}</h6>
//                                          <h6 className="xl:text-base text-xs px-2 w-[40%] text-center">{e.symbol}</h6>                           
//                                       <div className="space-x-2 w-[15%]  text-center">
//                                         <Popup_donvitien onRefresh={_ServerFetching_two.bind(this)} className="xl:text-base text-xs " dataLang={dataLang} code={e.code}  symbol={e.symbol} id={e.id} />
//                                         <button className="xl:text-base text-xs  ">
//                                         <IconDelete onClick={()=>handleDelete_two(e.id)}  color="red"/>
//                                         </button>
//                                       </div>
//                                       </div>
//                                       ))}               
//                                   </div>                     
//                                 )  : 
//                                 (
//                                   <div className=" max-w-[352px] mt-24 mx-auto" >
//                                     <div className="text-center">
//                                       <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
//                                       <h1 className="textx-[#141522] text-base opacity-90 font-medium">Không tìm thấy các mục</h1>
//                                       <div className="flex items-center justify-around mt-6 ">
//                                           <Popup_donvitien onRefresh={_ServerFetching_two.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />    
//                                       </div>
//                                     </div>
//                                   </div>
//                                 )}    
//                             </div>
//                           </div>
//                         </div>     
//                       </div>
//                       {data_two?.length != 0 &&
//                         <div className='flex space-x-5 items-center'>
//                           <h6>Hiển thị {totalItem?.iTotalDisplayRecords} trong số {totalItem?.iTotalRecords} thành phần</h6>
//                           <Pagination 
//                             postsPerPage={limit}
//                             totalPosts={Number(totalItem?.iTotalRecords)}
//                             paginate={paginate}
//                             currentPage={router.query?.page || 1}
//                           />
//                         </div>                   
//                       } 
//                     </div>

//             )
//           }
//              {
//             router.query.tab ==="paymentmodes" && (
//                     <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">        
//                       <div className="space-y-3 h-[96%] overflow-hidden">
//                         <h2 className="text-2xl text-[#52575E]">{dataLang?.list_btn_seting_finance}</h2> 
//                         <div className="flex space-x-5 items-center justify-start">
//                                 <button onClick={_HandleSelectTab.bind(this, "taxes")} className={`${router.query?.tab === "taxes" ? "text-[#0F4F9E] hover:text-[#0F4F9E] bg-[#e2f0fe] rounded-lg p-2  " : "p-2 "} `}>{dataLang?.branch_popup_finance_exchange_rate}</button>
//                                 <button onClick={_HandleSelectTab.bind(this, "currencies")} className={`${router.query?.tab === "currencies" ? "text-[#0F4F9E] hover:text-[#0F4F9E] bg-[#e2f0fe] rounded-lg p-2  " : "p-2 "} `}>{dataLang?.branch_popup_finance_unittitle}</button>
//                                 <button onClick={_HandleSelectTab.bind(this, "paymentmodes")} className={`${router.query?.tab === "paymentmodes" ? "text-[#0F4F9E] hover:text-[#0F4F9E] bg-[#e2f0fe] rounded-lg p-2  " : "p-2 "} `}>{dataLang?.branch_popup_finance_payment}</button>
//                             </div>      
//                         <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">
//                           <div className="flex justify-end items-center">
//                             <div className="flex space-x-3 items-center">  
//                               <Popup_phuongthucthanhtoan onRefresh={_ServerFetching_three.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />
//                             </div>
//                           </div>
//                           <div className="xl:space-y-3 space-y-2">
//                               <div className="bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2">
//                                   <form className="flex items-center relative">
//                                     <IconSearch size={20} className="absolute left-3 z-10 text-[#cccccc]" />
//                                     <input
//                                         className=" relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10 pr-5 py-2 rounded-md w-[400px]"
//                                         type="text" 
//                                         onChange={_HandleOnChangeKeySearch.bind(this)} 
//                                         placeholder={dataLang?.branch_search}
//                                     />
//                                   </form>
//                                   <select className="outline-none" onChange={(e) => sLimit(e.target.value)} value={limit}>
//                                     <option disabled className="hidden">{limit == -1 ? "Tất cả": limit}</option>
//                                     <option value={15}>15</option>
//                                     <option value={20}>20</option>
//                                     <option value={40}>40</option>
//                                     <option value={60}>60</option>
//                                     <option value={-1}>Tất cả</option>
//                                   </select>
//                               </div>
//                           </div>
//                           <div className="min:h-[200px] h-[82%] max:h-[500px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
//                           <div className="xl:w-[100%] w-[110%] pr-2">
//                           <div className="flex items-center sticky top-0 bg-white p-2 z-10">
//                           <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[30%] font-[300] text-left">{dataLang?.branch_popup_payment_name}</h4>
//                           <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300] text-center">{dataLang?.branch_popup_payment_type}</h4>
//                           <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[25%] font-[300] text-center">{dataLang?.branch_popup_payment_balance}</h4>
//                           <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[300] text-center">{dataLang?.branch_popup_payment_bank}</h4>
//                           <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[300] text-center">{dataLang?.branch_popup_properties}</h4>
//                         </div>
//                               {onFetching ?
//                                 <Loading className="h-80"color="#0f4f9e" /> 
//                                 : 
//                                 data_there.length > 0 ? 
//                                 (
//                                     <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px]">                       
//                                     {(data_there.map((e) => 
//                                       <div
//                                         className="flex items-center py-1.5 px-2 hover:bg-slate-100/40 "
//                                         key={e.id.toString()}
//                                       >                       
                                        
//                                         <h6 className="xl:text-base text-xs px-2 w-[30%] text-left">{e.name}</h6>
//                                          <h6 className="xl:text-base text-xs px-2 w-[10%] text-center">{e.cash_bank == "1" ? dataLang?.paymethod_cash :  dataLang?.paymethod_bank }</h6>   
//                                          <h6 className="xl:text-base text-xs px-2 w-[25%] text-center">{Number(e.opening_balance).toLocaleString()}</h6>   
//                                          <h6 className="xl:text-base text-xs px-2 w-[20%] text-center">{e.description}</h6>                                                                                                      
//                                       <div className="space-x-2 w-[15%]  text-center">
//                                         <Popup_phuongthucthanhtoan onRefresh={_ServerFetching_three.bind(this)} className="xl:text-base text-xs " dataLang={dataLang} name={e.name} cash_bank={e.cash_bank} opening_balance={e.opening_balance}  description={e.description} id={e.id} />
//                                         <button className="xl:text-base text-xs  ">
//                                         <IconDelete onClick={()=>handleDelete_three(e.id)}  color="red"/>
//                                         </button>
//                                       </div>
//                                       </div>
//                                       ))}               
//                                   </div>                     
//                                 )  : 
//                                 (
//                                   <div className=" max-w-[352px] mt-24 mx-auto" >
//                                     <div className="text-center">
//                                       <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
//                                       <h1 className="textx-[#141522] text-base opacity-90 font-medium">Không tìm thấy các mục</h1>
//                                       <div className="flex items-center justify-around mt-6 ">
//                                           <Popup_phuongthucthanhtoan onRefresh={_ServerFetching_three.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />    
//                                       </div>
//                                     </div>
//                                   </div>
//                                 )}    
//                             </div>
//                           </div>
//                         </div>     
//                       </div>
//                       {data_there?.length != 0 &&
//                         <div className='flex space-x-5 items-center'>
//                           <h6>Hiển thị {totalItem?.iTotalDisplayRecords} trong số {totalItem?.iTotalRecords} thành phần</h6>
//                           <Pagination 
//                             postsPerPage={limit}
//                             totalPosts={Number(totalItem?.iTotalRecords)}
//                             paginate={paginate}
//                             currentPage={router.query?.page || 1}
//                           />
//                         </div>                   
//                       } 
//                     </div>

//             )
//           }
//         </div>
//       </div>
//     </React.Fragment>
//   )
// }

// const Popup_tigiathue = (props) => {
//     const [name, sName] = useState(props.name ? props.name : "");
//     const [tax_rate, sTax_rate] = useState(props.tax_rate ? props.tax_rate : "");
//     const _HandleChangeInput = (type, value) => {
//       if(type == "name"){
//         sName(value.target?.value)
//       }else if(type == "tax_rate"){
//         sTax_rate(value.target?.value.replace(/[^0-9]/g, ""))
//       }
//     }
//     const resetForm = () => {
//       sName("")
//       sTax_rate("")
//     }
//     const [open, sOpen] = useState(false);
//     const _ToggleModal = (e) => sOpen(e);
//     const handleSubmit = (event) => {
//       event.preventDefault();
//       const id =props.id;
//       var data = new FormData();
//       data.append('name', name);
//       data.append('tax_rate', tax_rate);
//       Axios("POST", id ? `/api_web/Api_tax/tax/${id}?csrf_protection=true`:"/api_web/Api_tax/tax?csrf_protection=true", {
//         data: data,
//         headers: {"Content-Type": "multipart/form-data"} 
//       }, (err, response) => {
//         if(!err){
//           var {isSuccess, message} = response.data;
//           if(isSuccess){
//             Toast.fire({
//               icon: 'success',
//               title: props.dataLang[message]
//             })   
//             sOpen(false)
//             props.onRefresh && props.onRefresh()
//         }else {
//             Toast.fire({
//               icon: 'error',
//               title: props.dataLang[message]
//             })  
//           }
//         }
//         if(!id){
//            resetForm()
//         } 
       
//       }) 
//     }
//     const Toast = Swal.mixin({
//       toast: true,
//       position: 'top-end',
//       showConfirmButton: false,
//       timer: 2000,
//       timerProgressBar: true,
//     })
//     return(
//       <PopupEdit  
//         title={props.id ? `${props.dataLang?.branch_popup_finance_edit}` : `${props.dataLang?.branch_popup_finance_addnew}`} 
//         button={props.id ? <IconEdit/> : `${props.dataLang?.branch_popup_create_new}`} 
//         onClickOpen={_ToggleModal.bind(this, true)} 
//         open={open} onClose={_ToggleModal.bind(this,false)}
//         classNameBtn={props.className}
//       >
//         <div className="content mt-4">
//           <form onSubmit={ handleSubmit}>
//             <div>
//               <div className="flex flex-wrap justify-between">
//                 <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.branch_popup_finance_name}</label>
//                 <input
//                   // required
//                   value={name}
//                   onChange={_HandleChangeInput.bind(this, "name")}
//                   name="fname"                       
//                   type="text"
//                   className="placeholder-[color:#667085] w-full bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none mb-6"
//                 />
//               </div>
//               <div className="flex flex-wrap justify-between">
//                 <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.branch_popup_finance_rate} </label>
//                 <input
//                   // required
//                   pattern="[0-9]*"
//                   value={tax_rate}
//                   onChange={_HandleChangeInput.bind(this, "tax_rate")}
//                   name="tax_rate"                       
//                   type="text"
//                   className="placeholder-[color:#667085] w-full bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none mb-6"
//                 />     
//               </div>           
//               <div className="text-right mt-5 space-x-2">
//                 <button type="button" onClick={_ToggleModal.bind(this,false)} className="button text-[#344054] font-normal text-base py-2 px-4 rounded-lg border border-solid border-[#D0D5DD]"
//                 >{props.dataLang?.branch_popup_exit}</button>
//                 <button 
//                   type="submit"
//                   className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-lg bg-[#0F4F9E]"
//                 >
//                  {props.dataLang?.branch_popup_save}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </PopupEdit>
//     )
//   }
// const Popup_donvitien = (props) => {
//     const [code, sCode] = useState(props.code ? props.code : "");
//     const [symbol, sSymbol] = useState(props.symbol ? props.symbol : "");
//     const _HandleChangeInput = (type, value) => {
//       if(type == "code"){
//         sCode(value.target?.value)
//       }else if(type == "symbol"){
//         sSymbol(value.target?.value)
//       }
//     }
//     const resetForm = () => {
//       sCode("")
//       sSymbol("")
//     }
 
//     const [open, sOpen] = useState(false);
//     const _ToggleModal = (e) => sOpen(e);
//     const handleSubmit = (event) => {
//       event.preventDefault();
//       const id =props.id;
//       var data = new FormData();
//       data.append('code', code);
//       data.append('symbol', symbol);

//       Axios("POST", id ? `/api_web/Api_currency/currency/${id}?csrf_protection=true`:"/api_web/Api_currency/currency?csrf_protection=true", {
//         data: data,
//         headers: {"Content-Type": "multipart/form-data"} 
//       }, (err, response) => {
//           if(!err){
//           var {isSuccess, message} = response.data;
//           if(isSuccess){
//             Toast.fire({
//               icon: 'success',
//               title: props.dataLang[message]
//             })   
//             sOpen(false)
//             props.onRefresh && props.onRefresh()
//         }else {
//             Toast.fire({
//               icon: 'error',
//               title: props.dataLang[message]
//             })  
//           }
//         } 
//         if(!id){
//            resetForm()
//         } 
//       })
        
//     }
    
//     const Toast = Swal.mixin({
//       toast: true,
//       position: 'top-end',
//       showConfirmButton: false,
//       timer: 2000,
//       timerProgressBar: true,
//     })
//     return(
//       <PopupEdit  
//         title={props.id ? `${props.dataLang?.branch_popup_finance_editunit}` : `${props.dataLang?.branch_popup_finance_unit}`} 
//         button={props.id ? <IconEdit/> : `${props.dataLang?.branch_popup_create_new}`} 
//         onClickOpen={_ToggleModal.bind(this, true)} 
//         open={open} onClose={_ToggleModal.bind(this,false)}
//         classNameBtn={props.className}
//       >
//         <div className="content mt-4">
//           <form onSubmit={ handleSubmit}>
//             <div>
//               <div className="flex flex-wrap justify-between">
//                 <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.branch_popup_currency_name} <span className="text-red-500">*</span></label>
//                 <input
//                   // required
//                   value={code}
//                   onChange={_HandleChangeInput.bind(this, "code")}
//                   name="fname"                       
//                   type="text"
//                   className="placeholder-[color:#667085] w-full bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none mb-6"
//                 />
//               </div>
//               <div className="flex flex-wrap justify-between">
//                 <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.branch_popup_curency_symbol} </label>
//                 <input
//                   // required
//                   value={symbol}
//                   onChange={_HandleChangeInput.bind(this, "symbol")}
//                   name="symbol"                       
//                   type="text"
//                   className="placeholder-[color:#667085] w-full bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none mb-6"
//                 />     
//               </div>
          
           
//               <div className="text-right mt-5 space-x-2">
//                 <button type="button" onClick={_ToggleModal.bind(this,false)} className="button text-[#344054] font-normal text-base py-2 px-4 rounded-lg border border-solid border-[#D0D5DD]"
//                 >{props.dataLang?.branch_popup_exit}</button>
//                 <button 
//                   type="submit"
//                   className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-lg bg-[#0F4F9E]"
//                 >
//                  {props.dataLang?.branch_popup_save}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </PopupEdit>
//     )
//   }
// const Popup_phuongthucthanhtoan = (props) => {
//     const [name, sName] = useState(props.name ? props.name : "");
//     const [cash_bank, sCash_bank] = useState(props.cash_bank ? props.cash_bank : 0);
//     const [opening_balance, sOpening_balance] = useState(props.opening_balance ? props.opening_balance : "");
//     const [description, sDescription] = useState(props.description ? props.description : "");
//     const _HandleChangeInput = (type, value) => {
//       if(type == "name"){
//         sName(value.target?.value)
//       }else if(type == "cash_bank"){
//         sCash_bank(value.target?.value)
//       }else if(type == "opening_balance"){
//         sOpening_balance(value.target?.value.replace(/[^0-9]/g, ""))
//       }else if(type == "description"){
//         sDescription(value.target?.value)
//       }
//     }
//     const resetForm = () => {
//       sName("")
//       sCash_bank("")
//       sOpening_balance("")
//       sDescription("")
  
//     }
//     const [open, sOpen] = useState(false);
//     const _ToggleModal = (e) => sOpen(e);
//     const handleSubmit = (event) => {
//       event.preventDefault();
//       const id =props.id;
//       var data = new FormData();
//       data.append('name', name);
//       data.append('cash_bank', cash_bank);
//       data.append('opening_balance', opening_balance);
//       data.append('description', description);
//       Axios("POST", id ? `/api_web/Api_payment_method/payment_method/${id}?csrf_protection=true`: "/api_web/Api_payment_method/payment_method?csrf_protection=true", {
//         data: data,
//         headers: {"Content-Type": "multipart/form-data"} 
//       }, (err, response) => {
//         if(!err){
//           var {isSuccess, message} = response.data;
//           if(isSuccess){
//             Toast.fire({
//               icon: 'success',
//               title: props.dataLang[message]
//             })   
//             sOpen(false)
//             props.onRefresh && props.onRefresh()
//         }else {
//             Toast.fire({
//               icon: 'error',
//               title: props.dataLang[message]
//             })  
//           }
//         }
//           if(!id){
//              resetForm()
//           } 
          
       
//       }) 
//     }
//     const Toast = Swal.mixin({
//       toast: true,
//       position: 'top-end',
//       showConfirmButton: false,
//       timer: 2000,
//       timerProgressBar: true,
//     })
//     return(
//       <PopupEdit  
//         title={props.id ? `${props.dataLang?.branch_popup_payment_edit}` : `${props.dataLang?.branch_popup_payment_addnew}`} 
//         button={props.id ? <IconEdit/> : `${props.dataLang?.branch_popup_create_new}`} 
//         onClickOpen={_ToggleModal.bind(this, true)} 
//         open={open} onClose={_ToggleModal.bind(this,false)}
//         classNameBtn={props.className}
//       >
//         <div className="content mt-4">
//           <form onSubmit={ handleSubmit}>
//             <div>
//               <div className="flex flex-wrap justify-between">
//                 <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.branch_popup_payment_name}</label>
//                 <input
//                   // required
//                   value={name}
//                   onChange={_HandleChangeInput.bind(this, "name")}
//                   name="fname"                       
//                   type="text"
//                   className="placeholder-[color:#667085] w-full bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none mb-6"
//                 />
//               </div>
//               <div className="flex flex-wrap justify-between">
//                 <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.branch_popup_payment_balance} </label>
//                 <input
//                   // required
//                   pattern="[0-9]*"
//                   value={opening_balance}
//                   onChange={_HandleChangeInput.bind(this, "opening_balance")}
//                   name="opening_balance"                       
//                   type="text"
//                   className="placeholder-[color:#667085] w-full bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none mb-6"
//                 />     
//               </div>
          
//               <div className="flex flex-wrap ">
//                 <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.branch_popup_payment_bank} </label>
//               <textarea  value={description}
//                   onChange={_HandleChangeInput.bind(this, "description")}
//                   name="description" className="border border-gray-300 w-full min-h-[100px] outline-none p-2"/>
//               </div>
//               <div className=" mt-2">
//                 <div class="flex justify-between p-2">
//                   <div className="flex items-center">
//                   <label class="relative flex cursor-pointer items-center rounded-full p-3"
//                           htmlFor="react"
//                           data-ripple-dark="true"
//                         >
//                     <input type="radio" id="nganhang" value={"0"} onChange={_HandleChangeInput.bind(this, "cash_bank")} checked={cash_bank === "0" ? true : false} class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-[#0F4F9E] transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-[#0F4F9E] checked:before:bg-[#0F4F9E] hover:before:opacity-10"/>
//                     <div class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-[#0F4F9E] opacity-0 transition-opacity peer-checked:opacity-100">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               class="h-3.5 w-3.5"
//                               viewBox="0 0 16 16"
//                               fill="currentColor"
//                             >
//                               <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
//                             </svg>
//                           </div>
//                     </label>
//                     <label htmlFor="nganhang"   className="relative flex cursor-pointer items-center rounded-full p-3"            
//                   data-ripple-dark="true">{props.dataLang?.branch_popup_payment_banking}
//                   </label>
//                   </div>
//                   <div className="flex items-center">
//                   <label
//                           class="relative flex cursor-pointer items-center rounded-full p-3"
//                           htmlFor="react"
//                           data-ripple-dark="true"
//                         >
//                     <input type="radio" id="tienmat" value={"1"} onChange={_HandleChangeInput.bind(this, "cash_bank")} checked={cash_bank === "1" ? true : false} class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-[#0F4F9E] transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-[#0F4F9E] checked:before:bg-[#0F4F9E] hover:before:opacity-10"/>
//                     <div class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-[#0F4F9E] opacity-0 transition-opacity peer-checked:opacity-100">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               class="h-3.5 w-3.5"
//                               viewBox="0 0 16 16"
//                               fill="currentColor"
//                             >
//                               <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
//                             </svg>
//                           </div>
//                     </label>
//                     <label htmlFor="tienmat" className="relative flex cursor-pointer items-center rounded-full p-3"                   
//                          data-ripple-dark="true">{props.dataLang?.branch_popup_payment_cash}          
//                          </label>
//                   </div>
//                </div>
//               </div>
//               <div className="text-right mt-5 space-x-2">
//                 <button type="button" onClick={_ToggleModal.bind(this,false)} className="button text-[#344054] font-normal text-base py-2 px-4 rounded-lg border border-solid border-[#D0D5DD]"
//                 >{props.dataLang?.branch_popup_exit}</button>
//                 <button 
//                   type="submit"
//                   className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-lg bg-[#0F4F9E]"
//                 >
//                  {props.dataLang?.branch_popup_save}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </PopupEdit>
//     )
//   }

// export default Index;
