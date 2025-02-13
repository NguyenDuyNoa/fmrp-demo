import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import NoData from "@/components/UI/noData/nodata";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import useFeature from "@/hooks/useConfigFeature";
import { formatMoment } from "@/utils/helpers/formatMoment";
import Loading from "@/components/UI/loading/loading";
import vi from "date-fns/locale/vi";
import { useEffect, useState } from "react";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalImage from "react-modal-image";
import PopupCustom from "/components/UI/popup";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import useSetingServer from "@/hooks/useConfigNumber";
registerLocale("vi", vi);


const Popup_status = (props) => {
    const dataLang = props?.dataLang;

    const [data, sData] = useState([]);

    const dataSeting = useSetingServer()

    const [open, sOpen] = useState(false);

    const [onFetching, sOnFetching] = useState(false);

    const { dataMaterialExpiry, dataProductExpiry, dataProductSerial } = useFeature();

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

        if (props?.data_export?.length > 0) {
            setTimeout(() => {
                sOpen(true);
                sData(props?.data_export);
            }, 1000);
        }
    }, [props?.data_export]);

    return (
        <PopupCustom
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
                                {props.dataLang?.purchase_order_purchase_from_item || "purchase_order_purchase_from_item"}
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
                                                {e?.date_coupon != null ? formatMoment(e?.date_coupon, FORMAT_MOMENT.DATE_SLASH_LONG) : ""}
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
                                                                    small="/nodata.png"
                                                                    large="/nodata.png"
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
                                                                        {e.serial == null || e.serial == "" ? "-" : e.serial}
                                                                    </h6>
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )}
                                                            {dataMaterialExpiry.is_enable === "1" || dataProductExpiry.is_enable === "1" ? (
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
        </PopupCustom>
    );
};
export default Popup_status;
