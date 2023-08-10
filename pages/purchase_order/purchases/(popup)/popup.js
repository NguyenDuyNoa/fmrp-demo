import React, { useState, useEffect, useRef } from "react";
import PopupEdit from "/components/UI/popup";
import {
    Grid6 as IconExcel,
    Filter as IconFilter,
    Calendar as IconCalendar,
    SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    Add as IconAdd,
    TickCircle,
    ArrowCircleDown,
    Image as IconImage,
} from "iconsax-react";
import dynamic from "next/dynamic";
import ModalImage from "react-modal-image";

import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";
import moment from "moment/moment";
import ExpandableContent from "components/UI/more";
import ImageErrors from "components/UI/imageErrors";
const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});
const Popup_chitiet = (props) => {
    const scrollAreaRef = useRef(null);
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const [data, sData] = useState();
    const [onFetching, sOnFetching] = useState(false);
    useEffect(() => {
        props?.id && sOnFetching(true);
    }, [open]);
    const _ServerFetching_detailUser = async () => {
        await Axios(
            "GET",
            `/api_web/Api_purchases/purchases/${props?.id}?csrf_protection=true`,
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

    let listQty = data?.items;
    let totalQuantity = 0;
    for (let i = 0; i < listQty?.length; i++) {
        totalQuantity += parseInt(listQty[i].quantity);
    }

    const formatNumber = (number) => {
        const integerPart = Math.floor(number);
        return integerPart.toLocaleString("en");
    };

    return (
        <>
            <PopupEdit
                title={
                    props.dataLang?.purchase_detail_title ||
                    "purchase_detail_title"
                }
                button={props?.name}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props?.className}
            >
                <div className="flex items-center space-x-4 my-3 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <div className="mt-4 space-x-5 w-[1050px] h-auto ">
                    <div>
                        <div className="w-[1050px]">
                            <div className="min:h-[170px] h-[72%] max:h-[100px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                <h2 className="font-medium bg-[#ECF0F4] p-2 text-[13px]">
                                    {props?.dataLang?.purchase_general ||
                                        "purchase_general"}
                                </h2>
                                <div className="grid grid-cols-8  min-h-[140px] p-2">
                                    <div className="col-span-3">
                                        <div className="my-4 font-semibold grid grid-cols-2">
                                            <h3 className="col-span-1 text-[13px]">
                                                {props.dataLang?.purchase_day ||
                                                    "purchase_day"}
                                            </h3>
                                            <h3 className="col-span-1 font-medium text-[13px]">
                                                {data?.date != null
                                                    ? moment(data?.date).format(
                                                          "DD/MM/YYYY"
                                                      )
                                                    : ""}
                                            </h3>
                                        </div>
                                        <div className="my-4 font-semibold grid grid-cols-2">
                                            <h3 className="col-span-1 text-[13px]">
                                                {props.dataLang
                                                    ?.purchase_code ||
                                                    "purchase_code"}
                                            </h3>
                                            <h3 className="col-span-1 font-medium text-[13px] text-blue-600">
                                                {data?.code}
                                            </h3>
                                        </div>
                                        <div className="my-4 font-semibold grid grid-cols-2">
                                            <h3 className="col-span-1 text-[13px]">
                                                {props.dataLang
                                                    ?.purchase_planNumber ||
                                                    "purchase_planNumber"}
                                            </h3>
                                            <h3 className="col-span-1 font-medium text-[13px]">
                                                {data?.reference_no}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="col-span-2 mx-auto">
                                        <div className="my-4 font-semibold text-[13px]">
                                            {props.dataLang
                                                ?.purchase_orderStatus ||
                                                "purchase_orderStatus"}
                                        </div>
                                        <div className="flex flex-wrap  gap-2 items-center justify-start">
                                            {(data?.order_status?.status ===
                                                "purchase_ordered" && (
                                                <span className="text-center font-normal text-sky-500  rounded-xl py-1 px-2 min-w-[135px] text-[13px]  bg-sky-200">
                                                    {
                                                        props.dataLang[
                                                            data?.order_status
                                                                ?.status
                                                        ]
                                                    }
                                                </span>
                                            )) ||
                                                (data?.order_status?.status ===
                                                    "purchase_portion" && (
                                                    <span className="text-center font-normal text-orange-500 rounded-xl py-1 px-2 min-w-[135px] text-[13px]  bg-orange-200">
                                                        {
                                                            props.dataLang[
                                                                data
                                                                    ?.order_status
                                                                    ?.status
                                                            ]
                                                        }{" "}
                                                        {`(${data?.order_status?.count})`}
                                                    </span>
                                                )) ||
                                                (data?.order_status?.status ===
                                                    "purchase_enough" && (
                                                    <span className="flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 min-w-[135px] text-[13px]  bg-lime-200">
                                                        <TickCircle
                                                            className="bg-lime-500 rounded-full"
                                                            color="white"
                                                            size={15}
                                                        />
                                                        {
                                                            props.dataLang[
                                                                data
                                                                    ?.order_status
                                                                    ?.status
                                                            ]
                                                        }{" "}
                                                        {`(${data?.order_status?.count})`}
                                                    </span>
                                                ))}
                                        </div>
                                        {/* <div className=' font-normal text-sky-500  rounded-xl py-1 px-2 max-w-[180px] my-2 text-center  bg-sky-200'>{props.dataLang?.purchase_ordered || "purchase_ordered"}</div>
                          <div className=' font-normal text-orange-500 rounded-xl py-1 px-2 max-w-[180px] my-2 text-center  bg-orange-200'>{props.dataLang?.purchase_portion || "purchase_portion"} (0)</div>
                          <div className='flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 max-w-[180px] my-2 text-center  bg-lime-200'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{props.dataLang?.purchase_enough || "purchase_enough"} (0)</div> */}
                                    </div>
                                    <div className="col-span-3 ">
                                        <div className="my-4 font-semibold grid grid-cols-2">
                                            <h3 className="col-span-1 text-[13px]">
                                                {props.dataLang
                                                    ?.purchase_status ||
                                                    "purchase_status"}
                                            </h3>
                                            <h3 className="col-span-1 text-[13px]">
                                                {data?.status == "1" ? (
                                                    <div className="border border-lime-500 px-2 py-1 rounded text-lime-500 font-normal flex justify-center  items-center gap-1">
                                                        {props.dataLang
                                                            ?.purchase_approved ||
                                                            "purchase_approved"}{" "}
                                                        <TickCircle
                                                            className="bg-lime-500 rounded-full"
                                                            color="white"
                                                            size={19}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="border border-red-500 px-2 py-1 rounded text-red-500  font-normal flex justify-center items-center gap-1">
                                                        {props.dataLang
                                                            ?.purchase_notapproved ||
                                                            "purchase_notapproved"}{" "}
                                                        <TickCircle size={22} />
                                                    </div>
                                                )}
                                            </h3>
                                        </div>
                                        {/* <div className='my-4 font-medium grid grid-cols-2'>Tổng số lượng</div> */}
                                        <div className="my-4 font-semibold grid grid-cols-2">
                                            <h3 className="col-span-1 text-[13px]">
                                                {props.dataLang
                                                    ?.purchase_propnent ||
                                                    "purchase_propnent"}
                                            </h3>
                                            {/* <h3 className="col-span-1 text-[13px] font-normal">
                                                {data?.user_create_name}
                                            </h3> */}
                                            <div className="flex items-center gap-2">
                                                <div className="relative">
                                                    <ImageErrors
                                                        src={
                                                            data?.profile_image
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
                                                    {data?.user_create_name}
                                                </h6>
                                            </div>
                                        </div>
                                        <div className="my-4 font-semibold grid grid-cols-2">
                                            <h3 className="col-span-1 text-[13px]">
                                                {props.dataLang
                                                    ?.purchase_branch ||
                                                    "purchase_branch"}
                                            </h3>
                                            <h3 className="3xl:items-center 3xl-text-[16px] w-fit 2xl:text-[13px] xl:text-xs text-[8px] text-[#0F4F9E] font-[300] px-2 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">
                                                {data?.branch_name}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="pr-2 w-[100%] lx:w-[110%] ">
                                    <div className="grid grid-cols-8 sticky top-0 bg-white  p-2 z-10 rounded shadow-md  ">
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                            {props.dataLang?.purchase_image ||
                                                "purchase_image"}
                                        </h4>
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                            {props.dataLang?.purchase_items ||
                                                "purchase_items"}
                                        </h4>
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                            {props.dataLang?.purchase_variant ||
                                                "purchase_variant"}
                                        </h4>
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                            {props.dataLang?.purchase_unit ||
                                                "purchase_unit"}
                                        </h4>
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                            {props.dataLang
                                                ?.purchase_quantity ||
                                                "purchase_quantity"}
                                        </h4>
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                            {/* {props.dataLang?.purchase_quantity_purchased ||
                          "purchase_quantity_purchased"} */}
                                            {"SL đã mua"}
                                        </h4>
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                            {/* {props.dataLang?.purchase_reaining_amout ||
                          "purchase_reaining_amout"} */}
                                            {"SL còn lại"}
                                        </h4>
                                        <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                            {props.dataLang?.purchase_note ||
                                                "purchase_note"}
                                        </h4>
                                    </div>
                                    {onFetching ? (
                                        <Loading
                                            className="max-h-28"
                                            color="#0f4f9e"
                                        />
                                    ) : data?.items?.length > 0 ? (
                                        <>
                                            <ScrollArea
                                                className="min-h-[90px] max-h-[200px] 2xl:max-h-[166px] overflow-hidden"
                                                speed={1}
                                                smoothScrolling={true}
                                            >
                                                <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">
                                                    {data?.items?.map((e) => (
                                                        <div
                                                            className="grid items-center grid-cols-8 py-1.5 px-2 hover:bg-slate-100/40 "
                                                            key={e.id.toString()}
                                                        >
                                                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-center mx-auto">
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
                                                                        className="object-cover rounded w-[50px] h-[60px]"
                                                                    />
                                                                ) : (
                                                                    <div className="w-[50px] h-[60px] object-cover  flex items-center justify-center rounded">
                                                                        {/* <IconImage/> */}
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

                                                            <h6 className="text-[13px] font-medium  px-2 py-0.5 col-span-1 text-left">
                                                                {e?.item?.name}
                                                            </h6>
                                                            <h6 className="text-[13px] font-medium  px-2 py-0.5 col-span-1 text-center break-words">
                                                                {
                                                                    e?.item
                                                                        ?.product_variation
                                                                }
                                                            </h6>
                                                            <h6 className="text-[13px] font-medium  px-2 py-0.5 col-span-1 text-center break-words">
                                                                {
                                                                    e?.item
                                                                        ?.unit_name
                                                                }
                                                            </h6>
                                                            <h6 className="text-[13px] font-medium  px-2 py-0.5 col-span-1 text-center">
                                                                {formatNumber(
                                                                    e?.quantity
                                                                )}
                                                            </h6>
                                                            <h6 className="text-[13px] font-medium  px-2 py-0.5 col-span-1 text-center">
                                                                {formatNumber(
                                                                    e?.quantity_create
                                                                )}
                                                            </h6>
                                                            <h6 className="text-[13px] font-medium  px-2 py-0.5 col-span-1 text-center">
                                                                {Number(
                                                                    e?.quantity_left
                                                                ) < 0
                                                                    ? "Đặt dư" +
                                                                      " " +
                                                                      formatNumber(
                                                                          Number(
                                                                              Math.abs(
                                                                                  e?.quantity_left
                                                                              )
                                                                          )
                                                                      )
                                                                    : formatNumber(
                                                                          e?.quantity_left
                                                                      )}
                                                            </h6>
                                                            <h6 className="text-[13px] font-medium  px-2 py-0.5 col-span-1 text-left">
                                                                <ExpandableContent
                                                                    content={
                                                                        e?.note
                                                                    }
                                                                />
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
                                                    Không tìm thấy các mục
                                                </h1>
                                                <div className="flex items-center justify-around mt-6 ">
                                                    {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <h2 className="font-medium p-2  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5] text-[13px]">
                                    {props.dataLang?.purchase_total ||
                                        "purchase_total"}
                                </h2>
                                <div className=" mt-5  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10">
                                    <div className="col-span-9">
                                        <h3 className="text-[13px] p-1 font-medium">
                                            {props.dataLang?.purchase_note ||
                                                "import_from_note"}
                                        </h3>
                                        <textarea
                                            className="resize-none text-[13px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 placeholder:text-slate-300 w-[90%] min-h-[70px]  max-h-[70px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1 outline-none "
                                            disabled
                                            value={data?.note}
                                        />
                                    </div>
                                    <div className="col-span-3 space-y-2">
                                        <div className="flex justify-between ">
                                            <div className="font-normal text-[13px]">
                                                <h3 className="font-medium">
                                                    {props.dataLang
                                                        ?.purchase_totalCount ||
                                                        "purchase_totalCount"}
                                                </h3>
                                            </div>
                                            <div className="font-normal text-[13px]">
                                                <h3 className="text-blue-600">
                                                    {formatNumber(
                                                        totalQuantity
                                                    )}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="flex justify-between ">
                                            <div className="font-normal text-[13px]">
                                                <h3 className="font-medium">
                                                    {props.dataLang
                                                        ?.purchase_totalItem ||
                                                        "purchase_totalItem"}
                                                </h3>
                                            </div>
                                            <div className="font-normal text-[13px]">
                                                <h3 className="text-blue-600">
                                                    {formatNumber(
                                                        data?.items?.length
                                                    )}
                                                </h3>
                                            </div>
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
