import React, { useState } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import moment from "moment";
import { upperCase } from "lodash";
import { saveAs } from "file-saver";

import { VscFilePdf } from "react-icons/vsc";
import {
    styleMarginChild,
    styleMarginChildTotal,
    styles,
    uppercaseTextHeaderTabel,
} from "components/UI/stylePdf/style";
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

    //   production_warehouse
    const docDefinitionProduction_warehouse = {
        info: {
            title: `${`${
                props.dataLang?.production_warehouse || "production_warehouse"
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
                                props.dataLang?.production_warehouse ||
                                "production_warehouse"
                            }`,
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
                                        text: `${
                                            props.dataLang
                                                ?.purchase_order_table_code +
                                                ": " ||
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
                        text: `${
                            props.dataLang?.production_warehouse_LSX + ": " ||
                            "production_warehouse_LSX"
                        }`,
                        inline: true,
                        fontSize: 10,
                    },
                    {
                        text: `${""}`,
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
                            props.dataLang?.production_warehouse_Total_value +
                                ": " || "production_warehouse_Total_value"
                        }`,
                        inline: true,
                        fontSize: 10,
                    },
                    {
                        text: `${formatNumber(data?.grand_total)}`,
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
                                    props.dataLang?.PDF_infoVarian ||
                                    "PDF_infoVarian"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${"KX - VTX"}`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${"ĐVT"}`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props?.dataLang
                                        ?.production_warehouse_export_slPDF ||
                                    "production_warehouse_export_slPDF"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props?.dataLang
                                        ?.production_warehouse_conversion_gt ||
                                    "production_warehouse_conversion_gt"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props?.dataLang
                                        ?.production_warehouse_conversion_sl ||
                                    "production_warehouse_conversion_sl"
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
                        props?.type == "production_warehouse" &&
                        data?.items?.length > 0
                            ? data?.items?.map((item, index) => {
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
                                      {
                                          stack: stackBt,
                                      },
                                      {
                                          stack: [
                                              {
                                                  text: item?.warehouse_location
                                                      ?.warehouse_name
                                                      ? `${item?.warehouse_location?.warehouse_name}`
                                                      : "",
                                              },
                                              {
                                                  text: item?.warehouse_location
                                                      ?.location_name
                                                      ? `(${item?.warehouse_location?.location_name})`
                                                      : "",
                                                  italics: true,
                                                  margin: [0, 5, 0, 0],
                                              },
                                          ],
                                          fontSize: 10,
                                          alignment: "left",
                                          margin: styleMarginChild,
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
                                              ? `${formatNumber(
                                                    +item?.quantity
                                                )}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.coefficient
                                              ? `${formatNumber(
                                                    +item?.coefficient
                                                )}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.quantity_exchange
                                              ? `${formatNumber(
                                                    +item?.quantity_exchange
                                                )} ${item?.item?.unit_name}`
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
                                text: `${
                                    props?.dataLang
                                        ?.production_warehouse_totalItem ||
                                    "production_warehouse_totalItem"
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
                                text: `${
                                    props?.dataLang
                                        ?.production_warehouse_sales ||
                                    "production_warehouse_sales"
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
                                        (total, item) =>
                                            total + Number(item.quantity),
                                        0
                                    )
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
                                text: `${
                                    props?.dataLang?.PDF_Deliver ||
                                    "PDF_Deliver"
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
                        width: "33%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props?.dataLang?.PDF_Receiver ||
                                    "PDF_Receiver"
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
                        width: "33%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props?.dataLang?.PDF_Stocker ||
                                    "PDF_Stocker"
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
        styles: styles,
        dontBreakRows: true,
        images: {
            logo: {
                url: `${dataCompany?.company_logo}`,
            },
        },
    };
    const docDefinitionProductionWarehouse = {
        info: {
            title: `${`${
                props.dataLang?.productsWarehouse_title ||
                "productsWarehouse_title"
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
                                props.dataLang?.productsWarehouse_title ||
                                "productsWarehouse_title"
                            }`,
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
                                        text: `${
                                            props.dataLang
                                                ?.purchase_order_table_code +
                                                ": " ||
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
                        text: `${
                            props.dataLang?.production_warehouse_LSX + ": " ||
                            "production_warehouse_LSX"
                        }`,
                        inline: true,
                        fontSize: 10,
                    },
                    {
                        text: `${""}`,
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
                    widths: props?.type == "productsWarehouse" && [
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
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang?.PDF_infoVarian ||
                                    "PDF_infoVarian"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props.dataLang
                                        ?.productsWarehouse_warehouse ||
                                    "productsWarehouse_warehouse"
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
                                `${
                                    props.dataLang
                                        ?.productsWarehouse_QtyImportPDF ||
                                    "productsWarehouse_QtyImportPDF"
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
                        props?.type == "productsWarehouse" &&
                        data?.items?.length > 0
                            ? data?.items?.map((item, index) => {
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
                                                          item?.serial ==
                                                              null ||
                                                          item?.serial == ""
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
                                                      text:
                                                          item?.lot == null ||
                                                          item?.lot == ""
                                                              ? "-"
                                                              : item?.lot,
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
                                                          ? moment(
                                                                item?.expiration_date
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
                                      {
                                          stack: stackBt,
                                      },
                                      {
                                          stack: [
                                              {
                                                  text: item?.warehouse_location
                                                      ?.warehouse_name
                                                      ? `${item?.warehouse_location?.warehouse_name}`
                                                      : "",
                                              },
                                              {
                                                  text: item?.warehouse_location
                                                      ?.location_name
                                                      ? `(${item?.warehouse_location?.location_name})`
                                                      : "",
                                                  italics: true,
                                                  margin: [0, 5, 0, 0],
                                              },
                                          ],
                                          fontSize: 10,
                                          alignment: "left",
                                          margin: styleMarginChild,
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
                                              ? `${formatNumber(
                                                    +item?.quantity
                                                )}`
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
                                text: `${
                                    props?.dataLang
                                        ?.production_warehouse_totalItem ||
                                    "production_warehouse_totalItem"
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
                                    props.dataLang?.productsWarehouse_total ||
                                    "productsWarehouse_total"
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
                                        (total, item) =>
                                            total + Number(item.quantity),
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
                                text: `${
                                    props?.dataLang?.PDF_Deliver ||
                                    "PDF_Deliver"
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
                        width: "33%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props?.dataLang?.PDF_Receiver ||
                                    "PDF_Receiver"
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
                        width: "33%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props?.dataLang?.PDF_Stocker ||
                                    "PDF_Stocker"
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
        styles: styles,
        dontBreakRows: true,
        images: {
            logo: {
                url: `${dataCompany?.company_logo}`,
            },
        },
    };

    const docDefinitionRecall = {
        info: {
            title: `${`${props.dataLang?.recall_title || "recall_title"} - ${
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
                            `${props.dataLang?.recall_title || "recall_title"}`,
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
                                        text: `${
                                            props.dataLang
                                                ?.purchase_order_table_code +
                                                ": " ||
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
                        text: `${
                            props.dataLang?.production_warehouse_LSX + ": " ||
                            "production_warehouse_LSX"
                        }`,
                        inline: true,
                        fontSize: 10,
                    },
                    {
                        text: `${""}`,
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
                                    props.dataLang?.PDF_infoVarian ||
                                    "PDF_infoVarian"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${"KT - VTT"}`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${"ĐVT"}`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props?.dataLang?.recall_revenueSL ||
                                    "recall_revenueSL"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props?.dataLang?.recall_price ||
                                    "recall_price"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseTextHeaderTabel(
                                `${
                                    props?.dataLang?.recall_money ||
                                    "recall_money"
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
                        props?.type == "recall" &&
                        data?.items?.length > 0
                            ? data?.items?.map((item, index) => {
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
                                      {
                                          stack: stackBt,
                                      },
                                      {
                                          stack: [
                                              {
                                                  text: item?.warehouse
                                                      ?.warehouse_name
                                                      ? `${item?.warehouse?.warehouse_name}`
                                                      : "",
                                              },
                                              {
                                                  text: item?.warehouse
                                                      ?.location_name
                                                      ? `(${item?.warehouse?.location_name})`
                                                      : "",
                                                  italics: true,
                                                  margin: [0, 5, 0, 0],
                                              },
                                          ],
                                          fontSize: 10,
                                          alignment: "left",
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.item?.unit
                                              ? item?.item?.unit
                                              : "",
                                          fontSize: 10,
                                          alignment: "center",
                                          margin: styleMarginChild,
                                      },

                                      {
                                          text: item?.quantity
                                              ? `${formatNumber(
                                                    +item?.quantity
                                                )}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.price
                                              ? `${formatNumber(+item?.price)}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                          margin: styleMarginChild,
                                      },
                                      {
                                          text: item?.amount
                                              ? `${formatNumber(+item?.amount)}`
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
                                text: `${
                                    props?.dataLang
                                        ?.production_warehouse_totalItem ||
                                    "production_warehouse_totalItem"
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
                                text: `${
                                    props?.dataLang?.recall_revenueAmount ||
                                    "recall_revenueAmount"
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
                                        (total, item) =>
                                            (total += Number(
                                                item.quantity * item.price
                                            )),
                                        0
                                    )
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
                                text: `${
                                    props?.dataLang?.PDF_Deliver ||
                                    "PDF_Deliver"
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
                        width: "33%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props?.dataLang?.PDF_Receiver ||
                                    "PDF_Receiver"
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
                        width: "33%",
                        stack: [
                            {
                                text: "",
                                style: "dateText",
                                alignment: "center",
                                fontSize: 10,
                            },
                            {
                                text: `${
                                    props?.dataLang?.PDF_Stocker ||
                                    "PDF_Stocker"
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
            props?.type == "production_warehouse"
        ) {
            const pdfGenerator = pdfMake.createPdf(
                docDefinitionProduction_warehouse
            );
            pdfGenerator.open((blob) => {
                const url = URL.createObjectURL(blob);
                setUrl(url);
            });
            setOpenAction(false);
        }
        if (
            data !== undefined &&
            dataCompany !== undefined &&
            props?.type == "productsWarehouse"
        ) {
            const pdfGenerator = pdfMake.createPdf(
                docDefinitionProductionWarehouse
            );
            pdfGenerator.open((blob) => {
                const url = URL.createObjectURL(blob);
                setUrl(url);
            });
            setOpenAction(false);
        }
        if (
            data !== undefined &&
            dataCompany !== undefined &&
            props?.type == "recall"
        ) {
            const pdfGenerator = pdfMake.createPdf(docDefinitionRecall);
            pdfGenerator.open((blob) => {
                const url = URL.createObjectURL(blob);
                setUrl(url);
            });
            setOpenAction(false);
        }
    };
    return (
        <React.Fragment>
            {(props?.type == "production_warehouse" ||
                props?.type == "productsWarehouse" ||
                props?.type == "recall") && (
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
        </React.Fragment>
    );
};

export default FilePDF;
