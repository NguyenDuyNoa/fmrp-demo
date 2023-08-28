import React, { useRef, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import ModalImage from "react-modal-image";
import "react-datepicker/dist/react-datepicker.css";

import {
    Grid6 as IconExcel,
    Filter as IconFilter,
    Calendar as IconCalendar,
    SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
} from "iconsax-react";

const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});

import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";

import Swal from "sweetalert2";

import { useEffect } from "react";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

const Popup_TableValidateEdit = (props) => {
    const router = useRouter();
    const [onFetching, sOnFetching] = useState(false);
    const _ToggleModal = (e) => props.setOpen(e);
    useEffect(() => {
        props.isOpen && handleClick();
    }, [props.isOpen]);
    console.log(props);
    const handleClick = () => {
        if (
            props?.status_pay != "not_spent" ||
            props?.status != "not_stocked"
        ) {
            Toast.fire({
                icon: "error",
                title: `${
                    (props?.status_pay != "not_spent" &&
                        (props.dataLang?.paid_cant_edit || "paid_cant_edit")) ||
                    (props?.status != "not_stocked" &&
                        "Đơn đặt hàng đã có phiếu Nhập. Không thể sửa")
                }`,
            });
        } else {
            router.push(`/purchase_order/order/form?id=${props.id}`);
        }
    };

    return (
        <>
            <PopupEdit
                title={
                    props.dataLang?.purchase_order_title ||
                    "purchase_order_title"
                }
                button={
                    props.dataLang?.purchase_order_table_edit ||
                    "purchase_order_table_edit"
                }
                onClickOpen={_ToggleModal.bind(this, true)}
                open={props.isOpen && props.data?.payment_code?.length > 0}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props?.className}
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <div className=" space-x-5 w-[400px]  h-500px ">
                    <div>
                        <div className="w-[400px]">
                            <div className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                <h2 className="font-normal bg-[#ECF0F4] p-2 text-[13px]">
                                    {props?.dataLang
                                        ?.purchase_order_detail_general_informatione ||
                                        "purchase_order_detail_general_informatione"}
                                </h2>
                                <div className="w-[100%] lx:w-[110%] ">
                                    <div className="grid grid-cols-12 sticky top-0 bg-slate-100  z-10">
                                        <h4 className="text-[13px] px-2 text-[#667085] uppercase col-span-2 font-[400] text-center">
                                            {"#"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 text-[#667085] uppercase col-span-10 font-[400] text-center">
                                            {"Mã phiếu chi"}
                                        </h4>
                                    </div>
                                    {onFetching ? (
                                        <Loading
                                            className="max-h-28"
                                            color="#0f4f9e"
                                        />
                                    ) : props.data?.payment_code?.length > 0 ? (
                                        <>
                                            <ScrollArea
                                                className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px] overflow-hidden"
                                                speed={1}
                                                smoothScrolling={true}
                                            >
                                                <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">
                                                    {props.data?.payment_code?.map(
                                                        (e, index) => (
                                                            <div
                                                                className="grid items-center grid-cols-12 py-1.5 px-2 hover:bg-slate-100/40 "
                                                                key={e.id?.toString()}
                                                            >
                                                                <h6 className="text-[13px] px-2  py-0.5 col-span-2  rounded-md text-center ">
                                                                    {index + 1}
                                                                </h6>
                                                                <h6 className="text-[13px]   py-0.5 col-span-10 rounded-md text-center ">
                                                                    {e}
                                                                </h6>
                                                            </div>
                                                        )
                                                    )}
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
                                                    {props.dataLang
                                                        ?.purchase_order_table_item_not_found ||
                                                        "purchase_order_table_item_not_found"}
                                                </h1>
                                                <div className="flex items-center justify-around mt-6 ">
                                                    {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PopupEdit>
        </>
    );
};
export default Popup_TableValidateEdit;
