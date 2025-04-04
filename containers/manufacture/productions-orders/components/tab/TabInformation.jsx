import React, { useCallback, useMemo, useState } from 'react'
import ProductionSteps from '../ui/ProductionStep'
import { useItemOrderDetail } from '@/managers/api/productions-order/useItemOrderDetail'
import { useSheet } from '@/context/ui/SheetContext'
import { useRouter } from 'next/router'
import { useIsFetching, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
// import ProductionSteps2 from '../ui/ProductionStep2'
import useSetingServer from '@/hooks/useConfigNumber'

import formatNumberConfig from "@/utils/helpers/formatnumber";
import ProgressCircle from '../ui/ProgressCircle'
import LimitListDropdown from '@/components/common/dropdown/LimitListDropdown'
import NoData from '@/components/UI/noData/nodata'
import Loading from '@/components/UI/loading/loading'
import ModalImage from 'react-modal-image'


const dataFakeItem = [
    {
        "id": "211",
        "item_code": "KhungXe",
        "item_name": "Khung Xe winner X",
        "quota_primary": "10",
        "reference_no_detail": "LSXCT-27032550",
        "unit_name": "Cái",
        "quantity_keep": "0",
        "product_variation": "(NONE)",
        "stages": [
            {
                "id": "244",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "17",
                "number": "1",
                "final_stage": "0",
                "type": "2",
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "Cắt",
                "stage_name": "Cắt",
                "purchase_items": null
            },
            {
                "id": "245",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "18",
                "number": "2",
                "final_stage": "0",
                "type": 3,
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "Hàn thép",
                "stage_name": "Hàn thép",
                "purchase_items": null
            },
            {
                "id": "246",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "10",
                "number": "3",
                "final_stage": "1",
                "type": 3,
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "HOANTHANH",
                "stage_name": "Hoàn Thành",
                "purchase_items": null
            }
        ],
        "quantity_need_manufactures": 10,
        "count_stage_active": 0,
        "count_stage": 3,
        "stage_name_active": "",
        "quantity_stage": 0
    },
    {
        "id": "32",
        "item_code": "KhungXe",
        "item_name": "Khung Xe winner X",
        "quota_primary": "10",
        "reference_no_detail": "LSXCT-27032550",
        "unit_name": "Cái",
        "quantity_keep": "0",
        "product_variation": "(NONE)",
        "stages": [
            {
                "id": "244",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "17",
                "number": "1",
                "final_stage": "0",
                "type": "2",
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "Cắt",
                "stage_name": "Cắt",
                "purchase_items": null
            },
            {
                "id": "245",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "18",
                "number": "2",
                "final_stage": "0",
                "type": 3,
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "Hàn thép",
                "stage_name": "Hàn thép",
                "purchase_items": null
            },
            {
                "id": "246",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "10",
                "number": "3",
                "final_stage": "1",
                "type": 3,
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "HOANTHANH",
                "stage_name": "Hoàn Thành",
                "purchase_items": null
            }
        ],
        "quantity_need_manufactures": 10,
        "count_stage_active": 0,
        "count_stage": 3,
        "stage_name_active": "",
        "quantity_stage": 0
    },
    {
        "id": "33333",
        "item_code": "KhungXe",
        "item_name": "Khung Xe winner X",
        "quota_primary": "10",
        "reference_no_detail": "LSXCT-27032550",
        "unit_name": "Cái",
        "quantity_keep": "0",
        "product_variation": "(NONE)",
        "stages": [
            {
                "id": "244",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "17",
                "number": "1",
                "final_stage": "0",
                "type": "2",
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "Cắt",
                "stage_name": "Cắt",
                "purchase_items": null
            },
            {
                "id": "245",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "18",
                "number": "2",
                "final_stage": "0",
                "type": 3,
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "Hàn thép",
                "stage_name": "Hàn thép",
                "purchase_items": null
            },
            {
                "id": "246",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "10",
                "number": "3",
                "final_stage": "1",
                "type": 3,
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "HOANTHANH",
                "stage_name": "Hoàn Thành",
                "purchase_items": null
            }
        ],
        "quantity_need_manufactures": 10,
        "count_stage_active": 0,
        "count_stage": 3,
        "stage_name_active": "",
        "quantity_stage": 0
    },
    {
        "id": "3434343",
        "item_code": "KhungXe",
        "item_name": "Khung Xe winner X",
        "quota_primary": "10",
        "reference_no_detail": "LSXCT-27032550",
        "unit_name": "Cái",
        "quantity_keep": "0",
        "product_variation": "(NONE)",
        "stages": [
            {
                "id": "244",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "17",
                "number": "1",
                "final_stage": "0",
                "type": "2",
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "Cắt",
                "stage_name": "Cắt",
                "purchase_items": null
            },
            {
                "id": "245",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "18",
                "number": "2",
                "final_stage": "0",
                "type": 3,
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "Hàn thép",
                "stage_name": "Hàn thép",
                "purchase_items": null
            },
            {
                "id": "246",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "10",
                "number": "3",
                "final_stage": "1",
                "type": 3,
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "HOANTHANH",
                "stage_name": "Hoàn Thành",
                "purchase_items": null
            }
        ],
        "quantity_need_manufactures": 10,
        "count_stage_active": 0,
        "count_stage": 3,
        "stage_name_active": "",
        "quantity_stage": 0
    },
    {
        "id": "23232323",
        "item_code": "KhungXe",
        "item_name": "Khung Xe winner X",
        "quota_primary": "10",
        "reference_no_detail": "LSXCT-27032550",
        "unit_name": "Cái",
        "quantity_keep": "0",
        "product_variation": "(NONE)",
        "stages": [
            {
                "id": "244",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "17",
                "number": "1",
                "final_stage": "0",
                "type": "2",
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "Cắt",
                "stage_name": "Cắt",
                "purchase_items": null
            },
            {
                "id": "245",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "18",
                "number": "2",
                "final_stage": "0",
                "type": 3,
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "Hàn thép",
                "stage_name": "Hàn thép",
                "purchase_items": null
            },
            {
                "id": "246",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "10",
                "number": "3",
                "final_stage": "1",
                "type": 3,
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "HOANTHANH",
                "stage_name": "Hoàn Thành",
                "purchase_items": null
            }
        ],
        "quantity_need_manufactures": 10,
        "count_stage_active": 0,
        "count_stage": 3,
        "stage_name_active": "",
        "quantity_stage": 0
    },
    {
        "id": "4242424",
        "item_code": "KhungXe",
        "item_name": "Khung Xe winner X",
        "quota_primary": "10",
        "reference_no_detail": "LSXCT-27032550",
        "unit_name": "Cái",
        "quantity_keep": "0",
        "product_variation": "(NONE)",
        "stages": [
            {
                "id": "244",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "17",
                "number": "1",
                "final_stage": "0",
                "type": "2",
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "Cắt",
                "stage_name": "Cắt",
                "purchase_items": null
            },
            {
                "id": "245",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "18",
                "number": "2",
                "final_stage": "0",
                "type": 3,
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "Hàn thép",
                "stage_name": "Hàn thép",
                "purchase_items": null
            },
            {
                "id": "246",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "10",
                "number": "3",
                "final_stage": "1",
                "type": 3,
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "HOANTHANH",
                "stage_name": "Hoàn Thành",
                "purchase_items": null
            }
        ],
        "quantity_need_manufactures": 10,
        "count_stage_active": 0,
        "count_stage": 3,
        "stage_name_active": "",
        "quantity_stage": 0
    },
    {
        "id": "5454545",
        "item_code": "KhungXe",
        "item_name": "Khung Xe winner X",
        "quota_primary": "10",
        "reference_no_detail": "LSXCT-27032550",
        "unit_name": "Cái",
        "quantity_keep": "0",
        "product_variation": "(NONE)",
        "stages": [
            {
                "id": "244",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "17",
                "number": "1",
                "final_stage": "0",
                "type": "2",
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "Cắt",
                "stage_name": "Cắt",
                "purchase_items": null
            },
            {
                "id": "245",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "18",
                "number": "2",
                "final_stage": "0",
                "type": 3,
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "Hàn thép",
                "stage_name": "Hàn thép",
                "purchase_items": null
            },
            {
                "id": "246",
                "po_id": "39",
                "poi_id": "50",
                "stage_id": "10",
                "number": "3",
                "final_stage": "1",
                "type": 3,
                "bom_id": "211",
                "begin_production": "0",
                "date_production": null,
                "staff_production": "0",
                "staff_active": "0",
                "active": "0",
                "date_active": null,
                "stage_code": "HOANTHANH",
                "stage_name": "Hoàn Thành",
                "purchase_items": null
            }
        ],
        "quantity_need_manufactures": 10,
        "count_stage_active": 0,
        "count_stage": 3,
        "stage_name_active": "",
        "quantity_stage": 0
    },
]

const TabInformation = () => {
    const router = useRouter()
    const { isOpen: isOpenSheet, ...props } = useSheet()
    const poiId = useMemo(() => router.query.poi_id, [router.query])

    const [limit, setLimit] = useState(5);

    const queryClient = useQueryClient()

    const dataItemOrderDetail = queryClient?.getQueryData(["apiItemOrdersDetail", poiId])
    const isFetchingItemOrderDetail = useIsFetching({ queryKey: ['apiItemOrdersDetail', poiId] }) > 0;

    const dataSeting = useSetingServer();
    const formatNumber = useCallback((num) => formatNumberConfig(+num, dataSeting), [dataSeting]);

    const stages = ['Cắt vải', 'May', 'Vắt sổ']

    console.log('props', props);


    return (
        <div className='flex items-start gap-4'>
            <div className='flex flex-col gap-4 3xl:w-[25%] xxl:w-[30%] w-[28%]'>
                <h4 className="text-[#344054] font-normal flex items-center py-2 3xl:px-4 px-2 gap-2">
                    <div className='flex items-start gap-2'>
                        <div className="3xl:size-16 xxl:size-12 size-10 shrink-0">
                            <Image
                                alt={dataItemOrderDetail?.poi?.item_name ?? "img"}
                                width={200}
                                height={200}
                                src={dataItemOrderDetail?.poi?.images ?? "/icon/default/default.png"}
                                className="size-full object-cover rounded-md"
                            />
                        </div>

                        <div className="flex flex-col 3xl:gap-1.5 gap-1 w-full">
                            <p className="text-[#141522] font-semibold text-sm-default">
                                {dataItemOrderDetail?.poi?.item_name}
                            </p>

                            <div className='grid grid-cols-3 gap-2'>
                                <p className="col-span-1 text-[#667085] font-normal xl:text-xs text-[10px]">
                                    Số lượng
                                </p>

                                <p className="col-span-2 text-[#667085] font-normal xl:text-xs text-[10px]">
                                    {dataItemOrderDetail?.poi?.product_variation}
                                </p>
                            </div>

                            <div className='grid grid-cols-3 items-center gap-2'>
                                <p className="col-span-1 font-medium flex items-center">
                                    <span className='text-sm-default text-[#EE1E1E]'>
                                        {dataItemOrderDetail?.poi?.quantity}
                                    </span>
                                    <span className='text-[10px] text-[#141522]'>
                                        /{dataItemOrderDetail?.poi?.unit_name}
                                    </span>
                                </p>

                                <p className="col-span-2 text-[#3276FA] font-normal xl:text-xs text-[10px]">
                                    {dataItemOrderDetail?.poi?.item_code}
                                </p>
                            </div>
                        </div>
                    </div>
                </h4>

                <ProductionSteps stages={dataItemOrderDetail?.poi?.stages} />

                {/* <ProductionSteps2 /> */}
            </div>

            <div className='3xl:w-[75%] xxl:w-[70%] w-[72%]'>
                <div
                    className="col-span-12 grid grid-cols-16 mt-2"
                >
                    {/* header */}
                    <div className="col-span-16 grid grid-cols-16 gap-2 py-3 border-b">
                        <h4 className="text-xs-default text-center text-[#9295A4] font-semibold col-span-1">
                            STT
                        </h4>
                        <h4 className="text-xs-default text-start text-[#9295A4] font-semibold col-span-4">
                            Bán thành phẩm
                        </h4>
                        <h4 className="text-xs-default text-start text-[#9295A4] font-semibold xxl:col-span-2 col-span-1">
                            ĐVT
                        </h4>
                        <h4 className="text-xs-default text-center text-[#9295A4] font-semibold xxl:col-span-1 col-span-2">
                            SL cần
                        </h4>
                        <h4 className="text-xs-default text-center text-[#9295A4] font-semibold block col-span-2">
                            SL giữ kho
                        </h4>
                        <h4 className="text-xs-default text-center text-[#9295A4] font-semibold block col-span-2">
                            SL sản xuất
                        </h4>
                        <h4 className="text-xs-default text-center text-[#9295A4] font-semibold block col-span-4">
                            Tiến trình
                        </h4>
                    </div>

                    {/* body */}
                    <div className='col-span-16 grid grid-cols-16 min-h-[240px]'>
                        {
                            isFetchingItemOrderDetail
                                ?
                                <Loading className='3xl:h-full 2xl:h-full xl:h-full h-full col-span-16' />
                                :
                                (
                                    dataItemOrderDetail && dataItemOrderDetail?.items_semi?.length > 0 ?
                                        (
                                            dataItemOrderDetail?.items_semi?.slice(0, limit)?.map((product, index) => (
                                                <div
                                                    key={`product-${index}`}
                                                    // onClick={() => handleShowModel(product)}
                                                    className={`col-span-16 grid grid-cols-16 gap-2 items-start group hover:bg-gray-100 cursor-pointer transition-all duration-150 ease-in-out 3xl:py-4 py-2`}
                                                >
                                                    <h4 className="col-span-1 flex items-center justify-center size-full text-center text-[#141522] font-semibold text-sm-default uppercase">
                                                        {index + 1 ?? "-"}
                                                    </h4>

                                                    <h4 className="col-span-4 flex items-center size-full text-[#344054] font-normal gap-2">
                                                        <ModalImage
                                                            small={product?.images && product?.images !== "" ? product?.images : '/icon/default/default.png'}
                                                            large={product?.images && product?.images !== "" ? product?.images : '/icon/default/default.png'}
                                                            width={200}
                                                            height={200}
                                                            alt={product?.name ?? "image"}
                                                            className={`3xl:size-10 3xl:min-w-10 size-8 min-w-8 text-xs-default object-cover rounded-md shrink-0`}
                                                        />

                                                        <div className="flex flex-col 3xl:gap-1 gap-0.5">
                                                            <p className={`font-semibold text-sm-default text-[#141522] group-hover:text-[#0F4F9E]`}>
                                                                {product.item_name}
                                                            </p>

                                                            <p className="text-[#667085] font-normal xl:text-[10px] text-[8px]">
                                                                {product.product_variation}
                                                            </p>

                                                            <p className="text-[#3276FA] font-normal 3xl:text-sm xl:text-xs text-[10px]">
                                                                {product.item_code}
                                                            </p>
                                                        </div>
                                                    </h4>

                                                    <h4 className="xxl:col-span-2 col-span-1 flex items-center size-full text-start text-[#141522] font-semibold text-sm-default">
                                                        {product?.unit_name ?? ""}
                                                    </h4>

                                                    <h4 className="xxl:col-span-1 col-span-2 flex items-center justify-center size-full text-center text-[#141522] font-semibold text-sm-default">
                                                        {+product.quantity_need_manufactures > 0 ? formatNumber(+product.quantity_need_manufactures) : "-"}
                                                    </h4>

                                                    <h4 className="col-span-2 flex items-center justify-center size-full text-center text-[#141522] font-semibold text-sm-default">
                                                        {+product.quantity_keep > 0 ? formatNumber(+product.quantity_keep) : "-"}
                                                    </h4>

                                                    <h4 className="col-span-2 flex items-center justify-center size-full text-center text-[#141522] font-semibold text-sm-default">
                                                        {+product.quantity_stage > 0 ? formatNumber(+product.quantity_stage) : "-"}
                                                    </h4>

                                                    <ProgressCircle
                                                        title={product?.stage_name_active ?? ""}
                                                        step={product?.count_stage_active}
                                                        total={product?.count_stage}
                                                        quantity={product?.quantity_stage}
                                                        stages={stages}
                                                        className="col-span-4 flex items-center justify-center size-full text-xs-default"
                                                    />
                                                </div>
                                            ))
                                        )
                                        :
                                        (
                                            <NoData
                                                className="mt-0 col-span-16"
                                                type="table"
                                            />
                                        )
                                )
                        }
                        {/* load more click */}
                        {
                            dataItemOrderDetail?.items_semi?.length > 0  &&
                            <div className='col-span-16 flex item justify-between'>
                                <div />
                                {
                                    // (dataItemOrderDetail?.items_semi?.length || 0) > (visibleProducts["info"] || 4) && (
                                    (limit < dataItemOrderDetail?.items_semi.length) && (
                                        <div className=" flex justify-center py-2">
                                            <button onClick={() => setLimit(dataItemOrderDetail?.items_semi.length)} className="text-[#667085] 3xl:text-base text-sm hover:underline">
                                                Xem thêm mặt hàng ({dataItemOrderDetail?.items_semi.length - limit}) Thành phẩm
                                            </button>
                                        </div>
                                    )
                                }

                                <LimitListDropdown
                                    limit={limit}
                                    sLimit={(value) => setLimit(value)}
                                    dataLang={{ display: "Hiển thị", on: "trên", lsx: "BTP" }}
                                    total={dataItemOrderDetail?.items_semi.length}
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TabInformation