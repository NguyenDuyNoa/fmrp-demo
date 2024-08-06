import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { ColumnTablePopup, HeaderTablePopup } from "@/components/UI/common/TablePopup";
import Loading from "@/components/UI/loading/loading";
import NoData from "@/components/UI/noData/nodata";
import PopupCustom from "@/components/UI/popup";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import useFeature from "@/hooks/useConfigFeature";
import useSetingServer from "@/hooks/useConfigNumber";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { useEffect, useState } from "react";

const Popup_status = (props) => {
    const dataLang = props?.dataLang;
    const [onFetching, sOnFetching] = useState(false);
    const [open, sOpen] = useState(false);
    const [data, sData] = useState([]);
    const dataSeting = useSetingServer()
    const { dataMaterialExpiry, dataProductExpiry, dataProductSerial } = useFeature()
    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    useEffect(() => {
        open && sOnFetching(true);
        setTimeout(() => {
            sOnFetching(false);
        }, 800);
    }, [open]);

    useEffect(() => {
        sData([]);
        sOpen(false);
        if (props?.dataExport?.length > 0) {
            setTimeout(() => {
                sOpen(true);
                sData(props?.dataExport);
            }, 1000);
        }
    }, [props?.dataExport]);

    return (
        <PopupCustom
            title={props.dataLang?.inventory_votes || "inventory_votes"}
            open={open}
            onClose={() => sOpen(false)}
            classNameBtn={props.className}
        >
            <div className=" space-x-5 3xl:w-[1250px] 2xl:w-[1100px] w-[1050px] 3xl:h-auto  2xl:h-auto xl:h-[540px] h-[500px] ">
                <Customscrollbar className="min:h-[200px] h-[82%] max:h-[500px]  overflow-auto pb-2">
                    <div className="pr-2 w-[100%] lx:w-[120%] ">
                        <HeaderTablePopup
                            gridCols={
                                dataProductSerial.is_enable == "1"
                                    ? dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? 12
                                        : dataMaterialExpiry.is_enable == "1" ? 12 : 10
                                    : dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? 11
                                        : dataMaterialExpiry.is_enable == "1" ? 11 : 9
                            }
                        >
                            <ColumnTablePopup colSpan={2}>
                                {props.dataLang?.inventory_dayvouchers || "inventory_dayvouchers"}
                            </ColumnTablePopup>
                            <ColumnTablePopup>
                                {props.dataLang?.inventory_vouchercode || "inventory_vouchercode"}
                            </ColumnTablePopup>
                            <ColumnTablePopup>
                                {props.dataLang?.import_ballot || "import_ballot"}
                            </ColumnTablePopup>
                            {dataProductSerial.is_enable === "1" && (
                                <ColumnTablePopup>
                                    {"Serial"}
                                </ColumnTablePopup>
                            )}
                            {dataMaterialExpiry.is_enable === "1" || dataProductExpiry.is_enable === "1" ? (
                                <>
                                    <ColumnTablePopup>
                                        {"Lot"}
                                    </ColumnTablePopup>
                                    <ColumnTablePopup>
                                        {props.dataLang?.warehouses_detail_date || "warehouses_detail_date"}
                                    </ColumnTablePopup>
                                </>
                            ) : (
                                ""
                            )}
                            <ColumnTablePopup colSpan={2}>
                                {props.dataLang?.purchase_order_purchase_from_item || "purchase_order_purchase_from_item"}
                            </ColumnTablePopup>
                            <ColumnTablePopup colSpan={2}>
                                {props.dataLang?.PDF_house || "PDF_house"}
                            </ColumnTablePopup>
                            <ColumnTablePopup>
                                {props.dataLang?.purchase_quantity || "purchase_quantity"}
                            </ColumnTablePopup>
                        </HeaderTablePopup>
                        {onFetching ? (
                            <Loading className="h-50" color="#0f4f9e" />
                        ) : data?.length > 0 ? (
                            <>
                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[500px] mt-2 ">
                                    {data?.map((e) => (
                                        <div
                                            className={`${dataProductSerial.is_enable == "1"
                                                ? dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-12" : dataMaterialExpiry.is_enable == "1" ? "grid-cols-12" : "grid-cols-10"
                                                : dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-11" : dataMaterialExpiry.is_enable == "1" ? "grid-cols-11" : "grid-cols-9"
                                                }  grid hover:bg-slate-50 items-center`}
                                        >
                                            <h6 className="text-[13px] px-2 py-1.5 col-span-2 text-center">
                                                {e?.date_coupon != null ? formatMoment(e?.date_coupon, FORMAT_MOMENT.DATE_SLASH_LONG) : ""}
                                            </h6>
                                            <h6 className="text-[13px] px-2 py-1.5 col-span-1 text-center hover:font-normal cursor-pointer">
                                                {e?.code_coupon}
                                            </h6>
                                            <h6 className="text-[13px] px-2 py-1.5 col-span-1 text-left hover:font-normal cursor-pointer">
                                                {dataLang[e?.type_text]}
                                            </h6>

                                            {dataProductSerial.is_enable === "1" ? (
                                                <div className=" col-span-1 ">
                                                    <h6 className="text-[13px] px-2 py-1.5  w-[full] text-center">
                                                        {e.serial == null || e.serial == "" ? "-" : e.serial}
                                                    </h6>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                            {dataMaterialExpiry.is_enable === "1" || dataProductExpiry.is_enable === "1" ? (
                                                <>
                                                    <div className=" col-span-1  ">
                                                        <h6 className="text-[13px] px-2 py-1.5 w-[full] text-center">
                                                            {e.lot == null || e.lot == "" ? "-" : e.lot}
                                                        </h6>
                                                    </div>
                                                    <div className=" col-span-1  ">
                                                        <h6 className="text-[13px] px-2 py-1.5 w-[full] text-center">
                                                            {e.expiration_date ? formatMoment(e.expiration_date, FORMAT_MOMENT.DATE_SLASH_LONG) : "-"}
                                                        </h6>
                                                    </div>
                                                </>
                                            ) : (
                                                ""
                                            )}
                                            <h6 className="text-[13px] px-2 py-1.5 col-span-2   hover:font-normal cursor-pointer">
                                                <div className="">
                                                    <h4 className="text-[13px] px-2 py-1.5  w-[full] ">
                                                        {e?.name}
                                                    </h4>
                                                    <h4 className="text-[13px] px-2 py-1.5  w-[full] ">
                                                        {e?.product_variation}
                                                    </h4>
                                                </div>
                                            </h6>
                                            <h6 className="text-[13px] px-2 py-1.5 col-span-2 text-left hover:font-normal cursor-pointer">
                                                <div className="flex flex-col">
                                                    <span className="">
                                                        Kho: {e?.warehouse_name}
                                                    </span>
                                                    <span className="">
                                                        Vị trí kho:  {e?.local_name}
                                                    </span>
                                                </div>
                                            </h6>
                                            <h6 className="text-[13px] px-2 py-1.5 col-span-1 text-center hover:font-normal cursor-pointer">
                                                {formatNumber(e?.quantity)}
                                            </h6>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : <NoData />}
                    </div>
                </Customscrollbar>
            </div>
        </PopupCustom>
    );
};
export default Popup_status;
