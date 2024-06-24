import React, { useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";

import Swal from "sweetalert2";

import { useEffect } from "react";
import NoData from "@/components/UI/noData/nodata";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { useSelector } from "react-redux";
import useActionRole from "@/hooks/useRole";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import useToast from "@/hooks/useToast";
import { RiDeleteBin6Line } from "react-icons/ri";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

const Popup_TableValidateDelete = (props) => {
    const _ToggleModal = (e) => props.handleQueryId({ status: e });
    const [onFetching, sOnFetching] = useState(false);

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkDelete, checkEdit } = useActionRole(auth, props?.type);

    const isShow = useToast()

    useEffect(() => {
        props.isOpenValidate && _HandleDelete();
    }, [props.isOpenValidate]);
    const _HandleDelete = () => {
        Axios(
            "DELETE",
            `/api_web/Api_purchase_order/purchase_order/${props?.id}?csrf_protection=true`,
            {},
            (err, response) => {
                if (!err) {
                    var { isSuccess, message } = response.data;
                    if (isSuccess) {
                        Toast.fire({
                            icon: "success",
                            title: props.dataLang[message],
                        });
                        props.onRefresh && props.onRefresh();
                    } else {
                        Toast.fire({
                            icon: "error",
                            title: props.dataLang[message],
                        });
                    }
                }
            }
        );
        props.handleQueryId({ status: false });
    };

    return (
        <>
            <PopupEdit
                title={props.dataLang?.purchase_order_title || "purchase_order_title"}
                button={
                    <div
                        onClick={() => {
                            if (role || checkDelete) {
                                _ToggleModal(true)
                            } else {
                                isShow("warning", WARNING_STATUS_ROLE);
                            }
                        }}
                        className="group transition-all ease-in-out flex items-center justify-center gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded w-full">
                        <RiDeleteBin6Line
                            size={20}
                            className="group-hover:text-[#f87171] group-hover:scale-110 group-hover:shadow-md "
                        />
                        <div
                            className="group-hover:text-[#f87171]"
                        >
                            {props.dataLang?.purchase_order_table_delete || "purchase_order_table_delete"}
                        </div>
                    </div>}
                // onClickOpen={_ToggleModal.bind(this, true)}
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
                                    {props?.dataLang?.purchase_order_detail_general_informatione ||
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
                                        <Loading className="max-h-28" color="#0f4f9e" />
                                    ) : props.data?.payment_code?.length > 0 ? (
                                        <>
                                            <Customscrollbar
                                                className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px]"
                                            >
                                                <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">
                                                    {props.data?.payment_code?.map((e, index) => (
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
                                                    ))}
                                                </div>
                                            </Customscrollbar>
                                        </>
                                    ) : (
                                        <NoData />
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
export default Popup_TableValidateDelete;
