import moment from "moment";
import { uppercaseTextHeaderTabel } from "./style";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
///css 1 liên
export const styleForm = () => {
    return {
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
    };
};

///css 2 liên
export const styleFormTow = () => {
    return {
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
    };
};

// header
export const titleHeader = (props, dataCompany) => {
    return [
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
                        ? `${props.dataLang?.PDF_adress || "PDF_adress"} : ${dataCompany?.company_address}`
                        : "",
                    style: "headerInfoText",
                },
                {
                    text: dataCompany?.company_phone_number
                        ? `${props.dataLang?.PDF_tel || "PDF_tel"}: ${dataCompany?.company_phone_number}`
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
    ];
};

// chỗ ký tên
export const titleFooter = (props, after) => {
    return {
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
                        text: `${props.dataLang?.PDF_manager || "PDF_manager"}`,
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
                width: "20%",
                stack: [
                    {
                        text: "",
                        style: "dateText",
                        alignment: "center",
                        fontSize: 10,
                    },
                    {
                        text: `${props.dataLang?.PDF_accountant || "PDF_accountant"}`,
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
                width: "20%",
                stack: [
                    {
                        text: "",
                        style: "dateText",
                        alignment: "center",
                        fontSize: 10,
                    },
                    {
                        text: `${props.dataLang?.PDF_treasurer || "PDF_treasurer"}`,
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
                width: "20%",
                stack: [
                    {
                        text: "",
                        style: "dateText",
                        alignment: "center",
                        fontSize: 10,
                    },
                    {
                        text: `${props.dataLang?.PDF_userMaker || "PDF_userMaker"}`,
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
                width: "20%",
                stack: [
                    {
                        text: "",
                        style: "dateText",
                        alignment: "center",
                        fontSize: 10,
                    },
                    {
                        text: `${props.dataLang?.PDF_receiver || "PDF_receiver"}`,
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
        pageBreak: `${after}`,
    };
};

// header title 1 liên
export const titleDateOne = (props, data, title) => {
    return [
        {
            text: uppercaseTextHeaderTabel(`${title}`, "contentTitle"),
        },
        {
            text: `${props.dataLang?.PDF_number || "PDF_number"}: ${data?.code}`,
            style: "contentCode",
        },
        {
            text: `${moment(data?.date).format("[Ngày] DD [Tháng] MM [Năm] YYYY")}`,
            style: "contentCode",
        },
    ];
};

const uppercaseText = (text, style, alignment) => {
    return { text: text.toUpperCase(), style: style, alignment: alignment };
};

// header title 2 liên
export const titleDateTwo = (props, data, title) => {

    return [
        {
            text: uppercaseText(`${title}`, "contentTitle"),
        },
        {
            columns: [
                {
                    with: "110%",
                    stack: [
                        {
                            text: `${props.dataLang?.PDF_gions || "PDF_gions"}`,
                            style: "contentCodes",
                        },
                    ],
                },
                {
                    with: "5%",
                    stack: [
                        {
                            text: `${props.dataLang?.PDF_number || "PDF_number"}: ${data?.code}`,
                            style: "contentCodeNumber",
                        },
                        {
                            text: `${moment(data?.date).format("[Ngày] DD [Tháng] MM [Năm] YYYY")}`,
                            style: "contentCodeNumber",
                        },
                    ],
                },
            ],
        },
    ];
};

///value và dữ liệu
export const titleValue = (props, data, capitalizedTotalAmountWord, dataSeting) => {
    const formatMoney = (number) => {
        return formatMoneyConfig(+number, dataSeting)
    }
    return [
        {
            text: [
                {
                    text: `${props.dataLang?.PDF_bbject || "PDF_bbject"}: `,
                    bold: true,
                    fontSize: 10,
                },
                {
                    text: `${props.dataLang[data?.objects] || data?.objects} - ${data?.object_text}`,
                    inline: true,
                    fontSize: 10,
                },
            ],
            margin: [0, 10, 0, 4],
        },
        {
            text: [
                {
                    text: `${props.dataLang?.PDF_document || "PDF_document"}: `,
                    bold: true,
                    fontSize: 10,
                },
                {
                    text: data?.type_vouchers
                        ? `${props.dataLang[data?.type_vouchers] || data?.type_vouchers} - ${data?.voucher
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
                    text: `${props.dataLang?.PDF_methods || "PDF_methods"}: `,
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
                    text: `${props.dataLang?.PDF_amountMoney || "PDF_amountMoney"}: `,
                    bold: true,
                    fontSize: 10,
                },
                {
                    text: `${formatMoney(data?.total)}`,
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
    ];
};

// Đường kẻ
export const lineHeght = () => {
    return [
        {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 1,
            color: "#e2e8f0",
        },
    ];
};
