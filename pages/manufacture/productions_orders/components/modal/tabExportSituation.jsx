// tình hình xuất NVL
import apiProductionsOrders from '@/api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders';
import OnResetData from '@/components/UI/btnResetData/btnReset';
import { ContainerTotal } from '@/components/UI/common/layout';
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from '@/components/UI/common/Table';
import DropdowLimit from '@/components/UI/dropdowLimit/dropdowLimit';
import ExcelFileComponent from '@/components/UI/filterComponents/excelFilecomponet';
import SearchComponent from '@/components/UI/filterComponents/searchComponent';
import Loading from '@/components/UI/loading';
import NoData from '@/components/UI/noData/nodata';
import useSetingServer from '@/hooks/useConfigNumber';
import { useLimitAndTotalItems } from '@/hooks/useLimitAndTotalItems';
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { useQuery } from '@tanstack/react-query';
import saveAs from 'file-saver';
import html2canvas from 'html2canvas';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { memo, useEffect, useState } from 'react';
import ModalImage from 'react-modal-image';
import { useSelector } from 'react-redux';
import { v4 as uddid } from 'uuid';
import * as XLSX from 'xlsx';
const Column = dynamic(() => import("@ant-design/plots").then(({ Column }) => Column), { ssr: false });

const TabExportSituation = memo(({ isStateModal, width, dataLang, listTab }) => {
    const [isTab, setIsTab] = useState('chart')

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems()

    const initialState = {
        onFetching: false,
        dataChart: [],
        dataTable: [],
        dataDefault: [],
    }

    const [isMounted, setIsMounted] = useState(false)

    const router = useRouter()

    const [isExportSituation, setIsExportSituation] = useState(initialState)

    const queryStatesetExportSituation = (key) => setIsExportSituation(x => ({ ...x, ...key }))

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    // const { checkAdd, checkExport } = useActionRole(auth, "")

    const dataSeting = useSetingServer();

    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);

    useEffect(() => {
        setIsMounted(true)
    })

    const fetchData = async () => {
        const { data } = await apiProductionsOrders.apiExportSituation(isStateModal.dataDetail?.poi?.poi_id)
        const newData = data?.boms?.map(e => {
            return {
                id: uddid(),
                image: '/no_img.png',
                name: e?.item_name,
                itemVariation: e?.product_variation,
                code: e?.item_code,
                unit: e?.unit_name,
                type: e?.type_products,
                quantityPlan: e?.quantity_total_quota,
                quantityExport: e?.quantity_exported,
                quantityImport: e?.quantity_recovery,
                quantityRemaining: e?.quantity_rest
            }
        })
        const chart = data?.boms?.flatMap(e => {
            const nameMap = {
                'quantity_total_quota': 'Kế hoạch',
                'quantity_exported': 'Đã xuất',
                'quantity_recovery': 'Thu hồi',
                'quantity_rest': 'Còn lại'
            };
            const columnName = e.item_code;
            return Object.entries(e).map(([key, value]) => {
                if (key in nameMap) {
                    return {
                        name: nameMap[key],
                        column: columnName,
                        value: Number(value),
                    };
                }
                return undefined;
            }).filter(item => item !== undefined);
        });
        queryStatesetExportSituation({ dataTable: newData, dataDefault: newData, dataChart: chart, })
    }

    const { isLoading, refetch } = useQuery({
        queryKey: ["apiExportSituation", isStateModal.dataDetail?.poi?.poi_id, limit, isTab],
        queryFn: () => fetchData(),
        enabled: isStateModal.dataDetail?.poi?.poi_id ? true : false,
    })

    const totals = isExportSituation.dataTable?.reduce((acc, e) => {
        return {
            quantityPlan: acc.quantityPlan + (+e?.quantityPlan || 0),
            quantityExport: acc.quantityExport + (+e?.quantityExport || 0),
            quantityImport: acc.quantityImport + (+e?.quantityImport || 0),
            quantityRemaining: acc.quantityRemaining + (+e?.quantityRemaining || 0)
        };
    }, { quantityPlan: 0, quantityExport: 0, quantityImport: 0, quantityRemaining: 0 });

    function removeDiacritics(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }


    const handleSearch = (e) => {
        const value = e.target.value;
        const sData = JSON.parse(JSON.stringify(isExportSituation.dataTable));
        const newData = sData?.filter(item => {
            const itemName = removeDiacritics(item?.name?.toLowerCase());
            const searchValue = removeDiacritics(value.toLowerCase());
            return itemName.includes(searchValue);
        });
        queryStatesetExportSituation({ dataTable: value ? newData : isExportSituation.dataDefault });
    }

    const multiDataSet = [
        {
            columns: [
                {
                    title: "ID",
                    width: { wch: 4 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.productions_orders_details_name_nvl || 'productions_orders_details_name_nvl'}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.productions_orders_details_type || 'productions_orders_details_type'}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.productions_orders_details_unit || 'productions_orders_details_unit'}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.productions_orders_details_table_export_plan || 'productions_orders_details_table_export_plan'}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.productions_orders_details_table_export_exported || 'productions_orders_details_table_export_exported'}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.productions_orders_details_table_export_remaining || 'productions_orders_details_table_export_remaining'}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.productions_orders_details_table_export_recall || 'productions_orders_details_table_export_recall'}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],
            data: isExportSituation?.dataDefault?.map((e, index) => [
                { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
                { value: `${e?.name ? e?.name : ""}` },
                { value: `${dataLang[e?.type] || e?.type_products}` },
                { value: `${e?.unit_name ? e?.unit_name : ""}` },
                { value: `${e?.quantityPlan ? formatNumber(e?.quantityPlan) : ""}` },
                { value: `${e?.quantityExport ? formatNumber(e?.quantityExport) : ""}` },
                { value: `${e?.quantityRemaining ? formatNumber(e?.quantityRemaining) : ""}` },
                { value: `${e?.quantityImport ? formatNumber(e?.quantityImport) : ""}` },
            ]),
        },
    ];

    if (!isMounted) return null
    return (
        <div className='h-full'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-1'>
                    <h1 className="3xl:text-basse text-sm my-1 w-1/3">{listTab[isStateModal.isTab - 1]?.name}</h1>
                    <div className="flex justify-start items-center gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsTab('chart')

                            }}
                            className={`${isTab === 'chart' && 'border-green-500 border'} bg-[#EBFEF2] text-[#0BAA2E] py-[2px] px-[10px] font-normal text-xs w-fit min-w-fit rounded-md  flex gap-1 items-center`}>
                            {dataLang?.productions_orders_details_table_export_chart || 'productions_orders_details_table_export_chart'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsTab('table')
                            }}
                            className={`${isTab === 'table' && 'border-[#EE1E1E] border'} bg-[#FFEEF0] text-[#EE1E1E] py-[2px] px-[10px] font-normal text-xs w-fit min-w-fit rounded-md  flex gap-1 items-center`}>
                            {dataLang?.productions_orders_details_table_export_list || 'productions_orders_details_table_export_list'}
                        </button>
                    </div>
                </div>
                {
                    isTab == 'table' &&
                    <div className="flex justify-end items-center gap-1">
                        <SearchComponent colSpan={1} dataLang={dataLang} placeholder={dataLang?.branch_search} onChange={handleSearch} classInput={'border'} />
                        <OnResetData onClick={() => refetch()} sOnFetching={() => { }} />
                        <div className={``}>
                            {isExportSituation.dataDefault?.length > 0 && (
                                <ExcelFileComponent
                                    dataLang={dataLang}
                                    filename={"Danh sách dữ liệu tình hình xuất NVL"}
                                    multiDataSet={multiDataSet}
                                    title="DSDLTHXNVL"
                                />
                            )}
                        </div>
                        <div>
                            <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                        </div>
                    </div>
                }
            </div>
            <div className={`${isTab === 'chart' && (width > 1100 ? "h-[calc(100vh_-_343px)]" : 'h-[calc(100vh_-_473px)]') ||
                isTab === 'table' && (width > 1100 ? "3xl:h-[calc(100vh_-_405px)] xxl:h-[calc(100vh_-_380px)] 2xl:h-[calc(100vh_-_380px)] xl:h-[calc(100vh_-_380px)] lg:h-[calc(100vh_-_426px)] h-[calc(100vh_-_426px)]" :
                    '3xl:h-[calc(100vh_-_510px)] 2xl:h-[calc(100vh_-_480px)] xl:h-[calc(100vh_-_480px)] lg:h-[calc(100vh_-_470px)] h-[calc(100vh_-_470px)]')
                }  scrollbar-thin scrollbar-thumb-slate-300 bg-white scrollbar-track-slate-100`}>
                {isTab === 'table' &&
                    <div>
                        <HeaderTable gridCols={11} display={'grid'}>
                            <ColumnTable colSpan={1} textAlign={'center'}>
                                STT
                            </ColumnTable>
                            <ColumnTable colSpan={3} textAlign={'center'}>
                                {dataLang?.productions_orders_details_name_nvl || 'productions_orders_details_name_nvl'}
                            </ColumnTable>
                            <ColumnTable colSpan={2} textAlign={'center'}>
                                {dataLang?.productions_orders_details_type || 'productions_orders_details_type'}
                            </ColumnTable>
                            <ColumnTable colSpan={1} textAlign={'center'}>
                                {dataLang?.productions_orders_details_unit || 'productions_orders_details_unit'}
                            </ColumnTable>
                            <ColumnTable colSpan={1} textAlign={'center'}>
                                {dataLang?.productions_orders_details_table_export_plan || 'productions_orders_details_table_export_plan'}
                            </ColumnTable>
                            <ColumnTable colSpan={1} textAlign={'center'}>
                                {dataLang?.productions_orders_details_table_export_exported || 'productions_orders_details_table_export_exported'}
                            </ColumnTable>
                            <ColumnTable colSpan={1} textAlign={'center'}>
                                {dataLang?.productions_orders_details_table_export_remaining || 'productions_orders_details_table_export_remaining'}
                            </ColumnTable>
                            <ColumnTable colSpan={1} textAlign={'center'}>
                                {dataLang?.productions_orders_details_table_export_recall || 'productions_orders_details_table_export_recall'}
                            </ColumnTable>
                        </HeaderTable>
                        {isLoading ? (
                            <Loading className="h-80" color="#0f4f9e" />
                        ) : isExportSituation.dataTable?.length > 0 ? (
                            <>
                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                    {isExportSituation.dataTable?.map((e, index) => (
                                        <RowTable gridCols={11} key={e.id.toString()} >
                                            <RowItemTable colSpan={1} textAlign={'center'}>
                                                {index + 1}
                                            </RowItemTable>
                                            <RowItemTable colSpan={3} textAlign={'left'} className={'flex items-center gap-2'}>
                                                <ModalImage
                                                    small={e.image}
                                                    large={e.image}
                                                    width={36}
                                                    height={36}
                                                    alt={e.name}
                                                    className="object-cover rounded-md min-w-[36px] min-h-[36px] w-[36px] h-[36px] max-w-[36px] max-h-[36px]"
                                                />
                                                <div className='flex flex-col'>
                                                    <span>{e.name}</span>
                                                    <div className='flex items-center gap-1 text-gray-500'>
                                                        <span>{e.code}</span>-<span>{e.itemVariation}</span>
                                                    </div>
                                                </div>
                                            </RowItemTable>
                                            <RowItemTable colSpan={2} textAlign={'center'}>
                                                <span
                                                    className={`py-[1px] px-1 rounded border h-fit w-fit font-[300] break-words leading-relaxed text-xs
                                                                     ${(e?.type === "products" && "text-lime-500 border-lime-500") ||
                                                        (e?.type == "semi_products" && "text-orange-500 border-orange-500") ||
                                                        (e?.type == "out_side" && "text-sky-500 border-sky-500") ||
                                                        (e?.type == "materials" && "text-purple-500 border-purple-500") ||
                                                        (e?.type == "semi_products_outside" && "text-green-500 border-green-500")
                                                        }`}
                                                >
                                                    {dataLang[e?.type] || e?.type}
                                                </span>
                                            </RowItemTable>
                                            <RowItemTable colSpan={1} textAlign={'center'}>
                                                {e.unit}
                                            </RowItemTable>
                                            <RowItemTable colSpan={1} textAlign={e?.quantityPlan > 0 ? "right" : 'center'}>
                                                {e.quantityPlan > 0 ? formatNumber(e.quantityPlan) : '-'}
                                            </RowItemTable>
                                            <RowItemTable colSpan={1} textAlign={e?.quantityExport > 0 ? "right" : 'center'}>
                                                {e.quantityExport > 0 ? formatNumber(e.quantityExport) : '-'}
                                            </RowItemTable>
                                            <RowItemTable colSpan={1} textAlign={e?.quantityRemaining > 0 ? "right" : 'center'}>
                                                {e.quantityRemaining > 0 ? formatNumber(e.quantityRemaining) : '-'}
                                            </RowItemTable>
                                            <RowItemTable colSpan={1} textAlign={e?.quantityImport > 0 ? "right" : 'center'}>
                                                {e.quantityImport > 0 ? formatNumber(e.quantityImport) : '-'}
                                            </RowItemTable>
                                        </RowTable>
                                    ))}
                                </div>
                            </>
                        ) : <NoData />}

                    </div>
                }
                {isTab === 'chart' &&
                    <div className='h-full'>
                        {
                            isExportSituation.onFetching ? <Loading className="h-full" color="#0f4f9e" /> : <ChartColumn dataChart={isExportSituation.dataChart} />
                        }
                    </div>
                }
            </div>
            {
                isTab === 'table' &&
                <ContainerTotal className="!grid-cols-11">
                    <ColumnTable colSpan={7} textAlign={'center'} className="p-2">
                        {dataLang?.productsWarehouse_total || "productsWarehouse_total"}
                    </ColumnTable>
                    <ColumnTable colSpan={1} textAlign={'right'} className="justify-end p-2 flex gap-2 flex-wrap  mr-1">
                        {formatNumber(totals.quantityPlan)}
                    </ColumnTable>
                    <ColumnTable colSpan={1} textAlign={'right'} className="justify-end p-2 flex gap-2 flex-wrap  mr-1">
                        {formatNumber(totals.quantityExport)}
                    </ColumnTable>
                    <ColumnTable colSpan={1} textAlign={'right'} className="justify-end p-2 flex gap-2 flex-wrap  mr-1">
                        {formatNumber(totals.quantityRemaining)}
                    </ColumnTable>
                    <ColumnTable colSpan={1} textAlign={'right'} className="justify-end p-2 flex gap-2 flex-wrap  mr-1">
                        {formatNumber(totals.quantityImport)}
                    </ColumnTable>
                </ContainerTotal>
            }
        </div>
    )
})

const ChartColumn = memo(({ dataChart }) => {
    const [chartRef, setChartRef] = useState(null);

    const dataSeting = useSetingServer()

    const formatNumber = (num) => formatNumberConfig(+num, dataSeting)

    const handleExportExcel = () => {
        if (!chartRef) return;
        // Tạo dữ liệu mới với tên cột được đổi
        const newData = dataChart.map(item => ({
            'Loại sản phẩm': item.name, // Đổi tên cột 'type' thành 'Loại sản phẩm'
            'Số lượng': item.value, // Đổi tên cột 'value' thành 'Số lượng'
            'Loại': item.column

        }));

        const ws = XLSX.utils.json_to_sheet(newData);
        const wscols = [
            { wch: 20 }, // Đặt kích thước cho cột 'Loại sản phẩm'
            { wch: 15 }, // Đặt kích thước cho cột 'Số lượng'
            { wch: 20 }  // Đặt kích thước cho cột 'Loại'
        ];
        ws['!cols'] = wscols;
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'chart.xlsx');
    };

    // Hàm xử lý khi người dùng nhấn nút "Export" vào PNG
    const handleExportPNG = () => {
        if (!chartRef) return;
        html2canvas(chartRef).then((canvas) => {
            canvas.toBlob((blob) => {
                saveAs(blob, 'chart.png');
            });
        });
    };

    const config = {
        data: dataChart,
        xField: 'column',
        yField: 'value',
        seriesField: 'name',
        isStack: true,
        label: {
            position: 'middle', // Đặt vị trí nhãn là giữa cột
            content: ({ value }) => `${formatNumber(value)}`, // Hiển thị giá trị của cột
        },
        legend: {
            position: 'right-top', // Vị trí của legend
        },
        tooltip: {
            shared: true,
            showMarkers: false, // Optional: Hide tooltip markers if desired
            formatter: (datum) => {
                return {
                    name: datum.name,
                    value: formatNumber(datum.value),
                }
            },
        },
        color: ({ name }) => {
            const colors = {
                'Kế hoạch': '#1f77b4',
                'Đã xuất': '#ff7f0e',
                'Còn lại': '#2ca02c',
                'Hồi phục': '#d62728'
            };
            return colors[name];
        }
    };
    return (
        <div className='relative'>
            <div ref={setChartRef}>
                <Column {...config} />
            </div>
            <div className='flex flex-col gap-2 absolute top-1/2 translate-y-1/2 right-[2.1%]'>
                <button onClick={handleExportExcel} className='bg-transparent border hover:bg-blue-600 hover:text-white transition-all duration-150 ease-linear px-2 py-1 rounded-md text-[10px]'>Export Excel</button>
                <button onClick={handleExportPNG} className='bg-transparent border hover:bg-blue-600 hover:text-white transition-all duration-150 ease-linear px-2 py-1 rounded-md text-[10px]'>Export PNG</button>
            </div>
        </div>
    )
})



export default TabExportSituation