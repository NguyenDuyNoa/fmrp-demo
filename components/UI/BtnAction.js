import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import Popup from 'reactjs-popup';
import { ArrowDown2 } from "iconsax-react";
import Swal from "sweetalert2";
import { _ServerInstance as Axios } from '/services/axios';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import FilePDF from "./FilePDF";
pdfMake.vfs = pdfFonts.pdfMake.vfs

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
})

const BtnAction = React.memo((props) => {
    const router = useRouter()
    const handleDelete = (id) => {
        if (props?.status !== 'ordered') {
            Swal.fire({
                title: `${props.dataLang?.aler_ask} `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#296dc1',
                cancelButtonColor: '#d33',
                confirmButtonText: `${props.dataLang?.aler_yes} `,
                cancelButtonText: `${props.dataLang?.aler_cancel} `
            }).then((result) => {
                if (result.isConfirmed) {
                    Axios("DELETE", `/api_web/Api_quotation/quotation/${id}?csrf_protection=true`, {
                    }, (err, response) => {
                        if (response && response.data) {
                            var { isSuccess, message } = response.data;
                            if (isSuccess) {
                                Toast.fire({
                                    icon: 'success',
                                    title: props.dataLang[message]
                                })
                                props.onRefresh && props.onRefresh()
                            } else {
                                Toast.fire({
                                    icon: 'error',
                                    title: props.dataLang[message]
                                })
                            }
                        } else {
                            Toast.fire({
                                icon: 'error',
                                title: `${props?.dataLang?.aler_delete_fail || 'aler_delete_fail'}`
                            })
                        }
                    })
                }
            })
        }
        if (props?.status === 'ordered') {
            Toast.fire({
                icon: 'error',
                title: `${props?.dataLang?.po_imported_cant_delete || 'po_imported_cant_delete'} `
            })
        }
    }
    const handleClick = () => {
        if (props?.status === "ordered") {
            Toast.fire({
                icon: 'error',
                title: `${props?.dataLang?.po_imported_cant_edit || 'po_imported_cant_edit'} `
            })
        }
        else {
            router.push(`/sales_export_product/priceQuote/form?id=${props.id}`);
        }
    };

    return (
        <div>
            <Popup
                trigger={
                    <button className={`flex space-x-1 items-center ` + props.className} >
                        <span>
                            {props.dataLang?.price_quote_action || "price_quote_action"}
                        </span>
                        <ArrowDown2 size={12} />
                    </button>
                }
                arrow={false}
                position="bottom right"
                className={`dropdown-edit`}
                keepTooltipInside={props.keepTooltipInside}
                closeOnDocumentClick
                nested
            >
                <div className="w-auto rounded">
                    <div className="bg-white rounded-t flex flex-col overflow-hidden">
                        <button
                            onClick={handleClick}
                            className="2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full">
                            {props?.dataLang?.btn_table_edit || "btn_table_edit"}
                        </button>
                        <button onClick={() => handleDelete(props?.id)} className='2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full'>
                            {props?.dataLang?.btn_table_delete || "btn_table_delete"}
                        </button>
                        <FilePDF props={props} />
                    </div>
                </div>
            </Popup>
        </div>
    )
})

export default BtnAction