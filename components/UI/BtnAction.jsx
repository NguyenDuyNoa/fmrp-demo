import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";

import { _ServerInstance as Axios } from "services/axios";

import { ArrowDown2, Box1, BoxSearch, Trash } from "iconsax-react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { VscFilePdf } from "react-icons/vsc";

import FilePDF from "./FilePDF";

import { routerImport, routerOrder, routerPurchases, routerReturns } from "@/routers/buyImportGoods";
import { routerDeliveryReceipt, routerPriceQuote, routerReturnSales, routerSalesOrder } from "@/routers/sellingGoods";

import {
    routerExportToOther,
    routerInternalPlan,
    routerProductionWarehouse,
    routerProductsWarehouse,
    routerRecall,
    routerWarehouseTransfer,
} from "@/routers/manufacture";

import Popup_DetailKeepStock from "@/pages/sales_export_product/sales_order/components/PopupDetailKeepStock";
import Popup_KeepStock from "@/pages/sales_export_product/sales_order/components/PopupKeepStock";
import PopupConfim from "./popupConfim/popupConfim";

///Đơn đặt hàng PO
import Popup_TableValidateDelete from "@/pages/purchase_order/order/components/validateDelete";
import Popup_TableValidateEdit from "@/pages/purchase_order/order/components/validateEdit";

import { useSetData } from "@/hooks/useSetData";
import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";

import PopupEdit from "@/components/UI/Popup";

import Popup_servie from "@/pages/purchase_order/servicev_voucher/components/popup";

import Popup_dspc from "@/pages/accountant/payment/components/popup";
import Popup_dspt from "@/pages/accountant/receipts/components/popup";

import { CONFIRM_DELETION, TITLE_DELETE } from "@/constants/delete/deleteTable";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import useFeature from "@/hooks/useConfigFeature";
import useSetingServer from "@/hooks/useConfigNumber";
import useActionRole from "@/hooks/useRole";
import Popup_Bom from "@/pages/products/components/product/popupBom";
import Popup_GiaiDoan from "@/pages/products/components/product/popupGiaiDoan";
import Popup_ThanhPham from "@/pages/products/components/product/popupThanhPham";
import { useSelector } from "react-redux";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const BtnAction = React.memo((props) => {
    const router = useRouter();

    const isShow = useToast();

    const { isOpen, handleQueryId } = useToggle();

    const { isData, updateData } = useSetData();

    const [isOpenValidate, sIsOpenValidate] = useState(false);

    const [openAction, setOpenAction] = useState(false);

    const _ToggleModal = (e) => setOpenAction(e);

    const { dataMaterialExpiry, dataProductExpiry, dataProductSerial } = useFeature();

    const dataSeting = useSetingServer();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkDelete, checkEdit } = useActionRole(auth, props?.type);

    const confimDelete = (url) => {
        Axios("DELETE", url, {}, (err, response) => {
            if (!err) {
                if (response && response.data) {
                    let { isSuccess, message, ...res } = response.data;
                    // này là do không đồng bộ cấu trúc api của be nên phải if thêp type
                    const modelOther = ["category_errors", "category_detail_errors"];

                    if (isSuccess || (modelOther.includes(props.type) && res?.result == 1)) {
                        isShow("success", props.dataLang[message] || message);

                        props.onRefresh && props.onRefresh();

                        const checkType = [
                            "returnSales",
                            "purchases",
                            "servicev_voucher",
                            "returns",
                            "warehouseTransfer",
                            "production_warehouse",
                            "productsWarehouse",
                            "recall",
                            "exportToOther",
                            "client_customers",
                            "suppliers",
                            "warehouse",
                        ];

                        checkType.includes(props.type) &&
                            ((props.onRefreshGroup && props.onRefreshGroup()) ||
                                (props.onRefreshGr && props.onRefreshGr()));
                    } else {
                        if (modelOther.includes(props.type)) {
                            isShow("error", props.dataLang[message.error] || message.error);
                        } else {
                            isShow("error", props.dataLang[message] || message);
                        }
                    }
                } else {
                    isShow("error", `${props?.dataLang?.aler_delete_fail || "aler_delete_fail"}`);
                }
            }
        });
    };

    const handleDelete = () => {
        //Báo giá

        const initialApiDelete = {
            category_detail_errors: `api_web/Api_category_error/deleteDetailError/${props.id}?csrf_protection=true`,
            category_errors: `api_web/Api_category_error/deleteCategoryError/${props.id}?csrf_protection=true`,
            settings_variant: `/api_web/Api_variation/variation/${props.id}?csrf_protection=true`,
            units: `/api_web/Api_unit/unit/${props.id}?csrf_protection=true`,
            stages: `/api_web/api_product/stage/${props.id}?csrf_protection=true`,
            costs: `/api_web/Api_cost/cost/${props.id}?csrf_protection=true`,
            paymentmodes: `/api_web/Api_payment_method/payment_method/${props.id}?csrf_protection=true`,
            currencies: `/api_web/Api_currency/currency/${props.id}?csrf_protection=true`,
            taxes: `/api_web/Api_tax/tax/${props.id}?csrf_protection=true`,
            settings_branch: `/api_web/Api_Branch/branch/${props.id}?csrf_protection=true`,
            warehouse_location: `/api_web/api_warehouse/location/${props.id}?csrf_protection=true`,
            warehouse: `/api_web/api_warehouse/warehouse/${props.id}?csrf_protection=true`,
            personnel_roles: `/api_web/api_staff/position/${props.id}?csrf_protection=true`,
            department: `/api_web/api_staff/department/${props.id}?csrf_protection=true`,
            personnel_staff: `/api_web/api_staff/staff/${props.id}?csrf_protection=true`,
            products: `/api_web/api_product/product/${props.id}?csrf_protection=true`,
            category_products: `/api_web/api_product/category/${props.id}?csrf_protection=true`,
            materials: `/api_web/api_material/material/${props.id}?csrf_protection=true`,
            material_category: `/api_web/api_material/category/${props.id}?csrf_protection=true`,
            suppliers_groups: `/api_web/api_supplier/group/${props.id}?csrf_protection=true`,
            suppliers: `/api_web/api_supplier/supplier/${props.id}?csrf_protection=true`,
            client_customers: `/api_web/api_client/client/${props.id}?csrf_protection=true`,
            client_status: `/api_web/api_client/status/${props.id}?csrf_protection=true`,
            client_group: `/api_web/Api_client/group/${props.id}?csrf_protection=true`,
            price_quote: `/api_web/Api_quotation/quotation/${props.id}?csrf_protection=true`,
            sales_product: `/api_web/Api_sale_order/saleOrder/${props.id}?csrf_protection=true`,
            deliveryReceipt: `/api_web/api_delivery/delete/${props.id}?csrf_protection=true`,
            returnSales: `/api_web/Api_return_order/return_order/${props.id}?csrf_protection=true`,
            internal_plan: `/api_web/api_internal_plan/deleteInternalPlan/${props.id}?csrf_protection=true`,
            purchases: `/api_web/Api_purchases/purchases/${props.id}?csrf_protection=true`,
            order: `/api_web/Api_purchase_order/purchase_order/${props.id}?csrf_protection=true`,
            servicev_voucher: `/api_web/Api_service/service/${props.id}?csrf_protection=true`,
            import: `/api_web/Api_import/import/${props.id}?csrf_protection=true`,
            returns: `/api_web/Api_return_supplier/returnSupplier/${props.id}?csrf_protection=true`,
            warehouseTransfer: `/api_web/Api_transfer/transfer/${props.id}?csrf_protection=true`,
            production_warehouse: `/api_web/Api_stock/exportProduction/${props.id}?csrf_protection=true`,
            productsWarehouse: `/api_web/Api_product_receipt/productReceipt/${props.id}?csrf_protection=true`,
            recall: `/api_web/Api_material_recall/materialRecall/${props.id}?csrf_protection=true`,
            exportToOther: `/api_web/Api_export_other/exportOther/${props.id}?csrf_protection=true`,
            receipts: `/api_web/Api_expense_payslips/expenseCoupon/${props.id}?csrf_protection=true`,
            payment: `/api_web/Api_expense_voucher/expenseVoucher/${props.id}?csrf_protection=true`,
        };
        ///báo giá

        const typeConfig = initialApiDelete[props.type];

        if (props?.id && props?.type === "price_quote") {
            if (props?.status !== "ordered") {
                confimDelete(typeConfig);
            }
            if (props?.status === "ordered") {
                isShow("error", `${props?.dataLang?.po_imported_cant_delete || "po_imported_cant_delete"}`);
            }
        }
        ///Đơn hàng bán
        else if (props?.id && props?.type === "sales_product") {
            if (props?.status !== "approved") {
                confimDelete(typeConfig);
            }
            if (props?.status === "approved") {
                isShow("error", `${props?.dataLang?.sales_product_cant_delete || "sales_product_cant_delete"} `);
            }
        }
        // kế hoạch nội bộ
        else if (props?.id && props?.type === "internal_plan") {
            if (props?.status !== "1") {
                confimDelete(typeConfig);
            } else {
                isShow("error", `Kế hoạch nội bộ đã được duyệt, không thể xóa. Vui lòng bỏ duyệt để xóa`);
            }
        } else {
            confimDelete(typeConfig);
        }

        handleQueryId({ status: false });
    };

    const handleClick = () => {
        const typeModel = {
            //trả lại hàng bán
            returnSales: routerReturnSales.form,
            ///Phiếu giao hàng
            deliveryReceipt: routerDeliveryReceipt.form,
            ///Xuất kho sản xuất
            production_warehouse: routerProductionWarehouse.form,
            // nhập kho thành phẩm
            productsWarehouse: routerProductsWarehouse.form,
            // Thu hồi NVL
            recall: routerRecall.form,
            //xuát kho khác
            exportToOther: routerExportToOther.form,
            // chuyển kho
            warehouseTransfer: routerWarehouseTransfer.form,
            // trả hàng
            returns: routerReturns.form,
            ///Kế hoạc nội bộ
            internal_plan: routerInternalPlan.form,
            // nhập hàng
            import: routerImport.form,
            ///Đơn đặt hàng PO
            order: routerOrder.form,
            ///Yêu cầu mua hàng
            purchases: routerPurchases.form,
            //báo giá
            price_quote: routerPriceQuote.form,
            //đơn hàng bán
            sales_product: routerSalesOrder.form,
        };

        const handleQueryPage = () => router.push(`${typeModel[props.type]}?id=${props.id}`);

        //Báo giá
        if (!!props?.id && props?.type === "price_quote") {
            if (props?.status === "ordered") {
                isShow("error", `${props?.dataLang?.po_imported_cant_edit || "po_imported_cant_edit"}`);
            } else if (props?.status === "confirmed") {
                isShow(
                    "error",
                    `${props?.dataLang?.po_imported_cant_edit_with_confirm || "po_imported_cant_edit_with_confirm"}`
                );
            } else {
                handleQueryPage();
            }
        }
        ///Đơn hàng bán
        if (!!props?.id && props?.type === "sales_product") {
            if (props?.status === "approved") {
                isShow("error", `${props?.dataLang?.sales_product_cant_edit || "sales_product_cant_edit"}`);
            } else {
                handleQueryPage();
            }
        }
        ///Yêu cầu mua hàng
        if (!!props?.id && props?.type === "purchases") {
            if (props?.order?.status != "purchase_ordered") {
                isShow("error", `${props.dataLang?.purchases_ordered_cant_edit}`);
            } else if (props?.status === "1") {
                isShow("error", `${props.dataLang?.confirmed_cant_edit}`);
            } else {
                handleQueryPage();
            }
        }
        ///Đơn đặt hàng PO
        if (!!props?.id && props?.type === "order") {
            if (props?.status_pay != "not_spent" || props?.status != "not_stocked") {
                isShow(
                    "error",
                    `${(props?.status_pay != "not_spent" && (props.dataLang?.paid_cant_edit || "paid_cant_edit")) ||
                    (props?.status != "not_stocked" && "Đơn đặt hàng đã có phiếu Nhập. Không thể sửa")
                    }`
                );
            } else {
                handleQueryPage();
            }
        }
        //Nhập hàng
        if (!!props?.id && props?.type === "import") {
            if (props?.warehouseman_id != "0" || props?.status_pay != "not_spent") {
                isShow(
                    "error",
                    `${(props?.warehouseman_id != "0" && props.dataLang?.warehouse_confirmed_cant_edit) ||
                    (props?.status_pay != "not_spent" && (props.dataLang?.paid_cant_edit || "paid_cant_edit"))
                    }`
                );
            } else {
                handleQueryPage();
            }
        }
        // kế hoạch nội bộ
        if (!!props?.id && props?.type === "internal_plan") {
            if (props?.status == "1") {
                isShow("error", `Kế hoạch nội bộ đã được duyệt. Không thể sửa`);
            } else {
                handleQueryPage();
            }
        }

        const checkType = [
            "production_warehouse",
            "productsWarehouse",
            "recall",
            "exportToOther",
            "warehouseTransfer",
            "returns",
            "deliveryReceipt",
            "returnSales",
            "servicev_voucher",
        ];

        if (!!props?.id && checkType.includes(props.type)) {
            if (!!props?.type === "servicev_voucher" && !!props?.status_pay != "not_spent") {
                isShow("error", `${"Phiếu dịch vụ đã chi. Không thể sửa"}`);
            }

            if (props?.warehouseman_id && props?.warehouseman_id != "0") {
                isShow("error", `${props?.warehouseman_id != "0" && props.dataLang?.warehouse_confirmed_cant_edit}`);
            } else {
                handleQueryPage();
            }
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
        props.type == "order" && openAction && _ServerFetching_ValidatePayment();
    }, [openAction]);

    const shareProps = { dataMaterialExpiry, dataProductExpiry, dataProductSerial, dataSeting };

    return (
        <div className="flex items-center justify-center">
            {[
                "client_customers",
                "client_status",
                "client_group",
                "suppliers",
                "suppliers_groups",
                "material_category",
                "materials",
                "category_products",
                "personnel_staff",
                "department",
                "personnel_roles",
                "warehouse",
                "warehouse_location",
                "settings_branch",
                "taxes",
                "currencies",
                "paymentmodes",
                "units",
                "stages",
                "costs",
                "settings_variant",
                "category_errors",
                "category_detail_errors",
            ].includes(props?.type) ? (
                <button
                    type="button"
                    onClick={() => handleQueryId({ id: props?.id, status: true })}
                    className="xl:text-base text-xs outline-none hover:scale-110 transition-all ease-linear"
                >
                    <Trash color="red" />
                </button>
            ) : (
                <Popup
                    trigger={
                        <button
                            className={
                                `
                            flex space-x-1 items-center bg-slate-100 xl:px-4 px-2 xl:py-1.5 py-1 rounded 2xl:text-sm xl:!text-xs text-[9px]                                                                        
                            ` + props.className
                            }
                        >
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
                                <Popup_TableValidateEdit
                                    {...props}
                                    {...shareProps}
                                    isOpenValidate={isOpenValidate}
                                    sIsOpenValidate={sIsOpenValidate}
                                    data={isData}
                                    className="2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer  rounded py-2.5 "
                                />
                            )}
                            {props.type == "servicev_voucher" && (
                                <div className="group transition-all ease-in-out flex items-center  gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded  w-full">
                                    <BiEdit
                                        size={20}
                                        className="group-hover:text-sky-500 group-hover:scale-110 group-hover:shadow-md "
                                    />
                                    <Popup_servie
                                        status_pay={props?.status_pay}
                                        onRefreshGr={props.onRefreshGr}
                                        onClick={() => handleClick()}
                                        onRefresh={props.onRefresh}
                                        dataLang={props.dataLang}
                                        id={props?.id}
                                        {...shareProps}
                                        className="2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer  rounded py-2.5"
                                    >
                                        {props.dataLang?.purchase_order_table_edit || "purchase_order_table_edit"}
                                    </Popup_servie>
                                </div>
                            )}

                            {props.type == "products" && (
                                <>
                                    <Popup_GiaiDoan
                                        dataLang={props.dataLang}
                                        id={props.id}
                                        name={props?.name}
                                        code={props?.code}
                                        type={props?.typeOpen}
                                        onRefresh={props.onRefresh}
                                        className="text-sm hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full"
                                    />
                                    <Popup_Bom
                                        dataLang={props.dataLang}
                                        id={props.id}
                                        name={props?.name}
                                        code={props?.code}
                                        onRefresh={props.onRefresh}
                                        type={props?.typeOpen}
                                        bom={props?.bom}
                                        className="text-sm hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full"
                                    />
                                    <Popup_ThanhPham
                                        onRefresh={props.onRefresh}
                                        dataProductExpiry={props.dataProductExpiry}
                                        dataLang={props.dataLang}
                                        id={props?.id}
                                        type={props?.typeOpen}
                                        className="text-sm hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full"
                                    />
                                </>
                            )}

                            {props.type == "receipts" && (
                                // <div className="group transition-all ease-in-out flex items-center  gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 ">
                                //     <BiEdit
                                //         size={20}
                                //         className="group-hover:text-sky-500 group-hover:scale-110 group-hover:shadow-md "
                                //     />
                                //     <Popup_dspt
                                //         onRefresh={props.onRefresh}
                                //         dataLang={props.dataLang}
                                //         id={props?.id}
                                //         className=" 2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer  rounded "
                                //     >
                                //         {props.dataLang?.purchase_order_table_edit || "purchase_order_table_edit"}
                                //     </Popup_dspt>
                                // </div>
                                <Popup_dspt
                                    onRefresh={props.onRefresh}
                                    dataLang={props.dataLang}
                                    id={props?.id}
                                    className="text-sm hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full"
                                >
                                    {props.dataLang?.purchase_order_table_edit || "purchase_order_table_edit"}
                                </Popup_dspt>
                            )}
                            {props.type == "payment" && (
                                // <div className="group transition-all ease-in-out flex items-center  gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 ">
                                //     <BiEdit
                                //         size={20}
                                //         className="group-hover:text-sky-500 group-hover:scale-110 group-hover:shadow-md "
                                //     />
                                //     <Popup_dspc
                                //         onRefresh={props.onRefresh}
                                //         dataLang={props.dataLang}
                                //         id={props?.id}
                                //         className="text-sm hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full"
                                //         >
                                //         {props.dataLang?.purchase_order_table_edit || "purchase_order_table_edit"}
                                //     </Popup_dspc>
                                // </div>
                                <Popup_dspc
                                    onRefresh={props.onRefresh}
                                    dataLang={props.dataLang}
                                    id={props?.id}
                                    className="text-sm hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full"
                                >
                                    {props.dataLang?.purchase_order_table_edit || "purchase_order_table_edit"}
                                </Popup_dspc>
                            )}
                            {!["order", "products", "servicev_voucher", "receipts", "payment"].includes(props.type) && (
                                <button
                                    onClick={() => {
                                        if (role) {
                                            handleClick();
                                        } else if (checkEdit) {
                                            handleClick();
                                        } else {
                                            isShow("warning", WARNING_STATUS_ROLE);
                                        }
                                    }}
                                    className={`
                                group transition-all ease-in-out flex items-center gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full`}
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
                            {["deliveryReceipt", "returnSales", "import", "returns", "receipts", "payment"].includes(
                                props?.type
                            ) ? (
                                <Popup_Pdf
                                    dataLang={props.dataLang}
                                    props={props}
                                    openAction={openAction}
                                    setOpenAction={setOpenAction}
                                    {...shareProps}
                                />
                            ) : (
                                <FilePDF
                                    {...shareProps}
                                    props={props}
                                    openAction={openAction}
                                    setOpenAction={setOpenAction}
                                />
                            )}
                            {props.type == "sales_product" && (
                                <>
                                    {role == true || auth?.orders?.is_create == 1 || auth?.orders?.is_edit == 1 ? (
                                        <Popup_KeepStock {...props} {...shareProps} />
                                    ) : (
                                        <button
                                            onClick={() => isShow("warning", WARNING_STATUS_ROLE)}
                                            type="button"
                                            className={`${props.type == "sales_product" ? "" : "justify-center"
                                                } group transition-all ease-in-out flex items-center gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full`}
                                        >
                                            <Box1
                                                size={20}
                                                className="group-hover:text-orange-500 group-hover:scale-110 group-hover:shadow-md "
                                            />
                                            <p className="group-hover:text-orange-500 pr-4">
                                                {props.dataLang?.salesOrder_keep_stock || "salesOrder_keep_stock"}
                                            </p>
                                        </button>
                                    )}
                                </>
                            )}

                            {props.type == "sales_product" && (
                                <>
                                    {role == true || auth?.orders?.is_create == 1 || auth?.orders?.is_edit == 1 ? (
                                        <Popup_DetailKeepStock {...props} {...shareProps} />
                                    ) : (
                                        <button
                                            onClick={() => isShow("warning", WARNING_STATUS_ROLE)}
                                            type="button"
                                            className="group transition-all ease-in-out flex items-center justify-center gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full"
                                        >
                                            <BoxSearch
                                                size={20}
                                                className="group-hover:text-amber-500 group-hover:scale-110 group-hover:shadow-md "
                                            />
                                            <p className="group-hover:text-amber-500 pr-2.5">
                                                {props.dataLang?.salesOrder_see_stock_keeping ||
                                                    "salesOrder_see_stock_keeping"}
                                            </p>
                                        </button>
                                    )}
                                </>
                            )}
                            {props.type == "order" ? (
                                <Popup_TableValidateDelete
                                    {...shareProps}
                                    isOpen={isOpen}
                                    handleQueryId={handleQueryId}
                                    {...props}
                                    className="2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer rounded py-2.5"
                                />
                            ) : (
                                <>
                                    {
                                        <button
                                            onClick={() => {
                                                if (role) {
                                                    handleQueryId({ id: props?.id, status: true });
                                                } else if (checkDelete) {
                                                    handleQueryId({ id: props?.id, status: true });
                                                } else {
                                                    isShow("warning", WARNING_STATUS_ROLE);
                                                }
                                            }}
                                            className={` group transition-all ease-in-out flex items-center 
                                                ${(props.type == "products" && "justify-start") ||
                                                    props.type == "sales_product"
                                                    ? ""
                                                    : "justify-center"
                                                }  gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full`}
                                        >
                                            <RiDeleteBin6Line
                                                size={20}
                                                className="group-hover:text-[#f87171] group-hover:scale-110 group-hover:shadow-md "
                                            />
                                            <p className="group-hover:text-[#f87171]">
                                                {props.dataLang?.purchase_order_table_delete ||
                                                    "purchase_order_table_delete"}
                                            </p>
                                        </button>
                                    }
                                </>
                            )}
                        </div>
                    </div>
                </Popup>
            )}
            <PopupConfim
                dataLang={props.dataLang}
                type="warning"
                nameModel={props?.type}
                title={TITLE_DELETE}
                subtitle={CONFIRM_DELETION}
                isOpen={isOpen}
                save={() => handleDelete()}
                cancel={() => handleQueryId({ status: false })}
            />
        </div>
    );
});
const Popup_Pdf = (props) => {
    const { isOpen, handleOpen } = useToggle(false);

    const shareProps = {
        dataMaterialExpiry: props?.dataMaterialExpiry,
        dataProductExpiry: props?.dataProductExpiry,
        dataProductSerial: props?.dataProductSerial,
        dataSeting: props?.dataSeting,
    };
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
                onClickOpen={() => handleOpen(true)}
                open={isOpen}
                onClose={() => handleOpen(false)}
                classNameBtn={props?.className}
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <div className="space-x-5 w-[400px] h-auto">
                    <div>
                        <div className="w-[400px]">
                            <FilePDF
                                {...shareProps}
                                props={props.props}
                                openAction={props.openAction}
                                setOpenAction={props.setOpenAction}
                                dataLang={props.dataLang}
                            />
                        </div>
                    </div>
                </div>
            </PopupEdit>
        </>
    );
};


