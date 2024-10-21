import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
const Navbar = (props) => {
    const router = useRouter();
    //báo cáo bán hàng
    const isNavbarSales = [
        {
            id: uuidv4(),
            name: "Báo cáo đơn hàng theo báo giá",
            path: "/report-statistical/sales-report/quote",
        },
        {
            id: uuidv4(),
            name: "Báo cáo hàng trả lại",
            path: "/report-statistical/sales-report/returned-goods",
        },
        {
            id: uuidv4(),
            name: "Báo cáo lịch giao hàng",
            path: "/report-statistical/sales-report/delivery-schedules",
        },
        {
            id: uuidv4(),
            name: "Tình trạng đơn hàng",
            path: "/report-statistical/sales-eport/status-row",
        },
        {
            id: uuidv4(),
            name: "Doanh số theo đơn hàng",
            path: "/report-statistical/sales-report/order-revenue",
        },
        {
            id: uuidv4(),
            name: "Phân tích bán hàng",
            path: "/report-statistical/sales-report/sales-analysis",
        },
        {
            id: uuidv4(),
            name: "Bảng kê giá bán gần nhất",
            path: "/report-statistical/sales-report/price-list",
        },
        {
            id: uuidv4(),
            name: "Nhật ký bán hàng",
            path: "/report-statistical/sales-report/selling-diary",
        },
    ];
    // báo cáo mua hàng
    const isNavbarPurchase = [
        {
            id: uuidv4(),
            title: " Báo cáo mặt hàng nhà cung cấp",
            children: [
                {
                    id: uuidv4(),
                    name: "Báo cáo chi tiết yêu cầu mua hàng",
                    path: "/report-statistical/purchase-report/purchases",
                },
                {
                    id: uuidv4(),
                    name: "Báo cáo tổng hợp mua hàng",
                    path: "/report-statistical/purchase-report/summary-of-purchases",
                },
                {
                    id: uuidv4(),
                    name: "Báo cáo sổ chi tiết mua hàng",
                    path: "/report-statistical/purchase-report/purchase-details-book",
                },
                {
                    id: uuidv4(),
                    name: "Theo dõi đặt hàng",
                    path: "/report-statistical/purchase-report/order-tracking",
                },
            ],
        },
        {
            id: uuidv4(),
            title: "Báo cáo công nợ nhà cung cấp",
            children: [
                {
                    id: uuidv4(),
                    name: "Báo cáo tổng hợp công nợ phải trả",
                    path: "/report-statistical/purchase-report/summary-of_liabilities",
                },
                {
                    id: uuidv4(),
                    name: "Báo cáo chi tiết công nợ phải trả theo mặt hàng",
                    path: "/report-statistical/purchase-report/debt-by-item",
                },
                {
                    id: uuidv4(),
                    name: "Bảng kê mua hàng",
                    path: "/report-statistical/purchase-report/purchases-list",
                },
            ],
        },
    ];
    // báo cáo tồn kho
    const isNavbarWarehouse = [
        {
            id: uuidv4(),
            title: "Báo cáo tồn kho",
            children: [
                {
                    id: uuidv4(),
                    name: "Thẻ kho",
                    path: "/report-statistical/warehouse-report/card",
                },
                {
                    id: uuidv4(),
                    name: "Báo cáo nhập xuất tồn",
                    path: "/report-statistical/warehouse-report/entry-and-exist"
                },
                {
                    id: uuidv4(),
                    name: "Báo cáo NVL theo kho",
                    path: "/report-statistical/warehouse-report/materials",
                },
                {
                    id: uuidv4(),
                    name: "Báo cáo thành phẩm theo kho",
                    path: "/report-statistical/warehouse-report/products",
                },
            ],
        },
        {
            id: uuidv4(),
            title: "Báo cáo chi tiết các phiếu",
            children: [
                {
                    id: uuidv4(),
                    name: "Báo cáo chi tiết nhập hàng",
                    path: "/report-statistical/warehouse-report/import-goods",
                },
                {
                    id: uuidv4(),
                    name: "Báo cáo chi tiết xuất kho bán hàng",
                    path: "/report-statistical/warehouse-report/warehouse-sell",
                },
                {
                    id: uuidv4(),
                    name: "Báo cáo chi tiết xuất kho sản xuất",
                    path: "/report-statistical/warehouse-report/warehouse-manufacture",
                },
                {
                    id: uuidv4(),
                    name: "Báo cáo chi tiết chuyển kho",
                    path: "/report-statistical/warehouse-report/warehouse-transfer",
                },
                {
                    id: uuidv4(),
                    name: "Báo cáo chi tiết điểu chỉnh",
                    path: "/report-statistical/warehouse-report/adjust",
                },
            ],
        },
    ];
    // tồn quỹ
    const isNavbarFundBalance = [
        {
            id: uuidv4(),
            title: "Thu chi",
            children: [
                {
                    id: uuidv4(),
                    name: "Nhật ký thu",
                    path: "/report-statistical/fund-balance/autumn-diary",
                },
                {
                    id: uuidv4(),
                    name: "Nhật ký chi",
                    path: "/report-statistical/fund-balance/spend-diary",
                },
                {
                    id: uuidv4(),
                    name: "Nhật ký thu chi",
                    path: "/report-statistical/fund-balance/income-expenses",
                },
            ],
        },
        {
            id: uuidv4(),
            title: "Tồn quỹ",
            children: [
                {
                    id: uuidv4(),
                    name: "Tổng hợp tồn quỹ",
                    path: "/report-statistical/fund-balance/synthetic-fund",
                },
                {
                    id: uuidv4(),
                    name: "Sổ quỹ tiền mặt",
                    path: "/report-statistical/fund-balance/cash-fund",
                },
                {
                    id: uuidv4(),
                    name: "Sổ quỹ ngân hàng",
                    path: "/report-statistical/fund-balance/bank-fund",
                },
            ],
        },
        {
            id: uuidv4(),
            title: "Báo cáo chi phí",
            children: [
                {
                    id: uuidv4(),
                    name: "Chi phí",
                    path: "/report-statistical/fund-balance/expense",
                },
            ],
        },
    ];
    // Công nợ phải thu
    const isNavbarReceivables = [
        {
            id: uuidv4(),
            name: "Tổng hợp công nợ phải thu",
            path: "/report-statistical/receivables-debt/aggregate-debt",
        },
        {
            id: uuidv4(),
            name: "Chi tiết công nợ phải thu",
            path: "/report-statistical/receivables-debt/aggregate-debt-detail",
        },
        {
            id: uuidv4(),
            name: "Tổng hợp công nợ phải thu theo nhân viên",
            path: "/report-statistical/receivables-debt/employee-debt",
        },
        {
            id: uuidv4(),
            name: "Bảng đối chiếu công nợ",
            path: "/report-statistical/receivables-debt/debt-comparison-table",
        },
    ];
    // Quản lý sản xuất
    const isNavbarProductionManager = [
        {
            id: uuidv4(),
            name: "Báo cáo định mức NVL",
            path: "/report-statistical/production-manager/quota-materials",
        },
        {
            id: uuidv4(),
            name: "Báo cáo tiến độ theo đơn hàng",
            path: "/report-statistical/production-manager/order-progress",
        },
        {
            id: uuidv4(),
            name: "Báo cáo lệnh sản xuất theo công đoạn",
            path: "/report-statistical/production-manager/stage-production-order",
        },
        {
            id: uuidv4(),
            name: "Báo cáo nguyên liệu sử dụng",
            path: "/report-statistical/production-manager/raw-materials-used",
        },
        {
            id: uuidv4(),
            name: "Báo cáo thời gian sản xuất theo đơn hàng",
            path: "/report-statistical/production-manager/time-order-production",
        },
        {
            id: uuidv4(),
            name: "Báo cáo sản lượng chi tiết",
            path: "/report-statistical/production-manager/detailed-output",
        },
        {
            id: uuidv4(),
            name: "Báo cáo nhập kho thành phẩm",
            path: "/report-statistical/production-manager/import-warehouse-products",
        },
        {
            id: uuidv4(),
            name: "Báo cáo thời gian sản xuất theo sản phẩm",
            path: "/report-statistical/production-manager/time-by-product",
        },
        {
            id: uuidv4(),
            name: "Báo cáo sản xuất tổng hợp",
            path: "/report-statistical/production-manager/synthetic-production",
        },
        {
            id: uuidv4(),
            name: "Báo cáo thời gian sản xuất theo loại sản phẩm",
            path: "/report-statistical/production-manager/time-type-product",
        },
    ];

    const [navbar, setNavbar] = useState([]);

    useEffect(() => {
        const path = router.pathname;
        switch (true) {
            case path.startsWith("/report-statistical/sales-report"):
                setNavbar(isNavbarSales);
                break;
            case path.startsWith("/report-statistical/purchase-report"):
                setNavbar(isNavbarPurchase);
                break;
            case path.startsWith("/report-statistical/warehouse-report"):
                setNavbar(isNavbarWarehouse);
                break;
            case path.startsWith("/report-statistical/fund-balance"):
                setNavbar(isNavbarFundBalance);
                break;
            case path.startsWith("/report-statistical/receivables-debt"):
                setNavbar(isNavbarReceivables);
                break;
            case path.startsWith("/report-statistical/production-manager"):
                setNavbar(isNavbarProductionManager);
                break;
            default:
                break;
        }
    }, [router.pathname]);

    return (
        <ul className="col-span-2 flex flex-col gap-2 3xl:h-[620px] 2xl:max-h-[550px] 2xl:h-[550px] max-h-[550px] h-[550px] rounded-xl w-full list-disc list-inside  bg-[#F7FAFE] 3xl:px-6 3xl:py-4 py-3 px-2 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            {navbar &&
                navbar.map((item) => {
                    return (
                        <React.Fragment key={item.id}>
                            <h1 className="text-xs uppercase 2xl:text-sm">{item.title}</h1>
                            {item.children ? (
                                item.children.map((child) => {
                                    return (
                                        <Link href={child.path} key={child.id} className="relative grid grid-cols-12">
                                            <li
                                                className={`group col-span-12 ${router.pathname === child.path ? "bg-[#3276FA] text-white" : ""
                                                    } font-medium  flex gap-2 3xl:px-4 px-3 py-2  items-center justify-between w-full rounded-lg cursor-pointer hover:bg-[#3276FA] hover:text-white duration-200 ease-in-out transition`}
                                            >
                                                <div className="flex xl:w-[90%] xl:max-w-[90%] w-[85%] max-w-[85%] items-center gap-2">
                                                    <div className="w-[6px] h-[6px] rounded-full bg-[#6C9AC4] group-hover:bg-white" />
                                                    <div className="flex flex-col items-start w-full">
                                                        <div className="w-[95%] max-w-[95%] 3xl:text-base xl:text-sm text-xs ">
                                                            {child.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            {router.pathname === child.path && (
                                                <div className="absolute right-0 -top-1">
                                                    <span className="relative flex w-3 h-3">
                                                        <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-sky-400"></span>
                                                        <span className="relative inline-flex w-3 h-3 rounded-full bg-sky-500"></span>
                                                    </span>
                                                </div>
                                            )}
                                        </Link>
                                    );
                                })
                            ) : (
                                <Link href={item.path} key={item.id} className="relative grid grid-cols-12">
                                    <li
                                        className={`group col-span-12 ${router.pathname === item.path ? "bg-[#3276FA] text-white" : ""
                                            } font-medium  flex gap-2 3xl:px-4 px-3 py-2  items-center justify-between w-full rounded-lg cursor-pointer hover:bg-[#3276FA] hover:text-white duration-200 ease-in-out transition`}
                                    >
                                        <div className="flex xl:w-[90%] xl:max-w-[90%] w-[85%] max-w-[85%] items-center gap-2">
                                            <div className="w-[6px] h-[6px] rounded-full bg-[#6C9AC4] group-hover:bg-white" />
                                            <div className="flex flex-col items-start w-full">
                                                <div className="w-[95%] max-w-[95%] 3xl:text-base xl:text-sm text-xs ">
                                                    {item.name}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    {router.pathname === item.path && (
                                        <div className="absolute right-0 -top-1">
                                            <span className="relative flex w-3 h-3">
                                                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-sky-400"></span>
                                                <span className="relative inline-flex w-3 h-3 rounded-full bg-sky-500"></span>
                                            </span>
                                        </div>
                                    )}
                                </Link>
                            )}
                        </React.Fragment>
                    );
                })}
        </ul>
    );
};
export default Navbar;
