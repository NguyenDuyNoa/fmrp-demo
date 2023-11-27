import React, { useState } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import {
    styleMarginChild,
    styleMarginChildTotal,
    uppercaseTextHeaderTabel,
    styles,
    columns,
} from "@/configs/stylePdf/style";

import moment from "moment";
import { upperCase } from "lodash";
import { saveAs } from "file-saver";

import { VscFilePdf } from "react-icons/vsc";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import {
    titleFooter,
    styleForm,
    titleHeader,
    titleValue,
    lineHeght,
    titleDateOne,
    titleDateTwo,
    styleFormTow,
} from "@/configs/stylePdf/receiptsEndPayment";
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
            { stack: titleValue(props, data, capitalizedTotalAmountWord) },
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
            { stack: titleValue(props, data, capitalizedTotalAmountWord) },
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
            { stack: titleValue(props, data, capitalizedTotalAmountWord) },
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

    /// Phiếu thu 1 liên
    const docDefinitionReceipts = {
        pageSize: "A5",
        pageOrientation: "landscape",
        info: {
            title: `${`${"Phiếu thu"} - ${data?.code}`}`,
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
                stack: titleDateOne(props, data, "Phiếu thu"),
                margin: [0, 8, 0, 0],
            },
            { stack: titleValue(props, data, capitalizedTotalAmountWord) },
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
            title: `${`${"Phiếu thu"} - ${data?.code}`}`,
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
                stack: titleDateTwo(props, data, "Phiếu thu"),
                margin: [0, 8, 0, 0],
            },
            { stack: titleValue(props, data, capitalizedTotalAmountWord) },
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
                stack: titleDateTwo(props, data, "Phiếu thu"),
                margin: [0, 8, 0, 0],
            },
            { stack: titleValue(props, data, capitalizedTotalAmountWord) },
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

    // Tạo tài liệu PDF
    const handlePrintPdf = (type) => {
        const data = {
            oneLink: {
                payment: docDefinitionPayment,
                receipts: docDefinitionReceipts,
            },
            twoLink: {
                payment: docDefinitionPaymentTwo,
                receipts: docDefinitionReceiptsTwo,
            },
        };
        const dataKeys = Object.keys(data);
        if (dataKeys.includes(type) && data !== undefined && dataCompany !== undefined) {
            const pdfGenerator = pdfMake.createPdf(data[type][props?.type]);
            pdfGenerator.open((blob) => {
                const url = URL.createObjectURL(blob);
                setUrl(url);
            });
            setOpenAction(false);
        }
        // if (type == "oneLink" && data !== undefined && dataCompany !== undefined && props?.type == "payment") {
        //     const pdfGenerator = pdfMake.createPdf(docDefinitionPayment);
        //     pdfGenerator.open((blob) => {
        //         const url = URL.createObjectURL(blob);
        //         setUrl(url);
        //     });
        //     setOpenAction(false);
        // }
        // if (type == "twoLink" && data !== undefined && dataCompany !== undefined && props?.type == "payment") {
        //     const pdfGenerator = pdfMake.createPdf(docDefinitionPaymentTwo);
        //     pdfGenerator.open((blob) => {
        //         const url = URL.createObjectURL(blob);
        //         setUrl(url);
        //     });
        //     setOpenAction(false);
        // }
        // if (type == "oneLink" && data !== undefined && dataCompany !== undefined && props?.type == "receipts") {
        //     const pdfGenerator = pdfMake.createPdf(docDefinitionReceipts);
        //     pdfGenerator.open((blob) => {
        //         const url = URL.createObjectURL(blob);
        //         setUrl(url);
        //     });
        //     setOpenAction(false);
        // }
        // if (type == "twoLink" && data !== undefined && dataCompany !== undefined && props?.type == "receipts") {
        //     const pdfGenerator = pdfMake.createPdf(docDefinitionReceiptsTwo);
        //     pdfGenerator.open((blob) => {
        //         const url = URL.createObjectURL(blob);
        //         setUrl(url);
        //     });
        //     setOpenAction(false);
        // }
    };
    return (
        <React.Fragment>
            {(props?.type == "payment" && (
                <React.Fragment>
                    <div className="flex justify-center items-center my-3">
                        <button
                            onClick={handlePrintPdf.bind(this, "oneLink")}
                            className="relative inline-flex items-center justify-center p-0.5  mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                        >
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                {props.dataLang?.PDF_PrintOnelink || "PDF_PrintOnelink"}
                            </span>
                        </button>
                        <button
                            onClick={handlePrintPdf.bind(this, "twoLink")}
                            className="relative inline-flex items-center justify-center p-0.5  mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                        >
                            <span className="relative px-8 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                {props.dataLang?.PDF_PrintTwolink || "PDF_PrintTwolink"}
                            </span>
                        </button>
                    </div>
                </React.Fragment>
            )) ||
                (props?.type == "receipts" && (
                    <React.Fragment>
                        <div className="flex justify-center items-center my-3">
                            <button
                                onClick={handlePrintPdf.bind(this, "oneLink")}
                                className="relative inline-flex items-center justify-center p-0.5  mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                            >
                                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                    {props.dataLang?.PDF_PrintOnelink || "PDF_PrintOnelink"}
                                </span>
                            </button>
                            <button
                                onClick={handlePrintPdf.bind(this, "twoLink")}
                                className="relative inline-flex items-center justify-center p-0.5  mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                            >
                                <span className="relative px-8 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                    {props.dataLang?.PDF_PrintTwolink || "PDF_PrintTwolink"}
                                </span>
                            </button>
                        </div>
                    </React.Fragment>
                ))}
        </React.Fragment>
    );
};

export default FilePDF;
