import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
const Navbar = (props) => {
    const router = useRouter()
    //báo cáo bán hàng
    const isNavbarSales = [
        {
            id: uuidv4(),
            name: "Báo cáo đơn hàng theo báo giá",
            path: "/report_statistical/sales_report/quote",
        },
        {
            id: uuidv4(),
            name: "Báo cáo hàng trả lại",
            path: "/report_statistical/sales_report/returned_goods",
        },
        {
            id: uuidv4(),
            name: "Báo cáo lịch giao hàng",
            path: "/report_statistical/sales_report/delivery_schedules",
        },
        {
            id: uuidv4(),
            name: "Tình trạng đơn hàng",
            path: "/report_statistical/sales_report/status_row",
        },
        {
            id: uuidv4(),
            name: "Doanh số theo đơn hàng",
            path: "/report_statistical/sales_report/order_revenue",
        },
        {
            id: uuidv4(),
            name: "Phân tích bán hàng",
            path: "/report_statistical/sales_report/sales_analysis",
        },
        {
            id: uuidv4(),
            name: "Bảng kê giá bán gần nhất",
            path: "/report_statistical/sales_report/price_list",
        },
        {
            id: uuidv4(),
            name: "Nhật ký bán hàng",
            path: "/report_statistical/sales_report/selling_diary",
        },
    ]
    // báo cáo mua hàng
    const isNavbarPurchase = [
        {
            id: uuidv4(),
            title: " Báo cáo mặt hàng nhà cung cấp",
            children: [
                {
                    id: uuidv4(),
                    name: "Báo cáo chi tiết yêu cầu mua hàng",
                    path: "/report_statistical/purchase_report/purchases",
                },
                {
                    id: uuidv4(),
                    name: "Báo cáo tổng hợp mua hàng",
                    path: "/report_statistical/purchase_report/summary_of_purchases",
                },
                {
                    id: uuidv4(),
                    name: "Báo cáo sổ chi tiết mua hàng",
                    path: "/report_statistical/purchase_report/purchase_details_book",
                },
                {
                    id: uuidv4(),
                    name: "Theo dõi đặt hàng",
                    path: "/report_statistical/purchase_report/order_tracking",
                },
            ]
        },
        {
            id: uuidv4(),
            title: "Báo cáo công nợ nhà cung cấp",
            children: [
                {
                    id: uuidv4(),
                    name: "Báo cáo tổng hợp công nợ phải trả",
                    path: "/report_statistical/purchase_report/summary_of_liabilities",
                },
                {
                    id: uuidv4(),
                    name: "Báo cáo chi tiết công nợ phải trả theo mặt hàng",
                    path: "/report_statistical/purchase_report/debt_by_item",
                },
                {
                    id: uuidv4(),
                    name: "Bảng kê mua hàng",
                    path: "/report_statistical/purchase_report/purchases_list",
                },
            ]
        },


    ]
    // báo cáo tồn kho
    const isNavbarWarehouse = [
        {
            id: uuidv4(),
            title: "Báo cáo tồn kho",
            children: [
                {
                    id: uuidv4(),
                    name: "Thẻ kho",
                    path: "/report_statistical/warehouse_report/card",
                },
                {
                    id: uuidv4(),
                    name: "Báo cáo nhập xuất tồn",
                    path: "/report_statistical/warehouse_report/entry_and_exist",
                },
                {
                    id: uuidv4(),
                    name: "Báo cáo NVL theo kho",
                    path: "/report_statistical/warehouse_report/materials",
                },
                {
                    id: uuidv4(),
                    name: "Báo cáo thành phẩm theo kho",
                    path: "/report_statistical/warehouse_report/products",
                },
            ]
        },
        {
            id: uuidv4(),
            title: "Báo cáo chi tiết các phiếu",
            children: [
                {
                    id: uuidv4(),
                    name: "Báo cáo chi tiết nhập hàng",
                    path: "/report_statistical/warehouse_report/import_goods",
                },
                {
                    id: uuidv4(),
                    name: "Báo cáo chi tiết xuất kho bán hàng",
                    path: "/report_statistical/warehouse_report/warehouse_sell",
                },
                {
                    id: uuidv4(),
                    name: "Báo cáo chi tiết xuất kho sản xuất",
                    path: "/report_statistical/warehouse_report/warehouse_manufacture",
                },
                {
                    id: uuidv4(),
                    name: "Báo cáo chi tiết chuyển kho",
                    path: "/report_statistical/warehouse_report/warehouse_transfer",
                },
                {
                    id: uuidv4(),
                    name: "Báo cáo chi tiết điểu chỉnh",
                    path: "/report_statistical/warehouse_report/adjust",
                },
            ]
        },
    ]
    // tồn quỹ
    const isNavbarFundBalance = [
        {
            id: uuidv4(),
            title: "Thu chi",
            children: [
                {
                    id: uuidv4(),
                    name: "Nhật ký thu",
                    path: "/report_statistical/fund_balance/autumn_diary",
                },
                {
                    id: uuidv4(),
                    name: "Nhật ký chi",
                    path: "/report_statistical/fund_balance/spend_diary",
                },
                {
                    id: uuidv4(),
                    name: "Nhật ký thu chi",
                    path: "/report_statistical/fund_balance/income_expenses",
                },
            ]
        },
        {
            id: uuidv4(),
            title: "Tồn quỹ",
            children: [
                {
                    id: uuidv4(),
                    name: "Tổng hợp tồn quỹ",
                    path: "/report_statistical/fund_balance/synthetic_fund",
                },
                {
                    id: uuidv4(),
                    name: "Sổ quỹ tiền mặt",
                    path: "/report_statistical/fund_balance/cash_fund",
                },
                {
                    id: uuidv4(),
                    name: "Sổ quỹ ngân hàng",
                    path: "/report_statistical/fund_balance/bank_fund",
                },
            ]
        },
        {
            id: uuidv4(),
            title: "Báo cáo chi phí",
            children: [
                {
                    id: uuidv4(),
                    name: "Chi phí",
                    path: "/report_statistical/fund_balance/expense",
                },
            ]
        },
    ]
    // Công nợ phải thu
    const isNavbarReceivables = [
        {
            id: uuidv4(),
            name: "Tổng hợp công nợ phải thu",
            path: "/report_statistical/receivables_debt/aggregate_debt",
        },
        {
            id: uuidv4(),
            name: "Chi tiết công nợ phải thu",
            path: "/report_statistical/receivables_debt/aggregate_debt_detail",
        },
        {
            id: uuidv4(),
            name: "Tổng hợp công nợ phải thu theo nhân viên",
            path: "/report_statistical/receivables_debt/employee_debt",
        },
        {
            id: uuidv4(),
            name: "Bảng đối chiếu công nợ",
            path: "/report_statistical/receivables_debt/debt_comparison_table",
        },
    ]
    // Quản lý sản xuất
    const isNavbarProductionManager = [
        {
            id: uuidv4(),
            name: "Báo cáo định mức NVL",
            path: "/report_statistical/production_manager/quota_materials",
        },
        {
            id: uuidv4(),
            name: "Báo cáo tiến độ theo đơn hàng",
            path: "/report_statistical/production_manager/order_progress",
        },
        {
            id: uuidv4(),
            name: "Báo cáo lệnh sản xuất theo công đoạn",
            path: "/report_statistical/production_manager/stage_production_order",
        },
        {
            id: uuidv4(),
            name: "Báo cáo nguyên liệu sử dụng",
            path: "/report_statistical/production_manager/raw_materials_used",
        },
        {
            id: uuidv4(),
            name: "Báo cáo thời gian sản xuất theo đơn hàng",
            path: "/report_statistical/production_manager/time_order_production",
        },
        {
            id: uuidv4(),
            name: "Báo cáo sản lượng chi tiết",
            path: "/report_statistical/production_manager/detailed_output",
        },
        {
            id: uuidv4(),
            name: "Báo cáo nhập kho thành phẩm",
            path: "/report_statistical/production_manager/import_warehouse_products",
        },
    ]
    const [navbar, setNavbar] = useState([])

    useEffect(() => {
        const path = router.pathname;
        switch (true) {
            case path.startsWith("/report_statistical/sales_report"):
                setNavbar(isNavbarSales);
                break;
            case path.startsWith("/report_statistical/purchase_report"):
                setNavbar(isNavbarPurchase);
                break;
            case path.startsWith("/report_statistical/warehouse_report"):
                setNavbar(isNavbarWarehouse);
                break;
            case path.startsWith("/report_statistical/fund_balance"):
                setNavbar(isNavbarFundBalance);
                break;
            case path.startsWith("/report_statistical/receivables_debt"):
                setNavbar(isNavbarReceivables);
                break;
            case path.startsWith("/report_statistical/production_manager"):
                setNavbar(isNavbarProductionManager);
                break;
            default:
                break;
        }
    }, [router.pathname])


    return (
        <ul className='col-span-2 flex flex-col gap-2 3xl:h-[620px] 2xl:max-h-[550px] 2xl:h-[550px] max-h-[550px] h-[550px] rounded-xl w-full list-disc list-inside  bg-[#F7FAFE] 3xl:px-6 3xl:py-4 py-3 px-2 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'>
            {
                navbar && navbar.map((item) => {
                    return (
                        <React.Fragment key={item.id}>
                            <h1 className="2xl:text-sm text-xs uppercase">{item.title}</h1>
                            {item.children ?
                                item.children.map((child) => {
                                    return (

                                        <Link href={child.path} key={child.id} className="grid grid-cols-12 relative">
                                            <li className={`group col-span-12 ${router.pathname === child.path ? "bg-[#3276FA] text-white" : ""} font-medium  flex gap-2 3xl:px-4 px-3 py-2  items-center justify-between w-full rounded-lg cursor-pointer hover:bg-[#3276FA] hover:text-white duration-200 ease-in-out transition`}
                                            >
                                                <div className='flex xl:w-[90%] xl:max-w-[90%] w-[85%] max-w-[85%] items-center gap-2'>
                                                    <div className='w-[6px] h-[6px] rounded-full bg-[#6C9AC4] group-hover:bg-white' />
                                                    <div className="flex flex-col items-start w-full">
                                                        <div className='w-[95%] max-w-[95%] 3xl:text-base xl:text-sm text-xs '>
                                                            {child.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            {router.pathname === child.path &&
                                                <div className="absolute right-0 -top-1">
                                                    <span className="relative flex h-3 w-3">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                                    </span>
                                                </div>
                                            }
                                        </Link>
                                    )
                                })
                                :

                                <Link href={item.path} key={item.id} className="grid grid-cols-12 relative">
                                    <li className={`group col-span-12 ${router.pathname === item.path ? "bg-[#3276FA] text-white" : ""} font-medium  flex gap-2 3xl:px-4 px-3 py-2  items-center justify-between w-full rounded-lg cursor-pointer hover:bg-[#3276FA] hover:text-white duration-200 ease-in-out transition`}
                                    >
                                        <div className='flex xl:w-[90%] xl:max-w-[90%] w-[85%] max-w-[85%] items-center gap-2'>
                                            <div className='w-[6px] h-[6px] rounded-full bg-[#6C9AC4] group-hover:bg-white' />
                                            <div className="flex flex-col items-start w-full">
                                                <div className='w-[95%] max-w-[95%] 3xl:text-base xl:text-sm text-xs '>
                                                    {item.name}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    {router.pathname === item.path &&
                                        <div className="absolute right-0 -top-1">
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                            </span>
                                        </div>
                                    }
                                </Link>
                            }
                        </React.Fragment>
                    )
                })
            }
        </ul>
    )
}
export default Navbar