import React, { useEffect, useState, useRef } from "react";
import Popup from "reactjs-popup";
import moment from "moment/moment";
import dynamic from "next/dynamic";
import PopupEdit from "/components/UI/popup";

import {
    Grid6 as IconExcel,
    Filter as IconFilter,
    Calendar as IconCalendar,
    SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    TickCircle,
    ArrowCircleDown,
} from "iconsax-react";
import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";
import ModalImage from "react-modal-image";
import ExpandableContent from "components/UI/more";
import ImageErrors from "components/UI/imageErrors";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import formatNumberConfig from "@/utils/helpers/formatMoney";
import useSetingServer from "@/hooks/useConfigNumber";
import NoData from "@/components/UI/noData/nodata";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
const Popup_chitiet = (props) => {
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const [data, sData] = useState();
    const [onFetching, sOnFetching] = useState(false);
    const dataSeting = useSetingServer()
    useEffect(() => {
        props?.id && sOnFetching(true);
    }, [open]);
    const formatNumber = (num) => {
        return formatNumberConfig(+num, dataSeting);
    };

    const formatMoney = (number) => {
        return formatMoneyConfig(+number, dataSeting);
    }

    const _ServerFetching_detailUser = () => {
        Axios(
            "GET",
            `/api_web/Api_purchase_order/purchase_order/${props?.id}?csrf_protection=true`,
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
                    props.dataLang?.purchase_order_detail_title || "purchase_order_detail_title"
                }
                button={props?.name}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props?.className}
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                {/* <div className="mt-4 space-x-5 w-[999px] 2xl:h-[550px] xl:h-[750px] h-[700px] customsroll overflow-hidden  3xl:h-auto 2xl:scrollbar-thin 2xl:scrollbar-thumb-slate-300 2xl:scrollbar-track-slate-100">         */}
                {/* <div className="mt-4 space-x-5 w-[999px]">         */}
                {/* <div className="mt-4 space-x-5 w-[999px] 2xl:h-[750px] xl:h-[750px] h-[700px] 2xl:max-h-[750px] max-h-[600px] 2xl:overflow-visible xl:overflow-y-auto overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">         */}
                <div className=" space-x-5 w-[1150px] h-auto">
                    <div>
                        <div className="w-[1150px]">
                            <div className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                <h2 className="font-medium bg-[#ECF0F4] p-2 text-[13px]">
                                    {props?.dataLang?.purchase_order_detail_general_informatione || "purchase_order_detail_general_informatione"}
                                </h2>
                                <div className="grid grid-cols-8  min-h-[170px] px-2">
                                    <div className="col-span-3">
                                        <div className="my-4 font-semibold grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang?.purchase_order_detail_day_vouchers || "purchase_order_detail_day_vouchers"}
                                            </h3>
                                            <h3 className=" text-[13px]  font-medium">
                                                {data?.date != null ? moment(data?.date).format("DD/MM/YYYY, HH:mm:ss") : ""}
                                            </h3>
                                        </div>
                                        <div className="my-4 font-semibold grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang?.purchase_order_detail_delivery_date || "purchase_order_detail_delivery_date"}
                                            </h3>
                                            <h3 className=" text-[13px]  font-medium">
                                                {data?.delivery_date != null
                                                    ? moment(
                                                        data?.delivery_date
                                                    ).format("DD/MM/YYYY")
                                                    : ""}
                                            </h3>
                                        </div>
                                        <div className="my-4 font-semibold grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang?.purchase_order_detail_voucher_code || "purchase_order_detail_voucher_code"}
                                            </h3>
                                            <h3 className=" text-[13px]  font-medium text-blue-600">
                                                {data?.code}
                                            </h3>
                                        </div>
                                        <div className="my-4 font-semibold grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang?.purchase_order_table_ordertype || "purchase_order_table_ordertype"}
                                            </h3>
                                            <h3 className=" text-[13px] font-medium">
                                                {data?.order_type == "0" ? (
                                                    <span className="font-normal text-red-500  rounded-xl py-1 px-3  bg-red-200">
                                                        Tạo mới
                                                    </span>
                                                ) : (
                                                    <span className="font-normal text-lime-500  rounded-xl py-1 px-3  bg-lime-200">
                                                        YCMH
                                                    </span>
                                                )}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="col-span-2 mx-auto">
                                        <div className="my-4 font-medium text-[13px]">
                                            {"Trạng thái nhập hàng"}
                                        </div>
                                        <div className="flex flex-wrap  gap-2 items-center justify-start">
                                            {(data?.import_status ===
                                                "not_stocked" && (
                                                    <span className="flex justify-center items-center font-normal 2xl:text-xs xl:text-xs text-[8px] text-sky-500  rounded-xl py-1 px-2  min-w-[100px] bg-sky-200">
                                                        {props.dataLang[
                                                            data?.import_status
                                                        ] || data?.import_status}
                                                    </span>
                                                )) ||
                                                (data?.import_status ===
                                                    "stocked_part" && (
                                                        <span className="flex justify-center items-center font-normal 2xl:text-xs xl:text-xs text-[8px] text-orange-500 rounded-xl py-1 px-2  min-w-[100px] bg-orange-200">
                                                            {props.dataLang[
                                                                data?.import_status
                                                            ] ||
                                                                data?.import_status}
                                                        </span>
                                                    )) ||
                                                (data?.import_status ===
                                                    "stocked" && (
                                                        <span className="flex justify-center 2xl:text-xs xl:text-xs text-[8px] items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2  min-w-[100px] bg-lime-200">
                                                            <TickCircle
                                                                className="bg-lime-500 rounded-full "
                                                                color="white"
                                                                size={15}
                                                            />
                                                            {props.dataLang[
                                                                data?.import_status
                                                            ] ||
                                                                data?.import_status}
                                                        </span>
                                                    ))}
                                        </div>
                                        <div className="my-4 font-medium text-[13px]">
                                            {props.dataLang
                                                ?.purchase_order_table_number ||
                                                "purchase_order_table_number"}
                                        </div>
                                        <div className="flex flex-wrap  gap-2 items-center justify-start text-[13px]">
                                            {data?.purchases
                                                ?.reduce(
                                                    (acc, cur) =>
                                                        acc +
                                                        (acc ? ", " : "") +
                                                        cur.code,
                                                    ""
                                                )
                                                .split("")
                                                .join("")
                                                .replace(/^,/, "")}
                                        </div>
                                    </div>
                                    <div className="col-span-3 ">
                                        {/* <div className='flex flex-wrap  gap-2 items-center justify-start'>
                        {data?.status_pay === "0" && <span className=' font-normal text-sky-500  rounded-xl py-1 px-2  bg-sky-200'>{props.dataLang?.purchase_order_table_havent_spent_yet || "purchase_order_table_havent_spent_yet"}</span>||
                          data?.status_pay === "1" &&  <span className=' font-normal text-orange-500 rounded-xl py-1 px-2  bg-orange-200'>{props.dataLang?.purchase_order_table_spend_one_part || "purchase_order_table_spend_one_part"}</span> ||
                          data?.status_pay === "2" &&   <span className='flex items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2  bg-lime-200'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{props.dataLang?.purchase_order_table_enough_spent || "purchase_order_table_enough_spent"}</span>
                         }
                        </div> */}
                                        <div className="my-4 font-semibold grid grid-cols-2">
                                            <h3 className="text-[13px]">
                                                {props.dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"}
                                            </h3>
                                            <h3 className="text-[13px] font-medium">
                                                {data?.supplier_name}
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-2 col-span-2">
                                            <h3 className="col-span-1 text-[13px] font-medium">
                                                {props.dataLang?.production_warehouse_creator || "production_warehouse_creator"}
                                            </h3>
                                            {/* <h3 className="col-span-1 text-[13px] font-normal">
                                                {data?.user_create_name}
                                            </h3> */}
                                            <div className="flex items-center gap-2">
                                                <div className="relative">
                                                    <ImageErrors
                                                        src={
                                                            data?.staff_create?.profile_image
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
                                                        data?.staff_create?.full_name
                                                    }
                                                </h6>
                                            </div>
                                        </div>
                                        <div className="my-4 font-semibold grid grid-cols-2">
                                            <h3 className="text-[13px]">
                                                {props.dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}
                                            </h3>
                                            <TagBranch className='w-fit'>
                                                {data?.branch_name}
                                            </TagBranch>
                                        </div>
                                    </div>
                                </div>
                                <div className="pr-2 w-[100%] lx:w-[110%] ">
                                    <div className="grid grid-cols-12 sticky top-0  p-2  bg-white shadow-lg  z-10 rounded">
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                            {props.dataLang?.purchase_image || "purchase_image"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                            {props.dataLang?.purchase_items || "purchase_items"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                            {props.dataLang?.purchase_variant || "purchase_variant"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                            {/* {props.dataLang?.purchase_order_purchase_from_unit ||
                          "purchase_order_purchase_from_unit"} */}
                                            {"ĐVT"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                            {props.dataLang?.purchase_quantity || "purchase_quantity"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                            {props.dataLang?.purchase_order_detail_unit_price || "purchase_order_detail_unit_price"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                            {/* {props.dataLang?.purchase_order_detail_discount ||
                          "purchase_order_detail_discount"} */}
                                            {"% CK"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center">
                                            {/* {props.dataLang?.purchase_order_detail_after_discount ||
                          "purchase_order_detail_after_discount"} */}
                                            {"Đơn giá SCK"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                            {props.dataLang?.purchase_order_detail_tax || "purchase_order_detail_tax"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                            {props.dataLang?.purchase_order_detail_into_money || "purchase_order_detail_into_money"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                            {props.dataLang?.purchase_order_note || "purchase_order_note"}
                                        </h4>
                                    </div>
                                    {onFetching ? (
                                        <Loading
                                            className="max-h-28"
                                            color="#0f4f9e"
                                        />
                                    ) : data?.item?.length > 0 ? (
                                        <>
                                            <Customscrollbar
                                                className="min-h-[90px] max-h-[100px] 2xl:max-h-[250px]"
                                            >
                                                <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">
                                                    {data?.item?.map((e) => (
                                                        <div
                                                            className="grid items-center grid-cols-12 py-1.5 px-2 hover:bg-slate-100/40 "
                                                            key={e.id?.toString()}
                                                        >
                                                            <h6 className="text-[13px] mx-auto   py-0.5 col-span-1  rounded-md text-center">
                                                                {e?.item
                                                                    ?.images !=
                                                                    null ? (
                                                                    <ModalImage
                                                                        small={
                                                                            e
                                                                                ?.item
                                                                                ?.images
                                                                        }
                                                                        large={
                                                                            e
                                                                                ?.item
                                                                                ?.images
                                                                        }
                                                                        alt="Product Image"
                                                                        className="custom-modal-image object-cover rounded w-[50px] h-[60px]"
                                                                    />
                                                                ) : (
                                                                    <div className="w-[50px] h-[60px] object-cover  flex items-center justify-center rounded">
                                                                        <ModalImage
                                                                            small="/no_img.png"
                                                                            large="/no_img.png"
                                                                            className="w-full h-full rounded object-contain p-1"
                                                                        >
                                                                            {" "}
                                                                        </ModalImage>
                                                                    </div>
                                                                )}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-left">
                                                                {e?.item?.name}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-left break-words">
                                                                {e?.item?.product_variation}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-center break-words">
                                                                {e?.item?.unit_name}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-center mr-1">
                                                                {formatNumber(e?.quantity)}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-center">
                                                                {formatMoney(e?.price)}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-center">
                                                                {e?.discount_percent + "%"}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-0.5 col-span-2  rounded-md text-center">
                                                                {formatMoney(e?.price_after_discount)}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-center ">
                                                                {formatNumber(
                                                                    e?.tax_rate
                                                                ) + "%"}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-right mr-3.5">
                                                                {formatMoney(e?.amount)}
                                                            </h6>

                                                            <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-left ml-3.5 ">
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
                                            </Customscrollbar>
                                        </>
                                    ) : (
                                        <NoData />
                                    )}
                                </div>
                                <h2 className="font-medium p-2 text-[13px]  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]">
                                    {props.dataLang?.purchase_total || "purchase_total"}
                                </h2>
                                <div className="mt-2  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
                                    <div className="col-span-7">
                                        <h3 className="text-[13px] p-1 font-medium">
                                            {props.dataLang?.purchase_order_note || "purchase_order_note"}
                                        </h3>
                                        <textarea
                                            className="resize-none text-[13px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 placeholder:text-slate-300 w-[90%] min-h-[90px] max-h-[90px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1 outline-none "
                                            disabled
                                            value={data?.note}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <div className="font-semibold text-left text-[13px]">
                                            <h3>
                                                {props.dataLang?.purchase_order_table_total || "purchase_order_table_total"}
                                            </h3>
                                        </div>
                                        <div className="font-semibold text-left text-[13px]">
                                            <h3>
                                                {props.dataLang?.purchase_order_detail_discounty || "purchase_order_detail_discounty"}
                                            </h3>
                                        </div>
                                        <div className="font-semibold text-left text-[13px]">
                                            <h3>
                                                {props.dataLang?.purchase_order_detail_money_after_discount || "purchase_order_detail_money_after_discount"}
                                            </h3>
                                        </div>
                                        <div className="font-semibold text-left text-[13px]">
                                            <h3>
                                                {props.dataLang?.purchase_order_detail_tax_money || "purchase_order_detail_tax_money"}
                                            </h3>
                                        </div>
                                        <div className="font-semibold text-left text-[13px]">
                                            <h3>
                                                {props.dataLang?.purchase_order_detail_into_money || "purchase_order_detail_into_money"}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-span-3 space-y-2">
                                        <div className="font-medium mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatMoney(data?.total_price)}
                                            </h3>
                                        </div>
                                        <div className="font-medium mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatMoney(data?.total_discount)}
                                            </h3>
                                        </div>
                                        <div className="font-medium mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatMoney(data?.total_price_after_discount)}
                                            </h3>
                                        </div>
                                        <div className="font-medium mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatMoney(data?.total_tax)}
                                            </h3>
                                        </div>
                                        <div className="font-medium mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatMoney(data?.total_amount)}
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
