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

    const [openAction, setOpenAction] = useState(false);
    const [dataCompany, setDataCompany] = useState();
    const [dataPriceQuote, setDataPriceQuote] = useState();
    const _ToggleModal = (e) => {
        console.log('check',e)
        setOpenAction(e)

    }
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

    const fetchDataSettingsCompany = async () => {
        console.log('ok2')
        if (props?.id && props?.type === 'price_quote') {
            try {
                await Axios("GET", `/api_web/Api_Setting/CompanyInfo?csrf_protection=true`, {}, (err, response) => {
                    if (response && response.data) {
                        let res = response.data.data
                        setDataCompany(res)
                    }
                })
                await Axios("GET", `/api_web/Api_quotation/quotation/${props?.id}?csrf_protection=true`, {}, (err, response) => {
                    console.log('response', response)
                    if (response && response.data) {
                        let db = response.data
                        setDataPriceQuote(db)
                    }
                })
            } catch (err) {
                console.log(err);
            }
        }
    }

    useEffect(() => {
        openAction && fetchDataSettingsCompany()
    }, [openAction])

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
                open={openAction}
                onOpen={_ToggleModal.bind(this, true)}
                onClose={_ToggleModal.bind(this, false)}
            >
                <div className="w-auto rounded">
                    <div className="bg-white rounded-t flex flex-col overflow-hidden">
                        <button
                            onClick={handleClick}
                            className="2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full">
                            {props?.dataLang?.btn_table_edit || "btn_table_edit"}
                        </button>
                        <FilePDF
                            props={props}
                            openAction={openAction}
                            setOpenAction={setOpenAction}
                            dataCompany={dataCompany}
                            dataPriceQuote={dataPriceQuote}
                        />
                        <button onClick={() => handleDelete(props?.id)} className='2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full'>
                            {props?.dataLang?.btn_table_delete || "btn_table_delete"}
                        </button>
                    </div>
                </div>
            </Popup>
        </div>
    )
})

export default BtnAction