import React, { useState } from "react";
import { Grid6 as IconExcel, ArrowDown2 as IconDown, SearchNormal1 as IconSearch, Refresh2 } from "iconsax-react";
import { BiEdit } from "react-icons/bi";
import Popup from "reactjs-popup";
import Popup_dspt from "../receipts/(popup)/popup";
import { VscFilePdf } from "react-icons/vsc";
import { _ServerInstance as Axios } from "/services/axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";
import Popup_Pdf from "./btnPdf";
const BtnTacVu = React.memo((props) => {
    const [openTacvu, sOpenTacvu] = useState(false);
    const _ToggleModal = (e) => sOpenTacvu(e);
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
                Axios(
                    "DELETE",
                    `/api_web/Api_expense_payslips/expenseCoupon/${id}?csrf_protection=true`,
                    {},
                    (err, response) => {
                        if (!err) {
                            let { isSuccess, message } = response.data;
                            if (isSuccess) {
                                ToatstNotifi("success", props.dataLang[message]);
                                props.onRefresh && props.onRefresh();
                            } else {
                                ToatstNotifi("error", props.dataLang[message]);
                            }
                        }
                    }
                );
            }
        });
    };

    return (
        <div>
            <Popup
                trigger={
                    <button type="button" className={`flex space-x-1 items-center ` + props.className}>
                        <span>{props.dataLang?.purchase_action || "purchase_action"}</span>
                        <IconDown size={12} />
                    </button>
                }
                arrow={false}
                position="bottom right"
                className={`dropdown-edit `}
                keepTooltipInside={props.keepTooltipInside}
                closeOnDocumentClick
                nested
                onOpen={_ToggleModal.bind(this, true)}
                onClose={_ToggleModal.bind(this, false)}
                open={openTacvu}
            >
                <div className="w-auto rounded">
                    <div className="bg-white rounded-t flex flex-col overflow-hidden">
                        <div className="group transition-all ease-in-out flex items-center  gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 ">
                            <BiEdit
                                size={20}
                                className="group-hover:text-sky-500 group-hover:scale-110 group-hover:shadow-md "
                            />
                            <Popup_dspt
                                onRefresh={props.onRefresh}
                                dataLang={props.dataLang}
                                id={props?.id}
                                className=" 2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer  rounded "
                            >
                                {props.dataLang?.purchase_order_table_edit || "purchase_order_table_edit"}
                            </Popup_dspt>
                        </div>
                        <div className=" transition-all ease-in-out flex items-center gap-2 group  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5  rounded py-2.5 w-full">
                            <VscFilePdf
                                size={20}
                                className="group-hover:text-[#65a30d] group-hover:scale-110 group-hover:shadow-md "
                            />
                            <Popup_Pdf
                                type={props.type}
                                props={props}
                                id={props.id}
                                dataLang={props.dataLang}
                                className="group-hover:text-[#65a30d] "
                            />
                        </div>
                        <button
                            onClick={_HandleDelete.bind(this, props.id)}
                            className="group transition-all ease-in-out flex items-center gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full"
                        >
                            <RiDeleteBin6Line
                                size={20}
                                className="group-hover:text-[#f87171] group-hover:scale-110 group-hover:shadow-md "
                            />
                            <p className="group-hover:text-[#f87171]">
                                {props.dataLang?.purchase_deleteVoites || "purchase_deleteVoites"}
                            </p>
                        </button>
                    </div>
                </div>
            </Popup>
        </div>
    );
});
export default BtnTacVu;
