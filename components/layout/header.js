import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import Dropdown from '../UI/dropdown';
import { _ServerInstance as Axios } from '/services/axios';

import Popup from 'reactjs-popup';
import { ArrowDown2 as IconDown } from "iconsax-react"

const Header = () => {

    const ListDanhMuc = [
        {
            title: "Khách hàng",
            sub: [
                {
                    title: "Khách hàng",
                    img: "/icon/header/danhmuc/kh.png",
                    items: [
                        { name: "Danh sách khách hàng", link: "/clients/clients" },
                        { name: "Danh sách liên hệ", link: "/clients/contact" },
                        { name: "Trạng thái khách hàng", link: "/clients/statusClient" },
                        { name: "Nhóm khách hàng", link: "/clients/groups" }
                    ]
                }
            ]
        }, {
            title: "Nhà cung cấp",
            sub: [
                {
                    title: "Nhà cung cấp",
                    img: "/icon/header/danhmuc/ncc.png",
                    items: [
                        { name: "Danh sách NCC", link: "/suppliers/supplier" },
                        { name: "Danh sách liên hệ NCC", link: "/suppliers/contacts" },
                        { name: "Mặt hàng chủ đạo theo NCC" },
                        { name: "Nhóm nhà cung cấp", link: "/suppliers/groups" },
                    ]
                },
            ]
        }, {
            title: "NVL, thành phẩm",
            sub: [
                {
                    title: "Nguyên vật liệu",
                    img: "/icon/header/danhmuc/nvl.png",
                    items: [
                        { name: "Nhóm nguyên vật liệu", link: "/items/category" },
                        { name: "Danh sách nguyên vật liệu", link: "/items" }
                    ]
                },
                {
                    title: "thành phẩm",
                    img: "/icon/header/danhmuc/tp.png",
                    items: [
                        { name: "Nhóm thành phẩm", link: "/products/category" },
                        { name: "Danh sách thành phẩm", link: "/products" }
                    ]
                }
            ]
        }, {
            title: "Nhân sự",
            sub: [
                {
                    title: "Phòng ban",
                    img: "/icon/header/danhmuc/nv.png",
                    items: [
                        { name: "Danh sách người dùng", link: "/personnel/staff" },
                        { name: "Phòng ban", link: "/personnel/departments" },
                        { name: "Chức vụ", link: "/personnel/roles" }
                    ]
                }
            ]
        }
    ]

    const ListBanXuatHang = [
        {
            title: "Bán hàng",
            sub: [
                {
                    // title: "Báo giá",
                    items: [
                        { name: "Báo giá", link: "/sales_export_product/priceQuote" },
                        { name: "Đơn hàng bán", link: "/sales_export_product/salesOrder" },
                        { name: "Trả lại hàng bán", link: "/sales_export_product/returnSales" },
                    ]
                }
            ]
        }, {
            title: "Giao hàng",
            sub: [
                {
                    // title: "Phiếu giao hàng",
                    // link: "#"
                    items: [
                        { name: "Phiếu giao hàng", link: "/sales_export_product/deliveryReceipt" }
                    ]
                }
            ]
        }, {
            title: "Công nợ bán",
            sub: [
                {
                    title: "Công nợ bán",
                    img: "/icon/header/banxuat/cnb.png",
                    items: [
                        { name: "Hóa đơn bán hàng" },
                        { name: "Phiếu thu bán hàng" },
                        { name: "Công nợ khách hàng" },
                        { name: "Phiếu thu khác" }
                    ]
                }
            ]
        }
    ]

    const ListMuaNhapHang = [
        {
            title: "Mua hàng",
            sub: [
                {
                    title: "Mua hàng",
                    img: "/icon/header/muanhap/mua.png",
                    items: [
                        { name: "Yêu cầu mua hàng", link: '/purchase_order/purchases' },
                        { name: "Đơn đặt hàng", link: '/purchase_order/order' },
                        { name: "Phiếu dịch vụ", link: '/purchase_order/serviceVoucher' }
                    ]
                }
            ]
        }, {
            title: "Nhập hàng & trả hàng",
            sub: [
                {
                    title: "Nhập hàng & trả hàng",
                    img: "/icon/header/kho/Vector-9.png",
                    items: [
                        { name: "Nhập hàng", link: '/purchase_order/import' },
                        { name: "Trả hàng", link:'/purchase_order/returns' }
                    ]
                }
            ]
        }, {
            title: "Công nợ mua",
            sub: [
                {
                    title: "Công nợ mua",
                    img: "/icon/header/muanhap/cnm.png",
                    items: [
                        { name: "Phiếu chi", link: '/purchase_order/payment' },
                        { name: "Công nợ nhà cung cấp" },
                    ]
                }
            ]
        }
    ]

    const ListKhoSanXuat = [
        {
            title: "Kho hàng",
            sub: [
                {
                    title: "Kho hàng",
                    img: "/icon/header/kho/kho.png",
                    items: [
                        { name: "Kho", link: "/warehouses/warehouse" },
                        { name: "Vị trí kho", link: "/warehouses/location" }
                    ]
                }, {
                    title: "Cảnh báo tồn kho",
                    img: "/icon/header/kho/canhbao.png",
                    link: "#"
                }, {
                    title: "Chuyển kho",
                    img: "/icon/header/kho/chuyenkho.png",
                    link: "#"
                }, {
                    title: "Xuất kho sản xuất",
                    img: "/icon/header/kho/xuatkho.png",
                    link: "#"
                }, {
                    title: "Nhập kho thành phẩm",
                    img: "/icon/header/kho/nhapkho.png",
                    link: "#"
                }, {
                    title: "Thu hồi nguyên vật liệu",
                    img: "/icon/header/kho/thuhoi.png",
                    link: "#"
                }, {
                    title: "Xuất kho khác",
                    img: "/icon/header/kho/xuatkho.png",
                    link: "#"
                }, {
                    title: "Kiểm kê kho",
                    img: "/icon/header/kho/kk.png",
                    link: "/inventory"
                }

            ]
        }, {
            title: "Sản xuất",
            sub: [
                {
                    title: "Kế hoạch nội bộ",
                    img: "/icon/header/kho/kehoach.png",
                    link: "#"
                }, {
                    title: "Kế hoạch sản xuất",
                    img: "/icon/header/kho/kehoach.png",
                    link: "#"
                }, {
                    title: "Kế hoạch NVL",
                    img: "/icon/header/kho/kehoach.png",
                    link: "#"
                }, {
                    title: "Điều độ sản xuất",
                    img: "/icon/header/kho/dieudo.png",
                    link: "#"
                }, {
                    title: "Sản xuất",
                    img: "/icon/header/kho/sx.png",
                    items: [
                        { name: "Lệnh sản xuất tổng" },
                        { name: "Lệnh sản xuất chi tiết" }
                    ]
                }, {
                    title: "Cảnh báo tồn kho",
                    img: "/icon/header/kho/canhbao.png",
                    link: "#"
                }, {
                    title: "Lịch sản xuất",
                    img: "/icon/header/kho/lich.png",
                    link: "#"
                }, {
                    title: "Năng suất sản lượng",
                    img: "/icon/header/kho/nssl.png",
                    link: "#"
                },
            ]
        }, {
            title: "Xuất gia công",
            sub: [
                {
                    title: "Xuất gia công",
                    img: "/icon/header/khac/xgc.png",
                    items: [
                        { name: "Xuất gia công" },
                        { name: "Nhập gia công" }
                    ]
                }
            ]
        }, {
            title: "QC",
            sub: [
                {
                    title: "Kiểm tra chất lượng",
                    img: "/icon/header/kho/kt.png",
                    link: "#"
                }, {
                    title: "Danh mục lỗi",
                    img: "/icon/header/kho/dml.png",
                    link: "#"
                }, {
                    title: "Điều độ sản xuất",
                    img: "/icon/header/kho/dieudo.png",
                    link: "#"
                }, {
                    title: "Chi tiết lỗi",
                    img: "/icon/header/kho/ctl.png",
                    link: "#"
                }
            ]
        }
    ]

    const ListKhac = [
        {
            title: "Tiện ích",
            sub: [
                {
                    title: "Tiện ích",
                    img: "/icon/header/khac/ti.png",
                    items: [
                        { name: "Yêu cầu khiếu nại" },
                        { name: "Lịch" }
                    ]
                }
            ]
        }, {
            title: "Công việc",
            sub: [
                {
                    title: "Công việc",
                    img: "/icon/header/khac/cv.png",
                    items: [
                        { name: "Danh sách công việc" },
                        { name: "Danh sách kanban" },
                        { name: "Lịch công việc" },
                        { name: "Sơ đồ gant" }
                    ]
                }
            ]
        }
    ]

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
                        { name: "Báo cáo lợi nhuận" }
                    ]
                }
            ]
        }
    ]

    const ListAdd = [
        {
            sub: [
                {
                    items: [
                        { name: "Tạo khách hàng" },
                        { name: "Tạo nhà cung cấp" },
                        { name: "Tạo yêu cầu mua hàng" },
                        { name: "Tạo đơn mua hàng" }
                    ]
                }
            ]
        }
    ]

    const ListQuyTrinh = [
        {
            title: "Quy trình",
            sub: [
                {
                    title: "Quy trình",
                    img: "/icon/header/quytrinh/process.svg",
                    items: [
                        { name: "Quy trình sử dụng phần mềm FMRP", link: "/process" },
                        { name: "Quy trình quản lý sản xuất", link: "/process_manufacture" },
                        { name: "Quy trình bán hàng", link: "/process_products" },
                        { name: "Quy trình mua hàng - nhập kho", link: "/process_order" }
                    ]
                }
            ]
        }
    ]

    return (
        <header className="z-40 w-full bg-[#0f4f9e] fixed top-0 3xl:h-[74px] 2xl:h-16 xl:h-14 lg:h-12">
            <div className="3xl:mx-10 2xl:mx-10 mx-5 3xl:py-4 2xl:py-3.5 xl:py-2.5 py-1.5">
                <div className="flex justify-between items-center">
                    <div className='flex 3xl:space-x-6 2xl:space-x-4 xl:space-x-4 space-x-2 items-center'>
                        <Link href="/">
                            <Image alt="" src="/logo.png" width={100} height={45} quality={100} className="3xl:w-[110px] 2xl:w-[90px] xl:w-[70px] w-[70px] h-auto object-contain" loading="lazy" crossOrigin="anonymous" placeholder="blur" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                        </Link>
                        <Dropdown data={ListDanhMuc} position={"bottom left"} className="popover-bottom-left arrow-danhmuc ">Danh mục</Dropdown>
                        <Dropdown data={ListBanXuatHang} position={"bottom left"} className="popover-bottom-left arrow-banxuathang">Bán & Xuất hàng</Dropdown>
                        <Dropdown data={ListMuaNhapHang} position={"bottom left"} className="popover-bottom-left-muanhaphang arrow-muanhaphang">Mua & Nhập hàng</Dropdown>
                        <Dropdown data={ListKhoSanXuat} className="popover-khosanxuat">Kho & Sản xuất</Dropdown>
                        <Dropdown data={ListBaoCao} className="">Báo cáo & Thống kê</Dropdown>
                        <Dropdown data={ListKhac} className="popover-khac">Tiện ích</Dropdown>
                        <Dropdown data={ListAdd} position={"bottom center"}>
                            <div>+ Thêm</div>
                        </Dropdown>
                    </div>
                    <div className='flex 3xl:space-x-5 2xl:space-x-4 xl:space-x-3 lg:space-x-2  items-center'>
                        <a href="#" title='Thông báo' className='hover:scale-105 transition 3xl:w-5 2xl:w-4 xl:w-3.5 lg:w-3 3xl:h-5 2xl:h-4 xl:h-3.5 lg:h-3  '>
                            <Image alt="" src="/icon/header/tb.png" width={18} height={18} quality={100} className="object-contain" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                        </a>
                        <form className="flex items-center relative">
                            <div className='3xl:w-[18px] 2xl:w-[16px] xl:w-[14px] w-[14px] absolute left-3'>
                                <Image alt="" src="/icon/header/timkiem.png" width={24} height={18} quality={100} className="w-auto h-auto object-contain" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                            </div>
                            <input
                                className="3xl:w-64 2xl:w-60 xl:w-52 lg:w-44 3xl:h-10 2xl:h-9 xl:h-8 lg:h-7 3xl:placeholder:text-base 2xl:placeholder:text-[14px] xl:placeholder:text-[12px] lg:placeholder:text-[10px] placeholder:text-white/50 text-[#ffffff] relative bg-[#ffffff1a] hover:bg-[#ffffff25] focus:bg-[#ffffff25] outline-none pl-10 pr-5 py-2 rounded-md"
                                type="text"
                                placeholder="Tìm kiếm"
                            />
                        </form>
                        <Link href="/settings" title='Cài đặt' className='3xl:scale-110 2xl:scale-95 xl:scale-90 lg:scale-75 transition'>
                            <Image alt="" src="/icon/header/extent.png" width={18} height={18} quality={100} className="object-contain min-w-[18px]" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                        </Link>
                        <a href="#" title='Thông báo' className='3xl:scale-110 2xl:scale-95 xl:scale-90 lg:scale-75 transition relative  '>
                            <Image alt="" src="/icon/header/tb2.png" width={18} height={18} quality={100} className="object-contain min-w-[18px]" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                            <div className='3xl:text-[9px] 2xl:text-[9px] xl:text-[9px] text-[9px] bg-red-500 3xl:h-3.5 3xl:w-3.5 2xl:h-3.5 2xl:w-3.5 xl:h-3.5 xl:w-3.5 lg:h-3.5 lg:w-3.5 rounded-full absolute top-0 right-0 3xl:translate-x-1 3xl:-translate-y-1 2xl:translate-x-1 2xl:-translate-y-1 xl:translate-x-1 xl:-translate-y-1 translate-x-1 -translate-y-1 flex flex-col items-center justify-center text-white font-medium'>2</div>
                        </a>
                        <Dropdown data={ListQuyTrinh} className="popover-quytrinh" position={"bottom right"}>
                            <Image alt="" src="/icon/header/ques.png" width={18} height={18} quality={100} className="object-contain 3xl:scale-110 2xl:scale-95 xl:scale-90 lg:scale-75 transition" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                        </Dropdown>
                        <DropdownAvatar />
                    </div>
                </div>
            </div>
        </header>
    );
};

const DropdownAvatar = React.memo(() => {
    const auth = useSelector(state => state.auth);

    const router = useRouter()
    const dispatch = useDispatch();

    const [onSending, sOnSending] = useState(false)

    const _ServerSending = () => {
        Axios("POST", "/api_web/Api_Login/logout?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                dispatch({ type: "auth/update", payload: false });
                localStorage.removeItem("tokenFMRP");
                localStorage.removeItem("databaseappFMRP");
                router.push("/")
            }
            sOnSending(false)
        })
    }

    useEffect(() => {
        onSending && _ServerSending()
    }, [onSending])

    const _HandleLogout = () => {
        sOnSending(true)
    };

    ///languages
    const data = useSelector(state => state.availableLang)
    const defaultLang = useSelector(state => state.lang)

    const [lang, sLang] = useState(defaultLang);
    const _HandleChangeLang = (e) => sLang(e.target?.value)

    useEffect(() => {
        dispatch({ type: "lang/update", payload: lang })
        localStorage.setItem('LanguagesFMRP', lang);
    }, [lang]);

    return (
        <React.Fragment>
            <Popup
                trigger={
                    <button className={`hover:drop-shadow-[0_0_5px_#eabd7a99]`} >
                        <div className='flex items-center self-center space-x-1'>
                            {auth?.user_avatar !== null ?
                                <Image alt="" src={auth?.user_avatar} width={35.5} height={35.5} quality={100} className="lg:min-w-[20px] object-cover rounded-full" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                                :
                                <Image alt="" src={"/avatar_null.png"} width={35.5} height={35.5} quality={100} className="object-cover rounded-full" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />

                            }
                            <Image alt="" src="/icon/header/dropdown.png" width={10} height={10} quality={100} className="object-cover" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                        </div>
                    </button>
                }
                closeOnDocumentClick
                // arrow={props.position}
                on={['hover']}
                position="bottom right"
                className={`popover-edit `}
            >
                <div className="w-[300px]">
                    <div className="bg-white rounded justify-between">
                        <div className='flex space-x-3 px-3 py-3.5 border-b border-[#F2F4F7]'>
                            <div className='h-fit min-w-[40px] relative'>
                                {auth?.user_avatar !== null ?
                                    <Image alt="" src={auth?.user_avatar} width={40} height={40} quality={100} className="object-cover rounded-full" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                                    :
                                    <Image alt="" src={"/avatar_null.png"} width={35.5} height={35.5} quality={100} className="object-cover rounded-full" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                                }
                                <div className='bg-green-500 w-2.5 h-2.5 rounded-full absolute bottom-0 right-1' />
                            </div>
                            <div>
                                <h5 className='font-semibold text-sm text-[#141522]'>{auth?.user_full_name}</h5>
                                <h6 className="text-[#9295A4] font-normal text-sm ">{auth?.user_email}</h6>
                            </div>
                        </div>
                        <div className=''>
                            <button className='w-full text-left px-4 py-2.5 hover:bg-[#F7F8F9] flex items-center space-x-2 outline-none'>
                                <Image alt="" src="/icon/header/avatar/user.png" width={20} height={20} quality={100} className="object-cover" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                                <span>Thông tin tài khoản</span>
                            </button>
                            <button className='w-full text-left px-4 py-2.5 hover:bg-[#F7F8F9] flex items-center space-x-2'>
                                <Image alt="" src="/icon/header/avatar/pas.png" width={20} height={20} quality={100} className="object-cover" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                                <span>Đổi mật khẩu</span>
                            </button>
                            <button className='w-full text-left px-4 py-2.5 hover:bg-[#F7F8F9] flex items-center space-x-2'>
                                <Image alt="" src="/icon/header/avatar/inbox.png" width={20} height={20} quality={100} className="object-cover" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                                <span>Góp ý</span>
                            </button>
                            <button className='w-full text-left px-4 py-2.5 hover:bg-[#F7F8F9] flex items-center space-x-2'>
                                <Image alt="" src="/icon/header/avatar/usermore.png" width={20} height={20} quality={100} className="object-cover" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                                <span>Giới thiệu - Tích điểm</span>
                            </button>
                            <div className='flex px-4 py-2.5 justify-between items-center'>
                                <div className='flex items-center space-x-2'>
                                    <Image alt="" src="/icon/header/avatar/lang.png" width={20} height={20} quality={100} className="object-cover" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                                    <h6>Ngôn ngữ</h6>
                                </div>
                                <div className='relative flex items-center bg-[#F7F8F9]'>
                                    <select onChange={_HandleChangeLang.bind(this)} value={lang} className="z-[2] text-[#141522] appearance-none inline-block rounded leading-tight pl-4 pr-8 py-2.5 text-sm w-fit outline-none bg-transparent">
                                        {data.map((e, i) => <option key={i} value={e.code}>{e.label}</option>)}
                                    </select>
                                    <div className='absolute right-2 z-[1]'><IconDown size={15} /></div>
                                </div>
                            </div>
                            <button onClick={_HandleLogout.bind(this)} className='w-full text-left px-4 py-2.5 hover:bg-[#F7F8F9] flex items-center space-x-2'>
                                <Image alt="" src="/icon/header/avatar/out.png" width={20} height={20} quality={100} className="object-cover" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Popup>
        </React.Fragment>
    );
})

export default Header;
