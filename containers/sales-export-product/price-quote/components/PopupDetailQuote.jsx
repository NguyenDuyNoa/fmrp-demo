import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { ColumnTablePopup, GeneralInformation, HeaderTablePopup } from "@/components/UI/common/TablePopup";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import Loading from "@/components/UI/loading/loading";
import NoData from "@/components/UI/noData/nodata";
import PopupCustom from "@/components/UI/popup";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import useSetingServer from "@/hooks/useConfigNumber";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ModalImage from "react-modal-image";
import { usePriceQuoteDetail } from "../hooks/usePriceQuoteDetail";


const PopupDetailQuote = (props) => {

    const dataSeting = useSetingServer()

    const [open, sOpen] = useState(false);

    const _ToggleModal = (e) => sOpen(e);

    const formatNumber = (num) => {
        return formatNumberConfig(+num, dataSeting)
    };

    const formatMoney = (num) => {
        return formatMoneyConfig(+num, dataSeting);
    };

    const { data, isFetching } = usePriceQuoteDetail(open, props?.id)

    return (
        <>
            <PopupCustom
                title={props.dataLang?.price_quote_popup_detail_title || "price_quote_popup_detail_title"}
                button={props?.name}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={`${props?.className}`}
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]" />

                <div className="3xl:w-[1200px] 2xl:w-[1100px] xl:w-[999px] w-[950px] 3xl:h-auto 2xl:max-h-auto xl:h-auto h-auto ">
                    <div className="overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 flex flex-col">
                        <GeneralInformation  {...props} />
                        <div className="grid grid-cols-12 min-h-[100px]">
                            <div className="col-span-4">
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6 ">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2 whitespace-nowrap ">
                                        {props.dataLang?.price_quote_date || "price_quote_date"} :
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal items-start col-span-4 ml-3">
                                        {data?.date != null ? formatMoment(data?.date, FORMAT_MOMENT.DATE_TIME_SLASH_LONG) : ""}
                                    </h3>
                                </div>
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6 ">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {props.dataLang?.price_quote_effective_date || "price_quote_effective_date"} :
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px]  font-normal col-span-2 ml-3">
                                        {data?.validity != null ? formatMoment(data?.validity, FORMAT_MOMENT.DATE_SLASH_LONG) : ""}
                                    </h3>
                                </div>
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6 ">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {props.dataLang?.price_quote_code || "price_quote_code"} :
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px]  font-normal col-span-2 ml-3">
                                        {data?.reference_no}
                                    </h3>
                                </div>
                            </div>

                            <div className="col-span-4 ">
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6 ">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {props.dataLang?.price_quote_order_status || "price_quote_order_status"} :
                                    </h3>
                                    <h3 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[11px] text-[10px] font-normal col-span-4">
                                        {(data?.status == "not_confirmed" && (
                                            <span className="border flex justify-center items-center rounded-2xl 3xl:w-24 2xl:w-[88px] xl:w-[74px] lg:w-16 3xl:h-7 2xl:h-6 xl:h-5 lg:h-5 px-1  bg-red-200 border-red-200 text-red-500">
                                                Chưa Duyệt
                                            </span>
                                        )) ||
                                            (data?.status == "no_confirmed" && (
                                                <span className="border flex justify-center items-center rounded-2xl 3xl:w-24 2xl:w-[88px] xl:w-[74px] lg:w-16 3xl:h-7 2xl:h-6 xl:h-5 lg:h-5 px-1 bg-blue-200 border-blue-200 text-blue-500">
                                                    Không Duyệt
                                                </span>
                                            )) ||
                                            (data?.status == "confirmed" && (
                                                <span className="border flex justify-center items-center rounded-2xl 3xl:w-24 2xl:w-20 xl:w-[74px] lg:w-[68px] 3xl:h-6 2xl:h-6 xl:h-5 lg:h-5 px-1 bg-lime-200 border-lime-200 text-lime-500">
                                                    Đã Duyệt
                                                </span>
                                            )) ||
                                            (data?.status == "ordered" && (
                                                <span className="border flex justify-center items-center rounded-2xl 3xl:w-[150px] 2xl:w-36 xl:w-36 lg:w-32 3xl:h-7 2xl:h-6 xl:h-5 lg:h-5 3xl:p-2 px-1 bg-orange-200 border-organe-200 text-orange-500">
                                                    Đã Tạo Đặt Đơn Hàng
                                                </span>
                                            ))}
                                    </h3>
                                </div>
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6 ">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {props.dataLang?.price_quote_customer || "price_quote_customer"} :
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal col-span-4 whitespace-nowrap">
                                        {data?.client_name}
                                    </h3>
                                </div>
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6 ">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {props.dataLang?.price_quote_contact_person || "price_quote_contact_person"} :
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal col-span-4">
                                        {data?.contact_name}
                                    </h3>
                                </div>
                            </div>
                            <div className="col-span-4 ">
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6 ">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {props.dataLang?.price_quote_branch || "price_quote_branch"} :
                                    </h3>
                                    <div className="w-full">
                                        <TagBranch className="w-fit truncate">
                                            {data?.branch_name}
                                        </TagBranch>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pr-2 w-full">
                            <HeaderTablePopup gridCols={12} display="grid">
                                <ColumnTablePopup>
                                    {props.dataLang?.price_quote_image || "price_quote_image"}
                                </ColumnTablePopup>
                                <ColumnTablePopup>
                                    {props.dataLang?.price_quote_item || "price_quote_item"}
                                </ColumnTablePopup>
                                <ColumnTablePopup colSpan={2}>
                                    {props.dataLang?.price_quote_variant || "price_quote_variant"}
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
                            {(isFetching) ? (
                                <Loading className="h-20 2xl:h-[160px]" color="#0f4f9e" />
                            ) : data?.items?.length > 0 ? (
                                <>
                                    <Customscrollbar
                                        className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px] overflow-hidden"
                                    >
                                        <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">
                                            {data?.items?.map((e) => (
                                                <div
                                                    className="grid items-center grid-cols-12 py-1.5 px-2 hover:bg-slate-100/40"
                                                    key={e.id?.toString()}
                                                >
                                                    <h6 className="text-[13px] mx-auto  py-0.5 col-span-1  rounded-md text-left">
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
                                                    <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-left">
                                                        {e?.item?.name}
                                                    </h6>
                                                    <h6 className="text-[13px]  px-2 py-0.5 col-span-2  rounded-md text-left break-words">
                                                        {e?.item?.product_variation}
                                                    </h6>
                                                    <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center break-words">
                                                        {e?.item?.unit_name}
                                                    </h6>
                                                    <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                        {formatNumber(e?.quantity)}
                                                    </h6>
                                                    <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-right">
                                                        {formatMoney(e?.price)}
                                                    </h6>
                                                    <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                        {e?.discount_percent + "%"}
                                                    </h6>
                                                    <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-right">
                                                        {formatMoney(e?.price_after_discount)}
                                                    </h6>
                                                    <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                        {formatNumber(e?.tax_rate) + "%"}
                                                    </h6>
                                                    <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-right">
                                                        {formatMoney(e?.amount)}
                                                    </h6>
                                                    <h6 className="text-[12px] px-2 col-span-1 rounded-md text-left whitespace-normal">
                                                        {e?.note != undefined ? e?.note : ""}
                                                    </h6>
                                                </div>
                                            ))}
                                        </div>
                                    </Customscrollbar>
                                </>
                            ) : <NoData />}
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
                                    <h3>{props.dataLang?.price_quote_total_discount || "price_quote_discount"}</h3>
                                </div>
                                <div className="font-normal text-left 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                    <h3>
                                        {props.dataLang?.price_quote_total_money_after_discount || "price_quote_money_after_discount"}
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
            </PopupCustom>
        </>
    );
};

export default PopupDetailQuote;
