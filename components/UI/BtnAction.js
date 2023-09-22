import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState, useRef } from "react";
import Popup from "reactjs-popup";
import { ArrowDown2 } from "iconsax-react";
import Swal from "sweetalert2";
import { _ServerInstance as Axios } from "/services/axios";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import FilePDF from "./FilePDF";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";
import ToatstNotifi from "./alerNotification/alerNotification";
import PopupEdit from "/components/UI/popup";
import { VscFilePdf } from "react-icons/vsc";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

const BtnAction = React.memo((props) => {
    const router = useRouter();

    const [openAction, setOpenAction] = useState(false);
    const [dataCompany, setDataCompany] = useState();
    const [data, setData] = useState();
    const _ToggleModal = (e) => {
        setOpenAction(e);
    };
    const handleDelete = (id) => {
        if (props?.id && props?.type === "price_quote") {
            if (props?.status !== "ordered") {
                Swal.fire({
                    title: `${props.dataLang?.aler_ask} `,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#296dc1",
                    cancelButtonColor: "#d33",
                    confirmButtonText: `${props.dataLang?.aler_yes} `,
                    cancelButtonText: `${props.dataLang?.aler_cancel} `,
                }).then((result) => {
                    if (result.isConfirmed) {
                        Axios(
                            "DELETE",
                            `/api_web/Api_quotation/quotation/${id}?csrf_protection=true`,
                            {},
                            (err, response) => {
                                if (response && response.data) {
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
                                } else {
                                    Toast.fire({
                                        icon: "error",
                                        title: `${props?.dataLang?.aler_delete_fail || "aler_delete_fail"}`,
                                    });
                                }
                            }
                        );
                    }
                });
            }
            if (props?.status === "ordered") {
                Toast.fire({
                    icon: "error",
                    title: `${props?.dataLang?.po_imported_cant_delete || "po_imported_cant_delete"} `,
                });
            }
        }

        if (props?.id && props?.type === "sales_product") {
            if (props?.status !== "approved") {
                Swal.fire({
                    title: `${props.dataLang?.aler_ask} `,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#296dc1",
                    cancelButtonColor: "#d33",
                    confirmButtonText: `${props.dataLang?.aler_yes} `,
                    cancelButtonText: `${props.dataLang?.aler_cancel} `,
                }).then((result) => {
                    if (result.isConfirmed) {
                        Axios(
                            "DELETE",
                            `/api_web/Api_sale_order/saleOrder/${id}?csrf_protection=true`,
                            {},
                            (err, response) => {
                                if (response && response.data) {
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
                                } else {
                                    Toast.fire({
                                        icon: "error",
                                        title: `${props?.dataLang?.aler_delete_fail || "aler_delete_fail"}`,
                                    });
                                }
                            }
                        );
                    }
                });
            }
            if (props?.status === "approved") {
                Toast.fire({
                    icon: "error",
                    title: `${props?.dataLang?.sales_product_cant_delete || "sales_product_cant_delete"} `,
                });
            }
        }
        if (props?.id && props?.type === "deliveryReceipt") {
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
                        `/api_web/api_delivery/delete/${props?.id}?csrf_protection=true`,
                        {},
                        (err, response) => {
                            if (!err) {
                                var { isSuccess, message } = response.data;
                                if (isSuccess) {
                                    ToatstNotifi("success", props.dataLang[message] || message);
                                    props.onRefresh && props.onRefresh();
                                    props.onRefreshGroup && props.onRefreshGroup();
                                } else {
                                    ToatstNotifi("error", props.dataLang[message] || message);
                                }
                            }
                        }
                    );
                }
            });
        }
    };

    const handleClick = () => {
        if (props?.id && props?.type === "price_quote") {
            console.log(props?.status);
            if (props?.status === "ordered") {
                Toast.fire({
                    icon: "error",
                    title: `${props?.dataLang?.po_imported_cant_edit || "po_imported_cant_edit"} `,
                });
            } else if (props?.status === "confirmed") {
                Toast.fire({
                    icon: "error",
                    title: `${
                        props?.dataLang?.po_imported_cant_edit_with_confirm || "po_imported_cant_edit_with_confirm"
                    } `,
                });
            } else {
                router.push(`/sales_export_product/priceQuote/form?id=${props.id}`);
            }
        }
        if (props?.id && props?.type === "sales_product") {
            if (props?.status === "approved") {
                Toast.fire({
                    icon: "error",
                    title: `${props?.dataLang?.sales_product_cant_edit || "sales_product_cant_edit"} `,
                });
            } else {
                router.push(`/sales_export_product/salesOrder/form?id=${props.id}`);
            }
        }
        if (props?.id && props?.type === "deliveryReceipt") {
            if (props?.warehouseman_id != "0") {
                Toast.fire({
                    icon: "error",
                    title: `${props?.warehouseman_id != "0" && props.dataLang?.warehouse_confirmed_cant_edit}`,
                });
            } else {
                router.push(`/sales_export_product/deliveryReceipt/form?id=${props.id}`);
            }
        }
    };

    const fetchDataSettingsCompany = async () => {
        if (props?.id) {
            try {
                await Axios("GET", `/api_web/Api_setting/CompanyInfo?csrf_protection=true`, {}, (err, response) => {
                    if (response && response.data) {
                        let res = response.data.data;
                        setDataCompany(res);
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }

        if (props?.id && props?.type === "price_quote") {
            try {
                await Axios(
                    "GET",
                    `/api_web/Api_quotation/quotation/${props?.id}?csrf_protection=true`,
                    {},
                    (err, response) => {
                        if (response && response.data) {
                            let db = response.data;
                            setData(db);
                        }
                    }
                );
            } catch (err) {
                console.log(err);
            }
        }

        if (props?.id && props?.type === "sales_product") {
            try {
                await Axios(
                    "GET",
                    `/api_web/Api_sale_order/saleOrder/${props?.id}?csrf_protection=true`,
                    {},
                    (err, response) => {
                        if (response && response.data) {
                            let db = response.data;
                            setData(db);
                        }
                    }
                );
            } catch (err) {
                console.log(err);
            }
        }
        if (props?.id && props?.type === "deliveryReceipt") {
            try {
                await Axios(
                    "GET",
                    `/api_web/Api_delivery/get/${props?.id}?csrf_protection=true`,
                    {},
                    (err, response) => {
                        if (response && response.data) {
                            let db = response.data;
                            setData(db);
                        }
                    }
                );
            } catch (err) {
                console.log(err);
            }
        }
    };

    useEffect(() => {
        openAction && fetchDataSettingsCompany();
    }, [openAction]);

    return (
        <div>
            <Popup
                trigger={
                    <button className={`flex space-x-1 items-center ` + props.className}>
                        <span>{props.dataLang?.btn_action || "btn_action"}</span>
                        <ArrowDown2 size={12} />
                    </button>
                }
                arrow={false}
                position="bottom right"
                className={`dropdown-edit`}
                keepTooltipInside={props.keepTooltipInside}
                closeOnDocumentClick
                nested
                open={openAction}
                onOpen={_ToggleModal.bind(this, true)}
                onClose={_ToggleModal.bind(this, false)}
            >
                <div className="w-auto rounded">
                    <div className="bg-white rounded-b-xl flex flex-col overflow-hidden">
                        {/* <button
                            onClick={handleClick}
                            className="2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer 2xl:px-5 2xl:py-2.5 px-5 py-1.5 rounded w-full"
                        >
                            {props?.dataLang?.btn_table_edit || "btn_table_edit"}
                        </button> */}
                        <button
                            onClick={handleClick}
                            className="group transition-all ease-in-out flex items-center gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full"
                        >
                            <BiEdit
                                size={20}
                                className="group-hover:text-sky-500 group-hover:scale-110 group-hover:shadow-md "
                            />
                            <p className="group-hover:text-sky-500">
                                {props.dataLang?.btn_table_edit || "btn_table_edit"}
                            </p>
                        </button>
                        {props?.type == "deliveryReceipt" ? (
                            <Popup_Pdf
                                dataLang={props.dataLang}
                                props={props}
                                openAction={openAction}
                                setOpenAction={setOpenAction}
                                dataCompany={dataCompany}
                                data={data}
                            />
                        ) : (
                            <FilePDF
                                props={props}
                                openAction={openAction}
                                setOpenAction={setOpenAction}
                                dataCompany={dataCompany}
                                data={data}
                            />
                        )}

                        {/* <button
                            onClick={() => handleDelete(props?.id)}
                            className="2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer 2xl:px-5 2xl:py-2.5 px-5 py-1.5 rounded  w-full"
                        >
                            {props?.dataLang?.btn_table_delete || "btn_table_delete"}
                        </button> */}
                        <button
                            onClick={() => handleDelete(props?.id)}
                            className="group transition-all ease-in-out flex items-center justify-center gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full"
                        >
                            <RiDeleteBin6Line
                                size={20}
                                className="group-hover:text-[#f87171] group-hover:scale-110 group-hover:shadow-md "
                            />
                            <p className="group-hover:text-[#f87171]">
                                {props.dataLang?.purchase_order_table_delete || "purchase_order_table_delete"}
                            </p>
                        </button>
                    </div>
                </div>
            </Popup>
        </div>
    );
});

const Popup_Pdf = (props) => {
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);

    return (
        <>
            <PopupEdit
                title={props.dataLang?.option_prin || "option_prin"}
                button={
                    <div>
                        <div>
                            <button className="transition-all ease-in-out flex items-center gap-2 group  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5  rounded py-2.5 w-full">
                                <VscFilePdf
                                    size={20}
                                    className="group-hover:text-[#65a30d] group-hover:scale-110 group-hover:shadow-md "
                                />
                                <p className="group-hover:text-[#65a30d]">
                                    {props?.dataLang?.btn_table_print || "btn_table_print"}
                                </p>
                            </button>
                        </div>
                    </div>
                }
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props?.className}
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <div className="space-x-5 w-[400px] h-auto">
                    <div>
                        <div className="w-[400px]">
                            <FilePDF
                                props={props.props}
                                openAction={props.openAction}
                                setOpenAction={props.setOpenAction}
                                dataCompany={props.dataCompany}
                                data={props.data}
                                dataLang={props.dataLang}
                            />
                        </div>
                    </div>
                </div>
            </PopupEdit>
        </>
    );
};

export default BtnAction;
