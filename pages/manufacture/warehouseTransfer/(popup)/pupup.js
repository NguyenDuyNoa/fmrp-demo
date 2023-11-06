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

import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { VscFilePdf } from "react-icons/vsc";

import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import Datepicker from "react-tailwindcss-datepicker";
import DatePicker, { registerLocale } from "react-datepicker";
import Popup from "reactjs-popup";
import moment from "moment/moment";
import vi from "date-fns/locale/vi";
registerLocale("vi", vi);

const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});

import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";
import Pagination from "/components/UI/pagination";

import Swal from "sweetalert2";

import ReactExport from "react-data-export";
import { useEffect } from "react";

import ExpandableContent from "components/UI/more";
import ImageErrors from "components/UI/imageErrors";
import LinkWarehouse from "pages/manufacture/(linkWarehouse)/linkWarehouse";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
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

    const formatNumber = (number) => {
        if (!number && number !== 0) return 0;
        const integerPart = Math.floor(number);
        // const decimalPart = number - integerPart;
        // const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
        // const roundedNumber = integerPart + roundedDecimalPart;
        return integerPart?.toLocaleString("en");
    };

    const _ServerFetching_detailOrder = () => {
        Axios("GET", `/api_web/Api_transfer/transfer/${props?.id}?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                var data = response.data;
                sData(data);
            }
            sOnFetching(false);
        });
    };

    useEffect(() => {
        setTimeout(() => {
            (onFetching && _ServerFetching_detailOrder()) || (onFetching && _ServerFetching());
        }, 400);
    }, [open]);
    // useEffect(() => {
    //     setTimeout(() => {
    //         (onFetching && _ServerFetching_detailOrder()) ||
    //             (onFetching && _ServerFetching());
    //     }, 400);
    // }, [open, props.id, onFetching]);

    const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});
    const [dataProductExpiry, sDataProductExpiry] = useState({});
    const [dataProductSerial, sDataProductSerial] = useState({});

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
    return (
        <>
            <PopupEdit
                title={props.dataLang?.warehouseTransfer_titleDetail || "warehouseTransfer_titleDetail"}
                button={props?.name}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props?.className}
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <div className=" space-x-5 3xl:w-[1200px] 2xl:w-[1150px] w-[1100px] 3xl:h-auto  2xl:h-auto xl:h-[540px] h-[500px] ">
                    <div>
                        <div className="3xl:w-[1200px] 2xl:w-[1150px] w-[1100px]">
                            <div className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                <h2 className="font-medium bg-[#ECF0F4] p-2 text-[13px]">
                                    {props.dataLang?.import_detail_info || "import_detail_info"}
                                </h2>
                                <div className="grid grid-cols-9  min-h-[100px] px-2 items-center bg-zinc-50">
                                    <div className="col-span-3">
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang?.import_day_vouchers || "import_day_vouchers"}
                                            </h3>
                                            <h3 className=" text-[13px]  font-medium">
                                                {data?.date != null ? moment(data?.date).format("DD/MM/YYYY") : ""}
                                            </h3>
                                        </div>
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang?.import_code_vouchers || "import_code_vouchers"}
                                            </h3>
                                            <h3 className=" text-[13px]  font-medium text-blue-600 capitalize">
                                                {data?.code}
                                            </h3>
                                        </div>
                                        <div className="my-2 font-medium grid grid-cols-2">
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
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props?.dataLang?.production_warehouse_LSX ||
                                                    "production_warehouse_LSX"}
                                            </h3>
                                        </div>
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang?.import_from_browse || "import_from_browse"}
                                            </h3>
                                            <div className="flex flex-wrap  gap-2 items-center ">
                                                {(data?.warehouseman_id === "0" && (
                                                    <div className=" font-medium text-[#3b82f6]  rounded-2xl py-1 px-2 min-w-[135px]  bg-[#bfdbfe] text-center 3xl:text-[11px] 2xl:text-[10px] xl:text-[8px] text-[7px]">
                                                        {"Chưa duyệt kho"}
                                                    </div>
                                                )) ||
                                                    (data?.warehouseman_id != "0" && (
                                                        <div className=" font-medium gap-1  text-lime-500   rounded-2xl py-1 px-2 min-w-[135px]  bg-lime-200 text-center 3xl:text-[11px] 2xl:text-[10px] xl:text-[8px] text-[7px] flex items-center justify-center">
                                                            <TickCircle
                                                                className="bg-lime-500 rounded-full animate-pulse "
                                                                color="white"
                                                                size={15}
                                                            />
                                                            <span>Đã duyệt kho</span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className="text-[13px]">
                                                {props.dataLang?.warehouseTransfer_transferWarehouse ||
                                                    "warehouseTransfer_transferWarehouse"}
                                            </h3>
                                            <h3 className="text-[13px] font-medium capitalize">
                                                {/* {data?.warehouse_name} */}
                                                <LinkWarehouse
                                                    open={open}
                                                    warehouse_id={data?.warehouses_id}
                                                    warehouse_name={data?.warehouses_id_name}
                                                />
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-span-3 ">
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className="text-[13px]">
                                                {props?.dataLang?.production_warehouse_Total_value ||
                                                    "production_warehouse_Total_value"}
                                            </h3>
                                            <h3 className="text-[13px] font-medium capitalize">
                                                {formatNumber(data?.grand_total)}
                                            </h3>
                                        </div>
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className="text-[13px]">
                                                {props.dataLang?.import_branch || "import_branch"}
                                            </h3>
                                            <h3 className="3xl:items-center 3xl-text-[16px] 2xl:text-[13px] xl:text-xs text-[8px] text-[#0F4F9E] font-[300] px-2 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase w-fit">
                                                {data?.branch_name_id}
                                            </h3>
                                        </div>
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className="text-[13px]">
                                                {props.dataLang?.warehouseTransfer_receivingWarehouse ||
                                                    "warehouseTransfer_receivingWarehouse"}
                                            </h3>
                                            <h3 className="text-[13px] font-medium capitalize">
                                                <LinkWarehouse
                                                    open={open}
                                                    warehouse_id={data?.warehouses_to}
                                                    color="text-green-600"
                                                    warehouse_name={data?.warehouses_to_name}
                                                />
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <div className=" w-[100%]">
                                    <div
                                        className={`grid-cols-12  grid sticky top-0 bg-white shadow-lg  z-10 rounded `}
                                    >
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-3 text-center whitespace-nowrap">
                                            {props.dataLang?.import_detail_items || "import_detail_items"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                                            {"Vị trí chuyển"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                                            {"Vị trí nhận"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                            {props.dataLang?.production_warehouse_inventory ||
                                                "production_warehouse_inventory"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                            {"ĐVT"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                            {props.dataLang?.production_warehouse_export_sl ||
                                                "production_warehouse_export_sl"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
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
                                                <div className=" divide-slate-200 min:h-[170px]  max:h-[170px]">
                                                    {data?.items?.map((e) => (
                                                        <div
                                                            className="grid grid-cols-12 hover:bg-slate-50 items-center border-b"
                                                            key={e.id?.toString()}
                                                        >
                                                            <h6 className="text-[13px]  px-2 py-2 col-span-3 text-left ">
                                                                <div className="flex items-center gap-2">
                                                                    <div>
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
                                                                    </div>
                                                                    <div>
                                                                        <h6 className="text-[13px] text-left font-medium capitalize">
                                                                            {e?.item?.name}
                                                                        </h6>
                                                                        <h6 className="text-[13px] text-left font-medium capitalize">
                                                                            {e?.item?.product_variation}
                                                                        </h6>
                                                                        <div className="flex items-center font-oblique flex-wrap">
                                                                            {dataProductSerial.is_enable === "1" ? (
                                                                                <div className="flex gap-0.5">
                                                                                    <h6 className="text-[12px]">
                                                                                        Serial:
                                                                                    </h6>
                                                                                    <h6 className="text-[12px]  px-2   w-[full] text-left ">
                                                                                        {e?.item?.serial == null ||
                                                                                        e?.item?.serial == ""
                                                                                            ? "-"
                                                                                            : e?.item?.serial}
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
                                                                                            {e?.item?.lot == null ||
                                                                                            e?.item?.lot == ""
                                                                                                ? "-"
                                                                                                : e?.item?.lot}
                                                                                        </h6>
                                                                                    </div>
                                                                                    <div className="flex gap-0.5">
                                                                                        <h6 className="text-[12px]">
                                                                                            Date:
                                                                                        </h6>{" "}
                                                                                        <h6 className="text-[12px]  px-2   w-[full] text-center ">
                                                                                            {e?.item?.expiration_date
                                                                                                ? moment(
                                                                                                      e?.item
                                                                                                          ?.expiration_date
                                                                                                  ).format("DD/MM/YYYY")
                                                                                                : "-"}
                                                                                        </h6>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </h6>
                                                            <h6 className="text-[13px]   px-2 py-2 col-span-2 text-center break-words">
                                                                <h6 className="font-medium">
                                                                    {e?.warehouse_location?.location_name}
                                                                </h6>
                                                            </h6>
                                                            <h6 className="text-[13px]   px-2 py-2 col-span-2 text-center break-words">
                                                                <h6 className="font-medium">
                                                                    {e?.warehouse_location_to?.location_name}
                                                                </h6>
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-1 font-medium text-center break-words">
                                                                {formatNumber(e?.warehouse_location?.quantity)}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-1 font-medium text-center break-words">
                                                                {e?.item?.unit_name}
                                                            </h6>

                                                            <h6 className="text-[13px]   py-2 col-span-1 font-medium text-center ">
                                                                {formatNumber(e?.quantity)} {e?.item?.unit_name}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-2 font-medium text-left ml-3.5">
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
                                        <h3 className="text-[13px] p-1">
                                            {props.dataLang?.returns_reason || "returns_reason"}
                                        </h3>
                                        <textarea
                                            className="resize-none text-[13px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 placeholder:text-slate-300 w-[90%] min-h-[90px] max-h-[90px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1 outline-none "
                                            disabled
                                            value={data?.note}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-1 text-right">
                                        <div className="font-medium text-left text-[13px]">
                                            <h3>
                                                {props?.dataLang?.production_warehouse_totalItem ||
                                                    "production_warehouse_totalItem"}
                                            </h3>
                                        </div>
                                        <div className="font-medium text-left text-[13px]">
                                            <h3>
                                                {props.dataLang?.warehouseTransfer_total || "warehouseTransfer_total"}
                                            </h3>
                                        </div>
                                        <div className="font-medium text-left text-[13px]">
                                            <h3>
                                                {props?.dataLang?.production_warehouse_Totalinventory ||
                                                    "production_warehouse_Totalinventory"}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-span-3 space-y-1 text-right">
                                        <div className="font-medium mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatNumber(data?.items?.length)}
                                            </h3>
                                        </div>
                                        <div className="font-medium mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatNumber(
                                                    data?.items?.reduce(
                                                        (total, item) => total + Number(item.quantity),
                                                        0
                                                    )
                                                )}
                                            </h3>
                                        </div>
                                        <div className="font-medium mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatNumber(
                                                    data?.items?.reduce(
                                                        (total, item) =>
                                                            total + Number(item.warehouse_location?.quantity),
                                                        0
                                                    )
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
