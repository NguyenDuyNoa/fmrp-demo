import moment from "moment";
import { Box1 } from "iconsax-react";
import PopupEdit from "@/components/UI/popup";
import React, { useEffect, useState } from "react";
import { _ServerInstance as Axios } from "/services/axios";
const Popup_KeepStock = ({ dataLang, id, onRefresh, ...props }) => {
    const [data, sData] = useState();
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const [onFetching, sOnFetching] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        id && sOnFetching(true);
    }, [open]);

    const handleFetching = () => {
        setLoading(true);
        Axios("GET", `/api_web/Api_sale_order/saleOrder/${id}?csrf_protection=true`, {}, (err, response) => {
            if (response && response?.data) {
                var db = response?.data;
                sData(db);
                sOnFetching(false);
                setLoading(false);
            }
        });
    };

    useEffect(() => {
        onFetching && handleFetching();
    }, [open]);
    return (
        <>
            <PopupEdit
                title={"Chi tiết giữ kho"}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={""}
                button={
                    <button className="group transition-all ease-in-out flex items-center justify-center gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full">
                        <Box1
                            size={20}
                            className="group-hover:text-orange-500 group-hover:scale-110 group-hover:shadow-md "
                        />
                        <p className="group-hover:text-orange-500 pr-4">{"Giữ kho"}</p>
                    </button>
                }
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <div className="3xl:w-[1200px] 2xl:w-[1100px] xl:w-[999px] w-[950px] 3xl:h-auto 2xl:max-h-auto xl:h-auto h-auto ">
                    <div className=" customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 flex flex-col">
                        <h2 className="font-normal bg-[#ECF0F4] 3xl:p-2 p-1 3xl:text-[16px] 2xl:text-[16px] xl:text-[15px] text-[15px]">
                            {dataLang?.detail_general_information || "detail_general_information"}
                        </h2>
                        <div className="grid grid-cols-12 min-h-[100px]">
                            <div className="col-span-4">
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6 ">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2 whitespace-nowrap">
                                        {dataLang?.sales_product_date || "sales_product_date"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal items-start col-span-4 ml-3">
                                        {data?.date != null ? moment(data?.date).format("DD/MM/YYYY, HH:mm:ss") : ""}
                                    </h3>
                                </div>
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {dataLang?.sales_product_code || "sales_product_code"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px]  font-normal col-span-2 ml-3">
                                        {data?.code}
                                    </h3>
                                </div>
                            </div>

                            <div className="col-span-4 ">
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {dataLang?.price_quote_customer || "price_quote_customer"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal col-span-4">
                                        {data?.client_name}
                                    </h3>
                                </div>
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {dataLang?.price_quote_order_status || "price_quote_order_status"}:
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
                            </div>
                            <div className="col-span-4 ">
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {dataLang?.sales_product_staff_in_charge || "sales_product_staff_in_charge"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px]  font-normal col-span-2">
                                        {data?.staff_name}
                                    </h3>
                                </div>

                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {dataLang?.price_quote_branch || "price_quote_branch"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[10px]  col-span-4 mr-2 px-2 max-w-[250px] w-fit max-h-[100px] text-center text-[#0F4F9E]  font-[400] py-0.5 border border-[#0F4F9E] rounded-[5.5px] ">
                                        {data?.branch_name}
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="w-[100%] lx:w-[110%] ">
                            <div className="grid grid-cols-12 items-center sticky rounded-t-xl top-0 bg-slate-100 p-2 z-10">
                                <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-3 font-[500] text-center whitespace-nowrap">
                                    {dataLang?.price_quote_item || "price_quote_item"}
                                </h4>

                                <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                    {dataLang?.price_quote_from_unit || "price_quote_from_unit"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                    {dataLang?.price_quote_quantity || "price_quote_quantity"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                    {"SL đã giao"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center ">
                                    {"SL sản xuất"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                    {"SL đã giữ"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                    {"SL cần giữ"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-2 font-[500] text-center whitespace-nowrap">
                                    {"Kho hàng"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                    {"Tác vụ"}
                                </h4>
                            </div>
                            {/* {loading ? (
                                <Loading className="h-20 2xl:h-[160px]" color="#0f4f9e" />
                            ) : data?.items?.length > 0 ? (
                                <>
                                    <ScrollArea
                                        className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px] overflow-hidden"
                                        speed={1}
                                        smoothScrolling={true}
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
                                                        {formatNumber(e?.price)}
                                                    </h6>
                                                    <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                        {e?.discount_percent + "%"}
                                                    </h6>
                                                    <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-right">
                                                        {formatNumber(e?.price_after_discount)}
                                                    </h6>
                                                    <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                        {formatNumber(e?.tax_rate) + "%"}
                                                    </h6>
                                                    <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1 pr-2 rounded-md text-right">
                                                        {formatNumber(e?.amount)}
                                                    </h6>
                                                    <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px] col-span-1 rounded-md text-center whitespace-normal">
                                                        {e?.delivery_date != null
                                                            ? moment(e?.delivery_date).format("DD/MM/YYYY")
                                                            : ""}
                                                    </h6>
                                                    <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px] pl-4 col-span-1 rounded-md text-left whitespace-normal">
                                                        {e?.note != undefined ? e?.note : ""}
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
                                            {dataLang?.price_quote_table_item_not_found ||
                                                "price_quote_table_item_not_found"}
                                        </h1>
                                        <div className="flex items-center justify-around mt-6 ">
                                        </div>
                                    </div>
                                </div>
                            )} */}
                        </div>
                        <div className="text-right mt-2  grid grid-cols-12 flex-col justify-between">
                            <div className="col-span-7 font-medium grid grid-cols-7 text-left">
                                <h3 className="3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px] ">
                                    {dataLang?.price_quote_note || "price_quote_note"}
                                </h3>
                                <h3 className="3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px] col-span-5 font-normal rounded-lg">
                                    {data?.note}
                                </h3>
                            </div>
                            <div className="col-span-3 space-y-2"></div>
                            <div className="col-span-2 space-y-2">
                                <div className="text-right mt-5 mr-2 space-x-2">
                                    <button
                                        type="button"
                                        onClick={_ToggleModal.bind(this, false)}
                                        className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD] hover:scale-105 transition-all ease-linear"
                                    >
                                        {"Hủy"}
                                    </button>
                                    <button
                                        type="submit"
                                        className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E] hover:scale-105 transition-all ease-linear"
                                    >
                                        {"Lưu"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PopupEdit>
        </>
    );
};
export default Popup_KeepStock;
