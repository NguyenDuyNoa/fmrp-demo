import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import Dropdown from '../UI/dropdown';
import {_ServerInstance as Axios} from '/services/axios';

import Popup from 'reactjs-popup';
import {ArrowDown2 as IconDown} from "iconsax-react"
  
const Header = () => {
    
    const ListDanhMuc = [
        {
            title: "Khách hàng",
            sub: [
                {
                    title: "Khách hàng",
                    img: "/icon/header/danhmuc/kh.png",
                    items: [
                        {name: "Danh sách khách hàng",link:"/clients/clients"},
                        {name: "Danh sách liên hệ"},
                        {name: "Trạng thái khách hàng", link:"/clients/statusClient"},
                        {name: "Nhóm khách hàng", link: "/clients/groups"}
                    ]
                },
                {
                    title: "Chăm sóc",
                    img: "/icon/header/danhmuc/cs.png",
                    items: [
                        {name: "Sinh nhật hôm nay"},
                        {name: "Phiếu chăm sóc"}
                    ]
                },
            ]
        },{
            title: "Nhà cung cấp",
            sub: [
                {
                    title: "Nhà cung cấp",
                    img: "/icon/header/danhmuc/ncc.png",
                    items: [
                        {name: "Nhóm nhà cung cấp"},
                        {name: "Danh sách NCC"},
                        {name: "Danh sách liên hệ NCC"},
                        {name: "Mặt hàng chủ đạo theo NCC"}
                    ]
                },
                {
                    title: "Đánh giá NCC",
                    img: "/icon/header/danhmuc/ncc.png",
                    items: [
                        {name: "Nhóm nhà cung cấp"},
                        {name: "Danh sách NCC"},
                        {name: "Mặt hàng chủ đạo theo NCC"}
                    ]
                },
            ]
        },{
            title: "NVL, thành phẩm, vật tư",
            sub: [
                {
                    title: "Nguyên vật liệu",
                    img: "/icon/header/danhmuc/nvl.png",
                    items: [
                        {name: "Nhóm nguyên vật liệu", link: "/items/category"},
                        {name: "Danh sách nguyên vật liệu", link: "/items"}
                    ]
                },
                {
                    title: "thành phẩm",
                    img: "/icon/header/danhmuc/tp.png",
                    items: [
                        {name: "Nhóm thành phẩm"},
                        {name: "Danh sách thành phẩm"}
                    ]
                },{
                    title: "vật tư",
                    img: "/icon/header/danhmuc/vat.png",
                    items: [
                        {name: "Nhóm nguyên vật liệu"},
                        {name: "Danh sách nguyên vật liệu"}
                    ]
                }
            ]
        },{
            title: "Nhân sự",
            sub: [
                {
                    title: "Phòng ban",
                    img: "/icon/header/danhmuc/nv.png",
                    items: [
                        {name: "Danh sách nhân viên"},
                        {name: "Phòng ban"},
                        {name: "Chức vụ"},
                        {name: "Lương sản lượng"}
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
                    title: "Báo giá",
                    img: "/icon/header/banxuat/bh.png",
                    items: [
                        {name: "Đơn hàng bán"},
                        {name: "Trả lại hàng bán"},
                        {name: "Hợp đồng bán"}
                    ]
                }
            ]
        },{
            title: "Kế hoạch nội bộ",
            sub: [
                {
                    title: "Kế hoạch nội bộ",
                    img: "/icon/header/banxuat/kh.png",
                    link: "#"
                }
            ]
        },{
            title: "Giao hàng",
            sub: [
                {
                    title: "Giao hàng",
                    img: "/icon/header/banxuat/giao.png",
                    link: "#"
                }
            ]
        },{
            title: "Công nợ bán",
            sub: [
                {
                    title: "Công nợ bán",
                    img: "/icon/header/banxuat/cnb.png",
                    items: [
                        {name: "Hóa đơn bán hàng"},
                        {name: "Phiếu thu bán hàng"},
                        {name: "Công nợ khách hàng"},
                        {name: "Phiếu thu khách hàng"}
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
                        {name: "Yêu cầu mua hàng"},
                        {name: "Đơn đặt hàng", link: '/purchase_order'},
                        {name: "Hợp đồng bán"}
                    ]
                }
            ]
        },{
            title: "Nhập hàng & trả hàng",
            sub: [
                {
                    title: "Nhập hàng & trả hàng",
                    img: "/icon/header/muanhap/nhap.png",
                    items: [
                        {name: "Nhập hàng"},
                        {name: "Trả hàng"}
                    ]
                }
            ]
        },{
            title: "Dịch vụ khác",
            sub: [
                {
                    title: "Dịch vụ khác",
                    img: "/icon/header/muanhap/dvk.png",
                    items: [
                        {name: "Phiếu dịch vụ"}
                    ]
                }
            ]
        },{
            title: "Công nợ mua",
            sub: [
                {
                    title: "Công nợ mua",
                    img: "/icon/header/muanhap/cnm.png",
                    items: [
                        {name: "Hóa đơn mua hàng"},
                        {name: "Phiếu chi mua hàng"},
                        {name: "Công nợ nhà nước cung cấp"},
                        {name: "Phiếu chi khác"}
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
                        {name: "Nhóm kho hàng"},
                        {name: "Kho"},
                        {name: "Vị trí kho"}
                    ]
                },{
                    title: "Cảnh báo tồn kho",
                    img: "/icon/header/kho/canhbao.png",
                    link: "#"
                },{
                    title: "Chuyển kho",
                    img: "/icon/header/kho/chuyenkho.png",
                    link: "#"
                },{
                    title: "Xuất kho sản xuất",
                    img: "/icon/header/kho/xuatkho.png",
                    link: "#"
                },{
                    title: "Nhập kho thành phẩm",
                    img: "/icon/header/kho/nhapkho.png",
                    link: "#"
                },{
                    title: "Thu hồi nguyên vật liệu",
                    img: "/icon/header/kho/thuhoi.png",
                    link: "#"
                },{
                    title: "Xuất kho khác",
                    img: "/icon/header/kho/xuatkho.png",
                    link: "#"
                },

            ]
        },{
            title: "Kiểm kê",
            sub: [
                {
                    title: "Kiểm kê kho",
                    img: "/icon/header/kho/kk.png",
                    link: "#"
                },{
                    title: "Điều chỉnh kho",
                    img: "/icon/header/kho/kho.png",
                    link: "#"
                }
            ]
        },{
            title: "Sản xuất",
            sub: [
                {
                    title: "Kế hoạch sản xuất",
                    img: "/icon/header/kho/kehoach.png",
                    link: "#"
                },{
                    title: "Kế hoạch NVL",
                    img: "/icon/header/kho/kehoach.png",
                    link: "#"
                },{
                    title: "Điều độ sản xuất",
                    img: "/icon/header/kho/dieudo.png",
                    link: "#"
                },{
                    title: "Sản xuất",
                    img: "/icon/header/kho/sx.png",
                    items: [
                        {name: "Lệnh sản xuất tổng"},
                        {name: "Lệnh sản xuất chi tiết"}
                    ]
                },{
                    title: "Cảnh báo tồn kho",
                    img: "/icon/header/kho/canhbao.png",
                    link: "#"
                },{
                    title: "Lịch sản xuất",
                    img: "/icon/header/kho/lich.png",
                    link: "#"
                },{
                    title: "Năng suất sản lượng",
                    img: "/icon/header/kho/nssl.png",
                    link: "#"
                },
            ]
        },{
            title: "QC",
            sub: [
                {
                    title: "Kiểm tra chất lượng",
                    img: "/icon/header/kho/kt.png",
                    link: "#"
                },{
                    title: "Danh mục lỗi",
                    img: "/icon/header/kho/dml.png",
                    link: "#"
                },{
                    title: "Điều độ sản xuất",
                    img: "/icon/header/kho/dieudo.png",
                    link: "#"
                },{
                    title: "Chi tiết lỗi",
                    img: "/icon/header/kho/ctl.png",
                    link: "#"
                }
            ]
        }
    ]

    const ListKhac = [
        {
            title: "Xuất gia công",
            sub: [
                {
                    title: "Xuất gia công",
                    img: "/icon/header/khac/xgc.png",
                    items: [
                        {name: "Xuất gia công"},
                        {name: "Nhập gia công"}
                    ]
                }
            ]
        },{
            title: "Tiện ích",
            sub: [
                {
                    title: "Tiện ích",
                    img: "/icon/header/khac/ti.png",
                    items: [
                        {name: "Yêu cầu khiếu nại"},
                        {name: "Lịch"}
                    ]
                }
            ]
        },{
            title: "Công việc",
            sub: [
                {
                    title: "Công việc",
                    img: "/icon/header/khac/cv.png",
                    items: [
                        {name: "Danh sách công việc"},
                        {name: "Danh sách kanban"},
                        {name: "Lịch công việc"},
                        {name: "Sơ đồ gant"}
                    ]
                }
            ]
        },{
            title: "Báo cáo",
            sub: [
                {
                    title: "Báo cáo",
                    img: "/icon/header/khac/bc.png",
                    items: [
                        {name: "Báo cáo QC"},
                        {name: "Báo cáo bán hàng"},
                        {name: "Báo cáo mua hàng"},
                        {name: "Công nợ phải thu"},
                        {name: "Tồn quỷ"},
                        {name: "Tồn kho"},
                        {name: "Quản lý sản xuất"},
                        {name: "Báo cáo lợi nhuận"}
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
                        {name: "Tạo khách hàng"},
                        {name: "Tạo nhà cung cấp"},
                        {name: "Tạo yêu cầu mua hàng"},
                        {name: "Tạo đơn mua hàng"}
                    ]
                }
            ]
        }
    ]
  
    return (
      <header className="z-[999] w-full bg-[#0f4f9e] fixed top-0">
        <div className="mx-10 py-4">
          <div className="flex justify-between items-center">
            <div className='flex space-x-7 items-center'>
                <Link href="/">
                    <Image src="/logo.png" width={100} height={45} quality={100} className="object-contain" loading="lazy" crossOrigin="anonymous" placeholder="blur" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                </Link>
                <Dropdown data={ListDanhMuc} position={"bottom left"} className="popover-bottom-left arrow-danhmuc">Danh mục</Dropdown>
                <Dropdown data={ListBanXuatHang} position={"bottom left"} className="popover-bottom-left arrow-banxuathang">Bán & Xuất hàng</Dropdown>
                <Dropdown data={ListMuaNhapHang} position={"bottom left"} className="popover-bottom-left-muanhaphang arrow-muanhaphang">Mua & Nhập hàng</Dropdown>
                <Dropdown data={ListKhoSanXuat} className="popover-khosanxuat">Kho & Sản xuất</Dropdown>
                <Dropdown data={ListKhac} className="popover-khac">Khác</Dropdown>
                <Dropdown data={ListAdd} position={"bottom center"}>
                    <div>+ Thêm</div>
                </Dropdown>
            </div>
            <div className='flex space-x-5 items-center'>
                <a href="#" title='Thông báo' className='hover:scale-105 transition'>
                    <Image src="/icon/header/tb.png" width={18} height={18} quality={100} className="object-contain" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                </a>
                <form className="flex items-center relative">
                    <div className='w-[18px] absolute left-3'>
                        <Image src="/icon/header/timkiem.png" width={24} height={18} quality={100} className="object-contain" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                    </div>
                    <input
                        className="placeholder:text-white/50 text-[#ffffff] relative bg-[#ffffff1a] hover:bg-[#ffffff25] focus:bg-[#ffffff25] outline-none pl-10 pr-5 py-2 rounded-md"
                        type="text"
                        placeholder="Tìm kiếm"
                    />
                </form>
                <Link href="/settings" title='Cài đặt' className='hover:scale-105 transition'>
                    <Image src="/icon/header/extent.png" width={18} height={18} quality={100} className="object-contain" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                </Link>
                <a href="#" title='Thông báo' className='hover:scale-105 transition relative'>
                    <Image src="/icon/header/tb2.png" width={18} height={18} quality={100} className="object-contain" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                    <div className='text-[10px] bg-red-500 h-4 w-4 rounded-full absolute -top-[7px] -right-[7px] flex flex-col items-center justify-center text-white font-medium'>2</div>
                </a>
                <a href="#" title='Trợ giúp' className='hover:scale-105 transition'>
                    <Image src="/icon/header/ques.png" width={18} height={18} quality={100} className="object-contain" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                </a>
                <DropdownAvatar />
            </div>
          </div>
        </div>
      </header>
    );
  };

const DropdownAvatar = React.memo(() => {
    const router = useRouter()
    const dispatch = useDispatch();

    const [onSending, sOnSending] = useState(false)

    const _ServerSending = () => {
        Axios("POST", "/api_web/Api_Login/logout?csrf_protection=true", {}, (err, response) => {
            if(!err){
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
    const data = useSelector(state=> state.availableLang)
    const defaultLang = useSelector(state=> state.lang)

    const [lang, sLang] = useState(defaultLang);
    const _HandleChangeLang = (e) => sLang(e.target?.value)

    useEffect(() => {
        dispatch({type: "lang/update", payload: lang})
        localStorage.setItem('LanguagesFMRP', lang);
    }, [lang]);

    return (
        <React.Fragment>
            <Popup
                trigger={
                    <button className={`hover:drop-shadow-[0_0_5px_#eabd7a99]`} >
                        <div className='flex items-center self-center space-x-1'>
                            <Image alt="" src="/avt.png" width={35.5} height={35.5} quality={100} className="object-cover" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
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
                                <Image alt="" src="/avt.png" width={40} height={40} quality={100} className="object-cover" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                                <div className='bg-green-500 w-2.5 h-2.5 rounded-full absolute bottom-0 right-1' />
                            </div>
                            <div>
                                <h5 className='font-semibold text-sm text-[#141522]'>Công Ty TNHH Giải pháp phần mềm FOSO</h5>
                                <h6 className="text-[#9295A4] font-normal text-sm ">info@fososoft.com</h6>
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
  