import React, { useRef, useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ModalImage from "react-modal-image";
import 'react-datepicker/dist/react-datepicker.css';
import PopupEdit from "../../../../components/UI/popup";

import {
    Grid6 as IconExcel, Filter as IconFilter, Calendar as IconCalendar, SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    TickCircle,
    ArrowCircleDown
} from "iconsax-react";
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import Datepicker from 'react-tailwindcss-datepicker'
import DatePicker, { registerLocale } from "react-datepicker";

import moment from 'moment/moment';
import vi from "date-fns/locale/vi"
registerLocale("vi", vi);
const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});

import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from '/services/axios';

const PopupDetailQuote = (props) => {
    const scrollAreaRef = useRef(null);
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const [data, sData] = useState()
    const [onFetching, sOnFetching] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        props?.id && sOnFetching(true)
    }, [open]);

    const formatNumber = num => {
        if (!num && num !== 0) return 0;
        const roundedNum = Number(num).toFixed(2);
        return parseFloat(roundedNum).toLocaleString("en");
    };

    const handleFetchingDetailQuote = async () => {
        setLoading(true)
        await Axios("GET", `/api_web/Api_quotation/quotation/${props?.id}?csrf_protection=true`, {}, (err, response) => {
            if (response && response?.data) {
                var db = response?.data

                sData(db)
                sOnFetching(false)
                setLoading(false)
            }
        })
    }

    useEffect(() => {
        onFetching && handleFetchingDetailQuote()
    }, [open]);


    const scrollableDiv = document.querySelector('.customsroll');
    scrollableDiv?.addEventListener('wheel', (event) => {
        const deltaY = event.deltaY;
        const top = scrollableDiv.scrollTop;
        const height = scrollableDiv.scrollHeight;
        const offset = scrollableDiv.offsetHeight;
        const isScrolledToTop = top === 0;
        const isScrolledToBottom = top === height - offset;

        if ((deltaY < 0 && isScrolledToTop) || (deltaY > 0 && isScrolledToBottom)) {
            event.preventDefault();
        }
    });


    return (
        <>
            <PopupEdit
                title={props.dataLang?.price_quote_popup_detail_title || "price_quote_popup_detail_title"}
                button={props?.name}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open} onClose={_ToggleModal.bind(this, false)}
                classNameBtn={`${props?.className}`}
            >
                <div className='flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]' />

                <div className="3xl:w-[1100px] 2xl:w-[1000px] xl:w-[999px] w-[888px] h-auto">

                    <div className="customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 flex flex-col">
                        <h2 className='font-normal bg-[#ECF0F4] 3xl:p-2 p-1 3xl:text-[16px] 2xl:text-[16px] xl:text-[15px] text-[15px]'>
                            {props?.dataLang?.detail_general_information || "detail_general_information"}
                        </h2>
                        <div className='grid grid-cols-12 min-h-[100px]'>
                            <div className='col-span-4'>
                                <div className='xl:my-4 my-3 font-medium grid grid-cols-6 '>
                                    <h3 className='3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2 whitespace-nowrap '>
                                        {props.dataLang?.price_quote_date || "price_quote_date"} :
                                    </h3>
                                    <h3 className='3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal items-start col-span-4 ml-3'>
                                        {data?.date != null ? moment(data?.date).format("DD/MM/YYYY, HH:mm:ss") : ""}
                                    </h3>
                                </div>
                                <div className='xl:my-4 my-3 font-medium grid grid-cols-6 '>
                                    <h3 className='3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2'>
                                        {props.dataLang?.price_quote_effective_date || "price_quote_effective_date"} :
                                    </h3>
                                    <h3 className='3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px]  font-normal col-span-2 ml-3'>
                                        {data?.validity != null ? moment(data?.validity).format("DD/MM/YYYY") : ""}
                                    </h3>
                                </div>
                                <div className='xl:my-4 my-3 font-medium grid grid-cols-6 '>
                                    <h3 className='3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2'>
                                        {props.dataLang?.price_quote_code || "price_quote_code"} :
                                    </h3>
                                    <h3 className='3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px]  font-normal col-span-2 ml-3'>
                                        {data?.reference_no}
                                    </h3>
                                </div>

                            </div>

                            <div className='col-span-4 '>
                                <div className='xl:my-4 my-3 font-medium grid grid-cols-6 '>
                                    <h3 className='3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2'>
                                        {props.dataLang?.price_quote_order_status || "price_quote_order_status"} :
                                    </h3>
                                    <h3 className='3xl:text-[12px] 2xl:text-[11px] xl:text-[11px] text-[10px] font-normal col-span-4'>
                                        {
                                            data?.status == "not_confirmed" && (
                                                <span className='border flex justify-center items-center rounded-2xl 3xl:w-24 2xl:w-[88px] xl:w-[74px] lg:w-16 3xl:h-7 2xl:h-6 xl:h-5 lg:h-5 px-1  bg-red-200 border-red-200 text-red-500'>
                                                    Chưa Duyệt
                                                </span>
                                            )
                                            ||
                                            data?.status == "no_confirmed" && (
                                                <span className='border flex justify-center items-center rounded-2xl 3xl:w-24 2xl:w-[88px] xl:w-[74px] lg:w-16 3xl:h-7 2xl:h-6 xl:h-5 lg:h-5 px-1 bg-blue-200 border-blue-200 text-blue-500'>
                                                    Không Duyệt
                                                </span>)
                                            ||
                                            data?.status == "confirmed" && (
                                                <span className='border flex justify-center items-center rounded-2xl 3xl:w-24 2xl:w-20 xl:w-[74px] lg:w-[68px] 3xl:h-6 2xl:h-6 xl:h-5 lg:h-5 px-1 bg-lime-200 border-lime-200 text-lime-500'>
                                                    Đã Duyệt
                                                </span>)
                                            ||
                                            data?.status == "ordered" && (
                                                <span className='border flex justify-center items-center rounded-2xl 3xl:w-[150px] 2xl:w-36 xl:w-36 lg:w-32 3xl:h-7 2xl:h-6 xl:h-5 lg:h-5 3xl:p-2 px-1 bg-orange-200 border-organe-200 text-orange-500'>
                                                    Đã Tạo Đặt Đơn Hàng
                                                </span>)
                                        }
                                    </h3>
                                </div>
                                <div className='xl:my-4 my-3 font-medium grid grid-cols-6 '>

                                    <h3 className='3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2'>
                                        {props.dataLang?.price_quote_customer || "price_quote_customer"} :
                                    </h3>
                                    <h3 className='3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal col-span-4'>
                                        {data?.client_name}
                                    </h3>
                                </div>
                                <div className='xl:my-4 my-3 font-medium grid grid-cols-6 '>

                                    <h3 className='3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2'>
                                        {props.dataLang?.price_quote_contact_person || "price_quote_contact_person"} :
                                    </h3>
                                    <h3 className='3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal col-span-4'>
                                        {data?.contact_name}
                                    </h3>
                                </div>
                            </div>
                            <div className='col-span-4 '>
                                <div className='xl:my-4 my-3 font-medium grid grid-cols-6 '>
                                    <h3 className='3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2'>
                                        {props.dataLang?.price_quote_branch || "price_quote_branch"} :
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[10px]  col-span-4 mr-2 px-2 max-w-[250px] w-fit max-h-[100px] text-center text-[#0F4F9E]  font-[400] py-0.5 border border-[#0F4F9E] rounded-[5.5px] ">
                                        {data?.branch_name}
                                    </h3>
                                </div>

                            </div>

                        </div>
                        <div className="pr-2 w-[100%] lx:w-[110%] ">
                            <div className="grid grid-cols-12 items-center sticky rounded-t-xl top-0 bg-slate-100 p-2 z-10">
                                <h4 className="3xl:text-[13px] text-[12px] text-[#667085] uppercase col-span-1 font-[500] text-left whitespace-nowrap">
                                    {props.dataLang?.price_quote_image || "price_quote_image"}
                                </h4>
                                <h4 className="3xl:text-[13px] text-[12px] text-[#667085] uppercase col-span-1 font-[500] text-center items-center whitespace-nowrap">
                                    {props.dataLang?.price_quote_item || "price_quote_item"}
                                </h4>
                                <h4 className="3xl:text-[13px] text-[12px] text-[#667085] uppercase col-span-2 font-[500] text-center whitespace-nowrap">
                                    {props.dataLang?.price_quote_variant || "price_quote_variant"}
                                </h4>
                                <h4 className="3xl:text-[13px] text-[12px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                    {props.dataLang?.price_quote_from_unit || "price_quote_from_unit"}</h4>
                                <h4 className="3xl:text-[13px] text-[12px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                    {props.dataLang?.price_quote_quantity || "price_quote_quantity"}
                                </h4>
                                <h4 className="3xl:text-[13px] text-[12px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                    {props.dataLang?.price_quote_unit_price || "price_quote_unit_price"}
                                </h4>
                                <h4 className="3xl:text-[13px] text-[12px] text-[#667085] uppercase col-span-1 font-[500] text-center ">
                                    {props.dataLang?.price_quote_person || "price_quote_person"}
                                </h4>
                                <h4 className="3xl:text-[13px] text-[12px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-pre-line">
                                    {props.dataLang?.price_quote_after_discount || "price_quote_after_discount"}
                                </h4>
                                <h4 className="3xl:text-[13px] text-[12px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                    {props.dataLang?.price_quote_tax || "price_quote_tax"}
                                </h4>
                                <h4 className="3xl:text-[13px] text-[12px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                    {props.dataLang?.price_quote_into_money || "price_quote_into_money"}
                                </h4>
                                <h4 className="3xl:text-[13px] text-[12px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-normal">
                                    {props.dataLang?.price_quote_note_item || "price_quote_note_item"}
                                </h4>
                            </div>
                            {loading ?
                                <Loading className="h-20 2xl:h-[160px]" color="#0f4f9e" />
                                :
                                data?.items?.length > 0 ?
                                    (<>
                                        <ScrollArea
                                            className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px] overflow-hidden" speed={1} smoothScrolling={true}>
                                            <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">
                                                {(data?.items?.map((e) =>
                                                    <div className="grid items-center grid-cols-12 py-1.5 px-2 hover:bg-slate-100/40" key={e.id?.toString()}>
                                                        <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-left">
                                                            {
                                                                e?.item?.images != null
                                                                    ?
                                                                    (
                                                                        <ModalImage small={e?.item?.images} large={e?.item?.images} alt="Product Image" className='custom-modal-image object-cover rounded w-[50px] h-[60px]' />
                                                                    )
                                                                    :
                                                                    (
                                                                        <div className='w-[50px] h-[60px] object-cover  flex items-center justify-center rounded'>
                                                                            <ModalImage small="/no_img.png" large="/no_img.png" className='w-full h-full rounded object-contain p-1' />
                                                                        </div>
                                                                    )
                                                            }
                                                        </h6>
                                                        <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-left">
                                                            {e?.item?.name}
                                                        </h6>
                                                        <h6 className="text-[13px]  px-2 py-0.5 col-span-2  rounded-md text-left break-words">
                                                            {e?.item?.product_variation}
                                                        </h6>
                                                        <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center break-words">
                                                            {e?.item?.unit_name}
                                                        </h6>
                                                        <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                            {formatNumber(e?.quantity)}
                                                        </h6>
                                                        <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-right">
                                                            {formatNumber(e?.price)}
                                                        </h6>
                                                        <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                            {e?.discount_percent + "%"}
                                                        </h6>
                                                        <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-right">
                                                            {formatNumber(e?.price_after_discount)}
                                                        </h6>
                                                        <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                            {formatNumber(e?.tax_rate) + "%"}
                                                        </h6>
                                                        <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-right">
                                                            {formatNumber(e?.amount)}
                                                        </h6>
                                                        <h6 className="text-[12px] px-2 col-span-1 rounded-md text-left whitespace-normal">
                                                            {e?.note != undefined ? e?.note : ""}
                                                        </h6>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </>
                                    ) :
                                    (
                                        <div className=" max-w-[352px] mt-24 mx-auto" >
                                            <div className="text-center">
                                                <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                                                <h1 className="textx-[#141522] text-base opacity-90 font-medium">{props.dataLang?.price_quote_table_item_not_found || "price_quote_table_item_not_found"}</h1>
                                                <div className="flex items-center justify-around mt-6 ">
                                                    {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                        </div>
                        <h2 className='font-normal p-2 3xl:text-[16px] 2xl:text-[16px] xl:text-[15px] text-[15px] border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]'>
                            {props.dataLang?.purchase_total || "purchase_total"}
                        </h2>
                        <div className="text-right mt-2  grid grid-cols-12 flex-col justify-between">
                            <div className='col-span-7 font-medium grid grid-cols-7 text-left'>
                                <h3 className='3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px] '>
                                    {props.dataLang?.price_quote_note || "price_quote_note"}
                                </h3>
                                <h3 className='3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px] col-span-5 font-normal rounded-lg'>
                                    {data?.note}
                                </h3>
                            </div>
                            <div className='col-span-2 space-y-2'>
                                <div className='font-normal text-left 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]'><h3>{props.dataLang?.price_quote_total || "price_quote_total"}</h3></div>
                                <div className='font-normal text-left 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]'><h3>{props.dataLang?.price_quote_total_discount || "price_quote_discount"}</h3></div>
                                <div className='font-normal text-left 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]'><h3>{props.dataLang?.price_quote_total_money_after_discount || "price_quote_money_after_discount"}</h3></div>
                                <div className='font-normal text-left 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]'><h3>{props.dataLang?.price_quote_tax_money || "price_quote_tax_money"}</h3></div>
                                <div className='font-normal text-left 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]'><h3>{props.dataLang?.price_quote_into_money || "price_quote_into_money"}</h3></div>
                            </div>
                            <div className='col-span-3 space-y-2'>
                                <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]'>{formatNumber(data?.total_price)}</h3></div>
                                <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]'>{formatNumber(data?.total_discount)}</h3></div>
                                <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]'>{formatNumber(data?.total_price_after_discount)}</h3></div>
                                <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]'>{formatNumber(data?.total_tax_price)}</h3></div>
                                <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]'>{formatNumber(data?.total_amount)}</h3></div>
                            </div>
                        </div>
                    </div>

                </div>
            </PopupEdit>
        </>
    )
}

export default PopupDetailQuote