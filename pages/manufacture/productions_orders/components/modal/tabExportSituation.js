// tình hình xuất NVL
import OnResetData from '@/components/UI/btnResetData/btnReset';
import ContainerPagination from '@/components/UI/common/ContainerPagination/ContainerPagination';
import TitlePagination from '@/components/UI/common/ContainerPagination/TitlePagination';
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from '@/components/UI/common/Table';
import { ContainerTotal } from '@/components/UI/common/layout';
import DropdowLimit from '@/components/UI/dropdowLimit/dropdowLimit';
import SearchComponent from '@/components/UI/filterComponents/searchComponent';
import Loading from '@/components/UI/loading';
import NoData from '@/components/UI/noData/nodata';
import Pagination from "@/components/UI/pagination";
import useSetingServer from '@/hooks/useConfigNumber';
import { useLimitAndTotalItems } from '@/hooks/useLimitAndTotalItems';
import useActionRole from '@/hooks/useRole';
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { html2canvasCore } from '@/utils/lib/html2canvas';
import { saveAsCore } from '@/utils/lib/saveAs';
import { Grid6 } from 'iconsax-react';
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
        dataChart: [
            { type: 'Vải', value: 1, column: 'plan' },
            { type: 'Quần', value: 1.5, column: 'plan' },
            { type: 'Áo', value: 4.5, column: 'export' },
            { type: 'Cúc', value: 3, column: 'export' },
            { type: 'Chỉ may', value: 2, column: 'import' },
            { type: 'Kim', value: 1, column: 'import' },
        ],
        dataTable: [
            {
                id: uddid(),
                image: '/no_img.png',
                name: 'ÁO SƠ MI - S - TRẮNG',
                itemVariation: 'Biến thể 1',
                code: 'SMM',
                unit: 'Cái',
                type: 'materials',
                quantityPlan: 1000,
                quantityExport: 500,
                quantityImport: 1000,
                quantityRemaining: 500
            },
            {
                id: uddid(),
                image: '/no_img.png',
                name: 'ÁO SƠ MI - S - TRẮNG',
                itemVariation: 'Biến thể 1',
                code: 'SMM',
                unit: 'Cái',
                type: 'materials',
                quantityPlan: 1000,
                quantityExport: 500,
                quantityImport: 1000,
                quantityRemaining: 500
            },
            {
                id: uddid(),
                image: '/no_img.png',
                name: 'ÁO SƠ MI - S - TRẮNG',
                itemVariation: 'Biến thể 1',
                code: 'SMM',
                unit: 'Cái',
                type: 'materials',
                quantityPlan: 1000,
                quantityExport: 500,
                quantityImport: 1000,
                quantityRemaining: 500
            },
            {
                id: uddid(),
                image: '/no_img.png',
                name: 'ÁO SƠ MI - S - TRẮNG',
                itemVariation: 'Biến thể 1',
                code: 'SMM',
                unit: 'Cái',
                type: 'materials',
                quantityPlan: 1000,
                quantityExport: 500,
                quantityImport: 1000,
                quantityRemaining: 500
            },
            {
                id: uddid(),
                image: '/no_img.png',
                name: 'ÁO SƠ MI - S - TRẮNG',
                itemVariation: 'Biến thể 1',
                code: 'SMM',
                unit: 'Cái',
                type: 'materials',
                quantityPlan: 1000,
                quantityExport: 500,
                quantityImport: 1000,
                quantityRemaining: 500
            },
            {
                id: uddid(),
                image: '/no_img.png',
                name: 'ÁO SƠ MI - S - TRẮNG',
                itemVariation: 'Biến thể 1',
                code: 'SMM',
                unit: 'Cái',
                type: 'materials',
                quantityPlan: 1000,
                quantityExport: 500,
                quantityImport: 1000,
                quantityRemaining: 500
            },
            {
                id: uddid(),
                image: '/no_img.png',
                name: 'ÁO SƠ MI - S - TRẮNG',
                itemVariation: 'Biến thể 1',
                code: 'SMM',
                unit: 'Cái',
                type: 'materials',
                quantityPlan: 1000,
                quantityExport: 500,
                quantityImport: 1000,
                quantityRemaining: 500
            },
            {
                id: uddid(),
                image: '/no_img.png',
                name: 'ÁO SƠ MI - S - TRẮNG',
                itemVariation: 'Biến thể 1',
                code: 'SMM',
                unit: 'Cái',
                type: 'materials',
                quantityPlan: 1000,
                quantityExport: 500,
                quantityImport: 1000,
                quantityRemaining: 500
            },
            {
                id: uddid(),
                image: '/no_img.png',
                name: 'ÁO SƠ MI - S - TRẮNG',
                itemVariation: 'Biến thể 1',
                code: 'SMM',
                unit: 'Cái',
                type: 'materials',
                quantityPlan: 1000,
                quantityExport: 500,
                quantityImport: 1000,
                quantityRemaining: 500
            },
            {
                id: uddid(),
                image: '/no_img.png',
                name: 'ÁO SƠ MI - S - TRẮNG',
                itemVariation: 'Biến thể 1',
                code: 'SMM',
                unit: 'Cái',
                type: 'materials',
                quantityPlan: 1000,
                quantityExport: 500,
                quantityImport: 1000,
                quantityRemaining: 500
            },
            {
                id: uddid(),
                image: '/no_img.png',
                name: 'ÁO SƠ MI - S - TRẮNG',
                itemVariation: 'Biến thể 1',
                code: 'SMM',
                unit: 'Cái',
                type: 'materials',
                quantityPlan: 1000,
                quantityExport: 500,
                quantityImport: 1000,
                quantityRemaining: 500
            },
        ]
    }

    const router = useRouter()

    const [isExportSituation, setIsExportSituation] = useState(initialState)

    const queryStatesetExportSituation = (key) => setIsExportSituation(x => ({ ...x, ...key }))

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkExport } = useActionRole(auth, "")

    const dataSeting = useSetingServer();

    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);

    const paginate = (pageNumber) => {
        router.push({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
                page: pageNumber,
            },
        });
    };


    useEffect(() => {
        sTotalItems(10)
    }, [])

    return (
        <div className='h-full'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-1'>
                    <h1 className="3xl:text-xl text-base my-1 w-1/2">{listTab[isStateModal.isTab - 1]?.name}</h1>
                    <div className="flex justify-start items-center gap-4">
                        <button type="button" onClick={() => setIsTab('chart')} className={`${isTab === 'chart' && 'border-green-500 border'} bg-[#EBFEF2] text-[#0BAA2E] py-[2px] px-[10px] font-normal text-xs w-fit min-w-fit rounded-md  flex gap-1 items-center`}>
                            Biểu đồ thống kê
                        </button>
                        <button type="button" onClick={() => setIsTab('table')} className={`${isTab === 'table' && 'border-[#EE1E1E] border'} bg-[#FFEEF0] text-[#EE1E1E] py-[2px] px-[10px] font-normal text-xs w-fit min-w-fit rounded-md  flex gap-1 items-center`}>
                            Danh sách dữ liệu
                        </button>
                    </div>
                </div>
                {
                    isTab == 'table' &&
                    <div className="flex justify-end items-center gap-2">
                        <SearchComponent colSpan={1} dataLang={dataLang} placeholder={dataLang?.branch_search} onChange={() => { }} classInput={'border'} />
                        <OnResetData sOnFetching={(e) => queryStatesetExportSituation({ onFetching: e })} />
                        {/* {(role == true || checkExport) ?
                            <div className={``}>
                                {isState.dataExcel?.length > 0 && (
                                    <ExcelFileComponent dataLang={dataLang}
                                        filename={"Danh sách tình hình xuất NVL"}
                                        title="DSNKTP"
                                        multiDataSet={multiDataSet}
                                    />)}
                            </div>
                            :
                            <button onClick={() => isShow('warning', WARNING_STATUS_ROLE)} className={`xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}>
                                <Grid6 className="2xl:scale-100 xl:scale-100 scale-75" size={18} />
                                <span>{dataLang?.client_list_exportexcel}</span>
                            </button>
                        } */}
                        <button onClick={() => { }} className={`xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}>
                            <Grid6 className="2xl:scale-100 xl:scale-100 scale-75" size={18} />
                            <span>{dataLang?.client_list_exportexcel}</span>
                        </button>
                        <div>
                            <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                        </div>
                    </div>
                }
            </div>
            <div className={`${isTab === 'chart' && (width > 1100 ? "h-[calc(100vh_-_343px)]" : 'h-[calc(100vh_-_473px)]') ||
                isTab === 'table' && (width > 1100 ? "3xl:h-[calc(100vh_-_450px)] 2xl:h-[calc(100vh_-_430px)] xl:h-[calc(100vh_-_440px)] h-[calc(100vh_-_455px)]" : '3xl:h-[calc(100vh_-_575px)] 2xl:h-[calc(100vh_-_550px)] xl:h-[calc(100vh_-_530px)] h-[calc(100vh_-_525px)]')
                }  scrollbar-thin scrollbar-thumb-slate-300 bg-white scrollbar-track-slate-100`}>
                {isTab === 'table' &&
                    <div>
                        <HeaderTable gridCols={10} display={'grid'}>
                            <ColumnTable colSpan={3} textAlign={'center'}>
                                Tên NVL
                            </ColumnTable>
                            <ColumnTable colSpan={2} textAlign={'center'}>
                                Loại
                            </ColumnTable>
                            <ColumnTable colSpan={1} textAlign={'center'}>
                                Đơn vị
                            </ColumnTable>
                            <ColumnTable colSpan={1} textAlign={'center'}>
                                Kế hoạch
                            </ColumnTable>
                            <ColumnTable colSpan={1} textAlign={'center'}>
                                Đã xuất
                            </ColumnTable>
                            <ColumnTable colSpan={1} textAlign={'center'}>
                                Còn lại
                            </ColumnTable>
                            <ColumnTable colSpan={1} textAlign={'center'}>
                                Thu hồi
                            </ColumnTable>
                        </HeaderTable>
                        {isExportSituation.onFetching ? (
                            <Loading className="h-80" color="#0f4f9e" />
                        ) : isExportSituation.dataTable?.length > 0 ? (
                            <>
                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                    {isExportSituation.dataTable?.map((e) => (
                                        <RowTable gridCols={10} key={e.id.toString()} >
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
                                                    className={`py-[1px] px-1 rounded border h-fit w-fit font-[300] break-words leading-relaxed text-sm
                                                        ${(e?.type == "materials" && "text-lime-500 border-lime-500") ||
                                                        (e?.type == 1 && "text-orange-500 border-orange-500") ||
                                                        (e?.type == 2 && "text-sky-500 border-sky-500")
                                                        }`}
                                                >
                                                    {'Nguyên vật liệu'}
                                                </span>
                                            </RowItemTable>
                                            <RowItemTable colSpan={1} textAlign={'center'}>
                                                {e.unit}
                                            </RowItemTable>
                                            <RowItemTable colSpan={1} textAlign={'right'}>
                                                {e.quantityPlan > 0 ? formatNumber(e.quantityPlan) : '-'}
                                            </RowItemTable>
                                            <RowItemTable colSpan={1} textAlign={'right'}>
                                                {e.quantityExport > 0 ? formatNumber(e.quantityExport) : '-'}
                                            </RowItemTable>
                                            <RowItemTable colSpan={1} textAlign={'right'}>
                                                {e.quantityRemaining > 0 ? formatNumber(e.quantityRemaining) : '-'}
                                            </RowItemTable>
                                            <RowItemTable colSpan={1} textAlign={'right'}>
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
                        <ChartColumn dataChart={isExportSituation.dataChart} />
                    </div>
                }
            </div>
            {
                isTab === 'table' &&
                <ContainerTotal className="!grid-cols-10">
                    <ColumnTable colSpan={6} textAlign={'center'} className="p-2">
                        {dataLang?.productsWarehouse_total || "productsWarehouse_total"}
                    </ColumnTable>
                    <ColumnTable colSpan={1} textAlign={'right'} className="justify-end p-2 flex gap-2 flex-wrap  mr-1">
                        0
                    </ColumnTable>
                    <ColumnTable colSpan={1} textAlign={'right'} className="justify-end p-2 flex gap-2 flex-wrap  mr-1">
                        0
                    </ColumnTable>
                    <ColumnTable colSpan={1} textAlign={'right'} className="justify-end p-2 flex gap-2 flex-wrap  mr-1">
                        0
                    </ColumnTable>
                    <ColumnTable colSpan={1} textAlign={'right'} className="justify-end p-2 flex gap-2 flex-wrap  mr-1">
                        0
                    </ColumnTable>
                </ContainerTotal>
            }
            {isTab === 'table' && isExportSituation.dataTable?.length != 0 && (
                <ContainerPagination>
                    <TitlePagination
                        dataLang={dataLang}
                        totalItems={10}
                    // totalItems={totalItems?.iTotalDisplayRecords}
                    />
                    <Pagination
                        postsPerPage={limit}
                        totalPosts={100}
                        // totalPosts={Number(totalItems?.iTotalDisplayRecords)}
                        paginate={paginate}
                        currentPage={router.query?.page || 1}
                    />
                </ContainerPagination>
            )}
        </div>
    )
})

const ChartColumn = memo(({ dataChart }) => {
    const [chartRef, setChartRef] = useState(null);
    const handleExportExcel = () => {
        if (!chartRef) return;
        // Tạo dữ liệu mới với tên cột được đổi
        const newData = data.map(item => ({
            'Loại sản phẩm': item.type, // Đổi tên cột 'type' thành 'Loại sản phẩm'
            'Số lượng': item.value, // Đổi tên cột 'value' thành 'Số lượng'
            'Loại': item.column === 'plan' ? 'Kế hoạch' : item.column === 'export' ? 'Đã xuất' : 'Thu hồi', // Đổi tên cột 'column' thành 'Loại'
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
        html2canvasCore(chartRef).then((canvas) => {
            canvas.toBlob((blob) => {
                saveAsCore(blob, 'chart.png');
            });
        });
    };

    const config = {
        data: dataChart,
        xField: 'type',
        seriesField: 'column', // Chia màu theo loại
        yField: 'value',
        yAxis: {
            title: {
                text: 'Số lượng',
                style: {
                    fill: '#000', // Màu chữ
                    fontSize: 14, // Kích thước font chữ
                },
            },
            max: 5, // Thiết lập giá trị tối đa cho trục y
        },
        color: ({ column }) => {
            if (column === 'plan') return '#2989FF'; // Màu cho 'plan'
            if (column === 'export') return '#22CBCC'; // Màu cho 'export'
            if (column === 'import') return '#FF4D4F'; // Màu cho 'import'
            return '#2989FF';
        },
        tooltip: {
            customContent: (title, items) => {
                const color = items[0]?.color || '#2989FF'; // Lấy màu của cột
                const column = items[0]?.data?.column;
                const label = column === 'plan' ? 'Kế hoạch' : column === 'export' ? 'Đã xuất' : 'Thu hồi';
                return `
            <div style="padding: 10px;">
                <p style="margin: 0;">${title}</p>
                <p style="margin: 0;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 5px;"></span>
                    ${label}: ${items[0]?.data?.value}
                </p>
            </div>`;
            },
        },
        label: {
            position: 'middle', // Vị trí nhãn ở giữa cột
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
                fontSize: 16,
            },
            text: (originData) => {
                const val = parseFloat(originData.value);
                return (val * 100).toFixed(1) + '%';
            },
            offset: 10,
        },
        legend: {
            // position: 'top-right', // Vị trí của legend
            position: 'right', // Vị trí của legend nằm bên phải ngoài canvas
            layout: 'vertical', // Bố trí legend theo chiều dọc
            itemName: {
                formatter: (text) => {
                    // Định nghĩa nhãn tùy chỉnh cho legend
                    if (text === 'plan') return 'Kế hoạch';
                    if (text === 'export') return 'Đã xuất';
                    if (text === 'import') return 'Thu hồi';
                    return text;
                },
                style: {
                    fontSize: 14, // Kích thước font chữ của item
                },
            },
            marker: {
                symbol: 'square', // Kiểu của marker (ô màu)
                style: {
                    r: 8, // Kích thước của ô màu (radius)
                },
            },
        },
        slider: {
            x: {
                values: [0.1, 0.2],
            },
        },
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