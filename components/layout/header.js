import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";

import { Dropdown, DropdownThongBao } from "../UI/dropdown";
import { _ServerInstance as Axios } from "/services/axios";

import Popup from "reactjs-popup";
import { ArrowUp, ArrowDown2 as IconDown } from "iconsax-react";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import Expirred from "components/UI/expired";
import PopupModelTime from "components/UI/modelTime";

const Header = () => {
    const ListDanhMuc = [
        {
            title: "Khách hàng",
            sub: [
                {
                    title: "Khách hàng",
                    img: "/icon/header/danhmuc/kh.png",
                    items: [
                        {
                            name: "Danh sách khách hàng",
                            link: "/clients/clients",
                        },
                        { name: "Danh sách liên hệ", link: "/clients/contact" },
                        {
                            name: "Trạng thái khách hàng",
                            link: "/clients/statusClient",
                        },
                        { name: "Nhóm khách hàng", link: "/clients/groups" },
                    ],
                },
            ],
        },
        {
            title: "Nhà cung cấp",
            sub: [
                {
                    title: "Nhà cung cấp",
                    img: "/icon/header/danhmuc/ncc.png",
                    items: [
                        { name: "Danh sách NCC", link: "/suppliers/supplier" },
                        {
                            name: "Danh sách liên hệ NCC",
                            link: "/suppliers/contacts",
                        },
                        { name: "Mặt hàng chủ đạo theo NCC" },
                        {
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
                            name: "Nhóm nguyên vật liệu",
                            link: "/items/category",
                        },
                        { name: "Danh sách nguyên vật liệu", link: "/items" },
                    ],
                },
                {
                    title: "thành phẩm",
                    img: "/icon/header/danhmuc/tp.png",
                    items: [
                        { name: "Nhóm thành phẩm", link: "/products/category" },
                        { name: "Danh sách thành phẩm", link: "/products" },
                    ],
                },
            ],
        },
        {
            title: "Nhân sự",
            sub: [
                {
                    title: "Phòng ban",
                    img: "/icon/header/danhmuc/nv.png",
                    items: [
                        {
                            name: "Danh sách người dùng",
                            link: "/personnel/staff",
                        },
                        { name: "Phòng ban", link: "/personnel/departments" },
                        { name: "Chức vụ", link: "/personnel/roles" },
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
                            name: "Báo giá",
                            link: "/sales_export_product/priceQuote",
                        },
                        {
                            name: "Đơn hàng bán",
                            link: "/sales_export_product/salesOrder",
                        },
                        {
                            name: "Trả lại hàng bán",
                            link: "/sales_export_product/returnSales",
                        },
                    ],
                },
            ],
        },
        {
            title: "Giao hàng",
            sub: [
                {
                    // title: "Phiếu giao hàng",
                    // link: "#"
                    items: [
                        {
                            name: "Phiếu giao hàng",
                            link: "/sales_export_product/deliveryReceipt",
                        },
                    ],
                },
            ],
        },
        {
            title: "Công nợ bán",
            sub: [
                {
                    title: "Công nợ bán",
                    img: "/icon/header/banxuat/cnb.png",
                    items: [
                        { name: "Hóa đơn bán hàng" },
                        { name: "Phiếu thu bán hàng" },
                        { name: "Công nợ khách hàng" },
                        { name: "Phiếu thu khác" },
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
                    title: "Mua hàng",
                    img: "/icon/header/muanhap/mua.png",
                    items: [
                        {
                            name: "Yêu cầu mua hàng",
                            link: "/purchase_order/purchases",
                        },
                        { name: "Đơn đặt hàng", link: "/purchase_order/order" },
                        {
                            name: "Phiếu dịch vụ",
                            link: "/purchase_order/serviceVoucher",
                        },
                    ],
                },
            ],
        },
        {
            title: "Nhập hàng & trả hàng",
            sub: [
                {
                    title: "Nhập hàng & trả hàng",
                    img: "/icon/header/kho/Vector-9.png",
                    items: [
                        { name: "Nhập hàng", link: "/purchase_order/import" },
                        { name: "Trả hàng", link: "/purchase_order/returns" },
                    ],
                },
            ],
        },
        {
            title: "Công nợ mua",
            sub: [
                {
                    title: "Công nợ mua",
                    img: "/icon/header/muanhap/cnm.png",
                    items: [
                        { name: "Phiếu chi", link: "/purchase_order/payment" },
                        {
                            name: "Công nợ nhà cung cấp",
                            link: "/purchase_order/debt_suppliers",
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
                    title: "Kho hàng",
                    img: "/icon/header/kho/kho.png",
                    items: [
                        { name: "Kho", link: "/warehouses/warehouse" },
                        { name: "Vị trí kho", link: "/warehouses/location" },
                    ],
                },
                {
                    title: "Cảnh báo tồn kho",
                    img: "/icon/header/kho/canhbao.png",
                    link: "#",
                },
                {
                    title: "Chuyển kho",
                    img: "/icon/header/kho/chuyenkho.png",
                    link: "#",
                },
                {
                    title: "Xuất kho sản xuất",
                    img: "/icon/header/kho/xuatkho.png",
                    link: "/manufacture/production_warehouse",
                },
                {
                    title: "Nhập kho thành phẩm",
                    img: "/icon/header/kho/nhapkho.png",
                    link: "/manufacture/productsWarehouse",
                },
                {
                    title: "Thu hồi nguyên vật liệu",
                    img: "/icon/header/kho/thuhoi.png",
                    link: "/manufacture/recall",
                },
                {
                    title: "Xuất kho khác",
                    img: "/icon/header/kho/xuatkho.png",
                    link: "#",
                },
                {
                    title: "Kiểm kê kho",
                    img: "/icon/header/kho/kk.png",
                    link: "/inventory",
                },
            ],
        },
        {
            title: "Sản xuất",
            sub: [
                {
                    title: "Kế hoạch nội bộ",
                    img: "/icon/header/kho/kehoach.png",
                    link: "#",
                },
                {
                    title: "Kế hoạch sản xuất",
                    img: "/icon/header/kho/kehoach.png",
                    link: "#",
                },
                {
                    title: "Kế hoạch NVL",
                    img: "/icon/header/kho/kehoach.png",
                    link: "#",
                },
                {
                    title: "Điều độ sản xuất",
                    img: "/icon/header/kho/dieudo.png",
                    link: "#",
                },
                {
                    title: "Sản xuất",
                    img: "/icon/header/kho/sx.png",
                    items: [
                        { name: "Lệnh sản xuất tổng" },
                        { name: "Lệnh sản xuất chi tiết" },
                    ],
                },
                {
                    title: "Cảnh báo tồn kho",
                    img: "/icon/header/kho/canhbao.png",
                    link: "#",
                },
                {
                    title: "Lịch sản xuất",
                    img: "/icon/header/kho/lich.png",
                    link: "#",
                },
                {
                    title: "Năng suất sản lượng",
                    img: "/icon/header/kho/nssl.png",
                    link: "#",
                },
            ],
        },
        {
            title: "Xuất gia công",
            sub: [
                {
                    title: "Xuất gia công",
                    img: "/icon/header/khac/xgc.png",
                    items: [
                        { name: "Xuất gia công" },
                        { name: "Nhập gia công" },
                    ],
                },
            ],
        },
        {
            title: "QC",
            sub: [
                {
                    title: "Kiểm tra chất lượng",
                    img: "/icon/header/kho/kt.png",
                    link: "#",
                },
                {
                    title: "Danh mục lỗi",
                    img: "/icon/header/kho/dml.png",
                    link: "#",
                },
                {
                    title: "Điều độ sản xuất",
                    img: "/icon/header/kho/dieudo.png",
                    link: "#",
                },
                {
                    title: "Chi tiết lỗi",
                    img: "/icon/header/kho/ctl.png",
                    link: "#",
                },
            ],
        },
    ];

    const ListKhac = [
        {
            title: "Tiện ích",
            sub: [
                {
                    title: "Tiện ích",
                    img: "/icon/header/khac/ti.png",
                    items: [
                        { name: "Yêu cầu khiếu nại" },
                        { name: "Lịch" },
                        { name: "Import dữ liệu", link: "/import" },
                    ],
                },
            ],
        },
        {
            title: "Công việc",
            sub: [
                {
                    title: "Công việc",
                    img: "/icon/header/khac/cv.png",
                    items: [
                        { name: "Danh sách công việc" },
                        { name: "Danh sách kanban" },
                        { name: "Lịch công việc" },
                        { name: "Sơ đồ gant" },
                    ],
                },
            ],
        },
    ];

    const ListBaoCao = [
        {
            title: "Báo cáo",
            sub: [
                {
                    title: "Báo cáo",
                    img: "/icon/header/khac/bc.png",
                    items: [
                        { name: "Báo cáo QC" },
                        { name: "Báo cáo bán hàng" },
                        { name: "Báo cáo mua hàng" },
                        { name: "Công nợ phải thu" },
                        { name: "Tồn quỷ" },
                        { name: "Tồn kho" },
                        { name: "Quản lý sản xuất" },
                        { name: "Báo cáo lợi nhuận" },
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
                        { name: "Tạo khách hàng" },
                        { name: "Tạo nhà cung cấp" },
                        { name: "Tạo yêu cầu mua hàng" },
                        { name: "Tạo đơn mua hàng" },
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
                    title: "Quy trình",
                    img: "/icon/header/quytrinh/process.svg",
                    items: [
                        {
                            name: "Quy trình sử dụng phần mềm FMRP",
                            link: "/process",
                        },
                        {
                            name: "Quy trình quản lý sản xuất",
                            link: "/process_manufacture",
                        },
                        {
                            name: "Quy trình bán hàng",
                            link: "/process_products",
                        },
                        {
                            name: "Quy trình tổng quan bán hàng - Sản xuất",
                            link: "/process_sales",
                        },
                        {
                            name: "Quy trình mua hàng - nhập kho",
                            link: "/process_order",
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
            text: "Quản lý các model bán hàng, giao hàng, công nợ bán",
            title: "Bán & Xuất hàng",
        },
        {
            data: ListMuaNhapHang,
            position: "bottom left",
            className: "popover-bottom-left-muanhaphang arrow-muanhaphang",
            title: "Mua & Nhập hàng",
            text: "Quản lý các model mua, nhập, trả hàng, công nợ",
        },
        {
            data: ListKhoSanXuat,
            // position: "",
            className: "popover-khosanxuat",
            title: "Kho & Sản xuất",
            text: "Quản lý các model kho, sản xuất, gia công, QC",
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
        {
            data: ListAdd,
            position: "bottom center",
            text: "Thêm mới",
            className: "",
            title: "+ Thêm",
        },
    ];
    const dataPstWH = useSelector((state) => state.trangthai);
    // Khai báo biến state
    const [currentDropdownIndex, setCurrentDropdownIndex] = useState(0);
    const [isLastDropdown, setIsLastDropdown] = useState(false);
    useEffect(() => {
        setIsLastDropdown(currentDropdownIndex === dropdowns.length - 1);
    }, [currentDropdownIndex, dropdowns.length]);
    const dispatch = useDispatch();
    useEffect(() => {
        if (dataPstWH) {
            // Ẩn phần tử hiện tại

            // Kiểm tra xem nó có phải là cuối cùng hay không
            if (isLastDropdown) {
                setTimeout(() => {
                    setCurrentDropdownIndex(0);
                    setIsLastDropdown(false);
                    dispatch({
                        type: "trangthai",
                        payload: false,
                    });
                }, 3000);
            } else {
                // Sau 3000ms, hiển thị phần tử tiếp theo
                const timer = setTimeout(() => {
                    setCurrentDropdownIndex(
                        (prevIndex) => (prevIndex + 1) % dropdowns.length
                    );
                }, 3000);

                return () => {
                    clearTimeout(timer);
                };
            }
            // const timer = setTimeout(() => {
            //   setCurrentDropdownIndex(
            //     (prevIndex) => (prevIndex + 1) % dropdowns.length
            //   );
            // }, 3000);

            // return () => {
            //   clearTimeout(timer);
            // };
        }
    }, [dataPstWH, isLastDropdown, dropdowns.length, currentDropdownIndex]);
    // useEffect(() => {
    //   if (dataPstWH) {
    //     body.style;
    //   }
    // }, [dataPstWH]);
    const currentDropdown = dropdowns[currentDropdownIndex];
    return (
        <header className="z-40 w-full bg-[#0f4f9e] fixed top-0 3xl:h-[74px] 2xl:h-16 xl:h-14 lg:h-12">
            <div className="3xl:mx-10 2xl:mx-10 mx-5 3xl:py-4 2xl:py-3.5 xl:py-2.5 py-1.5">
                <div className="flex justify-between items-center">
                    <div className="flex 3xl:space-x-6 2xl:space-x-4 xl:space-x-4 space-x-2 items-center">
                        <Link href="/">
                            <Image
                                alt=""
                                src="/logo.png"
                                width={100}
                                height={45}
                                quality={100}
                                className="3xl:w-[110px] 2xl:w-[90px] xl:w-[70px] w-[70px] h-auto object-contain"
                                loading="lazy"
                                crossOrigin="anonymous"
                                placeholder="blur"
                                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                            />
                        </Link>
                        {/* {dropdowns.map((dropdown, index) => (
              <Tooltip
                titleStyle={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "white",
                }}
                titleClassName="custom-title-class"
                trigger="manual"
                key={index}
                title={dropdown.text}
                open={dataPstWH && index === currentDropdownIndex}
                arrow={true}
                position="bottom"
                animation="scale"
                duration={200}
                hideOnClick={false}
                theme="light"
              >
                <Dropdown
                  data={dropdown.data}
                  position={dropdown.position}
                  className={dropdown.className}
                  onClick={() => dispatch({ type: "trangthai", payload: true })}
                >
                  {dropdown.title}
                </Dropdown>
              </Tooltip>
            ))} */}
                        {dropdowns.map((dropdown, index) => (
                            <React.Fragment key={index}>
                                <Tooltip
                                    titleClassName="custom-title-class"
                                    trigger="manual"
                                    html={
                                        <React.Fragment>
                                            <div className="  rounded-lg  w-auto h-auto  ">
                                                <div className="flex justify-center items-center  rounded-lg">
                                                    <ArrowUp
                                                        size="32"
                                                        color="green"
                                                        className="rotate-45 animate-pulse "
                                                    />
                                                    <h2 className="text-black font-semibold text-justify  py-2 px-3 ">
                                                        {dropdown.text}
                                                    </h2>
                                                </div>
                                            </div>
                                            {/* <div className=" mt-[20px]   bg-gray-100 shadow-2xl rounded-lg  w-auto h-auto min-h-[30px] ">
                        <div className="flex justify-center items-center shadow-2xl rounded-lg">
                          <ArrowUp
                            size="32"
                            color="green"
                            className="rotate-45 animate-pulse "
                          />
                          <h2 className="text-black font-semibold  py-2 px-3 max-w-[200px] ">
                            {dropdown.text}
                          </h2>
                        </div>
                      </div> */}
                                        </React.Fragment>
                                    }
                                    title={dropdown.text}
                                    open={
                                        dataPstWH &&
                                        index === currentDropdownIndex
                                    }
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
                                        // onClick={() =>
                                        //   dispatch({ type: "trangthai", payload: true })
                                        // }
                                    >
                                        {dropdown.title}
                                    </Dropdown>
                                </Tooltip>
                            </React.Fragment>
                        ))}

                        {/* <Dropdown
              data={ListDanhMuc}
              position={"bottom left"}
              className="popover-bottom-left arrow-danhmuc "
            >
              Danh mục
            </Dropdown>

            <Dropdown
              data={ListBanXuatHang}
              position={"bottom left"}
              className="popover-bottom-left arrow-banxuathang"
            >
              Bán & Xuất hàng
            </Dropdown>
            <Dropdown
              data={ListMuaNhapHang}
              position="bottom left"
              className="popover-bottom-left-muanhaphang arrow-muanhaphang"
            >
              Mua & Nhập hàng
            </Dropdown>
            <Dropdown data={ListKhoSanXuat} className="popover-khosanxuat">
              Kho & Sản xuất
            </Dropdown>
            <Dropdown data={ListBaoCao} className="">
              Báo cáo & Thống kê
            </Dropdown>
            <Dropdown data={ListKhac} className="popover-khac">
              Tiện ích
            </Dropdown>
            <Dropdown data={ListAdd} position={"bottom center"}>
              <div>+ Thêm</div>
            </Dropdown> */}
                        {/* <Dropdown data={ListKhoSanXuat} className="popover-khosanxuat">
              Kho & Sản xuất
            </Dropdown> */}
                    </div>
                    <div className="flex 3xl:space-x-5 2xl:space-x-4 xl:space-x-3 lg:space-x-2  items-center">
                        <a
                            href="#"
                            title="Thông báo"
                            className="hover:scale-105 transition 3xl:w-5 2xl:w-4 xl:w-3.5 lg:w-3 3xl:h-5 2xl:h-4 xl:h-3.5 lg:h-3  "
                        >
                            <Image
                                alt=""
                                src="/icon/header/tb.png"
                                width={18}
                                height={18}
                                quality={100}
                                className="object-contain"
                                loading="lazy"
                                crossOrigin="anonymous"
                                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                            />
                        </a>
                        <form className="flex items-center relative">
                            <div className="3xl:w-[18px] 2xl:w-[16px] xl:w-[14px] w-[14px] absolute left-3">
                                <Image
                                    alt=""
                                    src="/icon/header/timkiem.png"
                                    width={24}
                                    height={18}
                                    quality={100}
                                    className="w-auto h-auto object-contain"
                                    loading="lazy"
                                    crossOrigin="anonymous"
                                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                />
                            </div>
                            <input
                                className="3xl:w-64 2xl:w-60 xl:w-52 lg:w-44 3xl:h-10 2xl:h-9 xl:h-8 lg:h-7 3xl:placeholder:text-base 2xl:placeholder:text-[14px] xl:placeholder:text-[12px] lg:placeholder:text-[10px] placeholder:text-white/50 text-[#ffffff] relative bg-[#ffffff1a] hover:bg-[#ffffff25] focus:bg-[#ffffff25] outline-none pl-10 pr-5 py-2 rounded-md"
                                type="text"
                                placeholder="Tìm kiếm"
                            />
                        </form>
                        <Link
                            href="/settings"
                            title="Cài đặt"
                            className="3xl:scale-110 2xl:scale-95 xl:scale-90 lg:scale-75 transition"
                        >
                            <Image
                                alt=""
                                src="/icon/header/extent.png"
                                width={18}
                                height={18}
                                quality={100}
                                className="object-contain min-w-[18px]"
                                loading="lazy"
                                crossOrigin="anonymous"
                                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                            />
                        </Link>
                        {/* <a
              href="#"
              title="Thông báo"
              className="3xl:scale-110 2xl:scale-95 xl:scale-90 lg:scale-75 transition relative  "
            >
              <Image
                alt=""
                src="/icon/header/tb2.png"
                width={18}
                height={18}
                quality={100}
                className="object-contain min-w-[18px]"
                loading="lazy"
                crossOrigin="anonymous"
                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
              />
              <div className="3xl:text-[9px] 2xl:text-[9px] xl:text-[9px] text-[9px] bg-red-500 3xl:h-3.5 3xl:w-3.5 2xl:h-3.5 2xl:w-3.5 xl:h-3.5 xl:w-3.5 lg:h-3.5 lg:w-3.5 rounded-full absolute top-0 right-0 3xl:translate-x-1 3xl:-translate-y-1 2xl:translate-x-1 2xl:-translate-y-1 xl:translate-x-1 xl:-translate-y-1 translate-x-1 -translate-y-1 flex flex-col items-center justify-center text-white font-medium">
                2
              </div>
            </a> */}
                        <a
                            href="#"
                            title="Thông báo"
                            className="3xl:scale-100 2xl:scale-95 xl:scale-90 lg:scale-75 transition relative  "
                        >
                            <DropdownThongBao
                                data={ListThongBao}
                                className="popover-thongbao"
                                position={"bottom right"}
                            >
                                <Image
                                    alt=""
                                    src="/icon/header/tb2.png"
                                    width={18}
                                    height={18}
                                    quality={100}
                                    className="object-contain 3xl:scale-110 2xl:scale-95 xl:scale-90 lg:scale-75 transition"
                                    loading="lazy"
                                    crossOrigin="anonymous"
                                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                />
                                <div className="3xl:text-[9px] 2xl:text-[9px] xl:text-[9px] text-[9px] bg-red-500 3xl:h-3.5 3xl:w-3.5 2xl:h-3.5 2xl:w-3.5 xl:h-3.5 xl:w-3.5 lg:h-3.5 lg:w-3.5 rounded-full absolute top-0 right-0 3xl:translate-x-1 3xl:-translate-y-1 2xl:translate-x-1 2xl:-translate-y-1 xl:translate-x-1 xl:-translate-y-1 translate-x-1 -translate-y-1 flex flex-col items-center justify-center text-white font-medium">
                                    2
                                </div>
                            </DropdownThongBao>
                        </a>
                        <Dropdown
                            data={ListQuyTrinh}
                            className="popover-quytrinh"
                            position={"bottom right"}
                        >
                            <Image
                                alt=""
                                src="/icon/header/ques.png"
                                width={18}
                                height={18}
                                quality={100}
                                className="object-contain 3xl:scale-110 2xl:scale-95 xl:scale-90 lg:scale-75 transition"
                                loading="lazy"
                                crossOrigin="anonymous"
                                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                            />
                        </Dropdown>
                        <DropdownAvatar />
                    </div>
                </div>
            </div>
            <div className="px-10 py-0  pt-1 overflow-x-auto">
                <Expirred />
                <PopupModelTime />
            </div>
        </header>
    );
};

const DropdownAvatar = React.memo(() => {
    const auth = useSelector((state) => state.auth);

    const router = useRouter();
    const dispatch = useDispatch();

    const [onSending, sOnSending] = useState(false);

    const _ServerSending = () => {
        Axios(
            "POST",
            "/api_web/Api_Login/logout?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    dispatch({ type: "auth/update", payload: false });
                    localStorage.removeItem("tokenFMRP");
                    localStorage.removeItem("databaseappFMRP");
                    router.push("/");
                }
                sOnSending(false);
            }
        );
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
                        <div className="flex items-center self-center space-x-1">
                            {auth?.user_avatar !== null ? (
                                <Image
                                    alt=""
                                    src={auth?.user_avatar}
                                    width={35.5}
                                    height={35.5}
                                    quality={100}
                                    className="lg:min-w-[20px] object-cover rounded-full"
                                    loading="lazy"
                                    crossOrigin="anonymous"
                                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                />
                            ) : (
                                <Image
                                    alt=""
                                    src={"/avatar_null.png"}
                                    width={35.5}
                                    height={35.5}
                                    quality={100}
                                    className="object-cover rounded-full"
                                    loading="lazy"
                                    crossOrigin="anonymous"
                                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                />
                            )}
                            <Image
                                alt=""
                                src="/icon/header/dropdown.png"
                                width={10}
                                height={10}
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
                    <div className="bg-white rounded justify-between">
                        <div className="flex space-x-3 px-3 py-3.5 border-b border-[#F2F4F7]">
                            <div className="h-fit min-w-[40px] relative">
                                {auth?.user_avatar !== null ? (
                                    <Image
                                        alt=""
                                        src={auth?.user_avatar}
                                        width={40}
                                        height={40}
                                        quality={100}
                                        className="object-cover rounded-full"
                                        loading="lazy"
                                        crossOrigin="anonymous"
                                        blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                    />
                                ) : (
                                    <Image
                                        alt=""
                                        src={"/avatar_null.png"}
                                        width={35.5}
                                        height={35.5}
                                        quality={100}
                                        className="object-cover rounded-full"
                                        loading="lazy"
                                        crossOrigin="anonymous"
                                        blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                    />
                                )}
                                <div className="bg-green-500 w-2.5 h-2.5 rounded-full absolute bottom-0 right-1" />
                            </div>
                            <div>
                                <h5 className="font-semibold text-sm text-[#141522]">
                                    {auth?.user_full_name}
                                </h5>
                                <h6 className="text-[#9295A4] font-normal text-sm ">
                                    {auth?.user_email}
                                </h6>
                            </div>
                        </div>
                        <div className="">
                            <button className="w-full text-left px-4 py-2.5 hover:bg-[#F7F8F9] flex items-center space-x-2 outline-none">
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
                            <button className="w-full text-left px-4 py-2.5 hover:bg-[#F7F8F9] flex items-center space-x-2">
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
                            <button className="w-full text-left px-4 py-2.5 hover:bg-[#F7F8F9] flex items-center space-x-2">
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
                            </button>
                            <button className="w-full text-left px-4 py-2.5 hover:bg-[#F7F8F9] flex items-center space-x-2">
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
                            <div className="flex px-4 py-2.5 justify-between items-center">
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
                            </div>
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
