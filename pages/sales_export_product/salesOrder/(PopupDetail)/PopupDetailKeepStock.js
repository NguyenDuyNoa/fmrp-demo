import moment from "moment";
import Swal from "sweetalert2";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { _ServerInstance as Axios } from "/services/axios";
const ScrollArea = dynamic(() => import("react-scrollbar"), { ssr: false });
import { SearchNormal1 as IconSearch, Trash as IconDelete, BoxSearch } from "iconsax-react";

import PopupEdit from "@/components/UI/popup";
import Loading from "@/components/UI/loading";
import Popup_EditDetail from "./PopupEditDetail";
import ToatstNotifi from "@/components/UI/alerNotification/alerNotification";

const Popup_DetailKeepStock = (props) => {
    const { dataLang, id } = props;
    const initialFetch = {
        onSending: false,
        onFetching: false,
        onFetchingWarehouse: false,
    };

    const [data, sData] = useState({});
    let dataClone = { ...data };

    const [open, sOpen] = useState(false);
    const [isFetching, sIsFetching] = useState(initialFetch);

    const _ToggleModal = (e) => sOpen(e);

    const setIsFetch = (e) => sIsFetching((prve) => ({ ...prve, ...e }));

    useEffect(() => {
        open && setIsFetch({ onFetching: true });
    }, [open]);

    const handleFetching = () => {
        Axios("GET", `/api_web/Api_sale_order/GetListKeepOrder/${id}/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let db = response?.data;
                sData(db);
            }
            setIsFetch({ onFetching: false });
        });
    };

    const _HandleDelete = (id) => {
        Swal.fire({
            title: `${props.dataLang?.aler_ask}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#296dc1",
            cancelButtonColor: "#d33",
            confirmButtonText: `${props.dataLang?.aler_yes}`,
            cancelButtonText: `${props.dataLang?.aler_cancel}`,
        }).then((result) => {
            if (result.isConfirmed) {
                Axios("DELETE", `/api_web/Api_transfer/transfer/${id}?csrf_protection=true`, {}, (err, response) => {
                    if (!err) {
                        var { isSuccess, message } = response.data;
                        if (isSuccess) {
                            ToatstNotifi("success", props.dataLang[message]);
                            sIsFetching({ onFetching: true });
                        } else {
                            ToatstNotifi("error", props.dataLang[message]);
                        }
                    }
                });
            }
        });
    };

    useEffect(() => {
        isFetching.onFetching && handleFetching();
    }, [isFetching.onFetching]);
    return (
        <>
            <PopupEdit
                title={dataLang?.salesOrder_listarchive || "salesOrder_listarchive"}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={""}
                button={
                    <button className="group transition-all ease-in-out flex items-center justify-center gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full">
                        <BoxSearch
                            size={20}
                            className="group-hover:text-amber-500 group-hover:scale-110 group-hover:shadow-md "
                        />
                        <p className="group-hover:text-amber-500 pr-2.5">
                            {dataLang?.salesOrder_see_stock_keeping || "salesOrder_see_stock_keeping"}
                        </p>
                    </button>
                }
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <div className="3xl:w-[1300px] 2xl:w-[1150px] xl:w-[999px] w-[950px] 3xl:h-auto 2xl:max-h-auto xl:h-auto h-auto ">
                    <div className=" customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 flex flex-col">
                        <div className=" w-[100%]">
                            <div className={`grid-cols-11 grid sticky top-0 bg-white shadow-lg  z-10 rounded `}>
                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                    {dataLang?.inventory_dayvouchers || "inventory_dayvouchers"}
                                </h4>
                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                    {dataLang?.inventory_vouchercode || "inventory_vouchercode"}
                                </h4>
                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                    {dataLang?.salesOrder_code_orders || "salesOrder_code_orders"}
                                </h4>
                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                                    {dataLang?.warehouseTransfer_transferWarehouse ||
                                        "warehouseTransfer_transferWarehouse"}
                                </h4>
                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                                    {dataLang?.warehouseTransfer_receivingWarehouse ||
                                        "warehouseTransfer_receivingWarehouse"}
                                </h4>
                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                    {dataLang?.inventory_note || "inventory_note"}
                                </h4>
                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                    {dataLang?.client_list_brand || "client_list_brand"}
                                </h4>
                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                    {dataLang?.warehouses_localtion_status || "warehouses_localtion_status"}
                                </h4>
                                <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                    {dataLang?.salesOrder_action || "salesOrder_action"}
                                </h4>
                            </div>
                            {isFetching.onFetching ? (
                                <Loading className="max-h-28" color="#0f4f9e" />
                            ) : dataClone?.transfer?.length > 0 ? (
                                <>
                                    <ScrollArea
                                        className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px] overflow-hidden"
                                        speed={1}
                                        smoothScrolling={true}
                                    >
                                        <div className=" divide-slate-200 min:h-[170px]  max:h-[170px]">
                                            {dataClone?.transfer?.map((e) => {
                                                return (
                                                    <div
                                                        className="grid grid-cols-11 hover:bg-slate-50 items-center border-b"
                                                        key={e.id?.toString()}
                                                    >
                                                        <h6 className="text-[13px]   px-2 py-2 col-span-1 text-center break-words">
                                                            {moment(e?.date).format("DD/MM/YYYY")}
                                                        </h6>
                                                        <h6 className="text-[13px]   px-2 py-2 col-span-1 text-center break-words">
                                                            {e?.code}
                                                        </h6>
                                                        <h6 className="text-[13px]   px-2 py-2 col-span-1 text-center break-words">
                                                            {dataClone?.order.code}
                                                        </h6>
                                                        <h6 className="text-[13px]   px-2 py-2 col-span-2 text-left break-words">
                                                            {e?.warehouses_id_name}
                                                        </h6>
                                                        <h6 className="text-[13px]   px-2 py-2 col-span-2 text-left break-words">
                                                            {e?.warehouses_to_name}
                                                        </h6>
                                                        <h6 className="text-[13px]   px-2 py-2 col-span-1 text-center break-words">
                                                            {e?.note}
                                                        </h6>
                                                        <h6 className="col-span-1 w-fit mx-auto">
                                                            <div className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">
                                                                {e?.branch_name_to}
                                                            </div>
                                                        </h6>
                                                        <h6
                                                            className={`text-[12px] ${
                                                                e?.warehouseman_id == "0"
                                                                    ? "bg-blue-200 text-blue-700"
                                                                    : " bg-green-200 text-green-700"
                                                            } py-1 col-span-1 font-medium text-center break-words w-fit px-1.5 mx-auto rounded-2xl`}
                                                        >
                                                            {`${
                                                                e?.warehouseman_id == "0"
                                                                    ? "Chưa duyệt kho"
                                                                    : "Đã duyệt kho"
                                                            }`}
                                                        </h6>
                                                        <h6 className="text-[13px] flex items-center justify-center gap-4 py-2 col-span-1 font-medium text-center break-words">
                                                            <Popup_EditDetail
                                                                {...props}
                                                                id={e.id}
                                                                sIsFetchingParent={sIsFetching}
                                                                dataClone={dataClone}
                                                            />
                                                            <button
                                                                type="button"
                                                                title="Xóa"
                                                                onClick={(event) => _HandleDelete(e?.id)}
                                                                className="group transition h-10 rounded-[5.5px] hover:text-red-600 text-red-500 flex flex-col justify-center items-center"
                                                            >
                                                                <IconDelete
                                                                    size={23}
                                                                    className="group-hover:text-red-500 group-hover:scale-110 group-hover:shadow-md "
                                                                />
                                                            </button>
                                                        </h6>
                                                    </div>
                                                );
                                            })}
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
                                            {dataLang?.purchase_order_table_item_not_found ||
                                                "purchase_order_table_item_not_found"}
                                        </h1>
                                        <div className="flex items-center justify-around mt-6 "></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="text-right mt-2  grid grid-cols-12 flex-col justify-between border-t">
                            <div className="col-span-7 font-medium grid grid-cols-7 text-left"></div>
                            <div className="col-span-3 space-y-2"></div>
                            <div className="col-span-2 space-y-2">
                                <div className="text-right mt-5 mr-2 space-x-2">
                                    <button
                                        type="button"
                                        onClick={_ToggleModal.bind(this, false)}
                                        className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD] hover:scale-105 transition-all ease-linear"
                                    >
                                        {dataLang?.branch_popup_exit || "branch_popup_exit"}
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
export default Popup_DetailKeepStock;
