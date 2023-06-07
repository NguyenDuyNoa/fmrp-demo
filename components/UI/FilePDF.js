import React, { useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment';
pdfMake.vfs = pdfFonts.pdfMake.vfs

const FilePDF = ({ props, dataCompany, dataPriceQuote, setOpenAction }) => {
    const [url, setUrl] = useState(null)

    const uppercaseText = (text, alignment) => {
        return { text: text.toUpperCase(), style: 'headerTable', alignment: alignment };
    };

    const formatNumber = (number) => {
        if (!number && number !== 0) return 0;
        const integerPart = Math.floor(number)
        return integerPart.toLocaleString("en")
    }

    // Ngày hiện tại
    const currentDate = moment().format('[Ngày] DD [Tháng] MM [Năm] YYYY');

    // In hoa chữ cái đầu 
    const words = dataPriceQuote?.total_amount_word?.split(' ');
    const capitalizedWords = words?.map(word => {
        if (word.length > 0) {
            return word?.charAt(0)?.toUpperCase() + word?.slice(1);
        }
        return word;
    });
    const capitalizedTotalAmountWord = capitalizedWords?.join(' ');

    const docDefinition = {
        info: {
            title: `Báo Giá - ${dataPriceQuote?.reference_no}`,
            author: 'Foso',
            subject: 'Quotation',
            keywords: 'BBG',
        },
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
            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1, color: '#e2e8f0' }] },
            {
                stack: [
                    {
                        text: props?.type === 'price_quote' ? 'BẢNG BÁO GIÁ' : '', style: 'contentTitle'
                    },
                    { text: props?.type === 'price_quote' ? `${moment(dataPriceQuote?.date).format("DD/MM/YYYY HH:mm:ss")}` : '', style: 'contentDate' },
                ],
            },
            {
                text: [
                    { text: 'Số báo giá: ', inline: true, fontSize: 10 },
                    { text: `${dataPriceQuote?.reference_no}`, bold: true, fontSize: 10 },
                ],
                margin: [0, 10, 0, 2]
            },
            {
                text: [
                    { text: 'Khách hàng: ', inline: true, fontSize: 10 },
                    { text: `${dataPriceQuote?.client_name}`, bold: true, fontSize: 10 },
                ],
                margin: [0, 2, 0, 2]
            },
            {
                text: [
                    { text: 'Địa chỉ giao hàng: ', inline: true, fontSize: 10 },
                    { text: '', bold: true, fontSize: 10 },
                ],
                margin: [0, 2, 0, 2]
            },
            {
                text: [
                    { text: 'Ghi chú: ', inline: true, fontSize: 10 },
                    { text: `${dataPriceQuote?.note}`, bold: true, fontSize: 10 },
                ],
                margin: [0, 2, 0, 10]
            },
            {
                table: {
                    widths: "100%",
                    headerRows: 1,
                    widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                    body: [
                        // Header row
                        [
                            uppercaseText('STT', 'center'),
                            uppercaseText('MẶT HÀNG', 'left'),
                            uppercaseText('ĐVT', 'center'),
                            uppercaseText('SL', 'center'),
                            uppercaseText('Đơn giá', 'center'),
                            uppercaseText('% CK', 'center'),
                            uppercaseText('ĐG sau CK', 'center'),
                            uppercaseText('Tổng cộng', 'center'),
                            uppercaseText('Ghi chú', 'center')

                        ],
                        // Data rows
                        ...dataPriceQuote && dataPriceQuote?.items.length > 0 ? dataPriceQuote?.items.map((item, index) => {
                            return [
                                { text: `${index + 1}`, alignment: 'center', fontSize: 10 },
                                { text: item?.item?.name && item?.item?.code ? `${item?.item?.name} (${item?.item?.code})` : '', fontSize: 10 },
                                { text: item?.item?.unit_name ? `${item?.item?.unit_name}` : '', fontSize: 10 },
                                { text: item?.quantity ? `${formatNumber(item?.quantity)}` : '', alignment: 'center', fontSize: 10 },
                                { text: item?.price ? `${formatNumber(item?.price)}` : '', alignment: 'right', fontSize: 10 },
                                { text: item?.discount_percent ? `${item?.discount_percent}` : '', alignment: 'center', fontSize: 10 },
                                { text: item?.price_after_discount ? `${formatNumber(item?.price_after_discount)}` : '', alignment: 'right', fontSize: 10 },
                                { text: item?.price_after_discount ? `${formatNumber(item?.price_after_discount * item?.quantity)}` : '', alignment: 'right', fontSize: 10 },
                                { text: item?.note ? `${item?.note}` : '', fontSize: 10 },
                            ];
                        }) : '',
                        [{ text: 'Tổng cộng', bold: true, colSpan: 2, fontSize: 10 }, '', { text: `${formatNumber(dataPriceQuote?.total_price_after_discount)}`, bold: true, alignment: 'right', colSpan: 7, fontSize: 10 }, '', '', '', '', '', ''],
                        [{ text: 'Tiền thuế', bold: true, colSpan: 2, fontSize: 10 }, '', { text: `${formatNumber(dataPriceQuote?.total_tax_price)}`, bold: true, alignment: 'right', colSpan: 7, fontSize: 10 }, '', '', '', '', '', ''],
                        [{ text: 'Thành tiền', bold: true, colSpan: 2, fontSize: 10 }, '', { text: `${formatNumber(dataPriceQuote?.total_amount)}`, bold: true, alignment: 'right', colSpan: 7, fontSize: 10 }, '', '', '', '', '', ''],
                    ]
                }
            },
            {
                text: [
                    { text: 'Thành tiền bằng chữ: ', inline: true, fontSize: 10, },
                    { text: capitalizedTotalAmountWord, fontSize: 10, bold: true },
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
                                text: currentDate,
                                style: 'dateText',
                                alignment: 'center',
                                fontSize: 10
                            },
                            {
                                text: 'Người Lập Phiếu',
                                style: 'signatureText',
                                alignment: 'center',
                                fontSize: 10
                            },
                            {
                                text: '(Ký, ghi rõ họ tên)',
                                style: 'signatureText',
                                alignment: 'center',
                                fontSize: 10
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
                margin: [2, 0, 0, 0]
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
                fontSize: 10,
                // alignment: 'center',
            },
            dateText: {
                fontSize: 12,
                bold: true,
                margin: [0, 10, 0, 2]
            },
            signatureText: {
                fontSize: 12,
                margin: [0, 0, 0, 2]
            }
        },
        dontBreakRows: true,
        images: {
            logo: {
                url: `${dataCompany?.company_logo}`
            }
        },
    };

    const handlePrintPdf = () => {
        if (dataPriceQuote !== undefined && dataCompany !== undefined) {
            const pdfGenerator = pdfMake.createPdf(docDefinition);
            pdfGenerator.open((blob) => {
                const url = URL.createObjectURL(blob);
                setUrl(url)
            })




            setOpenAction(false)
        }
    }
    console.log('check : ', dataPriceQuote)
    return (
        <>
            <button onClick={handlePrintPdf} className='2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full'>
                {props?.dataLang?.btn_table_print || "btn_table_print"}
            </button>
        </>
    );
}

export default FilePDF