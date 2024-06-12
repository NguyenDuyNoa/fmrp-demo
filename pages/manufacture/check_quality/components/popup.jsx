import { Edit as IconEdit } from "iconsax-react";
import { useEffect, useState } from "react";
import PopupEdit from "/components/UI/popup";

import apiComons from "@/Api/apiComon/apiComon";
import apiCategoryErrors from "@/Api/apiManufacture/qc/categoryErrors/apiCategoryErrors";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import useToast from "@/hooks/useToast";
import { Controller, useForm } from "react-hook-form";
import { GeneralInformation } from "@/components/UI/common/TablePopup";
import NoData from "@/components/UI/noData/nodata";
const PopupCheckQuality = (props) => {
    const isShow = useToast();
    const initilaState = {
        open: false,
    };

    const [isState, sIsState] = useState(initilaState);

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    return (
        <PopupEdit
            title={"Xem phiếu QC"}
            button={props?.name}
            onClickOpen={() => queryState({ open: true })}
            open={isState.open}
            onClose={() => queryState({ open: false })}
            classNameBtn={`${props?.className}`}
        >
            <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]" />

            <div className="3xl:w-[1200px] 2xl:w-[1100px] xl:w-[999px] w-[950px] 3xl:h-auto 2xl:max-h-auto xl:h-auto h-auto ">
                <div className="overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 flex flex-col">
                    <GeneralInformation {...props} />
                    {/* <div className="grid grid-cols-12 min-h-[100px]">
                        <div className="col-span-4">
                            <div className="xl:my-4 my-3 font-medium grid grid-cols-6 ">
                                <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2 whitespace-nowrap ">
                                    {props.dataLang?.price_quote_date || "price_quote_date"} :
                                </h3>
                                <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal items-start col-span-4 ml-3">
                                </h3>
                            </div>
                            <div className="xl:my-4 my-3 font-medium grid grid-cols-6 ">
                                <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                    {props.dataLang?.price_quote_effective_date || "price_quote_effective_date"} :
                                </h3>
                                <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px]  font-normal col-span-2 ml-3">
                                </h3>
                            </div>
                            <div className="xl:my-4 my-3 font-medium grid grid-cols-6 ">
                                <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                    {props.dataLang?.price_quote_code || "price_quote_code"} :
                                </h3>
                                <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px]  font-normal col-span-2 ml-3">
                                </h3>
                            </div>
                        </div>

                        <div className="col-span-4 ">
                            <div className="xl:my-4 my-3 font-medium grid grid-cols-6 ">
                                <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                    {props.dataLang?.price_quote_order_status || "price_quote_order_status"} :
                                </h3>
                                <h3 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[11px] text-[10px] font-normal col-span-4"></h3>
                            </div>
                            <div className="xl:my-4 my-3 font-medium grid grid-cols-6 ">
                                <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                    {props.dataLang?.price_quote_customer || "price_quote_customer"} :
                                </h3>
                                <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal col-span-4 whitespace-nowrap"></h3>
                            </div>
                            <div className="xl:my-4 my-3 font-medium grid grid-cols-6 ">
                                <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                    {props.dataLang?.price_quote_contact_person || "price_quote_contact_person"} :
                                </h3>
                                <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal col-span-4"></h3>
                            </div>
                        </div>
                    </div> */}
                    {/* <div className="pr-2 w-full">
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
                            <ColumnTablePopup>{props.dataLang?.price_quote_tax || "price_quote_tax"}</ColumnTablePopup>
                            <ColumnTablePopup>
                                {props.dataLang?.price_quote_into_money || "price_quote_into_money"}
                            </ColumnTablePopup>
                            <ColumnTablePopup>
                                {props.dataLang?.price_quote_note_item || "price_quote_note_item"}
                            </ColumnTablePopup>
                        </HeaderTablePopup>
                        {loading ? (
                            <Loading className="h-20 2xl:h-[160px]" color="#0f4f9e" />
                        ) : data?.items?.length > 0 ? (
                            <>
                                <Customscrollbar className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px] overflow-hidden">
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
                        ) : (
                            <NoData />
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
                    </div> */}
                </div>
            </div>
        </PopupEdit>
    );
};
export default PopupCheckQuality;
