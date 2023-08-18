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

    ///YCMH
    const docDefinitionPurchases = {
        info: {
            title: `${
                props?.type === "purchases" &&
                `${props.dataLang?.purchase_title || "purchase_title"} - ${
                    data?.code
                }`
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
                        x2: 520,
                        y2: 0,
                        lineWidth: 1,
                        color: "#e2e8f0",
                    },
                ],
            },
            {
                stack: [
                    {
                        text:
                            props?.type === "purchases" &&
                            uppercaseText(
                                `${
                                    props.dataLang?.purchase_title ||
                                    "purchase_title"
                                }`,
                                "contentTitle"
                            ),
                    },
                    // {
                    //     text: [
                    //         {
                    //             text: "Ngày chứng từ",
                    //         },
                    //     ],
                    //     style: "contentDateNew",
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
                                        text:
                                            props?.type === "purchases" &&
                                            `${
                                                props.dataLang?.purchase_code +
                                                    ": " || "purchase_code"
                                            }`,

                                        inline: true,
                                        fontSize: 8,
                                        italics: true,
                                    },
                                    {
                                        text:
                                            props?.type === "purchases" &&
                                            `${data?.code}`,
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
                                        text: `${moment(data?.date).format(
                                            "DD/MM/YYYY"
                                        )}`,
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
            //                 props?.type === "purchases" &&
            //                 `${
            //                     props.dataLang?.purchase_code + ": " ||
            //                     "purchase_code"
            //                 }`,
            //             inline: true,
            //             fontSize: 10,
            //         },
            //         {
            //             text: props?.type === "purchases" && `${data?.code}`,
            //             bold: true,
            //             fontSize: 10,
            //         },
            //     ],
            //     margin: [0, 10, 0, 2],
            // },
            // {
            //     text: [
            //         {
            //             text:
            //                 props?.type === "purchases"
            //                     ? `${
            //                           props.dataLang?.purchase_propnent +
            //                               ": " || "purchase_propnent"
            //                       }`
            //                     : "",
            //             inline: true,
            //             fontSize: 10,
            //         },
            //         {
            //             text:
            //                 props?.type === "purchases"
            //                     ? `${data?.user_create_name}`
            //                     : "",
            //             bold: true,
            //             fontSize: 10,
            //         },
            //     ],
            //     margin: [0, 2, 0, 2],
            // },
            {
                text: [
                    {
                        text:
                            props?.type === "purchases"
                                ? `${
                                      props.dataLang?.purchase_planNumber +
                                          ": " || "purchase_planNumber"
                                  }`
                                : "",
                        inline: true,
                        fontSize: 10,
                    },
                    {
                        text:
                            props?.type === "purchases"
                                ? `${
                                      data?.reference_no != null
                                          ? data?.reference_no
                                          : ""
                                  }`
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
                        text: `${
                            props.dataLang?.purchase_note + ": " ||
                            "purchase_note"
                        }`,
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
                            uppercaseTextHeaderTabel(
                                "STT",
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.purchase_items ||
                                    "purchase_items"
                                }`,
                                "headerTable",
                                "left"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.purchase_variant ||
                                    "purchase_variant"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${"ĐVT"}`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${"SL"}`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.purchase_note ||
                                    "purchase_note"
                                }`,
                                "headerTable",
                                "center"
                            ),
                        ],
                        // Data rows

                        ...(data &&
                        props?.type == "purchases" &&
                        data?.items.length > 0
                            ? data?.items.map((item, index) => {
                                  return [
                                      {
                                          text: `${index + 1}`,
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.item?.name
                                              ? item?.item?.name
                                              : "",
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
                                          text: item?.item?.unit_name
                                              ? `${item?.item?.unit_name}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.quantity
                                              ? `${formatNumber(
                                                    item?.quantity
                                                )}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.note
                                              ? `${item?.note}`
                                              : "",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                  ];
                              })
                            : ""),

                        props?.type == "purchases"
                            ? [
                                  {
                                      text: `${
                                          props.dataLang?.purchase_totalItem ||
                                          "purchase_totalItem"
                                      }`,
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
                                      text: `${
                                          props.dataLang?.purchase_totalCount ||
                                          "purchase_totalCount"
                                      }`,
                                      bold: true,
                                      colSpan: 2,
                                      margin: styleMarginChildTotal,
                                      fontSize: 10,
                                  },
                                  "",
                                  {
                                      text: `${formatNumber(
                                          data?.total_item_quantity
                                      )}`,
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
                                text: `${
                                    props.dataLang?.PDF_userMaker ||
                                    "PDF_userMaker"
                                }`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
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
        styles: styles,
        dontBreakRows: true,
        images: {
            logo: {
                url: `${dataCompany?.company_logo}`,
            },
        },
    };

    //ĐđH
    const docDefinitionOrder = {
        info: {
            title: `${`${
                props.dataLang?.purchase_order || "purchase_order"
            } - ${data?.code}`}`,
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
                        x2: 520,
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
                                props.dataLang?.purchase_order ||
                                "purchase_order"
                            }`,
                            "contentTitle"
                        ),
                    },
                    // {
                    //     text: `${moment(data?.date).format(
                    //         "DD/MM/YYYY HH:mm:ss"
                    //     )}`,
                    //     style: "contentDate",
                    // },
                ],
                margin: [0, 8, 0, 0],
            },
            // {
            //     text: [
            //         {
            //             text: `${
            //                 props.dataLang?.purchase_order_table_code + ": " ||
            //                 "purchase_order_table_code"
            //             } `,
            //             inline: true,
            //             fontSize: 10,
            //         },
            //         {
            //             text: `${data?.code}`,
            //             bold: true,
            //             fontSize: 10,
            //         },
            //     ],
            //     margin: [0, 10, 0, 2],
            // },
            // {
            //     text: [
            //         {
            //             text: `${
            //                 props.dataLang?.purchase_order_table_dayvoucers +
            //                     ": " || "purchase_order_table_dayvoucers"
            //             }`,
            //             inline: true,
            //             fontSize: 10,
            //         },
            //         {
            //             text: `${moment(data?.date).format(
            //                 "DD/MM/YYYY HH:mm:ss"
            //             )}`,
            //             bold: true,
            //             fontSize: 10,
            //         },
            //     ],
            //     margin: [0, 2, 0, 2],
            // },
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
                                            props.dataLang?.purchase_code +
                                                ": " || "purchase_code"
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
                                        text: `${
                                            props.dataLang
                                                ?.purchase_order_table_dayvoucers +
                                                ": " ||
                                            "purchase_order_table_dayvoucers"
                                        }`,
                                        inline: true,
                                        fontSize: 8,
                                        italics: true,
                                    },
                                    {
                                        text: `${moment(data?.date).format(
                                            "DD/MM/YYYY"
                                        )}`,
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
                                ? `${
                                      props.dataLang
                                          ?.purchase_order_table_supplier +
                                          ": " ||
                                      "purchase_order_table_supplier"
                                  }`
                                : "",
                        inline: true,
                        fontSize: 10,
                    },
                    {
                        text:
                            props?.type === "order"
                                ? `${data?.supplier_name}`
                                : "",
                        bold: true,
                        fontSize: 10,
                    },
                ],
                margin: [0, 2, 0, 2],
            },
            {
                text: [
                    {
                        text: `${
                            props.dataLang
                                ?.purchase_order_detail_delivery_date + ": " ||
                            "purchase_order_detail_delivery_date"
                        }`,
                        inline: true,
                        fontSize: 10,
                    },
                    {
                        text: `${moment(data?.delivery_date).format(
                            "DD/MM/YYYY"
                        )}`,
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
                                ? `${
                                      props.dataLang
                                          ?.purchase_order_table_number +
                                          ": " || "purchase_order_table_number"
                                  }`
                                : "",
                        inline: true,
                        fontSize: 10,
                    },
                    {
                        text:
                            props?.type === "order"
                                ? `${data?.purchases
                                      ?.map((e) => e.code)
                                      .join(", ")}`
                                : "",
                        bold: true,
                        fontSize: 10,
                    },
                ],
                margin: [0, 2, 0, 2],
            },

            {
                text: [
                    {
                        text: `${
                            props.dataLang?.purchase_order_note + ": " ||
                            "purchase_order_note"
                        } `,
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
                            uppercaseTextHeaderTabel(
                                "STT",
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.purchase_items ||
                                    "purchase_items"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.purchase_variant ||
                                    "purchase_variant"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                "ĐVT",
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                "SL",
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang
                                        ?.purchase_order_detail_unit_price ||
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
                                `${
                                    props.dataLang?.purchase_order_detail_tax ||
                                    "purchase_order_detail_tax"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang
                                        ?.purchase_order_detail_into_money ||
                                    "purchase_order_detail_into_money"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.purchase_order_note ||
                                    "purchase_order_note"
                                }`,
                                "headerTable",
                                "center"
                            ),
                        ],

                        // Data rows
                        ...(data &&
                        props?.type == "order" &&
                        data?.item.length > 0
                            ? data?.item.map((item, index) => {
                                  return [
                                      {
                                          text: `${index + 1}`,
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.item?.name
                                              ? item?.item?.name
                                              : "",
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
                                          text: item?.item?.unit_name
                                              ? `${item?.item?.unit_name}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.quantity
                                              ? `${formatNumber(
                                                    item?.quantity
                                                )}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.price_after_discount
                                              ? `${formatNumber(
                                                    item?.price_after_discount
                                                )}`
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
                                          text: item?.tax_rate
                                              ? `${item?.tax_rate + "%"}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.amount
                                              ? `${formatNumber(item?.amount)}`
                                              : "",
                                          alignment: "right",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.note
                                              ? `${item?.note}`
                                              : "",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                  ];
                              })
                            : ""),
                        [
                            {
                                text: `${
                                    props.dataLang
                                        ?.purchase_order_table_total ||
                                    "purchase_order_table_total"
                                }`,
                                bold: true,
                                colSpan: 2,
                                fontSize: 10,
                                margin: styleMarginChildTotal,
                            },
                            "",
                            {
                                text: `${formatNumber(data?.total_price)}`,
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
                                text: `${
                                    props.dataLang
                                        ?.purchase_order_detail_discounty ||
                                    "purchase_order_detail_discounty"
                                }`,
                                bold: true,
                                margin: styleMarginChildTotal,
                                colSpan: 2,
                                fontSize: 10,
                            },
                            "",
                            {
                                text: `${formatNumber(data?.total_discount)}`,
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
                                text: `${
                                    props.dataLang
                                        ?.purchase_order_detail_money_after_discount ||
                                    "purchase_order_detail_money_after_discount"
                                }`,
                                bold: true,
                                colSpan: 2,
                                fontSize: 10,
                                margin: styleMarginChildTotal,
                            },
                            "",
                            {
                                text: `${formatNumber(
                                    data?.total_price_after_discount
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
                        ],
                        [
                            {
                                text: `${
                                    props.dataLang
                                        ?.purchase_order_detail_tax_money ||
                                    "purchase_order_detail_tax_money"
                                }`,
                                bold: true,
                                colSpan: 2,
                                fontSize: 10,
                                margin: styleMarginChildTotal,
                            },
                            "",
                            {
                                text: `${formatNumber(data?.total_tax)}`,
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
                                text: `${
                                    props.dataLang
                                        ?.purchase_order_detail_into_money ||
                                    "purchase_order_detail_into_money"
                                }`,
                                bold: true,
                                margin: styleMarginChildTotal,
                                colSpan: 2,
                                fontSize: 10,
                            },
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
                                text: `${
                                    props.dataLang?.PDF_userMaker ||
                                    "PDF_userMaker"
                                }`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
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
        styles: styles,
        dontBreakRows: true,
        images: {
            logo: {
                url: `${dataCompany?.company_logo}`,
            },
        },
    };

    //PDV
    const docDefinitionServiceVoucher = {
        info: {
            title: `${`${
                props.dataLang?.serviceVoucher_title || "serviceVoucher_title"
            } - ${data?.code}`}`,
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
                        x2: 520,
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
                                props.dataLang?.serviceVoucher_title ||
                                "serviceVoucher_title"
                            }`,
                            "contentTitle"
                        ),
                    },
                    // {
                    //     text: `${moment(data?.date).format("DD/MM/YYYY")}`,
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
                                            props.dataLang
                                                ?.serviceVoucher_voucher_code +
                                                ": " ||
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
                                        text: `${
                                            props.dataLang
                                                ?.serviceVoucher_day_vouchers +
                                                ": " ||
                                            "serviceVoucher_day_vouchers"
                                        }`,
                                        inline: true,
                                        fontSize: 8,
                                        italics: true,
                                    },
                                    {
                                        text: `${moment(data?.date).format(
                                            "DD/MM/YYYY"
                                        )}`,
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
            //             text: `${
            //                 props.dataLang?.serviceVoucher_voucher_code ||
            //                 "serviceVoucher_voucher_code"
            //             }: `,
            //             inline: true,
            //             fontSize: 10,
            //         },
            //         {
            //             text: `${data?.code}`,
            //             bold: true,
            //             fontSize: 10,
            //         },
            //     ],
            //     margin: [0, 10, 0, 2],
            // },
            // {
            //     text: [
            //         {
            //             text: `${
            //                 props.dataLang?.serviceVoucher_day_vouchers ||
            //                 "serviceVoucher_day_vouchers"
            //             }: `,
            //             inline: true,
            //             fontSize: 10,
            //         },
            //         {
            //             text: `${moment(data?.date).format("DD/MM/YYYY")}`,
            //             bold: true,
            //             fontSize: 10,
            //         },
            //     ],
            //     margin: [0, 2, 0, 2],
            // },

            {
                text: [
                    {
                        text: `${
                            props.dataLang?.serviceVoucher_supplier ||
                            "serviceVoucher_supplier"
                        }: `,
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
                        text: `${
                            props.dataLang?.serviceVoucher_note ||
                            "serviceVoucher_note"
                        }: `,
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
                    // widths:  props?.type== "serviceVoucher" &&  ['auto',90,'auto','auto','auto','auto','auto','auto',75],
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
                            uppercaseTextHeaderTabel(
                                "STT",
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang
                                        ?.serviceVoucher_services_arising ||
                                    "serviceVoucher_services_arising"
                                }`,
                                "headerTable",
                                "left"
                            ),
                            uppercaseTextHeaderTabel(
                                `${"SL"}`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.serviceVoucher_unit_price ||
                                    "serviceVoucher_unit_price"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                "% CK",
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                "ĐGSCK",
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.serviceVoucher_tax ||
                                    "serviceVoucher_tax"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.serviceVoucher_into_money ||
                                    "serviceVoucher_into_money"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.serviceVoucher_note ||
                                    "serviceVoucher_note"
                                }`,
                                "headerTable",
                                "center"
                            ),
                        ],

                        // Data rows
                        ...(data &&
                        props?.type == "serviceVoucher" &&
                        data?.item.length > 0
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
                                          text: item?.quantity
                                              ? `${formatNumber(
                                                    item?.quantity
                                                )}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.price
                                              ? `${formatNumber(item?.price)}`
                                              : "",
                                          alignment: "right",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.discount_percent
                                              ? `${
                                                    item?.discount_percent + "%"
                                                }`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.price_after_discount
                                              ? `${formatNumber(
                                                    item?.price_after_discount
                                                )}`
                                              : "",
                                          alignment: "right",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.tax_rate
                                              ? `${item?.tax_rate + "%"}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.amount
                                              ? `${formatNumber(item?.amount)}`
                                              : "",
                                          alignment: "right",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.note
                                              ? `${item?.note}`
                                              : "",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                  ];
                              })
                            : ""),
                        [
                            {
                                text: `${
                                    props.dataLang
                                        ?.purchase_order_table_total ||
                                    "purchase_order_table_total"
                                }`,
                                bold: true,
                                colSpan: 2,
                                fontSize: 10,
                                margin: styleMarginChildTotal,
                            },
                            "",
                            {
                                text: `${formatNumber(data?.total_price)}`,
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
                                text: `${
                                    props.dataLang
                                        ?.purchase_order_detail_discounty ||
                                    "purchase_order_detail_discounty"
                                }`,
                                bold: true,
                                colSpan: 2,
                                fontSize: 10,
                                margin: styleMarginChildTotal,
                            },
                            "",
                            {
                                text: `${formatNumber(data?.total_discount)}`,
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
                                text: `${
                                    props.dataLang
                                        ?.purchase_order_detail_money_after_discount ||
                                    "purchase_order_detail_money_after_discount"
                                }`,
                                bold: true,
                                colSpan: 2,
                                fontSize: 10,
                                margin: styleMarginChildTotal,
                            },
                            "",
                            {
                                text: `${formatNumber(
                                    data?.total_price_after_discount
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
                        [
                            {
                                text: `${
                                    props.dataLang
                                        ?.purchase_order_detail_tax_money ||
                                    "purchase_order_detail_tax_money"
                                }`,
                                bold: true,
                                colSpan: 2,
                                fontSize: 10,
                                margin: styleMarginChildTotal,
                            },
                            "",
                            {
                                text: `${formatNumber(data?.total_tax)}`,
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
                                text: `${
                                    props.dataLang
                                        ?.purchase_order_detail_into_money ||
                                    "purchase_order_detail_into_money"
                                }`,
                                bold: true,
                                colSpan: 2,
                                fontSize: 10,
                                margin: styleMarginChildTotal,
                            },
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
                                text: `${
                                    props.dataLang?.PDF_userMaker ||
                                    "PDF_userMaker"
                                }`,
                                style: "signatureText",
                                alignment: "center",
                                fontSize: 10,
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
        styles: styles,
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

    //nhập hàng

    const docDefinitionImportFull = {
        info: {
            title: `${`${props.dataLang?.import_title || "import_title"} - ${
                data?.code
            }`}`,
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
                        x2: 520,
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
                            `${props.dataLang?.import_title || "import_title"}`,
                            "contentTitle"
                        ),
                    },
                    // {
                    //     text: `${moment(data?.date).format(
                    //         "DD/MM/YYYY HH:mm:ss"
                    //     )}`,
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
                                            props.dataLang
                                                ?.import_code_vouchers + ": " ||
                                            "import_code_vouchers"
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
                                        text: `${
                                            props.dataLang
                                                ?.import_day_vouchers + ": " ||
                                            "import_day_vouchers"
                                        }`,
                                        inline: true,
                                        fontSize: 8,
                                        italics: true,
                                    },
                                    {
                                        text: `${moment(data?.date).format(
                                            "DD/MM/YYYY"
                                        )}`,
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
            //             text: `${
            //                 props.dataLang?.import_code_vouchers + ": " ||
            //                 "import_code_vouchers"
            //             }`,
            //             inline: true,
            //             fontSize: 10,
            //         },
            //         {
            //             text: `${data?.code}`,
            //             bold: true,
            //             fontSize: 10,
            //         },
            //     ],
            //     margin: [0, 10, 0, 2],
            // },
            // {
            //     text: [
            //         {
            //             text: `${
            //                 props.dataLang?.import_day_vouchers + ": " ||
            //                 "import_day_vouchers"
            //             }`,
            //             inline: true,
            //             fontSize: 10,
            //         },
            //         {
            //             text: `${moment(data?.date).format(
            //                 "DD/MM/YYYY HH:mm:ss"
            //             )}`,
            //             bold: true,
            //             fontSize: 10,
            //         },
            //     ],
            //     margin: [0, 2, 0, 2],
            // },

            {
                text: [
                    {
                        text: `${
                            props.dataLang?.import_supplier + ": " ||
                            "import_supplier"
                        }`,
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
                        text: `${
                            props.dataLang?.serviceVoucher_note ||
                            "serviceVoucher_note"
                        }: `,
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
                    // widths:  props?.type== "import" &&  ['auto',70,'auto','auto','auto','auto',55,'auto','auto',50],
                    widths: props?.type == "import" && [
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
                            uppercaseTextHeaderTabel(
                                "STT",
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.purchase_items ||
                                    "purchase_items"
                                }`,
                                "headerTables",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.PDF_infoItem ||
                                    "PDF_infoItem"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${"ĐVT"}`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${"SL"}`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.inventory_unit_price ||
                                    "inventory_unit_price"
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
                                `${
                                    props.dataLang?.serviceVoucher_tax ||
                                    "serviceVoucher_tax"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.serviceVoucher_into_money ||
                                    "serviceVoucher_into_money"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.serviceVoucher_note ||
                                    "serviceVoucher_note"
                                }`,
                                "headerTable",
                                "center"
                            ),
                        ],

                        // Data rows
                        ...(data &&
                        props?.type == "import" &&
                        data?.items.length > 0
                            ? data?.items.map((item, index) => {
                                  const stack = [];
                                  const stackBt = [];
                                  stack.push({
                                      text: item?.item?.name
                                          ? item?.item?.name
                                          : "",
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
                                                          item.serial == null ||
                                                          item.serial == ""
                                                              ? "-"
                                                              : item.serial,
                                                      fontSize: 9,
                                                      italics: true,
                                                      margin: [0, 5, 0, 0],
                                                  },
                                              ],
                                          },
                                      ];
                                      stackBt.push(serialStack);
                                  }

                                  if (
                                      dataMaterialExpiry?.is_enable === "1" ||
                                      dataProductExpiry?.is_enable === "1"
                                  ) {
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
                                                          item.lot == null ||
                                                          item.lot == ""
                                                              ? "-"
                                                              : item.lot,
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
                                                          ? moment(
                                                                item.expiration_date
                                                            ).format(
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
                                          // stack: [
                                          //   { text: item?.item?.name ? item?.item?.name : "", fontSize: 10, margin: [0, 0, 0, 0] }, // Khoảng cách giữa các hàng có thể được điều chỉnh bằng cách thay đổi các giá trị trong mảng margin
                                          //   { text: `Biến thể: ${item?.item?.product_variation}`, fontSize: 9, italics: true, margin: [0, 5, 0, 0] },
                                          //   {
                                          //     if: dataProductSerial?.is_enable === "1",
                                          //     text: [
                                          //       { text: "Serial: ", fontSize: 9, italics: true },
                                          //       { text: item.serial == null || item.serial == "" ? "-" : item.serial, fontSize: 9, italics: true }
                                          //     ],
                                          //     margin: [0, 5, 0, 0]
                                          //   },
                                          //   {
                                          //     if: dataMaterialExpiry?.is_enable === "1" || dataProductExpiry?.is_enable === "1",
                                          //     stack: [
                                          //       {
                                          //         text: [
                                          //           { text: "Lot: ", fontSize: 9, italics: true },
                                          //           { text: item.lot == null || item.lot == "" ? "-" : item.lot, fontSize: 9, italics: true }
                                          //         ],
                                          //         fontSize: 9,
                                          //         margin: [0, 5, 0, 0]
                                          //       },
                                          //       {
                                          //         text: [
                                          //           { text: "Date: ", fontSize: 9, italics: true },
                                          //           { text: item.expiration_date ? moment(item.expiration_date).format("DD/MM/YYYY") : "-", fontSize: 9, italics: true }
                                          //         ],
                                          //         fontSize: 9,
                                          //         margin: [0, 5, 0, 0]
                                          //       },
                                          //     ]
                                          //   },
                                          //   { text: `Kho - Vtk: ${item?.warehouse_name}`, fontSize: 10, margin: [0, 5, 0, 0] },
                                          // ],
                                          stack: stack,
                                      },
                                      { stack: stackBt },
                                      {
                                          text: item?.item?.unit_name
                                              ? item?.item?.unit_name
                                              : "",
                                          fontSize: 10,
                                          alignment: "center",
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.quantity
                                              ? formatNumber(item?.quantity)
                                              : "",
                                          fontSize: 10,
                                          alignment: "center",
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.price_after_discount
                                              ? formatNumber(
                                                    item?.price_after_discount
                                                )
                                              : "",
                                          fontSize: 10,
                                          alignment: "center",
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
                                          text: item?.tax_rate
                                              ? `${item?.tax_rate + "%"}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.amount
                                              ? `${formatNumber(item?.amount)}`
                                              : "",
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
                                text: `${
                                    props.dataLang
                                        ?.purchase_order_table_total ||
                                    "purchase_order_table_total"
                                }`,
                                bold: true,
                                colSpan: 2,
                                fontSize: 10,
                                margin: styleMarginChildTotal,
                            },
                            "",
                            {
                                text: `${formatNumber(data?.total_price)}`,
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
                                text: `${
                                    props.dataLang
                                        ?.purchase_order_detail_discounty ||
                                    "purchase_order_detail_discounty"
                                }`,
                                bold: true,
                                colSpan: 2,
                                margin: styleMarginChildTotal,
                                fontSize: 10,
                            },
                            "",
                            {
                                text: `${formatNumber(data?.total_discount)}`,
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
                                text: `${
                                    props.dataLang
                                        ?.purchase_order_detail_money_after_discount ||
                                    "purchase_order_detail_money_after_discount"
                                }`,
                                margin: styleMarginChildTotal,
                                bold: true,
                                colSpan: 2,
                                fontSize: 10,
                            },
                            "",
                            {
                                text: `${formatNumber(
                                    data?.total_price_after_discount
                                )}`,
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
                                text: `${
                                    props.dataLang
                                        ?.purchase_order_detail_tax_money ||
                                    "purchase_order_detail_tax_money"
                                }`,
                                margin: styleMarginChildTotal,
                                bold: true,
                                colSpan: 2,
                                fontSize: 10,
                            },
                            "",
                            {
                                text: `${formatNumber(data?.total_tax)}`,
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
                                text: `${
                                    props.dataLang
                                        ?.purchase_order_detail_into_money ||
                                    "purchase_order_detail_into_money"
                                }`,
                                bold: true,
                                margin: styleMarginChildTotal,
                                colSpan: 2,
                                fontSize: 10,
                            },
                            "",
                            {
                                text: `${formatNumber(data?.total_amount)}`,
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
        styles: styles,
        dontBreakRows: true,
        images: {
            logo: {
                url: `${dataCompany?.company_logo}`,
            },
        },
    };

    //nhập hàng not price

    const docDefinitionImportNoPrice = {
        info: {
            title: `${`${props.dataLang?.import_title || "import_title"} - ${
                data?.code
            }`}`,
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
                        x2: 520,
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
                            `${props.dataLang?.import_title || "import_title"}`,
                            "contentTitle"
                        ),
                    },
                    // {
                    //     text: `${moment(data?.date).format(
                    //         "DD/MM/YYYY HH:mm:ss"
                    //     )}`,
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
                                            props.dataLang
                                                ?.import_code_vouchers + ": " ||
                                            "import_code_vouchers"
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
                                        text: `${
                                            props.dataLang
                                                ?.import_day_vouchers + ": " ||
                                            "import_day_vouchers"
                                        }`,
                                        inline: true,
                                        fontSize: 8,
                                        italics: true,
                                    },
                                    {
                                        text: `${moment(data?.date).format(
                                            "DD/MM/YYYY"
                                        )}`,
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
            //             text: `${
            //                 props.dataLang?.import_code_vouchers + ": " ||
            //                 "import_code_vouchers"
            //             }`,
            //             inline: true,
            //             fontSize: 10,
            //         },
            //         {
            //             text: `${data?.code}`,
            //             bold: true,
            //             fontSize: 10,
            //         },
            //     ],
            //     margin: [0, 10, 0, 2],
            // },
            // {
            //     text: [
            //         {
            //             text: `${
            //                 props.dataLang?.import_day_vouchers + ": " ||
            //                 "import_day_vouchers"
            //             }`,
            //             inline: true,
            //             fontSize: 10,
            //         },
            //         {
            //             text: `${moment(data?.date).format(
            //                 "DD/MM/YYYY HH:mm:ss"
            //             )}`,
            //             bold: true,
            //             fontSize: 10,
            //         },
            //     ],
            //     margin: [0, 2, 0, 2],
            // },

            {
                text: [
                    {
                        text: `${
                            props.dataLang?.import_supplier + ": " ||
                            "import_supplier"
                        }`,
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
                        text: `${
                            props.dataLang?.serviceVoucher_note ||
                            "serviceVoucher_note"
                        }: `,
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
                        "*",
                    ],
                    body: [
                        // Header row
                        [
                            uppercaseTextHeaderTabel(
                                "STT",
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.inventory_items ||
                                    "inventory_items"
                                }`,
                                "headerTables",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.PDF_infoItem ||
                                    "PDF_infoItem"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${props.dataLang?.PDF_house || "PDF_house"}`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${"ĐVT"}`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${"SL"}`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.serviceVoucher_note ||
                                    "serviceVoucher_note"
                                }`,
                                "headerTable",
                                "center"
                            ),
                        ],

                        // Data rows
                        ...(data &&
                        props?.type == "import" &&
                        data?.items.length > 0
                            ? data?.items.map((item, index) => {
                                  const stack = [];
                                  const stackBt = [];
                                  stack.push({
                                      text: item?.item?.name
                                          ? item?.item?.name
                                          : "",
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
                                                          item.serial == null ||
                                                          item.serial == ""
                                                              ? "-"
                                                              : item.serial,
                                                      fontSize: 9,
                                                      italics: true,
                                                      margin: [0, 5, 0, 0],
                                                  },
                                              ],
                                          },
                                      ];
                                      stackBt.push(serialStack);
                                  }

                                  if (
                                      dataMaterialExpiry?.is_enable === "1" ||
                                      dataProductExpiry?.is_enable === "1"
                                  ) {
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
                                                          item.lot == null ||
                                                          item.lot == ""
                                                              ? "-"
                                                              : item.lot,
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
                                                          ? moment(
                                                                item.expiration_date
                                                            ).format(
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
                                                  text: item?.warehouse_name
                                                      ? item?.warehouse_name
                                                      : "",
                                                  fontSize: 10,
                                                  margin: styleMarginChild,
                                              },
                                              {
                                                  text: item?.location_name
                                                      ? `(${item?.location_name})`
                                                      : "",
                                                  fontSize: 9,
                                                  italics: true,
                                                  margin: styleMarginChild,
                                              },
                                          ],
                                      },
                                      {
                                          text: item?.item?.unit_name
                                              ? item?.item?.unit_name
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.quantity
                                              ? formatNumber(item?.quantity)
                                              : "",
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
                                text: `${
                                    props.dataLang?.inventory_total_item ||
                                    "inventory_total_item"
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
                                text: `${
                                    props.dataLang?.purchase_totalCount ||
                                    "purchase_totalCount"
                                }`,
                                bold: true,
                                colSpan: 2,
                                fontSize: 10,
                                margin: styleMarginChildTotal,
                            },
                            "",
                            {
                                text: `${formatNumber(
                                    data?.items?.reduce(
                                        (accumulator, item) =>
                                            accumulator +
                                            parseInt(item.quantity),
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
                            "",
                            "",
                        ],
                        //   [{ text: `${"Tổng số lượng"}`, bold: true, colSpan: 5, fontSize: 10 },'', '','','',{ text: `${formatNumber(data?.total_price)}`, bold: true, alignment: 'right', colSpan: 5, fontSize: 10 },'','','',''],
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
        styles: styles,
        dontBreakRows: true,
        images: {
            logo: {
                url: `${dataCompany?.company_logo}`,
            },
        },
    };

    //Trả lại hàng mua
    const docDefinitionReturnFull = {
        info: {
            title: `${`${
                props?.dataLang?.import_purchase || "import_purchase"
            } - ${data?.code}`}`,
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
                        x2: 520,
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
                                props?.dataLang?.import_purchase ||
                                "import_purchase"
                            }`,
                            "contentTitle"
                        ),
                    },
                    // {
                    //     text: `${moment(data?.date).format("DD/MM/YYYY")}`,
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
                                            props.dataLang?.import_purchase +
                                                ": " || "import_purchase"
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
                                        text: `${
                                            props.dataLang
                                                ?.import_day_vouchers + ": " ||
                                            "import_day_vouchers"
                                        }`,
                                        inline: true,
                                        fontSize: 8,
                                        italics: true,
                                    },
                                    {
                                        text: `${moment(data?.date).format(
                                            "DD/MM/YYYY"
                                        )}`,
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
            //             text: `${
            //                 props?.dataLang?.import_purchase ||
            //                 "import_purchase"
            //             }: `,
            //             inline: true,
            //             fontSize: 10,
            //         },
            //         {
            //             text: `${data?.code}`,
            //             bold: true,
            //             fontSize: 10,
            //         },
            //     ],
            //     margin: [0, 10, 0, 2],
            // },
            // {
            //     text: [
            //         {
            //             text: `${
            //                 props?.dataLang?.import_day_vouchers ||
            //                 "import_day_vouchers"
            //             }: `,
            //             inline: true,
            //             fontSize: 10,
            //         },
            //         {
            //             text: `${moment(data?.date).format("DD/MM/YYYY")}`,
            //             bold: true,
            //             fontSize: 10,
            //         },
            //     ],
            //     margin: [0, 2, 0, 2],
            // },

            {
                text: [
                    {
                        text: `${
                            props.dataLang?.import_supplier + ": " ||
                            "import_supplier"
                        }`,
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
                            uppercaseTextHeaderTabel(
                                "STT",
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.purchase_items ||
                                    "purchase_items"
                                }`,
                                "headerTables",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.PDF_infoGeneral ||
                                    "PDF_infoGeneral"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${"ĐVT"}`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${"SL"}`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.inventory_unit_price ||
                                    "inventory_unit_price"
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
                                `${
                                    props.dataLang?.serviceVoucher_tax ||
                                    "serviceVoucher_tax"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.serviceVoucher_into_money ||
                                    "serviceVoucher_into_money"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.serviceVoucher_note ||
                                    "serviceVoucher_note"
                                }`,
                                "headerTable",
                                "center"
                            ),
                        ],

                        // Data rows
                        ...(data &&
                        props?.type == "returns" &&
                        data?.items.length > 0
                            ? data?.items.map((item, index) => {
                                  const stack = [];
                                  const stackBt = [];
                                  stack.push({
                                      text: item?.item?.name
                                          ? item?.item?.name
                                          : "",
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
                                                          item.serial == null ||
                                                          item.serial == ""
                                                              ? "-"
                                                              : item.serial,
                                                      fontSize: 9,
                                                      italics: true,
                                                      margin: [0, 5, 0, 0],
                                                  },
                                              ],
                                          },
                                      ];
                                      stackBt.push(serialStack);
                                  }

                                  if (
                                      dataMaterialExpiry?.is_enable === "1" ||
                                      dataProductExpiry?.is_enable === "1"
                                  ) {
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
                                                          item.lot == null ||
                                                          item.lot == ""
                                                              ? "-"
                                                              : item.lot,
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
                                                              text: item.expiration_date
                                                                  ? moment(
                                                                        item.expiration_date
                                                                    ).format(
                                                                        "DD/MM/YYYY"
                                                                    )
                                                                  : "-",
                                                              fontSize: 8.5,
                                                              italics: true,
                                                              margin: [
                                                                  0, 5, 0, 0,
                                                              ],
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
                                          text: item?.item?.unit_name
                                              ? item?.item?.unit_name
                                              : "",
                                          fontSize: 10,
                                          alignment: "center",
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.quantity
                                              ? formatNumber(item?.quantity)
                                              : "",
                                          fontSize: 10,
                                          alignment: "center",
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.price_after_discount
                                              ? formatNumber(
                                                    item?.price_after_discount
                                                )
                                              : "",
                                          fontSize: 10,
                                          alignment: "center",
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
                                          text: item?.tax_rate
                                              ? `${item?.tax_rate + "%"}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.amount
                                              ? `${formatNumber(item?.amount)}`
                                              : "",
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
                                text: `${
                                    props.dataLang
                                        ?.purchase_order_table_total ||
                                    "purchase_order_table_total"
                                }`,
                                bold: true,
                                colSpan: 2,
                                fontSize: 10,
                                margin: styleMarginChildTotal,
                            },
                            "",
                            {
                                text: `${formatNumber(data?.total_price)}`,
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
                                text: `${
                                    props.dataLang
                                        ?.purchase_order_detail_discounty ||
                                    "purchase_order_detail_discounty"
                                }`,
                                bold: true,
                                colSpan: 2,
                                fontSize: 10,
                                margin: styleMarginChildTotal,
                            },
                            "",
                            {
                                text: `${formatNumber(data?.total_discount)}`,
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
                                text: `${
                                    props.dataLang
                                        ?.purchase_order_detail_money_after_discount ||
                                    "purchase_order_detail_money_after_discount"
                                }`,
                                bold: true,
                                colSpan: 2,
                                fontSize: 10,
                                margin: styleMarginChildTotal,
                            },
                            "",
                            {
                                text: `${formatNumber(
                                    data?.total_price_after_discount
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
                        [
                            {
                                text: `${
                                    props.dataLang
                                        ?.purchase_order_detail_tax_money ||
                                    "purchase_order_detail_tax_money"
                                }`,
                                bold: true,
                                colSpan: 2,
                                fontSize: 10,
                                margin: styleMarginChildTotal,
                            },
                            "",
                            {
                                text: `${formatNumber(data?.total_tax)}`,
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
                                text: `${
                                    props.dataLang
                                        ?.purchase_order_detail_into_money ||
                                    "purchase_order_detail_into_money"
                                }`,
                                bold: true,
                                colSpan: 2,
                                margin: styleMarginChildTotal,
                                fontSize: 10,
                            },
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
        styles: styles,
        dontBreakRows: true,
        images: {
            logo: {
                url: `${dataCompany?.company_logo}`,
            },
        },
    };

    const docDefinitionReturnFullNoPrice = {
        info: {
            title: `${`${
                props?.dataLang?.import_purchase || "import_purchase"
            } - ${data?.code}`}`,
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
                        x2: 520,
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
                                props.dataLang?.import_purchase ||
                                "import_purchase"
                            }`,
                            "contentTitle"
                        ),
                    },
                    // {
                    //     text: `${moment(data?.date).format("DD/MM/YYYY")}`,
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
                                            props.dataLang
                                                ?.import_code_vouchers + ": " ||
                                            "import_code_vouchers"
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
                                        text: `${
                                            props.dataLang
                                                ?.import_day_vouchers ||
                                            "import_day_vouchers"
                                        }`,
                                        inline: true,
                                        fontSize: 8,
                                        italics: true,
                                    },
                                    {
                                        text: `${moment(data?.date).format(
                                            "DD/MM/YYYY"
                                        )}`,
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
            //             text: `${
            //                 props.dataLang?.import_code_vouchers + ": " ||
            //                 "import_code_vouchers"
            //             }`,
            //             inline: true,
            //             fontSize: 10,
            //         },
            //         {
            //             text: `${data?.code}`,
            //             bold: true,
            //             fontSize: 10,
            //         },
            //     ],
            //     margin: [0, 10, 0, 2],
            // },
            // {
            //     text: [
            //         {
            //             text: `${
            //                 props.dataLang?.import_day_vouchers + ": " ||
            //                 "import_day_vouchers"
            //             }`,
            //             inline: true,
            //             fontSize: 10,
            //         },
            //         {
            //             text: `${moment(data?.date).format("DD/MM/YYYY")}`,
            //             bold: true,
            //             fontSize: 10,
            //         },
            //     ],
            //     margin: [0, 2, 0, 2],
            // },

            {
                text: [
                    {
                        text: `${
                            props.dataLang?.import_supplier + ": " ||
                            "import_supplier"
                        }`,
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
                        "*",
                    ],
                    body: [
                        // Header row
                        [
                            uppercaseText("STT", "headerTable", "center"),
                            uppercaseText(
                                `${
                                    props.dataLang?.inventory_items ||
                                    "inventory_items"
                                }`,
                                "headerTables",
                                "center"
                            ),
                            uppercaseText(
                                `${props.dataLang?.PDF_house || "PDF_house"}`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseText(`${"ĐVT"}`, "headerTable", "center"),
                            uppercaseText(`${"SL"}`, "headerTable", "center"),
                            uppercaseText(
                                `${
                                    props.dataLang?.serviceVoucher_note ||
                                    "serviceVoucher_note"
                                }`,
                                "headerTable",
                                "center"
                            ),
                        ],

                        // Data rows
                        ...(data &&
                        props?.type == "returns" &&
                        data?.items.length > 0
                            ? data?.items.map((item, index) => {
                                  const stack = [];
                                  stack.push({
                                      text: item?.item?.name
                                          ? item?.item?.name
                                          : "",
                                      fontSize: 10,
                                      margin: styleMarginChild,
                                  });
                                  stack.push({
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
                                                          item.serial == null ||
                                                          item.serial == ""
                                                              ? "-"
                                                              : item.serial,
                                                      fontSize: 9,
                                                      italics: true,
                                                      margin: [0, 5, 0, 0],
                                                  },
                                              ],
                                          },
                                      ];
                                      stack.push(serialStack);
                                  }

                                  if (
                                      dataMaterialExpiry?.is_enable === "1" ||
                                      dataProductExpiry?.is_enable === "1"
                                  ) {
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
                                                          item.lot == null ||
                                                          item.lot == ""
                                                              ? "-"
                                                              : item.lot,
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
                                                              text: item.expiration_date
                                                                  ? moment(
                                                                        item.expiration_date
                                                                    ).format(
                                                                        "DD/MM/YYYY"
                                                                    )
                                                                  : "-",
                                                              fontSize: 8.5,
                                                              italics: true,
                                                              margin: [
                                                                  0, 5, 0, 0,
                                                              ],
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
                                      stack.push(subStack);
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
                                          stack: [
                                              {
                                                  text: item?.warehouse_name
                                                      ? item?.warehouse_name
                                                      : "",
                                                  fontSize: 10,
                                                  margin: styleMarginChild,
                                              },
                                              {
                                                  text: item?.location_name
                                                      ? `(${item?.location_name})`
                                                      : "",
                                                  fontSize: 10,
                                                  italics: true,
                                                  margin: styleMarginChild,
                                              },
                                          ],
                                      },
                                      {
                                          text: item?.item?.unit_name
                                              ? item?.item?.unit_name
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.quantity
                                              ? formatNumber(item?.quantity)
                                              : "",
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
                                text: `${
                                    props.dataLang?.inventory_total_item ||
                                    "inventory_total_item"
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
                                colSpan: 4,
                                fontSize: 10,
                                margin: styleMarginChildTotal,
                            },
                            "",
                            "",
                            "",
                        ],
                        [
                            {
                                text: `${
                                    props.dataLang?.purchase_totalCount ||
                                    "purchase_totalCount"
                                }`,
                                bold: true,
                                colSpan: 2,
                                fontSize: 10,
                                margin: styleMarginChildTotal,
                            },
                            "",
                            {
                                text: `${formatNumber(
                                    data?.items?.reduce(
                                        (accumulator, item) =>
                                            accumulator +
                                            parseInt(item.quantity),
                                        0
                                    )
                                )}`,
                                bold: true,
                                alignment: "right",
                                colSpan: 4,
                                fontSize: 10,
                                margin: styleMarginChildTotal,
                            },
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
        styles: styles,
        dontBreakRows: true,
        images: {
            logo: {
                url: `${dataCompany?.company_logo}`,
            },
        },
    };

    const handlePrintPdf = (type) => {
        if (
            data !== undefined &&
            dataCompany !== undefined &&
            props?.type == "purchases"
        ) {
            const pdfGenerator = pdfMake.createPdf(docDefinitionPurchases);
            pdfGenerator.open((blob) => {
                const url = URL.createObjectURL(blob);
                setUrl(url);
            });
            setOpenAction(false);
        }
        if (
            data !== undefined &&
            dataCompany !== undefined &&
            props?.type == "order"
        ) {
            const pdfGenerator = pdfMake.createPdf(docDefinitionOrder);
            pdfGenerator.open((blob) => {
                const url = URL.createObjectURL(blob);
                setUrl(url);
            });
            setOpenAction(false);
        }
        if (
            data !== undefined &&
            dataCompany !== undefined &&
            props?.type == "serviceVoucher"
        ) {
            const pdfGenerator = pdfMake.createPdf(docDefinitionServiceVoucher);
            pdfGenerator.open((blob) => {
                const url = URL.createObjectURL(blob);
                setUrl(url);
            });
            setOpenAction(false);
        }
        if (
            type == "fullStyle" &&
            data !== undefined &&
            dataCompany !== undefined &&
            props?.type == "import"
        ) {
            const pdfGenerator = pdfMake.createPdf(docDefinitionImportFull);
            pdfGenerator.open((blob) => {
                const url = URL.createObjectURL(blob);
                setUrl(url);
            });
            setOpenAction(false);
        }
        if (
            type == "noprice" &&
            data !== undefined &&
            dataCompany !== undefined &&
            props?.type == "import"
        ) {
            const pdfGenerator = pdfMake.createPdf(docDefinitionImportNoPrice);
            console.log(data);
            pdfGenerator.open((blob) => {
                const url = URL.createObjectURL(blob);
                setUrl(url);
            });
            setOpenAction(false);
        }
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

        if (
            type == "fullStyle" &&
            data !== undefined &&
            dataCompany !== undefined &&
            props?.type == "returns"
        ) {
            const pdfGenerator = pdfMake.createPdf(docDefinitionReturnFull);
            pdfGenerator.open((blob) => {
                const url = URL.createObjectURL(blob);
                setUrl(url);
            });
            setOpenAction(false);
        }
        if (
            type == "noprice" &&
            data !== undefined &&
            dataCompany !== undefined &&
            props?.type == "returns"
        ) {
            const pdfGenerator = pdfMake.createPdf(
                docDefinitionReturnFullNoPrice
            );
            console.log(data);
            pdfGenerator.open((blob) => {
                const url = URL.createObjectURL(blob);
                setUrl(url);
            });
            setOpenAction(false);
        }
    };
    return (
        <React.Fragment>
            {props?.type == "import" && (
                <React.Fragment>
                    <div className="flex justify-center items-center my-3">
                        <button
                            onClick={handlePrintPdf.bind(this, "noprice")}
                            className="relative hover:-translate-y-[3px] transition-all ease-linear inline-flex items-center justify-center p-0.5  mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                        >
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                {props.dataLang?.option_prin_notprice ||
                                    "option_prin_notprice"}
                            </span>
                        </button>
                        <button
                            onClick={handlePrintPdf.bind(this, "fullStyle")}
                            className="relative hover:-translate-y-[3px] transition-all ease-linear inline-flex items-center justify-center p-0.5  mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                        >
                            <span className="relative px-8 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                {props.dataLang?.option_prin_price ||
                                    "option_prin_price"}
                            </span>
                        </button>
                    </div>
                </React.Fragment>
            )}
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

            {props?.type == "purchases" && (
                <React.Fragment>
                    <button
                        onClick={handlePrintPdf}
                        className="transition-all ease-in-out flex items-center gap-2 group  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5  rounded py-2.5 w-full"
                    >
                        <VscFilePdf
                            size={20}
                            className="group-hover:text-[#65a30d] group-hover:scale-110 group-hover:shadow-md "
                        />
                        <p className="group-hover:text-[#65a30d]">
                            {props?.dataLang?.btn_table_print ||
                                "btn_table_print"}
                        </p>
                    </button>
                </React.Fragment>
            )}
            {props?.type == "order" && (
                <React.Fragment>
                    <button
                        onClick={handlePrintPdf}
                        className="transition-all ease-in-out flex items-center gap-2 group  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5  rounded py-2.5 w-full"
                    >
                        <VscFilePdf
                            size={20}
                            className="group-hover:text-[#65a30d] group-hover:scale-110 group-hover:shadow-md "
                        />
                        <p className="group-hover:text-[#65a30d]">
                            {props?.dataLang?.btn_table_print ||
                                "btn_table_print"}
                        </p>
                    </button>
                </React.Fragment>
            )}
            {props?.type == "serviceVoucher" && (
                <React.Fragment>
                    <button
                        onClick={handlePrintPdf}
                        className="transition-all ease-in-out flex items-center gap-2 group  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5  rounded py-2.5 w-full"
                    >
                        <VscFilePdf
                            size={20}
                            className="group-hover:text-[#65a30d] group-hover:scale-110 group-hover:shadow-md "
                        />
                        <p className="group-hover:text-[#65a30d]">
                            {props?.dataLang?.btn_table_print ||
                                "btn_table_print"}
                        </p>
                    </button>
                </React.Fragment>
            )}
            {props?.type == "returns" && (
                <React.Fragment>
                    <div className="flex justify-center items-center my-3">
                        <button
                            onClick={handlePrintPdf.bind(this, "noprice")}
                            className="relative inline-flex items-center justify-center p-0.5  mr-2 overflow-hidden text-sm font-medium hover:-translate-y-[3px] transition-all ease-linear text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                        >
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                {props.dataLang?.option_prin_notprice ||
                                    "option_prin_notprice"}
                            </span>
                        </button>
                        <button
                            onClick={handlePrintPdf.bind(this, "fullStyle")}
                            className="relative inline-flex items-center justify-center p-0.5  mr-2 overflow-hidden text-sm font-medium hover:-translate-y-[3px] transition-all ease-linear text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                        >
                            <span className="relative px-8 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                {props.dataLang?.option_prin_price ||
                                    "option_prin_price"}
                            </span>
                        </button>
                    </div>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default FilePDF;
