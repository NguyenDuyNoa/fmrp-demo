import React, { useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment';
import { upperCase } from 'lodash';

import {VscFilePdf} from 'react-icons/vsc'
pdfMake.vfs = pdfFonts.pdfMake.vfs
// dataCompany:db header
const FilePDF = ({ props, dataCompany, data, setOpenAction }) => {
    const [url, setUrl] = useState(null)

    // uppercase text header table
    const uppercaseText = (text, style, alignment) => {
        return { text: text.toUpperCase(), style: style, alignment: alignment };
    };

    // format numberdocDefinitionPriceQuote
    const formatNumber = (number) => {
        if (!number && number !== 0) return 0;
        const integerPart = Math.floor(number)
        return integerPart.toLocaleString("en")
    }

    // Ngày hiện tại
    const currentDate = moment().format('[Ngày] DD [Tháng] MM [Năm] YYYY');

    // In hoa chữ cái đầu 
    const words = data?.total_amount_word?.split(' ');
    const capitalizedWords = words?.map(word => {
        if (word.length > 0) {
            return word?.charAt(0)?.toUpperCase() + word?.slice(1);
        }
        return word;
    });
    const capitalizedTotalAmountWord = capitalizedWords?.join(' ');
    const docDefinitionPurchases = {
        info: {
            title: `${props?.type === 'purchases' && `Yêu cầu mua hàng - ${data?.code}` 
            }`,
            author: 'Foso',
            subject: 'Quotation',
            keywords: 'PDF',
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
                        text:
                            props?.type === 'purchases' && uppercaseText('Phiếu yêu cầu mua hàng', 'contentTitle')
                    },
                    {
                        text:
                            props?.type === 'purchases' && `${moment(data?.date).format("DD/MM/YYYY HH:mm:ss")}`
                            ,
                        style: 'contentDate'
                    },
                ],
                margin: [0, 8, 0, 0]
            },
            {
                text: [
                    {
                        text:
                            props?.type === 'purchases' && 'Mã chứng từ: '
                            ,
                        inline: true,
                        fontSize: 10
                    },
                    {
                        text:
                            props?.type === 'purchases' && `${data?.code}`
                        ,
                        bold: true,
                        fontSize: 10
                    },
                ],
                margin: [0, 10, 0, 2]
            },
            {
                text: [
                    { text: props?.type === 'purchases' ? 'Người đề nghị: ':"", inline: true, fontSize: 10 },
                    { text: props?.type === 'purchases' ?`${data?.user_create_name}`:"", bold: true, fontSize: 10 },
                ],
                margin: [0, 2, 0, 2]
            },
            {
                text: [
                    { text: props?.type === 'purchases' ? 'Số kế hoạch SX: ':"", inline: true, fontSize: 10 },
                    { text: props?.type === 'purchases' ?`${data?.reference_no != null ? data?.reference_no : ""}`:"", bold: true, fontSize: 10 },
                ],
                margin: [0, 0, 0, 2]
            },

            {
                text: [
                    { text: 'Ghi chú: ', inline: true, fontSize: 10 },
                    { text: `${data?.note}`, bold: true, fontSize: 10 },
                ],
                margin: [0, 2, 0, 10]
            },
            {
                table: {
                    widths: "100%",
                    headerRows: 0,
                    // widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                    widths: props?.type== "purchases" && ['auto', '*',"auto","auto","auto","*"],
                    body: [
                        // Header row
                            props?.type== "purchases" &&  [
                                uppercaseText('STT', 'headerTable', 'center'),
                                uppercaseText('MẶT HÀNG', 'headerTable', 'left'),
                                uppercaseText('Biến thể', 'headerTable', 'center'),
                                uppercaseText('Đơn vị tính', 'headerTable', 'center'),
                                uppercaseText('Số lượng', 'headerTable', 'center'),
                                uppercaseText('Ghi chú', 'headerTable', 'center'),
                            ],
                        // Data rows
                      
                      ...data && props?.type== "purchases" && data?.items.length > 0 ? data?.items.map((item, index) => {
                            return [
                                { text: `${index + 1}`, alignment: 'center', fontSize: 10 },
                                { text: item?.item?.name ? item?.item?.name : "" , fontSize: 10 },
                                { text: item?.item?.product_variation ? `${item?.item?.product_variation}` : '', fontSize: 10 },
                                { text: item?.item?.unit_name ? `${item?.item?.unit_name}` : '', fontSize: 10 },
                                { text: item?.quantity ? `${formatNumber(item?.quantity)}` : '', alignment: 'center', fontSize: 10 },
                                { text: item?.note ? `${item?.note}` : '', fontSize: 10 },
                            ];
                        }) : '',
                        
                        props?.type == "purchases" ? [{ text: 'Tổng số mặt hàng', bold: true, colSpan: 1, fontSize: 10 }, { text: `${formatNumber(data?.total_item)}`, bold: true, alignment: 'right', colSpan: 1, fontSize: 10 }, '', '','','']:['',''],
                        props?.type == "purchases" ?  [{ text: 'Tổng số lượng', bold: true, colSpan: 4, fontSize: 10 }, '', '','',{ text: `${formatNumber(data?.total_item_quantity)}`, bold: true, alignment: 'right', colSpan: 1, fontSize: 10 },'']:['',''],
                    ],
                }
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
                margin: [0, 10, 0, 2],
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
    const docDefinitionOrder = {
        info: {
            title: `${`Đơn đặt hàng PO - ${data?.code}` 
            }`,
            author: 'Foso',
            subject: 'Quotation',
            keywords: 'PDF',
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
                        text:uppercaseText('Đơn đặt hàng (PO)', 'contentTitle')
                    },
                    {
                        text: `${moment(data?.date).format("DD/MM/YYYY HH:mm:ss")}`,
                        style: 'contentDate'
                    },
                ],
                margin: [0, 8, 0, 0]
            },
            {
                text: [
                    {
                        text: 'Mã chứng từ: ',
                        inline: true,
                        fontSize: 10
                    },
                    {
                        text: `${data?.code}`,
                        bold: true,
                        fontSize: 10
                    },
                ],
                margin: [0, 10, 0, 2]
            },
            {
                text: [
                    { text:  'Ngày chứng từ: ', inline: true, fontSize: 10},
                    { text: `${moment(data?.date).format("DD/MM/YYYY HH:mm:ss")}`, bold: true, fontSize: 10 },
                ],
                margin: [0, 2, 0, 2]
            },
            {
                text: [
                    { text:  'Ngày dự kiến giao hàng: ', inline: true, fontSize: 10 },
                    { text: `${moment(data?.delivery_date).format("DD/MM/YYYY HH:mm:ss")}`, bold: true, fontSize: 10 },
                ],
                margin: [0, 0, 0, 2]
            },

            {
                text: [
                    { text: props?.type === 'order' ? 'Số yêu cầu mua hàng: ':"", inline: true, fontSize: 10 },
                    { text: props?.type === 'order' ?`${data?.purchases?.map(e => e.code).join(", ")}`:"", bold: true, fontSize: 10 },
                ],
                margin: [0, 2, 0, 2]
            },
            {
                text: [
                    { text: props?.type === 'order' ? 'Nhà cung cấp: ':"", inline: true, fontSize: 10 },
                    { text: props?.type === 'order' ?`${data?.supplier_name}`:"", bold: true, fontSize: 10 },
                ],
                margin: [0, 2, 0, 2]
            },
            {
                text: [
                    { text: `${"Ghi chú:"} `, inline: true, fontSize: 10 },
                    { text: `${data?.note}`, bold: true, fontSize: 10 },
                ],
                margin: [0, 2, 0, 10]
            },
            {
                table: {
                    widths: "100%",
                    headerRows: 0,
                    widths:  props?.type== "order" &&  ['auto',70,27,'auto','auto',"auto",'auto',27,'auto',75],
                    body: [
                        // Header row
                            [
                                uppercaseText('STT', 'headerTable', 'center'),
                                uppercaseText('MẶT HÀNG', 'headerTable', 'left'),
                                uppercaseText('ĐVT', 'headerTable', 'center'),
                                uppercaseText('SL', 'headerTable', 'center'),
                                uppercaseText('Đơn giá', 'headerTable', 'center'),
                                uppercaseText('% CK', 'headerTable', 'center'),
                                uppercaseText('% ĐGSCK', 'headerTable', 'center'),
                                uppercaseText('% Thuế', 'headerTable', 'center'),
                                uppercaseText('Thành tiền', 'headerTable', 'center'),
                                uppercaseText('Ghi chú', 'headerTable', 'center'),
                            ] ,

                        // Data rows
                        ...data && props?.type== "order" && data?.item.length > 0 ? data?.item.map((item, index) => {
                            return [
                                { text: `${index + 1}`, alignment: 'center', fontSize: 10 },
                                {text: [
                                    {text: item?.item?.name ? item?.item?.name : "" , fontSize: 10,},
                                    {text: item?.item?.product_variation ? `(${item?.item?.product_variation})` : '', fontSize: 10 },
                                ]
                                },
                                { text: item?.item?.unit_name ? `${item?.item?.unit_name}` : '',alignment: 'center', fontSize: 10 },
                                { text: item?.quantity ? `${formatNumber(item?.quantity)}` : '', alignment: 'center', fontSize: 10 },
                                { text: item?.price ? `${formatNumber(item?.price)}` : '', alignment: 'right', fontSize: 10 },
                                { text: item?.discount_percent ? `${item?.discount_percent +'%'}` : '', alignment: 'center', fontSize: 10 },
                                { text: item?.price_after_discount ? `${formatNumber(item?.price_after_discount)}` : '', alignment: 'right', fontSize: 10 },
                                { text: item?.tax_rate ? `${item?.tax_rate +'%'}` : '', alignment: 'center', fontSize: 10 },
                                { text: item?.amount ? `${formatNumber(item?.amount)}` : '', alignment: 'right', fontSize: 10 },
                                { text: item?.note ? `${item?.note}` : '', fontSize: 10 },
                            ];
                        }) : '',
                        //   [{ text: 'Tổng tiền', bold: true, colSpan: 8, fontSize: 10 },'','','','','','','',{ text: `${formatNumber(data?.total_price)}`, bold: true, alignment: 'right', colSpan: 1, fontSize: 10 },''],
                        //   [{ text: 'Tiền chiết khấu', bold: true, colSpan: 5, fontSize: 10 }, '', '','','',{ text: `${formatNumber(data?.total_discount)}`, bold: true, alignment: 'right', colSpan: 1, fontSize: 10 },'','','',''],
                        //   [{ text: 'Tiền sau chiết khấu', bold: true, colSpan: 6, fontSize: 10 }, '', '','','','',{ text: `${formatNumber(data?.total_price_after_discount)}`, bold: true, alignment: 'right', colSpan: 1, fontSize: 10 },'','',''],
                        //   [{ text: 'Tiền thuế', bold: true, colSpan: 7, fontSize: 10 }, '', '','','','','',{ text: `${formatNumber(data?.total_tax)}`, bold: true, alignment: 'right', colSpan: 1, fontSize: 10 },'',''],
                        //   [{ text: 'Thành tiền', bold: true, colSpan: 8, fontSize: 10 }, '', '','','','','','',{ text: `${formatNumber(data?.total_amount)}`, bold: true, alignment: 'right', colSpan: 1, fontSize: 10 },''],
                          [{ text: 'Tổng tiền', bold: true, colSpan: 5, fontSize: 10 }, '', '','','',{ text: `${formatNumber(data?.total_price)}`, bold: true, alignment: 'right', colSpan: 5, fontSize: 10 },'','','',''],
                          [{ text: 'Tiền chiết khấu', bold: true, colSpan: 5, fontSize: 10 }, '', '','','',{ text: `${formatNumber(data?.total_discount)}`, bold: true, alignment: 'right', colSpan: 5, fontSize: 10 },'','','',''],
                          [{ text: 'Tiền sau chiết khấu', bold: true, colSpan: 5, fontSize: 10 }, '', '','','',{ text: `${formatNumber(data?.total_price_after_discount)}`, bold: true, alignment: 'right', colSpan: 5, fontSize: 10 },'','','',''],
                          [{ text: 'Tiền thuế', bold: true, colSpan: 5, fontSize: 10 }, '', '','','',{ text: `${formatNumber(data?.total_tax)}`, bold: true, alignment: 'right', colSpan: 5, fontSize: 10 },'','','',''],
                          [{ text: 'Thành tiền', bold: true, colSpan: 5, fontSize: 10 }, '', '','','',{ text: `${formatNumber(data?.total_amount)}`, bold: true, alignment: 'right', colSpan: 5, fontSize: 10 },'','','',''],
                    ],
                }
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
                margin: [0, 10, 0, 2],
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
        if (data !== undefined && dataCompany !== undefined && props?.type == "purchases") {
            const pdfGenerator = pdfMake.createPdf(docDefinitionPurchases);
            pdfGenerator.open((blob) => {
                const url = URL.createObjectURL(blob);
                setUrl(url)
            })
            setOpenAction(false)
        }
        if (data !== undefined && dataCompany !== undefined && props?.type == "order") {
            console.log("1");
            const pdfGenerator = pdfMake.createPdf(docDefinitionOrder);
            pdfGenerator.open((blob) => {
                const url = URL.createObjectURL(blob);
                setUrl(url)
            })
            setOpenAction(false)
        }
    }

    return (
        <>
            <button onClick={handlePrintPdf} className='transition-all ease-in-out flex items-center gap-2 group  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5  rounded py-2.5 w-full'>
                <VscFilePdf size={20} className='group-hover:text-[#65a30d] group-hover:scale-110 group-hover:shadow-md ' />
                <p className='group-hover:text-[#65a30d]'>{props?.dataLang?.btn_table_print || "btn_table_print"}</p>
            </button>
        </>
    );
}

export default FilePDF