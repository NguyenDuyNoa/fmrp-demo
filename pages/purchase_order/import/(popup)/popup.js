import React, { useRef, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import ModalImage from "react-modal-image";
import "react-datepicker/dist/react-datepicker.css";

import {
    Grid6 as IconExcel,
    Filter as IconFilter,
    Calendar as IconCalendar,
    SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    TickCircle,
} from "iconsax-react";

import "react-datepicker/dist/react-datepicker.css";

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
const Popup_chitiet = (props) => {
    const scrollAreaRef = useRef(null);
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const [data, sData] = useState();
    const [onFetching, sOnFetching] = useState(false);

    useEffect(() => {
        props?.id && sOnFetching(true);
    }, [open]);

    const formatNumber = (number) => {
        if (!number && number !== 0) return 0;
        const integerPart = Math.floor(number);
        const decimalPart = number - integerPart;
        const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
        const roundedNumber = integerPart + roundedDecimalPart;
        return roundedNumber.toLocaleString("en");
    };

    const _ServerFetching_detailOrder = () => {
        Axios(
            "GET",
            `/api_web/Api_import/import/${props?.id}?csrf_protection=true`,
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
        (onFetching && _ServerFetching_detailOrder()) ||
            (onFetching && _ServerFetching());
    }, [open]);

    // const scrollableDiv = document.querySelector('.customsroll');
    // scrollableDiv?.addEventListener('wheel', (event) => {
    //   const deltaY = event.deltaY;
    //   const top = scrollableDiv.scrollTop;
    //   const height = scrollableDiv.scrollHeight;
    //   const offset = scrollableDiv.offsetHeight;
    //   const isScrolledToTop = top === 0;
    //   const isScrolledToBottom = top === height - offset;

    //   if ((deltaY < 0 && isScrolledToTop) || (deltaY > 0 && isScrolledToBottom)) {
    //     event.preventDefault();
    //   }
    // });

    const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});
    const [dataProductExpiry, sDataProductExpiry] = useState({});
    const [dataProductSerial, sDataProductSerial] = useState({});

    const _ServerFetching = () => {
        Axios(
            "GET",
            "/api_web/api_setting/feature/?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    var data = response.data;
                    sDataMaterialExpiry(
                        data.find((x) => x.code == "material_expiry")
                    );
                    sDataProductExpiry(
                        data.find((x) => x.code == "product_expiry")
                    );
                    sDataProductSerial(
                        data.find((x) => x.code == "product_serial")
                    );
                }
                sOnFetching(false);
            }
        );
    };

    return (
        <>
            <PopupEdit
                title={
                    props.dataLang?.import_detail_title || "import_detail_title"
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
                <div className=" space-x-5 3xl:w-[1250px] 2xl:w-[1100px] w-[1050px] 3xl:h-auto  2xl:h-auto xl:h-[540px] h-[500px] ">
                    <div>
                        <div className="3xl:w-[1250px] 2xl:w-[1100px] w-[1050px]">
                            <div className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                <h2 className="font-normal bg-[#ECF0F4] p-2 text-[13px]">
                                    {props.dataLang?.import_detail_info ||
                                        "import_detail_info"}
                                </h2>
                                <div className="grid grid-cols-9  min-h-[130px] px-2">
                                    <div className="col-span-3">
                                        <div className="my-4 font-semibold grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang
                                                    ?.import_day_vouchers ||
                                                    "import_day_vouchers"}
                                            </h3>
                                            <h3 className=" text-[13px]  font-medium">
                                                {data?.date != null
                                                    ? moment(data?.date).format(
                                                          "DD/MM/YYYY, HH:mm:ss"
                                                      )
                                                    : ""}
                                            </h3>
                                        </div>
                                        <div className="my-4 font-semibold grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang
                                                    ?.import_code_vouchers ||
                                                    "import_code_vouchers"}
                                            </h3>
                                            <h3 className=" text-[13px]  font-medium text-blue-600">
                                                {data?.code}
                                            </h3>
                                        </div>
                                        <div className="my-4 font-semibold grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang
                                                    ?.import_the_order ||
                                                    "import_the_order"}
                                            </h3>
                                            <h3 className=" text-[13px]  text-center font-medium text-lime-500  rounded-xl py-1 px-3 max-w-[100px] min-w-[70px]  bg-lime-200 ">
                                                {data?.purchase_order_code}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="col-span-3">
                                        <div className="my-4 font-medium grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang
                                                    ?.import_payment_status ||
                                                    "import_payment_status"}
                                            </h3>
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
                                        <div className="my-4 font-medium grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang
                                                    ?.import_from_browse ||
                                                    "import_from_browse"}
                                            </h3>
                                            <div className="flex flex-wrap  gap-2 items-center justify-center">
                                                {(data?.warehouseman_id ===
                                                    "0" && (
                                                    <span className=" font-normal text-[#3b82f6]  rounded-xl py-1 px-2 min-w-[135px]  bg-[#bfdbfe] text-center text-[13px]">
                                                        {"Chưa duyệt kho"}
                                                    </span>
                                                )) ||
                                                    (data?.warehouseman_id !=
                                                        "0" && (
                                                        <span className="flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 min-w-[135px]  bg-lime-200 text-center text-[13px]">
                                                            <TickCircle
                                                                className="bg-lime-500 rounded-full"
                                                                color="white"
                                                                size={15}
                                                            />
                                                            {"Đã duyệt kho"}
                                                        </span>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-3 ">
                                        <div className="my-4 font-medium grid grid-cols-2">
                                            <h3 className="text-[13px]">
                                                {props.dataLang
                                                    ?.import_supplier ||
                                                    "import_supplier"}
                                            </h3>
                                            <h3 className="text-[13px] font-normal">
                                                {data?.supplier_name}
                                            </h3>
                                        </div>
                                        <div className="my-2 font-medium grid grid-cols-2">
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
                                        <div className="my-4 font-medium grid grid-cols-2">
                                            <h3 className="text-[13px]">
                                                {props.dataLang
                                                    ?.import_branch ||
                                                    "import_branch"}
                                            </h3>
                                            <h3 className="3xl:items-center 3xl-text-[16px] 2xl:text-[13px] xl:text-xs text-[8px] text-[#0F4F9E] font-[300] px-2 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase w-fit">
                                                {data?.branch_name}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="pr-2 w-[100%] lx:w-[110%] ">
                                    {/* <div className={`${dataProductSerial.is_enable == "1" ? 
                      (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-12" :dataMaterialExpiry.is_enable == "1" ? "grid-cols-12" :"grid-cols-10" ) :
                       (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-11" : (dataMaterialExpiry.is_enable == "1" ? "grid-cols-11" :"grid-cols-9") ) }  grid sticky top-0 bg-white shadow-lg  z-10`}> */}
                                    <div
                                        className={`grid-cols-13  grid sticky top-0 bg-white shadow-lg  z-10`}
                                    >
                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                            {props.dataLang
                                                ?.import_detail_image ||
                                                "import_detail_image"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-2 text-center whitespace-nowrap">
                                            {props.dataLang
                                                ?.import_detail_items ||
                                                "import_detail_items"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                            {props.dataLang
                                                ?.import_detail_variant ||
                                                "import_detail_variant"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                            {"Kho - VTK"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                            {"ĐVT"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                            {props.dataLang
                                                ?.import_from_quantity ||
                                                "import_from_quantity"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                            {props.dataLang
                                                ?.import_from_unit_price ||
                                                "import_from_unit_price"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                            {"% CK"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                            {props.dataLang
                                                ?.import_from_price_affter ||
                                                "import_from_price_affter"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                            {props.dataLang?.import_from_tax ||
                                                "import_from_tax"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                            {props.dataLang
                                                ?.import_into_money ||
                                                "import_into_money"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                            {props.dataLang?.import_from_note ||
                                                "import_from_note"}
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
                                                className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px] overflow-hidden"
                                                speed={1}
                                                smoothScrolling={true}
                                            >
                                                <div className="divide-y divide-slate-200 min:h-[170px]  max:h-[170px]">
                                                    {data?.items?.map((e) => (
                                                        // <div className={`${dataProductSerial.is_enable == "1" ?
                                                        // (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-12" :dataMaterialExpiry.is_enable == "1" ? "grid-cols-12" :"grid-cols-10" ) :
                                                        // (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-11" : (dataMaterialExpiry.is_enable == "1" ? "grid-cols-11" :"grid-cols-9") ) }  grid hover:bg-slate-50 `} key={e.id?.toString()}>
                                                        <div
                                                            className="grid grid-cols-13 hover:bg-slate-50 items-center border-b"
                                                            key={e.id?.toString()}
                                                        >
                                                            <h6 className="text-[13px]   py-0.5 col-span-1 text-center">
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
                                                                        className="custom-modal-image object-cover rounded w-[50px] h-[60px] mx-auto"
                                                                    />
                                                                ) : (
                                                                    <div className="w-[50px] h-[60px] object-cover  mx-auto">
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
                                                            <h6 className="text-[13px]  px-2 py-0.5 col-span-2 text-left">
                                                                <h6 className="font-medium">
                                                                    {
                                                                        e?.item
                                                                            ?.name
                                                                    }
                                                                </h6>
                                                                <div className="flex-col items-center font-oblique flex-wrap">
                                                                    {dataProductSerial.is_enable ===
                                                                    "1" ? (
                                                                        <div className="flex gap-0.5">
                                                                            <h6 className="text-[12px]">
                                                                                Serial:
                                                                            </h6>
                                                                            <h6 className="text-[12px]  px-2   w-[full] text-left ">
                                                                                {e.serial ==
                                                                                    null ||
                                                                                e.serial ==
                                                                                    ""
                                                                                    ? "-"
                                                                                    : e.serial}
                                                                            </h6>
                                                                        </div>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                    {dataMaterialExpiry.is_enable ===
                                                                        "1" ||
                                                                    dataProductExpiry.is_enable ===
                                                                        "1" ? (
                                                                        <>
                                                                            <div className="flex gap-0.5">
                                                                                <h6 className="text-[12px]">
                                                                                    Lot:
                                                                                </h6>{" "}
                                                                                <h6 className="text-[12px]  px-2   w-[full] text-left ">
                                                                                    {e.lot ==
                                                                                        null ||
                                                                                    e.lot ==
                                                                                        ""
                                                                                        ? "-"
                                                                                        : e.lot}
                                                                                </h6>
                                                                            </div>
                                                                            <div className="flex gap-0.5">
                                                                                <h6 className="text-[12px]">
                                                                                    Hạn
                                                                                    sử
                                                                                    dụng:
                                                                                </h6>{" "}
                                                                                <h6 className="text-[12px]  px-2   w-[full] text-center ">
                                                                                    {e.expiration_date
                                                                                        ? moment(
                                                                                              e.expiration_date
                                                                                          ).format(
                                                                                              "DD/MM/YYYY"
                                                                                          )
                                                                                        : "-"}
                                                                                </h6>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </div>
                                                            </h6>
                                                            <h6 className="text-[13px] font-medium   px-2 py-0.5 col-span-1 text-left break-words">
                                                                {
                                                                    e?.item
                                                                        ?.product_variation
                                                                }
                                                            </h6>
                                                            <h6 className="text-[13px] font-medium   px-2 py-0.5 col-span-1 text-left break-words">{`${e?.warehouse_name}-${e.location_name}`}</h6>
                                                            <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center break-words">
                                                                {
                                                                    e?.item
                                                                        ?.unit_name
                                                                }
                                                            </h6>
                                                            <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center mr-1">
                                                                {formatNumber(
                                                                    e?.quantity
                                                                )}
                                                            </h6>
                                                            <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center">
                                                                {formatNumber(
                                                                    e?.price
                                                                )}
                                                            </h6>
                                                            <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center">
                                                                {e?.discount_percent +
                                                                    "%"}
                                                            </h6>
                                                            <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center">
                                                                {formatNumber(
                                                                    e?.price_after_discount
                                                                )}
                                                            </h6>
                                                            <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center">
                                                                {formatNumber(
                                                                    e?.tax_rate
                                                                ) + "%"}
                                                            </h6>
                                                            <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-right ">
                                                                {formatNumber(
                                                                    e?.amount
                                                                )}
                                                            </h6>
                                                            <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-left ml-3.5">
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
                                                <div className="flex items-center justify-around mt-6 ">
                                                    {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                                                </div>
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
                                        <h3 className="text-[13px] p-1 font-semibold">
                                            {props.dataLang?.import_from_note ||
                                                "import_from_note"}
                                        </h3>
                                        <textarea
                                            className="resize-none text-[13px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 placeholder:text-slate-300 w-[90%] min-h-[90px] max-h-[90px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-medium p-1 outline-none "
                                            disabled
                                            value={data?.note}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-1 text-right">
                                        <div className="font-semibold text-left text-[13px]">
                                            <h3>
                                                {props.dataLang
                                                    ?.import_detail_total_amount ||
                                                    "import_detail_total_amount"}
                                            </h3>
                                        </div>
                                        <div className="font-semibold text-left text-[13px]">
                                            <h3>
                                                {props.dataLang
                                                    ?.import_detail_discount ||
                                                    "import_detail_discount"}
                                            </h3>
                                        </div>
                                        <div className="font-semibold text-left text-[13px]">
                                            <h3>
                                                {props.dataLang
                                                    ?.import_detail_affter_discount ||
                                                    "import_detail_affter_discount"}
                                            </h3>
                                        </div>
                                        <div className="font-semibold text-left text-[13px]">
                                            <h3>
                                                {props.dataLang
                                                    ?.import_detail_tax_money ||
                                                    "import_detail_tax_money"}
                                            </h3>
                                        </div>
                                        <div className="font-semibold text-left text-[13px]">
                                            <h3>
                                                {props.dataLang
                                                    ?.import_detail_into_money ||
                                                    "import_detail_into_money"}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-span-3 space-y-1 text-right">
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
                                                {formatNumber(data?.total_tax)}
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
