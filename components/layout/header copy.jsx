import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Dropdown, DropdownThongBao } from "../UI/dropdown";

import apiDashboard from "@/Api/apiDashboard/apiDashboard";
import { WARNING_STATUS_ROLE_ADMIN } from "@/constants/warningStatus/warningStatus";
import useToast from "@/hooks/useToast";
import { CookieCore } from "@/utils/lib/cookie";
import Expirred from "components/UI/expired";
import { ArrowUp, ArrowDown2 as IconDown } from "iconsax-react";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import Popup from "reactjs-popup";
import { getColorByParam } from "@/utils/helpers/radomcolor";
import AvatarText from "../UI/common/user/AvatarText";

const Header = () => {
    const router = useRouter();

    const isShow = useToast();

    const dispatch = useDispatch()

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const dataPstWH = useSelector((state) => state.statusUser);
    // Khai báo biến state
    const [currentDropdownIndex, setCurrentDropdownIndex] = useState(0);

    const [isLastDropdown, setIsLastDropdown] = useState(false);

    const ListDanhMuc = [
        {
            title: "Khách hàng",
            sub: [
                {
                    // title: "Khách hàng",
                    // img: "/icon/header/danhmuc/kh.png",
                    items: [
                        {
                            viewOwn: auth?.customers?.is_view_own,
                            view: auth?.customers?.is_view,
                            name: "Danh sách khách hàng",
                            link: "/clients/clients?tab=0",
                        },
                        {
                            name: "Danh sách liên hệ",
                            link: "/clients/contact",
                            // viewOwn: auth?.client_contact?.is_view_own,
                            // view: auth?.client_contact?.is_view,
                            viewOwn: auth?.customers?.is_view_own,
                            view: auth?.customers?.is_view,
                        },
                        {
                            viewOwn: auth?.client_status?.is_view_own,
                            view: auth?.client_status?.is_view,
                            name: "Trạng thái khách hàng",
                            link: "/clients/status-client",
                        },
                        {
                            viewOwn: auth?.client_group?.is_view_own,
                            view: auth?.client_group?.is_view,
                            name: "Nhóm khách hàng",
                            link: "/clients/groups",
                        },
                    ],
                },
            ],
        },
        {
            title: "Nhà cung cấp",
            sub: [
                {
                    // title: "Nhà cung cấp",
                    // img: "/icon/header/danhmuc/ncc.png",
                    items: [
                        {
                            viewOwn: auth?.suppliers?.is_view_own,
                            view: auth?.suppliers?.is_view,
                            name: "Danh sách NCC",
                            link: "/suppliers/supplier",
                        },
                        {
                            // viewOwn: auth?.contacts_suppliers?.is_view_own,
                            // view: auth?.contacts_suppliers?.is_view,
                            viewOwn: auth?.suppliers?.is_view_own,
                            view: auth?.suppliers?.is_view,
                            name: "Danh sách liên hệ NCC",
                            link: "/suppliers/contacts",
                        },
                        // {
                        //     viewOwn: 0,
                        //     view: 0,
                        //     name: "Mặt hàng chủ đạo theo NCC"
                        // },
                        {
                            viewOwn: auth?.suppliers_groups?.is_view_own,
                            view: auth?.suppliers_groups?.is_view,
                            name: "Nhóm nhà cung cấp",
                            link: "/suppliers/groups",
                        },
                    ],
                },
            ],
        },
        {
            title: "NVL, thành phẩm",
            sub: [
                {
                    title: "Nguyên vật liệu",
                    img: "/icon/header/danhmuc/nvl.png",
                    items: [
                        {
                            viewOwn: auth?.material_category?.is_view_own,
                            view: auth?.material_category?.is_view,
                            name: "Nhóm nguyên vật liệu",
                            link: "/items/category",
                        },
                        {
                            viewOwn: auth?.materials?.is_view_own,
                            view: auth?.materials?.is_view,
                            name: "Danh sách nguyên vật liệu",
                            link: "/items",
                        },
                    ],
                },
                {
                    title: "thành phẩm",
                    img: "/icon/header/danhmuc/tp.png",
                    items: [
                        {
                            viewOwn: auth?.category_products?.is_view_own,
                            view: auth?.category_products?.is_view,
                            name: "Nhóm thành phẩm",
                            link: "/products/category",
                        },
                        {
                            viewOwn: auth?.products?.is_view_own,
                            view: auth?.products?.is_view,
                            name: "Danh sách thành phẩm",
                            link: "/products",
                        },
                    ],
                },
            ],
        },
        {
            title: "Nhân sự",
            sub: [
                {
                    // title: "Phòng ban",
                    // img: "/icon/header/danhmuc/nv.png",
                    items: [
                        {
                            viewOwn: 1,
                            view: 1,
                            name: "Danh sách người dùng",
                            link: "/personnel/staff",
                        },
                        {
                            viewOwn: auth?.department?.is_view_own,
                            view: auth?.department?.is_view,
                            name: "Phòng ban",
                            link: "/personnel/departments",
                        },
                        {
                            viewOwn: auth?.position?.is_view_own,
                            view: auth?.position?.is_view,
                            name: "Chức vụ",
                            link: "/personnel/roles",
                        },
                    ],
                },
            ],
        },
    ];

    const ListBanXuatHang = [
        {
            title: "Bán hàng",
            sub: [
                {
                    // title: "Báo giá",
                    items: [
                        {
                            viewOwn: auth?.quotes?.is_view_own,
                            view: auth?.quotes?.is_view,
                            name: "Báo giá",
                            link: "/sales-export-product/price-quote",
                        },
                        {
                            viewOwn: auth?.orders?.is_view_own,
                            view: auth?.orders?.is_view,
                            name: "Đơn hàng bán",
                            link: "/sales-export-product/sales-order",
                        },
                    ],
                },
            ],
        },
        {
            title: "Giao hàng & Trả hàng",
            sub: [
                {
                    // title: "Phiếu giao hàng",
                    // link: "#"
                    items: [
                        {
                            viewOwn: auth?.deliveries?.is_view_own,
                            view: auth?.deliveries?.is_view,
                            name: "Phiếu giao hàng",
                            link: "/sales-export-product/delivery-receipt",
                        },
                        {
                            viewOwn: auth?.returned_goods?.is_view_own,
                            view: auth?.returned_goods?.is_view,
                            name: "Trả lại hàng bán",
                            link: "/sales-export-product/return-sales",
                        },
                    ],
                },
            ],
        },
    ];

    const ListMuaNhapHang = [
        {
            title: "Mua hàng",
            sub: [
                {
                    // title: "Mua hàng",
                    // img: "/icon/header/muanhap/mua.png",
                    items: [
                        {
                            viewOwn: auth?.purchases?.is_view_own,
                            view: auth?.purchases?.is_view,
                            name: "Yêu cầu mua hàng",
                            link: "/purchase-order/purchases",
                        },
                        {
                            viewOwn: auth?.purchase_order?.is_view_own,
                            view: auth?.purchase_order?.is_view,
                            name: "Đơn đặt hàng",
                            link: "/purchase-order/order",
                        },
                        {
                            viewOwn: auth?.services?.is_view_own,
                            view: auth?.services?.is_view,
                            name: "Phiếu dịch vụ",
                            link: "/purchase-order/servicev-voucher",
                        },
                    ],
                },
            ],
        },
        {
            title: "Nhập hàng & trả hàng",
            sub: [
                {
                    // title: "Nhập hàng & trả hàng",
                    // img: "/icon/header/kho/Vector-9.png",
                    items: [
                        {
                            viewOwn: auth?.import?.is_view_own,
                            view: auth?.import?.is_view,
                            name: "Nhập hàng",
                            link: "/purchase-order/import",
                        },
                        {
                            viewOwn: auth?.return_suppliers?.is_view_own,
                            view: auth?.return_suppliers?.is_view,
                            name: "Trả hàng",
                            link: "/purchase-order/returns",
                        },
                    ],
                },
            ],
        },
    ];

    const ListKhoSanXuat = [
        {
            title: "Kho hàng",
            sub: [
                {
                    items: [
                        {
                            viewOwn: auth?.warehouse?.is_view_own,
                            view: auth?.warehouse?.is_view,
                            name: "Kho hàng",
                            link: "/warehouses/warehouse",
                        },
                        {
                            viewOwn: auth?.warehouse_location?.is_view_own,
                            view: auth?.warehouse_location?.is_view,
                            name: "Vị trí kho",
                            link: "/warehouses/location",
                        },
                        {
                            viewOwn: auth?.transfer?.is_view_own,
                            view: auth?.transfer?.is_view,
                            name: "Chuyển kho",
                            link: "/manufacture/warehouse-transfer",
                        },
                        {
                            viewOwn: auth?.suggest_exporting?.is_view_own,
                            view: auth?.suggest_exporting?.is_view,
                            name: "Xuất kho sản xuất",
                            link: "/manufacture/production-warehouse",
                        },
                        {
                            viewOwn: auth?.purchase_products?.is_view_own,
                            view: auth?.purchase_products?.is_view,
                            name: "Nhập kho thành phẩm",
                            link: "/manufacture/products-warehouse",
                        },
                        {
                            viewOwn: auth?.purchase_internal?.is_view_own,
                            view: auth?.purchase_internal?.is_view,
                            name: "Thu hồi nguyên vật liệu",
                            link: "/manufacture/recall",
                        },
                        {
                            viewOwn: auth?.export_different?.is_view_own,
                            view: auth?.export_different?.is_view,
                            name: "Xuất kho khác",
                            link: "/manufacture/export-to-other",
                        },
                        {
                            viewOwn: auth?.inventory?.is_view_own,
                            view: auth?.inventory?.is_view,
                            name: "Kiểm kê kho",
                            link: "/manufacture/inventory",
                        },
                    ],
                },
            ],
        },

        // {
        //     title: "NVL, thành phẩm",
        //     sub: [
        //         {
        //             title: "Nguyên vật liệu",
        //             img: "/icon/header/danhmuc/nvl.png",
        //             items: [
        //                 {
        //                     viewOwn: auth?.material_category?.is_view_own,
        //                     view: auth?.material_category?.is_view,
        //                     name: "Nhóm nguyên vật liệu",
        //                     link: "/items/category",
        //                 },
        //             ],
        //         },
        //         {
        //             title: "thành phẩm",
        //             img: "/icon/header/danhmuc/tp.png",
        //             items: [

        //                 {
        //                     viewOwn: auth?.products?.is_view_own,
        //                     view: auth?.products?.is_view,
        //                     name: "Danh sách thành phẩm",
        //                     link: "/products",
        //                 },
        //             ],
        //         },
        //     ],
        // },
        {
            title: "Sản xuất & QC",
            sub: [
                {
                    title: "Sản xuất",
                    items: [
                        {
                            viewOwn: auth?.internal_plans?.is_view_own,
                            view: auth?.internal_plans?.is_view,
                            name: "Kế hoạch nội bộ",
                            link: "/manufacture/internal-plan",
                        },
                        {
                            viewOwn: auth?.production_plan?.is_view_own,
                            view: auth?.production_plan?.is_view,
                            name: "Kế hoạch sản xuất",
                            link: "/manufacture/production-plan",
                        },
                        {
                            viewOwn: auth?.production_plans_fmrp?.is_view_own,
                            view: auth?.production_plans_fmrp?.is_view,
                            name: "Kế hoạch NVL",
                            link: "/manufacture/materials-planning",
                        },
                        // {
                        //     viewOwn: -1,
                        //     view: -1,
                        //     title: "Điều độ sản xuất",
                        //     link: "/manufacture/production-smoothing",
                        // },
                        // {
                        //     viewOwn: -1,
                        //     view: -1,
                        //     title: "Tổng quan sản xuất",
                        //     link: "/manufacture/production-overview",
                        // },
                        {
                            viewOwn: -1,
                            view: -1,
                            name: "Lệnh sản xuất",
                            link: "/manufacture/productions-orders",
                        },
                        // {
                        //     title: "Lịch sản xuất",
                        //     link: "/manufacture/production-schedule",
                        //     viewOwn: -1,
                        //     view: -1,
                        // },
                    ]
                },
                {
                    title: "QC",
                    items: [
                        {
                            name: "Phiếu kiểm tra chất lượng",
                            viewOwn: -1,
                            view: -1,
                            link: "/manufacture/check-quality",
                        },
                        // {
                        //     name: "Danh mục lỗi",
                        //     link: "/manufacture/category-errors",
                        //     viewOwn: -1,
                        //     view: -1,
                        // },
                        // {
                        //     name: "Chi tiết lỗi",
                        //     link: "/manufacture/category-detail-errors",
                        //     viewOwn: -1,
                        //     view: -1,
                        // },
                    ]
                }
            ],
        },

        // {
        //     title: "Gia công ngoài",
        //     sub: [
        //         {
        //             items: [
        //                 {
        //                     viewOwn: -1,
        //                     view: -1,
        //                     name: "Xuất gia công",
        //                 },
        //                 {
        //                     viewOwn: -1,
        //                     view: -1,
        //                     name: "Nhập gia công",
        //                 },
        //             ],
        //         },
        //     ],
        // },
        // {
        //     title: "QC",
        //     sub: [
        //         {
        //             items: [
        //                 {
        //                     name: "Phiếu kiểm tra chất lượng",
        //                     viewOwn: -1,
        //                     view: -1,
        //                     link: "/manufacture/check-quality",
        //                 },
        //                 // {
        //                 //     name: "Danh mục lỗi",
        //                 //     link: "/manufacture/category-errors",
        //                 //     viewOwn: -1,
        //                 //     view: -1,
        //                 // },
        //                 // {
        //                 //     name: "Chi tiết lỗi",
        //                 //     link: "/manufacture/category-detail-errors",
        //                 //     viewOwn: -1,
        //                 //     view: -1,
        //                 // },
        //             ]
        //         }
        //     ],
        // },
    ];

    const ListKhac = [
        {
            title: "Tiện ích",
            sub: [
                {
                    // title: "Tiện ích",
                    // img: "/icon/header/khac/ti.png",
                    items: [
                        // {
                        //     viewOwn: -1,
                        //     view: -1,
                        //     name: "Yêu cầu khiếu nại",
                        // },
                        // {
                        //     viewOwn: -1,
                        //     view: -1,
                        //     name: "Lịch",
                        // },
                        {
                            viewOwn:
                                auth?.customers?.is_view_own == "1" ||
                                    auth?.suppliers?.is_view_own == "1" ||
                                    auth?.materials?.is_view_own == "1" ||
                                    auth?.products?.is_view_own == "1"
                                    ? "1"
                                    : "0",
                            view:
                                auth?.customers?.is_view == "1" ||
                                    auth?.suppliers?.is_view == "1" ||
                                    auth?.materials?.is_view == "1" ||
                                    auth?.products?.is_view == "1"
                                    ? "1"
                                    : "0",
                            name: "Import dữ liệu",
                            link: "/convenience/import",
                        },
                        {
                            viewOwn:
                                auth?.customers?.is_view_own == "1" ||
                                    auth?.suppliers?.is_view_own == "1" ||
                                    auth?.materials?.is_view_own == "1" ||
                                    auth?.products?.is_view_own == "1"
                                    ? "1"
                                    : "0",
                            view:
                                auth?.customers?.is_view == "1" ||
                                    auth?.suppliers?.is_view == "1" ||
                                    auth?.materials?.is_view == "1" ||
                                    auth?.products?.is_view == "1"
                                    ? "1"
                                    : "0",
                            name: "Export dữ liệu",
                            link: "/convenience/export",
                        },
                    ],
                },
            ],
        },
        // {
        //     title: "Công việc",
        //     sub: [
        //         {
        //             // title: "Công việc",
        //             // img: "/icon/header/khac/cv.png",
        //             items: [
        //                 {
        //                     viewOwn: -1,
        //                     view: -1,
        //                     name: "Danh sách công việc",
        //                 },
        //                 {
        //                     viewOwn: -1,
        //                     view: -1,
        //                     name: "Danh sách kanban",
        //                 },
        //                 {
        //                     viewOwn: -1,
        //                     view: -1,
        //                     name: "Lịch công việc",
        //                 },
        //                 {
        //                     viewOwn: -1,
        //                     view: -1,
        //                     name: "Sơ đồ gant",
        //                 },
        //             ],
        //         },
        //     ],
        // },
    ];

    const ListBaoCao = [
        {
            title: "Báo cáo",
            sub: [
                {
                    // title: "Báo cáo",
                    // img: "/icon/header/khac/bc.png",
                    items: [
                        // {
                        //     viewOwn: -1,
                        //     view: -1,
                        //     name: "Báo cáo QC"
                        // },
                        {
                            viewOwn: -1,
                            view: -1,
                            name: "Báo cáo bán hàng",
                            link: "/report-statistical/sales-report/quote",
                        },
                        {
                            viewOwn: -1,
                            view: -1,
                            name: "Báo cáo mua hàng",
                            link: "/report-statistical/purchase-report/purchases",
                        },
                        {
                            viewOwn: -1,
                            view: -1,
                            name: "Công nợ phải thu",
                            link: "/report-statistical/receivables-debt/aggregate-debt",
                        },
                        {
                            viewOwn: -1,
                            view: -1,
                            name: "Công nợ phải trả",
                        },
                        {
                            viewOwn: -1,
                            view: -1,
                            name: "Tồn quỹ",
                            link: "/report-statistical/fund-balance/autumn-diary",
                        },
                        {
                            viewOwn: -1,
                            view: -1,
                            name: "Tồn kho",
                            link: "/report-statistical/warehouse-report/card",
                        },
                        {
                            viewOwn: -1,
                            view: -1,
                            name: "Quản lý sản xuất",
                            link: "/report-statistical/production-manager/quota-materials",
                        },
                        {
                            viewOwn: -1,
                            view: -1,
                            name: "Báo cáo lợi nhuận",
                            link: "/report-statistical/profit-report",
                        },
                    ],
                },
            ],
        },
    ];

    const ListAdd = [
        {
            sub: [
                {
                    items: [
                        {
                            viewOwn: -1,
                            view: -1,
                            name: "Tạo khách hàng",
                        },
                        {
                            viewOwn: -1,
                            view: -1,
                            name: "Tạo nhà cung cấp",
                        },
                        {
                            viewOwn: -1,
                            view: -1,
                            name: "Tạo yêu cầu mua hàng",
                        },
                        {
                            viewOwn: -1,
                            view: -1,
                            name: "Tạo đơn mua hàng",
                        },
                    ],
                },
            ],
        },
    ];

    const ListQuyTrinh = [
        {
            title: "Quy trình",
            sub: [
                {
                    // title: "Quy trình",
                    // img: "/icon/header/quytrinh/process.svg",
                    items: [
                        {
                            name: "Quy trình sử dụng phần mềm FMRP",
                            link: "/process/use",
                            viewOwn: -1,
                            view: -1,
                        },
                        {
                            name: "Quy trình tổng quan các phân hệ",
                            link: "/process/overview",
                            viewOwn: -1,
                            view: -1,
                        },
                        {
                            name: "Quy trình quản lý sản xuất",
                            link: "/process/manufacture",
                            viewOwn: -1,
                            view: -1,
                        },
                        {
                            name: "Quy trình bán hàng",
                            link: "/process/products",
                            viewOwn: -1,
                            view: -1,
                        },
                        {
                            name: "Quy trình tổng quan bán hàng - Sản xuất",
                            link: "/process/sales",
                            viewOwn: -1,
                            view: -1,
                        },
                        {
                            name: "Quy trình mua hàng - nhập kho",
                            link: "/process/order",
                            viewOwn: -1,
                            view: -1,
                        },
                    ],
                },
            ],
        },
    ];

    const ListThongBao = {
        main: {
            title: "Thông báo",
            type: "thongbao",
        },
        tab: [
            {
                id: 0,
                title: "Danh mục",
                sub: [
                    {
                        title: "Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo",
                        img: "/user-placeholder.jpg",
                        class: "rounded-full",
                        link: "#",
                        time: "01/08/2023",
                    },
                    {
                        title: "Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo",
                        img: "/user-placeholder.jpg",
                        class: "rounded-full",
                        link: "#",
                        time: "01/08/2023",
                    },
                    {
                        title: "Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo",
                        img: "/user-placeholder.jpg",
                        class: "rounded-full",
                        link: "#",
                        time: "01/08/2023",
                    },
                    {
                        title: "Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo",
                        img: "/user-placeholder.jpg",
                        class: "rounded-full",
                        link: "#",
                        time: "01/08/2023",
                    },

                    {
                        title: "Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo",
                        img: "/user-placeholder.jpg",
                        class: "rounded-full",
                        link: "#",
                        time: "01/08/2023",
                    },
                    {
                        title: "Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo",
                        img: "/user-placeholder.jpg",
                        class: "rounded-full",
                        link: "#",
                        time: "01/08/2023",
                    },
                    {
                        title: "Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo",
                        img: "/user-placeholder.jpg",
                        class: "rounded-full",
                        link: "#",
                        time: "01/08/2023",
                    },
                    {
                        title: "Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo",
                        img: "/user-placeholder.jpg",
                        class: "rounded-full",
                        link: "#",
                        time: "01/08/2023",
                    },
                    {
                        title: "Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo",
                        img: "/user-placeholder.jpg",
                        class: "rounded-full",
                        link: "#",
                        time: "01/08/2023",
                    },
                    {
                        title: "Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo",
                        img: "/user-placeholder.jpg",
                        class: "rounded-full",
                        link: "#",
                        time: "01/08/2023",
                    },
                    {
                        title: "Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo",
                        img: "/user-placeholder.jpg",
                        class: "rounded-full",
                        link: "#",
                        time: "01/08/2023",
                    },
                    {
                        title: "Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo",
                        img: "/user-placeholder.jpg",
                        class: "rounded-full",
                        link: "#",
                        time: "01/08/2023",
                    },
                    {
                        title: "Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo",
                        img: "/user-placeholder.jpg",
                        class: "rounded-full",
                        link: "#",
                        time: "01/08/2023",
                    },
                ],
                link: "#",
                more: "Xem tất cả thông báo",
                total: 10,
                type: "",
            },
            {
                id: 1,
                title: "Bán & Xuất hàng",
                sub: [
                    {
                        title: "Kho Hà Nội vừa được xuất kho 1,000 mặt hàng",
                        img: "/user-placeholder.jpg",
                        class: "rounded-full",
                        link: "#",
                        time: "01/08/2023",
                    },
                    {
                        title: "Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo",
                        img: "/user-placeholder.jpg",
                        class: "rounded-full",
                        link: "#",
                        time: "01/08/2023",
                    },
                ],
                link: "#",
                more: "Xem tất cả thông báo",
                total: 12,
                type: "",
            },
            {
                id: 2,
                title: "Mua & Nhập hàng",
                sub: [],
                link: "#",
                more: "Xem tất cả thông báo",
                total: 11,
                type: "",
            },
            {
                id: 3,
                title: "Kho & Sản xuất",
                sub: [],
                link: "#",
                more: "Xem tất cả thông báo",
                total: 13,
                type: "",
            },
            {
                id: 4,
                title: "Báo cáo & Thống kê",
                sub: [],
                link: "#",
                more: "Xem tất cả thông báo",
                total: 14,
                type: "",
            },
            {
                id: 5,
                title: "Tiện ích",
                sub: [],
                link: "#",
                more: "Xem tất cả thông báo",
                total: 15,
                type: "",
            },
            {
                id: 6,
                title: "Khác",
                sub: [],
                link: "#",
                more: "Xem tất cả thông báo",
                total: 16,
                type: "",
            },
            {
                id: 7,
                title: "Đọc tất cả",
                sub: [
                    {
                        title: "Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo",
                        img: "/user-placeholder.jpg",
                        class: "rounded-full",
                        link: "#",
                        time: "01/08/2023",
                    },
                    {
                        title: "Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo",
                        img: "/user-placeholder.jpg",
                        class: "rounded-full",
                        link: "#",
                        time: "01/08/2023",
                    },
                    {
                        title: "Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo",
                        img: "/user-placeholder.jpg",
                        class: "rounded-full",
                        link: "#",
                        time: "01/08/2023",
                    },
                    {
                        title: "Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo",
                        img: "/user-placeholder.jpg",
                        class: "rounded-full",
                        link: "#",
                        time: "01/08/2023",
                    },
                    {
                        title: "Admin số lệnh sản xuất LSX thuộc đơn SO vừa được nhân viên Mạnh Trần tạo",
                        img: "/user-placeholder.jpg",
                        class: "rounded-full",
                        link: "#",
                        time: "01/08/2023",
                    },
                ],
                link: "#",
                more: "Xem tất cả thông báo",
                total: 17,
                type: "all",
            },
        ],
    };

    const ListKeToan = [
        {
            title: "Công nợ bán",
            sub: [
                {
                    // title: "Công nợ bán",
                    // img: "/icon/header/banxuat/cnb.png",
                    items: [
                        {
                            viewOwn: auth?.other_payslips_coupon?.is_view_own,
                            view: auth?.other_payslips_coupon?.is_view,
                            name: "Phiếu thu",
                            link: "/accountant/receipts",
                        },
                        {
                            viewOwn: auth?.customer_debt?.is_view_own,
                            view: auth?.customer_debt?.is_view,
                            name: "Công nợ khách hàng",
                            link: "/accountant/customer-debt",
                        },
                    ],
                },
            ],
        },
        {
            title: "Công nợ mua",
            sub: [
                {
                    // title: "Công nợ mua",
                    // img: "/icon/header/muanhap/cnm.png",
                    items: [
                        {
                            viewOwn: auth?.other_payslips?.is_view_own,
                            view: auth?.other_payslips?.is_view,
                            name: "Phiếu chi",
                            link: "/accountant/payment",
                        },
                        {
                            viewOwn: auth?.supplier_debt?.is_view_own,
                            view: auth?.supplier_debt?.is_view,
                            name: "Công nợ nhà cung cấp",
                            link: "/accountant/debt-suppliers",
                        },
                    ],
                },
            ],
        },
    ];

    const dropdowns = [
        {
            data: ListDanhMuc,
            position: "bottom left",
            className: "popover-bottom-left arrow-danhmuc",
            title: "Danh mục",
            text: "Quản lý các model Khách hàng, nhà cung cấp, NVL, thành phẩm, nhân sự",
        },
        {
            data: ListBanXuatHang,
            position: "bottom left",
            className: "popover-bottom-left arrow-banxuathang",
            text: "Quản lý các model bán hàng, giao hàng",
            title: "Bán & Xuất hàng",
        },
        {
            data: ListMuaNhapHang,
            position: "bottom left",
            className: "popover-bottom-left-muanhaphang arrow-muanhaphang",
            title: "Mua & Nhập hàng",
            text: "Quản lý các model mua, nhập, trả hàng",
        },

        {
            data: ListKhoSanXuat,
            // position: "",
            className: "popover-khosanxuat",
            title: "Kho & Sản xuất",
            text: "Quản lý các model kho, sản xuất, gia công, QC",
        },
        {
            data: ListKeToan,
            position: "bottom left",
            className: "popover-bottom-left-muanhaphang arrow-muanhaphang",
            title: "Kế toán",
            text: "Quản lý các model công nợ",
        },
        {
            data: ListBaoCao,
            position: "bottom left",
            className: "",
            title: "Báo cáo & Thống kê",
            text: "Quản lý các báo cáo, thống kê",
        },
        {
            data: ListKhac,
            className: "popover-khac",
            text: "Quản lý các tiện ích, công việc",
            title: "Tiện ích",
        },
        // {
        //     data: ListAdd,
        //     position: "bottom center",
        //     text: "Thêm mới",
        //     className: "",
        //     title: "+ Thêm",
        // },
    ];

    useEffect(() => {
        setIsLastDropdown(currentDropdownIndex === dropdowns.length - 1);
    }, [currentDropdownIndex, dropdowns.length]);

    useEffect(() => {
        if (dataPstWH) {
            // Ẩn phần tử hiện tại
            // Kiểm tra xem nó có phải là cuối cùng hay không
            if (isLastDropdown) {
                setTimeout(() => {
                    setCurrentDropdownIndex(0);
                    setIsLastDropdown(false);
                    dispatch({
                        type: "status/user",
                        payload: false,
                    });
                }, 3000);
            } else {
                // Sau 3000ms, hiển thị phần tử tiếp theo
                const timer = setTimeout(() => {
                    setCurrentDropdownIndex((prevIndex) => (prevIndex + 1) % dropdowns.length);
                }, 3000);

                return () => {
                    clearTimeout(timer);
                };
            }

        }
    }, [dataPstWH, isLastDropdown, dropdowns.length, currentDropdownIndex]);

    const currentDropdown = dropdowns[currentDropdownIndex];

    return (
        <header className="z-40 w-full bg-[#003DA0] fixed top-0 3xl:h-[74px] 2xl:h-16 xl:h-14 lg:h-12">
            {/* <header className="z-40 w-full bg-[#013da0] fixed top-0 3xl:h-[74px] 2xl:h-16 xl:h-14 lg:h-12"> */}
            <div className="flex items-center justify-between 3xl:mx-6 2xl:mx-4 mx-5 3xl:py-4 2xl:py-3.5 xl:py-2.5 py-1.5">
                <div className="flex items-center space-x-2 3xl:space-x-6 2xl:space-x-4 xl:space-x-4">
                    <Link href="/" className="relative mr-5 2xl:mr-6">
                        <Image
                            alt=""
                            src="/LOGO_HEADER.png"
                            width={100}
                            height={45}
                            quality={100}
                            className="3xl:w-[110px] 2xl:w-[100px] xl:w-[90px] w-[70px] h-auto object-contain"
                            loading="lazy"
                            crossOrigin="anonymous"
                            placeholder="blur"
                            blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                        />
                        <div
                            style={{
                                background: `radial-gradient(45.83% 94.64% at 93.75% 3.57%, #1FC583 0%, #1F9285 100%)`,
                                boxShadow: `1px 1px 2px 0px #00000040`
                            }}
                            className="px-1.5 py-0.5 text-[8px] font-semibold text-white rounded-sm w-fit absolute top-0 right-0 translate-x-[110%]"
                        >
                            Beta
                        </div>
                    </Link>

                    {
                        dropdowns.map((dropdown, index) => (
                            <React.Fragment key={index}>
                                <Tooltip
                                    titleClassName="custom-title-class"
                                    trigger="manual"
                                    html={
                                        <React.Fragment>
                                            <div className="w-auto h-auto rounded-lg ">
                                                <div className="flex items-center justify-center rounded-lg">
                                                    <ArrowUp
                                                        size="32"
                                                        color="green"
                                                        className="rotate-45 animate-pulse "
                                                    />
                                                    <h2 className="px-3 py-2 font-semibold text-justify text-black ">
                                                        {dropdown.text}
                                                    </h2>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    }
                                    title={dropdown.text}
                                    open={dataPstWH && index === currentDropdownIndex}
                                    position="bottom"
                                    animation="perspective"
                                    size="regular"
                                    theme="light"
                                    arrow={true}
                                >
                                    <Dropdown
                                        data={dropdown.data}
                                        position={dropdown.position}
                                        className={dropdown.className}
                                        style={dataPstWH}
                                    >
                                        {dropdown.title}
                                    </Dropdown>
                                </Tooltip>
                            </React.Fragment>
                        ))
                    }
                </div>

                <div className="flex items-center gap-4">
                    <form className="relative flex items-center">
                        <div className="w-[16px] h-[16px] min-w-[16px] min-h-[16px] absolute left-3">
                            <Image
                                alt=""
                                src="/icon/header/timkiem.png"
                                width={24}
                                height={18}
                                quality={100}
                                className="object-contain w-full h-full"
                                loading="lazy"
                                crossOrigin="anonymous"
                                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                            />
                        </div>
                        <input
                            className="3xl:w-64 2xl:w-44 xxl:w-40 xl:w-32 lg:w-28 3xl:h-10 2xl:h-9 xl:h-8 lg:h-7 3xl:placeholder:text-base 2xl:placeholder:text-[14px] xl:placeholder:text-[12px] lg:placeholder:text-[10px] placeholder:text-white/50 text-[#ffffff] relative bg-[#ffffff1a] hover:bg-[#ffffff25] focus:bg-[#ffffff25] outline-none pl-10 pr-5 py-2 rounded-md"
                            type="text"
                            placeholder="Tìm kiếm"
                        />
                    </form>

                    <button
                        title="Cài đặt"
                        onClick={() => {
                            if (role) {
                                router.push("/settings");
                            } else {
                                isShow("error", WARNING_STATUS_ROLE_ADMIN);
                            }
                        }}
                        className=""
                    >
                        <Image
                            alt=""
                            src="/icon/header/right/seting.png"
                            width={18}
                            height={18}
                            quality={100}
                            className="object-contain w-[18px] h-[18px] min-w-[18px] min-h-[18px] transition"
                            loading="lazy"
                            crossOrigin="anonymous"
                            blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                        />
                    </button>

                    <Dropdown data={ListQuyTrinh} className="popover-quytrinh" position={"bottom right"} >
                        <Image
                            alt=""
                            src="/icon/header/right/quytrinh.png"
                            width={18}
                            height={18}
                            quality={100}
                            className="object-contain w-[17px] h-[17px] min-w-[17px] min-h-[17px] transition"
                            loading="lazy"
                            crossOrigin="anonymous"
                            blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                        />
                    </Dropdown>

                    <button
                        title="Góp ý"
                        onClick={() => {
                            dispatch({
                                type: "statePopupRecommendation",
                                payload: {
                                    open: true
                                }
                            })
                        }}
                        className=""
                    >
                        <Image
                            alt=""
                            src="/icon/header/right/gopy.png"
                            width={18}
                            height={18}
                            quality={100}
                            className="object-contain w-[17px] h-[17px] min-w-[17px] min-h-[17px] transition"
                            loading="lazy"
                            crossOrigin="anonymous"
                            blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                        />
                    </button>

                    <Link
                        href="#"
                        title="Thông báo"
                        className=""
                    >
                        <DropdownThongBao
                            data={[] || ListThongBao}
                            className="popover-thongbao"
                            position={"bottom right"}
                        >
                            <Image
                                alt=""
                                src="/icon/header/right/thongbao.png"
                                width={18}
                                height={18}
                                quality={100}
                                className="object-contain w-[17px] h-[17px] min-w-[17px] min-h-[17px] transition"
                                loading="lazy"
                                crossOrigin="anonymous"
                                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                            />
                            {/* <div className="3xl:text-[9px] 2xl:text-[9px] xl:text-[9px] text-[9px] bg-red-500 3xl:h-3.5 3xl:w-3.5 2xl:h-3.5 2xl:w-3.5 xl:h-3.5 xl:w-3.5 lg:h-3.5 lg:w-3.5 rounded-full absolute top-0 right-0 3xl:translate-x-1 3xl:-translate-y-1 2xl:translate-x-1 2xl:-translate-y-1 xl:translate-x-1 xl:-translate-y-1 translate-x-1 -translate-y-1 flex flex-col items-center justify-center text-white font-medium">
                                    2
                                </div> */}
                        </DropdownThongBao>
                    </Link>

                    <Link
                        href="https://help.fmrp.vn"
                        target="_blank"
                        className=""
                        title="Hướng dẫn phần mềm"
                    >
                        <Image
                            alt=""
                            src="/icon/header/right/question.png"
                            width={18}
                            height={18}
                            quality={100}
                            className="object-contain w-[19px] h-[19px] min-w-[19px] min-h-[19px] transition"
                            loading="lazy"
                            crossOrigin="anonymous"
                            blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                        />
                    </Link>

                    <DropdownAvatar />
                </div>
            </div>
            {/* <div className="px-10 py-0 pt-1 overflow-x-auto">
                <Expirred />
            </div> */}
        </header>
    );
};

const DropdownAvatar = React.memo(() => {
    const auth = useSelector((state) => state.auth);

    const randomColors = getColorByParam(auth?.user_full_name)

    const router = useRouter();

    const dispatch = useDispatch();

    const [onSending, sOnSending] = useState(false);

    const _ServerSending = async () => {
        try {
            const res = await apiDashboard.apiLogOut();
            dispatch({ type: "auth/update", payload: false });
            CookieCore.remove("tokenFMRP");
            CookieCore.remove("databaseappFMRP");
            router.push("/auth/login");
            sOnSending(false);
        } catch (error) {

        }
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    const _HandleLogout = () => {
        sOnSending(true);
    };

    ///languages
    const data = useSelector((state) => state.availableLang);

    const defaultLang = useSelector((state) => state.lang);

    const [lang, sLang] = useState(defaultLang);

    const _HandleChangeLang = (e) => sLang(e.target?.value);

    useEffect(() => {
        dispatch({ type: "lang/update", payload: lang });
        localStorage.setItem("LanguagesFMRP", lang);
    }, [lang]);

    return (
        <React.Fragment>
            <Popup
                trigger={
                    <button className={`hover:drop-shadow-[0_0_5px_#eabd7a99]`}>
                        <div className="flex items-center self-center space-x-1 ">
                            {auth?.user_avatar !== null ? (
                                <Image
                                    alt=""
                                    src={auth?.user_avatar}
                                    width={40}
                                    height={40}
                                    quality={100}
                                    className="object-cover min-w-[30px] w-[30px] min-h-[30px] h-[30px] rounded-full"
                                    loading="lazy"
                                    crossOrigin="anonymous"
                                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                />

                            ) : (
                                <AvatarText
                                    fullName={auth?.user_full_name}
                                    className={'!min-w-[30px] !min-h-[30px] !w-[30px] !h-[30px] !max-w-[30px] !max-h-[30px]'}
                                />
                                // <Image
                                //     alt=""
                                //     src={"/avatar_null.png"}
                                //     width={40}
                                //     height={40}
                                //     quality={100}
                                //     className="object-cover min-w-[30px] w-[30px] min-h-[30px] h-[30px] rounded-full"
                                //     loading="lazy"
                                //     crossOrigin="anonymous"
                                //     blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                // />
                            )}
                            <Image
                                alt=""
                                src="/icon/header/dropdown.png"
                                width={12}
                                height={12}
                                quality={100}
                                className="object-cover"
                                loading="lazy"
                                crossOrigin="anonymous"
                                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                            />
                        </div>
                    </button>
                }
                closeOnDocumentClick
                // arrow={props.position}
                on={["hover"]}
                position="bottom right"
                className={`popover-edit `}
            >
                <div className="w-[300px]">
                    <div className="justify-between bg-white rounded">
                        <div className="flex space-x-3 px-3 py-3.5 border-b border-[#F2F4F7]">
                            <div className="h-fit min-w-[40px] relative border border-gray-300 rounded-full">
                                {
                                    auth?.user_avatar !== null ?
                                        (
                                            <Image
                                                alt=""
                                                src={auth?.user_avatar}
                                                width={40}
                                                height={40}
                                                quality={100}
                                                className="object-cover min-w-[40px] min-h-[40px] w-[40px] h-[40px] max-w-[40px] max-h-[40px] rounded-full"
                                                loading="lazy"
                                                crossOrigin="anonymous"
                                                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                            />
                                        )
                                        :
                                        (
                                            // <Image
                                            //     alt=""
                                            //     src={"/avatar_null.png"}
                                            //     width={40}
                                            //     height={40}
                                            //     quality={100}
                                            //     className="object-cover min-w-[40px] min-h-[40px] w-[40px] h-[40px] max-w-[40px] max-h-[40px] rounded-full"
                                            //     loading="lazy"
                                            //     crossOrigin="anonymous"
                                            //     blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                            // />
                                            <AvatarText
                                                fullName={auth?.user_full_name}
                                                className={'!min-w-[40px] !min-h-[40px] !w-[40px] !h-[40px] !max-w-[40px] !max-h-[40px]'}
                                            />

                                        )
                                }
                                <div className="bg-green-500 w-2.5 h-2.5 rounded-full absolute bottom-0 right-1" />
                            </div>
                            <div>
                                <h5 className="font-semibold text-sm text-[#141522]">{auth?.user_full_name}</h5>
                                <h6 className="text-[#9295A4] font-normal text-sm ">{auth?.user_email}</h6>
                            </div>
                        </div>
                        <div className="">
                            <button
                                onClick={() => {
                                    dispatch({
                                        type: "statePopupAccountInformation",
                                        payload: {
                                            open: true
                                        }
                                    })
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-[#F7F8F9] flex items-center space-x-2 outline-none"
                            >
                                <Image
                                    alt=""
                                    src="/icon/header/avatar/user.png"
                                    width={20}
                                    height={20}
                                    quality={100}
                                    className="object-cover"
                                    loading="lazy"
                                    crossOrigin="anonymous"
                                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                />
                                <span>Thông tin tài khoản</span>
                            </button>
                            <button
                                onClick={() => {
                                    dispatch({
                                        type: "statePopupChangePassword",
                                        payload: {
                                            open: true
                                        }
                                    })
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-[#F7F8F9] flex items-center space-x-2"
                            >
                                <Image
                                    alt=""
                                    src="/icon/header/avatar/pas.png"
                                    width={20}
                                    height={20}
                                    quality={100}
                                    className="object-cover"
                                    loading="lazy"
                                    crossOrigin="anonymous"
                                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                />
                                <span>Đổi mật khẩu</span>
                            </button>
                            {/* <button className="w-full text-left px-4 py-2.5 hover:bg-[#F7F8F9] flex items-center space-x-2">
                                <Image
                                    alt=""
                                    src="/icon/header/avatar/inbox.png"
                                    width={20}
                                    height={20}
                                    quality={100}
                                    className="object-cover"
                                    loading="lazy"
                                    crossOrigin="anonymous"
                                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                />
                                <span>Góp ý</span>
                            </button> */}
                            {/* <button className="w-full text-left px-4 py-2.5 hover:bg-[#F7F8F9] flex items-center space-x-2">
                                <Image
                                    alt=""
                                    src="/icon/header/avatar/usermore.png"
                                    width={20}
                                    height={20}
                                    quality={100}
                                    className="object-cover"
                                    loading="lazy"
                                    crossOrigin="anonymous"
                                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                />
                                <span>Giới thiệu - Tích điểm</span>
                            </button>
                             */}
                            {/* <div className="flex px-4 py-2.5 justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <Image
                                        alt=""
                                        src="/icon/header/avatar/lang.png"
                                        width={20}
                                        height={20}
                                        quality={100}
                                        className="object-cover"
                                        loading="lazy"
                                        crossOrigin="anonymous"
                                        blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                    />
                                    <h6>Ngôn ngữ</h6>
                                </div>
                                <div className="relative flex items-center bg-[#F7F8F9]">
                                    <select
                                        onChange={_HandleChangeLang.bind(this)}
                                        value={lang}
                                        className="z-[2] text-[#141522] appearance-none inline-block rounded leading-tight pl-4 pr-8 py-2.5 text-sm w-fit outline-none bg-transparent"
                                    >
                                        {data.map((e, i) => (
                                            <option key={i} value={e.code}>
                                                {e.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-2 z-[1]">
                                        <IconDown size={15} />
                                    </div>
                                </div>
                            </div> */}
                            <button
                                onClick={_HandleLogout.bind(this)}
                                className="w-full text-left px-4 py-2.5 hover:bg-[#F7F8F9] flex items-center space-x-2"
                            >
                                <Image
                                    alt=""
                                    src="/icon/header/avatar/out.png"
                                    width={20}
                                    height={20}
                                    quality={100}
                                    className="object-cover"
                                    loading="lazy"
                                    crossOrigin="anonymous"
                                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                />
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Popup>
        </React.Fragment>
    );
});

export default Header;
