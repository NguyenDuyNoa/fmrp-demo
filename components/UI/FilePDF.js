import moment from "moment";
import React, { useEffect, useState } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { VscFilePdf } from "react-icons/vsc";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { _ServerInstance as Axios } from "services/axios";

import {
    bottomForm,
    styleMarginChild,
    styleMarginChildTotal,
    styles,
    uppercaseTextHeaderTabel,
} from "../../configs/stylePdf/style";

import {
    lineHeght,
    styleForm,
    styleFormTow,
    titleDateOne,
    titleDateTwo,
    titleFooter,
    titleHeader,
    titleValue,
} from "../../configs/stylePdf/receiptsEndPayment";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import { Varela_Round } from "@next/font/google";

const FilePDF = ({
    props,
    // dataCompany,
    // data,
    setOpenAction,
    dataMaterialExpiry,
    dataProductExpiry,
    dataProductSerial,
    dataSeting
}) => {



    const [url, setUrl] = useState(null);

    const [dataCompany, setDataCompany] = useState(dataSeting);
    // uppercase text header table
    const uppercaseText = (text, style, alignment) => {
        return { text: text.toUpperCase(), style: style, alignment: alignment };
    };

    const formatMoney = (number) => {
        if (typeof number == 'string') {
            return formatMoneyConfig(+number ? +number : 0, dataSeting)
        }
        else if (typeof number == 'undefined') {
            return formatMoneyConfig(0, dataSeting);
        }
        return formatMoneyConfig(+number ? +number : 0, dataSeting)
    }

    const formatNumber = (number) => {
        if (typeof number == 'string') {
            return formatNumberConfig(+number ? +number : 0, dataSeting)
        }
        else if (typeof number == 'undefined') {
            return formatNumberConfig(0, dataSeting);
        }
        return formatNumberConfig(number, dataSeting);
    };


    useEffect(() => {
        dataSeting && setDataCompany(dataSeting)
    }, [dataSeting])

    const handlePrintPdf = async (type) => {
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
            production_warehouse: `/api_web/Api_stock/exportProduction/${props?.id}?csrf_protection=true`,
            productsWarehouse: `/api_web/Api_product_receipt/productReceipt/${props?.id}?csrf_protection=true`,
            recall: `/api_web/Api_material_recall/materialRecall/${props?.id}?csrf_protection=true`,
            exportToOther: `/api_web/Api_export_other/exportOther/${props?.id}?csrf_protection=true`,
            receipts: `/api_web/Api_expense_payslips/expenseCoupon/${props?.id}?csrf_protection=true`,
            payment: `/api_web/Api_expense_voucher/expenseVoucher/${props?.id}?csrf_protection=true`,
        };

        await Axios("GET", initialApi[props.type], {}, (err, response) => {
            if (response && response.data) {
                let db = props.type == "internal_plan" ? response.data.data : response.data;

                if (!db) return
                const {
                    docDefinition,
                    docDefinitionDeliveryFull,
                    docDefinitionReturnSalesFull,
                    docDefinitionInternalPlan,
                    docDefinitionPurchases,
                    docDefinitionOrder,
                    docDefinitionServiceVoucher,
                    docDefinitionImportFull,
                    docDefinitionReturnFull,
                    docDefinitionWarehouseTransfer,
                    docDefinitionProduction_warehouse,
                    docDefinitionProductionWarehouse,
                    docDefinitionRecall,
                    docDefinitionexportToOther,
                    ///2liên
                    docDefinitionReceiptsTwo,
                    docDefinitionPaymentTwo,

                    docDefinitionDeliveryNoPrice,
                    docDefinitionReturnSalesNoPrice,
                    docDefinitionImportNoPrice,
                    docDefinitionReturnFullNoPrice,
                    ///1 liên
                    docDefinitionReceipts,
                    docDefinitionPayment
                } = handleUpdateData(db)

                const dataPDF = {
                    fullTitle: {
                        sales_product: docDefinition,
                        price_quote: docDefinition,
                        deliveryReceipt: docDefinitionDeliveryFull,
                        returnSales: docDefinitionReturnSalesFull,
                        internal_plan: docDefinitionInternalPlan,
                        purchases: docDefinitionPurchases,
                        order: docDefinitionOrder,
                        serviceVoucher: docDefinitionServiceVoucher,
                        import: docDefinitionImportFull,
                        returns: docDefinitionReturnFull,
                        warehouseTransfer: docDefinitionWarehouseTransfer,
                        production_warehouse: docDefinitionProduction_warehouse,
                        productsWarehouse: docDefinitionProductionWarehouse,
                        recall: docDefinitionRecall,
                        exportToOther: docDefinitionexportToOther,
                        ///2liên
                        receipts: docDefinitionReceiptsTwo,
                        payment: docDefinitionPaymentTwo,
                    },

                    noprice: {
                        deliveryReceipt: docDefinitionDeliveryNoPrice,
                        returnSales: docDefinitionReturnSalesNoPrice,
                        import: docDefinitionImportNoPrice,
                        returns: docDefinitionReturnFullNoPrice,
                        ///1 liên
                        receipts: docDefinitionReceipts,
                        payment: docDefinitionPayment,
                    },
                };

                const dataKeys = Object.keys(dataPDF);
                if (dataKeys.includes(type) && dataPDF !== undefined && dataCompany !== undefined) {
                    const pdfGenerator = pdfMake.createPdf(dataPDF[type][props?.type]);
                    pdfGenerator.open((blob) => {
                        const url = URL.createObjectURL(blob);

                        setUrl(url);
                    });
                }
            } else {
                console.log("err", err);
            }
        });

    };

    const handleUpdateData = (data) => {
        // Ngày hiện tại
        const currentDate = moment().format("[Ngày] DD [Tháng] MM [Năm] YYYY");
        const words = data?.total_amount_word?.split(" ");

        const capitalizedWords = words?.map((word) => {
            if (word.length > 0) {
                return word?.charAt(0)?.toUpperCase() + word?.slice(1);
            }
            return word;
        });
        const capitalizedTotalAmountWord = capitalizedWords?.join(" ");
        //Báo giá, đơn hàng bán
        // In hoa chữ cái đầu

        const contentColumns = {
            columns: [
                {
                    width: "30%",
                    stack: [
                        {
                            image: "logo",
                            width: 100,
                            height: 100,
                            alignment: "left",
                            margin: [0, -15, 0, 5],
                            fit: [100, 100],
                        },
                    ],
                },
                {
                    width: "70%",
                    stack: [
                        {
                            text: `${dataCompany?.company_name}`,
                            style: "headerInfo",
                        },
                        {
                            text: dataCompany?.company_address ? `Địa chỉ : ${dataCompany?.company_address}` : "",
                            style: "headerInfoText",
                        },
                        {
                            text: dataCompany?.company_phone_number
                                ? `Số điện thoại: ${dataCompany?.company_phone_number}`
                                : "",
                            style: "headerInfoText",
                        },
                        {
                            text: [
                                {
                                    text: dataCompany?.company_email ? `Email: ${dataCompany?.company_email}` : "",
                                    style: "headerInfoText",
                                },
                                "    ",
                                {
                                    text: dataCompany?.company_website ? `Website: ${dataCompany?.company_website}` : "",
                                    style: "headerInfoText",
                                },
                            ],
                            margin: [0, -4, 0, 0],
                        },
                    ],
                    margin: [0, -20, 0, 5],
                },
            ],
            columnGap: 10,
        };

        const docDefinition = {
            info: {
                title: `${(props?.type === "price_quote" && `Báo Giá - ${data?.reference_no}`) ||
                    (props?.type === "sales_product" && `Đơn Hàng Bán - ${data?.code}`)
                    }`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            pageOrientation: "portrait",
            content: [
                {
                    ...contentColumns,
                },
                { canvas: lineHeght() },
                {
                    stack: [
                        {
                            text:
                                (props?.type === "price_quote" && uppercaseText("bảng báo giá", "contentTitle")) ||
                                (props?.type === "sales_product" && uppercaseText("đơn hàng bán", "contentTitle")),
                        },
                    ],
                    margin: [0, 8, 0, 0],
                },
                {
                    columns: [
                        {
                            text: "",
                            width: "80%",
                        },
                        {
                            width: "20%",
                            stack: [
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.purchase_order_table_code + ": " ||
                                                "purchase_order_table_code"
                                                }`,

                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${(props?.type === "price_quote" && `${data?.reference_no}`) ||
                                                (props?.type === "sales_product" && `${data?.code}`)
                                                }`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 10, 0, 2],
                                },
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.purchase_order_table_dayvoucers + ": " ||
                                                "purchase_order_table_dayvoucers"
                                                }`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text:
                                                (props?.type === "price_quote" &&
                                                    `${moment(data?.date).format("DD/MM/YYYY")}`) ||
                                                (props?.type === "sales_product" &&
                                                    `${moment(data?.date).format("DD/MM/YYYY")}`),

                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 2, 0, 2],
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },
                {
                    text: [
                        { text: "Khách hàng: ", inline: true, fontSize: 10 },
                        {
                            text: `${data?.client_name}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },
                {
                    table: {
                        widths: "100%",
                        headerRows: 0,
                        widths: ["auto", "*", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
                        body: [
                            // Header row
                            [
                                uppercaseTextHeaderTabel("STT", "headerTable", "center"),
                                uppercaseTextHeaderTabel("Mặt hàng", "headerTable", "left"),
                                uppercaseTextHeaderTabel("ĐVT", "headerTable", "center"),
                                uppercaseTextHeaderTabel("SL", "headerTable", "center"),
                                uppercaseTextHeaderTabel("Đơn giá", "headerTable", "center"),
                                uppercaseTextHeaderTabel("% CK", "headerTable", "center"),
                                uppercaseTextHeaderTabel("ĐGSCK", "headerTable", "center"),
                                uppercaseTextHeaderTabel("Tổng cộng", "headerTable", "center"),
                                uppercaseTextHeaderTabel("Ghi chú", "headerTable", "center"),
                            ],
                            // Data rows
                            ...((data && props?.type === "price_quote") ||
                                (props?.type === "sales_product" && data?.items.length > 0)
                                ? data?.items.map((item, index) => {
                                    return [
                                        {
                                            text: `${index + 1}`,
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text:
                                                item?.item?.name && item?.item?.code
                                                    ? `${item?.item?.name} (${item?.item?.product_variation})`
                                                    : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.item?.unit_name ? `${item?.item?.unit_name}` : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.quantity ? `${formatNumber(item?.quantity)}` : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.price ? `${formatMoney(item?.price)}` : "",
                                            alignment: "right",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.discount_percent ? `${item?.discount_percent}%` : "",

                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.price_after_discount
                                                ? `${formatMoney(item?.price_after_discount)}`
                                                : "",
                                            alignment: "right",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.price_after_discount
                                                ? `${formatMoney(item?.price_after_discount * item?.quantity)}`
                                                : "",
                                            alignment: "right",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            // note_item
                                            text: item?.note ? `${item?.note}` : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                    ];
                                })
                                : ""),
                            [
                                { text: "Tổng cộng", bold: true, colSpan: 2, fontSize: 10, margin: styleMarginChildTotal },
                                "",
                                {
                                    text: `${formatMoney(data?.total_price_after_discount)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                { text: "Tiền thuế", bold: true, colSpan: 2, fontSize: 10, margin: styleMarginChildTotal },
                                "",
                                {
                                    text: `${formatMoney(data?.total_tax_price)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                { text: "Thành tiền", bold: true, colSpan: 2, fontSize: 10, margin: styleMarginChildTotal },
                                "",
                                {
                                    text: `${formatMoney(data?.total_amount)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                        ],
                    },
                },
                {
                    text: [
                        { text: "Thành tiền bằng chữ: ", inline: true, fontSize: 10, margin: styleMarginChildTotal },
                        { text: capitalizedTotalAmountWord, fontSize: 10, bold: true },
                    ],
                    margin: [0, 5, 0, 0],
                },
                props?.type != "deliveryReceipt"
                    ? {
                        columns: [
                            {
                                text: "",
                                width: "50%",
                            },
                            {
                                width: "50%",
                                stack: [
                                    {
                                        text: currentDate,
                                        style: "dateText",
                                        alignment: "center",
                                        fontSize: 10,
                                    },
                                    {
                                        text: "Người Lập Phiếu",
                                        style: "signatureText",
                                        alignment: "center",
                                        fontSize: 10,
                                    },
                                    {
                                        text: "(Ký, ghi rõ họ tên)",
                                        style: "signatureText",
                                        alignment: "center",
                                        fontSize: 10,
                                    },
                                ],
                            },
                        ],
                        columnGap: 2,
                    }
                    : null,
            ],
            styles: styles,
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };
        ///phiếu giao hàng
        const docDefinitionDeliveryFull = {
            info: {
                title: `${props?.type === "deliveryReceipt" && `Phiếu Giao Hàng - ${data?.reference_no}`}`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            pageOrientation: "portrait",
            content: [
                {
                    ...contentColumns,
                },
                { canvas: lineHeght() },
                {
                    stack: [
                        {
                            text: uppercaseText(`Trả lại hàng mua`, "contentTitle"),
                        },
                    ],
                    margin: [0, 8, 0, 0],
                },
                {
                    columns: [
                        {
                            text: "",
                            width: "80%",
                        },
                        {
                            width: "20%",
                            stack: [
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.import_code_vouchers + ": " || "import_code_vouchers"
                                                }`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${data?.reference_no}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 10, 0, 2],
                                },
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.import_day_vouchers + ": " || "import_day_vouchers"}`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${moment(data?.date).format("DD/MM/YYYY")}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 2, 0, 2],
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },

                {
                    text: [
                        { text: "Khách hàng: ", inline: true, fontSize: 10 },
                        {
                            text: (props?.type == "deliveryReceipt" && `${data?.customer_name}`) || `${data?.client_name}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },
                props?.type == "deliveryReceipt"
                    ? {
                        text: [
                            { text: "Địa chỉ giao hàng: ", inline: true, fontSize: 10 },
                            { text: `${data?.name_address_delivery}`, bold: true, fontSize: 10 },
                        ],
                        margin: [0, 2, 0, 2],
                    }
                    : null,
                {
                    text: [
                        {
                            text: `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}: `,
                            inline: true,
                            fontSize: 10,
                        },
                        { text: `${data?.note}`, bold: true, fontSize: 10 },
                    ],
                    margin: [0, 2, 0, 10],
                },
                {
                    table: {
                        widths: "100%",
                        headerRows: 0,
                        widths: props?.type == "deliveryReceipt" && [
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "*",
                        ],
                        body: [
                            // Header row
                            [
                                uppercaseTextHeaderTabel("STT", "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.purchase_items || "purchase_items"}`,
                                    "headerTables",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.PDF_infoItem || "PDF_infoItem"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(`${"ĐVT"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(`${"SL"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.inventory_unit_price || "inventory_unit_price"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_tax || "serviceVoucher_tax"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_into_money || "serviceVoucher_into_money"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}`,
                                    "headerTable",
                                    "center"
                                ),
                            ],

                            // Data rows
                            ...(data && props?.type == "deliveryReceipt" && data?.items.length > 0
                                ? data?.items.map((item, index) => {
                                    const stack = [];
                                    const stackBt = [];
                                    stack.push({
                                        text: item?.item?.name ? item?.item?.name : "",
                                        fontSize: 10,
                                        margin: styleMarginChild,
                                    });
                                    stackBt.push({
                                        text: `Biến thể: ${item?.item?.product_variation}`,
                                        fontSize: 9,
                                        italics: true,
                                        margin: styleMarginChild,
                                    });

                                    if (dataProductSerial?.is_enable === "1") {
                                        const serialStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Serial: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text:
                                                            item.serial == null || item.serial == "" ? "-" : item.serial,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                            },
                                        ];
                                        stackBt.push(serialStack);
                                    }

                                    if (dataMaterialExpiry?.is_enable === "1" || dataProductExpiry?.is_enable === "1") {
                                        const subStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Lot: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text: item.lot == null || item.lot == "" ? "-" : item.lot,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                            {
                                                text: [
                                                    {
                                                        text: "Date: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text: item.expiration_date
                                                            ? moment(item.expiration_date).format("DD/MM/YYYY")
                                                            : "-",
                                                        fontSize: 8.5,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                        ];
                                        stackBt.push(subStack);
                                    }
                                    return [
                                        {
                                            text: `${index + 1}`,
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            stack: stack,
                                        },
                                        { stack: stackBt },
                                        {
                                            text: item?.item?.unit_name ? item?.item?.unit_name : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.quantity ? formatNumber(item?.quantity) : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.price_after_discount
                                                ? formatMoney(item?.price_after_discount)
                                                : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },

                                        {
                                            text: item?.tax_rate_item ? `${item?.tax_rate_item + "%"}` : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.amount ? `${formatMoney(item?.amount)}` : "",
                                            alignment: "right",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.note ? item?.note : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                    ];
                                })
                                : ""),
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_table_total || "purchase_order_table_total"}`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_price)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    margin: styleMarginChildTotal,
                                    fontSize: 10,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_discounty || "purchase_order_detail_discounty"
                                        }`,
                                    bold: true,
                                    colSpan: 2,
                                    margin: styleMarginChildTotal,
                                    fontSize: 10,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_discount)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    margin: styleMarginChildTotal,
                                    fontSize: 10,
                                },
                                "",

                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_money_after_discount ||
                                        "purchase_order_detail_money_after_discount"
                                        }`,
                                    margin: styleMarginChildTotal,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_price_after_discount)}`,
                                    bold: true,
                                    alignment: "right",
                                    margin: styleMarginChildTotal,
                                    colSpan: 7,
                                    fontSize: 10,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_tax_money || "purchase_order_detail_tax_money"
                                        }`,
                                    margin: styleMarginChildTotal,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_tax_price)}`,
                                    bold: true,
                                    alignment: "right",
                                    margin: styleMarginChildTotal,
                                    colSpan: 7,
                                    fontSize: 10,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_into_money ||
                                        "purchase_order_detail_into_money"
                                        }`,
                                    bold: true,
                                    margin: styleMarginChildTotal,
                                    colSpan: 2,
                                    fontSize: 10,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_amount)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    margin: styleMarginChildTotal,
                                    fontSize: 10,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                        ],
                    },
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.PDF_price || "PDF_price"} : `,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: capitalizedTotalAmountWord,
                            fontSize: 10,
                            bold: true,
                        },
                    ],
                    margin: [0, 5, 0, 0],
                },
                bottomForm(props, currentDate).date,
                bottomForm(props, currentDate).column,
            ],
            styles: styles,
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };

        //giao hàng not price

        const docDefinitionDeliveryNoPrice = {
            info: {
                title: `${props?.type === "deliveryReceipt" && `Phiếu Giao Hàng - ${data?.reference_no}`}`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            pageOrientation: "portrait",
            content: [
                {
                    ...contentColumns,
                },
                { canvas: lineHeght() },
                {
                    stack: [
                        {
                            text: uppercaseText(`Trả lại hàng mua`, "contentTitle"),
                        },
                    ],
                    margin: [0, 8, 0, 0],
                },

                {
                    columns: [
                        {
                            text: "",
                            width: "80%",
                        },
                        {
                            width: "20%",
                            stack: [
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.import_code_vouchers + ": " || "import_code_vouchers"
                                                }`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${data?.reference_no}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 10, 0, 2],
                                },
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.import_day_vouchers + ": " || "import_day_vouchers"}`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${moment(data?.date).format("DD/MM/YYYY")}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 2, 0, 2],
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },

                {
                    text: [
                        { text: "Khách hàng: ", inline: true, fontSize: 10 },
                        {
                            text: (props?.type == "deliveryReceipt" && `${data?.customer_name}`) || `${data?.client_name}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },
                props?.type == "deliveryReceipt"
                    ? {
                        text: [
                            { text: "Địa chỉ giao hàng: ", inline: true, fontSize: 10 },
                            { text: `${data?.name_address_delivery}`, bold: true, fontSize: 10 },
                        ],
                        margin: [0, 2, 0, 2],
                    }
                    : null,
                {
                    text: [
                        {
                            text: `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}: `,
                            inline: true,
                            fontSize: 10,
                        },
                        { text: `${data?.note}`, bold: true, fontSize: 10 },
                    ],
                    margin: [0, 2, 0, 10],
                },
                {
                    table: {
                        widths: "100%",
                        headerRows: 0,
                        widths: props?.type == "deliveryReceipt" && ["auto", "auto", "auto", "auto", "auto", "auto", "*"],
                        body: [
                            // Header row
                            [
                                uppercaseTextHeaderTabel("STT", "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.inventory_items || "inventory_items"}`,
                                    "headerTables",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.PDF_infoItem || "PDF_infoItem"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.PDF_house || "PDF_house"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(`${"ĐVT"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(`${"SL"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}`,
                                    "headerTable",
                                    "center"
                                ),
                            ],

                            // Data rows
                            ...(data && props?.type == "deliveryReceipt" && data?.items.length > 0
                                ? data?.items.map((item, index) => {
                                    const stack = [];
                                    const stackBt = [];
                                    stack.push({
                                        text: item?.item?.name ? item?.item?.name : "",
                                        fontSize: 10,
                                        margin: styleMarginChild,
                                    });
                                    stackBt.push({
                                        text: `Biến thể: ${item?.item?.product_variation}`,
                                        fontSize: 9,
                                        italics: true,
                                        margin: styleMarginChild,
                                    });

                                    if (dataProductSerial?.is_enable === "1") {
                                        const serialStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Serial: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text:
                                                            item.serial == null || item.serial == "" ? "-" : item.serial,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                            },
                                        ];
                                        stackBt.push(serialStack);
                                    }

                                    if (dataMaterialExpiry?.is_enable === "1" || dataProductExpiry?.is_enable === "1") {
                                        const subStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Lot: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text: item.lot == null || item.lot == "" ? "-" : item.lot,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                            {
                                                text: [
                                                    {
                                                        text: "Date: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text: item.expiration_date
                                                            ? moment(item.expiration_date).format("DD/MM/YYYY")
                                                            : "-",
                                                        fontSize: 8.5,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                        ];
                                        stackBt.push(subStack);
                                    }
                                    return [
                                        {
                                            text: `${index + 1}`,
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            stack: stack,
                                        },
                                        //   location_name
                                        {
                                            stack: stackBt,
                                        },
                                        {
                                            stack: [
                                                {
                                                    text: item?.item?.warehouse_location?.warehouse_name
                                                        ? item?.item?.warehouse_location?.warehouse_name
                                                        : "",
                                                    fontSize: 10,
                                                    margin: styleMarginChild,
                                                },
                                                {
                                                    text: item?.item?.warehouse_location?.location_name
                                                        ? `(${item?.item?.warehouse_location?.location_name})`
                                                        : "",
                                                    fontSize: 9,
                                                    italics: true,
                                                    margin: styleMarginChild,
                                                },
                                            ],
                                        },
                                        {
                                            text: item?.item?.unit_name ? item?.item?.unit_name : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.quantity ? formatNumber(item?.quantity) : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.note ? item?.note : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                    ];
                                })
                                : ""),
                            [
                                {
                                    text: `${props.dataLang?.inventory_total_item || "inventory_total_item"}`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatNumber(data?.items?.length)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 5,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_totalCount || "purchase_totalCount"}`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatNumber(
                                        data?.items?.reduce((accumulator, item) => accumulator + parseInt(item.quantity), 0)
                                    )}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 5,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                            ],
                            //   [{ text: `${"Tổng số lượng"}`, bold: true, colSpan: 5, fontSize: 10 },'', '','','',{ text: `${formatNumber(data?.total_price)}`, bold: true, alignment: 'right', colSpan: 5, fontSize: 10 },'','','',''],
                        ],
                    },
                },
                bottomForm(props, currentDate).date,
                bottomForm(props, currentDate).column,
            ],
            styles: styles,
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };

        //Trả lại hàng not full
        const docDefinitionReturnSalesFull = {
            info: {
                title: `${props?.type === "returnSales" && `Trả lại hàng bán - ${data?.code}`}`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            pageOrientation: "portrait",
            content: [
                {
                    ...contentColumns,
                },
                { canvas: lineHeght() },
                {
                    stack: [
                        {
                            text: uppercaseText(`Trả lại hàng bán`, "contentTitle"),
                        },
                    ],
                    margin: [0, 8, 0, 0],
                },
                {
                    columns: [
                        {
                            text: "",
                            width: "80%",
                        },
                        {
                            width: "20%",
                            stack: [
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.import_code_vouchers + ": " || "import_code_vouchers"
                                                }`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${data?.code}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 10, 0, 2],
                                },
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.import_day_vouchers + ": " || "import_day_vouchers"}`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${moment(data?.date).format("DD/MM/YYYY")}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 2, 0, 2],
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },

                {
                    text: [
                        {
                            text: `${props?.dataLang?.returnSales_client || "returnSales_client"}: `,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: `${data?.client_name}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}: `,
                            inline: true,
                            fontSize: 10,
                        },
                        { text: `${data?.note}`, bold: true, fontSize: 10 },
                    ],
                    margin: [0, 2, 0, 10],
                },
                {
                    table: {
                        widths: "100%",
                        headerRows: 0,
                        widths: props?.type == "returnSales" && [
                            "auto",
                            "auto",
                            "auto",
                            // "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "*",
                        ],
                        body: [
                            // Header row
                            [
                                uppercaseTextHeaderTabel("STT", "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.purchase_items || "purchase_items"}`,
                                    "headerTables",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.PDF_infoItem || "PDF_infoItem"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(`${"ĐVT"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(`${"SL"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.inventory_unit_price || "inventory_unit_price"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_tax || "serviceVoucher_tax"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_into_money || "serviceVoucher_into_money"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}`,
                                    "headerTable",
                                    "center"
                                ),
                            ],

                            // Data rows
                            ...(data && props?.type == "returnSales" && data?.items.length > 0
                                ? data?.items.map((item, index) => {
                                    const stack = [];
                                    const stackBt = [];
                                    stack.push({
                                        text: item?.item?.name ? item?.item?.name : "",
                                        fontSize: 10,
                                        margin: styleMarginChild,
                                    });
                                    stackBt.push({
                                        text: `Biến thể: ${item?.item?.product_variation}`,
                                        fontSize: 9,
                                        italics: true,
                                        margin: styleMarginChild,
                                    });

                                    if (dataProductSerial?.is_enable === "1") {
                                        const serialStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Serial: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text:
                                                            item?.item?.serial == null || item?.item?.serial == ""
                                                                ? "-"
                                                                : item?.item?.serial,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                            },
                                        ];
                                        stackBt.push(serialStack);
                                    }

                                    if (dataMaterialExpiry?.is_enable === "1" || dataProductExpiry?.is_enable === "1") {
                                        const subStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Lot: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text:
                                                            item?.item?.lot == null || item?.item?.lot == ""
                                                                ? "-"
                                                                : item?.item?.lot,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                            {
                                                text: [
                                                    {
                                                        text: "Date: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text: item?.item?.expiration_date
                                                            ? moment(item?.item?.expiration_date).format("DD/MM/YYYY")
                                                            : "-",
                                                        fontSize: 8.5,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                        ];
                                        stackBt.push(subStack);
                                    }
                                    return [
                                        {
                                            text: `${index + 1}`,
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            stack: stack,
                                        },
                                        { stack: stackBt },
                                        {
                                            text: item?.item?.unit_name ? item?.item?.unit_name : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.quantity ? formatNumber(item?.quantity) : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.price_after_discount
                                                ? formatMoney(item?.price_after_discount)
                                                : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },

                                        {
                                            text: item?.tax_rate ? `${item?.tax_rate + "%"}` : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.amount ? `${formatMoney(item?.amount)}` : "",
                                            alignment: "right",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.note ? item?.note : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                    ];
                                })
                                : ""),
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_table_total || "purchase_order_table_total"}`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_price)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    margin: styleMarginChildTotal,
                                    fontSize: 10,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_discounty || "purchase_order_detail_discounty"
                                        }`,
                                    bold: true,
                                    colSpan: 2,
                                    margin: styleMarginChildTotal,
                                    fontSize: 10,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_discount)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    margin: styleMarginChildTotal,
                                    fontSize: 10,
                                },
                                "",

                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_money_after_discount ||
                                        "purchase_order_detail_money_after_discount"
                                        }`,
                                    margin: styleMarginChildTotal,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_price_after_discount)}`,
                                    bold: true,
                                    alignment: "right",
                                    margin: styleMarginChildTotal,
                                    colSpan: 7,
                                    fontSize: 10,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_tax_money || "purchase_order_detail_tax_money"
                                        }`,
                                    margin: styleMarginChildTotal,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_tax_price)}`,
                                    bold: true,
                                    alignment: "right",
                                    margin: styleMarginChildTotal,
                                    colSpan: 7,
                                    fontSize: 10,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_into_money ||
                                        "purchase_order_detail_into_money"
                                        }`,
                                    bold: true,
                                    margin: styleMarginChildTotal,
                                    colSpan: 2,
                                    fontSize: 10,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_amount)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    margin: styleMarginChildTotal,
                                    fontSize: 10,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                        ],
                    },
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.PDF_price || "PDF_price"} : `,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: capitalizedTotalAmountWord,
                            fontSize: 10,
                            bold: true,
                        },
                    ],
                    margin: [0, 5, 0, 0],
                },
                bottomForm(props, currentDate).date,
                bottomForm(props, currentDate).column,
            ],
            styles: styles,
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };

        //Trả lại hàng not price

        const docDefinitionReturnSalesNoPrice = {
            info: {
                title: `${props?.type === "returnSales" && `Trả lại hàng bán - ${data?.code}`}`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            pageOrientation: "portrait",
            content: [
                {
                    ...contentColumns,
                },
                { canvas: lineHeght() },
                {
                    stack: [
                        {
                            text: uppercaseText(`Trả lại hàng bán`, "contentTitle"),
                        },
                    ],
                    margin: [0, 8, 0, 0],
                },

                {
                    columns: [
                        {
                            text: "",
                            width: "80%",
                        },
                        {
                            width: "20%",
                            stack: [
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.import_code_vouchers + ": " || "import_code_vouchers"
                                                }`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${data?.code}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 10, 0, 2],
                                },
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.import_day_vouchers + ": " || "import_day_vouchers"}`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${moment(data?.date).format("DD/MM/YYYY")}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 2, 0, 2],
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },

                {
                    text: [
                        {
                            text: `${props?.dataLang?.returnSales_client || "returnSales_client"}: `,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: `${data?.client_name}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },

                {
                    text: [
                        {
                            text: `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}: `,
                            inline: true,
                            fontSize: 10,
                        },
                        { text: `${data?.note}`, bold: true, fontSize: 10 },
                    ],
                    margin: [0, 2, 0, 10],
                },
                {
                    table: {
                        widths: "100%",
                        headerRows: 0,
                        widths: props?.type == "returnSales" && ["auto", "auto", "auto", "auto", "auto", "auto", "*"],
                        body: [
                            // Header row
                            [
                                uppercaseTextHeaderTabel("STT", "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.inventory_items || "inventory_items"}`,
                                    "headerTables",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.PDF_infoItem || "PDF_infoItem"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.PDF_house || "PDF_house"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(`${"ĐVT"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(`${"SL"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}`,
                                    "headerTable",
                                    "center"
                                ),
                            ],

                            // Data rows
                            ...(data && props?.type == "returnSales" && data?.items.length > 0
                                ? data?.items.map((item, index) => {
                                    const stack = [];
                                    const stackBt = [];
                                    stack.push({
                                        text: item?.item?.name ? item?.item?.name : "",
                                        fontSize: 10,
                                        margin: styleMarginChild,
                                    });
                                    stackBt.push({
                                        text: `Biến thể: ${item?.item?.product_variation}`,
                                        fontSize: 9,
                                        italics: true,
                                        margin: styleMarginChild,
                                    });

                                    if (dataProductSerial?.is_enable === "1") {
                                        const serialStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Serial: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text:
                                                            item?.item?.serial == null || item?.item?.serial == ""
                                                                ? "-"
                                                                : item?.item?.serial,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                            },
                                        ];
                                        stackBt.push(serialStack);
                                    }

                                    if (dataMaterialExpiry?.is_enable === "1" || dataProductExpiry?.is_enable === "1") {
                                        const subStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Lot: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text:
                                                            item?.item?.lot == null || item?.item?.lot == ""
                                                                ? "-"
                                                                : item?.item?.lot,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                            {
                                                text: [
                                                    {
                                                        text: "Date: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text: item?.item.expiration_date
                                                            ? moment(item?.item.expiration_date).format("DD/MM/YYYY")
                                                            : "-",
                                                        fontSize: 8.5,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                        ];
                                        stackBt.push(subStack);
                                    }
                                    return [
                                        {
                                            text: `${index + 1}`,
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            stack: stack,
                                        },
                                        //   location_name
                                        {
                                            stack: stackBt,
                                        },
                                        {
                                            stack: [
                                                {
                                                    text: item?.warehouse_name ? item?.warehouse_name : "",
                                                    fontSize: 10,
                                                    margin: styleMarginChild,
                                                },
                                                {
                                                    text: item?.location_name ? `(${item?.location_name})` : "",
                                                    fontSize: 9,
                                                    italics: true,
                                                    margin: styleMarginChild,
                                                },
                                            ],
                                        },
                                        {
                                            text: item?.item?.unit_name ? item?.item?.unit_name : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.quantity ? formatNumber(item?.quantity) : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.note ? item?.note : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                    ];
                                })
                                : ""),
                            [
                                {
                                    text: `${props.dataLang?.inventory_total_item || "inventory_total_item"}`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatNumber(data?.items?.length)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 5,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_totalCount || "purchase_totalCount"}`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatNumber(
                                        data?.items?.reduce((accumulator, item) => accumulator + parseInt(item.quantity), 0)
                                    )}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 5,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                            ],
                            //   [{ text: `${"Tổng số lượng"}`, bold: true, colSpan: 5, fontSize: 10 },'', '','','',{ text: `${formatNumber(data?.total_price)}`, bold: true, alignment: 'right', colSpan: 5, fontSize: 10 },'','','',''],
                        ],
                    },
                },
                bottomForm(props, currentDate).date,
                bottomForm(props, currentDate).column,
            ],
            styles: styles,
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };

        ///kế hoạch nội bộ
        const docDefinitionInternalPlan = {
            pageOrientation: "portrait",
            info: {
                title: `${`${"Kế hoạch nội bộ"} - ${data?.internalPlans?.reference_no}`}`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            content: [
                {
                    ...contentColumns,
                },
                { canvas: lineHeght() },
                {
                    stack: [
                        {
                            text: uppercaseText(`Kế hoạch nội bộ`, "contentTitle"),
                        },
                    ],
                    margin: [0, 8, 0, 0],
                },
                {
                    columns: [
                        {
                            text: "",
                            width: "80%",
                        },
                        {
                            width: "20%",
                            stack: [
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.import_code_vouchers + ": " || "import_code_vouchers"
                                                }`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${data?.internalPlans?.reference_no}`,
                                            bold: true,
                                            fontSize: 7,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 10, 0, 2],
                                },
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.import_day_vouchers + ": " || "import_day_vouchers"}`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${moment(data?.internalPlans?.date).format("DD/MM/YYYY")}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 2, 0, 2],
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },
                {
                    text: [
                        {
                            text: `${"Tên kế hoạch"}: `,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: `${data?.internalPlans?.plan_name}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },

                {
                    text: [
                        {
                            text: `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}: `,
                            inline: true,
                            fontSize: 10,
                        },
                        { text: `${data?.internalPlans?.note}`, bold: true, fontSize: 10 },
                    ],
                    margin: [0, 2, 0, 10],
                },
                {
                    table: {
                        widths: "100%",
                        headerRows: 0,
                        widths: props?.type == "internal_plan" && ["auto", "auto", "auto", "auto", "auto", "*"],
                        body: [
                            // Header row
                            [
                                uppercaseTextHeaderTabel("STT", "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.inventory_items || "inventory_items"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.PDF_infoItem || "PDF_infoItem"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(`${"ĐVT"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(`${"SL"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}`,
                                    "headerTable",
                                    "center"
                                ),
                            ],

                            // Data rows
                            ...(data && props?.type == "internal_plan" && data?.internalPlansItems.length > 0
                                ? data?.internalPlansItems.map((item, index) => {
                                    const stack = [];
                                    const stackBt = [];
                                    stack.push({
                                        text: item?.item_name ? item?.item_name : "",
                                        fontSize: 10,
                                        margin: styleMarginChild,
                                    });
                                    stackBt.push({
                                        text: `Biến thể: ${item?.product_variation}`,
                                        fontSize: 9,
                                        italics: true,
                                        margin: styleMarginChild,
                                    });

                                    return [
                                        {
                                            text: `${index + 1}`,
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            stack: stack,
                                        },
                                        //   location_name
                                        {
                                            stack: stackBt,
                                        },
                                        {
                                            text: item?.unit_name ? item?.unit_name : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.quantity ? formatNumber(item?.quantity) : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.note_item ? item?.note_item : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                    ];
                                })
                                : ""),
                            [
                                {
                                    text: `${"Tổng số lượng"}`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                {
                                    text: `${formatNumber(data?.internalPlans?.total_quantity)}`,
                                    bold: true,
                                    alignment: "center",
                                    colSpan: 1,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                            ],
                        ],
                    },
                },
                { style: "dateTexts", text: `${currentDate}`, alignment: "right" },
                titleFooter(props, ""),
            ],
            styles: styles,
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };

        /// yêu cầu mua hàng
        const docDefinitionPurchases = {
            info: {
                title: `${props?.type === "purchases" && `${props.dataLang?.purchase_title || "purchase_title"} - ${data?.code}`
                    }`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            pageOrientation: "portrait",
            content: [
                {
                    ...contentColumns,
                },
                { canvas: lineHeght() },
                {
                    stack: [
                        {
                            text:
                                props?.type === "purchases" &&
                                uppercaseText(`${props.dataLang?.purchase_title || "purchase_title"}`, "contentTitle"),
                        },
                    ],
                    margin: [0, 8, 0, 0],
                },
                {
                    columns: [
                        {
                            text: "",
                            width: "80%",
                        },
                        {
                            width: "20%",
                            stack: [
                                {
                                    text: [
                                        {
                                            text:
                                                props?.type === "purchases" &&
                                                `${props.dataLang?.purchase_code + ": " || "purchase_code"}`,

                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: props?.type === "purchases" && `${data?.code}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 10, 0, 2],
                                },
                                {
                                    text: [
                                        {
                                            text: "Ngày chứng từ: ",
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${moment(data?.date).format("DD/MM/YYYY")}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 2, 0, 2],
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },
                {
                    text: [
                        {
                            text:
                                props?.type === "purchases"
                                    ? `${props.dataLang?.purchase_planNumber + ": " || "purchase_planNumber"}`
                                    : "",
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text:
                                props?.type === "purchases"
                                    ? `${data?.reference_no != null ? data?.reference_no : ""}`
                                    : "",
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 0, 0, 2],
                },

                {
                    text: [
                        {
                            text: `${props.dataLang?.purchase_note + ": " || "purchase_note"}`,
                            inline: true,
                            fontSize: 10,
                        },
                        { text: `${data?.note}`, bold: true, fontSize: 10 },
                    ],
                    margin: [0, 2, 0, 10],
                },
                {
                    table: {
                        widths: "100%",
                        headerRows: 0,
                        widths: ["auto", "auto", "auto", "auto", "auto", "*"],
                        // widths: props?.type== "purchases" && [17, 200,30,50,'*'],
                        body: [
                            // Header row
                            props?.type == "purchases" && [
                                uppercaseTextHeaderTabel("STT", "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.purchase_items || "purchase_items"}`,
                                    "headerTable",
                                    "left"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.purchase_variant || "purchase_variant"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(`${"ĐVT"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(`${"SL"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.purchase_note || "purchase_note"}`,
                                    "headerTable",
                                    "center"
                                ),
                            ],
                            // Data rows

                            ...(data && props?.type == "purchases" && data?.items?.length > 0
                                ? data?.items.map((item, index) => {
                                    return [
                                        {
                                            text: `${index + 1}`,
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.item?.name ? item?.item?.name : "",
                                            fontSize: 11,
                                            noWrap: true,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.item?.product_variation
                                                ? ` ${item?.item?.product_variation}`
                                                : "",
                                            fontSize: 10,
                                            noWrap: true,
                                            alignment: "left",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.item?.unit_name ? `${item?.item?.unit_name}` : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.quantity ? `${formatNumber(item?.quantity)}` : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.note ? `${item?.note}` : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                    ];
                                })
                                : ""),

                            props?.type == "purchases"
                                ? [
                                    {
                                        text: `${props.dataLang?.purchase_totalItem || "purchase_totalItem"}`,
                                        bold: true,
                                        colSpan: 2,
                                        fontSize: 10,
                                        margin: styleMarginChildTotal,
                                    },
                                    "",
                                    {
                                        text: `${formatNumber(data?.total_item)}`,
                                        bold: true,
                                        alignment: "right",
                                        colSpan: 4,
                                        fontSize: 10,
                                        margin: styleMarginChildTotal,
                                    },
                                    "",
                                    "",
                                    "",
                                ]
                                : ["", ""],
                            props?.type == "purchases"
                                ? [
                                    {
                                        text: `${props.dataLang?.purchase_totalCount || "purchase_totalCount"}`,
                                        bold: true,
                                        colSpan: 2,
                                        margin: styleMarginChildTotal,
                                        fontSize: 10,
                                    },
                                    "",
                                    {
                                        text: `${formatNumber(data?.total_item_quantity)}`,
                                        bold: true,
                                        alignment: "right",
                                        colSpan: 4,
                                        fontSize: 10,
                                        margin: styleMarginChildTotal,
                                    },
                                    "",
                                    "",
                                    "",
                                ]
                                : ["", ""],
                        ],
                    },
                },
                {
                    columns: [
                        {
                            text: "",
                            width: "50%",
                        },
                        {
                            width: "50%",
                            stack: [
                                {
                                    text: currentDate,
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${props.dataLang?.PDF_userMaker || "PDF_userMaker"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },
            ],
            styles: styles,
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };

        ///Đơn đặt hàng po
        const docDefinitionOrder = {
            info: {
                title: `${`${props.dataLang?.purchase_order || "purchase_order"} - ${data?.code}`}`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            pageOrientation: "portrait",
            content: [
                {
                    ...contentColumns,
                },
                { canvas: lineHeght() },
                {
                    stack: [
                        {
                            text: uppercaseText(`${props.dataLang?.purchase_order || "purchase_order"}`, "contentTitle"),
                        },
                    ],
                    margin: [0, 8, 0, 0],
                },

                {
                    columns: [
                        {
                            text: "",
                            width: "80%",
                        },
                        {
                            width: "20%",
                            stack: [
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.purchase_code + ": " || "purchase_code"}`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${data?.code}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 10, 0, 2],
                                },
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.purchase_order_table_dayvoucers + ": " ||
                                                "purchase_order_table_dayvoucers"
                                                }`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${moment(data?.date).format("DD/MM/YYYY")}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 2, 0, 2],
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },
                {
                    text: [
                        {
                            text:
                                props?.type === "order"
                                    ? `${props.dataLang?.purchase_order_table_supplier + ": " ||
                                    "purchase_order_table_supplier"
                                    }`
                                    : "",
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: props?.type === "order" ? `${data?.supplier_name}` : "",
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.purchase_order_detail_delivery_date + ": " ||
                                "purchase_order_detail_delivery_date"
                                }`,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: `${moment(data?.delivery_date).format("DD/MM/YYYY")}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 0, 0, 2],
                },

                {
                    text: [
                        {
                            text:
                                props?.type === "order"
                                    ? `${props.dataLang?.purchase_order_table_number + ": " ||
                                    "purchase_order_table_number"
                                    }`
                                    : "",
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: props?.type === "order" ? `${data?.purchases?.map((e) => e.code).join(", ")}` : "",
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },

                {
                    text: [
                        {
                            text: `${props.dataLang?.purchase_order_note + ": " || "purchase_order_note"} `,
                            inline: true,
                            fontSize: 10,
                        },
                        { text: `${data?.note}`, bold: true, fontSize: 10 },
                    ],
                    margin: [0, 2, 0, 10],
                },
                {
                    table: {
                        widths: "100%",
                        headerRows: 0,
                        // widths:  props?.type== "order" &&  [17,70,27,'*','auto',17,'auto',27,65,"*"],
                        // widths:  props?.type== "order" &&  ['auto','*','auto','auto','auto','auto','auto','auto','auto','*'],
                        widths: props?.type == "order" && [
                            "auto",
                            "auto",
                            // "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "*",
                        ],
                        // widths: props?.type== "purchases" && [17, 200,30,50,173],

                        body: [
                            // Header row
                            [
                                uppercaseTextHeaderTabel("STT", "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.purchase_items || "purchase_items"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.purchase_variant || "purchase_variant"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel("ĐVT", "headerTable", "center"),
                                uppercaseTextHeaderTabel("SL", "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.purchase_order_detail_unit_price ||
                                    "purchase_order_detail_unit_price"
                                    }`,
                                    "headerTable",
                                    "center"
                                ),
                                // uppercaseTextHeaderTabel(
                                //     "% CK",
                                //     "headerTable",
                                //     "center"
                                // ),
                                // uppercaseTextHeaderTabel(
                                //     "ĐGSCK",
                                //     "headerTable",
                                //     "center"
                                // ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.purchase_order_detail_tax || "purchase_order_detail_tax"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.purchase_order_detail_into_money ||
                                    "purchase_order_detail_into_money"
                                    }`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.purchase_order_note || "purchase_order_note"}`,
                                    "headerTable",
                                    "center"
                                ),
                            ],

                            // Data rows
                            ...(data && props?.type == "order" && data?.item.length > 0
                                ? data?.item.map((item, index) => {
                                    return [
                                        {
                                            text: `${index + 1}`,
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.item?.name ? item?.item?.name : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.item?.product_variation
                                                ? ` ${item?.item?.product_variation}`
                                                : "",
                                            fontSize: 9,
                                            italics: false,
                                            //   margin: [0, 5, 0, 0],
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.item?.unit_name ? `${item?.item?.unit_name}` : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.quantity ? `${formatNumber(item?.quantity)}` : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.price_after_discount
                                                ? `${formatMoney(item?.price_after_discount)}`
                                                : "",
                                            alignment: "right",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        //   {
                                        //       text: item?.discount_percent
                                        //           ? `${
                                        //                 item?.discount_percent + "%"
                                        //             }`
                                        //           : "",
                                        //       alignment: "center",
                                        //       fontSize: 10,
                                        //       margin: styleMarginChild,
                                        //   },
                                        //   {
                                        //       text: item?.price_after_discount
                                        //           ? `${formatNumber(
                                        //                 item?.price_after_discount
                                        //             )}`
                                        //           : "",
                                        //       alignment: "right",
                                        //       fontSize: 10,
                                        //       margin: styleMarginChild,
                                        //   },
                                        {
                                            text: item?.tax_rate ? `${item?.tax_rate + "%"}` : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.amount ? `${formatMoney(item?.amount)}` : "",
                                            alignment: "right",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.note ? `${item?.note}` : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                    ];
                                })
                                : ""),
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_table_total || "purchase_order_table_total"}`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_price)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_discounty || "purchase_order_detail_discounty"
                                        }`,
                                    bold: true,
                                    margin: styleMarginChildTotal,
                                    colSpan: 2,
                                    fontSize: 10,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_discount)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_money_after_discount ||
                                        "purchase_order_detail_money_after_discount"
                                        }`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_price_after_discount)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_tax_money || "purchase_order_detail_tax_money"
                                        }`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_tax)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_into_money ||
                                        "purchase_order_detail_into_money"
                                        }`,
                                    bold: true,
                                    margin: styleMarginChildTotal,
                                    colSpan: 2,
                                    fontSize: 10,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_amount)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                        ],
                    },
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.PDF_price || "PDF_price"} : `,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: capitalizedTotalAmountWord,
                            fontSize: 10,
                            bold: true,
                        },
                    ],
                    margin: [0, 5, 0, 0],
                },
                {
                    columns: [
                        {
                            text: "",
                            width: "50%",
                        },
                        {
                            width: "50%",
                            stack: [
                                {
                                    text: currentDate,
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${props.dataLang?.PDF_userMaker || "PDF_userMaker"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },
            ],
            styles: styles,
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };

        //Phiếu dịch vụ
        const docDefinitionServiceVoucher = {
            info: {
                title: `${`${props.dataLang?.serviceVoucher_title || "serviceVoucher_title"} - ${data?.code}`}`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            pageOrientation: "portrait",
            content: [
                {
                    ...contentColumns,
                },
                { canvas: lineHeght() },
                {
                    stack: [
                        {
                            text: uppercaseText(
                                `${props.dataLang?.serviceVoucher_title || "serviceVoucher_title"}`,
                                "contentTitle"
                            ),
                        },
                    ],
                    margin: [0, 8, 0, 0],
                },
                {
                    columns: [
                        {
                            text: "",
                            width: "80%",
                        },
                        {
                            width: "20%",
                            stack: [
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.serviceVoucher_voucher_code + ": " ||
                                                "serviceVoucher_voucher_code"
                                                }`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${data?.code}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 10, 0, 2],
                                },
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.serviceVoucher_day_vouchers + ": " ||
                                                "serviceVoucher_day_vouchers"
                                                }`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${moment(data?.date).format("DD/MM/YYYY")}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 2, 0, 2],
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.serviceVoucher_supplier || "serviceVoucher_supplier"}: `,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: `${data?.supplier_name}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}: `,
                            inline: true,
                            fontSize: 10,
                        },
                        { text: `${data?.note}`, bold: true, fontSize: 10 },
                    ],
                    margin: [0, 2, 0, 10],
                },
                {
                    table: {
                        widths: "100%",
                        headerRows: 0,
                        widths: props?.type == "serviceVoucher" && [
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "*",
                        ],
                        body: [
                            // Header row
                            [
                                uppercaseTextHeaderTabel("STT", "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_services_arising || "serviceVoucher_services_arising"
                                    }`,
                                    "headerTable",
                                    "left"
                                ),
                                uppercaseTextHeaderTabel(`${"SL"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_unit_price || "serviceVoucher_unit_price"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel("% CK", "headerTable", "center"),
                                uppercaseTextHeaderTabel("ĐGSCK", "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_tax || "serviceVoucher_tax"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_into_money || "serviceVoucher_into_money"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}`,
                                    "headerTable",
                                    "center"
                                ),
                            ],

                            // Data rows
                            ...(data && props?.type == "serviceVoucher" && data?.item.length > 0
                                ? data?.item.map((item, index) => {
                                    return [
                                        {
                                            text: `${index + 1}`,
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.name ? item?.name : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.quantity ? `${formatNumber(item?.quantity)}` : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.price ? `${formatMoney(item?.price)}` : "",
                                            alignment: "right",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.discount_percent ? `${item?.discount_percent + "%"}` : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.price_after_discount
                                                ? `${formatMoney(item?.price_after_discount)}`
                                                : "",
                                            alignment: "right",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.tax_rate ? `${item?.tax_rate + "%"}` : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.amount ? `${formatMoney(item?.amount)}` : "",
                                            alignment: "right",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.note ? `${item?.note}` : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                    ];
                                })
                                : ""),
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_table_total || "purchase_order_table_total"}`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_price)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_discounty || "purchase_order_detail_discounty"
                                        }`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_discount)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_money_after_discount ||
                                        "purchase_order_detail_money_after_discount"
                                        }`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_price_after_discount)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_tax_money || "purchase_order_detail_tax_money"
                                        }`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_tax)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_into_money ||
                                        "purchase_order_detail_into_money"
                                        }`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_amount)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                        ],
                    },
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.PDF_price || "PDF_price"} : `,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: capitalizedTotalAmountWord,
                            fontSize: 10,
                            bold: true,
                        },
                    ],
                    margin: [0, 5, 0, 0],
                },
                {
                    columns: [
                        {
                            text: "",
                            width: "50%",
                        },
                        {
                            width: "50%",
                            stack: [
                                {
                                    text: currentDate,
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${props.dataLang?.PDF_userMaker || "PDF_userMaker"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },
            ],
            styles: styles,
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };

        // Nhập hàng in có giá
        const docDefinitionImportFull = {
            info: {
                title: `${`${props.dataLang?.import_title || "import_title"} - ${data?.code}`}`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            pageOrientation: "portrait",
            content: [
                {
                    ...contentColumns,
                },
                { canvas: lineHeght() },
                {
                    stack: [
                        {
                            text: uppercaseText(`${props.dataLang?.import_title || "import_title"}`, "contentTitle"),
                        },
                    ],
                    margin: [0, 8, 0, 0],
                },
                {
                    columns: [
                        {
                            text: "",
                            width: "80%",
                        },
                        {
                            width: "20%",
                            stack: [
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.import_code_vouchers + ": " || "import_code_vouchers"
                                                }`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${data?.code}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 10, 0, 2],
                                },
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.import_day_vouchers + ": " || "import_day_vouchers"}`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${moment(data?.date).format("DD/MM/YYYY")}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 2, 0, 2],
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.import_supplier + ": " || "import_supplier"}`,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: `${data?.supplier_name}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}: `,
                            inline: true,
                            fontSize: 10,
                        },
                        { text: `${data?.note}`, bold: true, fontSize: 10 },
                    ],
                    margin: [0, 2, 0, 10],
                },
                {
                    table: {
                        widths: "100%",
                        headerRows: 0,
                        widths: props?.type == "import" && [
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "*",
                        ],
                        body: [
                            // Header row
                            [
                                uppercaseTextHeaderTabel("STT", "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.purchase_items || "purchase_items"}`,
                                    "headerTables",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.PDF_infoItem || "PDF_infoItem"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(`${"ĐVT"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(`${"SL"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.inventory_unit_price || "inventory_unit_price"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_tax || "serviceVoucher_tax"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_into_money || "serviceVoucher_into_money"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}`,
                                    "headerTable",
                                    "center"
                                ),
                            ],

                            // Data rows
                            ...(data && props?.type == "import" && data?.items.length > 0
                                ? data?.items.map((item, index) => {
                                    const stack = [];
                                    const stackBt = [];
                                    stack.push({
                                        text: item?.item?.name ? item?.item?.name : "",
                                        fontSize: 10,
                                        margin: styleMarginChild,
                                    });
                                    stackBt.push({
                                        text: `Biến thể: ${item?.item?.product_variation}`,
                                        fontSize: 9,
                                        italics: true,
                                        margin: styleMarginChild,
                                    });

                                    if (dataProductSerial?.is_enable === "1") {
                                        const serialStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Serial: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text:
                                                            item.serial == null || item.serial == "" ? "-" : item.serial,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                            },
                                        ];
                                        stackBt.push(serialStack);
                                    }

                                    if (dataMaterialExpiry?.is_enable === "1" || dataProductExpiry?.is_enable === "1") {
                                        const subStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Lot: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text: item.lot == null || item.lot == "" ? "-" : item.lot,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                            {
                                                text: [
                                                    {
                                                        text: "Date: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text: item.expiration_date
                                                            ? moment(item.expiration_date).format("DD/MM/YYYY")
                                                            : "-",
                                                        fontSize: 8.5,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                        ];
                                        stackBt.push(subStack);
                                    }
                                    return [
                                        {
                                            text: `${index + 1}`,
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            stack: stack,
                                        },
                                        { stack: stackBt },
                                        {
                                            text: item?.item?.unit_name ? item?.item?.unit_name : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.quantity ? formatNumber(item?.quantity) : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.price_after_discount
                                                ? formatMoney(item?.price_after_discount)
                                                : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.tax_rate ? `${item?.tax_rate + "%"}` : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.amount ? `${formatMoney(item?.amount)}` : "",
                                            alignment: "right",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.note ? item?.note : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                    ];
                                })
                                : ""),
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_table_total || "purchase_order_table_total"}`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_price)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    margin: styleMarginChildTotal,
                                    fontSize: 10,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_discounty || "purchase_order_detail_discounty"
                                        }`,
                                    bold: true,
                                    colSpan: 2,
                                    margin: styleMarginChildTotal,
                                    fontSize: 10,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_discount)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    margin: styleMarginChildTotal,
                                    fontSize: 10,
                                },
                                "",

                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_money_after_discount ||
                                        "purchase_order_detail_money_after_discount"
                                        }`,
                                    margin: styleMarginChildTotal,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_price_after_discount)}`,
                                    bold: true,
                                    alignment: "right",
                                    margin: styleMarginChildTotal,
                                    colSpan: 7,
                                    fontSize: 10,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_tax_money || "purchase_order_detail_tax_money"
                                        }`,
                                    margin: styleMarginChildTotal,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_tax)}`,
                                    bold: true,
                                    alignment: "right",
                                    margin: styleMarginChildTotal,
                                    colSpan: 7,
                                    fontSize: 10,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_into_money ||
                                        "purchase_order_detail_into_money"
                                        }`,
                                    bold: true,
                                    margin: styleMarginChildTotal,
                                    colSpan: 2,
                                    fontSize: 10,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_amount)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    margin: styleMarginChildTotal,
                                    fontSize: 10,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                        ],
                    },
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.PDF_price || "PDF_price"} : `,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: capitalizedTotalAmountWord,
                            fontSize: 10,
                            bold: true,
                        },
                    ],
                    margin: [0, 5, 0, 0],
                },
                { style: "dateTexts", text: `${currentDate}`, alignment: "right" },

                {
                    columns: [
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${"Người giao"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${"Người nhận"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${"Thủ kho"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },
            ],
            styles: styles,
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };

        // nhập hàng in không giá
        const docDefinitionImportNoPrice = {
            info: {
                title: `${`${props.dataLang?.import_title || "import_title"} - ${data?.code}`}`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            pageOrientation: "portrait",
            content: [
                {
                    ...contentColumns,
                },
                { canvas: lineHeght() },
                {
                    stack: [
                        {
                            text: uppercaseText(`${props.dataLang?.import_title || "import_title"}`, "contentTitle"),
                        },
                    ],
                    margin: [0, 8, 0, 0],
                },

                {
                    columns: [
                        {
                            text: "",
                            width: "80%",
                        },
                        {
                            width: "20%",
                            stack: [
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.import_code_vouchers + ": " || "import_code_vouchers"
                                                }`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${data?.code}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 10, 0, 2],
                                },
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.import_day_vouchers + ": " || "import_day_vouchers"}`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${moment(data?.date).format("DD/MM/YYYY")}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 2, 0, 2],
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },

                {
                    text: [
                        {
                            text: `${props.dataLang?.import_supplier + ": " || "import_supplier"}`,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: `${data?.supplier_name}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}: `,
                            inline: true,
                            fontSize: 10,
                        },
                        { text: `${data?.note}`, bold: true, fontSize: 10 },
                    ],
                    margin: [0, 2, 0, 10],
                },
                {
                    table: {
                        widths: "100%",
                        headerRows: 0,
                        widths: props?.type == "import" && ["auto", "auto", "auto", "auto", "auto", "auto", "*"],
                        body: [
                            // Header row
                            [
                                uppercaseTextHeaderTabel("STT", "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.inventory_items || "inventory_items"}`,
                                    "headerTables",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.PDF_infoItem || "PDF_infoItem"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.PDF_house || "PDF_house"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(`${"ĐVT"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(`${"SL"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}`,
                                    "headerTable",
                                    "center"
                                ),
                            ],

                            // Data rows
                            ...(data && props?.type == "import" && data?.items.length > 0
                                ? data?.items.map((item, index) => {
                                    const stack = [];
                                    const stackBt = [];
                                    stack.push({
                                        text: item?.item?.name ? item?.item?.name : "",
                                        fontSize: 10,
                                        margin: styleMarginChild,
                                    });
                                    stackBt.push({
                                        text: `Biến thể: ${item?.item?.product_variation}`,
                                        fontSize: 9,
                                        italics: true,
                                        margin: styleMarginChild,
                                    });

                                    if (dataProductSerial?.is_enable === "1") {
                                        const serialStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Serial: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text:
                                                            item.serial == null || item.serial == "" ? "-" : item.serial,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                            },
                                        ];
                                        stackBt.push(serialStack);
                                    }

                                    if (dataMaterialExpiry?.is_enable === "1" || dataProductExpiry?.is_enable === "1") {
                                        const subStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Lot: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text: item.lot == null || item.lot == "" ? "-" : item.lot,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                            {
                                                text: [
                                                    {
                                                        text: "Date: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text: item.expiration_date
                                                            ? moment(item.expiration_date).format("DD/MM/YYYY")
                                                            : "-",
                                                        fontSize: 8.5,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                        ];
                                        stackBt.push(subStack);
                                    }
                                    return [
                                        {
                                            text: `${index + 1}`,
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            stack: stack,
                                        },
                                        //   location_name
                                        {
                                            stack: stackBt,
                                        },
                                        {
                                            stack: [
                                                {
                                                    text: item?.warehouse_name ? item?.warehouse_name : "",
                                                    fontSize: 10,
                                                    margin: styleMarginChild,
                                                },
                                                {
                                                    text: item?.location_name ? `(${item?.location_name})` : "",
                                                    fontSize: 9,
                                                    italics: true,
                                                    margin: styleMarginChild,
                                                },
                                            ],
                                        },
                                        {
                                            text: item?.item?.unit_name ? item?.item?.unit_name : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.quantity ? formatNumber(item?.quantity) : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.note ? item?.note : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                    ];
                                })
                                : ""),
                            [
                                {
                                    text: `${props.dataLang?.inventory_total_item || "inventory_total_item"}`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatNumber(data?.items?.length)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 5,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_totalCount || "purchase_totalCount"}`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatNumber(
                                        data?.items?.reduce((accumulator, item) => accumulator + parseInt(item.quantity), 0)
                                    )}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 5,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                            ],
                        ],
                    },
                },
                { style: "dateTexts", text: `${currentDate}`, alignment: "right" },

                {
                    columns: [
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${"Người giao"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${"Người nhận"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${"Thủ kho"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },
            ],
            styles: styles,
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };

        //Trả hàng in có giá
        const docDefinitionReturnFull = {
            info: {
                title: `${`${props?.dataLang?.import_purchase || "import_purchase"} - ${data?.code}`}`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            pageOrientation: "portrait",
            content: [
                {
                    ...contentColumns,
                },
                { canvas: lineHeght() },
                {
                    stack: [
                        {
                            text: uppercaseText(`${props?.dataLang?.import_purchase || "import_purchase"}`, "contentTitle"),
                        },
                    ],
                    margin: [0, 8, 0, 0],
                },
                {
                    columns: [
                        {
                            text: "",
                            width: "80%",
                        },
                        {
                            width: "20%",
                            stack: [
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.import_purchase + ": " || "import_purchase"}`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${data?.code}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 10, 0, 2],
                                },
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.import_day_vouchers + ": " || "import_day_vouchers"}`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${moment(data?.date).format("DD/MM/YYYY")}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 2, 0, 2],
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },

                {
                    text: [
                        {
                            text: `${props.dataLang?.import_supplier + ": " || "import_supplier"}`,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: `${data?.supplier_name}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.PDF_reason || "PDF_reason"}: `,
                            inline: true,
                            fontSize: 10,
                        },
                        { text: `${data?.note}`, bold: true, fontSize: 10 },
                    ],
                    margin: [0, 2, 0, 10],
                },
                {
                    table: {
                        widths: "100%",
                        headerRows: 0,
                        widths: props?.type == "returns" && [
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",

                            "auto",
                            "auto",
                            "auto",
                            "*",
                        ],
                        body: [
                            // Header row
                            [
                                uppercaseTextHeaderTabel("STT", "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.purchase_items || "purchase_items"}`,
                                    "headerTables",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.PDF_infoGeneral || "PDF_infoGeneral"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(`${"ĐVT"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(`${"SL"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.inventory_unit_price || "inventory_unit_price"}`,
                                    "headerTable",
                                    "center"
                                ),

                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_tax || "serviceVoucher_tax"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_into_money || "serviceVoucher_into_money"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}`,
                                    "headerTable",
                                    "center"
                                ),
                            ],

                            // Data rows
                            ...(data && props?.type == "returns" && data?.items.length > 0
                                ? data?.items.map((item, index) => {
                                    const stack = [];
                                    const stackBt = [];
                                    stack.push({
                                        text: item?.item?.name ? item?.item?.name : "",
                                        fontSize: 10,
                                        margin: styleMarginChild,
                                    });
                                    stackBt.push({
                                        text: `Biến thể: ${item?.item?.product_variation}`,
                                        fontSize: 9,
                                        italics: true,
                                        margin: styleMarginChild,
                                    });

                                    if (dataProductSerial?.is_enable === "1") {
                                        const serialStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Serial: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text:
                                                            item?.item.serial == null || item?.item.serial == ""
                                                                ? "-"
                                                                : item?.item.serial,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                            },
                                        ];
                                        stackBt.push(serialStack);
                                    }
                                    if (dataMaterialExpiry?.is_enable === "1" || dataProductExpiry?.is_enable === "1") {
                                        const subStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Lot: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text:
                                                            item?.item.lot == null || item?.item.lot == ""
                                                                ? "-"
                                                                : item?.item.lot,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },

                                                    {
                                                        text: [
                                                            {
                                                                text: " Date: ",
                                                                fontSize: 9,
                                                                italics: true,
                                                            },
                                                            {
                                                                text: item?.item.expiration_date
                                                                    ? moment(item?.item.expiration_date).format(
                                                                        "DD/MM/YYYY"
                                                                    )
                                                                    : "-",
                                                                fontSize: 8.5,
                                                                italics: true,
                                                                margin: [0, 5, 0, 0],
                                                            },
                                                        ],
                                                        fontSize: 9,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],

                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                        ];
                                        stackBt.push(subStack);
                                    }
                                    return [
                                        {
                                            text: `${index + 1}`,
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            stack: stack,
                                        },
                                        {
                                            stack: stackBt,
                                        },
                                        {
                                            text: item?.item?.unit_name ? item?.item?.unit_name : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.quantity ? formatNumber(item?.quantity) : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.price_after_discount
                                                ? formatMoney(item?.price_after_discount)
                                                : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.tax_rate ? `${item?.tax_rate + "%"}` : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.amount ? `${formatMoney(item?.amount)}` : "",
                                            alignment: "right",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.note ? item?.note : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                    ];
                                })
                                : ""),
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_table_total || "purchase_order_table_total"}`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_price)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_discounty || "purchase_order_detail_discounty"
                                        }`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_discount)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_money_after_discount ||
                                        "purchase_order_detail_money_after_discount"
                                        }`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_price_after_discount)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_tax_money || "purchase_order_detail_tax_money"
                                        }`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_tax)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_order_detail_into_money ||
                                        "purchase_order_detail_into_money"
                                        }`,
                                    bold: true,
                                    colSpan: 2,
                                    margin: styleMarginChildTotal,
                                    fontSize: 10,
                                },
                                "",
                                {
                                    text: `${formatMoney(data?.total_amount)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                        ],
                    },
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.PDF_price || "PDF_price"} : `,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: capitalizedTotalAmountWord,
                            fontSize: 10,
                            bold: true,
                        },
                    ],
                    margin: [0, 5, 0, 0],
                },
                { style: "dateTexts", text: `${currentDate}`, alignment: "right" },

                {
                    columns: [
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${"Người giao"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${"Người nhận"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${"Thủ kho"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },
            ],
            styles: styles,
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };

        //Trả hàng in không giá
        const docDefinitionReturnFullNoPrice = {
            info: {
                title: `${`${props?.dataLang?.import_purchase || "import_purchase"} - ${data?.code}`}`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            pageOrientation: "portrait",
            content: [
                {
                    ...contentColumns,
                },
                { canvas: lineHeght() },
                {
                    stack: [
                        {
                            text: uppercaseText(`${props.dataLang?.import_purchase || "import_purchase"}`, "contentTitle"),
                        },
                    ],
                    margin: [0, 8, 0, 0],
                },
                {
                    columns: [
                        {
                            text: "",
                            width: "80%",
                        },
                        {
                            width: "20%",
                            stack: [
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.import_code_vouchers + ": " || "import_code_vouchers"
                                                }`,

                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${data?.code}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 10, 0, 2],
                                },
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.import_day_vouchers || "import_day_vouchers"}`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${moment(data?.date).format("DD/MM/YYYY")}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 2, 0, 2],
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.import_supplier + ": " || "import_supplier"}`,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: `${data?.supplier_name}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.PDF_reason || "PDF_reason"}: `,
                            inline: true,
                            fontSize: 10,
                        },
                        { text: `${data?.note}`, bold: true, fontSize: 10 },
                    ],
                    margin: [0, 2, 0, 10],
                },
                {
                    table: {
                        widths: "100%",
                        headerRows: 0,
                        widths: props?.type == "returns" && ["auto", "auto", "auto", "auto", "auto", "auto", "*"],
                        body: [
                            // Header row
                            [
                                uppercaseTextHeaderTabel("STT", "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.inventory_items || "inventory_items"}`,
                                    "headerTables",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.PDF_infoItem || "PDF_infoItem"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.PDF_house || "PDF_house"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(`${"ĐVT"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(`${"SL"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}`,
                                    "headerTable",
                                    "center"
                                ),
                            ],

                            // Data rows
                            ...(data && props?.type == "returns" && data?.items.length > 0
                                ? data?.items.map((item, index) => {
                                    const stack = [];
                                    const stackSub = [];
                                    stack.push({
                                        text: item?.item?.name ? item?.item?.name : "",
                                        fontSize: 10,
                                        margin: styleMarginChild,
                                    });
                                    stackSub.push({
                                        text: `Biến thể: ${item?.item?.product_variation}`,
                                        fontSize: 9,
                                        italics: true,
                                        margin: styleMarginChild,
                                    });

                                    if (dataProductSerial?.is_enable === "1") {
                                        const serialStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Serial: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text:
                                                            item?.item.serial == null || item?.item.serial == ""
                                                                ? "-"
                                                                : item?.item.serial,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                            },
                                        ];
                                        stackSub.push(serialStack);
                                    }

                                    if (dataMaterialExpiry?.is_enable === "1" || dataProductExpiry?.is_enable === "1") {
                                        const subStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Lot: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text:
                                                            item?.item.lot == null || item?.item.lot == ""
                                                                ? "-"
                                                                : item?.item.lot,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                    {
                                                        text: [
                                                            {
                                                                text: " Date: ",
                                                                fontSize: 9,
                                                                italics: true,
                                                            },
                                                            {
                                                                text: item?.item.expiration_date
                                                                    ? moment(item?.item.expiration_date).format(
                                                                        "DD/MM/YYYY"
                                                                    )
                                                                    : "-",
                                                                fontSize: 8.5,
                                                                italics: true,
                                                                margin: [0, 5, 0, 0],
                                                            },
                                                        ],
                                                        fontSize: 9,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                        ];
                                        stackSub.push(subStack);
                                    }
                                    return [
                                        {
                                            text: `${index + 1}`,
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            stack: stack,
                                        },
                                        {
                                            stack: stackSub,
                                        },
                                        //   location_name

                                        {
                                            stack: [
                                                {
                                                    text: item?.warehouse_name ? item?.warehouse_name : "",
                                                    fontSize: 10,
                                                    margin: styleMarginChild,
                                                },
                                                {
                                                    text: item?.location_name ? `(${item?.location_name})` : "",
                                                    fontSize: 10,
                                                    italics: true,
                                                    margin: styleMarginChild,
                                                },
                                            ],
                                        },
                                        {
                                            text: item?.item?.unit_name ? item?.item?.unit_name : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.quantity ? formatNumber(item?.quantity) : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.note ? item?.note : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                    ];
                                })
                                : ""),
                            [
                                {
                                    text: `${props.dataLang?.inventory_total_item || "inventory_total_item"}`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatNumber(data?.items?.length)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 5,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.purchase_totalCount || "purchase_totalCount"}`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatNumber(
                                        data?.items?.reduce((accumulator, item) => accumulator + parseInt(item.quantity), 0)
                                    )}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 5,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                            ],
                        ],
                    },
                },
                { style: "dateTexts", text: `${currentDate}`, alignment: "right" },

                {
                    columns: [
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${"Người giao"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${"Người nhận"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${"Thủ kho"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },
            ],
            styles: styles,
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };

        //Chuyển kho

        const docDefinitionWarehouseTransfer = {
            info: {
                title: `${`${props.dataLang?.warehouseTransfer_title || "warehouseTransfer_title"} - ${data?.code}`}`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            pageOrientation: "portrait",
            content: [
                {
                    ...contentColumns,
                },
                { canvas: lineHeght() },
                {
                    stack: [
                        {
                            text: uppercaseText(
                                `${props.dataLang?.warehouseTransfer_title || "warehouseTransfer_title"}`,
                                "contentTitle"
                            ),
                        },
                    ],
                    margin: [0, 8, 0, 0],
                },
                {
                    columns: [
                        {
                            text: "",
                            width: "80%",
                        },
                        {
                            width: "20%",
                            stack: [
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.purchase_order_table_code + ": " ||
                                                "purchase_order_table_code"
                                                }`,

                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${data?.code}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 10, 0, 2],
                                },
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.purchase_order_table_dayvoucers + ": " ||
                                                "purchase_order_table_dayvoucers"
                                                }`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${moment(data?.date).format("DD/MM/YYYY")}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 2, 0, 2],
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },

                {
                    text: [
                        {
                            text: `${props.dataLang?.warehouseTransfer_transferWarehouse + ": " ||
                                "warehouseTransfer_transferWarehouse"
                                } `,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: `${data?.warehouses_id_name}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.warehouseTransfer_receivingWarehouse + ": " ||
                                "warehouseTransfer_receivingWarehouse"
                                } `,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: `${data?.warehouses_to_name}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.production_warehouse_LSX + ": " || "production_warehouse_LSX"}`,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: `${""}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.purchase_order_note + ": " || "purchase_order_note"} `,
                            inline: true,
                            fontSize: 10,
                        },
                        { text: `${data?.note}`, bold: true, fontSize: 10 },
                    ],
                    margin: [0, 2, 0, 10],
                },
                {
                    table: {
                        widths: "100%",
                        headerRows: 0,
                        widths: props?.type == "warehouseTransfer" && [
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "*",
                        ],
                        body: [
                            // Header row
                            [
                                uppercaseTextHeaderTabel("STT", "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.purchase_items || "purchase_items"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.PDF_infoVarian || "PDF_infoVarian"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.warehouseTransfer_rransferPosition ||
                                    "warehouseTransfer_rransferPosition"
                                    }`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.warehouseTransfer_receivingLocation ||
                                    "warehouseTransfer_receivingLocation"
                                    }`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(`${"ĐVT"}`, "headerTable", "center"),

                                uppercaseTextHeaderTabel(
                                    `${props?.dataLang?.production_warehouse_export_slPDF ||
                                    "production_warehouse_export_slPDF"
                                    }`,
                                    "headerTable",
                                    "center"
                                ),

                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}`,
                                    "headerTable",
                                    "center"
                                ),
                            ],

                            // Data rows
                            ...(data && props?.type == "warehouseTransfer" && data?.items?.length > 0
                                ? data?.items?.map((item, index) => {
                                    const stack = [];
                                    const stackBt = [];
                                    stack.push({
                                        text: item?.item?.name ? item?.item?.name : "",
                                        fontSize: 10,
                                        margin: styleMarginChild,
                                    });
                                    stackBt.push({
                                        text: `Biến thể: ${item?.item?.product_variation}`,
                                        fontSize: 9,
                                        italics: true,
                                        //   margin: [0, 5, 0, 5],
                                    });

                                    if (dataProductSerial?.is_enable === "1") {
                                        const serialStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Serial: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text:
                                                            item.serial == null || item.serial == "" ? "-" : item.serial,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 2, 0, 0],
                                                    },
                                                ],
                                            },
                                        ];
                                        stackBt.push(serialStack);
                                    }

                                    if (dataMaterialExpiry?.is_enable === "1" || dataProductExpiry?.is_enable === "1") {
                                        const subStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Lot: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text: item.lot == null || item.lot == "" ? "-" : item.lot,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 2, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 2, 0, 0],
                                            },
                                            {
                                                text: [
                                                    {
                                                        text: "Date: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text: item.expiration_date
                                                            ? moment(item.expiration_date).format("DD/MM/YYYY")
                                                            : "-",
                                                        fontSize: 8.5,
                                                        italics: true,
                                                        margin: [0, 2, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 2, 0, 0],
                                            },
                                        ];
                                        stackBt.push(subStack);
                                    }
                                    return [
                                        {
                                            text: `${index + 1}`,
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            stack: stack,
                                        },
                                        {
                                            stack: stackBt,
                                        },
                                        {
                                            text: item?.warehouse_location?.location_name
                                                ? `${item?.warehouse_location?.location_name}`
                                                : "",
                                            margin: [0, 5, 0, 0],
                                            fontSize: 10,
                                            alignment: "left",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.warehouse_location?.location_name
                                                ? `${item?.warehouse_location_to?.location_name}`
                                                : "",
                                            margin: [0, 5, 0, 0],
                                            fontSize: 10,
                                            alignment: "left",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.item?.unit_name ? item?.item?.unit_name : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },

                                        {
                                            text: item?.quantity ? `${formatNumber(+item?.quantity)}` : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.note ? item?.note : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                    ];
                                })
                                : ""),
                            [
                                {
                                    text: `${props?.dataLang?.production_warehouse_totalItem || "production_warehouse_totalItem"
                                        }`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatNumber(data?.items?.length)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 6,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props?.dataLang?.warehouseTransfer_totalPDF || "warehouseTransfer_totalPDF"}`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatNumber(
                                        data?.items?.reduce((total, item) => total + Number(item.quantity), 0)
                                    )}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 6,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                        ],
                    },
                },
                { style: "dateTexts", text: `${currentDate}`, alignment: "right" },

                {
                    columns: [
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${props?.dataLang?.PDF_Deliver || "PDF_Deliver"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${props?.dataLang?.PDF_Receiver || "PDF_Receiver"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${props?.dataLang?.PDF_Stocker || "PDF_Stocker"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },
            ],
            styles: styles,
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };

        //Xuất kho sản xuất
        const docDefinitionProduction_warehouse = {
            info: {
                title: `${`${props.dataLang?.production_warehouse || "production_warehouse"} - ${data?.code}`}`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            pageOrientation: "portrait",
            content: [
                {
                    ...contentColumns,
                },
                { canvas: lineHeght() },
                {
                    stack: [
                        {
                            text: uppercaseText(
                                `${props.dataLang?.production_warehouse || "production_warehouse"}`,
                                "contentTitle"
                            ),
                        },
                    ],
                    margin: [0, 8, 0, 0],
                },
                {
                    columns: [
                        {
                            text: "",
                            width: "80%",
                        },
                        {
                            width: "20%",
                            stack: [
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.purchase_order_table_code + ": " ||
                                                "purchase_order_table_code"
                                                }`,

                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${data?.code}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 10, 0, 2],
                                },
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.purchase_order_table_dayvoucers + ": " ||
                                                "purchase_order_table_dayvoucers"
                                                }`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${moment(data?.date).format("DD/MM/YYYY")}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 2, 0, 2],
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },

                {
                    text: [
                        {
                            text: `${props.dataLang?.production_warehouse_expWarehouse + ": " ||
                                "production_warehouse_expWarehouse"
                                } `,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: `${data?.warehouse_name}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.production_warehouse_LSX + ": " || "production_warehouse_LSX"}`,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: `${""}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },

                {
                    text: [
                        {
                            text: `${props.dataLang?.purchase_order_note + ": " || "purchase_order_note"} `,
                            inline: true,
                            fontSize: 10,
                        },
                        { text: `${data?.note}`, bold: true, fontSize: 10 },
                    ],
                    margin: [0, 2, 0, 10],
                },
                {
                    table: {
                        widths: "100%",
                        headerRows: 0,
                        widths: props?.type == "production_warehouse" && [
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "*",
                        ],
                        body: [
                            // Header row
                            [
                                uppercaseTextHeaderTabel("STT", "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.purchase_items || "purchase_items"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.PDF_infoVarian || "PDF_infoVarian"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(`${"VTX"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(`${"ĐVT"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props?.dataLang?.production_warehouse_export_slPDF ||
                                    "production_warehouse_export_slPDF"
                                    }`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props?.dataLang?.production_warehouse_conversion_gt ||
                                    "production_warehouse_conversion_gt"
                                    }`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props?.dataLang?.production_warehouse_conversion_sl ||
                                    "production_warehouse_conversion_sl"
                                    }`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}`,
                                    "headerTable",
                                    "center"
                                ),
                            ],

                            // Data rows
                            ...(data && props?.type == "production_warehouse" && data?.items?.length > 0
                                ? data?.items?.map((item, index) => {
                                    const stack = [];
                                    const stackBt = [];
                                    stack.push({
                                        text: item?.item?.name ? item?.item?.name : "",
                                        fontSize: 10,
                                        margin: styleMarginChild,
                                    });
                                    stackBt.push({
                                        text: `Biến thể: ${item?.item?.product_variation}`,
                                        fontSize: 9,
                                        italics: true,
                                        margin: [0, 5, 0, 5],
                                    });

                                    if (dataProductSerial?.is_enable === "1") {
                                        const serialStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Serial: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text:
                                                            item.serial == null || item.serial == "" ? "-" : item.serial,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                            },
                                        ];
                                        stackBt.push(serialStack);
                                    }

                                    if (dataMaterialExpiry?.is_enable === "1" || dataProductExpiry?.is_enable === "1") {
                                        const subStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Lot: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text: item.lot == null || item.lot == "" ? "-" : item.lot,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                            {
                                                text: [
                                                    {
                                                        text: "Date: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text: item.expiration_date
                                                            ? moment(item.expiration_date).format("DD/MM/YYYY")
                                                            : "-",
                                                        fontSize: 8.5,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                        ];
                                        stackBt.push(subStack);
                                    }
                                    return [
                                        {
                                            text: `${index + 1}`,
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            stack: stack,
                                        },
                                        {
                                            stack: stackBt,
                                        },
                                        {
                                            text: item?.warehouse_location?.location_name
                                                ? `${item?.warehouse_location?.location_name}`
                                                : "",
                                            margin: [0, 5, 0, 0],
                                            fontSize: 10,
                                            alignment: "left",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.unit_data?.unit ? item?.unit_data?.unit : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },

                                        {
                                            text: item?.quantity ? `${formatNumber(+item?.quantity)}` : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.coefficient ? `${formatNumber(+item?.coefficient)}` : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.quantity_exchange
                                                ? `${formatNumber(+item?.quantity_exchange)} ${item?.unit_data?.unit}`
                                                : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },

                                        {
                                            text: item?.note ? item?.note : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                    ];
                                })
                                : ""),
                            [
                                {
                                    text: `${props?.dataLang?.production_warehouse_totalItem || "production_warehouse_totalItem"
                                        }`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatNumber(data?.items?.length)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props?.dataLang?.production_warehouse_sales || "production_warehouse_sales"}`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatNumber(
                                        data?.items?.reduce((total, item) => total + Number(item.quantity), 0)
                                    )}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 7,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                            ],
                        ],
                    },
                },
                { style: "dateTexts", text: `${currentDate}`, alignment: "right" },

                {
                    columns: [
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${props?.dataLang?.PDF_Deliver || "PDF_Deliver"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${props?.dataLang?.PDF_Receiver || "PDF_Receiver"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${props?.dataLang?.PDF_Stocker || "PDF_Stocker"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },
            ],
            styles: styles,
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };

        //Nhập kho thành phẩm
        const docDefinitionProductionWarehouse = {
            info: {
                title: `${`${props.dataLang?.productsWarehouse_title || "productsWarehouse_title"} - ${data?.code}`}`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            pageOrientation: "portrait",
            content: [
                {
                    ...contentColumns,
                },
                { canvas: lineHeght() },
                {
                    stack: [
                        {
                            text: uppercaseText(
                                `${props.dataLang?.productsWarehouse_title || "productsWarehouse_title"}`,
                                "contentTitle"
                            ),
                        },
                    ],
                    margin: [0, 8, 0, 0],
                },
                {
                    columns: [
                        {
                            text: "",
                            width: "80%",
                        },
                        {
                            width: "20%",
                            stack: [
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.purchase_order_table_code + ": " ||
                                                "purchase_order_table_code"
                                                }`,

                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${data?.code}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 10, 0, 2],
                                },
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.purchase_order_table_dayvoucers + ": " ||
                                                "purchase_order_table_dayvoucers"
                                                }`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${moment(data?.date).format("DD/MM/YYYY")}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 2, 0, 2],
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },

                {
                    text: [
                        {
                            text: `${props.dataLang?.productsWarehouse_warehouseImport + ": " ||
                                "productsWarehouse_warehouseImport"
                                } `,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: `${data?.warehouse_name}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.production_warehouse_LSX + ": " || "production_warehouse_LSX"}`,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: `${""}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.purchase_order_note + ": " || "purchase_order_note"} `,
                            inline: true,
                            fontSize: 10,
                        },
                        { text: `${data?.note}`, bold: true, fontSize: 10 },
                    ],
                    margin: [0, 2, 0, 10],
                },
                {
                    table: {
                        widths: "100%",
                        headerRows: 0,
                        widths: props?.type == "productsWarehouse" && ["auto", "auto", "auto", "auto", "auto", "auto", "*"],
                        body: [
                            // Header row
                            [
                                uppercaseTextHeaderTabel("STT", "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.purchase_items || "purchase_items"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.PDF_infoVarian || "PDF_infoVarian"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.productsWarehouse_warehouseLocaImport ||
                                    "productsWarehouse_warehouseLocaImport"
                                    }`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(`${"ĐVT"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.productsWarehouse_QtyImportPDF || "productsWarehouse_QtyImportPDF"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}`,
                                    "headerTable",
                                    "center"
                                ),
                            ],

                            // Data rows
                            ...(data && props?.type == "productsWarehouse" && data?.items?.length > 0
                                ? data?.items?.map((item, index) => {
                                    const stack = [];
                                    const stackBt = [];
                                    stack.push({
                                        text: item?.item?.name ? item?.item?.name : "",
                                        fontSize: 10,
                                        margin: styleMarginChild,
                                    });
                                    stackBt.push({
                                        text: `Biến thể: ${item?.item?.product_variation}`,
                                        fontSize: 9,
                                        italics: true,
                                        margin: [0, 5, 0, 5],
                                    });

                                    if (dataProductSerial?.is_enable === "1") {
                                        const serialStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Serial: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text:
                                                            item?.serial == null || item?.serial == ""
                                                                ? "-"
                                                                : item?.serial,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                            },
                                        ];
                                        stackBt.push(serialStack);
                                    }

                                    if (dataProductExpiry?.is_enable === "1") {
                                        const subStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Lot: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text: item?.lot == null || item?.lot == "" ? "-" : item?.lot,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                            {
                                                text: [
                                                    {
                                                        text: "Date: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text: item?.expiration_date
                                                            ? moment(item?.expiration_date).format("DD/MM/YYYY")
                                                            : "-",
                                                        fontSize: 8.5,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                        ];
                                        stackBt.push(subStack);
                                    }
                                    return [
                                        {
                                            text: `${index + 1}`,
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            stack: stack,
                                        },
                                        {
                                            stack: stackBt,
                                        },
                                        {
                                            stack: [
                                                //   {
                                                //       text: item?.warehouse_location
                                                //           ?.warehouse_name
                                                //           ? `${item?.warehouse_location?.warehouse_name}`
                                                //           : "",
                                                //   },
                                                {
                                                    text: item?.warehouse_location?.location_name
                                                        ? `${item?.warehouse_location?.location_name}`
                                                        : "",
                                                    //   italics: true,
                                                    margin: [0, 5, 0, 0],
                                                },
                                            ],
                                            fontSize: 10,
                                            alignment: "left",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.item?.unit_name ? item?.item?.unit_name : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },

                                        {
                                            text: item?.quantity ? `${formatNumber(+item?.quantity)}` : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },

                                        {
                                            text: item?.note ? item?.note : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                    ];
                                })
                                : ""),
                            [
                                {
                                    text: `${props?.dataLang?.production_warehouse_totalItem || "production_warehouse_totalItem"
                                        }`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatNumber(data?.items?.length)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 5,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props.dataLang?.productsWarehouse_total || "productsWarehouse_total"}`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatNumber(
                                        data?.items?.reduce((total, item) => total + Number(item.quantity), 0)
                                    )}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 5,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                "",
                                "",
                            ],
                        ],
                    },
                },
                { style: "dateTexts", text: `${currentDate}`, alignment: "right" },

                {
                    columns: [
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${props?.dataLang?.PDF_Deliver || "PDF_Deliver"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${props?.dataLang?.PDF_Receiver || "PDF_Receiver"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${props?.dataLang?.PDF_Stocker || "PDF_Stocker"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },
            ],
            styles: styles,
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };

        /// Thu hồi NVL
        const docDefinitionRecall = {
            info: {
                title: `${`${props.dataLang?.recall_title || "recall_title"} - ${data?.code}`}`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            pageOrientation: "portrait",
            content: [
                {
                    ...contentColumns,
                },
                { canvas: lineHeght() },
                {
                    stack: [
                        {
                            text: uppercaseText(`${props.dataLang?.recall_title || "recall_title"}`, "contentTitle"),
                        },
                    ],
                    margin: [0, 8, 0, 0],
                },
                {
                    columns: [
                        {
                            text: "",
                            width: "80%",
                        },
                        {
                            width: "20%",
                            stack: [
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.purchase_order_table_code + ": " ||
                                                "purchase_order_table_code"
                                                }`,

                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${data?.code}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 10, 0, 2],
                                },
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.purchase_order_table_dayvoucers + ": " ||
                                                "purchase_order_table_dayvoucers"
                                                }`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${moment(data?.date).format("DD/MM/YYYY")}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 2, 0, 2],
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.productsWarehouse_warehouseImport + ": " ||
                                "productsWarehouse_warehouseImport"
                                } `,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: `${data?.warehouse_name}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.production_warehouse_LSX + ": " || "production_warehouse_LSX"}`,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: `${""}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },

                // {
                //     text: [
                //         {
                //             text: `${
                //                 props.dataLang?.production_warehouse_Total_value +
                //                     ": " || "production_warehouse_Total_value"
                //             }`,
                //             inline: true,
                //             fontSize: 10,
                //         },
                //         {
                //             text: `${formatNumber(data?.grand_total)}`,
                //             bold: true,
                //             fontSize: 10,
                //         },
                //     ],
                //     margin: [0, 0, 0, 2],
                // },
                {
                    text: [
                        {
                            text: `${props.dataLang?.purchase_order_note + ": " || "purchase_order_note"} `,
                            inline: true,
                            fontSize: 10,
                        },
                        { text: `${data?.note}`, bold: true, fontSize: 10 },
                    ],
                    margin: [0, 2, 0, 10],
                },
                {
                    table: {
                        widths: "100%",
                        headerRows: 0,
                        widths: props?.type == "recall" && [
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            // "auto",
                            // "auto",
                            "*",
                        ],
                        body: [
                            // Header row
                            [
                                uppercaseTextHeaderTabel("STT", "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.purchase_items || "purchase_items"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.PDF_infoVarian || "PDF_infoVarian"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.productsWarehouse_warehouseLocaImport ||
                                    "productsWarehouse_warehouseLocaImport"
                                    }`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.production_warehouse_unit || "production_warehouse_unit"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props?.dataLang?.recall_revenueQty || "recall_revenueQty"}`,
                                    "headerTable",
                                    "center"
                                ),
                                // uppercaseTextHeaderTabel(
                                //     `${
                                //         props?.dataLang?.recall_price ||
                                //         "recall_price"
                                //     }`,
                                //     "headerTable",
                                //     "center"
                                // ),
                                // uppercaseTextHeaderTabel(
                                //     `${
                                //         props?.dataLang?.recall_money ||
                                //         "recall_money"
                                //     }`,
                                //     "headerTable",
                                //     "center"
                                // ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}`,
                                    "headerTable",
                                    "center"
                                ),
                            ],

                            // Data rows
                            ...(data && props?.type == "recall" && data?.items?.length > 0
                                ? data?.items?.map((item, index) => {
                                    const stack = [];
                                    const stackBt = [];
                                    stack.push({
                                        text: item?.item?.name ? item?.item?.name : "",
                                        fontSize: 10,
                                        margin: styleMarginChild,
                                    });
                                    stackBt.push({
                                        text: `Biến thể: ${item?.item?.product_variation}`,
                                        fontSize: 9,
                                        italics: true,
                                        margin: [0, 5, 0, 5],
                                    });

                                    if (dataProductSerial?.is_enable === "1") {
                                        const serialStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Serial: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text:
                                                            item.serial == null || item.serial == "" ? "-" : item.serial,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                            },
                                        ];
                                        stackBt.push(serialStack);
                                    }

                                    if (dataMaterialExpiry?.is_enable === "1" || dataProductExpiry?.is_enable === "1") {
                                        const subStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Lot: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text: item.lot == null || item.lot == "" ? "-" : item.lot,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                            {
                                                text: [
                                                    {
                                                        text: "Date: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text: item.expiration_date
                                                            ? moment(item.expiration_date).format("DD/MM/YYYY")
                                                            : "-",
                                                        fontSize: 8.5,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                        ];
                                        stackBt.push(subStack);
                                    }
                                    return [
                                        {
                                            text: `${index + 1}`,
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            stack: stack,
                                        },
                                        {
                                            stack: stackBt,
                                        },
                                        {
                                            text: item?.warehouse?.location_name
                                                ? `${item?.warehouse?.location_name}`
                                                : "",
                                            //   italics: true,
                                            margin: [0, 5, 0, 0],
                                            fontSize: 10,
                                            alignment: "left",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.item?.unit ? item?.item?.unit : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },

                                        {
                                            text: item?.quantity ? `${formatNumber(+item?.quantity)}` : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        //   {
                                        //       text: item?.price
                                        //           ? `${formatNumber(+item?.price)}`
                                        //           : "",
                                        //       alignment: "center",
                                        //       fontSize: 10,
                                        //       margin: styleMarginChild,
                                        //   },
                                        //   {
                                        //       text: item?.amount
                                        //           ? `${formatNumber(+item?.amount)}`
                                        //           : "",
                                        //       alignment: "center",
                                        //       fontSize: 10,
                                        //       margin: styleMarginChild,
                                        //   },

                                        {
                                            text: item?.note ? item?.note : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                    ];
                                })
                                : ""),
                            [
                                {
                                    text: `${props?.dataLang?.production_warehouse_totalItem || "production_warehouse_totalItem"
                                        }`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatNumber(data?.items?.length)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 5,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                // "",
                                // "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props?.dataLang?.recall_revenueAmount || "recall_revenueAmount"}`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatMoney(
                                        data?.items?.reduce(
                                            (total, item) =>
                                                // (total += Number(
                                                //     item.quantity * item.price
                                                // )),
                                                (total += item.quantity),
                                            0
                                        )
                                    )}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 5,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                "",
                                // "",
                                // "",
                                "",
                                "",
                            ],
                        ],
                    },
                },
                { style: "dateTexts", text: `${currentDate}`, alignment: "right" },

                {
                    columns: [
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${props?.dataLang?.PDF_Deliver || "PDF_Deliver"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${props?.dataLang?.PDF_Receiver || "PDF_Receiver"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${props?.dataLang?.PDF_Stocker || "PDF_Stocker"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },
            ],
            styles: styles,
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };

        ///Xuất kho khác
        const docDefinitionexportToOther = {
            info: {
                title: `${`${props.dataLang?.exportToOthe_exporttoOther || "exportToOthe_exporttoOther"} - ${data?.code}`}`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            pageOrientation: "portrait",
            content: [
                {
                    ...contentColumns,
                },
                { canvas: lineHeght() },
                {
                    stack: [
                        {
                            text: uppercaseText(
                                `${props.dataLang?.exportToOthe_exporttoOther || "exportToOthe_exporttoOther"}`,
                                "contentTitle"
                            ),
                        },
                    ],
                    margin: [0, 8, 0, 0],
                },
                {
                    columns: [
                        {
                            text: "",
                            width: "80%",
                        },
                        {
                            width: "20%",
                            stack: [
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.purchase_order_table_code + ": " ||
                                                "purchase_order_table_code"
                                                }`,

                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${data?.code}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 10, 0, 2],
                                },
                                {
                                    text: [
                                        {
                                            text: `${props.dataLang?.purchase_order_table_dayvoucers + ": " ||
                                                "purchase_order_table_dayvoucers"
                                                }`,
                                            inline: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                        {
                                            text: `${moment(data?.date).format("DD/MM/YYYY")}`,
                                            bold: true,
                                            fontSize: 8,
                                            italics: true,
                                        },
                                    ],
                                    italic: true,
                                    margin: [0, 2, 0, 2],
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },

                {
                    text: [
                        {
                            text: `${props.dataLang?.production_warehouse_expWarehouse + ": " ||
                                "production_warehouse_expWarehouse"
                                } `,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: `${data?.warehouse_name}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.production_warehouse_LSX + ": " || "production_warehouse_LSX"}`,
                            inline: true,
                            fontSize: 10,
                        },
                        {
                            text: `${""}`,
                            bold: true,
                            fontSize: 10,
                        },
                    ],
                    margin: [0, 2, 0, 2],
                },
                {
                    text: [
                        {
                            text: `${props.dataLang?.purchase_order_note + ": " || "purchase_order_note"} `,
                            inline: true,
                            fontSize: 10,
                        },
                        { text: `${data?.note}`, bold: true, fontSize: 10 },
                    ],
                    margin: [0, 2, 0, 10],
                },
                {
                    table: {
                        widths: "100%",
                        headerRows: 0,
                        widths: props?.type == "exportToOther" && ["auto", "auto", "auto", "auto", "auto", "auto", "*"],
                        body: [
                            // Header row
                            [
                                uppercaseTextHeaderTabel("STT", "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.purchase_items || "purchase_items"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.PDF_infoVarian || "PDF_infoVarian"}`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(`${"VTX"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(`${"ĐVT"}`, "headerTable", "center"),
                                uppercaseTextHeaderTabel(
                                    `${props?.dataLang?.production_warehouse_export_slPDF ||
                                    "production_warehouse_export_slPDF"
                                    }`,
                                    "headerTable",
                                    "center"
                                ),
                                uppercaseTextHeaderTabel(
                                    `${props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}`,
                                    "headerTable",
                                    "center"
                                ),
                            ],

                            // Data rows
                            ...(data && props?.type == "exportToOther" && data?.items?.length > 0
                                ? data?.items?.map((item, index) => {
                                    const stack = [];
                                    const stackBt = [];
                                    stack.push({
                                        text: item?.item?.name ? item?.item?.name : "",
                                        fontSize: 10,
                                        margin: styleMarginChild,
                                    });
                                    stackBt.push({
                                        text: `Biến thể: ${item?.item?.product_variation}`,
                                        fontSize: 9,
                                        italics: true,
                                        margin: [0, 5, 0, 5],
                                    });

                                    if (dataProductSerial?.is_enable === "1") {
                                        const serialStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Serial: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text:
                                                            item.serial == null || item.serial == "" ? "-" : item.serial,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                            },
                                        ];
                                        stackBt.push(serialStack);
                                    }

                                    if (dataMaterialExpiry?.is_enable === "1" || dataProductExpiry?.is_enable === "1") {
                                        const subStack = [
                                            {
                                                text: [
                                                    {
                                                        text: "Lot: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text: item.lot == null || item.lot == "" ? "-" : item.lot,
                                                        fontSize: 9,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                            {
                                                text: [
                                                    {
                                                        text: "Date: ",
                                                        fontSize: 9,
                                                        italics: true,
                                                    },
                                                    {
                                                        text: item.expiration_date
                                                            ? moment(item.expiration_date).format("DD/MM/YYYY")
                                                            : "-",
                                                        fontSize: 8.5,
                                                        italics: true,
                                                        margin: [0, 5, 0, 0],
                                                    },
                                                ],
                                                fontSize: 9,
                                                margin: [0, 5, 0, 0],
                                            },
                                        ];
                                        stackBt.push(subStack);
                                    }
                                    return [
                                        {
                                            text: `${index + 1}`,
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            stack: stack,
                                        },
                                        {
                                            stack: stackBt,
                                        },
                                        {
                                            text: item?.warehouse_location?.location_name
                                                ? `${item?.warehouse_location?.location_name}`
                                                : "",
                                            margin: [0, 5, 0, 0],
                                            fontSize: 10,
                                            alignment: "left",
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.item?.unit_name ? item?.item?.unit_name : "",
                                            fontSize: 10,
                                            alignment: "center",
                                            margin: styleMarginChild,
                                        },

                                        {
                                            text: item?.quantity ? `${formatNumber(+item?.quantity)}` : "",
                                            alignment: "center",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                        {
                                            text: item?.note ? item?.note : "",
                                            fontSize: 10,
                                            margin: styleMarginChild,
                                        },
                                    ];
                                })
                                : ""),
                            [
                                {
                                    text: `${props?.dataLang?.production_warehouse_totalItem || "production_warehouse_totalItem"
                                        }`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatNumber(data?.items?.length)}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 5,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                // "",
                                // "",
                                "",
                                "",
                            ],
                            [
                                {
                                    text: `${props?.dataLang?.production_warehouse_sales || "production_warehouse_sales"}`,
                                    bold: true,
                                    colSpan: 2,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                "",
                                {
                                    text: `${formatNumber(
                                        data?.items?.reduce((total, item) => total + Number(item.quantity), 0)
                                    )}`,
                                    bold: true,
                                    alignment: "right",
                                    colSpan: 5,
                                    fontSize: 10,
                                    margin: styleMarginChildTotal,
                                },
                                // "",
                                // "",
                                "",
                                "",
                                "",
                                "",
                            ],
                        ],
                    },
                },
                { style: "dateTexts", text: `${currentDate}`, alignment: "right" },

                {
                    columns: [
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${props?.dataLang?.PDF_Deliver || "PDF_Deliver"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${props?.dataLang?.PDF_Receiver || "PDF_Receiver"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                        {
                            width: "33%",
                            stack: [
                                {
                                    text: "",
                                    style: "dateText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                                {
                                    text: `${props?.dataLang?.PDF_Stocker || "PDF_Stocker"}`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: `(${props.dataLang?.PDF_sign || "PDF_sign"})`,
                                    style: "signatureText",
                                    alignment: "center",
                                    fontSize: 10,
                                },
                            ],
                        },
                    ],
                    columnGap: 2,
                },
            ],
            styles: styles,
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };

        /// Phiếu thu 1 liên
        const docDefinitionReceipts = {
            pageSize: "A5",
            pageOrientation: "landscape",
            info: {
                title: `${`${props.dataLang?.receipts_title || "receipts_title"} - ${data?.code}`}`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            content: [
                {
                    columns: titleHeader(props, dataCompany),
                    columnGap: 10,
                },
                {
                    canvas: lineHeght(),
                },
                {
                    stack: titleDateOne(props, data, props.dataLang?.receipts_title || "receipts_title"),
                    margin: [0, 8, 0, 0],
                },
                { stack: titleValue(props, data, capitalizedTotalAmountWord, dataSeting) },
                { style: "dateTexts", text: `${currentDate}`, alignment: "right" },
                titleFooter(props, ""),
            ],
            styles: styleForm(),
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };
        /// Phiếu thu 2 liên
        const docDefinitionReceiptsTwo = {
            pageSize: "A5",
            pageOrientation: "landscape",
            info: {
                title: `${`${props.dataLang?.receipts_title || "receipts_title"} - ${data?.code}`}`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            content: [
                {
                    columns: titleHeader(props, dataCompany),
                    columnGap: 10,
                },
                {
                    canvas: lineHeght(),
                },
                {
                    stack: titleDateTwo(props, data, props.dataLang?.receipts_title || "receipts_title"),
                    margin: [0, 8, 0, 0],
                },
                { stack: titleValue(props, data, capitalizedTotalAmountWord, dataSeting) },
                { style: "dateTexts", text: `${currentDate}`, alignment: "right" },
                titleFooter(props, "after"),
                ///page 2
                {
                    columns: titleHeader(props, dataCompany),
                    columnGap: 10,
                },
                {
                    canvas: lineHeght(),
                },
                {
                    stack: titleDateTwo(props, data, props.dataLang?.receipts_title || "receipts_title"),
                    margin: [0, 8, 0, 0],
                },
                { stack: titleValue(props, data, capitalizedTotalAmountWord, dataSeting) },
                { style: "dateTexts", text: `${currentDate}`, alignment: "right" },
                titleFooter(props, ""),
            ],
            styles: styleFormTow(),
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };

        //Phiếu chi 1 liên

        const docDefinitionPayment = {
            pageSize: "A5",
            pageOrientation: "landscape",
            info: {
                title: `${`${props.dataLang?.payment_title || "payment_title"} - ${data?.code}`}`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            content: [
                {
                    columns: titleHeader(props, dataCompany),
                    columnGap: 10,
                },
                {
                    canvas: lineHeght(),
                },
                {
                    stack: titleDateOne(props, data, `${props.dataLang?.payment_title || "payment_title"}`),
                    margin: [0, 8, 0, 0],
                },
                { stack: titleValue(props, data, capitalizedTotalAmountWord, dataSeting) },
                { style: "dateTexts", text: `${currentDate}`, alignment: "right" },
                titleFooter(props, ""),
            ],
            styles: styleForm(),
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };

        //Phiếu chi 2 liên
        const docDefinitionPaymentTwo = {
            pageSize: "A5",
            pageOrientation: "landscape",
            info: {
                title: `${`${props.dataLang?.payment_title || "payment_title"} - ${data?.code}`}`,
                author: "Foso",
                subject: "Quotation",
                keywords: "PDF",
            },
            content: [
                {
                    columns: titleHeader(props, dataCompany),
                    columnGap: 10,
                },
                {
                    canvas: lineHeght(),
                },
                {
                    stack: titleDateTwo(props, data, `${props.dataLang?.payment_title || "payment_title"}`),
                    margin: [0, 8, 0, 0],
                },
                { stack: titleValue(props, data, capitalizedTotalAmountWord, dataSeting) },
                { style: "dateTexts", text: `${currentDate}`, alignment: "right" },
                titleFooter(props, "after"),
                ///page 2
                {
                    columns: titleHeader(props, dataCompany),
                    columnGap: 10,
                },
                {
                    canvas: lineHeght(),
                },
                {
                    stack: titleDateTwo(props, data, `${props.dataLang?.payment_title || "payment_title"}`),
                    margin: [0, 8, 0, 0],
                },
                { stack: titleValue(props, data, capitalizedTotalAmountWord, dataSeting) },
                { style: "dateTexts", text: `${currentDate}`, alignment: "right" },
                titleFooter(props, ""),
            ],
            styles: styleFormTow(),
            dontBreakRows: true,
            images: {
                logo: {
                    url: `${dataCompany?.company_logo}`,
                },
            },
        };
        return {
            docDefinition,
            docDefinitionDeliveryFull,
            docDefinitionReturnSalesFull,
            docDefinitionInternalPlan,
            docDefinitionPurchases,
            docDefinitionOrder,
            docDefinitionServiceVoucher,
            docDefinitionImportFull,
            docDefinitionReturnFull,
            docDefinitionWarehouseTransfer,
            docDefinitionProduction_warehouse,
            docDefinitionProductionWarehouse,
            docDefinitionRecall,
            docDefinitionexportToOther,
            ///2liên
            docDefinitionReceiptsTwo,
            docDefinitionPaymentTwo,

            docDefinitionDeliveryNoPrice,
            docDefinitionReturnSalesNoPrice,
            docDefinitionImportNoPrice,
            docDefinitionReturnFullNoPrice,
            ///1 liên
            docDefinitionReceipts,
            docDefinitionPayment
        }
    }



    ///model 1 loại in
    const fullTitle = [
        "sales_product",
        "price_quote",
        "purchases",
        "internal_plan",
        "order",
        "serviceVoucher",
        "warehouseTransfer",
        "production_warehouse",
        "productsWarehouse",
        "recall",
        "exportToOther",
    ];

    // model có 2 loại in
    const doubleAction = ["deliveryReceipt", "returnSales", "import", "returns", "receipts", "payment"];

    return (
        <>
            {fullTitle.includes(props?.type) && (
                <button
                    onClick={() => handlePrintPdf("fullTitle")}
                    className="transition-all ease-in-out flex items-center gap-2 group  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5  rounded py-2.5 w-full"
                >
                    <VscFilePdf
                        size={20}
                        className="group-hover:text-[#65a30d] group-hover:scale-110 group-hover:shadow-md "
                    />
                    <p className="group-hover:text-[#65a30d]">
                        {props?.dataLang?.btn_table_print || "btn_table_print"}
                    </p>
                </button>
            )}

            {doubleAction.includes(props?.type) && (
                <React.Fragment>
                    <div className="flex justify-center items-center my-3">
                        <button
                            onClick={() => handlePrintPdf("noprice")}
                            className="relative hover:-translate-y-[3px] transition-all ease-linear inline-flex items-center justify-center p-0.5  mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                        >
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                {["payment", "receipts"].includes(props.type)
                                    ? props.dataLang?.PDF_PrintOnelink || "PDF_PrintOnelink"
                                    : props.dataLang?.option_prin_notprice || "option_prin_notprice"}
                            </span>
                        </button>
                        <button
                            onClick={() => handlePrintPdf("fullTitle")}
                            className="relative hover:-translate-y-[3px] transition-all ease-linear inline-flex items-center justify-center p-0.5  mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                        >
                            <span className="relative px-8 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                {["payment", "receipts"].includes(props.type)
                                    ? props.dataLang?.PDF_PrintTwolink || "PDF_PrintTwolink"
                                    : props.dataLang?.option_prin_price || "option_prin_price"}
                            </span>
                        </button>
                    </div>
                </React.Fragment>
            )}
        </>
    );
};

export default FilePDF;
