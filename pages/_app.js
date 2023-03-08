import React, {useState, useEffect} from 'react';
import { useSelector, Provider, useDispatch } from 'react-redux';
import Head from 'next/head';
import Image from 'next/image';

import Layout from "../components/layout"
import store from "/services/redux";
import {_ServerInstance as Axios} from '/services/axios';

import 'sweetalert2/src/sweetalert2.scss'
import "react-datepicker/dist/react-datepicker.css";
import '../styles/globals.scss'

import Swal from 'sweetalert2'
import Popup from 'reactjs-popup';
import {More as IconMore} from 'iconsax-react'
import { Lexend_Deca } from "@next/font/google";
const deca = Lexend_Deca({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
})

const Default = (props) => {
  return(
    <Provider store={store}>
      <main className={deca.className}>
        <MainPage {...props}/>
      </main>
    </Provider>
  )
}

function MainPage({ Component, pageProps }) {
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);

  const [onChecking, sOnChecking] = useState(false)

  const ServerFetching = () => {
    Axios("GET", "/Api_Authentication/authentication?csrf_protection=true", {}, (err, response) => {
      if(err){
        dispatch({type: "auth/update", payload: false})
      }else{
        var isSuccess = response.data?.isSuccess;
        if(isSuccess){
          dispatch({type: "auth/update", payload: response.data?.info})
        }else{
          dispatch({type: "auth/update", payload: false})
        }
      }
      sOnChecking(false)
    })
  }

  useEffect(() => {
    onChecking && ServerFetching()
 }, [onChecking])

  useEffect(() => {
    auth === null && sOnChecking(true)
  }, [auth])

  if(auth == null){
    return <LoadingPage/>
  }

  if(auth === false){
    return <LoginPage/>
  }

  return <Layout><Component {...pageProps} /></Layout>
}

const LoginPage = () => {
  const dispatch = useDispatch();

  const [tab, sTab] = useState(0);
  const _HandleSelectTab = (e) => sTab(e);

  const [typePassword, sTypePassword] = useState(false);
  const _TogglePassword = () => sTypePassword(!typePassword)

  const [code, sCode] = useState("");
  const [name, sName] = useState("");
  const [password, sPassword] = useState("");
  const [onSending, sOnSending] = useState(false)

  const _HandleInputChange = (type, value) => {
    if(type === "code"){
      sCode(value.target?.value)
    }else if(type === "name"){
      sName(value.target?.value)
    }else if(type === "password"){
      sPassword(value.target?.value)
    }
  }
  const _ServerSending = () => {
    Axios("POST", "/Api_Login/loginMain?csrf_protection=true", {
      data: {
        company_code: code,
        user_name: name,
        password: password
      }
    }, (err, response) => {
      if(response !== null){
        var isSuccess = response.data?.isSuccess;
        if(isSuccess){
          dispatch({type: "auth/update", payload: response.data?.data})
          localStorage.setItem("tokenFMRP", response.data?.token)
          localStorage.setItem("databaseappFMRP", response.data?.database_app)
        }else{
          Swal.fire({
            title: "Lỗi",
            text: "Thông tin của bạn chưa đúng",
            icon: "error",
            background: "#ffffff",
            color: "#141522",
            showConfirmButton: false,
            timer: 1000,
            width: "400px"
          });
        }
      }else {
        console.log("Lỗi")
      }
      sOnSending(false)
    })
  }

  useEffect(() => {
    onSending && _ServerSending()
  }, [onSending])

  const _HandleSubmit = (e) => {
    e.preventDefault()
    if((name.length && code.length && password.length) === 0 ){
      Swal.fire({
        title: "Cảnh báo",
        text: "Vui lòng điền đầy đủ thông tin",
        icon: "warning",
        background: "#ffffff",
        color: "#141522",
        showConfirmButton: false,
        timer: 800,
        width: "400px"
      });
    }else{
        sOnSending(true)
    }
  }

  return(
    <React.Fragment>
      <Head>
        <title>Đăng nhập</title>
      </Head>
      <div className="bg-[#EEF1F8]">
        <div className="bg-[url('/Logo-BG.png')] relative bg-repeat-round h-screen w-screen flex flex-col justify-center items-center overflow-hidden">
          <div className='flex justify-center space-x-20 w-full z-10'>
            <div className='space-y-8'>
              <div className='bg-white px-16 pt-20 pb-12 rounded-lg space-y-10 w-[600px]'>
                <div className='space-y-3'>
                  <h1 className="text-[#11315B] font-medium text-3xl text-center">Đăng nhập</h1>
                  <div className='flex space-x-5 w-full'>
                    <button onClick={_HandleSelectTab.bind(this, 0)} className={`${tab === 0 ? "bg-[#E2F0FE] border-transparent text-[#11315B]" : "bg-white border-[#cccccc]"} px-5 py-3 rounded-md transition hover:scale-105 border w-full`}>Phiên Bản Chính Thức</button>
                    <button onClick={_HandleSelectTab.bind(this, 1)} className={`${tab === 1 ? "bg-[#E2F0FE] border-transparent text-[#11315B]" : "bg-white border-[#cccccc]"} px-5 py-3 rounded-md transition hover:scale-105 border w-full`}>Phiên Bản Trải nghiệm</button>
                  </div>
                </div>
                <div className='space-y-3'>
                  <input
                    type="text"
                    placeholder='Mã công ty'
                    value={code}
                    onChange={_HandleInputChange.bind(this, "code")}
                    className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-3 rounded-md w-full'
                  />
                  <input
                    type="text"
                    placeholder="Tên truy cập"
                    value={name}
                    onChange={_HandleInputChange.bind(this, "name")}
                    className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-3 rounded-md w-full'
                  />
                  <div className='relative flex flex-col justify-center'>
                    <input
                      type={typePassword ? "text" : "password"}
                      placeholder='Mật khẩu'
                      value={password}
                      onChange={_HandleInputChange.bind(this, "password")}
                      className='border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 py-3 pl-5 pr-12 rounded-md w-full'
                    />
                    <button onClick={_TogglePassword.bind(this)} className='absolute right-3'>
                      {typePassword ? 
                        <img alt="" src="/icon/EyeClosed.png" />
                        :
                        <img alt="" src="/icon/eye.png" />
                      }
                    </button>
                  </div>
                  <div className='flex w-full justify-between'>
                    <div className='flex items-center space-x-1.5'>
                      <input type="checkbox" id="saveAccount" />
                      <label htmlFor="saveAccount">Ghi nhớ cho lần đăng nhập sau</label>
                    </div>
                    <button className='text-[#3276FA] text-sm'>Quên mật khẩu</button>
                  </div>
                </div>
                <button onClick={_HandleSubmit.bind(this)} className="text-[#FFFFFF] font-normal text-lg py-3 w-full rounded-md bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] btn-animation hover:scale-105">Đăng nhập</button>
                <h4 className="text-center text-[#667085] text-sm font-light">FOSOSOFT © 2021</h4>
              </div>
              <div className='flex items-center space-x-6 justify-center'>
                <a href="#" className="text-[#344054] hover:text-[#0F4F9E] font-light text-sm">Cổng dịch vụ khách hàng</a>
                <a href="#" className="text-[#344054] hover:text-[#0F4F9E] font-light text-sm">User Pay</a>
                <a href="#" className="text-[#344054] hover:text-[#0F4F9E] font-light text-sm">FMRP Website</a>
                <Popup
                    trigger={<button className='text-[#344054] hover:text-[#0F4F9E]'><IconMore /></button>}
                    closeOnDocumentClick
                    arrow={false}
                    position="right bottom"
                    on={["hover"]}
                    className={`dropdown-edit `}
                >
                    <div className="w-auto">
                        <div className="bg-white p-0.5 rounded-t w-60">
                            <button className='text-sm text-[#667085] hover:text-black font-semibold hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Tạo phím tắt trên màn hình</button>
                            <button className='text-sm text-[#667085] hover:text-black font-semibold hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Yêu cầu Tư vấn qua điện thoại</button>
                            <button className='text-sm text-[#667085] hover:text-black font-semibold hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Tối ưu hóa trình duyệt</button>
                            <button className='text-sm text-[#667085] hover:text-black font-semibold hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Báo cáo lỗi</button>
                            <button className='text-sm text-[#667085] hover:text-black font-semibold hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Điều khiển</button>
                            <button className='text-sm text-[#667085] hover:text-black font-semibold hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Liên hệ</button>
                        </div>
                    </div>
                </Popup>
              </div>
            </div>
            <div className='space-y-9'>
              <Image alt="" src="/logo_1.png" width={200} height={70} quality={100} className="object-contain" loading="lazy" crossOrigin="anonymous" placeholder="blur" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
              <div className='space-y-6'>
                <h1 className="text-[#344054] font-medium text-xl">Trợ lý sản xuất</h1>
                <div className='space-y-1'>
                  <p className="text-[#667085] font-light text-[16px]">Giải pháp phần mềm cho doanh nghiệp</p>
                  <p className="text-[#667085] font-light text-[16px]">
                    Hotline:
                    <span className="text-[#0F4F9E] font-normal ml-1">0901.13.6968</span>
                  </p>
                  <p className="text-[#667085] font-light text-[16px]">
                    Tổng đài:
                    <span className="text-[#0F4F9E] font-normal mx-1">028.7776.8880</span>
                    (Phím 1 - BP. Tư Vấn - Phím 2 - BP. Kỹ Thuật)
                  </p>
                </div>
              </div>
              <Image alt="" src="/qr.png" width={120} height={120} quality={100} className="object-contain w-auto h-auto" loading="lazy" crossOrigin="anonymous" placeholder="blur" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
            </div>
          </div>
          <div className='absolute bottom-0 right-0'>
            <Image src="/Illust.png" alt="" width={500} height={500} quality={100} className="object-contain w-[500px] h-auto" loading="lazy" crossOrigin="anonymous" placeholder="blur" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

const LoadingPage = () => {
  return(
    <React.Fragment>
      <Head>
        <title>Đang kiểm tra dữ liệu</title>
      </Head>
      <div className='h-screen w-screen flex flex-col justify-center items-center space-y-3 relative'>
        <Image alt="" src="/logo_1.png" width={200} height={70} quality={100} className="object-contain" loading="lazy" crossOrigin="anonymous" placeholder="blur" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
        <h1>Đang kiểm tra dữ liệu vui lòng chờ trong giây lát</h1>
        <svg class="animate-spin h-40 w-40 opacity-50 absolute z-[-1] text-blue-600 fill-blue-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </React.Fragment>
  )
}

export default Default
