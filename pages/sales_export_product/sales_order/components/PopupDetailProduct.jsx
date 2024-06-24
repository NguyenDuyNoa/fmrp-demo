import { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ModalImage from "react-modal-image";
import PopupEdit from "../../../../components/UI/popup";

import { SearchNormal1 as IconSearch, TickCircle } from "iconsax-react";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import vi from "date-fns/locale/vi";
registerLocale("vi", vi);

import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { ColumnTablePopup, GeneralInformation, HeaderTablePopup } from "@/components/UI/common/tablePopup";
import TagBranch from "@/components/UI/common/tag/TagBranch";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import useSetingServer from "@/hooks/useConfigNumber";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatMoney from "@/utils/helpers/formatMoney";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";

const PopupDetailProduct = (props) => {
    const scrollAreaRef = useRef(null);
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const [data, setData] = useState();
    const [onFetching, sOnFetching] = useState(false);
    const [loading, setLoading] = useState(false);
    const datatSetingFomart = useSetingServer()
    useEffect(() => {
        props?.id && sOnFetching(true);
    }, [open]);

    const formatNumber = (num) => {
        // if (!num && num !== 0) return 0;
        // const roundedNum = Number(num).toFixed(2);
        // return parseFloat(roundedNum).toLocaleString("en");
        return formatNumberConfig(+num, datatSetingFomart)
    };

    const formatNumberMoney = (num) => {
        if (!num && num !== 0) return 0;
        return formatMoney(+num, datatSetingFomart)
    }

    const handleFetchingDetailQuote = async () => {
        setLoading(true);
        await Axios(
            "GET",
            `/api_web/Api_sale_order/saleOrder/${props?.id}?csrf_protection=true`,
            {},
            (err, response) => {
                if (response && response?.data) {
                    var db = response?.data;

                    setData(db);
                    sOnFetching(false);
                    setLoading(false);
                }
            }
        );
    };

    useEffect(() => {
        onFetching && handleFetchingDetailQuote();
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
                title={props.dataLang?.sales_product_popup_detail_title || "sales_product_popup_detail_title"}
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
                                        {props.dataLang?.sales_product_date || "sales_product_date"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal items-start col-span-4 ml-3">
                                        {data?.date != null ? formatMoment(data?.date, FORMAT_MOMENT.DATE_TIME_SLASH_LONG) : ""}
                                    </h3>
                                </div>
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {props.dataLang?.sales_product_code || "sales_product_code"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px]  font-normal col-span-2 ml-3">
                                        {data?.code}
                                    </h3>
                                </div>
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2 ">
                                        {props.dataLang?.sales_product_order_type || "sales_product_order_type"}:
                                    </h3>
                                    <h3 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[10px] text-[10px] col-span-4 ml-3">
                                        {data?.quote_code !== null && data?.quote_id !== "0" ? (
                                            <div className="border flex justify-center items-center rounded-2xl 3xl:w-24 2xl:w-[88px] xl:w-[80px] lg:w-[80px] 3xl:h-6 2xl:h-6 xl:h-5 lg:h-5 px-1 bg-lime-200 border-lime-200 text-lime-500">
                                                Phiếu báo giá
                                            </div>
                                        ) : (
                                            <div className="border flex justify-center items-center rounded-2xl 3xl:w-24 2xl:w-[88px] xl:w-[80px] lg:w-[80px] 3xl:h-6 2xl:h-6 xl:h-5 lg:h-5 px-1 bg-red-200 border-red-200 text-red-500">
                                                Tạo mới
                                            </div>
                                        )}
                                    </h3>
                                </div>
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2 ">
                                        {props.dataLang?.sales_product_statusTT || "sales_product_statusTT"}:
                                    </h3>
                                    {(data?.status_payment === "payment_unpaid" && (
                                        <span className="3xl:text-[12px] 2xl:text-[11px] xl:text-[10px] text-[10px] col-span-4 ml-3 block font-normal text-sky-500  rounded-xl py-1 px-2 3xl:w-[130px] 2xl:w-[120px] xl:w-[110px] lg:w-[110px] w-[100px]  bg-sky-200 text-center">
                                            {props.dataLang[data?.status_payment] || data?.status_payment}
                                        </span>
                                    )) ||
                                        (data?.status_payment === "payment_partially_paid" && (
                                            <span className="3xl:text-[12px] 2xl:text-[11px] xl:text-[10px] text-[10px] col-span-4 ml-3 block font-normal text-orange-500 rounded-xl py-1.5 px-2 3xl:w-[140px] 2xl:w-[130px] xl:w-[120px] lg:w-[120px] w-[110px]  bg-orange-200 text-center">
                                                {props.dataLang[data?.status_payment] || data?.status_payment}{" "}
                                                {`(${formatNumber(data?.total_payment)})`}
                                            </span>
                                        )) ||
                                        (data?.status_payment === "payment_paid" && (
                                            <span className="3xl:text-[12px] 2xl:text-[11px] xl:text-[10px] text-[10px] col-span-4 ml-3 flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 3xl:w-[130px] 2xl:w-[120px] xl:w-[110px] lg:w-[110px] w-[100px]  bg-lime-200 text-center">
                                                <TickCircle
                                                    className="bg-lime-500 rounded-full"
                                                    color="white"
                                                    size={15}
                                                />
                                                {props.dataLang[data?.status_payment] || data?.status_payment}
                                            </span>
                                        ))}
                                </div>
                            </div>

                            <div className="col-span-4 ">
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {props.dataLang?.price_quote_code || "price_quote_code"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal col-span-4">
                                        {data?.quote_code}
                                    </h3>
                                </div>
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {props.dataLang?.price_quote_customer || "price_quote_customer"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal col-span-4">
                                        {data?.client_name}
                                    </h3>
                                </div>
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {props.dataLang?.price_quote_contact_person || "price_quote_contact_person"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal col-span-4">
                                        {data?.contact_name && data?.contact_id !== "0" ? data?.contact_name : ""}
                                    </h3>
                                </div>
                            </div>
                            <div className="col-span-4 ">
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {props.dataLang?.sales_product_staff_in_charge ||
                                            "sales_product_staff_in_charge"}
                                        :
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px]  font-normal col-span-2">
                                        {data?.staff_name}
                                    </h3>
                                </div>

                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {props.dataLang?.price_quote_order_status || "price_quote_order_status"}:
                                    </h3>
                                    <h3 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[11px] text-[10px] font-normal col-span-4">
                                        {(data?.status == "un_approved" && (
                                            <span className="border flex justify-center items-center rounded-2xl 3xl:w-24 2xl:w-20 xl:w-[74px] lg:w-[68px] 3xl:h-6 2xl:h-6 xl:h-5 lg:h-5 px-1 bg-red-200 border-red-200 text-red-500">
                                                Chưa Duyệt
                                            </span>
                                        )) ||
                                            (data?.status == "approved" && (
                                                <span className="border flex justify-center items-center rounded-2xl 3xl:w-24 2xl:w-20 xl:w-[74px] lg:w-[68px] 3xl:h-6 2xl:h-6 xl:h-5 lg:h-5 px-1 bg-lime-200 border-lime-200 text-lime-500">
                                                    Đã Duyệt
                                                </span>
                                            ))}
                                    </h3>
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
                            <HeaderTablePopup gridCols={12} display="grid">
                                <ColumnTablePopup >
                                    {props.dataLang?.price_quote_image || "price_quote_image"}
                                </ColumnTablePopup>
                                <ColumnTablePopup>
                                    {props.dataLang?.price_quote_item || "price_quote_item"}
                                </ColumnTablePopup>
                                <ColumnTablePopup>
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
                                <ColumnTablePopup >
                                    {props.dataLang?.price_quote_after_discount || "price_quote_after_discount"}
                                </ColumnTablePopup>
                                <ColumnTablePopup >
                                    {props.dataLang?.price_quote_tax || "price_quote_tax"}
                                </ColumnTablePopup>
                                <ColumnTablePopup >
                                    {props.dataLang?.price_quote_into_money || "price_quote_into_money"}
                                </ColumnTablePopup>
                                <ColumnTablePopup >
                                    {props.dataLang?.sales_product_item_date || "sales_product_item_date"}
                                </ColumnTablePopup>
                                <ColumnTablePopup>
                                    {props.dataLang?.price_quote_note_item || "price_quote_note_item"}
                                </ColumnTablePopup>
                            </HeaderTablePopup>
                            {loading ? (
                                <Loading className="h-20 2xl:h-[160px]" color="#0f4f9e" />
                            ) : data?.items?.length > 0 ? (
                                <>
                                    <Customscrollbar
                                        className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px] overflow-hidden"
                                    >
                                        <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">
                                            {data?.items?.map((e) => (
                                                <div
                                                    className="grid items-center grid-cols-12 3xl:py-1.5 py-0.5 px-2 hover:bg-slate-100/40"
                                                    key={e.id?.toString()}
                                                >
                                                    <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]   py-0.5 col-span-1  rounded-md text-center">
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
                                                    <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-left">
                                                        {e?.item?.name}
                                                    </h6>
                                                    <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-left break-words">
                                                        {e?.item?.product_variation}
                                                    </h6>
                                                    <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-center break-words">
                                                        {e?.item?.unit_name}
                                                    </h6>
                                                    <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                        {formatNumber(e?.quantity)}
                                                    </h6>
                                                    <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-right">
                                                        {formatNumberMoney(e?.price)}
                                                    </h6>
                                                    <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                        {e?.discount_percent + "%"}
                                                    </h6>
                                                    <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-right">
                                                        {formatNumberMoney(e?.price_after_discount)}
                                                    </h6>
                                                    <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                        {formatNumber(e?.tax_rate) + "%"}
                                                    </h6>
                                                    <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1 pr-2 rounded-md text-right">
                                                        {formatNumberMoney(e?.amount)}
                                                    </h6>
                                                    <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px] col-span-1 rounded-md text-center whitespace-normal">
                                                        {e?.delivery_date != null ? formatMoment(e?.delivery_date, FORMAT_MOMENT.DATE_SLASH_LONG) : ""}
                                                    </h6>
                                                    <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px] pl-4 col-span-1 rounded-md text-left whitespace-normal">
                                                        {e?.note != undefined ? e?.note : ""}
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
                                        {formatNumberMoney(data?.total_price)}
                                    </h3>
                                </div>
                                <div className="font-normal mr-2.5">
                                    <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                        {formatNumberMoney(data?.total_discount)}
                                    </h3>
                                </div>
                                <div className="font-normal mr-2.5">
                                    <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                        {formatNumberMoney(data?.total_price_after_discount)}
                                    </h3>
                                </div>
                                <div className="font-normal mr-2.5">
                                    <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                        {formatNumberMoney(data?.total_tax_price)}
                                    </h3>
                                </div>
                                <div className="font-normal mr-2.5">
                                    <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                        {formatNumberMoney(data?.total_amount)}
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

export default PopupDetailProduct;
