import React, { useRef, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import ModalImage from "react-modal-image";
import "react-datepicker/dist/react-datepicker.css";
import { NumericFormat } from "react-number-format";
import {
    Grid6 as IconExcel,
    Filter as IconFilter,
    Calendar as IconCalendar,
    SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    Edit as IconEdit,
    Trash as IconDelete,
    TickCircle,
} from "iconsax-react";

import Popup from "reactjs-popup";
import moment from "moment/moment";

const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});

import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";

import Swal from "sweetalert2";
import { useEffect } from "react";
import ExpandableContent from "components/UI/more";
import ImageErrors from "components/UI/imageErrors";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});
const Popup_chitiet = (props) => {
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const [data, sData] = useState();
    const [onFetching, sOnFetching] = useState(false);

    useEffect(() => {
        props?.id && sOnFetching(true);
    }, [open]);

    // const formatNumber = num => {
    //   if (!num && num !== 0) return 0;
    //   const roundedNum = Number(num).toFixed(2);
    //   return parseFloat(roundedNum).toLocaleString("en");
    // };
    const formatNumber = (number) => {
        const integerPart = Math.floor(number);
        return integerPart.toLocaleString("en");
    };

    const _ServerFetching_detailUser = () => {
        Axios(
            "GET",
            `/api_web/Api_service/service/${props?.id}?csrf_protection=true`,
            {},
            (err, response) => {
                if (!err) {
                    var db = response.data;
                    sData(db);
                }
                sOnFetching(false);
            }
        );
    };

    useEffect(() => {
        onFetching && _ServerFetching_detailUser();
    }, [open]);

    return (
        <>
            <PopupEdit
                title={
                    props.dataLang?.serviceVoucher_service_voucher_details ||
                    "serviceVoucher_service_voucher_details"
                }
                button={props?.name}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props?.className}
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <div className=" space-x-5 w-[999px]  2xl:h-auto xl:h-auto h-[650px] ">
                    <div>
                        <div className="w-[999px]">
                            <div className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                <h2 className="font-medium bg-[#ECF0F4] p-2 text-[13px]">
                                    {props?.dataLang
                                        ?.purchase_order_detail_general_informatione ||
                                        "purchase_order_detail_general_informatione"}
                                </h2>
                                <div className="grid grid-cols-8  min-h-[100px] px-2">
                                    <div className="col-span-3">
                                        <div className="my-4 font-semibold grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang
                                                    ?.serviceVoucher_day_vouchers ||
                                                    "serviceVoucher_day_vouchers"}
                                            </h3>
                                            <h3 className=" text-[13px]  font-medium">
                                                {data?.date != null
                                                    ? moment(data?.date).format(
                                                          "DD/MM/YYYY"
                                                      )
                                                    : ""}
                                            </h3>
                                        </div>
                                        <div className="my-2 items-center font-medium grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props?.dataLang
                                                    ?.production_warehouse_creator ||
                                                    "production_warehouse_creator"}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <div className="relative">
                                                    <ImageErrors
                                                        src={
                                                            data?.staff_create
                                                                ?.profile_image
                                                        }
                                                        width={25}
                                                        height={25}
                                                        defaultSrc="/user-placeholder.jpg"
                                                        alt="Image"
                                                        className="object-cover rounded-[100%] text-left cursor-pointer"
                                                    />
                                                    <span className="h-2 w-2 absolute 3xl:bottom-full 3xl:translate-y-[150%] 3xl:left-1/2  3xl:translate-x-[100%] 2xl:bottom-[80%] 2xl:translate-y-full 2xl:left-1/2 bottom-[50%] left-1/2 translate-x-full translate-y-full">
                                                        <span className="inline-flex relative rounded-full h-2 w-2 bg-lime-500">
                                                            <span className="animate-ping  inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 absolute"></span>
                                                        </span>
                                                    </span>
                                                </div>
                                                <h6 className="capitalize">
                                                    {
                                                        data?.staff_create
                                                            ?.full_name
                                                    }
                                                </h6>
                                            </div>
                                        </div>{" "}
                                        <div className="my-4 font-semibold grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang
                                                    ?.serviceVoucher_voucher_code ||
                                                    "serviceVoucher_voucher_code"}
                                            </h3>
                                            <h3 className=" text-[13px]  font-medium text-blue-600">
                                                {data?.code}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-span-2 mx-auto">
                                        <div className="my-4 font-semibold text-[13px]">
                                            {props.dataLang
                                                ?.serviceVoucher_status_of_spending ||
                                                "serviceVoucher_status_of_spending"}
                                        </div>
                                        <div className="flex flex-wrap  gap-2 items-center justify-center">
                                            {(data?.status_pay ===
                                                "not_spent" && (
                                                <span className=" font-normal text-sky-500  rounded-xl py-1 px-2 min-w-[135px]  bg-sky-200 text-center text-[13px]">
                                                    {"Chưa chi"}
                                                </span>
                                            )) ||
                                                (data?.status_pay ===
                                                    "spent_part" && (
                                                    <span className=" font-normal text-orange-500 rounded-xl py-1 px-2 min-w-[135px]  bg-orange-200 text-center text-[13px]">
                                                        {"Chi 1 phần"}{" "}
                                                        {`(${formatNumber(
                                                            data?.amount_paid
                                                        )})`}
                                                    </span>
                                                )) ||
                                                (data?.status_pay ===
                                                    "spent" && (
                                                    <span className="flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 min-w-[135px]  bg-lime-200 text-center text-[13px]">
                                                        <TickCircle
                                                            className="bg-lime-500 rounded-full"
                                                            color="white"
                                                            size={15}
                                                        />
                                                        {"Đã chi đủ"}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>

                                    <div className="col-span-3 ">
                                        <div className="my-4 font-semibold grid grid-cols-2">
                                            <h3 className="text-[13px] ">
                                                {props.dataLang
                                                    ?.purchase_order_table_supplier ||
                                                    "purchase_order_table_supplier"}
                                            </h3>
                                            <h3 className="text-[13px] font-medium ">
                                                {data?.supplier_name}
                                            </h3>
                                        </div>

                                        <div className="my-4 font-semibold grid grid-cols-2">
                                            <h3 className="text-[13px]">
                                                {props.dataLang
                                                    ?.purchase_order_table_branch ||
                                                    "purchase_order_table_branch"}
                                            </h3>
                                            <h3 className="3xl:items-center 3xl-text-[16px] 2xl:text-[13px] xl:text-xs text-[8px] text-[#0F4F9E] font-[300] px-2 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase w-fit">
                                                {data?.branch_name}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <div className=" w-[100%] lx:w-[110%] ">
                                    <div className="grid grid-cols-12 sticky top-0 bg-white shadow-lg  p-2 z-10 ">
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2  text-left">
                                            {props.dataLang
                                                ?.serviceVoucher_services_arising ||
                                                "serviceVoucher_services_arising"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1  text-center">
                                            {/* {props.dataLang?.serviceVoucher_quantity ||
                          "serviceVoucher_quantity"} */}
                                            {"SL"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1  text-center">
                                            {props.dataLang
                                                ?.serviceVoucher_unit_price ||
                                                "serviceVoucher_unit_price"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1  text-center">
                                            {"% CK"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2  text-center">
                                            {props.dataLang
                                                ?.import_from_price_affter ||
                                                "import_from_price_affter"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1  text-center">
                                            {props.dataLang
                                                ?.serviceVoucher_tax ||
                                                "serviceVoucher_tax"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2  text-center">
                                            {props.dataLang
                                                ?.serviceVoucher_into_money ||
                                                "serviceVoucher_into_money"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2  text-center">
                                            {props.dataLang
                                                ?.serviceVoucher_note ||
                                                "serviceVoucher_note"}
                                        </h4>
                                    </div>
                                    {onFetching ? (
                                        <Loading
                                            className="max-h-28"
                                            color="#0f4f9e"
                                        />
                                    ) : data?.item?.length > 0 ? (
                                        <>
                                            <ScrollArea
                                                className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px] overflow-hidden"
                                                speed={1}
                                                smoothScrolling={true}
                                            >
                                                <div className="divide-y divide-slate-200 min:h-[300px] h-[100%] max:h-[400px]">
                                                    {data?.item?.map((e) => (
                                                        <div
                                                            className="grid items-center grid-cols-12 py-1.5 px-2 hover:bg-slate-100/40 "
                                                            key={e.id?.toString()}
                                                        >
                                                            <h6 className="text-[13px]  px-2 py-0.5 col-span-2  font-medium text-left">
                                                                {e?.name}
                                                            </h6>
                                                            <h6 className="text-[13px]  px-2 py-0.5 col-span-1  font-medium text-center">
                                                                {formatNumber(
                                                                    e?.quantity
                                                                )}
                                                            </h6>
                                                            <h6 className="text-[13px]  px-2 py-0.5 col-span-1  font-medium text-center">
                                                                {formatNumber(
                                                                    e?.price
                                                                )}
                                                            </h6>
                                                            <h6 className="text-[13px]  px-2 py-0.5 col-span-1  font-medium text-center">
                                                                {e?.discount_percent +
                                                                    "%"}
                                                            </h6>
                                                            <h6 className="text-[13px]  px-2 py-0.5 col-span-2  font-medium text-center">
                                                                {formatNumber(
                                                                    e?.price_after_discount
                                                                )}
                                                            </h6>
                                                            <h6 className="text-[13px]  px-2 py-0.5 col-span-1  font-medium text-center">
                                                                {formatNumber(
                                                                    e?.tax_rate
                                                                ) + "%"}
                                                            </h6>
                                                            <h6 className="text-[13px]  px-2 py-0.5 col-span-2  font-medium text-right">
                                                                {formatNumber(
                                                                    e?.amount
                                                                )}
                                                            </h6>
                                                            <h6 className="text-[13px]  px-2 py-0.5 col-span-2  font-medium text-left">
                                                                {e?.note !=
                                                                undefined ? (
                                                                    <ExpandableContent
                                                                        content={
                                                                            e?.note
                                                                        }
                                                                    />
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </h6>
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </>
                                    ) : (
                                        <div className=" max-w-[352px] mt-24 mx-auto">
                                            <div className="text-center">
                                                <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                                                    <IconSearch />
                                                </div>
                                                <h1 className="textx-[#141522] text-base opacity-90 font-medium">
                                                    {props.dataLang
                                                        ?.purchase_order_table_item_not_found ||
                                                        "purchase_order_table_item_not_found"}
                                                </h1>
                                                <div className="flex items-center justify-around mt-6 "></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <h2 className="font-medium p-2 text-[13px]  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]">
                                    {props.dataLang?.purchase_total ||
                                        "purchase_total"}
                                </h2>
                                <div className=" mt-2  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
                                    <div className="col-span-7">
                                        <div>
                                            <div className="text-[#344054] font-semibold 2xl:text-[12px] xl:text-[13px] text-[13px] mb-1 ">
                                                {props.dataLang
                                                    ?.purchase_note ||
                                                    "purchase_note"}
                                            </div>
                                            <textarea
                                                value={data?.note}
                                                disabled
                                                name="fname"
                                                type="text"
                                                className="text-[13px]  placeholder:text-slate-300 w-[80%] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 min-h-[100px] max-h-[100px] resize-none bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-medium p-2 outline-none "
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2 mt-2 space-y-2">
                                        <div className="font-semibold text-left text-[13px]">
                                            <h3>
                                                {props.dataLang
                                                    ?.purchase_order_table_total ||
                                                    "purchase_order_table_total"}
                                            </h3>
                                        </div>
                                        <div className="font-semibold text-left text-[13px]">
                                            <h3>
                                                {props.dataLang
                                                    ?.purchase_order_detail_discounty ||
                                                    "purchase_order_detail_discounty"}
                                            </h3>
                                        </div>
                                        <div className="font-semibold text-left text-[13px]">
                                            <h3>
                                                {props.dataLang
                                                    ?.purchase_order_detail_money_after_discount ||
                                                    "purchase_order_detail_money_after_discount"}
                                            </h3>
                                        </div>
                                        <div className="font-semibold text-left text-[13px]">
                                            <h3>
                                                {props.dataLang
                                                    ?.purchase_order_detail_tax_money ||
                                                    "purchase_order_detail_tax_money"}
                                            </h3>
                                        </div>
                                        <div className="font-semibold text-left text-[13px]">
                                            <h3>
                                                {props.dataLang
                                                    ?.purchase_order_detail_into_money ||
                                                    "purchase_order_detail_into_money"}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-span-3 mt-2 space-y-2">
                                        <div className="font-medium mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatNumber(
                                                    data?.total_price
                                                )}
                                            </h3>
                                        </div>
                                        <div className="font-medium mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatNumber(
                                                    data?.total_discount
                                                )}
                                            </h3>
                                        </div>
                                        <div className="font-medium mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatNumber(
                                                    data?.total_price_after_discount
                                                )}
                                            </h3>
                                        </div>
                                        <div className="font-medium mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatNumber(
                                                    data?.total_tax_price
                                                )}
                                            </h3>
                                        </div>
                                        <div className="font-medium mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatNumber(
                                                    data?.total_amount
                                                )}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PopupEdit>
        </>
    );
};
export default Popup_chitiet;
