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
} from "iconsax-react";

import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import Datepicker from "react-tailwindcss-datepicker";
import DatePicker, { registerLocale } from "react-datepicker";
import Popup from "reactjs-popup";
import moment from "moment/moment";
import vi from "date-fns/locale/vi";
registerLocale("vi", vi);


import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";

import Swal from "sweetalert2";

import { useEffect } from "react";
import NoData from "@/components/UI/noData/nodata";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

const Popup_status = (props) => {
    const dataLang = props?.dataLang;
    const [onFetching, sOnFetching] = useState(false);
    const [open, sOpen] = useState(false);
    const [data, sData] = useState([]);

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
    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        open && sOnFetching(true);
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
            <div className=" space-x-5 3xl:w-[1250px] 2xl:w-[1100px] w-[1050px] 3xl:h-auto  2xl:h-auto xl:h-[540px] h-[500px] ">
                <Customscrollbar className="min:h-[200px] h-[82%] max:h-[500px]  pb-2">
                    <div className="pr-2 ">
                        <div
                            className={`grid-cols-8 grid sticky top-0 bg-white shadow mt-1 rounded items-center z-10 divide-x `}
                        >
                            <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold  whitespace-nowrap col-span-1  text-center">
                                {props.dataLang?.inventory_dayvouchers || "inventory_dayvouchers"}
                            </h4>
                            <h4 className="text-[13px]  px-2 py-1.5 text-gray-600 uppercase col-span-1 font-semibold text-center whitespace-nowrap">
                                {props.dataLang?.inventory_vouchercode || "inventory_vouchercode"}
                            </h4>
                            <h4 className="text-[13px]  px-2 py-1.5 text-[#667085] uppercase col-span-1 font-semibold text-center whitespace-nowrap">
                                {props.dataLang?.import_ballot || "import_ballot"}
                            </h4>
                            <h4 className="text-[13px]  px-2 py-1.5 text-[#667085] uppercase col-span-2 font-semibold text-center whitespace-nowrap">
                                {props.dataLang?.purchase_order_purchase_from_item ||
                                    "purchase_order_purchase_from_item"}
                            </h4>
                            <h4 className="text-[13px]  px-2 py-1.5 text-[#667085] uppercase col-span-2 font-semibold text-center whitespace-nowrap">
                                {props.dataLang?.PDF_house || "PDF_house"}
                            </h4>
                            <h4 className="text-[13px]  px-2 py-1.5 text-[#667085] uppercase col-span-1 font-semibold text-center whitespace-nowrap">
                                {props.dataLang?.purchase_quantity || "purchase_quantity"}
                            </h4>
                        </div>
                        {onFetching ? (
                            <Loading className="h-24" color="#0f4f9e" />
                        ) : data?.length > 0 ? (
                            <>
                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[500px] mt-2 ">
                                    {data?.map((e) => (
                                        <div className={`grid-cols-8  grid hover:bg-slate-50 items-center`}>
                                            <h6 className="text-[13px] px-2 py-1.5 col-span-1 text-center">
                                                {e?.date_coupon != null
                                                    ? moment(e?.date_coupon).format("DD/MM/YYYY")
                                                    : ""}
                                            </h6>
                                            <h6 className="text-[13px] px-2 py-1.5 col-span-1 text-center hover:font-normal cursor-pointer">
                                                {e?.code_coupon}
                                            </h6>
                                            <h6 className="text-[13px] px-2 py-1.5 col-span-1 text-left hover:font-normal cursor-pointer">
                                                {dataLang[e?.type_text]}
                                            </h6>

                                            <h6 className="text-[13px] px-2 py-1.5 col-span-2   hover:font-normal cursor-pointer">
                                                <div className="flex items-center gap-1">
                                                    <div>
                                                        {e?.images != null ? (
                                                            <ModalImage
                                                                small={e?.images}
                                                                large={e?.images}
                                                                alt="Product Image"
                                                                className="custom-modal-image object-cover rounded w-[40px] h-[50px] mx-auto"
                                                            />
                                                        ) : (
                                                            <div className="w-[40px] h-[50px] object-cover  mx-auto">
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
                                                        <div className="">
                                                            <h4 className="text-[13px]   w-[full] ">{e?.name}</h4>
                                                            <h4 className="text-[13px]   w-[full] ">
                                                                {e?.product_variation}
                                                            </h4>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            {dataProductSerial.is_enable === "1" ? (
                                                                <div className="flex gap-1 items-center italic font-normal text-[12px]">
                                                                    <h6>Serial: </h6>
                                                                    <h6 className=" w-[full] text-center">
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
                                                                <div className="flex">
                                                                    <div className="flex gap-1 items-center italic font-normal text-[12px]">
                                                                        <h6>Lot: </h6>
                                                                        <h6 className=" px-1 w-[full] text-center">
                                                                            {e.lot == null || e.lot == "" ? "-" : e.lot}
                                                                        </h6>
                                                                    </div>
                                                                    <div className="flex gap-1 items-center italic font-normal text-[12px]">
                                                                        <h6>Date: </h6>
                                                                        <h6 className="px-1 w-[full] text-center">
                                                                            {e.expiration_date
                                                                                ? moment(e.expiration_date).format(
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
                                                </div>
                                            </h6>
                                            <h6 className="text-[13px] px-2 py-1.5 col-span-2 text-left hover:font-normal cursor-pointer">
                                                <div className="flex flex-col">
                                                    <span className="">{e?.warehouse_name}</span>
                                                    <span className="">{e?.local_name}</span>
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
                            <NoData />
                        )}
                    </div>
                </Customscrollbar>
            </div>
        </PopupEdit>
    );
};
export default Popup_status;
