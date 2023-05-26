import React, { useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs

const FilePDF = ({ props }) => {
    const [url, setUrl] = useState(null)
    var fs = require('fs');

    // function to encode file data to base64 encoded string
    const insertImageFromBase64 = (base64Image) => {
        const imageContent = base64Image.replace('data:image/jpeg;base64,', '');
        const imageData = Buffer.from(imageContent, 'base64');
        return { image: imageData, fit: [150, 150], style: 'headerLogo' };
    };

    const docDefinition = {

        content: [
            {
                columns: [
                    {
                        width: '30%',
                        stack: [
                            { text: 'Công Ty TNHH FOSO', style: 'headerInfo' },
                        ]
                    },
                    {
                        width: '70%',
                        stack: [
                            { text: 'CÔNG TY TNHH FOSO', style: 'headerInfo' },
                            { text: 'Địa chỉ : 69/1/3 Nguyễn Gia Trí, Phường 25, Quận Bình Thạnh, TP.HCM', style: 'headerInfoText' },
                            { text: 'Điện thoại : 0796479974', style: 'headerInfoText' },
                            {
                                columns: [
                                    { text: 'Email : fososoft@gmail.com', style: 'headerInfoText', alignment: 'right', margin: [-10, 0] },
                                    { text: 'Website : fososoft.com', style: 'headerInfoText', alignment: 'right' },
                                ],
                                alignment: 'right',
                            },
                        ]
                    },
                ],
                columnGap: 10
            },
        ],

        styles: {
            headerLogo: {
                alignment: 'left',
            },
            headerInfo: {
                alignment: 'right',
                fontSize: 12,
                bold: true,
                color: 'red',
                margin: [0, 3],
            },
            headerInfoText: {
                alignment: 'right',
                fontSize: 8,
                italics: true,
                color: 'black',
                margin: [0, 2]
            },
            header: {
                fontSize: 22,
                bold: true,
            },
            anotherStyle: {
                italics: true,
                alignment: 'right',
            },
        },
    };
    const handlePrintPdf = () => {
        const pdfGenerator = pdfMake.createPdf(docDefinition);
        console.log('check ', pdfGenerator)
        pdfGenerator.open((blob) => {
            const url = URL.createObjectURL(blob);
            setUrl(url)
        })
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