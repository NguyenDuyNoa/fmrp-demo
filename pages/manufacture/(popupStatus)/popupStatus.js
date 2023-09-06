import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import ModalImage from "react-modal-image";
import "react-datepicker/dist/react-datepicker.css";

import {
    Grid6 as IconExcel,
    Filter as IconFilter,
    Calendar as IconCalendar,
    SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    House,
} from "iconsax-react";

import "react-datepicker/dist/react-datepicker.css";
import moment from "moment/moment";

const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});

import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";

import { useEffect } from "react";
import randomColor from "components/UI/radomColor/radomcolor";

const Popup_status = (props) => {
    const dataLang = props?.dataLang;
    const [onFetching, sOnFetching] = useState(false);
    const [open, sOpen] = useState(false);
    const [data, sData] = useState([]);

    const [currentColor, sCurrentColor] = useState("");

    const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});
    const [dataProductExpiry, sDataProductExpiry] = useState({});
    const [dataProductSerial, sDataProductSerial] = useState({});

    const formatNumber = (number) => {
        if (!number && number !== 0) return 0;
        const integerPart = Math.floor(number);
        const decimalPart = number - integerPart;
        const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
        const roundedNumber = integerPart + roundedDecimalPart;
        return roundedNumber.toLocaleString("en");
    };

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
    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        open && sOnFetching(true);
        open && sCurrentColor(randomColor());
        setTimeout(() => {
            sOnFetching(false);
        }, 800);
    }, [open]);

    useEffect(() => {
        sData([]);
        sOpen(false);
        if (props?.data_export?.length > 0) {
            setTimeout(() => {
                sOpen(true);
                sData(props?.data_export);
            }, 1000);
        }
    }, [props?.data_export]);

    return (
        <PopupEdit
            title={props.dataLang?.inventory_votes || "inventory_votes"}
            open={open}
            onClose={() => sOpen(false)}
            classNameBtn={props.className}
        >
            <div className=" space-x-5 3xl:w-[1000px] 2xl:w-[1000px]  xl:w-[1000px] lg:w-[700px] w-[1000px] 3xl:h-auto xxl:h-auto  2xl:h-auto xl:h-[540px] h-[500px] ">
                <div className="min:h-[200px] h-[82%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                    <div className="">
                        <div
                            className={`grid-cols-8   grid sticky top-0 bg-white shadow items-center z-10 divide-x rounded`}
                        >
                            <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-semibold  whitespace-nowrap col-span-1  text-center">
                                {props.dataLang?.inventory_dayvouchers ||
                                    "inventory_dayvouchers"}
                            </h4>
                            <h4 className="text-[13px]  px-2 py-2 text-gray-600 uppercase col-span-1 font-semibold text-center whitespace-nowrap">
                                {props.dataLang?.inventory_vouchercode ||
                                    "inventory_vouchercode"}
                            </h4>
                            <h4 className="text-[13px]  px-2 py-2 text-gray-600 uppercase col-span-1 font-semibold text-center whitespace-nowrap">
                                {props.dataLang?.import_ballot ||
                                    "import_ballot"}
                            </h4>
                            <h4 className="text-[13px]  px-2 py-2 text-gray-600 uppercase col-span-2 font-semibold text-center whitespace-nowrap">
                                {props.dataLang
                                    ?.purchase_order_purchase_from_item ||
                                    "purchase_order_purchase_from_item"}
                            </h4>
                            <h4 className="text-[13px]  px-2 py-2 text-gray-600 uppercase col-span-2 font-semibold text-center whitespace-nowrap">
                                {props.dataLang?.PDF_house || "PDF_house"}
                            </h4>
                            <h4 className="text-[13px]  px-2 py-2 text-gray-600 uppercase col-span-1 font-semibold text-center whitespace-nowrap">
                                {props.dataLang?.purchase_quantity ||
                                    "purchase_quantity"}
                            </h4>
                        </div>
                        {onFetching ? (
                            <Loading className="h-24" color="#0f4f9e" />
                        ) : data?.length > 0 ? (
                            <>
                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[500px] mt-2 ">
                                    {data?.map((e) => (
                                        <div
                                            className={`grid-cols-8  grid hover:bg-slate-50 items-center`}
                                        >
                                            <h6 className="text-[13px] px-2 py-1.5 col-span-1 text-center">
                                                {e?.date_coupon != null
                                                    ? moment(
                                                          e?.date_coupon
                                                      ).format("DD/MM/YYYY")
                                                    : ""}
                                            </h6>
                                            <h6 className="text-[13px] px-2 py-1.5 col-span-1 text-center cursor-pointer text-blue-600 font-semibold">
                                                {e?.code_coupon}
                                            </h6>
                                            <h6
                                                className={`3xl:text-[12px] relative 2xl:text-[10px] text-[10px] px-2 ${currentColor} rounded-2xl text-center text-white py-1 col-span-1  hover:font-normal cursor-pointer`}
                                            >
                                                {dataLang[e?.type_text]}
                                                <div className="absolute inset-0 bg-white opacity-10 "></div>
                                            </h6>

                                            <h6 className="text-[13px] px-2 py-1.5 col-span-2   hover:font-normal cursor-pointer">
                                                <div className="">
                                                    <div className="flex flex-col">
                                                        <h4 className="text-[13px] w-[full] ">
                                                            {e?.name}
                                                        </h4>
                                                        <h4 className="text-[13px] w-[full] ">
                                                            {
                                                                e?.product_variation
                                                            }
                                                        </h4>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {(props.type ==
                                                            "productsWarehouse" ||
                                                            props.type ==
                                                                "warehouseTransfer") &&
                                                        dataProductSerial.is_enable ===
                                                            "1" ? (
                                                            <div className="flex gap-1 items-center italic font-normal text-[12px]">
                                                                <h6>
                                                                    Serial:{" "}
                                                                </h6>
                                                                <h6 className="px-2 w-[full] text-center">
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
                                                        {props.type ==
                                                            "productsWarehouse" ||
                                                        (props.type ==
                                                            "warehouseTransfer" &&
                                                            dataProductExpiry.is_enable ===
                                                                "1") ||
                                                        props.type ==
                                                            "recall" ||
                                                        (props.type ==
                                                            "warehouseTransfer" &&
                                                            dataMaterialExpiry.is_enable ===
                                                                "1") ? (
                                                            <div className="flex">
                                                                <div className="flex gap-1 items-center italic font-normal text-[12px]">
                                                                    <h6>
                                                                        Lot:{" "}
                                                                    </h6>
                                                                    <h6 className=" px-1 w-[full] text-center">
                                                                        {e.lot ==
                                                                            null ||
                                                                        e.lot ==
                                                                            ""
                                                                            ? "-"
                                                                            : e.lot}
                                                                    </h6>
                                                                </div>
                                                                <div className="flex gap-1 items-center italic font-normal text-[12px]">
                                                                    <h6>
                                                                        Date:{" "}
                                                                    </h6>
                                                                    <h6 className="px-1 w-[full] text-center">
                                                                        {e.expiration_date
                                                                            ? moment(
                                                                                  e.expiration_date
                                                                              ).format(
                                                                                  "DD/MM/YYYY"
                                                                              )
                                                                            : "-"}
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                </div>
                                            </h6>
                                            <h6 className="text-[13px] px-2 py-1.5 col-span-2 text-left hover:font-normal cursor-pointer">
                                                <div className="flex items-center gap-1">
                                                    <div>
                                                        <House
                                                            size="30"
                                                            color="#4f46e5"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="">
                                                            {e?.warehouse_name}
                                                        </span>
                                                        <span className="">
                                                            {e?.local_name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </h6>
                                            <h6 className="text-[13px] px-2 py-1.5 col-span-1 text-center hover:font-normal cursor-pointer">
                                                {formatNumber(e?.quantity)}
                                            </h6>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className=" max-w-[352px] mt-24 mx-auto">
                                <div className="text-center">
                                    <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                                        <IconSearch />
                                    </div>
                                    <h1 className="textx-[#141522] text-base opacity-90 font-medium">
                                        {dataLang?.purchase_order_table_item_not_found ||
                                            "purchase_order_table_item_not_found"}
                                    </h1>
                                    <div className="flex items-center justify-around mt-6 ">
                                        {/* <Popup_dsncc onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PopupEdit>
    );
};
export default Popup_status;
