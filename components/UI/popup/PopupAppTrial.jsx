import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import Image from "next/image";

import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import { _ServerInstance as Axios } from "/services/axios";
import { Verify } from "iconsax-react";
import moment from "moment";

const PopupAppTrial = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const dataAuthentication = useSelector((state) => state.auth);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleCloseModal = () => {
        setOpenModal(false);
    };
    useEffect(() => {
        if (dataAuthentication.active_popup) {
            setOpenModal(false);
        } else {
            setOpenModal(true);
        }
    }, [dataAuthentication.active_popup]);

    const handleClickButton = () => {
        Axios("GET", "/api_web/Api_Authentication/check_active_popup?csrf_protection=true", {}, (err, response) => {
            if (err) {
                // dispatch({ type: "auth/update", payload: false });
                console.log("err", err);
            } else {
                const { isSuccess, info } = response?.data;
                if (isSuccess) {
                    setOpenModal(false);
                } else {
                    // dispatch({ type: "auth/update", payload: false });
                }
                console.log("response", response);
            }
        });
    };

    if (!isMounted) {
        return null;
    }

    return (
        <Popup
            modal
            open={openModal}
            lockScroll
            closeOnEscape
            closeOnDocumentClick={false}
            // onClose={() => setOpenModal(false)}
            // defaultOpen={true}
        >
            <div className='3xl:w-[1000px] 3xl:max-w-[1100px] 3xl:h-[600px] w-[800px] max-w-[900px] h-[500px] grid grid-cols-2 bg-white rounded-xl relative'>
                <MdClose onClick={handleCloseModal} className='absolute top-4 right-4 text-2xl cursor-pointer text-[#000000] hover:text-[#000000]/80 hover:scale-105 duration-300 transition-colors' />
                <div className="col-span-1 w-full 3xl:h-[600px] h-[550px] bg-[url('/popup/background.png')] bg-cover rounded-tl-xl rounded-bl-xl">
                    <div className='w-full h-full bg-[#0A4AC6]/30 rounded-tl-xl rounded-bl-xl' />
                </div>
                <div className="col-span-1 w-full h-full bg-[url('/popup/background2.png')] bg-cover bg-white rounded-tr-xl rounded-br-xl 3xl:px-12 3xl:py-8 px-10 py-5 flex flex-col items-center justify-center gap-4">
                    <div className="flex flex-col justify-between gap-5 ">
                        <div className=" flex flex-col 3xl:gap-6 gap-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="3xl:text-3xl text-2xl font-bold text-[#000000] text-center">
                                    Khởi đầu chuyển đổi số ngay với phần mềm FMRP !
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div>
                                    <Verify size="18" color="green" className="animate-bounce" />
                                </div>
                                <div className="col-span-9 pb-2  text-gray-700 font-semibold text-[14px] text-ju">
                                    <span>Chào mừng</span>

                                    <span className="text-blue-500 uppercase mx-1">
                                        {dataAuthentication?.user_full_name}
                                    </span>

                                    <span>
                                        đến với FMRP! Hãy dành thời gian để khám phá các tính năng hữu ích mà FMRP mang
                                        lại nhé.
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div>
                                    <Verify size="18" color="green" className="animate-bounce" />
                                </div>
                                <h2 className=" py-1 text-gray-700 font-semibold text-[14px]">
                                    FMRP mong rằng bạn sẽ tìm được giải pháp hiệu quả cho quá trình quản lý sản xuất của doanh nghiệp bạn.
                                </h2>
                            </div>

                            <div className="flex items-center gap-2">
                                <div>
                                    <Verify size="18" color="green" className="animate-bounce" />
                                </div>
                                <h2 className=" py-1 text-gray-700 font-semibold text-[14px] text-ju">
                                    <span>Thời gian dùng thử: Bắt đầu từ ngày</span>

                                    <span className="text-blue-500 mx-1">
                                        {moment(dataAuthentication?.start_date).format("DD/MM/YYYY")}
                                    </span>

                                    <span>đến ngày</span>

                                    <span className="text-blue-500 mx-1">
                                        {moment(dataAuthentication?.expiration_date).format("DD/MM/YYYY")}
                                    </span>

                                    <span>và kết thúc sau</span>

                                    <span className="text-red-500 mx-1">{dataAuthentication?.day_expiration}</span>

                                    <span>ngày.</span>
                                </h2>
                            </div>

                            <div className="flex items-center gap-2">
                                <div>
                                    <Verify size="18" color="green" className="animate-bounce" />
                                </div>
                                <h2 className=" py-1 text-gray-700 font-semibold text-[14px] flex flex-col ">
                                    <div className="flex items-center gap-1">
                                        <span>Mã công ty:</span>
                                        <span className="capitalize text-blue-500">
                                            {dataAuthentication?.code_company}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span>Tên truy cập:</span>
                                        <span className="capitalize text-blue-500">
                                            {dataAuthentication?.user_email}
                                        </span>
                                    </div>
                                </h2>
                            </div>

                            <div className="flex items-center justify-center mt-2">
                                <button
                                    onClick={handleClickButton}
                                    type="button"
                                    className="px-4 py-2 text-white bg-[#0F4F9E] hover:bg-[#0F4F9E]/80 duration-300 transition-all ease-in-out rounded-lg focus:outline-none"
                                >
                                    Bắt đầu trải nghiệm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Popup>
    );
};

export default PopupAppTrial;
