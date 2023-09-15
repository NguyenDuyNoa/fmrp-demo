import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ModalImage from "react-modal-image";
import "react-datepicker/dist/react-datepicker.css";
import PopupEdit from "../../../../components/UI/popup";

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

const PopupDetail = (props) => {
    const scrollAreaRef = useRef(null);
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const [data, setData] = useState();
    const [onFetching, sOnFetching] = useState(false);

    useEffect(() => {
        props?.id && sOnFetching(true);
    }, [open]);

    const formatNumber = (num) => {
        if (!num && num !== 0) return 0;
        const roundedNum = Number(num).toFixed(2);
        return parseFloat(roundedNum).toLocaleString("en");
    };

    const handleFetchingDetail = async () => {
        await Axios("GET", `/api_web/Api_delivery/get/${props?.id}?csrf_protection=true`, {}, (err, response) => {
            if (response && response?.data) {
                var db = response?.data;

                setData(db);
                sOnFetching(false);
                setLoading(false);
            }
        });
    };

    useEffect(() => {
        onFetching && handleFetchingDetail();
    }, [open]);

    const scrollableDiv = document.querySelector(".customsroll");
    scrollableDiv?.addEventListener("wheel", (event) => {
        const deltaY = event.deltaY;
        const top = scrollableDiv.scrollTop;
        const height = scrollableDiv.scrollHeight;
        const offset = scrollableDiv.offsetHeight;
        const isScrolledToTop = top === 0;
        const isScrolledToBottom = top === height - offset;

        if ((deltaY < 0 && isScrolledToTop) || (deltaY > 0 && isScrolledToBottom)) {
            event.preventDefault();
        }
    });

    return (
        <>
            <PopupEdit
                title={"Chi tiết phiếu giao hàng"}
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
                        <h2 className="font-medium bg-[#ECF0F4] 3xl:p-2 p-1 3xl:text-[16px] 2xl:text-[16px] xl:text-[15px] text-[15px]">
                            {props?.dataLang?.detail_general_information || "detail_general_information"}
                        </h2>
                        <div className="grid grid-cols-12 min-h-[100px]">
                            <div className="col-span-4">
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6 ">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2 whitespace-nowrap">
                                        {"Ngày giao hàng"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-medium items-start col-span-4 ml-3">
                                        {data?.date != null ? moment(data?.date).format("DD/MM/YYYY") : ""}
                                    </h3>
                                </div>
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {"Số giao hàng"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px]  font-medium col-span-2 ml-3 text-[#0F4F9E]">
                                        {data?.reference_no}
                                    </h3>
                                </div>
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2 ">
                                        {"Địa chỉ giao"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-medium col-span-4 ml-3">
                                        {data?.address_delivery}
                                    </h3>
                                </div>
                            </div>
                            <div className="col-span-4 ">
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {"Số đơn hàng"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-medium col-span-4 text-[#0BAA2E]">
                                        {data?.reference_order?.reference_order}
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
                                        {data?.contact_name && data?.contact_id !== "0" ? data?.contact_name : ""}
                                    </h3>
                                </div>
                            </div>
                            <div className="col-span-4 ">
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {"Người dùng"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-medium col-span-2">
                                        {data?.staff_name}
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
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[10px]  col-span-4 mr-2 px-2 max-w-[250px] w-fit max-h-[100px] text-center text-[#0F4F9E]  font-[400] py-0.5 border border-[#0F4F9E] rounded-[5.5px] ">
                                        {data?.branch_name}
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="pr-2 w-[100%] lx:w-[110%] ">
                            <div className="grid grid-cols-12 items-center sticky rounded-t-xl top-0 bg-slate-100 p-2 z-10">
                                <h4 className="text-[13px] px-1 py-1 text-gray-600 uppercase  font-[600] col-span-3 text-center whitespace-nowrap">
                                    {props.dataLang?.price_quote_item || "price_quote_item"}
                                </h4>
                                <h4 className="text-[13px] px-1 py-1 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                    {props.dataLang?.price_quote_from_unit || "price_quote_from_unit"}
                                </h4>
                                <h4 className="text-[13px] px-1 py-1 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                    {props.dataLang?.price_quote_quantity || "price_quote_quantity"}
                                </h4>
                                <h4 className="text-[13px] px-1 py-1 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                    {props.dataLang?.price_quote_unit_price || "price_quote_unit_price"}
                                </h4>
                                <h4 className="text-[13px] px-1 py-1 text-gray-600 uppercase  font-[600] col-span-1 text-center ">
                                    {props.dataLang?.price_quote_person || "price_quote_person"}
                                </h4>
                                <h4 className="text-[13px] px-1 py-1 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                    {props.dataLang?.price_quote_after_discount || "price_quote_after_discount"}
                                </h4>
                                <h4 className="text-[13px] px-1 py-1 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                    {props.dataLang?.price_quote_tax || "price_quote_tax"}
                                </h4>
                                <h4 className="text-[13px] px-1 py-1 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                    {props.dataLang?.price_quote_into_money || "price_quote_into_money"}
                                </h4>
                                <h4 className="text-[13px] px-1 py-1 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-normal">
                                    {props.dataLang?.price_quote_note_item || "price_quote_note_item"}
                                </h4>
                            </div>
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
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <h2 className="text-sm">{e?.item_name}</h2>
                                                                <h3 className="italic text-xs">
                                                                    {e?.item?.product_variation}
                                                                </h3>
                                                            </div>
                                                        </div>
                                                    </h6>
                                                    <h6 className="text-[13px] font-medium py-1 col-span-1 text-center">
                                                        {e?.item?.unit_name}
                                                    </h6>
                                                    <h6 className="text-[13px] font-medium py-1 col-span-1 text-center">
                                                        {formatNumber(e?.quantity)}
                                                    </h6>
                                                    <h6 className="text-[13px] font-medium py-1 col-span-1 text-right">
                                                        {formatNumber(e?.price)}
                                                    </h6>
                                                    <h6 className="text-[13px] font-medium py-1 col-span-1 text-center">
                                                        {e?.discount_percent + "%"}
                                                    </h6>
                                                    <h6 className="text-[13px] font-medium py-1 col-span-1 text-right">
                                                        {formatNumber(e?.price_after_discount)}
                                                    </h6>
                                                    <h6 className="text-[13px] font-medium py-1 col-span-1 text-center">
                                                        {formatNumber(e?.tax_rate) + "%"}
                                                    </h6>
                                                    <h6 className="text-[13px] font-medium py-1 col-span-1 pr-2 text-right">
                                                        {formatNumber(e?.amount)}
                                                    </h6>
                                                    <h6 className="text-[13px] font-medium py-1 col-span-2 text-left">
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
                                        {formatNumber(data?.total_price)}
                                    </h3>
                                </div>
                                <div className="font-normal mr-2.5">
                                    <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                        {formatNumber(data?.total_discount)}
                                    </h3>
                                </div>
                                <div className="font-normal mr-2.5">
                                    <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                        {formatNumber(data?.total_price_after_discount)}
                                    </h3>
                                </div>
                                <div className="font-normal mr-2.5">
                                    <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                        {formatNumber(data?.total_tax_price)}
                                    </h3>
                                </div>
                                <div className="font-normal mr-2.5">
                                    <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                        {formatNumber(data?.total_amount)}
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
