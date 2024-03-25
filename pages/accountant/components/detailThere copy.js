import dynamic from "next/dynamic";
import moment from "moment/moment";
import ModalImage from "react-modal-image";
import React, { useEffect, useState } from "react";

import {
    Edit as IconEdit,
    Grid6 as IconExcel,
    ArrowDown2 as IconDown,
    TickCircle,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    Add as IconAdd,
} from "iconsax-react";

import { _ServerInstance as Axios } from "/services/axios";

const ScrollArea = dynamic(() => import("react-scrollbar"), { ssr: false });

import PopupEdit from "@/components/UI/popup";
import Loading from "@/components/UI/loading";
import ExpandableContent from "@/components/UI/more";
import ImageErrors from "@/components/UI/imageErrors";

import { useToggle } from "@/hooks/useToggle";
import { useSetData } from "@/hooks/useSetData";

const Popup_chitietThere = (props) => {
    const { isOpen, handleOpen } = useToggle();

    const { isData: data, updateData } = useSetData();

    const [dataProductExpiry, sDataProductExpiry] = useState({});

    const [dataProductSerial, sDataProductSerial] = useState({});

    const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});

    const [onFetching, sOnFetching] = useState(false);

    useEffect(() => {
        props?.id && sOnFetching(true);
    }, [isOpen]);

    const formatNumber = (number) => {
        if (!number && number !== 0) return 0;
        const integerPart = Math.floor(number);
        const decimalPart = number - integerPart;
        const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
        const roundedNumber = integerPart + roundedDecimalPart;
        return roundedNumber.toLocaleString("en");
    };

    const api = {
        import: `/api_web/Api_import/import/${props?.id}?csrf_protection=true`,
        service: `/api_web/Api_service/service/${props?.id}?csrf_protection=true`,
        deposit: `/api_web/Api_purchase_order/purchase_order/${props?.id}?csrf_protection=true`,
        1: `/api_web/Api_purchases/purchases/${props?.id}?csrf_protection=true`,
        typePo: `/api_web/Api_purchase_order/purchase_order/${props?.id}?csrf_protection=true`,
        order: `/api_web/Api_sale_order/saleOrder/${props?.id}?csrf_protection=true`,
    };

    const _ServerFetching_detailThere = () => {
        Axios("GET", `${api[props?.type]}`, {}, (err, response) => {
            if (!err) {
                let db = response?.data;
                updateData(db);
            }
            sOnFetching(false);
        });
    };

    useEffect(() => {
        (onFetching && _ServerFetching_detailThere()) || (onFetching && _ServerFetching());
    }, [isOpen]);

    const _ServerFetching = () => {
        Axios("GET", "/api_web/api_setting/feature/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var data = response.data;
                sDataMaterialExpiry(data.find((x) => x.code == "material_expiry"));
                sDataProductExpiry(data.find((x) => x.code == "product_expiry"));
                sDataProductSerial(data.find((x) => x.code == "product_serial"));
            }
            sOnFetching(false);
        });
    };

    let listQty = data?.items;

    let totalQuantity = 0;

    for (let i = 0; i < listQty?.length; i++) {
        totalQuantity += parseInt(listQty[i].quantity);
    }

    const checkKeys = {
        import: props.dataLang?.import_detail_title || "import_detail_title",
        service: props.dataLang?.serviceVoucher_service_voucher_details || "serviceVoucher_service_voucher_details",
        deposit: props.dataLang?.purchase_order_detail_title || "purchase_order_detail_title",
        1: props.dataLang?.purchase_detail_title || "purchase_detail_title",
        typePo: props.dataLang?.purchase_order_detail_title || "purchase_order_detail_title",
        order: props.dataLang?.sales_product_popup_detail_title || "sales_product_popup_detail_title",
    };

    return (
        <>
            <PopupEdit
                title={checkKeys[props.type]}
                button={props?.name}
                onClickOpen={() => handleOpen(true)}
                open={isOpen}
                onClose={() => handleOpen(false)}
                classNameBtn={props?.className}
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                {(props?.type == "import" && (
                    <div className=" space-x-5 3xl:w-[1250px] 2xl:w-[1100px] w-[1050px] 3xl:h-auto  2xl:h-auto xl:h-[640px] h-[600px] ">
                        <div>
                            <div className="3xl:w-[1250px] 2xl:w-[1100px] w-[1050px]">
                                <div className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <h2 className="font-normal bg-[#ECF0F4] p-2 text-[13px]">
                                        {props.dataLang?.import_detail_info || "import_detail_info"}
                                    </h2>
                                    <div className="grid grid-cols-9  min-h-[130px] px-2">
                                        <div className="col-span-3">
                                            <div className="my-4 font-semibold grid grid-cols-2">
                                                <h3 className=" text-[13px] ">
                                                    {props.dataLang?.import_day_vouchers || "import_day_vouchers"}
                                                </h3>
                                                <h3 className=" text-[13px]  font-medium">
                                                    {data?.date != null
                                                        ? moment(data?.date).format("DD/MM/YYYY, HH:mm:ss")
                                                        : ""}
                                                </h3>
                                            </div>
                                            <div className="my-4 font-semibold grid grid-cols-2">
                                                <h3 className=" text-[13px] ">
                                                    {props.dataLang?.import_code_vouchers || "import_code_vouchers"}
                                                </h3>
                                                <h3 className=" text-[13px]  font-medium text-blue-600">
                                                    {data?.code}
                                                </h3>
                                            </div>
                                            <div className="my-4 font-semibold grid grid-cols-2">
                                                <h3 className=" text-[13px] ">
                                                    {props.dataLang?.import_the_order || "import_the_order"}
                                                </h3>
                                                <h3 className=" text-[13px]  text-center font-medium text-lime-500  rounded-xl py-1 px-3 max-w-[100px] min-w-[70px]  bg-lime-200 ">
                                                    {data?.purchase_order_code}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="col-span-3">
                                            <div className="my-4 font-medium grid grid-cols-2">
                                                <h3 className=" text-[13px] ">
                                                    {props.dataLang?.import_payment_status || "import_payment_status"}
                                                </h3>
                                                <div className="flex flex-wrap  gap-2 items-center justify-center">
                                                    {(data?.status_pay === "not_spent" && (
                                                        <span className=" font-normal text-sky-500  rounded-xl py-1 px-2 min-w-[135px]  bg-sky-200 text-center text-[13px]">
                                                            {"Chưa chi"}
                                                        </span>
                                                    )) ||
                                                        (data?.status_pay === "spent_part" && (
                                                            <span className=" font-normal text-orange-500 rounded-xl py-1 px-2 min-w-[135px]  bg-orange-200 text-center text-[13px]">
                                                                {"Chi 1 phần"} {`(${formatNumber(data?.amount_paid)})`}
                                                            </span>
                                                        )) ||
                                                        (data?.status_pay === "spent" && (
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
                                                    {props.dataLang?.import_from_browse || "import_from_browse"}
                                                </h3>
                                                <div className="flex flex-wrap  gap-2 items-center justify-center">
                                                    {(data?.warehouseman_id === "0" && (
                                                        <span className=" font-normal text-[#3b82f6]  rounded-xl py-1 px-2 min-w-[135px]  bg-[#bfdbfe] text-center text-[13px]">
                                                            {"Chưa duyệt kho"}
                                                        </span>
                                                    )) ||
                                                        (data?.warehouseman_id != "0" && (
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
                                                    {props.dataLang?.import_supplier || "import_supplier"}
                                                </h3>
                                                <h3 className="text-[13px] font-normal">{data?.supplier_name}</h3>
                                            </div>
                                            <div className="grid grid-cols-2 col-span-2">
                                                <h3 className="col-span-1 text-[13px] font-medium">
                                                    {props.dataLang?.production_warehouse_creator ||
                                                        "production_warehouse_creator"}
                                                </h3>
                                                {/* <h3 className="col-span-1 text-[13px] font-normal">
                                                {data?.user_create_name}
                                            </h3> */}
                                                <div className="flex items-center gap-2">
                                                    <div className="relative">
                                                        <ImageErrors
                                                            src={data?.staff_create?.profile_image}
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
                                                    <h6 className="capitalize">{data?.staff_create?.full_name}</h6>
                                                </div>{" "}
                                            </div>
                                            <div className="my-4 font-medium grid grid-cols-2">
                                                <h3 className="text-[13px]">
                                                    {props.dataLang?.import_branch || "import_branch"}
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
                                        <div className={`grid-cols-13  grid sticky top-0 bg-white shadow-lg  z-10`}>
                                            <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                                {props.dataLang?.import_detail_image || "import_detail_image"}
                                            </h4>
                                            <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-2 text-center whitespace-nowrap">
                                                {props.dataLang?.import_detail_items || "import_detail_items"}
                                            </h4>
                                            <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                                {props.dataLang?.import_detail_variant || "import_detail_variant"}
                                            </h4>
                                            <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                                {"Kho - VTK"}
                                            </h4>
                                            <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                                {"ĐVT"}
                                            </h4>
                                            <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                                {props.dataLang?.import_from_quantity || "import_from_quantity"}
                                            </h4>
                                            <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                                {props.dataLang?.import_from_unit_price || "import_from_unit_price"}
                                            </h4>
                                            <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                                {"% CK"}
                                            </h4>
                                            <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                                {props.dataLang?.import_from_price_affter || "import_from_price_affter"}
                                            </h4>
                                            <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                                {props.dataLang?.import_from_tax || "import_from_tax"}
                                            </h4>
                                            <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                                {props.dataLang?.import_into_money || "import_into_money"}
                                            </h4>
                                            <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                                {props.dataLang?.import_from_note || "import_from_note"}
                                            </h4>
                                        </div>
                                        {onFetching ? (
                                            <Loading className="max-h-28" color="#0f4f9e" />
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
                                                                    {e?.item?.images != null ? (
                                                                        <ModalImage
                                                                            small={e?.item?.images}
                                                                            large={e?.item?.images}
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
                                                                    <h6 className="font-medium">{e?.item?.name}</h6>
                                                                    <div className="flex-col items-center font-oblique flex-wrap">
                                                                        {dataProductSerial.is_enable === "1" ? (
                                                                            <div className="flex gap-0.5">
                                                                                <h6 className="text-[12px]">Serial:</h6>
                                                                                <h6 className="text-[12px]  px-2   w-[full] text-left ">
                                                                                    {e.serial == null || e.serial == ""
                                                                                        ? "-"
                                                                                        : e.serial}
                                                                                </h6>
                                                                            </div>
                                                                        ) : (
                                                                            ""
                                                                        )}
                                                                        {dataMaterialExpiry.is_enable === "1" ||
                                                                            dataProductExpiry.is_enable === "1" ? (
                                                                            <>
                                                                                <div className="flex gap-0.5">
                                                                                    <h6 className="text-[12px]">
                                                                                        Lot:
                                                                                    </h6>{" "}
                                                                                    <h6 className="text-[12px]  px-2   w-[full] text-left ">
                                                                                        {e.lot == null || e.lot == ""
                                                                                            ? "-"
                                                                                            : e.lot}
                                                                                    </h6>
                                                                                </div>
                                                                                <div className="flex gap-0.5">
                                                                                    <h6 className="text-[12px]">
                                                                                        Hạn sử dụng:
                                                                                    </h6>{" "}
                                                                                    <h6 className="text-[12px]  px-2   w-[full] text-center ">
                                                                                        {e.expiration_date
                                                                                            ? moment(
                                                                                                e.expiration_date
                                                                                            ).format("DD/MM/YYYY")
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
                                                                    {e?.item?.product_variation}
                                                                </h6>
                                                                <h6 className="text-[13px] font-medium   px-2 py-0.5 col-span-1 text-left break-words">{`${e?.warehouse_name}-${e.location_name}`}</h6>
                                                                <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center break-words">
                                                                    {e?.item?.unit_name}
                                                                </h6>
                                                                <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center mr-1">
                                                                    {formatNumber(e?.quantity)}
                                                                </h6>
                                                                <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center">
                                                                    {formatNumber(e?.price)}
                                                                </h6>
                                                                <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center">
                                                                    {e?.discount_percent + "%"}
                                                                </h6>
                                                                <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center">
                                                                    {formatNumber(e?.price_after_discount)}
                                                                </h6>
                                                                <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center">
                                                                    {formatNumber(e?.tax_rate) + "%"}
                                                                </h6>
                                                                <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-right ">
                                                                    {formatNumber(e?.amount)}
                                                                </h6>
                                                                <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-left ml-3.5">
                                                                    {e?.note != undefined ? (
                                                                        <ExpandableContent content={e?.note} />
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
                                                        {props.dataLang?.purchase_order_table_item_not_found ||
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
                                        {props.dataLang?.purchase_total || "purchase_total"}
                                    </h2>
                                    <div className=" mt-2  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
                                        <div className="col-span-7">
                                            <h3 className="text-[13px] p-1 font-semibold">
                                                {props.dataLang?.import_from_note || "import_from_note"}
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
                                                    {props.dataLang?.import_detail_total_amount ||
                                                        "import_detail_total_amount"}
                                                </h3>
                                            </div>
                                            <div className="font-semibold text-left text-[13px]">
                                                <h3>
                                                    {props.dataLang?.import_detail_discount || "import_detail_discount"}
                                                </h3>
                                            </div>
                                            <div className="font-semibold text-left text-[13px]">
                                                <h3>
                                                    {props.dataLang?.import_detail_affter_discount ||
                                                        "import_detail_affter_discount"}
                                                </h3>
                                            </div>
                                            <div className="font-semibold text-left text-[13px]">
                                                <h3>
                                                    {props.dataLang?.import_detail_tax_money ||
                                                        "import_detail_tax_money"}
                                                </h3>
                                            </div>
                                            <div className="font-semibold text-left text-[13px]">
                                                <h3>
                                                    {props.dataLang?.import_detail_into_money ||
                                                        "import_detail_into_money"}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="col-span-3 space-y-1 text-right">
                                            <div className="font-medium mr-2.5">
                                                <h3 className="text-right text-blue-600 text-[13px]">
                                                    {formatNumber(data?.total_price)}
                                                </h3>
                                            </div>
                                            <div className="font-medium mr-2.5">
                                                <h3 className="text-right text-blue-600 text-[13px]">
                                                    {formatNumber(data?.total_discount)}
                                                </h3>
                                            </div>
                                            <div className="font-medium mr-2.5">
                                                <h3 className="text-right text-blue-600 text-[13px]">
                                                    {formatNumber(data?.total_price_after_discount)}
                                                </h3>
                                            </div>
                                            <div className="font-medium mr-2.5">
                                                <h3 className="text-right text-blue-600 text-[13px]">
                                                    {formatNumber(data?.total_tax)}
                                                </h3>
                                            </div>
                                            <div className="font-medium mr-2.5">
                                                <h3 className="text-right text-blue-600 text-[13px]">
                                                    {formatNumber(data?.total_amount)}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )) ||
                    (props?.type == "service" && (
                        <div className=" space-x-5 w-[1100px]  h-auto ">
                            <div>
                                <div className="w-[1100px]">
                                    <div className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                        <h2 className="font-medium bg-[#ECF0F4] p-2 text-[13px]">
                                            {props?.dataLang?.purchase_order_detail_general_informatione ||
                                                "purchase_order_detail_general_informatione"}
                                        </h2>
                                        <div className="grid grid-cols-8  min-h-[100px] px-2">
                                            <div className="col-span-3">
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props.dataLang?.serviceVoucher_day_vouchers ||
                                                            "serviceVoucher_day_vouchers"}
                                                    </h3>
                                                    <h3 className=" text-[13px]  font-medium">
                                                        {data?.date != null
                                                            ? moment(data?.date).format("DD/MM/YYYY")
                                                            : ""}
                                                    </h3>
                                                </div>
                                                <div className="my-2 items-center font-medium grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props?.dataLang?.production_warehouse_creator ||
                                                            "production_warehouse_creator"}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative">
                                                            <ImageErrors
                                                                src={data?.staff_create?.profile_image}
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
                                                        <h6 className="capitalize">{data?.staff_create?.full_name}</h6>
                                                    </div>
                                                </div>{" "}
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props.dataLang?.serviceVoucher_voucher_code ||
                                                            "serviceVoucher_voucher_code"}
                                                    </h3>
                                                    <h3 className=" text-[13px]  font-medium text-blue-600">
                                                        {data?.code}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="col-span-2 mx-auto">
                                                <div className="my-4 font-semibold text-[13px]">
                                                    {props.dataLang?.serviceVoucher_status_of_spending ||
                                                        "serviceVoucher_status_of_spending"}
                                                </div>
                                                <div className="flex flex-wrap  gap-2 items-center justify-center">
                                                    {(data?.status_pay === "not_spent" && (
                                                        <span className=" font-normal text-sky-500  rounded-xl py-1 px-2 min-w-[135px]  bg-sky-200 text-center text-[13px]">
                                                            {"Chưa chi"}
                                                        </span>
                                                    )) ||
                                                        (data?.status_pay === "spent_part" && (
                                                            <span className=" font-normal text-orange-500 rounded-xl py-1 px-2 min-w-[135px]  bg-orange-200 text-center text-[13px]">
                                                                {"Chi 1 phần"} {`(${formatNumber(data?.amount_paid)})`}
                                                            </span>
                                                        )) ||
                                                        (data?.status_pay === "spent" && (
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
                                                {" "}
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="text-[13px] ">
                                                        {props.dataLang?.purchase_order_table_supplier ||
                                                            "purchase_order_table_supplier"}
                                                    </h3>
                                                    <h3 className="text-[13px] font-medium ">{data?.supplier_name}</h3>
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="text-[13px]">
                                                        {props.dataLang?.purchase_order_table_branch ||
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
                                                    {props.dataLang?.serviceVoucher_services_arising ||
                                                        "serviceVoucher_services_arising"}
                                                </h4>
                                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1  text-center">
                                                    {/* {props.dataLang?.serviceVoucher_quantity ||
                            "serviceVoucher_quantity"} */}
                                                    {"SL"}
                                                </h4>
                                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1  text-center">
                                                    {props.dataLang?.serviceVoucher_unit_price ||
                                                        "serviceVoucher_unit_price"}
                                                </h4>
                                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1  text-center">
                                                    {"% CK"}
                                                </h4>
                                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2  text-center">
                                                    {props.dataLang?.import_from_price_affter ||
                                                        "import_from_price_affter"}
                                                </h4>
                                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1  text-center">
                                                    {props.dataLang?.serviceVoucher_tax || "serviceVoucher_tax"}
                                                </h4>
                                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2  text-center">
                                                    {props.dataLang?.serviceVoucher_into_money ||
                                                        "serviceVoucher_into_money"}
                                                </h4>
                                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2  text-center">
                                                    {props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}
                                                </h4>
                                            </div>
                                            {onFetching ? (
                                                <Loading className="max-h-28" color="#0f4f9e" />
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
                                                                        {formatNumber(e?.quantity)}
                                                                    </h6>
                                                                    <h6 className="text-[13px]  px-2 py-0.5 col-span-1  font-medium text-center">
                                                                        {formatNumber(e?.price)}
                                                                    </h6>
                                                                    <h6 className="text-[13px]  px-2 py-0.5 col-span-1  font-medium text-center">
                                                                        {e?.discount_percent + "%"}
                                                                    </h6>
                                                                    <h6 className="text-[13px]  px-2 py-0.5 col-span-2  font-medium text-center">
                                                                        {formatNumber(e?.price_after_discount)}
                                                                    </h6>
                                                                    <h6 className="text-[13px]  px-2 py-0.5 col-span-1  font-medium text-center">
                                                                        {formatNumber(e?.tax_rate) + "%"}
                                                                    </h6>
                                                                    <h6 className="text-[13px]  px-2 py-0.5 col-span-2  font-medium text-right">
                                                                        {formatNumber(e?.amount)}
                                                                    </h6>
                                                                    <h6 className="text-[13px]  px-2 py-0.5 col-span-2  font-medium text-left">
                                                                        {e?.note != undefined ? (
                                                                            <ExpandableContent content={e?.note} />
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
                                                            {props.dataLang?.purchase_order_table_item_not_found ||
                                                                "purchase_order_table_item_not_found"}
                                                        </h1>
                                                        <div className="flex items-center justify-around mt-6 "></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <h2 className="font-medium p-2 text-[13px]  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]">
                                            {props.dataLang?.purchase_total || "purchase_total"}
                                        </h2>
                                        <div className=" mt-2  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
                                            <div className="col-span-7">
                                                <div>
                                                    <div className="text-[#344054] font-semibold 2xl:text-[12px] xl:text-[13px] text-[13px] mb-1 ">
                                                        {props.dataLang?.purchase_note || "purchase_note"}
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
                                                        {props.dataLang?.purchase_order_table_total ||
                                                            "purchase_order_table_total"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_discounty ||
                                                            "purchase_order_detail_discounty"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_money_after_discount ||
                                                            "purchase_order_detail_money_after_discount"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_tax_money ||
                                                            "purchase_order_detail_tax_money"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_into_money ||
                                                            "purchase_order_detail_into_money"}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="col-span-3 mt-2 space-y-2">
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatNumber(data?.total_price)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatNumber(data?.total_discount)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatNumber(data?.total_price_after_discount)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatNumber(data?.total_tax_price)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatNumber(data?.total_amount)}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) ||
                    (props?.type == "deposit" && (
                        <div className=" space-x-5 w-[1100px]  h-auto">
                            <div>
                                <div className="w-[1100px]">
                                    <div className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                        <h2 className="font-medium bg-[#ECF0F4] p-2 text-[13px]">
                                            {props?.dataLang?.purchase_order_detail_general_informatione ||
                                                "purchase_order_detail_general_informatione"}
                                        </h2>
                                        <div className="grid grid-cols-8  min-h-[170px] px-2">
                                            <div className="col-span-3">
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props.dataLang?.purchase_order_detail_day_vouchers ||
                                                            "purchase_order_detail_day_vouchers"}
                                                    </h3>
                                                    <h3 className=" text-[13px]  font-medium">
                                                        {data?.date != null
                                                            ? moment(data?.date).format("DD/MM/YYYY, HH:mm:ss")
                                                            : ""}
                                                    </h3>
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props.dataLang?.purchase_order_detail_delivery_date ||
                                                            "purchase_order_detail_delivery_date"}
                                                    </h3>
                                                    <h3 className=" text-[13px]  font-medium">
                                                        {data?.delivery_date != null
                                                            ? moment(data?.delivery_date).format("DD/MM/YYYY")
                                                            : ""}
                                                    </h3>
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props.dataLang?.purchase_order_detail_voucher_code ||
                                                            "purchase_order_detail_voucher_code"}
                                                    </h3>
                                                    <h3 className=" text-[13px]  font-medium text-blue-600">
                                                        {data?.code}
                                                    </h3>
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props.dataLang?.purchase_order_table_ordertype ||
                                                            "purchase_order_table_ordertype"}
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
                                                    {(data?.import_status === "not_stocked" && (
                                                        <span className="flex justify-center items-center font-normal 2xl:text-xs xl:text-xs text-[8px] text-sky-500  rounded-xl py-1 px-2  min-w-[100px] bg-sky-200">
                                                            {props.dataLang[data?.import_status] || data?.import_status}
                                                        </span>
                                                    )) ||
                                                        (data?.import_status === "stocked_part" && (
                                                            <span className="flex justify-center items-center font-normal 2xl:text-xs xl:text-xs text-[8px] text-orange-500 rounded-xl py-1 px-2  min-w-[100px] bg-orange-200">
                                                                {props.dataLang[data?.import_status] ||
                                                                    data?.import_status}
                                                            </span>
                                                        )) ||
                                                        (data?.import_status === "stocked" && (
                                                            <span className="flex justify-center 2xl:text-xs xl:text-xs text-[8px] items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2  min-w-[100px] bg-lime-200">
                                                                <TickCircle
                                                                    className="bg-lime-500 rounded-full "
                                                                    color="white"
                                                                    size={15}
                                                                />
                                                                {props.dataLang[data?.import_status] ||
                                                                    data?.import_status}
                                                            </span>
                                                        ))}
                                                </div>
                                                <div className="my-4 font-medium text-[13px]">
                                                    {props.dataLang?.purchase_order_table_number ||
                                                        "purchase_order_table_number"}
                                                </div>
                                                <div className="flex flex-wrap  gap-2 items-center justify-start text-[13px]">
                                                    {data?.purchases
                                                        ?.reduce((acc, cur) => acc + (acc ? ", " : "") + cur.code, "")
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
                                                        {props.dataLang?.purchase_order_table_supplier ||
                                                            "purchase_order_table_supplier"}
                                                    </h3>
                                                    <h3 className="text-[13px] font-medium">{data?.supplier_name}</h3>
                                                </div>
                                                <div className="grid grid-cols-2 col-span-2">
                                                    <h3 className="col-span-1 text-[13px] font-medium">
                                                        {props.dataLang?.production_warehouse_creator ||
                                                            "production_warehouse_creator"}
                                                    </h3>
                                                    {/* <h3 className="col-span-1 text-[13px] font-normal">
                                                {data?.user_create_name}
                                            </h3> */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative">
                                                            <ImageErrors
                                                                src={data?.staff_create?.profile_image}
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
                                                        <h6 className="capitalize">{data?.staff_create?.full_name}</h6>
                                                    </div>{" "}
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="text-[13px]">
                                                        {props.dataLang?.purchase_order_table_branch ||
                                                            "purchase_order_table_branch"}
                                                    </h3>
                                                    <h3 className="3xl:items-center 3xl-text-[16px] 2xl:text-[13px] xl:text-xs text-[8px] text-[#0F4F9E] font-[300] px-2 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase w-fit">
                                                        {data?.branch_name}
                                                    </h3>
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
                                                    {/* {props.dataLang?.purchase_quantity ||
                            "purchase_quantity"} */}
                                                    {"SL"}
                                                </h4>
                                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                                    {props.dataLang?.purchase_order_detail_unit_price ||
                                                        "purchase_order_detail_unit_price"}
                                                </h4>
                                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                                    {/* {props.dataLang?.purchase_order_detail_discount ||
                            "purchase_order_detail_discount"} */}
                                                    {"% ck"}
                                                </h4>
                                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center">
                                                    {/* {props.dataLang
                            ?.purchase_order_detail_after_discount ||
                            "purchase_order_detail_after_discount"} */}
                                                    {"Đơn giá SCK"}
                                                </h4>
                                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                                    {props.dataLang?.purchase_order_detail_tax ||
                                                        "purchase_order_detail_tax"}
                                                </h4>
                                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                                    {props.dataLang?.purchase_order_detail_into_money ||
                                                        "purchase_order_detail_into_money"}
                                                </h4>
                                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                                    {props.dataLang?.purchase_order_note || "purchase_order_note"}
                                                </h4>
                                            </div>
                                            {onFetching ? (
                                                <Loading className="max-h-28" color="#0f4f9e" />
                                            ) : data?.item?.length > 0 ? (
                                                <>
                                                    <ScrollArea
                                                        className="min-h-[90px] max-h-[100px] 2xl:max-h-[250px] overflow-hidden"
                                                        speed={1}
                                                        smoothScrolling={true}
                                                    >
                                                        <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">
                                                            {data?.item?.map((e) => (
                                                                <div
                                                                    className="grid items-center grid-cols-12 py-1.5 px-2 hover:bg-slate-100/40 "
                                                                    key={e.id?.toString()}
                                                                >
                                                                    <h6 className="text-[13px] mx-auto   py-0.5 col-span-1  rounded-md text-center">
                                                                        {e?.item?.images != null ? (
                                                                            <ModalImage
                                                                                small={e?.item?.images}
                                                                                large={e?.item?.images}
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
                                                                        {formatNumber(e?.price)}
                                                                    </h6>
                                                                    <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-center">
                                                                        {e?.discount_percent + "%"}
                                                                    </h6>
                                                                    <h6 className="text-[13px]   py-0.5 col-span-2  rounded-md text-center">
                                                                        {formatNumber(e?.price_after_discount)}
                                                                    </h6>
                                                                    <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-center ">
                                                                        {formatNumber(e?.tax_rate) + "%"}
                                                                    </h6>
                                                                    <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-right mr-3.5">
                                                                        {formatNumber(e?.amount)}
                                                                    </h6>

                                                                    <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-left ml-3.5 ">
                                                                        {e?.note != undefined ? (
                                                                            <ExpandableContent content={e?.note} />
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
                                                            {props.dataLang?.purchase_order_table_item_not_found ||
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
                                                        {props.dataLang?.purchase_order_table_total ||
                                                            "purchase_order_table_total"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_discounty ||
                                                            "purchase_order_detail_discounty"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_money_after_discount ||
                                                            "purchase_order_detail_money_after_discount"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_tax_money ||
                                                            "purchase_order_detail_tax_money"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_into_money ||
                                                            "purchase_order_detail_into_money"}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="col-span-3 space-y-2">
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatNumber(data?.total_price)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatNumber(data?.total_discount)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatNumber(data?.total_price_after_discount)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatNumber(data?.total_tax)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatNumber(data?.total_amount)}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) ||
                    (props?.type == "1" && (
                        <div className="mt-4 space-x-5 w-[1100px] h-auto ">
                            <div>
                                <div className="w-[1100px]">
                                    <div className="min:h-[170px] h-[72%] max:h-[100px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                        <h2 className="font-medium bg-[#ECF0F4] p-2 text-[13px]">
                                            {props?.dataLang?.purchase_general || "purchase_general"}
                                        </h2>
                                        <div className="grid grid-cols-8  min-h-[140px] p-2">
                                            <div className="col-span-3">
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="col-span-1 text-[13px]">
                                                        {props.dataLang?.purchase_day || "purchase_day"}
                                                    </h3>
                                                    <h3 className="col-span-1 font-medium text-[13px]">
                                                        {data?.date != null
                                                            ? moment(data?.date).format("DD/MM/YYYY")
                                                            : ""}
                                                    </h3>
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="col-span-1 text-[13px]">
                                                        {props.dataLang?.purchase_code || "purchase_code"}
                                                    </h3>
                                                    <h3 className="col-span-1 font-medium text-[13px] text-blue-600">
                                                        {data?.code}
                                                    </h3>
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="col-span-1 text-[13px]">
                                                        {props.dataLang?.purchase_planNumber || "purchase_planNumber"}
                                                    </h3>
                                                    <h3 className="col-span-1 font-medium text-[13px]">
                                                        {data?.reference_no}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div className="col-span-2 mx-auto">
                                                <div className="my-4 font-semibold text-[13px]">
                                                    {props.dataLang?.purchase_orderStatus || "purchase_orderStatus"}
                                                </div>
                                                <div className="flex flex-wrap  gap-2 items-center justify-start">
                                                    {(data?.order_status?.status === "purchase_ordered" && (
                                                        <span className="text-center font-normal text-sky-500  rounded-xl py-1 px-2 min-w-[135px] text-[13px]  bg-sky-200">
                                                            {props.dataLang[data?.order_status?.status]}
                                                        </span>
                                                    )) ||
                                                        (data?.order_status?.status === "purchase_portion" && (
                                                            <span className="text-center font-normal text-orange-500 rounded-xl py-1 px-2 min-w-[135px] text-[13px]  bg-orange-200">
                                                                {props.dataLang[data?.order_status?.status]}{" "}
                                                                {`(${data?.order_status?.count})`}
                                                            </span>
                                                        )) ||
                                                        (data?.order_status?.status === "purchase_enough" && (
                                                            <span className="flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 min-w-[135px] text-[13px]  bg-lime-200">
                                                                <TickCircle
                                                                    className="bg-lime-500 rounded-full"
                                                                    color="white"
                                                                    size={15}
                                                                />
                                                                {props.dataLang[data?.order_status?.status]}{" "}
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
                                                        {props.dataLang?.purchase_status || "purchase_status"}
                                                    </h3>
                                                    <h3 className="col-span-1 text-[13px]">
                                                        {data?.status == "1" ? (
                                                            <div className="border border-lime-500 px-2 py-1 rounded text-lime-500 font-normal flex justify-center  items-center gap-1">
                                                                {props.dataLang?.purchase_approved ||
                                                                    "purchase_approved"}{" "}
                                                                <TickCircle
                                                                    className="bg-lime-500 rounded-full"
                                                                    color="white"
                                                                    size={19}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="border border-red-500 px-2 py-1 rounded text-red-500  font-normal flex justify-center items-center gap-1">
                                                                {props.dataLang?.purchase_notapproved ||
                                                                    "purchase_notapproved"}{" "}
                                                                <TickCircle size={22} />
                                                            </div>
                                                        )}
                                                    </h3>
                                                </div>
                                                {/* <div className='my-4 font-medium grid grid-cols-2'>Tổng số lượng</div> */}
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="col-span-1 text-[13px]">
                                                        {props.dataLang?.purchase_propnent || "purchase_propnent"}
                                                    </h3>
                                                    {/* <h3 className="col-span-1 text-[13px] font-normal">
                                                        {data?.user_create_name}
                                                    </h3> */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative">
                                                            <ImageErrors
                                                                src={data?.profile_image}
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
                                                        <h6 className="capitalize">{data?.user_create_name}</h6>
                                                    </div>{" "}
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="col-span-1 text-[13px]">
                                                        {props.dataLang?.purchase_branch || "purchase_branch"}
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
                                                    {props.dataLang?.purchase_image || "purchase_image"}
                                                </h4>
                                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                                    {props.dataLang?.purchase_items || "purchase_items"}
                                                </h4>
                                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                                    {props.dataLang?.purchase_variant || "purchase_variant"}
                                                </h4>
                                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                                    {props.dataLang?.purchase_unit || "purchase_unit"}
                                                </h4>
                                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                                    {props.dataLang?.purchase_quantity || "purchase_quantity"}
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
                                                    {props.dataLang?.purchase_note || "purchase_note"}
                                                </h4>
                                            </div>
                                            {onFetching ? (
                                                <Loading className="max-h-28" color="#0f4f9e" />
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
                                                                        {e?.item?.images != null ? (
                                                                            <ModalImage
                                                                                small={e?.item?.images}
                                                                                large={e?.item?.images}
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
                                                                    <h6 className="text-[13px] font-medium  px-2 py-0.5 col-span-1 text-left break-words">
                                                                        {e?.item?.product_variation}
                                                                    </h6>
                                                                    <h6 className="text-[13px] font-medium  px-2 py-0.5 col-span-1 text-center break-words">
                                                                        {e?.item?.unit_name}
                                                                    </h6>
                                                                    <h6 className="text-[13px] font-medium  px-2 py-0.5 col-span-1 text-center">
                                                                        {formatNumber(e?.quantity)}
                                                                    </h6>
                                                                    <h6 className="text-[13px] font-medium  px-2 py-0.5 col-span-1 text-center">
                                                                        {formatNumber(e?.quantity_create)}
                                                                    </h6>
                                                                    <h6 className="text-[13px] font-medium  px-2 py-0.5 col-span-1 text-center">
                                                                        {Number(e?.quantity_left) < 0
                                                                            ? "Đặt dư" +
                                                                            " " +
                                                                            formatNumber(
                                                                                Number(Math.abs(e?.quantity_left))
                                                                            )
                                                                            : formatNumber(e?.quantity_left)}
                                                                    </h6>
                                                                    <h6 className="text-[13px] font-medium  px-2 py-0.5 col-span-1 text-left">
                                                                        <ExpandableContent content={e?.note} />
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
                                            {props.dataLang?.purchase_total || "purchase_total"}
                                        </h2>
                                        <div className=" mt-5  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10">
                                            <div className="col-span-9">
                                                <h3 className="text-[13px] p-1 font-medium">
                                                    {props.dataLang?.purchase_note || "import_from_note"}
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
                                                            {props.dataLang?.purchase_totalCount ||
                                                                "purchase_totalCount"}
                                                        </h3>
                                                    </div>
                                                    <div className="font-normal text-[13px]">
                                                        <h3 className="text-blue-600">{formatNumber(totalQuantity)}</h3>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between ">
                                                    <div className="font-normal text-[13px]">
                                                        <h3 className="font-medium">
                                                            {props.dataLang?.purchase_totalItem || "purchase_totalItem"}
                                                        </h3>
                                                    </div>
                                                    <div className="font-normal text-[13px]">
                                                        <h3 className="text-blue-600">
                                                            {formatNumber(data?.items?.length)}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) ||
                    (props?.type == "typePo" && (
                        <div className=" space-x-5 w-[1100px]  h-auto">
                            <div>
                                <div className="w-[1100px]">
                                    <div className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                        <h2 className="font-medium bg-[#ECF0F4] p-2 text-[13px]">
                                            {props?.dataLang?.purchase_order_detail_general_informatione ||
                                                "purchase_order_detail_general_informatione"}
                                        </h2>
                                        <div className="grid grid-cols-8  min-h-[170px] px-2">
                                            <div className="col-span-3">
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props.dataLang?.purchase_order_detail_day_vouchers ||
                                                            "purchase_order_detail_day_vouchers"}
                                                    </h3>
                                                    <h3 className=" text-[13px]  font-medium">
                                                        {data?.date != null
                                                            ? moment(data?.date).format("DD/MM/YYYY, HH:mm:ss")
                                                            : ""}
                                                    </h3>
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props.dataLang?.purchase_order_detail_delivery_date ||
                                                            "purchase_order_detail_delivery_date"}
                                                    </h3>
                                                    <h3 className=" text-[13px]  font-medium">
                                                        {data?.delivery_date != null
                                                            ? moment(data?.delivery_date).format("DD/MM/YYYY")
                                                            : ""}
                                                    </h3>
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props.dataLang?.purchase_order_detail_voucher_code ||
                                                            "purchase_order_detail_voucher_code"}
                                                    </h3>
                                                    <h3 className=" text-[13px]  font-medium text-blue-600">
                                                        {data?.code}
                                                    </h3>
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props.dataLang?.purchase_order_table_ordertype ||
                                                            "purchase_order_table_ordertype"}
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
                                                    {(data?.import_status === "not_stocked" && (
                                                        <span className="flex justify-center items-center font-normal 2xl:text-xs xl:text-xs text-[8px] text-sky-500  rounded-xl py-1 px-2  min-w-[100px] bg-sky-200">
                                                            {props.dataLang[data?.import_status] || data?.import_status}
                                                        </span>
                                                    )) ||
                                                        (data?.import_status === "stocked_part" && (
                                                            <span className="flex justify-center items-center font-normal 2xl:text-xs xl:text-xs text-[8px] text-orange-500 rounded-xl py-1 px-2  min-w-[100px] bg-orange-200">
                                                                {props.dataLang[data?.import_status] ||
                                                                    data?.import_status}
                                                            </span>
                                                        )) ||
                                                        (data?.import_status === "stocked" && (
                                                            <span className="flex justify-center 2xl:text-xs xl:text-xs text-[8px] items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2  min-w-[100px] bg-lime-200">
                                                                <TickCircle
                                                                    className="bg-lime-500 rounded-full "
                                                                    color="white"
                                                                    size={15}
                                                                />
                                                                {props.dataLang[data?.import_status] ||
                                                                    data?.import_status}
                                                            </span>
                                                        ))}
                                                </div>
                                                <div className="my-4 font-medium text-[13px]">
                                                    {props.dataLang?.purchase_order_table_number ||
                                                        "purchase_order_table_number"}
                                                </div>
                                                <div className="flex flex-wrap  gap-2 items-center justify-start text-[13px]">
                                                    {data?.purchases
                                                        ?.reduce((acc, cur) => acc + (acc ? ", " : "") + cur.code, "")
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
                                                        {props.dataLang?.purchase_order_table_supplier ||
                                                            "purchase_order_table_supplier"}
                                                    </h3>
                                                    <h3 className="text-[13px] font-medium">{data?.supplier_name}</h3>
                                                </div>
                                                <div className="grid grid-cols-2 col-span-2">
                                                    <h3 className="col-span-1 text-[13px] font-medium">
                                                        {props.dataLang?.production_warehouse_creator ||
                                                            "production_warehouse_creator"}
                                                    </h3>
                                                    {/* <h3 className="col-span-1 text-[13px] font-normal">
                                                {data?.user_create_name}
                                            </h3> */}
                                                    <div className="my-2 font-medium grid grid-cols-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="relative">
                                                                <ImageErrors
                                                                    src={data?.staff_create?.profile_image}
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
                                                                {data?.staff_create?.full_name}
                                                            </h6>
                                                        </div>
                                                    </div>{" "}
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="text-[13px]">
                                                        {props.dataLang?.purchase_order_table_branch ||
                                                            "purchase_order_table_branch"}
                                                    </h3>
                                                    <h3 className="3xl:items-center 3xl-text-[16px] 2xl:text-[13px] xl:text-xs text-[8px] text-[#0F4F9E] font-[300] px-2 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase w-fit">
                                                        {data?.branch_name}
                                                    </h3>
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
                                                    {props.dataLang?.purchase_order_detail_unit_price ||
                                                        "purchase_order_detail_unit_price"}
                                                </h4>
                                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                                    {props.dataLang?.purchase_order_detail_discount ||
                                                        "purchase_order_detail_discount"}
                                                </h4>
                                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center">
                                                    {props.dataLang?.purchase_order_detail_after_discount ||
                                                        "purchase_order_detail_after_discount"}
                                                </h4>
                                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                                    {props.dataLang?.purchase_order_detail_tax ||
                                                        "purchase_order_detail_tax"}
                                                </h4>
                                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                                    {props.dataLang?.purchase_order_detail_into_money ||
                                                        "purchase_order_detail_into_money"}
                                                </h4>
                                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center">
                                                    {props.dataLang?.purchase_order_note || "purchase_order_note"}
                                                </h4>
                                            </div>
                                            {onFetching ? (
                                                <Loading className="max-h-28" color="#0f4f9e" />
                                            ) : data?.item?.length > 0 ? (
                                                <>
                                                    <ScrollArea
                                                        className="min-h-[90px] max-h-[100px] 2xl:max-h-[250px] overflow-hidden"
                                                        speed={1}
                                                        smoothScrolling={true}
                                                    >
                                                        {console.log(data)}
                                                        <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">
                                                            {data?.item?.map((e) => (
                                                                <div
                                                                    className="grid items-center grid-cols-12 py-1.5 px-2 hover:bg-slate-100/40 "
                                                                    key={e.id?.toString()}
                                                                >
                                                                    <h6 className="text-[13px] mx-auto   py-0.5 col-span-1  rounded-md text-center">
                                                                        {e?.item?.images != null ? (
                                                                            <ModalImage
                                                                                small={e?.item?.images}
                                                                                large={e?.item?.images}
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
                                                                        {formatNumber(e?.price)}
                                                                    </h6>
                                                                    <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-center">
                                                                        {e?.discount_percent + "%"}
                                                                    </h6>
                                                                    <h6 className="text-[13px]   py-0.5 col-span-2  rounded-md text-center">
                                                                        {formatNumber(e?.price_after_discount)}
                                                                    </h6>
                                                                    <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-center ">
                                                                        {formatNumber(e?.tax_rate) + "%"}
                                                                    </h6>
                                                                    <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-right mr-3.5">
                                                                        {formatNumber(e?.amount)}
                                                                    </h6>

                                                                    <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-left ml-3.5 ">
                                                                        {e?.note != undefined ? (
                                                                            <ExpandableContent content={e?.note} />
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
                                                            {props.dataLang?.purchase_order_table_item_not_found ||
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
                                                        {props.dataLang?.purchase_order_table_total ||
                                                            "purchase_order_table_total"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_discounty ||
                                                            "purchase_order_detail_discounty"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_money_after_discount ||
                                                            "purchase_order_detail_money_after_discount"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_tax_money ||
                                                            "purchase_order_detail_tax_money"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_into_money ||
                                                            "purchase_order_detail_into_money"}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="col-span-3 space-y-2">
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatNumber(data?.total_price)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatNumber(data?.total_discount)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatNumber(data?.total_price_after_discount)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatNumber(data?.total_tax)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatNumber(data?.total_amount)}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) ||
                    (props?.type == "order" && (
                        <div className="3xl:w-[1200px] 2xl:w-[1100px] xl:w-[999px] w-[950px] 3xl:h-auto 2xl:max-h-auto xl:h-auto h-auto ">
                            <div className=" customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 flex flex-col">
                                <h2 className="font-normal bg-[#ECF0F4] 3xl:p-2 p-1 3xl:text-[16px] 2xl:text-[16px] xl:text-[15px] text-[15px]">
                                    {props?.dataLang?.detail_general_information || "detail_general_information"}
                                </h2>
                                <div className="grid grid-cols-12 min-h-[100px]">
                                    <div className="col-span-4">
                                        <div className="xl:my-4 my-3 font-medium grid grid-cols-6 ">
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2 whitespace-nowrap">
                                                {props.dataLang?.sales_product_date || "sales_product_date"}:
                                            </h3>
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal items-start col-span-4 ml-3">
                                                {data?.date != null
                                                    ? moment(data?.date).format("DD/MM/YYYY, HH:mm:ss")
                                                    : ""}
                                            </h3>
                                        </div>
                                        <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                                {props.dataLang?.sales_product_code || "sales_product_code"}:
                                            </h3>
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px]  font-normal col-span-2 ml-3">
                                                {data?.code}
                                            </h3>
                                        </div>
                                        <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2 ">
                                                {props.dataLang?.sales_product_order_type || "sales_product_order_type"}
                                                :
                                            </h3>
                                            <h3 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[10px] text-[10px] col-span-4 ml-3">
                                                {data?.quote_code !== null && data?.quote_id !== "0" ? (
                                                    <div className="border flex justify-center items-center rounded-2xl 3xl:w-24 2xl:w-[88px] xl:w-[80px] lg:w-[80px] 3xl:h-6 2xl:h-6 xl:h-5 lg:h-5 px-1 bg-lime-200 border-lime-200 text-lime-500">
                                                        Phiếu báo giá
                                                    </div>
                                                ) : (
                                                    <div className="border flex justify-center items-center rounded-2xl 3xl:w-24 2xl:w-[88px] xl:w-[80px] lg:w-[80px] 3xl:h-6 2xl:h-6 xl:h-5 lg:h-5 px-1 bg-red-200 border-red-200 text-red-500">
                                                        Tạo mới
                                                    </div>
                                                )}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="col-span-4 ">
                                        <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                                {props.dataLang?.price_quote_code || "price_quote_code"}:
                                            </h3>
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal col-span-4">
                                                {data?.quote_code}
                                            </h3>
                                        </div>
                                        <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                                {props.dataLang?.price_quote_customer || "price_quote_customer"}:
                                            </h3>
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal col-span-4">
                                                {data?.client_name}
                                            </h3>
                                        </div>
                                        <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                                {props.dataLang?.price_quote_contact_person ||
                                                    "price_quote_contact_person"}
                                                :
                                            </h3>
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal col-span-4">
                                                {data?.contact_name && data?.contact_id !== "0"
                                                    ? data?.contact_name
                                                    : ""}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-span-4 ">
                                        <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                                {props.dataLang?.sales_product_staff_in_charge ||
                                                    "sales_product_staff_in_charge"}
                                                :
                                            </h3>
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px]  font-normal col-span-2">
                                                {data?.staff_name}
                                            </h3>
                                        </div>

                                        <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                                {props.dataLang?.price_quote_order_status || "price_quote_order_status"}
                                                :
                                            </h3>
                                            <h3 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[11px] text-[10px] font-normal col-span-4">
                                                {(data?.status == "un_approved" && (
                                                    <span className="border flex justify-center items-center rounded-2xl 3xl:w-24 2xl:w-20 xl:w-[74px] lg:w-[68px] 3xl:h-6 2xl:h-6 xl:h-5 lg:h-5 px-1 bg-red-200 border-red-200 text-red-500">
                                                        Chưa Duyệt
                                                    </span>
                                                )) ||
                                                    (data?.status == "approved" && (
                                                        <span className="border flex justify-center items-center rounded-2xl 3xl:w-24 2xl:w-20 xl:w-[74px] lg:w-[68px] 3xl:h-6 2xl:h-6 xl:h-5 lg:h-5 px-1 bg-lime-200 border-lime-200 text-lime-500">
                                                            Đã Duyệt
                                                        </span>
                                                    ))}
                                            </h3>
                                        </div>
                                        <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                                {props.dataLang?.price_quote_branch || "price_quote_branch"}:
                                            </h3>
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[10px]  col-span-4 mr-2 px-2 max-w-[250px] w-fit max-h-[100px] text-center text-[#0F4F9E]  font-[400] py-0.5 border border-[#0F4F9E] rounded-[5.5px] ">
                                                {data?.branch_name}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="pr-2 w-[100%] lx:w-[110%] ">
                                    <div className="grid grid-cols-12 items-center sticky rounded-t-xl top-0 bg-slate-100 p-2 z-10">
                                        <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                            {props.dataLang?.price_quote_image || "price_quote_image"}
                                        </h4>
                                        <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                            {props.dataLang?.price_quote_item || "price_quote_item"}
                                        </h4>
                                        <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                            {props.dataLang?.price_quote_variant || "price_quote_variant"}
                                        </h4>
                                        <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                            {props.dataLang?.price_quote_from_unit || "price_quote_from_unit"}
                                        </h4>
                                        <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                            {props.dataLang?.price_quote_quantity || "price_quote_quantity"}
                                        </h4>
                                        <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                            {props.dataLang?.price_quote_unit_price || "price_quote_unit_price"}
                                        </h4>
                                        <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center ">
                                            {props.dataLang?.price_quote_person || "price_quote_person"}
                                        </h4>
                                        <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                            {props.dataLang?.price_quote_after_discount || "price_quote_after_discount"}
                                        </h4>
                                        <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                            {props.dataLang?.price_quote_tax || "price_quote_tax"}
                                        </h4>
                                        <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                            {props.dataLang?.price_quote_into_money || "price_quote_into_money"}
                                        </h4>
                                        <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                            {props.dataLang?.sales_product_item_date || "sales_product_item_date"}
                                        </h4>
                                        <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-normal">
                                            {props.dataLang?.price_quote_note_item || "price_quote_note_item"}
                                        </h4>
                                    </div>
                                    {onFetching ? (
                                        <Loading className="max-h-20 2xl:max-h-[160px]" color="#0f4f9e" />
                                    ) : data?.items?.length > 0 ? (
                                        <>
                                            <ScrollArea
                                                className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px] overflow-hidden"
                                                speed={1}
                                                smoothScrolling={true}
                                            >
                                                <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">
                                                    {data?.items?.map((e) => (
                                                        <div
                                                            className="grid items-center grid-cols-12 3xl:py-1.5 py-0.5 px-2 hover:bg-slate-100/40"
                                                            key={e.id?.toString()}
                                                        >
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]   py-0.5 col-span-1  rounded-md text-center">
                                                                {e?.item?.images != null ? (
                                                                    <ModalImage
                                                                        small={e?.item?.images}
                                                                        large={e?.item?.images}
                                                                        alt="Product Image"
                                                                        className="custom-modal-image object-cover rounded w-[50px] h-[60px]"
                                                                    />
                                                                ) : (
                                                                    <div className="w-[50px] h-[60px] object-cover  flex items-center justify-center rounded">
                                                                        <ModalImage
                                                                            small="/no_img.png"
                                                                            large="/no_img.png"
                                                                            className="w-full h-full rounded object-contain p-1"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-left">
                                                                {e?.item?.name}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-left break-words">
                                                                {e?.item?.product_variation}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-center break-words">
                                                                {e?.item?.unit_name}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                                {formatNumber(e?.quantity)}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-right">
                                                                {formatNumber(e?.price)}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                                {e?.discount_percent + "%"}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-right">
                                                                {formatNumber(e?.price_after_discount)}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                                {formatNumber(e?.tax_rate) + "%"}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1 pr-2 rounded-md text-right">
                                                                {formatNumber(e?.amount)}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px] col-span-1 rounded-md text-center whitespace-normal">
                                                                {e?.delivery_date != null
                                                                    ? moment(e?.delivery_date).format("DD/MM/YYYY")
                                                                    : ""}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px] pl-4 col-span-1 rounded-md text-left whitespace-normal">
                                                                {e?.note != undefined ? e?.note : ""}
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
                                                    {props.dataLang?.price_quote_table_item_not_found ||
                                                        "price_quote_table_item_not_found"}
                                                </h1>
                                                <div className="flex items-center justify-around mt-6 ">
                                                    {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <h2 className="font-normal p-2 3xl:text-[16px] 2xl:text-[16px] xl:text-[15px] text-[15px] border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]">
                                    {props.dataLang?.purchase_total || "purchase_total"}
                                </h2>
                                <div className="text-right mt-2  grid grid-cols-12 flex-col justify-between">
                                    <div className="col-span-7 font-medium grid grid-cols-7 text-left">
                                        <h3 className="3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px] ">
                                            {props.dataLang?.price_quote_note || "price_quote_note"}
                                        </h3>
                                        <h3 className="3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px] col-span-5 font-normal rounded-lg">
                                            {data?.note}
                                        </h3>
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <div className="font-normal text-left 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                            <h3>{props.dataLang?.price_quote_total || "price_quote_total"}</h3>
                                        </div>
                                        <div className="font-normal text-left 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                            <h3>
                                                {props.dataLang?.price_quote_total_discount || "price_quote_discount"}
                                            </h3>
                                        </div>
                                        <div className="font-normal text-left 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                            <h3>
                                                {props.dataLang?.price_quote_total_money_after_discount ||
                                                    "price_quote_money_after_discount"}
                                            </h3>
                                        </div>
                                        <div className="font-normal text-left 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                            <h3>{props.dataLang?.price_quote_tax_money || "price_quote_tax_money"}</h3>
                                        </div>
                                        <div className="font-normal text-left 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                            <h3>
                                                {props.dataLang?.price_quote_into_money || "price_quote_into_money"}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-span-3 space-y-2">
                                        <div className="font-normal mr-2.5">
                                            <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                                {formatNumber(data?.total_price)}
                                            </h3>
                                        </div>
                                        <div className="font-normal mr-2.5">
                                            <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                                {formatNumber(data?.total_discount)}
                                            </h3>
                                        </div>
                                        <div className="font-normal mr-2.5">
                                            <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                                {formatNumber(data?.total_price_after_discount)}
                                            </h3>
                                        </div>
                                        <div className="font-normal mr-2.5">
                                            <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                                {formatNumber(data?.total_tax_price)}
                                            </h3>
                                        </div>
                                        <div className="font-normal mr-2.5">
                                            <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                                {formatNumber(data?.total_amount)}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </PopupEdit>
        </>
    );
};
export default Popup_chitietThere;
