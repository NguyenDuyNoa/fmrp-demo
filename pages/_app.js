import { useSelector, Provider, useDispatch } from 'react-redux';

import React from 'react';
import Layout from "../components/layout"
import store from "/services/redux";

import "react-datepicker/dist/react-datepicker.css";
import '../styles/globals.scss'

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
//   const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
//   const [onChecking, sOnChecking] = useState(false)
//   const [error, sError] = useState(false)

//   const ServerFetching = () => {
//     sError(false)
//     Axios("GET", "/authentication", {}, (err, response) => {
//       if(!err){
//         var {status, info} = response.data;
//         if(status === 200){ // Đã đăng nhập
//           dispatch({type: "auth/update", payload: info})
//         }else{ // Chưa đăng nhập
//           dispatch({type: "auth/update", payload: false})
//         }
//       }
//       sOnChecking(false)
//     })
//   }

//   useEffect(() => {
//     onChecking && ServerFetching()
//  }, [onChecking])

//   useEffect(() => {
//     auth === null && sOnChecking(true)
//   }, [auth])

  // if(auth == null){
  //     return <LoadingPage/>
  // }

  if(auth === false){
    return <LoginPage/>
  }

  return <Layout><Component {...pageProps} /></Layout>
}

const LoginPage = () => {
  return(
    <div className="">
      <div
        className="bgc-image  
      "
      >
        <div className="style h-[100vh] overflow-hidden">
          <div className="flex justify-around  container pt-[45px] mx-auto  ">
            <div className="style__form ">
              <div className="form pt-[24px] px-[50px] ">
                <div className="text-center mb-9">
                  <h1 className="text-[#11315B] font-medium text-[32px]">
                    Đăng nhập
                  </h1>
                </div>
                <div className="flex style__h2 justify-between items-center gap-[16px]">
                  <div className="style__bg-h2">
                    <h2 className="px-[20px] py-2">Phiên bản chính thức</h2>
                  </div>
                  <div className="style__bg-h2">
                    <h2 className="px-[20px] py-2">Phiên bản Trải nghiệm</h2>
                  </div>
                </div>
                <form>
                  <div className="py-[14px] style__input">
                    <input
                      // onChange={(e) => setEmail(e.target.value)}

                      name="company_code"
                      type="text"
                      placeholder="Mã công ty"
                      className="w-full py-3 px-4"
                    />
                  </div>
                  <div className="style__input">
                    <input
                      // onChange={(e) => setTen(e.target.value)}
                      type="text"
                      placeholder="Tên truy cập"
                      className="w-full py-3 px-4"
                    />
                  </div>
                  <div className="py-[14px] style__input relative">
                    <input
                      type="password"
                      name="password"
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <input type="checkbox" />
                      <label className="font-normal text-sm text-[#344054]">
                        Ghi nhớ cho lần đăng nhập sau
                      </label>
                    </div>
                    <div className="">
                      <p className="text-[#3276FA] font-normal text-sm cursor-pointer">
                        Quên mật khẩu
                      </p>
                    </div>
                  </div>
                  <button className="text-[#FFFFFF] font-normal text-lg py-3 w-full bg-[#0F4F9E] mt-[18px]  style__button">
                    Đăng nhập
                  </button>
                </form>
                <h4 className="text-center text-[#667085] text-sm font-light py-[50px]">
                  FOSOSOFT © 2021
                </h4>
              </div>
              <div className="flex items-center justify-evenly mt-[55px]">
                <div className="">
                  <p className="text-[#344054] font-light text-sm cursor-pointer">
                    Cổng dịch vụ khách hàng
                  </p>
                </div>
                <div className="">
                  <p className="text-[#344054] font-light text-sm cursor-pointer">
                    User Pay
                  </p>
                </div>
                <div className="">
                  <p className="text-[#344054] font-light text-sm cursor-pointer">
                    FMRP Website
                  </p>
                </div>
                <div className="bg-[#c7dffb] cursor-pointer rounded-lg px-1 py-[15px] ">
                  {/* <Popup
                    trigger={
                      <img
                        src="../../image/login/more.png"
                        alt=""
                        className="w-full h-full object-cover cursor-pointer "
                      />
                    }
                    position="right bottom"
                    on={["hover"]}
                    arrow={false}
                  >
                    <div className="bg-[#FFFFFF] border-[#D0D5DD] border-solid border style__help ml-4">
                      <div className="">
                        <ul>
                          <li className="px-4 py-[10px] text-[#667085] font-normal text-sm hover:text-[#141522] hover:bg-[#F7F8F9] cursor-pointer ">
                            Tạo phím tắt trên màn hình
                          </li>
                          <li className="px-4 py-[10px] text-[#667085] font-normal text-sm hover:text-[#141522] hover:bg-[#F7F8F9] cursor-pointer">
                            Yêu cầu Tư vấn qua điện thoại
                          </li>
                          <li className="px-4 py-[10px] text-[#667085] font-normal text-sm hover:text-[#141522] hover:bg-[#F7F8F9] cursor-pointer">
                            Tối ưu hóa trình duyệt
                          </li>
                          <li className="px-4 py-[10px] text-[#667085] font-normal text-sm hover:text-[#141522] hover:bg-[#F7F8F9] cursor-pointer">
                            Báo cáo lỗi
                          </li>
                          <li className="px-4 py-[10px] text-[#667085] font-normal text-sm hover:text-[#141522] hover:bg-[#F7F8F9] cursor-pointer">
                            Điều khiển
                          </li>
                          <li className="px-4 py-[10px] text-[#667085] font-normal text-sm hover:text-[#141522] hover:bg-[#F7F8F9] cursor-pointer">
                            Liên hệ
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Popup> */}
                </div>
              </div>
            </div>
            <div className="destion">
              <div className="logo w-[195px] h-[70px]">
                <img
                  src="../../image/login/Logo.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="title">
                <h1 className="pt-[24px] text-[#344054] font-medium text-[32px]">
                  Trợ lý sản xuất
                </h1>
                <p className="text-[#667085] font-light text-[16px]">
                  Giải pháp phần mềm cho doanh nghiệp
                </p>
                <p className="text-[#667085] font-light text-[16px]">
                  {" "}
                  Hotline:{" "}
                  <span className="text-[#0F4F9E] font-normal">
                    0901.13.6968
                  </span>
                </p>
                <p className="text-[#667085] font-light text-[16px]">
                  Tổng đài:{" "}
                  <span className="text-[#0F4F9E] font-normal">
                    028.7776.8880
                  </span>{" "}
                  (Phím 1 - BP. Tư Vấn - Phím 2 - BP. Kỹ Thuật)
                </p>
                <div className="qrcode w-[140px] h-[140px] mt-[16px]">
                  <img
                    src="../../image/login/qr.png"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>{" "}
              </div>
            </div>
          </div>
          <div className="style__user">
            <img src="../../image/login/Illust.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Default
