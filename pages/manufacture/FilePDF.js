import React, { useState } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
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
                    {
                        text: `${moment(data?.date).format(
                            "DD/MM/YYYY HH:mm:ss"
                        )}`,
                        style: "contentDate",
                    },
                ],
                margin: [0, 8, 0, 0],
            },
            {
                text: [
                    {
                        text: `${
                            props.dataLang?.purchase_order_table_code + ": " ||
                            "purchase_order_table_code"
                        } `,
                        inline: true,
                        fontSize: 10,
                    },
                    {
                        text: `${data?.code}`,
                        bold: true,
                        fontSize: 10,
                    },
                ],
                margin: [0, 10, 0, 2],
            },
            {
                text: [
                    {
                        text: `${
                            props.dataLang?.purchase_order_table_dayvoucers +
                                ": " || "purchase_order_table_dayvoucers"
                        }`,
                        inline: true,
                        fontSize: 10,
                    },
                    {
                        text: `${moment(data?.date).format(
                            "DD/MM/YYYY HH:mm:ss"
                        )}`,
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
                            props.dataLang?.production_warehouse_creator +
                                ": " || "production_warehouse_creator"
                        }`,
                        inline: true,
                        fontSize: 10,
                    },
                    {
                        text: `${data?.staff_create?.full_name}`,
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
                        "*",
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
                                    props.dataLang?.purchase_items ||
                                    "purchase_items"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseText(
                                `${"KX - VTX"}`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseText(`${"ĐVT"}`, "headerTable", "center"),
                            uppercaseText(
                                `${
                                    props?.dataLang
                                        ?.production_warehouse_inventory ||
                                    "production_warehouse_inventory"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseText(
                                `${
                                    props?.dataLang
                                        ?.production_warehouse_export_sl ||
                                    "production_warehouse_export_sl"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseText(
                                `${
                                    props?.dataLang
                                        ?.production_warehouse_conversion_gt ||
                                    "production_warehouse_conversion_gt"
                                }`,
                                "headerTable",
                                "center"
                            ),
                            uppercaseText(
                                `${
                                    props?.dataLang
                                        ?.production_warehouse_conversion_sl ||
                                    "production_warehouse_conversion_sl"
                                }`,
                                "headerTable",
                                "center"
                            ),
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
                        props?.type == "production_warehouse" &&
                        data?.items.length > 0
                            ? data?.items.map((item, index) => {
                                  const stack = [];
                                  stack.push({
                                      text: item?.item?.name
                                          ? item?.item?.name
                                          : "",
                                      fontSize: 10,
                                      margin: [0, 0, 0, 0],
                                  });
                                  stack.push({
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
                                      stack.push(subStack);
                                  }
                                  return [
                                      {
                                          text: `${index + 1}`,
                                          alignment: "center",
                                          fontSize: 10,
                                      },
                                      {
                                          stack: stack,
                                      },
                                      {
                                          stack: [
                                              {
                                                  text: item?.warehouse_location
                                                      ?.warehouse_name
                                                      ? `KX: ${item?.warehouse_location?.warehouse_name}`
                                                      : "",
                                              },
                                              {
                                                  text: item?.warehouse_location
                                                      ?.location_name
                                                      ? `VTX: ${item?.warehouse_location?.location_name}`
                                                      : "",
                                              },
                                          ],
                                          fontSize: 10,
                                          alignment: "left",
                                      },
                                      {
                                          text: item?.item?.unit_name
                                              ? item?.item?.unit_name
                                              : "",
                                          fontSize: 10,
                                          alignment: "center",
                                      },
                                      {
                                          text: item?.warehouse_location
                                              ?.quantity
                                              ? formatNumber(
                                                    +item?.warehouse_location
                                                        ?.quantity
                                                )
                                              : "",
                                          fontSize: 10,
                                          alignment: "center",
                                      },
                                      {
                                          text: item?.quantity
                                              ? `${formatNumber(
                                                    +item?.quantity
                                                )}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                      },
                                      {
                                          text: item?.coefficient
                                              ? `${formatNumber(
                                                    +item?.coefficient
                                                )}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                      },
                                      {
                                          text: item?.quantity_exchange
                                              ? `${formatNumber(
                                                    +item?.quantity_exchange
                                                )}`
                                              : "",
                                          alignment: "center",
                                          fontSize: 10,
                                      },

                                      {
                                          text: item?.note ? item?.note : "",
                                          fontSize: 10,
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
                            },
                            "",
                            {
                                text: `${formatNumber(data?.items?.length)}`,
                                bold: true,
                                alignment: "right",
                                colSpan: 7,
                                fontSize: 10,
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
                                    props?.dataLang
                                        ?.production_warehouse_Totalinventory ||
                                    "production_warehouse_Totalinventory"
                                }`,
                                bold: true,
                                colSpan: 2,
                                fontSize: 10,
                            },
                            "",
                            {
                                text: `${formatNumber(
                                    data?.items?.reduce(
                                        (total, item) =>
                                            total +
                                            Number(
                                                item.warehouse_location
                                                    ?.quantity
                                            ),
                                        0
                                    )
                                )}`,
                                bold: true,
                                alignment: "right",
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
            headerTable: {
                noWrap: true,
                bold: true,
                fillColor: "#0374D5",
                color: "white",
                fontSize: 10,
                // alignment: 'center',
            },
            dateText: {
                fontSize: 12,
                bold: true,
                margin: [0, 10, 0, 2],
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
    };
    return (
        <React.Fragment>
            {props?.type == "production_warehouse" && (
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
