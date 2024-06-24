import PopupEdit from "@/components/UI/popup";
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import ModalImage from "react-modal-image";

import {
    SearchNormal1 as IconSearch
} from "iconsax-react";
import 'react-datepicker/dist/react-datepicker.css';


import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from '/services/axios';

import formatMoneyConfig from "@/utils/helpers/formatMoney";

import formatNumberConfig from "@/utils/helpers/formatnumber";

import { Customscrollbar } from '@/components/UI/common/Customscrollbar';
import TagBranch from '@/components/UI/common/tag/TagBranch';
import { FORMAT_MOMENT } from '@/constants/formatDate/formatDate';
import useSetingServer from "@/hooks/useConfigNumber";
import { formatMoment } from '@/utils/helpers/formatMoment';


const PopupDetail = (props) => {
    const dataSeting = useSetingServer()

    const [open, sOpen] = useState(false);

    const _ToggleModal = (e) => sOpen(e);

    const [data, sData] = useState()

    const [onFetching, sOnFetching] = useState(false);

    useEffect(() => {
        props?.id && sOnFetching(true)
    }, [open]);

    const formatNumber = (num) => {
        return formatNumberConfig(+num, dataSeting)
    };

    const formatMoney = (num) => {
        return formatMoneyConfig(+num, dataSeting);
    };
    const _ServerFetching_detailUser = () => {
        Axios("GET", `/api_web/Api_quotation/quotation/${props?.id}?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                var db = response.data
                sData(db)
            }
            sOnFetching(false)
        })
    }

    useEffect(() => {
        onFetching && _ServerFetching_detailUser()
    }, [open]);

    return (
        <>
            <PopupEdit
                title={props.dataLang?.price_quote_popup_detail_title || "price_quote_popup_detail_title"}
                button={props?.name}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open} onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props?.className}
            >
                <div className='flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]' />

                <div className=" space-x-5 w-[999px]  2xl:h-auto xl:h-[680px] h-[650px] ">
                    <div>
                        <div className='w-[999px]'>
                            <div className="min:h-[170px] h-[72%] max:h-[100px] overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                <h2 className='font-normal bg-[#ECF0F4] p-2 text-[13px]'>{props?.dataLang?.price_quote_detail_general_information || "price_quote_detail_general_information"}</h2>
                                <div className='grid grid-cols-8  min-h-[170px] px-2'>
                                    <div className='col-span-4'>
                                        <div className='my-4 font-medium grid grid-cols-2'>
                                            <h3 className=' text-[13px] '>
                                                {props.dataLang?.price_quote_date || "price_quote_date"}
                                            </h3>
                                            <h3 className=' text-[13px]  font-normal'>
                                                {data?.date != null ? formatMoment(data?.date, FORMAT_MOMENT.DATE_TIME_SLASH_LONG) : ""}
                                            </h3>
                                        </div>
                                        <div className='my-4 font-medium grid grid-cols-2'>
                                            <h3 className=' text-[13px] '>
                                                {props.dataLang?.price_quote_effective_date || "price_quote_effective_date"}
                                            </h3>
                                            <h3 className=' text-[13px]  font-normal'>
                                                {data?.validity != null ? formatMoment(data?.validity, FORMAT_MOMENT.DATE_SLASH_LONG) : ""}
                                            </h3>
                                        </div>
                                        <div className='my-4 font-medium grid grid-cols-2'>
                                            <h3 className=' text-[13px] '>
                                                {props.dataLang?.price_quote_code || "price_quote_code"}
                                            </h3>
                                            <h3 className=' text-[13px]  font-normal'>
                                                {data?.reference_no}
                                            </h3>
                                        </div>
                                        <div className='my-4 font-medium grid grid-cols-2'>
                                            <h3 className=' text-[13px] '>
                                                {props.dataLang?.price_quote_order_status || "price_quote_order_status"}
                                            </h3>
                                            <h3 className=' text-[13px] font-normal'>
                                                {
                                                    data?.status == "not_confirmed" && (<span className='font-normal text-red-500  rounded-xl py-1 px-3  bg-red-200'>Chưa Duyệt</span>)
                                                    ||
                                                    data?.status == "no_confirmed" && (<span className='font-normal text-white  rounded-xl py-1 px-3  bg-[#0F4F9E]'>Không Duyệt</span>)
                                                    ||
                                                    data?.status == "confirmed" && (<span className='font-normal text-white  rounded-xl py-1 px-3  bg-lime-500'>Đã Duyệt</span>)
                                                    ||
                                                    data?.status == "ordered" && (<span className='font-normal text-white  rounded-xl py-1 px-3  bg-[#FF8C00]'>Đã Tạo Đặt Đơn Hàng</span>)
                                                }
                                            </h3>
                                        </div>
                                    </div>

                                    <div className='col-span-4 '>
                                        <div className='my-4 font-medium grid grid-cols-2'>

                                            <h3 className='text-[13px]'>
                                                {props.dataLang?.price_quote_customer || "price_quote_customer"}
                                            </h3>
                                            <h3 className='text-[13px] font-normal'>
                                                {data?.client_name}
                                            </h3>
                                        </div>
                                        <div className='my-4 font-medium grid grid-cols-2'>

                                            <h3 className='text-[13px]'>
                                                {props.dataLang?.price_quote_contact_person || "price_quote_contact_person"}
                                            </h3>
                                            <h3 className='text-[13px] font-normal'>
                                                {data?.contact_name}
                                            </h3>
                                        </div>
                                        <div className='my-4 font-medium grid grid-cols-2'>
                                            <h3 className='text-[13px]'>
                                                {props.dataLang?.price_quote_branch || "price_quote_branch"}
                                            </h3>
                                            <TagBranch className="w-fit mr-2">
                                                {data?.branch_name}
                                            </TagBranch>
                                        </div>
                                        <div className='my-4 font-medium grid grid-cols-2'>
                                            <h3 className='text-[13px]'>
                                                {props.dataLang?.price_quote_note || "price_quote_note"}
                                            </h3>
                                            <h3 className='col-span-1 font-normal'>
                                                {data?.note}
                                            </h3>
                                        </div>
                                    </div>

                                </div>
                                <div className="pr-2 w-[100%] lx:w-[110%] ">
                                    <div className="grid grid-cols-12 sticky top-0 bg-slate-100 p-2 z-10">
                                        <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-left">
                                            {props.dataLang?.price_quote_image || "price_quote_image"}
                                        </h4>
                                        <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">
                                            {props.dataLang?.price_quote_item || "price_quote_item"}
                                        </h4>
                                        <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">
                                            {props.dataLang?.price_quote_variant || "price_quote_variant"}
                                        </h4>
                                        <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">
                                            {props.dataLang?.price_quote_from_unit || "price_quote_from_unit"}</h4>
                                        <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">
                                            {props.dataLang?.price_quote_quantity || "price_quote_quantity"}
                                        </h4>
                                        <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">
                                            {props.dataLang?.price_quote_unit_price || "price_quote_unit_price"}
                                        </h4>
                                        <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">
                                            {props.dataLang?.price_quote_discount || "price_quote_discount"}
                                        </h4>
                                        <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-2 font-[400] text-center">
                                            {props.dataLang?.price_quote_after_discount || "price_quote_after_discount"}
                                        </h4>
                                        <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">
                                            {props.dataLang?.price_quote_tax || "price_quote_tax"}
                                        </h4>
                                        <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">
                                            {props.dataLang?.price_quote_into_money || "price_quote_into_money"}
                                        </h4>
                                        <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">
                                            {props.dataLang?.price_quote_note || "price_quote_note"}
                                        </h4>
                                    </div>
                                    {onFetching ?
                                        <Loading className="h-20 2xl:h-[160px]" color="#0f4f9e" />
                                        :
                                        data?.items?.length > 0 ?
                                            (<>
                                                <Customscrollbar
                                                    className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px] overflow-hidden">
                                                    <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">
                                                        {(data?.items?.map((e) =>
                                                            <div className="grid items-center grid-cols-12 py-1.5 px-2 hover:bg-slate-100/40 " key={e.id?.toString()}>
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
                                                                <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-left break-words">
                                                                    {e?.item?.product_variation}
                                                                </h6>
                                                                <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center break-words">
                                                                    {e?.item?.unit_name}
                                                                </h6>
                                                                <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                                    {formatNumber(e?.quantity)}
                                                                </h6>
                                                                <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                                    {formatMoney(e?.price)}
                                                                </h6>
                                                                <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                                    {e?.discount_percent + "%"}
                                                                </h6>
                                                                <h6 className="text-[13px]  px-2 py-0.5 col-span-2  rounded-md text-center">
                                                                    {formatMoney(e?.price_after_discount)}
                                                                </h6>
                                                                <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                                    {formatNumber(e?.tax_rate) + "%"}
                                                                </h6>
                                                                <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                                    {formatMoney(e?.amount)}
                                                                </h6>

                                                                <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-left">
                                                                    {e?.note != undefined ? e?.note : ""}
                                                                </h6>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Customscrollbar>
                                            </>
                                            ) :
                                            (
                                                <div className=" max-w-[352px] mt-24 mx-auto" >
                                                    <div className="text-center">
                                                        <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                                                        <h1 className="textx-[#141522] text-base opacity-90 font-medium">{props.dataLang?.purchase_order_table_item_not_found || "purchase_order_table_item_not_found"}</h1>
                                                        <div className="flex items-center justify-around mt-6 ">
                                                            {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                </div>
                                <h2 className='font-normal p-2 text-[13px]  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]'>{props.dataLang?.purchase_total || "purchase_total"}</h2>
                                <div className="text-right mt-2  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
                                    <div className='col-span-7'>
                                    </div>
                                    <div className='col-span-2 space-y-2'>
                                        <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_table_total || "purchase_order_table_total"}</h3></div>
                                        <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_detail_discounty || "purchase_order_detail_discounty"}</h3></div>
                                        <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_detail_money_after_discount || "purchase_order_detail_money_after_discount"}</h3></div>
                                        <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_detail_tax_money || "purchase_order_detail_tax_money"}</h3></div>
                                        <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_detail_into_money || "purchase_order_detail_into_money"}</h3></div>
                                    </div>
                                    <div className='col-span-3 space-y-2'>
                                        <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatMoney(data?.total_price)}</h3></div>
                                        <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatMoney(data?.total_discount)}</h3></div>
                                        <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatMoney(data?.total_price_after_discount)}</h3></div>
                                        <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatMoney(data?.total_tax)}</h3></div>
                                        <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatMoney(data?.total_amount)}</h3></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </PopupEdit>
        </>
    )
}

export default PopupDetail