import React, { useState } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import {
    styleHeaderTable,
    styleMarginChild,
    styleMarginChildTotal,
    uppercaseTextHeaderTabel,
    styles,
    columns,
} from "components/UI/stylePdf/style";

import moment from "moment";
import { upperCase } from "lodash";
import { saveAs } from "file-saver";

import { VscFilePdf } from "react-icons/vsc";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// dataCompany:db header
const FilePDF = ({
    props,
    dataCompany,
    data,
    setOpenAction,
    dataMaterialExpiry,
    dataProductExpiry,
    dataProductSerial,
}) => {
    // var docDefinition = {
    //     pageSize: 'A5',
    //     pageOrientation: 'landscape',
    //     // [left, top, right, bottom]
    //     pageMargins: [ 40, 60, 40, 60 ],
    //   };

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

    //Phiếu chi 1 liên
    const docDefinitionPayment = {
        pageSize: "A5",
        pageOrientation: "landscape",
        info: {
            title: `${`${props.dataLang?.payment_title || "payment_title"} - ${
                data?.code
            }`}`,
            author: "Foso",
            subject: "Quotation",
            keywords: "PDF",
        },
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
                                text: dataCompany?.company_address
                                    ? `${
                                          props.dataLang?.PDF_adress ||
                                          "PDF_adress"
                                      } : ${dataCompany?.company_address}`
                                    : "",
                                style: "headerInfoText",
                            },
                            {
                                text: dataCompany?.company_phone_number
                                    ? `${
                                          props.dataLang?.PDF_tel || "PDF_tel"
                                      }: ${dataCompany?.company_phone_number}`
                                    : "",
                                style: "headerInfoText",
                            },
                            {
                                text: [
                                    {
                                        text: dataCompany?.company_email
                                            ? `Email: ${dataCompany?.company_email}`
                                            : "",
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
            {
                canvas: [
                    {
                        type: "line",
                        x1: 0,
                        y1: 0,
                        x2: 515,
                        y2: 0,
                        lineWidth: 1,
                        color: "#e2e8f0",
                    },
                ],
            },
            {
                stack: [
                    {
                        text: uppercaseText(
                            `${
                                props.dataLang?.payment_title || "payment_title"
                            }`,
                            "contentTitle"
                        ),
                    },
                    {
                        text: `${props.dataLang?.PDF_number || "PDF_number"}: ${
                            data?.code
                        }`,
                        style: "contentCode",
                    },
                    {
                        text: `${moment(data?.date).format(
                            "[Ngày] DD [Tháng] MM [Năm] YYYY"
                        )}`,
                        style: "contentCode",
                    },
                ],
                margin: [0, 8, 0, 0],
            },
            {
                text: [
                    {
                        text: `${props.dataLang?.PDF_bbject || "PDF_bbject"}: `,
                        bold: true,
                        fontSize: 10,
                    },
                    {
                        text: `${
                            props.dataLang[data?.objects] || data?.objects
                        } - ${data?.object_text}`,
                        inline: true,
                        fontSize: 10,
                    },
                ],
                margin: [0, 10, 0, 4],
            },
            {
                text: [
                    {
                        text: `${
                            props.dataLang?.PDF_document || "PDF_document"
                        }: `,
                        bold: true,
                        fontSize: 10,
                    },
                    {
                        text: data?.type_vouchers
                            ? `${
                                  props.dataLang[data?.type_vouchers] ||
                                  data?.type_vouchers
                              } - ${data?.voucher
                                  ?.map((e) => e.code)
                                  .join(", ")}`
                            : "",
                        inline: true,
                        fontSize: 10,
                    },
                ],
                margin: [0, 4, 0, 4],
            },
            {
                text: [
                    {
                        text: `${
                            props.dataLang?.PDF_methods || "PDF_methods"
                        }: `,
                        bold: true,
                        fontSize: 10,
                    },
                    {
                        text: `${data?.payment_mode_name}`,
                        inline: true,
                        fontSize: 10,
                    },
                ],
                margin: [0, 4, 0, 4],
            },
            {
                text: [
                    {
                        text: `${props.dataLang?.PDF_reason || "PDF_reason"}: `,
                        bold: true,
                        fontSize: 10,
                    },
                    { text: `${data?.note}`, inline: true, fontSize: 10 },
                ],
                margin: [0, 4, 0, 4],
            },
            {
                text: [
                    {
                        text: `${
                            props.dataLang?.PDF_amountMoney || "PDF_amountMoney"
                        }: `,
                        bold: true,
                        fontSize: 10,
                    },
                    {
                        text: `${formatNumber(data?.total)}`,
                        fontSize: 10,
                        inline: true,
                    },
                ],
                margin: [0, 4, 0, 4],
            },
            {
                text: [
                    {
                        text: `${props.dataLang?.PDF_price || "PDF_price"} : `,
                        bold: true,
                        fontSize: 10,
                    },
                    {
                        text: capitalizedTotalAmountWord,
                        fontSize: 10,
                        inline: true,
                    },
                ],
                margin: [0, 4, 0, 0],
            },
            { style: "dateTexts", text: `${currentDate}`, alignment: "right" },
            {
                columns: [
                    {
                        width: "20%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props.dataLang?.PDF_manager || "PDF_manager"
                                }`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                                bold: true,
                            },
                            {
                                text: `(${
                                    props.dataLang?.PDF_sign || "PDF_sign"
                                })`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                            },
                        ],
                    },
                    {
                        width: "20%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props.dataLang?.PDF_accountant ||
                                    "PDF_accountant"
                                }`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                                bold: true,
                            },
                            {
                                text: `(${
                                    props.dataLang?.PDF_sign || "PDF_sign"
                                })`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                            },
                        ],
                    },
                    {
                        width: "20%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props.dataLang?.PDF_treasurer ||
                                    "PDF_treasurer"
                                }`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                                bold: true,
                            },
                            {
                                text: `(${
                                    props.dataLang?.PDF_sign || "PDF_sign"
                                })`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                            },
                        ],
                    },
                    {
                        width: "20%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props.dataLang?.PDF_userMaker ||
                                    "PDF_userMaker"
                                }`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                                bold: true,
                            },
                            {
                                text: `(${
                                    props.dataLang?.PDF_sign || "PDF_sign"
                                })`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                            },
                        ],
                    },
                    {
                        width: "20%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props.dataLang?.PDF_receiver ||
                                    "PDF_receiver"
                                }`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                                bold: true,
                            },
                            {
                                text: `(${
                                    props.dataLang?.PDF_sign || "PDF_sign"
                                })`,
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
        styles: {
            headerInfoTextWithMargin: {
                fontSize: 12,
                bold: true,
                margin: [2, 0, 0, 0],
            },
            headerLogo: {
                alignment: "left",
            },
            headerInfo: {
                alignment: "right",
                fontSize: 12,
                bold: true,
                color: "#0F4F9E",
                margin: [0, 1],
            },
            headerInfoText: {
                alignment: "right",
                fontSize: 8,
                italics: true,
                color: "black",
                margin: [0, 2],
            },
            contentTitle: {
                bold: true,
                fontSize: 20,
                alignment: "center",
                margin: [0, 10, 0, 2],
            },
            contentDate: {
                italics: true,
                fontSize: 8,
                alignment: "center",
            },
            contentCode: {
                italics: true,
                fontSize: 8,
                alignment: "center",
                margin: [0, 1, 0, 1],
            },
            headerTable: {
                noWrap: true,
                bold: true,
                fillColor: "#0374D5",
                color: "white",
                fontSize: 10,
                // alignment: 'center',
            },
            dateText: {
                fontSize: 10,
                bold: true,
                margin: [0, 5, 0, 2],
            },
            dateTexts: {
                fontSize: 10,
                bold: false,
            },
            signatureText: {
                fontSize: 12,
                margin: [0, 0, 0, 2],
            },
        },
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
            title: `${`${props.dataLang?.payment_title || "payment_title"} - ${
                data?.code
            }`}`,
            author: "Foso",
            subject: "Quotation",
            keywords: "PDF",
        },
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
                                text: dataCompany?.company_address
                                    ? `${
                                          props.dataLang?.PDF_adress ||
                                          "PDF_adress"
                                      } : ${dataCompany?.company_address}`
                                    : "",
                                style: "headerInfoText",
                            },
                            {
                                text: dataCompany?.company_phone_number
                                    ? `${
                                          props.dataLang?.PDF_tel || "PDF_tel"
                                      }: ${dataCompany?.company_phone_number}`
                                    : "",
                                style: "headerInfoText",
                            },
                            {
                                text: [
                                    {
                                        text: dataCompany?.company_email
                                            ? `Email: ${dataCompany?.company_email}`
                                            : "",
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
            {
                canvas: [
                    {
                        type: "line",
                        x1: 0,
                        y1: 0,
                        x2: 515,
                        y2: 0,
                        lineWidth: 1,
                        color: "#e2e8f0",
                    },
                ],
            },
            {
                stack: [
                    {
                        text: uppercaseText(
                            `${
                                props.dataLang?.payment_title || "payment_title"
                            }`,
                            "contentTitle"
                        ),
                    },
                    {
                        columns: [
                            {
                                with: "110%",
                                stack: [
                                    {
                                        text: `${
                                            props.dataLang?.PDF_gion ||
                                            "PDF_gion"
                                        }`,
                                        style: "contentCodes",
                                    },
                                ],
                            },
                            {
                                with: "5%",
                                stack: [
                                    {
                                        text: `${
                                            props.dataLang?.PDF_number ||
                                            "PDF_number"
                                        }: ${data?.code}`,
                                        style: "contentCodeNumber",
                                    },
                                    {
                                        text: `${moment(data?.date).format(
                                            "[Ngày] DD [Tháng] MM [Năm] YYYY"
                                        )}`,
                                        style: "contentCodeNumber",
                                    },
                                ],
                            },
                        ],
                    },
                    // {
                    //     text: `${moment(data?.date).format('[Ngày] DD [Tháng] MM [Năm] YYYY')}`,
                    //     style: 'contentCode'
                    // },
                ],
                margin: [0, 8, 0, 0],
            },
            {
                text: [
                    {
                        text: `${props.dataLang?.PDF_bbject || "PDF_bbject"}: `,
                        bold: true,
                        fontSize: 10,
                    },
                    {
                        text: `${
                            props.dataLang[data?.objects] || data?.objects
                        } - ${data?.object_text}`,
                        inline: true,
                        fontSize: 10,
                    },
                ],
                margin: [0, 10, 0, 4],
            },
            {
                text: [
                    {
                        text: `${
                            props.dataLang?.PDF_document || "PDF_document"
                        }: `,
                        bold: true,
                        fontSize: 10,
                    },
                    {
                        text: data?.type_vouchers
                            ? `${
                                  props.dataLang[data?.type_vouchers] ||
                                  data?.type_vouchers
                              } - ${data?.voucher
                                  ?.map((e) => e.code)
                                  .join(", ")}`
                            : "",
                        inline: true,
                        fontSize: 10,
                    },
                ],
                margin: [0, 4, 0, 4],
            },
            {
                text: [
                    {
                        text: `${
                            props.dataLang?.PDF_methods || "PDF_methods"
                        }: `,
                        bold: true,
                        fontSize: 10,
                    },
                    {
                        text: `${data?.payment_mode_name}`,
                        inline: true,
                        fontSize: 10,
                    },
                ],
                margin: [0, 4, 0, 4],
            },
            {
                text: [
                    {
                        text: `${props.dataLang?.PDF_reason || "PDF_reason"}: `,
                        bold: true,
                        fontSize: 10,
                    },
                    { text: `${data?.note}`, inline: true, fontSize: 10 },
                ],
                margin: [0, 4, 0, 4],
            },
            {
                text: [
                    {
                        text: `${
                            props.dataLang?.PDF_amountMoney || "PDF_amountMoney"
                        }: `,
                        bold: true,
                        fontSize: 10,
                    },
                    {
                        text: `${formatNumber(data?.total)}`,
                        fontSize: 10,
                        inline: true,
                    },
                ],
                margin: [0, 4, 0, 4],
            },
            {
                text: [
                    {
                        text: `${props.dataLang?.PDF_price || "PDF_price"} : `,
                        bold: true,
                        fontSize: 10,
                    },
                    {
                        text: capitalizedTotalAmountWord,
                        fontSize: 10,
                        inline: true,
                    },
                ],
                margin: [0, 4, 0, 0],
            },
            { style: "dateTexts", text: `${currentDate}`, alignment: "right" },
            {
                columns: [
                    {
                        width: "20%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props.dataLang?.PDF_manager || "PDF_manager"
                                }`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                                bold: true,
                            },
                            {
                                text: `(${
                                    props.dataLang?.PDF_sign || "PDF_sign"
                                })`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                            },
                        ],
                    },
                    {
                        width: "20%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props.dataLang?.PDF_accountant ||
                                    "PDF_accountant"
                                }`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                                bold: true,
                            },
                            {
                                text: `(${
                                    props.dataLang?.PDF_sign || "PDF_sign"
                                })`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                            },
                        ],
                    },
                    {
                        width: "20%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props.dataLang?.PDF_treasurer ||
                                    "PDF_treasurer"
                                }`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                                bold: true,
                            },
                            {
                                text: `(${
                                    props.dataLang?.PDF_sign || "PDF_sign"
                                })`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                            },
                        ],
                    },
                    {
                        width: "20%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props.dataLang?.PDF_userMaker ||
                                    "PDF_userMaker"
                                }`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                                bold: true,
                            },
                            {
                                text: `(${
                                    props.dataLang?.PDF_sign || "PDF_sign"
                                })`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                            },
                        ],
                    },
                    {
                        width: "20%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props.dataLang?.PDF_receiver ||
                                    "PDF_receiver"
                                }`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                                bold: true,
                            },
                            {
                                text: `(${
                                    props.dataLang?.PDF_sign || "PDF_sign"
                                })`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                            },
                        ],
                    },
                ],
                columnGap: 2,
                pageBreak: "after",
            },

            ///page 2
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
                                text: dataCompany?.company_address
                                    ? `${
                                          props.dataLang?.PDF_adress ||
                                          "PDF_adress"
                                      } : ${dataCompany?.company_address}`
                                    : "",
                                style: "headerInfoText",
                            },
                            {
                                text: dataCompany?.company_phone_number
                                    ? `${
                                          props.dataLang?.PDF_tel || "PDF_tel"
                                      }: ${dataCompany?.company_phone_number}`
                                    : "",
                                style: "headerInfoText",
                            },
                            {
                                text: [
                                    {
                                        text: dataCompany?.company_email
                                            ? `Email: ${dataCompany?.company_email}`
                                            : "",
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
            {
                canvas: [
                    {
                        type: "line",
                        x1: 0,
                        y1: 0,
                        x2: 515,
                        y2: 0,
                        lineWidth: 1,
                        color: "#e2e8f0",
                    },
                ],
            },
            {
                stack: [
                    {
                        text: uppercaseText(
                            `${
                                props.dataLang?.payment_title || "payment_title"
                            }`,
                            "contentTitle"
                        ),
                    },
                    {
                        columns: [
                            {
                                with: "110%",
                                stack: [
                                    {
                                        text: `${
                                            props.dataLang?.PDF_gions ||
                                            "PDF_gions"
                                        }`,
                                        style: "contentCodes",
                                    },
                                ],
                            },
                            {
                                with: "5%",
                                stack: [
                                    {
                                        text: `${
                                            props.dataLang?.PDF_number ||
                                            "PDF_number"
                                        }: ${data?.code}`,
                                        style: "contentCodeNumber",
                                    },
                                    {
                                        text: `${moment(data?.date).format(
                                            "[Ngày] DD [Tháng] MM [Năm] YYYY"
                                        )}`,
                                        style: "contentCodeNumber",
                                    },
                                ],
                            },
                        ],
                    },
                ],
                margin: [0, 8, 0, 0],
            },
            {
                text: [
                    {
                        text: `${props.dataLang?.PDF_bbject || "PDF_bbject"}: `,
                        bold: true,
                        fontSize: 10,
                    },
                    {
                        text: `${
                            props.dataLang[data?.objects] || data?.objects
                        } - ${data?.object_text}`,
                        inline: true,
                        fontSize: 10,
                    },
                ],
                margin: [0, 10, 0, 4],
            },
            {
                text: [
                    {
                        text: `${
                            props.dataLang?.PDF_document || "PDF_document"
                        }: `,
                        bold: true,
                        fontSize: 10,
                    },
                    {
                        text: data?.type_vouchers
                            ? `${
                                  props.dataLang[data?.type_vouchers] ||
                                  data?.type_vouchers
                              } - ${data?.voucher
                                  ?.map((e) => e.code)
                                  .join(", ")}`
                            : "",
                        inline: true,
                        fontSize: 10,
                    },
                ],
                margin: [0, 4, 0, 4],
            },
            {
                text: [
                    {
                        text: `${
                            props.dataLang?.PDF_methods || "PDF_methods"
                        }: `,
                        bold: true,
                        fontSize: 10,
                    },
                    {
                        text: `${data?.payment_mode_name}`,
                        inline: true,
                        fontSize: 10,
                    },
                ],
                margin: [0, 4, 0, 4],
            },
            {
                text: [
                    {
                        text: `${props.dataLang?.PDF_reason || "PDF_reason"}: `,
                        bold: true,
                        fontSize: 10,
                    },
                    { text: `${data?.note}`, inline: true, fontSize: 10 },
                ],
                margin: [0, 4, 0, 4],
            },
            {
                text: [
                    {
                        text: `${
                            props.dataLang?.PDF_amountMoney || "PDF_amountMoney"
                        }: `,
                        bold: true,
                        fontSize: 10,
                    },
                    {
                        text: `${formatNumber(data?.total)}`,
                        fontSize: 10,
                        inline: true,
                    },
                ],
                margin: [0, 4, 0, 4],
            },
            {
                text: [
                    {
                        text: `${props.dataLang?.PDF_price || "PDF_price"} : `,
                        bold: true,
                        fontSize: 10,
                    },
                    {
                        text: capitalizedTotalAmountWord,
                        fontSize: 10,
                        inline: true,
                    },
                ],
                margin: [0, 4, 0, 0],
            },
            { style: "dateTexts", text: `${currentDate}`, alignment: "right" },
            {
                columns: [
                    {
                        width: "20%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props.dataLang?.PDF_manager || "PDF_manager"
                                }`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                                bold: true,
                            },
                            {
                                text: `(${
                                    props.dataLang?.PDF_sign || "PDF_sign"
                                })`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                            },
                        ],
                    },
                    {
                        width: "20%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props.dataLang?.PDF_accountant ||
                                    "PDF_accountant"
                                }`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                                bold: true,
                            },
                            {
                                text: `(${
                                    props.dataLang?.PDF_sign || "PDF_sign"
                                })`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                            },
                        ],
                    },
                    {
                        width: "20%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props.dataLang?.PDF_treasurer ||
                                    "PDF_treasurer"
                                }`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                                bold: true,
                            },
                            {
                                text: `(${
                                    props.dataLang?.PDF_sign || "PDF_sign"
                                })`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                            },
                        ],
                    },
                    {
                        width: "20%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props.dataLang?.PDF_userMaker ||
                                    "PDF_userMaker"
                                }`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                                bold: true,
                            },
                            {
                                text: `(${
                                    props.dataLang?.PDF_sign || "PDF_sign"
                                })`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                            },
                        ],
                    },
                    {
                        width: "20%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props.dataLang?.PDF_receiver ||
                                    "PDF_receiver"
                                }`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
                                bold: true,
                            },
                            {
                                text: `(${
                                    props.dataLang?.PDF_sign || "PDF_sign"
                                })`,
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
        styles: {
            headerInfoTextWithMargin: {
                fontSize: 12,
                bold: true,
                margin: [2, 0, 0, 0],
            },
            headerLogo: {
                alignment: "left",
            },
            headerInfo: {
                alignment: "right",
                fontSize: 12,
                bold: true,
                color: "#0F4F9E",
                margin: [0, 1],
            },
            headerInfoText: {
                alignment: "right",
                fontSize: 8,
                italics: true,
                color: "black",
                margin: [0, 2],
            },
            contentTitle: {
                bold: true,
                fontSize: 20,
                alignment: "center",
                margin: [0, 10, 0, 2],
            },
            contentDate: {
                italics: true,
                fontSize: 8,
                alignment: "center",
            },
            contentCode: {
                italics: true,
                fontSize: 8,
                alignment: "center",
                margin: [0, 1, 0, 1],
            },
            contentCodes: {
                italics: true,
                fontSize: 8,
                alignment: "right",
                margin: [0, 1, 0, 0],
            },
            contentCodeNumber: {
                italics: true,
                fontSize: 8,
                alignment: "right",
                margin: [0, 1, 0, 1],
            },
            headerTable: {
                noWrap: true,
                bold: true,
                fillColor: "#0374D5",
                color: "white",
                fontSize: 10,
                // alignment: 'center',
            },
            dateText: {
                fontSize: 10,
                bold: true,
                margin: [0, 5, 0, 2],
            },
            dateTexts: {
                fontSize: 10,
                bold: false,
            },
            signatureText: {
                fontSize: 12,
                margin: [0, 0, 0, 2],
            },
        },
        dontBreakRows: true,
        images: {
            logo: {
                url: `${dataCompany?.company_logo}`,
            },
        },
    };

    // Tạo tài liệu PDF

    const handlePrintPdf = (type) => {
        if (
            type == "oneLink" &&
            data !== undefined &&
            dataCompany !== undefined &&
            props?.type == "payment"
        ) {
            const pdfGenerator = pdfMake.createPdf(docDefinitionPayment);
            pdfGenerator.open((blob) => {
                const url = URL.createObjectURL(blob);
                setUrl(url);
            });
            setOpenAction(false);
        }
        if (
            type == "twoLink" &&
            data !== undefined &&
            dataCompany !== undefined &&
            props?.type == "payment"
        ) {
            const pdfGenerator = pdfMake.createPdf(docDefinitionPaymentTwo);
            pdfGenerator.open((blob) => {
                const url = URL.createObjectURL(blob);
                setUrl(url);
            });
            setOpenAction(false);
        }
    };
    return (
        <React.Fragment>
            {props?.type == "payment" && (
                <React.Fragment>
                    <div className="flex justify-center items-center my-3">
                        <button
                            onClick={handlePrintPdf.bind(this, "oneLink")}
                            className="relative inline-flex items-center justify-center p-0.5  mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                        >
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                {props.dataLang?.PDF_PrintOnelink ||
                                    "PDF_PrintOnelink"}
                            </span>
                        </button>
                        <button
                            onClick={handlePrintPdf.bind(this, "twoLink")}
                            className="relative inline-flex items-center justify-center p-0.5  mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                        >
                            <span className="relative px-8 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                {props.dataLang?.PDF_PrintTwolink ||
                                    "PDF_PrintTwolink"}
                            </span>
                        </button>
                    </div>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default FilePDF;
