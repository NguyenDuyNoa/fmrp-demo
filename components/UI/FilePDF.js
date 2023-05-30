import React, { useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs

const FilePDF = ({ props, dataCompany, dataPriceQuote, openAction }) => {
    console.log(props)
    console.log("dataCompany: ", dataCompany)
    console.log("dataPriceQuote: ", dataPriceQuote)
    const [url, setUrl] = useState(null)

    const uppercaseText = (text) => {
        return { text: text.toUpperCase(), style: 'headerTable' };
    };

    const docDefinition = {
        pageOrientation: 'portrait',
        content: [
            {
                columns: [
                    {
                        width: '30%',
                        stack: [
                            {
                                image: "logo",
                                width: 100,
                                height: 100,
                                alignment: "left",
                                margin: [0, -15, 0, 5],
                                fit: [100, 100]
                            },
                        ]
                    },
                    {
                        width: '70%',
                        stack: [
                            {
                                text: `${dataCompany?.company_name}`,
                                style: 'headerInfo'
                            },
                            {
                                text: dataCompany?.company_address ? `Địa chỉ : ${dataCompany?.company_address}` : '',
                                style: 'headerInfoText'
                            },
                            {
                                text: dataCompany?.company_phone_number ? `Số điện thoại: ${dataCompany?.company_phone_number}` : '',
                                style: 'headerInfoText'
                            },
                            {
                                text: [
                                    {
                                        text: dataCompany?.company_email ? `Email: ${dataCompany?.company_email}` : '',
                                        style: 'headerInfoText'
                                    },
                                    '    ',
                                    {
                                        text: dataCompany?.company_website ? `Website: ${dataCompany?.company_website}` : '',
                                        style: 'headerInfoText'
                                    },
                                ],
                                margin: [0, -4, 0, 0]

                            }
                        ],
                        margin: [0, -20, 0, 5]
                    },
                ],
                columnGap: 10
            },
            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1, color: '#AAAAAA' }] },
            // {
            //     canvas: [
            //       { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }
            //     ],
            //     margin: [0, 10, 0, 0]
            //   },
            {
                stack: [
                    { text: props?.type === 'price_quote' ? 'BẢNG BÁO GIÁ' : '', style: 'contentTitle' },
                    { text: props?.type === 'price_quote' ? `${dataPriceQuote?.date}` : '', style: 'contentDate' },
                ],
            },
            {
                text: [
                    { text: 'Số báo giá: ', inline: true, fontSize: 10 },
                    { text: `${dataPriceQuote?.reference_no}`, bold: true, fontSize: 12 },
                ],
                margin: [0, 10, 0, 2]
            },
            {
                text: [
                    { text: 'Khách hàng: ', inline: true, fontSize: 10 },
                    { text: `${dataPriceQuote?.client_name}`, bold: true, fontSize: 12 },
                ],
                margin: [0, 2, 0, 2]
            },
            {
                text: [
                    { text: 'Địa chỉ giao hàng: ', inline: true, fontSize: 10 },
                    { text: 'Chưa có', bold: true, fontSize: 12 },
                ],
                margin: [0, 2, 0, 2]
            },
            {
                text: [
                    { text: 'Ghi chú: ', inline: true, fontSize: 10 },
                    { text: `${dataPriceQuote?.note}`, bold: true, fontSize: 12 },
                ],
                margin: [0, 2, 0, 14]
            },
            {
                table: {
                    widths: "100%",
                    headerRows: 1,
                    widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*'],
                    body: [
                        // Header row
                        [
                            uppercaseText('STT'),
                            uppercaseText('Mã hàng'),
                            uppercaseText('Tên hàng'),
                            uppercaseText('ĐVT'),
                            uppercaseText('Số lượng'),
                            uppercaseText('Đơn giá'),
                            uppercaseText('Thành tiền'),
                            uppercaseText('Ghi chú'),
                        ],
                        // [
                        //     { text: `1`, alignment: 'center' },
                        //     { text: 'Sản phẩm A Sản phẩm A sản phẩm A', noWrap: false },
                        //     { text: 'Sản phẩm A Sản phẩm A, Sản phẩm A' },
                        //     { text: 'Cái' },
                        //     { text: '10', alignment: 'center' },
                        //     { text: '10.00', alignment: 'center' },
                        //     { text: '100.00', alignment: 'right' },
                        //     { text: 'Ghi chú' },
                        // ],

                        // Data rows
                        ...dataPriceQuote?.items.map((item, index) => {
                            return [
                                { text: `${index + 1}`, alignment: 'center' },
                                { text: item?.item?.code ? `${item?.item?.code}` : '', noWrap: false },
                                { text: item?.item?.name ? `${item?.item?.name}` : '' },
                                { text: item?.item?.unit_name ? `${item?.item?.unit_name}` : '' },
                                { text: item?.quantity ? `${item?.quantity}` : '', alignment: 'center' },
                                { text: item?.price ? `${item?.price}` : '', alignment: 'center' },
                                { text: item?.amount ? `${item?.amount}` : '', alignment: 'right' },
                                { text: item?.note ? `${item?.note}` : '' },
                            ];
                        }),
                        // tableRows,
                        [{ text: 'Tổng', bold: true, colSpan: 4 }, '', '', '', { text: '17', bold: true, alignment: 'center' }, '', { text: `${dataPriceQuote?.total_amount}`, bold: true, alignment: 'right' }, ''],
                        [{ text: 'Tiền thuế', bold: true, colSpan: 4 }, '', '', '', { text: `${dataPriceQuote?.total_tax_price}`, bold: true, alignment: 'right', colSpan: 4 }, '', '', ''],
                        [{ text: 'Thành tiền', bold: true, colSpan: 4 }, '', '', '', { text: `${dataPriceQuote?.total_amount}`, bold: true, alignment: 'right', colSpan: 4 }, '', '', ''],
                    ]
                }
            },
            {
                text: [
                    { text: 'Thành tiền bằng chữ: ', inline: true, fontSize: 11, },
                    { text: 'Không', fontSize: 12 },
                ],
                margin: [0, 5, 0, 0]
            },
            {
                columns: [
                    {
                        text: '',
                        width: '50%',
                    },
                    {
                        width: '50%',
                        stack: [
                            {
                                text: 'Ngày 28 tháng 05 năm 2023',
                                style: 'dateText',
                                alignment: 'center',
                            },
                            {
                                text: 'Người Lập Phiếu',
                                style: 'signatureText',
                                alignment: 'center'
                            },
                            {
                                text: '(Ký, ghi rõ họ tên)',
                                style: 'signatureText',
                                alignment: 'center'
                            }
                        ],
                    },
                ],
                columnGap: 2
            },


        ],
        styles: {
            headerInfoTextWithMargin: {
                fontSize: 12,
                bold: true,
                margin: [2, 0, 0, 0] // Đặt giá trị margin top thành 5
            },
            headerLogo: {
                alignment: 'left',
            },
            headerInfo: {
                alignment: 'right',
                fontSize: 12,
                bold: true,
                color: '#0F4F9E',
                margin: [0, 1],
            },
            headerInfoText: {
                alignment: 'right',
                fontSize: 8,
                italics: true,
                color: 'black',
                margin: [0, 2],
            },
            contentTitle: {
                bold: true,
                fontSize: 20,
                alignment: 'center',
                margin: [0, 10, 0, 2]
            },
            contentDate: {
                italics: true,
                fontSize: 8,
                alignment: 'center'
            },
            headerTable: {
                noWrap: true,
                bold: true,
                fillColor: '#0374D5',
                color: 'white',
            },
            dateText: {
                fontSize: 12,
                bold: true,
                margin: [0, 10, 0, 2] // Đặt margin bottom để tạo khoảng cách giữa các đoạn văn bản
            },
            signatureText: {
                fontSize: 12,
                margin: [0, 0, 0, 2] // Đặt margin bottom để tạo khoảng cách giữa các đoạn văn bản
            }
        },
        dontBreakRows: true,
        // pageSize: { height: isStandard ? 432 : 288, width: 288 },
        images: {
            logo: {
                url: `${dataCompany?.company_logo}`
                // url: `https://demo.fososoft.com/FMRP/uploads/company/fmrpclient_fosocompany/logo-dark-1.png`
            }
        }
    };

    const handlePrintPdf = () => {
        console.log('print')
        if (dataPriceQuote !== undefined && dataCompany !== undefined) {
            const pdfGenerator = pdfMake.createPdf(docDefinition);
            pdfGenerator.open((blob) => {
                const url = URL.createObjectURL(blob);
                setUrl(url)
            })
        }
    }

    return (
        <>
            <button onClick={handlePrintPdf} className='2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full'>
                {props?.dataLang?.btn_table_print || "btn_table_print"}
            </button>
        </>
    );
}

export default FilePDF