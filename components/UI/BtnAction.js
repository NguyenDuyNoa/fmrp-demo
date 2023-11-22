import Popup from "reactjs-popup";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import { _ServerInstance as Axios } from "/services/axios";

import { BiEdit } from "react-icons/bi";
import { ArrowDown2 } from "iconsax-react";
import pdfMake from "pdfmake/build/pdfmake";
import { VscFilePdf } from "react-icons/vsc";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { RiDeleteBin6Line } from "react-icons/ri";

import FilePDF from "./FilePDF";
import { routerInternalPlan, routerWarehouseTransfer } from "../../routers/manufacture";
import { routerDeliveryReceipt, routerReturnSales } from "../../routers/sellingGoods";

import PopupConfim from "./popupConfim/popupConfim";
import Popup_KeepStock from "@/pages/sales_export_product/salesOrder/(PopupDetail)/PopupKeepStock";
import Popup_DetailKeepStock from "@/pages/sales_export_product/salesOrder/(PopupDetail)/PopupDetailKeepStock";

///Đơn đặt hàng PO
import Popup_TableValidateEdit from "@/pages/purchase_order/order/(popup)/validateEdit";
import Popup_TableValidateDelete from "@/pages/purchase_order/order/(popup)/validateDelete";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import { useSetData } from "@/hooks/useSetData";

import { routerImport, routerOrder, routerPurchases, routerReturns } from "../../routers/buyImportGoods";

import PopupEdit from "@/components/UI/popup";

import { CONFIRM_DELETION, TITLE_DELETE } from "@/constants/delete/deleteTable";
import Popup_servie from "@/pages/purchase_order/serviceVoucher/(popup)/popup";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const BtnAction = React.memo((props) => {
    const router = useRouter();

    const isShow = useToast();

    const { isOpen, isId, handleQueryId } = useToggle();

    const { isData, updateData } = useSetData();

    const [isOpenValidate, sIsOpenValidate] = useState(false);

    const [openAction, setOpenAction] = useState(false);

    const [dataCompany, setDataCompany] = useState();

    const [data, setData] = useState();

    const _ToggleModal = (e) => setOpenAction(e);

    const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});
    const [dataProductExpiry, sDataProductExpiry] = useState({});
    const [dataProductSerial, sDataProductSerial] = useState({});

    const shareProps = {
        dataMaterialExpiry,
        dataProductExpiry,
        dataProductSerial,
    };

    const handleDelete = () => {
        //Báo giá
        if (props?.id && props?.type === "price_quote") {
            if (props?.status !== "ordered") {
                Axios(
                    "DELETE",
                    `/api_web/Api_quotation/quotation/${isId}?csrf_protection=true`,
                    {},
                    (err, response) => {
                        if (!err) {
                            if (response && response.data) {
                                let { isSuccess, message } = response.data;
                                if (isSuccess) {
                                    isShow("success", props.dataLang[message]);
                                    props.onRefresh && props.onRefresh();
                                } else {
                                    isShow("error", props.dataLang[message]);
                                }
                            } else {
                                isShow("error", `${props?.dataLang?.aler_delete_fail || "aler_delete_fail"}`);
                            }
                        }
                    }
                );
                handleQueryId({ status: false });
            }
            if (props?.status === "ordered") {
                handleQueryId({ status: false });
                isShow("error", `${props?.dataLang?.po_imported_cant_delete || "po_imported_cant_delete"}`);
            }
        }
        ///Đơn hàng bán
        if (props?.id && props?.type === "sales_product") {
            if (props?.status !== "approved") {
                Axios(
                    "DELETE",
                    `/api_web/Api_sale_order/saleOrder/${isId}?csrf_protection=true`,
                    {},
                    (err, response) => {
                        if (response && response.data) {
                            let { isSuccess, message } = response.data;
                            if (isSuccess) {
                                isShow("success", props.dataLang[message]);
                                props.onRefresh && props.onRefresh();
                            } else {
                                isShow("error", props.dataLang[message]);
                            }
                        } else {
                            isShow("error", `${props?.dataLang?.aler_delete_fail || "aler_delete_fail"}`);
                        }
                    }
                );
            }
            if (props?.status === "approved") {
                handleQueryId({ status: false });
                isShow("error", `${props?.dataLang?.sales_product_cant_delete || "sales_product_cant_delete"} `);
            }
        }
        //phiếu giao hàng
        if (props?.id && props?.type === "deliveryReceipt") {
            Axios("DELETE", `/api_web/api_delivery/delete/${props?.id}?csrf_protection=true`, {}, (err, response) => {
                if (!err) {
                    let { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", props.dataLang[message] || message);
                        props.onRefresh && props.onRefresh();
                        props.onRefreshGroup && props.onRefreshGroup();
                    } else {
                        isShow("error", props.dataLang[message] || message);
                    }
                }
            });
        }
        ///trả lại hàng bán
        if (props?.id && props?.type === "returnSales") {
            Axios(
                "DELETE",
                `/api_web/Api_return_order/return_order/${props?.id}?csrf_protection=true`,
                {},
                (err, response) => {
                    if (!err) {
                        var { isSuccess, message } = response.data;
                        if (isSuccess) {
                            isShow("success", props.dataLang[message] || message);
                            props.onRefresh && props.onRefresh();
                            props.onRefreshGroup && props.onRefreshGroup();
                        } else {
                            isShow("error", props.dataLang[message] || message);
                        }
                    }
                }
            );
        }
        ///Kế hoạc nội bộ internal_plan
        if (props?.id && props?.type === "internal_plan") {
            Axios(
                "DELETE",
                `/api_web/api_internal_plan/deleteInternalPlan/${props?.id}?csrf_protection=true`,
                {},
                (err, response) => {
                    if (!err) {
                        var { isSuccess, message } = response.data;
                        if (isSuccess) {
                            isShow("success", props.dataLang[message] || message);
                            props.onRefresh && props.onRefresh();
                        } else {
                            isShow("error", props.dataLang[message] || message);
                        }
                    }
                }
            );
        }
        /// yêu cầu mua hàng
        if (props?.id && props?.type === "purchases") {
            Axios("DELETE", `/api_web/Api_purchases/purchases/${isId}?csrf_protection=true`, {}, (err, response) => {
                if (!err) {
                    let { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", props.dataLang[message]);
                        props.onRefresh && props.onRefresh();
                        props.onRefreshGroup && props.onRefreshGroup();
                    } else {
                        isShow("error", props.dataLang[message]);
                    }
                }
            });
        }
        ///Đơn đặt hàng PO
        if (props?.id && props?.type === "order") {
            Axios(
                "DELETE",
                `/api_web/Api_purchase_order/purchase_order/${props?.id}?csrf_protection=true`,
                {},
                (err, response) => {
                    if (!err) {
                        var { isSuccess, message } = response.data;
                        if (isSuccess) {
                            isShow("success", props.dataLang[message]);
                            props.onRefresh && props.onRefresh();
                        } else {
                            isShow("error", props.dataLang[message]);
                        }
                    }
                }
            );
        }
        //phiếu dịch vụ
        if (props?.id && props?.type === "serviceVoucher") {
            Axios("DELETE", `/api_web/Api_service/service/${props.id}?csrf_protection=true`, {}, (err, response) => {
                if (!err) {
                    let { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", props.dataLang[message]);
                        props.onRefresh && props.onRefresh();
                        props.onRefreshGr && props.onRefreshGr();
                    } else {
                        isShow("error", props.dataLang[message]);
                    }
                }
            });
        }
        //Nhập hàng
        if (props?.id && props?.type === "import") {
            Axios("DELETE", `/api_web/Api_import/import/${props.id}?csrf_protection=true`, {}, (err, response) => {
                if (!err) {
                    let { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", props.dataLang[message]);
                        props.onRefresh && props.onRefresh();
                        props.onRefreshGr && props.onRefreshGr();
                    } else {
                        isShow("error", props.dataLang[message]);
                    }
                }
            });
        }
        // Trả hàng
        if (props?.id && props?.type === "returns") {
            Axios(
                "DELETE",
                `/api_web/Api_return_supplier/returnSupplier/${props.id}?csrf_protection=true`,
                {},
                (err, response) => {
                    if (!err) {
                        let { isSuccess, message } = response.data;
                        if (isSuccess) {
                            isShow("success", props.dataLang[message]);
                            props.onRefresh && props.onRefresh();
                            props.onRefreshGr && props.onRefreshGr();
                        } else {
                            isShow("error", props.dataLang[message]);
                        }
                    }
                }
            );
        }
        //Chuyển kho
        if (props?.id && props?.type === "warehouseTransfer") {
            Axios("DELETE", `/api_web/Api_transfer/transfer/${props.id}?csrf_protection=true`, {}, (err, response) => {
                if (!err) {
                    let { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", props.dataLang[message]);
                        props.onRefresh && props.onRefresh();
                        props.onRefreshGr && props.onRefreshGr();
                    } else {
                        isShow("error", props.dataLang[message]);
                    }
                }
            });
        }

        handleQueryId({ status: false });
    };

    const handleClick = () => {
        //Báo giá
        if (props?.id && props?.type === "price_quote") {
            if (props?.status === "ordered") {
                isShow("error", `${props?.dataLang?.po_imported_cant_edit || "po_imported_cant_edit"}`);
            } else if (props?.status === "confirmed") {
                isShow(
                    "error",
                    `${props?.dataLang?.po_imported_cant_edit_with_confirm || "po_imported_cant_edit_with_confirm"}`
                );
            } else {
                router.push(`/sales_export_product/priceQuote/form?id=${props.id}`);
            }
        }
        ///Đơn hàng bán
        if (props?.id && props?.type === "sales_product") {
            if (props?.status === "approved") {
                isShow("error", `${props?.dataLang?.sales_product_cant_edit || "sales_product_cant_edit"}`);
            } else {
                router.push(`/sales_export_product/salesOrder/form?id=${props.id}`);
            }
        }
        //phiếu giao hàng
        if (props?.id && props?.type === "deliveryReceipt") {
            if (props?.warehouseman_id != "0") {
                isShow("error", `${props?.warehouseman_id != "0" && props.dataLang?.warehouse_confirmed_cant_edit}`);
            } else {
                router.push(`${routerDeliveryReceipt.form}?id=${props.id}`);
            }
        }
        ///trả lại hàng bán
        if (props?.id && props?.type === "returnSales") {
            if (props?.warehouseman_id != "0") {
                isShow("error", `${props?.warehouseman_id != "0" && props.dataLang?.warehouse_confirmed_cant_edit}`);
            } else {
                router.push(`${routerReturnSales.form}?id=${props.id}`);
            }
        }
        ///Kế hoạc nội bộ internal_plan
        if (props?.id && props?.type === "internal_plan") {
            router.push(`${routerInternalPlan.form}?id=${props.id}`);
        }
        ///Yêu cầu mua hàng
        if (props?.id && props?.type === "purchases") {
            if (props?.order?.status != "purchase_ordered") {
                isShow("error", `${props.dataLang?.purchases_ordered_cant_edit}`);
            } else if (props?.status === "1") {
                isShow("error", `${props.dataLang?.confirmed_cant_edit}`);
            } else {
                router.push(`${routerPurchases.form}?id=${props.id}`);
            }
        }
        ///Đơn đặt hàng PO
        if (props?.id && props?.type === "order") {
            if (props?.status_pay != "not_spent" || props?.status != "not_stocked") {
                isShow(
                    "error",
                    `${
                        (props?.status_pay != "not_spent" && (props.dataLang?.paid_cant_edit || "paid_cant_edit")) ||
                        (props?.status != "not_stocked" && "Đơn đặt hàng đã có phiếu Nhập. Không thể sửa")
                    }`
                );
            } else {
                router.push(`${routerOrder.form}?id=${props.id}`);
            }
        }
        //phiếu dịch vụ
        if (props?.id && props?.type === "serviceVoucher") {
            if (props?.status_pay != "not_spent") {
                isShow("error", `${"Phiếu dịch vụ đã chi. Không thể sửa"}`);
            } else {
                // router.push(`/purchase_order/order/form?id=${props.id}`);
            }
        }
        //Nhập hàng
        if (props?.id && props?.type === "import") {
            if (props?.warehouseman_id != "0" || props?.status_pay != "not_spent") {
                isShow(
                    "error",
                    `${
                        (props?.warehouseman_id != "0" && props.dataLang?.warehouse_confirmed_cant_edit) ||
                        (props?.status_pay != "not_spent" && (props.dataLang?.paid_cant_edit || "paid_cant_edit"))
                    }`
                );
            } else {
                router.push(`${routerImport.form}?id=${props.id}`);
            }
        }

        //Trả hàng
        if (props?.id && props?.type === "returns") {
            if (props?.warehouseman_id != "0") {
                isShow("error", `${props?.warehouseman_id != "0" && props.dataLang?.warehouse_confirmed_cant_edit}`);
            } else {
                router.push(`${routerReturns.form}?id=${props.id}`);
            }
        }
        ///chuyển kho
        if (props?.id && props?.type === "warehouseTransfer") {
            if (props?.warehouseman_id != "0") {
                isShow("error", `${props?.warehouseman_id != "0" && props.dataLang?.warehouse_confirmed_cant_edit}`);
            } else {
                router.push(`${routerWarehouseTransfer.form}?id=${props.id}`);
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

                Axios("GET", "/api_web/api_setting/feature/?csrf_protection=true", {}, (err, response) => {
                    if (!err) {
                        let data = response.data;
                        sDataMaterialExpiry(data.find((x) => x.code == "material_expiry"));
                        sDataProductExpiry(data.find((x) => x.code == "product_expiry"));
                        sDataProductSerial(data.find((x) => x.code == "product_serial"));
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }

        const initialApi = {
            price_quote: `/api_web/Api_quotation/quotation/${props?.id}?csrf_protection=true`,
            sales_product: `/api_web/Api_sale_order/saleOrder/${props?.id}?csrf_protection=true`,
            deliveryReceipt: `/api_web/Api_delivery/get/${props?.id}?csrf_protection=true`,
            returnSales: `/api_web/Api_return_order/return_order/${props?.id}?csrf_protection=true`,
            internal_plan: `/api_web/api_internal_plan/detailInternalPlan/${props?.id}?csrf_protection=true`,
            purchases: `/api_web/Api_purchases/purchases/${props?.id}?csrf_protection=true`,
            order: `/api_web/Api_purchase_order/purchase_order/${props?.id}?csrf_protection=true`,
            serviceVoucher: `/api_web/Api_service/service/${props?.id}?csrf_protection=true`,
            import: `/api_web/Api_import/import/${props?.id}?csrf_protection=true`,
            returns: `/api_web/Api_return_supplier/returnSupplier/${props?.id}?csrf_protection=true`,
            warehouseTransfer: `/api_web/Api_transfer/transfer/${props?.id}?csrf_protection=true`,
        };

        try {
            await Axios("GET", initialApi[props.type], {}, (err, response) => {
                if (response && response.data) {
                    if (props.type == "internal_plan") {
                        let db = response.data.data;
                        setData(db);
                    } else {
                        let db = response.data;

                        setData(db);
                    }
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    const _ServerFetching_ValidatePayment = () => {
        Axios(
            "GET",
            `/api_web/Api_purchase_order/paymentStatus/${props?.id}?csrf_protection=true`,
            {},
            (err, response) => {
                if (!err) {
                    let db = response.data;
                    updateData(db);
                }
            }
        );
    };

    useEffect(() => {
        openAction && fetchDataSettingsCompany();
        props.type == "order" && openAction && _ServerFetching_ValidatePayment();
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
                open={openAction || isOpenValidate}
                onOpen={_ToggleModal.bind(this, true)}
                onClose={_ToggleModal.bind(this, false)}
            >
                <div className="w-auto rounded">
                    <div className="bg-white rounded-b-xl flex flex-col overflow-hidden">
                        {props.type == "order" && (
                            <div className="group transition-all ease-in-out flex items-center  gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded">
                                <BiEdit
                                    size={20}
                                    className="group-hover:text-sky-500 group-hover:scale-110 group-hover:shadow-md "
                                />
                                <Popup_TableValidateEdit
                                    {...props}
                                    {...shareProps}
                                    isOpenValidate={isOpenValidate}
                                    sIsOpenValidate={sIsOpenValidate}
                                    data={isData}
                                    className="2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer  rounded py-2.5 "
                                />
                            </div>
                        )}
                        {props.type == "serviceVoucher" && (
                            <div className="group transition-all ease-in-out flex items-center  gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded  w-full">
                                <BiEdit
                                    size={20}
                                    className="group-hover:text-sky-500 group-hover:scale-110 group-hover:shadow-md "
                                />
                                <Popup_servie
                                    {...shareProps}
                                    status_pay={props?.status_pay}
                                    onRefreshGr={props.onRefreshGr}
                                    onClick={handleClick}
                                    onRefresh={props.onRefresh}
                                    dataLang={props.dataLang}
                                    id={props?.id}
                                    className="2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer  rounded py-2.5"
                                >
                                    {props.dataLang?.purchase_order_table_edit || "purchase_order_table_edit"}
                                </Popup_servie>
                            </div>
                        )}

                        {!["order", "serviceVoucher"].includes(props.type) && (
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
                        )}
                        {["deliveryReceipt", "returnSales", "import", "returns"].includes(props?.type) ? (
                            <Popup_Pdf
                                {...shareProps}
                                dataLang={props.dataLang}
                                props={props}
                                openAction={openAction}
                                setOpenAction={setOpenAction}
                                dataCompany={dataCompany}
                                data={data}
                            />
                        ) : (
                            <FilePDF
                                {...shareProps}
                                props={props}
                                openAction={openAction}
                                setOpenAction={setOpenAction}
                                dataCompany={dataCompany}
                                data={data}
                            />
                        )}

                        {props.type == "sales_product" && <Popup_KeepStock {...props} {...shareProps} />}
                        {props.type == "sales_product" && <Popup_DetailKeepStock {...props} {...shareProps} />}
                        {props.type == "order" ? (
                            <div className="group transition-all ease-in-out flex items-center justify-center gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded w-full">
                                <RiDeleteBin6Line
                                    size={20}
                                    className="group-hover:text-[#f87171] group-hover:scale-110 group-hover:shadow-md "
                                />
                                <Popup_TableValidateDelete
                                    {...shareProps}
                                    isOpen={isOpen}
                                    handleQueryId={handleQueryId}
                                    {...props}
                                    className="2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer rounded py-2.5"
                                />
                            </div>
                        ) : (
                            <button
                                onClick={() => handleQueryId({ id: props?.id, status: true })}
                                className={`group transition-all ease-in-out flex items-center ${
                                    props.type == "sales_product" ? "" : "justify-center"
                                } gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full`}
                            >
                                <RiDeleteBin6Line
                                    size={20}
                                    className="group-hover:text-[#f87171] group-hover:scale-110 group-hover:shadow-md "
                                />
                                <p className="group-hover:text-[#f87171]">
                                    {props.dataLang?.purchase_order_table_delete || "purchase_order_table_delete"}
                                </p>
                            </button>
                        )}
                    </div>
                </div>
            </Popup>
            <PopupConfim
                dataLang={props.dataLang}
                type="warning"
                title={TITLE_DELETE}
                subtitle={CONFIRM_DELETION}
                isOpen={isOpen}
                save={handleDelete}
                cancel={() => handleQueryId({ status: false })}
            />
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
                                {...props.shareProps}
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
