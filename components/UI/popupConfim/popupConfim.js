import React, { useState } from "react";
import Popup from "reactjs-popup";
import {
    Edit as IconEdit,
    Grid6 as IconExcel,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    Add as IconAdd,
    Add as IconClose,
} from "iconsax-react";
import { Lexend_Deca } from "@next/font/google";
import Image from "next/image";
import Zoom from "../zoomElement/zoomElement";
import { useSelector } from "react-redux";
import useToast from "@/hooks/useToast";
const deca = Lexend_Deca({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});
const PopupConfim = (props) => {
    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);
    console.log("auth", auth);
    console.log("role", role);
    const showToat = useToast()
    return (
        <React.Fragment>
            <Popup
                open={props.isOpen}
                closeOnDocumentClick={false}
                onClose={props.onClose}
                className={`${props.className} popup-edit`}
            >
                <div
                    className={`3xl:mt-48 2xl:mt-32 xl:mt-32 mt-36 min-w-[400px] ${props.nameModel == "priceQuote" && "min-w-[500px]"
                        }`}
                >
                    <div className={`${deca.className} bg-[#ffffff] p-4 shadow-xl rounded-xl flex flex-col gap-3`}>
                        <div className="relative inline-block">
                            {props.type == "warning" ? (
                                <Image
                                    src="/popup/alert-triangle.png"
                                    alt="tedd"
                                    width={24}
                                    height={24}
                                    className="object-cover"
                                />
                            ) : (
                                <Image
                                    alt="teddd"
                                    src="/popup/check-circle.png"
                                    width={24}
                                    height={24}
                                    className="object-cover"
                                />
                            )}
                        </div>
                        <h1 className="text-[#101828] font-medium 3xl:text-[22px] 2xl:text-[18px] text-lg">
                            {props.title}
                        </h1>
                        <h1 className="text-[#667085] font-medium text-sm tracking-widest-[0.14px]	">
                            {props.subtitle}
                        </h1>
                        <div className="flex items-center justify-between gap-4">
                            {props.nameModel == "priceQuote" && (
                                <>
                                    <Zoom className="w-1/2">
                                        <button
                                            onClick={props.cancel}
                                            className="text-base text-white bg-red-600 transition-all duration-150 ease-linear tran font-normal rounded-lg w-full  border-red-600 border px-[18px] py-[10px] shadow-[0px 1px 2px 0px rgba(16, 24, 40, 0.05)]"
                                        >
                                            Hủy
                                        </button>
                                    </Zoom>
                                    <Zoom className="w-1/2">
                                        <button
                                            onClick={props.save}
                                            className="text-base hover:text-white hover:bg-[#0F4F9E] transition-all duration-150 ease-linear tran font-normal rounded-lg w-full  text-[#344054] border-[#D0D5DD] border px-[18px] py-[10px] shadow-[0px 1px 2px 0px rgba(16, 24, 40, 0.05)]"
                                        >
                                            {props.status === "confirmed"
                                                ? props.dataLang?.aler_not_yet_approved
                                                : props.dataLang?.aler_approved}
                                        </button>
                                    </Zoom>
                                    <Zoom className="w-1/2">
                                        <button
                                            onClick={props.handleNoconfim}
                                            className="text-base hover:text-white hover:bg-[#0F4F9E] transition-all duration-150 ease-linear tran font-normal rounded-lg w-full text-[#344054] border-[#D0D5DD] border px-[18px] py-[10px] shadow-[0px 1px 2px 0px rgba(16, 24, 40, 0.05)]"
                                        >
                                            {props.status === "no_confirmed"
                                                ? props.dataLang?.aler_not_yet_approved
                                                : props.dataLang?.aler_no_approved}
                                        </button>
                                    </Zoom>
                                </>
                            )}
                            {props.nameModel == "salesOrder" && (
                                <>
                                    <Zoom className="w-1/2">
                                        <button
                                            onClick={props.cancel}
                                            className="text-base text-white bg-red-600 transition-all duration-150 ease-linear tran font-normal rounded-lg w-full  border-red-600 border px-[18px] py-[10px] shadow-[0px 1px 2px 0px rgba(16, 24, 40, 0.05)]"
                                        >
                                            Hủy
                                        </button>
                                    </Zoom>
                                    <Zoom className="w-1/2">
                                        <button
                                            onClick={() => {
                                                if (role || auth?.orders?.is_agree == 1) {
                                                    return props.save()
                                                } else {
                                                    showToat('warning', 'Bạn không có quyền thay đổi trạng thái')
                                                }
                                            }}
                                            className="text-base hover:text-white hover:bg-[#0F4F9E] transition-all duration-150 ease-linear tran font-normal rounded-lg w-full  text-[#344054] border-[#D0D5DD] border px-[18px] py-[10px] shadow-[0px 1px 2px 0px rgba(16, 24, 40, 0.05)]"
                                        >
                                            {props.status === "approved"
                                                ? props.dataLang?.aler_not_yet_approved
                                                : props.dataLang?.aler_approved}
                                        </button>
                                    </Zoom>
                                </>
                            )}
                            {!["priceQuote", "salesOrder"].includes(props.nameModel) && (
                                <>
                                    <Zoom className="w-1/2">
                                        <button
                                            onClick={props.cancel}
                                            className="text-base text-white bg-red-600 transition-all duration-150 ease-linear tran font-normal rounded-lg w-full  border-red-600 border px-[18px] py-[10px] shadow-[0px 1px 2px 0px rgba(16, 24, 40, 0.05)]"
                                        >
                                            Hủy
                                        </button>
                                    </Zoom>
                                    <Zoom className="w-1/2">
                                        <button
                                            onClick={props.save}
                                            className="text-base hover:text-white hover:bg-[#0F4F9E] transition-all duration-150 ease-linear tran font-normal rounded-lg w-full  text-[#344054] border-[#D0D5DD] border px-[18px] py-[10px] shadow-[0px 1px 2px 0px rgba(16, 24, 40, 0.05)]"
                                        >
                                            Xác nhận
                                        </button>
                                    </Zoom>
                                </>
                            )}
                        </div>
                        {/* {props.children} */}
                    </div>
                </div>
            </Popup>
        </React.Fragment>
    );
};
export default PopupConfim;
