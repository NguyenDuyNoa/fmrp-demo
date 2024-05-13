import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ModalImage from "react-modal-image";
import "react-datepicker/dist/react-datepicker.css";
import PopupEdit from "@/components/UI/popup";

import { SearchNormal1 as IconSearch, TickCircle } from "iconsax-react";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";

import moment from "moment/moment";
import vi from "date-fns/locale/vi";
registerLocale("vi", vi);
const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});

import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";
import ExpandableContent from "components/UI/more";
import formatNumberConfig from '@/utils/helpers/formatnumber'
import formatMoneyConfig from '@/utils/helpers/formatMoney'
import useSetingServer from "@/hooks/useConfigNumber";
import useFeature from "@/hooks/useConfigFeature";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { ColumnTablePopup, GeneralInformation, HeaderTablePopup } from "@/components/UI/common/TablePopup";

const PopupDetail = (props) => {
    const [open, sOpen] = useState(false);

    const _ToggleModal = (e) => sOpen(e);

    const [data, setData] = useState();

    const [onFetching, sOnFetching] = useState(false);

    const dataSeting = useSetingServer();

    const { dataMaterialExpiry, dataProductSerial, dataProductExpiry } = useFeature()

    useEffect(() => {
        props?.id && sOnFetching(true);
    }, [open]);

    const formatNumber = (num) => {
        return formatNumberConfig(+num, dataSeting)
    };
    const formatMoney = (num) => {
        return formatMoneyConfig(+num, dataSeting)
    };

    const handleFetchingDetail = async () => {
        await Axios("GET", `/api_web/Api_delivery/get/${props?.id}?csrf_protection=true`, {}, (err, response) => {
            if (response && response?.data) {
                const db = response?.data;
                setData(db);
                sOnFetching(false);
            }
        });
    };

    useEffect(() => {
        onFetching && handleFetchingDetail();
    }, [open]);

    return (
        <>
            <PopupEdit
                title={props.dataLang?.delivery_receipt_detail || "delivery_receipt_detail"}
                button={props?.name}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={`${props?.className}`}
                className={props.className}
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]" />

                <div className="3xl:w-[1200px] 2xl:w-[1100px] xl:w-[999px] w-[950px] 3xl:h-auto 2xl:max-h-auto xl:h-auto h-auto ">
                    <div className=" customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 flex flex-col">
                        <GeneralInformation  {...props} />
                        <div className="grid grid-cols-12 min-h-[100px]">
                            <div className="col-span-4">
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6 ">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2 whitespace-nowrap">
                                        {props.dataLang?.delivery_receipt_date || "delivery_receipt_date"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-medium items-start col-span-4 ml-3">
                                        {data?.date != null ? moment(data?.date).format("DD/MM/YYYY") : ""}
                                    </h3>
                                </div>
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {props.dataLang?.delivery_receipt_code || "delivery_receipt_code"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px]  font-medium col-span-2 ml-3 text-[#0F4F9E]">
                                        {data?.reference_no}
                                    </h3>
                                </div>
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2 ">
                                        {props.dataLang?.delivery_receipt_address1 || "delivery_receipt_address1"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-medium col-span-4 ml-3">
                                        {data?.name_address_delivery}
                                    </h3>
                                </div>
                            </div>
                            <div className="col-span-4 ">
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {props.dataLang?.delivery_receipt_OrderNumber || "delivery_receipt_OrderNumber"}
                                        :
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-medium col-span-4 text-[#0BAA2E]">
                                        {data?.order_code}
                                    </h3>
                                </div>
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {props.dataLang?.price_quote_customer || "price_quote_customer"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-medium col-span-4">
                                        {data?.customer_name}
                                    </h3>
                                </div>
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {props.dataLang?.price_quote_contact_person || "price_quote_contact_person"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-medium col-span-4 ">
                                        {data?.person_contact_name}
                                    </h3>
                                </div>
                            </div>
                            <div className="col-span-4 ">
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {props.dataLang?.delivery_receipt_edit_User || "delivery_receipt_edit_User"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-medium col-span-2">
                                        {data?.staff_full_name}
                                    </h3>
                                </div>

                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {props.dataLang?.import_from_browse || "import_from_browse"}:
                                    </h3>
                                    <div className="flex flex-wrap gap-2 items-center">
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
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {props.dataLang?.price_quote_branch || "price_quote_branch"}:
                                    </h3>
                                    <div className="col-span-4">
                                        <TagBranch className="w-fit">
                                            {data?.branch_name}
                                        </TagBranch>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pr-2 w-[100%] ">
                            <HeaderTablePopup gridCols={12}>
                                <ColumnTablePopup colSpan={3}>
                                    {props.dataLang?.price_quote_item || "price_quote_item"}
                                </ColumnTablePopup>
                                <ColumnTablePopup>
                                    {"Kho - Vtk"}
                                </ColumnTablePopup>
                                <ColumnTablePopup>
                                    {props.dataLang?.price_quote_from_unit || "price_quote_from_unit"}
                                </ColumnTablePopup>
                                <ColumnTablePopup>
                                    {props.dataLang?.price_quote_quantity || "price_quote_quantity"}
                                </ColumnTablePopup>
                                <ColumnTablePopup>
                                    {props.dataLang?.price_quote_unit_price || "price_quote_unit_price"}
                                </ColumnTablePopup>
                                <ColumnTablePopup>
                                    {props.dataLang?.price_quote_person || "price_quote_person"}
                                </ColumnTablePopup>
                                <ColumnTablePopup>
                                    {props.dataLang?.price_quote_after_discount || "price_quote_after_discount"}
                                </ColumnTablePopup>
                                <ColumnTablePopup>
                                    {props.dataLang?.price_quote_tax || "price_quote_tax"}
                                </ColumnTablePopup>
                                <ColumnTablePopup>
                                    {props.dataLang?.price_quote_into_money || "price_quote_into_money"}
                                </ColumnTablePopup>
                                <ColumnTablePopup>
                                    {props.dataLang?.price_quote_note_item || "price_quote_note_item"}
                                </ColumnTablePopup>
                            </HeaderTablePopup>
                            {onFetching ? (
                                <Loading className="max-h-40" color="#0f4f9e" />
                            ) : data?.items?.length > 0 ? (
                                <>
                                    <ScrollArea
                                        className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px] overflow-hidden"
                                        speed={1}
                                        smoothScrolling={true}
                                    >
                                        <div className="divide-y divide-slate-200 min:h-[170px]  max:h-[170px]">
                                            {data?.items?.map((e) => (
                                                <div
                                                    className="grid items-center grid-cols-12 3xl:py-1.5 py-0.5 px-2 hover:bg-slate-100/40"
                                                    key={e.id?.toString()}
                                                >
                                                    <h6 className="text-[13px] font-medium py-1 col-span-3 text-left">
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
                                                                    {dataMaterialExpiry.is_enable === "1" ? (
                                                                        <>
                                                                            <div className="flex gap-0.5">
                                                                                <h6 className="text-[12px]">Lot:</h6>{" "}
                                                                                <h6 className="text-[12px]  px-2   w-[full] text-left ">
                                                                                    {e?.lot == null || e?.lot == ""
                                                                                        ? "-"
                                                                                        : e?.lot}
                                                                                </h6>
                                                                            </div>
                                                                            <div className="flex gap-0.5">
                                                                                <h6 className="text-[12px]">Date:</h6>{" "}
                                                                                <h6 className="text-[12px]  px-2   w-[full] text-center ">
                                                                                    {e?.expiration_date
                                                                                        ? moment(
                                                                                            e?.expiration_date
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
                                                    <h6 className="text-[12px] font-medium py-1 col-span-1 text-left flex-col flex">
                                                        <span>{e?.item?.warehouse_location?.warehouse_name}</span>
                                                        <span>{e?.item?.warehouse_location?.location_name}</span>
                                                    </h6>
                                                    <h6 className="text-[13px] font-medium py-1 col-span-1 text-center">
                                                        {e?.item?.unit_name}
                                                    </h6>
                                                    <h6 className="text-[13px] font-medium py-1 col-span-1 text-center">
                                                        {formatNumber(e?.quantity)}
                                                    </h6>
                                                    <h6 className="text-[13px] font-medium py-1 col-span-1 text-right">
                                                        {formatMoney(e?.price)}
                                                    </h6>
                                                    <h6 className="text-[13px] font-medium py-1 col-span-1 text-center">
                                                        {e?.discount_percent_item + "%"}
                                                    </h6>
                                                    <h6 className="text-[13px] font-medium py-1 col-span-1 text-right">
                                                        {formatMoney(e?.price_after_discount)}
                                                    </h6>
                                                    <h6 className="text-[13px] font-medium py-1 col-span-1 text-center">
                                                        {formatNumber(e?.tax_rate_item) + "%"}
                                                    </h6>
                                                    <h6 className="text-[13px] font-medium py-1 col-span-1 pr-2 text-right">
                                                        {formatMoney(e?.total_amount)}
                                                    </h6>
                                                    <h6 className="text-[13px] font-medium py-1 col-span-1 text-left">
                                                        {e?.note_item != undefined ? (
                                                            <ExpandableContent content={e?.note_item} />
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
                        <h2 className="font-medium p-2 3xl:text-[16px] 2xl:text-[16px] xl:text-[15px] text-[15px] border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]">
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
                                    <h3>{props.dataLang?.price_quote_total_discount || "price_quote_discount"}</h3>
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
                                    <h3>{props.dataLang?.price_quote_into_money || "price_quote_into_money"}</h3>
                                </div>
                            </div>
                            <div className="col-span-3 space-y-2">
                                <div className="font-normal mr-2.5">
                                    <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                        {formatMoney(data?.total_price)}
                                    </h3>
                                </div>
                                <div className="font-normal mr-2.5">
                                    <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                        {formatMoney(data?.total_discount)}
                                    </h3>
                                </div>
                                <div className="font-normal mr-2.5">
                                    <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                        {formatMoney(data?.total_price_after_discount)}
                                    </h3>
                                </div>
                                <div className="font-normal mr-2.5">
                                    <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                        {formatMoney(data?.total_tax_price)}
                                    </h3>
                                </div>
                                <div className="font-normal mr-2.5">
                                    <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                        {formatMoney(data?.total_amount)}
                                    </h3>
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
