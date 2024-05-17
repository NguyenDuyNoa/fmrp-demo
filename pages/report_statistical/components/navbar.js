import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
const Navbar = (props) => {
    const router = useRouter()

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

    const [navbar, setNavbar] = useState([])

    useEffect(() => {
        if (router.pathname.startsWith("/report_statistical/sales_report")) {
            setNavbar(isNavbarSales)
        }
        if (router.pathname.startsWith("/report_statistical/purchase_report")) {
            setNavbar(isNavbarPurchase)
        }

    }, [router.pathname])


    return (
        <ul className='col-span-2 3xl:h-[620px] 2xl:max-h-[550px] 2xl:h-[550px] max-h-[550px] h-[550px] rounded-xl w-full list-disc list-inside flex flex-col gap-2 bg-[#F7FAFE] 3xl:px-6 3xl:py-4 py-3 px-2 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'>
            {
                navbar && navbar.map((item) => {
                    return (
                        <>
                            <h1 className="text-sm">{item.title}</h1>
                            {item.children ?
                                item.children.map((child) => {
                                    return (

                                        <Link href={child.path} key={child.id} className="grid grid-cols-12 relative">
                                            <li className={`group col-span-12 ${router.pathname === child.path ? "bg-[#3276FA] text-white" : ""} font-medium  flex gap-2 3xl:px-4 px-3 py-2  items-center justify-between w-full rounded-lg cursor-pointer hover:bg-[#3276FA] hover:text-white duration-200 ease-in-out transition`}
                                            >
                                                <div className='flex xl:w-[90%] xl:max-w-[90%] w-[85%] max-w-[85%] items-center gap-2'>
                                                    <div className='w-[6px] h-[6px] rounded-full bg-[#6C9AC4]' />
                                                    <div className="flex flex-col items-start w-full">
                                                        <div className='w-[95%] max-w-[95%] 3xl:text-base xl:text-sm text-xs '>
                                                            {child.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            {router.pathname === child.path &&
                                                <div className="absolute right-0 -top-1">
                                                    <span class="relative flex h-3 w-3">
                                                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                                        <span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
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
                                            <div className='w-[6px] h-[6px] rounded-full bg-[#6C9AC4]' />
                                            <div className="flex flex-col items-start w-full">
                                                <div className='w-[95%] max-w-[95%] 3xl:text-base xl:text-sm text-xs '>
                                                    {item.name}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    {router.pathname === item.path &&
                                        <div className="absolute right-0 -top-1">
                                            <span class="relative flex h-3 w-3">
                                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                                <span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                            </span>
                                        </div>
                                    }
                                </Link>
                            }
                        </>
                    )
                })
            }
        </ul>
    )
}
export default Navbar