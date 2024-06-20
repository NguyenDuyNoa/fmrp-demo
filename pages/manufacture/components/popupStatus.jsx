import { useEffect, useState } from "react";

import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import Loading from "@/components/UI/loading";
import NoData from "@/components/UI/noData/nodata";
import PopupEdit from "@/components/UI/popup";

import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import useFeature from "@/hooks/useConfigFeature";
import useSetingServer from "@/hooks/useConfigNumber";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatNumberConfig from "@/utils/helpers/formatnumber";

const Popup_status = (props) => {
    const dataLang = props?.dataLang;

    const [data, sData] = useState([]);

    const dataSeting = useSetingServer()

    const [open, sOpen] = useState(false);

    const [onFetching, sOnFetching] = useState(false);

    const { dataMaterialExpiry, dataProductExpiry, dataProductSerial } = useFeature()

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting)
    };

    useEffect(() => {
        open && sOnFetching(true)
        setTimeout(() => {
            sOnFetching(false)
        }, 500)
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
                <Customscrollbar className="min:h-[200px] h-[82%] max:h-[500px]">
                    <div className="w-full">
                        <HeaderTable gridCols={8} >
                            <ColumnTable colSpan={1} textAlign={'center'}>
                                {props.dataLang?.inventory_dayvouchers || "inventory_dayvouchers"}
                            </ColumnTable>
                            <ColumnTable colSpan={1} textAlign={'center'}>
                                {props.dataLang?.inventory_vouchercode || "inventory_vouchercode"}
                            </ColumnTable>
                            <ColumnTable colSpan={1} textAlign={'center'}>
                                {props.dataLang?.import_ballot || "import_ballot"}
                            </ColumnTable>
                            <ColumnTable colSpan={2} textAlign={'center'}>
                                {props.dataLang?.purchase_order_purchase_from_item || "purchase_order_purchase_from_item"}
                            </ColumnTable>
                            <ColumnTable colSpan={2} textAlign={'center'}>
                                {props.dataLang?.PDF_house || "PDF_house"}
                            </ColumnTable>
                            <ColumnTable colSpan={1} textAlign={'center'}>
                                {props.dataLang?.purchase_quantity || "purchase_quantity"}
                            </ColumnTable>
                        </HeaderTable>
                        {onFetching ? (
                            <Loading className="h-24" color="#0f4f9e" />
                        ) : data?.length > 0 ? (
                            <>
                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[500px] mt-2 ">
                                    {data?.map((e) => (
                                        <RowTable gridCols={8} >
                                            <RowItemTable colSpan={1} textAlign={'center'}>
                                                {e?.date_coupon != null ? formatMoment(e?.date_coupon, FORMAT_MOMENT.DATE_SLASH_LONG) : ""}
                                            </RowItemTable>
                                            <RowItemTable colSpan={1} textAlign={'center'}>
                                                {e?.code_coupon}
                                            </RowItemTable>
                                            <RowItemTable colSpan={1} textAlign={'center'} >
                                                {dataLang[e?.type_text]}
                                            </RowItemTable>
                                            <RowItemTable colSpan={2} textAlign={'left'}>
                                                <div className="">
                                                    <div className="flex flex-col">
                                                        <h4 className="text-[13px] w-[full] ">{e?.name}</h4>
                                                        <h4 className="text-[13px] w-[full] ">
                                                            {e?.product_variation}
                                                        </h4>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {(props.type == "productsWarehouse" || props.type == "warehouseTransfer") &&
                                                            dataProductSerial.is_enable === "1" ? (
                                                            <div className="flex gap-1 items-center italic font-normal text-[12px]">
                                                                <h6>Serial: </h6>
                                                                <h6 className="px-2 w-[full] text-center">
                                                                    {e.serial == null || e.serial == "" ? "-" : e.serial}
                                                                </h6>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}
                                                        {props.type == "productsWarehouse" || (props.type == "warehouseTransfer" &&
                                                            dataProductExpiry.is_enable === "1") || props.type == "recall" ||
                                                            (props.type == "warehouseTransfer" && dataMaterialExpiry.is_enable === "1") ? (
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
                                                                        {e.expiration_date ? formatMoment(e.expiration_date, FORMAT_MOMENT.DATE_SLASH_LONG) : "-"}
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                </div>
                                            </RowItemTable>
                                            <RowItemTable colSpan={2} textAlign={'left'}>
                                                <div className="flex flex-col">
                                                    <span className="">
                                                        Kho: {e?.warehouse_name}
                                                    </span>
                                                    <span className="">
                                                        Vị trí kho:  {e?.local_name}
                                                    </span>
                                                </div>
                                            </RowItemTable>
                                            <RowItemTable colSpan={1} textAlign={'center'}>
                                                {formatNumber(e?.quantity)}
                                            </RowItemTable>
                                        </RowTable>
                                    ))}
                                </div>
                            </>
                        ) : <NoData />}
                    </div>
                </Customscrollbar>
            </div>
        </PopupEdit>
    );
};
export default Popup_status;
