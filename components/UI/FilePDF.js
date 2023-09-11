import React, { useState } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import moment from "moment";
import { upperCase } from "lodash";
import { styleMarginChild, styleMarginChildTotal, styles, uppercaseTextHeaderTabel } from "./stylePdf/style";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const FilePDF = ({ props, dataCompany, data, setOpenAction }) => {
    const [url, setUrl] = useState(null);

    // uppercase text header table
    const uppercaseText = (text, style, alignment) => {
        return { text: text.toUpperCase(), style: style, alignment: alignment };
    };

    // format numberdocDefinitionPriceQuote
    const formatNumber = (number) => {
        if (!number && number !== 0) return 0;
        const integerPart = Math.floor(number);
        return integerPart.toLocaleString("en");
    };

    // Ngày hiện tại
    const currentDate = moment().format("[Ngày] DD [Tháng] MM [Năm] YYYY");

    // In hoa chữ cái đầu
    const words = data?.total_amount_word?.split(" ");
    const capitalizedWords = words?.map((word) => {
        if (word.length > 0) {
            return word?.charAt(0)?.toUpperCase() + word?.slice(1);
        }
        return word;
    });
    const capitalizedTotalAmountWord = capitalizedWords?.join(" ");

    const docDefinition = {
        info: {
            title: `${
                (props?.type === "price_quote" && `Báo Giá - ${data?.reference_no}`) ||
                (props?.type === "sales_product" && `Đơn Hàng Bán - ${data?.code}`)
            }`,
            author: "Foso",
            subject: "Quotation",
            keywords: "PDF",
        },
        pageOrientation: "portrait",
        content: [
            {
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
                                        text: dataCompany?.company_website
                                            ? `Website: ${dataCompany?.company_website}`
                                            : "",
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
            },
            { canvas: [{ type: "line", x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1, color: "#e2e8f0" }] },
            {
                stack: [
                    {
                        text:
                            (props?.type === "price_quote" && uppercaseText("bảng báo giá", "contentTitle")) ||
                            (props?.type === "sales_product" && uppercaseText("đơn hàng bán", "contentTitle")),
                    },
                    // {
                    //     text:
                    //         (props?.type === "price_quote" && `${moment(data?.date).format("DD/MM/YYYY HH:mm:ss")}`) ||
                    //         (props?.type === "sales_product" && `${moment(data?.date).format("DD/MM/YYYY HH:mm:ss")}`),
                    //     style: "contentDate",
                    // },
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
                                        text: `${
                                            props.dataLang?.purchase_order_table_code + ": " ||
                                            "purchase_order_table_code"
                                        }`,

                                        inline: true,
                                        fontSize: 8,
                                        italics: true,
                                    },
                                    {
                                        text: `${
                                            (props?.type === "price_quote" && `${data?.reference_no}`) ||
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
                                        text: `${
                                            props.dataLang?.purchase_order_table_dayvoucers + ": " ||
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
            // {
            //     text: [
            //         {
            //             text:
            //                 (props?.type === "price_quote" && "Số báo giá: ") ||
            //                 (props?.type === "sales_product" && "Số đơn hàng: "),
            //             inline: true,
            //             fontSize: 10,
            //         },
            //         {
            //             text:
            //                 (props?.type === "price_quote" && `${data?.reference_no}`) ||
            //                 (props?.type === "sales_product" && `${data?.code}`),
            //             bold: true,
            //             fontSize: 10,
            //         },
            //     ],
            //     margin: [0, 10, 0, 2],
            // },
            {
                text: [
                    { text: "Khách hàng: ", inline: true, fontSize: 10 },
                    { text: `${data?.client_name}`, bold: true, fontSize: 10 },
                ],
                margin: [0, 2, 0, 2],
            },
            {
                text: [
                    { text: "Địa chỉ giao hàng: ", inline: true, fontSize: 10 },
                    { text: "", bold: true, fontSize: 10 },
                ],
                margin: [0, 2, 0, 2],
            },
            {
                text: [
                    { text: "Ghi chú: ", inline: true, fontSize: 10 },
                    { text: `${data?.note}`, bold: true, fontSize: 10 },
                ],
                margin: [0, 2, 0, 10],
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
                        ...(data && data?.items.length > 0
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
                                                  ? `${item?.item?.name} (${item?.item?.code})`
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
                                          text: item?.price ? `${formatNumber(item?.price)}` : "",
                                          alignment: "right",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.discount_percent ? `${item?.discount_percent}` : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.price_after_discount
                                              ? `${formatNumber(item?.price_after_discount)}`
                                              : "",
                                          alignment: "right",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.price_after_discount
                                              ? `${formatNumber(item?.price_after_discount * item?.quantity)}`
                                              : "",
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
                            { text: "Tổng cộng", bold: true, colSpan: 2, fontSize: 10, margin: styleMarginChildTotal },
                            "",
                            {
                                text: `${formatNumber(data?.total_price_after_discount)}`,
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
                                text: `${formatNumber(data?.total_tax_price)}`,
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
                                text: `${formatNumber(data?.total_amount)}`,
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
            },
        ],
        // styles: {
        //     headerInfoTextWithMargin: {
        //         fontSize: 12,
        //         bold: true,
        //         margin: [2, 0, 0, 0],
        //     },
        //     headerLogo: {
        //         alignment: "left",
        //     },
        //     headerInfo: {
        //         alignment: "right",
        //         fontSize: 12,
        //         bold: true,
        //         color: "#0F4F9E",
        //         margin: [0, 1],
        //     },
        //     headerInfoText: {
        //         alignment: "right",
        //         fontSize: 8,
        //         italics: true,
        //         color: "black",
        //         margin: [0, 2],
        //     },
        //     contentTitle: {
        //         bold: true,
        //         fontSize: 20,
        //         alignment: "center",
        //         margin: [0, 10, 0, 2],
        //     },
        //     contentDate: {
        //         italics: true,
        //         fontSize: 8,
        //         alignment: "center",
        //     },
        //     headerTable: {
        //         noWrap: true,
        //         bold: true,
        //         fillColor: "#0374D5",
        //         color: "white",
        //         fontSize: 10,
        //         // alignment: 'center',
        //     },
        //     dateText: {
        //         fontSize: 12,
        //         bold: true,
        //         margin: [0, 10, 0, 2],
        //     },
        //     signatureText: {
        //         fontSize: 12,
        //         margin: [0, 0, 0, 2],
        //     },
        // },
        styles: styles,
        dontBreakRows: true,
        images: {
            logo: {
                url: `${dataCompany?.company_logo}`,
            },
        },
    };

    const handlePrintPdf = () => {
        if (data !== undefined && dataCompany !== undefined) {
            const pdfGenerator = pdfMake.createPdf(docDefinition);
            pdfGenerator.open((blob) => {
                const url = URL.createObjectURL(blob);
                setUrl(url);
            });
            setOpenAction(false);
        }
    };

    return (
        <>
            <button
                onClick={handlePrintPdf}
                className="2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer 2xl:px-5 2xl:py-2.5 px-5 py-1.5 rounded w-full"
            >
                {props?.dataLang?.btn_table_print || "btn_table_print"}
            </button>
        </>
    );
};

export default FilePDF;
