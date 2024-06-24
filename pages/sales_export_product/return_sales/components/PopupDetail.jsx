import { useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ModalImage from "react-modal-image";

import {
    SearchNormal1 as IconSearch
} from "iconsax-react";


import vi from "date-fns/locale/vi";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("vi", vi);


import Loading from "components/UI/loading";
import PopupEdit from "/components/UI/popup";
import { _ServerInstance as Axios } from "/services/axios";

import Swal from "sweetalert2";

import { useEffect } from "react";

import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { ColumnTablePopup, GeneralInformation, HeaderTablePopup } from "@/components/UI/common/TablePopup";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { TagWarehouse } from "@/components/UI/common/Tag/TagWarehouse";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { formatMoment } from "@/utils/helpers/formatMoment";
import ImageErrors from "components/UI/imageErrors";
import ExpandableContent from "components/UI/more";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

const PopupDetail = (props) => {
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
            `/api_web/Api_return_order/return_order/${props?.id}?csrf_protection=true`,
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
        (onFetching && _ServerFetching_detailOrder()) || (onFetching && _ServerFetching());
    }, [open]);

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
                title={props.dataLang?.returnSales_detail || "returnSales_detail"}
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
                                <GeneralInformation  {...props} />
                                <div className="grid grid-cols-9  min-h-[100px] px-2 items-center bg-zinc-50">
                                    <div className="col-span-3">
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang?.import_day_vouchers || "import_day_vouchers"}
                                            </h3>
                                            <h3 className=" text-[13px]  font-medium">
                                                {data?.date != null ? formatMoment(data?.date, FORMAT_MOMENT.DATE_SLASH_LONG) : ""}
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-2 col-span-2 items-center">
                                            <h3 className=" text-[13px] font-medium">
                                                {props?.dataLang?.production_warehouse_creator || "production_warehouse_creator"}
                                            </h3>
                                            <div className="font-medium grid grid-cols-2">
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
                                        </div>
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang?.import_code_vouchers || "import_code_vouchers"}
                                            </h3>
                                            <h3 className=" text-[13px]  font-medium text-blue-600 capitalize">
                                                {data?.code}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang?.returns_form || "returns_form"}
                                            </h3>
                                            <div className="flex flex-wrap  gap-2 items-center">
                                                {(data?.handling_solution === "pay_down" && (
                                                    <div className="cursor-default min-w-[135px] min-w-auto text-center 3xl:text-[11px] 2xl:text-[10px] xl:text-[8px] text-[7px] font-medium text-lime-500 bg-lime-200  border-lime-200  px-2 py-1 border  rounded-2xl">
                                                        {props.dataLang[data?.handling_solution] ||
                                                            data?.handling_solution}
                                                    </div>
                                                )) ||
                                                    (data?.handling_solution === "debt_reduction" && (
                                                        <div className="cursor-default min-w-[135px] text-center 3xl:text-[11px] 2xl:text-[10px] xl:text-[8px] text-[7px] font-medium text-orange-500 bg-orange-200  border-orange-200 px-2 py-1 border   rounded-2xl">
                                                            {props.dataLang[data?.handling_solution] ||
                                                                data?.handling_solution}
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang?.import_from_browse || "import_from_browse"}
                                            </h3>
                                            <div className="flex flex-wrap  gap-2 items-center ">
                                                <TagWarehouse className="w-fit" data={data} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-3 ">
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className="text-[13px]">
                                                {props.dataLang?.returnSales_client || "returnSales_client"}
                                            </h3>
                                            <h3 className="text-[13px] font-medium capitalize">{data?.client_name}</h3>
                                        </div>

                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className="text-[13px]">
                                                {props.dataLang?.import_branch || "import_branch"}
                                            </h3>
                                            <TagBranch className='w-fit'>
                                                {data?.branch_name}
                                            </TagBranch>
                                        </div>
                                    </div>
                                </div>
                                <div className=" w-[100%]">
                                    {/* <div className={`${dataProductSerial.is_enable == "1" ? 
                      (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-12" :dataMaterialExpiry.is_enable == "1" ? "grid-cols-12" :"grid-cols-10" ) :
                       (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-11" : (dataMaterialExpiry.is_enable == "1" ? "grid-cols-11" :"grid-cols-9") ) }  grid sticky top-0 bg-white shadow-lg  z-10`}> */}
                                    <HeaderTablePopup gridCols={14}>
                                        {/* <h4 className="text-[13px] px-2 text-gray-400 uppercase  font-[500] col-span-1 text-center whitespace-nowrap">{props.dataLang?.import_detail_image || "import_detail_image"}</h4> */}
                                        <ColumnTablePopup colSpan={3}>
                                            {props.dataLang?.import_detail_items || "import_detail_items"}
                                        </ColumnTablePopup>
                                        {/* <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">{props.dataLang?.import_detail_variant || "import_detail_variant"}</h4>  */}
                                        <ColumnTablePopup colSpan={2}>
                                            {props.dataLang?.delivery_receipt_warehouse || "delivery_receipt_warehouse"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup colSpan={1}>
                                            {"Tồn kho"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup colSpan={1}>
                                            {"ĐVT"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup colSpan={1}>
                                            {props.dataLang?.import_from_quantity || "import_from_quantity"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup colSpan={1}>
                                            {props.dataLang?.import_from_unit_price || "import_from_unit_price"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup colSpan={1}>
                                            {"% CK"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup colSpan={1}>
                                            {props.dataLang?.import_from_price_affter || "import_from_price_affter"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup colSpan={1}>
                                            {props.dataLang?.import_from_tax || "import_from_tax"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup colSpan={1}>
                                            {props.dataLang?.import_into_money || "import_into_money"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup colSpan={1}>
                                            {props.dataLang?.import_from_note || "import_from_note"}
                                        </ColumnTablePopup>
                                    </HeaderTablePopup>
                                    {onFetching ? (
                                        <Loading className="max-h-28" color="#0f4f9e" />
                                    ) : data?.items?.length > 0 ? (
                                        <>
                                            <Customscrollbar className="min:h-[200px] 3xl:h-[82%] 2xl:h-[82%] xl:h-[72%] lg:h-[82%] max:h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
                                            >
                                                <div className="divide-y divide-slate-200 min:h-[170px]  max:h-[170px]">
                                                    {data?.items?.map((e) => (
                                                        // <div className={`${dataProductSerial.is_enable == "1" ?
                                                        // (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-12" :dataMaterialExpiry.is_enable == "1" ? "grid-cols-12" :"grid-cols-10" ) :
                                                        // (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-11" : (dataMaterialExpiry.is_enable == "1" ? "grid-cols-11" :"grid-cols-9") ) }  grid hover:bg-slate-50 `} key={e.id?.toString()}>
                                                        <div
                                                            className="grid grid-cols-14 hover:bg-slate-50 items-center "
                                                            key={e.id?.toString()}
                                                        >
                                                            {/* <h6 className="text-[13px]   py-0.5 col-span-1 text-center">
                            {e?.item?.images != null ? (<ModalImage   small={e?.item?.images} large={e?.item?.images} alt="Product Image"  className='custom-modal-image object-cover rounded w-[50px] h-[60px] mx-auto' />):
                              <div className='w-[50px] h-[60px] object-cover  mx-auto'>
                                <ModalImage small="/no_img.png" large="/no_img.png" className='w-full h-full rounded object-contain p-1' > </ModalImage>
                              </div>
                            }
                            </h6>     
                                        */}
                                                            <h6 className="text-[13px]  px-2 py-2 col-span-3 text-left ">
                                                                <div className="flex items-center gap-2">
                                                                    <div>
                                                                        {e?.item?.images != null ? (
                                                                            <ModalImage
                                                                                small={e?.item?.images}
                                                                                large={e?.item?.images}
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
                                                                        <h6 className="text-[13px] text-left font-medium capitalize">
                                                                            {e?.item?.name}
                                                                        </h6>
                                                                        <h6 className="text-[13px] text-left font-medium capitalize">
                                                                            {e?.item?.product_variation}
                                                                        </h6>
                                                                        <div className="flex items-center font-oblique flex-wrap">
                                                                            {dataProductSerial.is_enable === "1" ? (
                                                                                <div className="flex gap-0.5">
                                                                                    {/* <h6 className="text-[12px]">Serial:</h6><h6 className="text-[12px]  px-2   w-[full] text-left ">{e.serial == null || e.serial == "" ? "-" : e.serial}</h6>                               */}
                                                                                    <h6 className="text-[12px]">
                                                                                        Serial:
                                                                                    </h6>
                                                                                    <h6 className="text-[12px]  px-2   w-[full] text-left ">
                                                                                        {e?.item?.serial == null || e?.item?.serial == "" ? "-" : e?.item?.serial}
                                                                                    </h6>
                                                                                </div>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                            {dataMaterialExpiry.is_enable === "1" || dataProductExpiry.is_enable === "1" ? (
                                                                                <>
                                                                                    <div className="flex gap-0.5">
                                                                                        <h6 className="text-[12px]">
                                                                                            Lot:
                                                                                        </h6>{" "}
                                                                                        <h6 className="text-[12px]  px-2   w-[full] text-left ">
                                                                                            {e?.item?.lot == null || e?.item?.lot == "" ? "-" : e?.item?.lot}
                                                                                        </h6>
                                                                                    </div>
                                                                                    <div className="flex gap-0.5">
                                                                                        <h6 className="text-[12px]">
                                                                                            Date:
                                                                                        </h6>{" "}
                                                                                        <h6 className="text-[12px]  px-2   w-[full] text-center ">
                                                                                            {e?.item?.expiration_date ? formatMoment(e?.item?.expiration_date, FORMAT_MOMENT.DATE_SLASH_LONG) : "-"}
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
                                                            {/* <h6 className="text-[13px]   px-2 py-2 col-span-1 text-center break-words">{e?.item?.product_variation}</h6>                 */}
                                                            <h6 className="text-[13px]   px-2 py-2 col-span-2 text-left break-words">
                                                                <h6 className="font-medium">
                                                                    {e?.warehouse_name ? e?.warehouse_name : ""}
                                                                </h6>
                                                                <h6 className="font-medium">
                                                                    {e.location_name ? e.location_name : ""}
                                                                </h6>
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-1 font-medium text-center break-words">
                                                                {formatNumber(e?.item?.quantity_left)}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-1 font-medium text-center break-words">
                                                                {e?.item?.unit_name}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-1 font-medium text-center mr-1">
                                                                {formatNumber(e?.quantity)}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-1 font-medium text-center">
                                                                {formatNumber(e?.price)}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-1 font-medium text-center">
                                                                {e?.discount_percent + "%"}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-1 font-medium text-center">
                                                                {formatNumber(e?.price_after_discount)}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-1 font-medium text-center">
                                                                {formatNumber(e?.tax_rate) + "%"}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-1 font-medium text-right ">
                                                                {formatNumber(e?.amount)}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-1 font-medium text-left ml-3.5">
                                                                {e?.note != undefined ? (
                                                                    <ExpandableContent content={e?.note} />
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
                                                {props.dataLang?.import_detail_total_amount ||
                                                    "import_detail_total_amount"}
                                            </h3>
                                        </div>
                                        <div className="font-medium text-left text-[13px]">
                                            <h3>
                                                {props.dataLang?.import_detail_discount || "import_detail_discount"}
                                            </h3>
                                        </div>
                                        <div className="font-medium text-left text-[13px]">
                                            <h3>
                                                {props.dataLang?.import_detail_affter_discount ||
                                                    "import_detail_affter_discount"}
                                            </h3>
                                        </div>
                                        <div className="font-medium text-left text-[13px]">
                                            <h3>
                                                {props.dataLang?.import_detail_tax_money || "import_detail_tax_money"}
                                            </h3>
                                        </div>
                                        <div className="font-medium text-left text-[13px]">
                                            <h3>
                                                {props.dataLang?.import_detail_into_money || "import_detail_into_money"}
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
            </PopupEdit>
        </>
    );
};
export default PopupDetail;
